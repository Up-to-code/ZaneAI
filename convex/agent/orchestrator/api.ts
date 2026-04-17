import { exposeApi, exposeApiWithWorker } from "@akshatgiri/convex-orchestrator";

import { components } from "../../_generated/api";

export const {
  startWorkflow,
  getWorkflow,
  listWorkflows,
  getWorkflowSteps,
  signalWorkflow,
} = exposeApi(components.convexOrchestrator);

export const {
  claimWorkflow,
  heartbeat,
  completeWorkflow,
  failWorkflow,
  sleepWorkflow,
  getOrCreateStep,
  scheduleSleep,
  waitForSignal,
  completeStep,
  failStep,
  subscribePendingWorkflows,
} = exposeApiWithWorker(components.convexOrchestrator, {
  authorize: async () => {
    // WHY: The worker runs as trusted infrastructure during pre-launch development.
    // WHAT: Keep the worker path unblocked while the workflow migration settles.
    // HOW: Tighten this once service-auth is introduced for production workers.
    return true;
  },
});
