---
title: StateLoom
description: >-
  A universal state management SDK that unifies store, atom, and proxy paradigms on a ~1.5 KB signal-based reactive core, with adapters for React, Vue, Solid, Svelte, and Angular, and composable middleware for persistence, devtools, and SSR.
tags:
  - state-management
  - signals
  - reactivity
  - typescript
github: "https://github.com/sujeet-pro/stateloom"
docsUrl: "https://projects.sujeet.pro/stateloom/"
packages:
  - name: "@stateloom/core"
    url: "https://www.npmjs.com/package/@stateloom/core"
  - name: "@stateloom/store"
    url: "https://www.npmjs.com/package/@stateloom/store"
  - name: "@stateloom/react"
    url: "https://www.npmjs.com/package/@stateloom/react"
  - name: "@stateloom/atom"
    url: "https://www.npmjs.com/package/@stateloom/atom"
  - name: "@stateloom/proxy"
    url: "https://www.npmjs.com/package/@stateloom/proxy"
badges:
  - label: "Publish Packages"
    image: "https://github.com/sujeet-pro/stateloom/workflows/Publish%20Packages/badge.svg"
    href: "https://github.com/sujeet-pro/stateloom/blob/main/.github/workflows/publish-packages.yml"
    alt: "Package publishing status for StateLoom"
---

Frontend state management is fragmented. Teams pick Zustand for stores, Jotai for atoms, or Valtio for proxies --- then discover they can't share middleware, mix paradigms, or migrate between frameworks without rewriting state logic. StateLoom unifies all three paradigms on a single signal-based reactive core, with framework adapters for React, Vue, Solid, Svelte, and Angular, and composable middleware for persistence, devtools, sync, and more.

- [GitHub Repository](https://github.com/sujeet-pro/stateloom)
- [npm](https://www.npmjs.com/org/stateloom)
- [Documentation](https://projects.sujeet.pro/stateloom/)

## Architecture

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="diagrams/architecture-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="diagrams/architecture-light.svg" />
  <img alt="StateLoom architecture diagram" src="diagrams/architecture-light.svg" />
</picture>

## What It Does

StateLoom is a universal state management SDK published as 18 packages under the `@stateloom/*` npm scope. It provides three distinct API paradigms --- all backed by the same reactive dependency graph:

- **Store paradigm** (`@stateloom/store`) --- A Zustand-style single-object store with actions, selectors, and full middleware support.
- **Atom paradigm** (`@stateloom/atom`) --- A Jotai-style bottom-up composition model with base atoms, derived atoms, writable atoms, and atom families.
- **Proxy paradigm** (`@stateloom/proxy`) --- A Valtio-style mutable proxy with structural sharing snapshots.

## Key Features

| Feature                        | Description                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **~1.5 KB core**               | Signal, computed, effect, batch, and scope in a tree-shakeable core with zero platform API dependencies |
| **Three paradigms, one graph** | Store, Atom, and Proxy all backed by the same signal dependency graph                                   |
| **Five framework adapters**    | React, Vue, Solid, Svelte, and Angular                                                                  |
| **Composable middleware**      | Persistence, devtools, history, tab-sync, Immer integration, and telemetry                              |
| **SSR-first scopes**           | Per-request isolation via `Scope` with fork, serialize, and framework-level `ScopeProvider`             |
| **TC39 Signals alignment**     | Core API matches the TC39 Signals proposal (Stage 1)                                                    |

## Getting Started

```bash
# Store paradigm + React (most common)
pnpm add @stateloom/core @stateloom/store @stateloom/react

# Atom paradigm (bottom-up composition)
pnpm add @stateloom/core @stateloom/atom

# Proxy paradigm (mutable syntax)
pnpm add @stateloom/core @stateloom/proxy
```

```typescript title="counter-store.ts"
import { createStore } from "@stateloom/store";

const counterStore = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

## Tech Stack

| Component         | Technology                                             |
| ----------------- | ------------------------------------------------------ |
| **Language**      | TypeScript (strict mode)                               |
| **Reactive core** | Custom push-pull hybrid signal graph (~1.5 KB gzipped) |
| **Build**         | tsup (per-package ESM + CJS dual output)               |
| **Monorepo**      | pnpm workspaces + Turborepo                            |
| **Testing**       | Vitest (95% coverage target)                           |
