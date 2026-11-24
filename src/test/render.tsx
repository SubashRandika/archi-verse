import { render, type RenderOptions } from "@testing-library/react";
import { useParams } from "next/navigation";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShellContext, type ShellState } from "@/features/shell/shell-context";
import { CurrentConceptProvider } from "@/features/studio/current-concept";
import { ModuleLabelsProvider } from "@/features/studio/module-labels";
import { apiGatewayLabels } from "./module-text";

interface StudioRenderOptions extends Omit<RenderOptions, "wrapper"> {
  shell?: Partial<ShellState>;
  /** The concept in the route (`/learn/[conceptSlug]`). */
  conceptSlug?: string;
  initialStepIndex?: number;
}

/** Renders UI inside the providers the studio expects, with a controllable fake shell. */
export function renderInStudio(
  ui: ReactElement,
  { shell, conceptSlug = "api-gateway", initialStepIndex, ...options }: StudioRenderOptions = {},
) {
  vi.mocked(useParams).mockReturnValue({ conceptSlug });

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
        <CurrentConceptProvider initialStepIndex={initialStepIndex}>
          <ModuleLabelsProvider labels={apiGatewayLabels}>
            <TooltipProvider>{children}</TooltipProvider>
          </ModuleLabelsProvider>
        </CurrentConceptProvider>
      </ShellContext.Provider>
    ),
    ...options,
  });

  return { ...result, shell: shellState };
}
