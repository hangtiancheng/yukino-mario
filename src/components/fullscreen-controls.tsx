import { Link } from "react-router";
import type { ReactElement } from "react";

export function FullscreenControls(): ReactElement {
  return (
    <Link
      className="rounded-full border-4 border-slate-950 bg-white px-5 py-2 text-xs font-black tracking-[0.2em] text-slate-950 uppercase shadow-[5px_5px_0_rgb(15_23_42)]"
      to="/fullscreen"
    >
      Open fullscreen
    </Link>
  );
}
