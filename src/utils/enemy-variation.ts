import type {
  Enemy,
  FlyerEnemy,
  HopperEnemy,
  HorizontalDirection,
  WalkerEnemy,
} from "@/types";
import { clamp } from "./rect";

const BASE_POSITION_JITTER: number = 48;
const BASE_MIN_SPEED_SCALE: number = 0.88;
const BASE_MAX_SPEED_SCALE: number = 1.18;
const PHASE_SPAN_MS: number = 900;

export function createSegmentEnemy(
  enemy: Enemy,
  segmentIndex: number,
  offsetX: number,
  jitterScale: number = 1,
): Enemy {
  switch (enemy.type) {
    case "walker":
      return createWalker(enemy, segmentIndex, offsetX, jitterScale);
    case "hopper":
      return createHopper(enemy, segmentIndex, offsetX, jitterScale);
    case "flyer":
      return createFlyer(enemy, segmentIndex, offsetX, jitterScale);
  }
}

function createWalker(
  enemy: WalkerEnemy,
  segmentIndex: number,
  offsetX: number,
  jitterScale: number,
): WalkerEnemy {
  const base = getBaseVariation(enemy, segmentIndex, offsetX, jitterScale);
  return { ...enemy, ...base, type: "walker" };
}

function createHopper(
  enemy: HopperEnemy,
  segmentIndex: number,
  offsetX: number,
  jitterScale: number,
): HopperEnemy {
  const base = getBaseVariation(enemy, segmentIndex, offsetX, jitterScale);
  return {
    ...enemy,
    ...base,
    type: "hopper",
    hopPhaseMs: getPhase(enemy.id, segmentIndex),
  };
}

function createFlyer(
  enemy: FlyerEnemy,
  segmentIndex: number,
  offsetX: number,
  jitterScale: number,
): FlyerEnemy {
  const base = getBaseVariation(enemy, segmentIndex, offsetX, jitterScale);
  return {
    ...enemy,
    ...base,
    type: "flyer",
    wavePhaseMs: getPhase(enemy.id, segmentIndex),
  };
}

function getBaseVariation(
  enemy: Enemy,
  segmentIndex: number,
  offsetX: number,
  jitterScale: number,
): Pick<Enemy, "direction" | "id" | "originX" | "speed" | "x"> {
  const originX = enemy.originX + offsetX;
  const positionJitter = BASE_POSITION_JITTER * jitterScale;
  const jitter = getRangeValue(
    enemy.id,
    segmentIndex,
    "x",
    -positionJitter,
    positionJitter,
  );
  const x = clamp(
    enemy.x + offsetX + jitter,
    originX,
    originX + enemy.patrolDistance,
  );
  return {
    direction: getDirection(enemy.direction, enemy.id, segmentIndex),
    id: `segment-${segmentIndex}-${enemy.id}`,
    originX,
    speed: enemy.speed * getSpeedScale(enemy.id, segmentIndex, jitterScale),
    x,
  };
}

function getDirection(
  direction: HorizontalDirection,
  enemyId: string,
  segmentIndex: number,
): HorizontalDirection {
  return getSeededUnit(enemyId, segmentIndex, "direction") < 0.5
    ? direction
    : invertDirection(direction);
}

function invertDirection(direction: HorizontalDirection): HorizontalDirection {
  return direction === 1 ? -1 : 1;
}

function getSpeedScale(
  enemyId: string,
  segmentIndex: number,
  jitterScale: number,
): number {
  const range = (BASE_MAX_SPEED_SCALE - BASE_MIN_SPEED_SCALE) * jitterScale;
  const center = (BASE_MIN_SPEED_SCALE + BASE_MAX_SPEED_SCALE) / 2;
  return getRangeValue(
    enemyId,
    segmentIndex,
    "speed",
    center - range / 2,
    center + range / 2,
  );
}

function getPhase(enemyId: string, segmentIndex: number): number {
  return getRangeValue(enemyId, segmentIndex, "phase", 1, PHASE_SPAN_MS);
}

function getRangeValue(
  enemyId: string,
  segmentIndex: number,
  salt: string,
  minimum: number,
  maximum: number,
): number {
  return (
    minimum + (maximum - minimum) * getSeededUnit(enemyId, segmentIndex, salt)
  );
}

function getSeededUnit(
  enemyId: string,
  segmentIndex: number,
  salt: string,
): number {
  return (hashSeed(`${segmentIndex}:${enemyId}:${salt}`) % 10_000) / 10_000;
}

function hashSeed(seed: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 16_777_619);
  }
  return Math.abs(hash);
}
