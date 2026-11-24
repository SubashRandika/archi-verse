"use client";

import { ArrowLeft, ChevronRight, Eye, FlaskConical, Lightbulb } from "lucide-react";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ComponentDoc, ExplanationLevel, LocaleText, ModuleText } from "@/content/modules";
import type { StudioStrings } from "@/features/locale/strings";
import { useLocale, useStrings } from "@/features/locale/use-strings";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import { CompletionToggle } from "@/features/progress/completion-toggle";
import { useCurrentConcept } from "@/features/studio/current-concept";
import { MAIN_TRACK } from "@/features/studio/session-store";
import {
  useCurrentStep,
  useStudioModule,
  useStudioSession,
} from "@/features/studio/studio-session";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/lib/locale";
import type { SceneComponent } from "@/lib/scene-spec";
import { cn } from "@/lib/utils";
import { ExplanationBlocks, MessageFigure, TermDefinitions } from "./explanation-blocks";

/**
 * The explanation panel. It shows one thing at a time: the current step (in simple words, an
 * everyday example, what to watch, then the real message and the words to know, folded away),
 * or, once a part of the scene is selected, that part, with a way back to the step.
 * The language and the explanation level can change at any time without losing the place.
 *
 * `text` is the module's text in every language, delivered by the inspector route as data.
 */
/**
 * Where focus goes after the panel switches view, when the switch started inside the panel:
 * opening a part moves focus to its heading; going back returns it to that part's button.
 * Selections made in the scene do not move focus.
 */
type FocusIntent = { readonly to: "part" } | { readonly to: "step"; readonly partId: string };
const FocusIntentContext = createContext<RefObject<FocusIntent | null> | null>(null);

function useFocusIntent() {
  const intent = useContext(FocusIntentContext);
  if (!intent) throw new Error("useFocusIntent must be used inside <InspectorPanel>.");
  return intent;
}

export function InspectorPanel({ text }: { text: ModuleText }) {
  const locale = useLocale();
  const t = useStrings();
  const level = usePreferencesStore((state) => state.explanationLevel);
  const selectedId = useStudioSession((session) => session.selectedId);
  const learningModule = useStudioModule();
  const copy = text.locales[locale];
  const part = learningModule.layout.components.find(
    (component) => component.id === selectedId && !component.decorative,
  );
  const panel = useRef<HTMLElement>(null);
  const focusIntent = useRef<FocusIntent | null>(null);
  const view = part?.id ?? "step";
  useEffect(() => {
    const intent = focusIntent.current;
    focusIntent.current = null;
    if (!intent || !panel.current) return;
    const target =
      intent.to === "part"
        ? panel.current.querySelector<HTMLElement>("[data-view-heading]")
        : (panel.current.querySelector<HTMLElement>(`[data-part-button="${intent.partId}"]`) ??
          panel.current.querySelector<HTMLElement>("[data-view-heading]"));
    target?.focus();
  }, [view]);

  return (
    <aside
      ref={panel}
      aria-label={t.inspector}
      lang={locale}
      className="flex h-full min-w-0 flex-col bg-hull"
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-rule px-3">
        <LanguageSwitch />
        <LevelSwitch />
      </div>
      {/* Keyed by view, so switching between step and part starts at the top. */}
      <ScrollArea key={view} className="min-h-0 flex-1">
        <div className="px-5 pt-5 pb-8">
          <FocusIntentContext.Provider value={focusIntent}>
            {part ? (
              <PartView part={part} doc={copy.components[part.id]} level={level} strings={t} />
            ) : (
              <StepView text={text} copy={copy} level={level} strings={t} />
            )}
          </FocusIntentContext.Provider>
        </div>
      </ScrollArea>
    </aside>
  );
}

function LanguageSwitch() {
  const locale = useLocale();
  const setLocale = usePreferencesStore((state) => state.setLocale);
  const t = useStrings();
  return (
    <ToggleGroup
      aria-label={t.language}
      variant="outline"
      size="sm"
      spacing={0}
      value={[locale]}
      onValueChange={(value) => {
        const next = value[0] as Locale | undefined;
        if (next) setLocale(next);
      }}
    >
      {LOCALES.map((option) => (
        <ToggleGroupItem key={option} value={option} lang={option} className="px-2.5 text-caption">
          {LOCALE_NAMES[option]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function LevelSwitch() {
  const level = usePreferencesStore((state) => state.explanationLevel);
  const setLevel = usePreferencesStore((state) => state.setExplanationLevel);
  const t = useStrings();
  return (
    <ToggleGroup
      aria-label={t.explanationLevel}
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
        {t.beginner}
      </ToggleGroupItem>
      <ToggleGroupItem value="advanced" className="px-2.5 text-caption">
        {t.advanced}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

// ---------------------------------------------------------------------------------------------
// Step
// ---------------------------------------------------------------------------------------------

function StepView({
  text,
  copy,
  level,
  strings: t,
}: {
  text: ModuleText;
  copy: LocaleText;
  level: ExplanationLevel;
  strings: StudioStrings;
}) {
  const { step, scenario, index, count } = useCurrentStep();
  const trackId = useStudioSession((session) => session.trackId);
  const inspectedMessage = useStudioSession((session) => session.inspectedMessage);
  const stepCopy = copy.steps[step.id];
  const links = text.steps[step.id];
  const messageId = inspectedMessage ?? links?.message;
  const message =
    messageId && text.messages[messageId]
      ? { ...text.messages[messageId], caption: copy.messages[messageId] ?? "" }
      : undefined;
  const terms = (links?.terms ?? []).flatMap((id) => copy.glossary[id] ?? []);
  const isFinalStep = trackId === MAIN_TRACK && index === count - 1;
  const [messageOpen, setMessageOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  if (!stepCopy) return null;
  const explanation = stepCopy.explanation[level];
  const beginner = level === "beginner";

  return (
    <article className="flex flex-col gap-6">
      <header>
        <p className="mb-1 text-label text-graphite">
          {scenario
            ? `${t.scenarioTitle(copy.scenarios[scenario.id]?.title ?? "")} · ${t.stepOf(index + 1, count)}`
            : t.stepOf(index + 1, count)}
        </p>
        <h2
          data-view-heading
          tabIndex={-1}
          className="text-title font-semibold text-paper outline-none"
        >
          {stepCopy.title}
        </h2>
      </header>

      <section
        aria-label={beginner ? t.inSimpleWords : t.howItWorks}
        className="flex flex-col gap-3"
      >
        <h3 className="text-caption font-medium text-graphite">
          {beginner ? t.inSimpleWords : t.howItWorks}
        </h3>
        <ExplanationBlocks blocks={explanation.body} />
      </section>

      <section
        aria-label={beginner ? t.likeInRealLife : t.example}
        className="flex flex-col gap-3 rounded-md border border-rule bg-hull-raised/60 p-4"
      >
        <h3 className="flex items-center gap-2 text-caption font-medium text-paper">
          {beginner ? (
            <Lightbulb aria-hidden="true" className="size-4 text-flow-warning" />
          ) : (
            <FlaskConical aria-hidden="true" className="size-4 text-flow-request" />
          )}
          {beginner ? t.likeInRealLife : t.example}
        </h3>
        <ExplanationBlocks blocks={explanation.example} />
      </section>

      <p className="flex gap-2.5 border-l-2 border-flow-selection/70 pl-3 text-caption text-paper/90">
        <Eye aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-flow-selection" />
        <span>
          <span className="font-medium text-paper">{t.watch}: </span>
          {stepCopy.watch}
        </span>
      </p>

      <div className="flex flex-col">
        {message && (
          <Disclosure
            title={inspectedMessage ? t.inspectedMessage : t.showMessage}
            regionLabel={inspectedMessage ? t.inspectedMessage : t.messageInFlight}
            // A packet clicked in the scene opens its message.
            open={messageOpen || Boolean(inspectedMessage)}
            onOpenChange={setMessageOpen}
          >
            <MessageFigure message={message} highlighted={Boolean(inspectedMessage)} />
          </Disclosure>
        )}
        {terms.length > 0 && (
          <Disclosure
            title={`${t.wordsToKnow} (${terms.length})`}
            regionLabel={t.wordsToKnow}
            open={termsOpen}
            onOpenChange={setTermsOpen}
          >
            <TermDefinitions terms={terms} />
          </Disclosure>
        )}
      </div>

      <StepParts copy={copy} strings={t} />

      {isFinalStep && <FinishSection copy={copy} strings={t} />}
      {scenario && index === count - 1 && (
        <ScenarioEndSection scenarioId={scenario.id} copy={copy} strings={t} />
      )}
    </article>
  );
}

/** Folded extra content: a button that shows or hides a labelled region. */
function Disclosure({
  title,
  regionLabel,
  open,
  onOpenChange,
  children,
}: {
  title: string;
  regionLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const regionId = useId();
  return (
    <section className="border-t border-rule py-1 last:border-b">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={regionId}
          onClick={() => onOpenChange(!open)}
          className="flex w-full items-center gap-2 rounded-sm py-2 text-left text-caption font-medium text-paper hover:text-paper/80"
        >
          <ChevronRight
            aria-hidden="true"
            className={cn("size-4 text-graphite transition-transform", open && "rotate-90")}
          />
          {title}
        </button>
      </h3>
      {open && (
        <div id={regionId} role="region" aria-label={regionLabel} className="pt-1 pb-3">
          {children}
        </div>
      )}
    </section>
  );
}

/** The step's parts as buttons: the visible way into each part's details. */
function StepParts({ copy, strings: t }: { copy: LocaleText; strings: StudioStrings }) {
  const learningModule = useStudioModule();
  const { step } = useCurrentStep();
  const select = useStudioSession((session) => session.select);
  const focusIntentRef = useFocusIntent();
  const parts = learningModule.layout.components.filter(
    (component) =>
      !component.decorative &&
      step.scene.focus.includes(component.id) &&
      copy.components[component.id],
  );
  if (parts.length === 0) return null;

  return (
    <section aria-label={t.partsInStep} className="flex flex-col gap-2">
      <h3 className="text-caption font-medium text-graphite">{t.partsInStep}</h3>
      <ul className="flex flex-wrap gap-1.5">
        {parts.map((part) => (
          <li key={part.id}>
            <button
              type="button"
              data-part-button={part.id}
              onClick={() => {
                focusIntentRef.current = { to: "part" };
                select(part.id);
              }}
              className="rounded-sm border border-rule-strong bg-hull-raised px-2.5 py-1 text-caption text-paper transition-colors hover:border-flow-selection/60 hover:text-flow-selection"
            >
              {part.label}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-label text-graphite">{t.partsHint}</p>
    </section>
  );
}

/** End of the main path: where the scenarios are, and marking the concept complete. */
function FinishSection({ copy, strings: t }: { copy: LocaleText; strings: StudioStrings }) {
  const learningModule = useStudioModule();
  const { concept } = useCurrentConcept();
  const switchTrack = useStudioSession((session) => session.switchTrack);
  const first = learningModule.scenarios[0];

  return (
    <section
      aria-labelledby="finish-heading"
      className="flex flex-col gap-3 rounded-md border border-rule-strong bg-hull-raised p-4"
    >
      <h3 id="finish-heading" className="text-caption font-medium text-paper">
        {t.finishTitle}
      </h3>
      <p className="text-caption text-paper/85">{t.finishText}</p>
      {first && (
        <button
          type="button"
          onClick={() => switchTrack(first.id)}
          className="self-start rounded-sm border border-rule-strong px-2.5 py-1.5 text-left text-caption font-medium text-paper hover:bg-hull-hover"
        >
          {t.tryScenario(copy.scenarios[first.id]?.title ?? first.id)}
        </button>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-rule pt-3">
        <p className="text-caption text-paper/85">{t.doneWithConcept}</p>
        <CompletionToggle conceptId={concept.id} />
      </div>
    </section>
  );
}

/** Last step of a scenario: the next scenario, or back to the step it branched from. */
function ScenarioEndSection({
  scenarioId,
  copy,
  strings: t,
}: {
  scenarioId: string;
  copy: LocaleText;
  strings: StudioStrings;
}) {
  const learningModule = useStudioModule();
  const switchTrack = useStudioSession((session) => session.switchTrack);
  const scenarios = learningModule.scenarios;
  const position = scenarios.findIndex((candidate) => candidate.id === scenarioId);
  const next = scenarios[position + 1];
  const branch = learningModule.steps.findIndex(
    (step) => step.id === scenarios[position]?.branchesFromStepId,
  );

  return (
    <section
      aria-labelledby="scenario-end-heading"
      className="flex flex-col gap-3 rounded-md border border-rule-strong bg-hull-raised p-4"
    >
      <h3 id="scenario-end-heading" className="text-caption font-medium text-paper">
        {t.scenarioEndTitle}
      </h3>
      <p className="text-caption text-paper/85">{t.scenarioEndText}</p>
      <div className="flex flex-wrap gap-2">
        {next && (
          <button
            type="button"
            onClick={() => switchTrack(next.id)}
            className="rounded-sm border border-rule-strong px-2.5 py-1.5 text-left text-caption font-medium text-paper hover:bg-hull-hover"
          >
            {t.nextScenario(copy.scenarios[next.id]?.title ?? next.id)}
          </button>
        )}
        <button
          type="button"
          onClick={() => switchTrack(MAIN_TRACK, Math.max(branch, 0))}
          className="rounded-sm border border-rule-strong px-2.5 py-1.5 text-left text-caption font-medium text-paper hover:bg-hull-hover"
        >
          {t.backToMainPath}
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------
// Part
// ---------------------------------------------------------------------------------------------

function PartView({
  part,
  doc,
  level,
  strings: t,
}: {
  part: SceneComponent;
  doc: ComponentDoc | undefined;
  level: ExplanationLevel;
  strings: StudioStrings;
}) {
  const select = useStudioSession((session) => session.select);
  const { index } = useCurrentStep();
  const focusIntentRef = useFocusIntent();

  return (
    <article className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => {
          focusIntentRef.current = { to: "step", partId: part.id };
          select(null);
        }}
        className="-ml-1 flex items-center gap-1.5 self-start rounded-sm px-1 py-0.5 text-caption text-graphite hover:text-paper"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t.backToStep(index + 1)}
      </button>

      <header>
        <h2
          data-view-heading
          tabIndex={-1}
          className="text-title font-semibold text-paper outline-none"
        >
          {doc?.name ?? part.label}
        </h2>
        <p className="text-caption text-graphite">{doc?.kind ?? part.role}</p>
        {doc && (
          <p className="mt-3 text-reading text-paper/90">
            {level === "beginner" ? doc.beginner.summary : doc.advanced.summary}
          </p>
        )}
      </header>

      {doc && level === "beginner" && (
        <>
          <section
            aria-label={t.likeInRealLife}
            className="flex flex-col gap-2 rounded-md border border-rule bg-hull-raised/60 p-4"
          >
            <h3 className="flex items-center gap-2 text-caption font-medium text-paper">
              <Lightbulb aria-hidden="true" className="size-4 text-flow-warning" />
              {t.likeInRealLife}
            </h3>
            <p className="text-reading text-paper/90">{doc.beginner.analogy}</p>
          </section>
          <Section title={t.whatItDoes}>
            <BulletList items={doc.beginner.jobs} />
          </Section>
          <Section title={t.talksTo}>
            <ChipList items={doc.talksTo} />
          </Section>
        </>
      )}

      {doc && level === "advanced" && (
        <>
          <Section title={t.howItWorks}>
            <p className="text-caption text-paper/90">{doc.advanced.howItWorks}</p>
          </Section>
          <Section title={t.responsibilities}>
            <BulletList items={doc.advanced.responsibilities} />
          </Section>
          <Section title={t.inputsOutputs}>
            <dl className="grid grid-cols-2 gap-4 text-caption">
              <div>
                <dt className="mb-1 text-graphite">{t.receives}</dt>
                {doc.advanced.inputs.map((item) => (
                  <dd key={item} className="text-paper/90">
                    {item}
                  </dd>
                ))}
              </div>
              <div>
                <dt className="mb-1 text-graphite">{t.sends}</dt>
                {doc.advanced.outputs.map((item) => (
                  <dd key={item} className="text-paper/90">
                    {item}
                  </dd>
                ))}
              </div>
            </dl>
          </Section>
          <Section title={t.talksTo}>
            <ChipList items={doc.talksTo} />
          </Section>
          <Section title={t.technologies}>
            <ChipList items={doc.advanced.technologies} />
          </Section>
          <Section title={t.examples}>
            <BulletList items={doc.advanced.examples} />
          </Section>
          <Section title={t.tradeOffs}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-1.5 text-caption text-flow-response">{t.advantages}</h4>
                <BulletList items={doc.advanced.advantages} />
              </div>
              <div>
                <h4 className="mb-1.5 text-caption text-flow-warning">{t.limitations}</h4>
                <BulletList items={doc.advanced.limitations} />
              </div>
            </div>
          </Section>
        </>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="border-t border-rule pt-4">
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
