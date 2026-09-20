import {
  atomWithStorage,
  createJSONStorage,
  unstable_withStorageValidator,
} from "jotai/utils";

import {
  difficultySchema,
  gameRendererKindSchema,
  leaderboardSchema,
  playerNameSchema,
} from "@/schema";
import type { Difficulty, LeaderboardEntry, PlayerName } from "@/schema";
import type { GameRendererKind } from "@/types";

const leaderboardStorage =
  unstable_withStorageValidator<LeaderboardEntry[]>(isLeaderboard)(
    createJSONStorage<unknown>(),
  );
const difficultyStorage =
  unstable_withStorageValidator<Difficulty>(isDifficulty)(
    createJSONStorage<unknown>(),
  );
const rendererStorage =
  unstable_withStorageValidator<GameRendererKind>(isRendererKind)(
    createJSONStorage<unknown>(),
  );
const playerNameStorage =
  unstable_withStorageValidator<PlayerName>(isPlayerName)(
    createJSONStorage<unknown>(),
  );

export const leaderboardAtom = atomWithStorage<LeaderboardEntry[]>(
  "yukino-mario-leaderboard",
  [],
  leaderboardStorage,
  { getOnInit: true },
);
export const difficultyAtom = atomWithStorage<Difficulty>(
  "yukino-mario-difficulty",
  "medium",
  difficultyStorage,
  { getOnInit: true },
);
export const rendererKindAtom = atomWithStorage<GameRendererKind>(
  "yukino-mario-renderer",
  "dom",
  rendererStorage,
  { getOnInit: true },
);
export const playerNameAtom = atomWithStorage<PlayerName>(
  "yukino-mario-player-name",
  "Runner",
  playerNameStorage,
  { getOnInit: true },
);

export function createLeaderboardEntry(
  playerName: string,
  score: number,
  distance: number,
  difficulty: Difficulty,
): LeaderboardEntry {
  const createdAt = new Date().toISOString();
  const safePlayerName = playerNameSchema.parse(playerName);
  return {
    createdAt,
    difficulty,
    distance,
    id: `${createdAt}-${score}`,
    playerName: safePlayerName,
    score,
  };
}

export function insertLeaderboardEntry(
  entries: LeaderboardEntry[],
  entry: LeaderboardEntry,
): LeaderboardEntry[] {
  const nextEntries = [...entries, entry];
  nextEntries.sort(
    (first, second): number =>
      second.score - first.score || second.distance - first.distance,
  );
  return nextEntries.slice(0, 10);
}

function isLeaderboard(value: unknown): value is LeaderboardEntry[] {
  return leaderboardSchema.safeParse(value).success;
}

function isDifficulty(value: unknown): value is Difficulty {
  return difficultySchema.safeParse(value).success;
}

function isRendererKind(value: unknown): value is GameRendererKind {
  return gameRendererKindSchema.safeParse(value).success;
}

function isPlayerName(value: unknown): value is PlayerName {
  return playerNameSchema.safeParse(value).success;
}
