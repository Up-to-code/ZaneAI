# Zayon Analytics Funnel

## Core principle

Track decision progress, not vanity clicks. Every event should help answer:

- What did AI show?
- What did user act on?
- What was ignored?
- What moved toward conversion?

## Required phase-1 events

- `app_open`
- `screen_view`
- `ai_prompt_sent`
- `ai_response_stream_start`
- `ai_response_stream_end`
- `voice_input_started`
- `voice_input_completed`
- `property_impression`
- `property_click`
- `property_save`
- `property_compare`
- `ai_suggestion_clicked`
- `contact_agent`
- `schedule_visit`

## Payload guidance

- Include stable ids: `sessionId`, `propertyId`, `recommendationBatchId`, `messageId`.
- Include route name for screen events.
- Include interaction source: `home_feed`, `saved`, `property_detail`, `assistant`.
- Avoid raw PII in analytics payloads.
