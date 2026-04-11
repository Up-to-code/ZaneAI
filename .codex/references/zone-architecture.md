# Zayon Zone Architecture

## Zones

- `foundation`: tokens, theme, primitives, motion, utilities.
- `shell`: layouts, providers, navigation, app scaffolds.
- `conversation`: assistant feed, message rendering, composer integration, stream control.
- `decision`: property cards, match reasons, compare/save actions, detail summaries.
- `intelligence`: top insights, recommendation modules, orchestration-facing hooks.
- `voice`: permissions, recording state, transcription adapters.
- `persistence`: Convex client setup, analytics emitters, local cache bridges.
- `store`: Zustand slices and selectors only.

## Dependency direction

- `foundation` can be used by every zone.
- `shell` can use `foundation`, `store`, `persistence`.
- feature zones (`conversation`, `decision`, `intelligence`, `voice`) can use `foundation`, `store`, `persistence`.
- `store` must not import feature zones.
- `persistence` must not import feature zones.

## Ownership

- Client UI state belongs in Zustand.
- Persistent data and realtime sync belong in Convex.
- AI orchestration belongs in Convex actions plus explicit adapters.

## Screen mapping

- Home = shell + intelligence + conversation + decision
- Saved = shell + decision
- Property detail = shell + decision + intelligence
