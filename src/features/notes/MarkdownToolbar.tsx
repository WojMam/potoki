import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  type LucideIcon,
} from "lucide-react";
import { type RefObject } from "react";
import { cn } from "../../components/ui/utils";
import { useI18n, type TranslationKey } from "../../core/i18n";

type MarkdownToolbarProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

type EditResult = {
  text: string;
  selectionStart: number;
  selectionEnd: number;
};

type ToolbarAction = {
  key: TranslationKey;
  icon: LucideIcon;
  run: (textarea: HTMLTextAreaElement, value: string) => EditResult;
};

type ToolbarGroup = {
  label: string;
  actions: ToolbarAction[];
};

export function MarkdownToolbar({ textareaRef, value, onChange, className }: MarkdownToolbarProps) {
  const { t } = useI18n();
  const textPlaceholder = t("markdown.placeholderText");
  const altPlaceholder = t("markdown.placeholderAlt");

  const groups: ToolbarGroup[] = [
    {
      label: "Text",
      actions: [
      { key: "markdown.bold", icon: Bold, run: (textarea, text) => wrapSelection(textarea, text, "**", "**", textPlaceholder) },
      { key: "markdown.italic", icon: Italic, run: (textarea, text) => wrapSelection(textarea, text, "*", "*", textPlaceholder) },
      { key: "markdown.inlineCode", icon: Code, run: (textarea, text) => wrapSelection(textarea, text, "`", "`", textPlaceholder) },
      { key: "markdown.strikethrough", icon: Strikethrough, run: (textarea, text) => wrapSelection(textarea, text, "~~", "~~", textPlaceholder) },
      ],
    },
    {
      label: "Headings",
      actions: [
      { key: "markdown.heading1", icon: Heading1, run: (textarea, text) => prefixSelectedLines(textarea, text, "# ", /^#\s+/) },
      { key: "markdown.heading2", icon: Heading2, run: (textarea, text) => prefixSelectedLines(textarea, text, "## ", /^##\s+/) },
      { key: "markdown.heading3", icon: Heading3, run: (textarea, text) => prefixSelectedLines(textarea, text, "### ", /^###\s+/) },
      ],
    },
    {
      label: "Lists",
      actions: [
      { key: "markdown.bulletedList", icon: List, run: (textarea, text) => prefixSelectedLines(textarea, text, "- ", /^-\s+/) },
      { key: "markdown.numberedList", icon: ListOrdered, run: (textarea, text) => prefixOrderedLines(textarea, text) },
      { key: "markdown.taskList", icon: ListChecks, run: (textarea, text) => prefixSelectedLines(textarea, text, "- [ ] ", /^-\s+\[[ xX]\]\s+/) },
      { key: "markdown.quote", icon: Quote, run: (textarea, text) => prefixSelectedLines(textarea, text, "> ", /^>\s+/) },
      ],
    },
    {
      label: "Insert",
      actions: [
      { key: "markdown.codeBlock", icon: Code2, run: (textarea, text) => codeBlock(textarea, text) },
      { key: "markdown.link", icon: Link, run: (textarea, text) => wrapSelection(textarea, text, "[", "](url)", textPlaceholder) },
      { key: "markdown.image", icon: Image, run: (textarea, text) => wrapSelection(textarea, text, "![", "](url)", altPlaceholder) },
      { key: "markdown.divider", icon: Minus, run: (textarea, text) => insertDivider(textarea, text) },
      ],
    },
  ];

  const applyAction = (action: ToolbarAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const result = action.run(textarea, value);
    onChange(result.text);

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-x-2 gap-y-1.5 rounded-t-xl border border-white/[0.04] border-b-white/[0.055] bg-[linear-gradient(180deg,hsl(218_20%_13.8%/0.92),hsl(218_20%_12.4%/0.92))] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",
        className,
      )}
      aria-label={t("markdown.toolbar")}
    >
      {groups.map((group, groupIndex) => (
        <div
          key={group.label}
          className={cn(
            "flex shrink-0 flex-nowrap items-center gap-1 rounded-lg px-0.5",
            groupIndex > 0 && "ml-0.5",
          )}
          aria-label={group.label}
        >
          {group.actions.map((action) => (
            <ToolbarButton
              key={action.key}
              label={t(action.key)}
              icon={action.icon}
              onClick={() => applyAction(action)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ToolbarButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent bg-white/[0.012] text-muted-foreground/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] transition-[background-color,border-color,color,transform] duration-200 ease-out hover:border-primary/18 hover:bg-primary/[0.075] hover:text-foreground active:bg-primary/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
      aria-label={label}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

function wrapSelection(textarea: HTMLTextAreaElement, text: string, before: string, after: string, placeholder: string): EditResult {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = text.slice(start, end) || placeholder;
  const insertion = `${before}${selected}${after}`;
  const next = replaceRange(text, start, end, insertion);
  const innerStart = start + before.length;
  const innerEnd = innerStart + selected.length;

  return {
    text: next,
    selectionStart: innerStart,
    selectionEnd: innerEnd,
  };
}

function codeBlock(textarea: HTMLTextAreaElement, text: string): EditResult {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = text.slice(start, end);
  const content = selected || "\n";
  const insertion = `\`\`\`\n${content}\n\`\`\``;
  const next = replaceRange(text, start, end, insertion);
  const cursorStart = start + 4;
  const cursorEnd = cursorStart + content.length;

  return {
    text: next,
    selectionStart: cursorStart,
    selectionEnd: cursorEnd,
  };
}

function insertDivider(textarea: HTMLTextAreaElement, text: string): EditResult {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = start > 0 && text[start - 1] !== "\n" ? "\n" : "";
  const after = end < text.length && text[end] !== "\n" ? "\n" : "";
  const insertion = `${before}---${after}`;
  const next = replaceRange(text, start, end, insertion);
  const cursor = start + insertion.length;

  return {
    text: next,
    selectionStart: cursor,
    selectionEnd: cursor,
  };
}

function prefixOrderedLines(textarea: HTMLTextAreaElement, text: string): EditResult {
  return transformSelectedLines(textarea, text, (lines) => {
    const meaningfulLines = lines.filter((line) => line.trim().length > 0);
    const allPrefixed = meaningfulLines.length > 0 && meaningfulLines.every((line) => /^\d+\.\s+/.test(line));
    let index = 1;

    return lines.map((line) => {
      if (!line.trim()) return line;
      if (allPrefixed) return line.replace(/^\d+\.\s+/, "");
      return `${index++}. ${line.replace(/^\d+\.\s+/, "")}`;
    });
  });
}

function prefixSelectedLines(textarea: HTMLTextAreaElement, text: string, prefix: string, prefixPattern: RegExp): EditResult {
  return transformSelectedLines(textarea, text, (lines) => {
    const meaningfulLines = lines.filter((line) => line.trim().length > 0);
    const allPrefixed = meaningfulLines.length > 0 && meaningfulLines.every((line) => prefixPattern.test(line));

    return lines.map((line) => {
      if (!line.trim()) return line;
      return allPrefixed ? line.replace(prefixPattern, "") : `${prefix}${line.replace(prefixPattern, "")}`;
    });
  });
}

function transformSelectedLines(
  textarea: HTMLTextAreaElement,
  text: string,
  transform: (lines: string[]) => string[],
): EditResult {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const lineStart = text.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const lineEndIndex = text.indexOf("\n", end);
  const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
  const selectedLines = text.slice(lineStart, lineEnd).split("\n");
  const replacement = transform(selectedLines).join("\n");
  const next = replaceRange(text, lineStart, lineEnd, replacement);
  const delta = replacement.length - (lineEnd - lineStart);

  return {
    text: next,
    selectionStart: lineStart,
    selectionEnd: Math.max(lineStart, end + delta),
  };
}

function replaceRange(text: string, start: number, end: number, replacement: string) {
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}
