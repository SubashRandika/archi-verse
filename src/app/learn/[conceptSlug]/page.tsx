import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { concepts, getConcept } from "@/content/catalog";
import { PlannedConceptStudio } from "@/features/studio/planned-concept-studio";
import { Studio } from "@/features/studio/studio";

/** Every concept page is generated at build time; unknown slugs are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return concepts.map((concept) => ({ conceptSlug: concept.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[conceptSlug]">): Promise<Metadata> {
  const { conceptSlug } = await params;
  const concept = getConcept(conceptSlug);
  return concept ? { title: concept.title, description: concept.summary } : {};
}

export default async function ConceptPage({ params }: PageProps<"/learn/[conceptSlug]">) {
  const { conceptSlug } = await params;
  const concept = getConcept(conceptSlug);
  if (!concept) notFound();

  return concept.availability === "available" ? <Studio /> : <PlannedConceptStudio />;
}
