import { TEACHERS } from "@/lib/teachers";

export type SitemapTeacherRef = {
  path: string;
  lastModified?: Date;
};

/**
 * Static demo teachers + live MongoDB faculty profiles (when DB is reachable at build).
 */
export async function resolveTeacherSitemapRefs(): Promise<SitemapTeacherRef[]> {
  const byId = new Map<string, SitemapTeacherRef>();

  for (const teacher of TEACHERS) {
    byId.set(teacher.id, { path: `/teachers/${teacher.id}` });
  }

  try {
    const { connectDb } = await import("../../server/db");
    const { User } = await import("../../server/models/User");
    await connectDb();

    const rows = await User.find({
      role: "faculty",
      profileCompleted: true,
    })
      .select("_id updatedAt")
      .lean();

    for (const row of rows) {
      const id = String(row._id);
      byId.set(id, {
        path: `/teachers/${id}`,
        lastModified: row.updatedAt ? new Date(row.updatedAt) : undefined,
      });
    }
  } catch {
    // Sitemap still ships with static teacher URLs when Mongo is unavailable.
  }

  return [...byId.values()];
}
