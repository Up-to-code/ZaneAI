"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import OperationalDashboard from "./_components/OperationalDashboard";

export default function WorkspacePage() {
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState, {});

  if (!workspaceState) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="text-xl font-black uppercase tracking-[0.2em] text-[var(--zane-ai-deep)] dark:text-white">Initialize Context</div>
          <div className="mt-8 h-[2px] w-24 bg-gradient-to-r from-transparent via-[var(--zane-ai-deep)] to-transparent dark:via-white animate-pulse" />
        </div>
      </div>
    );
  }

  return <OperationalDashboard workspaceState={workspaceState} />;
}
