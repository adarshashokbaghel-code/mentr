export type SitemapTeacherRef = {
  path: string;
  lastModified?: Date;
};

/**
 * Live MongoDB faculty profiles for the sitemap (when DB is reachable at build).
 */
export async function resolveTeacherSitemapRefs(): Promise<SitemapTeacherRef[]> {
  const byId = new Map<string, SitemapTeacherRef>();

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
    // Empty teacher sitemap segment when Mongo is unavailable.
  }

  return [...byId.values()];
}
