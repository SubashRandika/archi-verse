import type { ComponentKind, LabelPlacement, Vec3 } from "@/lib/scene-spec";
import type { PartRole } from "../scene/palette";
import { SHAPES } from "./shape-library";

/*
 * Component shapes as data (the "Glossy toy" models, ADR-0010): each kind is a list of parts,
 * each a box, a rounded box, a cylinder or a screen, placed relative to the component and
 * tagged with a role that decides its colour. The engine merges a kind's parts into a few
 * shared geometries. A part with `station: i` stays separate and lights up when the
 * component's i-th stage is busy (the gateway's five checks, the breaker's lamps).
 *
 * Parts are declared in painter's order (back to front, bottom to top), so the static drawing
 * can paint them in that order.
 */

export { SHAPES };

interface PartBase {
  readonly at: Vec3;
  readonly role: PartRole;
  /** Index into the component's `stages`. */
  readonly station?: number;
}

/** The picture drawn on a screen. */
export type ScreenPicture = "web-page" | "app";

export type ShapePart =
  | (PartBase & { readonly geometry: "box"; readonly size: Vec3 })
  | (PartBase & { readonly geometry: "rounded"; readonly size: Vec3; readonly bevel: number })
  | (PartBase & {
      readonly geometry: "cylinder";
      readonly radius: number;
      readonly height: number;
    })
  | (PartBase & {
      /** A flat screen facing the viewer (+z). */
      readonly geometry: "screen";
      readonly size: readonly [width: number, height: number];
      readonly picture: ScreenPicture;
    });

/** Half extents of a part along x, y and z. */
export function partHalfSize(part: ShapePart): Vec3 {
  switch (part.geometry) {
    case "box":
    case "rounded":
      return [part.size[0] / 2, part.size[1] / 2, part.size[2] / 2];
    case "cylinder":
      return [part.radius, part.height / 2, part.radius];
    case "screen":
      return [part.size[0] / 2, part.size[1] / 2, 0];
  }
}

export interface Bounds {
  readonly min: Vec3;
  readonly max: Vec3;
}

/** Axis-aligned bounds of a shape relative to its component's position. */
export function shapeBounds(kind: ComponentKind): Bounds {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const part of SHAPES[kind]) {
    const half = partHalfSize(part);
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

/**
 * World point a component's label is attached to, for its placement. In the isometric view the
 * highest point on screen is the top of the back corner, the right-most is the back-right
 * edge and the lowest is the front corner on the ground.
 */
export function labelAnchor(
  component: { readonly kind: ComponentKind; readonly position: Vec3 },
  placement: LabelPlacement = "above",
): Vec3 {
  const { min, max } = shapeBounds(component.kind);
  const [x, , z] = component.position;
  switch (placement) {
    case "right":
      return [x + max[0], max[1] / 2, z + min[2]];
    case "below":
      return [x + max[0], 0, z + max[2]];
    default:
      return [x + min[0], max[1], z + min[2]];
  }
}
