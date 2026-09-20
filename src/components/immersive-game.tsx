import { useAtomValue } from "jotai";
import { Link } from "react-router";
import type { CSSProperties, ReactElement } from "react";

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/constants";
import { useFullscreen, useGameSession, useViewportScale } from "@/hooks";
import { difficultyAtom, rendererKindAtom } from "@/stores";
import { GameStage } from "./game-stage";
import { TouchControls } from "./touch-controls";

export function ImmersiveGame(): ReactElement {
  const difficulty = useAtomValue(difficultyAtom);
  const rendererKind = useAtomValue(rendererKindAtom);
  const { gameState, keyboard, restartGame, simulation } =
    useGameSession(difficulty);
  const fullscreen = useFullscreen();

  const scale = useViewportScale();
  const stageWrapperStyle: CSSProperties = {
    height: `${VIEWPORT_HEIGHT}px`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    width: `${VIEWPORT_WIDTH}px`,
  };

  function handleExit(): void {
    if (fullscreen.active) {
      fullscreen.toggleFullscreen();
    }
  }

  return (
    <div className="fixed inset-0 z-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950">
      <div
        className="absolute top-1/2 left-1/2 origin-center"
        style={stageWrapperStyle}
      >
        <GameStage
          input={keyboard}
          onRestart={restartGame}
          rendererKind={rendererKind}
          simulation={simulation}
        />
      </div>
      <TouchControls
        inputRef={keyboard.inputRef}
        onRestart={restartGame}
        visible={gameState.phase === "running"}
      />
      <div className="fixed top-4 right-4 z-30 flex flex-wrap gap-3">
        <button
          className="rounded-full border-4 border-slate-950 bg-cyan-300 px-4 py-2 text-xs font-black tracking-[0.2em] text-slate-950 uppercase shadow-[5px_5px_0_rgb(15_23_42)] hover:bg-cyan-200 focus-visible:ring-4 focus-visible:ring-amber-200 focus-visible:outline-none disabled:opacity-50"
          disabled={!fullscreen.supported}
          onClick={fullscreen.toggleFullscreen}
          type="button"
        >
          {fullscreen.active ? "Exit browser fullscreen" : "Browser fullscreen"}
        </button>
        <Link
          aria-label="Exit fullscreen game and return home"
          className="rounded-full border-4 border-slate-950 bg-rose-300 px-4 py-2 text-xs font-black tracking-[0.2em] text-slate-950 uppercase shadow-[5px_5px_0_rgb(15_23_42)] hover:bg-rose-200 focus-visible:ring-4 focus-visible:ring-amber-200 focus-visible:outline-none"
          onClick={handleExit}
          to="/"
        >
          Exit fullscreen
        </Link>
      </div>
    </div>
  );
}
