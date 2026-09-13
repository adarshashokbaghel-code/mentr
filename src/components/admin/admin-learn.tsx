"use client";

import {
  AdminSection,
  AdminStatCard,
  AdminTrendChart,
} from "@/components/admin/admin-ui";
import {
  fetchAdminLearnTrack,
  type AdminLearnEnrollmentRow,
  type AdminLearnTrackResponse,
} from "@/lib/admin-api";
import {
  downloadEnrollmentReceipt,
  downloadEnrollmentReceipts,
  type EnrollmentReceiptData,
} from "@/lib/learn-enrollment-receipt";
import { LEARN_COURSE_MODULES, LEARN_TRACK_LABEL } from "@/lib/learn-enroll";
import { Download, Lock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso?: string) {
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

  const maxTrend = Math.max(...data.trend.map((t) => t.count), 1);

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
              {data.enrollments.length === 1 ? "" : "s"}
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
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead className="bg-cream/80 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Receipt</th>
                <th className="px-3 py-2 font-semibold">Enrolled</th>
                <th className="px-3 py-2 font-semibold">Paid</th>
                <th className="px-3 py-2 font-semibold">Progress</th>
                <th className="px-3 py-2 font-semibold">PDF</th>
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
                    <td className="px-3 py-2.5 font-mono text-[10px] text-ink">
                      {row.receiptNumber}
                    </td>
                    <td className="px-3 py-2.5 text-muted">
                      {formatDate(row.enrolledAt)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-ink">
                      ₹{row.totalInr}
                      <span className="ml-1 text-[10px] text-muted line-through">
                        ₹999
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted">
                      {row.progress.modulesCompleted} mods · {row.progress.xp}{" "}
                      XP
                      {row.progress.currentModuleId
                        ? ` · ${row.progress.currentModuleId}`
                        : ""}
                    </td>
                    <td className="px-3 py-2.5">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSection>
  );
}
