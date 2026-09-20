import { useAtom } from "jotai";
import type { ChangeEvent, ReactElement } from "react";

import { playerNameSchema } from "@/schema";
import { playerNameAtom } from "@/stores";

export function PlayerNameField(): ReactElement {
  const [playerName, setPlayerName] = useAtom(playerNameAtom);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const result = playerNameSchema.safeParse(event.target.value);
    if (result.success) {
      setPlayerName(result.data);
    }
  }

  return (
    <label className="block rounded-2xl border-2 border-sky-300/60 bg-slate-900 p-3">
      <span className="text-[0.6rem] font-black tracking-[0.3em] text-sky-200 uppercase">
        Player name
      </span>
      <input
        aria-describedby="player-name-help"
        className="mt-2 w-full rounded-lg border border-sky-300/40 bg-slate-950 px-3 py-1.5 text-xs font-black tracking-[0.14em] text-sky-50 uppercase outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
        maxLength={16}
        onChange={handleChange}
        type="text"
        value={playerName}
      />
      <span
        className="mt-1 block text-[0.6rem] font-bold text-sky-100/60"
        id="player-name-help"
      >
        1-16 letters, numbers, spaces, dashes, or underscores.
      </span>
    </label>
  );
}
