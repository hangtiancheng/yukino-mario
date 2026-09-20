import clsx from "clsx";
import { useState } from "react";
import type { PointerEvent, ReactElement, RefObject } from "react";

import type { GameInput } from "@/types";
import { setGameInputControl } from "@/utils";
import type { GameInputControl } from "@/utils";

interface TouchControlsProps {
  inputRef: RefObject<GameInput>;
  onRestart: () => void;
  visible?: boolean;
}

export function TouchControls({
  inputRef,
  onRestart,
  visible = true,
}: TouchControlsProps): ReactElement {
  return (
    <div
      className={clsx(
        "pointer-events-none fixed inset-x-0 bottom-4 z-20 flex items-end justify-between px-4 transition-opacity sm:hidden",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="pointer-events-auto flex gap-3">
        <TouchButton control="left" inputRef={inputRef} label="Left" />
        <TouchButton control="right" inputRef={inputRef} label="Right" />
      </div>
      <div className="pointer-events-auto flex gap-3">
        <button
          aria-label="Restart run"
          className={buttonClass("bg-slate-800")}
          onClick={onRestart}
          type="button"
        >
          R
        </button>
        <TouchButton
          control="jump"
          inputRef={inputRef}
          label="Jump"
          prominent
        />
      </div>
    </div>
  );
}

function TouchButton({
  control,
  inputRef,
  label,
  prominent = false,
}: TouchButtonProps): ReactElement {
  const [pressed, setPressedState] = useState<boolean>(false);

  function setPressed(
    event: PointerEvent<HTMLButtonElement>,
    nextPressed: boolean,
  ): void {
    event.preventDefault();
    if (nextPressed) {
      event.currentTarget.setPointerCapture(event.pointerId);
    } else if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    inputRef.current = setGameInputControl(
      inputRef.current,
      control,
      nextPressed,
    );
    setPressedState(nextPressed);
  }

  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={buttonClass(
        prominent ? "bg-red-500" : "bg-amber-300 text-slate-950",
      )}
      onPointerCancel={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, false)
      }
      onPointerDown={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, true)
      }
      onPointerLeave={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, false)
      }
      onPointerUp={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, false)
      }
      type="button"
    >
      {label}
    </button>
  );
}

interface TouchButtonProps {
  control: GameInputControl;
  inputRef: RefObject<GameInput>;
  label: string;
  prominent?: boolean;
}

function buttonClass(tone: string): string {
  return clsx(
    "h-16 min-w-16 touch-none rounded-2xl border-4 border-slate-950 px-4 text-sm font-black uppercase shadow-[5px_5px_0_rgb(15_23_42)] focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none",
    tone,
  );
}
