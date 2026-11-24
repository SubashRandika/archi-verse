"use client";

import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategory, getCategoryConcepts } from "@/content/catalog";
import { useCurrentConcept } from "@/features/studio/current-concept";
import { InspectorPanel } from "./inspector-panel";

/** The inspector for the current concept: module content, or an overview for planned ones. */
export function ConceptInspector() {
  const { concept } = useCurrentConcept();
  return concept.availability === "available" ? <InspectorPanel /> : <PlannedConceptInspector />;
}

const RELATED_LIMIT = 6;

function PlannedConceptInspector() {
  const { concept, activeCategoryId, setPreferredCategoryId } = useCurrentConcept();
  const category = getCategory(activeCategoryId);
  const related = category
    ? getCategoryConcepts(category)
        .filter((candidate) => candidate.id !== concept.id)
        .slice(0, RELATED_LIMIT)
    : [];

  return (
    <aside aria-label="Learning inspector" className="flex h-full min-w-0 flex-col bg-hull">
      <div className="flex h-14 shrink-0 items-center border-b border-rule px-5">
        <p className="text-caption font-medium text-paper">About this concept</p>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 px-5 pt-5 pb-8">
          <header>
            <h2 className="text-title font-semibold text-paper">{concept.title}</h2>
            <p className="mt-3 text-reading text-paper/90">{concept.summary}</p>
          </header>

          {concept.keywords.length > 0 && (
            <section className="border-t border-rule pt-4">
              <h3 className="mb-2.5 text-caption font-medium text-graphite">Also known as</h3>
              <ul className="flex flex-wrap gap-1.5">
                {concept.keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-sm border border-rule bg-hull-raised px-2 py-0.5 text-caption text-paper/90"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {category && related.length > 0 && (
            <section className="border-t border-rule pt-4">
              <h3 className="mb-2.5 text-caption font-medium text-graphite">
                More in {category.title}
              </h3>
              <ul className="flex flex-col gap-1">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/learn/${item.id}`}
                      onClick={() => setPreferredCategoryId(category.id)}
                      className="text-caption text-paper/90 underline decoration-rule-strong underline-offset-4 hover:text-paper hover:decoration-paper"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
