import { Archive, Circle, PanelLeftClose, PanelLeftOpen, Pause, Plus, Search, Settings } from "lucide-react";
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
  onOpenSettings,
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
  onOpenSettings: () => void;
}) {
  const { t } = useI18n();
  return (
    <aside className={cn("panel relative flex h-screen w-full shrink-0 flex-col overflow-hidden bg-[hsl(218_18%_13.8%/0.72)] shadow-[inset_-1px_0_0_hsl(var(--primary)/0.045),inset_-2px_0_0_rgba(255,255,255,0.006)] transition-[width,background-color] duration-[240ms] ease-in-out", collapsed ? "bg-[hsl(218_18%_12%/0.34)] lg:w-20" : "lg:w-[292px]")}>
      <div className={cn("flex items-center justify-between gap-1 px-4 pb-5 pt-6 transition-all duration-[240ms] ease-in-out", collapsed && "px-1.5 pb-4")}>
        <button type="button" onClick={() => onSelect(undefined)} className="flex min-w-0 items-center gap-3 text-left">
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/18 bg-primary/[0.085] text-primary transition-all duration-[240ms] ease-in-out shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]", collapsed ? "bg-primary/[0.065] text-primary/94 hover:bg-primary/[0.10] hover:text-primary-foreground" : "")}>
            <PotokiMark className="h-[21px] w-[21px] transition-all duration-[240ms] ease-in-out" />
          </span>
          <span className={cn("min-w-0 overflow-hidden whitespace-nowrap transition-all delay-75 duration-[140ms] ease-in-out", collapsed ? "pointer-events-none w-0 -translate-x-2 opacity-0" : "w-48 translate-x-0 opacity-100")}>
            <span className="block text-lg font-semibold tracking-tight">{t("app.name")}</span>
            <span className="mt-2 block max-w-48 truncate text-xs text-muted-foreground">{workspaceName}</span>
          </span>
        </button>
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

      <div className={cn("overflow-hidden transition-all duration-[140ms] ease-in-out", collapsed ? "pointer-events-none max-h-0 -translate-x-2 opacity-0" : "max-h-48 translate-x-0 opacity-100")}>
        <div className="px-5 pb-4">
          <div className="relative rounded-xl bg-black/[0.105] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.018),inset_0_1px_8px_rgba(0,0,0,0.18)] transition duration-200 ease-out focus-within:bg-primary/[0.026] focus-within:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.13),inset_0_1px_8px_rgba(0,0,0,0.16)]">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75 transition-colors focus-within:text-primary" />
            <Input value={query} onChange={(event) => onQueryChange(event.target.value)} className="border-transparent bg-transparent pl-10 shadow-none focus:border-transparent focus:bg-transparent focus:ring-0" placeholder={t("app.search")} />
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-x-1 gap-y-1">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onFilterChange(item)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] leading-5 text-muted-foreground/72 transition duration-200 ease-out hover:bg-primary/[0.035] hover:text-foreground/90",
                  filter === item && "bg-primary/[0.075] text-primary-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)]",
                )}
              >
                {t(`sidebar.filter.${item}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("min-h-0 flex-1 overflow-hidden px-3 py-2 transition-all duration-[240ms] ease-in-out", collapsed && "pointer-events-none px-0 opacity-0")}>
        {!collapsed
          ? streams.map((stream) => (
              <button
                key={stream.id}
                type="button"
                onClick={() => onSelect(stream.id)}
                className={cn(
                  "group mb-1 w-full rounded-xl px-3 py-2 text-left transition duration-200 ease-out hover:bg-primary/[0.028]",
                  selectedId === stream.id && "bg-primary/[0.062] text-foreground shadow-[inset_2px_0_0_hsl(var(--primary)/0.32),inset_0_0_0_1px_hsl(var(--primary)/0.06)]",
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
      <div
        className={cn(
          "relative shrink-0 p-3 pt-4 transition-all duration-[240ms] ease-in-out before:pointer-events-none before:absolute before:inset-x-2 before:bottom-0 before:h-28 before:bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.055),transparent_68%)] before:opacity-70 after:pointer-events-none after:mb-3 after:block after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.032] after:to-transparent",
          collapsed && "p-2 pt-3 before:hidden after:hidden",
        )}
      >
        {collapsed ? (
          <Button size="icon" variant="ghost" className="mx-auto h-9 w-9 text-muted-foreground/62 hover:bg-white/[0.025] hover:text-muted-foreground" onClick={onOpenSettings} aria-label={t("settings.title")}>
            <Settings className="h-4 w-4" />
          </Button>
        ) : (
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.022] to-white/[0.012] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.014)]">
            <button
              type="button"
              onClick={onNew}
              className="flex w-full items-center gap-2.5 rounded-xl bg-primary/[0.052] px-3 py-2.5 text-left text-sm font-medium text-foreground/92 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.075)] transition duration-200 ease-out hover:-translate-y-px hover:bg-primary/[0.074] hover:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.11),0_8px_20px_hsl(var(--primary)/0.035)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/28"
            >
              <Plus className="h-4 w-4 text-primary/88" />
              <span>{t("sidebar.new")}</span>
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs leading-5 text-muted-foreground/72 transition duration-200 ease-out hover:bg-white/[0.024] hover:text-muted-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/22"
            >
              <Settings className="h-4 w-4 text-muted-foreground/62" />
              <span>{t("settings.title")}</span>
            </button>
          </div>
        )}
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
