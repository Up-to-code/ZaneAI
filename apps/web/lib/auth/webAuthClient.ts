"use client";

import { createAuthClient } from "better-auth/react";
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";
import { getWebAuthUrl, FALLBACK_CONVEX_URL } from "./runtime";

export const authClient = createAuthClient({
  baseURL: getWebAuthUrl() || FALLBACK_CONVEX_URL,
  plugins: [
    crossDomainClient(),
    convexClient(),
  ],
});
