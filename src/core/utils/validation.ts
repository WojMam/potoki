import type { TimelineEntry, TimelineFile } from "../models/timeline";
import { timelineEntryTypes } from "../models/timeline";
import type { Workstream } from "../models/workstream";
import { workstreamStatuses } from "../models/workstream";
import type { WorkspaceManifest } from "../models/workspace";

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isLinkedFiles = (value: unknown) =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isRecord(item) &&
      typeof item.label === "string" &&
      typeof item.path === "string" &&
      typeof item.type === "string" &&
      typeof item.addedAt === "string",
  );

function requireString(source: Record<string, unknown>, key: string, errors: string[]) {
  if (typeof source[key] !== "string") errors.push(`${key} must be a string`);
}

export function validateWorkspaceManifest(value: unknown): ValidationResult<WorkspaceManifest> {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["workspace.json must be an object"] };
  ["name", "version", "createdAt", "updatedAt"].forEach((key) => requireString(value, key, errors));
  if (!isRecord(value.directories)) {
    errors.push("directories must be an object");
  } else {
    ["streams", "timeline", "notes", "artifacts"].forEach((key) =>
      requireString(value.directories as Record<string, unknown>, key, errors),
    );
  }
  return errors.length ? { ok: false, errors } : { ok: true, value: value as WorkspaceManifest };
}

export function validateWorkstream(value: unknown): ValidationResult<Workstream> {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["stream file must be an object"] };
  ["id", "title", "description", "currentContext", "createdAt", "updatedAt"].forEach((key) =>
    requireString(value, key, errors),
  );
  const normalizedStatus = normalizeWorkstreamStatus(value.status);
  if (!workstreamStatuses.includes(normalizedStatus as never)) errors.push("status is invalid");
  if (!Array.isArray(value.nextActions) || !value.nextActions.every((item) => typeof item === "string")) {
    errors.push("nextActions must be an array of strings");
  }
  if (!isLinkedFiles(value.linkedFiles)) errors.push("linkedFiles must be valid linked file metadata");
  return errors.length
    ? { ok: false, errors }
    : {
        ok: true,
        value: {
          id: value.id as string,
          title: value.title as string,
          description: value.description as string,
          status: normalizedStatus,
          currentContext: value.currentContext as string,
          nextActions: value.nextActions as string[],
          linkedFiles: value.linkedFiles as Workstream["linkedFiles"],
          createdAt: value.createdAt as string,
          updatedAt: value.updatedAt as string,
        },
      };
}

function normalizeWorkstreamStatus(status: unknown): Workstream["status"] {
  if (status === "archived" || status === "done") return "archived";
  if (status === "parked" || status === "waiting" || status === "paused") return "parked";
  return "active";
}

export function validateTimeline(value: unknown, streamId: string): ValidationResult<TimelineFile> {
  const timelineEntries = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.entries)
      ? value.entries
      : null;

  if (!timelineEntries) return { ok: false, errors: ["timeline file must contain { streamId, entries }"] };
  const errors: string[] = [];
  if (isRecord(value)) {
    requireString(value, "streamId", errors);
    if (value.streamId !== streamId) errors.push("timeline streamId does not match file");
  }
  timelineEntries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`entry ${index + 1} must be an object`);
      return;
    }
    ["id", "streamId", "title", "content", "createdAt"].forEach((key) => requireString(entry, key, errors));
    if (entry.streamId !== streamId) errors.push(`entry ${index + 1} streamId does not match file`);
    if (!timelineEntryTypes.includes(entry.type as never)) errors.push(`entry ${index + 1} type is invalid`);
    if (!isLinkedFiles(entry.linkedFiles)) errors.push(`entry ${index + 1} linkedFiles are invalid`);
  });
  return errors.length
    ? { ok: false, errors }
    : { ok: true, value: { streamId, entries: timelineEntries as TimelineEntry[] } };
}
