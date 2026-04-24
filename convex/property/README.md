# Property Zone

This zone owns property lookups used by agent orchestration and public property reads.

## Folder Purpose

- `public/` exposes app-callable property reads and saved-property mutations.
- `internal/` exposes Convex-private wrappers for agent orchestration.
- `lib/` owns catalog mapping, bounded search, recommendation/ranking, and optional Typesense integration.

## Public Functions

See `FUNCTION_REGISTER.md`.

## Internal Functions

See `FUNCTION_REGISTER.md`.

## Shared Helpers

- `lib/catalog.ts` maps listing rows and related assets into app-facing property payloads.
- `lib/search.ts` keeps search bounded and centralizes smart-search candidate gathering.
- `lib/recommendation.ts` owns ranking and relaxation logic.
- `lib/typesense.ts` owns optional external search integration.

## Known Blockers/Risks

- Keep all property queries bounded with `take()` or pagination.
- Recommendation logic can live here when it ranks property rows. Conversation strategy and agent-specific explanation should stay in `agent/`.
- Do not introduce unbounded arrays on property/listing documents; use child tables for growing data.

## Where To Add Code

- Add app-callable property functions under `public/`.
- Add agent-only query wrappers under `internal/`.
- Add pure ranking/search/mapping helpers under `lib/`.
