import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/lib/locale";
import { isOneOf, isRecord, isRecordOf, isString } from "@/lib/validate";

/**
 * Learner preferences, persisted to localStorage (ADR-0004). Each field is validated on load
 * independently and falls back to its default, so one bad value never resets the others.
 */

export const PREFERENCES_STORAGE_KEY = "archiverse:preferences";
export const PREFERENCES_STORAGE_VERSION = 1;

export const EXPLANATION_LEVELS = ["beginner", "advanced"] as const;
export type ExplanationLevel = (typeof EXPLANATION_LEVELS)[number];

export const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

/** Panel id → size in percent, as reported by react-resizable-panels. */
export type PanelLayout = Readonly<Record<string, number>>;

const DEFAULTS = {
  explanationLevel: "beginner" as ExplanationLevel,
  locale: DEFAULT_LOCALE as Locale,
  playbackSpeed: 1 as PlaybackSpeed,
  panelLayouts: {} as Readonly<Record<string, PanelLayout>>,
  lastConceptId: undefined as string | undefined,
};

const isPercent = (value: unknown): value is number =>
  typeof value === "number" && value >= 0 && value <= 100;
const isPanelLayout = (value: unknown): value is PanelLayout => isRecordOf(value, isPercent);

export function parsePersistedPreferences(value: unknown): typeof DEFAULTS {
  const saved = value ?? {};
  if (!isRecord(saved)) {
    console.warn("[archiverse] Ignoring unreadable saved preferences.");
    return DEFAULTS;
  }
  return {
    explanationLevel: isOneOf(EXPLANATION_LEVELS, saved.explanationLevel)
      ? saved.explanationLevel
      : DEFAULTS.explanationLevel,
    locale: isOneOf(LOCALES, saved.locale) ? saved.locale : DEFAULTS.locale,
    playbackSpeed: isOneOf(PLAYBACK_SPEEDS, saved.playbackSpeed)
      ? saved.playbackSpeed
      : DEFAULTS.playbackSpeed,
    panelLayouts: isRecordOf(saved.panelLayouts, isPanelLayout)
      ? saved.panelLayouts
      : DEFAULTS.panelLayouts,
    lastConceptId: isString(saved.lastConceptId) ? saved.lastConceptId : undefined,
  };
}

interface PreferencesState {
  explanationLevel: ExplanationLevel;
  /** Language of the learning content and the studio. */
  locale: Locale;
  playbackSpeed: PlaybackSpeed;
  panelLayouts: Readonly<Record<string, PanelLayout>>;
  lastConceptId: string | undefined;
  setExplanationLevel: (level: ExplanationLevel) => void;
  setLocale: (locale: Locale) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setPanelLayout: (groupId: string, layout: PanelLayout) => void;
  setLastConceptId: (conceptId: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setExplanationLevel: (explanationLevel) => set({ explanationLevel }),
      setLocale: (locale) => set({ locale }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setPanelLayout: (groupId, layout) =>
        set((state) => ({ panelLayouts: { ...state.panelLayouts, [groupId]: layout } })),
      setLastConceptId: (lastConceptId) => set({ lastConceptId }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      version: PREFERENCES_STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ explanationLevel, locale, playbackSpeed, panelLayouts, lastConceptId }) => ({
        explanationLevel,
        locale,
        playbackSpeed,
        panelLayouts,
        lastConceptId,
      }),
      migrate: (persisted) => persisted,
      merge: (persisted, current) => ({ ...current, ...parsePersistedPreferences(persisted) }),
    },
  ),
);
