import type { Response } from "express";
import { fetchTestimonialNameMaps, type TestimonialNameMaps } from "./lib/testimonial-names";
import { PUBLIC_CDN_CACHE } from "./public-teacher";

const TTL_MS = 10 * 60 * 1000;
let cache: { maps: TestimonialNameMaps; at: number } | null = null;

/** Public name lookup for marketing testimonials — first names only, no contact info. */
export async function getPublicTestimonialNames(res: Response): Promise<void> {
  try {
    if (!cache || Date.now() - cache.at > TTL_MS) {
      cache = { maps: await fetchTestimonialNameMaps(), at: Date.now() };
    }
    res.set("Cache-Control", PUBLIC_CDN_CACHE);
    res.json(cache.maps);
  } catch (error) {
    console.error("testimonial names error:", error);
    res.status(500).json({ error: "Failed to load testimonial names" });
  }
}
