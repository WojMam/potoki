import { ArrowRight, Clock3 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import type { TimelineEntry } from "../../core/models/timeline";
import type { Workstream } from "../../core/models/workstream";
import { formatDateTime } from "../../core/utils/date";

export function Dashboard({
  streams,
  entries,
  onSelect,
}: {
  streams: Workstream[];
  entries: TimelineEntry[];
  onSelect: (id: string) => void;
}) {
  const continueStreams = [...streams]
    .filter((stream) => ["active", "waiting"].includes(stream.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  const nextActions = streams
    .filter((stream) => ["active", "waiting"].includes(stream.status))
    .flatMap((stream) => stream.nextActions.slice(0, 2).map((action) => ({ stream, action })))
    .slice(0, 8);

  const activeCount = streams.filter((stream) => stream.status === "active").length;
  const waitingCount = streams.filter((stream) => stream.status === "waiting").length;

  return (
    <main className="min-h-screen flex-1 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.055),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_320px)]">
      <div className="mx-auto w-full max-w-7xl px-8 py-12">
        <header className="max-w-3xl">
          <p className="section-label">Local context cockpit</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">What can you continue?</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            A quiet view of active context, waiting threads, small next actions and recent notes across your local workspace.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {activeCount} active, {waitingCount} waiting, {streams.length} total streams.
          </p>
        </header>

        <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">Continue</h2>
                <p className="mt-1 text-sm text-muted-foreground">Recent active context, ready when you are.</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {continueStreams.map((stream) => (
                <button
                  key={stream.id}
                  type="button"
                  onClick={() => onSelect(stream.id)}
                  className="group min-h-56 rounded-lg border border-white/[0.055] bg-white/[0.032] p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.16)] transition hover:border-primary/20 hover:bg-white/[0.048]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-lg font-medium leading-7 text-foreground">{stream.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge>{stream.status}</Badge>
                        <Badge>{stream.priority}</Badge>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-6 line-clamp-4 text-sm leading-7 text-muted-foreground">{stream.currentContext || stream.description}</p>
                  <div className="mt-6 border-t border-white/[0.055] pt-4">
                    <p className="section-label">Next</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/88">
                      {stream.nextActions[0] || "No next action captured yet."}
                    </p>
                    <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      Updated {formatDateTime(stream.updatedAt)}
                    </p>
                  </div>
                </button>
              ))}
              {!continueStreams.length ? (
                <div className="rounded-lg border border-white/[0.055] bg-white/[0.025] p-6 text-sm leading-7 text-muted-foreground">
                  No active or waiting streams yet. Create a stream when there is context worth keeping warm.
                </div>
              ) : null}
            </div>

            <section className="mt-12">
              <div className="mb-4">
                <h2 className="text-lg font-medium">Available Next Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">Small things you can pick up without turning this into a task board.</p>
              </div>
              <div className="divide-y divide-white/[0.055] rounded-lg border border-white/[0.055] bg-white/[0.025]">
                {nextActions.map(({ stream, action }) => (
                  <button
                    key={`${stream.id}-${action}`}
                    type="button"
                    onClick={() => onSelect(stream.id)}
                    className="group flex w-full items-start gap-4 px-6 py-4 text-left transition hover:bg-white/[0.035]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/65" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-6 text-foreground/90">{action}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">{stream.title}</span>
                    </span>
                    <Badge>{stream.status}</Badge>
                  </button>
                ))}
                {!nextActions.length ? (
                  <div className="px-6 py-4 text-sm text-muted-foreground">No active or waiting next actions yet.</div>
                ) : null}
              </div>
            </section>
          </section>

          <aside className="min-w-0 xl:pt-16">
            <div className="rounded-lg border border-white/[0.055] bg-white/[0.025] p-6">
              <h2 className="text-base font-medium">Recent Activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">A compact memory trail across streams.</p>
              <div className="mt-6 space-y-6">
                {entries.slice(0, 8).map((entry) => {
                  const stream = streams.find((item) => item.id === entry.streamId);
                  return (
                    <button key={entry.id} type="button" onClick={() => stream && onSelect(stream.id)} className="block w-full text-left">
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-white/20" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge>{entry.type.replace("_", " ")}</Badge>
                            <span className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/90">{entry.title}</p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">{stream?.title}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {!entries.length ? <p className="text-sm text-muted-foreground">No timeline activity yet.</p> : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
