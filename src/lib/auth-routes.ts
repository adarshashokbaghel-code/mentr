import type { AuthUser } from "@/lib/api";
import { LEARN_PYTHON_LMS_PATH } from "@/lib/learn-python";
import { pendingLearnPythonHandoff } from "@/lib/marketing-client";
import { skipsProfiling } from "@/lib/public-browse";

/** Where a logged-in user should land, given their role and profile state. */
export function homeFor(user: AuthUser, next?: string | null): string {
  // Signed up from /learnpython through another flow: finish the trip into the course.
  if (!next && pendingLearnPythonHandoff()) next = LEARN_PYTHON_LMS_PATH;
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
