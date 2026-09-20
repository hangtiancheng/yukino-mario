import clsx from "clsx";
import type { CSSProperties, ReactElement } from "react";

import type { Enemy, EnemyType, Rect } from "@/types";

interface EnemySpriteProps {
  enemy: Enemy;
}

export function EnemySprite({ enemy }: EnemySpriteProps): ReactElement {
  return (
    <div
      className={clsx(
        "absolute border-4 border-slate-950 shadow-[4px_4px_0_rgb(15_23_42)]",
        getEnemyClass(enemy.type),
      )}
      style={getRectStyle(enemy)}
    >
      <div className="mx-auto mt-2 h-2 w-5 rounded-full bg-white" />
      <div className="mx-auto mt-1 h-1 w-7 rounded-full bg-slate-950" />
    </div>
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

function getEnemyClass(type: EnemyType): string {
  switch (type) {
    case "walker":
      return "rounded-t-2xl bg-fuchsia-600";
    case "hopper":
      return "rounded-full bg-lime-500";
    case "flyer":
      return "rounded-t-full bg-sky-500 before:absolute before:-left-3 before:top-2 before:h-3 before:w-4 before:rounded-full before:bg-sky-200 before:content-[''] after:absolute after:-right-3 after:top-2 after:h-3 after:w-4 after:rounded-full after:bg-sky-200 after:content-['']";
  }
}
