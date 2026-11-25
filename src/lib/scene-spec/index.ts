/**
 * Scene specification: the contract between learning content (which describes a scene and
 * what happens in each step) and the 3D engine (which renders and animates it).
 *
 * It lives in `lib/` because both `content/` and `engine/` depend on it and neither may import
 * the other (docs/ARCHITECTURE.md). Everything here is plain, serialisable data.
 *
 * Coordinates are world units on the ground plane: x to the right, z towards the viewer,
 * y up. One unit is one grid cell.
 */

export type Vec3 = readonly [x: number, y: number, z: number];

/** Shapes the engine knows how to draw. New kinds are added when a module needs them. */
export const COMPONENT_KINDS = [
  "client",
  "mobile",
  "gateway",
  "service",
  "database",
  "identity",
  "breaker",
  "hop",
] as const;
export type ComponentKind = (typeof COMPONENT_KINDS)[number];

/** A named part of a component that can be busy on its own (e.g. the gateway's stations). */
export interface ComponentStage {
  readonly id: string;
  readonly label: string;
}

export interface SceneComponent {
  readonly id: string;
  readonly kind: ComponentKind;
  /** Short visible name, e.g. "API gateway". */
  readonly label: string;
  /** What the component is, in a few words, e.g. "Edge component". */
  readonly role: string;
  /** Centre of the component's footprint on the ground. */
  readonly position: Vec3;
  /** Stages in drawing order (the shape decides how many it can show). */
  readonly stages?: readonly ComponentStage[];
  /** Scenery: no label, not selectable, not listed (e.g. network hops). */
  readonly decorative?: boolean;
  /**
   * Where the name sits relative to the shape on screen (default "above"). Use "right" or
   * "below" when a wire or another label would cross it.
   */
  readonly labelPlacement?: LabelPlacement;
}

export type LabelPlacement = "above" | "right" | "below";

export interface SceneConnection {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  /** Ground waypoints between the two components, for routes along the grid. */
  readonly via?: readonly Vec3[];
  /** Dashed: a relationship rather than a request path (e.g. "keys cached"). */
  readonly style?: "solid" | "dashed";
  /** Drawn only while a step uses it. */
  readonly hidden?: boolean;
}

export interface SceneLayout {
  readonly components: readonly SceneComponent[];
  readonly connections: readonly SceneConnection[];
}

export type FlowKind = "request" | "response" | "error";
/** Colour of a busy glow: normal work, slow, failing. */
export type ActivityTone = "active" | "warning" | "error";
/** Persistent condition of a component, shown as a tint and an optional badge. */
export type StatusTone = "info" | "warning" | "error" | "down";

export interface ComponentStatus {
  readonly tone: StatusTone;
  /** Short text shown next to the component, e.g. "429" or "57 of 60 left". */
  readonly badge?: StatusBadge;
}

/**
 * A badge by reference: `id` names a text in the module's `badges` table (one per language),
 * e.g. `{ id: "left", count: 57 }` with the English text "{count} of 60 left". Language-free
 * data, so the scene can switch language without recompiling its timeline.
 */
export interface StatusBadge {
  readonly id: string;
  /** Replaces `{count}` in the text. */
  readonly count?: number;
}

/**
 * One thing that happens during a step. Beats in a step run one after another, in order.
 * Durations are in seconds at 1× speed.
 */
export type Beat =
  | {
      readonly type: "packet";
      readonly connection: string;
      readonly flow: FlowKind;
      /** Travel from the connection's `to` end back to its `from` end. */
      readonly reverse?: boolean;
      /** Appear at the start of the route and wait there instead of travelling. */
      readonly stay?: boolean;
      /** Travel only halfway, then vanish: a message lost on the way (e.g. a dropped response). */
      readonly lost?: boolean;
      readonly duration?: number;
      /**
       * Seconds until the next beat starts (default: `duration`). Shorter than the duration
       * lets the next beats run while this packet is still travelling, e.g. a burst.
       */
      readonly next?: number;
      /** Message id (module text) shown when the packet is inspected. */
      readonly message?: string;
    }
  | {
      /** A component (or one of its stages) works on something: it glows while busy. */
      readonly type: "process";
      readonly component: string;
      readonly stage?: string;
      readonly tone?: ActivityTone;
      readonly duration?: number;
    }
  | {
      /** A connection lights up without anything travelling (health check, cached keys). */
      readonly type: "signal";
      readonly connection: string;
      readonly duration?: number;
    }
  | {
      /** Sets (or clears, with `null`) a component's status. Instant; lasts until the step ends. */
      readonly type: "status";
      readonly component: string;
      readonly status: ComponentStatus | null;
    }
  | { readonly type: "wait"; readonly duration: number };

/** What the scene shows and does during one learning step. */
export interface StepScene {
  /** Components the step is about. Everything else is dimmed. */
  readonly focus: readonly string[];
  /** Components the camera frames. Defaults to `focus`. */
  readonly frame?: readonly string[];
  /** State at the start of the step (e.g. an instance already down in a scenario). */
  readonly initial?: { readonly status?: Readonly<Record<string, ComponentStatus>> };
  readonly beats: readonly Beat[];
}

/** Default beat durations (seconds at 1× speed). */
export const BEAT_DEFAULTS = { packet: 1.6, process: 1.2, signal: 0.8 } as const;
