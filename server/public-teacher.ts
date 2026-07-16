import type { Response } from "express";
import { User } from "./models/User";
import { isProfileComplete } from "./lib/profile-complete";
import { NO_CONNECTION, toPublicTeacher } from "./serialize-teacher";
import { connectDb } from "./db";

/** Public SEO profile — no auth, no phone number. */
export async function getPublicTeacher(
  id: string,
  res: Response,
): Promise<void> {
  try {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    await connectDb();

    const user = await User.findById(id).lean();
    if (!user || user.role === "parent" || !isProfileComplete(user)) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const teacher = toPublicTeacher(user, NO_CONNECTION);
    res.json({ teacher: JSON.parse(JSON.stringify(teacher)) });
  } catch (error) {
    console.error("public teacher error:", error);
    res.status(500).json({ error: "Failed to load teacher" });
  }
}
