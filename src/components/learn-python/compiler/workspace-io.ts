import type { PythonFileEntry } from "@/components/learn-python/compiler/use-python-files";
import JSZip from "jszip";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, text: string) {
  triggerDownload(new Blob([text], { type: "text/x-python;charset=utf-8" }), filename);
}

export async function downloadWorkspaceZip(entries: PythonFileEntry[], zipName = "python-workspace.zip") {
  const zip = new JSZip();
  const files = entries.filter((e) => e.kind === "file");
  if (files.length === 0) {
    zip.file("main.py", "# empty workspace\n");
  } else {
    for (const file of files) zip.file(file.path, file.content ?? "");
    for (const folder of entries.filter((e) => e.kind === "folder")) {
      if (!files.some((f) => f.path.startsWith(`${folder.path}/`))) zip.folder(folder.path);
    }
  }
  const blob = await zip.generateAsync({ type: "blob" });
  triggerDownload(blob, zipName);
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function pickPythonFile(): Promise<{ name: string; content: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".py,text/x-python,text/plain";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const content = await file.text();
      resolve({ name: file.name.replace(/\\/g, "/").split("/").pop() || "main.py", content });
    };
    input.click();
  });
}

export function pickZipFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip,application/zip";
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}

const NAME = /^[A-Za-z_][A-Za-z0-9._-]{0,48}$/;

export async function entriesFromZip(file: File): Promise<{ entries: PythonFileEntry[]; activePath: string } | { error: string }> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    return { error: "That zip could not be opened." };
  }

  const entries: PythonFileEntry[] = [];
  const paths = Object.keys(zip.files).sort();
  for (const raw of paths) {
    const item = zip.files[raw];
    if (!item || raw.startsWith("__MACOSX/") || raw.includes("/.")) continue;
    const normalized = raw.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
    if (!normalized) continue;
    const parts = normalized.split("/").filter(Boolean);
    if (parts.length === 0 || parts.length > 6) continue;
    if (parts.some((part) => !NAME.test(part))) continue;

    if (item.dir || raw.endsWith("/")) {
      const path = parts.join("/");
      if (!entries.some((e) => e.path === path)) entries.push({ path, kind: "folder", content: "" });
      continue;
    }

    for (let i = 1; i < parts.length; i += 1) {
      const folder = parts.slice(0, i).join("/");
      if (!entries.some((e) => e.path === folder)) entries.push({ path: folder, kind: "folder", content: "" });
    }
    const path = parts.join("/");
    if (entries.some((e) => e.path === path)) continue;
    const content = await item.async("string");
    entries.push({ path, kind: "file", content: content.slice(0, 80_000) });
  }

  const files = entries.filter((e) => e.kind === "file");
  if (files.length === 0) return { error: "No .py files found in that zip." };
  if (entries.length > 80) return { error: "That zip has too many files." };
  const main = files.find((f) => f.path === "main.py" || f.path.endsWith("/main.py")) ?? files[0];
  return { entries, activePath: main.path };
}
