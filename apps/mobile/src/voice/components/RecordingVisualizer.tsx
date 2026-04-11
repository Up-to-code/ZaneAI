import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

const BAR_COUNT = 5;

function AnimatedBar({ index, active }: { index: number; active: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const height = useSharedValue(4);

  useEffect(() => {
    if (active) {
      // Create a staggered random-looking animation
      const delay = index * 100;
      setTimeout(() => {
        height.value = withRepeat(
          withSequence(
            withTiming(24, { duration: 300, easing: Easing.inOut(Easing.ease) }),
            withTiming(4, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          ),
          -1, // Loop infinitely
          true, // Reverse
        );
      }, delay);
    } else {
      height.value = withTiming(4, { duration: 200 });
    }
  }, [active, height, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}

export function RecordingVisualizer({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <AnimatedBar key={i} index={i} active={active} />
      ))}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 52, // Same base height as chat input to keep layout stable
  },
  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
