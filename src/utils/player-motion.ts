import {
  COYOTE_TIME_MS,
  GRAVITY,
  JUMP_BUFFER_MS,
  JUMP_CUT_VELOCITY,
  JUMP_VELOCITY,
  MAX_FALL_SPEED,
  MOVE_SPEED,
} from "@/constants";
import type { GameInput, HorizontalDirection, Player } from "@/types";
import { getCollisionCandidates } from "./collision-candidates";
import { resolveHorizontalAxis, resolveVerticalAxis } from "./player-physics";
import type { PlatformIndex } from "./spatial-index";

export interface MotionResult {
  player: Player;
  bumpedPlatformId: string | null;
}

interface JumpState {
  velocityY: number;
  coyoteMs: number;
  jumpBufferMs: number;
}

export function updatePlayer(
  player: Player,
  input: GameInput,
  platformIndex: PlatformIndex,
  frameMs: number,
): MotionResult {
  const frameSeconds = frameMs / 1_000;
  const horizontalInput = Number(input.right) - Number(input.left);
  const velocityX = horizontalInput * MOVE_SPEED;
  const candidates = getCollisionCandidates(player, platformIndex);
  const jumpState = getJumpState(player, input, frameMs, frameSeconds);
  const facing = getFacingDirection(horizontalInput, player.facing);
  const horizontal = resolveHorizontalAxis(
    player,
    velocityX,
    frameSeconds,
    candidates,
  );
  const vertical = resolveVerticalAxis(
    player,
    horizontal.x,
    { velocityY: jumpState.velocityY, coyoteMs: jumpState.coyoteMs },
    frameSeconds,
    candidates,
  );
  const nextPlayer: Player = {
    x: horizontal.x,
    y: vertical.y,
    width: player.width,
    height: player.height,
    velocity: { x: horizontal.velocityX, y: vertical.velocityY },
    facing,
    grounded: vertical.grounded,
    coyoteMs: vertical.coyoteMs,
    jumpBufferMs: jumpState.jumpBufferMs,
    jumpHeld: input.jump,
    invulnerableMs: Math.max(player.invulnerableMs - frameMs, 0),
  };
  return { player: nextPlayer, bumpedPlatformId: vertical.bumpedPlatformId };
}

function getJumpState(
  player: Player,
  input: GameInput,
  frameMs: number,
  frameSeconds: number,
): JumpState {
  const coyoteMs = player.grounded
    ? COYOTE_TIME_MS
    : Math.max(player.coyoteMs - frameMs, 0);
  const jumpBufferMs =
    input.jump && !player.jumpHeld
      ? JUMP_BUFFER_MS
      : Math.max(player.jumpBufferMs - frameMs, 0);

  if (jumpBufferMs > 0 && coyoteMs > 0) {
    return { velocityY: -JUMP_VELOCITY, coyoteMs: 0, jumpBufferMs: 0 };
  }

  const gravityVelocityY = Math.min(
    player.velocity.y + GRAVITY * frameSeconds,
    MAX_FALL_SPEED,
  );
  if (!input.jump && player.jumpHeld && gravityVelocityY < -JUMP_CUT_VELOCITY) {
    return { velocityY: -JUMP_CUT_VELOCITY, coyoteMs, jumpBufferMs };
  }
  return { velocityY: gravityVelocityY, coyoteMs, jumpBufferMs };
}

function getFacingDirection(
  input: number,
  fallback: HorizontalDirection,
): HorizontalDirection {
  if (input < 0) {
    return -1;
  }
  if (input > 0) {
    return 1;
  }
  return fallback;
}
