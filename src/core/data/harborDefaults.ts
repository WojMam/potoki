import type { HarborCard, HarborCardSyntax, HarborManifest, Pier } from "../models/harbor";
import { nowIso } from "../utils/date";

export const harborSchemaVersion = 1;

export const defaultHarborManifest = (timestamp = nowIso()): HarborManifest => ({
  schemaVersion: harborSchemaVersion,
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const defaultPier = (timestamp = nowIso(), id = "general"): Pier => ({
  id,
  name: "General",
  description: "",
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const defaultHarborCard = (
  pierId: string,
  timestamp = nowIso(),
  id = "card",
): HarborCard => ({
  id,
  pierId,
  title: "Untitled card",
  description: "",
  syntax: "plain",
  contentPath: "",
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const syntaxFileExtensions: Record<HarborCardSyntax, string> = {
  plain: "txt",
  markdown: "md",
  sql: "sql",
  java: "java",
  javascript: "js",
  typescript: "ts",
  json: "json",
  xml: "xml",
  yaml: "yaml",
  bash: "sh",
  http: "http",
};
