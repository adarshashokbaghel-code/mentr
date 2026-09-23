"use client";

import { Button } from "@/components/ui/button";
import {
  premiumMentorApi,
  type PremiumRevealQuota,
  type PremiumRevealRow,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Eye, Loader2, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ParentRevealHistorySidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<PremiumRevealRow[]>([]);
  const [quota, setQuota] = useState<PremiumRevealQuota | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await premiumMentorApi.reveals();
      setRows(data.reveals || []);
      setQuota(data.quota || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l-2 border-ink bg-cream shadow-xl",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b-2 border-ink bg-ink px-4 py-4 text-white">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-butter">
              Premium
            </p>
            <h2 className="mt-1 text-lg font-bold">Contact reveals</h2>
            {quota ? (
              <p className="mt-1 text-xs text-white/60">
                {quota.usedToday}/{quota.dailyLimit} today · {quota.remaining}{" "}
                left
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </p>
          ) : error ? (
            <p className="text-sm text-coral">{error}</p>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-ink/20 bg-white px-4 py-8 text-center">
              <Eye className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 text-sm font-semibold text-ink">
                No reveals yet
              </p>
              <p className="mt-1 text-xs text-muted">
                Unlock parent contacts from the Premium directory.
              </p>
              <Link href="/parentslist" className="mt-4 inline-block">
                <Button size="sm" className="gap-1.5">
                  Open parent list
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {rows.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-hairline bg-white px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        {r.parentName}
                      </p>
                      <p className="text-xs text-muted">
                        {[r.parentArea, r.parentCity].filter(Boolean).join(", ") ||
                          "—"}
                      </p>
                      <p className="mt-1 font-mono text-xs tabular-nums text-ink">
                        {r.parentPhone}
                      </p>
                    </div>
                    {r.whatsappUrl ? (
                      <a
                        href={r.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-md bg-sage-wash p-2 text-sage"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[11px] text-muted">
                    Revealed {formatWhen(r.revealedAt)}
                    {r.hasPosted ? " · had posts" : " · no posts"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-hairline bg-white px-4 py-3">
          <Link href="/parentslist" className="block">
            <Button className="w-full" variant="secondary">
              Browse parent directory
            </Button>
          </Link>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
