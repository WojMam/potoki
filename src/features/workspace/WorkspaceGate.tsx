import { FolderOpen, PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { FileSystemAccessAdapter } from "../../core/filesystem/FileSystemAccessAdapter";

type Props = {
  workspaceName: string;
  setWorkspaceName: (value: string) => void;
  onOpen: () => void;
  onCreate: (sample: boolean) => void;
  busy: boolean;
  error?: string;
};

export function WorkspaceGate({ workspaceName, setWorkspaceName, onOpen, onCreate, busy, error }: Props) {
  const supported = FileSystemAccessAdapter.isSupported();
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.10),transparent_34%),hsl(var(--background))] px-5 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Threadbase</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">A local context workspace for parallel technical work.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Open a folder, keep human-readable JSON and Markdown files as the source of truth, and restore working context without servers, accounts, or network access.
          </p>
        </div>

        {!supported ? (
          <Card className="border-amber-400/30 bg-amber-950/20 p-5">
            <h2 className="text-lg font-semibold text-amber-100">This browser cannot access local folders.</h2>
            <p className="mt-2 text-sm leading-6 text-amber-100/75">
              Threadbase requires the File System Access API. Please open this static app in a Chromium-based browser such as Chrome or Microsoft Edge.
            </p>
          </Card>
        ) : (
          <Card className="max-w-2xl p-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder="Workspace name" />
              <Button onClick={onOpen} disabled={busy} variant="secondary">
                <FolderOpen className="h-4 w-4" />
                Open workspace folder
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => onCreate(false)} disabled={busy}>
                <PlusCircle className="h-4 w-4" />
                Create workspace
              </Button>
              <Button onClick={() => onCreate(true)} disabled={busy} variant="ghost">
                Create sample workspace
              </Button>
            </div>
            {error ? <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">{error}</p> : null}
          </Card>
        )}
      </section>
    </main>
  );
}
