# Agent Zone

This zone owns thread APIs, workflow orchestration, run tracking, and the worker-facing runtime bridge.

Current workflow agents:
- `orchestrator`: routes the active prompt.
- `property`: handles property search, shortlist, and comparison.
- `funding`: handles finance and affordability guidance.
- `advisor`: handles greetings and lightweight advisory turns.
- `summary`: emits the final assistant turn contract.

Keep the worker-facing registry lean. Add new specialists only when they produce a distinct product experience.

Use `orchestrator/` for workflow code and only persist app-facing state in `agentRuns`, `agentEvents`, and `assistantTurns`.
