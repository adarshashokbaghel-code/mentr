import type { TestimonialNameMaps } from "@/lib/testimonial-names";
import { SITE_URL } from "@/lib/seo";

function siteBase(): string {
  if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
    const port = process.env.PORT || "3000";
    return process.env.FRONTEND_URL?.replace(/\/$/, "") || `http://localhost:${port}`;
  }
  return SITE_URL;
}

async function fetchViaApi(): Promise<TestimonialNameMaps | null> {
  const res = await fetch(`${siteBase()}/api/testimonials/names`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as TestimonialNameMaps;
}

async function fetchViaDb(): Promise<TestimonialNameMaps> {
  const { fetchTestimonialNameMaps } = await import(
    "../../server/lib/testimonial-names"
  );
  return fetchTestimonialNameMaps();
}

/** Load parent / faculty names for marketing testimonials (SSR). */
export async function fetchTestimonialNameMaps(): Promise<TestimonialNameMaps> {
  try {
    if (process.env.VERCEL === "1") {
      const fromApi = await fetchViaApi();
      if (fromApi) return fromApi;
    }
    return await fetchViaDb();
  } catch (err) {
    console.error("fetchTestimonialNameMaps error:", err);
    return { parentByArea: {}, facultyByEmail: {} };
  }
}
