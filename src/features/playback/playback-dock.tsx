"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import { IconButton } from "@/components/icon-button";
import { lazyMenu } from "@/components/lazy-menu";
import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import type { LearningModule, ModuleLabels, ModuleScenario, ModuleStep } from "@/content/modules";
import { useLocale, useStrings } from "@/features/locale/use-strings";
import { useModuleLabels } from "@/features/studio/module-labels";
import { MAIN_TRACK } from "@/features/studio/session-store";
import {
  useCurrentStep,
  useStepProgress,
  useStudioModule,
  useStudioSession,
} from "@/features/studio/studio-session";
import { cn } from "@/lib/utils";
import { formatSpeed } from "./format";

const ScenarioMenu = lazyMenu(() => import("./dock-menus").then((menus) => menus.ScenarioMenu));
const SpeedMenu = lazyMenu(() => import("./dock-menus").then((menus) => menus.SpeedMenu));

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
  const {
    step: currentStep,
    chapterId: currentChapterId,
    scenario,
    index: stepIndex,
    count,
    steps: trackSteps,
  } = useCurrentStep();
  const switchTrack = useStudioSession((session) => session.switchTrack);
  const playing = useStudioSession((session) => session.playing);
  const stepComplete = useStudioSession((session) => session.stepComplete);
  const togglePlaying = useStudioSession((session) => session.togglePlaying);
  const previousStep = useStudioSession((session) => session.previousStep);
  const nextStep = useStudioSession((session) => session.nextStep);
  const restart = useStudioSession((session) => session.restart);
  const goToStep = useStudioSession((session) => session.goToStep);
  const speed = usePreferencesStore((state) => state.playbackSpeed);
  const setSpeed = usePreferencesStore((state) => state.setPlaybackSpeed);
  const t = useStrings();
  const locale = useLocale();
  const labels = useModuleLabels();
  const titleOf = (step: ModuleStep) => labels.steps[step.id] ?? step.id;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === count - 1;
  const playLabel = playing ? t.pause : stepComplete && isLast ? t.replayStep : t.play;
  const currentScenarioTitle = (scenario && labels.scenarios[scenario.id]?.title) || t.mainPath;

  return (
    <section
      aria-label={t.playbackControls}
      lang={locale}
      className="absolute inset-x-3 bottom-3 z-10 grid grid-cols-[auto_minmax(0,1fr)_auto] rounded-md border border-rule-strong bg-hull-raised/95 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.7)] backdrop-blur-sm @3xl:grid-cols-[auto_minmax(0,1fr)_minmax(8rem,11rem)_auto]"
    >
      {/* Transport */}
      <Cell className="order-2 gap-0.5 px-2 py-2 @3xl:order-1">
        <IconButton
          label={t.restart}
          icon={<RotateCcw />}
          tooltipSide="top"
          className="text-graphite hover:text-paper"
          onClick={restart}
        />
        <IconButton
          label={t.previousStep}
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
          label={t.nextStep}
          icon={<SkipForward />}
          tooltipSide="top"
          className="text-graphite hover:text-paper"
          disabled={isLast}
          onClick={nextStep}
        />
      </Cell>

      {/* Timeline */}
      <Cell className="order-1 col-span-3 border-b px-3 pt-2 pb-2.5 @3xl:order-2 @3xl:col-span-1 @3xl:border-b-0 @3xl:border-l">
        <ol aria-label={t.timeline} className="flex w-full gap-2">
          {timelineChapters(learningModule, labels, scenario, trackSteps).map((chapter) => {
            const chapterIsCurrent = chapter.id === currentChapterId;
            const chapterSteps = chapter.steps;
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
                    const index = trackSteps.indexOf(step);
                    const state =
                      index < stepIndex ? "done" : index === stepIndex ? "current" : "upcoming";
                    return (
                      <li key={step.id} className="flex-1">
                        <button
                          type="button"
                          aria-label={t.stepLabel(index + 1, titleOf(step))}
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
            {labels.chapters[currentChapterId] ?? labels.scenarios[currentChapterId]?.title}
          </span>
          <span
            aria-hidden="true"
            className="font-condensed text-label text-graphite tabular-nums"
          >{`${stepIndex + 1}/${count}`}</span>
        </span>
        <span aria-hidden="true" className="truncate text-caption font-medium text-paper">
          {titleOf(currentStep)}
        </span>
        {/* Announces each step change, e.g. "Step 5 of 12: Authentication". */}
        <span className="sr-only" aria-live="polite">
          {`${t.stepOf(stepIndex + 1, count)}: ${titleOf(currentStep)}`}
        </span>
      </Cell>

      {/* Scenario and speed */}
      <Cell className="order-4 items-stretch gap-1 border-l px-2 py-2">
        <div className="flex flex-col justify-center gap-0.5">
          <span className="px-1">
            <CellLabel>{t.scenario}</CellLabel>
          </span>
          <ScenarioMenu
            trigger={
              <Button
                variant="ghost"
                size="xs"
                aria-label={t.scenarioButton(currentScenarioTitle)}
                className="h-6 max-w-36 justify-start px-1 text-caption font-medium text-paper"
              >
                <span className="truncate">{currentScenarioTitle}</span>
              </Button>
            }
            learningModule={learningModule}
            labels={labels}
            strings={t}
            current={scenario?.id ?? null}
            onChange={(id) => {
              if (id) switchTrack(id);
              else {
                const branch = learningModule.steps.findIndex(
                  (step) => step.id === scenario?.branchesFromStepId,
                );
                switchTrack(MAIN_TRACK, Math.max(branch, 0));
              }
            }}
          />
        </div>
        <div className="flex flex-col justify-center gap-0.5">
          <span className="px-1">
            <CellLabel>{t.speed}</CellLabel>
          </span>
          <SpeedMenu
            trigger={
              <Button
                variant="ghost"
                size="xs"
                aria-label={t.speedButton(formatSpeed(speed))}
                className="h-6 px-1 text-caption font-medium text-paper tabular-nums"
              >
                {formatSpeed(speed)}
              </Button>
            }
            speed={speed}
            onChange={setSpeed}
          />
        </div>
      </Cell>
    </section>
  );
}

interface TimelineChapter {
  readonly id: string;
  readonly title: string;
  readonly steps: readonly ModuleStep[];
}

/** Chapters of the current track: the module's chapters, or the scenario as one chapter. */
function timelineChapters(
  learningModule: LearningModule,
  labels: ModuleLabels,
  scenario: ModuleScenario | undefined,
  steps: readonly ModuleStep[],
): TimelineChapter[] {
  if (scenario) {
    return [{ id: scenario.id, title: labels.scenarios[scenario.id]?.title ?? "", steps }];
  }
  return learningModule.chapters.map((chapter) => ({
    id: chapter.id,
    title: labels.chapters[chapter.id] ?? "",
    steps: learningModule.steps.filter((step) => step.chapterId === chapter.id),
  }));
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
