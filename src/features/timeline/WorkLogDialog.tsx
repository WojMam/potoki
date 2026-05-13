import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../core/i18n";

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
  const { t } = useI18n();
  return (
    <Dialog open={open} title={t("worklog.title")} onClose={onClose} className="max-w-xl">
      <div className="space-y-3">
        <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={t("worklog.notePlaceholder")} />
        <Input value={hours} onChange={(event) => setHours(event.target.value)} placeholder={t("worklog.hoursPlaceholder")} inputMode="decimal" />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSave}>{t("worklog.create")}</Button>
        </div>
      </div>
    </Dialog>
  );
}
