import type { HarborCardSyntax } from "../models/harbor";

export function harborSyntaxLabelKey(syntax: HarborCardSyntax) {
  return `harbor.syntax.${syntax}` as const;
}
