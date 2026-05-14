import type { DirectoryHandle, FileSystemAccessAdapter } from "../filesystem/FileSystemAccessAdapter";
import { JsonFileStore } from "../filesystem/JsonFileStore";
import { normalizeWorkstream } from "../data/normalizers";
import type { Workstream } from "../models/workstream";
import { nowIso } from "../utils/date";
import { validateWorkstream } from "../utils/validation";

export type StreamLoadResult = {
  streams: Workstream[];
  issues: string[];
};

export class StreamRepository {
  private readonly store: JsonFileStore;

  constructor(
    private readonly adapter: FileSystemAccessAdapter,
    private readonly root: DirectoryHandle,
    private readonly directory = "streams",
  ) {
    this.store = new JsonFileStore(adapter, root);
  }

  async loadAll(): Promise<StreamLoadResult> {
    const streams: Workstream[] = [];
    const issues: string[] = [];
    let dir: DirectoryHandle;
    try {
      dir = await this.adapter.getDirectory(this.root, this.directory, false);
    } catch {
      return { streams, issues: [`Missing ${this.directory} directory`] };
    }

    for (const file of await this.adapter.listFiles(dir)) {
      if (!file.name.endsWith(".json")) continue;
      const path = `${this.directory}/${file.name}`;
      try {
        const raw = await this.store.read(path);
        const fallbackId = file.name.replace(/\.json$/i, "");
        const validation = validateWorkstream(raw, fallbackId);
        if (validation.ok) streams.push(validation.value);
        else issues.push(`Invalid stream file ${path}: ${validation.errors.join(", ")}`);
      } catch (error) {
        issues.push(error instanceof Error ? error.message : `Could not read ${path}`);
      }
    }
    return { streams: streams.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), issues };
  }

  async save(stream: Workstream) {
    const updated = normalizeWorkstream({ ...stream, updatedAt: nowIso() }, stream.id);
    await this.store.write(`${this.directory}/${stream.id}.json`, updated);
    return updated;
  }

  async create(stream: Workstream) {
    const normalized = normalizeWorkstream(stream, stream.id);
    await this.store.write(`${this.directory}/${normalized.id}.json`, normalized);
    return normalized;
  }
}
