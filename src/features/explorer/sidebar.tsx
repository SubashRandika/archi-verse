"use client";

import {
  ChevronRight,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Ellipsis,
  ListFilter,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { IconButton } from "@/components/icon-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Category, type Concept, categories, concepts } from "@/content/catalog";
import { BrandMark, BrandWordmark } from "@/features/shell/brand";
import { useShell } from "@/features/shell/shell-context";
import { type ProgressRecords, useProgressStore } from "@/features/progress/progress-store";
import {
  type ConceptStatus,
  getConceptStatus,
  getOverallProgress,
  type ProgressSummary,
} from "@/features/progress/selectors";
import { useCurrentConcept } from "@/features/studio/current-concept";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./category-icon";
import {
  type ExplorerFilter,
  filterCatalog,
  isFiltering,
  NO_FILTER,
  type StatusFilter,
} from "./filter";

/**
 * Learning navigation: the concept catalog with saved progress, search and filters.
 * Collapses to an icon rail on desktop and is rendered inside a drawer on smaller screens.
 */
export function Sidebar() {
  const shell = useShell();
  const { activeCategoryId } = useCurrentConcept();
  const showRail = shell.layout === "desktop" && shell.sidebarCollapsed;

  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set([activeCategoryId]));
  const [focusSearchOnOpen, setFocusSearchOnOpen] = useState(false);

  // Opening a concept from elsewhere (inspector links, "/") reveals its category.
  const [revealedCategoryId, setRevealedCategoryId] = useState(activeCategoryId);
  if (revealedCategoryId !== activeCategoryId) {
    setRevealedCategoryId(activeCategoryId);
    setExpanded((current) => new Set(current).add(activeCategoryId));
  }

  const toggleCategory = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // "/" focuses search from anywhere outside a text field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      setFocusSearchOnOpen(true);
      shell.openSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shell]);

  if (showRail) {
    return (
      <SidebarRail
        activeCategoryId={activeCategoryId}
        onOpenCategory={(id) => {
          setExpanded((current) => new Set(current).add(id));
          shell.openSidebar();
        }}
      />
    );
  }

  return (
    <SidebarPanel
      expanded={expanded}
      onToggleCategory={toggleCategory}
      focusSearch={focusSearchOnOpen}
      onSearchFocused={() => setFocusSearchOnOpen(false)}
    />
  );
}

function SidebarRail({
  activeCategoryId,
  onOpenCategory,
}: {
  activeCategoryId: string;
  onOpenCategory: (categoryId: string) => void;
}) {
  const shell = useShell();
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
          {categories.map((category) => (
            <li key={category.id} className="relative">
              {category.id === activeCategoryId && (
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
                  category.id === activeCategoryId && "text-paper",
                )}
                onClick={() => onOpenCategory(category.id)}
              />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
  );
}

interface SidebarPanelProps {
  expanded: ReadonlySet<string>;
  onToggleCategory: (categoryId: string) => void;
  focusSearch: boolean;
  onSearchFocused: () => void;
}

function SidebarPanel({
  expanded,
  onToggleCategory,
  focusSearch,
  onSearchFocused,
}: SidebarPanelProps) {
  const shell = useShell();
  const { concept: currentConcept } = useCurrentConcept();
  const records = useProgressStore((state) => state.concepts);
  const [filter, setFilter] = useState<ExplorerFilter>(NO_FILTER);
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Keep the current concept visible in the list (deep links, navigation from elsewhere).
  useEffect(() => {
    navRef.current?.querySelector('a[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [currentConcept.id]);

  useEffect(() => {
    if (!focusSearch) return;
    searchRef.current?.focus();
    onSearchFocused();
  }, [focusSearch, onSearchFocused]);

  const filtering = isFiltering(filter);
  const matches = useMemo(() => filterCatalog(filter, records), [filter, records]);
  const matchedConceptCount = useMemo(
    () => new Set(matches.flatMap((match) => match.concepts.map((concept) => concept.id))).size,
    [matches],
  );
  const overall = useMemo(() => getOverallProgress(records, concepts), [records]);

  return (
    <nav
      ref={navRef}
      aria-label="Learning navigation"
      className="flex h-full min-w-0 flex-col bg-hull"
    >
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

      <div className="flex shrink-0 items-center gap-1.5 px-3 pt-3 pb-2">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-graphite"
          />
          <Input
            ref={searchRef}
            type="search"
            value={filter.query}
            onChange={(event) =>
              setFilter((current) => ({ ...current, query: event.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === "Escape" && filter.query) {
                event.stopPropagation();
                setFilter((current) => ({ ...current, query: "" }));
              }
            }}
            placeholder="Search concepts"
            aria-label="Search categories and concepts"
            aria-keyshortcuts="/"
            className="h-9 bg-hull-raised pr-8 pl-8 text-ui placeholder:text-graphite"
          />
          {filter.query ? (
            <IconButton
              label="Clear search"
              icon={<X />}
              size="icon-xs"
              className="absolute top-1/2 right-1.5 -translate-y-1/2 text-graphite"
              onClick={() => setFilter((current) => ({ ...current, query: "" }))}
            />
          ) : (
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded-sm border border-rule-strong px-1.5 font-mono text-label leading-4 text-graphite"
            >
              /
            </kbd>
          )}
        </div>
        <FilterMenu filter={filter} onChange={setFilter} />
      </div>

      {filtering && (
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 pb-2 text-caption">
          <span className="text-graphite" role="status">
            {matchedConceptCount === 1 ? "1 concept" : `${matchedConceptCount} concepts`}
          </span>
          <button
            type="button"
            onClick={() => setFilter(NO_FILTER)}
            className="rounded-sm text-paper underline decoration-rule-strong underline-offset-4 hover:decoration-paper"
          >
            Clear filters
          </button>
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1">
        {matches.length === 0 ? (
          <p className="px-4 py-6 text-caption text-graphite">
            Nothing matches these filters. Try a broader term, such as “cache” or “API”, or clear
            the filters.
          </p>
        ) : (
          <ul className="flex flex-col gap-px px-2 pb-4">
            {matches.map(({ category, concepts: categoryConcepts }) => (
              <CategoryItem
                key={category.id}
                category={category}
                concepts={categoryConcepts}
                records={records}
                expanded={filtering || expanded.has(category.id)}
                onToggle={() => onToggleCategory(category.id)}
              />
            ))}
          </ul>
        )}
      </ScrollArea>

      <ProgressFooter overall={overall} />
    </nav>
  );
}

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All concepts",
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

function FilterMenu({
  filter,
  onChange,
}: {
  filter: ExplorerFilter;
  onChange: (update: (current: ExplorerFilter) => ExplorerFilter) => void;
}) {
  const active = filter.status !== "all" || filter.withVisualizationOnly;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <IconButton
            label={active ? "Filter concepts (filters active)" : "Filter concepts"}
            icon={
              <span className="relative">
                <ListFilter />
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-paper"
                  />
                )}
              </span>
            }
            variant="outline"
            size="icon"
            className={cn(
              "size-9 bg-hull-raised text-graphite hover:text-paper",
              active && "text-paper",
            )}
          />
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filter.status}
            onValueChange={(status) =>
              onChange((current) => ({ ...current, status: status as StatusFilter }))
            }
          >
            {(Object.keys(STATUS_FILTER_LABELS) as StatusFilter[]).map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                {STATUS_FILTER_LABELS[status]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filter.withVisualizationOnly}
          onCheckedChange={(checked) =>
            onChange((current) => ({ ...current, withVisualizationOnly: checked }))
          }
        >
          Only with a visualization
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface CategoryItemProps {
  category: Category;
  concepts: readonly Concept[];
  records: ProgressRecords;
  expanded: boolean;
  onToggle: () => void;
}

function CategoryItem({
  category,
  concepts: items,
  records,
  expanded,
  onToggle,
}: CategoryItemProps) {
  const listId = useId();
  const { activeCategoryId } = useCurrentConcept();
  const isActive = category.id === activeCategoryId;
  const completed = category.conceptIds.filter(
    (id) => getConceptStatus(records, id) === "completed",
  ).length;
  const total = category.conceptIds.length;

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        onClick={onToggle}
        className={cn(
          "group flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-hull-hover",
          isActive ? "text-paper" : "text-paper/85",
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
          {items.map((concept) => (
            <ConceptRow
              key={concept.id}
              concept={concept}
              categoryId={category.id}
              status={getConceptStatus(records, concept.id)}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const STATUS_LABEL: Record<ConceptStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started",
};

function StatusIcon({ status, available }: { status: ConceptStatus; available: boolean }) {
  const Icon =
    status === "completed"
      ? CircleCheck
      : status === "in-progress"
        ? CircleDot
        : available
          ? Circle
          : CircleDashed;
  return (
    <Icon
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0",
        status === "completed" ? "text-flow-response" : "text-graphite",
      )}
    />
  );
}

function ConceptRow({
  concept,
  categoryId,
  status,
}: {
  concept: Concept;
  categoryId: string;
  status: ConceptStatus;
}) {
  const shell = useShell();
  const { concept: current, setPreferredCategoryId } = useCurrentConcept();
  const isCurrent = concept.id === current.id;
  const available = concept.availability === "available";

  return (
    <li className="-ml-px">
      <HoverCard>
        <HoverCardTrigger
          delay={500}
          render={
            <Link
              href={`/learn/${concept.id}`}
              aria-current={isCurrent ? "page" : undefined}
              onClick={() => {
                setPreferredCategoryId(categoryId);
                shell.dismissSidebarDrawer();
              }}
              className={cn(
                "flex items-center gap-2 border-l py-1.5 pr-2 pl-4 text-caption transition-colors hover:bg-hull-hover hover:text-paper",
                isCurrent
                  ? "border-paper bg-hull-hover font-medium text-paper"
                  : "border-transparent text-paper/75",
              )}
            />
          }
        >
          <StatusIcon status={status} available={available} />
          <span className="min-w-0 flex-1 truncate">{concept.title}</span>
          <span className="sr-only">
            {`, ${STATUS_LABEL[status]}${available ? "" : ", visualization planned"}`}
          </span>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start" sideOffset={8} className="w-72 p-3">
          <p className="text-caption font-medium text-paper">{concept.title}</p>
          <p className="mt-1 text-caption text-paper/80">{concept.summary}</p>
          <p className="mt-2 text-label text-graphite">
            {STATUS_LABEL[status]}
            {available ? ", interactive visualization" : ", visualization planned"}
          </p>
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}

function ProgressFooter({ overall }: { overall: ProgressSummary }) {
  const reset = useProgressStore((state) => state.reset);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="shrink-0 border-t border-rule py-2 pr-2 pl-4">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2 text-caption">
            <span className="text-graphite">Concepts completed</span>
            <span className="font-medium text-paper tabular-nums">
              {overall.completed} of {overall.total}
            </span>
          </div>
          <ProgressBar value={overall.completed} max={overall.total} className="mt-2" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <IconButton
                label="Progress options"
                icon={<Ellipsis />}
                tooltipSide="top"
                className="text-graphite hover:text-paper"
              />
            }
          />
          <DropdownMenuContent side="top" align="end" className="w-48">
            <DropdownMenuItem
              variant="destructive"
              disabled={overall.completed === 0 && overall.inProgress === 0}
              onClick={() => setConfirmOpen(true)}
            >
              Reset progress…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears the status of every concept saved in this browser. It can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep progress</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                reset();
                setConfirmOpen(false);
              }}
            >
              Reset progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
