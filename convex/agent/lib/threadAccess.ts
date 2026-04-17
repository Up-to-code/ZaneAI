import { getThreadMetadata } from "@convex-dev/agent";
import type { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server";

import type { DataModel } from "../../_generated/dataModel";
import { agentComponent } from "./component";

type AnyCtx =
  | GenericActionCtx<DataModel>
  | GenericMutationCtx<DataModel>
  | GenericQueryCtx<DataModel>;

type ThreadMetadata = Awaited<ReturnType<typeof getThreadMetadata>>;

export async function findThreadAccess(
  ctx: AnyCtx,
  threadId: string,
  authUserId: string,
): Promise<ThreadMetadata | null> {
  try {
    const thread = await getThreadMetadata(ctx, agentComponent, { threadId });
    return thread.userId === authUserId ? thread : null;
  } catch {
    return null;
  }
}

export async function requireThreadAccess(ctx: AnyCtx, threadId: string, authUserId: string) {
  const thread = await findThreadAccess(ctx, threadId, authUserId);
  if (!thread) throw new Error("Thread not found");
  return thread;
}
