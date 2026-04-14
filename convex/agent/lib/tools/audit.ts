import { internal } from "../../../_generated/api";

import type { ToolRuntime } from "../runtimeTypes";

export async function addToolEvent(runtime: ToolRuntime, phase: string, message: string, details?: unknown) {
  await runtime.ctx.runMutation(internal.agent.internal.events.addEvent, {
    runId: runtime.runId,
    phase,
    message,
    details: details ? JSON.stringify(details).slice(0, 3000) : undefined,
  });
}
