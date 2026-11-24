import { frontEndArchitecture } from "./categories/01-front-end-architecture";
import { microFrontends } from "./categories/02-micro-frontends";
import { componentArchitecture } from "./categories/03-component-architecture";
import { stateManagement } from "./categories/04-state-management";
import { renderingArchitecture } from "./categories/05-rendering-architecture";
import { performanceEngineering } from "./categories/06-performance-engineering";
import { apiCommunication } from "./categories/07-api-communication";
import { securityArchitecture } from "./categories/08-security-architecture";
import { cachingArchitecture } from "./categories/09-caching-architecture";
import { resilienceReliability } from "./categories/10-resilience-reliability";
import { designSystems } from "./categories/11-design-systems";
import { testingArchitecture } from "./categories/12-testing-architecture";
import { buildDeploymentDevops } from "./categories/13-build-deployment-devops";
import { backendDistributedSystems } from "./categories/14-backend-distributed-systems";
import { architectureLeadership } from "./categories/15-architecture-leadership";
import { emergingTechnologies } from "./categories/16-emerging-technologies";
import {
  type CategoryDefinition,
  type CategoryIcon,
  type ConceptDefinition,
  isConceptRef,
} from "./types";

export { CATEGORY_ICONS, type CategoryIcon } from "./types";

/** Raw category definitions in roadmap order (validated in catalog.test.ts). */
export const categoryDefinitions: readonly CategoryDefinition[] = [
  frontEndArchitecture,
  microFrontends,
  componentArchitecture,
  stateManagement,
  renderingArchitecture,
  performanceEngineering,
  apiCommunication,
  securityArchitecture,
  cachingArchitecture,
  resilienceReliability,
  designSystems,
  testingArchitecture,
  buildDeploymentDevops,
  backendDistributedSystems,
  architectureLeadership,
  emergingTechnologies,
];

export interface Category {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: CategoryIcon;
  readonly order: number;
  /** Concept ids in roadmap order (a concept may appear in several categories). */
  readonly conceptIds: readonly string[];
}

export type ConceptAvailability = "available" | "planned";

export interface Concept {
  readonly id: string;
  readonly title: string;
  /** The summary lives in `./summaries`, outside the first-load JavaScript. */
  readonly keywords: readonly string[];
  /** Categories the concept belongs to; the first is its primary category. */
  readonly categoryIds: readonly string[];
  /** `available` when an interactive learning module exists, otherwise `planned`. */
  readonly availability: ConceptAvailability;
  readonly moduleId?: string;
}

function buildCatalog(definitions: readonly CategoryDefinition[]) {
  const conceptDefinitions = new Map<string, ConceptDefinition>();
  for (const category of definitions) {
    for (const entry of category.concepts) {
      if (isConceptRef(entry)) continue;
      if (conceptDefinitions.has(entry.id)) {
        throw new Error(`Concept "${entry.id}" is defined more than once; use ref() instead.`);
      }
      conceptDefinitions.set(entry.id, entry);
    }
  }

  const membership = new Map<string, string[]>();
  const categories: Category[] = definitions.map((category) => {
    const conceptIds = category.concepts.map((entry) => {
      const id = isConceptRef(entry) ? entry.ref : entry.id;
      if (!conceptDefinitions.has(id)) {
        throw new Error(`Category "${category.id}" references unknown concept "${id}".`);
      }
      membership.set(id, [...(membership.get(id) ?? []), category.id]);
      return id;
    });
    const { concepts: _definitions, ...meta } = category;
    return { ...meta, conceptIds };
  });

  const concepts: Concept[] = [...conceptDefinitions.values()].map((definition) => ({
    id: definition.id,
    title: definition.title,
    keywords: definition.keywords ?? [],
    categoryIds: membership.get(definition.id) ?? [],
    availability: definition.moduleId ? "available" : "planned",
    ...(definition.moduleId ? { moduleId: definition.moduleId } : {}),
  }));

  return { categories, concepts };
}

const catalog = buildCatalog(categoryDefinitions);

export const categories: readonly Category[] = catalog.categories;
export const concepts: readonly Concept[] = catalog.concepts;

const categoriesById = new Map(categories.map((category) => [category.id, category]));
const conceptsById = new Map(concepts.map((concept) => [concept.id, concept]));

export function getCategory(id: string): Category | undefined {
  return categoriesById.get(id);
}

export function getConcept(id: string): Concept | undefined {
  return conceptsById.get(id);
}

/** Concepts of a category, in roadmap order. */
export function getCategoryConcepts(category: Category): readonly Concept[] {
  return category.conceptIds.flatMap((id) => conceptsById.get(id) ?? []);
}

/** The concept opened when no other is known (the first concept with a module). */
export const DEFAULT_CONCEPT_ID = "api-gateway";
