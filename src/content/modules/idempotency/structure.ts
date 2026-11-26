import type { Beat, SceneLayout } from "@/lib/scene-spec";
import { badge, send, status, timed, wait, work, type TimedBeat } from "../beats";
import type { LearningModule } from "../types";

/**
 * Idempotency, many attempts, one effect: scene layout, steps and scenarios. Source of truth
 * for the content: docs/modules/idempotency.md (approved 2026-11-26). The text lives in ./text
 * (server only). Badges show the (illustrative) real values; playback compresses time.
 */

const layout: SceneLayout = {
  components: [
    {
      id: "shopper-a",
      kind: "client",
      label: "Shopper A",
      role: "Client",
      position: [-7, 0, 0],
    },
    {
      id: "payments",
      kind: "service",
      label: "Payments",
      role: "Backend service",
      position: [0, 0, 0],
      // Above, the wire to the Payments DB behind it would cross its label and badge.
      labelPlacement: "below",
    },
    {
      id: "payments-db",
      kind: "database",
      label: "Payments DB",
      role: "Database",
      position: [0, 0, -4.5],
    },
    {
      id: "card-processor",
      kind: "service",
      label: "Card processor",
      role: "External service",
      position: [6.5, 0, 0],
    },
  ],
  connections: [
    { id: "shopper-payments", from: "shopper-a", to: "payments" },
    { id: "payments-db", from: "payments", to: "payments-db" },
    { id: "payments-processor", from: "payments", to: "card-processor" },
  ],
};

const ALL = layout.components.map((component) => component.id);
const SHOPPER = "shopper-payments";
const DB = "payments-db";
const PROCESSOR = "payments-processor";

/** Travel times, one way: shopper ↔ Payments, Payments ↔ DB, Payments ↔ Card processor. */
const TRAVEL = 0.55;
const DB_TRAVEL = 0.3;
const PROCESSOR_TRAVEL = 0.45;

// ----- Sequential building blocks --------------------------------------------------------------

/** Shopper A sends a request and Payments looks at it. */
const ask = (message: string): Beat[] => [
  send(SHOPPER, "request", { duration: TRAVEL, message }),
  work("payments", 0.25),
];

/** Payments answers Shopper A. */
const answer = (message: string, flow: "response" | "error" = "response", lost = false): Beat =>
  send(SHOPPER, flow, { back: true, duration: TRAVEL, message, lost });

/** A round trip to the Payments DB. */
const db = (request: string, reply: string, flow: "response" | "error" = "response"): Beat[] => [
  send(DB, "request", { duration: DB_TRAVEL, message: request }),
  work("payments-db", 0.25),
  send(DB, flow, { back: true, duration: DB_TRAVEL, message: reply }),
];

/** A round trip to the Card processor. */
const processor = (request: string, reply: string): Beat[] => [
  send(PROCESSOR, "request", { duration: PROCESSOR_TRAVEL, message: request }),
  work("card-processor", 0.3),
  send(PROCESSOR, "response", { back: true, duration: PROCESSOR_TRAVEL, message: reply }),
];

/** A payment without a key: Payments charges the card and records it. */
const payWithoutKey = (charges: number, reply: string): Beat[] => [
  ...ask("pay-no-key"),
  ...processor("charge-card", "card-charged"),
  ...db("insert-payment", "payment-saved"),
  charges === 1
    ? status("payments-db", "info", badge("charged-once"))
    : status("payments-db", "error", badge("charged-twice")),
  answer(reply),
];

/** A keyed payment the first time: key "in progress", the charge, then key and answer saved. */
const keyedFirstTime = (charge: string, chargeReply: string, processorBadge: string): Beat[] => [
  ...ask("keyed-request"),
  ...db("insert-key", "key-inserted"),
  status("payments-db", "info", badge("in-progress")),
  ...processor(charge, chargeReply),
  status("card-processor", "info", badge(processorBadge)),
  ...db("save-done", "saved-done"),
];

const paid = status("shopper-a", "info", badge("paid"));

// ----- Parallel building blocks (for `timed`) --------------------------------------------------

/** A packet that does not hold up the beats after it. */
const packet = (connection: string, flow: "request" | "response" | "error", message: string) =>
  send(connection, flow, {
    back: flow !== "request",
    next: 0,
    message,
    duration: connection === SHOPPER ? TRAVEL : connection === DB ? DB_TRAVEL : PROCESSOR_TRAVEL,
  });

/**
 * Step 2: one payment without a key, starting at `at`. Payments waits `delay` before charging
 * (it is slow); the database badge counts the charge; the answer may be lost on the way back.
 */
function unkeyedAt(
  at: number,
  { charges, lost = false, delay = 0 }: { charges: number; lost?: boolean; delay?: number },
): { events: TimedBeat[]; end: number } {
  const charge = at + TRAVEL + delay;
  const saved = charge + 2 * PROCESSOR_TRAVEL + 2 * DB_TRAVEL;
  const events: TimedBeat[] = [
    { at, beat: packet(SHOPPER, "request", "pay-no-key") },
    { at: charge, beat: packet(PROCESSOR, "request", "charge-card") },
    { at: charge + PROCESSOR_TRAVEL, beat: packet(PROCESSOR, "response", "card-charged") },
    { at: charge + 2 * PROCESSOR_TRAVEL, beat: packet(DB, "request", "insert-payment") },
    {
      at: charge + 2 * PROCESSOR_TRAVEL + DB_TRAVEL,
      beat: packet(DB, "response", "payment-saved"),
    },
    {
      at: saved,
      beat:
        charges === 1
          ? status("payments-db", "info", badge("charged-once"))
          : status("payments-db", "error", badge("charges-one-order", charges)),
    },
    {
      at: saved,
      beat: send(SHOPPER, "response", {
        back: true,
        next: 0,
        duration: TRAVEL,
        lost,
        message: lost ? "lost-response" : "created",
      }),
    },
  ];
  return { events, end: saved + TRAVEL };
}

/**
 * Step 2: a double click whose two answers are lost, a retry that times out because Payments is
 * slow, and a second retry: four requests, four charges, one order.
 */
function duplicates(): Beat[] {
  const first = unkeyedAt(0, { charges: 1, lost: true });
  const second = unkeyedAt(0.15, { charges: 2, lost: true });
  const retry = second.end + 0.6;
  const arrives = retry + TRAVEL;
  const slow = unkeyedAt(retry, { charges: 3, delay: 1.5 });
  const timedOut = arrives + 1;
  const last = unkeyedAt(timedOut + 0.1, { charges: 4 });
  return timed([
    { at: 0, beat: status("shopper-a", "warning", badge("double-click")) },
    ...first.events,
    ...second.events,
    { at: second.end + 0.2, beat: status("shopper-a", "warning", badge("no-answer")) },
    ...slow.events,
    { at: arrives, beat: status("payments", "warning", badge("slow")) },
    { at: arrives + 1.5, beat: status("payments", null) },
    { at: timedOut, beat: status("shopper-a", "warning", badge("timed-out")) },
    ...last.events,
    { at: last.end, beat: paid },
  ]);
}

/**
 * Step 6: a double tap sends two requests with one key. The first does the work; the second
 * finds the key in progress and gets 409; its retry gets the stored answer.
 */
function twoAtOnce(): Beat[] {
  const firstArrives = TRAVEL;
  const charging = firstArrives + 2 * DB_TRAVEL;
  const charged = charging + 2 * PROCESSOR_TRAVEL;
  const secondTries = charging + 0.05;
  const conflictSent = secondTries + 2 * DB_TRAVEL;
  const conflictArrives = conflictSent + TRAVEL;
  const done = charged + 2 * DB_TRAVEL;
  const retry = Math.max(conflictArrives + 0.6, done + TRAVEL + 0.2);
  const lookup = retry + TRAVEL;
  return [
    ...timed([
      { at: 0, beat: status("shopper-a", "warning", badge("double-tap")) },
      { at: 0, beat: packet(SHOPPER, "request", "keyed-request") },
      { at: 0.12, beat: packet(SHOPPER, "request", "keyed-request") },
      // The first request: key in progress, then the charge.
      { at: firstArrives, beat: packet(DB, "request", "insert-key") },
      { at: firstArrives + DB_TRAVEL, beat: packet(DB, "response", "key-inserted") },
      { at: charging, beat: status("payments-db", "info", badge("in-progress")) },
      { at: charging, beat: packet(PROCESSOR, "request", "charge-card") },
      { at: charging + PROCESSOR_TRAVEL, beat: packet(PROCESSOR, "response", "card-charged") },
      { at: charged, beat: status("card-processor", "info", badge("charged-once")) },
      // The second request: the key is taken, so 409.
      { at: secondTries, beat: packet(DB, "request", "insert-key") },
      { at: secondTries + DB_TRAVEL, beat: packet(DB, "error", "key-conflict") },
      { at: conflictSent, beat: packet(SHOPPER, "error", "conflict") },
      { at: conflictArrives, beat: status("shopper-a", "warning", badge("conflict")) },
      // The first request finishes.
      { at: charged, beat: packet(DB, "request", "save-done") },
      { at: charged + DB_TRAVEL, beat: packet(DB, "response", "saved-done") },
      { at: done, beat: status("payments-db", "info", badge("done")) },
      { at: done, beat: packet(SHOPPER, "response", "created") },
      // The retry of the second request gets the stored answer.
      { at: retry, beat: packet(SHOPPER, "request", "keyed-retry") },
      { at: lookup, beat: packet(DB, "request", "key-lookup") },
      { at: lookup + DB_TRAVEL, beat: packet(DB, "response", "key-found-done") },
      { at: lookup + 2 * DB_TRAVEL, beat: status("payments", "info", badge("replayed")) },
      { at: lookup + 2 * DB_TRAVEL, beat: packet(SHOPPER, "response", "replayed") },
    ]),
    wait(TRAVEL),
    paid,
    wait(0.8),
  ];
}

// ----- States at the start of a step -----------------------------------------------------------

const KEY_DONE = { tone: "info", badge: badge("done") } as const;
const CHARGED_ONCE = { tone: "info", badge: badge("charged-once") } as const;
const EXPIRED = {
  "shopper-a": { tone: "warning", badge: badge("late-retry") },
  "payments-db": { tone: "warning", badge: badge("key-expired") },
  "card-processor": { tone: "info", badge: badge("downstream-key") },
} as const;

export const idempotencyModule: LearningModule = {
  id: "idempotency",
  layout,
  chapters: [{ id: "safe-to-repeat" }, { id: "keys" }, { id: "hard-cases" }],
  steps: [
    // ----- Chapter 1: Safe to repeat? ------------------------------------------------------
    {
      id: "same-twice",
      chapterId: "safe-to-repeat",
      scene: {
        focus: ["shopper-a", "payments", "payments-db"],
        frame: ALL,
        beats: [
          ...ask("put-address"),
          ...db("update-address", "address-updated"),
          answer("address-ok"),
          ...ask("put-address"),
          ...db("update-address", "address-updated"),
          status("payments-db", "info", badge("address-same")),
          answer("address-ok"),
          wait(0.6),
          ...payWithoutKey(1, "created"),
          ...payWithoutKey(2, "created-again"),
          wait(0.8),
        ],
      },
    },
    {
      id: "duplicates",
      chapterId: "safe-to-repeat",
      scene: {
        focus: ALL,
        frame: ALL,
        beats: [...duplicates(), wait(0.8)],
      },
    },

    // ----- Chapter 2: Idempotency keys -----------------------------------------------------
    {
      id: "one-key",
      chapterId: "keys",
      scene: {
        focus: ["shopper-a", "payments"],
        frame: ALL,
        beats: [
          status("shopper-a", "info", badge("key-saved")),
          wait(0.5),
          ...ask("keyed-request"),
          wait(0.4),
          answer("lost-response", "response", true),
          wait(0.4),
          status("shopper-a", "warning", badge("key-attempt-2")),
          wait(0.5),
          ...ask("keyed-retry"),
          answer("replayed"),
          paid,
          wait(0.8),
        ],
      },
    },
    {
      id: "write-first",
      chapterId: "keys",
      scene: {
        focus: ALL,
        frame: ALL,
        beats: [
          ...keyedFirstTime("charge-card", "card-charged", "charged-once"),
          status("payments-db", "info", badge("done")),
          answer("created"),
          paid,
          wait(0.8),
        ],
      },
    },
    {
      id: "replay",
      chapterId: "keys",
      scene: {
        focus: ["shopper-a", "payments", "payments-db"],
        frame: ALL,
        initial: { status: { "payments-db": KEY_DONE, "card-processor": CHARGED_ONCE } },
        beats: [
          answer("lost-response", "response", true),
          wait(0.4),
          status("shopper-a", "warning", badge("key-attempt-2")),
          wait(0.5),
          ...ask("keyed-retry"),
          ...db("key-lookup", "key-found-done"),
          status("payments", "info", badge("replayed")),
          status("payments-db", "info", badge("one-charge-requests", 2)),
          answer("replayed"),
          paid,
          wait(0.8),
        ],
      },
    },

    // ----- Chapter 3: The hard cases -------------------------------------------------------
    {
      id: "two-at-once",
      chapterId: "hard-cases",
      scene: { focus: ALL, frame: ALL, beats: twoAtOnce() },
    },
    {
      id: "different-body",
      chapterId: "hard-cases",
      scene: {
        focus: ["shopper-a", "payments", "payments-db"],
        frame: ALL,
        initial: {
          status: {
            "shopper-a": { tone: "warning", badge: badge("new-cart") },
            "payments-db": KEY_DONE,
            "card-processor": CHARGED_ONCE,
          },
        },
        beats: [
          ...ask("changed-request"),
          ...db("key-lookup", "fingerprint-differs"),
          status("payments", "error", badge("different-body")),
          answer("unprocessable", "error"),
          status("shopper-a", "error", badge("key-reused")),
          wait(0.8),
        ],
      },
    },
    {
      id: "pass-it-on",
      chapterId: "hard-cases",
      scene: {
        focus: ALL,
        frame: ALL,
        beats: [
          ...keyedFirstTime("charge-with-key", "card-charged", "downstream-key"),
          status("payments-db", "info", badge("expires")),
          answer("created"),
          paid,
          wait(0.8),
        ],
      },
    },
  ],
  scenarios: [
    {
      id: "crash-halfway",
      branchesFromStepId: "write-first",
      steps: [
        {
          id: "crash",
          scene: {
            focus: ALL,
            frame: ALL,
            beats: [
              ...ask("keyed-request"),
              ...db("insert-key", "key-inserted"),
              status("payments-db", "info", badge("in-progress")),
              ...processor("charge-with-key", "card-charged"),
              status("card-processor", "info", badge("charged-once")),
              wait(0.2),
              status("payments", "down", badge("crashed")),
              wait(0.8),
              status("shopper-a", "warning", badge("no-answer")),
              wait(0.8),
            ],
          },
        },
        {
          id: "recover",
          scene: {
            focus: ALL,
            frame: ALL,
            initial: {
              status: {
                "shopper-a": { tone: "warning", badge: badge("no-answer") },
                payments: { tone: "down", badge: badge("crashed") },
                "payments-db": { tone: "warning", badge: badge("in-progress") },
                "card-processor": CHARGED_ONCE,
              },
            },
            beats: [
              wait(0.4),
              status("payments", null),
              wait(0.4),
              status("shopper-a", "warning", badge("key-attempt-2")),
              ...ask("keyed-retry"),
              ...db("key-lookup", "key-found-stale"),
              status("payments", "warning", badge("taking-over")),
              ...processor("charge-with-key", "card-replayed"),
              status("card-processor", "info", badge("charged-once-replayed")),
              ...db("save-done", "saved-done"),
              status("payments-db", "info", badge("done")),
              status("payments", null),
              answer("created"),
              paid,
              wait(0.8),
            ],
          },
        },
      ],
    },
    {
      id: "key-expired",
      branchesFromStepId: "pass-it-on",
      steps: [
        {
          id: "late-retry",
          scene: {
            focus: ALL,
            frame: ALL,
            initial: { status: EXPIRED },
            beats: [
              wait(0.4),
              ...ask("keyed-retry"),
              ...db("key-lookup", "key-missing"),
              ...processor("charge-card-new", "card-charged-again"),
              status("card-processor", "error", badge("charged-twice")),
              ...db("insert-payment-again", "payment-saved-again"),
              status("payments-db", "error", badge("charged-twice")),
              answer("created-late"),
              paid,
              wait(0.8),
            ],
          },
        },
        {
          id: "safety-net",
          scene: {
            focus: ["shopper-a", "payments", "payments-db"],
            frame: ALL,
            initial: { status: EXPIRED },
            beats: [
              wait(0.4),
              ...ask("keyed-retry"),
              ...db("key-lookup", "key-missing"),
              ...db("check-order", "order-paid"),
              status("payments", "info", badge("already-paid")),
              status("payments-db", "info", badge("one-charge")),
              answer("already-paid", "error"),
              paid,
              wait(0.8),
            ],
          },
        },
      ],
    },
  ],
};
