import { Anchor, FileText } from "lucide-react";
import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { cn } from "../../components/ui/utils";
import type { HarborCard, Pier } from "../../core/models/harbor";

export function HarborSidebarNav({
  piers,
  cards,
  selectedPierId,
  selectedCardId,
  onSelectPier,
  onSelectCard,
}: {
  piers: Pier[];
  cards: HarborCard[];
  selectedPierId?: string;
  selectedCardId?: string;
  onSelectPier: (pierId: string) => void;
  onSelectCard: (cardId: string) => void;
}) {
  const cardsByPier = cards.reduce<Record<string, HarborCard[]>>((acc, card) => {
    (acc[card.pierId] ??= []).push(card);
    return acc;
  }, {});

  return (
    <FlowScrollArea className="h-full min-h-0" viewportClassName="pr-1">
      {piers.length > 0 ? (
        <div className="space-y-1 pb-2">
          {piers.map((pier) => {
            const pierCards = cardsByPier[pier.id] ?? [];
            const pierSelected = selectedPierId === pier.id;
            return (
              <div key={pier.id}>
                <button
                  type="button"
                  onClick={() => onSelectPier(pier.id)}
                  className={cn(
                    "group mb-0.5 flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left transition duration-200 ease-out hover:bg-primary/[0.028]",
                    pierSelected && !selectedCardId && "bg-primary/[0.062] text-foreground shadow-[inset_2px_0_0_hsl(var(--primary)/0.32),inset_0_0_0_1px_hsl(var(--primary)/0.06)]",
                    pierSelected && selectedCardId && "bg-primary/[0.04]",
                  )}
                >
                  <Anchor className="mt-0.5 h-4 w-4 shrink-0 text-primary/72" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium leading-5">{pier.name}</span>
                    {pier.description ? (
                      <span className="mt-0.5 block line-clamp-1 text-[12px] leading-5 text-muted-foreground/90">{pier.description}</span>
                    ) : null}
                  </span>
                  {pierCards.length ? (
                    <span className="shrink-0 rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted-foreground/72">
                      {pierCards.length}
                    </span>
                  ) : null}
                </button>
                {pierSelected && pierCards.length ? (
                  <div className="mb-1 ml-2 space-y-0.5 border-l border-white/[0.06] pl-2">
                    {pierCards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => onSelectCard(card.id)}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition duration-200 ease-out hover:bg-primary/[0.028]",
                          selectedCardId === card.id &&
                            "bg-primary/[0.062] text-foreground shadow-[inset_2px_0_0_hsl(var(--primary)/0.32),inset_0_0_0_1px_hsl(var(--primary)/0.06)]",
                        )}
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70 group-hover:text-muted-foreground" />
                        <span className="truncate text-[13px] leading-5">{card.title}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </FlowScrollArea>
  );
}
