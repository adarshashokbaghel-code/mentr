import type { TestimonialNameMaps } from "@/lib/testimonial-names";

function siteBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
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
