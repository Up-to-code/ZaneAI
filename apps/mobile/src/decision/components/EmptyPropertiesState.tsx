import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { Text } from "@/foundation/primitives/Text";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

type EmptyPropertiesStateProps = {
  title?: string;
  body?: string;
};

export function EmptyPropertiesState({
  title = "No properties yet",
  body = "New properties will appear here once they are ready.",
}: EmptyPropertiesStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.artWrap, { backgroundColor: `${colors.accent}0D` }]}>
        <Image
          source={require("../../../assets/icons/empty-properties.svg")}
          style={styles.art}
          contentFit="contain"
        />
      </View>
      <Text variant="title" style={[styles.title, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <Text variant="body" style={[styles.body, { color: colors.textMuted }]}>
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: theme.spacing.xl,
    gap: 12,
  },
  artWrap: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  art: {
    width: 123,
    height: 97,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0,
    textAlign: "center",
  },
  body: {
    maxWidth: 270,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    letterSpacing: 0,
    textAlign: "center",
  },
});
