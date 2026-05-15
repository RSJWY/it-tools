# Remove Sponsorship And Update About Links

## Goal

Remove sponsorship-related UI and copy, remove Twitter/X entry points, repoint repository links to the forked repository, and add a compliance note on the About page explaining that these removals were made for China compliance.

## What I already know

* Sponsorship UI is rendered from `src/layouts/base.layout.vue`.
* Home banner follow links are rendered from `src/pages/Home.page.vue`.
* Top navigation GitHub/Twitter/About buttons are rendered from `src/components/NavbarButtons.vue`.
* About page content is i18n-backed through `locales/*.yml` and rendered by `src/pages/About.vue`.
* Sidebar footer version/commit links still point at the upstream `CorentinTh/it-tools` repository.

## Requirements

* Remove sponsorship-related content and entry points from the UI.
* Remove Twitter/X links and related navigation entry points.
* Update visible repository links from the upstream repository to `https://github.com/RSJWY/it-tools` where this task touches them.
* Remove sponsorship copy from the About page.
* Add an About page statement that related removals were made to comply with Chinese regulatory requirements.
* Append the repository address `https://github.com/RSJWY/it-tools` to the sidebar footer branding area.

## Acceptance Criteria

* [ ] No sponsorship button remains in the main layout.
* [ ] No Twitter/X button remains in the navbar.
* [ ] Home follow/banner content no longer advertises Twitter/X or sponsorship.
* [ ] About page no longer contains sponsorship copy.
* [ ] About page includes a China compliance explanation for the removals.
* [ ] Sidebar footer shows the repository address `https://github.com/RSJWY/it-tools`.
* [ ] Touched GitHub links use `https://github.com/RSJWY/it-tools`.

## Definition of Done

* Lint / typecheck for touched frontend code passes.
* No unrelated behavior is changed in the touched navigation/layout areas.

## Technical Approach

Remove the sponsorship and Twitter/X entry points directly from the relevant Vue components, and update the localized About copy plus the touched repository URLs in the layout and home/navbar components.

## Decision (ADR-lite)

**Context**: The request is a scoped branding/compliance customization of an existing UI, not a reusable feature.
**Decision**: Apply the smallest possible edits in the existing layout, navbar, home banner, and locale files instead of introducing new configuration or toggles.
**Consequences**: The fork-specific branding is explicit in code and easy to review, but future upstream syncs may need to reapply or reconcile these changes.

## Out of Scope

* Rebranding every untouched upstream reference across the entire repository.
* Changing tool behavior or adding new UI features.

## Technical Notes

* Relevant specs: frontend directory structure, component guidelines, quality guidelines, shared thinking guides.
* Touched files are expected under `src/layouts/`, `src/components/`, `src/pages/`, and `locales/`.
