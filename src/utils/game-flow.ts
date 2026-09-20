import { MESSAGE_HOLD_MS, REVIVE_INVULNERABILITY_MS } from "@/constants";
import type { GameInput, GameState, Platform, Player } from "@/types";
import { getTargetCameraX } from "./camera";
import { clamp } from "./rect";

export function startGame(state: GameState): GameState {
  return {
    ...state,
    phase: "running",
    message: "Run as far as possible. Distance drives the leaderboard.",
    messageTimerMs: MESSAGE_HOLD_MS,
  };
}

export function hasMovementInput(input: GameInput): boolean {
  return input.left || input.right || input.jump;
}

export function loseLife(state: GameState, message: string): GameState {
  const lives = state.stats.lives - 1;
  if (lives <= 0) {
    return {
      ...state,
      phase: "lost",
      stats: { ...state.stats, lives: 0 },
      message: "Game over. Press R to restart.",
      messageTimerMs: 0,
    };
  }
  const player = createLocalRevivePlayer(state.player, state.platforms);
  return {
    ...state,
    player,
    cameraX: getTargetCameraX(player, state.worldWidth),
    stats: { ...state.stats, lives },
    message,
    messageTimerMs: MESSAGE_HOLD_MS,
  };
}

function createLocalRevivePlayer(
  player: Player,
  platforms: Platform[],
): Player {
  const platform = findRevivePlatform(player, platforms);
  if (platform === undefined) {
    return resetPlayerForRevive(player);
  }
  const x = clamp(
    player.x,
    platform.x,
    platform.x + platform.width - player.width,
  );
  return resetPlayerForRevive({ ...player, x, y: platform.y - player.height });
}

function findRevivePlatform(
  player: Player,
  platforms: Platform[],
): Platform | undefined {
  let bestPlatform: Platform | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const platform of platforms) {
    const distance = getPlatformDistance(player, platform);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPlatform = platform;
    }
  }
  return bestPlatform;
}

function getPlatformDistance(player: Player, platform: Platform): number {
  const platformCenterX = platform.x + platform.width / 2;
  const playerCenterX = player.x + player.width / 2;
  const horizontalDistance = Math.abs(platformCenterX - playerCenterX);
  const verticalDistance = Math.abs(platform.y - (player.y + player.height));
  return horizontalDistance + verticalDistance;
}

function resetPlayerForRevive(player: Player): Player {
  return {
    ...player,
    velocity: { x: 0, y: 0 },
    grounded: true,
    coyoteMs: 0,
    jumpBufferMs: 0,
    jumpHeld: false,
    invulnerableMs: REVIVE_INVULNERABILITY_MS,
  };
}

export function removeBumpedPlatform(
  platforms: Platform[],
  platformId: string | null,
): Platform[] {
  if (platformId === null) {
    return platforms;
  }
  const remainingPlatforms: Platform[] = [];
  for (const platform of platforms) {
    if (platform.id !== platformId) {
      remainingPlatforms.push(platform);
    }
  }
  return remainingPlatforms;
}

export function getProgressMessage(
  stompedCount: number,
  platformId: string | null,
): string {
  if (stompedCount > 0) {
    return "Clean stomp. Keep the momentum.";
  }
  if (platformId !== null) {
    return "Mario shattered. Bonus points awarded.";
  }
  return "Run farther to raise your distance-weighted score.";
}
