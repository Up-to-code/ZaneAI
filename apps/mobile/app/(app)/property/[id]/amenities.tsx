import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { usePropertyById } from "@/persistence/convex/usePropertyData";

export default function AmenitiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ id: string }>();

  const property = usePropertyById(params.id);

  if (!property || !property.amenities) return null;

  // Group by category
  const categorized = property.amenities.reduce((acc, amenity) => {
    const cat = amenity.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(amenity);
    return acc;
  }, {} as Record<string, typeof property.amenities>);

  return (
    <Screen style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.circleBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <Text variant="title" style={{ color: colors.textPrimary }}>All Amenities</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(categorized).map(([category, items], index) => (
          <Animated.View key={category} entering={FadeInDown.delay(index * 100).duration(400)}>
            <View style={styles.categoryBlock}>
              <Text variant="title" style={styles.categoryTitle}>{category}</Text>
              
              <View style={styles.grid}>
                {items.map(amenity => {
                  const Icon = (LucideIcons as any)[amenity.iconName] || LucideIcons.CheckCircle;
                  return (
                    <View key={amenity.id} style={styles.item}>
                      <View style={styles.iconWrap}>
                        <Icon size={22} color={colors.accent} strokeWidth={1.5} />
                      </View>
                      <Text variant="body" tone="secondary">{amenity.label}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    height: 110,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  scrollContent: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  categoryBlock: {
    marginBottom: theme.spacing.xl,
  },
  categoryTitle: {
    color: colors.textPrimary,
    marginBottom: theme.spacing.md,
    fontSize: 18,
  },
  grid: {
    gap: theme.spacing.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.accent}15`,
    justifyContent: "center",
    alignItems: "center",
  },
});
