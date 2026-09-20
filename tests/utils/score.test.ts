import { describe, expect, it } from "vitest";

import {
  getScoreBreakdown,
  getWeightedScore,
  getRunDistance,
} from "@/utils/score";

describe("getRunDistance", (): void => {
  it("returns positive distance from spawn", (): void => {
    expect(getRunDistance(120, 50)).toBe(70);
  });
  it("clamps negative distance to zero", (): void => {
    expect(getRunDistance(10, 80)).toBe(0);
  });
});

describe("getScoreBreakdown", (): void => {
  it("combines distance, coins, enemies, and breakable platforms", (): void => {
    const breakdown = getScoreBreakdown({
      marioBroken: 2,
      coinsCollected: 3,
      difficulty: "low",
      distance: 100,
      stompedEnemies: 1,
    });
    expect(breakdown.distanceScore).toBe(100);
    expect(breakdown.coinScore).toBe(300);
    expect(breakdown.enemyScore).toBe(250);
    expect(breakdown.breakableScore).toBe(100);
    expect(breakdown.baseScore).toBe(750);
  });

  it("applies the difficulty multiplier after action weights", (): void => {
    expect(
      getWeightedScore({
        marioBroken: 0,
        coinsCollected: 2,
        difficulty: "medium",
        distance: 100,
        stompedEnemies: 1,
      }),
    ).toBe(825);
  });

  it("keeps hell multiplier on the combined score", (): void => {
    expect(
      getWeightedScore({
        marioBroken: 1,
        coinsCollected: 1,
        difficulty: "hell",
        distance: 100,
        stompedEnemies: 0,
      }),
    ).toBe(750);
  });

  it("floors fractional results", (): void => {
    expect(
      getWeightedScore({
        marioBroken: 0,
        coinsCollected: 0,
        difficulty: "medium",
        distance: 33.4,
        stompedEnemies: 0,
      }),
    ).toBe(50);
  });
});
