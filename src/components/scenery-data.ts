import { palette } from "@/constants";

// className styles the DOM renderer; color/alpha mirror the same
// Tailwind tokens for the Pixi renderer. Keep both in sync.
export interface SceneryShape {
  alpha: number;
  className: string;
  color: number;
  height: number;
  id: string;
  width: number;
  x: number;
  y: number;
}

export const clouds: SceneryShape[] = [
  shape(
    "cloud-one",
    90,
    56,
    140,
    44,
    "rounded-full bg-white/80",
    palette.white,
    0.8,
  ),
  shape(
    "cloud-two",
    650,
    34,
    180,
    52,
    "rounded-full bg-white/70",
    palette.white,
    0.7,
  ),
  shape(
    "cloud-three",
    1_170,
    88,
    150,
    38,
    "rounded-full bg-white/75",
    palette.white,
    0.75,
  ),
  shape(
    "cloud-four",
    1_720,
    48,
    190,
    48,
    "rounded-full bg-white/65",
    palette.white,
    0.65,
  ),
  shape(
    "cloud-five",
    2_180,
    76,
    150,
    40,
    "rounded-full bg-white/75",
    palette.white,
    0.75,
  ),
];

export const hills: SceneryShape[] = [
  shape(
    "hill-one",
    80,
    372,
    260,
    150,
    "rounded-t-full bg-emerald-500/80",
    palette.emerald500,
    0.8,
  ),
  shape(
    "hill-two",
    560,
    340,
    340,
    190,
    "rounded-t-full bg-lime-500/70",
    palette.lime500,
    0.7,
  ),
  shape(
    "hill-three",
    1_170,
    358,
    300,
    170,
    "rounded-t-full bg-emerald-500/75",
    palette.emerald500,
    0.75,
  ),
  shape(
    "hill-four",
    1_760,
    328,
    360,
    210,
    "rounded-t-full bg-lime-500/70",
    palette.lime500,
    0.7,
  ),
];

export const pipes: SceneryShape[] = [
  pipe("pipe-one", 250, 442, 56, 70, "bg-emerald-600", palette.emerald600),
  pipe("pipe-two", 1_045, 428, 64, 84, "bg-teal-600", palette.teal600),
  pipe("pipe-three", 1_875, 438, 58, 74, "bg-emerald-600", palette.emerald600),
];

function shape(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  className: string,
  color: number,
  alpha: number,
): SceneryShape {
  return { alpha, className, color, height, id, width, x, y };
}

function pipe(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  tone: string,
  color: number,
): SceneryShape {
  return shape(
    id,
    x,
    y,
    width,
    height,
    `rounded-t-xl border-4 border-slate-950 ${tone}`,
    color,
    1,
  );
}
