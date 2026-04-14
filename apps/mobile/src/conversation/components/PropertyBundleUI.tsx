import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Map } from "lucide-react-native";
import { useRouter } from "expo-router";

import { PropertyCard } from "@/decision/components/PropertyCard";
import { IconButton } from "@/foundation/primitives/IconButton";
import { Button } from "@/foundation/primitives/Button";
import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import { useAppStore } from "@/store";
import type { ConversationMessage, PropertyCardVM } from "@/types/domain";

type PropertyBundleUIProps = {
  message: ConversationMessage;
  properties: PropertyCardVM[];
};

function SkeletonPropertyCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800 }),
        withTiming(0.4, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.skeletonCard, animatedStyle]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonLineLong} />
        <View style={styles.skeletonMetaRow}>
          <View style={styles.skeletonMetaItem} />
          <View style={styles.skeletonMetaItem} />
          <View style={styles.skeletonMetaItem} />
        </View>
      </View>
    </Animated.View>
  );
}

export function PropertyBundleUI({ message, properties: initialProperties }: PropertyBundleUIProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const dismissedPropertyIds = useAppStore(state => state.dismissedPropertyIds);
  const properties = useMemo(() => 
    initialProperties.filter(p => !dismissedPropertyIds.includes(p.id)),
    [initialProperties, dismissedPropertyIds]
  );

  const isSearching = message.streamState === "streaming" && properties.length === 0;
  const hasProperties = properties.length > 0;

  if (!isSearching && !hasProperties) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container} testID="chat.result.bundle">
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Text variant="label" tone="secondary">
            {isSearching ? "Searching available properties..." : `Found ${properties.length} matching properties`}
          </Text>
        </View>

        {!isSearching && (
          <IconButton onPress={() => console.log("Open full map view")}>
            <Map size={18} color={colors.accent} />
          </IconButton>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={280 + theme.spacing.md}
        decelerationRate="fast"
      >
        {isSearching
          ? [1, 2, 3].map((key, index) => (
              <Animated.View key={key} entering={FadeInDown.delay(index * 150)}>
                <SkeletonPropertyCard />
              </Animated.View>
            ))
          : properties.map((property, index) => (
              <Animated.View key={property.id} entering={FadeInDown.delay(index * 100)}>
                <PropertyCard property={property} compact style={styles.cardSizing} />
              </Animated.View>
            ))}
      </ScrollView>

      {!isSearching && hasProperties && (
        <View style={styles.footer}>
          <Button 
            variant="secondary" 
            onPress={() => router.push("/(app)/listing")}
            label="See More Properties"
          />
        </View>
      )}
    </Animated.View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    headerTitleWrap: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },
    cardSizing: {
      width: 280,
    },
    skeletonCard: {
      width: 280,
      height: 290, // Approx height of PropertyCard compact
      borderRadius: theme.radii.lg,
      backgroundColor: colors.surface,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.divider,
    },
    skeletonImage: {
      height: 140,
      backgroundColor: colors.surfaceRaised,
    },
    skeletonContent: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    skeletonLineShort: {
      height: 18,
      width: "40%",
      backgroundColor: colors.surfaceRaised,
      borderRadius: 4,
    },
    skeletonLineLong: {
      height: 14,
      width: "80%",
      backgroundColor: colors.surfaceRaised,
      borderRadius: 4,
    },
    skeletonMetaRow: {
      flexDirection: "row",
      gap: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },
    skeletonMetaItem: {
      height: 12,
      width: 40,
      backgroundColor: colors.surfaceRaised,
      borderRadius: 4,
    },
  });
