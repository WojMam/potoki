import type { LinkedFile } from "./fileLink";

export const workstreamStatuses = ["active", "paused", "waiting", "done", "archived"] as const;
export type WorkstreamStatus = (typeof workstreamStatuses)[number];

export const workstreamPriorities = ["low", "medium", "high"] as const;
export type WorkstreamPriority = (typeof workstreamPriorities)[number];

export type Workstream = {
  id: string;
  title: string;
  description: string;
  status: WorkstreamStatus;
  priority: WorkstreamPriority;
  tags: string[];
  currentContext: string;
  nextActions: string[];
  linkedFiles: LinkedFile[];
  createdAt: string;
  updatedAt: string;
};
