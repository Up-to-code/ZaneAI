---
name: zayon-feature-delivery
description: >
  Delivery checklist for mapping new Zayon features to zones, stores, analytics events,
  Convex tables, and AI contracts. Use when planning or implementing new screens,
  flows, or product capabilities in Zayon.
---

# Zayon Feature Delivery

For every feature:

1. Map affected zones using [zone architecture](../../references/zone-architecture.md).
2. Decide which state is local Zustand versus persistent Convex.
3. Add or reuse analytics from [analytics funnel](../../references/analytics-funnel.md).
4. If AI involved, update [AI orchestration](../../references/ai-orchestration.md) assumptions.
5. Keep UI aligned with [brand system](../../references/brand-system.md).

Do not ship a feature with missing state ownership, analytics, or agent/data contract notes.
