import clsx from "clsx";
import type { CSSProperties, ReactElement } from "react";

import type { Coin, Platform, PlatformTone, Rect } from "@/types";

interface PlatformSpriteProps {
  platform: Platform;
}

export function PlatformSprite({
  platform,
}: PlatformSpriteProps): ReactElement {
  return (
    <div
      className={clsx(
        "absolute rounded-md border-4 border-slate-900",
        getPlatformClass(platform.tone),
        getPlatformMotionClass(platform),
      )}
      style={getRectStyle(platform)}
    />
  );
}

interface CoinSpriteProps {
  coin: Coin;
}

export function CoinSprite({ coin }: CoinSpriteProps): ReactElement {
  return (
    <div
      className="absolute rounded-full border-4 border-yellow-950 bg-yellow-300 shadow-[0_0_24px_rgb(250_204_21)]"
      style={getRectStyle(coin)}
    />
  );
}

function getRectStyle(rect: Rect): CSSProperties {
  return {
    height: `${rect.height}px`,
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
  };
}

function getPlatformClass(tone: PlatformTone): string {
  switch (tone) {
    case "breakable":
      return "bg-amber-500 shadow-[6px_6px_0_rgb(146_64_14)] after:absolute after:inset-1 after:rounded-sm after:border-2 after:border-dashed after:border-amber-900 after:content-['']";
    case "mario":
      return "bg-orange-600 shadow-[6px_6px_0_rgb(124_45_18)]";
    case "grass":
      return "bg-lime-500 shadow-[6px_6px_0_rgb(63_98_18)]";
    case "ground":
      return "bg-stone-700 shadow-[0_-8px_0_rgb(132_204_22)_inset]";
  }
}

function getPlatformMotionClass(platform: Platform): string {
  if (platform.motion === undefined) {
    return "";
  }
  return "ring-4 ring-cyan-200/80 before:absolute before:-bottom-3 before:left-2 before:h-1 before:w-[calc(100%-1rem)] before:rounded-full before:bg-cyan-900/40 before:content-['']";
}
