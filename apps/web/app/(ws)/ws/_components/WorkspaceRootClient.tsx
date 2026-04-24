"use client";

import WorkspaceShell from "./WorkspaceShell";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { getWorkspaceOrganizationDisplay } from "../_lib/organizationDisplay";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth/webAuthClient";
import type { WorkspaceZoneKey } from "@/server/contracts/workspace";

type WorkspaceRootClientProps = {
  children: React.ReactNode;
};

/**
 * Reads workspace state from the Convex backend and renders the shell.
 * Falls back to a minimal loading state while the query is in flight.
 */
export default function WorkspaceRootClient({ children }: WorkspaceRootClientProps) {
  const workspaceState = useQuery(api.partnerWorkspace.getWorkspaceState);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.isPending && !session.data?.session && workspaceState === null) {
      router.push("/signin");
    }
  }, [workspaceState, session.isPending, session.data?.session, router]);

  if (session.isPending || workspaceState === undefined) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading workspace…</div>
      </div>
    );
  }

  if (workspaceState === null) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading workspace…</div>
      </div>
    );
  }

  const user = {
    name: workspaceState.user.name,
    email: workspaceState.user.email,
    image: workspaceState.user.image,
  };

  const organization = getWorkspaceOrganizationDisplay({
    name: workspaceState.organization?.name,
    type: workspaceState.organization?.type,
    status: workspaceState.organization?.status,
  });

  return (
    <WorkspaceShell
      user={user}
      visibleZoneKeys={(workspaceState.visibleZoneKeys ?? ["overview", "settings"]) as WorkspaceZoneKey[]}
      organization={organization}
      recentAssistantThreads={[]}
      allAssistantThreads={[]}
      signalCounts={{ notificationCount: 0, inboxCount: 0 }}
      complianceBanner={null}
    >
      {children}
    </WorkspaceShell>
  );
}
