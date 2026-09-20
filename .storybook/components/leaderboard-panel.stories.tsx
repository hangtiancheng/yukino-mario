import type { Meta, StoryObj } from "@storybook/react-vite";

import type { LeaderboardEntry } from "@/schema";
import { LeaderboardPanel } from "@/components/leaderboard-panel";

const entries: LeaderboardEntry[] = [
  {
    createdAt: "2026-05-15T00:00:00.000Z",
    difficulty: "hell",
    distance: 3_420,
    id: "run-one",
    playerName: "Runner",
    score: 10_260,
  },
  {
    createdAt: "2026-05-15T00:05:00.000Z",
    difficulty: "high",
    distance: 2_240,
    id: "run-two",
    playerName: "Runner",
    score: 4_480,
  },
  {
    createdAt: "2026-05-15T00:10:00.000Z",
    difficulty: "medium",
    distance: 1_850,
    id: "run-three",
    playerName: "Runner",
    score: 2_775,
  },
];

const meta: Meta<typeof LeaderboardPanel> = {
  args: { entries: [] },
  component: LeaderboardPanel,
  title: "Panels/LeaderboardPanel",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithEntries: Story = {
  args: { entries },
};
