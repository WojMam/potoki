import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

export function NoteDialog({
  open,
  title,
  markdown,
  setTitle,
  setMarkdown,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  markdown: string;
  setTitle: (value: string) => void;
  setMarkdown: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} title="Create Markdown Note" onClose={onClose}>
      <div className="space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" />
        <Textarea className="min-h-64 font-mono text-sm" value={markdown} onChange={(event) => setMarkdown(event.target.value)} placeholder="# Notes&#10;&#10;Capture operational details, decisions, or links." />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save note</Button>
        </div>
      </div>
    </Dialog>
  );
}
