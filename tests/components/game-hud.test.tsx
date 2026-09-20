import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GameHud } from "@/components/game-hud";
import type { GameStats } from "@/types";

interface TweenTarget {
  value: number;
}

interface TweenConfig {
  onComplete: () => void;
  onUpdate: () => void;
  value: number;
}

interface RecordedTween {
  config: TweenConfig;
  killed: boolean;
  kill: () => void;
  target: TweenTarget;
}

const gsapMock = vi.hoisted((): { records: RecordedTween[] } => ({
  records: [],
}));

vi.mock("gsap", () => ({
  gsap: {
    set(): void {},
    to(target: TweenTarget, config: TweenConfig): { kill: () => void } {
      const tween: RecordedTween = {
        config,
        killed: false,
        kill(): void {
          tween.killed = true;
        },
        target,
      };
      gsapMock.records.push(tween);
      return { kill: tween.kill };
    },
  },
}));

function makeStats(score: number): GameStats {
  return {
    marioBroken: 1,
    coinsCollected: 2,
    distance: 300,
    elapsedMs: 1_000,
    lives: 3,
    score,
    stompedEnemies: 1,
  };
}

function getLatestTween(): RecordedTween {
  const tween = gsapMock.records.at(-1);
  if (tween === undefined) {
    throw new Error("expected a tween");
  }
  return tween;
}

describe("GameHud", (): void => {
  beforeEach((): void => {
    gsapMock.records.length = 0;
  });

  it("animates score changes through the score card", (): void => {
    const { rerender } = render(
      <GameHud difficulty="medium" stats={makeStats(100)} />,
    );
    expect(screen.getByText("00100")).toBeInTheDocument();
    rerender(<GameHud difficulty="medium" stats={makeStats(350)} />);
    const tween = getLatestTween();
    act((): void => {
      tween.target.value = 350;
      tween.config.onUpdate();
      tween.config.onComplete();
    });
    expect(screen.getByText("00350")).toBeInTheDocument();
  });

  it("snaps to the target score when a tween is interrupted", (): void => {
    const { rerender } = render(
      <GameHud difficulty="medium" stats={makeStats(100)} />,
    );
    const firstTween = getLatestTween();
    act((): void => {
      firstTween.target.value = 140;
      firstTween.config.onUpdate();
    });
    expect(screen.getByText("00140")).toBeInTheDocument();
    rerender(<GameHud difficulty="medium" stats={makeStats(350)} />);
    expect(firstTween.killed).toBe(true);
    expect(getLatestTween().target.value).toBe(100);
  });
});
