# Auth Function Register

## Public Functions

- `public/initializeProfile.ts/initializeProfile` public mutation: ensures a profile exists for the authenticated Better Auth user after app sign-in or callback.

## Internal Functions

- `internal/anonymousLink.ts/linkAnonymousAccount` internal mutation: merges an anonymous user's profile, memberships, projects, saved listings, agent runs, memory, analytics, knowledge facts, and cache records into a permanent user.

## Shared Helpers

- `client.ts/authComponent`: Better Auth component handle used by auth/profile helpers.
- `createAuth.ts/createAuth`: creates the Better Auth instance for HTTP wiring.
- `createAuthOptions.ts/createAuthOptions`: builds trusted origins and Better Auth component options from Convex env.
- `profile.ts/ensureProfile`: creates the app profile row for an auth user when missing.
- `profile.ts/getResolvedAuthUserProfile`: resolves display name/avatar from auth provider claims.
- `profile.ts/syncResolvedAuthUserProfile`: syncs provider-derived display data back to Better Auth.
- `requireAuth.ts/requireAuthUser`: requires a Better Auth user without requiring an app profile.
- `requireAuth.ts/getOptionalAuthUser`: returns `null` for unauthenticated callers and rethrows other auth errors.
- `requireAuth.ts/requireAuthUserId`: returns the authenticated Better Auth user id.
