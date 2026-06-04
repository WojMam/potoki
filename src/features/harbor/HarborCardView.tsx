import { ArrowLeft, Copy, Pencil, Trash2 } from "lucide-react";
import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { Button } from "../../components/ui/button";
import { useI18n } from "../../core/i18n";
import type { HarborCard } from "../../core/models/harbor";
import { HarborSyntaxPreview } from "./HarborSyntaxPreview";

export function HarborCardView({
  card,
  content,
  copyFeedback,
  onBack,
  onEdit,
  onDelete,
  onCopy,
}: {
  card: HarborCard;
  content: string;
  copyFeedback: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  const { t, harborSyntaxLabel } = useI18n();

  return (
    <FlowScrollArea as="main" className="h-full min-h-0" viewportClassName="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("harbor.backToPier")}
        </button>

        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/64">
              {harborSyntaxLabel(card.syntax)}
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{card.title}</h1>
            {card.description ? (
              <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">{card.description}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onCopy}>
              <Copy className="h-4 w-4" />
              {copyFeedback ? t("harbor.copied") : t("harbor.copy")}
            </Button>
            <Button variant="ghost" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              {t("harbor.edit")}
            </Button>
            <Button variant="ghost" className="text-destructive-foreground/80 hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              {t("harbor.delete")}
            </Button>
          </div>
        </header>

        <section className="rounded-2xl bg-white/[0.018] p-5">
          <HarborSyntaxPreview content={content} syntax={card.syntax} />
        </section>
      </div>
    </FlowScrollArea>
  );
}
