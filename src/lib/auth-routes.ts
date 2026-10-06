import type { AuthUser } from "@/lib/api";
import { skipsProfiling } from "@/lib/public-browse";

/** Where a logged-in user should land, given their role and profile state. */
export function homeFor(user: AuthUser, next?: string | null): string {
  if (user.role === "parent") {
    if (!user.profileCompleted) {
      // Search / tutor profiles / Snap & Grade / Learn Python can continue — identity at connect.
      if (next && skipsProfiling(next)) return next;
      return next
        ? `/parent/profiling?next=${encodeURIComponent(next)}`
        : "/parent/profiling";
    }
    return next || "/search";
  }
  if (next && skipsProfiling(next)) return next;
  return user.profileCompleted ? "/dashboard" : "/profiling";
}
