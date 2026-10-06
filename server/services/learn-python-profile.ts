import { randomInt } from "node:crypto";
import {
  CERT_ID_ALPHABET,
  CERT_ID_RE,
  PY_CERT_COURSE,
  certificateProgress,
  type CertProgress,
} from "../../src/lib/python-lms/certificate";
import type { PyLessonProgress } from "../../src/lib/python-lms/lesson-progress";
import type { PyProjectProgress } from "../../src/lib/python-lms/project-progress";
import { User, type ILearnPython, type ILearnPythonCertificate } from "../models/User";

const LEADERBOARD_SIZE = 100;

type NamedUser = {
  _id: unknown;
  email: string;
  role: "parent" | "faculty";
  profile?: { name?: string };
  parentProfile?: { name?: string };
  learnPython?: ILearnPython;
};

function fullName(u: NamedUser): string {
  return (u.role === "parent" ? u.parentProfile?.name : u.profile?.name)?.trim() || u.profile?.name?.trim() || u.parentProfile?.name?.trim() || "";
}

/** "Mia Khan" → "Mia K." so the public board never shows a full name or email. */
function boardName(u: NamedUser): string {
  const parts = fullName(u).split(/\s+/).filter(Boolean);
  if (!parts.length) return "Learner";
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
}

function progressOf(lp: ILearnPython | undefined): CertProgress {
  return certificateProgress({
    lessons: (lp?.lessons ?? {}) as Record<string, PyLessonProgress>,
    awardKeys: Object.keys(lp?.awards ?? {}),
    projects: (lp?.projects ?? {}) as Record<string, PyProjectProgress>,
  });
}

export type PublicCertificate = {
  id: string;
  name: string;
  course: string;
  issuedAt: string;
  stats: ILearnPythonCertificate["stats"];
};

function toPublic(c: ILearnPythonCertificate): PublicCertificate {
  return { id: c.id, name: c.name, course: c.course, issuedAt: new Date(c.issuedAt).toISOString(), stats: c.stats };
}

async function rankOf(xp: number): Promise<number> {
  if (xp <= 0) return 0;
  return (await User.countDocuments({ "learnPython.visited": true, "learnPython.xp": { $gt: xp } })) + 1;
}

const NAME_FIELDS = "email role profile.name parentProfile.name";

export async function getLearnPythonProfile(userId: string) {
  const user = await User.findById(userId).select(`${NAME_FIELDS} learnPython`).lean<NamedUser>();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  const lp = user.learnPython;
  const [rank, learners] = await Promise.all([
    rankOf(lp?.xp ?? 0),
    User.countDocuments({ "learnPython.visited": true, "learnPython.xp": { $gt: 0 } }),
  ]);
  return {
    name: fullName(user),
    email: user.email,
    role: user.role,
    firstVisitAt: lp?.firstVisitAt ? new Date(lp.firstVisitAt).toISOString() : null,
    xp: lp?.xp ?? 0,
    level: lp?.level ?? 1,
    levelTitle: lp?.levelTitle ?? "",
    streakDays: lp?.streakDays ?? 0,
    bestStreak: lp?.bestStreak ?? 0,
    daysActive: lp?.days?.length ?? 0,
    rank,
    learners,
    certificate: lp?.certificate ? toPublic(lp.certificate) : null,
    certificateUnlocked: Boolean(lp?.certificateUnlocked),
    progress: progressOf(lp),
  };
}

export type LeaderboardRow = {
  rank: number;
  name: string;
  initials: string;
  xp: number;
  level: number;
  levelTitle: string;
  band: string;
  streakDays: number;
  lessonsStudied: number;
  projectsCompleted: number;
  certified: boolean;
  isMe: boolean;
};

function toRow(u: NamedUser, rank: number, meId: string): LeaderboardRow {
  const lp = u.learnPython;
  const name = boardName(u);
  const lessons = (lp?.lessons ?? {}) as Record<string, PyLessonProgress>;
  return {
    rank,
    name,
    initials: name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    xp: lp?.xp ?? 0,
    level: lp?.level ?? 1,
    levelTitle: lp?.levelTitle ?? "",
    band: lp?.band ?? "",
    streakDays: lp?.streakDays ?? 0,
    lessonsStudied: Object.values(lessons).filter((l) => l?.notesDone).length,
    projectsCompleted: lp?.projectsCompleted ?? 0,
    certified: Boolean(lp?.certificate?.id),
    isMe: String(u._id) === meId,
  };
}

/** Ranked by XP. Equal XP shares a rank; the earlier learner is listed first. */
export async function getLearnPythonLeaderboard(userId: string) {
  const filter = { "learnPython.visited": true, "learnPython.xp": { $gt: 0 } };
  const fields = `${NAME_FIELDS} learnPython.xp learnPython.level learnPython.levelTitle learnPython.band learnPython.streakDays learnPython.lessons learnPython.projectsCompleted learnPython.certificate.id`;
  const [docs, learners] = await Promise.all([
    User.find(filter).sort({ "learnPython.xp": -1, "learnPython.firstVisitAt": 1 }).limit(LEADERBOARD_SIZE).select(fields).lean<NamedUser[]>(),
    User.countDocuments(filter),
  ]);

  const rows: LeaderboardRow[] = [];
  docs.forEach((u, i) => {
    const prev = rows[i - 1];
    const rank = prev && prev.xp === (u.learnPython?.xp ?? 0) ? prev.rank : i + 1;
    rows.push(toRow(u, rank, userId));
  });

  let me = rows.find((r) => r.isMe) ?? null;
  if (!me) {
    const self = await User.findById(userId).select(fields).lean<NamedUser>();
    if (self) me = toRow(self, await rankOf(self.learnPython?.xp ?? 0), userId);
  }
  return { rows, me, learners };
}

function newCertificateId(): string {
  const pick = () => Array.from({ length: 4 }, () => CERT_ID_ALPHABET[randomInt(CERT_ID_ALPHABET.length)]).join("");
  return `MPY-${pick()}-${pick()}`;
}

/** Letters (any script), spaces, dots, apostrophes and hyphens; 2–60 characters. */
export function cleanCertificateName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.normalize("NFC").replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 60) return null;
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(name)) return null;
  return name;
}

/**
 * Issues the certificate when the stored progress meets every rule (or Mentr unlocked it).
 * The learner picks the printed name once; calling again returns the same certificate and name.
 */
export async function claimLearnPythonCertificate(userId: string, rawName: unknown): Promise<PublicCertificate> {
  const user = await User.findById(userId).select(`${NAME_FIELDS} learnPython`).lean<NamedUser>();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  const lp = user.learnPython;
  if (lp?.certificate) return toPublic(lp.certificate);

  const progress = progressOf(lp);
  if (!progress.eligible && !lp?.certificateUnlocked) {
    const missing = progress.requirements.filter((r) => !r.done).map((r) => `${r.title} (${r.have}/${r.need})`);
    throw Object.assign(new Error(`Not yet eligible: ${missing.join(", ")}`), { status: 400 });
  }
  const name = cleanCertificateName(rawName);
  if (!name) {
    throw Object.assign(new Error("Enter the name to print: 2–60 letters, spaces, dots, apostrophes or hyphens."), { status: 400 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const cert: ILearnPythonCertificate = {
      id: newCertificateId(),
      issuedAt: new Date(),
      name,
      course: PY_CERT_COURSE,
      stats: {
        xp: lp?.xp ?? 0,
        lessonsStudied: progress.stats.lessonsStudied,
        practiceSolved: progress.stats.practiceSolved,
        examplesSolved: progress.stats.examplesSolved,
        projectsCompleted: progress.stats.projectsCompleted,
        projects: progress.projectIds,
      },
    };
    try {
      const res = await User.updateOne(
        { _id: userId, "learnPython.certificate.id": { $exists: false } },
        { $set: { "learnPython.certificate": cert } },
      );
      if (res.modifiedCount === 1) return toPublic(cert);
      const again = await User.findById(userId).select("learnPython.certificate").lean<NamedUser>();
      if (again?.learnPython?.certificate) return toPublic(again.learnPython.certificate);
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err;
    }
  }
  throw new Error("Could not issue the certificate. Try again.");
}

export async function verifyLearnPythonCertificate(id: string): Promise<PublicCertificate | null> {
  const clean = id.trim().toUpperCase();
  if (!CERT_ID_RE.test(clean)) return null;
  const user = await User.findOne({ "learnPython.certificate.id": clean }).select("learnPython.certificate").lean<NamedUser>();
  return user?.learnPython?.certificate ? toPublic(user.learnPython.certificate) : null;
}
