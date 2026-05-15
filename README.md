# POTOKI

> A calm local workspace for returning to context, notes, decisions, and parallel work currents.

[![Latest release](https://img.shields.io/github/v/release/WojMam/potoki?include_prereleases&label=release)](https://github.com/WojMam/potoki/releases)
[![Build](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/deploy-pages.yaml)
[![Tests](https://github.com/WojMam/potoki/actions/workflows/tests.yaml/badge.svg)](https://github.com/WojMam/potoki/actions/workflows/tests.yaml)
[![License](https://img.shields.io/github/license/WojMam/potoki)](#license)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2f7f8f)](https://wojmam.github.io/potoki/)
[![Version](https://img.shields.io/github/package-json/v/WojMam/potoki?label=version)](package.json)
[![React + Vite + TypeScript](https://img.shields.io/badge/React%20%2B%20Vite%20%2B%20TypeScript-181f2a?logo=react)](#tech-stack)
[![Local-first](https://img.shields.io/badge/local--first-offline-2f7f8f)](#local-first-philosophy)

![POTOKI dashboard](docs/screenshots/dashboard.png)

POTOKI is a privacy-first desktop-like web app for keeping technical work context in local files. It helps you manage multiple parallel streams of work, capture what happened, keep Markdown notes, link local artifacts, and return to interrupted thoughts without cloud services, accounts, telemetry, or a backend.

Live app: [wojmam.github.io/potoki](https://wojmam.github.io/potoki/)

---

## Spis Treści

- [Polski](#polski)
- [English](#english)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [Local-first Philosophy](#local-first-philosophy)
- [Roadmap](#roadmap)
- [License](#license)

---

## Polski

### Czym są POTOKI?

POTOKI to lokalna przestrzeń kontekstowa do pracy technicznej. Aplikacja pomaga wracać do wielu równoległych tematów bez zamieniania ich w tablicę zadań, system ticketowy albo narzędzie do mierzenia produktywności.

Każdy **potok** to osobny nurt pracy: refaktor, analiza architektury, badania, dokumentacja, testy, decyzje operacyjne albo dowolny kontekst, do którego trzeba wracać po godzinach lub dniach.

POTOKI zapisują dane jako czytelne pliki:

- `JSON` dla struktury workspace, potoków i timeline,
- `Markdown` dla notatek,
- lokalne ścieżki dla dołączonych plików i artefaktów.

Nie ma konta. Nie ma backendu. Nie ma chmury. Nie ma telemetrii.

### Filozofia

POTOKI nie próbują zarządzać Twoją pracą. Ich celem jest zachowanie kontekstu.

To aplikacja dla osób, które często przełączają się między tematami i chcą szybko odpowiedzieć sobie na pytania:

- Co tu ostatnio robiłem?
- Jaką decyzję podjąłem i dlaczego?
- Co warto przeczytać przed powrotem do tematu?
- Jaki jest następny mały krok?
- Gdzie są lokalne notatki, szkice i pliki związane z tym kontekstem?

### Dlaczego lokalne workspace?

W środowiskach ograniczonych, korporacyjnych albo bankowych często nie można używać usług chmurowych, backendów, lokalnych baz danych, telemetrii ani synchronizacji. POTOKI działają w tym modelu naturalnie: użytkownik wybiera folder workspace, a aplikacja czyta i zapisuje pliki bezpośrednio w tym folderze.

Filesystem jest źródłem prawdy.

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

### Najważniejsze funkcje

- wiele równoległych potoków pracy,
- timeline wpisów dla każdego potoku,
- szybkie wpisy: notatka, decyzja, wykonana akcja, praca, plik,
- edycja i usuwanie wpisów z potwierdzeniem,
- aktualny kontekst potoku jako spokojna notatka operacyjna,
- następne kroki / notatki powrotu,
- lokalne notatki Markdown,
- podpinanie notatek do potoku albo konkretnego wpisu,
- podpinanie lokalnych plików do potoku albo konkretnego wpisu,
- modalny podgląd i edycja Markdown,
- lokalne wyszukiwanie w pamięci aplikacji,
- ciemny, spokojny interfejs,
- przełącznik języka PL / EN,
- build statyczny jako pojedynczy `index.html`.

### Uruchomienie

#### Wersja online

Otwórz:

[https://wojmam.github.io/potoki/](https://wojmam.github.io/potoki/)

POTOKI nadal działają lokalnie: strona jest tylko statycznym plikiem aplikacji, a dane workspace pozostają w wybranym folderze na Twoim komputerze.

#### Wersja lokalna z builda

```bash
npm install
npm run build
```

Po buildzie katalog `dist` zawiera pojedynczy plik:

```text
dist/
  index.html
```

Możesz skopiować ten plik na inną maszynę i otworzyć go w Chrome albo Edge.

### Development

```bash
npm install
npm run dev
```

Build produkcyjny:

```bash
npm run build
```

Podgląd buildu przez lokalny serwer Vite:

```bash
npm run preview
```

### Wymagania przeglądarki

POTOKI używają **File System Access API**, dlatego wymagają przeglądarki Chromium:

- Google Chrome,
- Microsoft Edge,
- inne Chromium-based browsers z obsługą File System Access API.

Jeśli API nie jest dostępne, aplikacja pokaże jasny komunikat i nie zapisze danych do ukrytego storage przeglądarki.

### Architektura danych

POTOKI są aplikacją file-based. Dane użytkownika żyją w folderze workspace:

- `workspace.json` opisuje workspace i wersję schematu,
- `streams/*.json` przechowują potoki,
- `timeline/*.timeline.json` przechowują wpisy,
- `notes/**.md` przechowują notatki Markdown,
- `artifacts/` może zawierać lokalne pliki powiązane z kontekstem.

Aplikacja normalizuje starsze dane przy odczycie, uzupełnia bezpieczne wartości domyślne i zachowuje stabilny format zapisu.

### Prywatność

POTOKI nie wysyłają danych poza komputer użytkownika.

- brak backendu,
- brak kont,
- brak logowania,
- brak telemetrii,
- brak synchronizacji,
- brak bazy danych,
- brak IndexedDB jako źródła prawdy,
- dane w czytelnych plikach JSON i Markdown.

---

## English

### What is POTOKI?

POTOKI is a local context workspace for technical work. It helps you return to parallel work currents without turning them into a task board, a ticketing system, or a productivity tracker.

Each **potok** is a focused stream of context: a refactor, an architecture review, research, documentation, testing, operational notes, or any thread of work you may need to resume later.

POTOKI stores data in human-readable files:

- `JSON` for workspace, potok, and timeline data,
- `Markdown` for notes,
- relative local paths for attached files and artifacts.

No account. No backend. No cloud. No telemetry.

### Philosophy

POTOKI does not try to manage your work. It helps preserve context.

It is built for people who switch between many technical threads and need a quiet way to answer:

- What was I doing here?
- What decision did I make, and why?
- What should I read before continuing?
- What is the next small thing to pick up?
- Where are the local notes, sketches, and files for this context?

### Why local workspaces?

In restricted corporate, banking, or offline environments, cloud tools, hosted backends, local databases, telemetry, and account systems may be unavailable or not allowed. POTOKI is designed for that reality. You select a workspace folder, and the app reads and writes files directly inside it.

The filesystem is the source of truth.

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

### Features

- multiple parallel work currents,
- per-potok timeline entries,
- quick capture for notes, decisions, completed actions, work logs, and file links,
- editable and safely deletable timeline entries,
- current context as a calm operational note,
- next steps / return notes,
- local Markdown notes,
- attach notes to a potok or a specific timeline entry,
- attach local files to a potok or a specific timeline entry,
- modal Markdown preview and editing,
- local in-memory search,
- premium dark UI,
- bilingual UI: Polish and English,
- offline-first static build,
- single-file `index.html` production output.

### Running the App

#### Hosted static app

Open:

[https://wojmam.github.io/potoki/](https://wojmam.github.io/potoki/)

The hosted page is only the static app shell. Your workspace data still stays in the local folder you choose.

#### Local build

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

### Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Preview the production build through Vite:

```bash
npm run preview
```

### Browser Requirement

POTOKI uses the **File System Access API**, so it requires a Chromium-based browser:

- Google Chrome,
- Microsoft Edge,
- another Chromium browser with File System Access API support.

If the API is unavailable, the app shows a clear message and does not silently fall back to hidden browser storage.

### Data Architecture

POTOKI is file-based. User data lives in the selected workspace folder:

- `workspace.json` describes the workspace and schema version,
- `streams/*.json` store potoki,
- `timeline/*.timeline.json` store timeline entries,
- `notes/**.md` store Markdown notes,
- `artifacts/` may contain local context files.

The app normalizes older files on read, fills safe defaults, and writes a predictable current format.

### Privacy

POTOKI does not send workspace data anywhere.

- no backend,
- no accounts,
- no authentication,
- no telemetry,
- no cloud sync,
- no database,
- no IndexedDB as the source of truth,
- data stays in human-readable JSON and Markdown files.

---

## Screenshots

| View | Preview |
| --- | --- |
| Dashboard | ![Dashboard](docs/screenshots/dashboard.png) |
| Stream view | ![Stream view](docs/screenshots/stream-view.png) |
| Markdown editor | ![Markdown editor](docs/screenshots/markdown-editor.png) |
| Settings | ![Settings](docs/screenshots/settings.png) |
| Timeline flow | ![Timeline flow](docs/screenshots/timeline-flow.png) |

GIF placeholders:

- `docs/screenshots/open-workspace.gif`
- `docs/screenshots/create-note.gif`
- `docs/screenshots/link-file.gif`

---

## Tech Stack

- **React** for the UI,
- **TypeScript** for type safety,
- **Vite** for development and production builds,
- **Tailwind CSS** for the visual system,
- **React Markdown** for note rendering,
- **File System Access API** for local workspace access,
- **GitHub Pages** for static deployment,
- local-first repository layer over JSON and Markdown files.

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

## Local-first Philosophy

POTOKI treats the workspace folder as the product boundary.

The app is designed around a few hard rules:

- user data belongs to the user,
- files should stay readable outside the app,
- the filesystem is the source of truth,
- no server is required at runtime,
- no cloud service is required,
- no telemetry is collected,
- no account is needed to think clearly.

This makes POTOKI suitable for offline work, restricted environments, and personal context management where privacy matters more than collaboration features.

---

## Roadmap

Potential future directions:

- tags and gentle grouping for potoki,
- richer local search,
- deeper linking between entries, notes, and files,
- potok templates,
- workspace export/import helpers,
- optional plugin/extension ideas,
- configurable focus mode,
- improved keyboard navigation,
- AI-assisted context summaries as an optional future idea.

Roadmap items are intentionally lightweight. POTOKI should stay calm, local, and context-first.

---

## License

License information will be added here.

Until a license file is present, treat the project as not yet licensed for redistribution or reuse.

