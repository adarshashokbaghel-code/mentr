import { PY_LESSON_INDEX, PY_LESSON_ORDER } from "../../src/lib/python-lms";
import { ACHIEVEMENTS, type AchievementId } from "../../src/lib/python-lms/game";
import { unlockedLessons, type PyLessonProgress } from "../../src/lib/python-lms/lesson-progress";
import { projectStatus, type PyProjectProgress } from "../../src/lib/python-lms/project-progress";
import { PY_PROJECTS } from "../../src/lib/python-lms/projects";
import { excludeDemoUsersFilter } from "../lib/demo-users";
import { User, type ILearnPython } from "../models/User";

type LeanUser = {
  _id: unknown;
  email: string;
  role: "parent" | "faculty";
  parentProfile?: { name?: string; phoneNumber?: string; city?: string; country?: string };
  profile?: { name?: string; phoneNumber?: string; city?: string; country?: string };
  lastLoginAt?: Date;
  learnPython?: ILearnPython;
};

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function contact(u: LeanUser) {
  const p = u.role === "parent" ? u.parentProfile : u.profile;
  return {
    name: p?.name?.trim() || "—",
    phone: p?.phoneNumber || "",
    city: p?.city || "",
    country: p?.country || "",
  };
}

function summary(lp: ILearnPython | undefined) {
  return {
    firstVisitAt: lp?.firstVisitAt ? new Date(lp.firstVisitAt).toISOString() : null,
    lastVisitAt: lp?.lastVisitAt ? new Date(lp.lastVisitAt).toISOString() : null,
    xp: lp?.xp ?? 0,
    level: lp?.level ?? 1,
    levelTitle: lp?.levelTitle ?? "",
    band: lp?.band ?? "",
    streakDays: lp?.streakDays ?? 0,
    bestStreak: lp?.bestStreak ?? 0,
    daysActive: lp?.days?.length ?? 0,
    lessonsCompleted: lp?.lessonsCompleted ?? 0,
    lessonsUnlocked: lp?.unlockedLessons?.length ?? 1,
    videosWatched: lp?.videosWatched?.length ?? 0,
    achievements: Object.keys(lp?.achievements ?? {}).length,
    projectsCompleted: lp?.projectsCompleted ?? 0,
    certificateId: lp?.certificate?.id ?? null,
    counts: {
      logins: lp?.counts?.logins ?? 0,
      practiceEasy: lp?.counts?.practiceEasy ?? 0,
      practiceMedium: lp?.counts?.practiceMedium ?? 0,
      practiceHard: lp?.counts?.practiceHard ?? 0,
      videos: lp?.counts?.videos ?? 0,
      examples: lp?.counts?.examples ?? 0,
      lessonQuestions: lp?.counts?.lessonQuestions ?? 0,
      quickChecks: lp?.counts?.quickChecks ?? 0,
    },
  };
}

export async function getAdminLearnPython() {
  const users = await User.find({ ...excludeDemoUsersFilter, "learnPython.visited": true })
    .select(
      "email role parentProfile.name parentProfile.phoneNumber parentProfile.city profile.name profile.phoneNumber profile.city lastLoginAt learnPython.firstVisitAt learnPython.lastVisitAt learnPython.xp learnPython.level learnPython.levelTitle learnPython.band learnPython.streakDays learnPython.bestStreak learnPython.days learnPython.lessonsCompleted learnPython.unlockedLessons learnPython.videosWatched learnPython.achievements learnPython.counts learnPython.projectsCompleted learnPython.certificate.id",
    )
    .sort({ "learnPython.lastVisitAt": -1 })
    .limit(2000)
    .lean<LeanUser[]>();

  const rows = users.map((u) => ({
    userId: String(u._id),
    email: u.email,
    role: u.role,
    ...contact(u),
    ...summary(u.learnPython),
  }));

  const d7 = daysAgo(7);
  const byDay = new Map<string, number>();
  for (let i = 0; i < 30; i++) byDay.set(daysAgo(29 - i).toISOString().slice(0, 10), 0);
  for (const r of rows) {
    const key = r.firstVisitAt?.slice(0, 10);
    if (key && byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + 1);
  }

  return {
    totals: {
      learners: rows.length,
      parents: rows.filter((r) => r.role === "parent").length,
      tutors: rows.filter((r) => r.role === "faculty").length,
      newLast7Days: rows.filter((r) => r.firstVisitAt && new Date(r.firstVisitAt) >= d7).length,
      activeLast7Days: rows.filter((r) => r.lastVisitAt && new Date(r.lastVisitAt) >= d7).length,
      totalXp: rows.reduce((a, r) => a + r.xp, 0),
    },
    trend: Array.from(byDay.entries()).map(([date, count]) => ({ date, count })),
    rows,
  };
}

export async function getAdminLearnPythonDetail(userId: string) {
  const user = await User.findOne({ ...excludeDemoUsersFilter, _id: userId, "learnPython.visited": true })
    .select("email role parentProfile profile lastLoginAt learnPython")
    .lean<LeanUser>();
  if (!user?.learnPython) {
    throw Object.assign(new Error("Learner not found"), { status: 404 });
  }
  const lp = user.learnPython;
  const lessons = (lp.lessons ?? {}) as Record<string, PyLessonProgress>;
  const open = unlockedLessons(PY_LESSON_ORDER, lessons);
  const awards = Object.entries((lp.awards ?? {}) as Record<string, { xp: number; at: string }>)
    .map(([key, a]) => ({ key, xp: Number(a?.xp) || 0, at: a?.at ?? "" }))
    .sort((a, b) => b.at.localeCompare(a.at));

  return {
    userId: String(user._id),
    email: user.email,
    role: user.role,
    ...contact(user),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    ...summary(lp),
    days: [...(lp.days ?? [])].sort().slice(-60),
    videos: lp.videosWatched ?? [],
    projects: PY_PROJECTS.map((p) => {
      const pp = ((lp.projects ?? {}) as Record<string, PyProjectProgress>)[p.id];
      return {
        id: p.id,
        title: p.title,
        status: projectStatus(pp, Boolean(pp?.code)),
        completedAt: pp?.completedAt ?? null,
        solutionViewedAt: pp?.solutionViewedAt ?? null,
        hintsUsed: pp?.hintsUsed ?? 0,
      };
    }),
    certificateIssuedAt: lp.certificate?.issuedAt ? new Date(lp.certificate.issuedAt).toISOString() : null,
    lessons: PY_LESSON_INDEX.filter((l) => !l.final).map((l) => {
      const p = lessons[l.slug];
      return {
        slug: l.slug,
        number: l.number,
        title: l.title,
        available: l.available,
        unlocked: open.has(l.slug),
        notesDone: Boolean(p?.notesDone),
        examplesDone: Boolean(p?.examplesDone),
        completedAt: p?.completedAt ?? null,
        bestScore: p?.bestScore ?? null,
        total: p?.practice?.total ?? null,
        stars: p?.stars ?? 0,
      };
    }),
    achievementList: Object.entries((lp.achievements ?? {}) as Record<string, string>)
      .map(([id, at]) => ({ id, title: ACHIEVEMENTS[id as AchievementId]?.title ?? id, at }))
      .sort((a, b) => b.at.localeCompare(a.at)),
    recentAwards: awards.slice(0, 80),
  };
}
