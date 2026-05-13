import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

export function WorkLogDialog({
  open,
  note,
  hours,
  setNote,
  setHours,
  onClose,
  onSave,
}: {
  open: boolean;
  note: string;
  hours: string;
  setNote: (value: string) => void;
  setHours: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} title="Worked on this today" onClose={onClose} className="max-w-xl">
      <div className="space-y-3">
        <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional short note" />
        <Input value={hours} onChange={(event) => setHours(event.target.value)} placeholder="Optional duration in hours" inputMode="decimal" />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Create work log</Button>
        </div>
      </div>
    </Dialog>
  );
}
