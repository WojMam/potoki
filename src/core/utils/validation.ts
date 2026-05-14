import { isRecord, normalizeTimeline, normalizeWorkstream, normalizeWorkspace } from "../data/normalizers";
import type { TimelineFile } from "../models/timeline";
import type { Workstream } from "../models/workstream";
import type { WorkspaceManifest } from "../models/workspace";

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

export function validateWorkspaceManifest(value: unknown): ValidationResult<WorkspaceManifest> {
  if (!isRecord(value)) return { ok: false, errors: ["workspace.json must be an object"] };
  return { ok: true, value: normalizeWorkspace(value) };
}

export function validateWorkstream(value: unknown, fallbackId = "untitled"): ValidationResult<Workstream> {
  if (!isRecord(value)) return { ok: false, errors: ["stream file must be an object"] };
  return { ok: true, value: normalizeWorkstream(value, fallbackId) };
}

export function validateTimeline(value: unknown, streamId: string): ValidationResult<TimelineFile> {
  if (!Array.isArray(value) && !isRecord(value)) {
    return { ok: false, errors: ["timeline file must contain { streamId, entries }"] };
  }
  return { ok: true, value: normalizeTimeline(value, streamId) };
}
