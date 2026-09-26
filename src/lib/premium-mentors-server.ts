/**
 * SSR loader for /premiummentors — active Premium mentors only.
 */

import type { Teacher } from "@/lib/teachers";

function toTeacher(raw: Record<string, unknown>): Teacher {
  return {
    ...(raw as unknown as Teacher),
    lat: typeof raw.lat === "number" ? raw.lat : NaN,
    lng: typeof raw.lng === "number" ? raw.lng : NaN,
    premium: true,
    live: true,
  };
}

export async function loadPremiumMentorsForPage(): Promise<Teacher[]> {
  try {
    const { loadPublicPremiumTeachers } = await import(
      "../../server/services/featured-tutors"
    );
    const { connectDb } = await import("../../server/db");
    await connectDb();
    const rows = await loadPublicPremiumTeachers();
    return rows.map(toTeacher);
  } catch (err) {
    console.error("premium mentors SSR:", err);
    return [];
  }
}
