"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import type { LearningModule, ModuleChapter, ModuleStep } from "@/content/modules";
import { useProgressStore } from "@/features/progress/progress-store";
import {
  createProgressChannel,
  createStudioSession,
  type ProgressChannel,
  type StudioSession,
  type StudioSessionStore,
} from "./session-store";

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
 * wires its side effects: recording progress and pausing when the tab is hidden.
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
              stepCount: learningModule.steps.length,
              initialStepIndex,
            }),
            progress: createProgressChannel(),
          }
        : null,
    [conceptId, learningModule, initialStepIndex],
  );

  // Playing or navigating a step marks the concept "in progress" and remembers the step.
  // Never before saved progress has loaded: the write would replace it with defaults.
  useEffect(() => {
    if (!value) return;
    return value.store.subscribe((state, previous) => {
      const started =
        state.seekCount !== previous.seekCount || (state.playing && !previous.playing);
      if (!started || !useProgressStore.persist.hasHydrated()) return;
      const step = value.learningModule.steps[state.stepIndex];
      if (step) useProgressStore.getState().recordStep(value.conceptId, step.id);
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
  readonly chapter: ModuleChapter;
  readonly index: number;
  readonly count: number;
}

export function useCurrentStep(): CurrentStep {
  const learningModule = useStudioModule();
  const index = useStudioSession((session) => session.stepIndex);
  const step = learningModule.steps[index] ?? learningModule.steps[0];
  const chapter = learningModule.chapters.find((candidate) => candidate.id === step?.chapterId);
  if (!step || !chapter) throw new Error(`Module "${learningModule.id}" has no step ${index}.`);
  return { step, chapter, index, count: learningModule.steps.length };
}
