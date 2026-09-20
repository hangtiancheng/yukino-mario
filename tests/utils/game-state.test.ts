import { describe, expect, it } from "vitest";

import type { GameInput, GameState, LevelData } from "@/types";
import { createInitialGameState, updateGameState } from "@/utils";

const idleInput: GameInput = {
  jump: false,
  left: false,
  restart: false,
  right: false,
};

const baseLevel: LevelData = {
  coins: [],
  enemies: [],
  height: 540,
  id: "score-demo",
  name: "Score Demo",
  platforms: [
    {
      height: 40,
      id: "ground",
      tone: "ground",
      width: 1_000,
      x: 0,
      y: 500,
    },
  ],
  spawn: { x: 100, y: 452 },
  summary: "Score demo",
  width: 1_000,
};

function createRunningState(level: LevelData): GameState {
  return {
    ...createInitialGameState(level, "low"),
    phase: "running",
  };
}

describe("updateGameState scoring", (): void => {
  it("adds collected coins to weighted score", (): void => {
    const level: LevelData = {
      ...baseLevel,
      coins: [{ height: 22, id: "coin", width: 22, x: 100, y: 452 }],
    };
    const nextState = updateGameState(createRunningState(level), idleInput, 0);
    expect(nextState.stats.coinsCollected).toBe(1);
    expect(nextState.stats.score).toBe(100);
  });

  it("adds stomped enemies to weighted score", (): void => {
    const level: LevelData = {
      ...baseLevel,
      enemies: [
        {
          direction: 1,
          height: 32,
          id: "walker",
          originX: 100,
          patrolDistance: 120,
          speed: 80,
          type: "walker",
          width: 34,
          x: 100,
          y: 468,
        },
      ],
    };
    const state = {
      ...createRunningState(level),
      player: {
        ...createRunningState(level).player,
        grounded: false,
        velocity: { x: 0, y: 100 },
        y: 421,
      },
    };
    const nextState = updateGameState(state, idleInput, 0);
    expect(nextState.stats.stompedEnemies).toBe(1);
    expect(nextState.stats.score).toBe(250);
  });

  it("adds bumped breakable platforms to weighted score", (): void => {
    const level: LevelData = {
      ...baseLevel,
      platforms: [
        ...baseLevel.platforms,
        {
          height: 16,
          id: "mario",
          tone: "breakable",
          width: 64,
          x: 90,
          y: 420,
        },
      ],
    };
    const state = {
      ...createRunningState(level),
      player: {
        ...createRunningState(level).player,
        grounded: false,
        jumpHeld: true,
        velocity: { x: 0, y: -100 },
        y: 435,
      },
    };
    const nextState = updateGameState(state, idleInput, 16);
    expect(nextState.stats.marioBroken).toBe(1);
    expect(nextState.stats.score).toBe(50);
  });
});

describe("updateGameState prune boundary", (): void => {
  it("clamps the player at the pruned world edge", (): void => {
    const running = createRunningState(baseLevel);
    const state: GameState = {
      ...running,
      player: { ...running.player, x: 290 },
      prunedUntilX: 300,
    };
    const nextState = updateGameState(state, idleInput, 16);
    expect(nextState.player.x).toBe(300);
    expect(nextState.prunedUntilX).toBe(300);
  });
});

describe("updateGameState messages", (): void => {
  it("holds the current message while its timer is running", (): void => {
    const state: GameState = {
      ...createRunningState(baseLevel),
      message: "Held message",
      messageTimerMs: 1_000,
    };
    const nextState = updateGameState(state, idleInput, 16);
    expect(nextState.message).toBe("Held message");
    expect(nextState.messageTimerMs).toBe(984);
  });

  it("falls back to the progress message once the timer expires", (): void => {
    const state: GameState = {
      ...createRunningState(baseLevel),
      message: "Held message",
      messageTimerMs: 0,
    };
    const nextState = updateGameState(state, idleInput, 16);
    expect(nextState.message).toBe(
      "Run farther to raise your distance-weighted score.",
    );
  });
});
