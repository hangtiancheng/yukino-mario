import type { Platform, Vector } from "@/types";
import { createSpawns, getPlatformCenter } from "./particles";
import type { ParticleSpawn } from "./particles";

export function getParticleSpawns(
  coins: Vector[],
  stomps: Vector[],
  platforms: Platform[],
  platformId: string | null,
  wasHit: boolean,
  player: Vector,
): ParticleSpawn[] {
  const spawns = [
    ...createSpawns("coin", coins),
    ...createSpawns("stomp", stomps),
  ];
  const platformCenter = getPlatformCenter(platforms, platformId);
  if (platformCenter !== null) {
    spawns.push({ kind: "mario", origin: platformCenter });
  }
  if (wasHit) {
    spawns.push({ kind: "hit", origin: player });
  }
  return spawns;
}
