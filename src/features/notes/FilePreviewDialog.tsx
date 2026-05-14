import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../core/i18n";

export type FilePreviewState = {
  path: string;
  label: string;
  type: string;
  content: string | null;
  isMarkdown: boolean;
};

export function FilePreviewDialog({
  preview,
  onClose,
  onSave,
}: {
  preview: FilePreviewState | null;
  onClose: () => void;
  onSave: (path: string, markdown: string) => void;
}) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setEditing(false);
    setDraft(preview?.content ?? "");
  }, [preview?.path, preview?.content]);

  const save = () => {
    if (!preview) return;
    onSave(preview.path, draft);
    setEditing(false);
  };

  return (
    <Dialog
      open={Boolean(preview)}
      title={preview?.label || t("files.contextFile")}
      onClose={onClose}
      className="max-h-[84vh] max-w-[1000px] overflow-hidden rounded-2xl border-white/[0.08] bg-[hsl(var(--card)/0.98)] shadow-[0_28px_90px_rgba(0,0,0,0.28)]"
    >
      {preview ? (
        <div className="flex max-h-[calc(84vh-6.5rem)] flex-col">
          <div className="border-b border-white/[0.055] pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{preview.path}</span>
              </div>
              {preview.isMarkdown && preview.content !== null ? (
                <div className="flex shrink-0 items-center gap-2">
                  {editing ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setDraft(preview.content ?? "");
                        setEditing(false);
                      }}>
                        {t("common.cancel")}
                      </Button>
                      <Button size="sm" onClick={save}>{t("notes.save")}</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>{t("notes.edit")}</Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="py-6 pr-1">
            {preview.content === null ? (
              <p className="text-sm text-muted-foreground">{t("files.opening")}</p>
            ) : editing ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <Textarea className="min-h-[52vh] font-mono text-sm" value={draft} onChange={(event) => setDraft(event.target.value)} />
                <div className="rounded-xl bg-white/[0.018] p-5">
                  <div className="prose-potoki">
                    <ReactMarkdown>{draft}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : preview.isMarkdown ? (
              <div className="prose-potoki">
                <ReactMarkdown>{preview.content}</ReactMarkdown>
              </div>
            ) : (
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-black/20 p-5 text-sm leading-7 text-foreground/82">
                {preview.content}
              </pre>
            )}
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
