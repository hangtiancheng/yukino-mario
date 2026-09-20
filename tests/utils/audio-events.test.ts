import { describe, expect, it } from "vitest";

import { firstLevel } from "@/constants";
import type { GameState } from "@/types";
import { createInitialGameState, getAudioEvent } from "@/utils";

function makeRunningState(): GameState {
  return { ...createInitialGameState(firstLevel, "medium"), phase: "running" };
}

describe("getAudioEvent", (): void => {
  it("uses stomped enemy stats for stomp audio", (): void => {
    const previous = createInitialGameState(firstLevel, "medium");
    const current = {
      ...previous,
      stats: { ...previous.stats, stompedEnemies: 1 },
    };
    expect(getAudioEvent(previous, current)).toBe("stomp");
  });

  it("uses broken mario stats for break audio", (): void => {
    const previous = createInitialGameState(firstLevel, "medium");
    const current = {
      ...previous,
      stats: { ...previous.stats, marioBroken: 1 },
    };
    expect(getAudioEvent(previous, current)).toBe("break");
  });

  it("plays loss when the run transitions to lost", (): void => {
    const previous = makeRunningState();
    const current: GameState = { ...previous, phase: "lost" };
    expect(getAudioEvent(previous, current)).toBe("loss");
  });

  it("plays hit when a life is lost and prioritises it over stomp", (): void => {
    const previous = makeRunningState();
    const current: GameState = {
      ...previous,
      stats: {
        ...previous.stats,
        lives: previous.stats.lives - 1,
        stompedEnemies: 1,
      },
    };
    expect(getAudioEvent(previous, current)).toBe("hit");
  });

  it("plays coin when a coin is collected", (): void => {
    const previous = makeRunningState();
    const current: GameState = {
      ...previous,
      stats: { ...previous.stats, coinsCollected: 1 },
    };
    expect(getAudioEvent(previous, current)).toBe("coin");
  });

  it("plays start when the game leaves the ready phase", (): void => {
    const previous = createInitialGameState(firstLevel, "medium");
    const current: GameState = { ...previous, phase: "running" };
    expect(getAudioEvent(previous, current)).toBe("start");
  });

  it("plays jump only past the upward velocity threshold", (): void => {
    const previous = makeRunningState();
    const jumping: GameState = {
      ...previous,
      player: { ...previous.player, velocity: { x: 0, y: -600 } },
    };
    expect(getAudioEvent(previous, jumping)).toBe("jump");
    const drifting: GameState = {
      ...previous,
      player: { ...previous.player, velocity: { x: 0, y: -400 } },
    };
    expect(getAudioEvent(previous, drifting)).toBeNull();
  });
});
