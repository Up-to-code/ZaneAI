import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { AssistantStageEvent } from "@/conversation/assistantProtocol";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type AssistantStageProgressProps = {
  events: AssistantStageEvent[];
};

export function AssistantStageProgress({ events }: AssistantStageProgressProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const latest = [...events]
    .reverse()
    .find((event) => Boolean(event.route || event.specialist));
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.4, { duration: 700 }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  if (!latest) {
    return null;
  }

  const tone = latest.motionPreset ?? "assistant";

  return (
    <View style={[styles.container, styles[`container_${tone}`]]}>
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>
          {latest.route ? `${latest.route.toUpperCase()} MODE` : "ASSISTANT"}
        </Text>
        <Animated.View style={[styles.dot, styles[`dot_${tone}`], pulseStyle]} />
      </View>
      <Text style={styles.message}>{latest.message}</Text>
      <Text style={styles.meta}>
        {latest.specialist ?? "orchestrator"}
        {" • "}
        {latest.phase.replaceAll("_", " ")}
      </Text>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.md,
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    container_assistant: {
      borderColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    container_advisor: {
      borderColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    container_property: {
      borderColor: colors.accent,
      backgroundColor: colors.surfaceRaised,
    },
    container_funding: {
      borderColor: colors.border,
      backgroundColor: colors.backgroundSoft,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    eyebrow: {
      fontSize: 11,
      fontFamily: "Manrope_700Bold",
      color: colors.textSecondary,
      letterSpacing: 0.8,
    },
    message: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: "Manrope_600SemiBold",
      color: colors.textPrimary,
    },
    meta: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Manrope_500Medium",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 99,
    },
    dot_assistant: {
      backgroundColor: colors.textSecondary,
    },
    dot_advisor: {
      backgroundColor: colors.textSecondary,
    },
    dot_property: {
      backgroundColor: colors.accent,
    },
    dot_funding: {
      backgroundColor: colors.textPrimary,
    },
  });
