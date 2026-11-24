"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import type { LearningModule, ModuleScenario, ModuleStep } from "@/content/modules";
import { useProgressStore } from "@/features/progress/progress-store";
import {
  createProgressChannel,
  createStudioSession,
  MAIN_TRACK,
  type ProgressChannel,
  type StudioSession,
  type StudioSessionStore,
} from "./session-store";
import { trackLengths, trackSteps } from "./tracks";

export interface StudioSessionValue {
  readonly conceptId: string;
  readonly learningModule: LearningModule;
  readonly store: StudioSessionStore;
  readonly progress: ProgressChannel;
}

/** `null` while the current concept has no learning module (planned concepts). */
export const StudioSessionContext = createContext<StudioSessionValue | null>(null);

/**
 * Creates the session for a concept's module (a fresh one whenever the concept changes) and
 * wires its side effects: resuming at the last step, recording progress and pausing when
 * the tab is hidden.
 */
export function useStudioSessionValue(
  conceptId: string,
  learningModule: LearningModule | undefined,
  initialStepIndex?: number,
): StudioSessionValue | null {
  const value = useMemo(
    () =>
      learningModule
        ? {
            conceptId,
            learningModule,
            store: createStudioSession({
              tracks: trackLengths(learningModule),
              initialStepIndex,
            }),
            progress: createProgressChannel(),
          }
        : null,
    [conceptId, learningModule, initialStepIndex],
  );

  // Resume where the learner left off, once saved progress has loaded (unless a step was
  // requested explicitly, or the learner already navigated).
  useEffect(() => {
    if (!value || initialStepIndex !== undefined) return;
    const resume = () => {
      const lastStepId = useProgressStore.getState().concepts[value.conceptId]?.lastStepId;
      const index = value.learningModule.steps.findIndex((step) => step.id === lastStepId);
      if (index > 0) value.store.getState().resume(index);
    };
    if (useProgressStore.persist.hasHydrated()) resume();
    return useProgressStore.persist.onFinishHydration(resume);
  }, [value, initialStepIndex]);

  // Playing or navigating a step marks the concept "in progress" and remembers the step
  // (for a scenario: the main-path step it branches from).
  // Never before saved progress has loaded: the write would replace it with defaults.
  useEffect(() => {
    if (!value) return;
    return value.store.subscribe((state, previous) => {
      // A navigation counts once it plays (or, without 3D, has already finished); a resume
      // only shows a step, so it does not.
      const navigated =
        state.seekCount !== previous.seekCount && (state.playing || state.stepComplete);
      const started = navigated || (state.playing && !previous.playing);
      if (!started || !useProgressStore.persist.hasHydrated()) return;
      const stepId =
        state.trackId === MAIN_TRACK
          ? value.learningModule.steps[state.stepIndex]?.id
          : value.learningModule.scenarios.find((s) => s.id === state.trackId)?.branchesFromStepId;
      if (stepId) useProgressStore.getState().recordStep(value.conceptId, stepId);
    });
  }, [value]);

  // Keep the learner's place: stop playback while the tab is in the background.
  useEffect(() => {
    if (!value) return;
    const onVisibilityChange = () => {
      if (document.hidden) value.store.getState().pause();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [value]);

  return value;
}

function useStudioSessionContext(): StudioSessionValue {
  const value = useContext(StudioSessionContext);
  if (!value) throw new Error("Studio session hooks need a concept with a learning module.");
  return value;
}

/** Subscribes to part of the studio session. */
export function useStudioSession<T>(selector: (session: StudioSession) => T): T {
  return useStore(useStudioSessionContext().store, selector);
}

export function useStudioSessionStore(): StudioSessionStore {
  return useStudioSessionContext().store;
}

export function useStudioModule(): LearningModule {
  return useStudioSessionContext().learningModule;
}

export function useStepProgress(): ProgressChannel {
  return useStudioSessionContext().progress;
}

export interface CurrentStep {
  readonly step: ModuleStep;
  /** The step's chapter id; a scenario counts as one chapter (its id). */
  readonly chapterId: string;
  /** The scenario being played, if any. */
  readonly scenario: ModuleScenario | undefined;
  readonly index: number;
  readonly count: number;
  /** Steps of the current track. */
  readonly steps: readonly ModuleStep[];
}

export function useCurrentStep(): CurrentStep {
  const learningModule = useStudioModule();
  const trackId = useStudioSession((session) => session.trackId);
  const index = useStudioSession((session) => session.stepIndex);
  const steps = trackSteps(learningModule, trackId);
  const step = steps[index] ?? steps[0];
  const scenario = learningModule.scenarios.find((candidate) => candidate.id === trackId);
  const mainStep = learningModule.steps.find((candidate) => candidate.id === step?.id);
  const chapterId = scenario ? scenario.id : mainStep?.chapterId;
  if (!step || !chapterId) throw new Error(`Module "${learningModule.id}" has no step ${index}.`);
  return { step, chapterId, scenario, index, count: steps.length, steps };
}
