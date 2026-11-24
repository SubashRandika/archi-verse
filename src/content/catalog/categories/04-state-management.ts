import type { CategoryDefinition } from "../types";

export const stateManagement: CategoryDefinition = {
  id: "state-management",
  title: "State Management & Data Flow",
  description:
    "Where application state lives, how it flows through the interface, and how it stays consistent with the server.",
  icon: "state",
  order: 4,
  concepts: [
    {
      id: "local-state",
      title: "Local State",
    },
    {
      id: "global-state",
      title: "Global State",
    },
    {
      id: "server-state",
      title: "Server State",
    },
    {
      id: "url-state",
      title: "URL State",
      keywords: ["query string", "search params"],
    },
    {
      id: "form-state",
      title: "Form State",
    },
    {
      id: "derived-state",
      title: "Derived State",
      keywords: ["computed", "selectors"],
    },
    {
      id: "unidirectional-data-flow",
      title: "Unidirectional Data Flow",
      keywords: ["one-way data flow"],
    },
    {
      id: "redux-architecture",
      title: "Redux Architecture",
      keywords: ["Redux Toolkit", "reducers", "actions"],
    },
    {
      id: "react-context",
      title: "React Context",
    },
    {
      id: "zustand",
      title: "Zustand",
    },
    {
      id: "tanstack-query",
      title: "TanStack Query",
      keywords: ["React Query"],
    },
    {
      id: "state-machines",
      title: "State Machines",
      keywords: ["XState", "statecharts", "finite state machine"],
    },
    {
      id: "optimistic-updates",
      title: "Optimistic Updates",
    },
    {
      id: "cache-invalidation",
      title: "Cache Invalidation",
    },
    {
      id: "state-synchronization",
      title: "State Synchronization",
    },
    {
      id: "undo-and-redo",
      title: "Undo and Redo",
      keywords: ["history"],
    },
  ],
};
