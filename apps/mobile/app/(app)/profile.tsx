import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Settings, LogOut, Shield, ChevronRight, Bell, Heart, CreditCard, ArrowLeft, SunMoon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { authClient, deleteAnonymousAccount } from "@/auth/authClient";
import { useAuthSession } from "@/auth/useAuthSession";
import { resetE2EAuthState } from "@/e2e/store";
import { useAppStore } from "@/store";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, appearanceMode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user, isAuthenticated, isGuest } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);
  const setGuestMode = useAppStore((state) => state.setGuestMode);
  const clearGuestMirror = useAppStore((state) => state.clearGuestMirror);
  const setComparePropertyIds = useAppStore((state) => state.setComparePropertyIds);
  const resetConversationState = useAppStore((state) => state.resetConversationState);
  const setSelectedPropertyId = useAppStore((state) => state.setSelectedPropertyId);

  const handleLogout = () => {
    if (e2eQaMode) {
      resetE2EAuthState();
      router.replace("/(auth)");
      return;
    }
    if (isGuest) {
      void deleteAnonymousAccount().catch(() => authClient.signOut().catch(() => null));
      clearGuestMirror();
      setComparePropertyIds([]);
      setSelectedPropertyId(null);
      resetConversationState();
      setGuestMode(false);
      router.replace("/(auth)");
      return;
    }
    if (isAuthenticated) {
      void authClient.signOut();
    }
  };

  const displayName = isGuest ? "Anonymous Session" : user?.name ?? user?.email ?? "Ahmed Mansour";
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const menuGroups = [
    {
      label: "Account",
      items: [
        { id: "pref", label: "AI Search Style", icon: <Settings size={18} color={colors.accent} /> },
        { id: "appearance", label: "Appearance", icon: <SunMoon size={18} color={colors.textPrimary} />, onPress: () => router.push("/(app)/appearance") },
      ]
    },
    {
      label: "Security",
      items: [
        { id: "security", label: "Login & Security", icon: <Shield size={18} color={colors.textPrimary} /> },
        { id: "privacy", label: "Memory & Privacy", icon: <Heart size={18} color={colors.textPrimary} /> },
      ]
    },
    {
      label: "Services",
      items: [
        { id: "billing", label: "Subscription", icon: <CreditCard size={18} color={colors.accent} /> },
        { id: "notif", label: "Market Alerts", icon: <Bell size={18} color={colors.textPrimary} /> },
      ]
    }
  ];

  return (
    <Screen safe={false}>
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <Pressable accessibilityLabel="Back" style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.springify()} style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || "Z"}</Text>
            </View>
          </View>
          <View style={styles.heroText}>
            <Text variant="display" style={styles.userName}>{displayName}</Text>
          </View>
        </Animated.View>

        {isGuest && (
          <View style={styles.authPrompt}>
            <Pressable style={styles.loginBtn} onPress={() => router.push("/(auth)")}>
              <Text style={styles.loginBtnText}>Log In to Sync Research</Text>
              <ChevronRight size={16} color={colors.background} />
            </Pressable>
          </View>
        )}

        <View style={styles.menu}>
          {menuGroups.map((group) => (
            <View key={group.label} style={styles.groupWrapper}>
              <Text variant="caption" tone="muted" style={styles.groupLabel}>{group.label}</Text>
              <View style={styles.groupCard}>
                {group.items.map((item, idx) => (
                  <View key={item.id}>
                    <Pressable style={styles.item} onPress={() => item.onPress?.()}>
                      <View style={styles.itemMain}>
                        <View style={styles.itemIconBox}>
                          {item.icon}
                        </View>
                        <View style={styles.itemTextWrap}>
                          <Text variant="body" style={styles.itemLabel}>{item.label}</Text>
                        </View>
                      </View>
                      <ChevronRight size={14} color={colors.textMuted} />
                    </Pressable>
                    {idx < group.items.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.signOutBtn} onPress={handleLogout}>
            <LogOut size={18} color={colors.textPrimary} />
            <Text style={styles.signOutText}>{isGuest ? "Reset session" : "Sign Out"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    position: "absolute",
    left: 20,
    zIndex: 100,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  hero: {
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
    marginTop: 12,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
    lineHeight: 34,
    letterSpacing: -1,
    textAlign: "center",
    includeFontPadding: false,
  },
  heroText: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  authPrompt: {
    marginBottom: 40,
    alignItems: "center",
    gap: 12,
  },
  loginBtn: {
    backgroundColor: colors.textPrimary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  loginBtnText: {
    color: colors.background,
    fontWeight: "800",
    fontSize: 14,
  },
  menu: {
    gap: 24,
  },
  groupWrapper: {
    gap: 10,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: "hidden",
  },
  groupLabel: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 10,
    marginLeft: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  itemIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  itemTextWrap: {
    gap: 2,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 68,
  },
  footer: {
    marginTop: 60,
    paddingTop: 24,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    paddingVertical: 18,
    borderRadius: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
