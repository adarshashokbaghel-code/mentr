import type { Response } from "express";
import { fetchTestimonialNameMaps } from "./lib/testimonial-names";

/** Public name lookup for marketing testimonials — first names only, no contact info. */
export async function getPublicTestimonialNames(res: Response): Promise<void> {
  try {
    const maps = await fetchTestimonialNameMaps();
    res.json(maps);
  } catch (error) {
    console.error("testimonial names error:", error);
    res.status(500).json({ error: "Failed to load testimonial names" });
  }
}
