"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Vec3 } from "@/lib/scene-spec";
import { SCENE_COLORS } from "../scene/palette";
import type { PacketChannel } from "../timeline";
import { useSceneResources } from "./resources";

const PACKET_SIZE = 0.34;
const HALO_SIZE = 1.4;
const noRaycast = () => {};

/**
 * A request or response travelling along a connection. Its position and visibility come from
 * a timeline channel and are applied per frame, outside React.
 */
export function Packet({ channel, route }: { channel: PacketChannel; route: readonly Vec3[] }) {
  const { box, halo } = useSceneResources();
  const group = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    const points = (channel.reverse ? [...route].reverse() : route).map(
      (p) => new THREE.Vector3(...p),
    );
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < points.length - 1; i++)
      path.add(new THREE.LineCurve3(points[i], points[i + 1]));
    return path;
  }, [channel.reverse, route]);

  const materials = useMemo(() => {
    const colour = SCENE_COLORS[channel.flow];
    return {
      core: new THREE.MeshBasicMaterial({ color: colour, toneMapped: false }),
      halo: new THREE.SpriteMaterial({
        map: halo,
        color: colour,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    };
  }, [channel.flow, halo]);
  useEffect(
    () => () => {
      materials.core.dispose();
      materials.halo.dispose();
    },
    [materials],
  );

  useFrame(() => {
    const object = group.current;
    if (!object) return;
    object.visible = channel.opacity > 0;
    if (object.visible)
      curve.getPointAt(THREE.MathUtils.clamp(channel.progress, 0, 1), object.position);
  });

  return (
    <group ref={group} visible={false}>
      <mesh geometry={box} material={materials.core} scale={PACKET_SIZE} raycast={noRaycast} />
      <sprite material={materials.halo} scale={HALO_SIZE} raycast={noRaycast} />
    </group>
  );
}
