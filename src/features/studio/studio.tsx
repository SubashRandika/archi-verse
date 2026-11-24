"use client";

import { PlaybackDock } from "@/features/playback/playback-dock";
import { DraftingPlate } from "./drafting-plate";
import { type LocalizedModuleLabels, ModuleLabelsProvider } from "./module-labels";
import { SceneOutline } from "./scene-outline";
import { StudioHeader } from "./studio-header";
import { StudioStage } from "./studio-stage";
import { useStudioShortcuts } from "./use-studio-shortcuts";

/**
 * The Learning Studio of a module: header, drafting plate (3D scene) and playback dock.
 * `labels` are the module's titles in every language, passed by the route as data.
 */
export function Studio({ labels }: { labels: LocalizedModuleLabels }) {
  useStudioShortcuts();
  return (
    <ModuleLabelsProvider labels={labels}>
      <main id="studio" tabIndex={-1} className="flex h-full min-w-0 flex-col outline-none">
        <StudioHeader />
        <DraftingPlate>
          <StudioStage />
          <SceneOutline />
          <PlaybackDock />
        </DraftingPlate>
      </main>
    </ModuleLabelsProvider>
  );
}
