import type { ComponentKind, Vec3 } from "@/lib/scene-spec";

/*
 * Component shapes as data: each kind is a few unit boxes and cylinders, scaled and placed.
 * Shapes are built from shared unit geometries, so a scene of any size uploads just those to
 * the GPU. A part with `station: i` is drawn with its own materials and lights up when the
 * component's i-th stage is busy (e.g. the gateway's five checks).
 */

interface PartBase {
  readonly at: Vec3;
  /** Index into the component's `stages`. */
  readonly station?: number;
}

export type ShapePart =
  | (PartBase & { readonly geometry: "box"; readonly size: Vec3 })
  | (PartBase & {
      readonly geometry: "cylinder";
      readonly radius: number;
      readonly height: number;
    });

const box = (size: Vec3, at: Vec3, station?: number): ShapePart => ({
  geometry: "box",
  size,
  at,
  station,
});

const rack = (units: number): ShapePart[] =>
  Array.from({ length: units }, (_, i) => box([1.3, 0.42, 1.3], [0, 0.21 + i * 0.48, 0]));

/** Five stations in a row along the front of the gateway's top tier. */
const STATION_COUNT = 5;
const gatewayStations: ShapePart[] = Array.from({ length: STATION_COUNT }, (_, i) =>
  box([0.26, 0.2, 0.26], [-0.72 + i * 0.36, 0.86, 0.32], i),
);

export const SHAPES: Readonly<Record<ComponentKind, readonly ShapePart[]>> = {
  // A laptop: base, and a lid with a screen and a browser title bar facing the viewer (+z).
  client: [
    box([1.8, 0.1, 1.3], [0, 0.05, 0]),
    box([1.8, 1.15, 0.08], [0, 0.675, -0.6]),
    box([1.55, 0.78, 0.02], [0, 0.6, -0.55]),
    box([1.55, 0.12, 0.02], [0, 1.1, -0.55]),
  ],
  // A stepped plinth: a gate at the back (the single way in), the check stations in front.
  gateway: [
    box([2.2, 0.5, 1.8], [0, 0.25, 0]),
    box([1.9, 0.26, 1.3], [0, 0.63, 0]),
    box([0.22, 0.55, 0.22], [-0.5, 1.035, -0.32]),
    box([0.22, 0.55, 0.22], [0.5, 1.035, -0.32]),
    box([1.22, 0.14, 0.22], [0, 1.38, -0.32]),
    ...gatewayStations,
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
  // A vault: a low plinth and a solid tower with a cap.
  identity: [
    box([1.4, 0.3, 1.4], [0, 0.15, 0]),
    box([0.8, 1.0, 0.8], [0, 0.8, 0]),
    box([1.0, 0.12, 1.0], [0, 1.36, 0]),
  ],
  // A small router marker on the network path.
  hop: [{ geometry: "cylinder", radius: 0.24, height: 0.28, at: [0, 0.14, 0] }],
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
