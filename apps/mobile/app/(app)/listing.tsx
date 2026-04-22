import { ScrollView, StyleSheet, View, Pressable, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { EmptyPropertiesState } from "@/decision/components/EmptyPropertiesState";
import { PropertyCard } from "@/decision/components/PropertyCard";
import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useCandidateProperties } from "@/persistence/convex/usePropertyData";

const FILTERS = ["All", "For Sale", "For Rent", "Villas", "Apartments", "Studios"];

export default function ListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (typeof params.filter === "string" && FILTERS.includes(params.filter)) {
      setActiveFilter(params.filter);
    }
  }, [params.filter]);
  
  const rawProperties = useCandidateProperties();

  const properties = useMemo(() => {
    let filtered = [...rawProperties];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.locationLabel.toLowerCase().includes(q)
      );
    }

    if (activeFilter !== "All") {
      filtered = filtered.filter(p => p.tags.includes(activeFilter) || p.title.includes(activeFilter));
    }

    return filtered;
  }, [rawProperties, searchQuery, activeFilter]);

  return (
    <Screen style={styles.screen}>
      {/* Crystal Header */}
      <View style={[styles.crystalHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Pressable accessibilityLabel="Go back" style={styles.circleBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
          
          {/* Integrated Search Bar */}
          <View style={styles.searchBox}>
            <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search areas..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <Pressable style={styles.circleBtn}>
            <SlidersHorizontal size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterScroll}
          style={styles.filterWrapper}
        >
          {FILTERS.map((f) => (
            <Pressable 
              key={f} 
              style={[
                styles.filterChip, 
                activeFilter === f && { backgroundColor: colors.accent, borderColor: colors.accent }
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text 
                variant="caption" 
                style={[
                  styles.filterText, 
                  activeFilter === f && { color: colors.background }
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Main Feed */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40, paddingTop: insets.top + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {properties.length === 0 ? (
          <EmptyPropertiesState
            title="No properties found"
            body="Try a different search or filter to see more homes."
          />
        ) : (
          properties.map((property, index) => (
            <Animated.View
              key={property.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <PropertyCard property={property} style={styles.propertyCard} />
            </Animated.View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  crystalHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: `${colors.background}E6`, // 90% opacity for glass effect
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    height: 60,
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
    paddingTop: 180, // Space for larger header with search
    paddingHorizontal: 0,
  },
  propertyCard: {
    marginHorizontal: theme.spacing.lg,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    height: 40,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 13,
  },
  filterWrapper: {
    paddingBottom: theme.spacing.md,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  filterText: {
    color: colors.textPrimary,
  },
});
