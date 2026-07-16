"use client";

import type { TestimonialItem } from "@/lib/demo-users";
import {
  enrichTestimonials,
  type TestimonialNameMaps,
} from "@/lib/testimonial-names";
import { useEffect, useState } from "react";

const EMPTY_MAPS: TestimonialNameMaps = {
  parentByArea: {},
  facultyByEmail: {},
};

export function useTestimonialNames(items: TestimonialItem[]): TestimonialItem[] {
  const [enriched, setEnriched] = useState(items);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/testimonials/names", { cache: "no-store" });
        if (!res.ok) return;
        const maps = (await res.json()) as TestimonialNameMaps;
        if (!cancelled) {
          setEnriched(enrichTestimonials(items, maps));
        }
      } catch {
        // Keep static copy if the lookup fails.
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [items]);

  return enriched;
}
