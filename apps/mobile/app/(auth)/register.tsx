import { useState } from "react";
import { ActivityIndicator, Alert, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Mail, User } from "lucide-react-native";

import { authClient } from "@/auth/authClient";
import { AuthField } from "@/auth/components/AuthField";
import { AuthScaffold } from "@/auth/components/AuthScaffold";
import { Button } from "@/foundation/primitives/Button";
import { Text } from "@/foundation/primitives/Text";
import { useTheme } from "@/foundation/theme/ThemeProvider";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Name, email, and password are all required.");
      return;
    }
    setPending(true);
    try {
      const result = await (authClient as any).signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (result?.error) {
        throw new Error(result.error.message ?? "Unable to create account.");
      }
      router.replace("/(app)");
    } catch (error) {
      Alert.alert("Registration failed", error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthScaffold
      title="Create account"
      subtitle="Set up your Zane-ai account so your saved properties and research threads sync everywhere."
      onBack={() => router.back()}
      footer={
        <Pressable onPress={() => router.back()}>
          <Text tone="secondary" style={{ textAlign: "center" }}>
            Already have an account? <Text style={{ color: colors.accent }}>Sign in</Text>
          </Text>
        </Pressable>
      }
    >
      <AuthField
        label="Full name"
        icon={User}
        placeholder="Ahmed Mansour"
        value={name}
        onChangeText={setName}
      />
      <AuthField
        label="Email"
        icon={Mail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
      />
      <AuthField
        label="Password"
        secureTextEntry
        placeholder="At least 8 characters"
        value={password}
        onChangeText={setPassword}
      />

      <Button
        label={pending ? "Creating account..." : "Create account"}
        onPress={() => void handleRegister()}
        disabled={pending}
      />

      {pending ? <ActivityIndicator color={colors.accent} /> : null}
    </AuthScaffold>
  );
}
