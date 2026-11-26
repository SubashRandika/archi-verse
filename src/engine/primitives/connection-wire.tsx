"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { FlowKind, Vec3 } from "@/lib/scene-spec";
import { useScenePalette } from "../scene/palette-context";
import type { WireChannel } from "../timeline";

export type WireState = "idle" | "dimmed" | FlowKind;

const noRaycast = () => {};
const GLOW_OPACITY = 0.16;

export interface ConnectionWireProps {
  readonly points: readonly Vec3[];
  readonly state: WireState;
  /** Dashed: a relationship rather than a request path. */
  readonly dashed?: boolean;
  /** Drawn only while a flow uses it or a signal lights it. */
  readonly hidden?: boolean;
  /** Per-frame signal activity from the timeline. */
  readonly channel?: WireChannel;
}

/**
 * A connection drawn along the ground. While a flow uses it in the current step it lights up
 * in that flow's colour with a soft glow; a `signal` beat lights it briefly.
 */
export function ConnectionWire({ points, state, dashed, hidden, channel }: ConnectionWireProps) {
  const invalidate = useThree((s) => s.invalidate);
  const palette = useScenePalette();
  const additive = palette.additiveGlow;
  const lines = useMemo(() => {
    const geometry = new LineGeometry();
    geometry.setPositions(points.flat());
    const core = new Line2(
      geometry,
      new LineMaterial({
        linewidth: 1.5,
        transparent: true,
        dashed: Boolean(dashed),
        dashSize: 0.25,
        gapSize: 0.18,
      }),
    );
    if (dashed) core.computeLineDistances();
    const glow = new Line2(
      geometry,
      new LineMaterial({
        linewidth: 9,
        transparent: true,
        opacity: 0,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      }),
    );
    core.raycast = noRaycast;
    glow.raycast = noRaycast;
    return { geometry, core, glow };
  }, [points, dashed, additive]);

  useEffect(
    () => () => {
      lines.geometry.dispose();
      lines.core.material.dispose();
      lines.glow.material.dispose();
    },
    [lines],
  );

  const flowing = state === "request" || state === "response" || state === "error";

  useEffect(() => {
    const colour = flowing ? palette[state] : palette.wire;
    lines.core.material.color.set(colour);
    lines.core.material.linewidth = flowing ? 2 : 1.5;
    lines.core.material.opacity = state === "dimmed" ? 0.35 : dashed && !flowing ? 0.7 : 1;
    lines.glow.material.color.set(flowing ? colour : palette.request);
    invalidate();
  }, [state, flowing, dashed, lines, invalidate, palette]);

  useFrame(() => {
    const signal = channel?.activity ?? 0;
    const glow = flowing ? 1 : signal;
    lines.glow.material.opacity = GLOW_OPACITY * glow;
    lines.glow.visible = glow > 0.01;
    lines.core.visible = !hidden || flowing || signal > 0.01;
  });

  return (
    <>
      <primitive object={lines.core} />
      <primitive object={lines.glow} />
    </>
  );
}
