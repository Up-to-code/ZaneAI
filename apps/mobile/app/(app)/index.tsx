import { StyleSheet, View } from "react-native";

import { ConversationViewport } from "@/conversation/components/ConversationViewport";
import { Screen } from "@/foundation/primitives/Screen";
import { ScreenHeader } from "@/shell/components/ScreenHeader";

export default function HomeScreen() {
  return (
    <Screen>
      <ScreenHeader eyebrow="" title="" subtitle="" showCopy={false} />

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
