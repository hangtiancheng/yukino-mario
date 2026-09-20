import { describe, expect, it } from "vitest";

import { COYOTE_TIME_MS } from "@/constants";
import type { GameInput, Platform, Player } from "@/types";
import { updatePlayer } from "@/utils/player-motion";
import { buildPlatformIndex } from "@/utils/spatial-index";

const idleInput: GameInput = {
  jump: false,
  left: false,
  restart: false,
  right: false,
};

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    coyoteMs: COYOTE_TIME_MS,
    facing: 1,
    grounded: true,
    height: 48,
    invulnerableMs: 0,
    jumpBufferMs: 0,
    jumpHeld: false,
    velocity: { x: 0, y: 0 },
    width: 34,
    x: 100,
    y: 100,
    ...overrides,
  };
}

const groundPlatform: Platform = {
  height: 32,
  id: "ground",
  tone: "ground",
  width: 1_000,
  x: 0,
  y: 148,
};

describe("updatePlayer", (): void => {
  it("applies horizontal velocity when right is pressed", (): void => {
    const result = updatePlayer(
      makePlayer(),
      { ...idleInput, right: true },
      buildPlatformIndex([groundPlatform]),
      16,
    );
    expect(result.player.velocity.x).toBeGreaterThan(0);
    expect(result.player.x).toBeGreaterThan(100);
    expect(result.player.facing).toBe(1);
  });

  it("triggers a jump when grounded and jump pressed", (): void => {
    const result = updatePlayer(
      makePlayer(),
      { ...idleInput, jump: true },
      buildPlatformIndex([groundPlatform]),
      16,
    );
    expect(result.player.velocity.y).toBeLessThan(0);
    expect(result.player.grounded).toBe(false);
  });

  it("flags breakable platforms when bumped from below", (): void => {
    const breakable: Platform = {
      height: 16,
      id: "mario-1",
      tone: "breakable",
      width: 64,
      x: 90,
      y: 40,
    };
    const player = makePlayer({
      grounded: false,
      jumpHeld: true,
      velocity: { x: 0, y: -100 },
      y: 55,
    });
    const result = updatePlayer(
      player,
      idleInput,
      buildPlatformIndex([breakable]),
      16,
    );
    expect(result.bumpedPlatformId).toBe("mario-1");
  });

  it("counts down invulnerability by the frame time and floors at zero", (): void => {
    const index = buildPlatformIndex([groundPlatform]);
    const ticking = updatePlayer(
      makePlayer({ invulnerableMs: 100 }),
      idleInput,
      index,
      16,
    );
    expect(ticking.player.invulnerableMs).toBe(84);
    const drained = updatePlayer(
      makePlayer({ invulnerableMs: 10 }),
      idleInput,
      index,
      16,
    );
    expect(drained.player.invulnerableMs).toBe(0);
  });
});
