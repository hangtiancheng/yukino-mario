import { MESSAGE_HOLD_MS } from "@/constants";
import type { GameInput, GameState } from "@/types";

export const IDLE_MESSAGE = "Clear lines to score. Space hard drops.";

const LINE_CLEAR_LABELS: readonly string[] = [
  "",
  "Single.",
  "Double!",
  "Triple!",
  "TETRIS!",
];

export function startGame(state: GameState): GameState {
  return {
    ...state,
    phase: "running",
    message: "Stack the falling tetrominoes. Clear full rows to score.",
    messageTimerMs: MESSAGE_HOLD_MS,
  };
}

export function pauseGame(state: GameState): GameState {
  return {
    ...state,
    phase: "paused",
    message: "Paused. Press P to resume.",
    messageTimerMs: 0,
  };
}

export function resumeGame(state: GameState): GameState {
  return {
    ...state,
    phase: "running",
    message: "Back to the stack.",
    messageTimerMs: MESSAGE_HOLD_MS,
  };
}

export function topOut(state: GameState): GameState {
  return {
    ...state,
    phase: "lost",
    message: "Top out. Press R to restart.",
    messageTimerMs: 0,
  };
}

export function hasStartInput(input: GameInput): boolean {
  return (
    input.left ||
    input.right ||
    input.softDrop ||
    input.actions.some((action): boolean => action !== "pause")
  );
}

export function getLineClearMessage(
  clearedRows: number,
  backToBackApplied: boolean,
  combo: number,
): string {
  let message = LINE_CLEAR_LABELS[clearedRows] ?? "Lines cleared.";
  if (clearedRows === 4 && backToBackApplied) {
    message = "Back-to-back TETRIS!";
  }
  if (combo > 1) {
    message += ` Combo x${combo}.`;
  }
  return message;
}
