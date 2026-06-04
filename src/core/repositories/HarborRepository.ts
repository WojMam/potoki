import type { DirectoryHandle, FileSystemAccessAdapter } from "../filesystem/FileSystemAccessAdapter";
import { JsonFileStore } from "../filesystem/JsonFileStore";
import { MarkdownFileStore } from "../filesystem/MarkdownFileStore";
import { defaultHarborManifest, syntaxFileExtensions } from "../data/harborDefaults";
import { normalizeHarborCard, normalizeHarborManifest, normalizePier } from "../data/harborNormalizers";
import type { HarborCard, HarborCardSyntax, HarborManifest, Pier } from "../models/harbor";
import { nowIso } from "../utils/date";
import { createId, slugify } from "../utils/ids";

export type HarborLoadResult = {
  manifest: HarborManifest;
  piers: Pier[];
  cards: HarborCard[];
  issues: string[];
};

const HARBOR_ROOT = "harbor";
const PIERS_DIR = `${HARBOR_ROOT}/piers`;
const CARDS_DIR = `${HARBOR_ROOT}/cards`;

export class HarborRepository {
  private readonly json: JsonFileStore;
  private readonly text: MarkdownFileStore;

  constructor(
    private readonly adapter: FileSystemAccessAdapter,
    private readonly root: DirectoryHandle,
  ) {
    this.json = new JsonFileStore(adapter, root);
    this.text = new MarkdownFileStore(adapter, root);
  }

  async ensureHarbor(): Promise<HarborManifest> {
    await this.adapter.ensureDirectory(this.root, HARBOR_ROOT);
    await this.adapter.ensureDirectory(this.root, PIERS_DIR);
    await this.adapter.ensureDirectory(this.root, CARDS_DIR);

    try {
      const raw = await this.json.read(`${HARBOR_ROOT}/harbor.json`);
      return normalizeHarborManifest(raw);
    } catch {
      const manifest = defaultHarborManifest();
      await this.json.write(`${HARBOR_ROOT}/harbor.json`, manifest);
      return manifest;
    }
  }

  async loadAll(): Promise<HarborLoadResult> {
    const issues: string[] = [];
    let manifest: HarborManifest;

    try {
      manifest = await this.ensureHarbor();
    } catch (error) {
      return {
        manifest: defaultHarborManifest(),
        piers: [],
        cards: [],
        issues: [error instanceof Error ? error.message : "Could not initialize harbor"],
      };
    }

    const piers = await this.loadPiers(issues);
    const cards: HarborCard[] = [];
    for (const pier of piers) {
      const pierCards = await this.loadCardsForPier(pier.id, issues);
      cards.push(...pierCards);
    }

    return { manifest, piers, cards, issues };
  }

  async touch(manifest: HarborManifest) {
    const updated = normalizeHarborManifest({ ...manifest, updatedAt: nowIso() });
    await this.json.write(`${HARBOR_ROOT}/harbor.json`, updated);
    return updated;
  }

  private async loadPiers(issues: string[]) {
    const piers: Pier[] = [];
    let dir: DirectoryHandle;
    try {
      dir = await this.adapter.getDirectory(this.root, PIERS_DIR, false);
    } catch {
      return piers;
    }

    for (const file of await this.adapter.listFiles(dir)) {
      if (!file.name.endsWith(".json")) continue;
      const path = `${PIERS_DIR}/${file.name}`;
      try {
        const raw = await this.json.read(path);
        const fallbackId = file.name.replace(/\.json$/i, "");
        piers.push(normalizePier(raw, fallbackId));
      } catch (error) {
        issues.push(error instanceof Error ? error.message : `Could not read ${path}`);
      }
    }
    return piers.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  }

  private async loadCardsForPier(pierId: string, issues: string[]) {
    const cards: HarborCard[] = [];
    const dirPath = `${CARDS_DIR}/${pierId}`;
    let dir: DirectoryHandle;
    try {
      dir = await this.adapter.getDirectory(this.root, dirPath, false);
    } catch {
      return cards;
    }

    for (const file of await this.adapter.listFiles(dir)) {
      if (!file.name.endsWith(".json")) continue;
      const path = `${dirPath}/${file.name}`;
      try {
        const raw = await this.json.read(path);
        const fallbackId = file.name.replace(/\.json$/i, "");
        cards.push(normalizeHarborCard(raw, fallbackId, pierId));
      } catch (error) {
        issues.push(error instanceof Error ? error.message : `Could not read ${path}`);
      }
    }
    return cards.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async savePier(pier: Pier) {
    await this.ensureHarbor();
    await this.adapter.ensureDirectory(this.root, `${CARDS_DIR}/${pier.id}`);
    const updated = normalizePier({ ...pier, updatedAt: nowIso() }, pier.id);
    await this.json.write(`${PIERS_DIR}/${pier.id}.json`, updated);
    return updated;
  }

  async createPier(name: string, description = "") {
    const timestamp = nowIso();
    const id = slugify(name) || createId("pier");
    const pier = normalizePier(
      {
        id,
        name: name.trim(),
        description: description.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      id,
      timestamp,
    );
    return this.savePier(pier);
  }

  async deletePier(pierId: string) {
    const cards = await this.loadCardsForPier(pierId, []);
    for (const card of cards) {
      await this.deleteCard(card);
    }
    try {
      await this.adapter.removeFile(this.root, `${PIERS_DIR}/${pierId}.json`);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "NotFoundError") throw error;
    }
  }

  async readCardContent(path: string) {
    return this.text.read(path);
  }

  async saveCard(card: HarborCard, content: string) {
    await this.ensureHarbor();
    const timestamp = nowIso();
    const pierId = card.pierId;
    await this.adapter.ensureDirectory(this.root, `${CARDS_DIR}/${pierId}`);

    const base = slugify(card.title) || card.id;
    const ext = syntaxFileExtensions[card.syntax];
    const contentPath = card.contentPath?.trim()
      ? card.contentPath
      : `${CARDS_DIR}/${pierId}/${base}.${ext}`;

    const normalized = normalizeHarborCard(
      {
        ...card,
        contentPath,
        updatedAt: timestamp,
        createdAt: card.createdAt || timestamp,
      },
      card.id,
      pierId,
      timestamp,
    );

    await this.text.write(contentPath, content);
    await this.json.write(`${CARDS_DIR}/${pierId}/${normalized.id}.json`, normalized);
    return normalized;
  }

  async createCard(pierId: string, partial: Pick<HarborCard, "title" | "description" | "syntax">, content: string) {
    const timestamp = nowIso();
    const id = createId("card");
    const card = normalizeHarborCard(
      {
        id,
        pierId,
        title: partial.title.trim(),
        description: partial.description?.trim() ?? "",
        syntax: partial.syntax,
        contentPath: "",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      id,
      pierId,
      timestamp,
    );
    return this.saveCard(card, content);
  }

  async deleteCard(card: HarborCard) {
    try {
      await this.adapter.removeFile(this.root, `${CARDS_DIR}/${card.pierId}/${card.id}.json`);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "NotFoundError") throw error;
    }
    if (card.contentPath) {
      try {
        await this.adapter.removeFile(this.root, card.contentPath);
      } catch (error) {
        if (!(error instanceof DOMException) || error.name !== "NotFoundError") throw error;
      }
    }
  }

  async markCardUsed(card: HarborCard) {
    const updated = normalizeHarborCard({ ...card, lastUsedAt: nowIso() }, card.id, card.pierId);
    await this.json.write(`${CARDS_DIR}/${card.pierId}/${updated.id}.json`, updated);
    return updated;
  }

  highlightLanguageForSyntax(syntax: HarborCardSyntax): string {
    if (syntax === "markdown") return "markdown";
    if (syntax === "javascript") return "javascript";
    if (syntax === "typescript") return "typescript";
    if (syntax === "bash") return "bash";
    if (syntax === "http") return "http";
    if (syntax === "yaml") return "yaml";
    if (syntax === "xml") return "xml";
    if (syntax === "json") return "json";
    if (syntax === "sql") return "sql";
    if (syntax === "java") return "java";
    return "plaintext";
  }
}
