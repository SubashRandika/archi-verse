"use client";

import { PlaybackDock } from "@/features/playback/playback-dock";
import { DraftingPlate } from "./drafting-plate";
import { SceneOutline } from "./scene-outline";
import { StudioHeader } from "./studio-header";
import { StudioStage } from "./studio-stage";
import { useStudioShortcuts } from "./use-studio-shortcuts";

/** The Learning Studio of a module: header, drafting plate (3D scene) and playback dock. */
export function Studio() {
  useStudioShortcuts();
  return (
    <main id="studio" tabIndex={-1} className="flex h-full min-w-0 flex-col outline-none">
      <StudioHeader />
      <DraftingPlate>
        <StudioStage />
        <SceneOutline />
        <PlaybackDock />
      </DraftingPlate>
    </main>
  );
}
