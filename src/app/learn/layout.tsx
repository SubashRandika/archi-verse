import { Sidebar } from "@/features/explorer/sidebar";
import { AppShell } from "@/features/shell/app-shell";
import { CurrentConceptProvider } from "@/features/studio/current-concept";

/**
 * Persistent frame for every concept page. Because it sits above `[conceptSlug]`, navigating
 * between concepts keeps the shell, sidebar state and panel layout mounted.
 *
 * `inspector` is a parallel route (`@inspector/[conceptSlug]`), so the inspector's content
 * comes from the server per concept while the panel around it stays mounted.
 */
export default function LearnLayout({ children, inspector }: LayoutProps<"/learn">) {
  return (
    <CurrentConceptProvider>
      <AppShell sidebar={<Sidebar />} inspector={inspector}>
        {children}
      </AppShell>
    </CurrentConceptProvider>
  );
}
