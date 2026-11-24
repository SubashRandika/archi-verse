import { createStore } from "zustand";

/*
 * Studio session store (ADR-0004, "Session" tier): the state of one learning studio
 * instance: which track (main path or a scenario) and step, playback, mode, selection.
 * Not persisted. A new store is created for every concept, so nothing leaks between modules.
 *
 * Per-frame values (packet positions, step progress) never go through this store; see
 * `ProgressChannel` for the playhead.
 */

export type StudioMode = "guided" | "explore";
/** The main path. Any other track id is a scenario id. */
export const MAIN_TRACK = "main";

export interface StudioSessionState {
  /** `MAIN_TRACK` or a scenario id. */
  readonly trackId: string;
  /** Index within the current track. */
  readonly stepIndex: number;
  /** Number of steps in the current track. */
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
  /** Selected scene component. */
  readonly selectedId: string | null;
  /** Message being inspected (a packet was clicked), by message id. */
  readonly inspectedMessage: string | null;
  readonly hoveredId: string | null;
}

export interface StudioSessionActions {
  /** Plays the current step; after it finished, moves on to the next one (or replays the last). */
  play(): void;
  pause(): void;
  togglePlaying(): void;
  /** Jumps to a step of the current track and plays it. */
  goToStep(index: number): void;
  nextStep(): void;
  previousStep(): void;
  /** Back to the first step of the current track, playing. */
  restart(): void;
  /** Called by the scene when a step's animation reached its end. */
  completeStep(index: number): void;
  /** Switches to a scenario (or the main path) at `index`, and plays it. */
  switchTrack(trackId: string, index?: number): void;
  /** Shows a step without playing it (resuming where the learner left off). Only before any navigation. */
  resume(index: number): void;
  select(id: string | null): void;
  inspectMessage(id: string | null): void;
  hover(id: string | null): void;
  setMode(mode: StudioMode): void;
}

export type StudioSession = StudioSessionState & StudioSessionActions;
export type StudioSessionStore = ReturnType<typeof createStudioSession>;

export function createStudioSession({
  tracks,
  initialStepIndex = 0,
}: {
  /** Step count per track id; must include `MAIN_TRACK`. */
  tracks: Readonly<Record<string, number>>;
  initialStepIndex?: number;
}) {
  const countOf = (trackId: string) => tracks[trackId] ?? 0;
  const clamp = (index: number, trackId: string) =>
    Math.min(Math.max(index, 0), Math.max(countOf(trackId) - 1, 0));

  return createStore<StudioSession>()((set, get) => {
    const goToStep = (index: number) =>
      set((state) => ({
        stepIndex: clamp(index, state.trackId),
        stepComplete: false,
        playing: true,
        mode: "guided",
        seekCount: state.seekCount + 1,
      }));

    return {
      trackId: MAIN_TRACK,
      stepIndex: clamp(initialStepIndex, MAIN_TRACK),
      stepCount: countOf(MAIN_TRACK),
      playing: false,
      stepComplete: false,
      seekCount: 0,
      mode: "guided",
      selectedId: null,
      inspectedMessage: null,
      hoveredId: null,

      play() {
        const { stepComplete, stepIndex, stepCount, mode } = get();
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
      switchTrack(trackId, index = 0) {
        if (!(trackId in tracks)) return;
        set((state) => ({
          trackId,
          stepCount: countOf(trackId),
          stepIndex: clamp(index, trackId),
          stepComplete: false,
          playing: true,
          mode: "guided",
          inspectedMessage: null,
          seekCount: state.seekCount + 1,
        }));
      },
      resume(index) {
        const { seekCount, playing, trackId } = get();
        if (seekCount > 0 || playing || trackId !== MAIN_TRACK) return;
        set({ stepIndex: clamp(index, MAIN_TRACK), seekCount: 1 });
      },
      select: (id) => set({ selectedId: id, inspectedMessage: null }),
      inspectMessage: (id) => set({ inspectedMessage: id, selectedId: null }),
      hover: (id) => set({ hoveredId: id }),
      setMode: (mode) =>
        set(mode === "explore" ? { mode, playing: false, inspectedMessage: null } : { mode }),
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
