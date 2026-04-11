---
name: zayon-convex-agents
description: >
  Zayon backend guidance for Convex schemas, realtime flows, AI orchestration actions,
  and event persistence. Use when implementing or reviewing Convex code, data models,
  or agent pipelines in Zayon.
---

# Zayon Convex Agents

- Persistent app data lives in Convex.
- Read [AI orchestration](../../references/ai-orchestration.md) before changing agent flows.
- Queries return decision-ready payloads, not raw backend noise.
- Mutations should stay narrow and idempotent where possible.
- Actions handle orchestration, external model calls, and streaming coordination.
- Persist recommendation batches, agent runs, and agent events for auditability.
- Mirror critical funnel events to analytics persistence.
- Keep agent outputs unified before they reach the client.
