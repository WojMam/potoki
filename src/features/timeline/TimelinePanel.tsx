import { ArrowLeft, FilePlus2, FileText, Link2Off, NotebookPen, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { isMarkdownLinkedFile } from "../../core/data/linkedFiles";
import { useI18n } from "../../core/i18n";
import type { LinkedFile } from "../../core/models/fileLink";
import type { TimelineEntry, TimelineEntryType } from "../../core/models/timeline";
import type { Workstream } from "../../core/models/workstream";
import { formatDate, formatDateTime } from "../../core/utils/date";
import { TimelineEntryTypeBadge, TimelineEntryTypeSelect } from "./timelineEntryTypeVisual";

const typeAccent: Record<TimelineEntryType, string> = {
  note: "border-l-primary/14",
  decision: "border-l-primary/38 bg-primary/[0.014]",
  meeting: "border-l-primary/32 bg-primary/[0.01]",
  action_done: "border-l-primary/24",
  waiting: "border-l-muted-foreground/16 opacity-90",
  work_log: "border-l-primary/20 bg-primary/[0.006]",
  file_link: "border-l-primary/18",
};

export function TimelinePanel({
  stream,
  entries,
  draft,
  setDraft,
  onAddEntry,
  onPreviewFile,
  onUnlinkFile,
  onAttachNote,
  onAttachFile,
  onUpdateEntry,
  onDeleteEntry,
  onBackToDashboard,
}: {
  stream: Workstream;
  entries: TimelineEntry[];
  draft: { type: TimelineEntryType; title: string; content: string };
  setDraft: (draft: { type: TimelineEntryType; title: string; content: string }) => void;
  onAddEntry: () => void;
  onPreviewFile: (file: LinkedFile, entry: TimelineEntry) => void;
  onUnlinkFile: (entry: TimelineEntry, file: LinkedFile) => void;
  onAttachNote: (entry: TimelineEntry) => void;
  onAttachFile: (entry: TimelineEntry) => void;
  onUpdateEntry: (entry: TimelineEntry) => void;
  onDeleteEntry: (entry: TimelineEntry) => void;
  onBackToDashboard: () => void;
}) {
  const { statusLabel, t } = useI18n();
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
    <FlowScrollArea
      as="main"
      className="h-screen min-h-0 flex-1"
      viewportClassName="overflow-x-hidden"
      data-no-ambient-ripple
    >
      <div className="mx-auto max-w-3xl px-8 py-12 xl:max-w-[820px]">
        <div className="mb-10">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-muted-foreground transition duration-200 ease-out hover:bg-white/[0.028] hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("timeline.back")}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-transparent px-0 text-muted-foreground/76">{statusLabel(stream.status)}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{stream.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">{stream.description}</p>
        </div>

        <section className="mb-10 rounded-2xl bg-white/[0.014] px-4 py-3 transition-colors duration-200 ease-out hover:bg-white/[0.022]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-foreground/90">{t("timeline.quickEntry")}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("timeline.quickEntryHint")}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[164px_1fr]">
            <TimelineEntryTypeSelect value={draft.type} onChange={(type) => setDraft({ ...draft, type })} />
            <Input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder={t("timeline.entryTitle")}
              aria-label={t("timeline.entryTitle")}
            />
          </div>
          <Textarea className="mt-3 min-h-20 resize-none" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder={t(`timeline.hint.${draft.type}`)} />
          <div className="mt-3 flex justify-end">
            <Button onClick={onAddEntry}>
              <PlusCircle className="h-4 w-4" />
              {t("timeline.addEntry")}
            </Button>
          </div>
        </section>

        <div className="space-y-11">
          {Object.entries(grouped).map(([date, dateEntries]) => (
            <section key={date}>
              <div className="sticky top-0 z-10 mb-4 flex items-center gap-4 bg-[hsl(var(--background)/0.80)] py-2 backdrop-blur">
                <div className="h-px flex-1 bg-white/[0.018]" />
                <div className="rounded-full bg-background/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/68">
                  {formatDate(date)}
                </div>
                <div className="h-px flex-1 bg-white/[0.018]" />
              </div>
              <div className="space-y-0.5">
                {dateEntries.map((entry) => {
                  const editing = editingId === entry.id;
                  return (
                    <article
                      key={entry.id}
                      aria-label={entry.title}
                      className={`group rounded-xl border-l bg-white/[0.018] px-4 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.014)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/[0.032] hover:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.075),0_10px_24px_rgba(0,0,0,0.10)] ${editing ? "bg-primary/[0.045] shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.18)]" : ""} ${typeAccent[entry.type]}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <TimelineEntryTypeBadge type={entry.type} />
                          {editing ? (
                            <Input
                              value={entryEdit.title}
                              onChange={(event) => setEntryEdit({ ...entryEdit, title: event.target.value })}
                              onKeyDown={(event) => onEditKeyDown(event, entry)}
                              className="h-8 min-w-0 border-transparent bg-white/[0.028] text-sm shadow-none focus:border-primary/20 focus:ring-0"
                              aria-label={t("timeline.editTitle")}
                            />
                          ) : (
                            <h2 className="min-w-0 truncate text-sm font-semibold text-foreground/96">{entry.title}</h2>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <time className="text-[11px] text-muted-foreground/60">{formatDateTime(entry.createdAt)}</time>
                          {!editing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(entry)}
                                className="rounded-md p-1 text-muted-foreground/44 opacity-0 transition duration-200 hover:bg-primary/[0.075] hover:text-primary-foreground group-hover:opacity-100 focus:opacity-100"
                                aria-label={t("timeline.edit")}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteEntry(entry)}
                                className="rounded-md p-1 text-muted-foreground/36 opacity-0 transition duration-200 hover:bg-destructive/10 hover:text-destructive-foreground/86 group-hover:opacity-100 focus:opacity-100"
                                aria-label={t("timeline.delete")}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
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
                            aria-label={t("timeline.editContent")}
                          />
                          <div className="mt-2 flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              {t("timeline.cancel")}
                            </Button>
                            <Button size="sm" onClick={() => saveEdit(entry)}>
                              {t("timeline.save")}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7 text-foreground/82">{entry.content}</p>
                      )}
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Button size="sm" variant="ghost" className="h-7 bg-transparent px-2 text-muted-foreground/76 hover:bg-primary/[0.055] hover:text-primary-foreground" onClick={() => onAttachNote(entry)}>
                          <NotebookPen className="h-3.5 w-3.5" />
                          {t("timeline.attachNote")}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 bg-transparent px-2 text-muted-foreground/76 hover:bg-primary/[0.055] hover:text-primary-foreground" onClick={() => onAttachFile(entry)}>
                          <FilePlus2 className="h-3.5 w-3.5" />
                          {t("timeline.attachFile")}
                        </Button>
                        {entry.linkedFiles.map((file) =>
                          editing ? (
                            <span key={file.path} className="relative inline-flex">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-7 bg-primary/[0.035] px-2 text-muted-foreground/86 hover:bg-primary/[0.075] hover:text-primary-foreground ${!isMarkdownLinkedFile(file) ? "pr-5" : ""}`}
                                onClick={() => onPreviewFile(file, entry)}
                              >
                                <FileText className="h-3.5 w-3.5 shrink-0" />
                                <span className="max-w-[14rem] truncate">{file.label}</span>
                              </Button>
                              {!isMarkdownLinkedFile(file) ? (
                                <button
                                  type="button"
                                  className="absolute -right-1 -top-1 z-10 flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full bg-destructive/42 text-destructive-foreground/92 shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.28),0_1px_4px_rgba(0,0,0,0.18)] transition-[background-color,transform,box-shadow] duration-200 ease-out hover:scale-[1.08] hover:bg-destructive/62 hover:shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.42),0_2px_8px_rgba(0,0,0,0.26)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-destructive/50"
                                  aria-label={t("timeline.unlinkFile")}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    onUnlinkFile(entry, file);
                                  }}
                                >
                                  <Link2Off className="h-2.5 w-2.5" strokeWidth={2.25} />
                                </button>
                              ) : null}
                            </span>
                          ) : (
                            <Button
                              key={file.path}
                              size="sm"
                              variant="ghost"
                              className="h-7 bg-primary/[0.035] px-2 text-muted-foreground/86 hover:bg-primary/[0.075] hover:text-primary-foreground"
                              onClick={() => onPreviewFile(file, entry)}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              {file.label}
                            </Button>
                          ),
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
          {!entries.length ? <div className="rounded-[1.5rem] bg-white/[0.026] p-6 text-sm text-muted-foreground">{t("timeline.empty")}</div> : null}
        </div>
      </div>
    </FlowScrollArea>
  );
}
