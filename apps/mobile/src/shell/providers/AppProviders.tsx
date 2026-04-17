import { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from "@expo-google-fonts/cairo";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AuthProvider } from "@/auth/AuthProvider";
import { ThemeProvider, useTheme } from "@/foundation/theme/ThemeProvider";
import { SessionTracker } from "@/persistence/analytics/SessionTracker";
import { useAppStore } from "@/store";

export function AppProviders({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f7f7f5" }}>
        <ActivityIndicator size="small" color="#111111" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <ThemedAppChrome>{children}</ThemedAppChrome>
    </ThemeProvider>
  );
}

function ThemedAppChrome({ children }: PropsWithChildren) {
  const { resolvedColorScheme, colors } = useTheme();
  const hydrationComplete = useAppStore((state) => state.hydrationComplete);
  const setHydrationComplete = useAppStore((state) => state.setHydrationComplete);

  useEffect(() => {
    if (!hydrationComplete) {
      setHydrationComplete(true);
    }
  }, [hydrationComplete, setHydrationComplete]);

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
