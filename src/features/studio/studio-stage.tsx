"use client";

import dynamic from "next/dynamic";
import { lazy, Suspense, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { isWebGLAvailable } from "@/engine/scene/webgl";
import { useStrings } from "@/features/locale/use-strings";
import { useResolvedTheme } from "@/features/preferences/use-resolved-theme";
import { useCurrentStep, useStudioModule, useStudioSessionStore } from "./studio-session";

function SceneLoading() {
  const t = useStrings();
  return (
    <p
      role="status"
      className="absolute inset-0 grid place-items-center text-caption text-graphite"
    >
      {t.loadingScene}
    </p>
  );
}

// The 3D chunk (three.js, React Three Fiber, GSAP) loads only here, after the page is usable.
const StudioScene = dynamic(() => import("./studio-scene"), {
  ssr: false,
  loading: SceneLoading,
});

// The fallback drawing is only needed without WebGL, so it loads only then.
const IsometricDrawing = lazy(() =>
  import("@/engine/static/isometric-drawing").then((m) => ({ default: m.IsometricDrawing })),
);

const noSubscription = () => () => {};

/**
 * The scene area of the studio: the interactive 3D scene when WebGL works, otherwise a static
 * isometric drawing (and the same steps, explanations and controls).
 */
export function StudioStage() {
  const webgl = useSyncExternalStore(noSubscription, isWebGLAvailable, () => null);
  const [contextLost, setContextLost] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);

  if (webgl === null) return <SceneLoading />;
  if (!webgl || contextLost) return <StaticStage reason={contextLost ? "lost" : "unsupported"} />;
  return <StudioScene onContextLost={handleContextLost} />;
}

function StaticStage({ reason }: { reason: "unsupported" | "lost" }) {
  const store = useStudioSessionStore();
  const learningModule = useStudioModule();
  const { step } = useCurrentStep();
  const t = useStrings();
  const theme = useResolvedTheme();
  const parts = learningModule.layout.components
    .filter((component) => !component.decorative)
    .map((component) => component.label)
    .join(", ");

  // Without a timeline there is nothing to play: a step "plays" instantly to its end state.
  useEffect(() => {
    const finishPlayback = () => {
      const { playing, stepIndex, completeStep } = store.getState();
      if (playing) completeStep(stepIndex);
    };
    finishPlayback();
    return store.subscribe(finishPlayback);
  }, [store]);

  return (
    <>
      <div className="absolute inset-x-0 top-0 bottom-36 flex items-center justify-center p-8 @3xl:bottom-24">
        <Suspense fallback={null}>
          <IsometricDrawing
            layout={learningModule.layout}
            theme={theme}
            focus={step.scene.focus}
            label={t.staticDrawing(parts)}
            className="h-full max-h-136 w-full max-w-240"
          />
        </Suspense>
      </div>
      <p
        role="note"
        className="absolute top-3 left-1/2 z-20 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-sm border border-rule-strong bg-hull-raised/95 px-3 py-1.5 text-center text-caption text-graphite"
      >
        {reason === "lost" ? t.webglLost : t.noWebgl}
      </p>
    </>
  );
}
