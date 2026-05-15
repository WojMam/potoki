# Architecture Guide

## High-level Flow

```text
React UI
  -> app actions / feature callbacks
  -> repositories
  -> file stores
  -> File System Access API
  -> JSON / Markdown files
```

## App Shell

- `src/app/App.tsx`
  - central app state,
  - workspace loading,
  - stream selection,
  - repository wiring,
  - dialogs and app-level actions.

## Persistence Layer

- `src/core/filesystem/FileSystemAccessAdapter.ts`
  - wraps browser folder/file access.
- `JsonFileStore.ts`
  - formatted JSON read/write.
- `MarkdownFileStore.ts`
  - Markdown read/write.
- `src/core/repositories/*`
  - workspace, stream, timeline, note operations.

UI should call repositories/actions, not filesystem APIs.

## Data Normalization

- `src/core/data/defaults.ts`
  - current default values.
- `src/core/data/normalizers.ts`
  - defensive migration/normalization.

Raw JSON should be treated as unknown until normalized.

## Domain Models

- `workspace.ts`
- `workstream.ts`
- `timeline.ts`
- `fileLink.ts`

Historical internal names still include `Workstream`. Visible product language is `potok`.

## Feature Areas

- `dashboard`
- `workspace`
- `workstreams`
- `timeline`
- `notes`
- `settings`
- `search`

## Markdown Pipeline

- Note files live in `/notes/{streamId}/*.md`.
- `NoteRepository` creates/reads/saves Markdown.
- `NoteDialog` edits Markdown and shows live preview.
- `MarkdownToolbar` modifies textarea content only.
- `react-markdown` renders preview.

## Localization

- `src/core/i18n/index.tsx`
- `translations.pl.ts`
- `translations.en.ts`

Rules:

- Default language: Polish.
- Persist language in localStorage.
- Keep i18n simple; no library unless explicitly needed.

## Static Build

Vite is configured for a static, single-file production output.

Do not add runtime assumptions that require an HTTP server unless explicitly requested.
