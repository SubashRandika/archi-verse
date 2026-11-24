import type { CategoryDefinition } from "../types";

export const microFrontends: CategoryDefinition = {
  id: "micro-frontends",
  title: "Micro-Frontends Architecture",
  description:
    "Splitting a front-end across independent teams and deployments, and the integration, sharing and isolation problems that come with it.",
  icon: "micro-frontends",
  order: 2,
  concepts: [
    {
      id: "micro-frontend-architecture",
      title: "Micro-Frontend Architecture",
      summary:
        "Composing one product from smaller front-end applications that are owned and deployed by independent teams.",
      keywords: ["MFE", "micro frontends"],
    },
    {
      id: "module-federation",
      title: "Module Federation",
      summary:
        "A bundler feature that loads code from separately deployed builds at runtime and shares dependencies between them.",
      keywords: ["webpack", "rspack", "remote modules"],
    },
    {
      id: "native-federation",
      title: "Native Federation",
      summary:
        "Module-federation-style runtime loading built on browser-native ES modules and import maps, independent of any one bundler.",
      keywords: ["import maps", "ES modules"],
    },
    {
      id: "single-spa",
      title: "Single-SPA",
      summary:
        "A framework-agnostic router that mounts and unmounts several front-end applications on one page based on the URL.",
    },
    {
      id: "web-components",
      title: "Web Components",
      summary:
        "Browser standards (custom elements, shadow DOM and templates) for building reusable UI elements that work with any framework.",
      keywords: ["custom elements"],
    },
    {
      id: "independent-deployment",
      title: "Independent Deployment",
      summary:
        "Releasing each micro-frontend on its own schedule, without coordinating a release of the whole product.",
    },
    {
      id: "runtime-integration",
      title: "Runtime Integration",
      summary:
        "Assembling micro-frontends in the browser at runtime, instead of combining them into one bundle at build time.",
      keywords: ["build-time integration"],
    },
    {
      id: "shared-dependencies",
      title: "Shared Dependencies",
      summary:
        "Sharing libraries such as React between micro-frontends so they are downloaded once, while managing version mismatches.",
      keywords: ["singletons"],
    },
    {
      id: "cross-mfe-communication",
      title: "Cross-MFE Communication",
      summary:
        "How independent micro-frontends exchange data and events, through custom events, the URL or shared stores, without tight coupling.",
      keywords: ["custom events", "event bus"],
    },
    {
      id: "micro-frontend-routing",
      title: "Micro-Frontend Routing",
      summary:
        "Coordinating URLs between a host application and its micro-frontends, including nested and deep-linked routes.",
    },
    {
      id: "authentication-in-micro-frontends",
      title: "Authentication in Micro-Frontends",
      summary:
        "Sharing one sign-in session and its tokens securely across independently deployed front-ends.",
    },
    {
      id: "css-isolation",
      title: "CSS Isolation",
      summary:
        "Preventing styles from one micro-frontend leaking into another, with scoping, naming conventions or shadow DOM.",
    },
    {
      id: "error-isolation",
      title: "Error Isolation",
      summary:
        "Containing failures so that one broken micro-frontend degrades only its own area instead of the whole page.",
    },
  ],
};
