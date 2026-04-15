import { StyleSheet, View } from "react-native";
import { useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { LogoMark } from "@/foundation/icons/LogoMark";

type AppBootScreenProps = {
  title?: string;
  subtitle?: string;
};

export function AppBootScreen({
  title = "Opening Zane-AI",
  subtitle = "Preparing your secure session.",
}: AppBootScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [scale]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Screen safe={false}>
      <View
        pointerEvents="none"
        style={[
          styles.backgroundOrb,
          { backgroundColor: colors.accent, top: insets.top + 60 },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.backgroundGlow,
          { borderColor: colors.divider, top: insets.top + 140 },
        ]}
      />

      <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
        <Animated.View style={[styles.logoWrap, animatedLogoStyle]}>
          <LogoMark size={64} />
        </Animated.View>

        <View style={styles.copy}>
          <Text variant="title" style={styles.title}>
            {title}
          </Text>
          <Text tone="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </Animated.View>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxxl,
    gap: theme.spacing.xl,
    backgroundColor: colors.background,
  },
  backgroundOrb: {
    position: "absolute",
    right: -72,
    width: 260,
    height: 260,
    borderRadius: 260,
    opacity: 0.08,
    zIndex: 0,
  },
  backgroundGlow: {
    position: "absolute",
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 320,
    opacity: 0.3,
    borderWidth: 1,
    zIndex: 0,
  },
  logoWrap: {
    marginBottom: theme.spacing.md,
    zIndex: 10,
  },
  copy: {
    alignItems: "center",
    gap: theme.spacing.xs,
    zIndex: 10,
  },
  title: {
    textAlign: "center",
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 22,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    maxWidth: 240,
  },
});

