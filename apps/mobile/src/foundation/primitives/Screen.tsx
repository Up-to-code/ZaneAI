import { SafeAreaView, View, StyleSheet, type ViewProps } from "react-native";
import { useMemo } from "react";

import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

export function Screen({ style, children, ...props }: ViewProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.content}>
      <View style={[styles.inner, style]} {...props}>
        {children}
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
