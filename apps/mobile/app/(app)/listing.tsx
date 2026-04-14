import { ScrollView, StyleSheet, View, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, MapPin, BedDouble, Bath } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Screen } from "@/foundation/primitives/Screen";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useCandidateProperties } from "@/persistence/convex/usePropertyData";
import type { PropertyCardVM } from "@/types/domain";
import { Building2 } from "lucide-react-native";

const FILTERS = ["All", "For Sale", "For Rent", "Villas", "Apartments", "Studios"];

export default function ListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
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
        {properties.map((property, index) => (
          <Animated.View 
            key={property.id} 
            entering={FadeInDown.delay(index * 100).duration(400)}
          >
            <HorizontalPropertyCard property={property} colors={colors} styles={styles} router={router} />
          </Animated.View>
        ))}
      </ScrollView>
    </Screen>
  );
}

function HorizontalPropertyCard({ property, colors, styles, router }: { property: PropertyCardVM; colors: any; styles: any; router: any }) {
  return (
    <Pressable 
      testID={`property.card.${property.id}`}
      style={styles.hzCard}
      onPress={() => router.push(`/(app)/property/${property.id}`)}
    >
      <Image source={property.heroUrl} style={styles.hzImage} contentFit="cover" />
      
      <View style={styles.hzContent}>
        <View style={styles.hzHeader}>
          <Text variant="title" style={{ color: colors.textPrimary, fontSize: 16 }}>{property.priceLabel}</Text>
          <View style={[styles.hzMatchBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.hzMatchText}>{property.matchScore}%</Text>
          </View>
        </View>
        
        <Text tone="secondary" variant="caption" numberOfLines={1} style={styles.hzTitle}>{property.title}</Text>
        
        <View style={styles.hzLocationRow}>
          <MapPin size={10} color={colors.accent} />
          <Text tone="muted" variant="caption" style={{ fontSize: 10 }}>{property.locationLabel}</Text>
        </View>

        <View style={styles.hzBrokerBadge}>
          <Building2 size={10} color={colors.textSecondary} />
          <Text tone="secondary" variant="caption" style={{ fontSize: 9 }}>Zane-ai Realty</Text>
        </View>

        <View style={styles.hzMetricsRow}>
          <View style={styles.hzMetric}>
            <BedDouble size={12} color={colors.textSecondary} />
            <Text tone="secondary" variant="caption">{property.beds}</Text>
          </View>
          <View style={styles.hzMetric}>
            <Bath size={12} color={colors.textSecondary} />
            <Text tone="secondary" variant="caption">{property.baths}</Text>
          </View>
          <View style={styles.hzAreaBlock}>
            <Text tone="secondary" variant="caption" style={{ fontSize: 10 }}>{property.area} sqft</Text>
          </View>
        </View>
      </View>
    </Pressable>
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
    paddingHorizontal: theme.spacing.md,
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
  hzCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    height: 140, // Increased for comfortable height
  },
  hzImage: {
    width: 140, // Match width to height
    height: "100%",
  },
  hzContent: {
    flex: 1,
    padding: theme.spacing.md, // increased padding
    justifyContent: "space-between",
  },
  hzHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  hzMatchBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  hzMatchText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: "bold",
  },
  hzTitle: {
    marginVertical: 2,
  },
  hzLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  hzBrokerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  hzMetricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: theme.spacing.xs,
  },
  hzMetric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hzAreaBlock: {
    marginLeft: "auto",
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 4,
  },
});
