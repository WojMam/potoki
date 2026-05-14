export type WorkspaceManifest = {
  schemaVersion: number;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  directories: {
    streams: string;
    timeline: string;
    notes: string;
    artifacts: string;
  };
  [key: string]: unknown;
};
