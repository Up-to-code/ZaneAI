import { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AuthProvider } from "@/auth/AuthProvider";
import { ThemeProvider, useTheme } from "@/foundation/theme/ThemeProvider";
import { SessionTracker } from "@/persistence/analytics/SessionTracker";

export function AppProviders({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <ThemedAppChrome>{children}</ThemedAppChrome>
    </ThemeProvider>
  );
}

function ThemedAppChrome({ children }: PropsWithChildren) {
  const { resolvedColorScheme, colors } = useTheme();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardProvider>
          <AuthProvider>
            <SessionTracker>
              <StatusBar style={resolvedColorScheme === "dark" ? "light" : "dark"} />
              {children}
            </SessionTracker>
          </AuthProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
