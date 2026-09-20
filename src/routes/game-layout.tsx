import clsx from "clsx";
import type { ReactElement, ReactNode } from "react";

import { usePageIntro } from "@/hooks";

export type GameLayoutPresentation = "fullscreen" | "standard";

interface GameLayoutProps {
  children: ReactNode;
  presentation: GameLayoutPresentation;
}

export function GameLayout({
  children,
  presentation,
}: GameLayoutProps): ReactElement {
  const pageRef = usePageIntro();
  return (
    <div ref={pageRef}>
      <main className={getMainClass(presentation)}>
        <div className="mx-auto flex max-w-6xl flex-col gap-3">{children}</div>
      </main>
    </div>
  );
}

function getMainClass(presentation: GameLayoutPresentation): string {
  return clsx(
    "min-h-screen overflow-hidden bg-slate-950 text-white",
    presentation === "fullscreen" ? "px-2 py-2 sm:px-4" : "px-3 py-3 sm:px-4",
  );
}
