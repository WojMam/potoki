import { Clock3 } from "lucide-react";
import type { Workstream } from "../../core/models/workstream";
import { formatDateTime } from "../../core/utils/date";

export function Dashboard({
  streams,
  onSelect,
}: {
  streams: Workstream[];
  onSelect: (id: string) => void;
}) {
  const continueStreams = [...streams]
    .filter((stream) => ["active", "parked"].includes(stream.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  const activeCount = streams.filter((stream) => stream.status === "active").length;
  const parkedCount = streams.filter((stream) => stream.status === "parked").length;

  return (
    <main className="h-screen min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-8 py-12 xl:py-16">
        <header className="max-w-4xl">
          <p className="section-label">Local context cockpit</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">What can you continue?</h1>
          <p className="mt-6 text-base leading-8 text-foreground/75">
            A quiet continuation surface for active and parked context across your local workspace.
          </p>
          <p className="mt-4 text-sm text-muted-foreground/90">
            {activeCount} active, {parkedCount} parked, {streams.length} total streams.
          </p>
        </header>

        <section className="mt-16 max-w-5xl">
          <div className="mb-8">
            <h2 className="text-lg font-medium">Continue</h2>
            <p className="mt-2 text-sm text-muted-foreground">Choose the context you want to re-enter.</p>
          </div>

          <div className="space-y-6">
            {continueStreams.map((stream) => (
              <button
                key={stream.id}
                type="button"
                onClick={() => onSelect(stream.id)}
                className="group w-full rounded-[1.5rem] px-2 py-7 text-left transition duration-300 ease-out hover:bg-white/[0.035] lg:px-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-xl font-medium leading-8 text-foreground">{stream.title}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground/80">{stream.status}</p>
                  </div>
                  <span className="mt-1 text-lg leading-none text-muted-foreground/45 transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary/70">
                    -&gt;
                  </span>
                </div>
                <div className="mt-5 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <p className="line-clamp-3 text-base leading-8 text-foreground/78">{stream.currentContext || stream.description}</p>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/65">Resume</p>
                    <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-foreground/88">
                      {stream.nextActions[0] || "No resume note captured yet."}
                    </p>
                  </div>
                </div>
                <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  Updated {formatDateTime(stream.updatedAt)}
                </p>
              </button>
            ))}
            {!continueStreams.length ? (
              <div className="rounded-[1.75rem] bg-white/[0.024] p-8 text-sm leading-7 text-muted-foreground">
                No active or parked streams yet. Create a stream when there is context worth keeping warm.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
