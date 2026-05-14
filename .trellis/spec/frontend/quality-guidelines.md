# Quality Guidelines

> Practical quality expectations for this frontend codebase.

---

## Overview

Quality gates in the repo are currently centered on:

- ESLint (`pnpm lint`)
- TypeScript/Vue type-checking (`pnpm typecheck` or `pnpm build`)
- Vitest unit tests where logic is worth isolating
- Playwright end-to-end tests for selected tools

This project has real automated coverage, but not every tool or component is tested. Documenting that uneven reality is important: new work should follow the strongest nearby precedent rather than pretending the entire repo already has uniform coverage.

---

## Required Patterns

- New Vue SFCs should use `<script setup lang="ts">`
- New tools should be registered through `defineTool(...)` in `src/tools/<tool>/index.ts`
- Cross-folder imports should prefer `@/` alias paths
- User-facing tool metadata should go through i18n-aware registration (`translate(...)`) or component i18n (`useI18n` / `$t`)
- Reusable UI belongs in `src/ui/`; app-specific shared pieces belong in `src/components/`
- When non-trivial pure logic is extracted to `*.models.ts` or `*.service.ts`, add or extend a unit test nearby when practical

---

## Forbidden Or Discouraged Patterns

### Do not manually wire tool routes in the router

`src/router.ts` builds tool routes from the tool registry. A new tool should be discoverable through the existing `src/tools` aggregation path, not a hand-authored extra route.

### Do not bypass existing shared primitives without reason

Before inventing a custom input/button/modal, check `src/ui/`. The repo already has primitives such as `c-button`, `c-input-text`, `c-select`, `c-modal`, and `c-tooltip`.

### Do not hardcode cross-cutting app text in new features

The codebase is translation-aware. Tool titles/descriptions in particular should not be plain strings inside a view component when the surrounding pattern uses i18n.

### Do not hand-roll browser persistence when VueUse already covers it

Existing stores use `useStorage(...)`; follow that approach unless there is a clear mismatch.

---

## Lint And Formatting Reality

- ESLint is configured and expected to pass on `src/**/*.{vue,ts,...}` (`package.json`)
- Auto-import plugins reduce the need for explicit imports of common Vue/Vue Router/VueUse/i18n APIs (`vite.config.ts`)
- The codebase includes a few explicit lint suppressions when required by tooling constraints; for example `src/composable/copy.ts` disables `no-restricted-imports` on one line

Implication: do not add suppressions casually. If a lint disable is necessary, keep it narrow and local.

---

## Testing Requirements

### Unit tests

Vitest is the main unit-test runner.

Current tested areas include:

- reusable UI components: `src/ui/c-input-text/c-input-text.test.ts`
- pure model logic: `src/tools/color-converter/color-converter.models.test.ts`
- service/helper logic: `src/tools/hash-text/hash-text.service.test.ts`

Use unit tests when:

- logic is pure or mostly pure
- the behavior has multiple edge cases
- the code is reused or subtle enough that regressions are likely

### End-to-end tests

Playwright is present for selected tool flows.

Examples:

- `src/tools/yaml-to-json-converter/yaml-to-json.e2e.spec.ts`
- `src/tools/mac-address-generator/mac-address-generator.e2e.spec.ts`

E2E coverage is useful for full tool interactions, but it is not universal. Add it when the user flow matters more than isolated helper logic.

---

## Review Checklist

When reviewing frontend changes, check:

1. Does the file belong in the right layer (`tools`, `ui`, `components`, `layouts`, `pages`, `composable`, `stores`)?
2. For a new tool, is there a proper `index.ts` registration using `defineTool(...)`?
3. Are imports using `@/` where cross-folder references would otherwise get noisy?
4. Is user-facing text handled consistently with the surrounding i18n pattern?
5. Is shared state staying in Pinia only when it truly needs to be shared?
6. Can any new pure logic be tested with Vitest?
7. If E2E behavior changed, is Playwright coverage warranted?

---

## Known Gaps / Current Reality

- Testing coverage is selective, not comprehensive.
- Accessibility patterns are decent in many places (`aria-label`, labels, `rel="noopener"`) but not enforced by a dedicated a11y test suite.
- The repo uses both utility-class-heavy templates and sizable scoped Less blocks; consistency is local, not globally uniform.

New changes should respect this reality while still leaving the touched area cleaner, typed, and testable.
