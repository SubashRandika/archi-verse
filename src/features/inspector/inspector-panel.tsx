"use client";

import { type ReactNode, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  type ExplanationLevel,
  usePreferencesStore,
} from "@/features/preferences/preferences-store";
import {
  useCurrentStep,
  useStudioModule,
  useStudioSession,
} from "@/features/studio/studio-session";
import { ExplanationBlocks } from "./explanation-blocks";
import {
  type PreviewComponentDoc,
  previewComponentDocs,
  previewStepExplanations,
} from "./placeholder";

type InspectorTab = "step" | "component";

/**
 * Learning inspector: explanation of the current step and details of the selected
 * component, at the chosen explanation level. Switching level never resets the tab or step.
 * Selecting a component (in the scene or the component list) opens its details.
 */
export function InspectorPanel() {
  const { step: currentStep } = useCurrentStep();
  const selectedId = useStudioSession((session) => session.selectedId);
  const level = usePreferencesStore((state) => state.explanationLevel);
  const setLevel = usePreferencesStore((state) => state.setExplanationLevel);
  const [tab, setTab] = useState<InspectorTab>("step");

  // A new selection brings its details into view (adjusting state during render, no effect).
  const [shownSelection, setShownSelection] = useState(selectedId);
  if (selectedId !== shownSelection) {
    setShownSelection(selectedId);
    if (selectedId) setTab("component");
  }

  const blocks = previewStepExplanations[currentStep.id]?.[level];

  return (
    <aside aria-label="Learning inspector" className="flex h-full min-w-0 flex-col bg-hull">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as InspectorTab)}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-rule px-3">
          <TabsList variant="line" className="h-8 gap-3">
            <TabsTrigger value="step" className="px-0.5 text-caption">
              Step
            </TabsTrigger>
            <TabsTrigger value="component" className="px-0.5 text-caption">
              Component
            </TabsTrigger>
          </TabsList>

          <ToggleGroup
            aria-label="Explanation level"
            variant="outline"
            size="sm"
            spacing={0}
            value={[level]}
            onValueChange={(value) => {
              const next = value[0] as ExplanationLevel | undefined;
              if (next) setLevel(next);
            }}
          >
            <ToggleGroupItem value="beginner" className="px-2.5 text-caption">
              Beginner
            </ToggleGroupItem>
            <ToggleGroupItem value="advanced" className="px-2.5 text-caption">
              Advanced
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <TabsContent value="step" className="px-5 pt-5 pb-8">
            <h2 className="mb-4 text-title font-semibold text-paper">{currentStep.title}</h2>
            {blocks ? (
              <ExplanationBlocks blocks={blocks} />
            ) : (
              <p className="text-reading text-graphite">
                The explanation for this step is written with the full API Gateway module.
              </p>
            )}
          </TabsContent>

          <TabsContent value="component" className="px-5 pt-5 pb-8">
            <ComponentTab selectedId={selectedId} level={level} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}

function ComponentTab({
  selectedId,
  level,
}: {
  selectedId: string | null;
  level: ExplanationLevel;
}) {
  const learningModule = useStudioModule();
  const select = useStudioSession((session) => session.select);
  const component = learningModule.layout.components.find(
    (candidate) => candidate.id === selectedId,
  );

  if (!component) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-reading text-graphite">
          Select a component in the scene to see what it does, or pick one here.
        </p>
        <ul className="flex flex-col gap-1">
          {learningModule.layout.components.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                onClick={() => select(candidate.id)}
                className="flex w-full items-baseline justify-between gap-3 rounded-sm px-2 py-1.5 text-left text-caption text-paper hover:bg-hull-hover"
              >
                {candidate.label}
                <span className="text-label text-graphite">{candidate.role}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const doc = previewComponentDocs[component.id];
  if (doc) return <ComponentDetails doc={doc} level={level} />;
  return (
    <article className="flex flex-col gap-3">
      <header>
        <h2 className="text-title font-semibold text-paper">{component.label}</h2>
        <p className="text-caption text-graphite">{component.role}</p>
      </header>
      <p className="text-reading text-graphite">
        Details for this component are written with the full API Gateway module.
      </p>
    </article>
  );
}

function ComponentDetails({ doc, level }: { doc: PreviewComponentDoc; level: ExplanationLevel }) {
  return (
    <article className="flex flex-col gap-6">
      <header>
        <h2 className="text-title font-semibold text-paper">{doc.name}</h2>
        <p className="text-caption text-graphite">{doc.kind}</p>
        <p className="mt-3 text-reading text-paper/90">{doc.purpose[level]}</p>
      </header>

      <Section title="Responsibilities">
        <BulletList items={doc.responsibilities} />
      </Section>

      <Section title="Inputs and outputs">
        <dl className="grid grid-cols-2 gap-4 text-caption">
          <div>
            <dt className="mb-1 text-graphite">Receives</dt>
            {doc.inputs.map((item) => (
              <dd key={item} className="text-paper/90">
                {item}
              </dd>
            ))}
          </div>
          <div>
            <dt className="mb-1 text-graphite">Sends</dt>
            {doc.outputs.map((item) => (
              <dd key={item} className="text-paper/90">
                {item}
              </dd>
            ))}
          </div>
        </dl>
      </Section>

      <Section title="Talks to">
        <ChipList items={doc.talksTo} />
      </Section>

      <Section title="Common technologies">
        <ChipList items={doc.technologies} />
      </Section>

      <Section title="Trade-offs">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-1.5 text-caption text-flow-response">Advantages</h4>
            <BulletList items={doc.advantages} />
          </div>
          <div>
            <h4 className="mb-1.5 text-caption text-flow-warning">Limitations</h4>
            <BulletList items={doc.limitations} />
          </div>
        </div>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-rule pt-4">
      <h3 className="mb-2.5 text-caption font-medium text-graphite">{title}</h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-caption text-paper/90">
      {items.map((item) => (
        <li key={item} className="relative pl-3.5">
          <span
            aria-hidden="true"
            className="absolute top-[0.6em] left-0 size-1 rounded-full bg-graphite"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ChipList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-sm border border-rule bg-hull-raised px-2 py-0.5 text-caption text-paper/90"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
