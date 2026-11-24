import type gsap from "gsap";
import type { CompiledTimeline } from "./compile";

export interface TimelineEvents {
  /** The playhead moved (playing or seeking). Use it to request a render. */
  readonly onUpdate?: (stepIndex: number, stepProgress: number) => void;
  /** The current step finished playing; playback has stopped at its end. */
  readonly onStepEnd?: (stepIndex: number) => void;
}

const EPSILON = 1e-6;
/**
 * Playback stops this far before a step's end: the next step starts at exactly that time with
 * its clean-slate state (statuses, badges), which must not show while this step is on screen.
 */
const END_GAP = 1e-3;

/**
 * Plays a compiled timeline one step at a time.
 *
 * `play()` animates from the playhead to the end of the current step and stops there, so a
 * learner always sees a step's final state before moving on. Jumping to any step seeks the
 * master timeline to that step's start, which restores the correct state of every packet
 * and glow, whatever happened before.
 */
export class TimelineController {
  private index = 0;
  private speed = 1;
  private player: gsap.core.Tween | undefined;

  constructor(
    private readonly compiled: CompiledTimeline,
    private readonly events: TimelineEvents = {},
  ) {
    compiled.timeline.eventCallback("onUpdate", () => this.emit());
    compiled.timeline.seek(0, true);
  }

  get stepIndex() {
    return this.index;
  }

  get stepCount() {
    return this.compiled.steps.length;
  }

  get isPlaying() {
    return this.player !== undefined;
  }

  /** Fraction of the current step that has played, 0–1. */
  get stepProgress() {
    const span = this.compiled.steps[this.index];
    if (!span) return 0;
    const fraction =
      (this.compiled.timeline.time() - span.start) / (span.end - END_GAP - span.start);
    return Math.min(Math.max(fraction, 0), 1);
  }

  /** Stops playback and shows the start of a step. */
  seek(stepIndex: number) {
    this.stop();
    this.index = Math.min(Math.max(stepIndex, 0), this.compiled.steps.length - 1);
    const span = this.compiled.steps[this.index];
    this.compiled.timeline.seek(span?.start ?? 0, true);
    this.emit();
  }

  /**
   * Plays the current step from the playhead to its end. Returns false if the step has
   * already finished (the caller decides whether to move on or replay).
   */
  play(): boolean {
    const span = this.compiled.steps[this.index];
    if (!span) return false;
    const from = this.compiled.timeline.time();
    const stopAt = span.end - END_GAP;
    if (from >= stopAt - EPSILON) return false;

    this.stop();
    const stepIndex = this.index;
    this.player = this.compiled.timeline.tweenFromTo(from, stopAt, {
      ease: "none",
      onComplete: () => {
        this.player = undefined;
        this.events.onStepEnd?.(stepIndex);
      },
    });
    this.player.timeScale(this.speed);
    return true;
  }

  pause() {
    this.stop();
  }

  setSpeed(speed: number) {
    this.speed = speed;
    this.player?.timeScale(speed);
  }

  /** Stops playback and detaches from the timeline (which may be reused by a new controller). */
  dispose() {
    this.stop();
    this.compiled.timeline.eventCallback("onUpdate", null);
  }

  private stop() {
    this.player?.kill();
    this.player = undefined;
  }

  private emit() {
    this.events.onUpdate?.(this.index, this.stepProgress);
  }
}
