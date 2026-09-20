import { PARTICLE_LIFE_MS } from "@/constants";
import type { Particle, ParticleKind, Platform, Vector } from "@/types";

export interface ParticleSpawn {
  kind: ParticleKind;
  origin: Vector;
}

export interface ParticleResult {
  particles: Particle[];
  nextParticleId: number;
}

const burstVectors: Vector[] = [
  { x: -110, y: -180 },
  { x: -42, y: -230 },
  { x: 42, y: -230 },
  { x: 110, y: -180 },
];

export function updateParticles(
  particles: Particle[],
  frameMs: number,
): Particle[] {
  const frameSeconds = frameMs / 1_000;
  const nextParticles: Particle[] = [];
  for (const particle of particles) {
    const lifeMs = particle.lifeMs - frameMs;
    if (lifeMs > 0) {
      nextParticles.push({
        ...particle,
        x: particle.x + particle.velocity.x * frameSeconds,
        y: particle.y + particle.velocity.y * frameSeconds,
        lifeMs,
      });
    }
  }
  return nextParticles;
}

export function spawnParticles(
  particles: Particle[],
  nextParticleId: number,
  spawns: ParticleSpawn[],
): ParticleResult {
  const nextParticles = [...particles];
  let id = nextParticleId;
  for (const spawn of spawns) {
    for (const vector of burstVectors) {
      nextParticles.push(createParticle(id, spawn.kind, spawn.origin, vector));
      id += 1;
    }
  }
  return { particles: nextParticles, nextParticleId: id };
}

export function createSpawns(
  kind: ParticleKind,
  origins: Vector[],
): ParticleSpawn[] {
  const spawns: ParticleSpawn[] = [];
  for (const origin of origins) {
    spawns.push({ kind, origin });
  }
  return spawns;
}

export function getPlatformCenter(
  platforms: Platform[],
  platformId: string | null,
): Vector | null {
  if (platformId === null) {
    return null;
  }
  for (const platform of platforms) {
    if (platform.id === platformId) {
      return {
        x: platform.x + platform.width / 2,
        y: platform.y + platform.height / 2,
      };
    }
  }
  return null;
}

function createParticle(
  id: number,
  kind: ParticleKind,
  origin: Vector,
  velocity: Vector,
): Particle {
  return {
    id,
    kind,
    x: origin.x - 4,
    y: origin.y - 4,
    width: 8,
    height: 8,
    velocity,
    lifeMs: PARTICLE_LIFE_MS,
    maxLifeMs: PARTICLE_LIFE_MS,
  };
}
