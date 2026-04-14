import { Redirect, Stack } from "expo-router";

import { useAuthSession } from "@/auth/useAuthSession";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";

export default function AppLayout() {
  const hydrationComplete = useAppStore((state) => state.hydrationComplete);
  const { canAccessApp, isReady } = useAuthSession();
  const { colors } = useTheme();

  if (!hydrationComplete || !isReady) {
    return null;
  }

  if (!canAccessApp) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: "none",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="saved" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="compare" />
      <Stack.Screen name="listing" />
      <Stack.Screen name="property/[id]" />
      <Stack.Screen name="broker/[id]" />
    </Stack>
  );
}
