import clsx from "clsx";
import type { ReactElement } from "react";

import { difficultyOptions } from "@/constants";
import type { DifficultyOption } from "@/constants";
import type { Difficulty } from "@/schema";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({
  difficulty,
  onChange,
}: DifficultySelectorProps): ReactElement {
  return (
    <div className="rounded-2xl border-2 border-red-300/60 bg-slate-900 p-3">
      <p className="mb-2 text-[0.6rem] font-black tracking-[0.3em] text-red-200 uppercase">
        Difficulty
      </p>
      <div className="grid grid-cols-2 gap-2">
        {difficultyOptions.map((option: DifficultyOption): ReactElement => (
          <button
            aria-pressed={option.difficulty === difficulty}
            className={getButtonClass(option.difficulty === difficulty)}
            key={option.difficulty}
            onClick={(): void => onChange(option.difficulty)}
            type="button"
          >
            <span className="text-xs font-black tracking-[0.14em] uppercase">
              {option.label}
            </span>
            <span className="ml-1 text-[0.6rem] font-bold opacity-70">
              x{option.multiplier} &middot; {option.lives}hp
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getButtonClass(active: boolean): string {
  return clsx(
    "rounded-lg border px-3 py-1.5 text-left transition",
    active
      ? "border-red-300 bg-red-300 text-slate-950"
      : "border-red-300/40 text-red-100 hover:bg-red-300/20",
  );
}
