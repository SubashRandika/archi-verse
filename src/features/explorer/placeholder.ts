/**
 * PLACEHOLDER (Phase 2). Concept counts, a sample of concepts and sample progress so the
 * explorer looks real. Replaced by the concept catalog and progress store in Phase 3.
 */

export type ConceptProgress = "completed" | "in-progress" | "not-started";

export interface PreviewConcept {
  readonly id: string;
  readonly title: string;
  readonly progress: ConceptProgress;
  /** `false` = no learning module built yet ("planned"). */
  readonly available: boolean;
}

/** Concept totals per category, from the roadmap in CLAUDE.md §6. */
export const previewConceptCounts: Readonly<Record<string, number>> = {
  "front-end-architecture": 13,
  "micro-frontends": 13,
  "component-architecture": 16,
  "state-management": 16,
  "rendering-architecture": 19,
  "performance-engineering": 18,
  "api-communication": 17,
  "security-architecture": 18,
  "caching-architecture": 14,
  "resilience-reliability": 18,
  "design-systems": 23,
  "testing-architecture": 25,
  "build-deployment-devops": 26,
  "backend-distributed-systems": 26,
  "architecture-leadership": 22,
  "emerging-technologies": 20,
};

/** Sample completion counts (manual completion of planned concepts is allowed, see Q3). */
export const previewCompletedCounts: Readonly<Record<string, number>> = {
  "front-end-architecture": 2,
  "state-management": 4,
  "api-communication": 2,
  "testing-architecture": 3,
};

const apiConceptTitles = [
  "REST APIs",
  "GraphQL",
  "gRPC-Web",
  "WebSockets",
  "Server-Sent Events (SSE)",
  "HTTP Protocol",
  "API Gateway",
  "Backend for Frontend (BFF)",
  "API Versioning",
  "OpenAPI Specification",
  "Request Cancellation",
  "Retry and Exponential Backoff",
  "Rate Limiting",
  "Pagination",
  "Request Deduplication",
  "Idempotency",
  "Circuit Breaker",
] as const;

const toId = (title: string) =>
  title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const sampleProgress: Readonly<Record<string, ConceptProgress>> = {
  "rest-apis": "completed",
  "http-protocol": "completed",
  "api-gateway": "in-progress",
};

/** Concepts shown for the expanded API category. Only API Gateway has a module (Phase 5). */
export const previewConceptsByCategory: Readonly<Record<string, readonly PreviewConcept[]>> = {
  "api-communication": apiConceptTitles.map((title) => {
    const id = toId(title);
    return {
      id,
      title,
      progress: sampleProgress[id] ?? "not-started",
      available: id === "api-gateway",
    };
  }),
};

export const previewCurrentConceptId = "api-gateway";
export const previewCurrentCategoryId = "api-communication";
