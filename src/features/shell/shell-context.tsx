"use client";

import { createContext, useContext } from "react";
import type { LayoutMode } from "./use-layout-mode";

export interface ShellState {
  layout: LayoutMode;
  /** Desktop: sidebar is reduced to the icon rail. */
  sidebarCollapsed: boolean;
  /** Desktop/tablet: inspector panel is hidden. Mobile: bottom sheet is closed. */
  inspectorCollapsed: boolean;
  toggleSidebar: () => void;
  toggleInspector: () => void;
  /** Expands the sidebar (or opens the drawer on smaller screens). */
  openSidebar: () => void;
  /** Closes the drawer on smaller screens; no-op on desktop. */
  dismissSidebarDrawer: () => void;
}

export const ShellContext = createContext<ShellState | null>(null);

export function useShell(): ShellState {
  const shell = useContext(ShellContext);
  if (!shell) throw new Error("useShell must be used inside <AppShell>.");
  return shell;
}
