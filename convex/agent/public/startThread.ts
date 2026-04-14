import { createThread } from "@convex-dev/agent";
import { mutation } from "../../_generated/server";
import { requireAuthUser } from "../../auth/requireAuth";
import { ensureProfile } from "../../auth/profile";
import { agentComponent } from "../lib/component";

export const startThread = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx);
    await ensureProfile(ctx, authUser);
    return await createThread(ctx, agentComponent, {
      userId: authUser._id,
      title: "New thread",
      summary: "Thread-isolated conversation",
    });
  },
});
