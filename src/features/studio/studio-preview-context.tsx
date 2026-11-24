"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { previewSteps, type PreviewStepWithChapter } from "./placeholder";

/**
 * PLACEHOLDER (Phase 2). Minimal shared studio state so the dock, inspector and header stay
 * consistent. Phase 4 replaces it with the per-studio Zustand session store (ADR-0004), and
 * the explanation level moves to persisted preferences in Phase 3.
 */

export type StudioMode = "guided" | "explore";
export type ExplanationLevel = "beginner" | "advanced";
export const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

interface StudioPreviewState {
  steps: readonly PreviewStepWithChapter[];
  stepIndex: number;
  currentStep: PreviewStepWithChapter;
  playing: boolean;
  speed: PlaybackSpeed;
  mode: StudioMode;
  level: ExplanationLevel;
  goToStep: (index: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  restart: () => void;
  togglePlaying: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setMode: (mode: StudioMode) => void;
  setLevel: (level: ExplanationLevel) => void;
}

const StudioPreviewContext = createContext<StudioPreviewState | null>(null);

const lastIndex = previewSteps.length - 1;
const clampStep = (index: number) => Math.min(Math.max(index, 0), lastIndex);

interface StudioPreviewProviderProps {
  children: ReactNode;
  /** Zero-based index of the initially selected step. */
  initialStepIndex?: number;
}

export function StudioPreviewProvider({
  children,
  initialStepIndex = 1,
}: StudioPreviewProviderProps) {
  const [stepIndex, setStepIndex] = useState(() => clampStep(initialStepIndex));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [mode, setMode] = useState<StudioMode>("guided");
  const [level, setLevel] = useState<ExplanationLevel>("beginner");

  const value = useMemo<StudioPreviewState>(() => {
    const currentStep = previewSteps[stepIndex] ?? previewSteps[0];
    if (!currentStep) throw new Error("Studio preview requires at least one step.");
    return {
      steps: previewSteps,
      stepIndex,
      currentStep,
      playing,
      speed,
      mode,
      level,
      goToStep: (index) => setStepIndex(clampStep(index)),
      nextStep: () => setStepIndex((index) => clampStep(index + 1)),
      previousStep: () => setStepIndex((index) => clampStep(index - 1)),
      restart: () => {
        setStepIndex(0);
        setPlaying(false);
      },
      togglePlaying: () => setPlaying((isPlaying) => !isPlaying),
      setSpeed,
      setMode,
      setLevel,
    };
  }, [stepIndex, playing, speed, mode, level]);

  return <StudioPreviewContext.Provider value={value}>{children}</StudioPreviewContext.Provider>;
}

export function useStudioPreview(): StudioPreviewState {
  const state = useContext(StudioPreviewContext);
  if (!state) throw new Error("useStudioPreview must be used inside <StudioPreviewProvider>.");
  return state;
}
