import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, ShieldCheck, Mail } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";
import { AuthField } from "@/auth/components/AuthField";

export default function OtpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const authEmailDraft = useAppStore((state) => state.authEmailDraft);
  const setAuthEmailDraft = useAppStore((state) => state.setAuthEmailDraft);
  const styles = StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 60,
      paddingHorizontal: 24,
      gap: 16,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.divider,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: 1,
      textTransform: "uppercase",
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      gap: 48,
      marginTop: -40,
    },
    intro: {
      gap: 12,
    },
    display: {
      fontSize: 32,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    actions: {
      gap: 24,
    },
    mainBtn: {
      height: 64,
      backgroundColor: colors.textPrimary,
    },
    securitySeal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      opacity: 0.8,
    },
  });

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
          <Text variant="title" style={styles.headerTitle}>Verification</Text>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
            <Text variant="display" style={styles.display}>Check your identity</Text>
            <Text style={styles.subtitle}>
              Enter the email address tied to your Zane-ai account. We’ll use it to restore your saved search and research history.
            </Text>
          </Animated.View>

          <AuthField
            testID="auth.email"
            label="Email address"
            icon={Mail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="ahmed@zayon.ai"
            value={authEmailDraft}
            onChangeText={setAuthEmailDraft}
          />

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
            <Button
              testID="auth.email_continue"
              label="Continue"
              variant="primary"
              onPress={() => router.push("/(auth)/password")}
              style={styles.mainBtn}
              textStyle={{ color: colors.background }}
            />
          </Animated.View>

          <View style={styles.securitySeal}>
            <ShieldCheck size={14} color={colors.success} />
            <Text variant="caption" style={{ color: colors.success, fontSize: 10, letterSpacing: 1 }}>
              SECURE CHANNEL ENCRYPTED
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
