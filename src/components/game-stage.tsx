import { useEffect, useId, useRef } from "react";
import type { CSSProperties, ReactElement } from "react";

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/constants";
import { useGameSimulationState, useReducedMotion } from "@/hooks";
import type { GameSimulation, KeyboardInputControls } from "@/hooks";
import type { GameRendererKind } from "@/types";
import { GameRenderer, RunningMessage } from "./game-stage-internals";
import { TransitionOverlay } from "./transition-overlay";

interface GameStageProps {
  input: KeyboardInputControls;
  onRestart: () => void;
  rendererKind?: GameRendererKind;
  simulation: GameSimulation;
}

export function GameStage({
  input,
  onRestart,
  rendererKind = "dom",
  simulation,
}: GameStageProps): ReactElement {
  const descriptionId = useId();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const state = useGameSimulationState(simulation);
  const reducedMotion = useReducedMotion();
  const stageStyle: CSSProperties = {
    height: `${VIEWPORT_HEIGHT}px`,
    width: `${VIEWPORT_WIDTH}px`,
  };

  useEffect((): void => {
    stageRef.current?.focus({ preventScroll: true });
  }, []);

  function handlePointerDown(): void {
    stageRef.current?.focus({ preventScroll: true });
  }

  return (
    <div
      aria-describedby={descriptionId}
      aria-label="Yukino Mario game stage"
      className="relative max-w-full overflow-hidden rounded-4xl border-8 border-slate-950 bg-linear-to-b from-sky-400 via-cyan-200 to-amber-100 shadow-[14px_14px_0_rgb(15_23_42)] focus-visible:ring-8 focus-visible:ring-amber-200 focus-visible:outline-none"
      onBlur={input.onBlur}
      onKeyDown={input.onKeyDown}
      onKeyUp={input.onKeyUp}
      onPointerDown={handlePointerDown}
      ref={stageRef}
      role="application"
      style={stageStyle}
      tabIndex={0}
    >
      <p className="sr-only" id={descriptionId}>
        Use arrow keys or A and D to move, Space or W to jump, and R to restart.
      </p>
      <GameRenderer
        reducedMotion={reducedMotion}
        rendererKind={rendererKind}
        simulation={simulation}
        state={state}
      />
      {state.phase === "running" ? (
        <RunningMessage message={state.message} />
      ) : (
        <TransitionOverlay
          message={state.message}
          onRestart={onRestart}
          phase={state.phase}
        />
      )}
    </div>
  );
}
