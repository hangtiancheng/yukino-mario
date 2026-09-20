import type { Meta, StoryObj } from "@storybook/react-vite";

import { GameHud } from "@/components/game-hud";

const meta: Meta<typeof GameHud> = {
  args: {
    difficulty: "medium",
    stats: {
      marioBroken: 1,
      coinsCollected: 3,
      distance: 880,
      elapsedMs: 42_000,
      lives: 3,
      score: 1_320,
      stompedEnemies: 1,
    },
  },
  component: GameHud,
  title: "Game/GameHud",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const EarlyRun: Story = {};

export const HighScoreRun: Story = {
  args: {
    difficulty: "hell",
    stats: {
      marioBroken: 6,
      coinsCollected: 18,
      distance: 4_200,
      elapsedMs: 164_000,
      lives: 1,
      score: 12_600,
      stompedEnemies: 8,
    },
  },
};
