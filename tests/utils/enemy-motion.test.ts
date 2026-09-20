import { describe, expect, it } from "vitest";

import type { FlyerEnemy, HopperEnemy, WalkerEnemy } from "@/types";
import { updateEnemies } from "@/utils/enemy-motion";

function makeWalker(overrides: Partial<WalkerEnemy> = {}): WalkerEnemy {
  return {
    direction: 1,
    height: 32,
    id: "w-1",
    originX: 0,
    patrolDistance: 200,
    speed: 100,
    type: "walker",
    width: 32,
    x: 0,
    y: 0,
    ...overrides,
  };
}

describe("updateEnemies walker", (): void => {
  it("moves a walker forward within patrol bounds", (): void => {
    const [enemy] = updateEnemies([makeWalker({ x: 50 })], 0.5);
    if (enemy === undefined || enemy.type !== "walker") {
      throw new Error("expected walker");
    }
    expect(enemy.x).toBeCloseTo(100, 5);
    expect(enemy.direction).toBe(1);
  });

  it("clamps walker at maximum patrol and reverses direction", (): void => {
    const [enemy] = updateEnemies([makeWalker({ direction: 1, x: 198 })], 0.5);
    if (enemy === undefined || enemy.type !== "walker") {
      throw new Error("expected walker");
    }
    expect(enemy.x).toBe(200);
    expect(enemy.direction).toBe(-1);
  });

  it("clamps walker at minimum patrol and reverses direction", (): void => {
    const [enemy] = updateEnemies([makeWalker({ direction: -1, x: 5 })], 0.5);
    if (enemy === undefined || enemy.type !== "walker") {
      throw new Error("expected walker");
    }
    expect(enemy.x).toBe(0);
    expect(enemy.direction).toBe(1);
  });

  it("scales walker speed with difficulty pressure", (): void => {
    const [enemy] = updateEnemies([makeWalker({ x: 50 })], 0.5, 1.5);
    if (enemy === undefined || enemy.type !== "walker") {
      throw new Error("expected walker");
    }
    expect(enemy.x).toBeCloseTo(125, 5);
  });
});

describe("updateEnemies hopper and flyer", (): void => {
  it("hopper updates hopPhaseMs and y stays around originY", (): void => {
    const hopper: HopperEnemy = {
      direction: 1,
      height: 32,
      hopHeight: 30,
      hopPhaseMs: 0,
      id: "h-1",
      originX: 0,
      originY: 100,
      patrolDistance: 200,
      speed: 80,
      type: "hopper",
      width: 32,
      x: 50,
      y: 100,
    };
    const [enemy] = updateEnemies([hopper], 0.1);
    if (enemy === undefined || enemy.type !== "hopper") {
      throw new Error("expected hopper");
    }
    expect(enemy.hopPhaseMs).toBeCloseTo(100, 5);
    expect(enemy.x).toBeCloseTo(58, 5);
    expect(enemy.y).toBeCloseTo(100 - Math.abs(Math.sin(100 / 260)) * 30, 5);
    expect(enemy.y).toBeLessThan(100);
  });

  it("flyer updates wavePhaseMs", (): void => {
    const flyer: FlyerEnemy = {
      direction: 1,
      height: 32,
      id: "f-1",
      originX: 0,
      originY: 100,
      patrolDistance: 200,
      speed: 80,
      type: "flyer",
      wavePhaseMs: 0,
      waveHeight: 30,
      width: 32,
      x: 50,
      y: 100,
    };
    const [enemy] = updateEnemies([flyer], 0.1);
    if (enemy === undefined || enemy.type !== "flyer") {
      throw new Error("expected flyer");
    }
    expect(enemy.wavePhaseMs).toBeCloseTo(100, 5);
    expect(enemy.x).toBeCloseTo(58, 5);
    expect(enemy.y).toBeCloseTo(100 + Math.sin(100 / 330) * 30, 5);
  });
});
