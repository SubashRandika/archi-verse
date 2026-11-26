/**
 * Colour theme: the learner's preference and how it resolves to the theme actually shown.
 * Dark is the default (dark-first product, ADR-0010); "system" follows the computer's setting.
 */

export const THEME_PREFERENCES = ["dark", "light", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = "dark" | "light";

export const DEFAULT_THEME: ThemePreference = "dark";

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersLight: boolean,
): ResolvedTheme {
  if (preference === "system") return systemPrefersLight ? "light" : "dark";
  return preference;
}

/**
 * Runs in `<head>` before the page paints (the app is a static export, so the server cannot
 * know the theme): reads the saved preference the way `resolveTheme` does and sets
 * `data-theme` on `<html>`. Any failure (storage blocked, bad JSON) leaves it dark. The
 * storage key must match the preferences store (a test checks it).
 */
export const THEME_BOOT_SCRIPT = `(function () {
  var theme = "dark";
  try {
    var saved = JSON.parse(localStorage.getItem(${JSON.stringify("archiverse:preferences")}) || "null");
    var preference = saved && saved.state && saved.state.theme;
    if (preference === "light") theme = "light";
    else if (preference === "system" && window.matchMedia("(prefers-color-scheme: light)").matches) theme = "light";
  } catch (error) {
    theme = "dark";
  }
  document.documentElement.dataset.theme = theme;
})();`;
