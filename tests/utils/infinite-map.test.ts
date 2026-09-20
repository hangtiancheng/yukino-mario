import { describe, expect, it } from "vitest";

import {
  INFINITE_SEGMENT_TRIGGER_DISTANCE,
  getDifficultyOption,
} from "@/constants";
import type { Coin, Enemy, LevelData, Platform } from "@/types";
import { extendInfiniteWorld, pruneOldEntities } from "@/utils/infinite-map";

const walkerTemplate: Enemy = {
  direction: 1,
  height: 32,
  id: "w1",
  originX: 200,
  patrolDistance: 100,
  speed: 80,
  type: "walker",
  width: 32,
  x: 200,
  y: 400,
};

const baseLevel: LevelData = {
  coins: [{ id: "c1", height: 22, width: 22, x: 100, y: 200 }],
  enemies: [walkerTemplate],
  height: 540,
  id: "demo",
  name: "Demo",
  platforms: [
    {
      height: 32,
      id: "p1",
      tone: "ground",
      width: 1_000,
      x: 0,
      y: 500,
    },
  ],
  spawn: { x: 50, y: 100 },
  summary: "demo",
  width: 1_000,
};

const platforms: Platform[] = [...baseLevel.platforms];
const coins: Coin[] = baseLevel.coins.map((coin): Coin => ({
  ...coin,
  collected: false,
}));
const enemies: Enemy[] = [...baseLevel.enemies];

describe("extendInfiniteWorld", (): void => {
  it("returns the existing world when player is far from edge", (): void => {
    const result = extendInfiniteWorld(
      baseLevel,
      0,
      platforms,
      coins,
      enemies,
      baseLevel.width,
      1,
    );
    expect(result.platforms).toHaveLength(1);
    expect(result.coins).toHaveLength(1);
    expect(result.enemies).toHaveLength(1);
    expect(result.worldWidth).toBe(baseLevel.width);
    expect(result.nextSegmentIndex).toBe(1);
  });

  it("appends a new segment when player approaches the edge", (): void => {
    const triggerX = baseLevel.width - INFINITE_SEGMENT_TRIGGER_DISTANCE + 1;
    const result = extendInfiniteWorld(
      baseLevel,
      triggerX,
      platforms,
      coins,
      enemies,
      baseLevel.width,
      1,
    );
    expect(result.platforms).toHaveLength(2);
    expect(result.coins).toHaveLength(2);
    expect(result.enemies).toHaveLength(2);
    expect(result.worldWidth).toBe(baseLevel.width * 2);
    expect(result.nextSegmentIndex).toBe(2);
    expect(result.platforms[1]?.id).toBe("segment-1-p1");
    expect(result.platforms[1]?.x).toBe(baseLevel.width);
  });

  it("varies cloned enemies deterministically by segment", (): void => {
    const triggerX = baseLevel.width - INFINITE_SEGMENT_TRIGGER_DISTANCE + 1;
    const first = extendInfiniteWorld(
      baseLevel,
      triggerX,
      platforms,
      coins,
      enemies,
      baseLevel.width,
      1,
    );
    const second = extendInfiniteWorld(
      baseLevel,
      triggerX,
      platforms,
      coins,
      enemies,
      baseLevel.width,
      1,
    );
    const clonedEnemy = first.enemies[1];
    expect(second.enemies[1]).toEqual(clonedEnemy);
    expect(clonedEnemy).not.toMatchObject({
      direction: walkerTemplate.direction,
      speed: walkerTemplate.speed,
      x: walkerTemplate.x + baseLevel.width,
    });
  });

  it("clones fewer enemies when the count scale is below one", (): void => {
    const secondEnemy: Enemy = {
      ...walkerTemplate,
      id: "w2",
      originX: 500,
      x: 500,
    };
    const level: LevelData = {
      ...baseLevel,
      enemies: [walkerTemplate, secondEnemy],
    };
    const triggerX = level.width - INFINITE_SEGMENT_TRIGGER_DISTANCE + 1;
    const result = extendInfiniteWorld(
      level,
      triggerX,
      platforms,
      coins,
      level.enemies,
      level.width,
      1,
      { ...getDifficultyOption("low"), enemyCountScale: 0.5 },
    );
    expect(result.enemies).toHaveLength(level.enemies.length + 1);
    expect(result.enemies[2]).toMatchObject({
      id: "segment-1-w1",
      originX: walkerTemplate.originX + level.width,
    });
  });

  it("clones extra enemies when the count scale is above one", (): void => {
    const triggerX = baseLevel.width - INFINITE_SEGMENT_TRIGGER_DISTANCE + 1;
    const result = extendInfiniteWorld(
      baseLevel,
      triggerX,
      platforms,
      coins,
      enemies,
      baseLevel.width,
      1,
      { ...getDifficultyOption("high"), enemyCountScale: 2 },
    );
    expect(result.enemies).toHaveLength(enemies.length + 2);
    expect(result.enemies[1]?.id).toBe("segment-1-w1");
    expect(result.enemies[2]?.id).toBe("segment-1001-w1");
    for (const enemy of result.enemies.slice(1)) {
      expect(enemy.originX).toBe(walkerTemplate.originX + baseLevel.width);
      expect(enemy.x).toBeGreaterThanOrEqual(enemy.originX);
      expect(enemy.x).toBeLessThanOrEqual(enemy.originX + enemy.patrolDistance);
    }
  });
});

describe("pruneOldEntities", (): void => {
  it("prunes ground platforms once they fall behind the prune line", (): void => {
    const farCameraX = baseLevel.width * 4;
    const result = pruneOldEntities(
      platforms,
      coins,
      enemies,
      baseLevel.width,
      farCameraX,
      0,
    );
    expect(result.platforms).toHaveLength(0);
    expect(result.coins).toHaveLength(0);
    expect(result.enemies).toHaveLength(0);
    expect(result.prunedUntilX).toBe(farCameraX - baseLevel.width * 2);
  });

  it("keeps entities ahead of the prune line", (): void => {
    const result = pruneOldEntities(
      platforms,
      coins,
      enemies,
      baseLevel.width,
      baseLevel.width,
      0,
    );
    expect(result.platforms).toHaveLength(1);
    expect(result.coins).toHaveLength(1);
    expect(result.enemies).toHaveLength(1);
  });

  it("never moves the prune line backwards", (): void => {
    const result = pruneOldEntities(
      platforms,
      coins,
      enemies,
      baseLevel.width,
      0,
      1_500,
    );
    expect(result.prunedUntilX).toBe(1_500);
    expect(result.platforms).toHaveLength(0);
  });
});
