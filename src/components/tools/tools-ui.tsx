"use client";

import { cn } from "@/lib/utils";
import { FileUp, Loader2, X } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ToolsDropzone({
  accept,
  multiple,
  onFiles,
  label,
  hint,
  disabled,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const take = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      onFiles(Array.from(list));
    },
    [onFiles],
  );

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    take(e.dataTransfer.files);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    take(e.target.files);
    e.target.value = "";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition",
        dragging
          ? "border-coral bg-coral-wash"
          : "border-hairline bg-cream/50 hover:border-ink",
        disabled && "opacity-50",
      )}
    >
      <FileUp className="h-8 w-8 text-coral" />
      <span className="text-[15px] font-extrabold text-ink">{label}</span>
      {hint ? (
        <span className="max-w-sm text-[12px] font-medium text-muted">{hint}</span>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onChange}
      />
    </button>
  );
}

export function ToolsFileList({
  files,
  onRemove,
  onMove,
}: {
  files: File[];
  onRemove: (index: number) => void;
  onMove?: (from: number, to: number) => void;
}) {
  if (!files.length) return null;
  return (
    <ul className="mt-3 space-y-2">
      {files.map((f, i) => (
        <li
          key={`${f.name}-${i}`}
          className="flex items-center gap-2 rounded-xl border border-hairline bg-white px-3 py-2"
        >
          <span className="w-6 text-[12px] font-bold text-muted">{i + 1}</span>
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">
            {f.name}
          </span>
          <span className="shrink-0 text-[11px] font-medium text-muted">
            {(f.size / 1024).toFixed(0)} KB
          </span>
          {onMove ? (
            <>
              <button
                type="button"
                disabled={i === 0}
                onClick={() => onMove(i, i - 1)}
                className="rounded-md px-2 py-1 text-[11px] font-bold text-ink hover:bg-cream disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === files.length - 1}
                onClick={() => onMove(i, i + 1)}
                className="rounded-md px-2 py-1 text-[11px] font-bold text-ink hover:bg-cream disabled:opacity-40"
              >
                ↓
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="rounded-md p-1.5 text-muted hover:bg-cream hover:text-ink"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function ToolsActionBar({
  children,
  busy,
  error,
}: {
  children: ReactNode;
  busy?: boolean;
  error?: string | null;
}) {
  return (
    <div className="mt-4 space-y-3">
      {error ? (
        <p className="rounded-xl bg-coral-wash px-3 py-2 text-[13px] font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {busy ? (
          <span className="inline-flex items-center gap-2 text-[13px] font-bold text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Working in your browser…
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function ToolsPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-coral px-5 text-[14px] font-extrabold text-white transition hover:brightness-95 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
