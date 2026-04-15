import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import * as Linking from "expo-linking";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

import {
  authClient,
  betterAuthStorage,
  FALLBACK_CONVEX_URL,
  getAuthBaseUrl,
  isAuthConfigured,
  signInAnonymously,
} from "@/auth/authClient";
import { registerAnalyticsClient } from "@/persistence/analytics/track";
import { getConvexUrl } from "@/runtime/expoRuntime";
import { AppBootScreen } from "@/shell/components/AppBootScreen";
import { useAppStore } from "@/store";

type AuthProviderProps = PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
  const authConfigured = isAuthConfigured();
  const session = authClient.useSession();
  const guestMode = useAppStore((state) => state.guestMode);
  const comparePropertyIds = useAppStore((state) => state.comparePropertyIds);
  const activeThreadId = useAppStore((state) => state.activeThreadId);
  const setGuestMirrorComparePropertyIds = useAppStore((state) => state.setGuestMirrorComparePropertyIds);
  const setGuestMirrorActiveThreadId = useAppStore((state) => state.setGuestMirrorActiveThreadId);
  const [hydrated, setHydrated] = useState(!authConfigured);
  const [bootstrappingGuest, setBootstrappingGuest] = useState(false);
  const [guestRecoveryAttempted, setGuestRecoveryAttempted] = useState(false);
  const [pendingTimedOut, setPendingTimedOut] = useState(false);
  const convexUrl = getConvexUrl();
  const client = useMemo(
    () =>
      new ConvexReactClient(convexUrl || FALLBACK_CONVEX_URL, {
        unsavedChangesWarning: false,
        expectAuth: authConfigured,
      }),
    [authConfigured, convexUrl],
  );

  useEffect(() => {
    registerAnalyticsClient(client);
  }, [client]);

  const isBootstrapping = session.isPending || bootstrappingGuest;

  useEffect(() => {
    if (!authConfigured) {
      setHydrated(true);
      return;
    }
    void betterAuthStorage
      .hydrate()
      .then(() => authClient.getSession().catch(() => null))
      .finally(() => setHydrated(true));
  }, [authConfigured]);

  // Fail-safe for hydration (AsyncStorage can sometimes hang)
  useEffect(() => {
    if (hydrated) return;
    const failSafeId = setTimeout(() => {
      console.warn("[auth] Hydration took too long, forcing ready state");
      setHydrated(true);
    }, 5000);
    return () => clearTimeout(failSafeId);
  }, [hydrated]);

  useEffect(() => {
    if (!authConfigured || !hydrated || !isBootstrapping) {
      setPendingTimedOut(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      console.warn("[auth] Bootstrap took too long, bypassing boot screen");
      setPendingTimedOut(true);
    }, 3500);

    return () => clearTimeout(timeoutId);
  }, [authConfigured, hydrated, isBootstrapping]);

  useEffect(() => {
    if (!guestMode) {
      setGuestRecoveryAttempted(false);
      return;
    }

    if (session.data?.session) {
      setGuestRecoveryAttempted(false);
    }
  }, [guestMode, session.data?.session]);

  useEffect(() => {
    if (!guestMode) {
      return;
    }

    setGuestMirrorComparePropertyIds(comparePropertyIds);
  }, [comparePropertyIds, guestMode, setGuestMirrorComparePropertyIds]);

  useEffect(() => {
    if (!guestMode || !activeThreadId) {
      return;
    }

    setGuestMirrorActiveThreadId(activeThreadId);
  }, [activeThreadId, guestMode, setGuestMirrorActiveThreadId]);

  useEffect(() => {
    if (!authConfigured || !hydrated || !guestMode || session.data?.session || bootstrappingGuest || guestRecoveryAttempted) {
      return;
    }

    if (session.isPending && !pendingTimedOut) {
      return;
    }

    let cancelled = false;
    setBootstrappingGuest(true);
    setGuestRecoveryAttempted(true);

    void signInAnonymously()
      .catch((error) => {
        console.warn("[auth] Guest session recovery failed", error);
      })
      .finally(() => {
        if (!cancelled) {
          setBootstrappingGuest(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    authConfigured,
    bootstrappingGuest,
    guestMode,
    guestRecoveryAttempted,
    hydrated,
    pendingTimedOut,
    session.data?.session,
    session.isPending,
  ]);

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
    return (
      <AppBootScreen
        title="Opening Zane-AI"
        subtitle="Restoring local session state."
      />
    );
  }

  if (authConfigured && !pendingTimedOut && isBootstrapping) {
    return (
      <AppBootScreen
        title="Opening Zane-AI"
        subtitle="Preparing your secure session."
      />
    );
  }


  if (!authConfigured) {
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
    scheme: "zane-ai",
  });
}

export function getPublicAuthBaseUrl() {
  return getAuthBaseUrl();
}
