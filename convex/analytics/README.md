# Analytics Zone

This zone owns durable analytics event writes and workspace analytics reads.

## Folder Purpose

- `public/trackEvent.ts` stores authenticated or anonymous funnel/product events.
- `public/getWorkspaceStats.ts` reads recent organization-scoped event trends for dashboards.

## Public Functions

See `FUNCTION_REGISTER.md`.

## Internal Functions

No internal analytics functions are currently registered.

## Shared Helpers

No shared analytics helpers exist yet. Add them only when multiple analytics functions need the same parsing or aggregation logic.

## Known Blockers/Risks

- Raw event reads are bounded. Use aggregate tables if long-window exact counts become product-critical.
- Keep payloads as JSON strings unless a field needs to be indexed or queried.

## Where To Add Code

Add new public analytics APIs under `public/`. Add new indexes in `schema/usage.ts` before changing query shapes.
