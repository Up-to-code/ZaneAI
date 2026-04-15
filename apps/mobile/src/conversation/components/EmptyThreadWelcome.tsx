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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

/** Simple breathing logo animation — scales very subtly */
function BreathingLogo({ colors }: { colors: any }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={72} height={72} viewBox="0 0 48 48" fill="none">
        <Path
          d="M9 10H39L16 38H39"
          stroke={colors.textPrimary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M31 10L9 38"
          stroke={colors.accent}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}

export function EmptyThreadWelcome() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <View style={styles.logoWrap}>
        <BreathingLogo colors={colors} />
      </View>
      <View style={styles.content}>
        <Text variant="title" style={styles.title}>
          How can I help?
        </Text>
        <Text tone="muted" style={styles.subtitle}>
          Ask me about properties, neighborhoods, or market trends.
        </Text>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxxl,
    gap: theme.spacing.xl,
    backgroundColor: "transparent",
    position: "relative",
    overflow: "hidden",
  },
  backgroundOrb: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 220,
    opacity: 0.05,
    zIndex: 0,
  },
  backgroundGlow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 260,
    opacity: 0.25,
    borderWidth: 1,
    zIndex: 0,
  },
  logoWrap: {
    marginBottom: theme.spacing.md,
    zIndex: 10,
  },
  content: {
    alignItems: "center",
    gap: theme.spacing.xs,
    zIndex: 10,
  },
  title: {
    color: colors.textPrimary,
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 240,
    color: colors.textSecondary,
  },
});



