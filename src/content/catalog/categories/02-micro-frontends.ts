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
      keywords: ["MFE", "micro frontends"],
    },
    {
      id: "module-federation",
      title: "Module Federation",
      keywords: ["webpack", "rspack", "remote modules"],
    },
    {
      id: "native-federation",
      title: "Native Federation",
      keywords: ["import maps", "ES modules"],
    },
    {
      id: "single-spa",
      title: "Single-SPA",
    },
    {
      id: "web-components",
      title: "Web Components",
      keywords: ["custom elements"],
    },
    {
      id: "independent-deployment",
      title: "Independent Deployment",
    },
    {
      id: "runtime-integration",
      title: "Runtime Integration",
      keywords: ["build-time integration"],
    },
    {
      id: "shared-dependencies",
      title: "Shared Dependencies",
      keywords: ["singletons"],
    },
    {
      id: "cross-mfe-communication",
      title: "Cross-MFE Communication",
      keywords: ["custom events", "event bus"],
    },
    {
      id: "micro-frontend-routing",
      title: "Micro-Frontend Routing",
    },
    {
      id: "authentication-in-micro-frontends",
      title: "Authentication in Micro-Frontends",
    },
    {
      id: "css-isolation",
      title: "CSS Isolation",
    },
    {
      id: "error-isolation",
      title: "Error Isolation",
    },
  ],
};
