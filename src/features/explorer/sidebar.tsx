"use client";

import {
  ChevronRight,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { IconButton } from "@/components/icon-button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Category, categories } from "@/content/catalog/categories";
import { cn } from "@/lib/utils";
import { BrandMark, BrandWordmark } from "@/features/shell/brand";
import { useShell } from "@/features/shell/shell-context";
import { CategoryIcon } from "./category-icon";
import {
  type PreviewConcept,
  previewCompletedCounts,
  previewConceptCounts,
  previewConceptsByCategory,
  previewCurrentCategoryId,
  previewCurrentConceptId,
} from "./placeholder";

interface CategoryEntry {
  category: Category;
  total: number;
  completed: number;
  concepts: readonly PreviewConcept[];
}

const entries: readonly CategoryEntry[] = categories.map((category) => ({
  category,
  total: previewConceptCounts[category.id] ?? 0,
  completed: previewCompletedCounts[category.id] ?? 0,
  concepts: previewConceptsByCategory[category.id] ?? [],
}));

const totalConcepts = entries.reduce((sum, entry) => sum + entry.total, 0);
const totalCompleted = entries.reduce((sum, entry) => sum + entry.completed, 0);

function matches(text: string, query: string) {
  return text.toLowerCase().includes(query);
}

/**
 * Learning navigation. Phase 2: real category list with placeholder concepts/progress.
 * Collapses to an icon rail on desktop; rendered inside a drawer on smaller screens.
 */
export function Sidebar() {
  const shell = useShell();
  const showRail = shell.layout === "desktop" && shell.sidebarCollapsed;

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set([previewCurrentCategoryId]),
  );

  const toggleCategory = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openCategoryFromRail = (id: string) => {
    setExpanded((current) => new Set(current).add(id));
    shell.openSidebar();
  };

  const normalizedQuery = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!normalizedQuery) return entries.map((entry) => ({ ...entry, matchedConcepts: null }));
    return entries.flatMap((entry) => {
      const matchedConcepts = entry.concepts.filter((concept) =>
        matches(concept.title, normalizedQuery),
      );
      const categoryMatches = matches(entry.category.title, normalizedQuery);
      if (!categoryMatches && matchedConcepts.length === 0) return [];
      return [{ ...entry, matchedConcepts: categoryMatches ? null : matchedConcepts }];
    });
  }, [normalizedQuery]);

  if (showRail) {
    return (
      <nav aria-label="Learning navigation" className="flex h-full flex-col items-center bg-hull">
        <div className="flex h-14 w-full shrink-0 items-center justify-center border-b border-rule">
          <IconButton
            label="Expand navigation"
            icon={<PanelLeftOpen />}
            tooltipSide="right"
            onClick={shell.toggleSidebar}
          />
        </div>
        <ScrollArea className="min-h-0 w-full flex-1">
          <ul className="flex flex-col items-center gap-1 py-3">
            {entries.map(({ category }) => (
              <li key={category.id} className="relative">
                {category.id === previewCurrentCategoryId && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-2.5 h-5 w-0.5 rounded-full bg-paper"
                  />
                )}
                <IconButton
                  label={category.title}
                  icon={<CategoryIcon icon={category.icon} />}
                  tooltipSide="right"
                  className={cn(
                    "text-graphite hover:text-paper",
                    category.id === previewCurrentCategoryId && "text-paper",
                  )}
                  onClick={() => openCategoryFromRail(category.id)}
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </nav>
    );
  }

  return (
    <nav aria-label="Learning navigation" className="flex h-full min-w-0 flex-col bg-hull">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-rule pr-2 pl-4">
        <BrandMark />
        <BrandWordmark />
        {shell.layout === "desktop" && (
          <IconButton
            label="Collapse navigation"
            icon={<PanelLeftClose />}
            className="ml-auto text-graphite hover:text-paper"
            onClick={shell.toggleSidebar}
          />
        )}
      </div>

      <div className="shrink-0 px-3 pt-3 pb-2">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-graphite"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search concepts"
            aria-label="Search categories and concepts"
            className="h-9 bg-hull-raised pr-8 pl-8 text-ui placeholder:text-graphite"
          />
          {query && (
            <IconButton
              label="Clear search"
              icon={<X />}
              size="icon-xs"
              className="absolute top-1/2 right-1.5 -translate-y-1/2 text-graphite"
              onClick={() => setQuery("")}
            />
          )}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {visible.length === 0 ? (
          <p className="px-4 py-6 text-caption text-graphite">
            Nothing matches “{query.trim()}”. Try a broader term, such as “cache” or “API”.
          </p>
        ) : (
          <ul className="flex flex-col gap-px px-2 pb-4">
            {visible.map((entry) => (
              <CategoryItem
                key={entry.category.id}
                entry={entry}
                concepts={entry.matchedConcepts ?? entry.concepts}
                expanded={
                  expanded.has(entry.category.id) ||
                  (entry.matchedConcepts !== null && entry.matchedConcepts.length > 0)
                }
                onToggle={() => toggleCategory(entry.category.id)}
              />
            ))}
          </ul>
        )}
      </ScrollArea>

      <div className="shrink-0 border-t border-rule px-4 py-3">
        <div className="flex items-baseline justify-between text-caption">
          <span className="text-graphite">Concepts completed</span>
          <span className="font-medium text-paper tabular-nums">
            {totalCompleted} of {totalConcepts}
          </span>
        </div>
        <ProgressBar value={totalCompleted} max={totalConcepts} className="mt-2" />
      </div>
    </nav>
  );
}

interface CategoryItemProps {
  entry: CategoryEntry;
  concepts: readonly PreviewConcept[];
  expanded: boolean;
  onToggle: () => void;
}

function CategoryItem({ entry, concepts, expanded, onToggle }: CategoryItemProps) {
  const { category, total, completed } = entry;
  const listId = useId();
  const isCurrent = category.id === previewCurrentCategoryId;

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        onClick={onToggle}
        className={cn(
          "group flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-hull-hover",
          isCurrent ? "text-paper" : "text-paper/85",
        )}
      >
        <ChevronRight
          aria-hidden="true"
          className={cn(
            "mt-0.5 size-4 shrink-0 text-graphite transition-transform duration-150",
            expanded && "rotate-90",
          )}
        />
        <CategoryIcon icon={category.icon} className="mt-0.5 size-4 shrink-0 text-graphite" />
        <span className="min-w-0 flex-1">
          <span className="block text-ui leading-5 font-medium">{category.title}</span>
          <span className="mt-1.5 flex items-center gap-2">
            <ProgressBar value={completed} max={total} className="flex-1" />
            <span className="text-label text-graphite tabular-nums">
              {completed}/{total}
              <span className="sr-only"> concepts completed</span>
            </span>
          </span>
        </span>
      </button>

      {expanded && (
        <ul id={listId} className="mt-0.5 mb-1.5 ml-5.5 border-l border-rule">
          {concepts.length === 0 ? (
            <li className="py-1.5 pl-4 text-caption text-graphite">
              Concepts are added in the next phase.
            </li>
          ) : (
            concepts.map((concept) => <ConceptRow key={concept.id} concept={concept} />)
          )}
        </ul>
      )}
    </li>
  );
}

const PROGRESS_LABEL: Record<PreviewConcept["progress"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started",
};

function ConceptRow({ concept }: { concept: PreviewConcept }) {
  const isCurrent = concept.id === previewCurrentConceptId;
  const Icon =
    concept.progress === "completed"
      ? CircleCheck
      : concept.progress === "in-progress"
        ? CircleDot
        : concept.available
          ? Circle
          : CircleDashed;

  return (
    <li
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        "relative -ml-px flex items-center gap-2 border-l py-1.5 pr-2 pl-4 text-caption",
        isCurrent
          ? "border-paper bg-hull-hover font-medium text-paper"
          : "border-transparent text-paper/75",
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0",
          concept.progress === "completed" ? "text-flow-response" : "text-graphite",
        )}
      />
      <span className="min-w-0 flex-1 truncate">{concept.title}</span>
      <span className="sr-only">
        {PROGRESS_LABEL[concept.progress]}
        {concept.available ? "" : ", planned"}
      </span>
    </li>
  );
}

function ProgressBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <span aria-hidden="true" className={cn("block h-0.5 rounded-full bg-rule", className)}>
      <span className="block h-full rounded-full bg-paper/80" style={{ width: `${percent}%` }} />
    </span>
  );
}
