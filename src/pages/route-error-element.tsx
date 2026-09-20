import { useEffect } from "react";
import { Link, useRouteError } from "react-router";
import type { ReactElement } from "react";

import { captureException } from "@/services";

export function RouteErrorElement(): ReactElement {
  const error = useRouteError();

  useEffect((): void => {
    void captureException(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <section className="max-w-lg rounded-4xl border-8 border-rose-400 bg-slate-900 p-8 text-center shadow-[10px_10px_0_rgb(244_63_94)]">
        <p className="text-sm font-black tracking-[0.32em] text-rose-200 uppercase">
          Something broke
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase">Crash</h1>
        <p className="mt-4 text-sm font-bold text-rose-100/80">
          The current route failed to render. The error has been reported.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full border-4 border-slate-950 bg-rose-300 px-6 py-3 text-sm font-black tracking-[0.2em] text-slate-950 uppercase"
          to="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
