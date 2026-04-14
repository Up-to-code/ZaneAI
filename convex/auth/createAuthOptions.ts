import { type BetterAuthOptions } from "better-auth/minimal";
import { convex } from "@convex-dev/better-auth/plugins";

import authConfig from "../auth.config";

export function createAuthOptions() {
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
    basePath: "/api/auth",
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders,
    plugins: [
      convex({
        authConfig,
      }),
    ],
  } satisfies BetterAuthOptions;
}
