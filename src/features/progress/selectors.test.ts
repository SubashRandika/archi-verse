import { categories, concepts, getCategory } from "@/content/catalog";
import type { ProgressRecords } from "./progress-store";
import { getCategoryProgress, getConceptStatus, getOverallProgress } from "./selectors";

const at = "2026-11-24T10:00:00Z";
const records: ProgressRecords = {
  "api-gateway": { status: "completed", updatedAt: at, completedAt: at },
  "rest-apis": { status: "completed", updatedAt: at, completedAt: at },
  graphql: { status: "in-progress", updatedAt: at },
};

describe("progress selectors", () => {
  it("defaults to not started", () => {
    expect(getConceptStatus(records, "jwt")).toBe("not-started");
    expect(getConceptStatus(records, "graphql")).toBe("in-progress");
  });

  it("summarises a category", () => {
    const api = getCategory("api-communication");
    expect(api && getCategoryProgress(records, api)).toEqual({
      completed: 2,
      inProgress: 1,
      total: 17,
    });
  });

  it("counts a shared concept in every category it belongs to", () => {
    const backend = getCategory("backend-distributed-systems");
    expect(backend && getCategoryProgress(records, backend).completed).toBe(1);
  });

  it("counts shared concepts once overall", () => {
    expect(getOverallProgress(records, concepts)).toEqual({
      completed: 2,
      inProgress: 1,
      total: 291,
    });
    const perCategoryTotal = categories.reduce(
      (sum, category) => sum + getCategoryProgress(records, category).completed,
      0,
    );
    expect(perCategoryTotal).toBe(3);
  });
});
