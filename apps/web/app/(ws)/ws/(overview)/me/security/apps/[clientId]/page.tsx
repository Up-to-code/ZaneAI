import { redirect } from "next/navigation";
import { buildWorkspaceOrganizationAppsPath } from "@/lib/serverSession";

type WorkspaceSecurityDetailPageProps = { params: Promise<{ clientId: string }> };

/**
 * Redirects the old personal app detail route to the organization apps settings tab.
 */
export default async function WorkspaceSecurityDetailPage({ params }: WorkspaceSecurityDetailPageProps) {
  await params;
  redirect(buildWorkspaceOrganizationAppsPath("legacy-account-apps"));
}
