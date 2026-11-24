"use client";

import type { Locale } from "@/lib/locale";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { STUDIO_STRINGS, type StudioStrings } from "./strings";

/** The learner's language (English until saved preferences say otherwise). */
export function useLocale(): Locale {
  return usePreferencesStore((state) => state.locale);
}

/** The studio's interface strings in the learner's language. */
export function useStrings(): StudioStrings {
  return STUDIO_STRINGS[useLocale()];
}
