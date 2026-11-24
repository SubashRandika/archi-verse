import * as z from "zod/mini";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/lib/locale";

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

const persistedPreferencesSchema = z.object({
  explanationLevel: z.catch(z.enum(EXPLANATION_LEVELS), DEFAULTS.explanationLevel),
  locale: z.catch(z.enum(LOCALES), DEFAULTS.locale),
  playbackSpeed: z.catch(
    z.number().check(z.refine((value) => (PLAYBACK_SPEEDS as readonly number[]).includes(value))),
    DEFAULTS.playbackSpeed,
  ),
  panelLayouts: z.catch(
    z.record(z.string(), z.record(z.string(), z.number().check(z.minimum(0), z.maximum(100)))),
    DEFAULTS.panelLayouts,
  ),
  lastConceptId: z.catch(z.optional(z.string()), undefined),
});

export function parsePersistedPreferences(value: unknown): typeof DEFAULTS {
  const parsed = persistedPreferencesSchema.safeParse(value ?? {});
  if (!parsed.success) {
    console.warn("[archiverse] Ignoring unreadable saved preferences.");
    return DEFAULTS;
  }
  return {
    explanationLevel: parsed.data.explanationLevel,
    locale: parsed.data.locale,
    playbackSpeed: parsed.data.playbackSpeed as PlaybackSpeed,
    panelLayouts: parsed.data.panelLayouts,
    lastConceptId: parsed.data.lastConceptId,
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
