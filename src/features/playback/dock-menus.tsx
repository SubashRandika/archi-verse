"use client";

import { type LazyMenuProps, useLazyMenuState } from "@/components/lazy-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LearningModule, ModuleLabels } from "@/content/modules";
import type { StudioStrings } from "@/features/locale/strings";
import { PLAYBACK_SPEEDS, type PlaybackSpeed } from "@/features/preferences/preferences-store";
import { formatSpeed } from "./format";

/*
 * The dock's menus, loaded on first use (see `lazyMenu`). Their triggers are built by the
 * dock, so they render before this module loads.
 */

const MAIN_PATH_VALUE = "main-path";

export interface ScenarioMenuProps {
  learningModule: LearningModule;
  labels: ModuleLabels;
  strings: StudioStrings;
  current: string | null;
  onChange: (scenarioId: string | null) => void;
}

/** Main path or one of the module's failure scenarios. */
export function ScenarioMenu({
  learningModule,
  labels,
  strings: t,
  current,
  onChange,
  trigger,
  defaultOpen,
}: ScenarioMenuProps & LazyMenuProps) {
  const { open, onOpenChange, triggerRef } = useLazyMenuState(defaultOpen);
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger ref={triggerRef} render={trigger} />
      <DropdownMenuContent side="top" align="end" className="w-72">
        <DropdownMenuRadioGroup
          value={current ?? MAIN_PATH_VALUE}
          onValueChange={(value) => onChange(value === MAIN_PATH_VALUE ? null : String(value))}
        >
          <DropdownMenuRadioItem value={MAIN_PATH_VALUE} closeOnClick>
            <span className="flex flex-col">
              <span>{t.mainPath}</span>
              <span className="text-label text-graphite">{t.mainPathSummary}</span>
            </span>
          </DropdownMenuRadioItem>
          {learningModule.scenarios.map((scenario) => (
            <DropdownMenuRadioItem key={scenario.id} value={scenario.id} closeOnClick>
              <span className="flex flex-col">
                <span>{labels.scenarios[scenario.id]?.title}</span>
                <span className="text-label text-graphite">
                  {labels.scenarios[scenario.id]?.summary}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface SpeedMenuProps {
  speed: PlaybackSpeed;
  onChange: (speed: PlaybackSpeed) => void;
}

export function SpeedMenu({
  speed,
  onChange,
  trigger,
  defaultOpen,
}: SpeedMenuProps & LazyMenuProps) {
  const { open, onOpenChange, triggerRef } = useLazyMenuState(defaultOpen);
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger ref={triggerRef} render={trigger} />
      <DropdownMenuContent side="top" align="end" className="w-28">
        <DropdownMenuRadioGroup
          value={speed}
          onValueChange={(value) => onChange(value as PlaybackSpeed)}
        >
          {PLAYBACK_SPEEDS.map((option) => (
            <DropdownMenuRadioItem key={option} value={option} className="tabular-nums">
              {formatSpeed(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
