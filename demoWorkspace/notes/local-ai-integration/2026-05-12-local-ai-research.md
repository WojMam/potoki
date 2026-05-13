# Local AI Integration Research

## Constraints

- No cloud calls.
- No telemetry.
- No account or authentication workflow.
- No background service.
- No database.
- User must explicitly choose files or actions.

## Candidate Shape

Use a small local command wrapper that accepts selected text or a temporary markdown handoff file. The app should keep the workflow visible and reversible.

## Open Questions

- How are approved model binaries distributed?
- Is generated content allowed to be written into project folders?
- What retention note is needed for prompts and outputs?
