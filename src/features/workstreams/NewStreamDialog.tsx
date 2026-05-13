import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../core/i18n";

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
  const { t } = useI18n();
  return (
    <Dialog open={open} title={t("stream.newTitle")} onClose={onClose}>
      <div className="space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t("stream.titlePlaceholder")} />
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t("stream.descriptionPlaceholder")} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onCreate}>{t("stream.create")}</Button>
        </div>
      </div>
    </Dialog>
  );
}
