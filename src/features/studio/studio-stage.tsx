"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { isWebGLAvailable } from "@/engine/scene/webgl";
import { StaticScene } from "./static-scene";
import { useStudioSessionStore } from "./studio-session";

function SceneLoading() {
  return (
    <p
      role="status"
      className="absolute inset-0 grid place-items-center text-caption text-graphite"
    >
      Loading the 3D scene…
    </p>
  );
}

// The 3D chunk (three.js, React Three Fiber, GSAP) loads only here, after the page is usable.
const StudioScene = dynamic(() => import("./studio-scene"), {
  ssr: false,
  loading: SceneLoading,
});

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
      <StaticScene />
      <p
        role="note"
        className="absolute top-3 left-1/2 z-20 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-sm border border-rule-strong bg-hull-raised/95 px-3 py-1.5 text-center text-caption text-graphite"
      >
        {reason === "lost"
          ? "The 3D view stopped responding, so this is a static drawing. Reload the page to try again."
          : "This browser can’t show the 3D view, so this is a static drawing. Steps and explanations still work."}
      </p>
    </>
  );
}
