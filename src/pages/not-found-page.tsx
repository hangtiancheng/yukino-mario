import { Link } from "react-router";
import type { ReactElement } from "react";

export function NotFoundPage(): ReactElement {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <section className="max-w-lg rounded-4xl border-8 border-amber-300 bg-slate-900 p-8 text-center shadow-[10px_10px_0_rgb(250_204_21)]">
        <p className="text-sm font-black tracking-[0.32em] text-amber-200 uppercase">
          Route missing
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase">404</h1>
        <Link
          className="mt-6 inline-flex rounded-full border-4 border-slate-950 bg-amber-300 px-6 py-3 text-sm font-black tracking-[0.2em] text-slate-950 uppercase"
          to="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
