import { redirect } from "next/navigation";
import { buildWorkspaceOrganizationAppsPath } from "@/lib/serverSession";

type WorkspaceSecurityDetailPageProps = { params: Promise<{ clientId: string }> };

/**
 * WHY:   Legacy app detail links should stay valid after the workspace becomes a static demo.
 * WHAT:  Redirects the old personal detail route to the organization apps tab.
 * HOW:   Ignores auth state and forwards directly into the demo settings surface.
 */
export default async function WorkspaceSecurityDetailPage({ params }: WorkspaceSecurityDetailPageProps) {
  await params;
  redirect(buildWorkspaceOrganizationAppsPath("legacy-account-apps"));
}
