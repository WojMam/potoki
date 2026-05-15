# AI Overview

## Product Summary

POTOKI is a local-first context workspace for technical work.

It helps users:

- manage multiple parallel work contexts,
- remember decisions and operational notes,
- attach local Markdown notes and files,
- return to interrupted work without cloud tools.

## What Makes It Different

- Filesystem is the source of truth.
- Data is human-readable JSON and Markdown.
- No backend, account, database, telemetry, or cloud dependency.
- UI is quiet and context-oriented, not productivity-oriented.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- lucide-react
- react-markdown
- File System Access API

## Architecture Direction

- Static app opened from `index.html`.
- Feature-based React structure.
- File access only through repository/filesystem abstractions.
- React state for app state.
- Runtime normalization for loaded JSON.
- Simple in-memory search.
- Lightweight i18n through local translation objects.

## Local-first Rules

- Local files are authoritative.
- JSON stores structured data.
- Markdown stores notes.
- Linked files are metadata references, not uploads.
- Do not silently fallback to localStorage/IndexedDB for user data.
- localStorage is acceptable only for app preferences such as language.

## UI Direction

- Dark, calm, premium, low-noise.
- Inspired by Linear, Obsidian, Raycast, Arc, native desktop tools.
- Subtle cyan/turquoise accent.
- Tinted surfaces over glow-heavy effects.
- Editorial workspace, not dashboard SaaS.

## Anti-goals

- No Jira clone.
- No Kanban board.
- No analytics dashboard.
- No productivity scoring.
- No gamification.
- No enterprise admin UI.
- No AI features unless explicitly requested.

## How AI Should Work Here

- Read relevant docs first.
- Make small, scoped changes.
- Preserve existing product language.
- Preserve data compatibility.
- Run typecheck/build after code changes when possible.
- Do not invent architecture that is not in the repo.
