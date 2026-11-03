const OBJECT_PATH = "/storage/v1/object/public/";
const RENDER_PATH = "/storage/v1/render/image/public/";

/**
 * Small CDN rendition for a card. The parents reel is ~280px wide,
 * so a 480px file is enough for a sharp 2x screen and much faster than the original.
 */
export function tutorCardPhotoUrl(url?: string | null): string | null {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (!parsed.hostname.endsWith(".supabase.co")) return trimmed;
    if (!parsed.pathname.includes(OBJECT_PATH)) return trimmed;
    parsed.pathname = parsed.pathname.replace(OBJECT_PATH, RENDER_PATH);
    parsed.searchParams.set("width", "480");
    parsed.searchParams.set("quality", "55");
    parsed.searchParams.set("resize", "contain");
    return parsed.toString();
  } catch {
    return trimmed;
  }
}
