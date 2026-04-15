import { Pressable, StyleSheet, View } from "react-native";
import { useMemo } from "react";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type ConversationStatusBannerProps = {
  title: string;
  body: string;
  tone?: "info" | "warning" | "error";
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
};

export function ConversationStatusBanner({
  title,
  body,
  tone = "info",
  actionLabel,
  onAction,
  onDismiss,
}: ConversationStatusBannerProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.container,
        tone === "warning" ? styles.warning : null,
        tone === "error" ? styles.error : null,
      ]}
    >
      <View style={styles.copy}>
        <Text variant="label" style={styles.title}>{title}</Text>
        <Text tone="secondary" style={styles.body}>{body}</Text>
      </View>

      {actionLabel && onAction ? (
        <Pressable style={styles.action} onPress={onAction}>
          <Text variant="caption" style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}

      {onDismiss ? (
        <Pressable style={styles.dismiss} onPress={onDismiss}>
          <Text variant="caption" tone="secondary">Dismiss</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: theme.spacing.sm,
  },
  warning: {
    borderColor: colors.accent,
  },
  error: {
    borderColor: "#EF4444",
  },
  copy: {
    gap: theme.spacing.xs,
  },
  title: {
    color: colors.textPrimary,
  },
  body: {
    lineHeight: 20,
  },
  action: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  actionText: {
    color: colors.textPrimary,
  },
  dismiss: {
    alignSelf: "flex-start",
  },
});
