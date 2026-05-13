export type DirectoryHandle = FileSystemDirectoryHandle;

export class FileSystemAccessAdapter {
  static isSupported() {
    return typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
  }

  async openWorkspaceFolder() {
    if (!window.showDirectoryPicker) throw new Error("File System Access API is unavailable.");
    return window.showDirectoryPicker({ id: "potoki-workspace", mode: "readwrite" });
  }

  async chooseLocalFile() {
    if (!window.showOpenFilePicker) throw new Error("File picker is unavailable.");
    const [file] = await window.showOpenFilePicker({ multiple: false });
    return file;
  }

  async getDirectory(root: DirectoryHandle, path: string, create = false) {
    const parts = path.split("/").filter(Boolean);
    let current = root;
    for (const part of parts) current = await current.getDirectoryHandle(part, { create });
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
