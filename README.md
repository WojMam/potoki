# POTOKI

POTOKI is a local-first, offline, file-based context workspace for technical workstreams. It helps you keep track of parallel streams of work, decisions, operational notes, linked local artifacts, and small resume notes without a backend, database, account, telemetry, or network access.

The filesystem is the source of truth:

```text
/workspace
  workspace.json
  /streams
  /timeline
  /notes
  /artifacts
```

Structured data is stored as human-readable JSON. Timeline files use `{ streamId, entries }`. Notes are stored as Markdown.

## Browser Requirement

POTOKI uses the browser File System Access API, so it must be opened in a Chromium-based browser such as Chrome or Microsoft Edge. If the API is unavailable, the app shows a clear message and does not fall back to hidden browser storage.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The Vite build uses relative asset paths so the static output can be opened directly from `dist/index.html`.

## Preview

```bash
npm run preview
```

## Static Use

After building, copy the `dist` folder to the target machine and open `dist/index.html` in Chrome or Edge. At runtime there is no server, database, authentication, telemetry, or network dependency.

## Demo Workspace

The repository includes `demoWorkspace`, a ready-to-open sample workspace with populated streams, timelines, Markdown notes, and linked artifact placeholders. In the app, choose `Open workspace folder` and select `demoWorkspace` to explore realistic POTOKI data.

## Data Stays Local

POTOKI asks you to select a workspace folder. All user data is read from and written to files in that folder. The app does not upload, sync, or send workspace data anywhere.
