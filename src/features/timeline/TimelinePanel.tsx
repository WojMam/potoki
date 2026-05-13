import { ArrowLeft, FileText, NotebookPen, Pencil, PlusCircle } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import type { LinkedFile } from "../../core/models/fileLink";
import type { TimelineEntry, TimelineEntryType } from "../../core/models/timeline";
import { timelineEntryTypes } from "../../core/models/timeline";
import type { Workstream } from "../../core/models/workstream";
import { formatDate, formatDateTime } from "../../core/utils/date";

const entryHints: Record<TimelineEntryType, string> = {
  note: "What changed, what should be remembered?",
  decision: "Decision, reason, impact...",
  action_done: "What did you check or complete?",
  waiting: "What is parked, what does it depend on, and what should be checked next?",
  work_log: "What did you work on, and what was the outcome?",
  file_link: "What file was linked and why?",
};

const entryTypeLabels: Record<TimelineEntryType, string> = {
  note: "note",
  decision: "decision",
  action_done: "completed",
  waiting: "parked note",
  work_log: "work log",
  file_link: "file link",
};

const typeAccent: Record<TimelineEntryType, string> = {
  note: "border-l-sky-300/25",
  decision: "border-l-teal-200/40 bg-teal-300/[0.018]",
  action_done: "border-l-emerald-300/28",
  waiting: "border-l-amber-200/25 opacity-90",
  work_log: "border-l-cyan-200/25 bg-white/[0.018]",
  file_link: "border-l-violet-200/25",
};

export function TimelinePanel({
  stream,
  entries,
  draft,
  setDraft,
  onAddEntry,
  onPreviewFile,
  onAttachNote,
  onUpdateEntry,
  onBackToDashboard,
}: {
  stream: Workstream;
  entries: TimelineEntry[];
  draft: { type: TimelineEntryType; title: string; content: string };
  setDraft: (draft: { type: TimelineEntryType; title: string; content: string }) => void;
  onAddEntry: () => void;
  onPreviewFile: (file: LinkedFile) => void;
  onAttachNote: (entry: TimelineEntry) => void;
  onUpdateEntry: (entry: TimelineEntry) => void;
  onBackToDashboard: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryEdit, setEntryEdit] = useState({ title: "", content: "" });

  useEffect(() => {
    setEditingId(null);
  }, [stream.id]);

  const grouped = entries.reduce<Record<string, TimelineEntry[]>>((acc, entry) => {
    const key = entry.createdAt.slice(0, 10);
    acc[key] = [...(acc[key] ?? []), entry];
    return acc;
  }, {});

  const startEdit = (entry: TimelineEntry) => {
    setEditingId(entry.id);
    setEntryEdit({ title: entry.title, content: entry.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEntryEdit({ title: "", content: "" });
  };

  const saveEdit = (entry: TimelineEntry) => {
    if (!entryEdit.title.trim()) return;
    onUpdateEntry({
      ...entry,
      title: entryEdit.title.trim(),
      content: entryEdit.content.trim(),
    });
    cancelEdit();
  };

  const onEditKeyDown = (event: KeyboardEvent, entry: TimelineEntry) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      saveEdit(entry);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  };

  return (
    <main className="h-screen min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto max-w-3xl px-8 py-12 xl:max-w-[820px]">
        <div className="mb-10">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-muted-foreground transition duration-200 ease-out hover:bg-white/[0.028] hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{stream.status}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{stream.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">{stream.description}</p>
        </div>

        <section className="mb-10 rounded-2xl bg-white/[0.018] px-4 py-3 transition-colors duration-200 ease-out hover:bg-white/[0.028]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-foreground/90">Quick timeline entry</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Capture context while it is still warm.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[164px_1fr]">
            <Select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as TimelineEntryType })}>
              {timelineEntryTypes.map((type) => (
                <option key={type} value={type}>
                  {entryTypeLabels[type]}
                </option>
              ))}
            </Select>
            <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Entry title" />
          </div>
          <Textarea className="mt-3 min-h-20 resize-none" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder={entryHints[draft.type]} />
          <div className="mt-3 flex justify-end">
            <Button onClick={onAddEntry}>
              <PlusCircle className="h-4 w-4" />
              Add timeline entry
            </Button>
          </div>
        </section>

        <div className="space-y-10">
          {Object.entries(grouped).map(([date, dateEntries]) => (
            <section key={date}>
              <div className="sticky top-0 z-10 mb-6 flex items-center gap-4 bg-[hsl(var(--background)/0.88)] py-2 backdrop-blur">
                <div className="h-px flex-1 bg-white/[0.035]" />
                <div className="rounded-full bg-background/90 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(date)}
                </div>
                <div className="h-px flex-1 bg-white/[0.035]" />
              </div>
              <div className="space-y-1.5">
                {dateEntries.map((entry) => {
                  const editing = editingId === entry.id;
                  return (
                    <article
                      key={entry.id}
                      className={`group rounded-2xl border-l bg-white/[0.014] px-4 py-2 transition-all duration-200 ease-out hover:bg-white/[0.032] ${editing ? "bg-white/[0.04] shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16)]" : ""} ${typeAccent[entry.type]}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <Badge>{entryTypeLabels[entry.type]}</Badge>
                          {editing ? (
                            <Input
                              value={entryEdit.title}
                              onChange={(event) => setEntryEdit({ ...entryEdit, title: event.target.value })}
                              onKeyDown={(event) => onEditKeyDown(event, entry)}
                              className="h-8 min-w-0 border-transparent bg-white/[0.028] text-sm shadow-none focus:border-primary/20 focus:ring-0"
                              aria-label="Timeline entry title"
                            />
                          ) : (
                            <h2 className="min-w-0 truncate text-sm font-medium text-foreground">{entry.title}</h2>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <time className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</time>
                          {!editing ? (
                            <button
                              type="button"
                              onClick={() => startEdit(entry)}
                              className="rounded-md p-1 text-muted-foreground/45 opacity-0 transition duration-200 hover:bg-white/[0.04] hover:text-foreground group-hover:opacity-100 focus:opacity-100"
                              aria-label="Edit timeline entry"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                      {editing ? (
                        <>
                          <Textarea
                            value={entryEdit.content}
                            onChange={(event) => setEntryEdit({ ...entryEdit, content: event.target.value })}
                            onKeyDown={(event) => onEditKeyDown(event, entry)}
                            className="mt-2 min-h-24 resize-y border-transparent bg-white/[0.026] text-[15px] leading-7 shadow-none focus:border-primary/20 focus:ring-0"
                            aria-label="Timeline entry content"
                          />
                          <div className="mt-2 flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => saveEdit(entry)}>
                              Save
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7 text-foreground/80">{entry.content}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button size="sm" variant="ghost" className="bg-transparent px-2 text-muted-foreground hover:bg-white/[0.03] hover:text-foreground" onClick={() => onAttachNote(entry)}>
                          <NotebookPen className="h-3.5 w-3.5" />
                          Attach note
                        </Button>
                        {entry.linkedFiles.map((file) => (
                          <Button key={file.path} size="sm" variant="ghost" className="bg-white/[0.03]" onClick={() => onPreviewFile(file)}>
                            <FileText className="h-3.5 w-3.5" />
                            {file.label}
                          </Button>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
          {!entries.length ? <div className="rounded-[1.5rem] bg-white/[0.026] p-6 text-sm text-muted-foreground">No timeline entries yet. Add a note, decision, work log, or file link to begin the stream memory.</div> : null}
        </div>
      </div>
    </main>
  );
}
