# AI Workflow

## Before Editing

- Read `START_HERE.md`.
- Read only the docs relevant to the task.
- Inspect real files before changing them.
- Identify whether the task is UI, storage, architecture, or docs.

## Task Routing

- UI change: read `UI_UX_PRINCIPLES.md`.
- Storage/model change: read `STORAGE_AND_COMPATIBILITY.md`.
- Architecture change: read `ARCHITECTURE_GUIDE.md`.
- Copy/naming change: read `TERMINOLOGY.md`.
- Broad feature work: read `AI_OVERVIEW.md` and `PRODUCT_VISION.md`.

## Change Style

- Prefer minimal diffs.
- Keep behavior scoped to request.
- Avoid unrelated refactors.
- Preserve visual language.
- Preserve local-first constraints.
- Preserve backward compatibility.

## Do Not

- Add backend/server/runtime process.
- Add database.
- Add telemetry/auth/cloud sync.
- Add analytics/productivity scoring.
- Rebuild UI from scratch.
- Rename storage folders casually.
- Rename internal domain types unless explicitly requested.

## Verification

For code changes, run when possible:

```bash
node node_modules\typescript\bin\tsc -b
node node_modules\vite\bin\vite.js build
```

Check after build:

- no type errors,
- static output still works as intended,
- no new external runtime dependency,
- no hidden persistence introduced.

## Communication

Summaries should mention:

- files changed,
- behavior changed,
- validation run,
- known limitations.
