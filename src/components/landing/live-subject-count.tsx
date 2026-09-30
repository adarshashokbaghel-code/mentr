"use client";

import { formatSubjectCount, useSubjectCount } from "@/lib/mentor-stats";

/** Live subject count label (e.g. "189+"), usable inside server components. */
export function LiveSubjectCount() {
  return <>{formatSubjectCount(useSubjectCount())}</>;
}
