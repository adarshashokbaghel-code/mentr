import type { Response } from "express";
import { connectDb } from "./db";
import { backfillMapCoords, ensureFacultyMapLocation } from "./lib/map-location";
import { isProfileComplete } from "./lib/profile-complete";
import { User, type IUser } from "./models/User";
import {
  loadFeaturedPublicTeachers,
  loadPublicPremiumTeachers,
} from "./services/featured-tutors";
import { NO_CONNECTION, toPublicTeacher } from "./serialize-teacher";

const PUBLIC_LIST_TTL_MS = 60_000;
const PUBLIC_COUNT_TTL_MS = 60_000;

let publicListCache: {
  teachers: Record<string, unknown>[];
  at: number;
} | null = null;

let publicCountCache: { count: number; at: number } | null = null;

/** Live count of public faculty with completed profiles (no hard floor). */
export async function countPublicTeachers(): Promise<number> {
  if (
    publicCountCache &&
    Date.now() - publicCountCache.at < PUBLIC_COUNT_TTL_MS
  ) {
    return publicCountCache.count;
  }

  await connectDb();

  const count = await User.countDocuments({
    role: { $ne: "parent" },
    profileCompleted: true,
    "profile.name": { $exists: true, $ne: "" },
  });

  publicCountCache = { count, at: Date.now() };
  return count;
}

/** Load all public faculty profiles for browse (no phone / connection info). */
export async function loadPublicTeachers(): Promise<Record<string, unknown>[]> {
  if (
    publicListCache &&
    Date.now() - publicListCache.at < PUBLIC_LIST_TTL_MS
  ) {
    return publicListCache.teachers;
  }

  await connectDb();

  const users = (await User.find({
    role: { $ne: "parent" },
    "profile.name": { $exists: true, $ne: "" },
  })
    .sort({ createdAt: -1 })
    .limit(2000)) as IUser[];

  const complete = users.filter((u) => isProfileComplete(u));

  void backfillMapCoords(complete).catch((err) =>
    console.error("map coords backfill:", err),
  );

  const teachers = complete.map((u) =>
    JSON.parse(JSON.stringify(toPublicTeacher(u, NO_CONNECTION))) as Record<
      string,
      unknown
    >,
  );
  publicListCache = { teachers, at: Date.now() };
  return teachers;
}

/** Public mentor count for landing stats — lightweight, cached. */
let platformStatsCache: {
  subjects: number;
  snapGradeQuestions: number;
  at: number;
} | null = null;

/** Distinct subjects across public tutor profiles + Snap & Grade question bank size. */
async function loadPlatformStats() {
  if (
    platformStatsCache &&
    Date.now() - platformStatsCache.at < PUBLIC_COUNT_TTL_MS
  ) {
    return platformStatsCache;
  }
  await connectDb();
  const { SnapGradeQuestion } = await import("./models/SnapGrade");
  const [subjectRows, snapGradeQuestions] = await Promise.all([
    User.aggregate<{ n: number }>([
      {
        $match: {
          role: { $ne: "parent" },
          profileCompleted: true,
          "profile.name": { $exists: true, $ne: "" },
        },
      },
      { $unwind: "$profile.subjects" },
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$profile.subjects" } } },
        },
      },
      { $match: { _id: { $ne: "" } } },
      { $count: "n" },
    ]),
    SnapGradeQuestion.estimatedDocumentCount(),
  ]);
  platformStatsCache = {
    subjects: subjectRows[0]?.n ?? 0,
    snapGradeQuestions,
    at: Date.now(),
  };
  return platformStatsCache;
}

export async function getPublicTeacherStats(res: Response): Promise<void> {
  try {
    const [count, platform] = await Promise.all([
      countPublicTeachers(),
      loadPlatformStats().catch((err) => {
        console.error("public platform stats error:", err);
        return null;
      }),
    ]);
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=180");
    res.json({
      count,
      mentors: count,
      subjects: platform?.subjects ?? null,
      snapGradeQuestions: platform?.snapGradeQuestions ?? null,
    });
  } catch (error) {
    console.error("public teacher stats error:", error);
    res.status(500).json({ error: "Failed to load mentor count" });
  }
}

/** Admin-curated featured tutors for the homepage (ordered). */
export async function getPublicFeaturedTeachers(res: Response): Promise<void> {
  try {
    await connectDb();
    const teachers = await loadFeaturedPublicTeachers();
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json({ teachers });
  } catch (error) {
    console.error("public featured teachers error:", error);
    res.status(500).json({ error: "Failed to load featured teachers" });
  }
}

/** All active Premium mentors for /premiummentors (public, no phones). */
export async function getPublicPremiumTeachers(res: Response): Promise<void> {
  try {
    await connectDb();
    const teachers = await loadPublicPremiumTeachers();
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json({ teachers });
  } catch (error) {
    console.error("public premium teachers error:", error);
    res.status(500).json({ error: "Failed to load premium mentors" });
  }
}

/** Public directory — no auth, no phone numbers (Express). */
export async function getPublicTeachers(res: Response): Promise<void> {
  try {
    const teachers = await loadPublicTeachers();
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=180");
    res.json({ teachers });
  } catch (error) {
    console.error("public teachers list error:", error);
    res.status(500).json({ error: "Failed to load teachers" });
  }
}

/** Load a public faculty profile for SEO pages (no phone / connection info). */
export async function loadPublicTeacherById(
  id: string,
): Promise<Record<string, unknown> | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;

  await connectDb();

  const user = (await User.findById(id)) as IUser | null;
  if (!user || user.role === "parent" || !isProfileComplete(user)) {
    return null;
  }

  await ensureFacultyMapLocation(user);

  const teacher = toPublicTeacher(user, NO_CONNECTION);
  return JSON.parse(JSON.stringify(teacher)) as Record<string, unknown>;
}

/** Public SEO profile — no auth, no phone number (Express). */
export async function getPublicTeacher(
  id: string,
  res: Response,
): Promise<void> {
  try {
    const teacher = await loadPublicTeacherById(id);
    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.json({ teacher });
  } catch (error) {
    console.error("public teacher error:", error);
    res.status(500).json({ error: "Failed to load teacher" });
  }
}
