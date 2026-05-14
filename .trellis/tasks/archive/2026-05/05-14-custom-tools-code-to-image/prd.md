# Add custom tools group with code-to-image

## Goal

Add a new top-level tools group for user-defined tools and place it at the top of the tools list. The first tool in that group is a frontend-only code-to-image utility that renders code with correct indentation and IDE-like syntax colors, then exports the rendered result as an image without relying on backend generation.

## What I already know

* The user wants a new group whose display name can be chosen by the implementer.
* The group must appear at the top of the tools list.
* The first tool in the group should convert code to an image.
* The implementation should stay on the frontend as much as possible.
* Code rendering must preserve indentation and provide IDE-like syntax coloring.
* The main tool registry order is defined in `src/tools/index.ts`, and sidebar/home listings follow that order.
* The repo already includes `monaco-editor`, which can support IDE-like syntax highlighting on the frontend.

## Assumptions (temporary)

* The new group name will be `My Tools` unless the user prefers a different label later.
* MVP can ship with a single code-to-image tool inside this group.
* Frontend-only export can be implemented by rendering highlighted code in the browser and exporting the DOM/canvas output locally.

## Open Questions

* None for MVP.

## Requirements (evolving)

* Add a new top-level tools group for user-defined tools.
* Place the new group at the top of the tools list.
* Add a code-to-image tool inside that group.
* Keep image generation on the frontend when feasible.
* Preserve code indentation in the rendered preview.
* Render syntax colors in an IDE-like way.
* Support PNG download.
* Support copying the rendered image to the clipboard.
* Keep the exported result as a plain editor screenshot for MVP, without card chrome or decorative window framing.

## Acceptance Criteria (evolving)

* [ ] A new custom tools group is visible before all existing groups.
* [ ] The new group contains a code-to-image tool entry.
* [ ] The code preview preserves indentation and line structure from user input.
* [ ] The preview shows syntax highlighting suitable for code screenshots.
* [ ] The user can download the rendered code as a PNG without a backend round trip.
* [ ] The user can copy the rendered image to the clipboard from the browser.
* [ ] The exported image uses a plain editor-style presentation rather than a decorated share card.

## Definition of Done (team quality bar)

* Lint passes
* Typecheck passes
* Relevant tests updated if needed

## Out of Scope (explicit)

* Backend-side rendering services
* Managing multiple user-defined tools beyond the initial code-to-image tool
* Additional export formats beyond PNG for MVP

## Technical Notes

* Main tool category order: `src/tools/index.ts`
* Sidebar category rendering: `src/layouts/base.layout.vue`
* Tool grouping store: `src/tools/tools.store.ts`
* Home page tool cards: `src/pages/Home.page.vue`
* Existing code rendering references: `src/components/TextareaCopyable.vue`
* User preference confirmed: MVP should support PNG download and copy-image-to-clipboard.
* User preference confirmed: if a choice is needed during workflow, ask through the OpenCode selector.
* User preference confirmed: MVP export style should be a plain editor screenshot.

## Technical Approach

Create a new `My Tools` top-level group as the first entry in the tool registry. Implement a frontend-only code-to-image tool that uses browser-side code rendering with IDE-like syntax highlighting, preserves whitespace/indentation, and exports the previewed result as PNG or clipboard image without backend generation.

## Decision (ADR-lite)

**Context**: The tool must feel like an IDE screenshot, run on the frontend, and avoid unnecessary MVP surface.
**Decision**: Ship a plain editor-style screenshot first, with PNG download and copy-image-to-clipboard support.
**Consequences**: The initial implementation stays smaller and more robust. Decorative presets such as card framing or window chrome remain possible future enhancements.
