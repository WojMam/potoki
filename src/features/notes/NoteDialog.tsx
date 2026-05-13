import ReactMarkdown from "react-markdown";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

export function NoteDialog({
  open,
  mode,
  title,
  markdown,
  timelineDescription,
  includeTimelineEntry,
  setTitle,
  setMarkdown,
  setTimelineDescription,
  setIncludeTimelineEntry,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "stream" | "entry";
  title: string;
  markdown: string;
  timelineDescription: string;
  includeTimelineEntry: boolean;
  setTitle: (value: string) => void;
  setMarkdown: (value: string) => void;
  setTimelineDescription: (value: string) => void;
  setIncludeTimelineEntry: (value: boolean) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} title={mode === "entry" ? "Attach note" : "Add note"} onClose={onClose} className="max-w-5xl">
      <div className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Textarea
            className="min-h-72 font-mono text-sm"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            placeholder="# Notes&#10;&#10;Capture operational details, decisions, or links."
          />
          <div className="min-h-72 rounded-xl bg-white/[0.018] p-5">
            {markdown.trim() ? (
              <div className="prose-threadbase">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-7 text-muted-foreground">Markdown preview will appear here as you write.</p>
            )}
          </div>
        </div>

        {mode === "stream" ? (
          <div className="rounded-xl bg-white/[0.018] p-4">
            <label className="flex items-start gap-3 text-sm text-foreground/86">
              <input
                type="checkbox"
                checked={includeTimelineEntry}
                onChange={(event) => setIncludeTimelineEntry(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
              />
              <span>
                Show this note in the timeline
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Creates a note entry with this Markdown file attached.
                </span>
              </span>
            </label>
            {includeTimelineEntry ? (
              <Textarea
                className="mt-3 min-h-20 resize-none"
                value={timelineDescription}
                onChange={(event) => setTimelineDescription(event.target.value)}
                placeholder="Optional timeline description"
              />
            ) : null}
          </div>
        ) : (
          <p className="rounded-xl bg-white/[0.018] p-4 text-sm leading-7 text-muted-foreground">
            This note will be attached to the selected timeline entry without creating a new entry.
          </p>
        )}

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
