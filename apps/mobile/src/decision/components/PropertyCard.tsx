import { memo, useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Bookmark, Scale, MapPin, BedDouble, Bath } from "lucide-react-native";

import { IconButton } from "@/foundation/primitives/IconButton";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { track } from "@/persistence/analytics/track";
import { useAppStore } from "@/store";
import type { PropertyCardVM } from "@/types/domain";

type PropertyCardProps = {
  property: PropertyCardVM;
  compact?: boolean;
};

export const PropertyCard = memo(function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const savedIds = useAppStore((state) => state.savedPropertyIds);
  const compareIds = useAppStore((state) => state.comparePropertyIds);
  const toggleSavedProperty = useAppStore((state) => state.toggleSavedProperty);
  const toggleCompareProperty = useAppStore((state) => state.toggleCompareProperty);
  const setSelectedPropertyId = useAppStore((state) => state.setSelectedPropertyId);
  const isSaved = savedIds.includes(property.id);
  const isCompared = compareIds.includes(property.id);

  useEffect(() => {
    track("property_impression", { propertyId: property.id, source: compact ? "assistant" : "screen" });
  }, [compact, property.id]);

  const openProperty = () => {
    setSelectedPropertyId(property.id);
    track("property_click", { propertyId: property.id });
    router.push(`/(app)/property/${property.id}`);
  };

  return (
    <Pressable onPress={openProperty}>
      <View style={[styles.card, compact && styles.compactCard]}>
        <Image source={property.heroUrl} style={[styles.image, compact && styles.compactImage]} contentFit="cover" />

        <View style={[styles.matchBadge, { backgroundColor: colors.accent }]}>
          <Text variant="label" style={styles.matchText}>{property.matchScore}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.heading}>
            <Text variant="title" style={{ color: colors.textPrimary }}>{property.priceLabel}</Text>
            <Text tone="secondary" variant="body">{property.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={colors.accent} />
              <Text tone="muted" variant="caption">{property.locationLabel}</Text>
            </View>
          </View>

          <View style={styles.metaWrap}>
            <View style={styles.metaItem}>
              <BedDouble size={14} color={colors.textMuted} />
              <Text tone="secondary" variant="caption">{property.beds} bd</Text>
            </View>
            <View style={styles.metaItem}>
              <Bath size={14} color={colors.textMuted} />
              <Text tone="secondary" variant="caption">{property.baths} ba</Text>
            </View>
            <View style={styles.metaItem}>
              <Text tone="secondary" variant="caption">{property.area} sqft</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, isSaved && styles.actionBtnActive]}
              onPress={() => {
                toggleSavedProperty(property.id);
                track("property_save", { propertyId: property.id, saved: !isSaved });
              }}
            >
              <Bookmark size={15} color={isSaved ? colors.accent : colors.textSecondary} fill={isSaved ? colors.accent : "transparent"} />
              <Text variant="caption" tone="secondary">{isSaved ? "Saved" : "Save"}</Text>
            </Pressable>

            <Pressable
              style={[styles.actionBtn, isCompared && styles.actionBtnActive]}
              onPress={() => {
                toggleCompareProperty(property.id);
                track("property_compare", { propertyId: property.id, compared: !isCompared });
              }}
            >
              <Scale size={15} color={isCompared ? colors.accent : colors.textSecondary} />
              <Text variant="caption" tone="secondary">{isCompared ? "In Compare" : "Compare"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    borderRadius: theme.radii.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  compactCard: {
    marginHorizontal: 0,
    marginBottom: theme.spacing.md,
  },
  image: {
    width: "100%",
    height: 180,
  },
  compactImage: {
    height: 140,
  },
  matchBadge: {
    position: "absolute",
    top: 136, // Adjust based on image height
    right: theme.spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  matchText: {
    color: "#fff",
    fontFamily: theme.typography.label.fontFamily,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  heading: {
    gap: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: theme.spacing.xs,
  },
  actionBtnActive: {
    // maybe a slight tint or just icon change
  },
});
