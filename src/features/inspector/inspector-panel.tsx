"use client";

import { type ReactNode, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ComponentDoc, ExplanationLevel, ModuleText } from "@/content/modules";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { CompletionToggle } from "@/features/progress/completion-toggle";
import { useCurrentConcept } from "@/features/studio/current-concept";
import { MAIN_TRACK } from "@/features/studio/session-store";
import {
  useCurrentStep,
  useStudioModule,
  useStudioSession,
} from "@/features/studio/studio-session";
import { ExplanationBlocks, MessageFigure, TermList } from "./explanation-blocks";

type InspectorTab = "step" | "component";

/**
 * Learning inspector: explanation of the current step and details of the selected
 * component, at the chosen explanation level. Switching level never resets the tab or step.
 *
 * `text` is the module's text, delivered by the inspector route as data (not bundled).
 */
export function InspectorPanel({ text }: { text: ModuleText }) {
  const selectedId = useStudioSession((session) => session.selectedId);
  const inspectedMessage = useStudioSession((session) => session.inspectedMessage);
  const level = usePreferencesStore((state) => state.explanationLevel);
  const setLevel = usePreferencesStore((state) => state.setExplanationLevel);
  const [tab, setTab] = useState<InspectorTab>("step");

  // A new selection brings its details into view (adjusting state during render, no effect):
  // a component opens the Component tab, an inspected packet the Step tab (its message).
  const [shown, setShown] = useState({ selectedId, inspectedMessage });
  if (selectedId !== shown.selectedId || inspectedMessage !== shown.inspectedMessage) {
    setShown({ selectedId, inspectedMessage });
    if (selectedId) setTab("component");
    else if (inspectedMessage) setTab("step");
  }

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
            <StepTab text={text} level={level} inspectedMessage={inspectedMessage} />
          </TabsContent>
          <TabsContent value="component" className="px-5 pt-5 pb-8">
            <ComponentTab text={text} selectedId={selectedId} level={level} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}

function StepTab({
  text,
  level,
  inspectedMessage,
}: {
  text: ModuleText;
  level: ExplanationLevel;
  inspectedMessage: string | null;
}) {
  const { step, scenario, index, count } = useCurrentStep();
  const trackId = useStudioSession((session) => session.trackId);
  const stepText = text.steps[step.id];
  const messageId = inspectedMessage ?? stepText?.message;
  const message = messageId ? text.messages[messageId] : undefined;
  const terms = (stepText?.terms ?? []).flatMap((id) => text.glossary[id] ?? []);
  const isFinalStep = trackId === MAIN_TRACK && index === count - 1;

  return (
    <div className="flex flex-col gap-5">
      <header>
        {scenario && <p className="mb-1 text-label text-graphite">Scenario: {scenario.title}</p>}
        <h2 className="text-title font-semibold text-paper">{step.title}</h2>
      </header>
      {stepText && <ExplanationBlocks blocks={stepText.explanation[level]} />}
      {message && (
        <section aria-label="Message in flight" className="flex flex-col gap-2">
          <h3 className="text-caption font-medium text-graphite">
            {inspectedMessage ? "Inspected message" : "Message in flight"}
          </h3>
          <MessageFigure message={message} highlighted={Boolean(inspectedMessage)} />
        </section>
      )}
      <TermList terms={terms} />
      {isFinalStep && <FinishSection />}
    </div>
  );
}

/** End of the main path: scenarios to try next, and marking the concept complete. */
function FinishSection() {
  const learningModule = useStudioModule();
  const { concept } = useCurrentConcept();
  const switchTrack = useStudioSession((session) => session.switchTrack);

  return (
    <section
      aria-labelledby="finish-heading"
      className="flex flex-col gap-3 rounded-md border border-rule-strong bg-hull-raised p-4"
    >
      <h3 id="finish-heading" className="text-caption font-medium text-paper">
        You’ve followed a request from start to finish
      </h3>
      <p className="text-caption text-paper/85">See what happens when something goes wrong:</p>
      <ul className="flex flex-col gap-1">
        {learningModule.scenarios.map((scenario) => (
          <li key={scenario.id}>
            <button
              type="button"
              onClick={() => switchTrack(scenario.id)}
              className="w-full rounded-sm px-2 py-1.5 text-left hover:bg-hull-hover"
            >
              <span className="block text-caption font-medium text-paper">{scenario.title}</span>
              <span className="block text-label text-graphite">{scenario.summary}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 border-t border-rule pt-3">
        <p className="text-caption text-paper/85">Done with this concept?</p>
        <CompletionToggle conceptId={concept.id} />
      </div>
    </section>
  );
}

function ComponentTab({
  text,
  selectedId,
  level,
}: {
  text: ModuleText;
  selectedId: string | null;
  level: ExplanationLevel;
}) {
  const learningModule = useStudioModule();
  const select = useStudioSession((session) => session.select);
  const selectable = learningModule.layout.components.filter((c) => !c.decorative);
  const component = selectable.find((candidate) => candidate.id === selectedId);

  if (!component) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-reading text-graphite">
          Select a component in the scene to see what it does, or pick one here.
        </p>
        <ul className="flex flex-col gap-1">
          {selectable.map((candidate) => (
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

  const doc = text.components[component.id];
  if (doc) return <ComponentDetails doc={doc} level={level} />;
  return (
    <article className="flex flex-col gap-3">
      <header>
        <h2 className="text-title font-semibold text-paper">{component.label}</h2>
        <p className="text-caption text-graphite">{component.role}</p>
      </header>
    </article>
  );
}

function ComponentDetails({ doc, level }: { doc: ComponentDoc; level: ExplanationLevel }) {
  return (
    <article className="flex flex-col gap-6">
      <header>
        <h2 className="text-title font-semibold text-paper">{doc.name}</h2>
        <p className="text-caption text-graphite">{doc.kind}</p>
        <p className="mt-3 text-reading text-paper/90">{doc.purpose[level]}</p>
      </header>

      <Section title="How it works">
        <p className="text-caption text-paper/90">{doc.howItWorks}</p>
      </Section>

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

      <Section title="Examples">
        <BulletList items={doc.examples} />
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
