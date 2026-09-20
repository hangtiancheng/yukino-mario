// Single source of truth for game colors, shared by the DOM renderer
// (via the Tailwind v4 classes named below) and the Pixi renderer (via
// these numeric values). Hex values are the Tailwind v4 oklch palette
// converted to sRGB; keep them in sync with the class names in comments.
export const palette = {
  amber100: 0xfef3c6, // amber-100
  amber500: 0xfe9a00, // amber-500
  amber900: 0x7b3306, // amber-900
  blue700: 0x1447e6, // blue-700
  cyan200: 0xa2f4fd, // cyan-200
  cyan900: 0x104e64, // cyan-900
  emerald500: 0x00bc7d, // emerald-500
  emerald600: 0x009966, // emerald-600
  fuchsia300: 0xf4a8ff, // fuchsia-300
  fuchsia600: 0xc800de, // fuchsia-600
  lime500: 0x7ccf00, // lime-500
  orange600: 0xf54900, // orange-600
  red500: 0xfb2c36, // red-500
  rose800: 0xa50036, // rose-800
  sky200: 0xb8e6fe, // sky-200
  sky500: 0x00a6f4, // sky-500
  slate500: 0x62748e, // slate-500
  slate900: 0x0f172b, // slate-900
  slate950: 0x020618, // slate-950
  stone700: 0x44403b, // stone-700
  teal600: 0x009689, // teal-600
  white: 0xffffff,
  yellow300: 0xffdf20, // yellow-300
  yellow950: 0x432004, // yellow-950
} as const;

// Literal sRGB values used by DOM arbitrary shadow utilities,
// e.g. shadow-[4px_4px_0_rgb(15_23_42)].
export const spriteTheme = {
  coin: {
    fill: palette.yellow300,
    glow: 0xfacc15, // rgb(250 204 21)
    stroke: palette.yellow950,
  },
  enemy: {
    eye: palette.white,
    flyer: palette.sky500,
    hopper: palette.lime500,
    mouth: palette.slate950,
    walker: palette.fuchsia600,
    wing: palette.sky200,
  },
  particle: {
    coin: palette.yellow300,
    hit: palette.red500,
    mario: palette.orange600,
    stomp: palette.fuchsia300,
    stroke: palette.slate950,
  },
  platform: {
    breakable: palette.amber500,
    breakableDash: palette.amber900,
    breakableShadow: 0x92400e, // rgb(146 64 14)
    grass: palette.lime500,
    grassShadow: 0x3f6212, // rgb(63 98 18)
    ground: palette.stone700,
    groundTurf: 0x84cc16, // rgb(132 204 22)
    mario: palette.orange600,
    marioShadow: 0x7c2d12, // rgb(124 45 18)
    motionRing: palette.cyan200,
    motionShadow: palette.cyan900,
    stroke: palette.slate900,
  },
  player: {
    body: palette.red500,
    bodyHurt: palette.slate500,
    face: palette.amber100,
    hat: palette.rose800,
    pants: palette.blue700,
  },
  shadow: 0x0f172a, // rgb(15 23 42)
  stroke: palette.slate950,
} as const;
