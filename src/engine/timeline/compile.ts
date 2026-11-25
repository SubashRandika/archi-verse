import gsap from "gsap";
import {
  type ActivityTone,
  BEAT_DEFAULTS,
  type FlowKind,
  type SceneLayout,
  type StatusBadge,
  type StatusTone,
  type StepScene,
} from "@/lib/scene-spec";

/*
 * Beats → GSAP timeline compiler (ADR-0003, ADR-0008).
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
  /** Message id (module text) to show when the packet is inspected. */
  readonly message: string | undefined;
  /** 0 at the start of the route, 1 at the end (in travel direction). */
  progress: number;
  /** 0 hidden, 1 visible. */
  opacity: number;
}

export interface StageChannel {
  activity: number;
  tone: ActivityTone;
}

/** Per-frame state of one scene component. */
export interface ComponentChannel {
  /** 0 idle, 1 busy (a `process` beat). Drives the glow. */
  activity: number;
  /** Colour of the busy glow. */
  tone: ActivityTone;
  /** Persistent condition set by `status` beats ("none" when healthy). */
  status: StatusTone | "none";
  /**
   * Badge set by `status` beats, as an index into `badges` (0 = none). GSAP animates numbers
   * and strings, not objects, so the channel holds an index.
   */
  badge: number;
  readonly badges: readonly (StatusBadge | undefined)[];
  /** Label of the stage currently busy ("" when none); shown as a badge. */
  stageLabel: string;
  readonly stages: Readonly<Record<string, StageChannel>>;
}

/** The badge a component shows now (`undefined` when none). Its text depends on the language. */
export function badgeOf(channel: ComponentChannel): StatusBadge | undefined {
  return channel.badges[channel.badge];
}

export interface WireChannel {
  /** 0 idle, 1 lit (a `signal` beat). */
  activity: number;
}

export interface SceneChannels {
  readonly packets: readonly PacketChannel[];
  readonly components: Readonly<Record<string, ComponentChannel>>;
  readonly wires: Readonly<Record<string, WireChannel>>;
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
/** How far along its route a lost packet gets before it vanishes. */
const LOST_AT = 0.5;

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

  const badges: (StatusBadge | undefined)[] = [undefined];
  const badgeKeys = [""];
  const badge = (value: StatusBadge | undefined) => {
    if (!value) return 0;
    const key = `${value.id}#${value.count ?? ""}`;
    const index = badgeKeys.indexOf(key);
    if (index !== -1) return index;
    badges.push(value);
    return badgeKeys.push(key) - 1;
  };
  const components: Record<string, ComponentChannel> = Object.fromEntries(
    layout.components.map((component) => [
      component.id,
      {
        activity: 0,
        tone: "active",
        status: "none",
        badge: 0,
        badges,
        stageLabel: "",
        stages: Object.fromEntries(
          (component.stages ?? []).map((stage) => [stage.id, { activity: 0, tone: "active" }]),
        ),
      } satisfies ComponentChannel,
    ]),
  );
  const wires: Record<string, WireChannel> = Object.fromEntries(
    layout.connections.map((connection) => [connection.id, { activity: 0 }]),
  );
  const packets: PacketChannel[] = [];
  const spans: StepSpan[] = [];
  const travelEase = reducedMotion ? jump : "power1.inOut";
  const fade = reducedMotion ? 0 : GLOW_FADE;
  const at = (target: object, vars: gsap.TweenVars, time: number) =>
    timeline.set(target, { ...vars, immediateRender: false }, time);

  const componentAt = (id: string, stepIndex: number) => {
    const channel = components[id];
    if (!channel) throw new Error(`Unknown component "${id}" in step ${stepIndex}.`);
    return channel;
  };
  const wireAt = (id: string, stepIndex: number) => {
    const wire = wires[id];
    if (!wire) throw new Error(`Unknown connection "${id}" in step ${stepIndex}.`);
    return wire;
  };
  /** Fades `target.activity` up, holds, and fades it down within [time, time + duration]. */
  const pulse = (target: { activity: number }, time: number, duration: number) => {
    const fadeTime = Math.min(fade, duration / 3);
    timeline.to(target, { activity: 1, duration: fadeTime, ease: "power1.out" }, time);
    timeline.to(
      target,
      { activity: 0, duration: fadeTime, ease: "power1.in" },
      time + duration - fadeTime,
    );
  };

  let time = 0;
  steps.forEach((step, stepIndex) => {
    const start = time;
    timeline.addLabel(stepLabel(stepIndex), start);

    // Every step starts from a clean slate plus its declared initial state, so jumping to
    // any step shows the same thing as playing up to it.
    for (const [id, channel] of Object.entries(components)) {
      const initial = step.scene.initial?.status?.[id];
      at(channel, { status: initial?.tone ?? "none", badge: badge(initial?.badge) }, start);
    }
    time += STEP_LEAD_IN;
    let last = time;

    step.scene.beats.forEach((beat, beatIndex) => {
      switch (beat.type) {
        case "packet": {
          const duration = beat.duration ?? BEAT_DEFAULTS.packet;
          wireAt(beat.connection, stepIndex);
          const packet: PacketChannel = {
            id: `${stepIndex}:${beatIndex}`,
            connection: beat.connection,
            flow: beat.flow,
            reverse: beat.reverse ?? false,
            message: beat.message,
            progress: 0,
            opacity: 0,
          };
          packets.push(packet);
          at(packet, { opacity: 1, progress: 0 }, time);
          if (!beat.stay) {
            const progress = beat.lost ? LOST_AT : 1;
            timeline.to(packet, { progress, duration, ease: travelEase }, time);
          }
          at(packet, { opacity: 0 }, time + duration);
          // Overlapping packets: the step still lasts until the last one arrives.
          last = Math.max(last, time + duration);
          time += beat.next ?? duration;
          break;
        }
        case "process": {
          const duration = beat.duration ?? BEAT_DEFAULTS.process;
          const channel = componentAt(beat.component, stepIndex);
          const tone = beat.tone ?? "active";
          if (beat.stage) {
            const stage = channel.stages[beat.stage];
            if (!stage) throw new Error(`Unknown stage "${beat.stage}" in step ${stepIndex}.`);
            const label =
              layout.components
                .find((component) => component.id === beat.component)
                ?.stages?.find((candidate) => candidate.id === beat.stage)?.label ?? beat.stage;
            at(stage, { tone }, time);
            at(channel, { stageLabel: label }, time);
            pulse(stage, time, duration);
            at(channel, { stageLabel: "" }, time + duration);
          } else {
            at(channel, { tone }, time);
            pulse(channel, time, duration);
          }
          time += duration;
          break;
        }
        case "signal": {
          const duration = beat.duration ?? BEAT_DEFAULTS.signal;
          pulse(wireAt(beat.connection, stepIndex), time, duration);
          time += duration;
          break;
        }
        case "status": {
          const channel = componentAt(beat.component, stepIndex);
          at(
            channel,
            { status: beat.status?.tone ?? "none", badge: badge(beat.status?.badge) },
            time,
          );
          break;
        }
        case "wait":
          time += beat.duration;
          break;
      }
    });

    time = Math.max(time, last) + STEP_HOLD;
    spans.push({ start, end: time });
  });

  // Make sure the timeline is as long as the last hold, even if it ends with a wait.
  timeline.set({}, {}, time);

  return { timeline, channels: { packets, components, wires }, steps: spans };
}
