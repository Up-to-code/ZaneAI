import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { agentComponent } from "../lib/component";

export const listThreads = query({
  args: {},
  handler: async (ctx) =>
    await ctx.runQuery(agentComponent.threads.listThreadsByUserId, {
      userId: await requireAuthUserId(ctx),
      order: "desc",
    }),
});
