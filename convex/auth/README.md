# Auth Zone

This zone owns Better Auth app wiring, current-user helpers, profile bootstrap helpers, and account-linking mutations.

## Folder Purpose

- `client.ts`, `createAuth.ts`, and `createAuthOptions.ts` wire Better Auth to Convex.
- `profile.ts` resolves and creates Zayon profile rows for authenticated users.
- `requireAuth.ts` exposes lightweight auth-user helpers for functions that do not need a profile.
- `public/` contains app-callable auth/profile functions.
- `internal/` contains private account-linking mutations.
- `../betterAuth/` is generated/component-owned Better Auth implementation detail.

## Public Functions

See `FUNCTION_REGISTER.md`.

## Internal Functions

See `FUNCTION_REGISTER.md`.

## Shared Helpers

Use `requireAuthUser` when only the Better Auth user is needed. Use `core/lib.ts` helpers when a profile, workspace membership, or organization is needed.

## Known Blockers/Risks

- Keep Better Auth component casts local to the auth adapter layer.
- Do not accept client-provided user ids for authorization.
- Anonymous account linking touches many tables; keep it internal and migration-like.

## Where To Add Code

- Add new public app auth APIs under `public/`.
- Add Convex-private account/profile migration helpers under `internal/`.
- Add cross-workspace profile or membership helpers in `../core/lib.ts`, not here.
