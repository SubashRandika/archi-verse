"use client";

import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import type { ActivityTone, SceneComponent } from "@/lib/scene-spec";
import { EDGE_OPACITY, SCENE_COLORS } from "../scene/palette";
import type { ComponentChannel } from "../timeline";
import { useSceneResources } from "./resources";
import { SHAPES, shapeBounds, type ShapePart } from "./shapes";

export type Emphasis = "normal" | "dimmed";

export interface ComponentNodeProps {
  readonly component: SceneComponent;
  readonly emphasis: Emphasis;
  readonly selected: boolean;
  readonly hovered: boolean;
  /** Per-frame state from the timeline (activity, status, stages). */
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
  bodyDown: color(SCENE_COLORS.bodyDown),
  paper: color(SCENE_COLORS.paper),
  selection: color(SCENE_COLORS.selection),
};
const TONE: Record<ActivityTone, THREE.Color> = {
  active: color(SCENE_COLORS.request),
  warning: color(SCENE_COLORS.warning),
  error: color(SCENE_COLORS.error),
};
const STATUS_TONE: Record<ComponentChannel["status"], ActivityTone | null> = {
  none: null,
  info: null,
  warning: "warning",
  error: "error",
  down: "error",
};
/** Strength of the steady glow a warning/error status keeps while set. */
const STATUS_GLOW = 0.7;
const EDGE_WIDTH = 1.1;
const GLOW_WIDTH = 7;
const GLOW_OPACITY = 0.2;
const FOOTPRINT_OPACITY = 0.6;
/** Larger is faster. ~10 settles in about 0.3 s. */
const EASE_RATE = 10;
const noRaycast = () => {};

interface MaterialSet {
  readonly body: THREE.MeshLambertMaterial;
  readonly edge: LineMaterial;
  readonly glow: LineMaterial;
}

function createMaterialSet(): MaterialSet {
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
  };
}

const disposeSet = (set: MaterialSet) =>
  Object.values(set).forEach((material) => material.dispose());

/**
 * One architecture component in the scene: its shape, outline, glow and ground footprint.
 * Emphasis (dimmed, hovered, selected, busy, status) eases per frame and only requests frames
 * while a change is still settling, so an idle scene costs nothing. Stations (parts with
 * `station`) have their own materials and light up with their stage.
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
  const shape = SHAPES[component.kind];
  const stationCount = shape.reduce((count, part) => Math.max(count, (part.station ?? -1) + 1), 0);

  const materials = useMemo(() => {
    const footprint = new THREE.MeshBasicMaterial({
      color: SCENE_COLORS.footprint,
      transparent: true,
      opacity: FOOTPRINT_OPACITY,
      depthWrite: false,
      map: resources.footprint,
    });
    return {
      main: createMaterialSet(),
      stations: Array.from({ length: stationCount }, createMaterialSet),
      footprint,
    };
  }, [resources, stationCount]);
  useEffect(
    () => () => {
      disposeSet(materials.main);
      materials.stations.forEach(disposeSet);
      materials.footprint.dispose();
    },
    [materials],
  );

  const parts = useMemo(
    () =>
      shape.map((part: ShapePart) => {
        const set = part.station === undefined ? materials.main : materials.stations[part.station]!;
        const scale: [number, number, number] =
          part.geometry === "box"
            ? [part.size[0], part.size[1], part.size[2]]
            : [part.radius, part.height, part.radius];
        const edges = part.geometry === "box" ? resources.boxEdges : resources.cylinderEdges;
        const outline = new LineSegments2(edges, set.edge);
        const glow = new LineSegments2(edges, set.glow);
        for (const line of [outline, glow]) {
          line.position.set(...part.at);
          line.scale.set(...scale);
          line.raycast = noRaycast;
        }
        glow.visible = false;
        return { part, set, scale, outline, glow };
      }),
    [shape, materials, resources],
  );

  const footprint = useMemo(() => {
    const bounds = shapeBounds(component.kind);
    return {
      width: (bounds.max[0] - bounds.min[0]) * 1.7,
      depth: (bounds.max[2] - bounds.min[2]) * 1.7,
    };
  }, [component.kind]);

  // Eased visual state, mutated per frame (never React state).
  const eased = useRef({
    dim: emphasis === "dimmed" ? 1 : 0,
    hover: 0,
    select: 0,
    status: 0,
    down: 0,
  });
  const scratch = useMemo(
    () => ({ glow: new THREE.Color(), body: new THREE.Color(), status: new THREE.Color() }),
    [],
  );

  // A prop change must wake the demand-driven render loop so the easing can run.
  useEffect(() => invalidate(), [emphasis, selected, hovered, invalidate]);

  useFrame((_, delta) => {
    const state = eased.current;
    const step = (from: number, to: number) =>
      smooth ? THREE.MathUtils.damp(from, to, EASE_RATE, Math.min(delta, 1 / 30)) : to;
    const statusTone = channel ? STATUS_TONE[channel.status] : null;
    const target = {
      dim: emphasis === "dimmed" ? 1 : 0,
      hover: hovered ? 1 : 0,
      select: selected ? 1 : 0,
      status: statusTone ? 1 : 0,
      down: channel?.status === "down" ? 1 : 0,
    };
    state.dim = step(state.dim, target.dim);
    state.hover = step(state.hover, target.hover);
    state.select = step(state.select, target.select);
    state.status = step(state.status, target.status);
    state.down = step(state.down, target.down);

    // Glow: selection wins, then the busy tone, then a steady status glow.
    const activity = (channel?.activity ?? 0) * (1 - state.dim * 0.6);
    const statusGlow = STATUS_GLOW * state.status * (1 - state.dim * 0.5);
    if (statusTone) scratch.status.copy(TONE[statusTone]);
    scratch.glow.copy(statusTone ? scratch.status : TONE.active);
    if (activity > 0.02) {
      scratch.glow.lerp(TONE[channel?.tone ?? "active"], Math.min(activity * 2, 1));
    }
    scratch.glow.lerp(C.selection, state.select);
    const glow = Math.max(activity, state.select, statusGlow);

    const { main } = materials;
    scratch.body
      .copy(C.body)
      .lerp(C.bodyDimmed, state.dim)
      .lerp(C.bodyDown, state.down * 0.85)
      .lerp(C.bodyActive, activity * (channel?.tone === "active" ? 1 : 0.3));
    main.body.color.copy(scratch.body);
    const baseOpacity = THREE.MathUtils.lerp(EDGE_OPACITY.normal, EDGE_OPACITY.dimmed, state.dim);
    main.edge.color.copy(C.paper).lerp(scratch.glow, glow);
    main.edge.opacity = Math.max(
      baseOpacity,
      EDGE_OPACITY.hovered * state.hover,
      EDGE_OPACITY.glowing * glow,
    );
    main.edge.linewidth = EDGE_WIDTH + 0.5 * glow;
    main.glow.color.copy(scratch.glow);
    main.glow.opacity = GLOW_OPACITY * glow;

    // Stations follow the component, and light up on their own while their stage is busy.
    const stageIds = component.stages ?? [];
    materials.stations.forEach((set, index) => {
      const stage = channel?.stages[stageIds[index]?.id ?? ""];
      const busy = (stage?.activity ?? 0) * (1 - state.dim * 0.6);
      const tone = TONE[stage?.tone ?? "active"];
      set.body.color.copy(scratch.body).lerp(tone, busy * 0.55);
      set.edge.color.copy(main.edge.color).lerp(tone, busy);
      set.edge.opacity = Math.max(main.edge.opacity, busy);
      set.edge.linewidth = EDGE_WIDTH + 0.5 * Math.max(glow, busy);
      set.glow.color.copy(busy > 0.02 ? tone : scratch.glow);
      set.glow.opacity = GLOW_OPACITY * Math.max(glow, busy * 1.3);
    });
    for (const { glow: line, set } of parts) line.visible = set.glow.opacity > 0.003;
    materials.footprint.opacity = FOOTPRINT_OPACITY * (1 - 0.5 * state.dim);

    const settled = (Object.keys(target) as (keyof typeof target)[]).every(
      (key) => Math.abs(state[key] - target[key]) < 0.002,
    );
    if (!settled) invalidate();
  });

  const geometryOf = (part: ShapePart) =>
    part.geometry === "box" ? resources.box : resources.cylinder;
  const interactive = !component.decorative;

  return (
    <group
      position={component.position as [number, number, number]}
      userData={{ componentId: component.id }}
      onClick={
        interactive
          ? (event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation();
              onSelect?.(component.id);
            }
          : undefined
      }
      onPointerOver={
        interactive
          ? (event: ThreeEvent<PointerEvent>) => {
              event.stopPropagation();
              onHover?.(component.id);
            }
          : undefined
      }
      onPointerOut={interactive ? () => onHover?.(null) : undefined}
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
      {parts.map(({ part, set, scale, outline, glow }, index) => (
        <group key={index}>
          <mesh
            geometry={geometryOf(part)}
            material={set.body}
            position={part.at as [number, number, number]}
            scale={scale}
            raycast={interactive ? undefined : noRaycast}
          />
          <primitive object={outline} />
          <primitive object={glow} />
        </group>
      ))}
    </group>
  );
}
