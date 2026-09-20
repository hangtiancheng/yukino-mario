import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

import type { GameStats } from "@/types";
import type { Difficulty } from "@/schema";
import { useReducedMotion } from "@/hooks";

interface GameHudProps {
  difficulty: Difficulty;
  stats: GameStats;
}

export function GameHud({ difficulty, stats }: GameHudProps): ReactElement {
  const displayedScore = useAnimatedScore(stats.score);
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 rounded-2xl border-2 border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-black tracking-[0.18em] uppercase">
      <HudItem
        label="Score"
        value={displayedScore.toString().padStart(5, "0")}
      />
      <HudItem label="Dist" value={`${Math.floor(stats.distance)}m`} />
      <HudItem label="Coins" value={stats.coinsCollected.toString()} />
      <HudItem label="Lives" value={stats.lives.toString()} />
      <HudItem label={difficulty} value={formatTime(stats.elapsedMs)} />
    </div>
  );
}

function useAnimatedScore(score: number): number {
  const reducedMotion = useReducedMotion();
  const previousScoreRef = useRef<number>(score);
  const [displayedScore, setDisplayedScore] = useState<number>(score);

  useEffect((): (() => void) | undefined => {
    if (reducedMotion) {
      previousScoreRef.current = score;
      return undefined;
    }
    const tweenState = { value: previousScoreRef.current };
    const tween = gsap.to(tweenState, {
      duration: 0.35,
      ease: "power2.out",
      onComplete: (): void => {
        previousScoreRef.current = score;
        setDisplayedScore(score);
      },
      onUpdate: (): void => {
        setDisplayedScore(Math.floor(tweenState.value));
      },
      value: score,
    });
    return (): void => {
      previousScoreRef.current = score;
      tween.kill();
    };
  }, [reducedMotion, score]);

  return reducedMotion ? score : displayedScore;
}

interface HudItemProps {
  label: string;
  value: string;
}

function HudItem({ label, value }: HudItemProps): ReactElement {
  return (
    <span className="text-amber-100">
      <span className="text-amber-400/70">{label} </span>
      {value}
    </span>
  );
}

function formatTime(elapsedMs: number): string {
  return Math.floor(elapsedMs / 1_000)
    .toString()
    .padStart(3, "0");
}
