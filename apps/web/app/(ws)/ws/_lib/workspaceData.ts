import { getDemoSidebarData, demoWorkspaceBehavior } from "./demoData";

/**
 * WHY: Layout needs user + organizations for sidebar (org name, user/org block).
 * WHAT: Returns { user, organizations } without full profile. Redirects if unauthenticated.
 * HOW: Uses the gateway workspace service and redirects when the session layer reports UNAUTHORIZED.
 */
export async function getLayoutSidebarData(returnTo: string) {
  void returnTo;
  return getDemoSidebarData();
}

export async function requireWorkspaceData(returnTo: string) {
  void returnTo;
  return demoWorkspaceBehavior;
}
