import { type CategoryDefinition, ref } from "../types";

export const emergingTechnologies: CategoryDefinition = {
  id: "emerging-technologies",
  title: "Advanced & Emerging Technologies",
  description:
    "Newer rendering models, platform capabilities and application patterns that are changing how front-ends are built.",
  icon: "emerging",
  order: 16,
  concepts: [
    {
      id: "edge-computing",
      title: "Edge Computing",
      summary: "Running code at network locations close to users instead of in one central region.",
      keywords: ["edge functions"],
    },
    {
      id: "edge-rendering",
      title: "Edge Rendering",
      summary:
        "Rendering HTML at edge locations, for lower latency and personalisation close to the user.",
    },
    {
      id: "react-server-components",
      title: "React Server Components",
      summary:
        "Components that render only on the server and send their output, not their code, to the browser.",
      keywords: ["RSC"],
    },
    {
      id: "react-server-actions",
      title: "React Server Actions",
      summary:
        "Async functions that run on the server and can be called directly from client components and forms.",
      keywords: ["server functions", "use server"],
    },
    {
      id: "partial-hydration",
      title: "Partial Hydration",
      summary:
        "Hydrating only the interactive parts of a server-rendered page and leaving the rest as plain HTML.",
    },
    {
      id: "resumability",
      title: "Resumability",
      summary:
        "Continuing an application in the browser from state serialised on the server, without re-running its components first, as Qwik does.",
      keywords: ["Qwik"],
    },
    {
      id: "streaming-interfaces",
      title: "Streaming Interfaces",
      summary:
        "Interfaces that render data as it arrives in a stream, such as streamed server output or AI responses.",
    },
    {
      id: "islands-architecture",
      title: "Islands Architecture",
      summary:
        "Mostly static pages with isolated interactive “islands” that load and hydrate independently, as in Astro.",
      keywords: ["Astro", "islands"],
    },
    {
      id: "crdt",
      title: "Conflict-Free Replicated Data Types (CRDT)",
      summary:
        "Data structures that several replicas can edit at the same time and that always merge without conflicts.",
      keywords: ["CRDT", "Yjs", "Automerge"],
    },
    {
      id: "webrtc",
      title: "WebRTC",
      summary: "Browser APIs for real-time, peer-to-peer audio, video and data connections.",
      keywords: ["peer-to-peer", "P2P"],
    },
    {
      id: "webgpu",
      title: "WebGPU",
      summary:
        "A modern browser API for high-performance GPU graphics and general-purpose compute.",
    },
    ref("webassembly"),
    {
      id: "indexeddb",
      title: "IndexedDB",
      summary:
        "A transactional, asynchronous browser database for storing large amounts of structured data.",
      keywords: ["browser storage"],
    },
    {
      id: "offline-synchronization",
      title: "Offline Synchronization",
      summary:
        "Keeping data editable offline and reconciling local and server changes when the connection returns.",
      keywords: ["sync", "conflict resolution"],
    },
    {
      id: "progressive-web-applications",
      title: "Progressive Web Applications (PWA)",
      summary:
        "Web apps that can be installed and work offline, using a web app manifest and a service worker.",
      keywords: ["PWA", "manifest", "installable"],
    },
    {
      id: "multi-tenant-architecture",
      title: "Multi-Tenant Architecture",
      summary:
        "Serving many customers (tenants) from one system while keeping their data, configuration and limits isolated.",
      keywords: ["tenancy", "SaaS"],
    },
    {
      id: "feature-authorization",
      title: "Feature Authorization",
      summary:
        "Controlling which users, roles or plans can use which features, often combined with feature flags.",
      keywords: ["entitlements", "plans"],
    },
    {
      id: "ai-driven-ui",
      title: "AI-Driven UI",
      summary:
        "Interfaces that use AI models to adapt their content, layout or behaviour to each user.",
      keywords: ["AI", "personalisation"],
    },
    {
      id: "generative-ui",
      title: "Generative UI",
      summary:
        "Interfaces whose components are generated or chosen by an AI model at runtime, in response to what the user wants.",
      keywords: ["AI", "LLM"],
    },
    {
      id: "real-time-collaborative-applications",
      title: "Real-Time Collaborative Applications",
      summary:
        "Applications where several people edit the same content at the same time, such as shared documents and whiteboards.",
      keywords: ["multiplayer", "collaboration", "presence"],
    },
  ],
};
