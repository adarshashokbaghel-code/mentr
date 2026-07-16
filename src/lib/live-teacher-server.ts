import type { Teacher } from "@/lib/teachers";

/** Load a live faculty profile from MongoDB for public SEO pages (SSR). */
export async function fetchLiveTeacher(id: string): Promise<Teacher | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;

  try {
    const { connectDb } = await import("../../server/db");
    const { User } = await import("../../server/models/User");
    const { isProfileComplete } = await import(
      "../../server/lib/profile-complete"
    );
    const { toPublicTeacher } = await import("../../server/serialize-teacher");

    await connectDb();

    const user = await User.findById(id).lean();
    if (!user || user.role === "parent" || !isProfileComplete(user)) {
      return null;
    }

    const teacher = toPublicTeacher(user);
    // RSC requires plain JSON-serializable props for client components.
    return JSON.parse(JSON.stringify(teacher)) as Teacher;
  } catch (err) {
    console.error("fetchLiveTeacher error:", err);
    return null;
  }
}
