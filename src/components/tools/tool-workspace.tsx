"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function ToolField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold text-muted">{label}</span>
      <div className="mt-1">{children}</div>
      {hint ? (
        <span className="mt-1 block text-[11px] font-medium text-muted">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export const toolInputClass =
  "w-full rounded-xl border border-hairline bg-white px-3 py-2.5 text-[14px] font-semibold text-ink outline-none focus:border-ink";

export function ToolWorkspace({
  form,
  preview,
  previewTitle = "Preview",
  emptyPreview,
}: {
  form: ReactNode;
  preview: ReactNode;
  previewTitle?: string;
  emptyPreview?: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-hairline bg-cream/30 p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Inputs
        </p>
        {form}
      </div>
      <div className="rounded-xl border border-hairline bg-white p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {previewTitle}
        </p>
        <div
          className={cn(
            "mt-3 min-h-[220px] text-[13px] font-medium leading-relaxed text-ink",
            emptyPreview && "flex items-center justify-center text-muted",
          )}
        >
          {preview}
        </div>
      </div>
    </div>
  );
}

export function ToolActionRow({
  children,
  busy,
  error,
}: {
  children: ReactNode;
  busy?: boolean;
  error?: string | null;
}) {
  return (
    <div className="mt-4 space-y-2">
      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-coral-wash px-3 py-2 text-[13px] font-semibold text-coral-dark"
        >
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {busy ? (
          <span className="inline-flex items-center gap-2 text-[13px] font-bold text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Working…
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function ToolBtn({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-[13px] font-extrabold transition disabled:opacity-50",
        variant === "primary" && "bg-coral text-white hover:brightness-95",
        variant === "secondary" &&
          "border-2 border-ink bg-white text-ink hover:bg-cream",
        variant === "ghost" && "text-muted hover:bg-cream hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
