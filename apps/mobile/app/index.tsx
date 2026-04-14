import { Redirect } from "expo-router";

import { useAuthSession } from "@/auth/useAuthSession";
import { useAppStore } from "@/store";

export default function IndexScreen() {
  const hydrationComplete = useAppStore((state) => state.hydrationComplete);
  const { canAccessApp, isReady } = useAuthSession();

  if (!hydrationComplete || !isReady) {
    return null;
  }

  return <Redirect href={canAccessApp ? "/(app)" : "/(auth)"} />;
}
