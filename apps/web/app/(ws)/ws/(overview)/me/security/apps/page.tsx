import { redirect } from "next/navigation";
import { buildWorkspaceOrganizationAppsPath } from "@/lib/serverSession";

/**
 * WHY:   Legacy apps links should still land somewhere meaningful in demo mode.
 * WHAT:  Redirects the old personal apps path into the organization apps settings tab.
 * HOW:   Removes auth checks because demo workspace routes are intentionally open.
 */
export default async function WorkspaceSecurityAppsPage() {
  const destination = buildWorkspaceOrganizationAppsPath("legacy-account-apps");
  redirect(destination);
}
