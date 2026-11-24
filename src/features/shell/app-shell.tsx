"use client";

import { X } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGroupRef, usePanelRef } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { useHasHydrated } from "@/features/progress/persisted-state";
import { ShellContext, type ShellState } from "./shell-context";
import { useIsClient, useLayoutMode } from "./use-layout-mode";

/* Panel constraints. Numbers are pixels (react-resizable-panels v4). */
const SIDEBAR = { default: 288, min: 232, max: 400, rail: 56 } as const;
const INSPECTOR = { default: 384, min: 320, max: 560 } as const;
const STUDIO_MIN = 420;

interface AppShellProps {
  sidebar: ReactNode;
  inspector: ReactNode;
  /** The Learning Studio (main region). */
  children: ReactNode;
}

/**
 * Responsive application frame: owns panel layout and collapse state, and exposes it to
 * descendants through `useShell()`. Content components render their own landmarks.
 */
export function AppShell({ sidebar, inspector, children }: AppShellProps) {
  const layout = useLayoutMode();
  const isClient = useIsClient();
  const sidebarPanel = usePanelRef();
  const inspectorPanel = usePanelRef();

  const [sidebarRail, setSidebarRail] = useState(false);
  const [inspectorHidden, setInspectorHidden] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [inspectorSheetOpen, setInspectorSheetOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (layout !== "desktop") {
      setSidebarDrawerOpen((open) => !open);
      return;
    }
    const panel = sidebarPanel.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  }, [layout, sidebarPanel]);

  const openSidebar = useCallback(() => {
    if (layout !== "desktop") setSidebarDrawerOpen(true);
    else sidebarPanel.current?.expand();
  }, [layout, sidebarPanel]);

  const toggleInspector = useCallback(() => {
    if (layout === "mobile") {
      setInspectorSheetOpen((open) => !open);
      return;
    }
    const panel = inspectorPanel.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  }, [layout, inspectorPanel]);

  const shell = useMemo<ShellState>(
    () => ({
      layout,
      sidebarCollapsed: layout === "desktop" ? sidebarRail : !sidebarDrawerOpen,
      inspectorCollapsed: layout === "mobile" ? !inspectorSheetOpen : inspectorHidden,
      toggleSidebar,
      toggleInspector,
      openSidebar,
      dismissSidebarDrawer: () => setSidebarDrawerOpen(false),
    }),
    [
      layout,
      sidebarRail,
      sidebarDrawerOpen,
      inspectorSheetOpen,
      inspectorHidden,
      toggleSidebar,
      toggleInspector,
      openSidebar,
    ],
  );

  const studio = (
    <ResizablePanel id="studio" minSize={STUDIO_MIN}>
      {children}
    </ResizablePanel>
  );

  const inspectorPanelElement = (
    <ResizablePanel
      id="inspector"
      panelRef={inspectorPanel}
      defaultSize={INSPECTOR.default}
      minSize={INSPECTOR.min}
      maxSize={INSPECTOR.max}
      collapsible
      collapsedSize={0}
      onResize={(size) => setInspectorHidden(size.inPixels < 1)}
    >
      {inspector}
    </ResizablePanel>
  );

  return (
    <ShellContext.Provider value={shell}>
      <TooltipProvider delay={400}>
        <a
          href="#studio"
          className="sr-only z-50 rounded-md bg-paper px-3 py-2 text-ui font-medium text-hull focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to learning studio
        </a>

        {/*
          The static HTML is always the desktop layout. Below 1024px it stays hidden until the
          client has switched to the right layout (see globals.css), so small screens never
          flash the desktop layout.
        */}
        <div
          data-shell=""
          data-ready={isClient ? "true" : "false"}
          className="flex h-dvh w-full overflow-hidden bg-hull"
        >
          {layout === "desktop" ? (
            <PersistentPanelGroup id="shell-desktop">
              <ResizablePanel
                id="sidebar"
                panelRef={sidebarPanel}
                defaultSize={SIDEBAR.default}
                minSize={SIDEBAR.min}
                maxSize={SIDEBAR.max}
                collapsible
                collapsedSize={SIDEBAR.rail}
                onResize={(size) => setSidebarRail(size.inPixels < SIDEBAR.min - 1)}
              >
                {sidebar}
              </ResizablePanel>
              <ResizableHandle aria-label="Resize navigation" />
              {studio}
              <ResizableHandle aria-label="Resize explanation panel" />
              {inspectorPanelElement}
            </PersistentPanelGroup>
          ) : layout === "tablet" ? (
            <PersistentPanelGroup id="shell-tablet">
              {studio}
              <ResizableHandle aria-label="Resize explanation panel" />
              {inspectorPanelElement}
            </PersistentPanelGroup>
          ) : (
            <div className="flex min-w-0 flex-1">{children}</div>
          )}
        </div>

        {layout !== "desktop" && (
          <Sheet open={sidebarDrawerOpen} onOpenChange={setSidebarDrawerOpen}>
            <SheetContent side="left" className="w-[min(88vw,22rem)] gap-0 bg-hull p-0">
              <SheetTitle className="sr-only">Learning navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Browse categories and concepts.
              </SheetDescription>
              {sidebar}
            </SheetContent>
          </Sheet>
        )}

        {layout === "mobile" && (
          <Sheet open={inspectorSheetOpen} onOpenChange={setInspectorSheetOpen}>
            <SheetContent
              side="bottom"
              showCloseButton={false}
              className="gap-0 rounded-t-xl bg-hull p-0 data-[side=bottom]:h-[78dvh]"
            >
              <div className="relative flex h-9 shrink-0 items-center justify-center border-b border-rule">
                <span aria-hidden="true" className="h-1 w-10 rounded-full bg-rule-strong" />
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Close explanation"
                      className="absolute right-2 text-graphite hover:text-paper"
                    />
                  }
                >
                  <X />
                </SheetClose>
              </div>
              <SheetTitle className="sr-only">Explanation</SheetTitle>
              <SheetDescription className="sr-only">
                Explanation for the current step and details of the selected component.
              </SheetDescription>
              {inspector}
            </SheetContent>
          </Sheet>
        )}
      </TooltipProvider>
    </ShellContext.Provider>
  );
}

/**
 * A horizontal panel group whose layout (sizes and collapsed panels) is saved per group id.
 *
 * Saved layouts load after hydration, so they are applied with `setLayout` once preferences
 * have loaded. Changes are only saved after that point — the initial default layout must
 * never overwrite a saved one.
 */
function PersistentPanelGroup({ id, children }: { id: string; children: ReactNode }) {
  const groupRef = useGroupRef();
  const preferencesLoaded = useHasHydrated(usePreferencesStore);
  const savedLayout = usePreferencesStore((state) => state.panelLayouts[id]);
  const setPanelLayout = usePreferencesStore((state) => state.setPanelLayout);
  const restored = useRef(false);

  useEffect(() => {
    if (!preferencesLoaded || restored.current) return;
    restored.current = true;
    if (savedLayout) groupRef.current?.setLayout({ ...savedLayout });
  }, [preferencesLoaded, savedLayout, groupRef]);

  return (
    <ResizablePanelGroup
      id={id}
      orientation="horizontal"
      groupRef={groupRef}
      onLayoutChanged={(layout, meta) => {
        if (restored.current) setPanelLayout(id, meta.requestedLayout ?? layout);
      }}
    >
      {children}
    </ResizablePanelGroup>
  );
}
