import { Anchor, Plus } from "lucide-react";
import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { Button } from "../../components/ui/button";
import { useI18n } from "../../core/i18n";
import type { HarborCard, Pier } from "../../core/models/harbor";

export function HarborHome({
  piers,
  cards,
  onSelectPier,
  onNewPier,
}: {
  piers: Pier[];
  cards: HarborCard[];
  onSelectPier: (pierId: string) => void;
  onNewPier: () => void;
}) {
  const { t } = useI18n();

  const cardCountByPier = cards.reduce<Record<string, number>>((acc, card) => {
    acc[card.pierId] = (acc[card.pierId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <FlowScrollArea as="main" className="h-full min-h-0" viewportClassName="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <Anchor className="h-4 w-4" />
            {t("harbor.eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("harbor.title")}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{t("harbor.description")}</p>
        </header>

        <div className="mb-6 flex justify-end">
          <Button variant="secondary" onClick={onNewPier}>
            <Plus className="h-4 w-4" />
            {t("harbor.newPier")}
          </Button>
        </div>

        {piers.length ? (
          <div className="space-y-2">
            {piers.map((pier) => (
              <button
                key={pier.id}
                type="button"
                onClick={() => onSelectPier(pier.id)}
                className="group w-full rounded-2xl border border-white/[0.04] bg-white/[0.018] px-5 py-4 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/16 hover:bg-primary/[0.028] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-foreground/96">{pier.name}</h2>
                    {pier.description ? (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{pier.description}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground/80">
                    {t("harbor.cardCount", { count: String(cardCountByPier[pier.id] ?? 0) })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.018] p-8 text-center">
            <p className="text-sm leading-7 text-muted-foreground">{t("harbor.emptyPiers")}</p>
            <Button className="mt-4" onClick={onNewPier}>
              <Plus className="h-4 w-4" />
              {t("harbor.newPier")}
            </Button>
          </div>
        )}
      </div>
    </FlowScrollArea>
  );
}
