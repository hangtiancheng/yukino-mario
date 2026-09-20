import { INFINITE_SEGMENT_TRIGGER_DISTANCE } from "@/constants";
import type { DifficultyOption } from "@/constants";
import type { Coin, Enemy, LevelData, LevelCoin, Platform } from "@/types";
import { createSegmentEnemy } from "./enemy-variation";

export interface InfiniteWorldResult {
  coins: Coin[];
  enemies: Enemy[];
  nextSegmentIndex: number;
  platforms: Platform[];
  worldWidth: number;
}

export function extendInfiniteWorld(
  level: LevelData,
  playerX: number,
  platforms: Platform[],
  coins: Coin[],
  enemies: Enemy[],
  worldWidth: number,
  nextSegmentIndex: number,
  difficultyOption?: DifficultyOption,
): InfiniteWorldResult {
  if (playerX < worldWidth - INFINITE_SEGMENT_TRIGGER_DISTANCE) {
    return { coins, enemies, nextSegmentIndex, platforms, worldWidth };
  }

  const offsetX = level.width * nextSegmentIndex;
  const enemyCountScale = difficultyOption?.enemyCountScale ?? 1;
  const enemyJitterScale = difficultyOption?.enemyJitterScale ?? 1;
  return {
    coins: [...coins, ...cloneCoins(level.coins, nextSegmentIndex, offsetX)],
    enemies: [
      ...enemies,
      ...cloneEnemies(
        level.enemies,
        nextSegmentIndex,
        offsetX,
        enemyCountScale,
        enemyJitterScale,
      ),
    ],
    nextSegmentIndex: nextSegmentIndex + 1,
    platforms: [
      ...platforms,
      ...clonePlatforms(level.platforms, nextSegmentIndex, offsetX),
    ],
    worldWidth: worldWidth + level.width,
  };
}

const PRUNE_SEGMENTS_BEHIND = 2;

export interface PruneResult {
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
  prunedUntilX: number;
}

export function pruneOldEntities(
  platforms: Platform[],
  coins: Coin[],
  enemies: Enemy[],
  levelWidth: number,
  cameraX: number,
  prunedUntilX: number,
): PruneResult {
  const pruneX = Math.max(
    cameraX - levelWidth * PRUNE_SEGMENTS_BEHIND,
    prunedUntilX,
  );
  if (pruneX <= 0) {
    return { platforms, coins, enemies, prunedUntilX };
  }
  return {
    platforms: platforms.filter((p) => p.x + p.width > pruneX),
    coins: coins.filter((c) => c.x + c.width > pruneX),
    enemies: enemies.filter((e) => e.x + e.width + e.patrolDistance > pruneX),
    prunedUntilX: pruneX,
  };
}

function clonePlatforms(
  platforms: Platform[],
  segmentIndex: number,
  offsetX: number,
): Platform[] {
  const clonedPlatforms: Platform[] = [];
  for (const platform of platforms) {
    const clonedPlatform = {
      ...platform,
      id: `segment-${segmentIndex}-${platform.id}`,
      x: platform.x + offsetX,
    };
    if (platform.motion === undefined) {
      clonedPlatforms.push(clonedPlatform);
    } else {
      const origin =
        platform.motion.axis === "x"
          ? platform.motion.origin + offsetX
          : platform.motion.origin;
      clonedPlatforms.push({
        ...clonedPlatform,
        motion: { ...platform.motion, origin },
      });
    }
  }
  return clonedPlatforms;
}

function cloneCoins(
  coins: LevelCoin[],
  segmentIndex: number,
  offsetX: number,
): Coin[] {
  const clonedCoins: Coin[] = [];
  for (const coin of coins) {
    clonedCoins.push({
      ...coin,
      collected: false,
      id: `segment-${segmentIndex}-${coin.id}`,
      x: coin.x + offsetX,
    });
  }
  return clonedCoins;
}

function cloneEnemies(
  enemies: Enemy[],
  segmentIndex: number,
  offsetX: number,
  countScale: number,
  jitterScale: number,
): Enemy[] {
  const clonedEnemies: Enemy[] = [];
  if (enemies.length === 0) {
    return clonedEnemies;
  }
  const targetCount = Math.max(0, Math.round(enemies.length * countScale));
  for (let i = 0; i < targetCount; i += 1) {
    const template = enemies[i % enemies.length];
    if (template === undefined) {
      continue;
    }
    const cloneSegmentIndex =
      i < enemies.length ? segmentIndex : segmentIndex * 1000 + i;
    clonedEnemies.push(
      createSegmentEnemy(template, cloneSegmentIndex, offsetX, jitterScale),
    );
  }
  return clonedEnemies;
}
