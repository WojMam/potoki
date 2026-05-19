# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **E2E Playwright** — GitHub Actions workflow, HTML report artifact, job summary, and hosted report at `/playwright-report/` on GitHub Pages after runs on `main`.
- **Playwright test suite** — smoke, streams, notes, markdown toolbar, settings, and data-compatibility specs with in-memory File System Access mock ([`docs/testing/TEST_STRATEGY.md`](docs/testing/TEST_STRATEGY.md)).

### Fixed

- **Hosted Playwright HTML report** — force light theme so test rows stay readable when the system or browser prefers dark mode.

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
