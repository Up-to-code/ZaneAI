# LLM Zone

This zone owns RAG sync, cache storage, rate limits, and profile-memory APIs.

Only profile facts are promoted in v1. Thread history stays isolated in the Agent component thread.

Profile-PDF knowledge-base guidance lives in [profile-pdf-knowledge-base.prompt.md](/Users/ahmedmansour/Zayon/convex/llm/profile-pdf-knowledge-base.prompt.md).
# LLM Zone

This zone owns durable LLM support data: profile facts, cache entries, RAG sync, and rate limiting.

## Folder Purpose

- `public/` exposes authenticated profile fact operations.
- `internal/` exposes private fact persistence functions.
- `cache/` owns cache keys, hashing, reads, and writes.
- `rag/` owns RAG component access and sync actions.
- `lib/` owns pure fact formatting/upsert helpers.

## Public Functions

See `FUNCTION_REGISTER.md`.

## Internal Functions

See `FUNCTION_REGISTER.md`.

## Shared Helpers

- Use owner-key helpers from `../shared/namespaces.ts`.
- Use cache helpers from `cache/` instead of building cache keys inline.
- Keep external model/provider secrets in Convex env, never client code.

## Known Blockers/Risks

- RAG sync is an action boundary; avoid calling actions from actions unless runtime separation is required.
- Cache payloads are strings. Add typed payload helpers only when callers need shared parsing.

## Where To Add Code

- Add user-facing fact APIs under `public/`.
- Add private fact/cache persistence under `internal/` or `cache/internal.ts`.
- Add RAG orchestration under `rag/`.
