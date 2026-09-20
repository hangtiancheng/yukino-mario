import { firstLevel, getDifficultyOption } from "@/constants";
import type { Difficulty } from "@/schema";
import type { GameState, LevelData } from "@/types";
import { getTargetCameraX } from "./camera";
import { createCoins, createPlayer } from "./game-entities";

export function createInitialGameState(
  level: LevelData = firstLevel,
  difficulty: Difficulty = "medium",
): GameState {
  const player = createPlayer(level);
  const difficultyOption = getDifficultyOption(difficulty);
  return {
    difficulty,
    level,
    phase: "ready",
    player,
    platforms: level.platforms,
    coins: createCoins(level),
    enemies: level.enemies,
    particles: [],
    nextParticleId: 1,
    nextSegmentIndex: 1,
    worldWidth: level.width,
    prunedUntilX: 0,
    cameraX: getTargetCameraX(player, level.width),
    stats: {
      marioBroken: 0,
      coinsCollected: 0,
      distance: 0,
      elapsedMs: 0,
      lives: difficultyOption.lives,
      score: 0,
      stompedEnemies: 0,
    },
    message: "Press arrow keys or WASD to start.",
    messageTimerMs: 0,
  };
}
