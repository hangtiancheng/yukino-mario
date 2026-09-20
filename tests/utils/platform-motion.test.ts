import { describe, expect, it } from "vitest";

import type { Platform, Player } from "@/types";
import {
  carryPlayerByPlatforms,
  updatePlatforms,
} from "@/utils/platform-motion";

const movingPlatform: Platform = {
  height: 16,
  id: "lift",
  motion: {
    axis: "x",
    direction: 1,
    distance: 200,
    origin: 100,
    speed: 100,
  },
  tone: "mario",
  width: 80,
  x: 100,
  y: 300,
};

describe("updatePlatforms", (): void => {
  it("emits no deltas for static platforms", (): void => {
    const staticPlatform: Platform = {
      height: 16,
      id: "static",
      tone: "mario",
      width: 80,
      x: 0,
      y: 0,
    };
    const result = updatePlatforms([staticPlatform], 0.5);
    expect(result.deltas.size).toBe(0);
    expect(result.deltas.get("static")).toBeUndefined();
  });

  it("moves a platform along its motion axis", (): void => {
    const result = updatePlatforms([movingPlatform], 0.5);
    expect(result.platforms[0]?.x).toBeCloseTo(150, 5);
    const delta = result.deltas.get("lift");
    expect(delta?.dx).toBeCloseTo(50, 5);
    expect(delta?.dy).toBe(0);
  });

  it("clamps platform at maximum and reverses direction", (): void => {
    const platform: Platform = { ...movingPlatform, x: 295 };
    const result = updatePlatforms([platform], 0.5);
    expect(result.platforms[0]?.x).toBe(300);
    expect(result.platforms[0]?.motion?.direction).toBe(-1);
  });

  it("scales moving platform speed with difficulty pressure", (): void => {
    const result = updatePlatforms([movingPlatform], 0.5, 1.5);
    expect(result.platforms[0]?.x).toBeCloseTo(175, 5);
    const delta = result.deltas.get("lift");
    expect(delta?.dx).toBeCloseTo(75, 5);
  });
});

describe("carryPlayerByPlatforms", (): void => {
  it("carries the player when they are riding the platform", (): void => {
    const player: Player = {
      coyoteMs: 0,
      facing: 1,
      grounded: true,
      height: 48,
      invulnerableMs: 0,
      jumpBufferMs: 0,
      jumpHeld: false,
      velocity: { x: 0, y: 0 },
      width: 34,
      x: 120,
      y: 252,
    };
    const platform: Platform = { ...movingPlatform, x: 100, y: 300 };
    const carried = carryPlayerByPlatforms(
      player,
      [platform],
      new Map([["lift", { dx: 10, dy: 0 }]]),
    );
    expect(carried.x).toBe(130);
  });

  it("does not move the player when not grounded", (): void => {
    const player: Player = {
      coyoteMs: 0,
      facing: 1,
      grounded: false,
      height: 48,
      invulnerableMs: 0,
      jumpBufferMs: 0,
      jumpHeld: false,
      velocity: { x: 0, y: 0 },
      width: 34,
      x: 120,
      y: 252,
    };
    const carried = carryPlayerByPlatforms(
      player,
      [movingPlatform],
      new Map([["lift", { dx: 10, dy: 0 }]]),
    );
    expect(carried.x).toBe(120);
  });

  it("returns the same player when no deltas exist", (): void => {
    const player: Player = {
      coyoteMs: 0,
      facing: 1,
      grounded: true,
      height: 48,
      invulnerableMs: 0,
      jumpBufferMs: 0,
      jumpHeld: false,
      velocity: { x: 0, y: 0 },
      width: 34,
      x: 120,
      y: 252,
    };
    const carried = carryPlayerByPlatforms(player, [movingPlatform], new Map());
    expect(carried).toBe(player);
  });
});
