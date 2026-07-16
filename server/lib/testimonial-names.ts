import { connectDb } from "../db";
import { User } from "../models/User";

export type TestimonialNameMaps = {
  parentByArea: Record<string, string>;
  facultyByEmail: Record<string, string>;
};

function areaKey(area: string): string {
  return area.trim().toLowerCase();
}

/** Public parent / faculty first names for marketing testimonials. */
export async function fetchTestimonialNameMaps(): Promise<TestimonialNameMaps> {
  await connectDb();

  const [parents, faculty] = await Promise.all([
    User.find({
      role: "parent",
      profileCompleted: true,
      "parentProfile.name": { $exists: true, $nin: ["", null] },
      "parentProfile.area": { $exists: true, $nin: ["", null] },
    })
      .select("parentProfile.area parentProfile.name")
      .lean(),
    User.find({
      role: "faculty",
      profileCompleted: true,
      "profile.name": { $exists: true, $nin: ["", null] },
    })
      .select("email profile.name")
      .lean(),
  ]);

  const parentByArea: Record<string, string> = {};
  for (const row of parents) {
    const area = row.parentProfile?.area?.trim();
    const name = row.parentProfile?.name?.trim();
    if (!area || !name) continue;
    parentByArea[areaKey(area)] = name;
  }

  const facultyByEmail: Record<string, string> = {};
  for (const row of faculty) {
    const email = row.email?.trim().toLowerCase();
    const name = row.profile?.name?.trim();
    if (!email || !name) continue;
    facultyByEmail[email] = name;
  }

  return { parentByArea, facultyByEmail };
}
