import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { X, Building2, Home } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppStore } from "@/store";
import { Text } from "@/foundation/primitives/Text";
import { Button } from "@/foundation/primitives/Button";
import { Screen } from "@/foundation/primitives/Screen";
import { theme } from "@/foundation/theme/tokens";
import { useTheme } from "@/foundation/theme/ThemeProvider";

const TYPES = ["Apartment", "Villa", "Townhouse", "Duplex", "Twinhouse"];

export default function OnboardingTypesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);
  const preferenceProfile = useAppStore((state) => state.preferenceProfile);
  const patchPreferenceProfile = useAppStore((state) => state.patchPreferenceProfile);

  const selectedTypes = preferenceProfile.propertyTypes;

  const toggleType = (type: string) => {
    let newTypes;
    if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter((item) => item !== type);
    } else {
      newTypes = [...selectedTypes, type];
    }
    patchPreferenceProfile({ propertyTypes: newTypes });
  };

  const finalizeJourney = () => {
    setOnboardingComplete(true);
    router.replace("/(app)");
  };

  const styles = StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    topSection: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: theme.spacing.xl,
      zIndex: 10,
    },
    skipBtn: {
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingVertical: 40,
      gap: 32,
    },
    intro: {
      gap: 12,
    },
    display: {
      fontSize: 32,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    chipGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 100,
      borderWidth: 1,
    },
    chipText: {
      fontSize: 15,
      fontWeight: "600",
    },
    actions: {
      paddingHorizontal: 24,
      gap: 16,
    },
    mainBtn: {
      height: 64,
      backgroundColor: colors.textPrimary,
    },
  });

  return (
    <Screen style={styles.container}>
      <View style={[styles.topSection, { paddingTop: Math.max(insets.top, 20) }]}>
        <Pressable style={styles.skipBtn} onPress={finalizeJourney}>
          <X size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.intro}>
            <Text variant="display" style={styles.display}>Architecture</Text>
            <Text style={styles.subtitle}>
              Select the property types that match your architectural taste.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.chipGrid}>
            {TYPES.map((type) => {
              const isSelected = selectedTypes.includes(type);
              const isVillaLike = type === "Villa" || type === "Townhouse" || type === "Twinhouse";
              
              return (
                <Pressable
                  key={type}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.textPrimary : colors.surface,
                      borderColor: isSelected ? colors.textPrimary : colors.divider,
                    },
                  ]}
                  onPress={() => toggleType(type)}
                >
                  {isVillaLike ? (
                    <Home size={16} color={isSelected ? colors.background : colors.textPrimary} />
                  ) : (
                    <Building2 size={16} color={isSelected ? colors.background : colors.textPrimary} />
                  )}
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? colors.background : colors.textPrimary },
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>
        </ScrollView>
      </View>

      <Animated.View
        entering={FadeInDown.delay(500).springify()}
        style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 32) }]}
      >
        <Button
          label="Complete Journey"
          variant="primary"
          onPress={finalizeJourney}
          style={styles.mainBtn}
          textStyle={{ color: colors.background }}
          disabled={selectedTypes.length === 0}
        />
      </Animated.View>
    </Screen>
  );
}
