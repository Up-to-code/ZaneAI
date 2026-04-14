import { query } from "../../_generated/server";

import { profileOwnerKey } from "../../shared/namespaces";
import { requireAuthUserId } from "../../auth/requireAuth";

export const listProfileFacts = query({
  args: {},
  handler: async (ctx) => {
    const authUserId = await requireAuthUserId(ctx);
    return await ctx.db
      .query("knowledgeFacts")
      .withIndex("by_ownerKey", (q) => q.eq("ownerKey", profileOwnerKey(authUserId)))
      .take(50);
  },
});
