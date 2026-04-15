import { StyleSheet, View, Pressable, Platform, KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, User, LogIn } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { useAuthSession } from "@/auth/useAuthSession";
import { useTheme } from "@/foundation/theme/ThemeProvider";

export default function EmailOptionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { canUpgrade } = useAuthSession();

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
      gap: 40,
      marginTop: -20,
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
      gap: 16,
    },
    mainBtn: {
      height: 64,
      backgroundColor: colors.textPrimary,
    },
    secondaryBtn: {
      backgroundColor: colors.surfaceRaised,
      height: 64,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.divider,
    },
  });

  return (
    <Screen style={styles.container}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
          <Text variant="title" style={styles.headerTitle}>Account Access</Text>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
            <Text variant="display" style={styles.display}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              {canUpgrade
                ? "Choose sign in or account creation. Anonymous research merges into your account."
                : "Securely sign in to your Zane-ai account or create a new one to get started."}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
            <Button
              testID="auth.login"
              label="Log In"
              leading={<LogIn size={20} color={colors.background} />}
              variant="primary"
              onPress={() => router.push("/(auth)/login")}
              style={styles.mainBtn}
              textStyle={{ color: colors.background }}
            />
            
            <Button
              testID="auth.signup"
              label="Create an Account"
              leading={<User size={20} color={colors.textPrimary} />}
              variant="secondary"
              onPress={() => router.push("/(auth)/register")}
              style={styles.secondaryBtn}
              textStyle={{ color: colors.textPrimary }}
            />
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
}
