import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/layout/EmptyState";
import { Button } from "../components/ui/button";
import { FileSystemAccessAdapter, type DirectoryHandle } from "../core/filesystem/FileSystemAccessAdapter";
import type { LinkedFile } from "../core/models/fileLink";
import type { TimelineEntry, TimelineEntryType } from "../core/models/timeline";
import type { Workstream, WorkstreamStatus } from "../core/models/workstream";
import type { WorkspaceManifest } from "../core/models/workspace";
import { NoteRepository } from "../core/repositories/NoteRepository";
import { StreamRepository } from "../core/repositories/StreamRepository";
import { TimelineRepository } from "../core/repositories/TimelineRepository";
import { WorkspaceRepository, type LoadIssue } from "../core/repositories/WorkspaceRepository";
import { nowIso } from "../core/utils/date";
import { createId, slugify } from "../core/utils/ids";
import { Dashboard } from "../features/dashboard/Dashboard";
import { FilePreviewDialog, type FilePreviewState } from "../features/notes/FilePreviewDialog";
import { NoteDialog } from "../features/notes/NoteDialog";
import { streamMatchesSearch } from "../features/search/search";
import { TimelinePanel } from "../features/timeline/TimelinePanel";
import { WorkLogDialog } from "../features/timeline/WorkLogDialog";
import { NewStreamDialog } from "../features/workstreams/NewStreamDialog";
import { StreamDetails } from "../features/workstreams/StreamDetails";
import { StreamList } from "../features/workstreams/StreamList";
import { WorkspaceGate } from "../features/workspace/WorkspaceGate";

type Repositories = {
  workspace: WorkspaceRepository;
  streams: StreamRepository;
  timeline: TimelineRepository;
  notes: NoteRepository;
};

type NoteDialogMode = { kind: "stream" } | { kind: "entry"; entry: TimelineEntry };

const adapter = new FileSystemAccessAdapter();

export function App() {
  const [root, setRoot] = useState<DirectoryHandle | null>(null);
  const [repos, setRepos] = useState<Repositories | null>(null);
  const [manifest, setManifest] = useState<WorkspaceManifest | null>(null);
  const [streams, setStreams] = useState<Workstream[]>([]);
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [issues, setIssues] = useState<LoadIssue[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Threadbase Workspace");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | WorkstreamStatus>("all");
  const [entryDraft, setEntryDraft] = useState<{ type: TimelineEntryType; title: string; content: string }>({
    type: "note",
    title: "",
    content: "",
  });
  const [editStream, setEditStream] = useState<Workstream | null>(null);
  const [newAction, setNewAction] = useState("");
  const [noteDialog, setNoteDialog] = useState(false);
  const [noteMode, setNoteMode] = useState<NoteDialogMode>({ kind: "stream" });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMarkdown, setNoteMarkdown] = useState("");
  const [noteTimelineDescription, setNoteTimelineDescription] = useState("");
  const [noteIncludeTimelineEntry, setNoteIncludeTimelineEntry] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreviewState | null>(null);
  const [workLogOpen, setWorkLogOpen] = useState(false);
  const [workLogNote, setWorkLogNote] = useState("");
  const [workLogHours, setWorkLogHours] = useState("");
  const [newStreamOpen, setNewStreamOpen] = useState(false);
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const [newStreamDescription, setNewStreamDescription] = useState("");

  const selectedStream = streams.find((stream) => stream.id === selectedId);
  const selectedEntries = entries.filter((entry) => entry.streamId === selectedId);

  const filteredStreams = useMemo(
    () =>
      streams.filter((stream) => {
        const matchesFilter = filter === "all" || stream.status === filter;
        return matchesFilter && streamMatchesSearch(stream, entries, query);
      }),
    [streams, filter, query, entries],
  );

  useEffect(() => {
    setEditStream(selectedStream ? structuredClone(selectedStream) : null);
    setEntryDraft({ type: "note", title: "", content: "" });
    setFilePreview(null);
    setNewAction("");
  }, [selectedStream?.id]);

  async function wireRepositories(handle: DirectoryHandle) {
    const nextRepos: Repositories = {
      workspace: new WorkspaceRepository(adapter, handle),
      streams: new StreamRepository(adapter, handle),
      timeline: new TimelineRepository(adapter, handle),
      notes: new NoteRepository(adapter, handle),
    };
    setRoot(handle);
    setRepos(nextRepos);
    return nextRepos;
  }

  async function refresh(nextRepos = repos, knownManifest = manifest) {
    if (!nextRepos || !knownManifest) return;
    const streamResult = await nextRepos.streams.loadAll();
    const timelineResult = await nextRepos.timeline.loadMany(streamResult.streams.map((stream) => stream.id));
    setStreams(streamResult.streams);
    setEntries(timelineResult.entries);
    setIssues((current) => [
      ...current.filter((issue) => issue.scope !== "streams" && issue.scope !== "timeline"),
      ...streamResult.issues.map((message) => ({ scope: "streams" as const, message })),
      ...timelineResult.issues.map((message) => ({ scope: "timeline" as const, message })),
    ]);
  }

  async function openWorkspace() {
    setBusy(true);
    setError("");
    try {
      const handle = await adapter.openWorkspaceFolder();
      const nextRepos = await wireRepositories(handle);
      const result = await nextRepos.workspace.loadManifest();
      setIssues(result.issues);
      if (!result.manifest) {
        setManifest(null);
        setError("This folder does not look like a Threadbase workspace. Create a workspace here or choose another folder.");
        return;
      }
      setManifest(result.manifest);
      setWorkspaceName(result.manifest.name);
      await refresh(nextRepos, result.manifest);
    } catch (err) {
      setError(toFriendlyError(err, "Permission was denied or the folder could not be opened."));
    } finally {
      setBusy(false);
    }
  }

  async function createWorkspace(sample: boolean) {
    setBusy(true);
    setError("");
    try {
      const handle = await adapter.openWorkspaceFolder();
      const nextRepos = await wireRepositories(handle);
      const nextManifest = await nextRepos.workspace.initialize(workspaceName, sample);
      setManifest(nextManifest);
      setIssues([]);
      await refresh(nextRepos, nextManifest);
    } catch (err) {
      setError(toFriendlyError(err, "Could not create the workspace."));
    } finally {
      setBusy(false);
    }
  }

  async function saveStream(stream: Workstream) {
    if (!repos || !manifest) return;
    try {
      const saved = await repos.streams.save(stream);
      setStreams((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setManifest(await repos.workspace.touch(manifest));
      setError("");
    } catch (err) {
      setError(toFriendlyError(err, "Could not write the stream JSON file."));
    }
  }

  async function createTimelineEntry(partial: Omit<TimelineEntry, "id" | "createdAt">) {
    if (!repos || !manifest) return;
    try {
      const entry: TimelineEntry = { ...partial, id: createId("entry"), createdAt: nowIso() };
      const nextEntries = await repos.timeline.append(entry.streamId, entry);
      setEntries((current) => [...current.filter((item) => item.streamId !== entry.streamId), ...nextEntries]);
      setManifest(await repos.workspace.touch(manifest));
      setError("");
    } catch (err) {
      setError(toFriendlyError(err, "Could not write the timeline JSON file."));
    }
  }

  async function updateTimelineEntry(entry: TimelineEntry) {
    if (!repos || !manifest) return;
    try {
      const nextEntries = await repos.timeline.update(entry.streamId, entry);
      setEntries((current) => [...current.filter((item) => item.streamId !== entry.streamId), ...nextEntries]);
      setManifest(await repos.workspace.touch(manifest));
      setError("");
    } catch (err) {
      setError(toFriendlyError(err, "Could not update the timeline JSON file."));
    }
  }

  async function addTimelineEntry() {
    if (!selectedStream || !entryDraft.title.trim()) return;
    await createTimelineEntry({
      streamId: selectedStream.id,
      type: entryDraft.type,
      title: entryDraft.title.trim(),
      content: entryDraft.content.trim(),
      linkedFiles: [],
    });
    await saveStream(selectedStream);
    setEntryDraft({ type: "note", title: "", content: "" });
  }

  async function addNextAction() {
    if (!selectedStream || !newAction.trim()) return;
    await saveStream({ ...selectedStream, nextActions: [...selectedStream.nextActions, newAction.trim()] });
    setNewAction("");
  }

  async function markActionDone(action: string) {
    if (!selectedStream) return;
    await saveStream({ ...selectedStream, nextActions: selectedStream.nextActions.filter((item) => item !== action) });
    await createTimelineEntry({
      streamId: selectedStream.id,
      type: "action_done",
      title: "Resume note cleared",
      content: action,
      linkedFiles: [],
    });
  }

  async function saveNote() {
    if (!repos || !selectedStream || !noteTitle.trim()) return;
    try {
      const path = await repos.notes.create(selectedStream.id, noteTitle.trim(), noteMarkdown || `# ${noteTitle.trim()}`);
      const linkedFile = linkedFileFromPath(path, noteTitle.trim(), "markdown");
      if (noteMode.kind === "entry") {
        await updateTimelineEntry({
          ...noteMode.entry,
          linkedFiles: [...noteMode.entry.linkedFiles, linkedFile],
        });
      } else {
        await saveStream({ ...selectedStream, linkedFiles: [...selectedStream.linkedFiles, linkedFile] });
        if (noteIncludeTimelineEntry) {
          await createTimelineEntry({
            streamId: selectedStream.id,
            type: "note",
            title: noteTitle.trim(),
            content: noteTimelineDescription.trim() || `Added note: ${noteTitle.trim()}`,
            linkedFiles: [linkedFile],
          });
        }
      }
      setNoteDialog(false);
      setNoteTitle("");
      setNoteMarkdown("");
      setNoteTimelineDescription("");
      setNoteIncludeTimelineEntry(false);
      await previewFile(linkedFile);
    } catch (err) {
      setError(toFriendlyError(err, "Could not create the Markdown note."));
    }
  }

  async function saveExistingNote(path: string, markdown: string) {
    if (!repos) return;
    try {
      await repos.notes.write(path, markdown);
      setFilePreview((current) => (current && current.path === path ? { ...current, content: markdown } : current));
      setError("");
    } catch (err) {
      setError(toFriendlyError(err, `Could not save ${path}`));
    }
  }

  async function previewFile(file: LinkedFile) {
    if (!repos) return;
    const isMarkdown = file.type === "markdown" || file.path.toLowerCase().endsWith(".md");
    setFilePreview({
      path: file.path,
      label: file.label,
      type: file.type,
      content: null,
      isMarkdown,
    });
    try {
      setFilePreview({
        path: file.path,
        label: file.label,
        type: file.type,
        content: await repos.notes.read(file.path),
        isMarkdown,
      });
    } catch (err) {
      setFilePreview(null);
      setError(toFriendlyError(err, `Could not read ${file.path}`));
    }
  }

  async function linkFile() {
    if (!root || !selectedStream) return;
    try {
      const file = await adapter.chooseLocalFile();
      const relative = (await adapter.relativePathForFile(root, file)) ?? file.name;
      const linkedFile = linkedFileFromPath(relative, file.name, file.name.split(".").pop() || "file");
      await saveStream({ ...selectedStream, linkedFiles: [...selectedStream.linkedFiles, linkedFile] });
      await createTimelineEntry({
        streamId: selectedStream.id,
        type: "file_link",
        title: `Linked ${file.name}`,
        content: relative,
        linkedFiles: [linkedFile],
      });
    } catch (err) {
      setError(toFriendlyError(err, "Could not link the selected file."));
    }
  }

  async function createWorkLog() {
    if (!selectedStream) return;
    const duration = workLogHours.trim() ? `\nDuration: ${workLogHours.trim()} hour(s)` : "";
    await createTimelineEntry({
      streamId: selectedStream.id,
      type: "work_log",
      title: "Worked on this today",
      content: `${workLogNote.trim() || "Touched this stream and refreshed context."}${duration}`,
      linkedFiles: [],
    });
    setWorkLogOpen(false);
    setWorkLogNote("");
    setWorkLogHours("");
  }

  async function createStream() {
    if (!repos || !manifest || !newStreamTitle.trim()) return;
    try {
      const timestamp = nowIso();
      const baseId = slugify(newStreamTitle);
      let id = baseId;
      let counter = 2;
      while (streams.some((stream) => stream.id === id)) {
        id = `${baseId}-${counter}`;
        counter += 1;
      }
      const stream: Workstream = {
        id,
        title: newStreamTitle.trim(),
        description: newStreamDescription.trim(),
        status: "active",
        currentContext: newStreamDescription.trim(),
        nextActions: [],
        linkedFiles: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await repos.streams.create(stream);
      await repos.timeline.save(id, []);
      await adapter.ensureDirectory(root!, `notes/${id}`);
      await adapter.ensureDirectory(root!, `artifacts/${id}`);
      setManifest(await repos.workspace.touch(manifest));
      await refresh(repos, manifest);
      setSelectedId(id);
      setNewStreamOpen(false);
      setNewStreamTitle("");
      setNewStreamDescription("");
      setError("");
    } catch (err) {
      setError(toFriendlyError(err, "Could not create the stream files."));
    }
  }

  function openStreamNoteDialog() {
    setNoteMode({ kind: "stream" });
    setNoteTitle("");
    setNoteMarkdown("");
    setNoteTimelineDescription("");
    setNoteIncludeTimelineEntry(false);
    setNoteDialog(true);
  }

  function openEntryNoteDialog(entry: TimelineEntry) {
    setNoteMode({ kind: "entry", entry });
    setNoteTitle("");
    setNoteMarkdown("");
    setNoteTimelineDescription("");
    setNoteIncludeTimelineEntry(false);
    setNoteDialog(true);
  }

  if (!manifest) {
    return (
      <WorkspaceGate
        workspaceName={workspaceName}
        setWorkspaceName={setWorkspaceName}
        onOpen={openWorkspace}
        onCreate={createWorkspace}
        busy={busy}
        error={error}
      />
    );
  }

  return (
    <div className="workspace-bg h-screen overflow-hidden text-foreground lg:flex">
      <StreamList
        workspaceName={manifest.name}
        streams={filteredStreams}
        selectedId={selectedId}
        collapsed={sidebarCollapsed}
        query={query}
        filter={filter}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onSelect={setSelectedId}
        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        onNew={() => setNewStreamOpen(true)}
      />
      <div className="min-h-0 min-w-0 flex-1 transition-[width] duration-[240ms] ease-in-out lg:flex">
        {selectedStream ? (
          <>
            <TimelinePanel
              stream={selectedStream}
              entries={selectedEntries}
              draft={entryDraft}
              setDraft={setEntryDraft}
              onAddEntry={addTimelineEntry}
              onPreviewFile={previewFile}
              onAttachNote={openEntryNoteDialog}
              onUpdateEntry={updateTimelineEntry}
              onBackToDashboard={() => setSelectedId(undefined)}
            />
            {editStream ? (
              <StreamDetails
                stream={selectedStream}
                edit={editStream}
                setEdit={setEditStream}
                onSave={() => saveStream(editStream)}
                newAction={newAction}
                setNewAction={setNewAction}
                onAddAction={addNextAction}
                onDoneAction={markActionDone}
                onWorkLog={() => setWorkLogOpen(true)}
                onAddNote={openStreamNoteDialog}
                onLinkFile={linkFile}
                onOpenFile={previewFile}
              />
            ) : null}
          </>
        ) : (
          <Dashboard streams={streams} onSelect={setSelectedId} />
        )}
      </div>

      {issues.length || error ? (
        <div className="fixed bottom-4 left-4 z-40 max-w-md rounded-md border border-amber-400/30 bg-amber-950/80 p-3 text-sm text-amber-50 shadow-glow backdrop-blur">
          {error ? <div>{error}</div> : null}
          {issues.slice(0, 4).map((issue) => (
            <div key={`${issue.scope}-${issue.message}`}>{issue.message}</div>
          ))}
        </div>
      ) : null}

      <NoteDialog
        open={noteDialog}
        mode={noteMode.kind}
        title={noteTitle}
        markdown={noteMarkdown}
        timelineDescription={noteTimelineDescription}
        includeTimelineEntry={noteIncludeTimelineEntry}
        setTitle={setNoteTitle}
        setMarkdown={setNoteMarkdown}
        setTimelineDescription={setNoteTimelineDescription}
        setIncludeTimelineEntry={setNoteIncludeTimelineEntry}
        onClose={() => setNoteDialog(false)}
        onSave={saveNote}
      />
      <WorkLogDialog
        open={workLogOpen}
        note={workLogNote}
        hours={workLogHours}
        setNote={setWorkLogNote}
        setHours={setWorkLogHours}
        onClose={() => setWorkLogOpen(false)}
        onSave={createWorkLog}
      />
      <NewStreamDialog
        open={newStreamOpen}
        title={newStreamTitle}
        description={newStreamDescription}
        setTitle={setNewStreamTitle}
        setDescription={setNewStreamDescription}
        onClose={() => setNewStreamOpen(false)}
        onCreate={createStream}
      />
      <FilePreviewDialog preview={filePreview} onClose={() => setFilePreview(null)} onSave={saveExistingNote} />
      {!streams.length ? (
        <div className="fixed inset-x-0 bottom-8 flex justify-center">
          <EmptyState title="No streams yet" body="Create a stream to start building local memory." action={<Button onClick={() => setNewStreamOpen(true)}>New Stream</Button>} />
        </div>
      ) : null}
    </div>
  );
}

function linkedFileFromPath(path: string, label: string, type: string): LinkedFile {
  return {
    label,
    path,
    type,
    addedAt: nowIso(),
  };
}

function toFriendlyError(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  if (error.name === "AbortError") return "No folder or file was selected.";
  if (error.name === "NotAllowedError") return "Permission was denied. Reopen the workspace folder and allow read/write access.";
  if (error.name === "NotFoundError") return "A required file or folder is missing from the workspace.";
  if (error.message.includes("Malformed JSON")) return error.message;
  return error.message || fallback;
}
