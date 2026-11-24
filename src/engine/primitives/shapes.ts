import type { ComponentKind, Vec3 } from "@/lib/scene-spec";

/*
 * Component shapes as data: each kind is a few unit boxes and cylinders, scaled and placed.
 * Shapes are built from two shared geometries (one box, one cylinder), so a scene of any size
 * uploads just those to the GPU.
 */

export type ShapePart =
  | { readonly geometry: "box"; readonly size: Vec3; readonly at: Vec3 }
  | {
      readonly geometry: "cylinder";
      readonly radius: number;
      readonly height: number;
      readonly at: Vec3;
    };

const box = (size: Vec3, at: Vec3): ShapePart => ({ geometry: "box", size, at });

const rack = (units: number): ShapePart[] =>
  Array.from({ length: units }, (_, i) => box([1.3, 0.42, 1.3], [0, 0.21 + i * 0.48, 0]));

export const SHAPES: Readonly<Record<ComponentKind, readonly ShapePart[]>> = {
  // A laptop: base, and a lid with a screen and a browser title bar facing the viewer (+z).
  client: [
    box([1.8, 0.1, 1.3], [0, 0.05, 0]),
    box([1.8, 1.15, 0.08], [0, 0.675, -0.6]),
    box([1.55, 0.78, 0.02], [0, 0.6, -0.55]),
    box([1.55, 0.12, 0.02], [0, 1.1, -0.55]),
  ],
  // A stepped plinth with a gate on top: the single way in.
  gateway: [
    box([2.2, 0.5, 1.8], [0, 0.25, 0]),
    box([1.5, 0.3, 1.2], [0, 0.65, 0]),
    box([0.25, 0.5, 0.25], [-0.5, 1.05, 0]),
    box([0.25, 0.5, 0.25], [0.5, 1.05, 0]),
    box([1.25, 0.15, 0.25], [0, 1.375, 0]),
  ],
  // Three rack units.
  service: rack(3),
  // The classic stacked-disc database.
  database: [0, 1, 2].map((i) => ({
    geometry: "cylinder" as const,
    radius: 0.75,
    height: 0.38,
    at: [0, 0.19 + i * 0.44, 0] as Vec3,
  })),
};

export interface Bounds {
  readonly min: Vec3;
  readonly max: Vec3;
}

/** Axis-aligned bounds of a shape relative to its component's position. */
export function shapeBounds(kind: ComponentKind): Bounds {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const part of SHAPES[kind]) {
    const half: Vec3 =
      part.geometry === "box"
        ? [part.size[0] / 2, part.size[1] / 2, part.size[2] / 2]
        : [part.radius, part.height / 2, part.radius];
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis]!, part.at[axis]! - half[axis]!);
      max[axis] = Math.max(max[axis]!, part.at[axis]! + half[axis]!);
    }
  }
  return { min: min as unknown as Vec3, max: max as unknown as Vec3 };
}

/** World-space bounds of a set of components. */
export function componentsBounds(
  components: readonly { readonly kind: ComponentKind; readonly position: Vec3 }[],
): Bounds | undefined {
  if (components.length === 0) return undefined;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const component of components) {
    const local = shapeBounds(component.kind);
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis]!, component.position[axis]! + local.min[axis]!);
      max[axis] = Math.max(max[axis]!, component.position[axis]! + local.max[axis]!);
    }
  }
  return { min: min as unknown as Vec3, max: max as unknown as Vec3 };
}
