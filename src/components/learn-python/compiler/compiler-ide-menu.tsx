"use client";

import { COMPILER_TEMPLATES, type CompilerTemplate } from "@/components/learn-python/compiler/templates";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  FileUp,
  FolderArchive,
  Link2,
  Loader2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

function Menu({
  light,
  label,
  icon,
  children,
  align = "right",
}: {
  light: boolean;
  label: string;
  icon?: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[12.5px] font-medium transition",
          light ? "bg-black/[0.04] text-[#3a4553] hover:bg-black/[0.07]" : "bg-white/[0.06] text-white/75 hover:bg-white/10 hover:text-white",
          open && (light ? "bg-black/[0.08]" : "bg-white/12 text-white"),
        )}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown className={cn("h-3 w-3 opacity-60 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          className={cn(
            "absolute top-[calc(100%+6px)] z-40 min-w-[220px] overflow-hidden rounded-xl border py-1 shadow-xl",
            align === "right" ? "right-0" : "left-0",
            light ? "border-hairline bg-white text-ink" : "border-white/10 bg-[#15202c] text-white",
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function Item({
  light,
  onClick,
  icon,
  children,
  disabled,
}: {
  light: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-medium transition disabled:opacity-40",
        light ? "hover:bg-[#e7f1fb]" : "hover:bg-white/8",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function CompilerIdeMenu({
  light,
  onExample,
  onOpenFile,
  onDownloadFile,
  onDownloadZip,
  onImportZip,
  onCopy,
  onShare,
  sharing,
  copied,
  sharedUrl,
}: {
  light: boolean;
  onExample: (template: CompilerTemplate) => void;
  onOpenFile: () => void;
  onDownloadFile: () => void;
  onDownloadZip: () => void;
  onImportZip: () => void;
  onCopy: () => void;
  onShare: () => void;
  sharing?: boolean;
  copied?: boolean;
  sharedUrl?: string | null;
}) {
  return (
    <div className="flex items-center gap-1">
      <Menu light={light} label="Examples" align="left">
        {COMPILER_TEMPLATES.map((template) => (
          <Item key={template.id} light={light} onClick={() => onExample(template)}>
            {template.label}
          </Item>
        ))}
      </Menu>
      <Menu
        light={light}
        label="File"
        icon={<FolderArchive className="h-3.5 w-3.5 opacity-70" />}
      >
        <Item light={light} icon={<Upload className="h-3.5 w-3.5 opacity-70" />} onClick={onOpenFile}>
          Open .py
        </Item>
        <Item light={light} icon={<Download className="h-3.5 w-3.5 opacity-70" />} onClick={onDownloadFile}>
          Download .py
        </Item>
        <Item light={light} icon={<FileUp className="h-3.5 w-3.5 opacity-70" />} onClick={onImportZip}>
          Import zip
        </Item>
        <Item light={light} icon={<FolderArchive className="h-3.5 w-3.5 opacity-70" />} onClick={onDownloadZip}>
          Export zip
        </Item>
        <Item
          light={light}
          icon={copied ? <Check className="h-3.5 w-3.5 text-[#2f9e6e]" /> : <Copy className="h-3.5 w-3.5 opacity-70" />}
          onClick={onCopy}
        >
          {copied ? "Copied" : "Copy code"}
        </Item>
      </Menu>
      <button
        type="button"
        onClick={onShare}
        disabled={sharing}
        title={sharedUrl || "Share link"}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-medium transition disabled:opacity-60",
          light ? "bg-black/[0.04] text-[#3a4553] hover:bg-black/[0.07]" : "bg-white/[0.06] text-white/75 hover:bg-white/10 hover:text-white",
        )}
      >
        {sharing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5 opacity-70" />}
        <span className="hidden sm:inline">{sharedUrl ? "Link ready" : "Share"}</span>
      </button>
    </div>
  );
}
