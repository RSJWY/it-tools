# Component Guidelines

> How Vue components are typically authored in this project.

---

## Overview

Components are written as Vue 3 SFCs with `<script setup lang="ts">`. The dominant pattern is:

1. import dependencies
2. define props/emits/computed state in script setup
3. keep template declarative
4. use scoped Less or utility classes for styling

Examples:

- `src/tools/json-minify/json-minify.vue` shows a tiny tool component with all logic in setup and a thin template.
- `src/layouts/base.layout.vue` shows a larger composition-heavy component with stores, route helpers, and scoped Less.
- `src/ui/c-button/c-button.vue` shows the standard reusable UI primitive structure with typed props, emits, computed theme state, and scoped styling.

---

## Standard Component Structure

Preferred order inside `.vue` files:

1. `<script setup lang="ts">`
2. `<template>`
3. `<style scoped lang="less">` when local styling is needed

Inside `<script setup>`:

- import types with `import type`
- keep constants near the top
- call composables/stores before derived `computed(...)`
- use small named functions for event handlers instead of inline complex logic when behavior is non-trivial

Real examples:

- `src/pages/Home.page.vue` defines store access, `useHead`, `useI18n`, derived state, then a named `onUpdateFavoriteTools` handler.
- `src/layouts/tool.layout.vue` computes head metadata and translated tool title/description from the route.
- `src/ui/c-input-text/c-input-text.vue` exposes methods with `defineExpose`, derives validation state, and keeps DOM-specific helpers (`focus`, `blur`, `resizeTextarea`) inside setup.

---

## Props And Emits Conventions

### Props

- Use typed `defineProps<...>()`
- Use `withDefaults(...)` when the component has meaningful defaults
- Destructure with `toRefs(props)` when refs are needed in computed/watch logic
- Prefer explicit unions for prop values over loose strings when the option set is known

Examples:

- `src/ui/c-button/c-button.vue` uses `withDefaults(defineProps<...>(), { ... })` for variants, size, and link-related props.
- `src/ui/c-input-text/c-input-text.vue` uses a large typed prop object with defaults for optional behavior.
- `src/ui/c-select/c-select.types.ts` keeps reusable option typing out of the component when the type may be shared.

### Emits

- Use `defineEmits(...)` for component events
- For two-way binding, use the Vue pattern `update:<prop>` and then `useVModel(...)` where convenient

Example:

- `src/ui/c-input-text/c-input-text.vue` exposes `update:value` and manages the internal ref through `useVModel`.

---

## Composition Patterns

- Prefer composing existing reusable pieces instead of rebuilding inputs/buttons/cards from scratch.
- Tool screens often assemble generic transformers, result cards, and shared UI controls rather than implementing custom primitives.
- Keep pure transformation logic out of the template and often out of the component entirely.

Examples:

- `src/tools/json-minify/json-minify.vue` delegates most UI behavior to `<format-transformer>`.
- `src/layouts/base.layout.vue` composes `MenuLayout`, `NavbarButtons`, `CollapsibleToolMenu`, `locale-selector`, `c-button`, and `c-tooltip`.
- `src/tools/user-agent-parser/user-agent-parser.vue` is paired with `user-agent-result-cards.vue` to split rendering concerns.

---

## i18n Usage

- Tool registration metadata uses `translate(...)` in `index.ts` so names/descriptions exist before a component is mounted.
- Inside components, use `useI18n()` or `$t(...)`.
- Do not hardcode user-facing strings in new shared UI or page components unless the surrounding code already does so for that area.

Examples:

- `src/tools/json-minify/index.ts` and `src/tools/user-agent-parser/index.ts` use `translate(...)`.
- `src/pages/Home.page.vue` mixes `const { t } = useI18n()` and `$t(...)` in the template.
- `src/layouts/base.layout.vue` uses `$t(...)` for labels and `t(...)` when building computed data.

---

## Styling Patterns

The repo uses a mix of:

- UnoCSS utility classes directly in templates
- scoped Less blocks for component-specific styling
- theme/computed style values for reusable UI primitives

Examples:

- `src/pages/Home.page.vue` uses many utility classes for grid/layout and a scoped Less block for drag-transition styling.
- `src/layouts/base.layout.vue` uses template utilities plus a large scoped Less block for page chrome.
- `src/ui/c-button/c-button.vue` and `src/ui/c-input-text/c-input-text.vue` use computed theme values injected into scoped Less via `v-bind(...)`.

Do not introduce global CSS for behavior that is clearly local to a single component.

---

## Accessibility And Interaction Reality

Accessibility is handled pragmatically rather than through a formal design system contract.

Current conventions visible in the codebase:

- interactive icon buttons often receive `aria-label`
- forms/components expose test ids and real labels when useful
- links that open externally typically include `target="_blank"` and `rel="noopener"`

Examples:

- `src/pages/Home.page.vue` sets `aria-label` on external links.
- `src/layouts/base.layout.vue` sets `aria-label` on navigation buttons and external actions.
- `src/ui/c-input-text/c-input-text.vue` renders a `<label>` tied to the generated or provided `id`.

When adding new icon-only controls, match the existing `aria-label` habit even though not every legacy component is perfect.

---

## Anti-Patterns To Avoid

- Do not manually duplicate route metadata inside the component when it belongs in `index.ts`.
- Do not place reusable UI primitives under `src/components/`; generic primitives belong in `src/ui/`.
- Do not put substantial pure business logic inline in templates when a `*.models.ts`, `*.service.ts`, or composable would make it testable.
- Do not default to deep relative imports across multiple folders when `@/` keeps the dependency clearer.

---

## Common Mistakes To Watch For

- Forgetting `lang="ts"` in new SFC scripts
- Hardcoding a tool title/description in the component instead of the tool definition/i18n
- Creating a one-off input/button instead of reusing `c-*` components
- Putting too much unrelated logic into the page/layout component instead of extracting a child component or composable
