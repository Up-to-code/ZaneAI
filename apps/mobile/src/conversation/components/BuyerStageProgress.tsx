import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@/foundation/primitives/Text";
import type { BuyerStageEvent } from "@/conversation/buyerProtocol";

type BuyerStageProgressProps = {
  events: BuyerStageEvent[];
};

export function BuyerStageProgress({ events }: BuyerStageProgressProps) {
  const latest = events.at(-1);
  const styles = useMemo(() => createStyles(), []);

  if (!latest) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Assistant Progress</Text>
      <Text style={styles.message}>{latest.message}</Text>
      <Text style={styles.meta}>
        {latest.teamId ? latest.teamId.replaceAll("_", " ") : "orchestrator"}
        {" • "}
        {latest.phase.replaceAll("_", " ")}
      </Text>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: 12,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#D7E2F3",
      backgroundColor: "#F7FAFF",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: "700",
      color: "#4D6B9A",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    message: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
      color: "#173256",
    },
    meta: {
      marginTop: 4,
      fontSize: 12,
      color: "#6881A6",
    },
  });
