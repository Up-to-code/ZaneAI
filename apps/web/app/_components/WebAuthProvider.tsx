"use client";

import { useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth/webAuthClient";
import { FALLBACK_CONVEX_URL, getWebConvexUrl, isWebAuthConfigured } from "@/lib/auth/runtime";

export default function WebAuthProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(
    () => new ConvexReactClient(getWebConvexUrl() || FALLBACK_CONVEX_URL),
    [],
  );

  if (!isWebAuthConfigured()) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>;
  }

  return (
    <ConvexBetterAuthProvider client={client} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
