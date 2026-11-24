"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import {
  type ExplanationLevel,
  type PlaybackSpeed,
  usePreferencesStore,
} from "@/features/preferences/preferences-store";
import { previewSteps, type PreviewStepWithChapter } from "./placeholder";

/**
 * PLACEHOLDER (Phase 2–3). Minimal shared studio state so the dock, inspector and header stay
 * consistent. Phase 4 replaces the step/playback part with the per-studio Zustand session
 * store (ADR-0004). Explanation level and speed are persisted preferences (Phase 3).
 */

export type StudioMode = "guided" | "explore";
export { PLAYBACK_SPEEDS } from "@/features/preferences/preferences-store";
export type { ExplanationLevel, PlaybackSpeed } from "@/features/preferences/preferences-store";

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

interface SessionState {
  conceptId: string;
  stepIndex: number;
  playing: boolean;
  mode: StudioMode;
}

interface StudioPreviewProviderProps {
  children: ReactNode;
  /** Session state (step, playback, mode) resets when the concept changes. */
  conceptId?: string;
  /** Zero-based index of the initially selected step. */
  initialStepIndex?: number;
}

export function StudioPreviewProvider({
  children,
  conceptId = "preview",
  initialStepIndex = 1,
}: StudioPreviewProviderProps) {
  const initialSession = (id: string): SessionState => ({
    conceptId: id,
    stepIndex: clampStep(initialStepIndex),
    playing: false,
    mode: "guided",
  });
  const [stored, setSession] = useState<SessionState>(() => initialSession(conceptId));
  // A different concept starts a fresh session (derived during render, no effect needed).
  const session = stored.conceptId === conceptId ? stored : initialSession(conceptId);

  const level = usePreferencesStore((state) => state.explanationLevel);
  const speed = usePreferencesStore((state) => state.playbackSpeed);
  const setLevel = usePreferencesStore((state) => state.setExplanationLevel);
  const setSpeed = usePreferencesStore((state) => state.setPlaybackSpeed);

  const value = useMemo<StudioPreviewState>(() => {
    const update = (patch: (current: SessionState) => Partial<SessionState>) =>
      setSession((current) => {
        const base = current.conceptId === session.conceptId ? current : session;
        return { ...base, ...patch(base) };
      });
    const currentStep = previewSteps[session.stepIndex] ?? previewSteps[0];
    if (!currentStep) throw new Error("Studio preview requires at least one step.");

    return {
      steps: previewSteps,
      stepIndex: session.stepIndex,
      currentStep,
      playing: session.playing,
      speed,
      mode: session.mode,
      level,
      goToStep: (index) => update(() => ({ stepIndex: clampStep(index) })),
      nextStep: () => update((current) => ({ stepIndex: clampStep(current.stepIndex + 1) })),
      previousStep: () => update((current) => ({ stepIndex: clampStep(current.stepIndex - 1) })),
      restart: () => update(() => ({ stepIndex: 0, playing: false })),
      togglePlaying: () => update((current) => ({ playing: !current.playing })),
      setSpeed,
      setMode: (mode) => update(() => ({ mode })),
      setLevel,
    };
  }, [session, speed, level, setLevel, setSpeed]);

  return <StudioPreviewContext.Provider value={value}>{children}</StudioPreviewContext.Provider>;
}

export function useStudioPreview(): StudioPreviewState {
  const state = useContext(StudioPreviewContext);
  if (!state) throw new Error("useStudioPreview must be used inside <StudioPreviewProvider>.");
  return state;
}
