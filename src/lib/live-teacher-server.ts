import type { Teacher } from "@/lib/teachers";

function siteBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}

async function fetchViaPublicApi(id: string): Promise<Teacher | null> {
  const res = await fetch(`${siteBase()}/api/teachers/public/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { teacher?: Teacher };
  return data.teacher ?? null;
}

async function fetchViaDb(id: string): Promise<Teacher | null> {
  const { connectDb } = await import("../../server/db");
  const { User } = await import("../../server/models/User");
  const { isProfileComplete } = await import(
    "../../server/lib/profile-complete"
  );
  const { toPublicTeacher, NO_CONNECTION } = await import(
    "../../server/serialize-teacher"
  );

  await connectDb();

  const user = await User.findById(id).lean();
  if (!user || user.role === "parent" || !isProfileComplete(user)) {
    return null;
  }

  const teacher = toPublicTeacher(user, NO_CONNECTION);
  return JSON.parse(JSON.stringify(teacher)) as Teacher;
}

/** Load a live faculty profile for public SEO pages (SSR). */
export async function fetchLiveTeacher(id: string): Promise<Teacher | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;

  try {
    // On Vercel, prefer the Express handler — mongoose is reliable in pages/api.
    if (process.env.VERCEL === "1") {
      try {
        const fromApi = await fetchViaPublicApi(id);
        if (fromApi) return fromApi;
      } catch (err) {
        console.error("fetchLiveTeacher api fetch error:", err);
      }
    }

    return await fetchViaDb(id);
  } catch (err) {
    console.error("fetchLiveTeacher error:", err);
    return null;
  }
}
