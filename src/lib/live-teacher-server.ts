import type { Teacher } from "@/lib/teachers";
import { SITE_URL } from "@/lib/seo";

function siteBase(): string {
  if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
    const port = process.env.PORT || "3000";
    return process.env.FRONTEND_URL?.replace(/\/$/, "") || `http://127.0.0.1:${port}`;
  }
  return SITE_URL;
}

async function loadFromDb(id: string): Promise<Teacher | null> {
  const { loadPublicTeacherById } = await import(
    "../../server/public-teacher"
  );
  const teacher = await loadPublicTeacherById(id);
  return teacher as Teacher | null;
}

/** Load a live faculty profile for public SEO pages (SSR). */
export async function fetchLiveTeacher(id: string): Promise<Teacher | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;

  try {
    if (process.env.VERCEL === "1") {
      try {
        const res = await fetch(`${siteBase()}/api/teachers/public/${id}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = (await res.json()) as { teacher?: Teacher };
          if (data.teacher) return data.teacher;
        }
      } catch (err) {
        console.error("fetchLiveTeacher api fetch error:", err);
      }
    }

    return await loadFromDb(id);
  } catch (err) {
    console.error("fetchLiveTeacher error:", err);
    return null;
  }
}
