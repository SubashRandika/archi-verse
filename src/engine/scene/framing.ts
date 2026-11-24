import * as THREE from "three";
import type { Vec3 } from "@/lib/scene-spec";
import type { Bounds } from "../primitives/shapes";

/** True isometric view direction (from the target towards the camera): azimuth 45°, elevation ≈ 35.26°. */
export const ISO_DIRECTION = new THREE.Vector3(1, 1, 1).normalize();
/** Polar angle (from +y) and azimuth of the isometric view, as camera-controls measures them. */
export const ISO_POLAR = Math.acos(1 / Math.sqrt(3));
export const ISO_AZIMUTH = Math.PI / 4;
/** Distance of the orthographic camera from its target. Only affects clipping, not size. */
export const CAMERA_DISTANCE = 40;

export interface Padding {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface Framing {
  readonly target: Vec3;
  readonly position: Vec3;
  readonly zoom: number;
}

/**
 * Where to put an isometric orthographic camera so `bounds` fills the viewport inside
 * `padding` (CSS pixels), centred in the padded area. Pure, so it is unit-testable.
 *
 * For an orthographic camera sized in pixels, `zoom` is pixels per world unit.
 */
export function computeFraming(
  bounds: Bounds,
  viewport: { readonly width: number; readonly height: number },
  padding: Padding,
  zoomRange: readonly [min: number, max: number],
): Framing {
  const forward = ISO_DIRECTION.clone().negate();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();

  const center = new THREE.Vector3(
    (bounds.min[0] + bounds.max[0]) / 2,
    (bounds.min[1] + bounds.max[1]) / 2,
    (bounds.min[2] + bounds.max[2]) / 2,
  );

  // Project the eight corners onto the screen axes, relative to the box centre.
  let minR = Infinity;
  let maxR = -Infinity;
  let minU = Infinity;
  let maxU = -Infinity;
  const corner = new THREE.Vector3();
  for (const x of [bounds.min[0], bounds.max[0]]) {
    for (const y of [bounds.min[1], bounds.max[1]]) {
      for (const z of [bounds.min[2], bounds.max[2]]) {
        corner.set(x, y, z).sub(center);
        const r = corner.dot(right);
        const u = corner.dot(up);
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minU = Math.min(minU, u);
        maxU = Math.max(maxU, u);
      }
    }
  }

  const availableWidth = Math.max(viewport.width - padding.left - padding.right, 1);
  const availableHeight = Math.max(viewport.height - padding.top - padding.bottom, 1);
  const fit = Math.min(
    availableWidth / Math.max(maxR - minR, 1e-3),
    availableHeight / Math.max(maxU - minU, 1e-3),
  );
  const zoom = THREE.MathUtils.clamp(fit, zoomRange[0], zoomRange[1]);

  // Put the box's projected centre at the centre of the padded area (y grows upwards).
  const offsetX = (padding.left - padding.right) / 2;
  const offsetY = (padding.bottom - padding.top) / 2;
  const target = center
    .clone()
    .addScaledVector(right, (minR + maxR) / 2 - offsetX / zoom)
    .addScaledVector(up, (minU + maxU) / 2 - offsetY / zoom);
  const position = target.clone().addScaledVector(ISO_DIRECTION, CAMERA_DISTANCE);

  return {
    target: [target.x, target.y, target.z],
    position: [position.x, position.y, position.z],
    zoom,
  };
}
