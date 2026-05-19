# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
