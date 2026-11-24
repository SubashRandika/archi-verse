"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { previewChapters } from "@/features/studio/placeholder";
import {
  PLAYBACK_SPEEDS,
  type PlaybackSpeed,
  useStudioPreview,
} from "@/features/studio/studio-preview-context";
import { cn } from "@/lib/utils";

const formatSpeed = (speed: number) => `${speed}×`;

/** Ruled cell of the title block. */
function Cell({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex min-w-0 items-center border-rule", className)}>{children}</div>;
}

function CellLabel({ children }: { children: string }) {
  return <span className="font-condensed text-label text-graphite">{children}</span>;
}

/**
 * Playback controls, designed as the drawing's title block: ruled cells for transport,
 * timeline, current step and speed. Phase 2 drives placeholder state only; Phase 4 connects
 * it to the GSAP timeline (ADR-0003).
 */
export function PlaybackDock() {
  const preview = useStudioPreview();
  const { stepIndex, steps, currentStep, playing } = preview;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  return (
    <section
      aria-label="Playback controls"
      className="absolute inset-x-3 bottom-3 z-10 grid grid-cols-[auto_minmax(0,1fr)_auto] rounded-md border border-rule-strong bg-hull-raised/95 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.7)] backdrop-blur-sm @3xl:grid-cols-[auto_minmax(0,1fr)_minmax(8rem,11rem)_auto]"
    >
      {/* Transport */}
      <Cell className="order-2 gap-0.5 px-2 py-2 @3xl:order-1">
        <IconButton
          label="Restart"
          icon={<RotateCcw />}
          tooltipSide="top"
          className="text-graphite hover:text-paper"
          onClick={preview.restart}
        />
        <IconButton
          label="Previous step"
          icon={<SkipBack />}
          tooltipSide="top"
          className="text-graphite hover:text-paper"
          disabled={isFirst}
          onClick={preview.previousStep}
        />
        <IconButton
          label={playing ? "Pause" : "Play"}
          icon={playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
          tooltipSide="top"
          variant="default"
          size="icon-lg"
          className="mx-1 rounded-full"
          onClick={preview.togglePlaying}
        />
        <IconButton
          label="Next step"
          icon={<SkipForward />}
          tooltipSide="top"
          className="text-graphite hover:text-paper"
          disabled={isLast}
          onClick={preview.nextStep}
        />
      </Cell>

      {/* Timeline */}
      <Cell className="order-1 col-span-3 border-b px-3 pt-2 pb-2.5 @3xl:order-2 @3xl:col-span-1 @3xl:border-b-0 @3xl:border-l">
        <ol aria-label="Timeline" className="flex w-full gap-2">
          {previewChapters.map((chapter) => {
            const chapterIsCurrent = chapter.id === currentStep.chapterId;
            return (
              <li
                key={chapter.id}
                className="min-w-0"
                style={{ flexGrow: chapter.steps.length, flexBasis: 0 }}
              >
                {/* Shown when the timeline has room: full-width row, or a wide dock. */}
                <span
                  className={cn(
                    "mb-1.5 block truncate font-condensed text-label @3xl:hidden @5xl:block",
                    chapterIsCurrent ? "text-paper" : "text-graphite",
                  )}
                >
                  {chapter.title}
                </span>
                <ol className="flex gap-0.5">
                  {chapter.steps.map((step) => {
                    const index = steps.findIndex((candidate) => candidate.id === step.id);
                    const state =
                      index < stepIndex ? "done" : index === stepIndex ? "current" : "upcoming";
                    return (
                      <li key={step.id} className="flex-1">
                        <button
                          type="button"
                          aria-label={`Step ${index + 1}: ${step.title}`}
                          aria-current={state === "current" ? "step" : undefined}
                          onClick={() => preview.goToStep(index)}
                          className="group flex h-6 w-full min-w-6 items-center rounded-sm"
                        >
                          <span
                            className={cn(
                              "block h-1 w-full rounded-full transition-colors group-hover:bg-paper/60",
                              state === "done" && "bg-paper/55",
                              state === "current" && "h-1.5 bg-paper",
                              state === "upcoming" && "bg-rule-strong",
                            )}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </Cell>

      {/* Current step */}
      <Cell className="order-3 flex-col items-stretch justify-center gap-0.5 border-l px-3 py-2">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-condensed text-label text-graphite">
            {currentStep.chapterTitle}
          </span>
          <span
            aria-hidden="true"
            className="font-condensed text-label text-graphite tabular-nums"
          >{`${stepIndex + 1}/${steps.length}`}</span>
          <span className="sr-only">{`Step ${stepIndex + 1} of ${steps.length}`}</span>
        </span>
        <span className="truncate text-caption font-medium text-paper" aria-live="polite">
          {currentStep.title}
        </span>
      </Cell>

      {/* Speed */}
      <Cell className="order-4 flex-col items-start justify-center gap-0.5 border-l px-2 py-2">
        <span className="px-1">
          <CellLabel>Speed</CellLabel>
        </span>
        <SpeedMenu speed={preview.speed} onChange={preview.setSpeed} />
      </Cell>
    </section>
  );
}

function SpeedMenu({
  speed,
  onChange,
}: {
  speed: PlaybackSpeed;
  onChange: (speed: PlaybackSpeed) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="xs"
            aria-label={`Playback speed, ${formatSpeed(speed)}`}
            className="h-6 px-1 text-caption font-medium text-paper tabular-nums"
          />
        }
      >
        {formatSpeed(speed)}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-28">
        <DropdownMenuRadioGroup
          value={speed}
          onValueChange={(value) => onChange(value as PlaybackSpeed)}
        >
          {PLAYBACK_SPEEDS.map((option) => (
            <DropdownMenuRadioItem key={option} value={option} className="tabular-nums">
              {formatSpeed(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
