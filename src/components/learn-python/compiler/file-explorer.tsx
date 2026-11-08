"use client";

import { FacultyAuthForm } from "@/components/auth/faculty-auth-form";
import { workspacePath, type PythonFileEntry } from "@/components/learn-python/compiler/use-python-files";
import type { UserRole } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ChevronRight, FileCode, Folder, FolderOpen, FolderPlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type TreeNode = { name: string; path: string; kind: "file" | "folder"; children: TreeNode[] };

function baseName(path: string) {
  const i = path.lastIndexOf("/");
  return i === -1 ? path : path.slice(i + 1);
}

function parentPath(path: string) {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}

function buildTree(entries: PythonFileEntry[]): TreeNode[] {
  const nodes = new Map<string, TreeNode>();
  const ensureFolder = (path: string) => {
    if (!path || nodes.has(path)) return;
    const parent = parentPath(path);
    if (parent) ensureFolder(parent);
    nodes.set(path, { name: baseName(path), path, kind: "folder", children: [] });
  };
  for (const entry of entries) {
    if (entry.kind === "folder") ensureFolder(entry.path);
  }
  for (const entry of entries) {
    if (entry.kind !== "file") continue;
    const parent = parentPath(entry.path);
    if (parent) ensureFolder(parent);
    nodes.set(entry.path, { name: baseName(entry.path), path: entry.path, kind: "file", children: [] });
  }
  const roots: TreeNode[] = [];
  for (const node of nodes.values()) {
    const parent = parentPath(node.path);
    const parentNode = parent ? nodes.get(parent) : undefined;
    if (parentNode && parentNode.kind === "folder") parentNode.children.push(node);
    else roots.push(node);
  }
  const order = (list: TreeNode[]) => {
    list.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "folder" ? -1 : 1));
    list.forEach((node) => order(node.children));
  };
  order(roots);
  return roots;
}

export function PythonExplorer({
  light,
  email,
  entries,
  activePath,
  saving,
  error,
  onOpen,
  onCreate,
  onRemove,
  className,
  folderRequest = 0,
}: {
  light: boolean;
  email: string;
  entries: PythonFileEntry[];
  activePath: string;
  saving: boolean;
  error: string | null;
  onOpen: (path: string) => void;
  onCreate: (parent: string, name: string, kind: "file" | "folder") => string | null;
  onRemove: (path: string) => void;
  className?: string;
  /** Bump to open the new-folder field. */
  folderRequest?: number;
}) {
  const tree = useMemo(() => buildTree(entries), [entries]);
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState(activePath);
  const [draft, setDraft] = useState<{ kind: "file" | "folder"; parent: string } | null>(null);
  const [name, setName] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ path: string; name: string; kind: "file" | "folder" } | null>(null);
  const selected = entries.find((entry) => entry.path === selectedPath);
  const creationParent = selected?.kind === "folder" ? selected.path : parentPath(selectedPath || activePath);
  const parentRef = useRef(creationParent);
  parentRef.current = creationParent;

  useEffect(() => {
    setSelectedPath(activePath);
  }, [activePath]);

  function reveal(path: string) {
    if (!path) return;
    setClosed((prev) => {
      const next = new Set(prev);
      const parts = path.split("/");
      for (let i = 1; i <= parts.length; i += 1) next.delete(parts.slice(0, i).join("/"));
      return next;
    });
  }

  function begin(kind: "file" | "folder", parent = creationParent) {
    reveal(parent);
    setDraft({ kind, parent });
    setName(kind === "file" ? "untitled.py" : "folder");
    setDraftError(null);
  }

  useEffect(() => {
    if (!folderRequest) return;
    setDraft({ kind: "folder", parent: parentRef.current });
    setName("folder");
    setDraftError(null);
  }, [folderRequest]);

  function submitDraft() {
    if (!draft) return;
    const message = onCreate(draft.parent, name, draft.kind);
    if (message) {
      setDraftError(message);
      return;
    }
    const created = workspacePath(draft.parent, name);
    reveal(created);
    if (draft.kind === "folder") setSelectedPath(created);
    setDraft(null);
  }

  return (
    <aside
      className={cn(
        "min-h-0 shrink-0 flex-col overflow-hidden border-r backdrop-blur-xl",
        light ? "border-white/50 bg-white/45 text-ink" : "border-white/10 bg-white/[0.04] text-white",
        className,
      )}
    >
      <div className={cn("flex items-center gap-1 border-b px-2 py-1.5", light ? "border-hairline" : "border-white/10")}>
        <p className="min-w-0 flex-1 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7c90]" title={email || undefined}>
          Explorer
        </p>
        <IconButton label="New file" light={light} onClick={() => begin("file")}>
          <Plus className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="New folder" light={light} onClick={() => begin("folder")}>
          <FolderPlus className="h-3.5 w-3.5" />
        </IconButton>
      </div>
      {draft && (
        <form
          className="border-b border-white/10 px-2 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            submitDraft();
          }}
        >
          <p className={cn("mb-1 font-mono text-[10px] uppercase tracking-[0.12em]", light ? "text-muted" : "text-white/45")}>
            New {draft.kind}
            {draft.parent ? ` in ${draft.parent}` : ""}
          </p>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(
              "w-full border px-2 py-1 font-mono text-[12px] outline-none",
              light ? "border-hairline bg-white text-ink" : "border-white/15 bg-[#1c2836] text-white",
            )}
          />
          {draftError && <p className="mt-1 text-[11px] text-[#c2410c]">{draftError}</p>}
          <div className="mt-1.5 flex gap-1.5">
            <button type="submit" className="bg-[#3d84c6] px-2 py-1 text-[11px] font-bold text-white">
              Create
            </button>
            <button type="button" onClick={() => setDraft(null)} className={cn("px-2 py-1 text-[11px]", light ? "text-muted" : "text-white/55")}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="min-h-0 flex-1 overflow-auto py-1">
        {tree.length === 0 ? (
          <p className={cn("px-3 py-2 text-[12px]", light ? "text-muted" : "text-white/45")}>No files yet.</p>
        ) : (
          tree.map((node) => (
            <TreeRow
              key={node.path}
              node={node}
              depth={0}
              light={light}
              activePath={activePath}
              selectedPath={selectedPath}
              closed={closed}
              onToggle={(path) =>
                setClosed((prev) => {
                  const next = new Set(prev);
                  if (next.has(path)) next.delete(path);
                  else next.add(path);
                  return next;
                })
              }
              onOpen={(path) => {
                setSelectedPath(path);
                onOpen(path);
              }}
              onSelectFolder={(path) => {
                setSelectedPath(path);
                reveal(path);
              }}
              onCreateIn={(path, kind) => begin(kind, path)}
              onAskRemove={setPendingDelete}
            />
          ))
        )}
      </div>
      <p className={cn("flex items-center gap-1 border-t px-2 py-1 font-mono text-[10px]", light ? "border-hairline text-muted" : "border-white/10 text-white/40")}>
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        {error ? <span className="text-[#c2410c]">{error}</span> : saving ? "Saving…" : "Saved to your account"}
      </p>
      {pendingDelete && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="py-delete-title">
          <button type="button" className="absolute inset-0 bg-[#101820]/55" aria-label="Cancel delete" onClick={() => setPendingDelete(null)} />
          <div className={cn("relative z-10 w-full max-w-sm border p-5 shadow-xl", light ? "border-hairline bg-white text-ink" : "border-white/15 bg-[#15202c] text-white")}>
            <h2 id="py-delete-title" className="text-[18px] font-extrabold leading-tight">
              Delete {pendingDelete.name}?
            </h2>
            <p className={cn("mt-2 text-[13px] leading-relaxed", light ? "text-muted" : "text-white/60")}>
              {pendingDelete.kind === "folder"
                ? "This folder and every file inside it are removed from your account."
                : "This file is removed from your account."}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setPendingDelete(null)} className={cn("px-3 py-2 text-[13px] font-semibold", light ? "text-muted" : "text-white/70")}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemove(pendingDelete.path);
                  setPendingDelete(null);
                }}
                className="bg-[#c2410c] px-3 py-2 text-[13px] font-bold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function TreeRow({
  node,
  depth,
  light,
  activePath,
  selectedPath,
  closed,
  onToggle,
  onOpen,
  onSelectFolder,
  onCreateIn,
  onAskRemove,
}: {
  node: TreeNode;
  depth: number;
  light: boolean;
  activePath: string;
  selectedPath: string;
  closed: Set<string>;
  onToggle: (path: string) => void;
  onOpen: (path: string) => void;
  onSelectFolder: (path: string) => void;
  onCreateIn: (path: string, kind: "file" | "folder") => void;
  onAskRemove: (item: { path: string; name: string; kind: "file" | "folder" }) => void;
}) {
  const open = !closed.has(node.path);
  const selected = node.kind === "folder" ? node.path === selectedPath : node.path === activePath;
  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 pr-1",
          selected ? (light ? "bg-white/80 shadow-[inset_0_0_0_1px_rgba(61,132,198,0.35)]" : "bg-white/10") : light ? "hover:bg-white/60" : "hover:bg-white/5",
        )}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        {node.kind === "folder" ? (
          <button type="button" aria-label={open ? "Collapse folder" : "Expand folder"} onClick={() => onToggle(node.path)} className="p-0.5">
            <ChevronRight className={cn("h-3 w-3 transition", open && "rotate-90", light ? "text-muted" : "text-white/50")} />
          </button>
        ) : (
          <span className="w-4" />
        )}
        <button
          type="button"
          onClick={() => (node.kind === "folder" ? onSelectFolder(node.path) : onOpen(node.path))}
          className="flex min-w-0 flex-1 items-center gap-1.5 py-1 text-left"
        >
          {node.kind === "folder" ? (
            open ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#c2410c]" /> : <Folder className="h-3.5 w-3.5 shrink-0 text-[#c2410c]" />
          ) : (
            <FileCode className="h-3.5 w-3.5 shrink-0 text-[#3d84c6]" />
          )}
          <span className="truncate font-mono text-[12px]">{node.name}</span>
        </button>
        {node.kind === "folder" && selected ? (
          <>
            <button
              type="button"
              aria-label={`New file in ${node.name}`}
              title="New file here"
              onClick={() => onCreateIn(node.path, "file")}
              className={cn("p-1", light ? "text-muted hover:text-ink" : "text-white/45 hover:text-white")}
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              type="button"
              aria-label={`New folder in ${node.name}`}
              title="New folder here"
              onClick={() => onCreateIn(node.path, "folder")}
              className={cn("p-1", light ? "text-muted hover:text-ink" : "text-white/45 hover:text-white")}
            >
              <FolderPlus className="h-3 w-3" />
            </button>
          </>
        ) : null}
        <button
          type="button"
          aria-label={`Delete ${node.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onAskRemove({ path: node.path, name: node.name, kind: node.kind });
          }}
          className={cn("p-1 opacity-70 transition sm:opacity-0 sm:group-hover:opacity-100", light ? "text-muted hover:text-ink" : "text-white/40 hover:text-white")}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {node.kind === "folder" && open &&
        node.children.map((child) => (
          <TreeRow
            key={child.path}
            node={child}
            depth={depth + 1}
            light={light}
            activePath={activePath}
            selectedPath={selectedPath}
            closed={closed}
            onToggle={onToggle}
            onOpen={onOpen}
            onSelectFolder={onSelectFolder}
            onCreateIn={onCreateIn}
            onAskRemove={onAskRemove}
          />
        ))}
    </div>
  );
}

function IconButton({ label, light, onClick, children }: { label: string; light: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn("flex h-6 w-6 items-center justify-center", light ? "text-muted hover:bg-white hover:text-ink" : "text-white/55 hover:bg-white/10 hover:text-white")}
    >
      {children}
    </button>
  );
}

export function CompilerAuthDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [role, setRole] = useState<UserRole>("parent");
  const [stage, setStage] = useState<{ step: "email" | "otp"; mode: "login" | "signup"; email: string }>({
    step: "email",
    mode: "login",
    email: "",
  });
  const onStage = useCallback(
    (next: { step: "email" | "otp"; mode: "login" | "signup"; email: string }) => {
      setStage(next);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="compiler-auth-title">
      <button type="button" className="absolute inset-0 bg-[#101820]/55" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-white/10 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:p-6">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-[#6b7c90] hover:text-ink" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <p id="compiler-auth-title" className="pr-8 text-[18px] font-extrabold tracking-tight text-ink">
          {stage.step === "otp"
            ? "Enter the code"
            : stage.mode === "signup"
              ? "Create an account to keep your files"
              : "Sign in to keep your files"}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#6b7c90]">
          {stage.step === "otp"
            ? `Sent to ${stage.email || "your email"}. You stay on the compiler.`
            : "Folders and files stay on this account. You stay on the compiler."}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(
            [
              ["parent", "Parent"],
              ["faculty", "Tutor"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              className={cn(
                "h-10 text-[13px] font-bold",
                role === id ? "bg-[#3d84c6] text-white" : "bg-[#e7f1fb] text-ink hover:bg-[#d7e8f8]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <FacultyAuthForm
          key={role}
          className="mt-4"
          variant="login"
          role={role}
          stay
          tone="compiler"
          onStage={onStage}
          onComplete={onDone}
          onSwitchRole={setRole}
        />
      </div>
    </div>
  );
}
