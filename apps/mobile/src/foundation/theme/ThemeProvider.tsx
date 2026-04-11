import { createContext, useContext, useEffect, useMemo, type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";

import { theme, lightColors, darkColors, type AppTheme } from "@/foundation/theme/tokens";

const ThemeContext = createContext<AppTheme>(theme);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const dynamicTheme = useMemo<AppTheme>(() => {
    return {
      ...theme,
      colors: isDark ? darkColors : lightColors,
    };
  }, [isDark]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(dynamicTheme.colors.background);
  }, [dynamicTheme.colors.background]);

  return <ThemeContext.Provider value={dynamicTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
