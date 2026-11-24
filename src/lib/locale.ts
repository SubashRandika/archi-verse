/**
 * Languages of the learning content and the studio. English is the default; Sinhala text keeps
 * technical terms in English (Phase 5 decision). The sidebar and catalog stay English for now.
 */
export const LOCALES = ["en", "si"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Each language's name, written in that language (for the language switch). */
export const LOCALE_NAMES: Readonly<Record<Locale, string>> = {
  en: "English",
  si: "සිංහල",
};
