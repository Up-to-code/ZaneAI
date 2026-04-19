import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { ConvexError } from "convex/values";

import type { DataModel } from "../_generated/dataModel";
import { authComponent } from "./client";

type AppCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;

export async function requireAuthUser(ctx: AppCtx) {
  return await authComponent.getAuthUser(ctx);
}

export async function getOptionalAuthUser(ctx: AppCtx) {
  try {
    return await authComponent.getAuthUser(ctx);
  } catch (error: unknown) {
    if (
      (error instanceof ConvexError && error.data === "Unauthenticated") ||
      (error instanceof Error && error.message === "Unauthenticated")
    ) {
      return null;
    }

    throw error;
  }
}

export async function getOptionalAuthUserId(ctx: AppCtx) {
  return (await getOptionalAuthUser(ctx))?._id ?? null;
}

export async function requireAuthUserId(ctx: AppCtx) {
  return (await requireAuthUser(ctx))._id;
}
