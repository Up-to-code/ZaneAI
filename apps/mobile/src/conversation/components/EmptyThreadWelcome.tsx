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
import Svg, { Path } from "react-native-svg";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

/** Breathing logo animation — scales and glows subtly */
function BreathingLogo({ colors }: { colors: any }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={64} height={64} viewBox="0 0 48 48" fill="none">
        <Path
          d="M9 10H39L16 38H39"
          stroke={colors.textPrimary}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M31 10L9 38"
          stroke={colors.accent}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}

export function EmptyThreadWelcome() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <BreathingLogo colors={colors} />
      <Text variant="title" style={styles.title}>
        How can I help?
      </Text>
      <Text tone="muted" style={styles.subtitle}>
        Ask me about properties, neighborhoods, or market trends.
      </Text>
    </Animated.View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  subtitle: {
    textAlign: "center",
    maxWidth: 260,
  },
});
