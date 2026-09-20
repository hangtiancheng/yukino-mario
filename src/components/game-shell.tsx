import { useAtom, useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import type { ReactElement } from "react";

import { useGameSession } from "@/hooks";
import type { Difficulty } from "@/schema";
import { difficultyAtom, leaderboardAtom, rendererKindAtom } from "@/stores";
import { DifficultySelector } from "./difficulty-selector";
import { FullscreenControls } from "./fullscreen-controls";
import { GameHeader } from "./game-header";
import { GameStage } from "./game-stage";
import { GameStatsHud } from "./game-stats-hud";
import { LeaderboardPanel } from "./leaderboard-panel";
import { PlayerNameField } from "./player-name-field";
import { RendererSelector } from "./renderer-selector";
import { TouchControls } from "./touch-controls";

export function GameShell(): ReactElement {
  const [difficulty, setDifficulty] = useAtom(difficultyAtom);
  const [rendererKind, setRendererKind] = useAtom(rendererKindAtom);
  const leaderboard = useAtomValue(leaderboardAtom);
  const { audio, gameState, keyboard, restartGame, simulation } =
    useGameSession(difficulty);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const selectDifficulty = useCallback(
    (nextDifficulty: Difficulty): void => {
      setDifficulty(nextDifficulty);
      simulation.reset(simulation.stateRef.current.level, nextDifficulty);
    },
    [setDifficulty, simulation],
  );

  return (
    <>
      <GameHeader audio={audio} />
      <GameStatsHud simulation={simulation} />
      <GameStage
        input={keyboard}
        onRestart={restartGame}
        rendererKind={rendererKind}
        simulation={simulation}
      />
      <div className="flex flex-wrap items-center gap-3">
        <FullscreenControls />
        <button
          className="rounded-full border-4 border-slate-950 bg-amber-300 px-5 py-2 text-xs font-black tracking-[0.2em] text-slate-950 uppercase shadow-[5px_5px_0_rgb(15_23_42)]"
          onClick={(): void => setSettingsOpen((o) => !o)}
          type="button"
        >
          {settingsOpen ? "Hide settings" : "Settings"}
        </button>
      </div>
      {settingsOpen && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DifficultySelector
            difficulty={difficulty}
            onChange={selectDifficulty}
          />
          <RendererSelector
            onChange={setRendererKind}
            selectedRenderer={rendererKind}
          />
          <PlayerNameField />
        </div>
      )}
      <LeaderboardPanel entries={leaderboard} />
      <TouchControls
        inputRef={keyboard.inputRef}
        onRestart={restartGame}
        visible={gameState.phase === "running"}
      />
    </>
  );
}
