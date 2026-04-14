import { v } from "convex/values";

import { query } from "../../_generated/server";
import { listPropertiesByExternalIds } from "../lib/search";

export const listByIds = query({
  args: { propertyExternalIds: v.array(v.string()) },
  handler: async (ctx, args) => await listPropertiesByExternalIds(ctx, args.propertyExternalIds),
});
