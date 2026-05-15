# POTOKI

🇵🇱 Polish version: [README.pl.md](README.pl.md)

> A calm local workspace for returning to context, notes, decisions, and parallel work currents.

[![Latest release](https://img.shields.io/github/v/release/WojMam/potoki?include_prereleases&label=release)](https://github.com/WojMam/potoki/releases)
[![GitHub Pages](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml)
[![Version](https://img.shields.io/github/package-json/v/WojMam/potoki?label=version)](package.json)
[![Local-first](https://img.shields.io/badge/local--first-yes-2f7f8f)](#local-first-philosophy)
[![Offline-first](https://img.shields.io/badge/offline--first-yes-2f7f8f)](#local-first-philosophy)
[![React + Vite + TypeScript](https://img.shields.io/badge/React%20%2B%20Vite%20%2B%20TypeScript-181f2a?logo=react)](#tech-stack)

POTOKI is a privacy-first desktop-like web app for keeping technical work context in local files.

It helps you manage multiple parallel streams of work, capture what happened, keep Markdown notes, link local artifacts, and return to interrupted thoughts without cloud services, accounts, telemetry, or a backend.

Live app: [wojmam.github.io/potoki](https://wojmam.github.io/potoki/)

---

## Contents

- [What is POTOKI?](#what-is-potoki)
- [Philosophy](#philosophy)
- [Features](#features)
- [Screenshots](#screenshots)
- [Running the App](#running-the-app)
- [Development](#development)
- [Browser Requirement](#browser-requirement)
- [Data Architecture](#data-architecture)
- [Local-first Philosophy](#local-first-philosophy)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)
- [License](#license)

---

## What is POTOKI?

POTOKI is a local context workspace for technical work.

It helps you return to parallel work currents without turning them into a task board, a ticketing system, or a productivity tracker.

Each **potok** is a focused stream of context: a refactor, an architecture review, research, documentation, testing, operational notes, or any thread of work you may need to resume later.

POTOKI stores data in human-readable files:

- `JSON` for workspace, potok, and timeline data,
- `Markdown` for notes,
- relative local paths for attached files and artifacts.

No account. No backend. No cloud. No telemetry.

---

## Philosophy

POTOKI does not try to manage your work.

It helps preserve context.

It is built for people who switch between many technical threads and need a quiet way to answer:

- What was I doing here?
- What decision did I make, and why?
- What should I read before continuing?
- What is the next small thing to pick up?
- Where are the local notes, sketches, and files for this context?

---

## Features

- Multiple parallel work currents.
- Per-potok timeline entries.
- Quick capture for notes, decisions, completed actions, work logs, and file links.
- Editable and safely deletable timeline entries.
- Current context as a calm operational note.
- Next steps / return notes.
- Local Markdown notes.
- Attach notes to a potok or a specific timeline entry.
- Attach local files to a potok or a specific timeline entry.
- Modal Markdown preview and editing.
- Local in-memory search.
- Premium dark UI.
- Bilingual UI: Polish and English.
- Offline-first static build.
- Single-file `index.html` production output.

---

## Screenshots

Screenshots are planned and will be added as the visual documentation matures.

<details>
<summary>Planned screenshots</summary>

- Dashboard
- Stream view
- Timeline flow
- Markdown editor
- Settings
- Workspace picker

</details>

---

## Running the App

### Hosted Static App

Open:

[https://wojmam.github.io/potoki/](https://wojmam.github.io/potoki/)

The hosted page is only the static app shell. Your workspace data still stays in the local folder you choose.

### Local Build

```bash
npm install
npm run build
```

The production build outputs a single file:

```text
dist/
  index.html
```

You can copy this file to another machine and open it in Chrome or Edge.

---

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run typecheck:

```bash
npm run typecheck
```

Build production app:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Production output is intentionally static and self-contained. The current build process emits a single `dist/index.html` file so the app can be copied and opened directly in a supported browser.

---

## Browser Requirement

POTOKI uses the **File System Access API**, so it requires a Chromium-based browser:

- Google Chrome,
- Microsoft Edge,
- another Chromium browser with File System Access API support.

If the API is unavailable, the app shows a clear message and does not silently fall back to hidden browser storage.

---

## Data Architecture

POTOKI is file-based. User data lives in the selected workspace folder:

```text
workspace/
  workspace.json
  streams/
    local-ai-integration.json
  timeline/
    local-ai-integration.timeline.json
  notes/
    local-ai-integration/
      2026-05-15-research-notes.md
  artifacts/
    local-ai-integration/
      architecture.drawio
```

The app normalizes older files on read, fills safe defaults, and writes a predictable current format.

---

## Local-first Philosophy

POTOKI treats the workspace folder as the product boundary.

The app is designed around a few hard rules:

- User data belongs to the user.
- Files should stay readable outside the app.
- The filesystem is the source of truth.
- No server is required at runtime.
- No cloud service is required.
- No telemetry is collected.
- No account is needed to think clearly.

This makes POTOKI suitable for offline work, restricted environments, and personal context management where privacy matters more than collaboration features.

---

## Tech Stack

- **React** for the UI.
- **TypeScript** for type safety.
- **Vite** for development and production builds.
- **Tailwind CSS** for the visual system.
- **React Markdown** for note rendering.
- **File System Access API** for local workspace access.
- **GitHub Pages** for static deployment.
- Local-first repository layer over JSON and Markdown files.

---

## Roadmap

Potential future directions:

- Tags and gentle grouping for potoki.
- Richer local search.
- Deeper linking between entries, notes, and files.
- Potok templates.
- Workspace export/import helpers.
- Optional plugin/extension ideas.
- Configurable focus mode.
- Improved keyboard navigation.
- AI-assisted context summaries as an optional future idea.

Roadmap items are intentionally lightweight. POTOKI should stay calm, local, and context-first.

---

## License

POTOKI is released under the [MIT License](LICENSE).
