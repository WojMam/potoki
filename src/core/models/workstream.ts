import type { LinkedFile } from "./fileLink";

export const workstreamStatuses = ["active", "parked", "archived"] as const;
export type WorkstreamStatus = (typeof workstreamStatuses)[number];

export type Workstream = {
  id: string;
  title: string;
  description: string;
  status: WorkstreamStatus;
  currentContext: string;
  nextActions: string[];
  linkedFiles: LinkedFile[];
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};
