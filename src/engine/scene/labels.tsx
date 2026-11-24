"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { LabelPlacement, StatusBadge, Vec3 } from "@/lib/scene-spec";
import { cn } from "@/lib/utils";
import { badgeOf, type ComponentChannel } from "../timeline";

export interface SceneLabel {
  readonly id: string;
  readonly text: string;
  /** World point the label is attached to (see `labelAnchor`). */
  readonly anchor: Vec3;
  /** Side of the anchor the label sits on. */
  readonly placement: LabelPlacement;
  /**
   * Anchor above the shape, used instead when the label would leave the view on its own side
   * (a "right" or "below" label on a component at the edge of the frame).
   */
  readonly aboveAnchor?: Vec3;
  readonly tone: "normal" | "dimmed" | "selected";
  /** Per-frame state: its badge (status or busy stage) is shown under the name. */
  readonly channel?: ComponentChannel;
}

/** CSS offset from the projected anchor to the label box, per placement. */
const OFFSET: Record<LabelPlacement, string> = {
  above: "translate(-50%, calc(-100% - 6px))",
  right: "translate(8px, -50%)",
  below: "translate(-50%, 6px)",
};

interface Size {
  readonly width: number;
  readonly height: number;
}

/** Whether a label placed on its side of (x, y) would run past the view's right or bottom. */
function overflows(
  placement: LabelPlacement,
  x: number,
  y: number,
  element: HTMLElement,
  size: Size,
): boolean {
  // Transforms do not affect layout, so reading the size does not force a reflow per frame.
  if (placement === "right") return x + 8 + element.offsetWidth > size.width;
  if (placement === "below") return y + 6 + element.offsetHeight > size.height;
  return false;
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
  formatBadge,
}: {
  labels: readonly SceneLabel[];
  elementsRef: RefObject<LabelElements>;
  /** A badge's text in the learner's language. */
  formatBadge: (badge: StatusBadge) => string;
}) {
  // The scene renders on demand: draw a frame when the language (the formatter) changes.
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => invalidate(), [formatBadge, invalidate]);
  const point = useMemo(() => new THREE.Vector3(), []);
  const toScreen = (anchor: Vec3, camera: THREE.Camera, size: Size): [number, number] => {
    point.set(...anchor).project(camera);
    return [((point.x + 1) / 2) * size.width, ((1 - point.y) / 2) * size.height];
  };
  useFrame(({ camera, size }) => {
    for (const label of labels) {
      const element = elementsRef.current.labels.get(label.id);
      if (!element) continue;
      let placement = label.placement;
      let [x, y] = toScreen(label.anchor, camera, size);
      if (label.aboveAnchor && overflows(placement, x, y, element, size)) {
        placement = "above";
        [x, y] = toScreen(label.aboveAnchor, camera, size);
      }
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ${OFFSET[placement]}`;

      const badge = elementsRef.current.badges.get(label.id);
      if (!badge || !label.channel) continue;
      const current = badgeOf(label.channel);
      const text = label.channel.stageLabel || (current ? formatBadge(current) : "");
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
          className={cn(
            "absolute top-0 left-0 flex flex-col gap-1 whitespace-nowrap select-none",
            label.placement === "right" ? "items-start" : "items-center",
          )}
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
