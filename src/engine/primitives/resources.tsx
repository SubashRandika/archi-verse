"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";

/**
 * GPU resources shared by every object in one scene: three unit geometries, their outline
 * geometries and two generated textures. Created once per canvas and disposed with it.
 */
export interface SceneResources {
  readonly box: THREE.BoxGeometry;
  readonly cylinder: THREE.CylinderGeometry;
  readonly plane: THREE.PlaneGeometry;
  readonly boxEdges: LineSegmentsGeometry;
  readonly cylinderEdges: LineSegmentsGeometry;
  /** Soft radial dot, for packet halos. */
  readonly halo: THREE.Texture;
  /** Soft round shadow, for component footprints. */
  readonly footprint: THREE.Texture;
}

const EDGE_THRESHOLD_DEGREES = 20;

function edgesOf(geometry: THREE.BufferGeometry) {
  const edges = new THREE.EdgesGeometry(geometry, EDGE_THRESHOLD_DEGREES);
  const lines = new LineSegmentsGeometry().fromEdgesGeometry(edges);
  edges.dispose();
  return lines;
}

function radialTexture(size: number, stops: readonly [number, string][]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const half = size / 2;
    const gradient = context.createRadialGradient(half, half, 0, half, half, half);
    for (const [offset, color] of stops) gradient.addColorStop(offset, color);
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createResources(): SceneResources {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 48);
  return {
    box,
    cylinder,
    plane: new THREE.PlaneGeometry(1, 1),
    boxEdges: edgesOf(box),
    cylinderEdges: edgesOf(cylinder),
    halo: radialTexture(64, [
      [0, "rgba(255,255,255,1)"],
      [0.25, "rgba(255,255,255,0.45)"],
      [1, "rgba(255,255,255,0)"],
    ]),
    footprint: radialTexture(64, [
      [0, "rgba(255,255,255,0.9)"],
      [0.55, "rgba(255,255,255,0.45)"],
      [1, "rgba(255,255,255,0)"],
    ]),
  };
}

function disposeResources(resources: SceneResources) {
  for (const resource of Object.values(resources)) resource.dispose();
}

const SceneResourcesContext = createContext<SceneResources | null>(null);

export function SceneResourcesProvider({ children }: { children: ReactNode }) {
  const [resources] = useState(createResources);
  useEffect(() => () => disposeResources(resources), [resources]);
  return (
    <SceneResourcesContext.Provider value={resources}>{children}</SceneResourcesContext.Provider>
  );
}

export function useSceneResources(): SceneResources {
  const resources = useContext(SceneResourcesContext);
  if (!resources)
    throw new Error("useSceneResources must be used inside <SceneResourcesProvider>.");
  return resources;
}
