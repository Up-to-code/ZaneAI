import { Pressable, StyleSheet, type PressableProps } from "react-native";
import { useMemo, type ReactNode } from "react";

import { useTheme } from "@/foundation/theme/ThemeProvider";

type IconButtonProps = PressableProps & {
  children: ReactNode;
  active?: boolean;
};

export function IconButton({ children, active, style, ...props }: IconButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      style={(state) => [
        styles.base,
        active && styles.active,
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised, // Pure solid circle
  },
  active: {
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.9,
  },
});
