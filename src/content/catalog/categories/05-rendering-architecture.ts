import type { CategoryDefinition } from "../types";

export const renderingArchitecture: CategoryDefinition = {
  id: "rendering-architecture",
  title: "Rendering Architecture & Browser Internals",
  description:
    "How browsers turn code into pixels, how JavaScript work is scheduled, and the rendering strategies frameworks build on top.",
  icon: "rendering",
  order: 5,
  concepts: [
    {
      id: "dom-and-cssom",
      title: "DOM and CSSOM",
    },
    {
      id: "critical-rendering-path",
      title: "Critical Rendering Path",
      keywords: ["render-blocking"],
    },
    {
      id: "javascript-event-loop",
      title: "JavaScript Event Loop",
    },
    {
      id: "microtasks-and-macrotasks",
      title: "Microtasks and Macrotasks",
      keywords: ["task queue", "promises", "setTimeout"],
    },
    {
      id: "browser-rendering-pipeline",
      title: "Browser Rendering Pipeline",
    },
    {
      id: "layout-paint-and-composite",
      title: "Layout, Paint, and Composite",
      keywords: ["reflow", "repaint"],
    },
    {
      id: "virtual-dom",
      title: "Virtual DOM",
      keywords: ["VDOM"],
    },
    {
      id: "react-reconciliation",
      title: "React Reconciliation",
      keywords: ["diffing", "keys"],
    },
    {
      id: "react-fiber",
      title: "React Fiber",
    },
    {
      id: "concurrent-rendering",
      title: "Concurrent Rendering",
      keywords: ["transitions", "useTransition"],
    },
    {
      id: "hydration",
      title: "Hydration",
    },
    {
      id: "server-side-rendering",
      title: "Server-Side Rendering (SSR)",
      keywords: ["SSR"],
    },
    {
      id: "client-side-rendering",
      title: "Client-Side Rendering (CSR)",
      keywords: ["CSR", "SPA"],
    },
    {
      id: "static-site-generation",
      title: "Static Site Generation (SSG)",
      keywords: ["SSG", "pre-rendering"],
    },
    {
      id: "incremental-static-regeneration",
      title: "Incremental Static Regeneration (ISR)",
      keywords: ["ISR", "revalidate"],
    },
    {
      id: "streaming-ssr",
      title: "Streaming SSR",
      keywords: ["Suspense", "streaming"],
    },
    {
      id: "web-workers",
      title: "Web Workers",
      keywords: ["threads", "postMessage"],
    },
    {
      id: "service-workers",
      title: "Service Workers",
    },
    {
      id: "webassembly",
      title: "WebAssembly",
      keywords: ["Wasm"],
    },
  ],
};
