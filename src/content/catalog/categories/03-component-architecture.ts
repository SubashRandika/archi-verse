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
      summary:
        "Building behaviour by combining small components rather than extending class hierarchies, the approach React favours.",
    },
    {
      id: "compound-components",
      title: "Compound Components",
      summary:
        "A set of components that work together through shared implicit state, such as a Tabs component with its list and panels.",
    },
    {
      id: "controlled-vs-uncontrolled-components",
      title: "Controlled vs Uncontrolled Components",
      summary:
        "Whether a component's state is owned by its parent (controlled) or kept internally (uncontrolled), and when to choose each.",
    },
    {
      id: "container-and-presentational-components",
      title: "Container and Presentational Components",
      summary:
        "Separating components that fetch and manage data from components that only render what they are given.",
      keywords: ["smart and dumb components"],
    },
    {
      id: "higher-order-components",
      title: "Higher-Order Components",
      summary:
        "Functions that take a component and return an enhanced one, a reuse pattern now largely replaced by hooks.",
      keywords: ["HOC"],
    },
    {
      id: "render-props",
      title: "Render Props",
      summary: "Sharing behaviour by passing a function that tells a component what to render.",
    },
    {
      id: "custom-hooks",
      title: "Custom Hooks",
      summary:
        "Extracting reusable stateful logic into functions whose names start with “use”, shared across components.",
    },
    {
      id: "observer-pattern",
      title: "Observer Pattern",
      summary:
        "Objects subscribe to a subject and are notified when it changes, the basis of event emitters and state stores.",
      keywords: ["pub/sub", "subscribe"],
    },
    {
      id: "strategy-pattern",
      title: "Strategy Pattern",
      summary:
        "Choosing an algorithm at runtime by swapping interchangeable implementations behind one interface.",
    },
    {
      id: "factory-pattern",
      title: "Factory Pattern",
      summary:
        "Centralising object or component creation so callers ask for what they need without knowing how it is built.",
    },
    {
      id: "adapter-pattern",
      title: "Adapter Pattern",
      summary:
        "Wrapping an incompatible interface so it matches the one your code expects, such as normalising third-party API responses.",
    },
    {
      id: "facade-pattern",
      title: "Facade Pattern",
      summary:
        "A simple interface in front of a complex subsystem, hiding the details the caller does not need.",
    },
    {
      id: "mediator-pattern",
      title: "Mediator Pattern",
      summary:
        "A central object coordinates communication between components, so they never reference each other directly.",
    },
    {
      id: "state-pattern",
      title: "State Pattern",
      summary:
        "An object changes its behaviour when its internal state changes, usually modelled as explicit states and transitions.",
    },
    {
      id: "command-pattern",
      title: "Command Pattern",
      summary:
        "Encapsulating an action as an object, which makes it possible to queue, log and undo it.",
    },
    {
      id: "headless-components",
      title: "Headless Components",
      summary:
        "Components that provide behaviour and accessibility without any styling, leaving the markup and look to you.",
      keywords: ["unstyled", "Radix", "Base UI"],
    },
  ],
};
