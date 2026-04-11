import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from "react-native";
import { useMemo } from "react";

import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type Variant = "display" | "title" | "body" | "label" | "caption";
type Tone = "primary" | "secondary" | "muted" | "accent";

type TextProps = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
};

export function Text({ style, variant = "body", tone = "primary", ...props }: TextProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <RNText style={[styles.base, styles[variant], styles[tone], style]} {...props} />;
}

const createStyles = (colors: any) => StyleSheet.create({
  base: {
    color: colors.textPrimary,
    fontFamily: "Manrope_500Medium",
  },
  display: theme.typography.display,
  title: theme.typography.title,
  body: theme.typography.body,
  label: theme.typography.label,
  caption: theme.typography.caption,
  primary: {
    color: colors.textPrimary,
  },
  secondary: {
    color: colors.textSecondary,
  },
  muted: {
    color: colors.textMuted,
  },
  accent: {
    color: colors.accent,
  },
});
