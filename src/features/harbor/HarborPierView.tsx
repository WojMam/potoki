import { ArrowLeft, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useI18n } from "../../core/i18n";
import type { HarborCard, Pier } from "../../core/models/harbor";
import { formatDateTime } from "../../core/utils/date";

export function HarborPierView({
  pier,
  cards,
  onBack,
  onSelectCard,
  onNewCard,
}: {
  pier: Pier;
  cards: HarborCard[];
  onBack: () => void;
  onSelectCard: (cardId: string) => void;
  onNewCard: () => void;
}) {
  const { t, harborSyntaxLabel } = useI18n();
  const [query, setQuery] = useState("");

  const pierCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = cards.filter((card) => card.pierId === pier.id);
    if (!normalized) return filtered;
    return filtered.filter(
      (card) =>
        card.title.toLowerCase().includes(normalized) ||
        (card.description ?? "").toLowerCase().includes(normalized),
    );
  }, [cards, pier.id, query]);

  return (
    <FlowScrollArea className="h-full min-h-0" viewportClassName="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("harbor.back")}
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{pier.name}</h1>
          {pier.description ? (
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">{pier.description}</p>
          ) : null}
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[12rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("harbor.searchCards")}
              className="pl-9"
            />
          </div>
          <Button onClick={onNewCard}>
            <Plus className="h-4 w-4" />
            {t("harbor.newCard")}
          </Button>
        </div>

        {pierCards.length ? (
          <div className="space-y-2">
            {pierCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectCard(card.id)}
                className="w-full rounded-2xl border border-white/[0.04] bg-white/[0.018] px-5 py-4 text-left transition duration-200 ease-out hover:border-primary/14 hover:bg-primary/[0.026]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-foreground/94">{card.title}</h2>
                    {card.description ? (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/72">
                    {harborSyntaxLabel(card.syntax)}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground/60">{formatDateTime(card.updatedAt)}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.018] p-8 text-center text-sm text-muted-foreground">
            {t("harbor.emptyCards")}
          </div>
        )}
      </div>
    </FlowScrollArea>
  );
}
