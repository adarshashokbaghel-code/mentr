"use client";

import { LevelMark } from "@/components/learn-python/lms/py-badges";
import { CertificateArt } from "@/components/learn-python/lms/py-certificate";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import {
  PY_FINAL_PATH,
  PY_PRACTICE_PATH,
  PY_PROFILE_PATH,
  pyLessonHref,
} from "@/lib/python-lms";
import {
  PY_CERT_COURSE,
  certificateProgress,
  certificateVerifyPath,
  type CertRequirement,
  type CertRequirementId,
} from "@/lib/python-lms/certificate";
import { bandFor, bestStreakFor, levelFor } from "@/lib/python-lms/game";
import { PY_PROJECTS } from "@/lib/python-lms/projects";
import {
  claimPyCertificate,
  fetchPyLeaderboard,
  fetchPyProfile,
  type PyCertificate,
  type PyLeaderboard,
  type PyLeaderboardRow,
  type PyProfile,
} from "@/lib/python-lms/sync-client";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Flame,
  FlaskConical,
  Loader2,
  Lock,
  Medal,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type Tab = "profile" | "leaderboard" | "certificate";
const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "certificate", label: "Certificate", icon: Award },
];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

function Avatar({ initials, color, size = 44, className }: { initials: string; color: string; size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-white", className)}
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

function Bar({ have, need, className }: { have: number; need: number; className?: string }) {
  const pct = need ? Math.min(100, Math.round((have / need) * 100)) : 0;
  return (
    <div className={cn("h-2 w-full overflow-hidden bg-[#ece8df]", className)}>
      <div className={cn("h-full transition-all", pct >= 100 ? "bg-[#2f9e6e]" : "bg-coral")} style={{ width: `${pct}%` }} />
    </div>
  );
}

function useLiveProgress() {
  const { store } = usePyLms();
  return useMemo(
    () => certificateProgress({ lessons: store.lessons, awardKeys: Object.keys(store.awarded), projects: store.projects }),
    [store.lessons, store.awarded, store.projects],
  );
}

export function PyProfilePage() {
  const params = useSearchParams();
  const router = useRouter();
  const raw = params?.get("tab");
  const tab: Tab = raw === "leaderboard" || raw === "certificate" ? raw : "profile";
  const { syncNow, setCertificateId } = usePyLms();
  const [profile, setProfile] = useState<PyProfile | null>(null);
  const [board, setBoard] = useState<PyLeaderboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    await syncNow();
    return Promise.all([fetchPyProfile(), fetchPyLeaderboard()]);
  }, [syncNow]);

  const apply = useCallback(
    ([p, b]: [PyProfile, PyLeaderboard]) => {
      setError(null);
      setProfile(p);
      setBoard(b);
      if (p.certificate) setCertificateId(p.certificate.id);
    },
    [setCertificateId],
  );
  const fail = (e: unknown) => setError(e instanceof Error ? e.message : "Could not load your profile");
  const load = () => fetchAll().then(apply, fail);

  useEffect(() => {
    let alive = true;
    fetchAll().then(
      (r) => alive && apply(r),
      (e) => alive && setError(e instanceof Error ? e.message : "Could not load your profile"),
    );
    return () => {
      alive = false;
    };
  }, [fetchAll, apply]);

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <p className="font-mono text-[11.5px] text-coral">You</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">Profile & certificate</h1>

      <div role="tablist" className="mt-5 flex gap-1 overflow-x-auto border-b border-hairline">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => router.replace(`${PY_PROFILE_PATH}?tab=${t.id}`, { scroll: false })}
            className={cn(
              "-mb-px inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13.5px] font-bold transition sm:gap-2 sm:px-4 sm:text-[14px]",
              tab === t.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-5 flex flex-wrap items-center gap-3 border border-[#f0c9bd] bg-[#fdf3ef] px-4 py-3 text-[14px] text-[#8a3a1f]">
          {error}
          <button type="button" onClick={() => void load()} className="font-bold underline underline-offset-4">
            Try again
          </button>
        </p>
      )}

      <div className="mt-6">
        {tab === "profile" && <ProfileTab profile={profile} />}
        {tab === "leaderboard" && <LeaderboardTab board={board} />}
        {tab === "certificate" && <CertificateTab profile={profile} onIssued={(c) => setProfile((p) => (p ? { ...p, certificate: c } : p))} />}
      </div>
    </div>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 py-10 text-[14px] text-muted">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </p>
  );
}

function ProfileTab({ profile }: { profile: PyProfile | null }) {
  const { xp, streak, store, certificateId } = usePyLms();
  const progress = useLiveProgress();
  const lvl = levelFor(xp);
  const name = profile?.name || "";
  const best = Math.max(profile?.bestStreak ?? 0, bestStreakFor(store.days));

  if (!profile) return <Loading label="Loading your profile…" />;

  const stats: { label: string; value: string; sub?: string }[] = [
    { label: "Total XP", value: String(xp) },
    { label: "Rank", value: profile.rank ? `#${profile.rank}` : "–", sub: profile.rank ? `of ${profile.learners} learners` : "earn XP to be ranked" },
    { label: "Streak", value: `${streak} day${streak === 1 ? "" : "s"}`, sub: `best ${best}` },
    { label: "Days active", value: String(Math.max(profile.daysActive, store.days.length)) },
    { label: "Lessons studied", value: `${progress.stats.lessonsStudied}/${progress.studied.length}` },
    { label: "Practice solved", value: String(progress.stats.practiceSolved) },
    { label: "Examples solved", value: String(progress.stats.examplesSolved) },
    { label: "Projects", value: `${progress.stats.projectsCompleted}/${PY_PROJECTS.length}` },
  ];

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-5 border border-hairline bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <Avatar initials={initialsOf(name || profile.email)} color={lvl.band.color} size={72} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[22px] font-extrabold leading-tight">{name || "Name not set"}</p>
          <p className="mt-0.5 truncate text-[14px] text-muted">{profile.email}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] text-muted">
            <span className="border border-hairline px-1.5 py-0.5 uppercase">{profile.role === "faculty" ? "Tutor" : "Parent"}</span>
            {profile.firstVisitAt && (
              <span>
                Learning since{" "}
                {new Date(profile.firstVisitAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
            {certificateId && (
              <span className="inline-flex items-center gap-1 text-[#1d6b49]">
                <Award className="h-3.5 w-3.5" /> Certified
              </span>
            )}
          </p>
          {!name && (
            <p className="mt-2 text-[13px] text-[#8a5a00]">Add your name to your account profile. It is printed on your certificate.</p>
          )}
        </div>
        <div className="w-full border-t border-hairline pt-4 sm:w-[240px] sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div className="flex items-center gap-2.5">
            <LevelMark level={lvl.level} size={30} />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-extrabold leading-tight">{lvl.title}</p>
              <p className="font-mono text-[11px]" style={{ color: lvl.band.color }}>
                {lvl.band.name} · Level {lvl.level}
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden bg-[#ece8df]">
            <div className="h-full" style={{ width: `${lvl.pct}%`, background: lvl.band.color }} />
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-muted">{lvl.max ? "Top level reached" : `${lvl.toNext} XP to ${lvl.nextTitle}`}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-4 py-4">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{s.label}</p>
            <p className="mt-1 text-[22px] font-extrabold leading-none">{s.value}</p>
            {s.sub && <p className="mt-1 text-[12px] text-muted">{s.sub}</p>}
          </div>
        ))}
      </section>

      <Link
        href={`${PY_PROFILE_PATH}?tab=certificate`}
        className="group flex items-center gap-4 border border-[#1f2a23] bg-[#0f1612] px-5 py-4 text-white"
      >
        <Award className="h-8 w-8 shrink-0 text-[#e0c36a]" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold">{certificateId ? "Your certificate is ready" : "Certificate progress"}</p>
          <p className="text-[13px] text-white/60">
            {certificateId
              ? `Certificate ${certificateId}. Download it or share the verify link.`
              : `${progress.requirements.filter((r) => r.done).length} of ${progress.requirements.length} requirements met`}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-white/60 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

const PODIUM = [
  { place: 2, height: "h-[92px]", medal: "#a9b4bd", ring: "ring-[#c6ced4]" },
  { place: 1, height: "h-[128px]", medal: "#d8a92c", ring: "ring-[#e8c768]" },
  { place: 3, height: "h-[68px]", medal: "#c47b45", ring: "ring-[#dca27a]" },
];

function LeaderboardTab({ board }: { board: PyLeaderboard | null }) {
  if (!board) return <Loading label="Loading the leaderboard…" />;
  const { rows, me, learners } = board;
  const above = me && me.xp > 0 ? [...rows].reverse().find((r) => r.xp > me.xp) : null;

  return (
    <div className="space-y-6">
      <section className="border border-[#1f2a23] bg-[radial-gradient(ellipse_at_top,#1d3a2b_0%,#0f1612_70%)] px-4 pb-0 pt-6 text-white sm:px-8">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#5ee0a0]">Top learners · by XP</p>
        <div className="mx-auto mt-6 grid max-w-[560px] grid-cols-3 items-end gap-2 sm:gap-4">
          {PODIUM.map((slot) => {
            const row = rows[slot.place - 1];
            return (
              <div key={slot.place} className="flex min-w-0 flex-col items-center">
                {row ? (
                  <>
                    {slot.place === 1 && <Crown className="mb-1 h-6 w-6 text-[#e8c768]" fill="#e8c768" />}
                    <Avatar
                      initials={row.initials}
                      color={bandFor(row.level).color}
                      size={slot.place === 1 ? 64 : 52}
                      className={cn("ring-4", slot.ring, row.isMe && "outline outline-2 outline-offset-4 outline-[#5ee0a0]")}
                    />
                    <p className="mt-2 max-w-full truncate text-[14px] font-bold">{row.name}</p>
                    <p className="font-mono text-[12px] text-white/60">{row.xp} XP</p>
                  </>
                ) : (
                  <>
                    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-dashed border-white/25 text-white/30">?</span>
                    <p className="mt-2 text-[13px] text-white/40">Open spot</p>
                    <p className="font-mono text-[12px] text-transparent">0</p>
                  </>
                )}
                <div
                  className={cn("mt-3 flex w-full items-start justify-center border-x border-t pt-2", slot.height)}
                  style={{ borderColor: `${slot.medal}66`, background: `linear-gradient(${slot.medal}40, ${slot.medal}10)` }}
                >
                  <span className="text-[26px] font-black" style={{ color: slot.medal }}>
                    {slot.place}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {me && (
        <section className="flex flex-wrap items-center gap-4 border-2 border-ink bg-white px-5 py-4">
          <span className="flex h-12 min-w-12 items-center justify-center bg-ink px-2 font-mono text-[18px] font-bold text-white">
            {me.xp > 0 ? `#${me.rank}` : "–"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold">Your position</p>
            <p className="text-[13.5px] text-muted">
              {me.xp <= 0
                ? "Earn your first XP to appear on the board."
                : me.rank === 1
                  ? `You are top of ${learners} learner${learners === 1 ? "" : "s"}. Keep going to stay there.`
                  : above
                    ? `${me.xp} XP. ${above.xp - me.xp + 1} more XP passes ${above.name} at #${above.rank}.`
                    : `${me.xp} XP of ${learners} learners.`}
            </p>
          </div>
        </section>
      )}

      <section className="border border-hairline bg-white">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <h2 className="text-[15px] font-extrabold">All learners</h2>
          <span className="font-mono text-[11px] text-muted">
            {learners} ranked{rows.length < learners ? ` · top ${rows.length} shown` : ""}
          </span>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-center text-[14px] text-muted">No one has earned XP yet. Be the first.</p>
        ) : (
          <ol>
            {rows.map((r) => (
              <BoardRow key={`${r.rank}-${r.name}-${r.xp}-${r.isMe}`} row={r} />
            ))}
          </ol>
        )}
        <p className="border-t border-hairline px-5 py-3 text-[12px] leading-relaxed text-muted">
          Ranked by total XP. Equal XP shares a rank. Names show first name and last initial only.
        </p>
      </section>
    </div>
  );
}

function BoardRow({ row }: { row: PyLeaderboardRow }) {
  const medal = row.rank <= 3 ? PODIUM.find((p) => p.place === row.rank)?.medal : undefined;
  return (
    <li className={cn("flex items-center gap-3 border-b border-hairline px-4 py-3 last:border-b-0 sm:px-5", row.isMe && "bg-[#eef8f2]")}>
      <span className="w-8 shrink-0 text-center font-mono text-[14px] font-bold" style={medal ? { color: medal } : undefined}>
        {medal ? <Medal className="mx-auto h-5 w-5" /> : row.rank}
      </span>
      <Avatar initials={row.initials} color={bandFor(row.level).color} size={34} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-[14px] font-bold">
          <span className="truncate">{row.name}</span>
          {row.isMe && <span className="shrink-0 bg-ink px-1.5 py-px font-mono text-[10px] font-semibold text-white">YOU</span>}
          {row.certified && <Award className="h-4 w-4 shrink-0 text-[#c98a12]" aria-label="Certified" />}
        </p>
        <p className="truncate font-mono text-[11px] text-muted">
          Lv {row.level} · {row.levelTitle}
        </p>
      </div>
      <span className="hidden w-[74px] text-right font-mono text-[12px] text-muted sm:block" title="Lessons studied">
        <BookOpen className="mr-1 inline h-3.5 w-3.5" />
        {row.lessonsStudied}
      </span>
      <span className="hidden w-[60px] text-right font-mono text-[12px] text-muted sm:block" title="Projects completed">
        <FlaskConical className="mr-1 inline h-3.5 w-3.5" />
        {row.projectsCompleted}
      </span>
      <span className="hidden w-[60px] text-right font-mono text-[12px] text-muted md:block" title="Current streak">
        <Flame className="mr-1 inline h-3.5 w-3.5" />
        {row.streakDays}
      </span>
      <span className="w-[72px] text-right font-mono text-[14px] font-bold">{row.xp} XP</span>
    </li>
  );
}

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const tidyName = (v: string) => v.normalize("NFC").replace(/\s+/g, " ").trim();
const nameProblem = (v: string) => {
  const n = tidyName(v);
  if (n.length < 2) return "Enter at least 2 letters.";
  if (n.length > 60) return "Keep it under 60 characters.";
  if (!NAME_RE.test(n)) return "Use letters, spaces, dots, apostrophes or hyphens only.";
  return null;
};

function CertificateNameDialog({
  initial,
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  initial: string;
  busy: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const problem = nameProblem(value);
  const name = tidyName(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Name on your certificate">
      <button type="button" aria-label="Cancel" className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={busy ? undefined : onCancel} />
      <form
        className="py-slide-next relative w-full max-w-[460px] overflow-hidden border border-ink bg-white shadow-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          if (problem || busy) return;
          if (step === "edit") setStep("confirm");
          else onConfirm(name);
        }}
      >
        <div className="h-1.5 bg-[#1f6b4a]" />
        <div className="px-6 pb-5 pt-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1f6b4a]">
            <Award className="h-4 w-4" /> Your certificate
          </p>
          <h2 className="mt-1.5 text-[20px] font-extrabold leading-tight">
            {step === "edit" ? "What name should we print?" : "Is this exactly right?"}
          </h2>

          {step === "edit" ? (
            <>
              <p className="mt-1 text-[13.5px] leading-relaxed text-muted">Use your full name the way you want it to appear.</p>
              <label className="mt-4 block">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Name on certificate</span>
                <input
                  autoFocus
                  value={value}
                  maxLength={70}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="mt-1.5 w-full border border-hairline bg-[#faf8f4] px-3.5 py-3 text-[16px] font-semibold outline-none transition focus:border-ink focus:bg-white"
                />
              </label>
              {value && problem && <p className="mt-1.5 text-[12.5px] text-[#b2401f]">{problem}</p>}
            </>
          ) : (
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted">Check the spelling. This is how it will look:</p>
          )}

          <div className="mt-4 border border-[#e6dcc6] bg-[#fcf9f3] px-4 py-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#626662]">This certifies that</p>
            <p className="mt-1 truncate font-serif text-[26px] font-bold italic leading-tight text-[#0f1712]">{name || "Your Name"}</p>
            <div className="mx-auto mt-1.5 h-px w-3/4 bg-[#b8944a]" />
          </div>

          <p className="mt-4 flex gap-2 bg-[#fff7e6] px-3 py-2.5 text-[12.5px] leading-relaxed text-[#7a5200]">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            The name is saved permanently. It can’t be changed later, and every download and the public verify page will show it.
          </p>
          {error && <p className="mt-3 text-[13px] text-[#b2401f]">{error}</p>}

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={step === "confirm" ? () => setStep("edit") : onCancel}
              className="border border-hairline px-4 py-2.5 text-[13.5px] font-bold disabled:opacity-60"
            >
              {step === "confirm" ? "Edit name" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={Boolean(problem) || busy}
              className="inline-flex items-center gap-2 bg-[#1f6b4a] px-5 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#185a3d] disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {step === "edit" ? "Continue" : "Save name & download"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

async function downloadPdf(cert: PyCertificate) {
  const { downloadCertificatePdf } = await import("@/lib/python-lms/certificate-pdf");
  await downloadCertificatePdf(cert);
}

const REQ_ICON: Record<CertRequirementId, typeof BookOpen> = {
  study: BookOpen,
  practice: Check,
  examples: Sparkles,
  project: FlaskConical,
};

function requirementLink(r: CertRequirement, nextStudy: string | undefined): { href: string; label: string } {
  if (r.id === "study") return { href: nextStudy ? pyLessonHref(nextStudy) : PY_FINAL_PATH, label: "Continue studying" };
  if (r.id === "practice") return { href: PY_PRACTICE_PATH, label: "Open Practice" };
  if (r.id === "examples") return { href: nextStudy ? pyLessonHref(nextStudy) : pyLessonHref("lesson-01"), label: "Open lesson Examples" };
  return { href: PY_FINAL_PATH, label: "Go to Final Challenge" };
}

function CertificateTab({ profile, onIssued }: { profile: PyProfile | null; onIssued: (c: PyCertificate) => void }) {
  const { certificateId, setCertificateId, syncNow, xp } = usePyLms();
  const progress = useLiveProgress();
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [askName, setAskName] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cert = profile?.certificate ?? null;

  if (!profile) return <Loading label="Loading your certificate progress…" />;

  if (cert) {
    const url = `${window.location.origin}${certificateVerifyPath(cert.id)}`;
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="mr-auto flex items-center gap-2 text-[16px] font-extrabold">
            <Award className="h-5 w-5 text-[#c98a12]" /> Issued {new Date(cert.issuedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
          </p>
          <button
            type="button"
            disabled={downloading}
            onClick={async () => {
              setDownloading(true);
              try {
                await downloadPdf(cert);
              } finally {
                setDownloading(false);
              }
            }}
            className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-[14px] font-bold text-white disabled:opacity-70"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
          </button>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-[14px] font-bold"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy verify link"}
          </button>
          <Link
            href={certificateVerifyPath(cert.id)}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-2 py-2.5 text-[14px] font-bold underline underline-offset-4"
          >
            Public page <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <Lock className="h-3.5 w-3.5" /> Name on certificate: <b className="text-ink">{cert.name}</b> (saved permanently)
        </p>
        <CertificateArt cert={cert} />
        <p className="text-[13px] leading-relaxed text-muted">
          Anyone with the link or the id <b className="font-mono text-ink">{cert.id}</b> can check it is real. The numbers on it are fixed at the moment
          it was issued and come from your saved progress. It is a Mentr course certificate, not a school or board qualification.
        </p>
      </div>
    );
  }

  const met = progress.requirements.filter((r) => r.done).length;
  const nextStudy = progress.studied.find((s) => !s.done)?.slug;
  const unlocked = profile.certificateUnlocked && !progress.eligible;
  const canClaim = progress.eligible || profile.certificateUnlocked;

  async function claim(name: string) {
    setClaiming(true);
    setClaimError(null);
    try {
      await syncNow();
      const c = await claimPyCertificate(name);
      setCertificateId(c.id);
      setAskName(false);
      onIssued(c);
      await downloadPdf(c);
    } catch (e) {
      setClaimError(e instanceof Error ? e.message : "Could not issue the certificate");
    } finally {
      setClaiming(false);
    }
  }

  const preview: PyCertificate = {
    id: "MPY-XXXX-XXXX",
    name: profile.name || "Your Name",
    course: PY_CERT_COURSE,
    issuedAt: new Date().toISOString(),
    stats: unlocked
      ? { xp, ...progress.stats, projects: progress.projectIds }
      : {
          xp,
          lessonsStudied: progress.studied.length,
          practiceSolved: Math.max(20, progress.stats.practiceSolved),
          examplesSolved: Math.max(50, progress.stats.examplesSolved),
          projectsCompleted: Math.max(1, progress.projectIds.length),
          projects: progress.projectIds.length ? progress.projectIds : [PY_PROJECTS[0].id],
        },
  };

  return (
    <div className="space-y-6">
      <section className="border border-hairline bg-white px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-extrabold">Earn your {PY_CERT_COURSE} certificate</h2>
            <p className="mt-1 max-w-[60ch] text-[14px] leading-relaxed text-muted">
              It is issued only when your saved progress meets all four rules below. Nothing is skipped and nothing can be bought.
            </p>
          </div>
          <p className="font-mono text-[13px] font-bold">
            {met}/{progress.requirements.length} met
          </p>
        </div>
        <Bar have={met} need={progress.requirements.length} className="mt-4 h-2.5" />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {progress.requirements.map((r) => {
          const Icon = REQ_ICON[r.id];
          const link = requirementLink(r, nextStudy);
          return (
            <div key={r.id} className={cn("flex flex-col border bg-white px-5 py-4", r.done ? "border-[#2f9e6e]" : "border-hairline")}>
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center",
                    r.done ? "bg-[#2f9e6e] text-white" : "border border-hairline bg-[#faf8f4] text-muted",
                  )}
                >
                  {r.done ? <Check className="h-5 w-5" strokeWidth={3} /> : <Icon className="h-4.5 w-4.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-extrabold leading-snug">{r.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{r.detail}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Bar have={r.have} need={r.need} />
                <span className="shrink-0 font-mono text-[12.5px] font-bold">
                  {Math.min(r.have, r.need)}/{r.need}
                </span>
              </div>
              {r.done ? (
                <p className="mt-2 text-[12.5px] font-semibold text-[#1d6b49]">
                  Done{r.have > r.need ? ` (${r.have} so far)` : ""}
                </p>
              ) : (
                <Link href={link.href} className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold underline underline-offset-4">
                  {link.label} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          );
        })}
      </section>

      <section className="border border-hairline bg-white px-5 py-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Study, lesson by lesson</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {progress.studied.map((s) => (
            <li key={s.slug}>
              <Link
                href={pyLessonHref(s.slug)}
                className={cn(
                  "flex items-center gap-2 border px-3 py-2 text-[13px]",
                  s.done ? "border-[#bfe3cf] bg-[#eef8f2] text-[#1d6b49]" : "border-hairline text-muted hover:border-ink hover:text-ink",
                )}
              >
                {s.done ? <Check className="h-4 w-4 shrink-0" strokeWidth={3} /> : <span className="h-4 w-4 shrink-0 rounded-full border border-current" />}
                <span className="truncate">
                  <b className="font-mono">{s.number}</b> {s.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 border border-[#1f2a23] bg-[#0f1612] px-5 py-5 text-white sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-extrabold">
            {progress.eligible ? "You have met every rule" : unlocked ? "Certificate unlocked by Mentr" : "Certificate locked"}
          </p>
          <p className="mt-0.5 text-[13.5px] text-white/60">
            {progress.eligible
              ? "Claim it now. You choose the printed name once, and it gets a public verify link."
              : unlocked
                ? "You can claim it now. It prints your real progress numbers as they are today."
                : `${progress.requirements.length - met} rule${progress.requirements.length - met === 1 ? "" : "s"} left. The button unlocks when all four are met.`}
          </p>
          {claimError && !askName && <p className="mt-2 text-[13px] text-[#ff9b8a]">{claimError}</p>}
        </div>
        <button
          type="button"
          disabled={!canClaim || claiming || Boolean(certificateId)}
          onClick={() => {
            setClaimError(null);
            setAskName(true);
          }}
          className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#2f9e6e] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#278a5f] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50"
        >
          {claiming ? <Loader2 className="h-4 w-4 animate-spin" /> : canClaim ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {canClaim ? "Claim & download" : "Claim certificate"}
        </button>
      </section>
      {askName && (
        <CertificateNameDialog
          initial={profile.name}
          busy={claiming}
          error={claimError}
          onCancel={() => setAskName(false)}
          onConfirm={(name) => void claim(name)}
        />
      )}

      <section>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Preview · not issued yet</p>
        <div className="relative">
          <CertificateArt cert={preview} className="opacity-60 grayscale-[0.6]" />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="-rotate-12 border-4 border-[#d4532f]/70 px-5 py-1 text-[clamp(20px,6vw,54px)] font-black tracking-[0.2em] text-[#d4532f]/70">
              PREVIEW
            </span>
          </span>
        </div>
        <p className="mt-2 text-[12.5px] text-muted">The real one shows your actual numbers on the day you claim it, plus a unique id.</p>
      </section>
    </div>
  );
}
