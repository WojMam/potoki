import type { LinkedFile } from "../models/fileLink";
import type { TimelineEntry, TimelineFile } from "../models/timeline";
import type { WorkspaceManifest } from "../models/workspace";
import type { Workstream } from "../models/workstream";

export const currentSchemaVersion = 1;

export const defaultWorkspaceDirectories = {
  streams: "streams",
  timeline: "timeline",
  notes: "notes",
  artifacts: "artifacts",
} as const;

export const defaultAppSettings = {
  language: "pl",
} as const;

export const defaultNote = {
  title: "",
  content: "",
  linkedFiles: [] as LinkedFile[],
} as const;

export function defaultLinkedFile(timestamp: string): LinkedFile {
  return {
    label: "Linked file",
    path: "",
    type: "file",
    addedAt: timestamp,
  };
}

export function defaultWorkspace(timestamp: string): WorkspaceManifest {
  return {
    schemaVersion: currentSchemaVersion,
    name: "POTOKI",
    version: "1.0.0",
    createdAt: timestamp,
    updatedAt: timestamp,
    directories: { ...defaultWorkspaceDirectories },
  };
}

export function defaultWorkstream(timestamp: string): Workstream {
  return {
    id: "untitled",
    title: "Untitled potok",
    description: "",
    status: "active",
    currentContext: "",
    nextActions: [],
    linkedFiles: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function defaultTimelineEntry(streamId: string, timestamp: string): TimelineEntry {
  return {
    id: `${streamId}-entry`,
    streamId,
    type: "note",
    title: "Untitled entry",
    content: "",
    createdAt: timestamp,
    linkedFiles: [],
  };
}

export function defaultTimelineFile(streamId: string): TimelineFile {
  return {
    streamId,
    entries: [],
  };
}
