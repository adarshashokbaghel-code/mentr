import type { TestimonialItem } from "@/lib/demo-users";

export type TestimonialNameMaps = {
  parentByArea: Record<string, string>;
  facultyByEmail: Record<string, string>;
};

function areaKey(area: string): string {
  return area.trim().toLowerCase();
}

export function resolveTestimonialName(
  item: TestimonialItem,
  maps: TestimonialNameMaps,
): string | undefined {
  if (item.name?.trim()) return item.name.trim();

  if (item.parentArea) {
    const fromDb = maps.parentByArea[areaKey(item.parentArea)];
    if (fromDb) return fromDb;
  }

  if (item.facultyEmail) {
    const fromDb = maps.facultyByEmail[item.facultyEmail.trim().toLowerCase()];
    if (fromDb) return fromDb;
  }

  return undefined;
}

export function enrichTestimonials(
  items: TestimonialItem[],
  maps: TestimonialNameMaps,
): TestimonialItem[] {
  return items.map((item) => {
    const name = resolveTestimonialName(item, maps);
    return name ? { ...item, name } : item;
  });
}
