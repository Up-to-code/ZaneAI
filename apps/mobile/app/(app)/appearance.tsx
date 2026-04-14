import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Check, Monitor, MoonStar, SunMedium } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import type { AppearanceMode } from "@/store/slices/preferenceSlice";

const OPTIONS: Array<{
  value: AppearanceMode;
  title: string;
  description: string;
  icon: "system" | "light" | "dark";
}> = [
  { value: "system", title: "System", description: "Follow your phone's current appearance automatically.", icon: "system" },
  { value: "light", title: "Light", description: "Bright surfaces and clear contrast for daytime browsing.", icon: "light" },
  { value: "dark", title: "Dark", description: "Low-glare surfaces for immersive browsing and night use.", icon: "dark" },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, appearanceMode, resolvedColorScheme, setAppearanceMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Screen style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable accessibilityLabel="Go back" style={styles.headerBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text variant="title" style={styles.headerTitle}>Appearance</Text>
          <Text variant="caption" tone="muted">System is currently using {resolvedColorScheme} mode.</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + theme.spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text variant="display" style={styles.heroTitle}>Choose your viewing mode</Text>
          <Text tone="secondary" style={styles.heroCopy}>
            Apply changes instantly across the app. Select System to keep Zane-ai synced with your device setting.
          </Text>
        </View>

        <View style={styles.optionGroup}>
          {OPTIONS.map((option) => {
            const selected = option.value === appearanceMode;
            return (
              <Pressable
                key={option.value}
                testID={`appearance.option.${option.value}`}
                style={[styles.optionCard, selected && styles.optionCardSelected]}
                onPress={() => setAppearanceMode(option.value)}
              >
                <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
                  <OptionIcon mode={option.icon} color={selected ? colors.background : colors.textPrimary} />
                </View>
                <View style={styles.optionText}>
                  <Text variant="body" style={styles.optionTitle}>{option.title}</Text>
                  <Text variant="caption" tone="secondary">{option.description}</Text>
                </View>
                <View
                  testID={selected ? `appearance.selected.${option.value}` : undefined}
                  style={[styles.checkWrap, selected && styles.checkWrapSelected]}
                >
                  {selected ? <Check size={16} color={colors.background} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

function OptionIcon({ mode, color }: { mode: "system" | "light" | "dark"; color: string }) {
  if (mode === "system") {
    return <Monitor size={18} color={color} />;
  }

  if (mode === "light") {
    return <SunMedium size={18} color={color} />;
  }

  return <MoonStar size={18} color={color} />;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      backgroundColor: `${colors.background}F2`,
    },
    headerBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.divider,
    },
    headerText: {
      flex: 1,
      gap: 2,
    },
    headerTitle: {
      fontSize: 18,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      gap: theme.spacing.xl,
    },
    hero: {
      gap: theme.spacing.sm,
    },
    heroTitle: {
      fontSize: 30,
    },
    heroCopy: {
      lineHeight: 22,
    },
    optionGroup: {
      gap: theme.spacing.md,
    },
    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      backgroundColor: colors.surface,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: colors.divider,
      padding: theme.spacing.lg,
    },
    optionCardSelected: {
      borderColor: colors.accent,
      backgroundColor: `${colors.accent}14`,
    },
    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surfaceRaised,
    },
    optionIconSelected: {
      backgroundColor: colors.accent,
    },
    optionText: {
      flex: 1,
      gap: 2,
    },
    optionTitle: {
      fontWeight: "700",
    },
    checkWrap: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    checkWrapSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
    },
  });
