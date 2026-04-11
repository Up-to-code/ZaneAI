import { Redirect } from "expo-router";

import { useAppStore } from "@/store";

export default function IndexScreen() {
  const hydrationComplete = useAppStore((state) => state.hydrationComplete);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!hydrationComplete) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/(app)" : "/(auth)"} />;
}
