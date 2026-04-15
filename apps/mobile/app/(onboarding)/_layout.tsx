import { Redirect, Stack } from "expo-router";

import { useAuthSession } from "@/auth/useAuthSession";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";

export default function OnboardingLayout() {
  const hydrationComplete = useAppStore((state) => state.hydrationComplete);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);
  const { canAccessApp, isReady } = useAuthSession();
  const { colors } = useTheme();

  if (!hydrationComplete || !isReady) {
    return null;
  }

  if (!canAccessApp) {
    return <Redirect href="/(auth)" />;
  }

  if (onboardingComplete) {
    return <Redirect href="/(app)" />;
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
      <Stack.Screen name="budget" />
      <Stack.Screen name="types" />
    </Stack>
  );
}
