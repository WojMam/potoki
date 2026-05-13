import type { DirectoryHandle, FileSystemAccessAdapter } from "../filesystem/FileSystemAccessAdapter";
import { JsonFileStore } from "../filesystem/JsonFileStore";
import type { WorkspaceManifest } from "../models/workspace";
import { nowIso } from "../utils/date";
import { validateWorkspaceManifest } from "../utils/validation";

export type LoadIssue = {
  scope: "workspace" | "streams" | "timeline" | "notes" | "artifacts";
  message: string;
};

export class WorkspaceRepository {
  private readonly store: JsonFileStore;

  constructor(
    private readonly adapter: FileSystemAccessAdapter,
    private readonly root: DirectoryHandle,
  ) {
    this.store = new JsonFileStore(adapter, root);
  }

  async loadManifest() {
    const issues: LoadIssue[] = [];
    let raw: unknown;
    try {
      raw = await this.store.read("workspace.json");
    } catch (error) {
      issues.push({
        scope: "workspace",
        message: error instanceof Error ? error.message : "Missing or unreadable workspace.json",
      });
      return { manifest: null, issues };
    }

    const validation = validateWorkspaceManifest(raw);
    if (!validation.ok) {
      issues.push({ scope: "workspace", message: `Invalid workspace.json: ${validation.errors.join(", ")}` });
      return { manifest: null, issues };
    }

    for (const key of ["streams", "timeline", "notes", "artifacts"] as const) {
      try {
        await this.adapter.getDirectory(this.root, validation.value.directories[key], false);
      } catch {
        issues.push({ scope: key, message: `Missing ${validation.value.directories[key]} directory` });
      }
    }

    return { manifest: validation.value, issues };
  }

  async initialize(name: string, withSampleData: boolean) {
    const timestamp = nowIso();
    const manifest: WorkspaceManifest = {
      name: name.trim() || "Threadbase Workspace",
      version: "1.0.0",
      createdAt: timestamp,
      updatedAt: timestamp,
      directories: {
        streams: "streams",
        timeline: "timeline",
        notes: "notes",
        artifacts: "artifacts",
      },
    };
    await Promise.all([
      this.adapter.ensureDirectory(this.root, "streams"),
      this.adapter.ensureDirectory(this.root, "timeline"),
      this.adapter.ensureDirectory(this.root, "notes"),
      this.adapter.ensureDirectory(this.root, "artifacts"),
    ]);
    await this.store.write("workspace.json", manifest);
    if (withSampleData) await this.writeSampleData(timestamp);
    return manifest;
  }

  async touch(manifest: WorkspaceManifest) {
    const updated = { ...manifest, updatedAt: nowIso() };
    await this.store.write("workspace.json", updated);
    return updated;
  }

  private async writeSampleData(timestamp: string) {
    const streams = [
      {
        id: "local-ai-integration",
        title: "R&D: Local AI integration",
        description: "Research offline-safe patterns for local model experimentation and restricted environments.",
        status: "active",
        priority: "high",
        tags: ["research", "ai", "offline"],
        currentContext:
          "Comparing feasible local-only integration shapes. Cloud calls and telemetry are out of scope.",
        nextActions: ["Review approved model runtime constraints", "Draft integration risk notes"],
      },
      {
        id: "api-automation-refactor",
        title: "API automation refactor",
        description: "Tighten API test utilities and reduce brittle setup across automation suites.",
        status: "waiting",
        priority: "medium",
        tags: ["api", "tests", "refactor"],
        currentContext: "Waiting for the latest service contract export before updating fixtures.",
        nextActions: ["Compare old and new contract fixtures", "List helper methods with duplicate behavior"],
      },
      {
        id: "architecture-diagram-review",
        title: "Architecture diagram review",
        description: "Keep local diagrams and review notes connected to architecture decisions.",
        status: "paused",
        priority: "low",
        tags: ["architecture", "docs"],
        currentContext: "Need to reconcile the Draw.io diagram with recent deployment notes.",
        nextActions: ["Open current diagram artifact", "Add missing batch-processing boundary"],
      },
    ] as const;

    await Promise.all(
      streams.map(async (stream) => {
        const fullStream = {
          ...stream,
          linkedFiles: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        await this.store.write(`streams/${stream.id}.json`, fullStream);
        await this.store.write(`timeline/${stream.id}.timeline.json`, {
          streamId: stream.id,
          entries: [
            {
              id: `${stream.id}-entry-1`,
              streamId: stream.id,
              type: "note",
              title: "Workspace seeded",
              content: `Initial context created for ${stream.title}.`,
              createdAt: timestamp,
              linkedFiles: [],
            },
          ],
        });
        await this.adapter.ensureDirectory(this.root, `notes/${stream.id}`);
        await this.adapter.ensureDirectory(this.root, `artifacts/${stream.id}`);
      }),
    );
  }
}
