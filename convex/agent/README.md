# Agent Zone

This zone owns thread APIs, orchestration actions, run tracking, team config, and agent runtime configs.

Current real-work team:
- `agents/search`: property search, Tavily web context, active-thread reads.
- `agents/decision`: recommendation synthesis and ranking output.
- `agents/memory`: promoted profile-memory retrieval and updates.

Add a new agent by creating `agents/<name>/prompt.ts`, `schema.ts`, `tools.ts`, and `config.ts`, then register it from `team/config.ts`.

Keep prompts, output schemas, and allowed tool names inside the agent folder. Shared tool factories, logging, and runtime helpers belong in `lib/`.
