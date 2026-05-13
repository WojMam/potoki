import { useEffect, useState } from "react";
import { Check, FilePlus2, NotebookPen, Pencil, Plus, Save, Timer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
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
}) {
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
      <div className="shrink-0 px-5 pb-2 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-foreground/90">Context Snapshot</h2>
            <p className="mt-1 text-xs text-muted-foreground/85">Read first, adjust when context changes.</p>
          </div>
          <Button size="sm" variant={editing ? "default" : "secondary"} onClick={editing ? saveAndClose : () => setEditing(true)}>
            {editing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {editing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-hidden px-5 pb-4">
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
                  <option key={status}>{status}</option>
                ))}
              </Select>
            </div>
          ) : (
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground/75">{stream.status}</p>
          )}
        </section>

        <section>
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Current Context</label>
          {editing ? (
            <Textarea value={edit.currentContext} onChange={(event) => setEdit({ ...edit, currentContext: event.target.value })} />
          ) : (
            <div className="line-clamp-6 max-w-[32rem] border-l border-l-primary/16 pl-4 pr-2 text-[15px] leading-7 text-foreground/82">
              {stream.currentContext || "No current context captured yet."}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Next Things / Resume Notes</label>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            {stream.nextActions.map((action) => (
              <div key={action} className="flex items-start gap-3 rounded-lg px-1 py-1 transition duration-200 ease-out hover:bg-white/[0.024]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/65" />
                <span className="flex-1 text-sm leading-6 text-foreground/86">{action}</span>
                <Button size="icon" variant="ghost" onClick={() => onDoneAction(action)} aria-label="Clear resume note">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input value={newAction} onChange={(event) => setNewAction(event.target.value)} placeholder="Small thing to resume" />
            <Button size="icon" variant="secondary" onClick={onAddAction} aria-label="Add resume note">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section>
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Linked Files</label>
          <div className="space-y-1">
            {stream.linkedFiles.map((file) => (
              <button key={file.path} type="button" onClick={() => onOpenFile(file)} className="block w-full rounded-lg px-1 py-1 text-left transition duration-200 ease-out hover:bg-white/[0.024]">
                <div className="text-sm text-foreground/88">{file.label}</div>
                <div className="mt-0.5 line-clamp-1 break-all text-xs leading-5 text-muted-foreground">{file.path}</div>
              </button>
            ))}
            {!stream.linkedFiles.length ? <p className="text-sm text-muted-foreground">No linked files yet.</p> : null}
          </div>
        </section>

        <section className="grid gap-2 pt-2">
          <Button onClick={onWorkLog}>
            <Timer className="h-4 w-4" />
            Worked on this today
          </Button>
          <Button variant="secondary" onClick={onAddNote}>
            <NotebookPen className="h-4 w-4" />
            Add note
          </Button>
          <Button variant="secondary" onClick={onLinkFile}>
            <FilePlus2 className="h-4 w-4" />
            Link file
          </Button>
        </section>
      </div>
    </aside>
  );
}
