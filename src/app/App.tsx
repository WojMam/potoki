import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/layout/EmptyState";
import { Button } from "../components/ui/button";
import { FileSystemAccessAdapter, type DirectoryHandle } from "../core/filesystem/FileSystemAccessAdapter";
import type { LinkedFile } from "../core/models/fileLink";
import type { TimelineEntry, TimelineEntryType } from "../core/models/timeline";
import type { Workstream, WorkstreamPriority, WorkstreamStatus } from "../core/models/workstream";
import type { WorkspaceManifest } from "../core/models/workspace";
import { NoteRepository } from "../core/repositories/NoteRepository";
import { StreamRepository } from "../core/repositories/StreamRepository";
import { TimelineRepository } from "../core/repositories/TimelineRepository";
import { WorkspaceRepository, type LoadIssue } from "../core/repositories/WorkspaceRepository";
import { nowIso } from "../core/utils/date";
import { createId, slugify } from "../core/utils/ids";
import { Dashboard } from "../features/dashboard/Dashboard";
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
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMarkdown, setNoteMarkdown] = useState("");
  const [notePreview, setNotePreview] = useState<string | undefined>();
  const [selectedNotePath, setSelectedNotePath] = useState<string | undefined>();
  const [workLogOpen, setWorkLogOpen] = useState(false);
  const [workLogNote, setWorkLogNote] = useState("");
  const [workLogHours, setWorkLogHours] = useState("");
  const [newStreamOpen, setNewStreamOpen] = useState(false);
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const [newStreamDescription, setNewStreamDescription] = useState("");
  const [newStreamPriority, setNewStreamPriority] = useState<WorkstreamPriority>("medium");

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
    setSelectedNotePath(undefined);
    setNotePreview(undefined);
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
      title: "Next action completed",
      content: action,
      linkedFiles: [],
    });
  }

  async function saveNote() {
    if (!repos || !selectedStream || !noteTitle.trim()) return;
    try {
      const path = await repos.notes.create(selectedStream.id, noteTitle.trim(), noteMarkdown || `# ${noteTitle.trim()}`);
      const linkedFile = linkedFileFromPath(path, noteTitle.trim(), "markdown");
      await saveStream({ ...selectedStream, linkedFiles: [...selectedStream.linkedFiles, linkedFile] });
      await createTimelineEntry({
        streamId: selectedStream.id,
        type: "note",
        title: noteTitle.trim(),
        content: "Markdown note created.",
        linkedFiles: [linkedFile],
      });
      setNoteDialog(false);
      setNoteTitle("");
      setNoteMarkdown("");
      await previewNote(path);
    } catch (err) {
      setError(toFriendlyError(err, "Could not create the Markdown note."));
    }
  }

  async function previewNote(path: string) {
    if (!repos) return;
    try {
      setSelectedNotePath(path);
      setNotePreview(await repos.notes.read(path));
    } catch (err) {
      setError(toFriendlyError(err, `Could not read ${path}`));
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
        priority: newStreamPriority,
        tags: [],
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
      setNewStreamPriority("medium");
      setError("");
    } catch (err) {
      setError(toFriendlyError(err, "Could not create the stream files."));
    }
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
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <StreamList
        workspaceName={manifest.name}
        streams={filteredStreams}
        selectedId={selectedId}
        query={query}
        filter={filter}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onSelect={setSelectedId}
        onNew={() => setNewStreamOpen(true)}
      />
      <div className="min-w-0 flex-1 lg:flex">
        {selectedStream ? (
          <>
            <TimelinePanel
              stream={selectedStream}
              entries={selectedEntries}
              notePreview={notePreview}
              selectedNotePath={selectedNotePath}
              draft={entryDraft}
              setDraft={setEntryDraft}
              onAddEntry={addTimelineEntry}
              onPreviewNote={previewNote}
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
                onAddNote={() => {
                  setNoteTitle("");
                  setNoteMarkdown("");
                  setNoteDialog(true);
                }}
                onLinkFile={linkFile}
              />
            ) : null}
          </>
        ) : (
          <Dashboard streams={streams} entries={entries} onSelect={setSelectedId} />
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
        title={noteTitle}
        markdown={noteMarkdown}
        setTitle={setNoteTitle}
        setMarkdown={setNoteMarkdown}
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
        priority={newStreamPriority}
        setTitle={setNewStreamTitle}
        setDescription={setNewStreamDescription}
        setPriority={setNewStreamPriority}
        onClose={() => setNewStreamOpen(false)}
        onCreate={createStream}
      />
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
