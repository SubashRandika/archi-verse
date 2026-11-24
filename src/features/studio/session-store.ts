import { createStore } from "zustand";

/*
 * Studio session store (ADR-0004, "Session" tier): the state of one learning studio
 * instance — current step, playback, mode, selection. Not persisted. A new store is created
 * for every concept, so nothing leaks between modules.
 *
 * Per-frame values (packet positions, step progress) never go through this store; see
 * `ProgressChannel` for the playhead.
 */

export type StudioMode = "guided" | "explore";

export interface StudioSessionState {
  readonly stepIndex: number;
  readonly stepCount: number;
  readonly playing: boolean;
  /** The current step's animation has played to its end. */
  readonly stepComplete: boolean;
  /**
   * Increments on every navigation, including to the current step (replay), so the scene
   * knows to seek even when `stepIndex` did not change.
   */
  readonly seekCount: number;
  readonly mode: StudioMode;
  readonly selectedId: string | null;
  readonly hoveredId: string | null;
}

export interface StudioSessionActions {
  /** Plays the current step; after it finished, moves on to the next one (or replays the last). */
  play(): void;
  pause(): void;
  togglePlaying(): void;
  /** Jumps to a step and plays it. */
  goToStep(index: number): void;
  nextStep(): void;
  previousStep(): void;
  /** Back to the first step, playing. */
  restart(): void;
  /** Called by the scene when a step's animation reached its end. */
  completeStep(index: number): void;
  select(id: string | null): void;
  hover(id: string | null): void;
  setMode(mode: StudioMode): void;
}

export type StudioSession = StudioSessionState & StudioSessionActions;
export type StudioSessionStore = ReturnType<typeof createStudioSession>;

export function createStudioSession({
  stepCount,
  initialStepIndex = 0,
}: {
  stepCount: number;
  initialStepIndex?: number;
}) {
  const clamp = (index: number) => Math.min(Math.max(index, 0), Math.max(stepCount - 1, 0));

  return createStore<StudioSession>()((set, get) => {
    const goToStep = (index: number) =>
      set((state) => ({
        stepIndex: clamp(index),
        stepComplete: false,
        playing: true,
        mode: "guided",
        seekCount: state.seekCount + 1,
      }));

    return {
      stepIndex: clamp(initialStepIndex),
      stepCount,
      playing: false,
      stepComplete: false,
      seekCount: 0,
      mode: "guided",
      selectedId: null,
      hoveredId: null,

      play() {
        const { stepComplete, stepIndex, mode } = get();
        if (mode !== "guided") set({ mode: "guided" });
        if (!stepComplete) set({ playing: true });
        else goToStep(stepIndex < stepCount - 1 ? stepIndex + 1 : stepIndex);
      },
      pause: () => set({ playing: false }),
      togglePlaying() {
        if (get().playing) get().pause();
        else get().play();
      },
      goToStep,
      nextStep: () => goToStep(get().stepIndex + 1),
      previousStep: () => goToStep(get().stepIndex - 1),
      restart: () => goToStep(0),
      completeStep(index) {
        if (index === get().stepIndex) set({ playing: false, stepComplete: true });
      },
      select: (id) => set({ selectedId: id }),
      hover: (id) => set({ hoveredId: id }),
      setMode: (mode) => set(mode === "explore" ? { mode, playing: false } : { mode }),
    };
  });
}

/**
 * The playhead within the current step (0–1), published by the scene every animation frame.
 * A tiny observable instead of store state, so the dock can update a progress bar without a
 * React render per frame.
 */
export interface ProgressChannel {
  get(): number;
  set(value: number): void;
  subscribe(listener: (value: number) => void): () => void;
}

export function createProgressChannel(): ProgressChannel {
  let value = 0;
  const listeners = new Set<(value: number) => void>();
  return {
    get: () => value,
    set(next) {
      if (next === value) return;
      value = next;
      for (const listener of listeners) listener(next);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
