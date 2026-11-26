import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { ComponentKind } from "@/lib/scene-spec";
import { roleColor, type ScenePalette } from "../scene/palette";
import { SCREEN_REGIONS } from "./screen-atlas";
import { SHAPES, type ShapePart } from "./shapes";

/**
 * Builds a kind's model from its shape data: every part becomes a small geometry with its
 * role's colour baked into vertex colours, then the parts are merged into a few geometries
 * that every instance of the kind shares. A component then costs a handful of draw calls,
 * however detailed it is.
 */
export interface KindModel {
  /** Every solid part (lit, glossy). */
  readonly solid: THREE.BufferGeometry;
  /** Screens, with texture coordinates into the screen atlas. */
  readonly screens: THREE.BufferGeometry | null;
  /** Status lights (unlit, so they glow). */
  readonly lights: THREE.BufferGeometry | null;
  /** Parts that light up with a stage, one geometry per station. */
  readonly stations: readonly { readonly index: number; readonly geometry: THREE.BufferGeometry }[];
  dispose(): void;
}

const CYLINDER_SEGMENTS = 40;
const BEVEL_SEGMENTS = 2;

function partGeometry(part: ShapePart): THREE.BufferGeometry {
  switch (part.geometry) {
    case "box":
      return new THREE.BoxGeometry(...part.size);
    case "rounded": {
      const smallest = Math.min(...part.size) / 2 - 0.001;
      return new RoundedBoxGeometry(...part.size, BEVEL_SEGMENTS, Math.min(part.bevel, smallest));
    }
    case "cylinder":
      return new THREE.CylinderGeometry(part.radius, part.radius, part.height, CYLINDER_SEGMENTS);
    case "screen": {
      const plane = new THREE.PlaneGeometry(...part.size);
      const region = SCREEN_REGIONS[part.picture];
      const uv = plane.getAttribute("uv");
      for (let i = 0; i < uv.count; i++) {
        uv.setXY(
          i,
          region.u0 + uv.getX(i) * (region.u1 - region.u0),
          region.v0 + uv.getY(i) * (region.v1 - region.v0),
        );
      }
      return plane;
    }
  }
}

/** A part as a non-indexed geometry in component space, with its colour on every vertex. */
function colouredPart(part: ShapePart, colour: THREE.Color): THREE.BufferGeometry {
  const source = partGeometry(part);
  const geometry = source.index ? source.toNonIndexed() : source;
  if (geometry !== source) source.dispose();
  geometry.translate(...part.at);
  const count = geometry.getAttribute("position").count;
  const colours = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) colours.set([colour.r, colour.g, colour.b], i * 3);
  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  return geometry;
}

function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  if (parts.length === 0) return null;
  const merged = mergeGeometries(parts, false);
  for (const part of parts) part.dispose();
  if (!merged) throw new Error("Could not merge the parts of a component model.");
  return merged;
}

export function buildKindModel(kind: ComponentKind, palette: ScenePalette): KindModel {
  const solid: THREE.BufferGeometry[] = [];
  const screens: THREE.BufferGeometry[] = [];
  const lights: THREE.BufferGeometry[] = [];
  const stationParts = new Map<number, THREE.BufferGeometry[]>();

  for (const part of SHAPES[kind]) {
    const geometry = colouredPart(part, new THREE.Color(roleColor(palette, kind, part.role)));
    if (part.station !== undefined) {
      const list = stationParts.get(part.station) ?? [];
      list.push(geometry);
      stationParts.set(part.station, list);
    } else if (part.geometry === "screen") screens.push(geometry);
    else if (part.role === "light") lights.push(geometry);
    else solid.push(geometry);
  }

  const model = {
    solid: merge(solid) ?? new THREE.BufferGeometry(),
    screens: merge(screens),
    lights: merge(lights),
    stations: [...stationParts.entries()]
      .sort(([a], [b]) => a - b)
      .map(([index, parts]) => ({ index, geometry: merge(parts)! })),
  };
  return {
    ...model,
    dispose() {
      model.solid.dispose();
      model.screens?.dispose();
      model.lights?.dispose();
      for (const station of model.stations) station.geometry.dispose();
    },
  };
}
