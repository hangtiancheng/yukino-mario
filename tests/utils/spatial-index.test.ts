import { describe, expect, it } from "vitest";

import type { Platform } from "@/types";
import {
  buildPlatformIndex,
  getPlatformsInRange,
  lowerBoundByX,
} from "@/utils/spatial-index";

function makePlatform(id: string, x: number, width: number = 64): Platform {
  return { height: 16, id, tone: "mario", width, x, y: 0 };
}

describe("buildPlatformIndex", (): void => {
  it("returns an empty index for an empty input", (): void => {
    const index = buildPlatformIndex([]);
    expect(index.sorted).toHaveLength(0);
    expect(index.maxWidth).toBe(0);
  });

  it("sorts platforms by ascending x and tracks max width", (): void => {
    const index = buildPlatformIndex([
      makePlatform("c", 200, 32),
      makePlatform("a", 0, 64),
      makePlatform("b", 100, 128),
    ]);
    expect(index.sorted.map((p) => p.id)).toStrictEqual(["a", "b", "c"]);
    expect(index.maxWidth).toBe(128);
  });

  it("does not mutate the source array", (): void => {
    const source = [makePlatform("c", 200), makePlatform("a", 0)];
    const sourceIds = source.map((p) => p.id);
    buildPlatformIndex(source);
    expect(source.map((p) => p.id)).toStrictEqual(sourceIds);
  });
});

describe("lowerBoundByX", (): void => {
  it("returns 0 for a target smaller than every element", (): void => {
    const index = buildPlatformIndex([
      makePlatform("a", 100),
      makePlatform("b", 200),
    ]);
    expect(lowerBoundByX(index.sorted, -50)).toBe(0);
  });

  it("returns length for a target greater than every element", (): void => {
    const index = buildPlatformIndex([
      makePlatform("a", 100),
      makePlatform("b", 200),
    ]);
    expect(lowerBoundByX(index.sorted, 999)).toBe(2);
  });

  it("returns the first index whose x is >= target (exact match)", (): void => {
    const index = buildPlatformIndex([
      makePlatform("a", 0),
      makePlatform("b", 100),
      makePlatform("c", 200),
    ]);
    expect(lowerBoundByX(index.sorted, 100)).toBe(1);
  });

  it("returns the first index whose x is >= target (between values)", (): void => {
    const index = buildPlatformIndex([
      makePlatform("a", 0),
      makePlatform("b", 100),
      makePlatform("c", 200),
    ]);
    expect(lowerBoundByX(index.sorted, 50)).toBe(1);
    expect(lowerBoundByX(index.sorted, 150)).toBe(2);
  });
});

describe("getPlatformsInRange", (): void => {
  it("returns an empty array when the index is empty", (): void => {
    expect(getPlatformsInRange(buildPlatformIndex([]), 0, 100)).toHaveLength(0);
  });

  it("returns only platforms whose AABB overlaps the window", (): void => {
    const index = buildPlatformIndex([
      makePlatform("a", 0, 64),
      makePlatform("b", 200, 64),
      makePlatform("c", 400, 64),
      makePlatform("d", 800, 64),
    ]);
    const result = getPlatformsInRange(index, 180, 420);
    expect(result.map((p) => p.id)).toStrictEqual(["b", "c"]);
  });

  it("includes a wide platform that starts before the window but reaches in", (): void => {
    const index = buildPlatformIndex([
      makePlatform("wide", 0, 500),
      makePlatform("near", 600, 64),
    ]);
    const result = getPlatformsInRange(index, 400, 700);
    expect(result.map((p) => p.id)).toStrictEqual(["wide", "near"]);
  });

  it("excludes platforms whose right edge is just before the window", (): void => {
    const index = buildPlatformIndex([
      makePlatform("left", 0, 64),
      makePlatform("hit", 100, 64),
    ]);
    const result = getPlatformsInRange(index, 65, 200);
    expect(result.map((p) => p.id)).toStrictEqual(["hit"]);
  });

  it("stops scanning once x exceeds the right boundary", (): void => {
    const index = buildPlatformIndex([
      makePlatform("a", 0, 32),
      makePlatform("b", 100, 32),
      makePlatform("c", 1_000, 32),
    ]);
    const result = getPlatformsInRange(index, -50, 200);
    expect(result.map((p) => p.id)).toStrictEqual(["a", "b"]);
  });
});
