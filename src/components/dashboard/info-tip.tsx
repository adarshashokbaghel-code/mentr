"use client";

import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * Compact “what is this?” control — opens on hover (desktop) and click (mobile).
 */
export function InfoTip({
  title,
  children,
  className,
  side = "bottom",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  side?: "bottom" | "top";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent | TouchEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      ref={wrapRef}
      className={cn("relative inline-flex align-middle", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`About ${title}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition",
          "hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40",
          open && "bg-cream text-ink",
        )}
      >
        <Info className="h-3.5 w-3.5" strokeWidth={2.25} />
      </button>

      {open ? (
        <div
          id={panelId}
          role="tooltip"
          className={cn(
            "absolute z-40 w-[min(calc(100vw-2rem),280px)] rounded-xl border border-hairline bg-white p-3.5 text-left shadow-[0_8px_28px_rgba(28,26,23,0.14)]",
            side === "bottom"
              ? "left-0 top-[calc(100%+8px)] sm:left-1/2 sm:-translate-x-1/2"
              : "bottom-[calc(100%+8px)] left-0 sm:left-1/2 sm:-translate-x-1/2",
          )}
        >
          <p className="text-[12px] font-extrabold tracking-tight text-ink">
            {title}
          </p>
          <div className="mt-1.5 space-y-1.5 text-[12px] font-medium leading-relaxed text-muted">
            {children}
          </div>
        </div>
      ) : null}
    </span>
  );
}
