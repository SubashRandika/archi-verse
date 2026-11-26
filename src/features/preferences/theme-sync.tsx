"use client";

import { useEffect } from "react";
import type { ResolvedTheme } from "@/lib/theme";
import { usePreferencesHydrated, useResolvedTheme } from "./use-resolved-theme";

/** Browser chrome colour per theme (the `--hull` token). */
const THEME_COLOR: Record<ResolvedTheme, string> = { dark: "#0c1420", light: "#eef2f8" };

/**
 * Keeps `<html data-theme>` and the browser's theme colour in step with the learner's choice
 * and, for "system", with the computer's setting. Rendered once, in the root layout. It waits
 * for the saved preferences, so it never overrides the boot script with the default.
 */
export function ThemeSync() {
  const theme = useResolvedTheme();
  const hydrated = usePreferencesHydrated();

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme, hydrated]);

  return null;
}
