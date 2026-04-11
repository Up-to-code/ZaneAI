import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type AuthScaffoldProps = {
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScaffold({ title, subtitle, onBack, children, footer }: AuthScaffoldProps) {
  const { colors } = useTheme();

  return (
    <Screen>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              {onBack ? (
                <Pressable
                  accessibilityLabel="Go back"
                  accessibilityRole="button"
                  onPress={onBack}
                  style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.divider }]}
                >
                  <ArrowLeft color={colors.textPrimary} size={20} />
                </Pressable>
              ) : (
                <View style={styles.backPlaceholder} />
              )}
            </View>

            <View style={styles.hero}>
              <Text variant="display" style={styles.title}>
                {title}
              </Text>
              <Text tone="secondary" style={styles.subtitle}>
                {subtitle}
              </Text>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.divider,
                },
              ]}
            >
              {children}
            </View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.xxl,
  },
  header: {
    minHeight: 44,
    justifyContent: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  backPlaceholder: {
    width: 44,
    height: 44,
  },
  hero: {
    gap: theme.spacing.md,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  footer: {
    gap: theme.spacing.md,
  },
});
