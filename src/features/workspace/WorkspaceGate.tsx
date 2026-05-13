import { FolderOpen, PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { PotokiMark } from "../../components/brand/PotokiMark";
import { FileSystemAccessAdapter } from "../../core/filesystem/FileSystemAccessAdapter";
import { useI18n } from "../../core/i18n";

type Props = {
  workspaceName: string;
  setWorkspaceName: (value: string) => void;
  onOpen: () => void;
  onCreate: (sample: boolean) => void;
  busy: boolean;
  error?: string;
};

export function WorkspaceGate({ workspaceName, setWorkspaceName, onOpen, onCreate, busy, error }: Props) {
  const { t } = useI18n();
  const supported = FileSystemAccessAdapter.isSupported();
  return (
    <main className="workspace-bg min-h-screen px-5 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center">
        <div className="mb-8">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-primary/14 bg-primary/[0.08] shadow-[0_0_28px_hsl(var(--primary)/0.08)]">
              <PotokiMark className="h-5 w-5" />
            </span>
            {t("workspace.eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("workspace.title")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            {t("workspace.body")}
          </p>
        </div>

        {!supported ? (
          <Card className="border-amber-400/30 bg-amber-950/20 p-5">
            <h2 className="text-lg font-semibold text-amber-100">{t("workspace.unsupportedTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-amber-100/75">
              {t("workspace.unsupportedBody")}
            </p>
          </Card>
        ) : (
          <Card className="max-w-2xl p-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder={t("workspace.namePlaceholder")} />
              <Button onClick={onOpen} disabled={busy}>
                <FolderOpen className="h-4 w-4" />
                {t("workspace.open")}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => onCreate(false)} disabled={busy}>
                <PlusCircle className="h-4 w-4" />
                {t("workspace.create")}
              </Button>
              <Button onClick={() => onCreate(true)} disabled={busy} variant="ghost">
                {t("workspace.sample")}
              </Button>
            </div>
            {error ? <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">{error}</p> : null}
          </Card>
        )}
      </section>
    </main>
  );
}
