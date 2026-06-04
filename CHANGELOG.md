# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2026-06-04

### Added

- **Przystań — nawigacja w sidebarze** — pomosty i karty (pod wybranym pomostem) na lewym pasku; przycisk „Nowy pomost” w stopce sidebara.
- **E2E: sidebar Przystani** — smoke sprawdzający listę pomostów i kart w `aside`.

### Fixed

- **TypeScript** — jawne zależności `@types/react` i `@types/react-dom` (błąd „Cannot find type definition file for 'react'” w IDE).

## [0.2.0] - 2026-05-19

### Added

- **Przystań (Harbor)** — optional workspace module for reusable knowledge cards: piers, syntax-highlighted snippets, copy-to-clipboard, and PL/EN UI. Data lives under `harbor/`; old workspaces without it keep working.
- **E2E: Przystań** — smoke (module switch), critical (pier, card, copy, edit, delete, search), regression (workspace without `harbor/`).
- **Timeline entry type `meeting`** — new quick-entry option (PL: spotkanie) with placeholder hints in PL/EN.
- **Timeline entry type icons** — subtle Lucide icons on the type picker and on each entry badge for quicker scanning.
- **Favicon** — POTOKI mark inlined into production `index.html` (data URI); `public/favicon.svg` served in dev only.

### Fixed

- **Harbor card dialog** — save and cancel buttons stay clickable; the syntax preview panel no longer covers the footer.

## [0.1.4] - 2026-05-19

### Changed

- **Unlink file control on timeline entries** — round badge integrated in the top-right corner of the linked-file chip (edit mode), with a softer destructive tint and hover scale/shadow feedback.

## [0.1.3] - 2026-05-19

### Added

- **Timeline entry attachments** — unlink non-Markdown files from a timeline entry while editing; remove a Markdown note from an entry while editing its preview (the `.md` file is deleted only when it is not linked elsewhere in the workspace).

## [0.1.2] - 2026-05-19

### Added

- **E2E testing (Playwright)** — Chromium-based end-to-end suite with in-memory File System Access API mock, fixture workspaces, and shared helpers (`tests/e2e/`, `tests/utils/`). Covers smoke flows, streams, notes, markdown toolbar, settings, and legacy data compatibility ([`docs/testing/TEST_STRATEGY.md`](docs/testing/TEST_STRATEGY.md)).
- **npm scripts** — `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:debug`, `test:e2e:report`.
- **CI** — GitHub Actions workflow runs E2E on push/PR to `main` and `master`; uploads HTML report artifact and job summary.
- **Hosted test report** — publish workflow deploys the Playwright HTML report to GitHub Pages at `/playwright-report/` (automatic after E2E on the default branch, or manual via workflow dispatch).

### Changed

- **Accessibility for tests** — `aria-label` on workspace name, timeline entries, and the markdown editor (PL/EN) for stable selectors without changing product behavior.

### Fixed

- **Hosted Playwright HTML report contrast** — post-process patch forces a light theme so test rows stay readable when the OS or browser prefers dark mode.

## [0.1.1] - 2026-05-19

### Added

- **Faster workspace saves** — note dialog closes immediately; timeline updates write from in-memory state without re-reading JSON; parallel stream/timeline writes where safe.
- **Directory handle cache** for File System Access API paths during a workspace session.

### Fixed

- **Release notes** — workflow reads the matching `CHANGELOG.md` section for `package.json` version (with `[Unreleased]` fallback).
- Redundant `workspace.json` touches and post-save note re-read removed from common save paths.

### Changed

- Ambient background uses static depth layers with horizontal wave drift only (no shifting color blobs).
- `Build Release Package` workflow: optional `changelog` input; version defaults from `package.json`.

## [0.1.0] - 2026-05-18

### Added

- **Ambient workspace atmosphere** — subtle water-inspired background with static depth layers and slow horizontal wave lines tuned for a calm, non-distracting feel.
- **Canvas ripples** — click anywhere on the workspace background to spawn soft ripples; occasional idle drops when the UI is quiet.
- **Animation settings** — new controls in Settings to enable or disable ambient motion, and sliders for ripple frequency and wave intensity (stored in local preferences, with reduced-motion respected).

### Fixed

- Removed a dark horizontal band artifact in the ambient gradient stack.
- Wave lines now tile seamlessly across wide layouts without visible seams.
- Visibility and contrast tuning so ambient motion reads clearly without overpowering content.

### Changed

- English copy polish for settings hints and release-facing strings where relevant.
