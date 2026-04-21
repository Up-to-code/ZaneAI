import { cache } from "react";
import type { ProfileSummary } from "@/server/contracts/profiles";
import type { SessionContext } from "@/server/contracts/session";

export type ResolvedSession = {
  token: string;
  context: SessionContext;
  profile: ProfileSummary | null;
};

type SessionDependencies = object;

const demoResolvedSession: ResolvedSession = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  context: {
    userId: "user-demo",
    email: "ahmed@zane-ai.sa",
    name: "Ahmed Mansour",
    image: null,
    username: "ahmedmansour",
    role: "developer",
    brokerId: undefined,
    redId: "org-demo",
    organizationId: "org-demo",
    organizationSlug: "nawy-demo",
    organizationRole: "manager",
    organizationPermissions: ["projects:write", "offers:write", "members:write"],
    isActive: true,
  },
  profile: {
    email: "ahmed@zane-ai.sa",
    name: "Ahmed Mansour",
    username: "ahmedmansour",
    role: "developer",
    showInOffersDirectory: true,
    isActive: true,
    authProvider: {
      id: "google",
      passwordManaged: false,
    },
  },
};

const getOptionalSessionContextCached = cache(async () => demoResolvedSession);

/**
 * WHY:   The static web demo still needs a stable session contract for shared server utilities and uploads.
 * WHAT:  Returns one deterministic demo session instead of resolving Clerk and Convex auth state.
 * HOW:   Preserves the existing API shape so dependent modules can compile unchanged.
 */
export async function getOptionalSessionContext(
  _dependencies: SessionDependencies = {},
): Promise<ResolvedSession | null> {
  return getOptionalSessionContextCached();
}

/**
 * WHY:   Shared server helpers still expect a required session accessor even in demo mode.
 * WHAT:  Returns the deterministic demo session.
 * HOW:   Mirrors the authenticated branch of the old implementation without any live auth checks.
 */
export async function requireSessionContext(
  _dependencies: SessionDependencies = {},
): Promise<ResolvedSession> {
  return demoResolvedSession;
}
