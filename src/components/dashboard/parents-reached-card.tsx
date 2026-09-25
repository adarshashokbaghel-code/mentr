"use client";

import { timeAgo } from "@/components/dashboard/widgets";
import {
  guestRequirementsApi,
  type GuestRequirementLead,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  ThumbsDown,
  UsersRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const STATUS_LABEL: Record<GuestRequirementLead["status"], string> = {
  new: "New",
  not_interested: "Not interested",
  got_hired: "Got hired",
};

/**
 * Stat card → popup for Premium guest parent requests (no account).
 */
export function ParentsReachedCard() {
  const [rows, setRows] = useState<GuestRequirementLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    guestRequirementsApi
      .mine()
      .then((data) => setRows(data.requirements))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#parents-reached") {
      setOpen(true);
      document.getElementById("parents-reached")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const newCount = rows.filter((r) => r.status === "new").length;

  async function toggleDetails(row: GuestRequirementLead) {
    setError("");
    if (expandedId === row.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(row.id);
    if (row.status === "new") {
      try {
        const { requirement } = await guestRequirementsApi.action(
          row.id,
          "opened",
        );
        setRows((prev) =>
          prev.map((r) => (r.id === requirement.id ? requirement : r)),
        );
      } catch {
        // Expand still works if activity write fails
      }
    }
  }

  async function respond(
    id: string,
    action: "not_interested" | "got_hired",
  ) {
    setBusyId(id);
    setError("");
    try {
      const { requirement } = await guestRequirementsApi.action(id, action);
      setRows((prev) =>
        prev.map((r) => (r.id === requirement.id ? requirement : r)),
      );
    } catch {
      setError("Could not save — try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div id="parents-reached" className="scroll-mt-24">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "w-full rounded-xl border border-hairline bg-white p-4 text-left shadow-[0_1px_3px_rgba(28,26,23,0.05)] transition sm:p-5",
          "hover:border-ink/15 hover:shadow-[0_4px_14px_rgba(28,26,23,0.08)]",
          open && "border-ink/15 shadow-[0_4px_14px_rgba(28,26,23,0.08)]",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-medium text-muted">Parents reached</p>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-lavender text-ink">
            <UsersRound className="h-4 w-4" />
            {newCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-extrabold text-white">
                {newCount}
              </span>
            ) : null}
          </span>
        </div>

        {loading ? (
          <span className="mt-4 block h-8 w-14 animate-pulse rounded-md bg-cream-band" />
        ) : (
          <p className="mt-4 text-[32px] font-bold leading-none tracking-tight text-ink tabular-nums">
            {rows.length}
          </p>
        )}

        <div className="mt-4 flex min-h-[26px] items-center border-t border-hairline pt-2.5">
          <span className="truncate text-xs text-muted">
            {rows.length > 0
              ? "Premium requests · tap to review"
              : "when parents send a need without login"}
          </span>
        </div>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="parents-reached-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close"
            onClick={() => {
              setExpandedId(null);
              setOpen(false);
            }}
          />

          <div className="champs-pop relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-xl border border-hairline bg-white shadow-xl sm:rounded-xl">
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
              <div>
                <h2
                  id="parents-reached-title"
                  className="text-lg font-bold text-ink"
                >
                  Parents reached
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Premium requests sent without a parent account
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExpandedId(null);
                  setOpen(false);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-cream"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-3 py-3">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </div>
              ) : rows.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <UsersRound className="mx-auto h-6 w-6 text-hairline" />
                  <p className="mt-2 text-sm font-medium text-ink">
                    No requests yet
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    When a parent uses &quot;Send requirement without
                    login&quot; on your profile, it shows up here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {rows.map((row) => {
                    const expanded = expandedId === row.id;
                    const busy = busyId === row.id;
                    return (
                      <li
                        key={row.id}
                        className={cn(
                          "overflow-hidden rounded-xl border border-hairline bg-white transition",
                          expanded && "border-ink/15 shadow-sm",
                        )}
                      >
                        <div className="flex items-center gap-3 px-3 py-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender text-sm font-bold text-ink">
                            {row.name.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="truncate text-sm font-semibold text-ink">
                                {row.name}
                              </p>
                              {row.status === "new" ? (
                                <span className="rounded bg-coral-wash px-1.5 py-0.5 text-[10px] font-bold text-coral-dark">
                                  New
                                </span>
                              ) : (
                                <span className="rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold text-muted">
                                  {STATUS_LABEL[row.status]}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 truncate text-xs text-muted">
                              {row.requirement}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void toggleDetails(row)}
                            className={cn(
                              "inline-flex h-8 shrink-0 items-center gap-1 rounded-full border px-3 text-[11px] font-bold transition",
                              expanded
                                ? "border-ink bg-ink text-white"
                                : "border-hairline bg-cream/80 text-ink hover:border-ink/25 hover:bg-cream",
                            )}
                          >
                            {expanded ? "Hide" : "View details"}
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                expanded && "rotate-180",
                              )}
                            />
                          </button>
                        </div>

                        {expanded ? (
                          <div className="border-t border-hairline bg-cream/40 px-3 py-3">
                            <p className="text-[11px] font-medium text-muted">
                              {timeAgo(row.createdAt)}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-ink/90">
                              {row.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                              <a
                                href={`tel:${row.phone}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 font-semibold text-ink hover:bg-white"
                              >
                                <Phone className="h-3.5 w-3.5 text-sage" />
                                {row.phone}
                              </a>
                              <a
                                href={`mailto:${row.email}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 font-semibold text-ink hover:bg-white"
                              >
                                <Mail className="h-3.5 w-3.5 text-coral" />
                                {row.email}
                              </a>
                            </div>

                            {error && expandedId === row.id ? (
                              <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[12px] font-medium text-coral-dark">
                                {error}
                              </p>
                            ) : null}

                            {row.status === "new" ? (
                              <div className="mt-3 flex gap-2">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    void respond(row.id, "not_interested")
                                  }
                                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-hairline bg-white text-[12px] font-semibold text-ink hover:bg-cream disabled:opacity-50"
                                >
                                  {busy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <ThumbsDown className="h-3.5 w-3.5" />
                                  )}
                                  Not interested
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    void respond(row.id, "got_hired")
                                  }
                                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sage text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                                >
                                  {busy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                  Got hired
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
