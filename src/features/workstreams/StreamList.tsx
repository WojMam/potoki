import { Archive, Circle, PanelLeftClose, PanelLeftOpen, Pause, Plus, Search } from "lucide-react";
import { PotokiMark } from "../../components/brand/PotokiMark";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { cn } from "../../components/ui/utils";
import { useI18n } from "../../core/i18n";
import type { Workstream, WorkstreamStatus } from "../../core/models/workstream";

const filters: Array<"all" | WorkstreamStatus> = ["all", "active", "parked", "archived"];

export function StreamList({
  workspaceName,
  streams,
  selectedId,
  collapsed,
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onSelect,
  onToggleCollapsed,
  onNew,
}: {
  workspaceName: string;
  streams: Workstream[];
  selectedId?: string;
  collapsed: boolean;
  query: string;
  filter: "all" | WorkstreamStatus;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: "all" | WorkstreamStatus) => void;
  onSelect: (id?: string) => void;
  onToggleCollapsed: () => void;
  onNew: () => void;
}) {
  const { language, setLanguage, t } = useI18n();
  return (
    <aside className={cn("panel relative flex h-screen w-full shrink-0 flex-col overflow-hidden transition-[width,background-color] duration-[240ms] ease-in-out", collapsed ? "bg-white/[0.003] lg:w-20" : "lg:w-[292px]")}>
      <div className={cn("flex items-center justify-between gap-1 px-4 pb-3 pt-5 transition-all duration-[240ms] ease-in-out", collapsed && "px-1.5")}>
        <button type="button" onClick={() => onSelect(undefined)} className="flex min-w-0 items-center gap-3 text-left">
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/14 bg-primary/[0.08] text-primary transition-all duration-[240ms] ease-in-out", collapsed ? "bg-primary/[0.055] text-primary/92 shadow-[0_0_24px_hsl(var(--primary)/0.06)] hover:bg-primary/[0.085] hover:text-primary-foreground" : "shadow-[0_0_26px_hsl(var(--primary)/0.075)]")}>
            <PotokiMark className="h-[21px] w-[21px] transition-all duration-[240ms] ease-in-out" />
          </span>
          <span className={cn("min-w-0 overflow-hidden whitespace-nowrap transition-all delay-75 duration-[140ms] ease-in-out", collapsed ? "pointer-events-none w-0 -translate-x-2 opacity-0" : "w-48 translate-x-0 opacity-100")}>
            <span className="block text-lg font-semibold tracking-tight">{t("app.name")}</span>
            <span className="mt-2 block max-w-48 truncate text-xs text-muted-foreground">{workspaceName}</span>
          </span>
        </button>
        {!collapsed ? (
          <div className="ml-auto mr-1 flex rounded-lg bg-white/[0.014] p-0.5 text-[10px] text-muted-foreground">
            {(["pl", "en"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className={cn("rounded-md px-1.5 py-1 transition duration-200 ease-out hover:text-foreground", language === item && "bg-primary/[0.08] text-primary-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.10)]")}
              >
                {t(`language.${item}`)}
              </button>
            ))}
          </div>
        ) : null}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onToggleCollapsed}
          className="h-8 w-8 shrink-0 text-muted-foreground/72 hover:bg-primary/[0.055] hover:text-primary-foreground"
          aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
        >
          {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
        </Button>
      </div>

      <div className={cn("overflow-hidden transition-all duration-[140ms] ease-in-out", collapsed ? "pointer-events-none max-h-0 -translate-x-2 opacity-0" : "max-h-40 translate-x-0 opacity-100")}>
        <div className="px-5 pb-3">
          <div className="relative rounded-xl bg-white/[0.014] p-1 shadow-[0_8px_26px_rgba(0,0,0,0.08)] transition duration-200 ease-out focus-within:bg-white/[0.026] focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.055),0_12px_32px_rgba(0,0,0,0.10)]">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75 transition-colors focus-within:text-primary" />
            <Input value={query} onChange={(event) => onQueryChange(event.target.value)} className="border-transparent bg-transparent pl-10 shadow-none focus:border-transparent focus:bg-transparent focus:ring-0" placeholder={t("app.search")} />
          </div>
        </div>
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-x-1 gap-y-1">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onFilterChange(item)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] leading-5 text-muted-foreground/74 transition duration-200 ease-out hover:bg-primary/[0.04] hover:text-foreground/90",
                  filter === item && "bg-primary/[0.08] text-primary-foreground shadow-[inset_0_-1px_0_hsl(var(--primary)/0.28)]",
                )}
              >
                {t(`sidebar.filter.${item}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("min-h-0 flex-1 overflow-hidden px-3 py-1 transition-all duration-[240ms] ease-in-out", collapsed && "pointer-events-none px-0 opacity-0")}>
        {!collapsed
          ? streams.map((stream) => (
              <button
                key={stream.id}
                type="button"
                onClick={() => onSelect(stream.id)}
                className={cn(
                  "group mb-0.5 w-full rounded-xl px-3 py-2 text-left transition duration-200 ease-out hover:bg-primary/[0.035]",
                  selectedId === stream.id && "bg-primary/[0.055] text-foreground shadow-[inset_2px_0_0_hsl(var(--primary)/0.36),0_8px_28px_hsl(var(--primary)/0.035)]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium leading-5">{stream.title}</div>
                    <div className="mt-1 line-clamp-1 text-[12px] leading-5 text-muted-foreground/90">{stream.currentContext || stream.description}</div>
                  </div>
                  <StatusIcon status={stream.status} />
                </div>
              </button>
            ))
          : null}
      </div>
      <div className={cn("shrink-0 p-3 transition-all duration-[240ms] ease-in-out", collapsed && "pointer-events-none max-h-0 overflow-hidden p-0 opacity-0")}>
        <Button className="w-full" onClick={onNew}>
          <Plus className="h-4 w-4" />
          <span className="overflow-hidden whitespace-nowrap transition-all duration-[140ms] ease-in-out">{t("sidebar.new")}</span>
        </Button>
      </div>
    </aside>
  );
}

function StatusIcon({ status }: { status: WorkstreamStatus }) {
  const className = "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground";
  if (status === "parked") return <Pause className={className} />;
  if (status === "archived") return <Archive className={className} />;
  return <Circle className={cn(className, "stroke-[1.75] text-primary/68 group-hover:text-primary/88")} />;
}
