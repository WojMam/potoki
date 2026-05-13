import type { DirectoryHandle, FileSystemAccessAdapter } from "./FileSystemAccessAdapter";

export class JsonFileStore {
  constructor(
    private readonly adapter: FileSystemAccessAdapter,
    private readonly root: DirectoryHandle,
  ) {}

  async read(path: string) {
    const text = await this.adapter.readText(this.root, path);
    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new Error(`Malformed JSON in ${path}`);
    }
  }

  async write(path: string, data: unknown) {
    await this.adapter.writeText(this.root, path, `${JSON.stringify(data, null, 2)}\n`);
  }
}
