import React, { useMemo } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";
import type { ConversationMessage, PropertyCardVM } from "@/types/domain";

type AgentAnalyticsUIProps = {
  message: ConversationMessage;
  properties: PropertyCardVM[];
};

export function AgentAnalyticsUI({ message, properties }: AgentAnalyticsUIProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (properties.length < 2) {
    return null; // A comparison table needs at least 2 properties
  }

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.tableRowContainer}>
          {/* Sticky Left Column for Properties */}
          <View style={styles.labelsCol}>
            <View style={styles.headerLabelCell} />
            {properties.map((prop, idx) => (
              <View key={prop.id} style={[styles.propRowCell, idx === properties.length - 1 && styles.noBottomBorder]}>
                <Image source={prop.heroUrl} style={styles.rowPropImage} contentFit="cover" />
                <Text variant="caption" style={styles.rowPropTitle} numberOfLines={2}>
                  {prop.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Horizontally Scrollable Features/Metrics */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <FeatureColumn 
              title="Price" 
              values={properties.map(p => p.priceLabel)} 
              styles={styles} 
            />
            <FeatureColumn 
              title="Location" 
              values={properties.map(p => p.locationLabel)} 
              styles={styles} 
            />
            <FeatureColumn 
              title="Area" 
              values={properties.map(p => `${p.area} sqft`)} 
              styles={styles} 
            />
            <FeatureColumn 
              title="Beds" 
              values={properties.map(p => `${p.beds}`)} 
              styles={styles} 
            />
            <FeatureColumn 
              title="Yield" 
              values={properties.map(p => `${p.matchScore}%`)} 
              styles={styles} 
            />
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  );
}

function FeatureColumn({ 
  title, 
  values,
  styles, 
}: { 
  title: string; 
  values: string[];
  styles: any;
}) {
  return (
    <View style={styles.dataCol}>
      <View style={styles.headerDataCell}>
        <Text variant="caption" tone="secondary" style={styles.headerTitleText}>
          {title}
        </Text>
      </View>
      {values.map((val, idx) => (
        <View key={`${title}-${idx}`} style={[styles.cell, idx === values.length - 1 && styles.noBottomBorder]}>
          <Text variant="caption" style={styles.valueText}>
            {val}
          </Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    card: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: 0,
      backgroundColor: colors.surface,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: colors.divider,
      // subtle shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    tableRowContainer: {
      flexDirection: "row",
    },
    labelsCol: {
      width: 120, // wider to fit prop images + title horizontally
      paddingLeft: theme.spacing.md,
      backgroundColor: colors.surfaceHover,
      zIndex: 1,
      borderRightWidth: 1,
      borderColor: colors.divider,
      borderTopLeftRadius: theme.radii.lg,
      borderBottomLeftRadius: theme.radii.lg,
    },
    scrollContent: {
      paddingRight: theme.spacing.md,
    },
    dataCol: {
      width: 100, // Reduced width for metrics columns
    },
    headerLabelCell: {
      height: 48, // just a small empty top-left cell
      borderBottomWidth: 1,
      borderColor: colors.divider,
    },
    headerDataCell: {
      height: 48,
      alignItems: "center",
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderColor: colors.divider,
      justifyContent: "center",
    },
    headerTitleText: {
      fontSize: 12,
      fontFamily: theme.typography.label.fontFamily,
      textAlign: "center",
      color: colors.textSecondary,
    },
    propRowCell: {
      height: 64, // taller rows so properties fit
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.divider,
      paddingRight: 4,
    },
    cell: {
      height: 64, // matches propRowCell
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderColor: colors.divider,
    },
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    valueText: {
      textAlign: "center",
      fontSize: 13,
      fontFamily: theme.typography.label.fontFamily,
      color: colors.textPrimary,
    },
    rowPropImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 6,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.surfaceRaised,
    },
    rowPropTitle: {
      flex: 1,
      fontSize: 11,
      fontFamily: theme.typography.label.fontFamily,
      lineHeight: 14,
      color: colors.textPrimary,
    },
  });
