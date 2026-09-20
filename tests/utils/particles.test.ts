import { describe, expect, it } from "vitest";

import type { Particle, Platform } from "@/types";
import {
  createSpawns,
  getPlatformCenter,
  spawnParticles,
  updateParticles,
} from "@/utils/particles";

function makeParticle(overrides: Partial<Particle> = {}): Particle {
  return {
    height: 8,
    id: 1,
    kind: "coin",
    lifeMs: 200,
    maxLifeMs: 200,
    velocity: { x: 10, y: -20 },
    width: 8,
    x: 100,
    y: 100,
    ...overrides,
  };
}

describe("updateParticles", (): void => {
  it("integrates position and decreases life", (): void => {
    const result = updateParticles([makeParticle()], 100);
    expect(result).toHaveLength(1);
    expect(result[0]?.lifeMs).toBe(100);
    expect(result[0]?.x).toBeCloseTo(101, 5);
    expect(result[0]?.y).toBeCloseTo(98, 5);
  });

  it("removes particles whose life has expired", (): void => {
    const result = updateParticles([makeParticle({ lifeMs: 50 })], 100);
    expect(result).toHaveLength(0);
  });
});

describe("spawnParticles", (): void => {
  it("creates four particles per spawn and bumps id counter", (): void => {
    const spawns = createSpawns("coin", [{ x: 200, y: 200 }]);
    const result = spawnParticles([], 10, spawns);
    expect(result.particles).toHaveLength(4);
    expect(result.nextParticleId).toBe(14);
    expect(result.particles[0]?.kind).toBe("coin");
  });
});

describe("getPlatformCenter", (): void => {
  const platform: Platform = {
    height: 30,
    id: "p-1",
    tone: "mario",
    width: 60,
    x: 100,
    y: 200,
  };
  it("returns the center of a known platform", (): void => {
    expect(getPlatformCenter([platform], "p-1")).toEqual({ x: 130, y: 215 });
  });
  it("returns null when the id is not found", (): void => {
    expect(getPlatformCenter([platform], "missing")).toBeNull();
  });
  it("returns null when id is null", (): void => {
    expect(getPlatformCenter([platform], null)).toBeNull();
  });
});
