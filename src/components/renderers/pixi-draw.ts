import type { Graphics } from "pixi.js";

import { spriteTheme } from "@/constants";
import type {
  Coin,
  Enemy,
  EnemyType,
  GameState,
  Particle,
  ParticleKind,
  Platform,
  PlatformTone,
  PlayerAnimation,
} from "@/types";
import { getInvulnerabilityOpacity, getPlayerAnimation } from "@/utils";
import { traceDashedRect, traceTopRoundedRect } from "./pixi-primitives";

const BORDER_WIDTH = 4;
const PLATFORM_RADIUS = 6;
const SPRITE_SHADOW_OFFSET = 4;
const PLATFORM_SHADOW_OFFSET = 6;

export function drawPlatform(graphic: Graphics, platform: Platform): void {
  const theme = spriteTheme.platform;
  graphic.clear();
  const shadowColor = getToneShadowColor(platform.tone);
  if (shadowColor !== null) {
    graphic
      .roundRect(
        PLATFORM_SHADOW_OFFSET,
        PLATFORM_SHADOW_OFFSET,
        platform.width,
        platform.height,
        PLATFORM_RADIUS,
      )
      .fill({ color: shadowColor });
  }
  graphic
    .roundRect(0, 0, platform.width, platform.height, PLATFORM_RADIUS)
    .fill({ color: getToneColor(platform.tone) })
    .stroke({ alignment: 1, color: theme.stroke, width: BORDER_WIDTH });
  if (platform.tone === "breakable") {
    traceDashedRect(
      graphic,
      8,
      8,
      platform.width - 16,
      platform.height - 16,
    ).stroke({ color: theme.breakableDash, width: 2 });
  }
  if (platform.tone === "ground") {
    graphic
      .rect(4, platform.height - 12, platform.width - 8, 8)
      .fill({ color: theme.groundTurf });
  }
  if (platform.motion !== undefined) {
    graphic
      .roundRect(0, 0, platform.width, platform.height, 8)
      .stroke({ alignment: 0, alpha: 0.8, color: theme.motionRing, width: 4 })
      .roundRect(12, platform.height + 4, platform.width - 24, 4, 2)
      .fill({ alpha: 0.4, color: theme.motionShadow });
  }
  graphic.position.set(platform.x, platform.y);
}

export function drawCoin(graphic: Graphics, coin: Coin): void {
  const theme = spriteTheme.coin;
  const centerX = coin.width / 2;
  const centerY = coin.height / 2;
  const radius = coin.width / 2;
  graphic
    .clear()
    .circle(centerX, centerY, radius + 12)
    .fill({ alpha: 0.15, color: theme.glow })
    .circle(centerX, centerY, radius + 6)
    .fill({ alpha: 0.3, color: theme.glow })
    .circle(centerX, centerY, radius)
    .fill({ color: theme.fill })
    .stroke({ alignment: 1, color: theme.stroke, width: BORDER_WIDTH });
  graphic.position.set(coin.x, coin.y);
}

export function drawEnemy(graphic: Graphics, enemy: Enemy): void {
  const theme = spriteTheme.enemy;
  graphic.clear();
  traceEnemyBody(graphic, enemy, SPRITE_SHADOW_OFFSET).fill({
    color: spriteTheme.shadow,
  });
  traceEnemyBody(graphic, enemy, 0)
    .fill({ color: getEnemyColor(enemy.type) })
    .stroke({ alignment: 1, color: spriteTheme.stroke, width: BORDER_WIDTH });
  if (enemy.type === "flyer") {
    graphic
      .ellipse(-4, 14, 8, 6)
      .fill({ color: theme.wing })
      .ellipse(enemy.width + 4, 14, 8, 6)
      .fill({ color: theme.wing });
  }
  graphic
    .roundRect((enemy.width - 20) / 2, 12, 20, 8, 4)
    .fill({ color: theme.eye })
    .roundRect((enemy.width - 28) / 2, 24, 28, 4, 2)
    .fill({ color: theme.mouth });
  graphic.position.set(enemy.x, enemy.y);
}

export function drawParticle(graphic: Graphics, particle: Particle): void {
  graphic
    .clear()
    .ellipse(
      particle.width / 2,
      particle.height / 2,
      particle.width / 2,
      particle.height / 2,
    )
    .fill({ color: getParticleColor(particle.kind) })
    .stroke({ alignment: 1, color: spriteTheme.particle.stroke, width: 2 });
  graphic.alpha = particle.lifeMs / particle.maxLifeMs;
  graphic.position.set(particle.x, particle.y);
}

export function drawPlayer(graphic: Graphics, state: GameState): void {
  const theme = spriteTheme.player;
  const player = state.player;
  const animation = getPlayerAnimation(
    player,
    state.stats.elapsedMs,
    state.phase,
  );
  const pose = getPlayerPose(animation);
  graphic
    .clear()
    .roundRect(
      SPRITE_SHADOW_OFFSET,
      SPRITE_SHADOW_OFFSET,
      player.width,
      player.height,
      8,
    )
    .fill({ color: spriteTheme.shadow })
    .roundRect(0, 0, player.width, player.height, 8)
    .fill({ color: animation === "hurt" ? theme.bodyHurt : theme.body })
    .stroke({ alignment: 1, color: spriteTheme.stroke, width: BORDER_WIDTH });
  traceTopRoundedRect(graphic, 5, 8, 24, 12, 12).fill({
    color: theme.hat,
  });
  graphic
    .roundRect(7, 24, 20, 12, 6)
    .fill({ color: theme.face })
    // Pants intentionally overflow the 34x48 body: they mirror the DOM
    // sprite, whose w-8 pants div overflows its parent the same way.
    .roundRect(4, 40, 32, 12, 2)
    .fill({ color: theme.pants });
  graphic.alpha = getInvulnerabilityOpacity(player, state.stats.elapsedMs);
  graphic.pivot.set(player.width / 2, player.height / 2);
  graphic.scale.x = player.facing;
  graphic.rotation = pose.rotation * player.facing;
  graphic.position.set(
    player.x + player.width / 2,
    player.y + player.height / 2 + pose.offsetY,
  );
}

export function getEntityId(entity: { id: string }): string {
  return entity.id;
}

export function getParticleId(particle: Particle): string {
  return particle.id.toString();
}

export function getPlayerKey(): string {
  return "player";
}

export function isVisibleCoin(coin: Coin): boolean {
  return !coin.collected;
}

function traceEnemyBody(
  graphic: Graphics,
  enemy: Enemy,
  offset: number,
): Graphics {
  switch (enemy.type) {
    case "walker":
      return traceTopRoundedRect(
        graphic,
        offset,
        offset,
        enemy.width,
        enemy.height,
        Math.min(16, enemy.width / 2, enemy.height),
      );
    case "hopper":
      return graphic.ellipse(
        offset + enemy.width / 2,
        offset + enemy.height / 2,
        enemy.width / 2,
        enemy.height / 2,
      );
    case "flyer":
      return traceTopRoundedRect(
        graphic,
        offset,
        offset,
        enemy.width,
        enemy.height,
        Math.min(enemy.width / 2, enemy.height),
      );
  }
}

interface PlayerPose {
  offsetY: number;
  rotation: number;
}

function getPlayerPose(animation: PlayerAnimation): PlayerPose {
  switch (animation) {
    case "hurt":
      return { offsetY: 0, rotation: toRadians(12) };
    case "jump":
      return { offsetY: -4, rotation: 0 };
    case "fall":
      return { offsetY: 4, rotation: 0 };
    case "run-one":
      return { offsetY: 0, rotation: toRadians(-3) };
    case "run-two":
      return { offsetY: 0, rotation: toRadians(3) };
    case "idle":
      return { offsetY: 0, rotation: 0 };
  }
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function getToneColor(tone: PlatformTone): number {
  const theme = spriteTheme.platform;
  switch (tone) {
    case "breakable":
      return theme.breakable;
    case "mario":
      return theme.mario;
    case "grass":
      return theme.grass;
    case "ground":
      return theme.ground;
  }
}

function getToneShadowColor(tone: PlatformTone): number | null {
  const theme = spriteTheme.platform;
  switch (tone) {
    case "breakable":
      return theme.breakableShadow;
    case "mario":
      return theme.marioShadow;
    case "grass":
      return theme.grassShadow;
    case "ground":
      return null;
  }
}

function getEnemyColor(type: EnemyType): number {
  const theme = spriteTheme.enemy;
  switch (type) {
    case "walker":
      return theme.walker;
    case "hopper":
      return theme.hopper;
    case "flyer":
      return theme.flyer;
  }
}

function getParticleColor(kind: ParticleKind): number {
  const theme = spriteTheme.particle;
  switch (kind) {
    case "coin":
      return theme.coin;
    case "stomp":
      return theme.stomp;
    case "mario":
      return theme.mario;
    case "hit":
      return theme.hit;
  }
}
