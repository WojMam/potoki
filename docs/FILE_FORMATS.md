# File Formats

## workspace.json

```json
{
  "name": "POTOKI Workspace",
  "version": "1.0.0",
  "schemaVersion": 1,
  "createdAt": "2026-05-13T08:00:00.000Z",
  "updatedAt": "2026-05-13T08:00:00.000Z",
  "directories": {
    "streams": "streams",
    "timeline": "timeline",
    "notes": "notes",
    "artifacts": "artifacts"
  }
}
```

`schemaVersion` is the workspace data schema version. If it is missing, POTOKI treats the workspace as legacy data and normalizes it on read.

## streams/{streamId}.json

```json
{
  "id": "api-automation-refactor",
  "title": "API automation refactor",
  "description": "Tighten API test utilities.",
  "status": "active",
  "currentContext": "Latest context summary.",
  "nextActions": ["Compare old and new fixtures"],
  "linkedFiles": [
    {
      "label": "research note",
      "path": "notes/api-automation-refactor/2026-05-13-research-note.md",
      "type": "markdown",
      "addedAt": "2026-05-13T08:00:00.000Z"
    }
  ],
  "createdAt": "2026-05-13T08:00:00.000Z",
  "updatedAt": "2026-05-13T08:00:00.000Z"
}
```

Allowed statuses: `active`, `parked`, `archived`.

Older status values may appear in legacy files. POTOKI normalizes unsupported or missing statuses to a safe current value.

## timeline/{streamId}.timeline.json

```json
{
  "streamId": "api-automation-refactor",
  "entries": [
    {
      "id": "entry-abc",
      "streamId": "api-automation-refactor",
      "type": "decision",
      "title": "Keep fixtures local",
      "content": "Fixture generation stays inside the repo.",
      "createdAt": "2026-05-13T08:00:00.000Z",
      "linkedFiles": []
    }
  ]
}
```

Allowed timeline types: `note`, `decision`, `action_done`, `waiting`, `work_log`, `file_link`.

The `waiting` timeline type is retained for file compatibility and is displayed in the UI as a parked note.

Timeline entries can link Markdown notes or local files through `linkedFiles`. Older entries without this field are normalized to an empty array.

## notes/{streamId}/*.md

Markdown notes are plain `.md` files created with readable date-prefixed filenames.

## linkedFiles

Linked files are metadata only. POTOKI does not upload files and does not copy them unless a future explicit copy action is added.

```json
{
  "label": "Architecture sketch",
  "path": "artifacts/api-automation-refactor/architecture.drawio",
  "type": "file",
  "addedAt": "2026-05-13T08:00:00.000Z"
}
```

The `path` should be relative to the workspace root when possible.
