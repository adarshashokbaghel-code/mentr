"use client";

import {
  AdminSection,
  AdminStatCard,
  AdminTrendChart,
} from "@/components/admin/admin-ui";
import {
  fetchAdminLearnPython,
  fetchAdminLearnPythonDetail,
  type AdminLearnPythonDetail,
  type AdminLearnPythonResponse,
} from "@/lib/admin-api";
import { Eye, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

const AWARD_LABEL: Record<string, string> = {
  login: "Daily login",
  bank: "Practice",
  video: "Video",
  goal: "Example goal",
  trace: "Example trace",
  q: "Lesson practice",
  check: "Quick check",
};

function awardLabel(key: string) {
  const i = key.indexOf(":");
  return `${AWARD_LABEL[key.slice(0, i)] ?? key.slice(0, i)} · ${key.slice(i + 1)}`;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-hairline p-2">
      <p className="text-[10px] uppercase text-muted">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

export function AdminLearnPython({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<AdminLearnPythonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<AdminLearnPythonDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminLearnPython(adminKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!data) return [];
    if (!needle) return data.rows;
    return data.rows.filter((r) =>
      `${r.name} ${r.email} ${r.city} ${r.phone}`.toLowerCase().includes(needle),
    );
  }, [data, query]);

  async function openDetail(userId: string) {
    setDetailLoading(true);
    setDetailError(null);
    setDetail(null);
    try {
      setDetail(await fetchAdminLearnPythonDetail(adminKey, userId));
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : "Failed to load detail");
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetail(null);
    setDetailError(null);
  }

  if (loading && !data) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading Learn Python…
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

  return (
    <AdminSection
      id="learn-python"
      title="Learn Python"
      description="Every signed-in parent or tutor who opened /learnpython/lms. Progress, XP and videos are saved on the user under learnPython."
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <AdminStatCard
          label="Learners"
          value={data.totals.learners}
          sub={`${data.totals.parents} parents · ${data.totals.tutors} tutors`}
          accent="coral"
        />
        <AdminStatCard label="New (7 days)" value={data.totals.newLast7Days} accent="sage" />
        <AdminStatCard label="Active (7 days)" value={data.totals.activeLast7Days} />
        <AdminStatCard label="Total XP" value={data.totals.totalXp} accent="butter" />
        <AdminStatCard
          label="Avg XP"
          value={data.totals.learners ? Math.round(data.totals.totalXp / data.totals.learners) : 0}
        />
      </div>

      <div className="mt-4 rounded-xl border border-hairline bg-white p-4">
        <p className="text-xs font-bold text-ink">First visits (30 days)</p>
        <div className="mt-4">
          <AdminTrendChart
            height={144}
            emptyLabel="No new learners in the last 30 days"
            points={data.trend.map((point) => ({
              key: point.date,
              total: point.count,
              title: `${formatDay(point.date)}: ${point.count}`,
            }))}
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-hairline bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-4 py-3">
          <div>
            <p className="text-xs font-bold text-ink">Learners</p>
            <p className="text-[11px] text-muted">
              {rows.length} of {data.rows.length} · most recent visit first
            </p>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, city"
            className="h-9 w-full max-w-[260px] rounded-lg border border-hairline px-3 text-xs outline-none focus:border-ink"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs">
            <thead className="bg-cream/80 text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Role</th>
                <th className="px-3 py-2 font-semibold">First visit</th>
                <th className="px-3 py-2 font-semibold">Last visit</th>
                <th className="px-3 py-2 font-semibold">XP · Level</th>
                <th className="px-3 py-2 font-semibold">Streak</th>
                <th className="px-3 py-2 font-semibold">Practice E/M/H</th>
                <th className="px-3 py-2 font-semibold">Lessons</th>
                <th className="px-3 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-muted">
                    No learners yet
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.userId} className="border-t border-hairline hover:bg-cream/40">
                    <td className="px-3 py-2.5 font-medium text-ink">{r.name}</td>
                    <td className="px-3 py-2.5 text-muted">{r.email}</td>
                    <td className="px-3 py-2.5 text-muted">{r.role === "faculty" ? "Tutor" : "Parent"}</td>
                    <td className="px-3 py-2.5 text-muted">{formatDate(r.firstVisitAt)}</td>
                    <td className="px-3 py-2.5 text-muted">{formatDate(r.lastVisitAt)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-ink">
                      {r.xp} XP · L{r.level} {r.band}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-muted">
                      {r.streakDays}d (best {r.bestStreak}d)
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-muted">
                      {r.counts.practiceEasy}/{r.counts.practiceMedium}/{r.counts.practiceHard}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-muted">
                      {r.lessonsUnlocked} open · {r.lessonsCompleted} done · {r.counts.examples} ex · {r.videosWatched} vid ·{" "}
                      {r.projectsCompleted} proj{r.certificateId ? " · 🎓" : ""}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => void openDetail(r.userId)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-ink hover:bg-cream"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
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
          onClick={closeDetail}
        >
          <div
            role="dialog"
            aria-modal
            className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-ink bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink">Learn Python progress</p>
                <p className="text-[11px] text-muted">XP, lessons, practice, videos and badges</p>
              </div>
              <button type="button" onClick={closeDetail} className="rounded-lg p-1.5 text-muted hover:bg-cream" aria-label="Close">
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
              <div className="mt-4 space-y-4 text-xs">
                <div className="rounded-xl bg-cream/60 p-3">
                  <p className="font-bold text-ink">
                    {detail.name} <span className="font-normal text-muted">· {detail.role === "faculty" ? "Tutor" : "Parent"}</span>
                  </p>
                  <p className="text-muted">{detail.email}</p>
                  <p className="mt-1 text-muted">
                    {detail.phone || "—"} · {detail.city || "—"} · {detail.country || "—"}
                  </p>
                  <p className="mt-1 text-muted">
                    First visit {formatDate(detail.firstVisitAt)} · Last visit {formatDate(detail.lastVisitAt)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Stat label="XP" value={detail.xp} />
                  <Stat label="Level" value={`${detail.level} · ${detail.levelTitle || "—"}`} />
                  <Stat label="Band badge" value={detail.band || "—"} />
                  <Stat label="Streak" value={`${detail.streakDays}d (best ${detail.bestStreak}d)`} />
                  <Stat label="Days active" value={detail.daysActive} />
                  <Stat label="Practice E/M/H" value={`${detail.counts.practiceEasy}/${detail.counts.practiceMedium}/${detail.counts.practiceHard}`} />
                  <Stat label="Examples" value={detail.counts.examples} />
                  <Stat label="Lesson Qs / checks" value={`${detail.counts.lessonQuestions} / ${detail.counts.quickChecks}`} />
                </div>

                <div>
                  <p className="font-bold text-ink">Lessons</p>
                  <table className="mt-1 w-full text-left">
                    <thead className="text-[10px] uppercase text-muted">
                      <tr>
                        <th className="py-1 font-semibold">Lesson</th>
                        <th className="py-1 font-semibold">Open</th>
                        <th className="py-1 font-semibold">Study</th>
                        <th className="py-1 font-semibold">Examples</th>
                        <th className="py-1 font-semibold">Practice</th>
                        <th className="py-1 font-semibold">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.lessons.filter((l) => l.available).map((l) => (
                        <tr key={l.slug} className="border-t border-hairline">
                          <td className="py-1.5 text-ink">
                            {l.number}. {l.title}
                          </td>
                          <td className="py-1.5">{l.unlocked ? "✓" : "🔒"}</td>
                          <td className="py-1.5">{l.notesDone ? "✓" : "—"}</td>
                          <td className="py-1.5">{l.examplesDone ? "✓" : "—"}</td>
                          <td className="py-1.5 tabular-nums">
                            {l.bestScore != null ? `${l.bestScore}${l.total ? `/${l.total}` : ""} · ${l.stars}★` : "—"}
                          </td>
                          <td className="py-1.5 text-muted">{formatDate(l.completedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <p className="font-bold text-ink">Final Challenge projects</p>
                  <ul className="mt-1 divide-y divide-hairline rounded-lg border border-hairline">
                    {detail.projects.map((p) => (
                      <li key={p.id} className="flex justify-between gap-3 px-2.5 py-1.5">
                        <span className="text-ink">{p.title}</span>
                        <span className="text-muted">
                          {p.status === "completed"
                            ? `Completed ${formatDate(p.completedAt)}`
                            : p.status === "solution-viewed"
                              ? `Solution viewed ${formatDate(p.solutionViewedAt)}`
                              : p.status === "in-progress"
                                ? "In progress"
                                : "—"}
                          {p.hintsUsed ? ` · ${p.hintsUsed} hints` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  <span className="font-bold text-ink">Certificate: </span>
                  {detail.certificateId ? `${detail.certificateId} · issued ${formatDate(detail.certificateIssuedAt)}` : "Not issued"}
                </p>

                <p>
                  <span className="font-bold text-ink">Videos watched: </span>
                  {detail.videos.length ? detail.videos.join(", ") : "None yet"}
                </p>
                <p>
                  <span className="font-bold text-ink">Badges: </span>
                  {detail.achievementList.length
                    ? detail.achievementList.map((a) => a.title).join(", ")
                    : "None yet"}
                </p>
                <p>
                  <span className="font-bold text-ink">Visit days (last 60): </span>
                  {detail.days.length ? detail.days.join(", ") : "—"}
                </p>

                <div>
                  <p className="font-bold text-ink">Recent XP</p>
                  <ul className="mt-1 max-h-48 divide-y divide-hairline overflow-y-auto rounded-lg border border-hairline">
                    {detail.recentAwards.map((a) => (
                      <li key={a.key} className="flex items-center gap-3 px-2.5 py-1.5">
                        <span className="w-9 shrink-0 font-mono font-bold text-[#2f7a55]">+{a.xp}</span>
                        <span className="min-w-0 flex-1 truncate text-ink">{awardLabel(a.key)}</span>
                        <span className="shrink-0 text-muted">{formatDate(a.at)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminSection>
  );
}
