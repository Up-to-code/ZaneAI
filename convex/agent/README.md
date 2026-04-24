# Agent Zone

This zone owns ZaneAI thread APIs, workflow orchestration, run tracking, and the worker-facing runtime bridge.

## Folder Map

- `public/`: client-facing Convex functions used by the mobile app. Put thread creation, message reads, run status, stop, and runtime health here.
- `orchestrator/`: the durable workflow and worker boundary. Put routing, specialist execution, worker-only runtime mutations, and the agent registry here.
- `internal/`: private Convex functions called by public functions or migrations inside Convex. Put narrow persistence helpers here when they do not need to be called by the external worker.
- `lib/`: shared helpers with no public API surface. Put component handles, normalization, health helpers, legacy migration helpers, and tests here.

Do not add placeholder folders for future agents or tools. Add a folder only when it has real code and a clear ownership boundary.

Current workflow agents:
- `orchestrator`: routes the active prompt.
- `property`: handles property search, shortlist, and comparison.
- `funding`: handles finance and affordability guidance.
- `advisor`: handles greetings and lightweight advisory turns.
- `summary`: emits the final assistant turn contract.

Keep the worker-facing registry lean. Add new specialists only when they produce a distinct product experience.

Persistence rules:
- Convex Agent owns thread/message history.
- Agent tables own run/event/assistant-turn state.
- Structured operational memory is limited to tool calls and property search sessions/results.
- Do not add a second generic conversation-memory store.

## Public Functions

See `FUNCTION_REGISTER.md`.

## Internal Functions

See `FUNCTION_REGISTER.md`.

## Shared Helpers

- Thread ownership lives in `lib/threadAccess.ts`.
- Worker health and runtime health view models live in `lib/workerHealth.ts` and `lib/runtimeHealth.ts`.
- Presentation, memory planning, persona, model policy, and registry helpers live under `orchestrator/`.

## Known Blockers/Risks

- `orchestrator/worker.ts` and `orchestrator/runtime.ts` are intentionally listed in `../CONVEX_AUDIT.md` as oversized split targets.
- Public agent functions must verify auth and thread ownership before reading or mutating user-visible state.
- Worker-facing runtime functions are public Convex functions because the external worker calls them; treat them as privileged protocol endpoints.

## Where To Add Code

- Add client-facing thread APIs under `public/`.
- Add private persistence helpers under `internal/`.
- Add worker protocol endpoints under `orchestrator/runtime.ts` or its split successor modules.
- Add pure helper logic under `lib/` or focused `orchestrator/` helper files.
