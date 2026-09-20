import type { GameInput } from "@/types";

export type GameInputControl = "jump" | "left" | "restart" | "right";

export function createIdleInput(): GameInput {
  return { left: false, right: false, jump: false, restart: false };
}

export function setGameInputControl(
  current: GameInput,
  control: GameInputControl,
  pressed: boolean,
): GameInput {
  switch (control) {
    case "left":
      return { ...current, left: pressed };
    case "right":
      return { ...current, right: pressed };
    case "jump":
      return { ...current, jump: pressed };
    case "restart":
      return { ...current, restart: pressed };
  }
}
