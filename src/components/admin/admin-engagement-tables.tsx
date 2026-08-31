"use client";

import {
  fetchAdminOtpActivity,
  fetchAdminProfileViews,
  type AdminOtpRow,
  type AdminProfileViewRow,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminEngagementTables({ adminKey }: { adminKey: string }) {
  const [views, setViews] = useState<AdminProfileViewRow[]>([]);
  const [sessions, setSessions] = useState<AdminOtpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [viewData, otpData] = await Promise.all([
        fetchAdminProfileViews(adminKey),
        fetchAdminOtpActivity(adminKey),
      ]);
      setViews(viewData.views);
      setSessions(otpData.sessions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <p className="mt-4 flex items-center gap-2 border border-hairline bg-white px-3 py-6 text-xs text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading engagement details…
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-4 border border-hairline bg-butter/40 px-3 py-3 text-xs text-ink">
        {error}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="border border-hairline bg-white">
        <div className="border-b border-hairline px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Profile views · {views.length} pairs
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Who viewed which tutor profile — viewer → tutor
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-3 py-2">Viewer</th>
                <th className="px-3 py-2">Tutor viewed</th>
                <th className="px-3 py-2">Views</th>
                <th className="px-3 py-2">Last viewed</th>
              </tr>
            </thead>
            <tbody>
              {views.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-muted">
                    No profile views yet
                  </td>
                </tr>
              ) : (
                views.map((row) => (
                  <tr key={row.id} className="border-b border-hairline/70 hover:bg-cream/50">
                    <td className="px-3 py-2">
                      <span className="block font-medium text-ink">{row.viewerName}</span>
                      <span className="block text-[10px] text-muted">{row.viewerEmail}</span>
                      {row.viewerArea && (
                        <span className="block text-[10px] text-muted">{row.viewerArea}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="block font-medium text-ink">{row.teacherName}</span>
                      <span className="block text-[10px] text-muted">{row.teacherEmail}</span>
                    </td>
                    <td className="px-3 py-2 tabular-nums font-medium text-ink">{row.count}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted">
                      {formatDateTime(row.lastViewedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-hairline bg-white">
        <div className="border-b border-hairline px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Auth activity · {sessions.length} recent OTP sends
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Login and signup verification attempts
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Purpose</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Verified</th>
                <th className="px-3 py-2">Attempts</th>
                <th className="px-3 py-2">Sent at</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted">
                    No OTP activity
                  </td>
                </tr>
              ) : (
                sessions.map((row) => (
                  <tr key={row.id} className="border-b border-hairline/70 hover:bg-cream/50">
                    <td className="px-3 py-2 text-muted">{row.email}</td>
                    <td className="px-3 py-2 capitalize text-ink">{row.purpose}</td>
                    <td className="px-3 py-2 capitalize text-muted">{row.role}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "text-[11px] font-medium",
                          row.consumed ? "text-sage" : "text-muted",
                        )}
                      >
                        {row.consumed ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-muted">{row.attempts}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted">
                      {formatDateTime(row.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
