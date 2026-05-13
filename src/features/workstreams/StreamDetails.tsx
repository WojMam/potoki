import { useEffect, useState } from "react";
import { Check, FilePlus2, NotebookPen, Pencil, Plus, Save, Timer } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import type { Workstream, WorkstreamPriority, WorkstreamStatus } from "../../core/models/workstream";
import { workstreamPriorities, workstreamStatuses } from "../../core/models/workstream";

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
    <aside className="panel h-screen w-full overflow-auto border-l lg:w-[384px]">
      <div className="border-b border-white/[0.055] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium">Context Snapshot</h2>
            <p className="mt-1 text-xs text-muted-foreground">Read first, adjust when context changes.</p>
          </div>
          <Button size="sm" variant={editing ? "default" : "secondary"} onClick={editing ? saveAndClose : () => setEditing(true)}>
            {editing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {editing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>
      <div className="space-y-8 p-6">
        <section>
          {editing ? (
            <div className="space-y-4">
              <Input value={edit.title} onChange={(event) => setEdit({ ...edit, title: event.target.value })} />
              <Textarea value={edit.description} onChange={(event) => setEdit({ ...edit, description: event.target.value })} />
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium leading-7">{stream.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{stream.description}</p>
            </>
          )}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Select disabled={!editing} value={edit.status} onChange={(event) => setEdit({ ...edit, status: event.target.value as WorkstreamStatus })}>
              {workstreamStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </Select>
            <Select disabled={!editing} value={edit.priority} onChange={(event) => setEdit({ ...edit, priority: event.target.value as WorkstreamPriority })}>
              {workstreamPriorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </Select>
          </div>
        </section>

        <section>
          <label className="section-label mb-4 block">Tags</label>
          {editing ? (
            <Input value={edit.tags.join(", ")} onChange={(event) => setEdit({ ...edit, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} placeholder="api, testing, review" />
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2">
            {stream.tags.map((tag) => (
              <Badge key={tag} className="normal-case tracking-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <label className="section-label mb-4 block">Current Context</label>
          {editing ? (
            <Textarea value={edit.currentContext} onChange={(event) => setEdit({ ...edit, currentContext: event.target.value })} />
          ) : (
            <div className="rounded-lg border border-white/[0.055] border-l-2 border-l-primary/45 bg-white/[0.03] p-4 text-[15px] leading-7 text-muted-foreground shadow-[0_16px_48px_rgba(0,0,0,0.15)]">
              {stream.currentContext || "No current context captured yet."}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <label className="section-label">Next Actions</label>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {stream.nextActions.map((action) => (
              <div key={action} className="flex items-start gap-4 rounded-lg border border-white/[0.045] bg-white/[0.025] p-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/65" />
                <span className="flex-1 text-sm leading-6">{action}</span>
                <Button size="icon" variant="ghost" onClick={() => onDoneAction(action)} aria-label="Mark next action done">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input value={newAction} onChange={(event) => setNewAction(event.target.value)} placeholder="Small thing to continue" />
            <Button size="icon" variant="secondary" onClick={onAddAction} aria-label="Add next action">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section>
          <label className="section-label mb-4 block">Linked Files</label>
          <div className="space-y-2">
            {stream.linkedFiles.map((file) => (
              <div key={file.path} className="rounded-lg border border-white/[0.045] bg-white/[0.025] p-4">
                <div className="text-sm">{file.label}</div>
                <div className="mt-2 break-all text-xs leading-5 text-muted-foreground">{file.path}</div>
              </div>
            ))}
            {!stream.linkedFiles.length ? <p className="text-sm text-muted-foreground">No linked files yet.</p> : null}
          </div>
        </section>

        <section className="grid gap-2 border-t border-white/[0.055] pt-6">
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
