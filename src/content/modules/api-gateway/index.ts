import type { SceneLayout } from "@/lib/scene-spec";
import type { LearningModule } from "../types";

/**
 * API Gateway module.
 *
 * Phase 4 ships the real scene layout and three demonstration steps that exercise the engine
 * (request, processing and routing, response). The full 12-step sequence from
 * docs/phase-0-plan.md is written and reviewed in Phase 5.
 */

const layout: SceneLayout = {
  components: [
    { id: "browser", kind: "client", label: "Browser", role: "Client", position: [-6, 0, 0] },
    {
      id: "gateway",
      kind: "gateway",
      label: "API gateway",
      role: "Edge component",
      position: [-2, 0, 0],
    },
    {
      id: "orders-service",
      kind: "service",
      label: "Orders service",
      role: "Backend service",
      position: [2, 0, 0],
    },
    {
      id: "users-service",
      kind: "service",
      label: "Users service",
      role: "Backend service",
      position: [2, 0, -3.5],
    },
    {
      id: "orders-db",
      kind: "database",
      label: "Orders database",
      role: "Data store",
      position: [6, 0, 0],
    },
  ],
  connections: [
    { id: "browser-gateway", from: "browser", to: "gateway" },
    { id: "gateway-orders", from: "gateway", to: "orders-service" },
    { id: "gateway-users", from: "gateway", to: "users-service", via: [[-2, 0, -3.5]] },
    { id: "orders-db", from: "orders-service", to: "orders-db" },
  ],
};

export const apiGatewayModule: LearningModule = {
  id: "api-gateway",
  layout,
  chapters: [
    { id: "request", title: "The request" },
    { id: "gateway", title: "The gateway" },
    { id: "return-trip", title: "The return trip" },
  ],
  steps: [
    {
      id: "request-leaves-the-browser",
      chapterId: "request",
      title: "The request leaves the browser",
      scene: {
        focus: ["browser", "gateway"],
        beats: [
          { type: "process", component: "browser", duration: 0.8 },
          { type: "packet", connection: "browser-gateway", flow: "request" },
        ],
      },
    },
    {
      id: "gateway-routes-the-request",
      chapterId: "gateway",
      title: "The gateway checks and routes it",
      scene: {
        // The Users service stays in view but dimmed: the gateway chose not to use it.
        focus: ["gateway", "orders-service"],
        frame: ["gateway", "orders-service", "users-service"],
        beats: [
          { type: "process", component: "gateway", duration: 1.4 },
          { type: "packet", connection: "gateway-orders", flow: "request" },
          { type: "process", component: "orders-service", duration: 1 },
        ],
      },
    },
    {
      id: "response-flows-back",
      chapterId: "return-trip",
      title: "The response flows back",
      scene: {
        focus: ["browser", "gateway", "orders-service"],
        beats: [
          { type: "packet", connection: "gateway-orders", flow: "response", reverse: true },
          { type: "process", component: "gateway", duration: 0.6 },
          { type: "packet", connection: "browser-gateway", flow: "response", reverse: true },
        ],
      },
    },
  ],
};
