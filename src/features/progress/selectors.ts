import type { Category, Concept } from "@/content/catalog";
import type { ProgressRecords } from "./progress-store";

export type ConceptStatus = "not-started" | "in-progress" | "completed";

export interface ProgressSummary {
  completed: number;
  inProgress: number;
  total: number;
}

export function getConceptStatus(records: ProgressRecords, conceptId: string): ConceptStatus {
  return records[conceptId]?.status ?? "not-started";
}

function summarize(records: ProgressRecords, conceptIds: readonly string[]): ProgressSummary {
  let completed = 0;
  let inProgress = 0;
  for (const id of conceptIds) {
    const status = getConceptStatus(records, id);
    if (status === "completed") completed += 1;
    else if (status === "in-progress") inProgress += 1;
  }
  return { completed, inProgress, total: conceptIds.length };
}

/** Progress of one category. A concept shared by several categories counts in each of them. */
export function getCategoryProgress(records: ProgressRecords, category: Category): ProgressSummary {
  return summarize(records, category.conceptIds);
}

/** Progress across unique concepts (shared concepts count once). */
export function getOverallProgress(
  records: ProgressRecords,
  concepts: readonly Concept[],
): ProgressSummary {
  return summarize(
    records,
    concepts.map((concept) => concept.id),
  );
}
