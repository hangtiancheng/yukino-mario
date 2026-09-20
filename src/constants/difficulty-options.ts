import type { Difficulty } from "@/schema";

export interface DifficultyOption {
  cameraEase: number;
  difficulty: Difficulty;
  enemyCountScale: number;
  enemyJitterScale: number;
  enemySpeedScale: number;
  label: string;
  lives: number;
  multiplier: number;
  platformSpeedScale: number;
  summary: string;
}

const mediumOption: DifficultyOption = {
  cameraEase: 8,
  difficulty: "medium",
  enemyCountScale: 1,
  enemyJitterScale: 1,
  enemySpeedScale: 1,
  label: "Medium",
  lives: 3,
  multiplier: 1.5,
  platformSpeedScale: 1,
  summary: "Balanced arcade pacing with standard hazard timing.",
};

export const difficultyOptions: DifficultyOption[] = [
  {
    cameraEase: 6,
    difficulty: "low",
    enemyCountScale: 0.7,
    enemyJitterScale: 0.5,
    enemySpeedScale: 0.85,
    label: "Low",
    lives: 5,
    multiplier: 1,
    platformSpeedScale: 0.9,
    summary: "Relaxed run with fewer, slower hazards and extra lives.",
  },
  mediumOption,
  {
    cameraEase: 10,
    difficulty: "high",
    enemyCountScale: 1.6,
    enemyJitterScale: 1.4,
    enemySpeedScale: 1.18,
    label: "High",
    lives: 2,
    multiplier: 2,
    platformSpeedScale: 1.12,
    summary: "More enemies, wider patrol variance, sharper risk.",
  },
  {
    cameraEase: 13,
    difficulty: "hell",
    enemyCountScale: 2.2,
    enemyJitterScale: 1.8,
    enemySpeedScale: 1.38,
    label: "Hell",
    lives: 1,
    multiplier: 3,
    platformSpeedScale: 1.25,
    summary: "Swarms of unpredictable hazards. One mistake ends everything.",
  },
];

export function getDifficultyOption(difficulty: Difficulty): DifficultyOption {
  for (const option of difficultyOptions) {
    if (option.difficulty === difficulty) {
      return option;
    }
  }
  return mediumOption;
}
