"use client";

import { useSyncExternalStore } from "react";

/**
 * Responsive layout modes (desktop-first):
 * - desktop (≥1024px): sidebar | studio | inspector, all resizable
 * - tablet  (768–1023px): sidebar in a drawer; studio | inspector resizable
 * - mobile  (<768px): sidebar in a drawer, inspector in a bottom sheet
 */
export type LayoutMode = "desktop" | "tablet" | "mobile";

const DESKTOP_QUERY = "(min-width: 1024px)";
const TABLET_QUERY = "(min-width: 768px)";

function getSnapshot(): LayoutMode {
  if (window.matchMedia(DESKTOP_QUERY).matches) return "desktop";
  if (window.matchMedia(TABLET_QUERY).matches) return "tablet";
  return "mobile";
}

/** Static HTML is rendered for desktop, the primary target. */
function getServerSnapshot(): LayoutMode {
  return "desktop";
}

function subscribe(onChange: () => void): () => void {
  const queries = [window.matchMedia(DESKTOP_QUERY), window.matchMedia(TABLET_QUERY)];
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

export function useLayoutMode(): LayoutMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/**
 * `false` in the static HTML and during hydration, `true` afterwards. It flips in the same
 * render as `useLayoutMode` switches from its server snapshot to the real layout.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
