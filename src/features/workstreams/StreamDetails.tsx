import { useEffect, useState } from "react";
import { Check, FilePlus2, NotebookPen, Pencil, Plus, Save, Timer, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../core/i18n";
import type { Workstream, WorkstreamStatus } from "../../core/models/workstream";
import { workstreamStatuses } from "../../core/models/workstream";

export function StreamDetails({
  stream,
  edit,
  setEdit,
  onSave,
  newAction,
  setNewAction,
  onAddAction,
  onDoneAction,
  onWorkLog,
  onAddNote,
  onLinkFile,
  onOpenFile,
  onDelete,
}: {
  stream: Workstream;
  edit: Workstream;
  setEdit: (stream: Workstream) => void;
  onSave: () => void;
  newAction: string;
  setNewAction: (value: string) => void;
  onAddAction: () => void;
  onDoneAction: (action: string) => void;
  onWorkLog: () => void;
  onAddNote: () => void;
  onLinkFile: () => void;
  onOpenFile: (file: Workstream["linkedFiles"][number]) => void;
  onDelete: () => void;
}) {
  const { statusLabel, t } = useI18n();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
  }, [stream.id]);

  const saveAndClose = () => {
    onSave();
    setEditing(false);
  };

  return (
    <aside className="panel flex h-screen w-full shrink-0 flex-col overflow-hidden lg:w-[360px]">
      <div className="shrink-0 px-5 pb-3 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-foreground/90">{t("context.title")}</h2>
            <p className="mt-1 text-xs text-muted-foreground/85">{t("context.subtitle")}</p>
          </div>
          <Button size="sm" variant={editing ? "default" : "ghost"} className="px-3" onClick={editing ? saveAndClose : () => setEditing(true)}>
            {editing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {editing ? t("common.save") : t("common.edit")}
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-hidden px-5 pb-4">
        <section>
          {editing ? (
            <div className="space-y-4">
              <Input value={edit.title} onChange={(event) => setEdit({ ...edit, title: event.target.value })} />
              <Textarea value={edit.description} onChange={(event) => setEdit({ ...edit, description: event.target.value })} />
            </div>
          ) : (
            <>
              <h3 className="text-base font-medium leading-7">{stream.title}</h3>
              <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-foreground/72">{stream.description}</p>
            </>
          )}
          {editing ? (
            <div className="mt-4 max-w-[12rem]">
              <Select value={edit.status} onChange={(event) => setEdit({ ...edit, status: event.target.value as WorkstreamStatus })}>
                {workstreamStatuses.map((status) => (
                  <option key={status} value={status}>{statusLabel(status)}</option>
                ))}
              </Select>
            </div>
          ) : (
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">{statusLabel(stream.status)}</p>
          )}
        </section>

        <section>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/62">{t("context.current")}</label>
          {editing ? (
            <Textarea value={edit.currentContext} onChange={(event) => setEdit({ ...edit, currentContext: event.target.value })} />
          ) : (
            <div className="line-clamp-6 max-w-[32rem] border-l border-l-primary/22 py-0.5 pl-4 pr-2 text-[15px] leading-8 text-foreground/84">
              {stream.currentContext || t("context.empty")}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/62">{t("context.next")}</label>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground/45" />
          </div>
          <div className="space-y-1">
            {stream.nextActions.map((action) => (
              <div key={action} className="flex items-start gap-3 rounded-lg px-1 py-0.5 transition duration-200 ease-out hover:bg-white/[0.018]">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                <span className="flex-1 text-sm leading-6 text-foreground/86">{action}</span>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground/55 hover:text-foreground/85" onClick={() => onDoneAction(action)} aria-label={t("context.clearNext")}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input value={newAction} onChange={(event) => setNewAction(event.target.value)} placeholder={t("context.nextPlaceholder")} />
            <Button size="icon" variant="secondary" onClick={onAddAction} aria-label={t("context.addNext")}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section>
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/62">{t("context.linkedFiles")}</label>
          <div className="space-y-1">
            {stream.linkedFiles.map((file) => (
              <button key={file.path} type="button" onClick={() => onOpenFile(file)} className="block w-full rounded-lg px-1 py-0.5 text-left transition duration-200 ease-out hover:bg-white/[0.018]">
                <div className="text-sm text-foreground/88">{file.label}</div>
                <div className="mt-0.5 line-clamp-1 break-all text-xs leading-5 text-muted-foreground">{file.path}</div>
              </button>
            ))}
            {!stream.linkedFiles.length ? <p className="text-sm text-muted-foreground">{t("context.noFiles")}</p> : null}
          </div>
        </section>

        <section className="grid gap-2 pt-2">
          <Button variant="secondary" className="justify-start border-primary/12 bg-primary/[0.045] hover:border-primary/24 hover:bg-primary/[0.085]" onClick={onWorkLog}>
            <Timer className="h-4 w-4" />
            {t("context.workedToday")}
          </Button>
          <Button variant="ghost" className="justify-start" onClick={onAddNote}>
            <NotebookPen className="h-4 w-4" />
            {t("context.addNote")}
          </Button>
          <Button variant="ghost" className="justify-start" onClick={onLinkFile}>
            <FilePlus2 className="h-4 w-4" />
            {t("context.linkFile")}
          </Button>
        </section>

        <section className="pt-1">
          <Button
            variant="ghost"
            className="h-8 justify-start px-2 text-xs text-muted-foreground/62 hover:bg-destructive/10 hover:text-destructive-foreground/86"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("stream.delete")}
          </Button>
        </section>
      </div>
    </aside>
  );
}
