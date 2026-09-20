export { getAudioEvent, getToneProfiles } from "./audio-events";
export type { GameAudioEvent, ToneProfile } from "./audio-events";
export { getTargetCameraX, smoothCameraX } from "./camera";
export {
  couldCollideHorizontally,
  getCollisionCandidates,
} from "./collision-candidates";
export { resolveEnemyContacts } from "./enemy-contact";
export { updateEnemies } from "./enemy-motion";
export { createSegmentEnemy } from "./enemy-variation";
export { exhaustiveCheck } from "./exhaustive-check";
export { collectCoins, createCoins, createPlayer } from "./game-entities";
export {
  getProgressMessage,
  hasMovementInput,
  loseLife,
  removeBumpedPlatform,
  startGame,
} from "./game-flow";
export { createIdleInput, setGameInputControl } from "./game-input";
export { extendInfiniteWorld } from "./infinite-map";
export { carryPlayerByPlatforms, updatePlatforms } from "./platform-motion";
export {
  getInvulnerabilityOpacity,
  getPlayerAnimation,
} from "./player-animation";
export {
  createSpawns,
  getPlatformCenter,
  spawnParticles,
  updateParticles,
} from "./particles";
export { clamp, intersects } from "./rect";
export { getRunDistance, getWeightedScore } from "./score";
export { safelyUpdateGameState } from "./safe-game-update";
export { buildPlatformIndex, getPlatformsInRange } from "./spatial-index";
export type { PlatformIndex } from "./spatial-index";
export { filterVisibleRects } from "./viewport";
export { updateGameState } from "./game-state";
export { createInitialGameState } from "./initial-game-state";
export { updatePlayer } from "./player-motion";
export type { GameInputControl } from "./game-input";
export type { ParticleSpawn } from "./particles";
