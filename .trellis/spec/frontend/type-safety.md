# Type Safety

> TypeScript conventions that reflect the current codebase.

---

## Overview

The frontend is fully TypeScript-based. Vue SFCs use `<script setup lang="ts">`, helper files are `.ts`, and type-checking is enforced through `vue-tsc` (`package.json` → `typecheck`).

Current type safety relies on:

- TypeScript interfaces/types
- typed Vue props, emits, refs, and computed values
- selective runtime validation through custom validation rules rather than a schema library like Zod

There is no project-wide runtime schema-validation library in use today.

---

## Type Organization

### Keep types close to the feature when they are feature-specific

Examples:

- `src/tools/user-agent-parser/user-agent-parser.types.ts`
- `src/modules/tracker/tracker.types.ts`
- `src/ui/c-select/c-select.types.ts`

### Keep small local-only types inline when they are only used in one file

Examples:

- `src/tools/tool.ts` defines `WithOptional<T, K>` inline because it only supports `defineTool(...)`
- `src/composable/validation.ts` defines `UseValidationRule<T>` inside the same module as the composable

### Use suffix-based filenames for non-component logic

- `*.types.ts` for interfaces/type aliases
- `*.models.ts` for pure transformation/data helpers
- `*.service.ts` for functional service modules

These suffixes help readers know whether a file is mostly types, pure logic, or orchestration.

---

## Interfaces, Types, And Generics

Current repo patterns:

- `interface` is common for object contracts (`Tool`, `ToolCategory`, `UserAgentResultSection`, `CSelectOption`)
- `type` aliases are used for composition or utility shapes (`ToolWithCategory`, `TrackerService`)
- lightweight generics are preferred over repeating loose `unknown`/`any` structures

Examples:

- `src/tools/tools.types.ts` defines interfaces plus a composed type alias
- `src/tools/tool.ts` uses a generic utility type to make `isNew` optional for `defineTool(...)`
- `src/ui/c-select/c-select.types.ts` uses `CSelectOption<Value = unknown>` to keep the option value generic

---

## Vue Typing Patterns

- Type props inline with `defineProps<...>()`
- Use `import type` for type-only imports
- Type computed values when inference would be unclear or when you want to lock the return shape
- Prefer typed refs/DOM refs where the API depends on the element type

Examples:

- `src/layouts/base.layout.vue` uses `computed<ToolCategory[]>(...)`
- `src/ui/c-input-text/c-input-text.vue` uses `ref<HTMLTextAreaElement>()`, `ref<HTMLInputElement>()`, and a typed `validation` prop
- `src/layouts/tool.layout.vue` types `head` as `computed<HeadObject>(...)`

---

## Validation Reality

Runtime validation is currently ad hoc and custom, not schema-library based.

Patterns in use:

- validation rules are arrays of `UseValidationRule<T>`
- validators may return booleans or throw; helper functions normalize those outcomes
- tool-specific input validation is often declared directly in the component

Examples:

- `src/composable/validation.ts` defines the shared validation contract
- `src/tools/json-minify/json-minify.vue` declares `UseValidationRule<string>[]` locally for JSON parsing
- `src/ui/c-input-text/c-input-text.vue` accepts either `validationRules` or a prebuilt `validation` object

If you need runtime validation for user input, prefer extending the existing validation pattern before introducing a new schema stack.

---

## Assertions And Escape Hatches

The codebase does use occasional assertions when Vue/TypeScript inference falls short, but they are usually narrow and justified.

Examples:

- `src/tools/tools.store.ts` casts after `.filter(Boolean)` because TypeScript does not narrow the array enough
- `src/layouts/tool.layout.vue` casts a small inline object to `Tool` for `FavoriteButton`

Treat assertions as a last mile tool, not the default strategy.

---

## Patterns To Avoid

- Avoid `any` unless there is no realistic typed alternative; the current codebase uses `unknown` more often and keeps `any` limited.
- Do not move every interface into a giant global types file; keep feature types near their feature.
- Do not add a schema library just for one small form when existing `UseValidationRule<T>` patterns already cover it.
- Avoid untyped route/meta/object access when a local type or computed generic can make intent clearer.
