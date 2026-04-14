import { listMessages } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requireAuthUserId } from "../../auth/requireAuth";
import { agentComponent } from "../lib/component";
import { requireThreadAccess } from "../lib/threadAccess";

export const getThreadMessages = query({
  args: { threadId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const authUserId = await requireAuthUserId(ctx);
    await requireThreadAccess(ctx, args.threadId, authUserId);
    return await listMessages(ctx, agentComponent, args);
  },
});
