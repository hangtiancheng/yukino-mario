import {
  ARR_REPEAT_MS,
  DAS_DELAY_MS,
  LINES_PER_LEVEL,
  LOCK_DELAY_MS,
  MAX_FRAME_MS,
  MAX_LOCK_RESETS,
  MESSAGE_HOLD_MS,
  NEXT_QUEUE_SIZE,
  SOFT_DROP_FACTOR,
  getDifficultyOption,
} from "@/constants";
import type {
  GameAction,
  GameInput,
  GameState,
  HorizontalDirection,
  TetrominoType,
} from "@/types";
import { clearRows, findFullRows, lockCells } from "./board";
import {
  IDLE_MESSAGE,
  getLineClearMessage,
  hasStartInput,
  pauseGame,
  resumeGame,
  startGame,
  topOut,
} from "./game-flow";
import { getGravityDelayMs } from "./gravity";
import { createInitialGameState } from "./initial-game-state";
import { drawBagPieces } from "./random-bag";
import { getComboBonus, getDropScore, getLineClearAward } from "./scoring";
import {
  canPlacePiece,
  createSpawnPiece,
  getGhostY,
  getPieceCells,
  movePiece,
  tryRotate,
} from "./tetromino";

export function updateGameState(
  previous: GameState,
  input: GameInput,
  deltaMs: number,
): GameState {
  if (input.restart) {
    return createInitialGameState(previous.difficulty);
  }

  if (previous.phase === "lost") {
    return previous;
  }

  if (previous.phase === "paused") {
    return input.actions.includes("pause") ? resumeGame(previous) : previous;
  }

  if (previous.phase === "ready" && !hasStartInput(input)) {
    return previous;
  }

  const frameMs = Math.min(deltaMs, MAX_FRAME_MS);
  const startedFromReady = previous.phase === "ready";
  const state = startedFromReady ? startGame(previous) : previous;
  const actions: readonly GameAction[] = startedFromReady
    ? input.actions.filter((action): boolean => action !== "pause")
    : input.actions;
  const option = getDifficultyOption(state.difficulty);

  let board = state.board;
  let active = state.active;
  let hold = state.hold;
  let holdUsed = state.holdUsed;
  let nextQueue = state.nextQueue;
  let bag = state.bag;
  let rngSeed = state.rngSeed;
  let fallAccumulatorMs = state.fallAccumulatorMs;
  let lockTimerMs = state.lockTimerMs;
  let lockResets = state.lockResets;
  let dasDirection: HorizontalDirection = state.dasDirection;
  let dasTimerMs = state.dasTimerMs;
  let arrTimerMs = state.arrTimerMs;
  let combo = state.combo;
  let backToBack = state.backToBack;
  let stats = state.stats;
  let message = state.message;
  let messageTimerMs = Math.max(state.messageTimerMs - frameMs, 0);

  let softDropCells = 0;
  let hardDropCells = 0;
  let moved = false;
  let rotated = false;
  let locked = false;
  let clearedRows = 0;
  let backToBackApplied = false;

  function composeState(): GameState {
    return {
      ...state,
      active,
      arrTimerMs,
      backToBack,
      bag,
      board,
      combo,
      dasDirection,
      dasTimerMs,
      fallAccumulatorMs,
      ghostY: active === null ? 0 : getGhostY(board, active),
      hold,
      holdUsed,
      lockResets,
      lockTimerMs,
      message,
      messageTimerMs,
      nextQueue,
      rngSeed,
      stats: { ...stats, elapsedMs: stats.elapsedMs + frameMs },
    };
  }

  function spawnPiece(type: TetrominoType): boolean {
    const spawned = createSpawnPiece(type);
    if (!canPlacePiece(board, spawned)) {
      return false;
    }
    active = spawned;
    fallAccumulatorMs = 0;
    lockTimerMs = 0;
    lockResets = 0;
    dasTimerMs = 0;
    arrTimerMs = 0;
    return true;
  }

  function takeNextPiece(): TetrominoType | null {
    const [type, ...rest] = nextQueue;
    if (type === undefined) {
      return null;
    }
    const draw = drawBagPieces(bag, rngSeed, NEXT_QUEUE_SIZE - rest.length);
    bag = draw.bag;
    rngSeed = draw.rngSeed;
    nextQueue = [...rest, ...draw.pieces];
    return type;
  }

  for (const action of actions) {
    if (action === "pause") {
      return pauseGame(composeState());
    }
    if (locked || active === null) {
      break;
    }
    switch (action) {
      case "hold": {
        if (holdUsed) {
          break;
        }
        const activeType = active.type;
        const incoming = hold ?? takeNextPiece();
        if (incoming === null) {
          break;
        }
        hold = activeType;
        holdUsed = true;
        stats = { ...stats, holds: stats.holds + 1 };
        if (!spawnPiece(incoming)) {
          active = null;
          return topOut(composeState());
        }
        moved = true;
        break;
      }
      case "rotate-ccw":
      case "rotate-cw": {
        const rotation = tryRotate(
          board,
          active,
          action === "rotate-cw" ? 1 : -1,
        );
        if (rotation === null) {
          break;
        }
        active = rotation;
        rotated = true;
        stats = { ...stats, rotates: stats.rotates + 1 };
        break;
      }
      case "hard-drop": {
        const ghostY = getGhostY(board, active);
        hardDropCells += Math.max(ghostY - active.y, 0);
        active = { ...active, y: ghostY };
        locked = true;
        stats = { ...stats, hardDrops: stats.hardDrops + 1 };
        break;
      }
    }
  }

  if (!locked && active !== null) {
    const direction: HorizontalDirection =
      input.left === input.right ? 0 : input.right ? 1 : -1;
    if (direction === 0) {
      dasDirection = 0;
      dasTimerMs = 0;
      arrTimerMs = 0;
    } else if (direction !== dasDirection) {
      dasDirection = direction;
      dasTimerMs = 0;
      arrTimerMs = 0;
      const shifted = movePiece(active, direction, 0);
      if (canPlacePiece(board, shifted)) {
        active = shifted;
        moved = true;
        stats = { ...stats, moves: stats.moves + 1 };
      }
    } else {
      dasTimerMs += frameMs;
      if (dasTimerMs >= DAS_DELAY_MS) {
        arrTimerMs += frameMs;
        while (arrTimerMs >= ARR_REPEAT_MS) {
          arrTimerMs -= ARR_REPEAT_MS;
          const shifted = movePiece(active, direction, 0);
          if (!canPlacePiece(board, shifted)) {
            arrTimerMs = 0;
            break;
          }
          active = shifted;
          moved = true;
          stats = { ...stats, moves: stats.moves + 1 };
        }
      }
    }
  }

  if (!locked && active !== null) {
    const delayMs =
      getGravityDelayMs(stats.level) / (input.softDrop ? SOFT_DROP_FACTOR : 1);
    fallAccumulatorMs += frameMs;
    while (fallAccumulatorMs >= delayMs) {
      const dropped = movePiece(active, 0, 1);
      if (!canPlacePiece(board, dropped)) {
        break;
      }
      active = dropped;
      moved = true;
      fallAccumulatorMs -= delayMs;
      if (input.softDrop) {
        softDropCells += 1;
      }
    }
    if (!canPlacePiece(board, movePiece(active, 0, 1))) {
      fallAccumulatorMs = 0;
    }
  }

  if (!locked && active !== null) {
    const grounded = !canPlacePiece(board, movePiece(active, 0, 1));
    if (grounded) {
      if (moved || rotated) {
        if (lockResets < MAX_LOCK_RESETS) {
          lockTimerMs = 0;
          lockResets += 1;
        }
      }
      lockTimerMs += frameMs;
      if (lockTimerMs >= LOCK_DELAY_MS) {
        locked = true;
      }
    } else {
      lockTimerMs = 0;
    }
  }

  if (locked && active !== null) {
    board = lockCells(board, getPieceCells(active), active.type);
    const fullRows = findFullRows(board);
    clearedRows = fullRows.length;
    combo = clearedRows > 0 ? combo + 1 : 0;
    let award = 0;
    if (clearedRows > 0) {
      backToBackApplied = backToBack && clearedRows === 4;
      award += getLineClearAward(
        clearedRows,
        stats.level,
        backToBackApplied,
        option.multiplier,
      );
      award += getComboBonus(combo, stats.level, option.multiplier);
      backToBack = clearedRows === 4;
      board = clearRows(board, fullRows);
    }
    const lines = stats.lines + clearedRows;
    const level = option.startLevel + Math.floor(lines / LINES_PER_LEVEL);
    stats = {
      ...stats,
      lines,
      level,
      piecesLocked: stats.piecesLocked + 1,
      tetrises: stats.tetrises + (clearedRows === 4 ? 1 : 0),
      score:
        stats.score +
        award +
        getDropScore(softDropCells, "soft") +
        getDropScore(hardDropCells, "hard"),
    };
    holdUsed = false;
    const nextType = takeNextPiece();
    if (nextType === null || !spawnPiece(nextType)) {
      active = null;
      return topOut(composeState());
    }
  }

  if (clearedRows > 0) {
    message = getLineClearMessage(clearedRows, backToBackApplied, combo);
    if (stats.level > state.stats.level) {
      message += ` Level ${stats.level}.`;
    }
    messageTimerMs = MESSAGE_HOLD_MS;
  } else if (messageTimerMs <= 0) {
    message = IDLE_MESSAGE;
  }

  return composeState();
}
