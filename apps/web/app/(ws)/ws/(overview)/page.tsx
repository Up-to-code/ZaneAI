"use client";

import OperationalDashboard from "./_components/OperationalDashboard";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";

export default function WorkspacePage() {
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState);

  if (workspaceState === undefined) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <OperationalDashboard
      workspaceState={{
        audience: (workspaceState.audience as "broker" | "developer") ?? "developer",
        organization: workspaceState.organization
          ? {
              id: workspaceState.organization.id,
              name: workspaceState.organization.name,
            }
          : null,
        metrics: {
          propertyCount: workspaceState.metrics.propertyCount,
          publishedPropertyCount: workspaceState.metrics.publishedPropertyCount,
          draftPropertyCount: workspaceState.metrics.draftPropertyCount,
        },
      }}
    />
  );
}
