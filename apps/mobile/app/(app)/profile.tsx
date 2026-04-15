import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Settings, LogOut, Shield, ChevronRight, Bell, Heart, CreditCard, ArrowRight, SunMoon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { authClient } from "@/auth/authClient";
import { useAuthSession } from "@/auth/useAuthSession";
import { resetE2EAuthState } from "@/e2e/store";
import { useAppStore } from "@/store";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, appearanceMode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { canUpgrade, user, isAuthenticated, isGuest } = useAuthSession();
  const e2eQaMode = useAppStore((state) => state.e2eQaMode);

  const handleLogout = () => {
    if (e2eQaMode) {
      resetE2EAuthState();
      router.replace("/(auth)");
      return;
    }
    if (isAuthenticated) {
      void authClient.signOut();
    }
  };

  const displayName = isGuest ? "Anonymous session" : user?.name ?? user?.email ?? "Zane-ai Member";
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const appearanceLabel =
    appearanceMode === "system"
      ? "Follow your phone setting"
      : `${appearanceMode[0].toUpperCase()}${appearanceMode.slice(1)} mode enabled`;

  const profileItems = [
    {
      id: "appearance",
      title: "Appearance",
      icon: <SunMoon size={20} color={colors.textPrimary} />,
      desc: appearanceLabel,
      testID: "profile.appearance",
      onPress: () => router.push("/(app)/appearance"),
    },
    {
      id: "pref",
      title: "AI Personalization",
      icon: <Settings size={22} color={colors.accent} />,
      desc: "Adjust confidence thresholds & search style",
    },
    {
      id: "security",
      title: "Account Security",
      icon: <Shield size={20} color={colors.textPrimary} />,
      desc: "2-Factor Authentication & session logs",
    },
    {
      id: "notif",
      title: "Market Reports",
      icon: <Bell size={20} color={colors.textPrimary} />,
      desc: "Weekly analytics and portfolio alerts",
    },
    {
      id: "billing",
      title: "Subscription Plan",
      icon: <CreditCard size={22} color={colors.accent} />,
      desc: "Manage your Premium Analytics access",
    },
    {
      id: "privacy",
      title: "Data & Privacy",
      icon: <Heart size={20} color={colors.textPrimary} />,
      desc: "Configure memory and identity protection",
    },
  ];

  return (
    <Screen style={styles.screen}>
      <View style={[styles.identityHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <View style={styles.identityBlock}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarLetter}>{initials.slice(0, 1) || "Z"}</Text>
            </View>
            <Text variant="body" style={styles.identityName}>{displayName}</Text>
          </View>

          <View style={styles.headerTitleWrap} />

          <Pressable accessibilityLabel="Go back" style={styles.headerBtn} onPress={() => router.back()}>
            <ArrowRight size={20} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 88, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.springify()} style={styles.heroBlock}>
          <View style={styles.bigAvatar}>
            <Text variant="title" style={styles.bigAvatarText}>{initials || "ZM"}</Text>
            <View style={styles.badge}>
              <Shield size={12} color={colors.background} />
            </View>
          </View>
          <View style={styles.heroText}>
            <Text variant="title" style={styles.userName} numberOfLines={2}>{displayName}</Text>
            <Text variant="label" tone="muted" style={styles.userStatus}>
              {isGuest
                ? "Upgrade any time. Anonymous chats and saved items merge into account."
                : user?.email ?? "Authenticated account"}
            </Text>
          </View>
        </Animated.View>

        {isGuest && canUpgrade ? (
          <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.upgradeCard}>
            <Text variant="label" style={styles.upgradeTitle}>Upgrade and keep everything</Text>
            <Text variant="caption" tone="secondary" style={styles.upgradeBody}>
              Sign in or create account. Threads, saved properties, and compare state follow you.
            </Text>
            <Pressable style={styles.upgradeAction} onPress={() => router.push("/(auth)")}>
              <Text variant="caption" style={styles.upgradeActionText}>Upgrade account</Text>
            </Pressable>
          </Animated.View>
        ) : null}

        <View style={styles.listContainer}>
          {profileItems.map((item, index) => (
            <ProfileListItem key={item.id} item={item} index={index} styles={styles} colors={colors} />
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.logoutBlock}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={20} color={colors.background} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

function ProfileListItem({ item, index, styles, colors }: any) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      layout={Layout.springify()}
      style={styles.itemWrapper}
    >
      <Pressable testID={item.testID} style={styles.profileItem} onPress={item.onPress}>
        <View
          style={[
            styles.iconWrap,
            item.id === "pref" || item.id === "billing" ? { backgroundColor: `${colors.accent}10` } : null,
          ]}
        >
          {item.icon}
        </View>
        <View style={styles.itemText}>
          <Text variant="body" style={styles.itemTitle}>{item.title}</Text>
          <Text variant="caption" tone="muted" style={styles.itemDesc}>{item.desc}</Text>
        </View>
        <ChevronRight size={16} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    identityHeader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: `${colors.background}FA`,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      height: 72,
    },
    headerTitleWrap: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    identityBlock: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    avatarMini: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarLetter: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "800",
    },
    identityName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    headerBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.divider,
    },
    miniAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      color: colors.background,
      fontSize: 10,
      fontWeight: "800",
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
    },
    heroBlock: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 32,
      gap: 20,
    },
    upgradeCard: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
      borderRadius: theme.radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    upgradeTitle: {
      color: colors.textPrimary,
    },
    upgradeBody: {
      lineHeight: 18,
    },
    upgradeAction: {
      alignSelf: "flex-start",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.pill,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    upgradeActionText: {
      color: colors.textPrimary,
    },
    bigAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 4,
      borderColor: colors.surface,
      position: "relative",
    },
    bigAvatarText: {
      color: colors.background,
      fontSize: 24,
      fontWeight: "900",
    },
    badge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.textPrimary,
      borderWidth: 3,
      borderColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    heroText: {
      flex: 1,
      gap: 4,
    },
    userName: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    userStatus: {
      fontSize: 9,
      letterSpacing: 1.5,
    },
    listContainer: {
      gap: 12,
    },
    itemWrapper: {
      width: "100%",
    },
    profileItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor: colors.backgroundSoft,
      justifyContent: "center",
      alignItems: "center",
    },
    itemText: {
      flex: 1,
      gap: 2,
    },
    itemTitle: {
      fontWeight: "700",
      fontSize: 15,
    },
    itemDesc: {
      fontSize: 12,
    },
    logoutBlock: {
      marginTop: 24,
      paddingBottom: 20,
    },
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      backgroundColor: colors.textPrimary,
      paddingVertical: 22,
      borderRadius: 24,
    },
    logoutText: {
      color: colors.background,
      fontWeight: "700",
      fontSize: 16,
    },
  });
