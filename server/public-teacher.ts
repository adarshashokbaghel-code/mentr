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
