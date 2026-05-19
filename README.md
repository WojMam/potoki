# POTOKI

🇵🇱 Polish version: [README.pl.md](README.pl.md)

> A calm local workspace for returning to context, notes, decisions, and parallel work currents.

[![Latest release](https://img.shields.io/github/v/release/WojMam/potoki?include_prereleases&label=release)](https://github.com/WojMam/potoki/releases)
[![Live Demo](https://img.shields.io/badge/demo-live-2ea043)](https://wojmam.github.io/potoki/)
[![E2E Playwright](https://github.com/WojMam/potoki/actions/workflows/e2e-playwright.yml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/e2e-playwright.yml)
[![E2E report](https://img.shields.io/badge/E2E%20report-open-2f7f8f)](https://wojmam.github.io/potoki/playwright-report/)
[![Version](https://img.shields.io/github/package-json/v/WojMam/potoki?label=version)](package.json)
[![License](https://img.shields.io/github/license/WojMam/potoki)](LICENSE)
[![Local-first](https://img.shields.io/badge/local--first-yes-2f7f8f)](#local-first-philosophy)
[![Offline-first](https://img.shields.io/badge/offline--first-yes-2f7f8f)](#local-first-philosophy)
[![React + Vite + TypeScript](https://img.shields.io/badge/React%20%2B%20Vite%20%2B%20TypeScript-181f2a?logo=react)](#tech-stack)

POTOKI is a privacy-first desktop-like web app for keeping technical work context in local files.

It helps you manage multiple parallel streams of work, capture what happened, keep Markdown notes, link local artifacts, and return to interrupted thoughts without cloud services, accounts, telemetry, or a backend.

Live app: [wojmam.github.io/potoki](https://wojmam.github.io/potoki/)

---

## Contents

- [POTOKI](#potoki)
  - [Contents](#contents)
  - [What is POTOKI?](#what-is-potoki)
  - [Philosophy](#philosophy)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Documentation](#documentation)
  - [Running the App](#running-the-app)
    - [Hosted Static App](#hosted-static-app)
    - [Local Build](#local-build)
  - [Project Jobs](#project-jobs)
  - [Development](#development)
  - [Testing](#testing)
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

## Documentation

Project documentation lives in [`docs/`](docs/):

- [AI documentation layer](docs/ai/START_HERE.md) - compact onboarding and operating notes for AI coding assistants.
- [Product Vision](docs/PRODUCT_VISION.md) - product philosophy, scope, and non-goals.
- [Architecture](docs/ARCHITECTURE.md) - static app architecture and repository boundaries.
- [File Formats](docs/FILE_FORMATS.md) - workspace, potok, timeline, note, and attachment formats.
- [User Guide](docs/USER_GUIDE.md) - practical guide for opening workspaces, creating potoki, notes, and linked files.
- [Data compatibility fixtures](docs/fixtures/data-compatibility/) - legacy JSON examples used to reason about schema compatibility.
- [E2E test strategy](docs/testing/TEST_STRATEGY.md) - scope, priorities, fixtures, CI, and conventions for Playwright tests.

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

## Project Jobs

[![Deploy to GitHub Pages](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml)
[![E2E Playwright](https://github.com/WojMam/potoki/actions/workflows/e2e-playwright.yml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/e2e-playwright.yml)
[![Build Release Package](https://github.com/WojMam/potoki/actions/workflows/release-package.yaml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/release-package.yaml)

- **Deploy to GitHub Pages** builds the static app and publishes it to [wojmam.github.io/potoki](https://wojmam.github.io/potoki/).
- **E2E Playwright** runs the Playwright suite on every push and pull request to the default branch (`main` or `master`). Open the [latest workflow run](https://github.com/WojMam/potoki/actions/workflows/e2e-playwright.yml) for logs, the job **Summary**, and a downloadable HTML report artifact. **Publish Playwright report** deploys the HTML report to [wojmam.github.io/potoki/playwright-report/](https://wojmam.github.io/potoki/playwright-report/) after E2E on the default branch, or manually via **Run workflow** (uses the latest completed E2E run on the default branch if you do not pass a run ID).
- **Build Release Package** builds the app and packages the static output for GitHub releases.

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

E2E tests: see [Testing](#testing).

Production output is intentionally static and self-contained. The current build process emits a single `dist/index.html` file so the app can be copied and opened directly in a supported browser.

---

## Testing

POTOKI uses **Playwright** end-to-end tests against the Vite dev server. They protect critical user flows (workspace, potoki, timeline, Markdown notes, settings, legacy data) without a backend.

Full strategy, scope, and conventions: **[docs/testing/TEST_STRATEGY.md](docs/testing/TEST_STRATEGY.md)** (Polish; this section is the English quick reference).

### Prerequisites

Chromium only (same as the app). One-time browser install:

```bash
npx playwright install chromium
```

### Run locally

| Command | Purpose |
|---------|---------|
| `npm run test:e2e` | Run all specs headless; patches the HTML report for readable contrast |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:headed` | Visible browser window |
| `npm run test:e2e:debug` | Debug a failing test |
| `npm run test:e2e:report` | Open the last `playwright-report/` in the browser |

The dev server starts automatically via `playwright.config.ts` (`npm run dev` on `http://localhost:5173`).

### What is covered

- **Smoke** — app start, landing, sample workspace, dashboard, open a potok.
- **Critical** — timeline entries, Markdown notes, language settings (PL/EN).
- **Regression** — Markdown toolbar, legacy workspace JSON compatibility.

Specs live under [`tests/e2e/`](tests/e2e/). File System Access API is **mocked in memory** ([`tests/utils/mockFileSystem.ts`](tests/utils/mockFileSystem.ts)); fixture workspaces are in [`tests/fixtures/workspaces/`](tests/fixtures/workspaces/). Before a release, a short **manual check in real Chrome** with a local folder is still recommended.

Unit tests (e.g. JSON normalizers) are not part of this suite yet — see the strategy doc.

### CI and reports

| Resource | Link |
|----------|------|
| E2E workflow (every push/PR to default branch) | [e2e-playwright.yml](https://github.com/WojMam/potoki/actions/workflows/e2e-playwright.yml) |
| HTML report artifact | **Artifacts** → `playwright-report` on the workflow run |
| Hosted HTML report (default branch) | [wojmam.github.io/potoki/playwright-report/](https://wojmam.github.io/potoki/playwright-report/) |

The hosted report is published by **Publish Playwright report** after E2E on the default branch, or manually from Actions. Hosted pages apply a light-theme patch so rows stay readable in system dark mode ([`tests/scripts/patch-playwright-report.mjs`](tests/scripts/patch-playwright-report.mjs)).

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
