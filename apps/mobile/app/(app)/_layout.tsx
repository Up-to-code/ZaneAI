import { Redirect, Stack } from "expo-router";

import { theme } from "@/foundation/theme/tokens";
import { useAppStore } from "@/store";

export default function AppLayout() {
  const hydrationComplete = useAppStore((state) => state.hydrationComplete);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!hydrationComplete) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: "none",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="saved" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="compare" />
      <Stack.Screen name="property/[id]" />
    </Stack>
  );
}
