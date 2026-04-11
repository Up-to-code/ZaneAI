import { v } from "convex/values";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { chunkSummary } from "./lib/summary";
import { seededProperties } from "./lib/fixtures";

export const streamSummary = action({
  args: {
    summary: v.string(),
  },
  handler: async (_ctx, args) => {
    return chunkSummary(args.summary);
  },
});

export const refreshRecommendations = action({
  args: {
    userExternalId: v.string(),
    goal: v.string(),
  },
  handler: async (_ctx, args) => {
    const rankedProperties = [...seededProperties].sort((left, right) => right.matchScore - left.matchScore);
    return {
      userExternalId: args.userExternalId,
      summary: `Refreshed shortlist for ${args.goal}. ${rankedProperties[0]?.title} still leads.`,
      propertyIds: rankedProperties.map((property) => property.externalId),
    };
  },
});

export const orchestrateTurn = action({
  args: {
    userExternalId: v.string(),
    sessionExternalId: v.string(),
    goal: v.string(),
    userContext: v.string(),
    visiblePropertyIds: v.array(v.string()),
    savedState: v.array(v.string()),
  },
  handler: async (ctx, args): Promise<unknown> =>
    ctx.runAction(api.aiNode.orchestrateTurnNode, args),
});
