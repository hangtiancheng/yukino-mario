import type { Difficulty } from "@/schema";
import {
  BREAKABLE_SCORE,
  COIN_SCORE,
  ENEMY_SCORE,
  getDifficultyOption,
} from "@/constants";

export interface ScoreInput {
  marioBroken: number;
  coinsCollected: number;
  difficulty: Difficulty;
  distance: number;
  stompedEnemies: number;
}

export interface ScoreBreakdown {
  baseScore: number;
  breakableScore: number;
  coinScore: number;
  distanceScore: number;
  enemyScore: number;
}

export function getRunDistance(playerX: number, spawnX: number): number {
  return Math.max(playerX - spawnX, 0);
}

export function getScoreBreakdown(input: ScoreInput): ScoreBreakdown {
  const distanceScore = input.distance;
  const coinScore = input.coinsCollected * COIN_SCORE;
  const enemyScore = input.stompedEnemies * ENEMY_SCORE;
  const breakableScore = input.marioBroken * BREAKABLE_SCORE;
  return {
    baseScore: distanceScore + coinScore + enemyScore + breakableScore,
    breakableScore,
    coinScore,
    distanceScore,
    enemyScore,
  };
}

export function getWeightedScore(input: ScoreInput): number {
  const option = getDifficultyOption(input.difficulty);
  const breakdown = getScoreBreakdown(input);
  return Math.floor(breakdown.baseScore * option.multiplier);
}
