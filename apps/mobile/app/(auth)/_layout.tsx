import { Redirect, Stack } from "expo-router";
import { theme } from "@/foundation/theme/tokens";
import { useAppStore } from "@/store";

export default function AuthLayout() {
  const hydrationComplete = useAppStore((state) => state.hydrationComplete);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!hydrationComplete) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
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
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="password" />
      <Stack.Screen name="identity" />
    </Stack>
  );
}
