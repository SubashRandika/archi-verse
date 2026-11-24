import {
  CATEGORY_ICONS,
  categories,
  categoryDefinitions,
  concepts,
  DEFAULT_CONCEPT_ID,
  getCategoryConcepts,
  getConcept,
} from "./index";
import { modules } from "@/content/modules";
import { categoryDefinitionSchema, conceptSummariesSchema } from "./schema";
import { conceptSummaries } from "./summaries";

describe("concept catalog", () => {
  it.each(categoryDefinitions.map((definition) => [definition.id, definition] as const))(
    "category %s matches the schema",
    (_id, definition) => {
      expect(() => categoryDefinitionSchema.parse(definition)).not.toThrow();
    },
  );

  it("has exactly one summary per concept", () => {
    expect(() => conceptSummariesSchema.parse(conceptSummaries)).not.toThrow();
    expect(Object.keys(conceptSummaries).sort()).toEqual(concepts.map((c) => c.id).sort());
  });

  it("contains the 16 roadmap categories in order, each with a distinct icon", () => {
    expect(categories).toHaveLength(16);
    expect(categories.map((category) => category.order)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
    );
    expect(new Set(categories.map((category) => category.icon)).size).toBe(CATEGORY_ICONS.length);
    expect(new Set(categories.map((category) => category.id)).size).toBe(16);
  });

  it("has 291 unique concepts (304 roadmap entries with 13 shared concepts merged)", () => {
    expect(concepts).toHaveLength(291);
    const entries = categories.reduce((sum, category) => sum + category.conceptIds.length, 0);
    expect(entries).toBe(304);
  });

  it("matches the roadmap's concept count per category", () => {
    const counts = Object.fromEntries(
      categories.map((category) => [category.id, category.conceptIds.length]),
    );
    expect(counts).toEqual({
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
    });
  });

  it("lists every concept in at least one category, without duplicates inside a category", () => {
    for (const concept of concepts) expect(concept.categoryIds.length).toBeGreaterThan(0);
    for (const category of categories) {
      expect(new Set(category.conceptIds).size).toBe(category.conceptIds.length);
    }
  });

  it.each([
    ["api-gateway", ["api-communication", "backend-distributed-systems"]],
    ["backend-for-frontend", ["api-communication", "backend-distributed-systems"]],
    ["rate-limiting", ["api-communication", "backend-distributed-systems"]],
    ["circuit-breaker", ["api-communication", "resilience-reliability"]],
    ["retry-and-exponential-backoff", ["api-communication", "resilience-reliability"]],
    ["cache-invalidation", ["state-management", "caching-architecture"]],
    ["browser-caching", ["performance-engineering", "caching-architecture"]],
    ["distributed-caching", ["caching-architecture", "backend-distributed-systems"]],
    ["web-components", ["micro-frontends", "design-systems"]],
    ["visual-regression-testing", ["design-systems", "testing-architecture"]],
    ["webassembly", ["rendering-architecture", "emerging-technologies"]],
    ["architecture-decision-records", ["front-end-architecture", "architecture-leadership"]],
    ["backward-compatibility", ["design-systems", "architecture-leadership"]],
  ])("shares %s between its categories", (id, categoryIds) => {
    expect(getConcept(id)?.categoryIds).toEqual(categoryIds);
  });

  it("marks only concepts with a learning module as available", () => {
    const available = concepts.filter((concept) => concept.availability === "available");
    expect(available.every((concept) => concept.moduleId)).toBe(true);
    expect(available.map((concept) => concept.moduleId).sort()).toEqual(
      Object.keys(modules).sort(),
    );
    expect(getConcept(DEFAULT_CONCEPT_ID)?.moduleId).toBe("api-gateway");
  });

  it("resolves category concepts in roadmap order", () => {
    const caching = categories.find((category) => category.id === "caching-architecture");
    expect(caching && getCategoryConcepts(caching).map((concept) => concept.title)).toEqual(
      expect.arrayContaining(["Browser Caching", "Cache Invalidation", "Distributed Caching"]),
    );
    expect(caching && getCategoryConcepts(caching)[0]?.id).toBe("browser-caching");
  });
});
