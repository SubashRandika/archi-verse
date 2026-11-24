import type { Beat, SceneLayout } from "@/lib/scene-spec";
import type { LearningModule } from "../types";

/**
 * API Gateway, the life of a request: scene layout, steps and scenarios.
 * Source of truth for the content: docs/modules/api-gateway.md (approved 2026-11-24).
 * The text lives in ./text.ts (server only).
 */

const layout: SceneLayout = {
  components: [
    { id: "browser", kind: "client", label: "Browser", role: "Client", position: [-10, 0, 0] },
    {
      id: "hop-1",
      kind: "hop",
      label: "Internet",
      role: "Network",
      position: [-7.6, 0, 0],
      decorative: true,
    },
    {
      id: "hop-2",
      kind: "hop",
      label: "Internet",
      role: "Network",
      position: [-5, 0, 0],
      decorative: true,
    },
    {
      id: "gateway",
      kind: "gateway",
      label: "API gateway",
      role: "Edge component",
      position: [-2, 0, 0],
      stages: [
        { id: "tls", label: "TLS" },
        { id: "auth", label: "Authentication" },
        { id: "rate-limit", label: "Rate limit" },
        { id: "validate", label: "Validation" },
        { id: "route", label: "Routing" },
      ],
    },
    {
      id: "identity",
      kind: "identity",
      label: "Identity provider",
      role: "Security service",
      position: [-8, 0, -3.5],
    },
    {
      id: "orders-1",
      kind: "service",
      label: "Orders service #1",
      role: "Backend service",
      position: [2.5, 0, 0],
    },
    {
      id: "orders-2",
      kind: "service",
      label: "Orders service #2",
      role: "Backend service",
      position: [2.5, 0, -4],
    },
    {
      id: "users",
      kind: "service",
      label: "Users service",
      role: "Backend service",
      position: [2.5, 0, 3.4],
    },
    {
      id: "postgres",
      kind: "database",
      label: "PostgreSQL",
      role: "Data store",
      position: [7.5, 0, -1.5],
    },
  ],
  connections: [
    { id: "browser-gateway", from: "browser", to: "gateway" },
    {
      id: "gateway-identity",
      from: "gateway",
      to: "identity",
      via: [[-2, 0, -3.5]],
      style: "dashed",
    },
    { id: "gateway-orders-1", from: "gateway", to: "orders-1" },
    {
      id: "gateway-orders-2",
      from: "gateway",
      to: "orders-2",
      via: [
        [0.25, 0, 0],
        [0.25, 0, -4],
      ],
    },
    { id: "orders-users", from: "orders-1", to: "users" },
    {
      id: "orders-1-db",
      from: "orders-1",
      to: "postgres",
      via: [
        [5, 0, 0],
        [5, 0, -1.5],
      ],
    },
    {
      id: "orders-2-db",
      from: "orders-2",
      to: "postgres",
      via: [
        [5, 0, -4],
        [5, 0, -1.5],
      ],
    },
    {
      id: "browser-identity",
      from: "browser",
      to: "identity",
      via: [[-10, 0, -3.5]],
      hidden: true,
    },
  ],
};

const ALL = layout.components.map((component) => component.id);
const NETWORK = ["browser", "hop-1", "hop-2", "gateway"];

// Small builders keep the step list readable.
const send = (
  connection: string,
  flow: "request" | "response" | "error",
  options: {
    message?: string;
    duration?: number;
    next?: number;
    back?: boolean;
    stay?: boolean;
  } = {},
): Beat => ({
  type: "packet",
  connection,
  flow,
  reverse: options.back,
  stay: options.stay,
  duration: options.duration,
  next: options.next,
  message: options.message,
});

/**
 * A burst: `count` requests in flight at once, launched `every` seconds apart. The gateway's
 * allowance badge counts down as each one arrives, from `left - 1` to `left - count`.
 */
function burst(count: number, left: number, every = 0.3, travel = 1): Beat[] {
  const launches = Array.from({ length: count }, (_, i) => i * every);
  const arrivals = launches.map((at) => at + travel);
  const events = [
    ...launches.map((at) => ({
      at,
      beat: send("browser-gateway", "request", {
        duration: travel,
        next: 0,
        message: "request",
      }),
    })),
    ...arrivals.map((at, i) => {
      const remaining = left - i - 1;
      return {
        at,
        beat: status("gateway", remaining === 0 ? "warning" : "info", `${remaining} of 60 left`),
      };
    }),
  ].sort((a, b) => a.at - b.at);
  // Turn absolute times into a sequence: each event, then a wait until the next one.
  const beats: Beat[] = [];
  let now = 0;
  for (const { at, beat } of events) {
    if (at > now) beats.push(wait(at - now));
    now = Math.max(now, at);
    beats.push(beat);
  }
  return beats;
}
const work = (
  component: string,
  duration?: number,
  options: { stage?: string; tone?: "active" | "warning" | "error" } = {},
): Beat => ({ type: "process", component, duration, ...options });
const stage = (id: string, duration?: number, tone?: "active" | "warning" | "error"): Beat =>
  work("gateway", duration, { stage: id, tone });
const signal = (connection: string, duration?: number): Beat => ({
  type: "signal",
  connection,
  duration,
});
const status = (
  component: string,
  tone: "info" | "warning" | "error" | "down" | null,
  badge?: string,
): Beat => ({ type: "status", component, status: tone ? { tone, badge } : null });
const wait = (duration: number): Beat => ({ type: "wait", duration });

export const apiGatewayModule: LearningModule = {
  id: "api-gateway",
  layout,
  chapters: [{ id: "request" }, { id: "gateway" }, { id: "backend" }, { id: "return-trip" }],
  steps: [
    {
      id: "meet-the-client",
      chapterId: "request",
      scene: { focus: ["browser"], frame: ALL, beats: [work("browser", 1)] },
    },
    {
      id: "anatomy-of-a-request",
      chapterId: "request",
      scene: {
        focus: ["browser"],
        frame: ["browser", "hop-1"],
        beats: [
          send("browser-gateway", "request", { stay: true, duration: 2, message: "request" }),
        ],
      },
    },
    {
      id: "across-the-network",
      chapterId: "request",
      scene: {
        focus: NETWORK,
        beats: [send("browser-gateway", "request", { duration: 2.4, message: "request" })],
      },
    },
    {
      id: "one-front-door",
      chapterId: "gateway",
      scene: {
        focus: ["gateway"],
        frame: ["gateway", "identity", "orders-1", "orders-2", "users"],
        beats: [
          stage("tls", 1.2),
          work("orders-1", 0.4),
          work("orders-2", 0.4),
          work("users", 0.4),
        ],
      },
    },
    {
      id: "authentication",
      chapterId: "gateway",
      scene: {
        focus: ["gateway", "identity"],
        beats: [stage("auth", 1), signal("gateway-identity", 0.8), stage("auth", 0.6)],
      },
    },
    {
      id: "rate-limiting",
      chapterId: "gateway",
      scene: {
        focus: ["gateway"],
        initial: { status: { gateway: { tone: "info", badge: "58 of 60 left" } } },
        beats: [stage("rate-limit", 1.2), status("gateway", "info", "57 of 60 left"), wait(1)],
      },
    },
    {
      id: "validation-and-routing",
      chapterId: "gateway",
      scene: {
        focus: ["gateway", "orders-1", "orders-2"],
        frame: ["gateway", "orders-1", "orders-2", "users"],
        beats: [
          stage("validate", 0.8),
          stage("route", 0.8),
          send("gateway-orders-1", "request", { message: "forwarded" }),
        ],
      },
    },
    {
      id: "business-logic",
      chapterId: "backend",
      scene: {
        focus: ["orders-1", "users"],
        beats: [
          work("orders-1", 1),
          send("orders-users", "request", { message: "users-call", duration: 1.2 }),
          work("users", 0.8),
          send("orders-users", "response", { back: true, message: "users-reply", duration: 1.2 }),
        ],
      },
    },
    {
      id: "querying-the-database",
      chapterId: "backend",
      scene: {
        focus: ["orders-1", "postgres"],
        beats: [
          send("orders-1-db", "request", { message: "sql-query" }),
          work("postgres", 1.2),
          send("orders-1-db", "response", { back: true, message: "sql-rows" }),
        ],
      },
    },
    {
      id: "building-the-response",
      chapterId: "backend",
      scene: {
        focus: ["orders-1"],
        frame: ["gateway", "orders-1"],
        beats: [
          work("orders-1", 1.2),
          send("gateway-orders-1", "response", {
            back: true,
            stay: true,
            duration: 1.2,
            message: "service-response",
          }),
        ],
      },
    },
    {
      id: "response-flows-back",
      chapterId: "return-trip",
      scene: {
        focus: [...NETWORK, "orders-1"],
        beats: [
          send("gateway-orders-1", "response", { back: true, message: "service-response" }),
          work("gateway", 0.8),
          send("browser-gateway", "response", {
            back: true,
            duration: 2.4,
            message: "final-response",
          }),
          work("browser", 0.6),
        ],
      },
    },
    {
      id: "full-lifecycle",
      chapterId: "return-trip",
      scene: {
        focus: ALL,
        beats: [
          send("browser-gateway", "request", { duration: 1.2, message: "request" }),
          stage("tls", 0.3),
          stage("auth", 0.3),
          stage("rate-limit", 0.3),
          stage("validate", 0.3),
          stage("route", 0.3),
          send("gateway-orders-1", "request", { duration: 0.8, message: "forwarded" }),
          work("orders-1", 0.4),
          send("orders-users", "request", { duration: 0.6, message: "users-call" }),
          send("orders-users", "response", { back: true, duration: 0.6, message: "users-reply" }),
          send("orders-1-db", "request", { duration: 0.6, message: "sql-query" }),
          work("postgres", 0.4),
          send("orders-1-db", "response", { back: true, duration: 0.6, message: "sql-rows" }),
          send("gateway-orders-1", "response", {
            back: true,
            duration: 0.8,
            message: "service-response",
          }),
          work("gateway", 0.3),
          send("browser-gateway", "response", {
            back: true,
            duration: 1.2,
            message: "final-response",
          }),
        ],
      },
    },
  ],
  scenarios: [
    {
      id: "unauthorized",
      branchesFromStepId: "authentication",
      steps: [
        {
          id: "401-expired-token",
          scene: {
            focus: NETWORK,
            frame: [...NETWORK, "identity"],
            beats: [
              send("browser-gateway", "request", { message: "expired-request" }),
              stage("auth", 1, "error"),
              status("gateway", "error", "401"),
              wait(0.6),
            ],
          },
        },
        {
          id: "401-gateway-answers",
          scene: {
            focus: NETWORK,
            initial: { status: { gateway: { tone: "error", badge: "401" } } },
            beats: [send("browser-gateway", "error", { back: true, message: "401-response" })],
          },
        },
        {
          id: "401-refresh-and-retry",
          scene: {
            focus: [...NETWORK, "identity"],
            beats: [
              send("browser-identity", "request", { message: "refresh-request" }),
              work("identity", 0.8),
              send("browser-identity", "response", { back: true, message: "refresh-response" }),
              send("browser-gateway", "request", { message: "request" }),
              stage("auth", 0.8),
              send("browser-gateway", "response", { back: true, message: "final-response" }),
            ],
          },
        },
      ],
    },
    {
      id: "rate-limited",
      branchesFromStepId: "rate-limiting",
      steps: [
        {
          id: "429-burst",
          scene: {
            focus: NETWORK,
            initial: { status: { gateway: { tone: "info", badge: "5 of 60 left" } } },
            beats: [...burst(5, 5), wait(0.6)],
          },
        },
        {
          id: "429-too-many",
          scene: {
            focus: NETWORK,
            initial: { status: { gateway: { tone: "warning", badge: "0 of 60 left" } } },
            beats: [
              send("browser-gateway", "request", { duration: 1.2, message: "request" }),
              stage("rate-limit", 0.8, "error"),
              status("gateway", "error", "429"),
              send("browser-gateway", "error", { back: true, message: "429-response" }),
            ],
          },
        },
        {
          id: "429-back-off",
          scene: {
            focus: NETWORK,
            initial: { status: { gateway: { tone: "error", badge: "429" } } },
            beats: [
              status("browser", "warning", "waiting 20 s"),
              wait(2.2),
              status("browser", null),
              status("gateway", "info", "20 of 60 left"),
              send("browser-gateway", "request", { message: "request" }),
              stage("rate-limit", 0.6),
              status("gateway", "info", "19 of 60 left"),
              wait(0.6),
            ],
          },
        },
      ],
    },
    {
      id: "timeout",
      branchesFromStepId: "validation-and-routing",
      steps: [
        {
          id: "timeout-slow-service",
          scene: {
            focus: ["gateway", "orders-1"],
            frame: ["gateway", "orders-1", "orders-2"],
            beats: [
              send("gateway-orders-1", "request", { message: "forwarded" }),
              status("orders-1", "warning", "slow"),
              work("orders-1", 1, { tone: "warning" }),
              status("gateway", "warning", "waiting 1 s"),
              work("orders-1", 1, { tone: "warning" }),
              status("gateway", "error", "timeout after 2 s"),
              wait(0.6),
            ],
          },
        },
        {
          id: "timeout-gateway-answers",
          scene: {
            focus: NETWORK,
            frame: [...NETWORK, "orders-1"],
            initial: {
              status: {
                "orders-1": { tone: "warning", badge: "slow" },
                gateway: { tone: "error", badge: "504" },
              },
            },
            beats: [send("browser-gateway", "error", { back: true, message: "504-response" })],
          },
        },
        {
          id: "timeout-retry-with-backoff",
          scene: {
            focus: [...NETWORK, "orders-2"],
            frame: [...NETWORK, "orders-1", "orders-2"],
            initial: { status: { "orders-1": { tone: "warning", badge: "slow" } } },
            beats: [
              status("browser", "warning", "retry in 1 s"),
              wait(1.2),
              status("browser", null),
              send("browser-gateway", "request", { duration: 1.2, message: "request" }),
              stage("route", 0.5),
              send("gateway-orders-2", "request", { duration: 1, message: "forwarded" }),
              work("orders-2", 0.8),
              send("gateway-orders-2", "response", {
                back: true,
                duration: 1,
                message: "service-response",
              }),
              send("browser-gateway", "response", {
                back: true,
                duration: 1.2,
                message: "final-response",
              }),
            ],
          },
        },
      ],
    },
    {
      id: "unavailable",
      branchesFromStepId: "validation-and-routing",
      steps: [
        {
          id: "503-instance-down",
          scene: {
            focus: ["gateway", "orders-1", "orders-2"],
            beats: [
              status("orders-1", "down", "down"),
              signal("gateway-orders-1", 0.6),
              signal("gateway-orders-2", 0.6),
              signal("gateway-orders-1", 0.6),
              wait(0.4),
            ],
          },
        },
        {
          id: "503-routed-around",
          scene: {
            focus: [...NETWORK, "orders-2"],
            frame: [...NETWORK, "orders-1", "orders-2"],
            initial: { status: { "orders-1": { tone: "down", badge: "down" } } },
            beats: [
              stage("route", 0.6),
              send("gateway-orders-2", "request", { message: "forwarded" }),
              work("orders-2", 0.8),
              send("gateway-orders-2", "response", { back: true, message: "service-response" }),
              send("browser-gateway", "response", {
                back: true,
                duration: 1.6,
                message: "final-response",
              }),
            ],
          },
        },
        {
          id: "503-all-down",
          scene: {
            focus: [...NETWORK, "orders-1", "orders-2"],
            initial: { status: { "orders-1": { tone: "down", badge: "down" } } },
            beats: [
              status("orders-2", "down", "down"),
              signal("gateway-orders-2", 0.6),
              stage("route", 0.8, "error"),
              status("gateway", "error", "503"),
              send("browser-gateway", "error", { back: true, message: "503-response" }),
            ],
          },
        },
      ],
    },
  ],
};
