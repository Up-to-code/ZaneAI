import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import * as Linking from "expo-linking";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

import { authClient, betterAuthStorage, FALLBACK_CONVEX_URL, getAuthBaseUrl, isAuthConfigured } from "@/auth/authClient";
import { registerAnalyticsClient } from "@/persistence/analytics/track";
import { getConvexUrl } from "@/runtime/expoRuntime";

type AuthProviderProps = PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
  const [hydrated, setHydrated] = useState(!isAuthConfigured());
  const convexUrl = getConvexUrl();
  const client = useMemo(
    () => new ConvexReactClient(convexUrl || FALLBACK_CONVEX_URL, { unsavedChangesWarning: false }),
    [convexUrl],
  );

  useEffect(() => {
    registerAnalyticsClient(client);
  }, [client]);

  useEffect(() => {
    if (!isAuthConfigured()) {
      setHydrated(true);
      return;
    }
    void betterAuthStorage.hydrate().finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      const ott = typeof parsed.queryParams?.ott === "string" ? parsed.queryParams.ott : null;
      if (!ott) return;
      const authWithCrossDomain = authClient as any;
      const result = await authWithCrossDomain.crossDomain.oneTimeToken.verify({ token: ott });
      const sessionToken = result?.data?.session?.token;
      if (!sessionToken) return;
      await authClient.getSession({
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      });
      authWithCrossDomain.crossDomain.updateSession();
    };

    const subscription = Linking.addEventListener("url", (event) => {
      void handleUrl(event);
    });
    void Linking.getInitialURL().then((url) => {
      if (url) {
        void handleUrl({ url });
      }
    });
    return () => subscription.remove();
  }, []);

  if (!hydrated) {
    return null;
  }

  if (!isAuthConfigured()) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>;
  }

  return (
    <ConvexBetterAuthProvider client={client} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}

export function getOAuthCallbackUrl() {
  return Linking.createURL("/auth/callback", {
    scheme: "zayon",
  });
}

export function getPublicAuthBaseUrl() {
  return getAuthBaseUrl();
}
