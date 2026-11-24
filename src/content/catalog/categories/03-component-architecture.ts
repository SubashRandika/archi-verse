import type { CategoryDefinition } from "../types";

export const componentArchitecture: CategoryDefinition = {
  id: "component-architecture",
  title: "Component Architecture & Design Patterns",
  description:
    "Patterns for structuring components, and the classic design patterns that show up in everyday front-end code.",
  icon: "components",
  order: 3,
  concepts: [
    {
      id: "composition-vs-inheritance",
      title: "Composition vs Inheritance",
    },
    {
      id: "compound-components",
      title: "Compound Components",
    },
    {
      id: "controlled-vs-uncontrolled-components",
      title: "Controlled vs Uncontrolled Components",
    },
    {
      id: "container-and-presentational-components",
      title: "Container and Presentational Components",
      keywords: ["smart and dumb components"],
    },
    {
      id: "higher-order-components",
      title: "Higher-Order Components",
      keywords: ["HOC"],
    },
    {
      id: "render-props",
      title: "Render Props",
    },
    {
      id: "custom-hooks",
      title: "Custom Hooks",
    },
    {
      id: "observer-pattern",
      title: "Observer Pattern",
      keywords: ["pub/sub", "subscribe"],
    },
    {
      id: "strategy-pattern",
      title: "Strategy Pattern",
    },
    {
      id: "factory-pattern",
      title: "Factory Pattern",
    },
    {
      id: "adapter-pattern",
      title: "Adapter Pattern",
    },
    {
      id: "facade-pattern",
      title: "Facade Pattern",
    },
    {
      id: "mediator-pattern",
      title: "Mediator Pattern",
    },
    {
      id: "state-pattern",
      title: "State Pattern",
    },
    {
      id: "command-pattern",
      title: "Command Pattern",
    },
    {
      id: "headless-components",
      title: "Headless Components",
      keywords: ["unstyled", "Radix", "Base UI"],
    },
  ],
};
