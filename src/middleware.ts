import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Old WordPress / Yoast sitemap paths, e.g. /sitemap_211_94.xml */
const LEGACY_SITEMAP_PATH =
  /^\/(sitemapa?_\d+_\d+\.xml|sitemap\.xml\.gz|wp-sitemap\.xml|sitemap-index\.xml)$/i;

/** Query-only legacy URLs, e.g. /?sitemap_211_94.xml or /?sitemap.xml */
const LEGACY_SITEMAP_QUERY =
  /^(sitemapa?(_\d+_\d+)?\.xml|sitemap\.xml(\.gz)?)$/i;

/** Split child sitemaps from older deploys → unified index */
const LEGACY_CHILD_SITEMAP = /^\/sitemap\/[\w-]+\.xml$/i;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (LEGACY_SITEMAP_PATH.test(pathname) || LEGACY_CHILD_SITEMAP.test(pathname)) {
    return NextResponse.redirect(new URL("/sitemap.xml", request.url), 301);
  }

  const rawQuery = search.startsWith("?") ? search.slice(1) : search;
  if (rawQuery && LEGACY_SITEMAP_QUERY.test(rawQuery.split("&")[0] ?? "")) {
    return NextResponse.redirect(new URL("/sitemap.xml", request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico)$).*)"],
};
