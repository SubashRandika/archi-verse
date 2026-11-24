import { Sidebar } from "@/features/explorer/sidebar";
import { ConceptInspector } from "@/features/inspector/concept-inspector";
import { AppShell } from "@/features/shell/app-shell";
import { CurrentConceptProvider } from "@/features/studio/current-concept";

/**
 * Persistent frame for every concept page. Because it sits above `[conceptSlug]`, navigating
 * between concepts keeps the shell, sidebar state and panel layout mounted.
 */
export default function LearnLayout({ children }: LayoutProps<"/learn">) {
  return (
    <CurrentConceptProvider>
      <AppShell sidebar={<Sidebar />} inspector={<ConceptInspector />}>
        {children}
      </AppShell>
    </CurrentConceptProvider>
  );
}
