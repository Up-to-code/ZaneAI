import { useMemo } from "react";

import { authClient, isAuthConfigured } from "@/auth/authClient";
import { useAppStore } from "@/store";

export function useAuthSession() {
  const session = authClient.useSession();
  const guestMode = useAppStore((state) => state.guestMode);
  const e2eForceAuthScreen = useAppStore((state) => state.e2eForceAuthScreen);
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const e2eQaUser = useAppStore((state) => state.e2eQaUser);

  return useMemo(
    () => {
      if (e2eQaMode && e2eQaUser) {
        return {
          ...session,
          isReady: true,
          isAuthenticated: true,
          isGuest: false,
          canAccessApp: true,
          user: e2eQaUser,
        };
      }

      return {
        ...session,
        isReady: !isAuthConfigured() || !session.isPending,
        isAuthenticated: !isAuthConfigured() ? true : Boolean(session.data?.session),
        isGuest: guestMode && !session.data?.session,
        canAccessApp: e2eForceAuthScreen
          ? guestMode || Boolean(session.data?.session)
          : guestMode || !isAuthConfigured() || Boolean(session.data?.session),
        user: session.data?.user ?? null,
      };
    },
    [e2eForceAuthScreen, e2eQaMode, e2eQaUser, guestMode, session],
  );
}
