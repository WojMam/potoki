export type DirectoryHandle = FileSystemDirectoryHandle;

export class FileSystemAccessAdapter {
  private readonly dirCache = new Map<string, DirectoryHandle>();

  static isSupported() {
    return typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
  }

  clearCache() {
    this.dirCache.clear();
  }

  async openWorkspaceFolder() {
    if (!window.showDirectoryPicker) throw new Error("File System Access API is unavailable.");
    this.clearCache();
    return window.showDirectoryPicker({ id: "potoki-workspace", mode: "readwrite" });
  }

  async chooseLocalFile() {
    if (!window.showOpenFilePicker) throw new Error("File picker is unavailable.");
    const [file] = await window.showOpenFilePicker({ multiple: false });
    return file;
  }

  async getDirectory(root: DirectoryHandle, path: string, create = false) {
    const normalized = path.split("/").filter(Boolean).join("/");
    if (!normalized) return root;

    const cached = this.dirCache.get(normalized);
    if (cached) return cached;

    const parts = normalized.split("/");
    let current = root;
    let built = "";

    for (const part of parts) {
      built = built ? `${built}/${part}` : part;
      const hit = this.dirCache.get(built);
      if (hit) {
        current = hit;
        continue;
      }
      current = await current.getDirectoryHandle(part, { create });
      this.dirCache.set(built, current);
    }

    return current;
  }

  async ensureDirectory(root: DirectoryHandle, path: string) {
    return this.getDirectory(root, path, true);
  }

  async listFiles(directory: DirectoryHandle) {
    const files: FileSystemFileHandle[] = [];
    for await (const [, handle] of directory.entries()) {
      if (handle.kind === "file") files.push(handle as FileSystemFileHandle);
    }
    return files;
  }

  async readText(root: DirectoryHandle, path: string) {
    const { dir, name } = await this.resolveParent(root, path, false);
    const handle = await dir.getFileHandle(name);
    return (await handle.getFile()).text();
  }

  async writeText(root: DirectoryHandle, path: string, content: string) {
    const { dir, name } = await this.resolveParent(root, path, true);
    const handle = await dir.getFileHandle(name, { create: true });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  async removeFile(root: DirectoryHandle, path: string) {
    const { dir, name } = await this.resolveParent(root, path, false);
    await dir.removeEntry(name);
    const parentPath = path.split("/").filter(Boolean).slice(0, -1).join("/");
    if (parentPath) this.dirCache.delete(path);
  }

  async exists(root: DirectoryHandle, path: string) {
    try {
      const { dir, name } = await this.resolveParent(root, path, false);
      await dir.getFileHandle(name);
      return true;
    } catch {
      return false;
    }
  }

  async relativePathForFile(root: DirectoryHandle, file: FileSystemFileHandle) {
    const relative = await root.resolve(file);
    return relative?.join("/") ?? file.name;
  }

  private async resolveParent(root: DirectoryHandle, path: string, create: boolean) {
    const parts = path.split("/").filter(Boolean);
    const name = parts.pop();
    if (!name) throw new Error("A file path is required.");
    const dir = parts.length ? await this.getDirectory(root, parts.join("/"), create) : root;
    return { dir, name };
  }
}
