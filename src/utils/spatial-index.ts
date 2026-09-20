import type { Platform } from "@/types";

export interface PlatformIndex {
  readonly sorted: readonly Platform[];
  readonly maxWidth: number;
}

const EMPTY_INDEX: PlatformIndex = { sorted: [], maxWidth: 0 };

export function buildPlatformIndex(platforms: Platform[]): PlatformIndex {
  if (platforms.length === 0) {
    return EMPTY_INDEX;
  }
  const sorted = platforms.slice().sort(comparePlatformX);
  let maxWidth = 0;
  for (const platform of sorted) {
    if (platform.width > maxWidth) {
      maxWidth = platform.width;
    }
  }
  return { sorted, maxWidth };
}

export function lowerBoundByX(
  sorted: readonly Platform[],
  target: number,
): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const item = sorted[mid];
    if (item === undefined) {
      break;
    }
    if (item.x < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

export function getPlatformsInRange(
  index: PlatformIndex,
  left: number,
  right: number,
): Platform[] {
  if (index.sorted.length === 0) {
    return [];
  }
  const start = lowerBoundByX(index.sorted, left - index.maxWidth);
  const candidates: Platform[] = [];
  for (let i = start; i < index.sorted.length; i += 1) {
    const platform = index.sorted[i];
    if (platform === undefined) {
      break;
    }
    if (platform.x > right) {
      break;
    }
    if (platform.x + platform.width >= left) {
      candidates.push(platform);
    }
  }
  return candidates;
}

function comparePlatformX(a: Platform, b: Platform): number {
  return a.x - b.x;
}
