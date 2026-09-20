import { COYOTE_TIME_MS } from "@/constants";
import type { Platform, Player } from "@/types";
import { intersects } from "./rect";

export interface HorizontalAxisState {
  x: number;
  velocityX: number;
}

export interface VerticalAxisInput {
  velocityY: number;
  coyoteMs: number;
}

export interface VerticalAxisState {
  y: number;
  velocityY: number;
  grounded: boolean;
  coyoteMs: number;
  bumpedPlatformId: string | null;
}

export function resolveHorizontalAxis(
  player: Player,
  velocityX: number,
  frameSeconds: number,
  candidates: Platform[],
): HorizontalAxisState {
  let nextX = player.x + velocityX * frameSeconds;
  let nextVelocityX = velocityX;
  const probe = {
    x: nextX,
    y: player.y,
    width: player.width,
    height: player.height,
  };
  for (const platform of candidates) {
    probe.x = nextX;
    if (!intersects(probe, platform)) {
      continue;
    }
    if (nextVelocityX > 0) {
      nextX = platform.x - player.width;
      nextVelocityX = 0;
    } else if (nextVelocityX < 0) {
      nextX = platform.x + platform.width;
      nextVelocityX = 0;
    }
  }
  return { x: nextX, velocityX: nextVelocityX };
}

export function resolveVerticalAxis(
  player: Player,
  resolvedX: number,
  axis: VerticalAxisInput,
  frameSeconds: number,
  candidates: Platform[],
): VerticalAxisState {
  let nextY = player.y + axis.velocityY * frameSeconds;
  let nextVelocityY = axis.velocityY;
  let grounded = false;
  let coyoteMs = axis.coyoteMs;
  let bumpedPlatformId: string | null = null;
  const probe = {
    x: resolvedX,
    y: nextY,
    width: player.width,
    height: player.height,
  };
  for (const platform of candidates) {
    probe.y = nextY;
    if (!intersects(probe, platform)) {
      continue;
    }
    if (nextVelocityY > 0) {
      nextY = platform.y - player.height;
      nextVelocityY = 0;
      grounded = true;
      coyoteMs = COYOTE_TIME_MS;
    } else if (nextVelocityY < 0) {
      nextY = platform.y + platform.height;
      nextVelocityY = 0;
      if (platform.tone === "breakable") {
        bumpedPlatformId = platform.id;
      }
    }
  }
  return {
    y: nextY,
    velocityY: nextVelocityY,
    grounded,
    coyoteMs,
    bumpedPlatformId,
  };
}
