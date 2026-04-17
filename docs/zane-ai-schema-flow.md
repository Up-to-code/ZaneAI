# Zane-ai Unified Real Estate Core Schema Flow

This document describes the new Convex schema flow for the Zane-ai real estate core.

The core idea is simple:

- `organizations` own private real estate supply.
- `projects` and `units` are workspace/private records.
- `listings` are buyer-safe public projections.
- `profiles` own buyer demand through preferences, saves, intents, and handoffs.
- Private workspace data never leaks directly to buyers or other organizations.

## Core Flow

```mermaid
flowchart TD
  Auth["Better Auth / Convex Auth"] --> Profile["profiles<br/>One authenticated person"]

  Profile -->|professional member| Membership["organizationMembers<br/>role + access"]
  Membership --> Organization["organizations<br/>brokerage / developer / zane_ai"]

  Organization --> Project["projects<br/>private workspace parent"]
  Project --> Unit["units<br/>private sellable or rentable inventory"]
  Project --> Asset["realEstateAssets<br/>images, docs, permits, floor plans"]
  Unit --> Asset

  Project --> Compliance["listingCompliance<br/>publication gate"]
  Unit --> Compliance

  Compliance -->|approved + required fields| Publish["publish mutation<br/>secure projection"]

  Project -->|project-level publish| Listing["listings<br/>buyer-safe public projection"]
  Unit -->|unit-level publish| Listing
  Asset -->|public assets only| Listing

  Profile -->|buyer| Preferences["buyerPreferences<br/>private demand profile"]
  Profile --> Saved["savedListings<br/>buyer saved listings"]
  Saved --> Listing

  Profile --> Intent["buyerIntents<br/>contact / visit / financing / offer interest"]
  Intent --> Listing
  Intent --> Organization

  Profile --> Handoff["conversationHandoffs<br/>approved buyer context summary"]
  Handoff --> Organization
  Handoff --> Listing

  Listing --> BuyerApp["Mobile buyer app<br/>search, save, compare, assistant"]
  Project --> WorkspaceApp["Workspace app<br/>manage drafts, units, publish"]
  Unit --> WorkspaceApp
  Organization --> WorkspaceApp
```

## Publication Flow

```mermaid
flowchart LR
  Draft["Draft project/unit<br/>private to organization"] --> Edit["Workspace edit<br/>owner / manager / editor"]
  Edit --> Assets["Attach assets<br/>public or private visibility"]
  Edit --> Compliance["Add compliance<br/>license / registration / review"]
  Compliance --> Ready{"Ready to publish?"}

  Ready -->|No| Draft
  Ready -->|Yes| Publish["Publish mutation"]

  Publish --> CheckRole{"Role allowed?"}
  CheckRole -->|No| Reject["Reject"]
  CheckRole -->|Yes| CheckOwnership{"Owns organization record?"}

  CheckOwnership -->|No| Reject
  CheckOwnership -->|Yes| CheckCompliance{"Compliance valid?"}

  CheckCompliance -->|No| Reject
  CheckCompliance -->|Yes| Projection["Create/update listing"]

  Projection --> PublicListing["Active public listing<br/>buyer-safe fields only"]
  PublicListing --> Search["Buyer search"]
  PublicListing --> Save["Buyer save"]
  PublicListing --> Intent["Buyer intent / handoff"]
```

## Access Rules Flow

```mermaid
flowchart TD
  User["Authenticated user"] --> Profile["profiles"]

  Profile --> BuyerPath{"Buyer action?"}
  BuyerPath -->|Yes| BuyerRead["Can read active listings"]
  BuyerPath --> BuyerOwn["Can manage own saves, preferences, conversations"]
  BuyerPath --> BuyerBlocked["Cannot read drafts, private assets, compliance, org members"]

  Profile --> WorkspacePath{"Workspace action?"}
  WorkspacePath --> MembershipCheck["Check active organizationMembers"]
  MembershipCheck -->|No membership| Deny["Deny"]
  MembershipCheck -->|Active member| RoleCheck["Check role"]

  RoleCheck --> Viewer["viewer<br/>read workspace only"]
  RoleCheck --> Editor["editor<br/>create/update drafts + assets"]
  RoleCheck --> Manager["manager<br/>publish, invite, settings, inventory"]
  RoleCheck --> Owner["owner<br/>full organization control"]

  Viewer --> OrgScoped["Only own organization data"]
  Editor --> OrgScoped
  Manager --> OrgScoped
  Owner --> OrgScoped

  OrgScoped --> PrivateData["projects, units, assets, compliance, intents"]
```

## Entity Relationship View

```mermaid
erDiagram
  profiles ||--o{ organizationMembers : joins
  organizations ||--o{ organizationMembers : has
  organizations ||--o{ organizationInvites : sends

  organizations ||--o{ projects : owns
  projects ||--o{ units : contains
  projects ||--o{ realEstateAssets : has
  units ||--o{ realEstateAssets : has

  projects ||--o| listingCompliance : gated_by
  units ||--o| listingCompliance : gated_by

  projects ||--o{ listings : publishes
  units ||--o{ listings : publishes
  listings ||--o{ realEstateAssets : displays

  profiles ||--o| buyerPreferences : owns
  profiles ||--o{ savedListings : saves
  listings ||--o{ savedListings : saved_as

  profiles ||--o{ buyerIntents : creates
  listings ||--o{ buyerIntents : receives
  organizations ||--o{ buyerIntents : receives

  profiles ||--o{ conversationHandoffs : shares
  organizations ||--o{ conversationHandoffs : receives
  listings ||--o{ conversationHandoffs : references
```

## Table Responsibilities

| Table | Responsibility | Visibility |
| --- | --- | --- |
| `profiles` | One authenticated person in Zane-ai. | Own profile only, except workspace member display. |
| `organizations` | Brokerages, developers, and Zane-ai internal teams. | Members can read their own organization. |
| `organizationMembers` | Role-based workspace access. | Organization scoped. |
| `organizationInvites` | Pending team invite flow. | Invitee by email/token, managers/owners by organization. |
| `projects` | Private parent record for compounds, buildings, developments, or standalone groups. | Owning organization only until projected into listings. |
| `units` | Private sellable/rentable inventory under a project. | Owning organization only until projected into listings. |
| `listings` | Buyer-safe searchable projection. | Public when `status = "active"`. |
| `realEstateAssets` | Images, videos, documents, permits, and floor plans. | Depends on `visibility`. |
| `listingCompliance` | Publication gate and private compliance notes. | Owning organization only. |
| `buyerPreferences` | Buyer-owned demand profile. | Buyer only unless explicitly shared. |
| `savedListings` | Buyer saved listings. | Buyer only. |
| `buyerIntents` | Buyer contact, visit, financing, or offer interest. | Buyer and target organization. |
| `conversationHandoffs` | Approved buyer context shared with an organization. | Buyer and target organization. |

## Core Rules

- Buyers query `listings`, not `projects` or `units`.
- Workspace users manage `projects`, `units`, `realEstateAssets`, and `listingCompliance`.
- Publishing creates or updates a buyer-safe `listing`.
- Private files, compliance notes, internal drafts, and organization-only metadata are never copied into `listings`.
- Saves are keyed by `profileId + listingId`.
- Organization access is always checked through active `organizationMembers`.
- Public Convex functions still need authorization because first-party clients can call them directly.
- Use child tables for unbounded data: assets, saves, intents, handoffs, analytics, messages, and events.
- Use indexed, bounded, or paginated reads for growing tables.

