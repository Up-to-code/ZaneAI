---
name: zayon-system-rules
description: >
  Zayon project-wide implementation rules for stack, zone boundaries, state ownership,
  analytics discipline, and premium mobile constraints. Use when building or reviewing
  any part of the Zayon app so decisions stay aligned with the project architecture.
---

# Zayon System Rules

Apply these rules before changing code in Zayon.

- Stack is React Native mobile app first. No DOM assumptions.
- Expo Router is default navigation framework.
- Zustand owns client UI/session/composer/voice state.
- Convex owns persistent user, property, recommendation, analytics, and AI event data.
- Multi-agent orchestration defaults to `@jackchen_me/open-multi-agent`.
- Keep zone imports one-way. Read [zone architecture](../../references/zone-architecture.md).
- Track user decision funnel using [analytics funnel](../../references/analytics-funnel.md).
- Keep UI premium and calm using [brand system](../../references/brand-system.md).
- Never expose model provider secrets on device.
- Favor reusable primitives and app-shell components over one-off screen code.
