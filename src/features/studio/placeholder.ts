/**
 * PLACEHOLDER (Phase 2). The API Gateway module outline from docs/phase-0-plan.md, used to
 * give the shell realistic content. Replaced by `src/content/modules/api-gateway/` in Phase 5.
 */

export interface PreviewStep {
  readonly id: string;
  readonly title: string;
}

export interface PreviewChapter {
  readonly id: string;
  readonly title: string;
  readonly steps: readonly PreviewStep[];
}

export const previewConcept = {
  title: "API Gateway",
  categoryTitle: "API Integration & Communication Architecture",
} as const;

export const previewChapters: readonly PreviewChapter[] = [
  {
    id: "request",
    title: "The request",
    steps: [
      { id: "meet-the-client", title: "Meet the client" },
      { id: "anatomy-of-a-request", title: "Anatomy of an HTTP request" },
      { id: "across-the-network", title: "Across the network" },
    ],
  },
  {
    id: "gateway",
    title: "The gateway",
    steps: [
      { id: "one-front-door", title: "One front door" },
      { id: "authentication", title: "Authentication" },
      { id: "rate-limiting", title: "Rate limiting" },
      { id: "validation-and-routing", title: "Validation and routing" },
    ],
  },
  {
    id: "backend",
    title: "The backend",
    steps: [
      { id: "business-logic", title: "Business logic" },
      { id: "querying-the-database", title: "Querying the database" },
      { id: "building-the-response", title: "Building the response" },
    ],
  },
  {
    id: "return-trip",
    title: "The return trip",
    steps: [
      { id: "response-flows-back", title: "The response flows back" },
      { id: "full-lifecycle", title: "The full lifecycle" },
    ],
  },
];

export const previewSteps = previewChapters.flatMap((chapter) =>
  chapter.steps.map((step) => ({ ...step, chapterId: chapter.id, chapterTitle: chapter.title })),
);

export type PreviewStepWithChapter = (typeof previewSteps)[number];
