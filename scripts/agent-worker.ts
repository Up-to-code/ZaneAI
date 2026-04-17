import { startAgentWorker } from "../convex/agent/orchestrator/worker";

startAgentWorker().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[agent-worker] failed: ${message}`);
  process.exitCode = 1;
});
