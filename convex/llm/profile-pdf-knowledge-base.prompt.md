# Profile PDF Knowledge Base Prompt

## Goal

Build a durable knowledge base that lets Zane-ai generate a polished profile PDF from structured profile facts instead of relying on raw chat text.

This file defines:

- the canonical fact keys the system should store
- the normalization rules for turning user input into knowledge facts
- the minimum completeness bar before generating a PDF
- the writing rules for the final profile PDF copy

Use this as the source prompt/spec for any workflow that:

- extracts profile information from forms, chat, or manual edits
- stores profile memory in `knowledgeFacts`
- composes a profile PDF for a person, broker, developer, or organization

## Product Intent

The profile PDF should feel:

- credible
- premium
- concise
- decision-friendly
- ready to share with clients, partners, or internal teams

The system should prefer verified structured facts over generated filler. If a fact is missing, the workflow should mark it as missing instead of inventing content.

## Data Sources

Prefer facts in this order:

1. Explicit profile form fields
2. Organization settings fields
3. Manually promoted profile facts
4. High-confidence facts extracted from user conversations

Never let a lower-confidence source overwrite a trusted structured field unless the user explicitly confirms the replacement.

## Storage Contract

Store profile knowledge in `knowledgeFacts` using the existing shape:

- `ownerKey`
- `authUserId`
- `organizationId`
- `scope`
- `key`
- `title`
- `value`
- `summary`
- `source`
- `importance`
- `syncStatus`
- `createdAt`
- `updatedAt`

Recommended conventions:

- `scope`: use `personal` for user profile facts and `organization` for company facts if organization-scoped memory is added later
- `source`: use `manual`, `agent`, `form`, or `import`
- `importance`: use `0.95` to `1` for identity and compliance facts, `0.8` to `0.94` for core business facts, and `0.6` to `0.79` for secondary context
- `summary`: one-line normalized restatement of the fact for retrieval and ranking

## Canonical Fact Keys

### Identity

- `profile.full_name`
- `profile.username`
- `profile.email`
- `profile.phone`
- `profile.role`
- `profile.headline`
- `profile.bio.short`
- `profile.bio.long`
- `profile.languages`
- `profile.location.city`
- `profile.location.country`

### Professional Credibility

- `profile.years_experience`
- `profile.specializations`
- `profile.license_or_registration`
- `profile.certifications`
- `profile.education`
- `profile.awards`
- `profile.notable_clients`
- `profile.key_strengths`

### Market Activity

- `profile.primary_markets`
- `profile.property_types`
- `profile.ticket_size_range`
- `profile.transaction_types`
- `profile.availability_status`
- `profile.response_time_expectation`

### Proof And Performance

- `profile.total_deals_closed`
- `profile.total_volume`
- `profile.recent_highlights`
- `profile.case_studies`
- `profile.client_testimonials`
- `profile.success_metrics`

### Organization

- `organization.name`
- `organization.slug`
- `organization.type`
- `organization.status`
- `organization.is_verified`
- `organization.description`
- `organization.website`
- `organization.contact_email`
- `organization.phone`
- `organization.address`
- `organization.coverage_markets`
- `organization.service_lines`

### Directory And Visibility

- `profile.show_in_offers_directory`
- `profile.public_profile_enabled`
- `profile.shareable_pdf_enabled`

## Normalization Rules

When converting raw text into knowledge facts:

1. Rewrite facts into atomic units.
2. Keep one stable meaning per key.
3. Preserve user wording only when it is already polished and client-safe.
4. Convert vague language into normalized language only if the meaning is clear.
5. Do not infer numeric claims from qualitative wording.
6. Do not invent missing dates, counts, awards, licenses, or markets.
7. Strip internal-only phrasing, chat filler, and tentative language from `summary`.
8. Store the full detailed statement in `value` and the retrieval-friendly restatement in `summary`.

Examples:

- Raw: "I mostly work in New Cairo and sometimes the North Coast."
- Normalized key: `profile.primary_markets`
- Value: `New Cairo; North Coast`
- Summary: `Primary markets are New Cairo and North Coast.`

- Raw: "Been doing this for almost 8 years."
- Normalized key: `profile.years_experience`
- Value: `8`
- Summary: `Has 8 years of experience.`

- Raw: "We can usually reply in under 2 hours during the week."
- Normalized key: `profile.response_time_expectation`
- Value: `Under 2 hours on weekdays`
- Summary: `Typical response time is under 2 hours on weekdays.`

## Minimum Required Fields For PDF Generation

Do not generate a full profile PDF until the knowledge base contains, at minimum:

- `profile.full_name` or `organization.name`
- `profile.role` or `organization.type`
- `profile.headline` or `organization.description`
- at least one contact method
- at least one market or specialization fact

Recommended completeness before marking the PDF share-ready:

- short bio
- long bio
- years of experience
- core markets
- specializations
- one proof point
- one trust signal
- one call-to-action contact block

## Missing Data Policy

If required facts are missing:

- ask targeted follow-up questions
- request only the smallest missing set needed to unlock generation
- group questions by theme
- avoid asking for facts already stored in `knowledgeFacts`

Preferred follow-up order:

1. identity and contact
2. market focus
3. credibility proof
4. brand and positioning

## PDF Composition Rules

The generated PDF should usually contain these sections in order:

1. Cover
2. Executive summary
3. About
4. Core specializations
5. Market coverage
6. Experience and proof
7. Services or transaction focus
8. Contact details

Optional sections:

- certifications
- key projects
- testimonials
- compliance details
- organization snapshot

## Writing Rules For The PDF

Write in a tone that is:

- professional
- premium
- confident
- specific
- easy to scan

Do:

- use clean declarative sentences
- anchor claims in stored facts
- prefer short paragraphs and bullet lists
- make the profile sound credible without hype

Do not:

- invent achievements
- use empty superlatives
- repeat the same fact across sections
- expose internal metadata such as keys, sync status, or importance

## Assembly Prompt Template

Use the following prompt pattern when generating the PDF copy:

```md
You are generating a premium Zane-ai profile PDF.

Use only the supplied structured profile facts.
Do not invent any missing information.
If a key detail is missing, omit the claim and keep the copy clean.

Profile facts:
{{knowledge_facts}}

Generate a polished profile PDF draft with these sections:
- Cover
- Executive summary
- About
- Core specializations
- Market coverage
- Experience and proof
- Contact details

Rules:
- Keep the tone premium, calm, and credible.
- Prefer concise copy over long marketing language.
- Every claim must be traceable to the supplied facts.
- If both personal and organization facts exist, present the personal profile first and the organization context second.
- Output in clean markdown suitable for HTML-to-PDF rendering.
```

## Rendering Hints

For markdown-to-PDF rendering:

- keep headings shallow and predictable
- avoid deeply nested lists
- keep tables optional because narrow layouts may break them
- place contact details in a compact final block
- keep executive summary to 3 to 5 bullets or 1 short paragraph

## Fact Quality Checklist

Before generation, validate that:

- keys match the canonical taxonomy
- no critical identity facts conflict
- duplicate facts are merged
- numeric claims use consistent units
- contact fields are client-safe
- all proof points are attributable to stored facts

## Suggested First Implementation Scope

Phase 1 should support:

- account profile facts
- organization profile facts
- manual fact promotion into `knowledgeFacts`
- markdown profile draft generation
- HTML-to-PDF rendering from the markdown draft

Phase 2 can add:

- confidence scoring by source
- multilingual profile PDFs
- branded PDF themes by organization type
- approval workflow before public sharing

## Notes For Zane-ai

Current editable fields already present in the product map cleanly into this prompt:

- account name
- username
- email
- offers-directory visibility
- organization name
- organization description
- organization website
- organization contact email
- organization phone

This means the knowledge-base layer can start immediately with existing forms, then expand through agent-promoted facts without waiting for a full new profile system.
