declare module "node:fs" {
  export function readFileSync(path: string, encoding: string): string;
  export function rmSync(path: string, options?: { force?: boolean; recursive?: boolean }): void;
  export function writeFileSync(path: string, data: string): void;
}

declare module "node:path" {
  export function dirname(path: string): string;
  export function resolve(...paths: string[]): string;
}

declare module "node:url" {
  export function fileURLToPath(url: string): string;
}
