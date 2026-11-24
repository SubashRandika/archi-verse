"use client";

import { type ReactNode, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type ExplanationLevel, useStudioPreview } from "@/features/studio/studio-preview-context";
import { ExplanationBlocks } from "./explanation-blocks";
import { previewComponent, previewStepExplanations } from "./placeholder";

type InspectorTab = "step" | "component";

/**
 * Learning inspector: explanation of the current step and details of the selected
 * component, at the chosen explanation level. Switching level never resets the tab or step.
 */
export function InspectorPanel() {
  const { currentStep, level, setLevel } = useStudioPreview();
  const [tab, setTab] = useState<InspectorTab>("step");
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
                The explanation for this step is written with the API Gateway module. Open step 2,
                “Anatomy of an HTTP request”, to see the explanation layout.
              </p>
            )}
          </TabsContent>

          <TabsContent value="component" className="px-5 pt-5 pb-8">
            <ComponentDetails level={level} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}

function ComponentDetails({ level }: { level: ExplanationLevel }) {
  const doc = previewComponent;
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
