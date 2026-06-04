import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../core/i18n";

export function HarborPierDialog({
  open,
  name,
  description,
  setName,
  setDescription,
  onClose,
  onSave,
}: {
  open: boolean;
  name: string;
  description: string;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { t } = useI18n();

  return (
    <Dialog open={open} title={t("harbor.newPier")} onClose={onClose} className="max-w-lg">
      <div className="space-y-4">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("harbor.pierNamePlaceholder")}
          aria-label={t("harbor.pierNamePlaceholder")}
        />
        <Textarea
          className="min-h-24 resize-none"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t("harbor.pierDescriptionPlaceholder")}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSave} disabled={!name.trim()}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
