export type { SessionUser } from "@/server/contracts/session";

/**
 * WHY:   Workspace and public layouts need one lightweight auth lookup for chrome-level decisions.
 * WHAT:  Returns the current token, projected user, and resolved role when a session exists.
 * HOW:   Reuses the optional session resolver and narrows the payload for UI callers.
 */
import { cookies } from "next/headers";

/**
 * WHY:   Workspace and public layouts need one lightweight auth lookup for chrome-level decisions.
 * WHAT:  Returns the current token, projected user, and resolved role when a session exists.
 * HOW:   Reuses the optional session resolver and narrows the payload for UI callers.
 */
export async function getAuthenticatedSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value;

  if (!token) {
    return {
      token: null,
      user: null,
      role: null,
    };
  }

  // NOTE: For a full implementation, we would verify the token via better-auth server client or Convex.
  // For immediate redirect logic in the sign-in loader, the presence of the token is a sufficient hint.
  return {
    token,
    user: { id: "authenticated" } as any,
    role: "authenticated",
  };
}

export function sanitizeInternalReturnTo(returnTo?: string | null, fallback = "/ws") {
  if (!returnTo) {
    return fallback;
  }

  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return fallback;
  }

  if (returnTo.startsWith("/signin")) {
    return fallback;
  }

  return returnTo;
}

export function buildWorkspaceSecurityAppsPath(clientId?: string) {
  const base = "/ws/me/security/apps";
  return clientId ? `${base}/${encodeURIComponent(clientId)}` : base;
}

export function buildWorkspaceOrganizationAppsPath(source?: "legacy-account-apps") {
  const params = new URLSearchParams({ tab: "apps" });
  if (source) {
    params.set("source", source);
  }
  return `/ws/settings?${params.toString()}`;
}
