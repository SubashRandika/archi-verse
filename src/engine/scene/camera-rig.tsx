"use client";

import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { type Ref, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import type { Bounds } from "../primitives/shapes";
import { computeFraming, ISO_AZIMUTH, type Padding } from "./framing";

export interface CameraRigHandle {
  /** Moves the camera to the isometric view that frames `bounds`. */
  frame(bounds: Bounds, animate: boolean): void;
}

export interface CameraRigProps {
  readonly ref?: Ref<CameraRigHandle>;
  /** The whole scene: limits panning and is the fallback framing. */
  readonly sceneBounds: Bounds;
  /** Space kept clear around framed content, in CSS pixels (e.g. for overlays). */
  readonly padding: Padding;
}

/** Pixels per world unit. The upper limit keeps small steps from filling the plate. */
const ZOOM_RANGE = [22, 80] as const;
/** How far learners may orbit away from the isometric view. */
const AZIMUTH_SWING = Math.PI / 3;
const POLAR_RANGE = [0.35, 1.35] as const;
const PAN_MARGIN = 6;

/**
 * Orthographic isometric camera with bounded rotate / zoom / pan (camera-controls via Drei).
 * GSAP never drives the camera (ADR-0003): framing uses camera-controls' own transitions,
 * which also keep the on-demand render loop awake while they run.
 */
export function CameraRig({ ref, sceneBounds, padding }: CameraRigProps) {
  const controls = useRef<CameraControls>(null);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const instance = controls.current;
    if (!instance) return;
    const box = new THREE.Box3(
      new THREE.Vector3(...sceneBounds.min).subScalar(PAN_MARGIN),
      new THREE.Vector3(...sceneBounds.max).addScalar(PAN_MARGIN),
    );
    instance.setBoundary(box);
  }, [sceneBounds]);

  useImperativeHandle(
    ref,
    () => ({
      frame(bounds, animate) {
        const instance = controls.current;
        if (!instance) return;
        const framing = computeFraming(bounds, size, padding, ZOOM_RANGE);
        void instance.setLookAt(...framing.position, ...framing.target, animate);
        void instance.zoomTo(framing.zoom, animate);
      },
    }),
    [size, padding],
  );

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minZoom={ZOOM_RANGE[0]}
      maxZoom={ZOOM_RANGE[1]}
      minPolarAngle={POLAR_RANGE[0]}
      maxPolarAngle={POLAR_RANGE[1]}
      minAzimuthAngle={ISO_AZIMUTH - AZIMUTH_SWING}
      maxAzimuthAngle={ISO_AZIMUTH + AZIMUTH_SWING}
      dollyToCursor
      smoothTime={0.35}
      draggingSmoothTime={0.08}
    />
  );
}
