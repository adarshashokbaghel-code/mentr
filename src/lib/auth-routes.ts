import type { AuthUser } from "@/lib/api";

/** Where a logged-in user should land, given their role and profile state. */
export function homeFor(user: AuthUser, next?: string | null): string {
  if (user.role === "parent") {
    if (!user.profileCompleted) {
      return next
        ? `/parent/profiling?next=${encodeURIComponent(next)}`
        : "/parent/profiling";
    }
    return next || "/search";
  }
  return user.profileCompleted ? "/dashboard" : "/profiling";
}
