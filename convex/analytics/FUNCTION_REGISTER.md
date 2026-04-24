# Analytics Function Register

## Public Functions

- `public/trackEvent.ts/trackEvent` public mutation: stores one analytics event with optional auth, organization, session, thread, route, source, and JSON payload metadata.
- `public/getWorkspaceStats.ts/getWorkspaceStats` public query: returns bounded recent organization trend, CTA breakdown, and totals from indexed analytics rows.

## Shared Notes

- Organization analytics reads use `by_organizationId_and_createdAt`.
- Keep event payloads JSON strings until a concrete query need justifies structured fields.
- For exact long-window dashboards, add aggregate tables instead of scanning raw event rows.
