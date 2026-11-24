"use client";

import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import type { SceneComponent } from "@/lib/scene-spec";
import { EDGE_OPACITY, SCENE_COLORS } from "../scene/palette";
import type { ComponentChannel } from "../timeline";
import { useSceneResources } from "./resources";
import { SHAPES, shapeBounds } from "./shapes";

export type Emphasis = "normal" | "dimmed";

export interface ComponentNodeProps {
  readonly component: SceneComponent;
  readonly emphasis: Emphasis;
  readonly selected: boolean;
  readonly hovered: boolean;
  /** Per-frame activity from the timeline (glows while busy). */
  readonly channel?: ComponentChannel;
  /** Ease visual changes (false: switch instantly, for reduced motion). */
  readonly smooth: boolean;
  readonly onSelect?: (id: string) => void;
  readonly onHover?: (id: string | null) => void;
}

const color = (hex: string) => new THREE.Color(hex);
const C = {
  body: color(SCENE_COLORS.body),
  bodyDimmed: color(SCENE_COLORS.bodyDimmed),
  bodyActive: color(SCENE_COLORS.bodyActive),
  paper: color(SCENE_COLORS.paper),
  request: color(SCENE_COLORS.request),
  selection: color(SCENE_COLORS.selection),
};
const EDGE_WIDTH = 1.1;
const GLOW_WIDTH = 7;
const GLOW_OPACITY = 0.2;
const FOOTPRINT_OPACITY = 0.6;
/** Larger is faster. ~10 settles in about 0.3 s. */
const EASE_RATE = 10;
const noRaycast = () => {};

/** Disposable materials owned by one component (geometries are shared). */
function createMaterials() {
  return {
    body: new THREE.MeshLambertMaterial({
      color: C.body,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    edge: new LineMaterial({
      linewidth: EDGE_WIDTH,
      transparent: true,
      opacity: EDGE_OPACITY.normal,
    }),
    glow: new LineMaterial({
      linewidth: GLOW_WIDTH,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    footprint: new THREE.MeshBasicMaterial({
      color: SCENE_COLORS.footprint,
      transparent: true,
      opacity: FOOTPRINT_OPACITY,
      depthWrite: false,
    }),
  };
}

/**
 * One architecture component in the scene: its shape, outline, glow and ground footprint.
 * Emphasis (dimmed, hovered, selected, busy) eases per frame and only requests frames while a
 * change is still settling, so an idle scene costs nothing.
 */
export function ComponentNode({
  component,
  emphasis,
  selected,
  hovered,
  channel,
  smooth,
  onSelect,
  onHover,
}: ComponentNodeProps) {
  const resources = useSceneResources();
  const invalidate = useThree((state) => state.invalidate);
  const materials = useMemo(() => {
    const created = createMaterials();
    created.footprint.map = resources.footprint;
    return created;
  }, [resources]);
  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  );

  const parts = useMemo(
    () =>
      SHAPES[component.kind].map((part) => {
        const scale: [number, number, number] =
          part.geometry === "box"
            ? [part.size[0], part.size[1], part.size[2]]
            : [part.radius, part.height, part.radius];
        const edges = part.geometry === "box" ? resources.boxEdges : resources.cylinderEdges;
        const outline = new LineSegments2(edges, materials.edge);
        const glow = new LineSegments2(edges, materials.glow);
        for (const line of [outline, glow]) {
          line.position.set(...part.at);
          line.scale.set(...scale);
          line.raycast = noRaycast;
        }
        glow.visible = false;
        return { part, scale, outline, glow };
      }),
    [component.kind, materials, resources],
  );

  const footprint = useMemo(() => {
    const bounds = shapeBounds(component.kind);
    return {
      width: (bounds.max[0] - bounds.min[0]) * 1.7,
      depth: (bounds.max[2] - bounds.min[2]) * 1.7,
    };
  }, [component.kind]);

  // Eased visual state, mutated per frame (never React state).
  const eased = useRef({ dim: emphasis === "dimmed" ? 1 : 0, hover: 0, select: 0 });
  const scratch = useMemo(() => ({ glowColor: new THREE.Color(), body: new THREE.Color() }), []);

  // A prop change must wake the demand-driven render loop so the easing can run.
  useEffect(() => invalidate(), [emphasis, selected, hovered, invalidate]);

  useFrame((_, delta) => {
    const state = eased.current;
    const step = (from: number, to: number) =>
      smooth ? THREE.MathUtils.damp(from, to, EASE_RATE, Math.min(delta, 1 / 30)) : to;
    const target = {
      dim: emphasis === "dimmed" ? 1 : 0,
      hover: hovered ? 1 : 0,
      select: selected ? 1 : 0,
    };
    state.dim = step(state.dim, target.dim);
    state.hover = step(state.hover, target.hover);
    state.select = step(state.select, target.select);

    const activity = (channel?.activity ?? 0) * (1 - state.dim * 0.6);
    const glow = Math.max(activity, state.select);

    scratch.glowColor.copy(C.request).lerp(C.selection, state.select);
    scratch.body.copy(C.body).lerp(C.bodyDimmed, state.dim).lerp(C.bodyActive, activity);
    materials.body.color.copy(scratch.body);

    const baseOpacity = THREE.MathUtils.lerp(EDGE_OPACITY.normal, EDGE_OPACITY.dimmed, state.dim);
    materials.edge.color.copy(C.paper).lerp(scratch.glowColor, glow);
    materials.edge.opacity = Math.max(
      baseOpacity,
      EDGE_OPACITY.hovered * state.hover,
      EDGE_OPACITY.glowing * glow,
    );
    materials.edge.linewidth = EDGE_WIDTH + 0.5 * glow;
    materials.glow.color.copy(scratch.glowColor);
    materials.glow.opacity = GLOW_OPACITY * glow;
    for (const { glow: glowLine } of parts) glowLine.visible = glow > 0.01;
    materials.footprint.opacity = FOOTPRINT_OPACITY * (1 - 0.5 * state.dim);

    const settled =
      Math.abs(state.dim - target.dim) < 0.002 &&
      Math.abs(state.hover - target.hover) < 0.002 &&
      Math.abs(state.select - target.select) < 0.002;
    if (!settled) invalidate();
  });

  const geometryOf = (part: (typeof parts)[number]["part"]) =>
    part.geometry === "box" ? resources.box : resources.cylinder;

  return (
    <group
      position={component.position as [number, number, number]}
      userData={{ componentId: component.id }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect?.(component.id);
      }}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onHover?.(component.id);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      <mesh
        geometry={resources.plane}
        material={materials.footprint}
        rotation-x={-Math.PI / 2}
        position-y={0.01}
        scale={[footprint.width, footprint.depth, 1]}
        renderOrder={1}
        raycast={noRaycast}
      />
      {parts.map(({ part, scale, outline, glow }, index) => (
        <group key={index}>
          <mesh
            geometry={geometryOf(part)}
            material={materials.body}
            position={part.at as [number, number, number]}
            scale={scale}
          />
          <primitive object={outline} />
          <primitive object={glow} />
        </group>
      ))}
    </group>
  );
}
