import type { Platform, Player, Rect } from "@/types";
import { getPlatformsInRange, type PlatformIndex } from "./spatial-index";

const COLLISION_WINDOW_MARGIN = 240;

export function getCollisionCandidates(
  player: Player,
  index: PlatformIndex,
): Platform[] {
  const left = player.x - COLLISION_WINDOW_MARGIN;
  const right = player.x + player.width + COLLISION_WINDOW_MARGIN;
  return getPlatformsInRange(index, left, right);
}

export function couldCollideHorizontally(
  player: Player,
  rect: Rect,
  margin: number = 8,
): boolean {
  return (
    rect.x + rect.width >= player.x - margin &&
    rect.x <= player.x + player.width + margin
  );
}
