import {
  INVULNERABILITY_FLICKER_MS,
  RUN_ANIMATION_FRAME_MS,
} from "@/constants";
import type { GamePhase, Player, PlayerAnimation } from "@/types";

export function getPlayerAnimation(
  player: Player,
  elapsedMs: number,
  phase: GamePhase,
): PlayerAnimation {
  if (phase === "lost") {
    return "hurt";
  }
  if (!player.grounded) {
    return player.velocity.y < 0 ? "jump" : "fall";
  }
  if (Math.abs(player.velocity.x) < 1) {
    return "idle";
  }
  return Math.floor(elapsedMs / RUN_ANIMATION_FRAME_MS) % 2 === 0
    ? "run-one"
    : "run-two";
}

export function getInvulnerabilityOpacity(
  player: Player,
  elapsedMs: number,
): number {
  if (player.invulnerableMs <= 0) {
    return 1;
  }
  return Math.floor(elapsedMs / INVULNERABILITY_FLICKER_MS) % 2 === 0
    ? 0.35
    : 1;
}
