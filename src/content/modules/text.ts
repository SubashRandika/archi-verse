import { LOCALES, type Locale } from "@/lib/locale";
import { apiGatewayText } from "./api-gateway/text";
import { idempotencyText } from "./idempotency/text";
import { retryAndExponentialBackoffText } from "./retry-and-exponential-backoff/text";
import { backendForFrontendText } from "./backend-for-frontend/text";
import { circuitBreakerText } from "./circuit-breaker/text";
import type { LocaleText, ModuleLabels, ModuleText } from "./types";

/**
 * Module text by module id. SERVER ONLY: import this from route files in `src/app/` and pass
 * what a page needs as props. ESLint forbids importing it from features and components, so the
 * text travels as route data instead of client JavaScript.
 */
const texts: Readonly<Record<string, ModuleText>> = {
  "api-gateway": apiGatewayText,
  idempotency: idempotencyText,
  "retry-and-exponential-backoff": retryAndExponentialBackoffText,
  "backend-for-frontend": backendForFrontendText,
  "circuit-breaker": circuitBreakerText,
};

export function getModuleText(id: string | undefined): ModuleText | undefined {
  return id ? texts[id] : undefined;
}

function labelsOf(text: LocaleText): ModuleLabels {
  return {
    chapters: text.chapters,
    scenarios: text.scenarios,
    steps: Object.fromEntries(Object.entries(text.steps).map(([id, step]) => [id, step.title])),
    badges: text.badges,
  };
}

/** The studio's titles (chapters, scenarios, steps) and scene badges, in every language. */
export function getModuleLabels(id: string | undefined): Record<Locale, ModuleLabels> | undefined {
  const text = getModuleText(id);
  if (!text) return undefined;
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, labelsOf(text.locales[locale])]),
  ) as Record<Locale, ModuleLabels>;
}
