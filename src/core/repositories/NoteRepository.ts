import type { DirectoryHandle, FileSystemAccessAdapter } from "../filesystem/FileSystemAccessAdapter";
import { MarkdownFileStore } from "../filesystem/MarkdownFileStore";
import { todayStamp } from "../utils/date";
import { slugify } from "../utils/ids";

export class NoteRepository {
  private readonly store: MarkdownFileStore;

  constructor(
    private readonly adapter: FileSystemAccessAdapter,
    private readonly root: DirectoryHandle,
    private readonly directory = "notes",
  ) {
    this.store = new MarkdownFileStore(adapter, root);
  }

  async create(streamId: string, title: string, markdown: string) {
    await this.adapter.ensureDirectory(this.root, `${this.directory}/${streamId}`);
    const base = `${todayStamp()}-${slugify(title)}.md`;
    let filename = base;
    let counter = 2;
    while (await this.adapter.exists(this.root, `${this.directory}/${streamId}/${filename}`)) {
      filename = base.replace(/\.md$/, `-${counter}.md`);
      counter += 1;
    }
    const path = `${this.directory}/${streamId}/${filename}`;
    await this.store.write(path, markdown);
    return path;
  }

  read(path: string) {
    return this.store.read(path);
  }

  write(path: string, markdown: string) {
    return this.store.write(path, markdown);
  }
}
