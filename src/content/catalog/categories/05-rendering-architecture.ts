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
      summary:
        "The browser's tree representations of the HTML document and its styles, combined to decide what to render.",
    },
    {
      id: "critical-rendering-path",
      title: "Critical Rendering Path",
      summary:
        "The steps from receiving HTML, CSS and JavaScript to the first pixels on screen, and what blocks them.",
      keywords: ["render-blocking"],
    },
    {
      id: "javascript-event-loop",
      title: "JavaScript Event Loop",
      summary:
        "How a single-threaded JavaScript runtime takes turns between the call stack, its task queues and rendering.",
    },
    {
      id: "microtasks-and-macrotasks",
      title: "Microtasks and Macrotasks",
      summary:
        "Two kinds of queued work: promise callbacks run before the next task, while timers and events run as separate tasks.",
      keywords: ["task queue", "promises", "setTimeout"],
    },
    {
      id: "browser-rendering-pipeline",
      title: "Browser Rendering Pipeline",
      summary:
        "The stages the browser runs to produce each frame: style, layout, paint and compositing.",
    },
    {
      id: "layout-paint-and-composite",
      title: "Layout, Paint, and Composite",
      summary: "The three costliest rendering stages, and which CSS changes trigger each of them.",
      keywords: ["reflow", "repaint"],
    },
    {
      id: "virtual-dom",
      title: "Virtual DOM",
      summary:
        "An in-memory description of the interface that a framework compares between renders to compute minimal DOM updates.",
      keywords: ["VDOM"],
    },
    {
      id: "react-reconciliation",
      title: "React Reconciliation",
      summary:
        "How React compares the previous and next element trees to decide what to update, keep or replace.",
      keywords: ["diffing", "keys"],
    },
    {
      id: "react-fiber",
      title: "React Fiber",
      summary:
        "React's internal architecture, which splits rendering into small units of work that can be paused and prioritised.",
    },
    {
      id: "concurrent-rendering",
      title: "Concurrent Rendering",
      summary:
        "React rendering that can be interrupted and prioritised, so urgent updates stay responsive during heavy work.",
      keywords: ["transitions", "useTransition"],
    },
    {
      id: "hydration",
      title: "Hydration",
      summary:
        "Attaching event handlers and state to server-rendered HTML so it becomes interactive in the browser.",
    },
    {
      id: "server-side-rendering",
      title: "Server-Side Rendering (SSR)",
      summary:
        "Rendering HTML on the server for each request, so users and crawlers get content before JavaScript runs.",
      keywords: ["SSR"],
    },
    {
      id: "client-side-rendering",
      title: "Client-Side Rendering (CSR)",
      summary:
        "Rendering the interface in the browser with JavaScript, starting from an almost empty HTML document.",
      keywords: ["CSR", "SPA"],
    },
    {
      id: "static-site-generation",
      title: "Static Site Generation (SSG)",
      summary: "Rendering pages to HTML at build time and serving them as static files.",
      keywords: ["SSG", "pre-rendering"],
    },
    {
      id: "incremental-static-regeneration",
      title: "Incremental Static Regeneration (ISR)",
      summary:
        "Serving statically generated pages while regenerating them in the background after a set time or on demand.",
      keywords: ["ISR", "revalidate"],
    },
    {
      id: "streaming-ssr",
      title: "Streaming SSR",
      summary:
        "Sending server-rendered HTML in chunks as each part becomes ready, so the browser can show content earlier.",
      keywords: ["Suspense", "streaming"],
    },
    {
      id: "web-workers",
      title: "Web Workers",
      summary: "Running JavaScript on background threads to keep heavy work off the main thread.",
      keywords: ["threads", "postMessage"],
    },
    {
      id: "service-workers",
      title: "Service Workers",
      summary:
        "A background script between the page and the network that enables offline support, caching and push notifications.",
    },
    {
      id: "webassembly",
      title: "WebAssembly",
      summary:
        "A compact binary format that runs code compiled from languages such as Rust or C++ at near-native speed alongside JavaScript.",
      keywords: ["Wasm"],
    },
  ],
};
