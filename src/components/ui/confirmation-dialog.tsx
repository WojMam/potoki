import { AlertTriangle } from "lucide-react";
import { Dialog } from "./dialog";
import { Button } from "./button";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  body: string;
  detail?: string;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  body,
  detail,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} title={title} onClose={onCancel} className="max-w-lg" scrollContent={false}>
      <div className="space-y-5">
        <div className="flex gap-4">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/12 text-destructive-foreground/80 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.14)]">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-7 text-foreground/86">{body}</p>
            {detail ? (
              <p className="mt-3 line-clamp-3 rounded-lg bg-white/[0.022] px-3 py-2 text-sm leading-6 text-muted-foreground">
                {detail}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            className="bg-destructive/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] hover:bg-destructive"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
