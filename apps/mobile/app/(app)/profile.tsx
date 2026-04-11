import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Settings, LogOut, Shield, ChevronRight, Bell, Heart, CreditCard, ArrowLeft, Share } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

import { useAppStore } from "@/store";

// Specific 'Brainstorm' palette
const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);

  const handleLogout = () => {
    setAuthenticated(false);
  };

  const profileItems = [
    { id: "pref", title: "AI Personalization", icon: <Settings size={22} color={colors.accent} />, desc: "Adjust confidence thresholds & search style" },
    { id: "security", title: "Account Security", icon: <Shield size={20} color={colors.textPrimary} />, desc: "2-Factor Authentication & session logs" },
    { id: "notif", title: "Market Reports", icon: <Bell size={20} color={colors.textPrimary} />, desc: "Weekly analytics and portfolio alerts" },
    { id: "billing", title: "Subscription Plan", icon: <CreditCard size={22} color={colors.accent} />, desc: "Manage your Premium Analytics access" },
    { id: "privacy", title: "Data & Privacy", icon: <Heart size={20} color={colors.textPrimary} />, desc: "Configure memory and identity protection" },
  ];

  return (
    <Screen style={styles.screen}>
      {/* Refined Trinity Header */}
      <View style={[styles.identityHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} onPress={() => router.dismissAll()}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text variant="title" style={styles.headerTitle}>Account</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.miniAvatar}>
              <Text style={styles.miniAvatarText}>AM</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 88, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Full Identity Hero (In Body) */}
        <Animated.View entering={FadeInDown.springify()} style={styles.heroBlock}>
          <View style={styles.bigAvatar}>
            <Text variant="title" style={styles.bigAvatarText}>AM</Text>
            <View style={styles.badge}><Shield size={12} color="#fff" /></View>
          </View>
          <View style={styles.heroText}>
            <Text variant="title" style={styles.userName} numberOfLines={2}>Ahmed Mansour</Text>
            <Text variant="label" tone="muted" style={styles.userStatus}>PREMIUM MEMBER • SINCE 2024</Text>
          </View>
        </Animated.View>

        <View style={styles.listContainer}>
          {profileItems.map((item, index) => (
            <ProfileListItem key={item.id} item={item} index={index} styles={styles} colors={colors} />
          ))}
        </View>

        {/* Bottom Actions */}
        <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.logoutBlock}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={20} color={COLORS.white} />
            <Text style={{ color: COLORS.white, fontWeight: "700", fontSize: 16 }}>Sign Out</Text>
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
      <Pressable style={styles.profileItem}>
        <View style={[styles.iconWrap, item.id === "pref" || item.id === "billing" ? { backgroundColor: `${colors.accent}10` } : null]}>
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

const createStyles = (colors: any, insets: any) => StyleSheet.create({
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
  headerActions: {
    width: 44,
    alignItems: "flex-end",
  },
  miniAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  miniAvatarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  scrollContent: {
    paddingTop: insets.top + 88,
    paddingHorizontal: theme.spacing.lg,
  },
  heroBlock: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 32,
    gap: 20,
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
    color: "#fff",
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
    backgroundColor: COLORS.black,
    paddingVertical: 22,
    borderRadius: 24,
  },
});
