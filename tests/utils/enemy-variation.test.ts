import { describe, expect, it } from "vitest";

import type { HopperEnemy, WalkerEnemy } from "@/types";
import { createSegmentEnemy } from "@/utils";

const walker: WalkerEnemy = {
  direction: 1,
  height: 32,
  id: "walker",
  originX: 200,
  patrolDistance: 120,
  speed: 80,
  type: "walker",
  width: 34,
  x: 220,
  y: 468,
};

const hopper: HopperEnemy = {
  direction: -1,
  height: 32,
  hopHeight: 34,
  hopPhaseMs: 0,
  id: "hopper",
  originX: 300,
  originY: 468,
  patrolDistance: 160,
  speed: 90,
  type: "hopper",
  width: 34,
  x: 320,
  y: 468,
};

describe("createSegmentEnemy", (): void => {
  it("returns deterministic output for the same seed inputs", (): void => {
    const first = createSegmentEnemy(walker, 2, 2_000);
    const second = createSegmentEnemy(walker, 2, 2_000);
    expect(second).toEqual(first);
  });

  it("keeps stable generated ids while varying clone behavior", (): void => {
    const enemy = createSegmentEnemy(walker, 2, 2_000);
    expect(enemy.id).toBe("segment-2-walker");
    expect(enemy).not.toMatchObject({
      direction: walker.direction,
      speed: walker.speed,
      x: walker.x + 2_000,
    });
  });

  it("keeps walker x inside patrol bounds and speed inside safe bounds", (): void => {
    const enemy = createSegmentEnemy(walker, 3, 3_000);
    expect(enemy.x).toBeGreaterThanOrEqual(enemy.originX);
    expect(enemy.x).toBeLessThanOrEqual(enemy.originX + enemy.patrolDistance);
    expect(enemy.speed).toBeGreaterThanOrEqual(walker.speed * 0.88);
    expect(enemy.speed).toBeLessThanOrEqual(walker.speed * 1.18);
    expect([-1, 1]).toContain(enemy.direction);
  });

  it("varies hopper phase without changing its vertical origin", (): void => {
    const enemy = createSegmentEnemy(hopper, 4, 4_000);
    if (enemy.type !== "hopper") {
      throw new Error("expected hopper");
    }
    expect(enemy.originY).toBe(hopper.originY);
    expect(enemy.hopPhaseMs).toBeGreaterThan(0);
    expect(enemy.hopPhaseMs).toBeLessThanOrEqual(900);
  });
});
