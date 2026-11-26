"use client";

import { useSyncExternalStore } from "react";
import { type ResolvedTheme, resolveTheme } from "@/lib/theme";
import { usePreferencesStore } from "./preferences-store";

const LIGHT_QUERY = "(prefers-color-scheme: light)";

function subscribeToSystem(onChange: () => void) {
  const query = window.matchMedia(LIGHT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const subscribeToHydration = (onChange: () => void) =>
  usePreferencesStore.persist.onFinishHydration(onChange);

/** True once the saved preferences have been loaded (they load after hydration). */
export function usePreferencesHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => usePreferencesStore.persist.hasHydrated(),
    () => false,
  );
}

/**
 * The theme on screen. Until the saved preferences load, it trusts the attribute the boot
 * script set, so nothing flips back to dark for a moment.
 */
export function useResolvedTheme(): ResolvedTheme {
  const preference = usePreferencesStore((state) => state.theme);
  const hydrated = usePreferencesHydrated();
  const systemLight = useSyncExternalStore(
    subscribeToSystem,
    () => window.matchMedia(LIGHT_QUERY).matches,
    () => false,
  );
  if (!hydrated) {
    return typeof document !== "undefined" && document.documentElement.dataset.theme === "light"
      ? "light"
      : "dark";
  }
  return resolveTheme(preference, systemLight);
}
