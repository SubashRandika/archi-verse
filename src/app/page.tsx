import Link from "next/link";
import { DEFAULT_CONCEPT_ID } from "@/content/catalog";
import { ResumeLearning } from "@/features/explorer/resume-learning";

/**
 * "/" reopens the concept the learner had open last (or API Gateway on a first visit).
 * The redirect happens on the client because progress lives in this browser's storage.
 */
export default function HomePage() {
  return (
    <main className="flex h-full items-center justify-center bg-hull">
      <ResumeLearning />
      <noscript>
        <Link href={`/learn/${DEFAULT_CONCEPT_ID}`} className="text-paper underline">
          Open the learning studio
        </Link>
      </noscript>
    </main>
  );
}
