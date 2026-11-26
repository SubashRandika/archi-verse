"use client";

import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ActivityTone, SceneComponent } from "@/lib/scene-spec";
import { useScenePalette } from "../scene/palette-context";
import type { ComponentChannel } from "../timeline";
import { useKindModel, useScreenAtlas, useSceneResources } from "./resources";
import { shapeBounds } from "./shapes";

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

const STATUS_TONE: Record<ComponentChannel["status"], ActivityTone | null> = {
  none: null,
  info: null,
  warning: "warning",
  error: "error",
  down: "error",
};
/** Strength of the steady ring a warning/error status keeps while set. */
const STATUS_GLOW = 0.7;
const RING_WIDTH = 0.1;
const RING_OPACITY = 0.95;
const HALO_OPACITY = 0.35;
/** Larger is faster. ~10 settles in about 0.3 s. */
const EASE_RATE = 10;
const noRaycast = () => {};

/** `target += colour × amount`, per channel. */
function addScaled(target: THREE.Color, colour: THREE.Color, amount: number): THREE.Color {
  target.r += colour.r * amount;
  target.g += colour.g * amount;
  target.b += colour.b * amount;
  return target;
}

const glossy = () =>
  new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 70, specular: 0x3a3a3a });

/**
 * One architecture component in the scene: its model (shared by every component of its kind),
 * a soft footprint shadow and a glowing ring around its tile. The ring shows what the
 * component is doing: selected, busy, or in a warning/error state. Dimmed components fade
 * toward the background; hovered ones brighten a little. Emphasis eases per frame and only
 * requests frames while a change is still settling, so an idle scene costs nothing. Stations
 * (the gateway's checks, the breaker's lamps) light up in their stage's tone.
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
  const palette = useScenePalette();
  const model = useKindModel(component.kind);
  const atlas = useScreenAtlas();
  const invalidate = useThree((state) => state.invalidate);

  const tones = useMemo(
    () => ({
      active: new THREE.Color(palette.request),
      warning: new THREE.Color(palette.warning),
      error: new THREE.Color(palette.error),
      selection: new THREE.Color(palette.selection),
      fade: new THREE.Color(palette.fade),
    }),
    [palette],
  );

  const materials = useMemo(() => {
    const blending = palette.additiveGlow ? THREE.AdditiveBlending : THREE.NormalBlending;
    return {
      solid: glossy(),
      screens: new THREE.MeshBasicMaterial({ map: atlas, toneMapped: false }),
      lights: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      stations: model.stations.map(glossy),
      ring: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending,
        toneMapped: false,
      }),
      halo: new THREE.MeshBasicMaterial({
        map: resources.halo,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending,
        toneMapped: false,
      }),
      footprint: new THREE.MeshBasicMaterial({
        color: palette.footprint,
        transparent: true,
        opacity: palette.footprintOpacity,
        depthWrite: false,
        map: resources.footprint,
      }),
    };
  }, [palette, atlas, model, resources]);
  useEffect(
    () => () => {
      const { stations, ...single } = materials;
      Object.values(single).forEach((material) => material.dispose());
      stations.forEach((material) => material.dispose());
    },
    [materials],
  );

  // The ring hugs the tile: a circle just outside its corners.
  const ground = useMemo(() => {
    const { min, max } = shapeBounds(component.kind);
    const half = Math.max(Math.hypot(max[0] - min[0], max[2] - min[2]) / 2, 0.3);
    return {
      ring: new THREE.RingGeometry(half * 0.92, half * 0.92 + RING_WIDTH, 64),
      halo: half * 2.6,
      footprint: { width: (max[0] - min[0]) * 1.5, depth: (max[2] - min[2]) * 1.5 },
    };
  }, [component.kind]);
  useEffect(() => () => ground.ring.dispose(), [ground]);

  // Eased visual state, mutated per frame (never React state).
  const eased = useRef({
    dim: emphasis === "dimmed" ? 1 : 0,
    hover: 0,
    select: 0,
    status: 0,
    down: 0,
  });
  const scratch = useMemo(
    () => ({ glow: new THREE.Color(), status: new THREE.Color(), emissive: new THREE.Color() }),
    [],
  );
  const ringMesh = useRef<THREE.Mesh>(null);
  const haloMesh = useRef<THREE.Mesh>(null);

  // A prop or theme change must wake the demand-driven render loop so the easing can run.
  useEffect(() => invalidate(), [emphasis, selected, hovered, materials, invalidate]);

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

    // Ring: selection wins, then the busy tone, then a steady status ring.
    const activity = (channel?.activity ?? 0) * (1 - state.dim * 0.6);
    const busyTone = tones[channel?.tone ?? "active"];
    const statusGlow = STATUS_GLOW * state.status * (1 - state.dim * 0.5);
    if (statusTone) scratch.status.copy(tones[statusTone]);
    scratch.glow.copy(statusTone ? scratch.status : tones.active);
    if (activity > 0.02) scratch.glow.lerp(busyTone, Math.min(activity * 2, 1));
    scratch.glow.lerp(tones.selection, state.select);
    const glow = Math.max(activity, state.select, statusGlow);
    materials.ring.color.copy(scratch.glow);
    materials.ring.opacity = RING_OPACITY * glow;
    materials.halo.color.copy(scratch.glow);
    materials.halo.opacity = HALO_OPACITY * glow;
    if (ringMesh.current) ringMesh.current.visible = glow > 0.003;
    if (haloMesh.current) haloMesh.current.visible = glow > 0.003;

    // Body: fade toward the background when dimmed, darken when down, brighten when busy
    // or hovered.
    const shade = (1 - palette.dimFade * state.dim) * (1 - 0.45 * state.down);
    materials.solid.color.setScalar(shade);
    addScaled(
      scratch.emissive.copy(tones.fade).multiplyScalar(palette.dimFade * state.dim),
      busyTone,
      0.22 * activity,
    ).addScalar(0.06 * state.hover);
    materials.solid.emissive.copy(scratch.emissive);
    const glowShade = (1 - 0.6 * state.dim) * (1 - state.down);
    materials.screens.color.setScalar(glowShade);
    materials.lights.color.setScalar(glowShade);

    // Stations follow the body, and light up on their own while their stage is busy.
    const stageIds = component.stages ?? [];
    model.stations.forEach(({ index }, i) => {
      const material = materials.stations[i]!;
      const stage = channel?.stages[stageIds[index]?.id ?? ""];
      const busy = (stage?.activity ?? 0) * (1 - state.dim * 0.6);
      material.color.setScalar(shade);
      addScaled(
        material.emissive.copy(scratch.emissive),
        tones[stage?.tone ?? "active"],
        0.6 * busy,
      );
    });
    materials.footprint.opacity = palette.footprintOpacity * (1 - 0.5 * state.dim);

    const settled = (Object.keys(target) as (keyof typeof target)[]).every(
      (key) => Math.abs(state[key] - target[key]) < 0.002,
    );
    if (!settled) invalidate();
  });

  const interactive = !component.decorative;
  const raycast = interactive ? undefined : noRaycast;

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
        position-y={0.005}
        scale={[ground.footprint.width, ground.footprint.depth, 1]}
        renderOrder={1}
        raycast={noRaycast}
      />
      <mesh
        ref={haloMesh}
        geometry={resources.plane}
        material={materials.halo}
        rotation-x={-Math.PI / 2}
        position-y={0.01}
        scale={[ground.halo, ground.halo, 1]}
        renderOrder={2}
        visible={false}
        raycast={noRaycast}
      />
      <mesh
        ref={ringMesh}
        geometry={ground.ring}
        material={materials.ring}
        rotation-x={-Math.PI / 2}
        position-y={0.02}
        renderOrder={3}
        visible={false}
        raycast={noRaycast}
      />
      <mesh geometry={model.solid} material={materials.solid} raycast={raycast} />
      {model.screens && (
        <mesh geometry={model.screens} material={materials.screens} raycast={raycast} />
      )}
      {model.lights && (
        <mesh geometry={model.lights} material={materials.lights} raycast={raycast} />
      )}
      {model.stations.map(({ index, geometry }, i) => (
        <mesh key={index} geometry={geometry} material={materials.stations[i]} raycast={raycast} />
      ))}
    </group>
  );
}
