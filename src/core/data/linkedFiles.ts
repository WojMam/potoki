import type { LinkedFile } from "../models/fileLink";
import type { TimelineEntry } from "../models/timeline";
import type { Workstream } from "../models/workstream";

export function isMarkdownLinkedFile(file: LinkedFile): boolean {
  return file.type === "markdown" || file.path.toLowerCase().endsWith(".md");
}

export function countLinkedFileReferences(
  path: string,
  streams: Workstream[],
  entries: TimelineEntry[],
): number {
  let count = 0;
  for (const stream of streams) {
    for (const file of stream.linkedFiles) {
      if (file.path === path) count += 1;
    }
  }
  for (const entry of entries) {
    for (const file of entry.linkedFiles) {
      if (file.path === path) count += 1;
    }
  }
  return count;
}

export function entryWithoutLinkedFile(entry: TimelineEntry, path: string): TimelineEntry {
  return {
    ...entry,
    linkedFiles: entry.linkedFiles.filter((file) => file.path !== path),
  };
}
