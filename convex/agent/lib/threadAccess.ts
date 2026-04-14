import { getThreadMetadata } from "@convex-dev/agent";
import type { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server";

import type { DataModel } from "../../_generated/dataModel";
import { agentComponent } from "./component";

type AnyCtx =
  | GenericActionCtx<DataModel>
  | GenericMutationCtx<DataModel>
  | GenericQueryCtx<DataModel>;

export async function requireThreadAccess(ctx: AnyCtx, threadId: string, authUserId: string) {
  const thread = await getThreadMetadata(ctx, agentComponent, { threadId });
  if (thread.userId !== authUserId) throw new Error("Thread not found");
  return thread;
}
