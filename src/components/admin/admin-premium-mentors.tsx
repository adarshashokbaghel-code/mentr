"use client";

import { AdminPassDialog } from "@/components/admin/admin-pass-dialog";
import { AdminSection } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  fetchAdminPremiumMentors,
  verifyAdminPremiumMentor,
  type AdminPremiumMentorRow,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Check, Crown, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminPremiumMentors({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<AdminPremiumMentorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<AdminPremiumMentorRow | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPremiumMentors(adminKey);
      setRows(data.mentors);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const pending = rows.filter((r) => r.status === "pending");
  const verified = rows.filter((r) => r.status === "verified");

  async function confirmVerify(adminPass: string) {
    if (!verifyTarget) return;
    setBusy(true);
    setPassError(null);
    try {
      await verifyAdminPremiumMentor(adminKey, verifyTarget.id, adminPass);
      setVerifyTarget(null);
      await load();
    } catch (e) {
      setPassError(e instanceof Error ? e.message : "Verify failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AdminSection
        id="premium-mentors"
        title="Premium mentors"
        description="Mentors who paid via QR and uploaded a payment screenshot — verify to activate Premium on their dashboard"
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void load()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Refresh
          </Button>
        }
      >
        {error ? (
          <p className="rounded-lg border border-coral/30 bg-coral-wash/40 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-butter/40 bg-butter/15 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Pending
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {pending.length}
            </p>
          </div>
          <div className="rounded-xl border border-sage/30 bg-sage-wash/50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Verified
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {verified.length}
            </p>
          </div>
        </div>

        {loading && rows.length === 0 ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-hairline bg-white px-4 py-8 text-center text-sm text-muted">
            No premium applications yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.id}
                className={cn(
                  "overflow-hidden rounded-xl border bg-white",
                  row.status === "pending"
                    ? "border-butter/50"
                    : "border-sage/30",
                )}
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                  <div className="shrink-0">
                    {row.screenshotUrl ? (
                      <a
                        href={row.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-lg border border-hairline"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={row.screenshotUrl}
                          alt={`Payment screenshot from ${row.name}`}
                          className="h-36 w-28 object-cover sm:h-40 sm:w-32"
                        />
                      </a>
                    ) : (
                      <div className="flex h-36 w-28 items-center justify-center rounded-lg border border-dashed border-hairline bg-cream text-xs text-muted sm:h-40 sm:w-32">
                        No SS
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-ink">{row.name}</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          row.status === "verified"
                            ? "bg-sage-wash text-sage"
                            : "bg-butter/40 text-ink",
                        )}
                      >
                        {row.status === "verified" ? (
                          <>
                            <Crown className="h-3 w-3" /> Verified
                          </>
                        ) : (
                          "Pending"
                        )}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {row.email}
                      {row.phone ? ` · ${row.phone}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {[row.area, row.city].filter(Boolean).join(", ") || "—"}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Submitted {formatWhen(row.submittedAt)}
                      {row.verifiedAt
                        ? ` · Verified ${formatWhen(row.verifiedAt)}`
                        : ""}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {row.screenshotUrl ? (
                        <a
                          href={row.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline bg-cream px-3 text-[11px] font-semibold text-ink transition hover:bg-white"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open SS
                        </a>
                      ) : null}
                      {row.status === "pending" ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setPassError(null);
                            setVerifyTarget(row);
                          }}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Verify
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminSection>

      <AdminPassDialog
        open={!!verifyTarget}
        title="Verify Premium Mentor"
        description={
          verifyTarget
            ? `Confirm payment for ${verifyTarget.name} (${verifyTarget.email}). This unlocks Premium on their mentor dashboard.`
            : ""
        }
        confirmLabel="Verify premium"
        busy={busy}
        error={passError}
        onConfirm={confirmVerify}
        onClose={() => {
          if (!busy) setVerifyTarget(null);
        }}
      />
    </>
  );
}
