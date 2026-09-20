import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { GameStatsHud } from "@/components/game-stats-hud";
import type { GameSimulation } from "@/hooks";
import type { GameState } from "@/types";

function makeState(): GameState {
  return {
    cameraX: 0,
    coins: [],
    difficulty: "medium",
    enemies: [],
    level: {
      coins: [],
      enemies: [],
      height: 540,
      id: "demo",
      name: "Demo",
      platforms: [],
      spawn: { x: 0, y: 0 },
      summary: "",
      width: 1_000,
    },
    message: "Ready",
    messageTimerMs: 0,
    nextParticleId: 0,
    nextSegmentIndex: 1,
    particles: [],
    phase: "ready",
    platforms: [],
    player: {
      coyoteMs: 0,
      facing: 1,
      grounded: true,
      height: 48,
      invulnerableMs: 0,
      jumpBufferMs: 0,
      jumpHeld: false,
      velocity: { x: 0, y: 0 },
      width: 34,
      x: 0,
      y: 0,
    },
    prunedUntilX: 0,
    stats: {
      marioBroken: 1,
      coinsCollected: 4,
      distance: 123,
      elapsedMs: 12_500,
      lives: 3,
      score: 4_321,
      stompedEnemies: 2,
    },
    worldWidth: 1_000,
  };
}

function StubHost(): ReactElement {
  const stateRef = useRef<GameState>(makeState());
  const simulation: GameSimulation = {
    getSnapshot: (): GameState => stateRef.current,
    reset: (): void => undefined,
    restart: (): void => undefined,
    stateRef,
    subscribe: (): (() => void) => (): void => undefined,
  };
  return <GameStatsHud simulation={simulation} />;
}

describe("GameStatsHud", (): void => {
  it("renders score, distance, coins, lives, and difficulty cards", (): void => {
    render(<StubHost />);
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("04321")).toBeInTheDocument();
    expect(screen.getByText("123m")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });
});
