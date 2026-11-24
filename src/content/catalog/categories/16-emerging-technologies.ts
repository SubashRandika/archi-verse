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
      keywords: ["edge functions"],
    },
    {
      id: "edge-rendering",
      title: "Edge Rendering",
    },
    {
      id: "react-server-components",
      title: "React Server Components",
      keywords: ["RSC"],
    },
    {
      id: "react-server-actions",
      title: "React Server Actions",
      keywords: ["server functions", "use server"],
    },
    {
      id: "partial-hydration",
      title: "Partial Hydration",
    },
    {
      id: "resumability",
      title: "Resumability",
      keywords: ["Qwik"],
    },
    {
      id: "streaming-interfaces",
      title: "Streaming Interfaces",
    },
    {
      id: "islands-architecture",
      title: "Islands Architecture",
      keywords: ["Astro", "islands"],
    },
    {
      id: "crdt",
      title: "Conflict-Free Replicated Data Types (CRDT)",
      keywords: ["CRDT", "Yjs", "Automerge"],
    },
    {
      id: "webrtc",
      title: "WebRTC",
      keywords: ["peer-to-peer", "P2P"],
    },
    {
      id: "webgpu",
      title: "WebGPU",
    },
    ref("webassembly"),
    {
      id: "indexeddb",
      title: "IndexedDB",
      keywords: ["browser storage"],
    },
    {
      id: "offline-synchronization",
      title: "Offline Synchronization",
      keywords: ["sync", "conflict resolution"],
    },
    {
      id: "progressive-web-applications",
      title: "Progressive Web Applications (PWA)",
      keywords: ["PWA", "manifest", "installable"],
    },
    {
      id: "multi-tenant-architecture",
      title: "Multi-Tenant Architecture",
      keywords: ["tenancy", "SaaS"],
    },
    {
      id: "feature-authorization",
      title: "Feature Authorization",
      keywords: ["entitlements", "plans"],
    },
    {
      id: "ai-driven-ui",
      title: "AI-Driven UI",
      keywords: ["AI", "personalisation"],
    },
    {
      id: "generative-ui",
      title: "Generative UI",
      keywords: ["AI", "LLM"],
    },
    {
      id: "real-time-collaborative-applications",
      title: "Real-Time Collaborative Applications",
      keywords: ["multiplayer", "collaboration", "presence"],
    },
  ],
};
