import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import http from "highlight.js/lib/languages/http";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import type { HarborCardSyntax } from "../../core/models/harbor";

import "highlight.js/styles/github-dark.min.css";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("http", http);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

const syntaxToLanguage: Record<HarborCardSyntax, string> = {
  plain: "plaintext",
  markdown: "markdown",
  sql: "sql",
  java: "java",
  javascript: "javascript",
  typescript: "typescript",
  json: "json",
  xml: "xml",
  yaml: "yaml",
  bash: "bash",
  http: "http",
};

export function highlightHarborContent(content: string, syntax: HarborCardSyntax): string {
  const language = syntaxToLanguage[syntax] ?? "plaintext";
  if (language === "plaintext") {
    return escapeHtml(content);
  }
  try {
    return hljs.highlight(content, { language, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(content);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
