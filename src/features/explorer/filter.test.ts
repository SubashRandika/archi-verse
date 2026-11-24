import { categories } from "@/content/catalog";
import type { ProgressRecords } from "@/features/progress/progress-store";
import { filterCatalog, isFiltering, NO_FILTER } from "./filter";

const at = "2026-11-24T10:00:00Z";
const records: ProgressRecords = {
  "cap-theorem": { status: "completed", updatedAt: at, completedAt: at },
  graphql: { status: "in-progress", updatedAt: at },
};

const titles = (filter: Parameters<typeof filterCatalog>[0]) =>
  filterCatalog(filter, records).map((match) => ({
    category: match.category.id,
    concepts: match.concepts.map((concept) => concept.id),
  }));

describe("filterCatalog", () => {
  it("returns every category and concept when not filtering", () => {
    const result = filterCatalog(NO_FILTER, records);
    expect(result).toHaveLength(categories.length);
    expect(isFiltering(NO_FILTER)).toBe(false);
  });

  it("matches titles, summaries and keywords, case-insensitively", () => {
    expect(titles({ ...NO_FILTER, query: "SSE" })).toEqual([
      { category: "api-communication", concepts: ["server-sent-events"] },
    ]);
    expect(titles({ ...NO_FILTER, query: "kafka" })).toEqual([
      { category: "backend-distributed-systems", concepts: ["apache-kafka"] },
    ]);
  });

  it("matches word starts, not arbitrary substrings", () => {
    expect(titles({ ...NO_FILTER, query: "idempot" })[0]?.concepts).toEqual(["idempotency"]);
    // "sse" appears inside "classes" and "assembling", which must not match.
    expect(titles({ ...NO_FILTER, query: "sse" }).flatMap((match) => match.concepts)).toEqual([
      "server-sent-events",
    ]);
  });

  it("requires every word of the query to match", () => {
    const result = titles({ ...NO_FILTER, query: "token refresh" });
    expect(result.flatMap((match) => match.concepts)).toEqual(["access-tokens-and-refresh-tokens"]);
  });

  it("shows a shared concept under each of its categories", () => {
    const result = titles({ ...NO_FILTER, query: "circuit breaker" });
    expect(result.map((match) => match.category)).toEqual([
      "api-communication",
      "resilience-reliability",
    ]);
  });

  it("keeps all concepts of a category whose title matches", () => {
    const result = titles({ ...NO_FILTER, query: "caching architecture" });
    expect(result).toHaveLength(1);
    expect(result[0]?.concepts).toHaveLength(14);
  });

  it("filters by progress status", () => {
    expect(titles({ ...NO_FILTER, status: "completed" })).toEqual([
      { category: "backend-distributed-systems", concepts: ["cap-theorem"] },
    ]);
    expect(titles({ ...NO_FILTER, status: "in-progress" })).toEqual([
      { category: "api-communication", concepts: ["graphql"] },
    ]);
  });

  it("filters to concepts with a visualization", () => {
    expect(titles({ ...NO_FILTER, withVisualizationOnly: true })).toEqual([
      { category: "api-communication", concepts: ["api-gateway"] },
      { category: "backend-distributed-systems", concepts: ["api-gateway"] },
    ]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterCatalog({ ...NO_FILTER, query: "zzz nothing" }, records)).toEqual([]);
  });
});
