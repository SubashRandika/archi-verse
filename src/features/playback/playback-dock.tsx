"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import { IconButton } from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PLAYBACK_SPEEDS,
  type PlaybackSpeed,
  usePreferencesStore,
} from "@/features/preferences/preferences-store";
import {
  useCurrentStep,
  useStepProgress,
  useStudioModule,
  useStudioSession,
} from "@/features/studio/studio-session";
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
 * timeline, current step and speed. Drives the studio session; the scene's GSAP timeline
 * follows it (ADR-0003).
 */
export function PlaybackDock() {
  const learningModule = useStudioModule();
  const { step: currentStep, chapter: currentChapter, index: stepIndex, count } = useCurrentStep();
  const playing = useStudioSession((session) => session.playing);
  const stepComplete = useStudioSession((session) => session.stepComplete);
  const togglePlaying = useStudioSession((session) => session.togglePlaying);
  const previousStep = useStudioSession((session) => session.previousStep);
  const nextStep = useStudioSession((session) => session.nextStep);
  const restart = useStudioSession((session) => session.restart);
  const goToStep = useStudioSession((session) => session.goToStep);
  const speed = usePreferencesStore((state) => state.playbackSpeed);
  const setSpeed = usePreferencesStore((state) => state.setPlaybackSpeed);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === count - 1;
  const playLabel = playing ? "Pause" : stepComplete && isLast ? "Replay step" : "Play";

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
          onClick={restart}
        />
        <IconButton
          label="Previous step"
          icon={<SkipBack />}
          tooltipSide="top"
          className="text-graphite hover:text-paper"
          disabled={isFirst}
          onClick={previousStep}
        />
        <IconButton
          label={playLabel}
          icon={playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
          tooltipSide="top"
          variant="default"
          size="icon-lg"
          className="mx-1 rounded-full"
          onClick={togglePlaying}
        />
        <IconButton
          label="Next step"
          icon={<SkipForward />}
          tooltipSide="top"
          className="text-graphite hover:text-paper"
          disabled={isLast}
          onClick={nextStep}
        />
      </Cell>

      {/* Timeline */}
      <Cell className="order-1 col-span-3 border-b px-3 pt-2 pb-2.5 @3xl:order-2 @3xl:col-span-1 @3xl:border-b-0 @3xl:border-l">
        <ol aria-label="Timeline" className="flex w-full gap-2">
          {learningModule.chapters.map((chapter) => {
            const chapterIsCurrent = chapter.id === currentStep.chapterId;
            const chapterSteps = learningModule.steps.filter(
              (step) => step.chapterId === chapter.id,
            );
            return (
              <li
                key={chapter.id}
                className="min-w-0"
                style={{ flexGrow: chapterSteps.length, flexBasis: 0 }}
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
                  {chapterSteps.map((step) => {
                    const index = learningModule.steps.indexOf(step);
                    const state =
                      index < stepIndex ? "done" : index === stepIndex ? "current" : "upcoming";
                    return (
                      <li key={step.id} className="flex-1">
                        <button
                          type="button"
                          aria-label={`Step ${index + 1}: ${step.title}`}
                          aria-current={state === "current" ? "step" : undefined}
                          onClick={() => goToStep(index)}
                          className="group flex h-6 w-full min-w-6 items-center rounded-sm"
                        >
                          {state === "current" ? (
                            <CurrentStepTrack />
                          ) : (
                            <span
                              className={cn(
                                "block h-1 w-full rounded-full transition-colors group-hover:bg-paper/60",
                                state === "done" && "bg-paper/55",
                                state === "upcoming" && "bg-rule-strong",
                              )}
                            />
                          )}
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
            {currentChapter.title}
          </span>
          <span
            aria-hidden="true"
            className="font-condensed text-label text-graphite tabular-nums"
          >{`${stepIndex + 1}/${count}`}</span>
          <span className="sr-only">{`Step ${stepIndex + 1} of ${count}`}</span>
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
        <SpeedMenu speed={speed} onChange={setSpeed} />
      </Cell>
    </section>
  );
}

/**
 * The current step's tick doubles as its progress bar. The fill follows the playhead through
 * the progress channel, writing a transform directly: no React render per frame.
 */
function CurrentStepTrack() {
  const progress = useStepProgress();
  const fill = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const apply = (value: number) => {
      if (fill.current) fill.current.style.transform = `scaleX(${value})`;
    };
    apply(progress.get());
    return progress.subscribe(apply);
  }, [progress]);

  return (
    <span className="relative block h-1.5 w-full overflow-hidden rounded-full bg-paper/30 group-hover:bg-paper/45">
      <span
        ref={fill}
        data-testid="step-progress"
        className="absolute inset-0 origin-left rounded-full bg-paper"
        style={{ transform: "scaleX(0)" }}
      />
    </span>
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
