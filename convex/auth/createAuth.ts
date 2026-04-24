import { betterAuth } from "better-auth/minimal";

import { authComponent } from "./client";
import { createAuthOptions } from "./createAuthOptions";

type AuthAdapterCtx = Parameters<typeof authComponent.adapter>[0];

export function createAuth(ctx: AuthAdapterCtx) {
  return betterAuth({
    ...createAuthOptions(ctx),
    database: authComponent.adapter(ctx),
  });
}
