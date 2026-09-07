/** Paths guests may open without signing in (browse-only; connect still gated). */
export function isPublicBrowsePath(href: string): boolean {
  const path = href.split("?")[0].split("#")[0];
  if (path === "/search" || path.startsWith("/search/")) return true;
  if (path.startsWith("/teachers/")) return true;
  return false;
}
