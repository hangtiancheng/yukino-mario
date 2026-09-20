import type { ReactElement } from "react";

import type { GameAudioControls } from "@/hooks";

interface GameHeaderProps {
  audio: GameAudioControls;
}

export function GameHeader({ audio }: GameHeaderProps): ReactElement {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[0.6rem] font-black tracking-[0.36em] text-amber-300 uppercase">
          Original platform prototype
        </p>
        <h1 className="text-3xl leading-none font-black text-white uppercase sm:text-5xl">
          Yukino Mario
        </h1>
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-amber-100">
        <span className="hidden sm:inline">
          A/D move &middot; Space jump &middot; R restart
        </span>
        <button
          className="rounded-full border-2 border-amber-300 px-3 py-1 text-xs font-black tracking-[0.16em] text-amber-200 uppercase transition hover:bg-amber-300 hover:text-slate-950"
          onClick={audio.toggleEnabled}
          type="button"
        >
          {audio.statusLabel}
        </button>
      </div>
    </header>
  );
}
