"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import type { ComponentKind } from "@/lib/scene-spec";
import { SCENE_PALETTES, type SceneTheme } from "../scene/palette";
import { buildKindModel, type KindModel } from "./model-builder";
import { createScreenAtlas } from "./screen-atlas";

/**
 * GPU resources shared by every object in one scene: three unit geometries, their outline
 * geometries and two generated textures. Created once per canvas and disposed with it.
 */
export interface SceneResources {
  readonly box: THREE.BoxGeometry;
  readonly plane: THREE.PlaneGeometry;
  /** Soft radial dot, for packet halos. */
  readonly halo: THREE.Texture;
  /** Soft round shadow, for component footprints. */
  readonly footprint: THREE.Texture;
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
  return {
    box,
    plane: new THREE.PlaneGeometry(1, 1),
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

/**
 * Component models and the screen texture for one theme, built on first use and shared by
 * every component of a kind. A theme change builds a new set and disposes the old one.
 */
class ThemedModels {
  private readonly models = new Map<ComponentKind, KindModel>();
  private atlas: THREE.Texture | undefined;

  constructor(private readonly theme: SceneTheme) {}

  model(kind: ComponentKind): KindModel {
    let model = this.models.get(kind);
    if (!model) {
      model = buildKindModel(kind, SCENE_PALETTES[this.theme]);
      this.models.set(kind, model);
    }
    return model;
  }

  screenAtlas(): THREE.Texture {
    return (this.atlas ??= createScreenAtlas(SCENE_PALETTES[this.theme]));
  }

  dispose() {
    for (const model of this.models.values()) model.dispose();
    this.models.clear();
    this.atlas?.dispose();
  }
}

const SceneResourcesContext = createContext<SceneResources | null>(null);
const ThemedModelsContext = createContext<ThemedModels | null>(null);

export function SceneResourcesProvider({
  theme,
  children,
}: {
  theme: SceneTheme;
  children: ReactNode;
}) {
  const [resources] = useState(createResources);
  useEffect(() => () => disposeResources(resources), [resources]);
  const models = useMemo(() => new ThemedModels(theme), [theme]);
  useEffect(() => () => models.dispose(), [models]);
  return (
    <SceneResourcesContext.Provider value={resources}>
      <ThemedModelsContext.Provider value={models}>{children}</ThemedModelsContext.Provider>
    </SceneResourcesContext.Provider>
  );
}

function useThemedModels(): ThemedModels {
  const models = useContext(ThemedModelsContext);
  if (!models) throw new Error("Scene models must be used inside <SceneResourcesProvider>.");
  return models;
}

/** The shared model of a component kind, in the current theme. */
export function useKindModel(kind: ComponentKind): KindModel {
  return useThemedModels().model(kind);
}

/** The texture with every screen picture, in the current theme. */
export function useScreenAtlas(): THREE.Texture {
  return useThemedModels().screenAtlas();
}

export function useSceneResources(): SceneResources {
  const resources = useContext(SceneResourcesContext);
  if (!resources)
    throw new Error("useSceneResources must be used inside <SceneResourcesProvider>.");
  return resources;
}
