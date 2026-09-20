/// <reference types="vite/client" />

import { MemoryRouter } from "react-router";
import type { Decorator, Preview } from "@storybook/react-vite";
import type { ReactElement } from "react";

import "../src/index.css";

const withArcadeFrame: Decorator = (Story): ReactElement => (
  <MemoryRouter>
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Story />
      </div>
    </div>
  </MemoryRouter>
);

const preview: Preview = {
  decorators: [withArcadeFrame],
  parameters: {
    a11y: {
      test: "error",
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "region", enabled: false },
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa"],
        },
      },
    },
    backgrounds: {
      default: "arcade night",
      values: [{ name: "arcade night", value: "#020617" }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
