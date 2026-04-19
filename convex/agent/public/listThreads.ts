import { query } from "../../_generated/server";
import { getOptionalAuthUserId } from "../../auth/requireAuth";
import { agentComponent } from "../lib/component";

function emptyThreadList() {
  return {
    page: [],
    isDone: true,
    continueCursor: "",
  };
}

export const listThreads = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getOptionalAuthUserId(ctx);
    if (!userId) {
      return emptyThreadList();
    }

    return await ctx.runQuery(agentComponent.threads.listThreadsByUserId, {
      userId,
      order: "desc",
    });
  },
});
