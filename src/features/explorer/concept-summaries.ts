"use client";

import { useSyncExternalStore } from "react";

/**
 * Concept summaries, loaded lazily (their own chunk, ~12 KB gzipped) the first time the
 * learner searches or opens a concept preview, so they stay out of the first-load JavaScript.
 */
export type ConceptSummaries = Readonly<Record<string, string>>;

let summaries: ConceptSummaries | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

export function loadConceptSummaries(): Promise<void> {
  loading ??= import("@/content/catalog/summaries").then(
    (module) => {
      summaries = module.conceptSummaries;
      for (const listener of listeners) listener();
    },
    (error: unknown) => {
      // Allow a later attempt (e.g. after a network hiccup); search still matches titles.
      loading = null;
      console.warn("[archiverse] Could not load concept summaries.", error);
    },
  );
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The summaries once loaded, otherwise `null`. Does not start loading by itself. */
export function useConceptSummaries(): ConceptSummaries | null {
  return useSyncExternalStore(
    subscribe,
    () => summaries,
    () => null,
  );
}
