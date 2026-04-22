# ZaneAI Agent Response Evaluation

This note captures the conversation-level behavior we want ZaneAI to preserve while improving the agent.

## Core Rule

ZaneAI should choose the smallest useful response shape.

- Simple greeting or explanation: text only.
- Clarifying question: text only, maybe short suggestions.
- Property search/recommendation: text plus property cards and `open_search` action.
- Comparison: text plus comparison UI only when multiple concrete properties exist.
- Funding analysis: text first; funding UI only when options or structured tradeoffs add value.
- Previous result reference: reuse session/history before running a new search.
- Fresh/current market request: use web/current-data tools only when freshness matters.

## Prompt Set

### Text Only

- `Hi ZaneAI`
- `What can you help me with?`
- `Explain the difference between renting and buying in one sentence.`
- `I don't want listings yet. Just tell me what info you need to recommend a place.`
- `Don't search yet. Tell me what you understood from my request.`
- `I'm only asking a question, not asking for listings: is 5000 EGP realistic near GEM?`

Expected behavior: short advisor response, no property cards, no search action.

### Clarify Before Search

- `Find me a good apartment.`
- `I need something near me tonight.`
- `Show me places for my family.`
- `I want a cheap place in Cairo.`

Expected behavior: ask one focused follow-up if the database query would be too vague. Do not over-render UI.

### Search And Render Cards

- `Find apartments near the Grand Egyptian Museum for tonight, max 5000 EGP.`
- `I need a furnished 2-bedroom rental in Sheikh Zayed around 6000 EGP.`
- `Show me villas near New Cairo with a pool.`
- `Find studios close to Zamalek, cheapest good options first.`

Expected behavior: property route, retrieve candidates, rank them, render property cards, include generated `open_search` payload.

### Smart Relaxation

- `I want something near the Grand Egyptian Museum under 3000 EGP. If nothing exists, show nearby areas.`
- `Find me a place in Zamalek around 2500 EGP, but don't be strict if there is a better nearby option.`
- `I need a rental tonight near Downtown Cairo. If exact area is expensive, compare nearby alternatives.`
- `Max 5000 EGP near GEM. Don't show higher unless there are no good options, and explain why.`

Expected behavior: exact first, nearby next, relaxed only when needed. Explain the relaxation.

### Reuse History

- `Show me more like the second one.`
- `Compare the first and third apartments.`
- `What was the cheaper one you showed me?`
- `Get me the phone number for that apartment.`
- `Open the search for the query you used before.`

Expected behavior: call search-session/history memory before rerunning search.

### Rerun Search

- `Actually change the budget to max 7000 EGP.`
- `Forget Sheikh Zayed, search near New Cairo instead.`
- `Now I need 3 bedrooms, not 2.`
- `Search again with only available places for tonight.`

Expected behavior: rerun search because core constraints changed.

### Deep Compare

- `Compare the top 3 and tell me which is best for a family.`
- `Which one is the best value, not just the cheapest?`
- `Rank these by location, price, and confidence.`
- `Tell me what tradeoffs I'm making between the first two.`

Expected behavior: comparison/ranking logic, not a fresh broad search unless no previous result set exists.

## Current Executable Coverage

The starter regression suite is in:

- `apps/mobile/src/tests/assistantEvaluation.test.ts`

It checks:

- routing to advisor/property/funding/mixed
- text-only advisor behavior
- UI rendering only when property/search/funding/source payloads add value
- generic `continue_thread` actions do not force cards

## Improvement Loop

1. Add failed prompt to `assistantEvaluation.test.ts`.
2. State the expected route and UI behavior.
3. Run `npm --workspace @zane-ai/mobile run test`.
4. Patch router, planner, ranker, or UI policy.
5. Re-run typecheck and tests.
