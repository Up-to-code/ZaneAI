# Shared Zone

Cross-zone helpers only: shared types, namespace builders, environment readers, and tiny demo data.

Do not put feature logic here. If a helper is only useful to one zone, keep it inside that zone.

## Folder Purpose

- `env.ts`: Convex runtime environment readers for LLM/search providers.
- `namespaces.ts`: owner-key builders for profile/workspace scoped data.
- `types.ts`: small cross-zone shared types.

## Public Functions

This folder should not register Convex public functions.

## Internal Functions

This folder should not register Convex internal functions.

## Shared Helpers

Use this folder only when at least two backend zones need the helper and the helper has no feature ownership of its own.

## Known Blockers/Risks

- Do not move inventory, auth, property, or agent business logic here just to make imports convenient.
- Never expose provider secrets to client surfaces.

## Where To Add Code

Add tiny cross-zone primitives here. If a helper belongs to one domain, keep it in that domain's `lib/`.
