import type { Beat, SceneLayout, StatusTone } from "@/lib/scene-spec";
import {
  badge,
  burst,
  send,
  stage as stageOf,
  status,
  timed,
  type TimedBeat,
  wait,
  work,
  type WorkTone,
} from "../beats";
import type { LearningModule } from "../types";

/**
 * Circuit Breaker, failing fast to stay alive: scene layout, steps and scenarios.
 * Source of truth for the content: docs/modules/circuit-breaker.md (approved 2026-11-24).
 * The text lives in ./text (server only).
 *
 * Time is compressed: a 2 s timeout or the 30 s wait plays in about a second, and the badges
 * show the real values.
 */

const layout: SceneLayout = {
  components: [
    { id: "browser", kind: "client", label: "Browser", role: "Client", position: [-8, 0, 0] },
    {
      id: "orders",
      kind: "service",
      label: "Orders service",
      role: "Backend service",
      position: [-3.5, 0, 0],
    },
    {
      id: "breaker",
      kind: "breaker",
      label: "Circuit breaker",
      role: "Resilience",
      position: [0, 0, 0],
      // Above, its badge would sit against the Orders rack.
      labelPlacement: "below",
      stages: [
        { id: "closed", label: "Closed" },
        { id: "half-open", label: "Half-open" },
        { id: "open", label: "Open" },
      ],
    },
    {
      id: "payments",
      kind: "service",
      label: "Payments service",
      role: "Backend service",
      position: [3.5, 0, 0],
    },
    {
      id: "payments-db",
      kind: "database",
      label: "Payments DB",
      role: "Data store",
      position: [3.5, 0, -3.6],
      labelPlacement: "right",
    },
  ],
  connections: [
    { id: "browser-orders", from: "browser", to: "orders" },
    { id: "orders-breaker", from: "orders", to: "breaker" },
    { id: "breaker-payments", from: "breaker", to: "payments" },
    { id: "payments-db", from: "payments", to: "payments-db" },
  ],
};

const ALL = layout.components.map((component) => component.id);
const CALL_PATH = ["orders", "breaker", "payments"];

/** The breaker's lamp for a state flashes as it switches. */
const lamp = (state: "closed" | "half-open" | "open", duration = 0.8): Beat => {
  const tone: Record<typeof state, WorkTone> = {
    closed: "active",
    "half-open": "warning",
    open: "error",
  };
  return stageOf("breaker", state, duration, tone[state]);
};

/** The breaker's state, as a tint and a badge. */
const closed = (failures: number) =>
  status("breaker", failures >= 5 ? "warning" : "info", badge("closed", failures));
const open = (seconds: number) => status("breaker", "error", badge("open", seconds));
const halfOpen = () => status("breaker", "warning", badge("half-open"));
const threads = (busy: number) => {
  const tone: StatusTone = busy >= 50 ? "error" : busy >= 30 ? "warning" : "info";
  return status("orders", tone, badge("threads", busy));
};

/** Initial statuses, written like the beats. */
const condition = (tone: StatusTone, id: string, count?: number) => ({
  tone,
  badge: badge(id, count),
});

/** A whole healthy round trip: browser → Orders → breaker → Payments → database and back. */
const healthyCall = (): Beat[] => [
  send("browser-orders", "request", { duration: 0.8, message: "orders-request" }),
  work("orders", 0.3),
  send("orders-breaker", "request", { duration: 0.5, message: "payments-request" }),
  send("breaker-payments", "request", { duration: 0.6, message: "payments-request" }),
  send("payments-db", "request", { duration: 0.5 }),
  work("payments-db", 0.3),
  send("payments-db", "response", { back: true, duration: 0.5 }),
  send("breaker-payments", "response", { back: true, duration: 0.6, message: "payments-response" }),
  send("orders-breaker", "response", { back: true, duration: 0.5, message: "payments-response" }),
  send("browser-orders", "response", { back: true, duration: 0.8, message: "orders-response" }),
];

/** A request that the open breaker turns away, answered with the fallback. */
const failFast = (): Beat[] => [
  send("browser-orders", "request", { duration: 0.7, message: "orders-request" }),
  send("orders-breaker", "request", { duration: 0.4, message: "payments-request" }),
  send("orders-breaker", "error", { back: true, duration: 0.3, message: "rejected" }),
  work("orders", 0.3),
  send("browser-orders", "response", { back: true, duration: 0.7, message: "fallback-response" }),
];

/** Five calls that time out one after another; the breaker counts each failure. */
function fiveFailures(): Beat[] {
  const events: TimedBeat[] = [];
  for (let index = 0; index < 5; index += 1) {
    const at = index * 0.9;
    events.push(
      { at, beat: send("orders-breaker", "request", { duration: 0.4, next: 0 }) },
      {
        at: at + 0.4,
        beat: send("breaker-payments", "request", {
          duration: 0.5,
          next: 0,
          message: "payments-request",
        }),
      },
      // The answer never comes: after the (compressed) 2 s timeout, the call fails.
      {
        at: at + 1.4,
        beat: send("breaker-payments", "error", {
          back: true,
          duration: 0.4,
          next: 0,
          message: "timeout",
        }),
      },
      { at: at + 1.8, beat: closed(index + 1) },
    );
  }
  return [...timed(events), wait(0.4)];
}

/** Requests piling up at a slow Payments service; Orders' busy threads climb. */
const pileUp = (from: number, to: number): Beat[] => [
  ...burst({
    connection: "browser-orders",
    count: 3,
    every: 0.35,
    travel: 0.7,
    message: "orders-request",
  }),
  wait(0.3),
  ...burst({
    connection: "breaker-payments",
    count: 3,
    every: 0.35,
    travel: 0.8,
    message: "payments-request",
    onArrive: (index) => threads(Math.round(from + ((to - from) * (index + 1)) / 3)),
  }),
  wait(0.6),
];

export const circuitBreakerModule: LearningModule = {
  id: "circuit-breaker",
  layout,
  chapters: [{ id: "slow-service" }, { id: "breaker" }, { id: "recovery" }],
  steps: [
    {
      id: "healthy-chain",
      chapterId: "slow-service",
      scene: {
        focus: ALL,
        initial: { status: { breaker: condition("info", "closed", 0) } },
        beats: healthyCall(),
      },
    },
    {
      id: "everyone-waits",
      chapterId: "slow-service",
      scene: {
        focus: ["browser", "orders", "payments", "payments-db"],
        initial: { status: { "payments-db": condition("warning", "slow") } },
        beats: [
          work("payments-db", 0.8, { tone: "warning" }),
          ...pileUp(4, 38),
          status("browser", "warning", badge("waiting")),
          wait(0.6),
        ],
      },
    },
    {
      id: "meet-the-breaker",
      chapterId: "breaker",
      scene: {
        focus: CALL_PATH,
        initial: {
          status: {
            breaker: condition("info", "closed", 0),
            "payments-db": condition("warning", "slow"),
          },
        },
        beats: [
          lamp("closed", 1),
          send("orders-breaker", "request", { duration: 0.6, message: "payments-request" }),
          work("breaker", 0.4),
          send("breaker-payments", "request", { duration: 0.6, message: "payments-request" }),
          wait(0.4),
        ],
      },
    },
    {
      id: "failures-add-up",
      chapterId: "breaker",
      scene: {
        focus: CALL_PATH,
        initial: {
          status: {
            breaker: condition("info", "closed", 0),
            "payments-db": condition("warning", "slow"),
          },
        },
        beats: fiveFailures(),
      },
    },
    {
      id: "breaker-trips",
      chapterId: "breaker",
      scene: {
        focus: ["breaker"],
        frame: CALL_PATH,
        initial: {
          status: {
            breaker: condition("warning", "closed", 5),
            "payments-db": condition("warning", "slow"),
          },
        },
        beats: [wait(0.3), lamp("open", 1.2), open(30), wait(0.8)],
      },
    },
    {
      id: "fail-fast",
      chapterId: "breaker",
      scene: {
        focus: ["browser", "orders", "breaker"],
        frame: ALL,
        initial: {
          status: {
            breaker: condition("error", "open", 30),
            orders: condition("warning", "threads", 38),
            "payments-db": condition("warning", "slow"),
          },
        },
        beats: [
          ...failFast(),
          threads(12),
          ...failFast(),
          threads(3),
          status("payments-db", "info", badge("recovering")),
          wait(0.6),
        ],
      },
    },
    {
      id: "half-open",
      chapterId: "recovery",
      scene: {
        focus: CALL_PATH,
        frame: ALL,
        initial: {
          status: {
            breaker: condition("error", "open", 30),
            orders: condition("info", "threads", 3),
            "payments-db": condition("info", "recovering"),
          },
        },
        beats: [
          open(20),
          wait(0.6),
          open(10),
          wait(0.6),
          open(0),
          wait(0.4),
          lamp("half-open", 1),
          halfOpen(),
          send("orders-breaker", "request", { duration: 0.6, message: "payments-request" }),
          send("breaker-payments", "request", { duration: 0.6, message: "payments-request" }),
          send("payments-db", "request", { duration: 0.4 }),
          send("payments-db", "response", { back: true, duration: 0.4 }),
          send("breaker-payments", "response", {
            back: true,
            duration: 0.6,
            message: "payments-response",
          }),
          send("orders-breaker", "response", {
            back: true,
            duration: 0.6,
            message: "payments-response",
          }),
        ],
      },
    },
    {
      id: "closed-again",
      chapterId: "recovery",
      scene: {
        focus: ALL,
        initial: {
          status: {
            breaker: condition("warning", "half-open"),
            orders: condition("info", "threads", 3),
          },
        },
        beats: [
          lamp("closed", 1),
          closed(0),
          status("orders", null),
          ...healthyCall(),
          wait(0.3),
          // The whole cycle, once more: closed → open → half-open → closed.
          lamp("closed", 0.5),
          lamp("open", 0.5),
          lamp("half-open", 0.5),
          lamp("closed", 0.5),
        ],
      },
    },
  ],
  scenarios: [
    {
      id: "no-breaker",
      branchesFromStepId: "everyone-waits",
      steps: [
        {
          id: "queue-grows",
          scene: {
            focus: ["browser", "orders", "payments", "payments-db"],
            initial: {
              status: {
                breaker: condition("info", "off"),
                orders: condition("warning", "threads", 38),
                "payments-db": condition("warning", "slow"),
              },
            },
            beats: [...pileUp(38, 50), wait(0.4)],
          },
        },
        {
          id: "unrelated-pages-fail",
          scene: {
            focus: ["browser", "orders"],
            frame: ALL,
            initial: {
              status: {
                breaker: condition("info", "off"),
                orders: condition("error", "threads", 50),
                "payments-db": condition("warning", "slow"),
              },
            },
            beats: [
              send("browser-orders", "request", { duration: 0.8, message: "profile-request" }),
              work("orders", 0.6, { tone: "error" }),
              send("browser-orders", "error", {
                back: true,
                duration: 0.8,
                message: "unavailable-response",
              }),
              status("browser", "error", badge("code", 503)),
              wait(0.5),
            ],
          },
        },
        {
          id: "retry-storm",
          scene: {
            focus: ["browser", "orders"],
            frame: ALL,
            initial: {
              status: {
                breaker: condition("info", "off"),
                orders: condition("error", "threads", 50),
                browser: condition("error", "code", 503),
                "payments-db": condition("warning", "slow"),
              },
            },
            beats: [
              ...burst({
                connection: "browser-orders",
                count: 5,
                every: 0.25,
                travel: 0.7,
                message: "orders-request",
                onArrive: (index) => status("browser", "error", badge("retries", index + 1)),
              }),
              ...burst({
                connection: "browser-orders",
                flow: "error",
                count: 5,
                every: 0.25,
                travel: 0.7,
                message: "unavailable-response",
                back: true,
              }),
              wait(0.6),
            ],
          },
        },
      ],
    },
    {
      id: "trial-fails",
      branchesFromStepId: "half-open",
      steps: [
        {
          id: "still-sick",
          scene: {
            focus: CALL_PATH,
            frame: ALL,
            initial: {
              status: {
                breaker: condition("warning", "half-open"),
                "payments-db": condition("warning", "slow"),
              },
            },
            beats: [
              send("orders-breaker", "request", { duration: 0.6, message: "payments-request" }),
              send("breaker-payments", "request", { duration: 0.6, message: "payments-request" }),
              work("payments", 0.8, { tone: "warning" }),
              send("breaker-payments", "error", { back: true, duration: 0.5, message: "timeout" }),
              status("breaker", "warning", badge("trial-failed")),
              wait(0.6),
            ],
          },
        },
        {
          id: "open-again",
          scene: {
            focus: ["browser", "orders", "breaker"],
            frame: ALL,
            initial: {
              status: {
                breaker: condition("warning", "trial-failed"),
                "payments-db": condition("warning", "slow"),
              },
            },
            beats: [lamp("open", 1), open(30), wait(0.3), ...failFast(), wait(0.4)],
          },
        },
      ],
    },
  ],
};
