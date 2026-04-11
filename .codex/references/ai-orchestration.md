# Zayon AI Orchestration

## Default framework

Use `@jackchen_me/open-multi-agent` for multi-agent coordination unless a task is clearly experimental.

## Team topology

- Search Agent: retrieve properties that satisfy current constraints.
- Analysis Agent: score value, fit, price context, and quality signals.
- Ranking Agent: prioritize final shortlist for current goal.
- Preference Agent: infer preference updates from recent behavior.
- Summary Agent: compress internal output into calm user-facing language.

## Orchestrator rules

- Accept one unified goal plus user context.
- Run independent tasks in parallel where possible.
- Merge duplicates before returning ranked properties.
- Persist run metadata and agent events for auditability.
- Stream summary text back separately from structured property payloads.

## Product writing rules

- Replies should be short, structured, and actionable.
- Prefer “why this matters” over raw model verbosity.
- Never surface internal agent names to end users unless debugging.
