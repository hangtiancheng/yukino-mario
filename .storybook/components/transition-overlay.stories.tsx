import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import { TransitionOverlay } from "@/components/transition-overlay";

function handleRestart(): void {}

const meta: Meta<typeof TransitionOverlay> = {
  args: {
    message: "Press movement keys to begin the run.",
    onRestart: handleRestart,
    phase: "ready",
  },
  component: TransitionOverlay,
  decorators: [
    (Story): ReactElement => (
      <div className="relative h-135 w-240 max-w-full overflow-hidden rounded-4xl bg-linear-to-b from-sky-400 via-cyan-200 to-amber-100">
        <Story />
      </div>
    ),
  ],
  title: "Game/TransitionOverlay",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Lost: Story = {
  args: { message: "Game over. Press R to restart.", phase: "lost" },
};
