"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  PREFERENCES_STORAGE_KEY,
  usePreferencesStore,
} from "@/features/preferences/preferences-store";
import { PROGRESS_STORAGE_KEY, useProgressStore } from "./progress-store";

interface PersistedStore {
  persist: {
    rehydrate: () => Promise<void> | void;
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
    getOptions: () => { name?: string };
  };
}

const stores: readonly PersistedStore[] = [useProgressStore, usePreferencesStore];

/**
 * Loads persisted state after hydration (the stores use `skipHydration`, so the first client
 * render matches the static HTML) and keeps it in sync when another tab changes it.
 * Rendered once, in the root layout.
 */
export function PersistedStateSync() {
  useEffect(() => {
    for (const store of stores) void store.persist.rehydrate();

    const onStorage = (event: StorageEvent) => {
      if (event.key === PROGRESS_STORAGE_KEY) void useProgressStore.persist.rehydrate();
      if (event.key === PREFERENCES_STORAGE_KEY) void usePreferencesStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}

/** `true` once the store has loaded its persisted state (always `false` on the server). */
export function useHasHydrated(store: PersistedStore): boolean {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
