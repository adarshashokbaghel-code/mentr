"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LearnDino } from "@/components/landing/lp/learn-dino";
import {
  clearLearnClientCache,
  downloadReceiptForEnrollment,
  fetchLearnEnrollment,
  LEARN_COURSE_MODULES,
  LEARN_COURSE_TAGLINE,
  readLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";
import { SYLLABUS_VIEW_HREF } from "@/lib/learn-syllabus-doc";
import {
  Blocks,
  ChevronRight,
  Download,
  FileText,
  Flame,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function activityLabel(iso: string | null | undefined): string {
  if (!iso) return "No lessons yet";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "No lessons yet";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  return sameDay ? "Opened today" : formatDate(iso);
}

function planLabel(enrollment: LearnEnrollmentDto): string {
  if (enrollment.purchase.totalInr <= 0) return "Free forever · ₹0";
  return `₹${enrollment.purchase.totalInr.toLocaleString("en-IN")}`;
}

function accessLabel(expiry: string): string {
  if (!expiry || expiry === "lifetime") return "Lifetime";
  return expiry;
}

function statusLabel(status: string): string {
  if (!status) return "Active";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-[#f0ebe3] py-3 first:border-t-0">
      <dt className="shrink-0 text-[13px] font-semibold text-[#8a929c]">
        {label}
      </dt>
      <dd className="min-w-0 break-all text-right text-[13px] font-bold text-[#1c2434]">
        {value}
      </dd>
    </div>
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="flex h-full w-full flex-col rounded-3xl border border-[#e8e2d8] bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-extrabold text-[#1c2434]">{title}</h2>
        {action}
      </div>
      <div className="mt-1 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  hint,
}: {
  href: string;
  icon: typeof FileText;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-full w-full items-center gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-4 transition hover:border-[#1c2434]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold text-[#1c2434]">
          {label}
        </span>
        <span className="block text-[12px] font-medium text-[#8a929c]">
          {hint}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#c4bdb3]" />
    </Link>
  );
}

export function LmsMe() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const local = readLearnEnrollmentLocal();
    if (local) setEnrollment(local);
    void fetchLearnEnrollment().then((next) => {
      if (next) setEnrollment(next);
    });
  }, []);

  const parentName =
    user?.parentProfile?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Explorer";
  const first = parentName.split(/\s+/)[0] || "Explorer";
  const email = user?.email?.trim() || "";
  const phone = user?.parentProfile?.phoneNumber?.trim() || "";
  const place = [
    user?.parentProfile?.area?.trim(),
    user?.parentProfile?.city?.trim(),
    user?.parentProfile?.country?.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  const progress = enrollment?.progress;
  const modulesDone = progress?.modulesCompleted?.length ?? 0;
  const stats = [
    { label: "XP", value: String(progress?.xp ?? 0) },
    { label: "Streak", value: `${progress?.streakDays ?? 0}d` },
    {
      label: "Modules",
      value: `${modulesDone}/${LEARN_COURSE_MODULES}`,
    },
    { label: "Videos", value: String(progress?.videosWatched?.length ?? 0) },
    { label: "Quizzes", value: String(progress?.quizzesCompleted?.length ?? 0) },
    { label: "Builds", value: String(progress?.buildsCompleted?.length ?? 0) },
  ];

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      clearLearnClientCache();
      await logout();
      router.replace("/learn");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-[1.65rem] font-extrabold tracking-tight text-[#1c2434]">
          Me
        </h1>
        <p className="mt-1 text-[14px] font-medium text-[#8a929c]">
          This parent account, the Class 3–5 course, and how to sign out.
        </p>
      </div>

      <section className="w-full rounded-3xl border-2 border-[#1c2434] bg-white p-5 shadow-[4px_4px_0_0_#ff6a1a] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
          <div className="flex min-w-0 items-center gap-4 xl:w-[280px] xl:shrink-0">
            <LearnDino size={72} action="blink" className="h-16 w-16 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-[1.45rem] font-extrabold tracking-tight text-[#1c2434]">
                {first}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex rounded-full bg-[#fff4e8] px-2.5 py-0.5 text-[11px] font-bold text-[#ff6a1a]">
                  Class 3–5
                </span>
                <span className="inline-flex rounded-full bg-[#e6f7f4] px-2.5 py-0.5 text-[11px] font-bold text-[#0d9488]">
                  {statusLabel(enrollment?.status || "active")}
                </span>
              </div>
              <p className="mt-2 text-[12px] font-semibold text-[#8a929c]">
                Leaderboard name · parent account
              </p>
            </div>
          </div>

          <dl className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-[#faf8f4] px-2 py-3 text-center"
              >
                <p className="text-[15px] font-extrabold tabular-nums text-[#1c2434] sm:text-[1.15rem]">
                  {stat.value}
                </p>
                <p className="text-[11px] font-bold text-[#8a929c]">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold text-[#8a929c]">
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-[#b45309]" />
            Streak grows when you open Learn each day
          </span>
          <Link
            href="/learn/app/progress"
            className="font-bold text-[#ff6a1a] hover:underline"
          >
            Full progress
          </Link>
        </div>
      </section>

      <div className="grid w-full gap-5 lg:grid-cols-2">
      <Card title="Account">
        <dl>
          <Fact label="Parent" value={parentName} />
          {email ? <Fact label="Email" value={email} /> : null}
          {phone ? <Fact label="Phone" value={phone} /> : null}
          {place ? <Fact label="Place" value={place} /> : null}
          <Fact label="Member since" value={formatDate(user?.createdAt)} />
          <Fact
            label="Last activity"
            value={activityLabel(progress?.lastActivityAt)}
          />
        </dl>
       
      </Card>

      <Card title="This course">
        {enrollment ? (
          <>
            <dl>
              <Fact label="Course" value={enrollment.courseName} />
              <Fact
                label="Track"
                value={enrollment.tagline || LEARN_COURSE_TAGLINE}
              />
              <Fact label="Plan" value={planLabel(enrollment)} />
              <Fact label="Enrolled" value={formatDate(enrollment.enrolledAt)} />
              <Fact label="Access" value={accessLabel(enrollment.expiry)} />
              <Fact label="Receipt" value={enrollment.receiptNumber} />
            </dl>
            <button
              type="button"
              onClick={() =>
                downloadReceiptForEnrollment(enrollment, {
                  name: user?.parentProfile?.name || parentName,
                  email,
                  userId: user?.id || "",
                })
              }
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6a1a] px-4 py-3 text-[14px] font-extrabold text-white shadow-[2px_2px_0_0_#1c2434] transition hover:brightness-95"
            >
              <Download className="h-4 w-4" />
              Download receipt
            </button>
          </>
        ) : (
          <p className="py-3 text-[13px] font-medium text-[#8a929c]">
            Loading enrollment…
          </p>
        )}
      </Card>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MenuLink
          href="/learn/app/progress"
          icon={Sparkles}
          label="Progress"
          hint="XP, streak, badges, and rank"
        />
        <MenuLink
          href="/learn/app/build"
          icon={Blocks}
          label="Build Arena"
          hint="Missions you have finished"
        />
        <MenuLink
          href={SYLLABUS_VIEW_HREF}
          icon={FileText}
          label="Parent syllabus"
          hint="All 60 Class 3–5 modules"
        />
        <MenuLink
          href="/parent/dashboard"
          icon={LayoutDashboard}
          label="Parent dashboard"
          hint="Mentr account outside Learn"
        />
        <MenuLink
          href="/search"
          icon={Search}
          label="Find a mentor"
          hint="Live tutors, separate from this course"
        />
        <MenuLink
          href="/learn"
          icon={Home}
          label="Mentr Learn site"
          hint="Public course page"
        />
      </div>

      <div className="flex w-full flex-col gap-3">
      <p className="text-[12px] font-semibold text-[#8a929c]">
        <Link href="/privacy" className="hover:text-[#1c2434] hover:underline">
          Privacy
        </Link>
        <span className="px-2 text-[#d5cfc6]">·</span>
        <Link href="/terms" className="hover:text-[#1c2434] hover:underline">
          Terms
        </Link>
        <span className="px-2 text-[#d5cfc6]">·</span>
        <Link href="/safety" className="hover:text-[#1c2434] hover:underline">
          Safety
        </Link>
        <span className="px-2 text-[#d5cfc6]">·</span>
        <Link href="/contact" className="hover:text-[#1c2434] hover:underline">
          Contact
        </Link>
      </p>

      {confirmLogout ? (
        <div className="rounded-3xl border border-[#f3c7c7] bg-[#fff8f6] p-4 sm:p-5">
          <p className="text-[15px] font-extrabold text-[#1c2434]">
            Log out of this parent account?
          </p>
          <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#5a6472]">
            Progress stays on {email || "this email"}. Sign in again with the
            same email to continue on this device.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={loggingOut}
              onClick={() => setConfirmLogout(false)}
              className="flex-1 rounded-2xl border border-[#e8e2d8] bg-white py-3 text-[14px] font-extrabold text-[#1c2434] transition hover:bg-[#faf8f4] disabled:opacity-60"
            >
              Stay signed in
            </button>
            <button
              type="button"
              disabled={loggingOut}
              onClick={() => void handleLogout()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#dc2626] py-3 text-[14px] font-extrabold text-white transition hover:bg-[#b91c1c] disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Log out
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f3c7c7] bg-white py-3.5 text-[14px] font-extrabold text-[#dc2626] transition hover:bg-[#fff5f5]"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      )}
      </div>
    </div>
  );
}
