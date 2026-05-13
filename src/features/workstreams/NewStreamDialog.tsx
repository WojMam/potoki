import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import type { WorkstreamPriority } from "../../core/models/workstream";
import { workstreamPriorities } from "../../core/models/workstream";

export function NewStreamDialog({
  open,
  title,
  description,
  priority,
  setTitle,
  setDescription,
  setPriority,
  onClose,
  onCreate,
}: {
  open: boolean;
  title: string;
  description: string;
  priority: WorkstreamPriority;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setPriority: (value: WorkstreamPriority) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <Dialog open={open} title="New Workstream" onClose={onClose}>
      <div className="space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Stream title" />
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What context does this stream hold?" />
        <Select value={priority} onChange={(event) => setPriority(event.target.value as WorkstreamPriority)}>
          {workstreamPriorities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCreate}>Create stream</Button>
        </div>
      </div>
    </Dialog>
  );
}
