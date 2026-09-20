import { Component } from "react";
import type { ErrorInfo, ReactElement, ReactNode } from "react";

import { captureException } from "@/services";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public override state: AppErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    void captureException(error);
    if (import.meta.env.DEV) {
      console.error("AppErrorBoundary caught an error", error, errorInfo);
    }
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

function ErrorFallback(): ReactElement {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-center text-sm font-black tracking-[0.3em] text-red-200 uppercase">
      Something went wrong. The run was reported when monitoring is configured.
    </div>
  );
}
