import type { Beat, FlowKind, StatusBadge, StatusTone } from "@/lib/scene-spec";

/**
 * Builders for a module's beats (the animation of each step). They keep step lists short and
 * readable: `send("browser-gateway", "request", { message: "request" })` instead of the beat
 * object. Every module's `structure.ts` uses them.
 *
 * Beats run one after another; a packet's `next` lets the following beats start while it is
 * still travelling (see `burst`).
 */

export interface SendOptions {
  /** Message id shown when the packet is inspected (from the module's text). */
  readonly message?: string;
  /** Travel time in seconds. */
  readonly duration?: number;
  /** Seconds until the next beat starts (default: when this packet arrives). */
  readonly next?: number;
  /** Travel the connection backwards (responses). */
  readonly back?: boolean;
  /** Appear at the start of the route and wait there (a message being examined). */
  readonly stay?: boolean;
  /** Travel halfway, then vanish (a response lost on the way). */
  readonly lost?: boolean;
}

/** A packet travelling along a connection. */
export function send(connection: string, flow: FlowKind, options: SendOptions = {}): Beat {
  return {
    type: "packet",
    connection,
    flow,
    reverse: options.back,
    stay: options.stay,
    lost: options.lost,
    duration: options.duration,
    next: options.next,
    message: options.message,
  };
}

export type WorkTone = "active" | "warning" | "error";

/** A component working (it pulses), or one of its stages when `stage` is given. */
export function work(
  component: string,
  duration?: number,
  options: { stage?: string; tone?: WorkTone } = {},
): Beat {
  return { type: "process", component, duration, ...options };
}

/** One stage of a component's pipeline (e.g. a gateway's authentication check) working. */
export function stage(
  component: string,
  stageId: string,
  duration?: number,
  tone?: WorkTone,
): Beat {
  return work(component, duration, { stage: stageId, tone });
}

/** A short pulse along a connection: a call whose content does not matter here. */
export function signal(connection: string, duration?: number): Beat {
  return { type: "signal", connection, duration };
}

/**
 * A badge by id from the module's `badges` text (each language has its own), with an optional
 * count for `{count}`: `badge("left", 57)` → "57 of 60 left".
 */
export function badge(id: string, count?: number): StatusBadge {
  return count === undefined ? { id } : { id, count };
}

/** Sets a component's lasting condition and badge; `null` clears it. */
export function status(component: string, tone: StatusTone | null, shown?: StatusBadge): Beat {
  return { type: "status", component, status: tone ? { tone, badge: shown } : null };
}

/** Nothing happens for a while. */
export function wait(duration: number): Beat {
  return { type: "wait", duration };
}

/** A beat at an absolute time, in seconds from the start of the sequence. */
export interface TimedBeat {
  readonly at: number;
  readonly beat: Beat;
}

/**
 * Turns beats at absolute times into a sequence: each beat, then a wait until the next one.
 * Beats at the same time keep their order. Packets in the list should use `next: 0`, so they
 * do not hold up what follows.
 */
export function timed(events: readonly TimedBeat[]): Beat[] {
  const sorted = [...events].sort((a, b) => a.at - b.at);
  const beats: Beat[] = [];
  let now = 0;
  for (const { at, beat } of sorted) {
    if (at > now) beats.push(wait(at - now));
    now = Math.max(now, at);
    beats.push(beat);
  }
  return beats;
}

export interface BurstOptions {
  readonly connection: string;
  readonly flow?: FlowKind;
  readonly count: number;
  /** Seconds between launches. */
  readonly every?: number;
  /** Travel time of each packet. */
  readonly travel?: number;
  readonly message?: string;
  /** Travel the connection backwards (a burst of replies). */
  readonly back?: boolean;
  /** A beat to play as packet `index` (0-based) arrives, e.g. a counter badge. */
  readonly onArrive?: (index: number) => Beat | undefined;
}

/** Several packets in flight at once, launched `every` seconds apart. */
export function burst({
  connection,
  flow = "request",
  count,
  every = 0.3,
  travel = 1,
  message,
  back,
  onArrive,
}: BurstOptions): Beat[] {
  const events: TimedBeat[] = [];
  for (let index = 0; index < count; index += 1) {
    const at = index * every;
    events.push({ at, beat: send(connection, flow, { duration: travel, next: 0, message, back }) });
    const arrival = onArrive?.(index);
    if (arrival) events.push({ at: at + travel, beat: arrival });
  }
  return timed(events);
}
