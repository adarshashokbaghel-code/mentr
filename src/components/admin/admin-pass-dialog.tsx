"use client";

import { cn } from "@/lib/utils";
import { Lock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type AdminPassDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: (adminPass: string) => void;
  onClose: () => void;
};

export function AdminPassDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  busy,
  error,
  onConfirm,
  onClose,
}: AdminPassDialogProps) {
  const [pass, setPass] = useState("");

  useEffect(() => {
    if (!open) {
      setPass("");
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, busy, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Dismiss"
        disabled={busy}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-pass-title"
        className={cn(
          "relative z-10 w-full max-w-sm overflow-hidden",
          "rounded-t-2xl border border-hairline bg-white",
          "shadow-[0_20px_50px_rgba(26,35,28,0.18)] sm:rounded-2xl",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <form
          className="px-5 pb-2 pt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!pass.trim() || busy) return;
            onConfirm(pass);
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink">
            <Lock className="h-4 w-4" />
          </div>
          <h2
            id="admin-pass-title"
            className="mt-3 text-[16px] font-bold tracking-tight text-ink"
          >
            {title}
          </h2>
          <p className="mt-1.5 text-[13px] leading-snug text-muted">
            {description}
          </p>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted">
              Admin password
            </span>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={pass}
              disabled={busy}
              onChange={(e) => setPass(e.target.value)}
              className="h-10 w-full rounded-md border border-hairline bg-cream px-3 text-sm text-ink outline-none focus:border-ink disabled:opacity-60"
              placeholder="Enter ADMIN_PASS"
            />
          </label>

          {error && (
            <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[12px] font-medium text-coral-dark">
              {error}
            </p>
          )}

          <div className="mt-4 -mx-5 flex flex-col-reverse gap-2 border-t border-hairline bg-cream/30 px-5 py-3.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-muted transition hover:bg-white hover:text-ink disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !pass.trim()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-coral px-4 text-sm font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60"
            >
              {busy ? "Working…" : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
