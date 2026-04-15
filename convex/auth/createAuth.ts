import { betterAuth } from "better-auth/minimal";

import { authComponent } from "./client";
import { createAuthOptions } from "./createAuthOptions";

export function createAuth(ctx: any) {
  return betterAuth({
    ...createAuthOptions(ctx),
    database: authComponent.adapter(ctx),
  });
}
