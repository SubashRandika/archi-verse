import { PlaybackDock } from "@/features/playback/playback-dock";
import { DraftingPlate } from "./drafting-plate";
import { PlaceholderScene } from "./placeholder-scene";
import { StudioHeader } from "./studio-header";

/** The Learning Studio: header, drafting plate (scene) and playback dock. */
export function Studio() {
  return (
    <main id="studio" tabIndex={-1} className="flex h-full min-w-0 flex-col outline-none">
      <StudioHeader />
      <DraftingPlate>
        <PlaceholderScene />
        <PlaybackDock />
      </DraftingPlate>
    </main>
  );
}
