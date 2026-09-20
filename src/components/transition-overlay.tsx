import type { ReactElement } from "react";

import type { GamePhase } from "@/types";

type TransitionPhase = Exclude<GamePhase, "running">;

interface TransitionOverlayProps {
  phase: TransitionPhase;
  message: string;
  onRestart: () => void;
}

export function TransitionOverlay({
  phase,
  message,
  onRestart,
}: TransitionOverlayProps): ReactElement {
  return (
    <div
      aria-label={getTitle(phase)}
      aria-modal="true"
      className={`absolute inset-0 grid place-items-center px-6 text-center backdrop-blur-sm ${getBackdropClass(phase)}`}
      role="dialog"
    >
      <div
        className={`max-w-lg rounded-4xl border-8 border-slate-950 p-8 shadow-[10px_10px_0_rgb(15_23_42)] ${getPanelClass(phase)}`}
      >
        <p className="text-sm font-black tracking-[0.32em] text-slate-600 uppercase">
          {getEyebrow(phase)}
        </p>
        <h2 className="mt-3 text-4xl leading-none font-black text-slate-950 uppercase sm:text-5xl">
          {getTitle(phase)}
        </h2>
        <p className="mt-4 text-base font-bold text-slate-700">{message}</p>
        <button
          className="mt-6 rounded-full border-4 border-slate-950 bg-red-500 px-7 py-3 text-sm font-black tracking-[0.24em] text-white uppercase shadow-[6px_6px_0_rgb(15_23_42)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_rgb(15_23_42)]"
          onClick={onRestart}
          type="button"
        >
          {getActionLabel(phase)}
        </button>
      </div>
    </div>
  );
}

function getBackdropClass(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "bg-slate-950/50";
    case "lost":
      return "bg-rose-950/55";
  }
}

function getPanelClass(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "bg-amber-100";
    case "lost":
      return "bg-rose-100";
  }
}

function getEyebrow(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "Yukino Mario";
    case "lost":
      return "Failure sequence";
  }
}

function getTitle(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "Ready?";
    case "lost":
      return "Game Over";
  }
}

function getActionLabel(phase: TransitionPhase): string {
  return phase === "ready" ? "Reset" : "Play Again";
}
