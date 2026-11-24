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
        playbackSpeed: 1.5,
        panelLayouts: { "shell-desktop": { sidebar: 500 } },
        lastConceptId: "jwt",
      }),
    ).toEqual({
      explanationLevel: "beginner",
      playbackSpeed: 1.5,
      panelLayouts: {},
      lastConceptId: "jwt",
    });
  });

  it("rejects unsupported playback speeds", () => {
    expect(parsePersistedPreferences({ playbackSpeed: 3 }).playbackSpeed).toBe(1);
  });

  it("returns defaults for missing data", () => {
    expect(parsePersistedPreferences(undefined)).toMatchObject({
      explanationLevel: "beginner",
      playbackSpeed: 1,
    });
  });
});
