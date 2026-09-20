import { Container } from "pixi.js";

import type { Coin, Enemy, GameState, Particle, Platform } from "@/types";
import { filterVisibleRects } from "@/utils";
import {
  createPixiBackground,
  destroyPixiBackground,
  syncPixiBackground,
} from "./pixi-background";
import type { PixiBackgroundState } from "./pixi-background";
import {
  drawCoin,
  drawEnemy,
  drawParticle,
  drawPlatform,
  drawPlayer,
  getEntityId,
  getParticleId,
  getPlayerKey,
  isVisibleCoin,
} from "./pixi-draw";
import { createGraphicsPool } from "./pixi-pool";
import type { GraphicsPool } from "./pixi-pool";

interface PixiSceneState {
  background: PixiBackgroundState;
  coinPool: GraphicsPool<Coin>;
  enemyPool: GraphicsPool<Enemy>;
  particlePool: GraphicsPool<Particle>;
  platformPool: GraphicsPool<Platform>;
  playerPool: GraphicsPool<GameState>;
  world: Container;
}

const pixiSceneStates = new WeakMap<Container, PixiSceneState>();

export function renderPixiScene(
  scene: Container,
  state: GameState,
  reducedMotion: boolean,
): void {
  const sceneState = getPixiSceneState(scene);
  sceneState.world.x = -state.cameraX;
  syncPixiBackground(sceneState.background, state.cameraX, reducedMotion);
  sceneState.platformPool.sync(
    filterVisibleRects(state.platforms, state.cameraX),
    getEntityId,
    drawPlatform,
  );
  sceneState.coinPool.sync(
    filterVisibleRects(state.coins, state.cameraX).filter(isVisibleCoin),
    getEntityId,
    drawCoin,
  );
  sceneState.enemyPool.sync(
    filterVisibleRects(state.enemies, state.cameraX),
    getEntityId,
    drawEnemy,
  );
  sceneState.particlePool.sync(
    reducedMotion ? state.particles.slice(0, 4) : state.particles,
    getParticleId,
    drawParticle,
  );
  sceneState.playerPool.sync([state], getPlayerKey, drawPlayer);
}

export function destroyPixiScene(scene: Container): void {
  const sceneState = pixiSceneStates.get(scene);
  if (sceneState === undefined) {
    return;
  }
  destroyPixiBackground(sceneState.background);
  sceneState.platformPool.destroy();
  sceneState.coinPool.destroy();
  sceneState.enemyPool.destroy();
  sceneState.particlePool.destroy();
  sceneState.playerPool.destroy();
  pixiSceneStates.delete(scene);
}

function getPixiSceneState(scene: Container): PixiSceneState {
  const existingState = pixiSceneStates.get(scene);
  if (existingState !== undefined) {
    return existingState;
  }
  const background = createPixiBackground();
  const world = new Container();
  scene.addChild(background.container, world);
  const sceneState: PixiSceneState = {
    background,
    coinPool: createGraphicsPool(world),
    enemyPool: createGraphicsPool(world),
    particlePool: createGraphicsPool(world),
    platformPool: createGraphicsPool(world),
    playerPool: createGraphicsPool(world),
    world,
  };
  pixiSceneStates.set(scene, sceneState);
  return sceneState;
}
