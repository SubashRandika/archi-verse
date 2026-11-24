"use client";

import { Circle, CircleCheck } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStrings } from "@/features/locale/use-strings";
import { cn } from "@/lib/utils";
import { useProgressStore } from "./progress-store";

interface CompletionToggleProps {
  conceptId: string;
  /** Icon-only presentation for narrow headers (the accessible name stays "Completed"). */
  compact?: boolean;
}

/**
 * Manual completion (Phase 0, Q3). A toggle button with a constant label, so its pressed
 * state is what changes — the accessible pattern for on/off buttons.
 */
export function CompletionToggle({ conceptId, compact = false }: CompletionToggleProps) {
  const completed = useProgressStore((state) => state.concepts[conceptId]?.status === "completed");
  const markCompleted = useProgressStore((state) => state.markCompleted);
  const markNotStarted = useProgressStore((state) => state.markNotStarted);
  const t = useStrings();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            variant="outline"
            size="sm"
            pressed={completed}
            onPressedChange={(pressed) =>
              pressed ? markCompleted(conceptId) : markNotStarted(conceptId)
            }
            aria-label={compact ? t.completed : undefined}
            className={cn(
              "h-7 gap-1.5 border-rule-strong px-2.5 text-caption text-graphite hover:text-paper",
              "aria-pressed:border-flow-response/50 aria-pressed:bg-flow-response/10 aria-pressed:text-flow-response",
              compact && "w-7 px-0",
            )}
          />
        }
      >
        {/* Reads like a checkbox: empty circle when off, check when on. */}
        {completed ? <CircleCheck aria-hidden="true" /> : <Circle aria-hidden="true" />}
        {!compact && t.completed}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {completed ? t.markNotStarted : t.markCompleted}
      </TooltipContent>
    </Tooltip>
  );
}
