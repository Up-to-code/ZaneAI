# Convex Backend Map

Convex owns Zayon's persistent user, organization, property, recommendation, analytics, and AI event data. Keep this backend decision-ready: public functions should return shapes the app can render directly, while internal functions should stay narrow and composable.

## Request Flow

1. Clients call public Convex functions from `public/` folders or root workspace files.
2. Public functions derive identity server-side through Better Auth helpers, never through client-supplied user ids.
3. Workspace functions resolve profile, membership, and organization through `core/lib.ts`.
4. Mutations keep writes narrow and idempotent where possible.
5. Agent actions and the external worker coordinate orchestration, model calls, memory, and persisted run events.

## Folder Ownership

- `auth/`: Better Auth wiring, current-user/profile resolution, profile bootstrap, and anonymous-account linking.
- `core/`: shared auth/profile/workspace helpers used by root workspace modules.
- `schema/`: all app table definitions, split by backend concern and composed by `schema.ts`.
- `agent/`: thread APIs, run/event persistence, worker runtime bridge, memory, and specialist orchestration.
- `property/`: public/internal property reads, catalog mapping, search, recommendation, and Typesense helpers.
- `llm/`: profile facts, cache, RAG sync, and rate limiting.
- `analytics/`: event tracking and workspace analytics reads.
- `shared/`: tiny cross-zone helpers only, such as env readers and namespace builders.
- Root workspace files such as `partnerWorkspace.ts`, `partnerProperties.ts`, `workspaceUnits.ts`, `buyer.ts`, and `listings.ts` expose legacy/workspace-facing public APIs.

## Function Boundaries

- Use `query`, `mutation`, and `action` only for public app APIs.
- Use `internalQuery`, `internalMutation`, and `internalAction` for private Convex-to-Convex APIs.
- Always define validators for every registered function.
- Prefer `ctx.db.query(...).withIndex(...).take(...)` or pagination over `collect()`.
- Do not use Convex query `.filter()`; add query-driven indexes instead.
- Keep generated files under `_generated/` and component-generated folders untouched unless codegen requires it.

## Shared Helpers

- `core/lib.ts` centralizes profile/workspace resolution, role checks, permission checks, email normalization, slugs, and hashing.
- `auth/requireAuth.ts` centralizes Better Auth user resolution for functions that do not need a profile.
- `agent/lib/threadAccess.ts` centralizes thread ownership checks.
- `property/lib/search.ts` and `property/lib/catalog.ts` centralize property search and read mapping.
- `llm/cache/*` centralizes cache keying and storage.

## Living Docs

- Use zone `README.md` files for local architecture.
- Use `FUNCTION_REGISTER.md` files for exported function maps.
- Use `CONVEX_AUDIT.md` for cleanup backlog, blockers, and review findings.
- Keep docs beside code when ownership is local. Add root docs only for cross-zone architecture.
