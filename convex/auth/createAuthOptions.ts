import { type BetterAuthOptions } from "better-auth/minimal";
import { anonymous } from "better-auth/plugins/anonymous";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";

import { internal } from "../_generated/api";
import authConfig from "../auth.config";

export function createAuthOptions(ctx: { runMutation?: Function["prototype"] } | any) {
  const socialProviders = {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    trustedOrigins: [process.env.SITE_URL || "http://localhost:3000"],
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
      },
    },
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
      convex({
        authConfig,
      }),
      crossDomain({
        siteUrl: process.env.SITE_URL || "http://localhost:3000",
      }),
    ],
  } satisfies BetterAuthOptions;
}
