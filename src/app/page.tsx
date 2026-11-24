import { Sidebar } from "@/features/explorer/sidebar";
import { InspectorPanel } from "@/features/inspector/inspector-panel";
import { AppShell } from "@/features/shell/app-shell";
import { Studio } from "@/features/studio/studio";
import { StudioPreviewProvider } from "@/features/studio/studio-preview-context";

/**
 * Phase 2: the application shell with the Learning Studio for the API Gateway concept,
 * using placeholder content. Phase 3 introduces concept routing (`/learn/[conceptSlug]`).
 */
export default function HomePage() {
  return (
    <StudioPreviewProvider>
      <AppShell sidebar={<Sidebar />} inspector={<InspectorPanel />}>
        <Studio />
      </AppShell>
    </StudioPreviewProvider>
  );
}
