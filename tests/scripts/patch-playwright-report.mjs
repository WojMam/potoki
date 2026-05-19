/**
 * Playwright HTML report uses `color-scheme: dark light`, which breaks contrast
 * when the OS prefers dark mode (dark text on dark rows). Force a readable light theme
 * for hosted reports on GitHub Pages and local `test:e2e:report`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reportDir = process.argv[2] ?? "playwright-report";
const indexPath = join(reportDir, "index.html");
const cssPath = join(reportDir, "potoki-report-host-fixes.css");

let html = readFileSync(indexPath, "utf-8");

html = html.replace(
  /<meta name=['"]color-scheme['"] content=['"][^'"]*['"]>/,
  '<meta name="color-scheme" content="light">',
);

html = html.replace(
  /<html[^>]*>/,
  '<html class="light-mode" style="scrollbar-gutter: stable both-edges; color-scheme: light;">',
);

if (!html.includes("potoki-report-host-fixes.css")) {
  html = html.replace("</head>", '  <link rel="stylesheet" href="./potoki-report-host-fixes.css">\n  </head>');
}

const css = `/* POTOKI: keep Playwright HTML report readable when hosted or in dark system theme */
html,
html.light-mode {
  color-scheme: light !important;
}

body {
  background: #f6f8fa !important;
  color: #24292f !important;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-canvas-default: #ffffff;
    --color-canvas-subtle: #f6f8fa;
    --color-fg-default: #24292f;
    --color-fg-muted: #57606a;
    --color-fg-subtle: #6e7781;
    --color-border-default: #d0d7de;
    --color-border-muted: #d8dee4;
    --color-neutral-muted: rgba(175, 184, 193, 0.2);
    --color-accent-fg: #0969da;
    --color-btn-text: #24292f;
    --color-btn-bg: #f6f8fa;
    --color-btn-border: rgba(27, 31, 36, 0.15);
    --color-btn-hover-bg: #f3f4f6;
    --color-btn-hover-border: rgba(27, 31, 36, 0.15);
    --color-btn-primary-text: #ffffff;
    --color-btn-primary-bg: #2da44e;
    --color-btn-primary-border: rgba(27, 31, 36, 0.15);
    --color-btn-primary-hover-bg: #2c974b;
    --color-btn-primary-hover-border: rgba(27, 31, 36, 0.15);
    --color-canvas-inset: #ffffff;
    --color-accent-emphasis: #0969da;
  }

  body {
    background: #f6f8fa !important;
    color: #24292f !important;
  }
}
`;

writeFileSync(indexPath, html);
writeFileSync(cssPath, css);
console.log(`Patched Playwright report in ${reportDir}`);
