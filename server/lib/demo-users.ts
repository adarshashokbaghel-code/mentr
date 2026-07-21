/** Seeded demo personas use @mentr.local — hide from admin analytics and lists. */
export const DEMO_EMAIL_SUFFIX = "@mentr.local";

export function isDemoUserEmail(email: string): boolean {
  return email.toLowerCase().endsWith(DEMO_EMAIL_SUFFIX);
}

/** Spread into MongoDB User queries to exclude demo accounts. */
export const excludeDemoUsersFilter = {
  email: { $not: { $regex: /@mentr\.local$/i } },
} as const;
