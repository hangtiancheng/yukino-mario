import type { GameState } from "@/types";

export type GameAudioEvent =
  "break" | "coin" | "hit" | "jump" | "loss" | "start" | "stomp";

export interface ToneProfile {
  delay: number;
  duration: number;
  frequency: number;
  gain: number;
  type: OscillatorType;
}

// Upward velocity below this marks a fresh jump; stays between
// STOMP_BOUNCE_VELOCITY (560) and JUMP_VELOCITY (720) magnitudes.
const JUMP_EVENT_VELOCITY_THRESHOLD = -500;

export function getAudioEvent(
  previous: GameState,
  current: GameState,
): GameAudioEvent | null {
  if (current.phase === "lost" && previous.phase !== "lost") {
    return "loss";
  }
  if (current.stats.lives < previous.stats.lives) {
    return "hit";
  }
  if (current.stats.stompedEnemies > previous.stats.stompedEnemies) {
    return "stomp";
  }
  if (current.stats.coinsCollected > previous.stats.coinsCollected) {
    return "coin";
  }
  if (current.stats.marioBroken > previous.stats.marioBroken) {
    return "break";
  }
  if (previous.phase === "ready" && current.phase === "running") {
    return "start";
  }
  if (
    previous.player.velocity.y >= 0 &&
    current.player.velocity.y < JUMP_EVENT_VELOCITY_THRESHOLD
  ) {
    return "jump";
  }
  return null;
}

export function getToneProfiles(event: GameAudioEvent): ToneProfile[] {
  switch (event) {
    case "coin":
      return [
        {
          delay: 0,
          duration: 0.11,
          frequency: 960,
          gain: 0.08,
          type: "triangle",
        },
      ];
    case "stomp":
      return [
        { delay: 0, duration: 0.13, frequency: 180, gain: 0.1, type: "square" },
      ];
    case "break":
      return [
        {
          delay: 0,
          duration: 0.08,
          frequency: 130,
          gain: 0.12,
          type: "sawtooth",
        },
      ];
    case "hit":
    case "loss":
      return [
        {
          delay: 0,
          duration: 0.22,
          frequency: 110,
          gain: 0.11,
          type: "sawtooth",
        },
      ];
    case "jump":
      return [
        {
          delay: 0,
          duration: 0.09,
          frequency: 520,
          gain: 0.07,
          type: "triangle",
        },
      ];
    case "start":
      return [
        { delay: 0, duration: 0.12, frequency: 440, gain: 0.07, type: "sine" },
      ];
  }
}
