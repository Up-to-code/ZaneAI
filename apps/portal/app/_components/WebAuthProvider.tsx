"use client";

import { useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const FALLBACK_CONVEX_URL = "https://placeholder.convex.invalid";

function getPortalConvexUrl() {
  return process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
}

export default function WebAuthProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(
    () => new ConvexReactClient(getPortalConvexUrl() || FALLBACK_CONVEX_URL),
    [],
  );

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
