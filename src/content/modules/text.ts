import { LOCALES, type Locale } from "@/lib/locale";
import { apiGatewayText } from "./api-gateway/text";
import type { LocaleText, ModuleLabels, ModuleText } from "./types";

/**
 * Module text by module id. SERVER ONLY: import this from route files in `src/app/` and pass
 * what a page needs as props. ESLint forbids importing it from features and components, so the
 * text travels as route data instead of client JavaScript.
 */
const texts: Readonly<Record<string, ModuleText>> = {
  "api-gateway": apiGatewayText,
};

export function getModuleText(id: string | undefined): ModuleText | undefined {
  return id ? texts[id] : undefined;
}

function labelsOf(text: LocaleText): ModuleLabels {
  return {
    chapters: text.chapters,
    scenarios: text.scenarios,
    steps: Object.fromEntries(Object.entries(text.steps).map(([id, step]) => [id, step.title])),
  };
}

/** Just the titles (chapters, scenarios, steps) in every language, for the studio's dock. */
export function getModuleLabels(id: string | undefined): Record<Locale, ModuleLabels> | undefined {
  const text = getModuleText(id);
  if (!text) return undefined;
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, labelsOf(text.locales[locale])]),
  ) as Record<Locale, ModuleLabels>;
}
