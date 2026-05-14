# State Management

> How state is currently handled across app, tool, and component scopes.

---

## Overview

Pinia is the shared-state solution in this repo. Local component state still lives in refs/computed values inside SFCs, and persistence is often delegated to VueUse helpers such as `useStorage(...)`.

Real examples:

- `src/stores/style.store.ts` stores app-wide theme/menu/responsive state
- `src/tools/tools.store.ts` stores derived tool lists and favorites persistence
- `src/modules/command-palette/command-palette.store.ts` stores command palette search state and derived grouped results

The codebase uses both Pinia store styles:

- **options store**: `src/stores/style.store.ts`
- **setup store**: `src/tools/tools.store.ts`, `src/modules/command-palette/command-palette.store.ts`

Match the style already used nearby unless there is a clear reason not to.

---

## State Categories

### Local component state

Use local refs/computed values when the state is only needed by one component.

Examples:

- `src/tools/json-minify/json-minify.vue` keeps tool-specific constants and validation rules local
- `src/layouts/tool.layout.vue` derives title/description from route meta locally
- `src/ui/c-input-text/c-input-text.vue` keeps `showPassword`, DOM refs, and validation wiring local

### Shared application state

Use Pinia when multiple parts of the app need the same state or behavior.

Examples:

- `useStyleStore()` is read by layout/navigation components
- `useToolStore()` powers the home page, menu, favorites, and command palette
- `useCommandPaletteStore()` coordinates palette search behavior

### Persisted client state

Persistence often uses VueUse storage helpers inside the store rather than custom storage services.

Examples:

- `src/stores/style.store.ts` uses `useStorage('isMenuCollapsed', ...)`
- `src/tools/tools.store.ts` uses `useStorage('favoriteToolsName', [])`

### Route state

Route-driven state is mostly derived from Vue Router rather than duplicated in stores.

Example:

- `src/layouts/tool.layout.vue` reads `route.meta` and `route.path` instead of duplicating tool header data in Pinia.

---

## Derived State Patterns

- Prefer `computed(...)` for filtered/grouped/translated views of existing state
- Keep the source state small and derive presentation-specific structures on demand

Examples:

- `src/tools/tools.store.ts` computes translated tools, `toolsByCategory`, `favoriteTools`, and `newTools`
- `src/modules/command-palette/command-palette.store.ts` computes filtered grouped search results from `searchPrompt`
- `src/layouts/base.layout.vue` computes the displayed tool categories from store refs and i18n

Avoid duplicating derived arrays in state when a computed value is sufficient.

---

## When To Create A Store

Create or extend a Pinia store when at least one of these is true:

- multiple unrelated components need the same state
- the state should persist across navigations or reloads
- the state coordinates navigation, theming, favorites, command palette behavior, or other app-level behavior

Keep state local when:

- it is only used by one tool/component
- it is a temporary form/input concern
- it is just a small computed view of route props or local props

---

## Server State Reality

This repo is mostly a client-side utility site and does not use a dedicated server-state cache library. There is no established equivalent of TanStack Query/Vue Query here.

Current pattern:

- small browser/API interactions are handled inline, through composables, or via lightweight service helpers
- long-lived async shared server state is not a dominant concern in the current architecture

Do not add a heavy server-state abstraction unless the feature truly introduces that need across multiple screens.

---

## Common Mistakes To Avoid

- Promoting one-component state into Pinia too early
- Storing translated/display-ready duplicates when a computed mapping can derive them
- Ignoring existing persistence helpers and re-implementing localStorage access by hand
- Copying route metadata into stores instead of reading it from the router
