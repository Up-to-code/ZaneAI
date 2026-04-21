import { requireSessionContext } from "@/server/auth/session";
import {
  getCurrentOrganizationForCurrentUser,
  listCurrentOrganizationTeamInvites,
  listCurrentOrganizationTeamMembers,
} from "@/server/domains/auth/organizations/service";
import type { ResolvedSession } from "@/server/auth/session";
import type { OrganizationSummary } from "@/server/contracts/organizations";
import type {
  OrganizationInviteDisplay,
  OrganizationMemberDisplay,
} from "./entities";

function formatInviteExpiry(expiresAt: number) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(expiresAt));
}

function isInvalidConvexAuthError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const code = (error as { code?: unknown }).code;
  return code === "InvalidAuthHeader" || error.message.includes("InvalidAuthHeader") || error.message.includes("Missing issuer claim");
}

function emptyOrganizationTeam(authUserId: string, currentTenantRole: string | null = null) {
  return {
    organization: null,
    members: [] as OrganizationMemberDisplay[],
    invites: [] as OrganizationInviteDisplay[],
    authUserId,
    currentMembershipRole: null as string | null,
    currentTenantRole,
  };
}

function resolveMembershipRole(role: string | null | undefined): OrganizationMemberDisplay["role"] {
  if (role === "manager" || role === "member" || role === "viewer") return role;
  return "manager";
}

function buildSessionOrganizationTeam(session: ResolvedSession) {
  const organizationType: OrganizationSummary["type"] = session.context.role === "broker" ? "broker" : "red";
  const organization: OrganizationSummary = {
    id: session.context.organizationId ?? session.context.redId ?? session.context.brokerId ?? "local-organization",
    organizationId: session.context.organizationId ?? undefined,
    type: organizationType,
    name: session.context.organizationSlug ?? (organizationType === "red" ? "Developer Workspace" : "Broker Workspace"),
    slug: session.context.organizationSlug ?? "local-workspace",
    status: "active",
    isVerified: false,
    logoUrl: null,
    description: "",
    website: "",
    contactEmail: session.context.email ?? undefined,
    phone: "",
  };
  const role = resolveMembershipRole(session.context.organizationRole);

  return {
    organization,
    members: [
      {
        id: session.context.userId,
        authUserId: session.context.userId,
        membershipId: `${session.context.userId}:local-membership`,
        name: session.context.name ?? session.profile?.name ?? "Workspace User",
        email: session.context.email ?? session.profile?.email ?? "",
        username: session.context.username ?? session.profile?.username,
        role,
        statusLabel: session.context.isActive === false ? "غير نشط" : "نشط",
        joinedAtLabel: "عضو حالي",
      },
    ] as OrganizationMemberDisplay[],
    invites: [] as OrganizationInviteDisplay[],
    authUserId: session.context.userId,
    currentMembershipRole: role,
    currentTenantRole: session.context.organizationRole ?? null,
  };
}

/**
 * WHY:   Workspace settings and CRM pages need one gateway-safe organization team loader.
 * WHAT:  Returns the current organization, display-ready members, invites, and current user role context.
 * HOW:   Resolves the current session and organization first, then reads Convex team data only when an org exists.
 */
export async function getWorkspaceOrganizationTeam() {
  const session = await requireSessionContext();

  let currentOrganization: Awaited<ReturnType<typeof getCurrentOrganizationForCurrentUser>>;
  try {
    currentOrganization = await getCurrentOrganizationForCurrentUser();
  } catch (error) {
    if (isInvalidConvexAuthError(error)) {
      return buildSessionOrganizationTeam(session);
    }
    throw error;
  }

  if (!currentOrganization?.organization) {
    return emptyOrganizationTeam(
      session.context.userId,
      currentOrganization?.membership?.tenantRole ?? session.context.organizationRole ?? null,
    );
  }

  let members: Awaited<ReturnType<typeof listCurrentOrganizationTeamMembers>>;
  let invites: Awaited<ReturnType<typeof listCurrentOrganizationTeamInvites>>;
  try {
    [members, invites] = await Promise.all([
      listCurrentOrganizationTeamMembers(),
      listCurrentOrganizationTeamInvites(),
    ]);
  } catch (error) {
    if (isInvalidConvexAuthError(error)) {
      return buildSessionOrganizationTeam(session);
    }
    throw error;
  }

  return {
    organization: currentOrganization.organization,
    members: members.map((member): OrganizationMemberDisplay => ({
      id: member.id,
      authUserId: member.authUserId,
      membershipId: member.membershipId ?? member.id,
      name: member.name,
      email: member.email,
      username: member.username,
      role: member.role,
      statusLabel: member.isActive === false ? "غير نشط" : "نشط",
      joinedAtLabel: "عضو حالي",
    })),
    invites: invites.map((invite): OrganizationInviteDisplay => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      status: invite.status,
      expiresLabel: formatInviteExpiry(invite.expiresAt),
    })),
    authUserId: session.context.userId,
    currentMembershipRole: currentOrganization.membership?.role ?? null,
    currentTenantRole: currentOrganization.membership?.tenantRole ?? session.context.organizationRole ?? null,
  };
}
