import {
  MAX_FRAME_MS,
  MESSAGE_HOLD_MS,
  getDifficultyOption,
} from "@/constants";
import type { GameInput, GameState } from "@/types";
import { getTargetCameraX, smoothCameraX } from "./camera";
import { resolveEnemyContacts } from "./enemy-contact";
import { updateEnemies } from "./enemy-motion";
import { collectCoins } from "./game-entities";
import {
  getProgressMessage,
  hasMovementInput,
  loseLife,
  removeBumpedPlatform,
  startGame,
} from "./game-flow";
import { extendInfiniteWorld, pruneOldEntities } from "./infinite-map";
import { createInitialGameState } from "./initial-game-state";
import { updatePlayer } from "./player-motion";
import { carryPlayerByPlatforms, updatePlatforms } from "./platform-motion";
import { spawnParticles, updateParticles } from "./particles";
import { getParticleSpawns } from "./game-particle-spawns";
import { getRunDistance, getWeightedScore } from "./score";
import { buildPlatformIndex } from "./spatial-index";

const FALL_OUT_MARGIN_PX = 80;

export function updateGameState(
  previous: GameState,
  input: GameInput,
  deltaMs: number,
): GameState {
  if (input.restart) {
    return createInitialGameState(previous.level, previous.difficulty);
  }

  if (previous.phase === "lost") {
    return previous;
  }

  if (previous.phase === "ready" && !hasMovementInput(input)) {
    return previous;
  }

  const frameMs = Math.min(deltaMs, MAX_FRAME_MS);
  const runningState =
    previous.phase === "ready" ? startGame(previous) : previous;
  const difficultyOption = getDifficultyOption(runningState.difficulty);
  const frameSeconds = frameMs / 1_000;
  const world = extendInfiniteWorld(
    runningState.level,
    runningState.player.x,
    runningState.platforms,
    runningState.coins,
    runningState.enemies,
    runningState.worldWidth,
    runningState.nextSegmentIndex,
    difficultyOption,
  );
  const pruned = pruneOldEntities(
    world.platforms,
    world.coins,
    world.enemies,
    runningState.level.width,
    runningState.cameraX,
    runningState.prunedUntilX,
  );
  const platformMotion = updatePlatforms(
    pruned.platforms,
    frameSeconds,
    difficultyOption.platformSpeedScale,
  );
  const carriedPlayer = carryPlayerByPlatforms(
    runningState.player,
    world.platforms,
    platformMotion.deltas,
  );
  const platformIndex = buildPlatformIndex(platformMotion.platforms);
  const motion = updatePlayer(carriedPlayer, input, platformIndex, frameMs);
  const boundedPlayer =
    motion.player.x < pruned.prunedUntilX
      ? { ...motion.player, x: pruned.prunedUntilX }
      : motion.player;
  const enemies = updateEnemies(
    pruned.enemies,
    frameSeconds,
    difficultyOption.enemySpeedScale,
  );
  const contact = resolveEnemyContacts(carriedPlayer, boundedPlayer, enemies);
  const platforms = removeBumpedPlatform(
    platformMotion.platforms,
    motion.bumpedPlatformId,
  );
  const coinResult = collectCoins(pruned.coins, contact.player);
  const particleSpawns = getParticleSpawns(
    coinResult.collectedAt,
    contact.stompedAt,
    platformMotion.platforms,
    motion.bumpedPlatformId,
    contact.wasHit,
    contact.player,
  );
  const particleResult = spawnParticles(
    updateParticles(runningState.particles, frameMs),
    runningState.nextParticleId,
    particleSpawns,
  );
  const distance = Math.max(
    runningState.stats.distance,
    getRunDistance(contact.player.x, runningState.level.spawn.x),
  );
  const targetCameraX = getTargetCameraX(contact.player, world.worldWidth);
  const stats = {
    ...runningState.stats,
    marioBroken:
      runningState.stats.marioBroken +
      (motion.bumpedPlatformId === null ? 0 : 1),
    distance,
    coinsCollected: runningState.stats.coinsCollected + coinResult.gained,
    elapsedMs: runningState.stats.elapsedMs + frameMs,
    stompedEnemies: runningState.stats.stompedEnemies + contact.stompedCount,
  };
  const score = getWeightedScore({
    marioBroken: stats.marioBroken,
    coinsCollected: stats.coinsCollected,
    difficulty: runningState.difficulty,
    distance: stats.distance,
    stompedEnemies: stats.stompedEnemies,
  });
  const hasProgressEvent =
    contact.stompedCount > 0 || motion.bumpedPlatformId !== null;
  const heldTimerMs = Math.max(runningState.messageTimerMs - frameMs, 0);
  const nextState = {
    ...runningState,
    player: contact.player,
    platforms,
    enemies: contact.enemies,
    coins: coinResult.coins,
    particles: particleResult.particles,
    nextParticleId: particleResult.nextParticleId,
    nextSegmentIndex: world.nextSegmentIndex,
    stats: { ...stats, score },
    worldWidth: world.worldWidth,
    prunedUntilX: pruned.prunedUntilX,
    cameraX: smoothCameraX(
      runningState.cameraX,
      targetCameraX,
      frameSeconds,
      difficultyOption.cameraEase,
    ),
    message:
      hasProgressEvent || heldTimerMs <= 0
        ? getProgressMessage(contact.stompedCount, motion.bumpedPlatformId)
        : runningState.message,
    messageTimerMs: hasProgressEvent ? MESSAGE_HOLD_MS : heldTimerMs,
  };

  if (contact.player.y > runningState.level.height + FALL_OUT_MARGIN_PX) {
    return loseLife(nextState, "You missed the landing. Try again.");
  }

  if (contact.wasHit) {
    return loseLife(nextState, "A roaming shell caught you.");
  }

  return nextState;
}
