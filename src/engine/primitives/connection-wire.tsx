"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { FlowKind, Vec3 } from "@/lib/scene-spec";
import { SCENE_COLORS } from "../scene/palette";

export type WireState = "idle" | "dimmed" | FlowKind;

const noRaycast = () => {};

/**
 * A connection drawn along the ground. While a flow uses it in the current step it lights up
 * in that flow's colour with a soft glow.
 */
export function ConnectionWire({ points, state }: { points: readonly Vec3[]; state: WireState }) {
  const invalidate = useThree((s) => s.invalidate);
  const lines = useMemo(() => {
    const geometry = new LineGeometry();
    geometry.setPositions(points.flat());
    const core = new Line2(geometry, new LineMaterial({ linewidth: 1.5, transparent: true }));
    const glow = new Line2(
      geometry,
      new LineMaterial({
        linewidth: 9,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    core.raycast = noRaycast;
    glow.raycast = noRaycast;
    return { geometry, core, glow };
  }, [points]);

  useEffect(
    () => () => {
      lines.geometry.dispose();
      lines.core.material.dispose();
      lines.glow.material.dispose();
    },
    [lines],
  );

  useEffect(() => {
    const flowing = state === "request" || state === "response";
    const colour = flowing ? SCENE_COLORS[state] : SCENE_COLORS.wire;
    lines.core.material.color.set(colour);
    lines.core.material.linewidth = flowing ? 2 : 1.5;
    lines.core.material.opacity = state === "dimmed" ? 0.35 : 1;
    lines.glow.material.color.set(colour);
    lines.glow.visible = flowing;
    invalidate();
  }, [state, lines, invalidate]);

  return (
    <>
      <primitive object={lines.core} />
      <primitive object={lines.glow} />
    </>
  );
}
