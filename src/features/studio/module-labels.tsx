"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { ModuleLabels } from "@/content/modules";
import { useLocale } from "@/features/locale/use-strings";
import type { Locale } from "@/lib/locale";

/** A module's titles in every language, delivered by the concept route as data. */
export type LocalizedModuleLabels = Readonly<Record<Locale, ModuleLabels>>;

const ModuleLabelsContext = createContext<LocalizedModuleLabels | null>(null);

export function ModuleLabelsProvider({
  labels,
  children,
}: {
  labels: LocalizedModuleLabels;
  children: ReactNode;
}) {
  return <ModuleLabelsContext.Provider value={labels}>{children}</ModuleLabelsContext.Provider>;
}

/** Chapter, scenario and step titles in the learner's language. */
export function useModuleLabels(): ModuleLabels {
  const labels = useContext(ModuleLabelsContext);
  const locale = useLocale();
  if (!labels) throw new Error("useModuleLabels must be used inside <ModuleLabelsProvider>.");
  return labels[locale];
}
