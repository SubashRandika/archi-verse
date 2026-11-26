import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import {
  parsePersistedPreferences,
  PREFERENCES_STORAGE_KEY,
  usePreferencesStore,
} from "./preferences-store";

describe("preferences store", () => {
  beforeEach(() => localStorage.clear());

  it("persists the explanation level and playback speed", () => {
    usePreferencesStore.getState().setExplanationLevel("advanced");
    usePreferencesStore.getState().setPlaybackSpeed(1.5);
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? "null");
    expect(saved.state).toMatchObject({ explanationLevel: "advanced", playbackSpeed: 1.5 });
  });

  it("persists the theme", () => {
    usePreferencesStore.getState().setTheme("light");
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? "null");
    expect(saved.state.theme).toBe("light");
  });

  it("shares its storage key with the theme boot script", () => {
    expect(THEME_BOOT_SCRIPT).toContain(JSON.stringify(PREFERENCES_STORAGE_KEY));
  });

  it("stores panel layouts per group", () => {
    const store = usePreferencesStore.getState();
    store.setPanelLayout("shell-desktop", { sidebar: 20, studio: 55, inspector: 25 });
    store.setPanelLayout("shell-tablet", { studio: 60, inspector: 40 });
    expect(usePreferencesStore.getState().panelLayouts).toEqual({
      "shell-desktop": { sidebar: 20, studio: 55, inspector: 25 },
      "shell-tablet": { studio: 60, inspector: 40 },
    });
  });
});

describe("parsePersistedPreferences", () => {
  it("falls back per field, keeping the valid ones", () => {
    expect(
      parsePersistedPreferences({
        explanationLevel: "expert",
        locale: "fr",
        playbackSpeed: 1.5,
        panelLayouts: { "shell-desktop": { sidebar: 500 } },
        lastConceptId: "jwt",
      }),
    ).toEqual({
      explanationLevel: "beginner",
      locale: "en",
      playbackSpeed: 1.5,
      panelLayouts: {},
      lastConceptId: "jwt",
      theme: "dark",
    });
  });

  it("rejects an unknown theme and keeps the other fields", () => {
    expect(parsePersistedPreferences({ theme: "blue", locale: "si" })).toMatchObject({
      theme: "dark",
      locale: "si",
    });
  });

  it("defaults the theme to dark", () => {
    expect(parsePersistedPreferences(undefined).theme).toBe("dark");
  });

  it("keeps a saved language", () => {
    expect(parsePersistedPreferences({ locale: "si" }).locale).toBe("si");
  });

  it("rejects unsupported playback speeds", () => {
    expect(parsePersistedPreferences({ playbackSpeed: 3 }).playbackSpeed).toBe(1);
  });

  it("returns defaults for missing data", () => {
    expect(parsePersistedPreferences(undefined)).toMatchObject({
      explanationLevel: "beginner",
      locale: "en",
      playbackSpeed: 1,
    });
  });
});
