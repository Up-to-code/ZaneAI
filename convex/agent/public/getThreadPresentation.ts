import { v } from "convex/values";
import { query } from "../../_generated/server";
import { getOptionalAuthUserId } from "../../auth/requireAuth";
import { findThreadAccess } from "../lib/threadAccess";

export const getThreadPresentation = query({
  args: { threadId: v.string() },
  handler: async (ctx, args) => {
    const authUserId = await getOptionalAuthUserId(ctx);
    if (!authUserId) {
      return null;
    }

    const thread = await findThreadAccess(ctx, args.threadId, authUserId);
    if (!thread) {
      return null;
    }

    const row = await ctx.db
      .query("threadPresentations")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (!row) {
      return null;
    }

    let surfaceCopy: unknown = undefined;
    if (row.surfaceCopyJson) {
      try {
        surfaceCopy = JSON.parse(row.surfaceCopyJson);
      } catch {
        surfaceCopy = undefined;
      }
    }

    return {
      threadId: row.threadId,
      languageTag: row.languageTag,
      direction: row.direction,
      uiLocale: row.uiLocale ?? null,
      source: row.source,
      confidence: row.confidence,
      ...(surfaceCopy ? { surfaceCopy } : {}),
    };
  },
});
