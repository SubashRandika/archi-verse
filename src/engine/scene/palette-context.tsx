"use client";

import { createContext, type ReactNode, useContext } from "react";
import { SCENE_PALETTES, type ScenePalette, type SceneTheme } from "./palette";

const ScenePaletteContext = createContext<ScenePalette>(SCENE_PALETTES.dark);

/** Gives every scene object the colours of the current theme. */
export function ScenePaletteProvider({
  theme,
  children,
}: {
  theme: SceneTheme;
  children: ReactNode;
}) {
  return (
    <ScenePaletteContext.Provider value={SCENE_PALETTES[theme]}>
      {children}
    </ScenePaletteContext.Provider>
  );
}

export function useScenePalette(): ScenePalette {
  return useContext(ScenePaletteContext);
}
