import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";

/** Nested map: directory name -> file content (string) or subdirectory */
export type VirtualFsTree = Record<string, string | VirtualFsTree>;

const FIXTURES_ROOT = join(process.cwd(), "tests", "fixtures", "workspaces");

function readTreeFromDisk(dir: string, base = dir): VirtualFsTree {
  const tree: VirtualFsTree = {};
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      tree[entry] = readTreeFromDisk(fullPath, base);
    } else {
      tree[entry] = readFileSync(fullPath, "utf-8");
    }
  }
  return tree;
}

export function loadWorkspaceFixture(name: string): VirtualFsTree {
  return readTreeFromDisk(join(FIXTURES_ROOT, name));
}

export function emptyWorkspaceTree(): VirtualFsTree {
  return {};
}

/**
 * Injects an in-memory File System Access API before the app loads.
 * Pass a fixture tree for "open existing workspace", or {} for an empty writable folder.
 */
export async function installFileSystemMock(page: Page, tree: VirtualFsTree = {}) {
  await page.addInitScript((serializedTree) => {
    const root = JSON.parse(serializedTree) as Record<string, unknown>;

    type DirNode = Record<string, string | DirNode>;

    function isDirNode(value: unknown): value is DirNode {
      return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    function cloneTree(node: DirNode): DirNode {
      const copy: DirNode = {};
      for (const [key, value] of Object.entries(node)) {
        copy[key] = typeof value === "string" ? value : cloneTree(value);
      }
      return copy;
    }

    const store = cloneTree(root as DirNode);

    function splitPath(path: string) {
      return path.split("/").filter(Boolean);
    }

    function getDir(node: DirNode, parts: string[], create: boolean): DirNode {
      let current = node;
      for (const part of parts) {
        const next = current[part];
        if (!isDirNode(next)) {
          if (!create) throw new DOMException("NotFoundError");
          current[part] = {};
        } else if (typeof next === "string") {
          throw new DOMException("InvalidStateError");
        }
        current = current[part] as DirNode;
      }
      return current;
    }

    function getFile(node: DirNode, parts: string[], create: boolean): { dir: DirNode; name: string } {
      const segments = [...parts];
      const name = segments.pop();
      if (!name) throw new DOMException("NotFoundError");
      const dir = getDir(node, segments, create);
      return { dir, name };
    }

    function makeFileHandle(dir: DirNode, name: string): FileSystemFileHandle {
      return {
        kind: "file",
        name,
        async getFile() {
          const value = dir[name];
          if (typeof value !== "string") throw new DOMException("NotFoundError");
          return new File([value], name, { type: "text/plain" });
        },
        async createWritable() {
          const chunks: string[] = [];
          return {
            write(data: string | Blob) {
              if (typeof data === "string") chunks.push(data);
              else chunks.push("");
              return Promise.resolve();
            },
            async close() {
              dir[name] = chunks.join("");
            },
          };
        },
        async isSameEntry() {
          return false;
        },
      } as FileSystemFileHandle;
    }

    function makeDirHandle(node: DirNode, name: string): FileSystemDirectoryHandle {
      const handle = {
        kind: "directory",
        name,
        async getDirectoryHandle(child: string, options?: { create?: boolean }) {
          const create = Boolean(options?.create);
          const existing = node[child];
          if (isDirNode(existing)) {
            return makeDirHandle(existing, child);
          }
          if (typeof existing === "string") throw new DOMException("InvalidStateError");
          if (!create) throw new DOMException("NotFoundError");
          node[child] = {};
          return makeDirHandle(node[child] as DirNode, child);
        },
        async getFileHandle(child: string, options?: { create?: boolean }) {
          const create = Boolean(options?.create);
          const existing = node[child];
          if (typeof existing === "string") return makeFileHandle(node, child);
          if (isDirNode(existing)) throw new DOMException("InvalidStateError");
          if (!create) throw new DOMException("NotFoundError");
          node[child] = "";
          return makeFileHandle(node, child);
        },
        async removeEntry(child: string) {
          if (!(child in node)) throw new DOMException("NotFoundError");
          delete node[child];
        },
        async *entries(): AsyncIterableIterator<[string, FileSystemHandle]> {
          for (const [key, value] of Object.entries(node)) {
            if (typeof value === "string") {
              yield [key, makeFileHandle(node, key)];
            } else {
              yield [key, makeDirHandle(value, key)];
            }
          }
        },
        async *keys() {
          for (const key of Object.keys(node)) yield key;
        },
        async *values() {
          for (const [key, value] of Object.entries(node)) {
            if (typeof value === "string") yield makeFileHandle(node, key);
            else yield makeDirHandle(value, key);
          }
        },
        async resolve(target: FileSystemFileHandle) {
          const targetName = target.name;
          const path: string[] = [];
          function walk(current: DirNode, prefix: string[]): string[] | null {
            for (const [key, value] of Object.entries(current)) {
              if (typeof value === "string" && key === targetName) {
                return [...prefix, key];
              }
              if (isDirNode(value)) {
                const hit = walk(value, [...prefix, key]);
                if (hit) return hit;
              }
            }
            return null;
          }
          return walk(store, []);
        },
        async isSameEntry() {
          return false;
        },
      } as FileSystemDirectoryHandle;
      return handle;
    }

    const rootHandle = makeDirHandle(store, "workspace");

    window.showDirectoryPicker = async () => rootHandle;

    window.showOpenFilePicker = async () => {
      throw new DOMException("AbortError");
    };

    (window as Window & { __POTOKI_E2E__?: boolean }).__POTOKI_E2E__ = true;
  }, JSON.stringify(tree));
}
