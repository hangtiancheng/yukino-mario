import { Container, Graphics } from "pixi.js";

import { VIEWPORT_WIDTH, palette } from "@/constants";
import { clouds, hills, pipes } from "@/components/scenery-data";
import type { SceneryShape } from "@/components/scenery-data";
import { traceTopRoundedRect } from "./pixi-primitives";

const CLOUD_SPEED = 0.2;
const HILL_SPEED = 0.42;
const PIPE_SPEED = 0.7;
const HIGHLIGHT_HEIGHT = 112;

interface ParallaxLayer {
  container: Container;
  speed: number;
}

export interface PixiBackgroundState {
  container: Container;
  layers: ParallaxLayer[];
}

export function createPixiBackground(): PixiBackgroundState {
  const container = new Container();
  container.addChild(buildHighlight());
  const layers: ParallaxLayer[] = [
    buildLayer(clouds, CLOUD_SPEED, buildCloud),
    buildLayer(hills, HILL_SPEED, buildHill),
    buildLayer(pipes, PIPE_SPEED, buildPipe),
  ];
  for (const layer of layers) {
    container.addChild(layer.container);
  }
  return { container, layers };
}

export function syncPixiBackground(
  state: PixiBackgroundState,
  cameraX: number,
  reducedMotion: boolean,
): void {
  for (const layer of state.layers) {
    layer.container.x = reducedMotion ? 0 : -cameraX * layer.speed;
  }
}

export function destroyPixiBackground(state: PixiBackgroundState): void {
  state.container.removeChildren().forEach((child): void => {
    child.destroy({ children: true });
  });
  state.layers.length = 0;
}

function buildLayer(
  shapes: SceneryShape[],
  speed: number,
  build: (shape: SceneryShape) => Graphics,
): ParallaxLayer {
  const container = new Container();
  for (const shape of shapes) {
    container.addChild(build(shape));
  }
  return { container, speed };
}

function buildHighlight(): Graphics {
  return new Graphics()
    .rect(0, 0, VIEWPORT_WIDTH, HIGHLIGHT_HEIGHT)
    .fill({ alpha: 0.2, color: palette.white });
}

function buildCloud(shape: SceneryShape): Graphics {
  return new Graphics()
    .roundRect(
      shape.x,
      shape.y,
      shape.width,
      shape.height,
      Math.min(shape.width, shape.height) / 2,
    )
    .fill({ alpha: shape.alpha, color: shape.color });
}

function buildHill(shape: SceneryShape): Graphics {
  const graphic = new Graphics();
  traceTopRoundedRect(
    graphic,
    shape.x,
    shape.y,
    shape.width,
    shape.height,
    Math.min(shape.width / 2, shape.height),
  );
  return graphic.fill({ alpha: shape.alpha, color: shape.color });
}

function buildPipe(shape: SceneryShape): Graphics {
  const graphic = new Graphics();
  traceTopRoundedRect(graphic, shape.x, shape.y, shape.width, shape.height, 12);
  return graphic
    .fill({ alpha: shape.alpha, color: shape.color })
    .stroke({ color: palette.slate950, width: 4 });
}
