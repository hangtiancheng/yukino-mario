import { useCallback, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent, RefObject } from "react";

import type { GameInput } from "@/types";
import { createIdleInput, setGameInputControl } from "@/utils";

export interface KeyboardInputControls {
  inputRef: RefObject<GameInput>;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onKeyUp: (event: KeyboardEvent<HTMLElement>) => void;
  reset: () => void;
}

export function useKeyboardInput(): KeyboardInputControls {
  const inputRef = useRef<GameInput>(createIdleInput());

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>): void => {
    if (isGameKey(event.code)) {
      event.preventDefault();
      inputRef.current = updateInput(inputRef.current, event.code, true);
    }
  }, []);

  const onKeyUp = useCallback((event: KeyboardEvent<HTMLElement>): void => {
    if (isGameKey(event.code)) {
      event.preventDefault();
      inputRef.current = updateInput(inputRef.current, event.code, false);
    }
  }, []);

  const reset = useCallback((): void => {
    inputRef.current = createIdleInput();
  }, []);

  const onBlur = useCallback((): void => {
    inputRef.current = createIdleInput();
  }, []);

  useEffect((): (() => void) => {
    function handleGlobalKeyUp(event: globalThis.KeyboardEvent): void {
      if (isGameKey(event.code)) {
        inputRef.current = updateInput(inputRef.current, event.code, false);
      }
    }
    window.addEventListener("keyup", handleGlobalKeyUp);
    return (): void => {
      window.removeEventListener("keyup", handleGlobalKeyUp);
    };
  }, []);

  return useMemo(
    (): KeyboardInputControls => ({
      inputRef,
      onBlur,
      onKeyDown,
      onKeyUp,
      reset,
    }),
    [onBlur, onKeyDown, onKeyUp, reset],
  );
}

function updateInput(
  current: GameInput,
  code: string,
  pressed: boolean,
): GameInput {
  switch (code) {
    case "ArrowLeft":
    case "KeyA":
      return setGameInputControl(current, "left", pressed);
    case "ArrowRight":
    case "KeyD":
      return setGameInputControl(current, "right", pressed);
    case "ArrowUp":
    case "Space":
    case "KeyW":
      return setGameInputControl(current, "jump", pressed);
    case "KeyR":
      return setGameInputControl(current, "restart", pressed);
    default:
      return current;
  }
}

function isGameKey(code: string): boolean {
  switch (code) {
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "Space":
    case "KeyA":
    case "KeyD":
    case "KeyW":
    case "KeyR":
      return true;
    default:
      return false;
  }
}
