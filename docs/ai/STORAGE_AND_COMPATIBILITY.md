# Storage and Compatibility

## Workspace Structure

```text
workspace/
  workspace.json
  streams/
    {streamId}.json
  timeline/
    {streamId}.timeline.json
  notes/
    {streamId}/
      YYYY-MM-DD-readable-title.md
  artifacts/
    {streamId}/
```

## Source of Truth

- `workspace.json` stores workspace metadata.
- `streams/*.json` stores potoki.
- `timeline/*.timeline.json` stores timeline entries.
- `notes/**/*.md` stores note content.
- linked files are metadata references.

## Schema Versioning

- Current workspace `schemaVersion`: `1`.
- Missing `schemaVersion` means legacy input.
- Migrations should be sequential and testable.
- Normalize before UI use.

## Compatibility Guarantees

Old workspaces must continue opening.

Rules:

- Missing arrays become `[]`.
- Missing strings become safe defaults.
- Missing status becomes safe current status.
- Missing dates receive safe fallback timestamps.
- Unknown fields should be tolerated where possible.
- Unsupported legacy statuses should normalize safely.
- Timeline entries without `linkedFiles` become `linkedFiles: []`.

## Safe Evolution

Prefer additive changes:

- optional fields,
- default values,
- normalization,
- non-destructive migrations.

Avoid:

- destructive migration,
- assuming all old files have new fields,
- crashing on malformed optional data,
- silently moving user files.

## Write Behavior

When saving:

- write current schema version,
- write normalized current shape,
- preserve predictable formatting,
- do not delete physical note/artifact files unless explicitly implemented and confirmed.

## Fixtures

Compatibility examples live in:

`docs/fixtures/data-compatibility/`
