import type { Response } from "express";
import { connectDb } from "./db";
import { backfillMapCoords, ensureFacultyMapLocation } from "./lib/map-location";
import { isProfileComplete } from "./lib/profile-complete";
import { User, type IUser } from "./models/User";
import { NO_CONNECTION, toPublicTeacher } from "./serialize-teacher";

const PUBLIC_LIST_TTL_MS = 60_000;

let publicListCache: {
  teachers: Record<string, unknown>[];
  at: number;
} | null = null;

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
    .limit(200)) as IUser[];

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
