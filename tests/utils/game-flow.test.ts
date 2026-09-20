import { describe, expect, it } from "vitest";

import { firstLevel } from "@/constants";
import type { GameInput, GameState, Platform } from "@/types";
import { loseLife } from "@/utils/game-flow";
import { createInitialGameState, updateGameState } from "@/utils";

const idleInput: GameInput = {
  jump: false,
  left: false,
  restart: false,
  right: false,
};

const safePlatform: Platform = {
  height: 32,
  id: "safe-local-ground",
  tone: "ground",
  width: 240,
  x: 700,
  y: 460,
};

function createRunningState(): GameState {
  return {
    ...createInitialGameState(firstLevel, "medium"),
    cameraX: 320,
    phase: "running",
    platforms: [...firstLevel.platforms, safePlatform],
    player: {
      coyoteMs: 0,
      facing: -1,
      grounded: false,
      height: 48,
      invulnerableMs: 0,
      jumpBufferMs: 90,
      jumpHeld: true,
      velocity: { x: 120, y: 500 },
      width: 34,
      x: 780,
      y: 520,
    },
    stats: {
      ...createInitialGameState(firstLevel, "medium").stats,
      lives: 2,
    },
  };
}

describe("loseLife", (): void => {
  it("revives locally when lives remain", (): void => {
    const state = createRunningState();
    const nextState = loseLife(state, "Try again.");
    expect(nextState.phase).toBe("running");
    expect(nextState.stats.lives).toBe(1);
    expect(nextState.player.x).toBe(state.player.x);
    expect(nextState.player.y).toBe(safePlatform.y - state.player.height);
    expect(nextState.player.y).not.toBe(firstLevel.spawn.y);
    expect(nextState.player.velocity).toEqual({ x: 0, y: 0 });
    expect(nextState.player.grounded).toBe(true);
  });

  it("updates camera around the local revive position", (): void => {
    const nextState = loseLife(createRunningState(), "Try again.");
    expect(nextState.cameraX).toBeGreaterThan(300);
  });

  it("keeps terminal damage as game over", (): void => {
    const state = {
      ...createRunningState(),
      stats: { ...createRunningState().stats, lives: 1 },
    };
    const nextState = loseLife(state, "Try again.");
    expect(nextState.phase).toBe("lost");
    expect(nextState.stats.lives).toBe(0);
    expect(nextState.message).toBe("Game over. Press R to restart.");
  });

  it("grants invulnerability frames after a revive", (): void => {
    const nextState = loseLife(createRunningState(), "Try again.");
    expect(nextState.player.invulnerableMs).toBe(1_500);
    expect(nextState.messageTimerMs).toBe(2_400);
  });
});

describe("updateGameState restart", (): void => {
  it("restarts at the level spawn instead of the local revive point", (): void => {
    const nextState = updateGameState(
      createRunningState(),
      { ...idleInput, restart: true },
      16,
    );
    expect(nextState.player.x).toBe(firstLevel.spawn.x);
    expect(nextState.player.y).toBe(firstLevel.spawn.y);
    expect(nextState.phase).toBe("ready");
  });
});
