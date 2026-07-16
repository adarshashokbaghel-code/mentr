import type { Response } from "express";
import { connectDb } from "./db";
import { isProfileComplete } from "./lib/profile-complete";
import { User } from "./models/User";
import { NO_CONNECTION, toPublicTeacher } from "./serialize-teacher";

/** Load a public faculty profile for SEO pages (no phone / connection info). */
export async function loadPublicTeacherById(
  id: string,
): Promise<Record<string, unknown> | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;

  await connectDb();

  const user = await User.findById(id).lean();
  if (!user || user.role === "parent" || !isProfileComplete(user)) {
    return null;
  }

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
