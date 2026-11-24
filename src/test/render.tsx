import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShellContext, type ShellState } from "@/features/shell/shell-context";
import { StudioPreviewProvider } from "@/features/studio/studio-preview-context";

interface StudioRenderOptions extends Omit<RenderOptions, "wrapper"> {
  shell?: Partial<ShellState>;
  initialStepIndex?: number;
}

/** Renders UI inside the providers the studio expects, with a controllable fake shell. */
export function renderInStudio(
  ui: ReactElement,
  { shell, initialStepIndex, ...options }: StudioRenderOptions = {},
) {
  const shellState: ShellState = {
    layout: "desktop",
    sidebarCollapsed: false,
    inspectorCollapsed: false,
    toggleSidebar: vi.fn(),
    toggleInspector: vi.fn(),
    openSidebar: vi.fn(),
    dismissSidebarDrawer: vi.fn(),
    ...shell,
  };

  const result = render(ui, {
    wrapper: ({ children }) => (
      <ShellContext.Provider value={shellState}>
        <StudioPreviewProvider initialStepIndex={initialStepIndex}>
          <TooltipProvider>{children}</TooltipProvider>
        </StudioPreviewProvider>
      </ShellContext.Provider>
    ),
    ...options,
  });

  return { ...result, shell: shellState };
}
