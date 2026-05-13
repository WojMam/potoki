# File Formats

## workspace.json

```json
{
  "name": "POTOKI Workspace",
  "version": "1.0.0",
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

## notes/{streamId}/*.md

Markdown notes are plain `.md` files created with readable date-prefixed filenames.
