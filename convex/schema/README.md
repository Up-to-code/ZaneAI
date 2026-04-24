# Schema Zone

Schema is split by backend concern and composed from `index.ts`.

When adding a table, place it in the closest concern file and keep indexes bounded and query-driven.

## Folder Purpose

- `profile.ts`: authenticated app profiles.
- `organizations.ts`: organizations, members, and invites.
- `realEstate.ts`: projects, units, listings, assets, and compliance.
- `buyer.ts`: buyer preferences and intent.
- `agent.ts`: worker health, runs, events, turns, thread presentation, tool calls, and property-search memory.
- `knowledge.ts`: profile/workspace facts.
- `usage.ts`: usage ledger, LLM cache, and analytics events.
- `index.ts`: composes all table groups for `schema.ts`.

## Public Interfaces

The public interface is the table/index contract consumed by Convex functions. Do not rename fields or indexes without a migration plan.

## Known Blockers/Risks

- Add indexes before replacing query filters.
- Index names must include every field in order.
- Avoid unbounded arrays on documents; create child tables for growing collections.
- Separate high-churn data such as worker heartbeat and events from stable profile/workspace records.

## Where To Add Code

Add new tables to the closest concern file, export them through `index.ts`, and update affected function registers/docs in the same change.
