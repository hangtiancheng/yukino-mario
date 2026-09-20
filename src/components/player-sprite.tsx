import clsx from "clsx";
import type { CSSProperties, ReactElement } from "react";

import type { GamePhase, Player, PlayerAnimation, Rect } from "@/types";
import { getInvulnerabilityOpacity, getPlayerAnimation } from "@/utils";

interface PlayerSpriteProps {
  player: Player;
  elapsedMs: number;
  phase: GamePhase;
}

export function PlayerSprite({
  player,
  elapsedMs,
  phase,
}: PlayerSpriteProps): ReactElement {
  const animation = getPlayerAnimation(player, elapsedMs, phase);

  return (
    <div
      className="absolute origin-center transition-transform duration-75"
      style={getPlayerStyle(player, elapsedMs)}
    >
      <div
        className={clsx(
          "h-full w-full rounded-lg border-4 border-slate-950 bg-red-500 shadow-[4px_4px_0_rgb(15_23_42)] transition-transform",
          getBodyClass(animation),
        )}
      >
        <div className="mx-auto mt-1 h-3 w-6 rounded-t-full bg-rose-800" />
        <div className="mx-auto mt-1 h-3 w-5 rounded-full bg-amber-100" />
        <div className="mx-auto mt-1 h-3 w-8 rounded-sm bg-blue-700" />
      </div>
    </div>
  );
}

function getPlayerStyle(player: Player, elapsedMs: number): CSSProperties {
  return {
    ...getRectStyle(player),
    opacity: getInvulnerabilityOpacity(player, elapsedMs),
    transform: player.facing === -1 ? "scaleX(-1)" : "scaleX(1)",
  };
}

function getRectStyle(rect: Rect): CSSProperties {
  return {
    height: `${rect.height}px`,
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
  };
}

function getBodyClass(animation: PlayerAnimation): string {
  switch (animation) {
    case "hurt":
      return "rotate-12 bg-slate-500";
    case "jump":
      return "-translate-y-1";
    case "fall":
      return "translate-y-1";
    case "run-one":
      return "-rotate-3";
    case "run-two":
      return "rotate-3";
    case "idle":
      return "translate-y-0";
  }
}
