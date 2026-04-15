import { useMemo } from "react";

import { authClient, isAuthConfigured } from "@/auth/authClient";
import { useAppStore } from "@/store";

export function useAuthSession() {
  const session = authClient.useSession();
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
          isAnonymous: false,
          isGuest: false,
          canAccessApp: true,
          canUseAi: true,
          canUpgrade: false,
          user: e2eQaUser,
        };
      }

      const configured = isAuthConfigured();
      const user = session.data?.user ?? null;
      const isAnonymous = configured
        ? Boolean(user && "isAnonymous" in user && user.isAnonymous)
        : false;
      const hasSession = configured ? Boolean(session.data?.session) : true;

      return {
        ...session,
        isReady: !configured || !session.isPending,
        isAuthenticated: hasSession,
        isAnonymous,
        isGuest: isAnonymous,
        canAccessApp: e2eForceAuthScreen ? hasSession : hasSession,
        canUseAi: hasSession,
        canUpgrade: isAnonymous,
        user,
      };
    },
    [e2eForceAuthScreen, e2eQaMode, e2eQaUser, session],
  );
}
