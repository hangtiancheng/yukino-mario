import { CAMERA_EASE, VIEWPORT_WIDTH } from "@/constants";
import type { Player } from "@/types";
import { clamp } from "./rect";

export function getTargetCameraX(player: Player, levelWidth: number): number {
  const centeredX = player.x + player.width / 2 - VIEWPORT_WIDTH / 2;
  return clamp(centeredX, 0, levelWidth - VIEWPORT_WIDTH);
}

export function smoothCameraX(
  currentCameraX: number,
  targetCameraX: number,
  frameSeconds: number,
  cameraEase = CAMERA_EASE,
): number {
  const blend = 1 - Math.exp(-cameraEase * frameSeconds);
  return currentCameraX + (targetCameraX - currentCameraX) * blend;
}
