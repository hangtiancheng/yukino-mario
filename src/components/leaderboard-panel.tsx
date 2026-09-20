import type { ReactElement } from "react";

import type { LeaderboardEntry } from "@/schema";

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardPanel({
  entries,
}: LeaderboardPanelProps): ReactElement {
  return (
    <section className="rounded-2xl border-2 border-yellow-300/60 bg-slate-900 p-3 text-yellow-50">
      <p className="text-[0.6rem] font-black tracking-[0.3em] text-yellow-200 uppercase">
        Top scores
      </p>
      <div className="mt-2 grid gap-1">
        {entries.length === 0 ? (
          <p className="text-xs font-bold text-yellow-100/60">
            No runs recorded yet.
          </p>
        ) : (
          entries.map(
            (entry: LeaderboardEntry, index: number): ReactElement => (
              <LeaderboardRow entry={entry} index={index} key={entry.id} />
            ),
          )
        )}
      </div>
    </section>
  );
}

function LeaderboardRow({
  entry,
  index,
}: {
  entry: LeaderboardEntry;
  index: number;
}): ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-yellow-300/30 bg-slate-950 px-3 py-1.5 text-xs font-black">
      <span className="w-6 text-yellow-300">#{index + 1}</span>
      <span className="flex-1 truncate tracking-widest uppercase">
        {entry.playerName}
      </span>
      <span className="tracking-widest text-yellow-100/60 uppercase">
        {entry.difficulty}
      </span>
      <span>
        {entry.score.toLocaleString()} &middot; {Math.floor(entry.distance)}m
      </span>
    </div>
  );
}
