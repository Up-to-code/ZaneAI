import { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { ThemeProvider } from "@/foundation/theme/ThemeProvider";
import { SessionTracker } from "@/persistence/analytics/SessionTracker";
import { ConvexBootstrapProvider } from "@/persistence/convex/ConvexBootstrapProvider";

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
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <ConvexBootstrapProvider>
              <SessionTracker>
                <StatusBar style="light" />
                {children}
              </SessionTracker>
            </ConvexBootstrapProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
