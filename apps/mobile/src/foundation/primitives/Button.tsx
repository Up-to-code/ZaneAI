import { Pressable, StyleSheet, View } from "react-native";
import { useMemo, type ComponentProps, type ReactNode } from "react";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type ButtonProps = ComponentProps<typeof Pressable> & {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  leading?: ReactNode;
  trailing?: ReactNode;
  textStyle?: ComponentProps<typeof Text>["style"];
};

export function Button({ 
  label, 
  variant = "primary", 
  style, 
  leading,
  trailing, 
  textStyle,
  ...props 
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={(state) => [
        styles.base,
        styles[variant],
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <Text 
        variant="label" 
        tone={variant === "primary" ? "primary" : "secondary"} 
        style={[styles.label, textStyle]}
      >
        {label}
      </Text>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </Pressable>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: theme.radii.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.textPrimary,
  },
  leading: {
    marginRight: theme.spacing.xs,
  },
  trailing: {
    marginLeft: theme.spacing.xs,
  },
});
