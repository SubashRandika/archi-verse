"use client";

import { useParams } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { type Concept, DEFAULT_CONCEPT_ID, getConcept } from "@/content/catalog";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { useHasHydrated } from "@/features/progress/persisted-state";
import { StudioPreviewProvider } from "./studio-preview-context";

interface CurrentConceptState {
  concept: Concept;
  /**
   * The category the learner is browsing the concept from. A concept can belong to several
   * categories; this is the one they navigated from, or the concept's primary category.
   */
  activeCategoryId: string;
  setPreferredCategoryId: (categoryId: string) => void;
}

const CurrentConceptContext = createContext<CurrentConceptState | null>(null);

function requireConcept(id: string): Concept {
  const concept = getConcept(id);
  if (!concept) throw new Error(`Unknown concept "${id}".`);
  return concept;
}

/**
 * Resolves the concept from the route (`/learn/[conceptSlug]`) and provides it, together with
 * the studio session, to the shell. Lives in the persistent `/learn` layout so the sidebar
 * keeps its state while navigating between concepts.
 */
export function CurrentConceptProvider({
  children,
  initialStepIndex,
}: {
  children: ReactNode;
  /** Initial guided step (tests and future deep links). */
  initialStepIndex?: number;
}) {
  const params = useParams<{ conceptSlug?: string }>();
  const concept = getConcept(params?.conceptSlug ?? "") ?? requireConcept(DEFAULT_CONCEPT_ID);

  const [preferredCategoryId, setPreferredCategoryId] = useState<string>();
  const activeCategoryId =
    preferredCategoryId && concept.categoryIds.includes(preferredCategoryId)
      ? preferredCategoryId
      : (concept.categoryIds[0] ?? "");

  // Remember the last concept for "/" — only after saved preferences have loaded, so the
  // write can never overwrite them with defaults.
  const preferencesLoaded = useHasHydrated(usePreferencesStore);
  const setLastConceptId = usePreferencesStore((state) => state.setLastConceptId);
  useEffect(() => {
    if (preferencesLoaded) setLastConceptId(concept.id);
  }, [preferencesLoaded, concept.id, setLastConceptId]);

  const value = useMemo(
    () => ({ concept, activeCategoryId, setPreferredCategoryId }),
    [concept, activeCategoryId, setPreferredCategoryId],
  );

  return (
    <CurrentConceptContext.Provider value={value}>
      <StudioPreviewProvider conceptId={concept.id} initialStepIndex={initialStepIndex}>
        {children}
      </StudioPreviewProvider>
    </CurrentConceptContext.Provider>
  );
}

export function useCurrentConcept(): CurrentConceptState {
  const state = useContext(CurrentConceptContext);
  if (!state) throw new Error("useCurrentConcept must be used inside <CurrentConceptProvider>.");
  return state;
}
