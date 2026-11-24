"use client";

/*
 * The interactive 3D scene of a learning module. Loaded lazily (next/dynamic) by
 * `StudioStage`: this file is the entry point of the 3D chunk (three.js, R3F, GSAP), which
 * never ships to pages without a module.
 */
import { useFrame, useThree } from "@react-three/fiber";
import { Scan } from "lucide-react";
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { IconButton } from "@/components/icon-button";
import type { LearningModule } from "@/content/modules";
import { type Bounds, componentsBounds, shapeBounds } from "@/engine/primitives";
import {
  CameraRig,
  type CameraRigHandle,
  createLabelElements,
  LabelLayer,
  type LabelElements,
  LabelProjector,
  type Padding,
  SceneCanvas,
  type SceneLabel,
  SceneView,
} from "@/engine/scene";
import { PerfOverlay } from "@/engine/scene/perf-overlay";
import { type CompiledTimeline, compileTimeline, TimelineController } from "@/engine/timeline";
import { usePreferencesStore } from "@/features/preferences/preferences-store";
import type { FlowKind, SceneComponent, Vec3 } from "@/lib/scene-spec";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { StudioSessionState } from "./session-store";
import {
  useStepProgress,
  useStudioModule,
  useStudioSession,
  useStudioSessionStore,
} from "./studio-session";
import { allSteps, globalStepIndex, locateStep, trackSteps } from "./tracks";

/** Space kept clear when framing: the header line at the top, the playback dock below. */
const FRAME_PADDING: Padding = { top: 72, right: 48, bottom: 150, left: 48 };

const noSubscription = () => () => {};
const readPerfFlag = () => new URLSearchParams(window.location.search).has("perf");

/**
 * Labels sit above a component's top back corner: in the isometric view that is its highest
 * point on screen, so the label never covers the component itself.
 */
function labelAnchor(component: SceneComponent): Vec3 {
  const bounds = shapeBounds(component.kind);
  return [
    component.position[0] + bounds.min[0],
    bounds.max[1],
    component.position[2] + bounds.min[2],
  ];
}

/** The step the scene shows for a session state (none in explore mode). */
function sceneStep(
  learningModule: LearningModule,
  state: Pick<StudioSessionState, "mode" | "trackId" | "stepIndex">,
) {
  if (state.mode !== "guided") return undefined;
  return trackSteps(learningModule, state.trackId)[state.stepIndex];
}

export default function StudioScene({ onContextLost }: { onContextLost: () => void }) {
  const learningModule = useStudioModule();
  const trackId = useStudioSession((session) => session.trackId);
  const stepIndex = useStudioSession((session) => session.stepIndex);
  const mode = useStudioSession((session) => session.mode);
  const selectedId = useStudioSession((session) => session.selectedId);
  const hoveredId = useStudioSession((session) => session.hoveredId);
  const select = useStudioSession((session) => session.select);
  const hover = useStudioSession((session) => session.hover);
  const reducedMotion = useReducedMotion();
  const showPerf = useSyncExternalStore(noSubscription, readPerfFlag, () => false);
  const store = useStudioSessionStore();

  const compiled = useMemo(
    () => compileTimeline(learningModule.layout, allSteps(learningModule), { reducedMotion }),
    [learningModule, reducedMotion],
  );

  const step = sceneStep(learningModule, { mode, trackId, stepIndex });
  const dimmed = useMemo(() => {
    if (!step) return new Set<string>();
    const focus = new Set(step.scene.focus);
    return new Set(
      learningModule.layout.components.filter((c) => !focus.has(c.id)).map((c) => c.id),
    );
  }, [learningModule, step]);
  const flows = useMemo(() => {
    const result = new Map<string, FlowKind>();
    for (const beat of step?.scene.beats ?? []) {
      if (beat.type === "packet" && !result.has(beat.connection)) {
        result.set(beat.connection, beat.flow);
      }
    }
    return result;
  }, [step]);

  const labels = useMemo<SceneLabel[]>(
    () =>
      learningModule.layout.components
        .filter((component) => !component.decorative)
        .map((component) => ({
          id: component.id,
          text: component.label,
          anchor: labelAnchor(component),
          channel: compiled.channels.components[component.id],
          tone:
            component.id === selectedId
              ? "selected"
              : dimmed.has(component.id)
                ? "dimmed"
                : "normal",
        })),
    [learningModule, compiled, selectedId, dimmed],
  );

  const sceneBounds = useMemo(
    () => componentsBounds(learningModule.layout.components)!,
    [learningModule],
  );
  /** What the camera should frame: the step's components in guided mode, everything otherwise. */
  const boundsFor = useCallback(
    (state: Pick<StudioSessionState, "mode" | "trackId" | "stepIndex">): Bounds => {
      const current = sceneStep(learningModule, state);
      if (!current) return sceneBounds;
      const ids = new Set(current.scene.frame ?? current.scene.focus);
      return (
        componentsBounds(learningModule.layout.components.filter((c) => ids.has(c.id))) ??
        sceneBounds
      );
    },
    [learningModule, sceneBounds],
  );

  const rig = useRef<CameraRigHandle>(null);
  const stage = useRef<HTMLDivElement>(null);
  const labelElements = useRef<LabelElements>(createLabelElements());
  const description = `Isometric 3D diagram of ${learningModule.layout.components
    .filter((c) => !c.decorative)
    .map((c) => c.label)
    .join(", ")}.`;

  return (
    <div ref={stage} className="absolute inset-0 bg-ink" data-scene-stage="">
      <div role="img" aria-label={description} className="absolute inset-0">
        <SceneCanvas
          onPointerMissed={() => select(null)}
          onContextLost={onContextLost}
          statsRef={stage}
        >
          <SceneView
            layout={learningModule.layout}
            channels={compiled.channels}
            dimmed={dimmed}
            flows={flows}
            selectedId={selectedId}
            hoveredId={hoveredId}
            smooth={!reducedMotion}
            onSelect={(id) => select(id === selectedId ? null : id)}
            onHover={hover}
            onInspectMessage={(messageId) => {
              store.getState().pause();
              store.getState().inspectMessage(messageId);
            }}
          />
          <CameraRig ref={rig} sceneBounds={sceneBounds} padding={FRAME_PADDING} />
          <CameraDirector rig={rig} boundsFor={boundsFor} animate={!reducedMotion} />
          <TimelineDriver compiled={compiled} learningModule={learningModule} />
          <LabelProjector labels={labels} elementsRef={labelElements} />
        </SceneCanvas>
      </div>
      <LabelLayer labels={labels} elementsRef={labelElements} />

      <div className="absolute top-5 right-5 z-20">
        <IconButton
          label="Reset view"
          icon={<Scan />}
          tooltipSide="left"
          className="bg-hull-raised/80 text-graphite hover:text-paper"
          onClick={() => rig.current?.frame(boundsFor(store.getState()), !reducedMotion)}
        />
      </div>
      {showPerf && <PerfOverlay statsRef={stage} />}
    </div>
  );
}

/**
 * Keeps the GSAP timeline in step with the session store: seeks on navigation (or to a clean
 * scene in explore mode), plays and pauses with the session, follows the playback speed
 * preference, and reports the end of a step back to the store.
 *
 * Rendering: a seek requests one frame. While a step plays, the render loop keeps itself
 * running by invalidating from inside `useFrame`. Invalidating only from GSAP's own ticker
 * would restart R3F's on-demand loop a frame late each time and render every other frame
 * (30 fps instead of 60, measured in Phase 4).
 */
function TimelineDriver({
  compiled,
  learningModule,
}: {
  compiled: CompiledTimeline;
  learningModule: LearningModule;
}) {
  const store = useStudioSessionStore();
  const progress = useStepProgress();
  const invalidate = useThree((state) => state.invalidate);
  const controllerRef = useRef<TimelineController | null>(null);

  useFrame(() => {
    if (controllerRef.current?.isPlaying) invalidate();
  });

  useEffect(() => {
    const controller = new TimelineController(compiled, {
      onUpdate: (_, stepProgress) => {
        progress.set(stepProgress);
        invalidate();
      },
      onStepEnd: (globalIndex) => {
        const { trackId, index } = locateStep(learningModule, globalIndex);
        const state = store.getState();
        if (state.trackId === trackId) state.completeStep(index);
      },
    });
    controller.setSpeed(usePreferencesStore.getState().playbackSpeed);
    controllerRef.current = controller;

    const sync = (state: StudioSessionState, previous?: StudioSessionState) => {
      const moved =
        !previous ||
        state.seekCount !== previous.seekCount ||
        state.trackId !== previous.trackId ||
        state.mode !== previous.mode;
      if (moved) {
        // Explore shows the clean scene: the start of the timeline, before any beat.
        controller.seek(
          state.mode === "guided"
            ? globalStepIndex(learningModule, state.trackId, state.stepIndex)
            : 0,
        );
      }
      const shouldPlay = state.playing && state.mode === "guided";
      if (shouldPlay && !controller.isPlaying) {
        // A finished step cannot play further: tell the store, which stops playback.
        if (!controller.play()) store.getState().completeStep(state.stepIndex);
      } else if (!shouldPlay && controller.isPlaying) {
        controller.pause();
      }
    };
    sync(store.getState());
    const unsubscribeSession = store.subscribe(sync);
    const unsubscribeSpeed = usePreferencesStore.subscribe((state) =>
      controller.setSpeed(state.playbackSpeed),
    );
    return () => {
      unsubscribeSession();
      unsubscribeSpeed();
      controller.dispose();
      controllerRef.current = null;
    };
  }, [compiled, learningModule, store, progress, invalidate]);

  return null;
}

/** Frames the current step (or the whole scene) on load, on navigation and on resize. */
function CameraDirector({
  rig,
  boundsFor,
  animate,
}: {
  rig: RefObject<CameraRigHandle | null>;
  boundsFor: (state: StudioSessionState) => Bounds;
  animate: boolean;
}) {
  const store = useStudioSessionStore();
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);

  useEffect(
    () =>
      store.subscribe((state, previous) => {
        if (
          state.seekCount !== previous.seekCount ||
          state.stepIndex !== previous.stepIndex ||
          state.trackId !== previous.trackId ||
          state.mode !== previous.mode
        ) {
          rig.current?.frame(boundsFor(state), animate);
        }
      }),
    [store, rig, boundsFor, animate],
  );

  // First frame, and whenever the plate is resized (panels, window): fit without animating.
  useEffect(() => {
    if (width > 0 && height > 0) rig.current?.frame(boundsFor(store.getState()), false);
  }, [width, height, store, rig, boundsFor]);

  return null;
}
