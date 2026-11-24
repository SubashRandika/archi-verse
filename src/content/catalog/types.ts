/**
 * Catalog content types. Kept free of Zod so the catalog adds no validation library to the
 * browser bundle; the matching Zod schemas live in `schema.ts` and run in unit tests.
 */

export const CATEGORY_ICONS = [
  "front-end",
  "micro-frontends",
  "components",
  "state",
  "rendering",
  "performance",
  "api",
  "security",
  "caching",
  "resilience",
  "design-systems",
  "testing",
  "devops",
  "backend",
  "leadership",
  "emerging",
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

/** A concept defined in the category file where it first appears in the roadmap. */
export interface ConceptDefinition {
  /** Stable lowercase kebab-case id, also the URL slug. */
  id: string;
  title: string;
  /** Extra search terms: abbreviations, synonyms, related tool names. */
  keywords?: readonly string[];
  /** Set when an interactive learning module exists for this concept. */
  moduleId?: string;
}

/** A concept that is defined in an earlier category and also belongs to this one. */
export interface ConceptRef {
  ref: string;
}

export interface CategoryDefinition {
  id: string;
  title: string;
  description: string;
  icon: CategoryIcon;
  /** Position in the roadmap (1-based). */
  order: number;
  /** Concepts in roadmap order: inline definitions or references to shared concepts. */
  concepts: readonly (ConceptDefinition | ConceptRef)[];
}

/** Reference a concept defined in an earlier category. */
export const ref = (id: string): ConceptRef => ({ ref: id });

export const isConceptRef = (entry: ConceptDefinition | ConceptRef): entry is ConceptRef =>
  "ref" in entry;
