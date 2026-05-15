# Architecture

POTOKI is a static React, TypeScript, Vite, Tailwind CSS and shadcn-style UI application.

Runtime constraints:

- no backend,
- no database,
- no local server,
- no authentication,
- no telemetry,
- no cloud services,
- no network requests,
- no IndexedDB as source of truth.

The production build is designed to work as a copied static app. The current build emits a self-contained `dist/index.html` so the app can be opened directly in a supported Chromium browser.

The app uses the browser File System Access API through repository abstractions:

- `FileSystemAccessAdapter` wraps folder and file access.
- `JsonFileStore` reads and writes formatted JSON.
- `MarkdownFileStore` reads and writes Markdown notes.
- `WorkspaceRepository` manages `workspace.json` and initialization.
- `StreamRepository` manages `/streams/*.json`.
- `TimelineRepository` manages `/timeline/*.timeline.json`.
- `NoteRepository` manages `/notes/{streamId}/*.md`.

React components call repositories and application actions. Components do not directly read or write workspace files.

State is held in React state. Loaded workspace data is normalized before use, searched in memory, then persisted back to human-readable files after user actions.

Data compatibility is handled by lightweight schema versioning and normalization:

- `workspace.json` includes `schemaVersion`.
- old files without `schemaVersion` are treated as legacy input,
- missing fields receive safe defaults,
- unknown fields are tolerated where possible,
- timeline entries without `linkedFiles` are normalized to `linkedFiles: []`.
