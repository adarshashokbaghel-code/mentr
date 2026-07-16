"use client";

import { cn } from "@/lib/utils";
import {
  Check,
  Loader2,
  Lock,
  MapPin,
  Navigation,
  Shield,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface LocationPermissionDialogProps {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onAllow: () => void;
  onNotNow: () => void;
  onClose: () => void;
}

export function LocationPermissionDialog({
  open,
  loading,
  error,
  onAllow,
  onNotNow,
  onClose,
}: LocationPermissionDialogProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, loading, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]"
        aria-label="Dismiss"
        disabled={loading}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-dialog-title"
        className={cn(
          "relative z-10 flex w-full max-w-[420px] flex-col overflow-hidden",
          "rounded-t-xl border border-hairline bg-white shadow-[0_24px_64px_rgba(26,35,28,0.22)]",
          "sm:rounded-xl",
        )}
      >
        {/* Top visual */}
        <div className="relative border-b border-hairline bg-cream px-5 pb-5 pt-5 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-white hover:text-ink disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-coral text-white shadow-sm">
            <Navigation className="h-6 w-6" strokeWidth={2} />
          </div>

          <h2
            id="location-dialog-title"
            className="mt-4 text-center text-lg font-semibold tracking-tight text-ink"
          >
            Share your location
          </h2>
          <p className="mx-auto mt-1.5 max-w-[32ch] text-center text-sm leading-relaxed text-muted">
            Mentr uses your location to show teachers near you on the map —
            anywhere in the world.
          </p>
        </div>

        {/* Trust points */}
        <div className="space-y-2.5 px-5 py-4 sm:px-6">
          <TrustRow
            icon={<MapPin className="h-3.5 w-3.5 text-coral" />}
            title="Nearby teachers first"
            desc="Sort and pin faculty closest to you"
          />
          <TrustRow
            icon={<Shield className="h-3.5 w-3.5 text-sage" />}
            title="Private by default"
            desc="We don’t save or share your exact pin"
          />
          <TrustRow
            icon={<Lock className="h-3.5 w-3.5 text-ink/60" />}
            title="Browser-controlled"
            desc="Your browser will ask — you can change it anytime"
          />

          {error && (
            <div className="rounded-md border border-coral/30 bg-coral-wash px-3 py-2.5 text-xs font-medium leading-relaxed text-coral-dark">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 border-t border-hairline bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAllow();
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Waiting for browser…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Allow location access
              </>
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onNotNow}
            className="flex h-9 w-full items-center justify-center rounded-md text-sm font-medium text-muted transition hover:bg-cream hover:text-ink disabled:opacity-50"
          >
            Not now
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function TrustRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-hairline bg-cream/60 px-3 py-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
    </div>
  );
}
