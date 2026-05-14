import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

function escapeInlineScript(source: string) {
  return source.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
}

function makeStaticBuildFileFriendly() {
  return {
    name: "potoki-single-file-static-build",
    apply: "build" as const,
    closeBundle() {
      const distPath = resolve(rootDir, "dist");
      const assetsPath = resolve(distPath, "assets");
      const indexPath = resolve(distPath, "index.html");
      let html = readFileSync(indexPath, "utf-8");

      html = html.replace(
        /<link rel="stylesheet"(?:\s+crossorigin)?\s+href="\.\/assets\/([^"]+\.css)">/g,
        (_match: string, fileName: string) => {
          const css = readFileSync(resolve(assetsPath, fileName), "utf-8");
          return `<style>\n${css}\n</style>`;
        },
      );

      const inlineScripts: string[] = [];

      html = html.replace(
        /<script type="module"(?:\s+crossorigin)?\s+src="\.\/assets\/([^"]+\.js)"><\/script>/g,
        (_match: string, fileName: string) => {
          const js = readFileSync(resolve(assetsPath, fileName), "utf-8");
          inlineScripts.push(`<script>\n${escapeInlineScript(js)}\n</script>`);
          return "";
        },
      );

      if (inlineScripts.length > 0) {
        html = html.replace("</body>", () => `    ${inlineScripts.join("\n")}\n  </body>`);
      }

      writeFileSync(indexPath, html);
      rmSync(assetsPath, { force: true, recursive: true });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), makeStaticBuildFileFriendly()],
  build: {
    assetsInlineLimit: 100_000_000,
    modulePreload: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
