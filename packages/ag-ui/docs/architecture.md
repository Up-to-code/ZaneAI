# AG UI Architecture

## Summary

`@zaneai/ag-ui` separates the AG UI contract from any single host app. The package owns the turn protocol, default card set, registry, and React renderer. Hosts own data fetching, mutations, transport, and side effects.

## Layers

- `src/protocol`
  Defines `AgUiConversationTurn`, card ids, action metadata, schemas, and the demo/reference `resolveAgUiTurn`.
- `src/cards`
  Ships the default ready-to-use card components.
- `src/react`
  Provides the renderer plus registry merge helpers and action dispatch plumbing.
- `src/zaneai`
  Keeps the currently coupled ZaneAI workspace adapters behind a dedicated entrypoint.

## Rendering lifecycle

1. The host receives or builds an `AgUiConversationTurn`.
2. `AgUiTurnRenderer` walks `turn.cards` in order.
3. Each card resolves through the default registry plus any consumer overrides.
4. The renderer injects `agUiContext`, which includes `turn`, `card`, and `dispatchAction`.
5. Cards can trigger host-owned callbacks through `actionHandlers`.

## Registry model

- The default registry lives in `src/react/registry.ts`.
- Consumers can override only the card ids they care about.
- Unknown card ids fail safely and render nothing.

## Generic core vs ZaneAI adapter

- Generic core:
  Cards, protocol, schemas, orchestration helper, and renderer.
- ZaneAI adapter:
  `AgPropertyForm`, `AgRichTextEditor`, and `AgDeleteConfirmModal`.

The adapter exists because those components still depend on UploadThing, ZaneAI workspace visuals, and ZaneAI-specific contracts. That keeps the generic package usable in other projects without importing workspace-only code.
