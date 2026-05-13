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
      name: name.trim() || "POTOKI",
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
        title: "R&D: lokalna integracja AI",
        description: "Sprawdzenie lokalnych wzorców pracy z modelem w ograniczonym środowisku.",
        status: "active",
        currentContext:
          "Porównujemy możliwe kształty integracji działającej wyłącznie lokalnie. Wywołania do chmury i telemetria są poza zakresem.",
        nextActions: ["Sprawdź zatwierdzone ograniczenia runtime modelu", "Zapisz notatkę o ryzykach integracji"],
      },
      {
        id: "api-automation-refactor",
        title: "Refaktoryzacja automatyzacji API",
        description: "Uproszczenie narzędzi testów API i ograniczenie kruchego przygotowania zestawów.",
        status: "parked",
        currentContext: "Uśpione do czasu pojawienia się aktualnego eksportu kontraktu usługi do odświeżenia fixture.",
        nextActions: ["Porównaj stare i nowe fixture kontraktu", "Wypisz helpery z powtarzającym się zachowaniem"],
      },
      {
        id: "architecture-diagram-review",
        title: "Przegląd diagramu architektury",
        description: "Połączenie lokalnych diagramów i notatek przeglądowych z decyzjami architektonicznymi.",
        status: "parked",
        currentContext: "Trzeba uzgodnić diagram Draw.io z ostatnimi notatkami wdrożeniowymi.",
        nextActions: ["Otwórz aktualny diagram", "Dodaj brakującą granicę przetwarzania batch"],
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
              title: "Utworzono kontekst",
              content: `Dodano przykładowy kontekst dla: ${stream.title}.`,
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
