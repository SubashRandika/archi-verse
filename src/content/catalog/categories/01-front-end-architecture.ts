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
      summary:
        "A single front-end codebase built and deployed as one unit. Simple to start with, but harder to scale across many teams.",
    },
    {
      id: "modular-front-end-architecture",
      title: "Modular Front-End Architecture",
      summary:
        "Splitting one application into well-bounded modules with explicit public APIs, so parts can change independently without separate deployments.",
    },
    {
      id: "layered-architecture",
      title: "Layered Architecture",
      summary:
        "Organising code into horizontal layers, such as UI, application logic and data access, where each layer only depends on the one below it.",
      keywords: ["n-tier"],
    },
    {
      id: "clean-architecture",
      title: "Clean Architecture",
      summary:
        "Keeping business rules at the centre, independent of frameworks, UI and data sources, with dependencies always pointing inwards.",
    },
    {
      id: "hexagonal-architecture",
      title: "Hexagonal Architecture",
      summary:
        "The core defines interfaces (ports) and the outside world plugs in through adapters, so infrastructure can be swapped or faked in tests.",
      keywords: ["ports and adapters"],
    },
    {
      id: "domain-driven-design",
      title: "Domain-Driven Design (DDD)",
      summary:
        "Modelling software around the business domain, with a shared language and bounded contexts that set clear ownership boundaries.",
      keywords: ["DDD", "bounded context", "ubiquitous language"],
    },
    {
      id: "solid-principles",
      title: "SOLID Principles",
      summary:
        "Five design principles: single responsibility, open/closed, Liskov substitution, interface segregation and dependency inversion.",
    },
    {
      id: "dependency-injection",
      title: "Dependency Injection",
      summary:
        "Supplying a component's dependencies from outside instead of creating them inside, which decouples code and makes it easy to test.",
      keywords: ["DI", "inversion of control", "IoC"],
    },
    {
      id: "feature-based-architecture",
      title: "Feature-Based Architecture",
      summary:
        "Grouping code by feature, with everything for “checkout” in one place, rather than by technical type, so a change touches one folder.",
      keywords: ["feature folders", "vertical slices"],
    },
    {
      id: "component-driven-architecture",
      title: "Component-Driven Architecture",
      summary:
        "Building interfaces bottom-up from isolated, reusable components that are developed, tested and documented on their own.",
    },
    {
      id: "application-shell-architecture",
      title: "Application Shell Architecture",
      summary:
        "Loading a minimal, cached shell (navigation and layout) first and filling in the content afterwards, for fast and reliable start-up.",
      keywords: ["app shell", "PWA"],
    },
    {
      id: "plugin-based-architecture",
      title: "Plugin-Based Architecture",
      summary:
        "A stable core that exposes extension points, so new capabilities are added as plugins without modifying the core.",
      keywords: ["extensions"],
    },
    {
      id: "architecture-decision-records",
      title: "Architecture Decision Records (ADR)",
      summary:
        "Short documents that capture an important decision: its context, the options considered and the consequences.",
      keywords: ["ADR"],
    },
  ],
};
