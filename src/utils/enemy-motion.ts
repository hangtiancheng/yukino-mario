import type {
  Enemy,
  FlyerEnemy,
  HopperEnemy,
  HorizontalDirection,
  WalkerEnemy,
} from "@/types";
import { exhaustiveCheck } from "./exhaustive-check";

type PatrolResult = { direction: HorizontalDirection; x: number };

const HOP_WAVE_TIME_SCALE_MS = 260;
const FLYER_WAVE_TIME_SCALE_MS = 330;

export function updateEnemies(
  enemies: Enemy[],
  frameSeconds: number,
  speedScale = 1,
): Enemy[] {
  const nextEnemies: Enemy[] = [];
  for (const enemy of enemies) {
    nextEnemies.push(updateEnemy(enemy, frameSeconds, speedScale));
  }
  return nextEnemies;
}

function updateEnemy(
  enemy: Enemy,
  frameSeconds: number,
  speedScale: number,
): Enemy {
  switch (enemy.type) {
    case "walker":
      return updateWalker(enemy, frameSeconds, speedScale);
    case "hopper":
      return updateHopper(enemy, frameSeconds, speedScale);
    case "flyer":
      return updateFlyer(enemy, frameSeconds, speedScale);
    default:
      return exhaustiveCheck(enemy);
  }
}

function updateWalker(
  enemy: WalkerEnemy,
  frameSeconds: number,
  speedScale: number,
): WalkerEnemy {
  const patrol = getPatrol(
    enemy.originX,
    enemy.patrolDistance,
    enemy.x,
    enemy.speed * speedScale,
    enemy.direction,
    frameSeconds,
  );
  return {
    type: "walker",
    id: enemy.id,
    x: patrol.x,
    y: enemy.y,
    width: enemy.width,
    height: enemy.height,
    originX: enemy.originX,
    patrolDistance: enemy.patrolDistance,
    speed: enemy.speed,
    direction: patrol.direction,
  };
}

function updateHopper(
  enemy: HopperEnemy,
  frameSeconds: number,
  speedScale: number,
): HopperEnemy {
  const patrol = getPatrol(
    enemy.originX,
    enemy.patrolDistance,
    enemy.x,
    enemy.speed * speedScale,
    enemy.direction,
    frameSeconds,
  );
  const hopPhaseMs = enemy.hopPhaseMs + frameSeconds * 1_000 * speedScale;
  const hopWave = Math.abs(Math.sin(hopPhaseMs / HOP_WAVE_TIME_SCALE_MS));
  return {
    type: "hopper",
    id: enemy.id,
    x: patrol.x,
    y: enemy.originY - hopWave * enemy.hopHeight,
    width: enemy.width,
    height: enemy.height,
    originX: enemy.originX,
    originY: enemy.originY,
    patrolDistance: enemy.patrolDistance,
    speed: enemy.speed,
    direction: patrol.direction,
    hopPhaseMs,
    hopHeight: enemy.hopHeight,
  };
}

function updateFlyer(
  enemy: FlyerEnemy,
  frameSeconds: number,
  speedScale: number,
): FlyerEnemy {
  const patrol = getPatrol(
    enemy.originX,
    enemy.patrolDistance,
    enemy.x,
    enemy.speed * speedScale,
    enemy.direction,
    frameSeconds,
  );
  const wavePhaseMs = enemy.wavePhaseMs + frameSeconds * 1_000 * speedScale;
  const wave = Math.sin(wavePhaseMs / FLYER_WAVE_TIME_SCALE_MS);
  return {
    type: "flyer",
    id: enemy.id,
    x: patrol.x,
    y: enemy.originY + wave * enemy.waveHeight,
    width: enemy.width,
    height: enemy.height,
    originX: enemy.originX,
    originY: enemy.originY,
    patrolDistance: enemy.patrolDistance,
    speed: enemy.speed,
    direction: patrol.direction,
    wavePhaseMs,
    waveHeight: enemy.waveHeight,
  };
}

function getPatrol(
  originX: number,
  distance: number,
  x: number,
  speed: number,
  direction: HorizontalDirection,
  frameSeconds: number,
): PatrolResult {
  const minimumX = originX;
  const maximumX = originX + distance;
  const nextX = x + speed * direction * frameSeconds;
  if (nextX < minimumX) {
    return { x: minimumX, direction: 1 };
  }
  if (nextX > maximumX) {
    return { x: maximumX, direction: -1 };
  }
  return { x: nextX, direction };
}
