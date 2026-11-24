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
export const COMPONENT_KINDS = ["client", "gateway", "service", "database"] as const;
export type ComponentKind = (typeof COMPONENT_KINDS)[number];

export interface SceneComponent {
  readonly id: string;
  readonly kind: ComponentKind;
  /** Short visible name, e.g. "API gateway". */
  readonly label: string;
  /** What the component is, in a few words, e.g. "Edge component". */
  readonly role: string;
  /** Centre of the component's footprint on the ground. */
  readonly position: Vec3;
}

export interface SceneConnection {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  /** Ground waypoints between the two components, for L-shaped routes along the grid. */
  readonly via?: readonly Vec3[];
}

export interface SceneLayout {
  readonly components: readonly SceneComponent[];
  readonly connections: readonly SceneConnection[];
}

export type FlowKind = "request" | "response";

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
      readonly duration?: number;
    }
  | {
      /** A component works on something: it glows while busy. */
      readonly type: "process";
      readonly component: string;
      readonly duration?: number;
    }
  | { readonly type: "wait"; readonly duration: number };

/** What the scene shows and does during one learning step. */
export interface StepScene {
  /** Components the step is about. Everything else is dimmed. */
  readonly focus: readonly string[];
  /** Components the camera frames. Defaults to `focus`. */
  readonly frame?: readonly string[];
  readonly beats: readonly Beat[];
}

/** Default beat durations (seconds at 1× speed). */
export const BEAT_DEFAULTS = { packet: 1.6, process: 1.2 } as const;
