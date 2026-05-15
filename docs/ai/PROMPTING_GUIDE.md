# Prompting Guide

Use prompts that preserve POTOKI's identity and constraints.

## Good UI Prompt

```text
Refine the note editor toolbar spacing.
Do not change Markdown behavior.
Preserve dark premium style, low contrast, and subtle cyan accent.
Run typecheck/build after changes.
```

## Good Storage Prompt

```text
Add an optional color field to potoki.
Older workspaces must keep opening.
Add defaults and normalization.
Do not require manual migration.
Do not change UI yet.
```

## Good Architecture Prompt

```text
Review the note persistence flow.
Explain where Markdown is read/written.
Do not change code unless you find a concrete bug.
```

## Good Debugging Prompt

```text
Investigate why static dist/index.html does not open via file://.
Check Vite output, asset paths, dynamic imports, and console errors.
Fix only the root cause.
```

## Good Visual Polish Prompt

```text
Reduce visual weight of the right context rail.
Do not remove sections or change data model.
Use spacing, typography, and surface layering instead of borders.
```

## Avoid Prompts Like

```text
Make it more productive.
Add dashboards and metrics.
Turn this into a project management app.
Rewrite the architecture.
Add AI summaries everywhere.
```

## Prompt Checklist

Include:

- scope,
- constraints,
- what not to change,
- desired emotional/UX direction,
- required validation.

For storage changes, always mention compatibility.
