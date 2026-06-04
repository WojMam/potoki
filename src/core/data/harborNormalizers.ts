import { harborCardSyntaxes, type HarborCard, type HarborCardSyntax, type HarborManifest, type Pier } from "../models/harbor";
import { defaultHarborCard, defaultHarborManifest, defaultPier, harborSchemaVersion } from "./harborDefaults";
import { isRecord } from "./normalizers";
import { nowIso } from "../utils/date";

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function nonEmptyStringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function dateOr(value: unknown, fallback: string) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return fallback;
  return value;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function normalizeHarborCardSyntax(value: unknown): HarborCardSyntax {
  if (typeof value === "string" && harborCardSyntaxes.includes(value as HarborCardSyntax)) {
    return value as HarborCardSyntax;
  }
  return "plain";
}

export function normalizeHarborManifest(raw: unknown, timestamp = nowIso()): HarborManifest {
  const source = isRecord(raw) ? raw : {};
  const defaults = defaultHarborManifest(timestamp);
  return {
    ...source,
    schemaVersion: harborSchemaVersion,
    createdAt: dateOr(source.createdAt, defaults.createdAt),
    updatedAt: dateOr(source.updatedAt, dateOr(source.createdAt, defaults.updatedAt)),
  };
}

export function normalizePier(raw: unknown, fallbackId = "pier", timestamp = nowIso()): Pier {
  const source = isRecord(raw) ? raw : {};
  const defaults = defaultPier(timestamp, fallbackId);
  const id = nonEmptyStringOr(source.id, fallbackId);
  return {
    ...source,
    id,
    name: nonEmptyStringOr(source.name, defaults.name),
    description: optionalString(source.description) ?? "",
    createdAt: dateOr(source.createdAt, defaults.createdAt),
    updatedAt: dateOr(source.updatedAt, dateOr(source.createdAt, defaults.updatedAt)),
  };
}

export function normalizeHarborCard(raw: unknown, fallbackId = "card", pierId = "general", timestamp = nowIso()): HarborCard {
  const source = isRecord(raw) ? raw : {};
  const defaults = defaultHarborCard(pierId, timestamp, fallbackId);
  const id = nonEmptyStringOr(source.id, fallbackId);
  const resolvedPierId = nonEmptyStringOr(source.pierId, pierId);
  return {
    ...source,
    id,
    pierId: resolvedPierId,
    title: nonEmptyStringOr(source.title, defaults.title),
    description: optionalString(source.description) ?? "",
    syntax: normalizeHarborCardSyntax(source.syntax),
    contentPath: stringOr(source.contentPath, defaults.contentPath),
    createdAt: dateOr(source.createdAt, defaults.createdAt),
    updatedAt: dateOr(source.updatedAt, dateOr(source.createdAt, defaults.updatedAt)),
    lastUsedAt: optionalString(source.lastUsedAt),
  };
}
