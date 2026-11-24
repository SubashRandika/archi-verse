import {
  type Category,
  type Concept,
  categories as allCategories,
  getCategoryConcepts,
} from "@/content/catalog";
import type { ProgressRecords } from "@/features/progress/progress-store";
import { type ConceptStatus, getConceptStatus } from "@/features/progress/selectors";

export type StatusFilter = "all" | ConceptStatus;

export interface ExplorerFilter {
  query: string;
  status: StatusFilter;
  /** Show only concepts that have an interactive learning module. */
  withVisualizationOnly: boolean;
}

export const NO_FILTER: ExplorerFilter = { query: "", status: "all", withVisualizationOnly: false };

export interface CategoryMatch {
  category: Category;
  concepts: readonly Concept[];
}

export function isFiltering(filter: ExplorerFilter): boolean {
  return filter.query.trim() !== "" || filter.status !== "all" || filter.withVisualizationOnly;
}

/** Lowercase words, split on anything that is not a letter or digit. */
const tokenize = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

/** Every term must be the start of at least one word ("idempot" finds "idempotency"). */
const matchesAll = (terms: readonly string[], words: readonly string[]) =>
  terms.every((term) => words.some((word) => word.startsWith(term)));

const wordCache = new WeakMap<Concept, readonly string[]>();
function conceptWords(concept: Concept): readonly string[] {
  let words = wordCache.get(concept);
  if (!words) {
    words = tokenize([concept.title, concept.summary, ...concept.keywords].join(" "));
    wordCache.set(concept, words);
  }
  return words;
}

/**
 * Filters the catalog for the explorer.
 * - Every word of the query must start a word in a concept's title, summary or keywords.
 * - A query that matches a category title keeps all of that category's concepts.
 * - Status and visualization filters always apply.
 * Categories without matching concepts are left out while filtering.
 */
export function filterCatalog(
  filter: ExplorerFilter,
  records: ProgressRecords,
  categories: readonly Category[] = allCategories,
): CategoryMatch[] {
  const terms = tokenize(filter.query);
  const filtering = isFiltering(filter);

  return categories.flatMap((category) => {
    const concepts = getCategoryConcepts(category);
    if (!filtering) return [{ category, concepts }];

    const categoryMatches = terms.length > 0 && matchesAll(terms, tokenize(category.title));

    const matched = concepts.filter((concept) => {
      if (filter.withVisualizationOnly && concept.availability !== "available") return false;
      if (filter.status !== "all" && getConceptStatus(records, concept.id) !== filter.status) {
        return false;
      }
      if (terms.length === 0 || categoryMatches) return true;
      return matchesAll(terms, conceptWords(concept));
    });

    return matched.length > 0 ? [{ category, concepts: matched }] : [];
  });
}
