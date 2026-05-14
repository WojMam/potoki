import type { LinkedFile } from "./fileLink";

export const timelineEntryTypes = [
  "note",
  "decision",
  "action_done",
  "waiting",
  "work_log",
  "file_link",
] as const;

export type TimelineEntryType = (typeof timelineEntryTypes)[number];

export type TimelineEntry = {
  id: string;
  streamId: string;
  type: TimelineEntryType;
  title: string;
  content: string;
  createdAt: string;
  linkedFiles: LinkedFile[];
  [key: string]: unknown;
};

export type TimelineFile = {
  streamId: string;
  entries: TimelineEntry[];
  [key: string]: unknown;
};
