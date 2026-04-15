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
      <View style={[styles.floatingHeader, { top: insets.top + 10 }]}>
        <Pressable 
          style={styles.floatingBtn} 
          onPress={() => router.navigate("/(app)/menu")}
          accessibilityLabel="Menu"
        >
          <Menu size={20} color={colors.textPrimary} />
        </Pressable>

        <Pressable 
          style={styles.floatingBtn} 
          onPress={() => router.navigate("/(app)/profile")}
          accessibilityLabel="Profile"
        >
          <View style={[styles.avatarMini, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>{displayName.toUpperCase()}</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.flex}>
        <ConversationViewport />
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
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
  },
  floatingBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
});
