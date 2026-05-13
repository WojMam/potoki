import * as React from "react";
import { X } from "lucide-react";
import { useI18n } from "../../core/i18n";
import { Button } from "./button";
import { cn } from "./utils";

type DialogProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

export function Dialog({ open, title, children, onClose, className }: DialogProps) {
  const { t } = useI18n();
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={cn("max-h-[88vh] w-full max-w-2xl overflow-auto rounded-xl border border-white/[0.07] bg-card/95 p-6 shadow-glow", className)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label={t("common.closeDialog")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
