import ReactMarkdown from "react-markdown";
import { highlightHarborContent } from "./highlight";
import type { HarborCardSyntax } from "../../core/models/harbor";

export function HarborSyntaxPreview({ content, syntax }: { content: string; syntax: HarborCardSyntax }) {
  if (!content.trim()) {
    return <p className="text-sm leading-7 text-muted-foreground">—</p>;
  }

  if (syntax === "markdown") {
    return (
      <div className="prose-potoki">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  if (syntax === "plain") {
    return (
      <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-foreground/82">{content}</pre>
    );
  }

  const html = highlightHarborContent(content, syntax);
  return (
    <pre className="overflow-x-auto rounded-xl bg-black/25 p-4">
      <code className="hljs font-mono text-[13px] leading-6" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
