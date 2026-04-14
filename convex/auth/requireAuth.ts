import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";

import type { DataModel } from "../_generated/dataModel";
import { authComponent } from "./client";

type AppCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;

export async function requireAuthUser(ctx: AppCtx) {
  return await authComponent.getAuthUser(ctx);
}

export async function requireAuthUserId(ctx: AppCtx) {
  return (await requireAuthUser(ctx))._id;
}
