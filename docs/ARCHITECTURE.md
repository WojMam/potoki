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

The app uses the browser File System Access API through repository abstractions:

- `FileSystemAccessAdapter` wraps folder and file access.
- `JsonFileStore` reads and writes formatted JSON.
- `MarkdownFileStore` reads and writes Markdown notes.
- `WorkspaceRepository` manages `workspace.json` and initialization.
- `StreamRepository` manages `/streams/*.json`.
- `TimelineRepository` manages `/timeline/*.timeline.json`.
- `NoteRepository` manages `/notes/{streamId}/*.md`.

React components call repositories and application actions. Components do not directly read or write workspace files.

State is held in React state. Loaded workspace data is searched in memory, then persisted back to human-readable files after user actions.
