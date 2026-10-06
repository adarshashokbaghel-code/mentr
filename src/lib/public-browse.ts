/** Paths guests may open without signing in (browse-only; connect still gated). */
export function isPublicBrowsePath(href: string): boolean {
  const path = href.split("?")[0].split("#")[0];
  if (path === "/search" || path.startsWith("/search/")) return true;
  if (path.startsWith("/teachers/")) return true;
  if (path === "/premiummentors") return true;
  if (path === "/snapandgrade" || path.startsWith("/snapandgrade/")) return true;
  return false;
}

/** After login, these return paths open directly — no profiling detour first. */
export function skipsProfiling(href: string): boolean {
  const path = href.split("?")[0].split("#")[0];
  if (path === "/learnpython" || path.startsWith("/learnpython/")) return true;
  return isPublicBrowsePath(href);
}
