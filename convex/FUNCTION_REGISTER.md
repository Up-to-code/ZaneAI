# Root Workspace Function Register

Root files expose workspace-era APIs that are still called directly by apps. Prefer adding new feature code to owned zones when possible; use this register to keep legacy surfaces visible.

## `partnerWorkspace.ts`

- `getWorkspaceState` public query: resolves the current user, default workspace, visible zones, organization summary, metrics, and pending invites. Called by workspace shell/onboarding flows.
- `getInvitePreview` public query: resolves an invite token into a safe preview without mutating state. Called by invite acceptance UI.
- `createOrganization` public mutation: creates the first organization, owner membership, profile updates, and starter project. Called by onboarding.
- `acceptInvite` public mutation: accepts a pending organization invite for the authenticated user. Called by invite acceptance UI.
- `getOrganizationSettingsState` public query: returns organization, active members, and pending invites for settings pages.
- `createOrganizationInvite` public mutation: owner/manager-only invite creation with hashed token storage.
- `updateOrganizationProfile` public mutation: owner/manager-only organization profile update.

## `partnerProperties.ts`

- `listWorkspaceProperties` public query: lists projects for the current workspace with mapped assets and unit summaries.
- `getWorkspaceProperty` public query: returns one project only when it belongs to the current workspace.
- `createWorkspaceProperty` public mutation: inventory-manager project draft creation with assets and compliance.
- `updateWorkspaceProperty` public mutation: inventory-manager project update with asset replacement and compliance upsert.
- `setWorkspacePropertyPublicationState` public mutation: inventory-manager publication/archive state changes and listing sync.
- `deleteWorkspaceProperty` public mutation: inventory-manager soft archive for projects and linked listings.

## `workspaceUnits.ts`

- `listProjectUnits` public query: lists units under a workspace-owned project.
- `listWorkspaceUnits` public query: lists units across the current workspace.
- `getUnit` public query: returns one unit only when it belongs to the current workspace.
- `getProjectUnitCounts` public query: returns unit availability counts for one project.
- `createUnit` public mutation: inventory-manager unit draft creation.
- `updateUnit` public mutation: inventory-manager unit update.
- `deleteUnit` public mutation: inventory-manager soft archive for units and linked listings.
- `upsertListingCompliance` public mutation: inventory-manager compliance upsert for project or unit.
- `publishUnit` public mutation: inventory-manager unit publication and listing sync.
- `unpublishUnit` public mutation: inventory-manager listing pause and unit ready-state update.

## `buyer.ts`

- `getBuyerPreferences` public query: returns the authenticated profile's buyer preferences.
- `updateBuyerPreferences` public mutation: upserts buyer preferences for the authenticated profile.
- `createBuyerIntent` public mutation: creates or updates intent for a listing and mirrors preference signals.

## `listings.ts`

- `listCandidateListings` public query: returns bounded listing candidates.
- `getListing` public query: returns one listing by id.
- `listListingsByIds` public query: returns listings by requested ids.
- `searchListings` public query: searches listings with bounded property search helpers.
- `listSavedListings` public query: lists saved listings for the authenticated profile.
- `toggleSavedListing` public mutation: toggles one saved listing for the authenticated profile.

## Other Root Files

- `migrations.ts/countLegacyMigrationRecords` internal query: counts legacy agent migration candidates for migration planning.
- `http.ts`: registers HTTP routes. Currently only mounts Better Auth routes.
