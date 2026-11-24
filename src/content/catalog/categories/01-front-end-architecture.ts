import type { CategoryDefinition } from "../types";

export const frontEndArchitecture: CategoryDefinition = {
  id: "front-end-architecture",
  title: "Front-End Architecture & Application Design",
  description:
    "How a front-end codebase is structured: the layers, boundaries and principles that keep a large application easy to change as it grows.",
  icon: "front-end",
  order: 1,
  concepts: [
    {
      id: "monolithic-front-end-architecture",
      title: "Monolithic Front-End Architecture",
    },
    {
      id: "modular-front-end-architecture",
      title: "Modular Front-End Architecture",
    },
    {
      id: "layered-architecture",
      title: "Layered Architecture",
      keywords: ["n-tier"],
    },
    {
      id: "clean-architecture",
      title: "Clean Architecture",
    },
    {
      id: "hexagonal-architecture",
      title: "Hexagonal Architecture",
      keywords: ["ports and adapters"],
    },
    {
      id: "domain-driven-design",
      title: "Domain-Driven Design (DDD)",
      keywords: ["DDD", "bounded context", "ubiquitous language"],
    },
    {
      id: "solid-principles",
      title: "SOLID Principles",
    },
    {
      id: "dependency-injection",
      title: "Dependency Injection",
      keywords: ["DI", "inversion of control", "IoC"],
    },
    {
      id: "feature-based-architecture",
      title: "Feature-Based Architecture",
      keywords: ["feature folders", "vertical slices"],
    },
    {
      id: "component-driven-architecture",
      title: "Component-Driven Architecture",
    },
    {
      id: "application-shell-architecture",
      title: "Application Shell Architecture",
      keywords: ["app shell", "PWA"],
    },
    {
      id: "plugin-based-architecture",
      title: "Plugin-Based Architecture",
      keywords: ["extensions"],
    },
    {
      id: "architecture-decision-records",
      title: "Architecture Decision Records (ADR)",
      keywords: ["ADR"],
    },
  ],
};
