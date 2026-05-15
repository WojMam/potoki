# Terminology

## Product Name

- Use visible name: `POTOKI`.
- Do not use `Threadbase`.

## Potok

Visible domain term for a work context.

Examples:

- "Create potok"
- "Open potok"
- "Potok timeline"

Internal code may still use `Workstream` / `stream` names. Do not rename internals casually.

## Workspace

Selected local folder that contains all data files.

The workspace folder is the source of truth.

## Timeline Entry

One dated memory item inside a potok.

Allowed internal types:

- `note`
- `decision`
- `action_done`
- `waiting`
- `work_log`
- `file_link`

`waiting` is retained for compatibility.

## Current Context

Readable operational note for "what is going on here".

Should feel like memory, not settings.

## Next Things / Return Notes

Small continuation notes.

Avoid task-management language:

- no assignees,
- no deadlines,
- no sprints,
- no estimates.

## Note

Markdown file under `/notes/{streamId}/`.

Can be attached to:

- a potok,
- a timeline entry.

## Attached File

Metadata reference to a local file.

Do not imply upload or cloud storage.

## Status

Current visible model:

- Active / Aktywny
- Sleeping / Uśpiony
- Archived / Archiwalne

Internal values:

- `active`
- `parked`
- `archived`

Avoid priority/tag language unless explicitly reintroduced.
