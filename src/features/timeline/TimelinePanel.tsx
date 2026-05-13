import { FileText, PlusCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import type { TimelineEntry, TimelineEntryType } from "../../core/models/timeline";
import { timelineEntryTypes } from "../../core/models/timeline";
import type { Workstream } from "../../core/models/workstream";
import { formatDate, formatDateTime } from "../../core/utils/date";

const entryHints: Record<TimelineEntryType, string> = {
  note: "What changed, what should be remembered?",
  decision: "Decision, reason, impact...",
  action_done: "What did you check or complete?",
  waiting: "What are you waiting for, from whom, and what should be checked next?",
  work_log: "What did you work on, and what was the outcome?",
  file_link: "What file was linked and why?",
};

const typeAccent: Record<TimelineEntryType, string> = {
  note: "border-l-sky-300/35",
  decision: "border-l-teal-200/55 bg-teal-300/[0.025]",
  action_done: "border-l-emerald-300/40",
  waiting: "border-l-amber-200/35 opacity-90",
  work_log: "border-l-cyan-200/30 bg-white/[0.025]",
  file_link: "border-l-violet-200/35",
};

export function TimelinePanel({
  stream,
  entries,
  notePreview,
  selectedNotePath,
  draft,
  setDraft,
  onAddEntry,
  onPreviewNote,
}: {
  stream: Workstream;
  entries: TimelineEntry[];
  notePreview?: string;
  selectedNotePath?: string;
  draft: { type: TimelineEntryType; title: string; content: string };
  setDraft: (draft: { type: TimelineEntryType; title: string; content: string }) => void;
  onAddEntry: () => void;
  onPreviewNote: (path: string) => void;
}) {
  const grouped = entries.reduce<Record<string, TimelineEntry[]>>((acc, entry) => {
    const key = entry.createdAt.slice(0, 10);
    acc[key] = [...(acc[key] ?? []), entry];
    return acc;
  }, {});

  return (
    <main className="min-h-screen flex-1 overflow-auto bg-gradient-to-b from-white/[0.022] to-transparent">
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{stream.status}</Badge>
            <Badge>{stream.priority}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">{stream.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{stream.description}</p>
        </div>

        <Card className="mb-8 rounded-lg p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium">Quick timeline entry</h2>
              <p className="mt-1 text-xs text-muted-foreground">Capture context while it is still warm.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <Select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as TimelineEntryType })}>
              {timelineEntryTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </Select>
            <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Entry title" />
          </div>
          <Textarea className="mt-4 min-h-32" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder={entryHints[draft.type]} />
          <div className="mt-4 flex justify-end">
            <Button onClick={onAddEntry}>
              <PlusCircle className="h-4 w-4" />
              Add timeline entry
            </Button>
          </div>
        </Card>

        {selectedNotePath && notePreview !== undefined ? (
          <Card className="mb-8 rounded-lg p-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {selectedNotePath}
            </div>
            <div className="prose-threadbase">
              <ReactMarkdown>{notePreview}</ReactMarkdown>
            </div>
          </Card>
        ) : null}

        <div className="space-y-8">
          {Object.entries(grouped).map(([date, dateEntries]) => (
            <section key={date}>
              <div className="sticky top-0 z-10 mb-4 flex items-center gap-4 bg-background/88 py-2 backdrop-blur">
                <div className="h-px flex-1 bg-white/[0.055]" />
                <div className="rounded-full border border-white/[0.06] bg-background/95 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(date)}
                </div>
                <div className="h-px flex-1 bg-white/[0.055]" />
              </div>
              <div className="space-y-4">
                {dateEntries.map((entry) => (
                  <article key={entry.id} className={`rounded-lg border border-white/[0.055] border-l-2 p-6 transition hover:bg-white/[0.045] ${typeAccent[entry.type]}`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Badge>{entry.type.replace("_", " ")}</Badge>
                        <h2 className="text-sm font-medium text-foreground">{entry.title}</h2>
                      </div>
                      <time className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</time>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-muted-foreground">{entry.content}</p>
                    {entry.linkedFiles.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.linkedFiles.map((file) => (
                          <Button key={file.path} size="sm" variant="ghost" className="border border-white/10 bg-white/[0.03]" onClick={() => file.path.endsWith(".md") && onPreviewNote(file.path)}>
                            <FileText className="h-3.5 w-3.5" />
                            {file.label}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ))}
          {!entries.length ? <Card className="p-6 text-sm text-muted-foreground">No timeline entries yet. Add a note, decision, work log, or file link to begin the stream memory.</Card> : null}
        </div>
      </div>
    </main>
  );
}
