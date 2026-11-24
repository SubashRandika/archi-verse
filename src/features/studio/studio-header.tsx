"use client";

import { BookOpenText, Menu, PanelRightClose, PanelRightOpen } from "lucide-react";
import { IconButton } from "@/components/icon-button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getCategory } from "@/content/catalog";
import { CompletionToggle } from "@/features/progress/completion-toggle";
import { useStrings } from "@/features/locale/use-strings";
import { useShell } from "@/features/shell/shell-context";
import { useCurrentConcept } from "./current-concept";
import type { StudioMode } from "./session-store";
import { useStudioSession } from "./studio-session";

export function StudioHeader() {
  const shell = useShell();
  const { concept, activeCategoryId } = useCurrentConcept();
  const category = getCategory(activeCategoryId);
  const hasModule = concept.availability === "available";
  const t = useStrings();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-rule bg-hull px-2 sm:px-3">
      {shell.layout !== "desktop" && (
        <IconButton
          label={t.openNavigation}
          icon={<Menu />}
          className="text-graphite hover:text-paper"
          onClick={shell.openSidebar}
        />
      )}

      <div className="min-w-0 flex-1 px-1">
        {category && <p className="truncate text-label text-graphite">{category.title}</p>}
        <h1 className="truncate text-[0.9375rem] leading-5 font-semibold text-paper">
          {concept.title}
        </h1>
      </div>

      {hasModule && <ModeToggle />}

      <CompletionToggle conceptId={concept.id} compact={shell.layout === "mobile"} />

      {shell.layout === "mobile" ? (
        <IconButton
          label={t.openExplanation}
          icon={<BookOpenText />}
          className="text-graphite hover:text-paper"
          onClick={shell.toggleInspector}
        />
      ) : (
        <IconButton
          label={shell.inspectorCollapsed ? t.showInspector : t.hideInspector}
          icon={shell.inspectorCollapsed ? <PanelRightOpen /> : <PanelRightClose />}
          className="text-graphite hover:text-paper"
          onClick={shell.toggleInspector}
        />
      )}
    </header>
  );
}

/** Guided (step by step) or Explore (free inspection). Only for concepts with a module. */
function ModeToggle() {
  const mode = useStudioSession((session) => session.mode);
  const setMode = useStudioSession((session) => session.setMode);
  const t = useStrings();
  return (
    <ToggleGroup
      aria-label={t.learningMode}
      variant="outline"
      size="sm"
      spacing={0}
      value={[mode]}
      onValueChange={(value) => {
        const next = value[0] as StudioMode | undefined;
        if (next) setMode(next);
      }}
    >
      <ToggleGroupItem value="guided" className="px-2.5 text-caption">
        {t.guided}
      </ToggleGroupItem>
      <ToggleGroupItem value="explore" className="px-2.5 text-caption">
        {t.explore}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
