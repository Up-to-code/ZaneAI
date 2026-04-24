# Convex Audit

This is the living review backlog for Convex documentation, repeated logic, permissions, query/index health, and SOLID cleanup. Keep entries concrete and remove them when fixed.

## Fixed In This Pass

- Added `core/lib.ts` workspace capability helpers so inventory and organization permission checks have one shared implementation.
- Switched workspace analytics stats from `.filter().collect()` to the `by_organizationId_and_createdAt` index with a bounded `take(1000)`.
- Replaced the most visible `ctx: any` / `q: any` cluster in `agent/public/editUserMessage.ts` with `MutationCtx` and inferred query-builder types.
- Replaced small unbounded reads in run-cost summary and listing asset mapping with explicit `take()` limits.
- Added root and zone function registers so exported Convex APIs have a maintainable review surface.

## High Priority

- `agent/orchestrator/worker.ts` is still too large. Split behavior-preservingly into routing, model generation, specialist execution, tool recording, memory loading, and worker lifecycle files.
- `agent/orchestrator/runtime.ts` should be split into run state, worker state, event persistence, usage, memory reads, and presentation helpers.
- `partnerProperties.ts` and `workspaceUnits.ts` should move project/unit asset, compliance, publication, and mapping helpers into an inventory lib folder.
- Analytics counts are still computed from recent event rows. If dashboards need exact scale-proof counts, add denormalized aggregate tables maintained by mutations.

## Query And Index Review

- Avoid new `.filter()` usage in Convex DB queries. If a filter is needed, add an index named with every indexed field.
- Audit any future `.collect()` calls before growth-sensitive tables expand. Current known app-code instances have been converted to bounded `take()` reads.
- Keep `take()` limits explicit and product-driven. Avoid silently returning all records.
- For date-window queries, prefer compound indexes ending in the timestamp field.

## Permission Review

- Workspace inventory writes should use `requireWorkspaceCapability(ctx, "manageInventory", message)` or `assertWorkspaceCapability(...)` after an existing workspace read.
- Organization membership/profile writes should use `manageOrganization` or explicit owner/manager role assertions.
- Public agent functions must derive the auth user server-side and verify thread ownership before reads or writes.
- Do not accept `userId`, `authUserId`, or `profileId` from clients for authorization.

## Type Review

- Remove avoidable `any` in Convex functions first, especially `ctx`, query builders, and component boundaries.
- Component handles may still require narrow casts. Keep those casts local and documented near the adapter.
- Prefer `Doc<"table">` and `Id<"table">` for documents and ids.

## Documentation Review

- Keep every exported function listed in a nearby `FUNCTION_REGISTER.md`.
- Update zone READMEs when adding public APIs, internal APIs, or shared helpers.
- Add audit entries for behavior-changing refactors before implementing them.
