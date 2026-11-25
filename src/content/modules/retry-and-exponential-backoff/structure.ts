import type { Beat, SceneLayout } from "@/lib/scene-spec";
import { badge, send, status, timed, wait, work, type TimedBeat } from "../beats";
import type { LearningModule } from "../types";

/**
 * Retry and Exponential Backoff, trying again without making it worse: scene layout, steps and
 * scenarios. Source of truth for the content: docs/modules/retry-and-exponential-backoff.md
 * (approved 2026-11-25). The text lives in ./text (server only).
 *
 * Time is compressed: a wait of one real second plays in `SCALE` seconds. The badges show the
 * (illustrative) real values. Jitter uses fixed "random" waits, so every replay is the same.
 */

const SHOPPERS = ["shopper-a", "shopper-b", "shopper-c"] as const;
type Shopper = (typeof SHOPPERS)[number];

const layout: SceneLayout = {
  components: [
    {
      id: "shopper-a",
      kind: "client",
      label: "Shopper A",
      role: "Client",
      position: [-7, 0, -4],
    },
    { id: "shopper-b", kind: "mobile", label: "Shopper B", role: "Client", position: [-7, 0, 0] },
    { id: "shopper-c", kind: "mobile", label: "Shopper C", role: "Client", position: [-7, 0, 4] },
    {
      id: "payments",
      kind: "service",
      label: "Payments",
      role: "Backend service",
      position: [0, 0, 0],
      // Above, Shopper A's wire runs through its label and badge.
      labelPlacement: "below",
    },
    {
      id: "payments-db",
      kind: "database",
      label: "Payments DB",
      role: "Database",
      // Behind Payments (screen right), so its wire stays clear of Payments' label below.
      position: [4.5, 0, -4.5],
    },
  ],
  connections: [
    ...SHOPPERS.map((shopper) => ({
      id: `${shopper}-payments`,
      from: shopper,
      to: "payments",
    })),
    { id: "payments-to-db", from: "payments", to: "payments-db" },
  ],
};

const ALL = layout.components.map((component) => component.id);
const DB = "payments-to-db";

/** Travel time of a packet, one way: shopper ↔ Payments, and Payments ↔ its database. */
const TRAVEL = 0.55;
const DB_TRAVEL = 0.3;
/** Screen seconds per real second of waiting. */
const SCALE = 0.6;
const seconds = (real: number) => real * SCALE;

const wire = (shopper: Shopper) => `${shopper}-payments`;
/** "a", "b" or "c": message ids are per shopper (each pays for its own order). */
const tag = (shopper: Shopper) => shopper.slice(-1);

/** The backoff before attempts 2, 3 and 4 (seconds): base 1 s, doubling. */
const BACKOFF = [1, 2, 4] as const;
/** Step 5's full-jitter waits (ms), fixed so replays match: before attempt 2, then attempt 3. */
const JITTER: Readonly<Record<Shopper, readonly [number, number]>> = {
  "shopper-a": [400, 1300],
  "shopper-b": [900, 500],
  "shopper-c": [700, 1800],
};

// ----- Sequential building blocks (one shopper at a time) -------------------------------------

/** A shopper pays and Payments refuses (it is restarting, or down). */
function refused(shopper: Shopper, tone: "warning" | "error" = "warning"): Beat[] {
  return [
    send(wire(shopper), "request", { duration: TRAVEL, message: `pay-${tag(shopper)}` }),
    work("payments", 0.35, { tone }),
    send(wire(shopper), "error", { back: true, duration: TRAVEL, message: "unavailable" }),
  ];
}

/** Payments writes a charge to its database and gets the row back. */
function charge(message: string, reply: string): Beat[] {
  return [
    send(DB, "request", { duration: DB_TRAVEL, message }),
    work("payments-db", 0.3),
    send(DB, "response", { back: true, duration: DB_TRAVEL, message: reply }),
  ];
}

/** A shopper pays and it goes through: Payments, its database, and the answer back. */
function paid(shopper: Shopper): Beat[] {
  const x = tag(shopper);
  return [
    send(wire(shopper), "request", { duration: TRAVEL, message: `pay-${x}` }),
    work("payments", 0.3),
    ...charge(`charge-${x}`, `charged-${x}`),
    send(wire(shopper), "response", { back: true, duration: TRAVEL, message: `created-${x}` }),
  ];
}

// ----- Parallel building blocks (for `timed`: packets with next 0, and statuses) ---------------

/** A refused attempt starting at `at`; the shopper shows `after` when the error arrives. */
function refusedAt(shopper: Shopper, at: number, after?: Beat): TimedBeat[] {
  const events: TimedBeat[] = [
    {
      at,
      beat: send(wire(shopper), "request", {
        duration: TRAVEL,
        next: 0,
        message: `pay-${tag(shopper)}`,
      }),
    },
    {
      at: at + TRAVEL,
      beat: send(wire(shopper), "error", {
        back: true,
        duration: TRAVEL,
        next: 0,
        message: "unavailable",
      }),
    },
  ];
  if (after) events.push({ at: at + 2 * TRAVEL, beat: after });
  return events;
}

/** A successful attempt starting at `at`: the charge, then "paid on attempt n". */
function paidAt(shopper: Shopper, at: number, attempt?: number): TimedBeat[] {
  const x = tag(shopper);
  const packet = (connection: string, flow: "request" | "response", message: string) =>
    send(connection, flow, {
      back: flow === "response",
      duration: connection === DB ? DB_TRAVEL : TRAVEL,
      next: 0,
      message,
    });
  const done = at + 2 * TRAVEL + 2 * DB_TRAVEL;
  return [
    { at, beat: packet(wire(shopper), "request", `pay-${x}`) },
    { at: at + TRAVEL, beat: packet(DB, "request", `charge-${x}`) },
    { at: at + TRAVEL + DB_TRAVEL, beat: packet(DB, "response", `charged-${x}`) },
    { at: at + TRAVEL + 2 * DB_TRAVEL, beat: packet(wire(shopper), "response", `created-${x}`) },
    {
      at: done,
      beat: status(shopper, "info", attempt ? badge("paid-on", attempt) : badge("paid")),
    },
  ];
}

const retryBadge = (attempt: 2 | 3 | 4) => badge(`retry-${attempt}`);
const restarting = { tone: "warning", badge: badge("restarting") } as const;

// ----- Steps that need a little arithmetic ---------------------------------------------------

/** Step 3: every failure is retried at once, so Payments' load climbs and it stays down. */
function storm(): Beat[] {
  const rounds = 4;
  const round = 2 * TRAVEL + 0.15;
  const load = [10, 20, 30, 30];
  return timed(
    Array.from({ length: rounds }, (_, r) => [
      ...SHOPPERS.flatMap((shopper, i) =>
        refusedAt(shopper, r * round + i * 0.08, status(shopper, "error", badge("no-wait", r + 2))),
      ),
      {
        at: r * round + TRAVEL,
        beat: status("payments", r === 0 ? "warning" : "error", badge("load", load[r])),
      },
    ]).flat(),
  );
}

/** Step 4: waits of 1, 2 and 4 s, the same for everyone, so retries arrive together. */
function backoff(): Beat[] {
  const events: TimedBeat[] = [];
  let start = 0;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    if (attempt === 4) {
      // Payments has finished restarting just before the fourth attempts.
      events.push({ at: start - 0.2, beat: status("payments", "info", badge("ready")) });
      SHOPPERS.forEach((shopper, i) => events.push(...paidAt(shopper, start + i * 0.12, 4)));
      break;
    }
    const next = (attempt + 1) as 2 | 3 | 4;
    SHOPPERS.forEach((shopper) =>
      events.push(...refusedAt(shopper, start, status(shopper, "warning", retryBadge(next)))),
    );
    if (attempt > 1) {
      events.push({ at: start + TRAVEL, beat: status("payments", "error", badge("together")) });
    }
    start += 2 * TRAVEL + seconds(BACKOFF[attempt - 1]!);
  }
  return timed(events);
}

/** Step 5: each shopper waits its own (fixed) random part of the backoff: they drift apart. */
function jitter(): Beat[] {
  const events: TimedBeat[] = [];
  let recovered = Number.POSITIVE_INFINITY;
  SHOPPERS.forEach((shopper) => {
    const [first, second] = JITTER[shopper];
    events.push(...refusedAt(shopper, 0, status(shopper, "warning", badge("wait-ms", first))));
    const retry = 2 * TRAVEL + seconds(first / 1000);
    events.push(...refusedAt(shopper, retry, status(shopper, "warning", badge("wait-ms", second))));
    const third = retry + 2 * TRAVEL + seconds(second / 1000);
    recovered = Math.min(recovered, third);
    events.push(...paidAt(shopper, third, 3));
  });
  const firstRetry = 2 * TRAVEL + seconds(JITTER["shopper-a"][0] / 1000) + TRAVEL;
  events.push({ at: firstRetry, beat: status("payments", "warning", badge("one-at-a-time")) });
  events.push({ at: recovered, beat: status("payments", "info", badge("one-at-a-time")) });
  return timed(events);
}

/** Step 6: Payments stays down; Shopper A tries four times, then stops. */
function giveUp(): Beat[] {
  return [
    ...refused("shopper-a", "error"),
    ...BACKOFF.flatMap((real, index) => [
      status("shopper-a", "warning", retryBadge((index + 2) as 2 | 3 | 4)),
      wait(seconds(real)),
      ...refused("shopper-a", "error"),
    ]),
    status("shopper-a", "error", badge("gave-up")),
    wait(0.8),
  ];
}

/**
 * Retries multiply: each of Shopper A's four attempts makes Payments try the database
 * `dbTries` times; the database's badge counts every query.
 */
function layers(dbTries: number): Beat[] {
  const beats: Beat[] = [];
  let queries = 0;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    beats.push(
      send(wire("shopper-a"), "request", { duration: TRAVEL, message: "pay-a" }),
      work("payments", 0.2, { tone: "warning" }),
    );
    for (let tryIndex = 0; tryIndex < dbTries; tryIndex += 1) {
      queries += 1;
      beats.push(
        send(DB, "request", { duration: 0.2, message: "charge-a" }),
        send(DB, "error", { back: true, duration: 0.2, message: "db-timeout" }),
        status("payments-db", "error", badge("queries", queries)),
      );
    }
    beats.push(
      send(wire("shopper-a"), "error", { back: true, duration: TRAVEL, message: "unavailable" }),
    );
    if (attempt < 4) {
      beats.push(
        status("shopper-a", "warning", retryBadge((attempt + 1) as 2 | 3 | 4)),
        wait(0.25),
      );
    }
  }
  beats.push(status("shopper-a", "error", badge("gave-up")), wait(0.8));
  return beats;
}

/** Steps 7 and 8: a payment whose answer is lost on the way back, so the app times out. */
function lostAnswer(request: string, chargeMessage: string, reply: string): Beat[] {
  return [
    send(wire("shopper-a"), "request", { duration: TRAVEL, message: request }),
    work("payments", 0.3),
    ...charge(chargeMessage, reply),
    status("payments-db", "info", badge("charged-once")),
    send(wire("shopper-a"), "response", {
      back: true,
      lost: true,
      duration: TRAVEL,
      message: "lost-response",
    }),
    wait(0.4),
    status("shopper-a", "warning", badge("timed-out")),
    wait(seconds(1)),
  ];
}

export const retryAndExponentialBackoffModule: LearningModule = {
  id: "retry-and-exponential-backoff",
  layout,
  chapters: [{ id: "blips" }, { id: "not-worse" }, { id: "safe-to-repeat" }],
  steps: [
    // ----- Chapter 1: Things fail for a moment ---------------------------------------------
    {
      id: "blip",
      chapterId: "blips",
      scene: {
        focus: ["shopper-a", "payments"],
        frame: ALL,
        initial: { status: { payments: restarting } },
        beats: [
          ...refused("shopper-a"),
          status("shopper-a", "error", badge("failed", 503)),
          wait(0.6),
          status("payments", "info", badge("ready")),
          wait(0.8),
        ],
      },
    },
    {
      id: "try-again",
      chapterId: "blips",
      scene: {
        focus: ["shopper-a", "payments", "payments-db"],
        frame: ALL,
        initial: {
          status: {
            "shopper-a": { tone: "error", badge: badge("failed", 503) },
            payments: { tone: "info", badge: badge("ready") },
          },
        },
        beats: [
          status("shopper-a", "warning", retryBadge(2)),
          wait(seconds(1)),
          ...paid("shopper-a"),
          status("shopper-a", "info", badge("paid-on", 2)),
          wait(0.8),
        ],
      },
    },

    // ----- Chapter 2: Retrying without making it worse -------------------------------------
    {
      id: "storm",
      chapterId: "not-worse",
      scene: {
        focus: [...SHOPPERS, "payments"],
        frame: ALL,
        initial: { status: { payments: restarting } },
        beats: [...storm(), wait(0.8)],
      },
    },
    {
      id: "backoff",
      chapterId: "not-worse",
      scene: {
        focus: [...SHOPPERS, "payments", "payments-db"],
        frame: ALL,
        initial: { status: { payments: restarting } },
        beats: [...backoff(), wait(0.8)],
      },
    },
    {
      id: "jitter",
      chapterId: "not-worse",
      scene: {
        focus: [...SHOPPERS, "payments", "payments-db"],
        frame: ALL,
        initial: { status: { payments: restarting } },
        beats: [...jitter(), wait(0.8)],
      },
    },
    {
      id: "give-up",
      chapterId: "not-worse",
      scene: {
        focus: ["shopper-a", "payments"],
        frame: ALL,
        initial: { status: { payments: { tone: "error", badge: badge("deploy-failed") } } },
        beats: giveUp(),
      },
    },

    // ----- Chapter 3: Is it safe to repeat? ------------------------------------------------
    {
      id: "double-charge",
      chapterId: "safe-to-repeat",
      scene: {
        focus: ["shopper-a", "payments", "payments-db"],
        frame: ALL,
        beats: [
          ...lostAnswer("pay-a", "charge-a", "charged-a"),
          send(wire("shopper-a"), "request", { duration: TRAVEL, message: "pay-a" }),
          work("payments", 0.3),
          ...charge("charge-again", "charged-again"),
          status("payments-db", "error", badge("charged-twice")),
          send(wire("shopper-a"), "response", {
            back: true,
            duration: TRAVEL,
            message: "created-again",
          }),
          status("shopper-a", "info", badge("paid")),
          wait(0.8),
        ],
      },
    },
    {
      id: "idempotency-key",
      chapterId: "safe-to-repeat",
      scene: {
        focus: ["shopper-a", "payments", "payments-db"],
        frame: ALL,
        beats: [
          ...lostAnswer("keyed-request", "store-key", "key-stored"),
          send(wire("shopper-a"), "request", { duration: TRAVEL, message: "keyed-retry" }),
          work("payments", 0.3),
          ...charge("key-lookup", "key-found"),
          status("payments", "info", badge("replayed")),
          send(wire("shopper-a"), "response", {
            back: true,
            duration: TRAVEL,
            message: "replayed",
          }),
          status("shopper-a", "info", badge("paid")),
          wait(0.8),
        ],
      },
    },
  ],
  scenarios: [
    {
      id: "server-says-when",
      branchesFromStepId: "backoff",
      steps: [
        {
          id: "server-hint",
          scene: {
            focus: [...SHOPPERS, "payments"],
            frame: ALL,
            initial: { status: { payments: restarting } },
            beats: [
              ...timed(
                SHOPPERS.flatMap((shopper) => [
                  {
                    at: 0,
                    beat: send(wire(shopper), "request", {
                      duration: TRAVEL,
                      next: 0,
                      message: `pay-${tag(shopper)}`,
                    }),
                  },
                  {
                    at: TRAVEL,
                    beat: send(wire(shopper), "error", {
                      back: true,
                      duration: TRAVEL,
                      next: 0,
                      message: "retry-after",
                    }),
                  },
                  { at: 2 * TRAVEL, beat: status(shopper, "warning", badge("server-wait")) },
                ]),
              ),
              wait(0.8),
            ],
          },
        },
        {
          id: "on-time",
          scene: {
            focus: [...SHOPPERS, "payments", "payments-db"],
            frame: ALL,
            initial: {
              status: {
                payments: restarting,
                ...Object.fromEntries(
                  SHOPPERS.map((shopper) => [
                    shopper,
                    { tone: "warning", badge: badge("server-wait") } as const,
                  ]),
                ),
              },
            },
            beats: [
              wait(seconds(5) - 0.6),
              status("payments", "info", badge("ready")),
              wait(0.6),
              // Each honours Retry-After, plus a little jitter of its own.
              ...timed(SHOPPERS.flatMap((shopper, i) => paidAt(shopper, i * 0.2))),
              wait(0.8),
            ],
          },
        },
      ],
    },
    {
      id: "retries-multiply",
      branchesFromStepId: "give-up",
      steps: [
        {
          id: "two-layers",
          scene: {
            focus: ["shopper-a", "payments", "payments-db"],
            frame: ALL,
            initial: { status: { "payments-db": { tone: "error", badge: badge("overloaded") } } },
            beats: layers(4),
          },
        },
        {
          id: "one-layer",
          scene: {
            focus: ["shopper-a", "payments", "payments-db"],
            frame: ALL,
            initial: {
              status: {
                "payments-db": { tone: "error", badge: badge("overloaded") },
                payments: { tone: "info", badge: badge("fails-fast") },
              },
            },
            beats: layers(1),
          },
        },
      ],
    },
  ],
};
