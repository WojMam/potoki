import { Archive, Circle, Command, PanelLeftClose, PanelLeftOpen, Pause, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { cn } from "../../components/ui/utils";
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
  return (
    <aside className={cn("panel relative flex h-screen w-full shrink-0 flex-col overflow-hidden transition-[width,background-color] duration-[240ms] ease-in-out", collapsed ? "bg-white/[0.004] lg:w-20" : "lg:w-[292px]")}>
      <div className={cn("flex items-center justify-between gap-1 px-4 pb-3 pt-5 transition-all duration-[240ms] ease-in-out", collapsed && "px-1.5")}>
        <button type="button" onClick={() => onSelect(undefined)} className="flex min-w-0 items-center gap-3 text-left">
          <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/[0.065] text-primary transition-all duration-[240ms] ease-in-out", collapsed ? "bg-white/[0.018] text-muted-foreground/80 shadow-none hover:bg-white/[0.028] hover:text-foreground" : "shadow-[0_0_24px_rgba(45,212,191,0.06)]")}>
            <Command className="h-[18px] w-[18px] transition-all duration-[240ms] ease-in-out" />
          </span>
          <span className={cn("min-w-0 overflow-hidden whitespace-nowrap transition-all delay-75 duration-[140ms] ease-in-out", collapsed ? "pointer-events-none w-0 -translate-x-2 opacity-0" : "w-48 translate-x-0 opacity-100")}>
            <span className="block text-lg font-semibold tracking-tight">Threadbase</span>
            <span className="mt-2 block max-w-48 truncate text-xs text-muted-foreground">{workspaceName}</span>
          </span>
        </button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onToggleCollapsed}
          className="h-8 w-8 shrink-0 text-muted-foreground/75 hover:bg-white/[0.028] hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
        </Button>
      </div>

      <div className={cn("overflow-hidden transition-all duration-[140ms] ease-in-out", collapsed ? "pointer-events-none max-h-0 -translate-x-2 opacity-0" : "max-h-40 translate-x-0 opacity-100")}>
        <div className="px-5 pb-3">
          <div className="relative rounded-xl bg-white/[0.014] p-1 shadow-[0_8px_26px_rgba(0,0,0,0.08)] transition duration-200 ease-out focus-within:bg-white/[0.024] focus-within:shadow-[0_0_0_4px_rgba(45,212,191,0.026),0_12px_32px_rgba(0,0,0,0.10)]">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
            <Input value={query} onChange={(event) => onQueryChange(event.target.value)} className="border-transparent bg-transparent pl-10 shadow-none focus:border-transparent focus:bg-transparent focus:ring-0" placeholder="Search context..." />
          </div>
        </div>
        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-1.5">
            {filters.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={filter === item ? "secondary" : "ghost"}
                onClick={() => onFilterChange(item)}
                className={cn("h-7 justify-start px-3 text-[11px] capitalize text-muted-foreground hover:text-foreground", filter === item && "bg-white/[0.035] text-foreground")}
              >
                {item}
              </Button>
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
                  "group mb-0.5 w-full rounded-xl px-3 py-2 text-left transition duration-200 ease-out hover:bg-white/[0.026]",
                  selectedId === stream.id && "bg-white/[0.026] text-foreground shadow-[inset_2px_0_0_hsl(var(--primary)/0.22)]",
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
          <span className="overflow-hidden whitespace-nowrap transition-all duration-[140ms] ease-in-out">New Stream</span>
        </Button>
      </div>
    </aside>
  );
}

function StatusIcon({ status }: { status: WorkstreamStatus }) {
  const className = "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground";
  if (status === "parked") return <Pause className={className} />;
  if (status === "archived") return <Archive className={className} />;
  return <Circle className={cn(className, "stroke-[1.75] text-muted-foreground/55 group-hover:text-muted-foreground/85")} />;
}
