import { getDemoOrganizationTeam } from "./demoData";

/**
 * WHY:   Workspace settings pages need one gateway-safe loader for organization members and invites.
 * WHAT:  Returns the current user's primary organization plus its members and pending invites.
 * HOW:   Uses the existing workspace snapshot and organization repository instead of calling Convex directly from pages.
 */
export async function getWorkspaceOrganizationTeam() {
  return getDemoOrganizationTeam();
}
