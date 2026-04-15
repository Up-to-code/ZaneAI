import { ScrollView, StyleSheet, View, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/decision/components/PropertyCard";
import { Bookmark, Search, ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useSavedProperties } from "@/persistence/convex/usePropertyData";
import { useAuthSession } from "@/auth/useAuthSession";
import type { PropertyCardVM } from "@/types/domain";

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuthSession();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const savedProperties = useSavedProperties()
    .map((item: { property: PropertyCardVM | null }) => item.property)
    .filter((property: PropertyCardVM | null): property is PropertyCardVM => property !== null);

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return savedProperties;
    return savedProperties.filter((property: PropertyCardVM) =>
      `${property.title} ${property.locationLabel}`.toLowerCase().includes(query),
    );
  }, [savedProperties, searchQuery]);

  return (
    <Screen safe={false}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Pressable accessibilityLabel="Back" style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text variant="title" style={styles.headerTitle}>Favorites</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.search}>
          <View style={styles.searchInner}>
            <Search size={18} color={colors.textMuted} />
            <TextInput 
              placeholder="Search collection..."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 120, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Bookmark size={48} color={colors.accent} strokeWidth={1} />
            </View>
            <Text variant="title" style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text variant="body" tone="muted" style={styles.emptySub}>
              Properties you bookmark will materialize here as a curated collection.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredProperties.map((p: PropertyCardVM, i: number) => (
              <Animated.View 
                key={p.id}
                entering={FadeInDown.delay(i * 100).springify()}
                style={styles.cardItem}
              >
                <PropertyCard property={p} />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: `${colors.background}FA`,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.6,
    textAlign: "center",
    flex: 1,
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
  search: {
    marginTop: 4,
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  list: {
    gap: 24,
    marginTop: 20,
  },
  cardItem: {
    width: "100%",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent + "10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  emptySub: {
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 22,
  },
});
