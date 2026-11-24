"use client";

import Link from "next/link";
import { DEFAULT_CONCEPT_ID, getCategory, getConcept } from "@/content/catalog";
import { DraftingPlate } from "./drafting-plate";
import { useCurrentConcept } from "./current-concept";
import { StudioHeader } from "./studio-header";

/** Dashed isometric block: a structure that is planned but not yet built. */
function UnbuiltBlock() {
  return (
    <svg viewBox="0 0 120 104" aria-hidden="true" className="h-20 w-24" fill="none">
      <g stroke="var(--graphite)" strokeWidth="1.25" strokeDasharray="4 4" strokeLinejoin="round">
        <path d="M60 8 108 36 60 64 12 36Z" />
        <path d="M12 36v32l48 28 48-28V36" />
        <path d="M60 64v32" />
      </g>
    </svg>
  );
}

/**
 * Studio for a concept without a learning module yet: what the concept is, where it belongs
 * in the roadmap, and an honest note that its visualization is planned.
 */
export function PlannedConceptStudio({ summary }: { summary: string }) {
  const { concept } = useCurrentConcept();
  const firstModule = getConcept(DEFAULT_CONCEPT_ID);
  const categoryTitles = concept.categoryIds.flatMap((id) => getCategory(id)?.title ?? []);

  return (
    <main id="studio" tabIndex={-1} className="flex h-full min-w-0 flex-col outline-none">
      <StudioHeader />
      <DraftingPlate>
        <div className="absolute inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-6 py-12">
            <article className="flex max-w-lg flex-col items-start gap-5">
              <UnbuiltBlock />
              <p className="text-reading text-paper">{summary}</p>

              <dl className="flex flex-col gap-1 text-caption">
                <dt className="text-graphite">
                  {categoryTitles.length > 1 ? "Part of these categories" : "Part of"}
                </dt>
                {categoryTitles.map((title) => (
                  <dd key={title} className="text-paper/90">
                    {title}
                  </dd>
                ))}
              </dl>

              <p className="border-l border-rule-strong pl-3 text-caption text-graphite">
                The interactive visualization for this concept is planned. Concepts are built one at
                a time, starting with {firstModule?.title ?? "the first module"}. You can still mark
                it as completed if you have learned it elsewhere.
              </p>

              {firstModule && (
                <Link
                  href={`/learn/${firstModule.id}`}
                  className="text-caption font-medium text-paper underline decoration-rule-strong underline-offset-4 hover:decoration-paper"
                >
                  Open {firstModule.title}
                </Link>
              )}
            </article>
          </div>
        </div>
      </DraftingPlate>
    </main>
  );
}
