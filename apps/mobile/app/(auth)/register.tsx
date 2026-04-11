import { StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { ArrowLeft, User, Mail, Lock, ShieldCheck } from "lucide-react-native";

import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen style={styles.container}>
      <View style={styles.background}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
        <View style={[styles.aurora, { backgroundColor: colors.accent, opacity: 0.05 }]} />
      </View>

      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <Text variant="title" style={styles.headerTitle}>Join the Vision</Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
          <Text variant="display" style={styles.display}>Create Account</Text>
          <Text tone="secondary" style={styles.subtitle}>Enter the real estate operating system of the future.</Text>
        </Animated.View>

        <View style={styles.form}>
          <InputMock icon={<User size={18} color={colors.textMuted} />} label="Full Name" value="Ahmed Mansour" />
          <InputMock icon={<Mail size={18} color={colors.textMuted} />} label="Email Address" value="ahmed@zayon.ai" />
          <InputMock icon={<Lock size={18} color={colors.textMuted} />} label="Invite Code" value="VISIONARY-2024" />
        </View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actions}>
          <Button label="Initialize Profile" variant="primary" style={styles.mainBtn} />
          
          <View style={styles.perks}>
            <Perk icon={<ShieldCheck size={14} color={colors.success} />} label="Advanced Privacy Protocol Enabled" />
          </View>
        </Animated.View>
      </View>
    </Screen>
  );
}

function InputMock({ icon, label, value }: { icon: any; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.inputCard}>
      <View style={styles.inputIcon}>{icon}</View>
      <View style={styles.inputTextWrap}>
        <Text variant="caption" tone="muted">{label}</Text>
        <Text variant="body" style={{ fontWeight: "600" }}>{value}</Text>
      </View>
    </View>
  );
}

function Perk({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.perk}>
      {icon}
      <Text variant="caption" tone="secondary" style={{ fontSize: 10, letterSpacing: 0.5 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: theme.colors.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  aurora: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ rotate: "-15deg" }, { scale: 2 }],
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
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 40,
  },
  intro: {
    gap: 12,
  },
  display: {
    fontSize: 36,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.backgroundSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  inputTextWrap: {
    gap: 2,
  },
  actions: {
    gap: 24,
  },
  mainBtn: {
    height: 64,
  },
  perks: {
    alignItems: "center",
  },
  perk: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});
