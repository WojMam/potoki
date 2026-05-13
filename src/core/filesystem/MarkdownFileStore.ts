import type { DirectoryHandle, FileSystemAccessAdapter } from "./FileSystemAccessAdapter";

export class MarkdownFileStore {
  constructor(
    private readonly adapter: FileSystemAccessAdapter,
    private readonly root: DirectoryHandle,
  ) {}

  read(path: string) {
    return this.adapter.readText(this.root, path);
  }

  write(path: string, markdown: string) {
    return this.adapter.writeText(this.root, path, markdown.endsWith("\n") ? markdown : `${markdown}\n`);
  }
}
