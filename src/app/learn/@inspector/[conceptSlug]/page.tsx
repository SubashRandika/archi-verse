import { notFound } from "next/navigation";
import { concepts, getConcept } from "@/content/catalog";
import { getConceptSummary } from "@/content/catalog/summaries";
import { getModuleText } from "@/content/modules/text";
import { InspectorPanel } from "@/features/inspector/inspector-panel";
import { PlannedConceptInspector } from "@/features/inspector/planned-concept-inspector";

/**
 * The inspector slot (parallel route) of a concept page. Rendered on the server at build time:
 * the module's text is passed to the client inspector as props, so it ships as route data
 * (in the HTML and RSC payload), never as client JavaScript.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return concepts.map((concept) => ({ conceptSlug: concept.id }));
}

export default async function InspectorSlot({ params }: PageProps<"/learn/[conceptSlug]">) {
  const { conceptSlug } = await params;
  const concept = getConcept(conceptSlug);
  if (!concept) notFound();

  const text = getModuleText(concept.moduleId);
  return text ? (
    <InspectorPanel text={text} />
  ) : (
    <PlannedConceptInspector summary={getConceptSummary(concept.id) ?? ""} />
  );
}
