import clsx from "clsx";
import type { CSSProperties, ReactElement } from "react";

import type { Particle, ParticleKind, Rect } from "@/types";

interface ParticleLayerProps {
  particles: Particle[];
  reducedMotion: boolean;
}

export function ParticleLayer({
  particles,
  reducedMotion,
}: ParticleLayerProps): ReactElement {
  const visibleParticles = reducedMotion ? particles.slice(0, 4) : particles;
  return (
    <>
      {visibleParticles.map((particle: Particle): ReactElement => (
        <div
          className={clsx(
            "absolute rounded-full border-2 border-slate-950",
            getParticleClass(particle.kind),
          )}
          key={particle.id}
          style={getParticleStyle(particle)}
        />
      ))}
    </>
  );
}

function getParticleStyle(particle: Particle): CSSProperties {
  return {
    ...getRectStyle(particle),
    opacity: particle.lifeMs / particle.maxLifeMs,
  };
}

function getRectStyle(rect: Rect): CSSProperties {
  return {
    height: `${rect.height}px`,
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
  };
}

function getParticleClass(kind: ParticleKind): string {
  switch (kind) {
    case "coin":
      return "bg-yellow-300";
    case "stomp":
      return "bg-fuchsia-300";
    case "mario":
      return "bg-orange-600";
    case "hit":
      return "bg-red-500";
  }
}
