import { describe, expect, it } from "vitest";

import { difficultyOptions } from "@/constants";
import type { Difficulty } from "@/schema";
import type { DifficultyOption } from "@/constants";

function getOption(difficulty: Difficulty): DifficultyOption {
  const option = difficultyOptions.find(
    (candidate): boolean => candidate.difficulty === difficulty,
  );
  if (option === undefined) {
    throw new Error(`Missing ${difficulty} difficulty option.`);
  }
  return option;
}

describe("difficultyOptions", (): void => {
  it("defines gameplay profile values for every difficulty", (): void => {
    for (const option of difficultyOptions) {
      expect(option.enemySpeedScale).toBeGreaterThan(0);
      expect(option.platformSpeedScale).toBeGreaterThan(0);
      expect(option.cameraEase).toBeGreaterThan(0);
    }
  });

  it("increases enemy pressure as difficulty rises", (): void => {
    expect(getOption("medium").enemySpeedScale).toBeGreaterThan(
      getOption("low").enemySpeedScale,
    );
    expect(getOption("high").enemySpeedScale).toBeGreaterThan(
      getOption("medium").enemySpeedScale,
    );
    expect(getOption("hell").enemySpeedScale).toBeGreaterThan(
      getOption("high").enemySpeedScale,
    );
  });

  it("keeps platform pacing monotonic across difficulties", (): void => {
    expect(getOption("medium").platformSpeedScale).toBeGreaterThanOrEqual(
      getOption("low").platformSpeedScale,
    );
    expect(getOption("high").platformSpeedScale).toBeGreaterThanOrEqual(
      getOption("medium").platformSpeedScale,
    );
    expect(getOption("hell").platformSpeedScale).toBeGreaterThanOrEqual(
      getOption("high").platformSpeedScale,
    );
  });
});
