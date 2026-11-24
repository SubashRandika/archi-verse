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
      summary: "State owned by a single component, such as whether a dropdown is open.",
    },
    {
      id: "global-state",
      title: "Global State",
      summary:
        "State shared across distant parts of the application, such as the signed-in user or the theme.",
    },
    {
      id: "server-state",
      title: "Server State",
      summary:
        "Data that lives on the server and is cached on the client, with its own concerns: loading, staleness and refetching.",
    },
    {
      id: "url-state",
      title: "URL State",
      summary:
        "State stored in the URL path and query string, which makes views shareable, bookmarkable and safe to refresh.",
      keywords: ["query string", "search params"],
    },
    {
      id: "form-state",
      title: "Form State",
      summary:
        "The values, validation errors, touched fields and submission status of a form, often handled by a dedicated library.",
    },
    {
      id: "derived-state",
      title: "Derived State",
      summary:
        "Values computed from existing state instead of stored separately, which avoids keeping copies in sync.",
      keywords: ["computed", "selectors"],
    },
    {
      id: "unidirectional-data-flow",
      title: "Unidirectional Data Flow",
      summary:
        "Data flows down through props and changes flow up through events, which makes updates predictable.",
      keywords: ["one-way data flow"],
    },
    {
      id: "redux-architecture",
      title: "Redux Architecture",
      summary:
        "A single store that changes only when actions are dispatched to pure reducer functions, so every change is predictable and traceable.",
      keywords: ["Redux Toolkit", "reducers", "actions"],
    },
    {
      id: "react-context",
      title: "React Context",
      summary:
        "React's built-in way to pass values down the tree without prop drilling. Every consumer re-renders when the value changes.",
    },
    {
      id: "zustand",
      title: "Zustand",
      summary:
        "A small, hook-based state library with selector subscriptions that needs no provider components.",
    },
    {
      id: "tanstack-query",
      title: "TanStack Query",
      summary:
        "A server-state library that handles caching, request deduplication, background refetching and invalidation.",
      keywords: ["React Query"],
    },
    {
      id: "state-machines",
      title: "State Machines",
      summary:
        "Modelling behaviour as explicit states and allowed transitions, so impossible states cannot happen.",
      keywords: ["XState", "statecharts", "finite state machine"],
    },
    {
      id: "optimistic-updates",
      title: "Optimistic Updates",
      summary:
        "Updating the interface immediately as if a request succeeded, then rolling back if it fails.",
    },
    {
      id: "cache-invalidation",
      title: "Cache Invalidation",
      summary:
        "Deciding when cached data is no longer valid and must be refreshed or removed, famously one of the hard problems in computing.",
    },
    {
      id: "state-synchronization",
      title: "State Synchronization",
      summary:
        "Keeping state consistent between browser tabs, devices, the server and different parts of the interface.",
    },
    {
      id: "undo-and-redo",
      title: "Undo and Redo",
      summary:
        "Recording state changes or commands so people can step backwards and forwards through their edits.",
      keywords: ["history"],
    },
  ],
};
