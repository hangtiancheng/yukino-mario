import type { Graphics } from "pixi.js";

// Traces a rect whose top corners are rounded (CSS rounded-t-*).
// With radius = min(width / 2, height) it becomes a dome (rounded-t-full).
export function traceTopRoundedRect(
  graphic: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): Graphics {
  return graphic
    .moveTo(x, y + height)
    .lineTo(x, y + radius)
    .arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
    .lineTo(x + width - radius, y)
    .arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
    .lineTo(x + width, y + height)
    .closePath();
}

// Traces dash segments along the edges of a rect (CSS border-dashed).
const DASH = 6;
const GAP = 5;

export function traceDashedRect(
  graphic: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
): Graphics {
  traceDashedLine(graphic, x, y, width, true);
  traceDashedLine(graphic, x, y + height, width, true);
  traceDashedLine(graphic, x, y, height, false);
  traceDashedLine(graphic, x + width, y, height, false);
  return graphic;
}

function traceDashedLine(
  graphic: Graphics,
  x: number,
  y: number,
  length: number,
  horizontal: boolean,
): void {
  for (let offset = 0; offset < length; offset += DASH + GAP) {
    const end = Math.min(offset + DASH, length);
    if (horizontal) {
      graphic.moveTo(x + offset, y).lineTo(x + end, y);
    } else {
      graphic.moveTo(x, y + offset).lineTo(x, y + end);
    }
  }
}
