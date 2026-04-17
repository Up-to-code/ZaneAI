# Integration Guide

## Use inside this repo

Add path or workspace resolution for:

- `@zaneai/ag-ui`
- `@zaneai/ag-ui/react`
- `@zaneai/ag-ui/zaneai`

In `apps/web`, import the package directly:

```ts
import type { AgUiConversationTurn } from "@zaneai/ag-ui";
import { AgUiTurnRenderer } from "@zaneai/ag-ui/react";
import { AgPropertyForm } from "@zaneai/ag-ui/zaneai";
```

## Use in a fresh Next app

1. Install the package and peer dependencies.
2. Render `AgUiTurnRenderer` inside a client boundary.
3. Provide your own `AgUiConversationTurn` payloads from your agent/backend layer.
4. Optionally override card ids with your own components.
5. Wire action callbacks with `actionHandlers`.

## Host responsibilities

- Build or receive valid turn payloads
- Persist conversations if needed
- Execute mutations, API requests, or navigation on approve/edit
- Override cards when your product needs a different visual language

## When to use the ZaneAI adapter

Use `@zaneai/ag-ui/zaneai` only when you need the current ZaneAI workspace-specific adapters. Other projects should stay on the generic entrypoints unless they intentionally mirror the ZaneAI form workflow.
