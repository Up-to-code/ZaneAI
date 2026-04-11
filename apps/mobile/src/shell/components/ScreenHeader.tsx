import { Pressable, StyleSheet, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useMemo } from "react";
import { Bookmark, CircleUserRound, Menu } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LogoMark } from "@/foundation/icons/LogoMark";
import { IconButton } from "@/foundation/primitives/IconButton";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  showCopy?: boolean;
};

export function ScreenHeader({ eyebrow, title, subtitle, showCopy = true }: ScreenHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);
  const pathname = usePathname();
  const router = useRouter();
  const isSavedScreen = pathname.endsWith("/saved");

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.sideSlot}>
          <IconButton 
            active={pathname === "/menu"}
            accessibilityLabel="Open menu"
            onPress={() => router.navigate("/(app)/menu")}
          >
            <Menu size={18} color={colors.textSecondary} />
          </IconButton>
        </View>

        <View style={styles.centerSlot}>
          <Pressable
            style={styles.brandLockup}
            onPress={() => router.navigate("/")}
            accessibilityLabel="Go to chat"
          >
            <LogoMark size={22} />
            <Text variant="caption" style={styles.brandText}>
              ZAYON
            </Text>
          </Pressable>
        </View>

        <View style={[styles.sideSlot, styles.rightSlot]}>
          <IconButton
            active={isSavedScreen}
            accessibilityLabel="Open saved properties"
            onPress={() => router.navigate("/(app)/saved")}
          >
            <Bookmark size={18} color={colors.textPrimary} />
          </IconButton>
          <IconButton 
            active={pathname === "/profile"}
            accessibilityLabel="Open profile"
            onPress={() => router.navigate("/(app)/profile")}
          >
            <CircleUserRound size={18} color={colors.textSecondary} />
          </IconButton>
        </View>
      </View>

      {showCopy ? (
        <View style={styles.copyBlock}>
          <Text variant="caption" tone="muted" style={styles.eyebrow}>
            {eyebrow}
          </Text>
          <Text variant="title" style={styles.title}>
            {title}
          </Text>
          <Text tone="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: any, insets: any) => StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: insets.top + 4, // ultra-tight for visionary feel
    paddingBottom: theme.spacing.xs, // reduced
    gap: theme.spacing.sm, // tighter gap
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  sideSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  rightSlot: {
    justifyContent: "flex-end",
  },
  centerSlot: {
    flex: 1,
    alignItems: "center",
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  brandText: {
    letterSpacing: 2,
    color: colors.textPrimary,
    fontFamily: theme.typography.label.fontFamily,
    fontSize: 11,
  },
  copyBlock: {
    gap: theme.spacing.xs,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    maxWidth: 280,
  },
  subtitle: {
    maxWidth: 320,
  },
});
