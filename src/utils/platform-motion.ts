import { MOVING_PLATFORM_RIDER_TOLERANCE } from "@/constants";
import type { Platform, PlatformMotion, Player } from "@/types";

export interface PlatformDelta {
  dx: number;
  dy: number;
}

export type PlatformDeltaMap = ReadonlyMap<string, PlatformDelta>;

export interface PlatformMotionResult {
  platforms: Platform[];
  deltas: PlatformDeltaMap;
}

export function updatePlatforms(
  platforms: Platform[],
  frameSeconds: number,
  speedScale = 1,
): PlatformMotionResult {
  const nextPlatforms: Platform[] = [];
  const deltas = new Map<string, PlatformDelta>();

  for (const platform of platforms) {
    const nextPlatform = updatePlatform(platform, frameSeconds, speedScale);
    nextPlatforms.push(nextPlatform);
    const dx = nextPlatform.x - platform.x;
    const dy = nextPlatform.y - platform.y;
    if (dx !== 0 || dy !== 0) {
      deltas.set(platform.id, { dx, dy });
    }
  }

  return { platforms: nextPlatforms, deltas };
}

export function carryPlayerByPlatforms(
  player: Player,
  platforms: Platform[],
  deltas: PlatformDeltaMap,
): Player {
  if (deltas.size === 0) {
    return player;
  }
  for (const platform of platforms) {
    const delta = deltas.get(platform.id);
    if (delta === undefined) {
      continue;
    }
    if (isRidingPlatform(player, platform)) {
      return { ...player, x: player.x + delta.dx, y: player.y + delta.dy };
    }
  }
  return player;
}

function updatePlatform(
  platform: Platform,
  frameSeconds: number,
  speedScale: number,
): Platform {
  if (platform.motion === undefined) {
    return platform;
  }

  const motion = getNextMotion(
    platform,
    platform.motion,
    frameSeconds,
    speedScale,
  );
  if (platform.motion.axis === "x") {
    return { ...platform, x: motion.value, motion: motion.motion };
  }
  return { ...platform, y: motion.value, motion: motion.motion };
}

function getNextMotion(
  platform: Platform,
  motion: PlatformMotion,
  frameSeconds: number,
  speedScale: number,
): { value: number; motion: PlatformMotion } {
  const currentValue = motion.axis === "x" ? platform.x : platform.y;
  const minimum = motion.origin;
  const maximum = motion.origin + motion.distance;
  const nextValue =
    currentValue + motion.speed * speedScale * motion.direction * frameSeconds;

  if (nextValue < minimum) {
    return { value: minimum, motion: { ...motion, direction: 1 } };
  }
  if (nextValue > maximum) {
    return { value: maximum, motion: { ...motion, direction: -1 } };
  }
  return { value: nextValue, motion };
}

function isRidingPlatform(player: Player, platform: Platform): boolean {
  const playerBottom = player.y + player.height;
  const overlapsHorizontally =
    player.x + player.width > platform.x &&
    player.x < platform.x + platform.width;
  return (
    player.grounded &&
    overlapsHorizontally &&
    Math.abs(playerBottom - platform.y) <= MOVING_PLATFORM_RIDER_TOLERANCE
  );
}
