# Property Function Register

## Public Functions

- `public/listCandidateProperties.ts/listCandidateProperties` public query: returns bounded active property candidates.
- `public/searchProperties.ts/searchProperties` public query: searches active properties using catalog and search helpers.
- `public/smartSearchProperties.ts/smartSearchProperties` public query: ranks properties with relaxation/recommendation metadata.
- `public/listByIds.ts/listByIds` public query: returns properties by external ids.
- `public/getById.ts/getById` public query: returns one property by external id.
- `public/listSavedProperties.ts/listSavedProperties` public query: lists saved properties for the authenticated profile.
- `public/toggleSavedProperty.ts/toggleSavedProperty` public mutation: toggles one saved property for the authenticated profile.

## Internal Functions

- `internal/listCandidateProperties.ts/listCandidateProperties` internal query: internal candidate list for agent orchestration.
- `internal/searchProperties.ts/searchProperties` internal query: internal search wrapper for agent orchestration.
- `internal/smartSearchProperties.ts/smartSearchProperties` internal query: internal smart-search wrapper for agent orchestration.
- `internal/listSavedProperties.ts/listSavedProperties` internal query: internal saved-property lookup by profile.

## Shared Helpers

- `lib/catalog.ts`: maps listing rows and assets into property-compatible payloads.
- `lib/search.ts`: bounded search, smart search, and id-list lookup.
- `lib/recommendation.ts`: budget/location relaxation and ranking.
- `lib/typesense.ts`: optional Typesense config, search, and result ordering.
