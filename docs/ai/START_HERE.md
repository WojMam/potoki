# START HERE

AI onboarding entrypoint for POTOKI.

## Read Order

1. `AI_OVERVIEW.md` - fastest product and architecture orientation.
2. `PRODUCT_VISION.md` - product identity, emotional direction, anti-goals.
3. `UI_UX_PRINCIPLES.md` - visual rules and interaction constraints.
4. `ENGINEERING_RULES.md` - coding rules and safe-change expectations.
5. `ARCHITECTURE_GUIDE.md` - real project architecture and data flow.
6. `FILE_MAP.md` - where things live.

Read selectively after that:

- Storage/model change: `STORAGE_AND_COMPATIBILITY.md`.
- Naming/copy/domain terms: `TERMINOLOGY.md`.
- Agent workflow: `AI_WORKFLOW.md`.
- User prompt quality: `PROMPTING_GUIDE.md`.

## Default Behavior

- Do not redesign the application without explicit request.
- Prefer incremental changes over rewrites.
- Preserve local-first philosophy.
- Preserve backward compatibility for workspace files.
- Keep UI calm, dark, minimal, and premium.
- Avoid backend, database, telemetry, auth, cloud sync, and hidden browser storage as source of truth.
- Inspect real code before editing.
