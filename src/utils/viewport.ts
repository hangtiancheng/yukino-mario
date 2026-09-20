import { VIEWPORT_WIDTH } from "@/constants";
import type { Rect } from "@/types";

export interface ViewportBounds {
  left: number;
  right: number;
}

export function getViewportBounds(
  cameraX: number,
  margin: number = 96,
): ViewportBounds {
  return {
    left: cameraX - margin,
    right: cameraX + VIEWPORT_WIDTH + margin,
  };
}

export function filterVisibleRects<T extends Rect>(
  rects: T[],
  cameraX: number,
  margin: number = 96,
): T[] {
  const bounds = getViewportBounds(cameraX, margin);
  const visibleRects: T[] = [];
  for (const rect of rects) {
    if (isRectVisible(rect, bounds)) {
      visibleRects.push(rect);
    }
  }
  return visibleRects;
}

export function isRectVisible(rect: Rect, bounds: ViewportBounds): boolean {
  return rect.x + rect.width >= bounds.left && rect.x <= bounds.right;
}
