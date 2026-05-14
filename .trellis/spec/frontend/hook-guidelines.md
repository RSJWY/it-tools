# Hook Guidelines

> How reusable composition logic is organized in this Vue codebase.

---

## Overview

This project uses Vue composables rather than React-style hooks, but the function naming convention is still `useX(...)`. Files live in `src/composable/` and commonly export one main composable plus any helper types.

Examples:

- `src/composable/copy.ts` exports `useCopy(...)`
- `src/composable/validation.ts` exports `useValidation(...)` and related types/helpers
- `src/composable/fuzzySearch.ts` exports `useFuzzySearch(...)`

---

## File And Naming Conventions

- Place reusable composition logic in `src/composable/`
- Name the exported API `useX(...)`
- File names are short feature names, not necessarily `use-x.ts`
- Keep helper functions/types in the same file unless they are broadly shared

Current examples show these patterns:

- file `copy.ts` → function `useCopy`
- file `validation.ts` → function `useValidation`, plus `UseValidationRule` and helper functions
- file `fuzzySearch.ts` → function `useFuzzySearch`

This repo currently spells the folder as `composable`, not `composables`; match the existing directory name.

---

## Composable Design Patterns

### Wrap third-party utilities behind repo-specific behavior

Composables often adapt VueUse or another library to project needs.

Example:

- `src/composable/copy.ts` wraps `useClipboard` from VueUse, renames `copied` to `isJustCopied`, and optionally shows a Naive UI success toast.

### Return plain refs/computed/functions

Composables usually return a simple object rather than a class-like abstraction.

Examples:

- `useCopy(...)` returns state plus a `copy(...)` function
- `useFuzzySearch(...)` returns `{ searchResult }`
- `useValidation(...)` returns a reactive state object with `message`, `status`, `isValid`, and `attrs`

### Keep generic helpers close when they only support one composable

`src/composable/validation.ts` keeps `isFalsyOrHasThrown(...)` and `getErrorMessageOrThrown(...)` local to the validation module instead of pushing them into a global utility folder.

---

## Reactive Input Conventions

- Accept `MaybeRef`/`MaybeRefOrGetter` when the caller may pass either plain values or refs
- Normalize with `get(...)` from VueUse when appropriate
- Use `watch(...)`, `computed(...)`, and `reactive(...)` directly rather than hiding Vue reactivity behind extra wrappers

Examples:

- `useCopy(...)` accepts `source?: MaybeRefOrGetter<string>`
- `useFuzzySearch(...)` accepts `search: MaybeRef<string>` and reads it with `get(search)`
- `useValidation(...)` watches the source ref and extra watch dependencies to keep validation state current

---

## Relationship To Components And Stores

- Use a composable when logic is reusable across components or when it adapts a library into project-specific behavior.
- Use a store when the state is shared application state that should persist or coordinate across screens.
- Keep one-off logic in the component when it is small and tightly tied to that component.

Examples:

- Copy-to-clipboard behavior is a composable (`src/composable/copy.ts`) because many screens can reuse it.
- Theme/screen/menu state is in a store (`src/stores/style.store.ts`) because it is app-wide.
- JSON minify transformation stays local to `src/tools/json-minify/json-minify.vue` because it is tool-specific and tiny.

---

## Data Fetching Reality

There is no dedicated server-state library such as Vue Query in the current codebase. Most tools are local/offline utilities, so composables are not centered around fetching APIs.

Implications:

- do not introduce a new async data library for a small feature by default
- prefer simple composables or service functions for browser/API interactions
- if shared async state starts to span multiple screens, document the pattern before inventing a new one

---

## Common Mistakes To Avoid

- Creating a new composable for logic that is only used once and is simpler inline
- Putting global shared state into a composable when a Pinia store is the better fit
- Returning overly nested APIs when a small object of refs/functions would do
- Naming a new reusable composition helper without the `useX` function prefix
