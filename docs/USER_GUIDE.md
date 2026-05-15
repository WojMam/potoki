# User Guide

## Open Or Create A Workspace

Open `index.html` in Chrome or Edge. Choose the workspace action for an existing POTOKI folder, or create a new local workspace to initialize the file structure.

The sample workspace seeds three example potoki:

- R&D: Local AI integration
- API automation refactor
- Architecture diagram review

## Potoki

Use the left panel to search, filter, select, or create potoki. A potok represents one ongoing context of technical work.

Current statuses are intentionally simple:

- `active` for current contexts,
- `parked` for contexts that are sleeping for now,
- `archived` for contexts kept only as memory.

## Timeline

The center panel shows the selected potok's timeline grouped by date. Add notes, decisions, completed work, parked context notes, file links, and lightweight work logs.

Timeline entries are editable and can be deleted with confirmation. Notes and files can be attached to the whole potok or to a specific timeline entry.

## Context Rail

The right panel is a quiet context rail. It contains current context, return notes, linked files, and low-friction actions.

## Markdown Notes

Use the note action to create a Markdown file under `notes/{streamId}/`. Notes can be linked to a potok or attached to a specific timeline entry.

Markdown notes open in a modal reading layer, not inline in the timeline. Existing notes can be edited and saved back to the same Markdown file.

## Linked Files

Use the file action to store metadata for an existing local file. POTOKI stores a relative path when the file is inside the selected workspace folder. It does not upload or copy the file.

Files can be linked globally to a potok or directly to a timeline entry.

## Work Logs

The lightweight daily work action creates a simple timeline entry with an optional note and optional duration. It is meant as context memory, not a timesheet.

## Settings

Settings are available from the sidebar. The current settings panel contains the UI language choice and is prepared for future lightweight preferences.
