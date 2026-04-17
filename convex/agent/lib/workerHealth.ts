import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";

import type { DataModel, Doc } from "../../_generated/dataModel";

type AppCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;

// The worker process is long-lived and may sit idle between runs. Keep the
// liveness window wide enough that local dev does not flap into a false
// "offline" state between startup and the next heartbeat tick.
export const AGENT_WORKER_STALE_AFTER_MS = 10 * 60_000;

export async function getLatestWorkerHeartbeat(ctx: AppCtx) {
  const workers = await ctx.db
    .query("agentWorkers")
    .withIndex("by_lastHeartbeatAt")
    .order("desc")
    .take(1);

  return (workers[0] ?? null) as Doc<"agentWorkers"> | null;
}

export function isWorkerAvailable(
  worker: Pick<Doc<"agentWorkers">, "status" | "lastHeartbeatAt"> | null,
  now: number = Date.now(),
) {
  return Boolean(
    worker
    && worker.status === "online"
    && now - worker.lastHeartbeatAt <= AGENT_WORKER_STALE_AFTER_MS,
  );
}
