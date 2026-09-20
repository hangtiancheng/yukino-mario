import { PLAYER_SIZE } from "@/constants";
import type { Coin, LevelData, Player, Vector } from "@/types";
import { intersects } from "./rect";

export interface CoinResult {
  coins: Coin[];
  gained: number;
  collectedAt: Vector[];
}

export function createPlayer(level: LevelData): Player {
  return {
    x: level.spawn.x,
    y: level.spawn.y,
    width: PLAYER_SIZE.width,
    height: PLAYER_SIZE.height,
    velocity: { x: 0, y: 0 },
    grounded: true,
    facing: 1,
    coyoteMs: 0,
    jumpBufferMs: 0,
    jumpHeld: false,
    invulnerableMs: 0,
  };
}

export function createCoins(level: LevelData): Coin[] {
  const coins: Coin[] = [];
  for (const coin of level.coins) {
    coins.push({ ...coin, collected: false });
  }
  return coins;
}

export function collectCoins(coins: Coin[], player: Player): CoinResult {
  const nextCoins: Coin[] = [];
  const collectedAt: Vector[] = [];
  let gained = 0;
  for (const coin of coins) {
    if (!coin.collected && intersects(player, coin)) {
      nextCoins.push({ ...coin, collected: true });
      collectedAt.push({
        x: coin.x + coin.width / 2,
        y: coin.y + coin.height / 2,
      });
      gained += 1;
    } else {
      nextCoins.push(coin);
    }
  }
  return { coins: nextCoins, gained, collectedAt };
}
