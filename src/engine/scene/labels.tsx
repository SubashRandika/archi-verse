"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo } from "react";
import * as THREE from "three";
import type { Vec3 } from "@/lib/scene-spec";
import { cn } from "@/lib/utils";

export interface SceneLabel {
  readonly id: string;
  readonly text: string;
  /** World point the label sits just above (bottom centre of its text). */
  readonly anchor: Vec3;
  readonly tone: "normal" | "dimmed" | "selected";
}

/** Label elements by id, shared between the DOM layer and the in-canvas projector. */
export type LabelElements = Map<string, HTMLElement>;

/**
 * Moves each DOM label to its anchor's screen position on every rendered frame. Runs inside
 * the canvas; renders nothing. Labels are plain DOM in one React tree (crisp text in the UI
 * fonts, no per-label React roots).
 */
export function LabelProjector({
  labels,
  elementsRef,
}: {
  labels: readonly SceneLabel[];
  elementsRef: RefObject<LabelElements>;
}) {
  const point = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const label of labels) {
      const element = elementsRef.current.get(label.id);
      if (!element) continue;
      point.set(...label.anchor).project(camera);
      const x = ((point.x + 1) / 2) * size.width;
      const y = ((1 - point.y) / 2) * size.height;
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, calc(-100% - 6px))`;
    }
  });
  return null;
}

/** DOM layer for scene labels. Place it over the canvas, same size. Decorative for AT. */
export function LabelLayer({
  labels,
  elementsRef,
}: {
  labels: readonly SceneLabel[];
  elementsRef: RefObject<LabelElements>;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {labels.map((label) => (
        <span
          key={label.id}
          ref={(element) => {
            if (element) elementsRef.current.set(label.id, element);
            else elementsRef.current.delete(label.id);
          }}
          // Off-screen until the first frame positions it.
          style={{ transform: "translate3d(-9999px, 0, 0)" }}
          className={cn(
            "absolute top-0 left-0 font-condensed text-label whitespace-nowrap transition-colors duration-200 select-none",
            label.tone === "normal" && "text-paper",
            label.tone === "dimmed" && "text-graphite/70",
            label.tone === "selected" && "font-medium text-flow-selection",
          )}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}
