import { currentSchemaVersion, defaultLinkedFile, defaultTimelineEntry, defaultWorkspace, defaultWorkstream } from "./defaults";
import type { LinkedFile } from "../models/fileLink";
import { timelineEntryTypes, type TimelineEntry, type TimelineEntryType, type TimelineFile } from "../models/timeline";
import { workstreamStatuses, type Workstream, type WorkstreamStatus } from "../models/workstream";
import type { WorkspaceManifest } from "../models/workspace";
import { nowIso } from "../utils/date";
import { slugify } from "../utils/ids";

type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function nonEmptyStringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function dateOr(value: unknown, fallback: string) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return fallback;
  return value;
}

function stringArrayOr(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === "string");
}

function schemaVersionOf(value: unknown) {
  if (!isRecord(value)) return 0;
  if (typeof value.schemaVersion === "number" && Number.isInteger(value.schemaVersion) && value.schemaVersion >= 0) {
    return value.schemaVersion;
  }
  if (typeof value.schemaVersion === "string") {
    const parsed = Number.parseInt(value.schemaVersion, 10);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  }
  return 0;
}

function migrateWorkspaceV0ToV1(value: unknown): unknown {
  if (!isRecord(value)) return value;
  return {
    ...value,
    schemaVersion: currentSchemaVersion,
  };
}

const workspaceMigrations: Record<number, (value: unknown) => unknown> = {
  0: migrateWorkspaceV0ToV1,
};

function applyWorkspaceMigrations(value: unknown): unknown {
  let migrated = value;
  let version = schemaVersionOf(migrated);

  while (version < currentSchemaVersion) {
    const migration = workspaceMigrations[version];
    if (!migration) break;
    migrated = migration(migrated);
    version += 1;
  }

  return migrated;
}

export function migrateWorkspace(raw: unknown, timestamp = nowIso()): WorkspaceManifest {
  return normalizeWorkspace(raw, timestamp);
}

export function normalizeWorkspace(raw: unknown, timestamp = nowIso()): WorkspaceManifest {
  const migrated = applyWorkspaceMigrations(raw);
  const source = isRecord(migrated) ? migrated : {};
  const defaults = defaultWorkspace(timestamp);
  const rawDirectories = isRecord(source.directories) ? source.directories : {};

  return {
    ...source,
    schemaVersion: currentSchemaVersion,
    name: nonEmptyStringOr(source.name, defaults.name),
    version: nonEmptyStringOr(source.version, defaults.version),
    createdAt: dateOr(source.createdAt, defaults.createdAt),
    updatedAt: dateOr(source.updatedAt, dateOr(source.createdAt, defaults.updatedAt)),
    directories: {
      ...rawDirectories,
      streams: nonEmptyStringOr(rawDirectories.streams, defaults.directories.streams),
      timeline: nonEmptyStringOr(rawDirectories.timeline, defaults.directories.timeline),
      notes: nonEmptyStringOr(rawDirectories.notes, defaults.directories.notes),
      artifacts: nonEmptyStringOr(rawDirectories.artifacts, defaults.directories.artifacts),
    },
  };
}

export function normalizeWorkstream(raw: unknown, fallbackId = "untitled", timestamp = nowIso()): Workstream {
  const source = isRecord(raw) ? raw : {};
  const defaults = defaultWorkstream(timestamp);
  const id = slugify(nonEmptyStringOr(source.id, fallbackId || defaults.id));
  const titleFallback = id === defaults.id ? defaults.title : id;
  const createdAt = dateOr(source.createdAt, defaults.createdAt);

  return {
    ...source,
    id,
    title: nonEmptyStringOr(source.title, titleFallback),
    description: stringOr(source.description, defaults.description),
    status: normalizeWorkstreamStatus(source.status),
    currentContext: stringOr(source.currentContext, defaults.currentContext),
    nextActions: stringArrayOr(source.nextActions, defaults.nextActions),
    linkedFiles: normalizeLinkedFiles(source.linkedFiles, timestamp),
    createdAt,
    updatedAt: dateOr(source.updatedAt, createdAt),
  };
}

export function normalizeWorkstreamStatus(status: unknown): WorkstreamStatus {
  if (status === "archived" || status === "done") return "archived";
  if (status === "parked" || status === "waiting" || status === "paused" || status === "sleeping") return "parked";
  if (workstreamStatuses.includes(status as WorkstreamStatus)) return status as WorkstreamStatus;
  return "active";
}

export function normalizeTimeline(raw: unknown, streamId: string, timestamp = nowIso()): TimelineFile {
  const source = isRecord(raw) ? raw : {};
  const entriesRaw = Array.isArray(raw) ? raw : Array.isArray(source.entries) ? source.entries : [];

  return {
    ...source,
    streamId,
    entries: entriesRaw.map((entry, index) => normalizeTimelineEntry(entry, streamId, index, timestamp)),
  };
}

export function normalizeTimelineEntry(raw: unknown, streamId: string, index = 0, timestamp = nowIso()): TimelineEntry {
  const source = isRecord(raw) ? raw : {};
  const defaults = defaultTimelineEntry(streamId, timestamp);
  const createdAt = dateOr(source.createdAt, defaults.createdAt);
  const titleFallback = nonEmptyStringOr(source.label, defaults.title);

  return {
    ...source,
    id: nonEmptyStringOr(source.id, `${streamId}-entry-${index + 1}`),
    streamId,
    type: normalizeTimelineEntryType(source.type),
    title: nonEmptyStringOr(source.title, titleFallback),
    content: stringOr(source.content, stringOr(source.body, stringOr(source.description, defaults.content))),
    createdAt,
    linkedFiles: normalizeLinkedFiles(source.linkedFiles, createdAt),
  };
}

export function normalizeTimelineEntryType(type: unknown): TimelineEntryType {
  if (timelineEntryTypes.includes(type as TimelineEntryType)) return type as TimelineEntryType;
  if (type === "worklog") return "work_log";
  if (type === "file" || type === "link") return "file_link";
  if (type === "done" || type === "completed") return "action_done";
  return "note";
}

export function normalizeLinkedFiles(raw: unknown, timestamp = nowIso()): LinkedFile[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    const normalized = normalizeLinkedFile(item, timestamp);
    return normalized.path ? [normalized] : [];
  });
}

export function normalizeLinkedFile(raw: unknown, timestamp = nowIso()): LinkedFile {
  const source = isRecord(raw) ? raw : {};
  const defaults = defaultLinkedFile(timestamp);
  const path = nonEmptyStringOr(source.path, nonEmptyStringOr(source.relativePath, nonEmptyStringOr(source.filePath, defaults.path)));
  const label = nonEmptyStringOr(source.label, nonEmptyStringOr(source.name, path || defaults.label));

  return {
    ...source,
    label,
    path,
    type: nonEmptyStringOr(source.type, defaults.type),
    addedAt: dateOr(source.addedAt, timestamp),
  };
}
