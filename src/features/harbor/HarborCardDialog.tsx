import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../core/i18n";
import { harborCardSyntaxes, type HarborCardSyntax, type Pier } from "../../core/models/harbor";
import { HarborSyntaxPreview } from "./HarborSyntaxPreview";

export function HarborCardDialog({
  open,
  title,
  description,
  syntax,
  pierId,
  content,
  piers,
  isEditing,
  setTitle,
  setDescription,
  setSyntax,
  setPierId,
  setContent,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  description: string;
  syntax: HarborCardSyntax;
  pierId: string;
  content: string;
  piers: Pier[];
  isEditing: boolean;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setSyntax: (value: HarborCardSyntax) => void;
  setPierId: (value: string) => void;
  setContent: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { t, harborSyntaxLabel } = useI18n();

  return (
    <Dialog
      open={open}
      title={isEditing ? t("harbor.editCard") : t("harbor.newCard")}
      onClose={onClose}
      className="h-[85vh] max-h-[85vh] max-w-5xl"
      contentClassName="flex flex-col"
      scrollContent={false}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="grid shrink-0 gap-3 md:grid-cols-2">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("harbor.cardTitlePlaceholder")}
          />
          <Select
            value={pierId}
            onChange={(event) => setPierId(event.target.value)}
            aria-label={t("harbor.pier")}
            disabled={isEditing}
          >
            {piers.map((pier) => (
              <option key={pier.id} value={pier.id}>
                {pier.name}
              </option>
            ))}
          </Select>
        </div>
        <Input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t("harbor.cardDescriptionPlaceholder")}
        />
        <Select value={syntax} onChange={(event) => setSyntax(event.target.value as HarborCardSyntax)} aria-label={t("harbor.syntax")}>
          {harborCardSyntaxes.map((item) => (
            <option key={item} value={item}>
              {harborSyntaxLabel(item)}
            </option>
          ))}
        </Select>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
          <Textarea
            className="min-h-[52vh] font-mono text-sm"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={t("harbor.cardContentPlaceholder")}
            aria-label={t("harbor.cardContentPlaceholder")}
          />
          <div className="min-h-0 overflow-hidden rounded-xl bg-white/[0.018]">
            <FlowScrollArea className="h-full min-h-[52vh]" viewportClassName="p-5 pr-8">
              <HarborSyntaxPreview content={content} syntax={syntax} />
            </FlowScrollArea>
          </div>
        </div>

        <div className="relative z-10 flex shrink-0 justify-end gap-2 bg-card/95 pt-1">
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSave} disabled={!title.trim() || !pierId}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
