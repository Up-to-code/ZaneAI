
import { action } from "../../_generated/server";

export const testSendMessage = action({
  args: {},
  handler: async (ctx) => {
    // Just a test
    return "Fix was pushed, waiting to test.";
  },
});
