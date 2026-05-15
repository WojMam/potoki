# Engineering Rules

## Core Constraints

- No backend.
- No database.
- No SQLite.
- No IndexedDB as source of truth.
- No localStorage as source of truth.
- No authentication.
- No telemetry.
- No cloud services.
- No network requests for app data.
- Runtime must work as a static app.

## Coding Style

- Prefer readable TypeScript.
- Keep components small enough to reason about.
- Prefer explicit state over hidden magic.
- Avoid Redux unless clearly necessary.
- Avoid unnecessary dependencies.
- Use existing local helpers and patterns first.
- Add abstractions only when they remove real complexity.

## Persistence Rules

- Repositories own file persistence.
- React components must not call File System Access API directly.
- Markdown files are source of truth for note content.
- JSON files are source of truth for structured workspace data.
- Normalize loaded data before UI use.
- Preserve compatibility with older workspace files.

## Refactoring Rules

- Prefer incremental refactors.
- Do not rewrite working systems for style alone.
- Keep behavior stable unless explicitly asked.
- Avoid global architecture changes during UI polish tasks.
- Preserve user data semantics.

## UI Implementation Rules

- Reuse existing UI primitives where possible.
- Preserve the dark premium style.
- Keep hover/focus states calm.
- Do not introduce loud colors or large glows.
- Use lucide-react for icons when available.

## Validation

After code changes, prefer:

```bash
node node_modules\typescript\bin\tsc -b
node node_modules\vite\bin\vite.js build
```

`npm` may not always be on PATH in the local shell.
