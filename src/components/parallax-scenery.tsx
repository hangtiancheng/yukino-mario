import type { CSSProperties, ReactElement } from "react";

import { clouds, hills, pipes } from "./scenery-data";
import type { SceneryShape } from "./scenery-data";

interface ParallaxSceneryProps {
  cameraX: number;
  reducedMotion: boolean;
  worldWidth: number;
}

export function ParallaxScenery({
  cameraX,
  reducedMotion,
  worldWidth,
}: ParallaxSceneryProps): ReactElement {
  return (
    <>
      <SceneryLayer
        cameraX={cameraX}
        reducedMotion={reducedMotion}
        shapes={clouds}
        speed={0.2}
        worldWidth={worldWidth}
      />
      <SceneryLayer
        cameraX={cameraX}
        reducedMotion={reducedMotion}
        shapes={hills}
        speed={0.42}
        worldWidth={worldWidth}
      />
      <SceneryLayer
        cameraX={cameraX}
        reducedMotion={reducedMotion}
        shapes={pipes}
        speed={0.7}
        worldWidth={worldWidth}
      />
    </>
  );
}

function SceneryLayer({
  cameraX,
  reducedMotion,
  shapes,
  speed,
  worldWidth,
}: {
  cameraX: number;
  reducedMotion: boolean;
  shapes: SceneryShape[];
  speed: number;
  worldWidth: number;
}): ReactElement {
  return (
    <div
      className="absolute top-0 left-0"
      style={getLayerStyle(cameraX, speed, worldWidth, reducedMotion)}
    >
      {shapes.map((shape: SceneryShape): ReactElement => (
        <SceneryShapeSprite key={shape.id} shape={shape} />
      ))}
    </div>
  );
}

function SceneryShapeSprite({ shape }: { shape: SceneryShape }): ReactElement {
  return (
    <div
      className={`absolute ${shape.className}`}
      style={getShapeStyle(shape)}
    />
  );
}

function getLayerStyle(
  cameraX: number,
  speed: number,
  worldWidth: number,
  reducedMotion: boolean,
): CSSProperties {
  const offsetX = reducedMotion ? 0 : -cameraX * speed;
  return {
    height: "100%",
    transform: `translate3d(${offsetX}px, 0, 0)`,
    width: `${worldWidth + 320}px`,
  };
}

function getShapeStyle(shape: SceneryShape): CSSProperties {
  return {
    height: `${shape.height}px`,
    left: `${shape.x}px`,
    top: `${shape.y}px`,
    width: `${shape.width}px`,
  };
}
