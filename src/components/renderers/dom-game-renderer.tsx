import { memo, useMemo } from "react";
import type { CSSProperties, ReactElement } from "react";

import { VIEWPORT_HEIGHT } from "@/constants";
import type { Coin, Enemy, GameRendererProps, Platform } from "@/types";
import { filterVisibleRects } from "@/utils";
import { EnemySprite } from "@/components/enemy-sprite";
import { CoinSprite, PlatformSprite } from "@/components/game-sprites";
import { ParallaxScenery } from "@/components/parallax-scenery";
import { ParticleLayer } from "@/components/particle-layer";
import { PlayerSprite } from "@/components/player-sprite";

const MemoEnemySprite = memo(EnemySprite);
const MemoCoinSprite = memo(CoinSprite);
const MemoPlatformSprite = memo(PlatformSprite);

export function DomGameRenderer({
  reducedMotion,
  state,
}: GameRendererProps): ReactElement {
  const visible = useMemo(
    (): VisibleSprites => ({
      coins: filterVisibleRects(state.coins, state.cameraX),
      enemies: filterVisibleRects(state.enemies, state.cameraX),
      platforms: filterVisibleRects(state.platforms, state.cameraX),
    }),
    [state.cameraX, state.coins, state.enemies, state.platforms],
  );
  const worldStyle: CSSProperties = {
    height: `${VIEWPORT_HEIGHT}px`,
    transform: `translate3d(${-state.cameraX}px, 0, 0)`,
    width: `${state.worldWidth}px`,
  };

  return (
    <>
      <div className="absolute inset-x-0 top-0 h-28 bg-white/20" />
      <ParallaxScenery
        cameraX={state.cameraX}
        reducedMotion={reducedMotion}
        worldWidth={state.level.width}
      />
      <div className="absolute top-0 left-0" style={worldStyle}>
        {visible.platforms.map((platform: Platform): ReactElement => (
          <MemoPlatformSprite key={platform.id} platform={platform} />
        ))}
        {visible.coins.map((coin: Coin): ReactElement | null =>
          coin.collected ? null : <MemoCoinSprite coin={coin} key={coin.id} />,
        )}
        {visible.enemies.map((enemy: Enemy): ReactElement => (
          <MemoEnemySprite enemy={enemy} key={enemy.id} />
        ))}
        <ParticleLayer
          particles={state.particles}
          reducedMotion={reducedMotion}
        />
        <PlayerSprite
          elapsedMs={state.stats.elapsedMs}
          phase={state.phase}
          player={state.player}
        />
      </div>
    </>
  );
}

interface VisibleSprites {
  coins: Coin[];
  enemies: Enemy[];
  platforms: Platform[];
}
