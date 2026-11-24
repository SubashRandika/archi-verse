import gsap from "gsap";
import { BEAT_DEFAULTS, type FlowKind, type SceneLayout, type StepScene } from "@/lib/scene-spec";

/*
 * Beats → GSAP timeline compiler (ADR-0003).
 *
 * GSAP never touches three.js objects directly. It tweens plain "channel" objects; the scene
 * reads them every frame. That keeps the timeline testable without WebGL, and keeps per-frame
 * values out of React state (ADR-0004).
 */

/** Per-frame state of one packet (one `packet` beat). */
export interface PacketChannel {
  readonly id: string;
  readonly connection: string;
  readonly flow: FlowKind;
  readonly reverse: boolean;
  /** 0 at the start of the route, 1 at the end (in travel direction). */
  progress: number;
  /** 0 hidden, 1 visible. */
  opacity: number;
}

/** Per-frame state of one scene component. */
export interface ComponentChannel {
  /** 0 idle, 1 busy (a `process` beat). Drives the glow. */
  activity: number;
}

export interface SceneChannels {
  readonly packets: readonly PacketChannel[];
  readonly components: Readonly<Record<string, ComponentChannel>>;
}

export interface StepSpan {
  readonly start: number;
  readonly end: number;
}

export interface CompiledTimeline {
  /** Paused master timeline containing every step, labelled `step-<index>`. */
  readonly timeline: gsap.core.Timeline;
  readonly channels: SceneChannels;
  readonly steps: readonly StepSpan[];
}

export interface CompileOptions {
  /** Packets jump between stations and glows switch instead of fading. */
  readonly reducedMotion?: boolean;
}

/** Quiet time before the first beat of a step, so a step change reads before motion starts. */
export const STEP_LEAD_IN = 0.3;
/** Quiet time after the last beat, so the final state is visible before the step ends. */
export const STEP_HOLD = 0.5;
const GLOW_FADE = 0.25;

const jump = (progress: number) => (progress < 0.5 ? 0 : 1);

export function stepLabel(index: number) {
  return `step-${index}`;
}

export function compileTimeline(
  layout: SceneLayout,
  steps: readonly { readonly scene: StepScene }[],
  { reducedMotion = false }: CompileOptions = {},
): CompiledTimeline {
  const timeline = gsap.timeline({ paused: true });
  // Detach from GSAP's global root: the timeline is driven only through its controller, and a
  // detached timeline is garbage-collected with the studio instead of living in the root.
  gsap.globalTimeline.remove(timeline);
  const components: Record<string, ComponentChannel> = Object.fromEntries(
    layout.components.map((component) => [component.id, { activity: 0 }]),
  );
  const packets: PacketChannel[] = [];
  const spans: StepSpan[] = [];
  // Reduced motion: no travel. The packet sits at its source, then appears at its destination.
  const travelEase = reducedMotion ? jump : "power1.inOut";
  const fade = reducedMotion ? 0 : GLOW_FADE;

  let time = 0;
  steps.forEach((step, stepIndex) => {
    const start = time;
    timeline.addLabel(stepLabel(stepIndex), start);
    time += STEP_LEAD_IN;

    step.scene.beats.forEach((beat, beatIndex) => {
      switch (beat.type) {
        case "packet": {
          const duration = beat.duration ?? BEAT_DEFAULTS.packet;
          const packet: PacketChannel = {
            id: `${stepIndex}:${beatIndex}`,
            connection: beat.connection,
            flow: beat.flow,
            reverse: beat.reverse ?? false,
            progress: 0,
            opacity: 0,
          };
          packets.push(packet);
          timeline.set(packet, { opacity: 1, progress: 0, immediateRender: false }, time);
          timeline.to(packet, { progress: 1, duration, ease: travelEase }, time);
          timeline.set(packet, { opacity: 0, immediateRender: false }, time + duration);
          time += duration;
          break;
        }
        case "process": {
          const duration = beat.duration ?? BEAT_DEFAULTS.process;
          const channel = components[beat.component];
          if (!channel)
            throw new Error(`Unknown component "${beat.component}" in step ${stepIndex}.`);
          const fadeTime = Math.min(fade, duration / 3);
          timeline.to(channel, { activity: 1, duration: fadeTime, ease: "power1.out" }, time);
          timeline.to(
            channel,
            { activity: 0, duration: fadeTime, ease: "power1.in" },
            time + duration - fadeTime,
          );
          time += duration;
          break;
        }
        case "wait":
          time += beat.duration;
          break;
      }
    });

    time += STEP_HOLD;
    spans.push({ start, end: time });
  });

  // Make sure the timeline is as long as the last hold, even if it ends with a wait.
  timeline.set({}, {}, time);

  return { timeline, channels: { packets, components }, steps: spans };
}
