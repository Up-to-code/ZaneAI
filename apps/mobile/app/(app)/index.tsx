import { StyleSheet, View } from "react-native";

import { ConversationViewport } from "@/conversation/components/ConversationViewport";
import { Screen } from "@/foundation/primitives/Screen";

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.flex}>
        <ConversationViewport />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
