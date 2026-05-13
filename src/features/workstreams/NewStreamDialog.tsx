import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

export function NewStreamDialog({
  open,
  title,
  description,
  setTitle,
  setDescription,
  onClose,
  onCreate,
}: {
  open: boolean;
  title: string;
  description: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <Dialog open={open} title="New Workstream" onClose={onClose}>
      <div className="space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Stream title" />
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What context does this stream hold?" />
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
