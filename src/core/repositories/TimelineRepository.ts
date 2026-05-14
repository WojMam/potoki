import type { DirectoryHandle, FileSystemAccessAdapter } from "../filesystem/FileSystemAccessAdapter";
import { JsonFileStore } from "../filesystem/JsonFileStore";
import { isRecord, normalizeTimeline, normalizeTimelineEntry } from "../data/normalizers";
import type { TimelineEntry } from "../models/timeline";
import { validateTimeline } from "../utils/validation";

export class TimelineRepository {
  private readonly store: JsonFileStore;

  constructor(
    private readonly adapter: FileSystemAccessAdapter,
    private readonly root: DirectoryHandle,
    private readonly directory = "timeline",
  ) {
    this.store = new JsonFileStore(adapter, root);
  }

  async load(streamId: string) {
    const path = `${this.directory}/${streamId}.timeline.json`;
    try {
      const raw = await this.store.read(path);
      const validation = validateTimeline(raw, streamId);
      if (!validation.ok) return { entries: [], issues: [`Invalid timeline file ${path}: ${validation.errors.join(", ")}`] };
      return { entries: validation.value.entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), issues: [] };
    } catch (error) {
      return {
        entries: [],
        issues: [error instanceof Error ? error.message : `Could not read ${path}`],
      };
    }
  }

  async loadMany(streamIds: string[]) {
    const results = await Promise.all(streamIds.map((id) => this.load(id)));
    return {
      entries: results.flatMap((result) => result.entries).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      issues: results.flatMap((result) => result.issues),
    };
  }

  async save(streamId: string, entries: TimelineEntry[]) {
    const path = `${this.directory}/${streamId}.timeline.json`;
    let existing: unknown = {};
    try {
      existing = await this.store.read(path);
    } catch {
      existing = {};
    }
    const normalized = normalizeTimeline({ ...(isRecord(existing) ? existing : {}), streamId, entries }, streamId);
    await this.store.write(
      path,
      {
        ...normalized,
        streamId,
        entries: normalized.entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      },
    );
  }

  async append(streamId: string, entry: TimelineEntry) {
    const { entries } = await this.load(streamId);
    const next = [normalizeTimelineEntry(entry, streamId), ...entries];
    await this.save(streamId, next);
    return next;
  }

  async update(streamId: string, entry: TimelineEntry) {
    const { entries } = await this.load(streamId);
    const normalized = normalizeTimelineEntry(entry, streamId);
    const next = entries.map((item) => (item.id === normalized.id ? normalized : item));
    await this.save(streamId, next);
    return next;
  }

  async deleteEntry(streamId: string, entryId: string) {
    const { entries } = await this.load(streamId);
    const next = entries.filter((item) => item.id !== entryId);
    await this.save(streamId, next);
    return next;
  }

  async deleteTimeline(streamId: string) {
    try {
      await this.adapter.removeFile(this.root, `${this.directory}/${streamId}.timeline.json`);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "NotFoundError") throw error;
    }
  }
}
