import { Clock3 } from "lucide-react";
import { FlowScrollArea } from "../../components/layout/FlowScrollArea";
import { useI18n } from "../../core/i18n";
import type { Workstream } from "../../core/models/workstream";
import { formatDateTime } from "../../core/utils/date";

export function Dashboard({
  streams,
  onSelect,
}: {
  streams: Workstream[];
  onSelect: (id: string) => void;
}) {
  const { statusLabel, t } = useI18n();
  const continueStreams = [...streams]
    .filter((stream) => ["active", "parked"].includes(stream.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  const activeCount = streams.filter((stream) => stream.status === "active").length;
  const parkedCount = streams.filter((stream) => stream.status === "parked").length;

  return (
    <FlowScrollArea as="main" className="h-screen min-h-0 flex-1" viewportClassName="overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-8 py-12 xl:py-16">
        <header className="max-w-4xl">
          <p className="section-label">{t("dashboard.eyebrow")}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">{t("dashboard.title")}</h1>
          <p className="mt-6 text-base leading-8 text-foreground/75">
            {t("dashboard.body")}
          </p>
          <p className="mt-4 text-sm text-muted-foreground/90">
            {t("dashboard.counts", { active: activeCount, parked: parkedCount, total: streams.length })}
          </p>
        </header>

        <section className="mt-16 max-w-5xl">
          <div className="mb-8">
            <h2 className="text-lg font-medium">{t("dashboard.section")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("dashboard.sectionHint")}</p>
          </div>

          <div className="space-y-6">
            {continueStreams.map((stream) => (
              <button
                key={stream.id}
                type="button"
                onClick={() => onSelect(stream.id)}
                className="group w-full rounded-[1.5rem] px-2 py-7 text-left transition duration-300 ease-out hover:bg-primary/[0.035] lg:px-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-xl font-medium leading-8 text-foreground">{stream.title}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground/80">{statusLabel(stream.status)}</p>
                  </div>
                  <span className="mt-1 text-lg leading-none text-muted-foreground/48 transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary">
                    -&gt;
                  </span>
                </div>
                <div className="mt-5 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <p className="line-clamp-3 text-base leading-8 text-foreground/78">{stream.currentContext || stream.description}</p>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/65">{t("dashboard.resume")}</p>
                    <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-foreground/88">
                      {stream.nextActions[0] || t("dashboard.noResume")}
                    </p>
                  </div>
                </div>
                <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {t("dashboard.updated", { date: formatDateTime(stream.updatedAt) })}
                </p>
              </button>
            ))}
            {!continueStreams.length ? (
              <div className="rounded-[1.75rem] bg-white/[0.024] p-8 text-sm leading-7 text-muted-foreground">
                {t("dashboard.empty")}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </FlowScrollArea>
  );
}
