/**
 * WHY: Layout needs user + organizations for sidebar (org name, user/org block).
 * WHAT: Returns { user, organizations } without full profile. Redirects if unauthenticated.
 * HOW: Returns null — the workspace shell now reads from Convex client-side via getWorkspaceState.
 */
export async function getLayoutSidebarData(_returnTo: string) {
  return null;
}

export async function requireWorkspaceData(_returnTo: string) {
  return null;
}
