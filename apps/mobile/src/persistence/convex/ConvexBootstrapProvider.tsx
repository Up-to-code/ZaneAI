import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PropsWithChildren, useMemo } from "react";

type ConvexBootstrapProviderProps = PropsWithChildren;

export function ConvexBootstrapProvider({ children }: ConvexBootstrapProviderProps) {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  const client = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl, { unsavedChangesWarning: false }) : null),
    [convexUrl],
  );

  if (!client) {
    return children;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
