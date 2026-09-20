import clsx from "clsx";
import type { ReactElement } from "react";

import type { GameRendererKind } from "@/types";

interface RendererOption {
  label: string;
  value: GameRendererKind;
}

interface RendererSelectorProps {
  selectedRenderer: GameRendererKind;
  onChange: (rendererKind: GameRendererKind) => void;
}

const rendererOptions: RendererOption[] = [
  { label: "DOM", value: "dom" },
  { label: "Pixi", value: "pixi" },
];

export function RendererSelector({
  selectedRenderer,
  onChange,
}: RendererSelectorProps): ReactElement {
  return (
    <div className="rounded-2xl border-2 border-violet-300/60 bg-slate-900 p-3">
      <p className="mb-2 text-[0.6rem] font-black tracking-[0.3em] text-violet-200 uppercase">
        Renderer
      </p>
      <div className="flex gap-2">
        {rendererOptions.map((option: RendererOption): ReactElement => (
          <button
            className={clsx(
              "rounded-lg border px-3 py-1.5 text-xs font-black tracking-[0.14em] uppercase transition",
              option.value === selectedRenderer
                ? "border-violet-300 bg-violet-300 text-slate-950"
                : "border-violet-300/40 text-violet-100 hover:bg-violet-300/20",
            )}
            key={option.value}
            onClick={(): void => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
