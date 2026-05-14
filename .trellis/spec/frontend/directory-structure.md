# Directory Structure

> How the Vue frontend is currently organized.

---

## Overview

The repo is organized by responsibility more than by route segment:

- `src/tools/` contains end-user developer tools
- `src/ui/` contains reusable design-system-style components
- `src/pages/` contains top-level pages
- `src/layouts/` contains layout shells used by routes
- `src/composable/` contains reusable composition helpers
- `src/stores/` and some feature-local `*.store.ts` files contain Pinia stores
- `src/modules/` contains cross-cutting feature modules that are not generic enough for `ui/` or `composable/`

This separation is visible in routing: top-level pages come from `src/pages`, tool views come from `src/tools`, and route metadata points to layouts from `src/layouts` (`src/router.ts`).

---

## Directory Layout

```text
src/
├── assets/              # static assets and SVG components
├── components/          # shared app-level components
├── composable/          # reusable Vue composables
├── layouts/             # base and tool page shells
├── modules/             # feature modules (tracker, i18n, command palette)
├── pages/               # route pages such as home/about/404
├── plugins/             # app plugins (i18n, naive, plausible)
├── stores/              # global Pinia stores
├── tools/               # individual end-user tools
├── ui/                  # reusable UI primitives and demos
├── utils/               # non-Vue helper utilities
├── config.ts            # app configuration
├── main.ts              # app bootstrap
└── router.ts            # route assembly
```

---

## Tool Folder Convention

Each tool gets its own folder under `src/tools/<tool-slug>/`.

The minimal shape is:

```text
src/tools/<tool>/
├── index.ts             # defineTool registration
└── <tool>.vue           # main UI component
```

Optional siblings are added when the tool needs them:

- `*.service.ts` for non-UI logic with side effects or orchestration
- `*.models.ts` for pure data helpers
- `*.types.ts` for exported interfaces/types
- `*.test.ts` for unit tests
- `*.e2e.spec.ts` for Playwright coverage
- extra local subcomponents for tool-specific presentation

Real examples:

- `src/tools/json-minify/index.ts` + `src/tools/json-minify/json-minify.vue`
- `src/tools/eta-calculator/eta-calculator.vue` + `src/tools/eta-calculator/eta-calculator.service.ts`
- `src/tools/user-agent-parser/user-agent-parser.vue` + `src/tools/user-agent-parser/user-agent-parser.types.ts` + `src/tools/user-agent-parser/user-agent-result-cards.vue`
- `src/tools/mac-address-generator/` and `src/tools/color-converter/` include colocated model tests

Do not register a tool directly in `src/router.ts`; tools are aggregated from `src/tools` and mapped into routes in `src/router.ts`.

---

## Layout, Page, Tool, and UI Separation

- **Layouts** define shared page chrome. Examples: `src/layouts/base.layout.vue`, `src/layouts/tool.layout.vue`.
- **Pages** are route endpoints that are not tool definitions. Examples: `src/pages/Home.page.vue`, `src/pages/About.vue`, `src/pages/404.page.vue`.
- **Tools** are feature folders representing a developer utility, each with its own route metadata and lazy-loaded component.
- **UI** contains reusable primitives with a `c-` prefix, such as `src/ui/c-button/`, `src/ui/c-input-text/`, and `src/ui/c-select/`.

Use `src/components/` for app-specific reusable pieces that are broader than one tool but not generic enough to become design-system primitives. Examples include `src/components/MenuLayout.vue` and `src/components/CollapsibleToolMenu.vue`, both used by layouts.

---

## Naming Conventions

- Tool folders use kebab-case: `json-minify`, `user-agent-parser`
- Tool entry files are always named `index.ts`
- Tool view files usually mirror the folder name: `json-minify.vue`, `user-agent-parser.vue`
- Type/model/service helpers use suffixes: `*.types.ts`, `*.models.ts`, `*.service.ts`
- Layout files use `*.layout.vue`
- Route pages often use `*.page.vue`, though legacy pages like `About.vue` still exist
- UI component folders use `c-` prefixes, e.g. `src/ui/c-button/`
- Composable filenames are nouns or short phrases in lower camel/kebab style without a `use-` filename prefix, e.g. `copy.ts`, `validation.ts`, `fuzzySearch.ts`

---

## Import Conventions

- Use relative imports for near siblings inside the same feature folder (`./color-converter.models`, `../tool`)
- Use `@/` aliases for cross-cutting imports from elsewhere in `src/` (`@/config`, `@/stores/style.store`, `@/plugins/i18n.plugin`)

Examples:

- `src/tools/json-minify/index.ts` imports `defineTool` relatively and i18n via alias
- `src/layouts/base.layout.vue` mixes a relative component import (`../components/MenuLayout.vue`) with alias imports for stores/modules
- `src/ui/c-input-text/c-input-text.vue` imports theme utilities relatively and app composables/utilities through `@/`

---

## Good Reference Folders

- `src/tools/json-minify/` for the smallest complete tool shape
- `src/tools/user-agent-parser/` for a tool with local types and child components
- `src/ui/c-button/` for a reusable UI primitive with colocated theme logic
- `src/ui/demo/` for development-only demo route generation via `import.meta.glob`
