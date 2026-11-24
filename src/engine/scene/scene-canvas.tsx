"use client";

import { Grid } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, type RefObject, useEffect, useRef } from "react";
import { SceneResourcesProvider } from "../primitives/resources";
import { CAMERA_DISTANCE, ISO_DIRECTION } from "./framing";
import { SCENE_COLORS } from "./palette";

export interface SceneCanvasProps {
  readonly children: ReactNode;
  /** A click that hit no scene object. */
  readonly onPointerMissed?: () => void;
  /** The browser dropped the WebGL context (driver reset, GPU pressure). */
  readonly onContextLost?: () => void;
  /**
   * Element that receives `data-frames` (rendered frame count) and `data-draw-calls`
   * (draw calls in the last frame), for tests and the performance overlay.
   */
  readonly statsRef?: RefObject<HTMLElement | null>;
}

const INITIAL_POSITION = ISO_DIRECTION.clone().multiplyScalar(CAMERA_DISTANCE);
/** Pixel-ratio cap: sharp on HiDPI screens without paying for 3× fill rate. */
const MAX_DPR = 1.75;

function FrameStats({ statsRef }: { statsRef: RefObject<HTMLElement | null> }) {
  const frames = useRef(0);
  const info = useThree((state) => state.gl.info);
  useFrame(() => {
    frames.current += 1;
    const element = statsRef.current;
    if (!element) return;
    element.dataset.frames = String(frames.current);
    element.dataset.drawCalls = String(info.render.calls);
  });
  return null;
}

function ContextLossListener({ onContextLost }: { onContextLost: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const handle = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", handle);
    return () => canvas.removeEventListener("webglcontextlost", handle);
  }, [canvas, onContextLost]);
  return null;
}

/**
 * The 3D surface: orthographic isometric camera, lights and the ground grid.
 *
 * Renders **on demand**: a frame is drawn only when something asks for one (the timeline
 * while playing, a camera move, an easing highlight). When nothing changes, the GPU is idle;
 * in a hidden tab nothing asks, because animation frames stop.
 */
export function SceneCanvas({
  children,
  onPointerMissed,
  onContextLost,
  statsRef,
}: SceneCanvasProps) {
  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, MAX_DPR]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{
        position: INITIAL_POSITION.toArray(),
        zoom: 50,
        near: 0.1,
        far: CAMERA_DISTANCE * 4,
      }}
      onPointerMissed={onPointerMissed}
    >
      <SceneResourcesProvider>
        <ambientLight intensity={1.6} />
        <directionalLight position={[4, 10, 7]} intensity={4.5} />
        <Grid
          args={[60, 60]}
          cellSize={1}
          cellThickness={0.6}
          cellColor={SCENE_COLORS.grid}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={SCENE_COLORS.gridMajor}
          infiniteGrid
          fadeFrom={0}
          fadeDistance={30}
          fadeStrength={1.6}
        />
        {children}
      </SceneResourcesProvider>
      {statsRef && <FrameStats statsRef={statsRef} />}
      {onContextLost && <ContextLossListener onContextLost={onContextLost} />}
    </Canvas>
  );
}
