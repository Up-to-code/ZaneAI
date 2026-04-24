import { redirect } from "next/navigation";
import { buildWorkspaceOrganizationAppsPath } from "@/lib/serverSession";

/**
 * Redirects the old personal apps path into the organization apps settings tab.
 */
export default async function WorkspaceSecurityAppsPage() {
  const destination = buildWorkspaceOrganizationAppsPath("legacy-account-apps");
  redirect(destination);
}
