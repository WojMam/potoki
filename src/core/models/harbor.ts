export const harborCardSyntaxes = [
  "plain",
  "markdown",
  "sql",
  "java",
  "javascript",
  "typescript",
  "json",
  "xml",
  "yaml",
  "bash",
  "http",
] as const;

export type HarborCardSyntax = (typeof harborCardSyntaxes)[number];

export type HarborManifest = {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

export type Pier = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

export type HarborCard = {
  id: string;
  pierId: string;
  title: string;
  description?: string;
  syntax: HarborCardSyntax;
  contentPath: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  [key: string]: unknown;
};
