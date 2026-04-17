import { StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Menu } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConversationViewport } from "@/conversation/components/ConversationViewport";
import { Screen } from "@/foundation/primitives/Screen";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAuthSession } from "@/auth/useAuthSession";
import { Text } from "@/foundation/primitives/Text";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { isGuest, user } = useAuthSession();

  const displayName = isGuest ? "G" : user?.name?.[0] ?? user?.email?.[0] ?? "U";

  return (
    <Screen safe={false}>
      {/* Floating Pure Canvas Utilities */}
      <View style={styles.flex}>
        <ConversationViewport />
      </View>

      {/* Floating Pure Canvas Utilities */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top + 4, backgroundColor: colors.background + 'D9' }]}>
        <Pressable 
          style={styles.floatingBtn} 
          onPress={() => router.navigate("/(app)/menu")}
          accessibilityLabel="Menu"
          hitSlop={8}
        >
          <Menu size={18} color={colors.textPrimary} />
        </Pressable>

        <Pressable 
          style={styles.floatingBtn} 
          onPress={() => router.navigate("/(app)/profile")}
          accessibilityLabel="Profile"
          hitSlop={8}
        >
          <View style={[styles.avatarMini, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>{displayName.toUpperCase()}</Text>
          </View>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 1000,
  },
  floatingBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
});
