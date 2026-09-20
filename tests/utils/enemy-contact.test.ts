import { describe, expect, it } from "vitest";

import type { Enemy, Player, WalkerEnemy } from "@/types";
import { resolveEnemyContacts } from "@/utils/enemy-contact";

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    coyoteMs: 0,
    facing: 1,
    grounded: false,
    height: 48,
    invulnerableMs: 0,
    jumpBufferMs: 0,
    jumpHeld: false,
    velocity: { x: 0, y: 200 },
    width: 34,
    x: 100,
    y: 100,
    ...overrides,
  };
}

function makeWalker(overrides: Partial<WalkerEnemy> = {}): Enemy {
  return {
    direction: 1,
    height: 32,
    id: "w-1",
    originX: 100,
    patrolDistance: 100,
    speed: 80,
    type: "walker",
    width: 32,
    x: 100,
    y: 200,
    ...overrides,
  };
}

describe("resolveEnemyContacts", (): void => {
  it("returns enemies unchanged when there is no overlap", (): void => {
    const result = resolveEnemyContacts(
      makePlayer({ y: 50 }),
      makePlayer({ y: 50 }),
      [makeWalker({ x: 600 })],
    );
    expect(result.enemies).toHaveLength(1);
    expect(result.stompedCount).toBe(0);
    expect(result.wasHit).toBe(false);
  });

  it("treats falling onto an enemy as a stomp", (): void => {
    const previous = makePlayer({ velocity: { x: 0, y: 200 }, y: 140 });
    const current = makePlayer({ velocity: { x: 0, y: 200 }, y: 180 });
    const enemy = makeWalker({ x: 110, y: 200 });
    const result = resolveEnemyContacts(previous, current, [enemy]);
    expect(result.stompedCount).toBe(1);
    expect(result.enemies).toHaveLength(0);
    expect(result.player.velocity.y).toBeLessThan(0);
    expect(result.stompedAt).toHaveLength(1);
  });

  it("flags a side hit when player approaches horizontally", (): void => {
    const previous = makePlayer({ velocity: { x: 100, y: 0 }, y: 190 });
    const current = makePlayer({ velocity: { x: 100, y: 0 }, x: 105, y: 190 });
    const enemy = makeWalker({ x: 110, y: 200 });
    const result = resolveEnemyContacts(previous, current, [enemy]);
    expect(result.wasHit).toBe(true);
    expect(result.stompedCount).toBe(0);
    expect(result.enemies).toHaveLength(1);
  });

  it("ignores side hits while the player is invulnerable", (): void => {
    const previous = makePlayer({ velocity: { x: 100, y: 0 }, y: 190 });
    const current = makePlayer({
      invulnerableMs: 800,
      velocity: { x: 100, y: 0 },
      x: 105,
      y: 190,
    });
    const enemy = makeWalker({ x: 110, y: 200 });
    const result = resolveEnemyContacts(previous, current, [enemy]);
    expect(result.wasHit).toBe(false);
    expect(result.enemies).toHaveLength(1);
  });

  it("grants same-frame grace when a stomp bounces into a second enemy", (): void => {
    const previous = makePlayer({ velocity: { x: 0, y: 200 }, y: 140 });
    const current = makePlayer({ velocity: { x: 0, y: 200 }, y: 180 });
    const stompTarget = makeWalker({ x: 110, y: 200 });
    const overlapping = makeWalker({ id: "w-2", x: 110, y: 190 });
    const result = resolveEnemyContacts(previous, current, [
      stompTarget,
      overlapping,
    ]);
    expect(result.stompedCount).toBe(1);
    expect(result.wasHit).toBe(false);
    expect(result.enemies).toHaveLength(1);
  });
});
