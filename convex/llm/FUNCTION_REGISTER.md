# LLM Function Register

## Public Functions

- `public/listProfileFacts.ts/listProfileFacts` public query: lists the authenticated user's knowledge facts.
- `public/promoteProfileFact.ts/promoteProfileFact` public mutation: promotes a profile fact and schedules sync when needed.
- `public/updateProfileFact.ts/updateProfileFact` public mutation: updates a profile fact for the authenticated user.

## Internal Functions

- `internal/facts.ts/getFactById` internal query: fetches one knowledge fact.
- `internal/facts.ts/listFactsByOwner` internal query: lists facts for one owner key.
- `internal/facts.ts/upsertKnowledgeFact` internal mutation: upserts one fact by owner/key.
- `internal/facts.ts/markKnowledgeFactSync` internal mutation: stores RAG sync metadata.
- `internal/facts.ts/patchKnowledgeFact` internal mutation: patches fact content/status.
- `cache/internal.ts/getCacheEntry` internal query: reads one LLM cache entry by scope/kind/model/hash.
- `cache/internal.ts/putCacheEntry` internal mutation: upserts one LLM cache entry.
- `rag/sync.ts/syncFactToRag` internal action: syncs a knowledge fact to RAG storage.

## Shared Helpers

- `cache/client.ts`: cache kind validation and scope key creation.
- `cache/hash.ts`: stable text hashing.
- `lib/factText.ts`: fact text formatting.
- `lib/upsertFact.ts`: mutation helper for fact upsert.
- `rag/client.ts`: RAG component handle.
- `rateLimiter.ts`: rate limiter component handle.
