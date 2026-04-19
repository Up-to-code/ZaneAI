"use client";

import WorkspaceShell from "./WorkspaceShell";
import {
  demoAssistantThreads,
  demoOrganizationDisplay,
  demoSessionUser,
  demoSignalCounts,
  demoVisibleZoneKeys,
} from "../_lib/demoData";

type WorkspaceRootClientProps = {
  children: React.ReactNode;
};

/**
 * The `/ws` route group is currently a deterministic demo workspace.
 * Keep the app-router page slot mounted directly inside the shell so content
 * always takes the full canvas instead of being gated behind auth/query state.
 */
export default function WorkspaceRootClient({ children }: WorkspaceRootClientProps) {
  return (
    <WorkspaceShell
      user={demoSessionUser}
      visibleZoneKeys={demoVisibleZoneKeys}
      organization={demoOrganizationDisplay}
      recentAssistantThreads={demoAssistantThreads.slice(0, 3)}
      allAssistantThreads={demoAssistantThreads}
      signalCounts={demoSignalCounts}
      complianceBanner={null}
    >
      {children}
    </WorkspaceShell>
  );
}
