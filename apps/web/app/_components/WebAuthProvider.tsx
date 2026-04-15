"use client";

import { useEffect, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth/webAuthClient";
import { FALLBACK_CONVEX_URL, getWebConvexUrl, isWebAuthConfigured } from "@/lib/auth/runtime";

export default function WebAuthProvider({ children }: { children: React.ReactNode }) {
  const authConfigured = isWebAuthConfigured();
  const client = useMemo(
    () => new ConvexReactClient(getWebConvexUrl() || FALLBACK_CONVEX_URL),
    [],
  );

  useEffect(() => {
    if (!authConfigured) {
      return;
    }

    // Rehydrate better-auth from browser storage/cookies after refresh so auth-aware routes
    // can redirect immediately instead of stalling on an indeterminate session.
    void authClient.getSession().catch(() => null);
  }, [authConfigured]);

  if (!authConfigured) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>;
  }

  return (
    <ConvexBetterAuthProvider client={client} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
