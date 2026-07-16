import type { Teacher } from "@/lib/teachers";

function siteBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
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
