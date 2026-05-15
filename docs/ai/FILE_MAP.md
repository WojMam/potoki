# File Map

## Root

- `README.md` - English public README.
- `README.pl.md` - Polish public README.
- `LICENSE` - MIT license.
- `vite.config.ts` - Vite config and single-file build behavior.
- `package.json` - scripts and dependencies.

## `src/app`

- `App.tsx` - main application orchestration and state.

## `src/components`

- `brand` - POTOKI mark/logo.
- `layout` - layout utilities such as empty states and flow scroll area.
- `ui` - low-level reusable UI primitives.

## `src/core`

- `models` - TypeScript domain models.
- `repositories` - file-backed data operations.
- `filesystem` - File System Access adapter and stores.
- `data` - defaults and normalization.
- `i18n` - translation provider and translation maps.
- `utils` - date, ids, validation helpers.

## `src/features`

- `workspace` - workspace gate/open/create flow.
- `dashboard` - overview/continuation screen.
- `workstreams` - sidebar, stream list, context rail, new stream dialog.
- `timeline` - timeline entries, quick entry, work log.
- `notes` - note editor, preview, Markdown toolbar, file preview.
- `settings` - app settings modal.
- `search` - in-memory search helpers.

## `src/styles`

- `globals.css` - Tailwind layer, theme tokens, prose styles, flow scrollbar visuals.

## `docs`

- Human-facing project documentation.
- `docs/ai` contains AI-oriented operating docs.
- `docs/fixtures/data-compatibility` contains legacy JSON examples.
