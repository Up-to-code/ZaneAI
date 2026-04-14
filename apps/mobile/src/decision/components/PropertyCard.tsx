import { memo, useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
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
  style?: StyleProp<ViewStyle>;
};

export const PropertyCard = memo(function PropertyCard({ property, compact = false, style }: PropertyCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const setSelectedPropertyId = useAppStore((state) => state.setSelectedPropertyId);

  const openProperty = () => {
    setSelectedPropertyId(property.id);
    track("property_click", { propertyId: property.id });
    router.push(`/(app)/property/${property.id}`);
  };

  const metadataString = `${property.beds} BD · ${property.baths} BA · ${property.area} SQFT`;

  return (
    <Pressable
      testID={`property.card.${property.id}`}
      onPress={openProperty}
      style={[styles.card, compact && styles.compactCard, style]}
    >
      <Image source={property.heroUrl} style={[styles.image, compact && styles.compactImage]} contentFit="cover" />
      
      <View style={styles.content}>
        <View style={styles.heading}>
          <View style={styles.priceRow}>
            <Text variant="title" style={styles.price}>{property.priceLabel}</Text>
            <View style={styles.matchSystemPill}>
              <Text style={styles.matchSystemText}>{property.matchScore}% Match</Text>
            </View>
          </View>
          <Text variant="body" style={styles.titleText}>{property.title}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text variant="caption" style={styles.metaText}>{metadataString}</Text>
          <View style={styles.dot} />
          <Text variant="caption" style={styles.locationText}>{property.locationLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
});

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    marginHorizontal: theme.spacing.lg,
    marginBottom: 24,
  },
  compactCard: {
    marginHorizontal: 0,
    marginBottom: theme.spacing.md,
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: colors.surfaceRaised,
  },
  compactImage: {
    height: 140,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  matchSystemPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceRaised,
  },
  matchSystemText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  content: {
    padding: 20, // Airy professional spacing
    gap: 10,
  },
  heading: {
    gap: 2,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.7, // Balanced system tracking
  },
  titleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: -0.3,
    marginTop: 2, // Minute gap correction
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4, // Increased air
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  locationText: {
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: -0.1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.divider,
  },
});
