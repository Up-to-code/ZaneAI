import { type BetterAuthOptions } from "better-auth/minimal";
import { anonymous } from "better-auth/plugins/anonymous";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { expo } from "@better-auth/expo";

import { internal } from "../_generated/api";
import authConfig from "../auth.config";

const appScheme = "zane-ai://";
const localWebOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const localExpoOrigins = ["exp://**", "exps://**"];

function normalizeWebOrigin(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

function normalizeTrustedOrigin(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.includes("*")) {
    return trimmed;
  }

  if (trimmed.endsWith("://")) {
    return trimmed;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

function readWebOriginsFromEnv() {
  const rawOrigins = [
    process.env.SITE_URL,
    process.env.ZANEAI_WEB_URL,
    process.env.WEB_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ].flatMap((value) => value?.split(",") ?? []);

  return Array.from(new Set(rawOrigins.map(normalizeWebOrigin).filter((origin): origin is string => Boolean(origin))));
}

function readTrustedOriginsFromEnv() {
  const rawOrigins = [
    process.env.BETTER_AUTH_TRUSTED_ORIGINS,
    process.env.TRUSTED_ORIGINS,
  ].flatMap((value) => value?.split(",") ?? []);

  return Array.from(
    new Set(rawOrigins.map(normalizeTrustedOrigin).filter((origin): origin is string => Boolean(origin))),
  );
}

function getTrustedWebOrigins() {
  return Array.from(new Set([...readWebOriginsFromEnv(), ...localWebOrigins]));
}

function getTrustedNativeOrigins() {
  return Array.from(new Set([appScheme, ...localExpoOrigins]));
}

export function createAuthOptions(ctx: { runMutation?: Function["prototype"] } | any) {
  const webOrigins = getTrustedWebOrigins();
  const nativeOrigins = getTrustedNativeOrigins();
  const extraTrustedOrigins = readTrustedOriginsFromEnv();
  const siteUrl = webOrigins[0];
  const socialProviders = {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            overrideUserInfoOnSignIn: true,
          },
        }
      : {}),
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? {
          apple: {
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
          },
        }
      : {}),
  };

  return {
    baseURL: process.env.BETTER_AUTH_URL || process.env.CONVEX_SITE_URL,
    basePath: "/api/auth",
    trustedOrigins: [...nativeOrigins, ...webOrigins, ...extraTrustedOrigins],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders,
    plugins: [
      anonymous({
        generateName: async () => "Guest",
        emailDomainName: "guest.zayon.ai",
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          if (!ctx?.runMutation) {
            return;
          }

          await ctx.runMutation(internal.auth.internal.anonymousLink.linkAnonymousAccount, {
            anonymousAuthUserId: anonymousUser.user.id,
            newAuthUserId: newUser.user.id,
            newUserName: newUser.user.name,
            newUserEmail: newUser.user.email,
          });
        },
      }),
      expo(),
      convex({
        authConfig,
      }),
      ...(siteUrl ? [crossDomain({ siteUrl })] : []),
    ],
  } satisfies BetterAuthOptions;
}
