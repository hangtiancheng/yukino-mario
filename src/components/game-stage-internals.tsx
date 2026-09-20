import { Suspense, lazy } from "react";
import type { ReactElement } from "react";

import type { GameSimulation } from "@/hooks";
import type { GameRendererKind, GameState } from "@/types";
import { DomGameRenderer } from "./renderers";

const LazyPixiGameRenderer = lazy(() =>
  import("./renderers/pixi-game-renderer").then((module) => ({
    default: module.PixiGameRenderer,
  })),
);

interface GameRendererProps {
  reducedMotion: boolean;
  rendererKind: GameRendererKind;
  simulation: GameSimulation;
  state: GameState;
}

export function GameRenderer({
  reducedMotion,
  rendererKind,
  simulation,
  state,
}: GameRendererProps): ReactElement {
  switch (rendererKind) {
    case "dom":
      return <DomGameRenderer reducedMotion={reducedMotion} state={state} />;
    case "pixi":
      return (
        <Suspense fallback={<RendererFallback />}>
          <LazyPixiGameRenderer
            reducedMotion={reducedMotion}
            simulation={simulation}
          />
        </Suspense>
      );
  }
}

export function RunningMessage({ message }: { message: string }): ReactElement {
  return (
    <p
      aria-live="polite"
      className="absolute top-6 left-6 rounded-full border-4 border-slate-950 bg-white/90 px-5 py-2 text-sm font-black tracking-[0.2em] text-slate-900 uppercase"
      role="status"
    >
      {message}
    </p>
  );
}

function RendererFallback(): ReactElement {
  return (
    <div className="absolute inset-0 grid place-items-center bg-slate-950 text-sm font-black tracking-[0.3em] text-violet-200 uppercase">
      Loading Pixi renderer
    </div>
  );
}
