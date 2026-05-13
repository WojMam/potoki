import { Archive, Circle, Command, Pause, Plus, Search, TimerReset } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../components/ui/utils";
import type { Workstream, WorkstreamStatus } from "../../core/models/workstream";

const filters: Array<"all" | WorkstreamStatus> = ["all", "active", "waiting", "paused", "done", "archived"];

export function StreamList({
  workspaceName,
  streams,
  selectedId,
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onSelect,
  onNew,
}: {
  workspaceName: string;
  streams: Workstream[];
  selectedId?: string;
  query: string;
  filter: "all" | WorkstreamStatus;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: "all" | WorkstreamStatus) => void;
  onSelect: (id?: string) => void;
  onNew: () => void;
}) {
  return (
    <aside className="panel flex h-screen min-h-0 w-full flex-col border-r lg:w-[320px]">
      <div className="border-b border-white/[0.055] p-6">
        <button type="button" onClick={() => onSelect(undefined)} className="text-left">
          <div className="flex items-center gap-4 text-xl font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-primary/15 bg-primary/[0.08] text-primary">
              <Command className="h-4 w-4" />
            </span>
            Threadbase
          </div>
          <div className="mt-2 max-w-60 truncate text-xs text-muted-foreground">{workspaceName}</div>
        </button>
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => onQueryChange(event.target.value)} className="border-white/[0.075] bg-white/[0.04] pl-10 shadow-inner" placeholder="Search streams, notes, files" />
        </div>
      </div>
      <div className="border-b border-white/[0.055] p-4">
        <div className="grid grid-cols-2 gap-2">
          {filters.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={filter === item ? "secondary" : "ghost"}
              onClick={() => onFilterChange(item)}
              className={cn("justify-start capitalize", filter === item && "bg-white/[0.07]")}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {streams.map((stream) => (
          <button
            key={stream.id}
            type="button"
            onClick={() => onSelect(stream.id)}
            className={cn(
              "mb-2 w-full rounded-lg border border-transparent p-4 text-left transition hover:border-white/[0.055] hover:bg-white/[0.035]",
              selectedId === stream.id && "border-white/[0.075] bg-white/[0.055] text-foreground shadow-[inset_2px_0_0_hsl(var(--primary)/0.65)]",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium leading-5">{stream.title}</div>
                <div className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{stream.currentContext || stream.description}</div>
              </div>
              <StatusIcon status={stream.status} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge>{stream.priority}</Badge>
              {stream.tags.slice(0, 1).map((tag) => (
                <Badge key={tag} className="normal-case tracking-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className="border-t border-white/[0.055] p-4">
        <Button className="w-full" onClick={onNew}>
          <Plus className="h-4 w-4" />
          New Stream
        </Button>
      </div>
    </aside>
  );
}

function StatusIcon({ status }: { status: WorkstreamStatus }) {
  const className = "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground";
  if (status === "waiting") return <TimerReset className={className} />;
  if (status === "paused") return <Pause className={className} />;
  if (status === "archived") return <Archive className={className} />;
  return <Circle className={cn(className, status === "active" && "fill-primary text-primary")} />;
}
