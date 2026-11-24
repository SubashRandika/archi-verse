"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DEFAULT_CONCEPT_ID, getConcept } from "@/content/catalog";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { useHasHydrated } from "@/features/progress/persisted-state";

/** Sends the learner back to the last concept they opened, once saved preferences load. */
export function ResumeLearning() {
  const router = useRouter();
  const loaded = useHasHydrated(usePreferencesStore);
  const lastConceptId = usePreferencesStore((state) => state.lastConceptId);

  useEffect(() => {
    if (!loaded) return;
    const target = lastConceptId && getConcept(lastConceptId) ? lastConceptId : DEFAULT_CONCEPT_ID;
    router.replace(`/learn/${target}`);
  }, [loaded, lastConceptId, router]);

  return (
    <p role="status" className="text-caption text-graphite">
      Opening the learning studio…
    </p>
  );
}
