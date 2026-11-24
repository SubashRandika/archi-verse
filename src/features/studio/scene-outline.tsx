"use client";

import { useStrings } from "@/features/locale/use-strings";
import { cn } from "@/lib/utils";
import { useStudioModule, useStudioSession } from "./studio-session";

/**
 * Keyboard and screen-reader access to the scene: one button per component, in sync with
 * selection in the 3D view. Visually hidden until it receives focus, then shown as a small
 * panel in the corner of the plate.
 */
export function SceneOutline() {
  const learningModule = useStudioModule();
  const selectedId = useStudioSession((session) => session.selectedId);
  const select = useStudioSession((session) => session.select);
  const t = useStrings();

  return (
    <nav
      aria-label={t.sceneComponents}
      className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-3 focus-within:left-3 focus-within:z-30 focus-within:w-56 focus-within:rounded-md focus-within:border focus-within:border-rule-strong focus-within:bg-hull-raised focus-within:p-2 focus-within:shadow-lg"
    >
      <p className="px-2 pb-1 text-label text-graphite">{t.sceneComponents}</p>
      <ul className="flex flex-col gap-0.5">
        {learningModule.layout.components
          .filter((component) => !component.decorative)
          .map((component) => {
            const selected = component.id === selectedId;
            return (
              <li key={component.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => select(selected ? null : component.id)}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-2 rounded-sm px-2 py-1 text-left text-caption hover:bg-hull-hover",
                    selected ? "text-flow-selection" : "text-paper",
                  )}
                >
                  {component.label}
                  <span className="text-label text-graphite">{component.role}</span>
                </button>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
