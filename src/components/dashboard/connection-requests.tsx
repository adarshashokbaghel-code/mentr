"use client";

import { timeAgo } from "@/components/dashboard/widgets";
import { connectionsApi, type ConnectionRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, Inbox, Loader2, Lock, X } from "lucide-react";
import { useState } from "react";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  accepted: { label: "Connected", cls: "bg-sage-wash text-sage" },
  declined: { label: "Declined", cls: "bg-cream-band text-muted" },
};

/**
 * Faculty inbox for parent connection requests. Accepting a request is
 * what reveals the tutor's WhatsApp number to that parent — nothing else
 * ever exposes it.
 */
export function ConnectionRequestsSection({
  requests,
  loading,
  onUpdated,
}: {
  requests: ConnectionRequest[];
  loading: boolean;
  onUpdated: (updated: ConnectionRequest) => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const pending = requests.filter((r) => r.status === "pending");
  const handled = requests.filter((r) => r.status !== "pending").slice(0, 4);

  async function respond(id: string, action: "accept" | "decline") {
    setBusyId(id);
    setError("");
    try {
      const { request } = await connectionsApi.respond(id, action);
      onUpdated(request);
    } catch {
      setError("Couldn't update the request — try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          Connection requests
          {pending.length > 0 && (
            <span className="rounded-md bg-coral px-1.5 py-0.5 text-xs font-bold text-white">
              {pending.length}
            </span>
          )}
        </h2>
      </div>

      <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted">
        <Lock className="mt-0.5 h-3 w-3 shrink-0" />
        Once you accept a request, your WhatsApp number becomes visible to
        that parent — and only to them.
      </p>

      {error && (
        <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-4 rounded-lg border border-hairline bg-white px-5 py-8 text-center text-sm text-muted">
          Loading…
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-hairline bg-white px-5 py-8 text-center">
          <Inbox className="mx-auto h-5 w-5 text-muted" />
          <p className="mt-2 text-sm font-medium text-ink">No requests yet</p>
          <p className="mt-1 text-sm text-muted">
            When a parent wants to talk, their request and message land here
            for you to review.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {pending.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)]"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
                  {r.parentName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="text-sm font-semibold text-ink">
                      {r.parentName}
                    </p>
                    <p className="text-xs text-muted">
                      {r.parentArea ? `${r.parentArea} · ` : ""}
                      {timeAgo(r.sentAt)}
                    </p>
                  </div>
                  <blockquote className="mt-2 rounded-md border-l-2 border-coral/60 bg-cream px-3 py-2 text-[13px] leading-relaxed text-ink/85">
                    {r.message}
                  </blockquote>
                </div>
              </div>

              <div className="mt-3 flex gap-2 sm:justify-end">
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => respond(r.id, "decline")}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-hairline bg-white px-4 text-[13px] font-semibold text-ink transition hover:border-coral/50 hover:text-coral-dark disabled:opacity-50 sm:flex-none"
                >
                  <X className="h-3.5 w-3.5" />
                  Decline
                </button>
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => respond(r.id, "accept")}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-sage px-4 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:flex-none"
                >
                  {busyId === r.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Accept &amp; share number
                </button>
              </div>
            </li>
          ))}

          {handled.length > 0 && (
            <li className="overflow-hidden rounded-lg border border-hairline bg-white">
              <ul className="divide-y divide-hairline">
                {handled.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-band text-xs font-bold text-ink/60">
                      {r.parentName.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-ink">
                        {r.parentName}
                      </p>
                      <p className="truncate text-[11px] text-muted">
                        {r.respondedAt ? timeAgo(r.respondedAt) : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        STATUS_BADGE[r.status]?.cls,
                      )}
                    >
                      {STATUS_BADGE[r.status]?.label}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
