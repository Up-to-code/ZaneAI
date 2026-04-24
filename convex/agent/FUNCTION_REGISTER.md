# Agent Function Register

## Public Client Functions

- `public/startThread.ts/startThread` public mutation: creates an authenticated assistant thread.
- `public/sendUserMessage.ts/sendUserMessage` public mutation: appends a user prompt, creates an agent run, and starts orchestration.
- `public/editUserMessage.ts/editUserMessage` public mutation: rewrites a prior user message, truncates later operational memory, and starts a replacement run.
- `public/stopRun.ts/stopRun` public mutation: requests cancellation for the authenticated user's run.
- `public/listThreads.ts/listThreads` public query: lists authenticated user threads.
- `public/getThreadMessages.ts/getThreadMessages` public query: reads paginated thread messages after ownership checks.
- `public/getThreadPresentation.ts/getThreadPresentation` public query: reads language/direction presentation state for a thread.
- `public/getRunStatus.ts/getRunStatus` public query: reads status for one authenticated run.
- `public/getRunStageFeed.ts/getRunStageFeed` public query: returns recent stage events for a run.
- `public/getRuntimeHealth.ts/getRuntimeHealth` public query: reports worker availability and heartbeat health.

## Internal Convex Functions

- `internal/runs.ts/getRun` internal query: fetches one run.
- `internal/runs.ts/createRun` internal mutation: persists a new run.
- `internal/runs.ts/patchRun` internal mutation: patches run status/details.
- `internal/events.ts/addEvent` internal mutation: appends a run event.
- `internal/assistantTurns.ts/upsertAssistantTurn` internal mutation: persists or updates assistant turn output.
- `internal/assistantTurns.ts/listAssistantTurnsForThread` internal query: returns recent assistant turns for context.
- `internal/memory.ts/recordToolCall` internal mutation: records tool usage.
- `internal/memory.ts/recordPropertySearch` internal mutation: records property search sessions/results.
- `internal/memory.ts/getRecentPropertySearches` internal query: returns recent property-search memory.
- `internal/usage.ts/trackUsage` internal mutation: records usage ledger rows.
- `internal/debug.ts/testSendMessage` public action: debug-only ingress test for assistant messaging.

## Worker Runtime Functions

- `orchestrator/runtime.ts/getRunForWorker` public query: worker fetch for run state.
- `orchestrator/runtime.ts/getThreadPresentationForWorker` public query: worker fetch for presentation state.
- `orchestrator/runtime.ts/upsertThreadPresentationForWorker` public mutation: worker upsert for presentation state.
- `orchestrator/runtime.ts/heartbeatWorker` public mutation: worker heartbeat.
- `orchestrator/runtime.ts/markRunRunning` public mutation: marks a queued run as running.
- `orchestrator/runtime.ts/setRunRoute` public mutation: persists chosen route/specialist.
- `orchestrator/runtime.ts/addStageEvent` public mutation: idempotently appends stage events.
- `orchestrator/runtime.ts/trackWorkerUsage` public mutation: writes model/tool usage.
- `orchestrator/runtime.ts/getRunCostSummary` public query: summarizes usage cost by run.
- `orchestrator/runtime.ts/recordWorkerToolCall` public mutation: records worker tool calls.
- `orchestrator/runtime.ts/getRecentPropertySearchesForWorker` public query: worker memory read.
- `orchestrator/runtime.ts/getRecentAssistantTurnsForWorker` public query: worker assistant-turn memory read.
- `orchestrator/runtime.ts/getRecentMemoryBundleForWorker` public query: bundled worker context read.
- `orchestrator/runtime.ts/recordPreferencePromotionForWorker` public mutation: promotes inferred buyer preferences.
- `orchestrator/runtime.ts/recordWorkerPropertySearch` public mutation: records property search output.
- `orchestrator/runtime.ts/completeRun` public mutation: completes a run and persists final assistant turn.
- `orchestrator/runtime.ts/failRun` public mutation: marks a run failed.

## Shared Helpers

- `lib/threadAccess.ts`: thread ownership checks.
- `lib/threadTitle.ts`: thread title normalization.
- `lib/workerHealth.ts`: worker heartbeat health.
- `lib/runtimeHealth.ts`: runtime health view model.
- `orchestrator/worker.ts`: worker lifecycle and specialist execution. Still oversized; see `CONVEX_AUDIT.md`.
