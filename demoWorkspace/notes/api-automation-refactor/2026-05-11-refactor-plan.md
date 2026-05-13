# API Automation Refactor Plan

## Goal

Reduce repeated test setup while keeping test behavior easy to inspect.

## Keep

- Existing suite structure.
- Explicit scenario names.
- Per-suite ownership.

## Change

- Extract fixture factories for shared payload defaults.
- Move repeated response assertions into small helpers.
- Keep retry policy visible near the calling test.

## Avoid

Do not create a broad internal testing framework. The team needs less indirection, not more.
