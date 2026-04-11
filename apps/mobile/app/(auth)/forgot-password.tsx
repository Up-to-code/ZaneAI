import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { AuthField } from "@/auth/components/AuthField";
import { AuthScaffold } from "@/auth/components/AuthScaffold";
import { Button } from "@/foundation/primitives/Button";
import { Text } from "@/foundation/primitives/Text";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <AuthScaffold
      title="Recover your account"
      subtitle="Enter your email to request a reset link. This screen now follows the same contrast, spacing, and scroll behavior as the rest of the auth flow."
      onBack={() => router.back()}
      footer={
        <Text tone="secondary" style={styles.footerText}>
          Identity verification may still be required before full access is restored.
        </Text>
      }
    >
      <AuthField autoCapitalize="none" autoCorrect={false} keyboardType="email-address" label="Email" placeholder="Enter your email" />
      <Button label="Request reset link" style={styles.mainButton} />
      <Button label="Back to log in" onPress={() => router.push("/(auth)/password")} style={styles.secondaryButton} variant="secondary" />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    minHeight: 56,
  },
  secondaryButton: {
    minHeight: 56,
  },
  footerText: {
    textAlign: "center",
  },
});
