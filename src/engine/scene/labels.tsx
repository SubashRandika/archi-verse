"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo } from "react";
import * as THREE from "three";
import type { Vec3 } from "@/lib/scene-spec";
import { cn } from "@/lib/utils";
import { badgeText, type ComponentChannel } from "../timeline";

export interface SceneLabel {
  readonly id: string;
  readonly text: string;
  /** World point the label sits just above (bottom centre of its text). */
  readonly anchor: Vec3;
  readonly tone: "normal" | "dimmed" | "selected";
  /** Per-frame state: its badge (status or busy stage) is shown under the name. */
  readonly channel?: ComponentChannel;
}

/** Label and badge elements by id, shared between the DOM layer and the in-canvas projector. */
export interface LabelElements {
  readonly labels: Map<string, HTMLElement>;
  readonly badges: Map<string, HTMLElement>;
}

export function createLabelElements(): LabelElements {
  return { labels: new Map(), badges: new Map() };
}

/**
 * Moves each DOM label to its anchor's screen position on every rendered frame, and updates
 * its badge from the timeline. Runs inside the canvas; renders nothing. Labels are plain DOM
 * in one React tree (crisp text in the UI fonts, no per-label React roots).
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
      const element = elementsRef.current.labels.get(label.id);
      if (!element) continue;
      point.set(...label.anchor).project(camera);
      const x = ((point.x + 1) / 2) * size.width;
      const y = ((1 - point.y) / 2) * size.height;
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, calc(-100% - 6px))`;

      const badge = elementsRef.current.badges.get(label.id);
      if (!badge || !label.channel) continue;
      const text = label.channel.stageLabel || badgeText(label.channel);
      const tone = label.channel.stageLabel ? "stage" : label.channel.status;
      if (badge.textContent !== text) badge.textContent = text;
      if (badge.dataset.tone !== tone) badge.dataset.tone = tone;
      badge.hidden = text === "";
    }
  });
  return null;
}

/**
 * DOM layer for scene labels. Place it over the canvas, same size. Decorative for assistive
 * technology: the scene outline and the inspector carry the same information.
 */
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
            if (element) elementsRef.current.labels.set(label.id, element);
            else elementsRef.current.labels.delete(label.id);
          }}
          // Off-screen until the first frame positions it.
          style={{ transform: "translate3d(-9999px, 0, 0)" }}
          className="absolute top-0 left-0 flex flex-col items-center gap-1 whitespace-nowrap select-none"
        >
          <span
            ref={(element) => {
              if (element) elementsRef.current.badges.set(label.id, element);
              else elementsRef.current.badges.delete(label.id);
            }}
            hidden
            data-tone="none"
            className={cn(
              "rounded-sm border px-1.5 py-px font-condensed text-label font-medium tabular-nums",
              "border-rule-strong bg-hull-raised/90 text-paper",
              "data-[tone=stage]:border-flow-request/60 data-[tone=stage]:text-flow-request",
              "data-[tone=warning]:border-flow-warning/60 data-[tone=warning]:text-flow-warning",
              "data-[tone=error]:border-flow-error/60 data-[tone=error]:text-flow-error",
              "data-[tone=down]:border-flow-error/60 data-[tone=down]:text-flow-error",
            )}
          />
          <span
            className={cn(
              "font-condensed text-label transition-colors duration-200",
              label.tone === "normal" && "text-paper",
              label.tone === "dimmed" && "text-graphite/70",
              label.tone === "selected" && "font-medium text-flow-selection",
            )}
          >
            {label.text}
          </span>
        </span>
      ))}
    </div>
  );
}
