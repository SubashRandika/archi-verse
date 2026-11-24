"use client";

import {
  lazy,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useGroupRef, usePanelRef } from "react-resizable-panels";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStrings } from "@/features/locale/use-strings";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { useHasHydrated } from "@/features/progress/persisted-state";
import { ShellContext, type ShellState } from "./shell-context";
import { useIsClient, useLayoutMode } from "./use-layout-mode";

const loadSheets = () => import("./mobile-sheets");
const NavigationSheet = lazy(() => loadSheets().then((m) => ({ default: m.NavigationSheet })));
const ExplanationSheet = lazy(() => loadSheets().then((m) => ({ default: m.ExplanationSheet })));

/** True from the first time `open` is true: a drawer's code loads when it first opens. */
function useOpenedOnce(open: boolean) {
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);
  return opened;
}

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
  const sidebarDrawerLoaded = useOpenedOnce(sidebarDrawerOpen);
  // The explanation panel's handle follows the studio language. (Using the studio strings here
  // also puts them in the shared layout chunk instead of one copy per route chunk.)
  const t = useStrings();
  const inspectorSheetLoaded = useOpenedOnce(inspectorSheetOpen);

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
              <ResizableHandle aria-label={t.resizeExplanation} />
              {inspectorPanelElement}
            </PersistentPanelGroup>
          ) : layout === "tablet" ? (
            <PersistentPanelGroup id="shell-tablet">
              {studio}
              <ResizableHandle aria-label={t.resizeExplanation} />
              {inspectorPanelElement}
            </PersistentPanelGroup>
          ) : (
            <div className="flex min-w-0 flex-1">{children}</div>
          )}
        </div>

        {layout !== "desktop" && sidebarDrawerLoaded && (
          <Suspense fallback={null}>
            <NavigationSheet open={sidebarDrawerOpen} onOpenChange={setSidebarDrawerOpen}>
              {sidebar}
            </NavigationSheet>
          </Suspense>
        )}

        {layout === "mobile" && inspectorSheetLoaded && (
          <Suspense fallback={null}>
            <ExplanationSheet open={inspectorSheetOpen} onOpenChange={setInspectorSheetOpen}>
              {inspector}
            </ExplanationSheet>
          </Suspense>
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
