/**
 * The 16 learning categories of the roadmap (CLAUDE.md §6).
 *
 * Phase 2 defines identity, order and icon only. Phase 3 adds descriptions and concepts.
 * `icon` is a semantic key — the UI layer maps it to an actual icon component, so this
 * module stays free of React (see docs/ARCHITECTURE.md → dependency rules).
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

export interface Category {
  /** Stable kebab-case identifier, also used in URLs. */
  readonly id: string;
  readonly title: string;
  readonly icon: CategoryIcon;
  /** Position in the roadmap (1-based). */
  readonly order: number;
}

export const categories: readonly Category[] = [
  {
    id: "front-end-architecture",
    title: "Front-End Architecture & Application Design",
    icon: "front-end",
    order: 1,
  },
  {
    id: "micro-frontends",
    title: "Micro-Frontends Architecture",
    icon: "micro-frontends",
    order: 2,
  },
  {
    id: "component-architecture",
    title: "Component Architecture & Design Patterns",
    icon: "components",
    order: 3,
  },
  { id: "state-management", title: "State Management & Data Flow", icon: "state", order: 4 },
  {
    id: "rendering-architecture",
    title: "Rendering Architecture & Browser Internals",
    icon: "rendering",
    order: 5,
  },
  {
    id: "performance-engineering",
    title: "Performance Engineering & Scalability",
    icon: "performance",
    order: 6,
  },
  {
    id: "api-communication",
    title: "API Integration & Communication Architecture",
    icon: "api",
    order: 7,
  },
  { id: "security-architecture", title: "Security Architecture", icon: "security", order: 8 },
  { id: "caching-architecture", title: "Caching Architecture", icon: "caching", order: 9 },
  {
    id: "resilience-reliability",
    title: "Resilience, Reliability & Fault Tolerance",
    icon: "resilience",
    order: 10,
  },
  {
    id: "design-systems",
    title: "Design Systems & UI Platform Architecture",
    icon: "design-systems",
    order: 11,
  },
  {
    id: "testing-architecture",
    title: "Testing Architecture & Quality Engineering",
    icon: "testing",
    order: 12,
  },
  {
    id: "build-deployment-devops",
    title: "Build, Deployment & DevOps Architecture",
    icon: "devops",
    order: 13,
  },
  {
    id: "backend-distributed-systems",
    title: "Backend & Distributed Systems Fundamentals",
    icon: "backend",
    order: 14,
  },
  {
    id: "architecture-leadership",
    title: "Architecture Leadership & Technical Decision-Making",
    icon: "leadership",
    order: 15,
  },
  {
    id: "emerging-technologies",
    title: "Advanced & Emerging Technologies",
    icon: "emerging",
    order: 16,
  },
];
