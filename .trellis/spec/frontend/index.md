# Frontend Development Guidelines

> Working conventions for the Vue 3 frontend in this repository.

---

## Stack Snapshot

- Vue 3 with Single File Components and `<script setup lang="ts">`
- Vite for build/dev
- Pinia for shared state
- Vue Router for navigation
- Vue I18n for translations
- VueUse for composables and browser/state helpers
- Naive UI + custom `src/ui/` components for the UI layer
- UnoCSS utility classes plus scoped Less blocks for local styling
- Vitest for unit tests, Playwright for selective end-to-end coverage

---

## Pre-Development Checklist

Read these files before changing frontend code:

1. [Directory Structure](./directory-structure.md)
2. [Component Guidelines](./component-guidelines.md)
3. [Hook Guidelines](./hook-guidelines.md)
4. [State Management](./state-management.md)
5. [Type Safety](./type-safety.md)
6. [Quality Guidelines](./quality-guidelines.md)

If the change adds a new tool, read all six. Tool work in this repo usually touches routing, i18n-backed metadata, a Vue component, and sometimes tests or helper files.

---

## What Matters Most In This Codebase

1. **Tool definitions are metadata-first.** New tools are registered through `src/tools/<tool>/index.ts` with `defineTool(...)`, not by hand-editing router records.
2. **Views stay small when logic can live in models/services/composables.** Many tools keep pure logic in `*.models.ts` or `*.service.ts` and let the `.vue` file wire inputs to outputs.
3. **Imports prefer aliases for cross-folder references.** `@/` is the standard alias for `src/`.
4. **Translation-aware metadata is the norm for tools.** `translate(...)` is used inside tool registration, while components commonly use `useI18n()` / `$t(...)`.
5. **The repo mixes utility classes with scoped styles.** Short layout styling often stays inline in templates; component-specific visual behavior usually lives in `<style scoped lang="less">`.

---

## Real Reference Files

- Tool registration: `src/tools/json-minify/index.ts`, `src/tools/user-agent-parser/index.ts`
- Tool component: `src/tools/json-minify/json-minify.vue`
- Page/layout split: `src/pages/Home.page.vue`, `src/layouts/base.layout.vue`, `src/layouts/tool.layout.vue`
- Shared state: `src/stores/style.store.ts`, `src/tools/tools.store.ts`
- Composables: `src/composable/copy.ts`, `src/composable/validation.ts`, `src/composable/fuzzySearch.ts`
- UI component and tests: `src/ui/c-button/c-button.vue`, `src/ui/c-input-text/c-input-text.vue`, `src/ui/c-input-text/c-input-text.test.ts`

---

## Scope Of These Docs

These documents intentionally capture the repo's current reality, including uneven testing coverage and mixed style patterns. They are not an aspirational redesign.
