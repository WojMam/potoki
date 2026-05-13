import type { TimelineEntry } from "../../core/models/timeline";
import type { Workstream } from "../../core/models/workstream";

export function streamMatchesSearch(stream: Workstream, entries: TimelineEntry[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const haystack = [
    stream.title,
    stream.description,
    stream.currentContext,
    ...stream.nextActions,
    ...stream.linkedFiles.map((file) => `${file.label} ${file.path}`),
    ...entries
      .filter((entry) => entry.streamId === stream.id)
      .flatMap((entry) => [
        entry.title,
        entry.content,
        ...entry.linkedFiles.map((file) => `${file.label} ${file.path}`),
      ]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalized);
}
