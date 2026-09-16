"use client";

import {
  AdminSection,
  AdminStatCard,
  AdminTrendChart,
} from "@/components/admin/admin-ui";
import {
  fetchAdminLearnEnrollmentDetail,
  fetchAdminLearnTrack,
  type AdminLearnEnrollmentDetail,
  type AdminLearnEnrollmentRow,
  type AdminLearnTrackResponse,
} from "@/lib/admin-api";
import {
  downloadEnrollmentReceipt,
  downloadEnrollmentReceipts,
  type EnrollmentReceiptData,
} from "@/lib/learn-enrollment-receipt";
import { LEARN_COURSE_MODULES, LEARN_TRACK_LABEL } from "@/lib/learn-enroll";
import { Download, Eye, Lock, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function receiptFromRow(row: AdminLearnEnrollmentRow): EnrollmentReceiptData {
  const p = row.purchase;
  return {
    receiptNumber: row.receiptNumber,
    courseName: row.courseName,
    courseTagline: row.tagline || "Class 3–5 · Computer Science, AI & Math",
    trackLabel: LEARN_TRACK_LABEL,
    modules: LEARN_COURSE_MODULES,
    purchaserName: row.name === "—" ? "" : row.name,
    purchaserEmail: row.email,
    userId: row.userId,
    purchasedAt: row.enrolledAt,
    listPriceInr: p?.listPriceInr ?? 999,
    subtotalInr: p?.subtotalInr ?? 0,
    taxInr: p?.taxInr ?? 0,
    discountInr: p?.discountInr ?? 999,
    totalInr: p?.totalInr ?? row.totalInr ?? 0,
    currency: p?.currency ?? "INR",
    paymentMethod: p?.paymentMethod ?? row.paymentMethod ?? "free",
    expiry: row.expiry || "lifetime",
  };
}

function listJoin(ids: string[], empty = "None yet") {
  return ids.length ? ids.join(", ") : empty;
}

export function AdminLearnTrack({
  adminKey,
  track,
  title,
}: {
  adminKey: string;
  track: "class-3-5" | "class-6-8" | "class-9-12";
  title: string;
}) {
  const [data, setData] = useState<AdminLearnTrackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [detail, setDetail] = useState<AdminLearnEnrollmentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminLearnTrack(adminKey, track));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [adminKey, track]);

  useEffect(() => {
    void load();
  }, [load]);

  async function openDetail(userId: string) {
    setDetailLoading(true);
    setDetailError(null);
    setDetail(null);
    try {
      setDetail(
        await fetchAdminLearnEnrollmentDetail(adminKey, track, userId),
      );
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : "Failed to load detail");
    } finally {
      setDetailLoading(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading Learn…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border-2 border-ink bg-butter/50 px-4 py-3 text-sm text-ink">
        {error}
      </div>
    );
  }

  if (!data) return null;

  if (!data.unlocked) {
    return (
      <AdminSection
        id={`learn-${track}`}
        title={title}
        description="This track is not open for enrollment yet."
      >
        <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-band">
            <Lock className="h-5 w-5 text-muted" />
          </div>
          <p className="mt-4 text-sm font-bold text-ink">Coming soon</p>
          <p className="mt-1 max-w-sm text-xs text-muted">
            Only the Class 3–5 track (Mentr Starter) is live. Enrollments for{" "}
            {title.toLowerCase()} will appear here when unlocked.
          </p>
        </div>
      </AdminSection>
    );
  }

  async function downloadAll() {
    if (!data?.enrollments.length) return;
    setBulkBusy(true);
    try {
      await downloadEnrollmentReceipts(data.enrollments.map(receiptFromRow));
    } finally {
      setBulkBusy(false);
    }
  }

  return (
    <AdminSection
      id={`learn-${track}`}
      title={title}
      description={
        data.course
          ? `${data.course.courseName} — ${data.course.tagline}`
          : undefined
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStatCard
          label="Total enrolled"
          value={data.totals.enrolled}
          accent="coral"
        />
        <AdminStatCard
          label="New (7 days)"
          value={data.totals.newLast7Days}
          accent="sage"
        />
        <AdminStatCard
          label="New (30 days)"
          value={data.totals.newLast30Days}
        />
        <AdminStatCard
          label="Price"
          value="₹0"
          sub="Was ₹999"
          accent="butter"
        />
      </div>

      <div className="mt-4 rounded-xl border border-hairline bg-white p-4">
        <p className="text-xs font-bold text-ink">Registration trend (30 days)</p>
        <p className="mt-0.5 text-[11px] text-muted">
          Daily enrollments in {data.course?.courseName ?? "this track"}
        </p>
        <div className="mt-4">
          <AdminTrendChart
            height={144}
            emptyLabel="No enrollments in the last 30 days"
            points={data.trend.map((point) => ({
              key: point.date,
              total: point.count,
              title: `${formatDay(point.date)}: ${point.count}`,
            }))}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted">
          <span>{data.trend[0] ? formatDay(data.trend[0].date) : ""}</span>
          <span>
            {data.trend[data.trend.length - 1]
              ? formatDay(data.trend[data.trend.length - 1].date)
              : ""}
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-hairline bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-4 py-3">
          <div>
            <p className="text-xs font-bold text-ink">Enrolled parents</p>
            <p className="text-[11px] text-muted">
              {data.enrollments.length} registration
              {data.enrollments.length === 1 ? "" : "s"} · click View for full
              progress
            </p>
          </div>
          <button
            type="button"
            disabled={bulkBusy || data.enrollments.length === 0}
            onClick={() => void downloadAll()}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-hairline bg-cream px-3 text-[11px] font-bold text-ink hover:bg-butter/50 disabled:opacity-50"
          >
            {bulkBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Download all receipts
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead className="bg-cream/80 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">City</th>
                <th className="px-3 py-2 font-semibold">Enrolled</th>
                <th className="px-3 py-2 font-semibold">XP / Streak</th>
                <th className="px-3 py-2 font-semibold">Progress</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-muted"
                  >
                    No enrollments yet
                  </td>
                </tr>
              ) : (
                data.enrollments.map((row) => (
                  <tr
                    key={row.userId}
                    className="border-t border-hairline hover:bg-cream/40"
                  >
                    <td className="px-3 py-2.5 font-medium text-ink">
                      {row.name}
                    </td>
                    <td className="px-3 py-2.5 text-muted">{row.email}</td>
                    <td className="px-3 py-2.5 text-muted">
                      {row.city || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-muted">
                      {formatDate(row.enrolledAt)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-ink">
                      {row.progress.xp} XP · {row.progress.streakDays}d
                    </td>
                    <td className="px-3 py-2.5 text-muted">
                      {row.progress.videosWatched ?? 0}v ·{" "}
                      {row.progress.quizzesCompleted ?? 0}q ·{" "}
                      {row.progress.buildsCompleted ?? 0}b ·{" "}
                      {row.progress.potdCorrect ?? 0} potd
                      {row.progress.currentModuleId
                        ? ` · ${row.progress.currentModuleId}`
                        : ""}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void openDetail(row.userId)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-ink hover:bg-cream"
                          title="View detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            downloadEnrollmentReceipt(receiptFromRow(row))
                          }
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-coral hover:bg-coral-wash"
                          title="Download receipt"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(detail || detailLoading || detailError) && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="presentation"
          onClick={() => {
            setDetail(null);
            setDetailError(null);
          }}
        >
          <div
            role="dialog"
            aria-modal
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-ink bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink">Enrollment detail</p>
                <p className="text-[11px] text-muted">
                  Videos, quizzes, builds, POTD, practice
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetail(null);
                  setDetailError(null);
                }}
                className="rounded-lg p-1.5 text-muted hover:bg-cream"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center gap-2 py-10 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : detailError ? (
              <p className="mt-4 text-sm text-coral">{detailError}</p>
            ) : detail ? (
              <div className="mt-4 space-y-3 text-xs">
                <div className="rounded-xl bg-cream/60 p-3">
                  <p className="font-bold text-ink">{detail.name}</p>
                  <p className="text-muted">{detail.email}</p>
                  <p className="mt-1 text-muted">
                    {detail.phone || "—"} · {detail.city || "—"} ·{" "}
                    {detail.country || "—"}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-ink">
                    {detail.receiptNumber}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-hairline p-2">
                    <p className="text-[10px] uppercase text-muted">XP</p>
                    <p className="text-sm font-bold">{detail.progress.xp}</p>
                  </div>
                  <div className="rounded-lg border border-hairline p-2">
                    <p className="text-[10px] uppercase text-muted">Streak</p>
                    <p className="text-sm font-bold">
                      {detail.progress.streakDays}d
                    </p>
                  </div>
                  <div className="rounded-lg border border-hairline p-2">
                    <p className="text-[10px] uppercase text-muted">Last check-in</p>
                    <p className="text-sm font-bold">
                      {detail.progress.lastCheckInDay || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-hairline p-2">
                    <p className="text-[10px] uppercase text-muted">Last activity</p>
                    <p className="text-sm font-bold">
                      {formatDate(detail.progress.lastActivityAt)}
                    </p>
                  </div>
                </div>
                <p>
                  <span className="font-bold text-ink">Videos: </span>
                  {listJoin(detail.progress.videosWatched)}
                </p>
                <p>
                  <span className="font-bold text-ink">Quizzes: </span>
                  {listJoin(detail.progress.quizzesCompleted)}
                </p>
                <p>
                  <span className="font-bold text-ink">Modules done: </span>
                  {listJoin(detail.progress.modulesCompleted)}
                </p>
                <p>
                  <span className="font-bold text-ink">Builds: </span>
                  {listJoin(detail.progress.buildsCompleted)}
                </p>
                <p>
                  <span className="font-bold text-ink">POTD: </span>
                  {detail.progress.potdCorrect} correct /{" "}
                  {detail.progress.potdAttempted} attempted
                </p>
                <p>
                  <span className="font-bold text-ink">Practice: </span>
                  {detail.progress.practiceCorrect} correct /{" "}
                  {detail.progress.practiceAttempted} attempted
                </p>
                {detail.recentPotd.length > 0 ? (
                  <div>
                    <p className="font-bold text-ink">Recent POTD</p>
                    <ul className="mt-1 max-h-32 space-y-1 overflow-y-auto">
                      {detail.recentPotd.map((p) => (
                        <li key={p.dateKey} className="text-muted">
                          {p.dateKey}: {p.correct ? "✓" : "✗"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminSection>
  );
}
