import { cache } from "react";
import { cookies } from "next/headers";
import { DomainError } from "@/server/contracts/errors";
import type { ProfileSummary } from "@/server/contracts/profiles";
import type { SessionContext } from "@/server/contracts/session";
import { convexProfilesRepository } from "@/server/infrastructure/convex/auth/profiles";
import { convexSessionsRepository } from "@/server/infrastructure/convex/auth/session";

export type ResolvedSession = {
  token: string;
  context: SessionContext;
  profile: ProfileSummary | null;
};

type SessionDependencies = {
  getToken?: () => Promise<string | null>;
  getClerkContext?: () => Promise<unknown>;
  sessionsRepository?: typeof convexSessionsRepository;
  profilesRepository?: typeof convexProfilesRepository;
};

function decodeJwtExp(token: string) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isExpiredJwt(token: string) {
  const exp = decodeJwtExp(token);
  if (exp === null) {
    return false;
  }
  return (exp * 1000) <= Date.now();
}

function parseProviderError(error: unknown) {
  if (error && typeof error === "object") {
    const status = "status" in error ? (error as { status?: unknown }).status : undefined;
    const errors = "errors" in error ? (error as { errors?: Array<{ code?: string; message?: string }> }).errors : undefined;
    if (status === 404 && Array.isArray(errors) && errors.some((entry) => entry.code === "resource_not_found")) {
      return "missing_jwt_template";
    }
  }

  if (!(error instanceof Error)) {
    return null;
  }

  try {
    const parsed = JSON.parse(error.message) as { code?: string; message?: string };
    if (parsed.code === "NoAuthProvider") {
      return "no_auth_provider";
    }
  } catch {
    return null;
  }

  return null;
}

function toSessionContext(sessionUser: Awaited<ReturnType<typeof convexSessionsRepository.getCurrent>>, profile: ProfileSummary | null): SessionContext {
  const role = profile?.role;
  return {
    userId: sessionUser?.id ?? "",
    email: sessionUser?.email ?? profile?.email ?? null,
    name: sessionUser?.name ?? profile?.name ?? null,
    image: sessionUser?.image ?? null,
    username: sessionUser?.username ?? profile?.username ?? null,
    role,
    brokerId: profile?.brokerId,
    redId: profile?.developerId,
    organizationId: sessionUser?.organizationId ?? null,
    organizationSlug: sessionUser?.organizationSlug ?? null,
    organizationRole: sessionUser?.organizationRole ?? null,
    organizationPermissions: sessionUser?.organizationPermissions ?? [],
    isActive: sessionUser?.isActive ?? profile?.isActive ?? false,
  };
}

async function getCookieToken() {
  const cookieStore = await cookies();
  return cookieStore.get("better-auth.session_token")?.value ?? null;
}

async function resolveOptionalSession(
  dependencies: Required<SessionDependencies>,
): Promise<ResolvedSession | null> {
  const token = await dependencies.getToken();
  await dependencies.getClerkContext();

  if (!token) {
    return null;
  }

  let sessionUser: Awaited<ReturnType<typeof convexSessionsRepository.getCurrent>> | null = null;
  try {
    sessionUser = await dependencies.sessionsRepository.getCurrent(token);
  } catch (error) {
    const providerError = parseProviderError(error);
    if (providerError === "missing_jwt_template") {
      throw new DomainError({
        code: "AUTH_CONFIGURATION_ERROR",
        message: "Auth token template is not configured for the web workspace.",
        status: 503,
      });
    }

    if (providerError === "no_auth_provider") {
      if (isExpiredJwt(token)) {
        return null;
      }

      throw new DomainError({
        code: "AUTH_CONFIGURATION_ERROR",
        message: "Convex auth provider is not configured for the current session token.",
        status: 503,
      });
    }

    throw error;
  }

  if (!sessionUser) {
    return null;
  }

  const profile = await dependencies.profilesRepository.getCurrent(token);

  return {
    token,
    context: toSessionContext(sessionUser, profile),
    profile,
  };
}

const defaultDependencies: Required<SessionDependencies> = {
  getToken: getCookieToken,
  getClerkContext: async () => null,
  sessionsRepository: convexSessionsRepository,
  profilesRepository: convexProfilesRepository,
};

const getOptionalSessionContextCached = cache(async () => resolveOptionalSession(defaultDependencies));

export async function getOptionalSessionContext(
  dependencies: SessionDependencies = {},
): Promise<ResolvedSession | null> {
  if (Object.keys(dependencies).length === 0) {
    return getOptionalSessionContextCached();
  }

  const resolvedDependencies: Required<SessionDependencies> = {
    ...defaultDependencies,
    ...dependencies,
  };

  return resolveOptionalSession(resolvedDependencies);
}

export async function requireSessionContext(
  dependencies: SessionDependencies = {},
): Promise<ResolvedSession> {
  const session = await getOptionalSessionContext(dependencies);
  if (!session) {
    throw new DomainError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      status: 401,
    });
  }

  return session;
}
