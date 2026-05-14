import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

function makeStaticBuildFileFriendly() {
  return {
    name: "potoki-file-friendly-static-build",
    apply: "build" as const,
    closeBundle() {
      const indexPath = resolve(rootDir, "dist", "index.html");
      let html = readFileSync(indexPath, "utf-8");

      html = html.replace(/<link rel="stylesheet" crossorigin href="(\.\/assets\/[^"]+\.css)">/, '<link rel="stylesheet" href="$1">');

      let scriptTag = "";
      html = html.replace(
        /<script type="module" crossorigin src="\.\/assets\/([^"]+\.js)"><\/script>/,
        (_match: string, fileName: string) => {
          scriptTag = `<script defer src="./assets/${fileName}"></script>`;
          return "";
        },
      );

      if (scriptTag) {
        html = html.replace("</body>", `    ${scriptTag}\n  </body>`);
      }

      writeFileSync(indexPath, html);
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), makeStaticBuildFileFriendly()],
});
