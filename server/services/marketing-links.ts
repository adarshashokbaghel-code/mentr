import {
  MarketingLink,
  SOCIAL_LINK_CHANNELS,
  SOCIAL_LINK_PATHS,
  type SocialLinkChannel,
} from "../models/MarketingLink";
import { sanitizeMarketingSlug } from "../lib/marketing-attribution";

const LABEL_SLUG_RE = /[^a-z0-9]+/g;

export type MarketingLinkDto = {
  id: string;
  channel: SocialLinkChannel;
  slug: string;
  label: string;
  path: string;
  note?: string;
  createdAt: string;
  url: string;
};

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://mentr.in").replace(
    /\/$/,
    "",
  );
}

export function buildSocialPostUrl(input: {
  channel: SocialLinkChannel;
  slug: string;
  path: string;
}): string {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const url = new URL(path, `${siteUrl()}/`);
  url.searchParams.set("utm_source", input.channel);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", input.slug);
  url.searchParams.set("utm_content", "post");
  return url.toString();
}

function toDto(doc: {
  _id: unknown;
  channel: SocialLinkChannel;
  slug: string;
  label: string;
  path: string;
  note?: string;
  createdAt: Date;
}): MarketingLinkDto {
  return {
    id: String(doc._id),
    channel: doc.channel,
    slug: doc.slug,
    label: doc.label,
    path: doc.path,
    note: doc.note,
    createdAt: doc.createdAt.toISOString(),
    url: buildSocialPostUrl({
      channel: doc.channel,
      slug: doc.slug,
      path: doc.path,
    }),
  };
}

function slugifyLabel(label: string, channel: SocialLinkChannel): string {
  const prefix = channel === "instagram" ? "ig" : "li";
  const base = label
    .toLowerCase()
    .trim()
    .replace(LABEL_SLUG_RE, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const core = base || "post";
  return sanitizeMarketingSlug(`${prefix}-${core}`) || `${prefix}-post`;
}

function sanitizePath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const path = value.trim();
  if (!path.startsWith("/")) return undefined;
  if (path.startsWith("/admin") || path.startsWith("/api")) return undefined;
  if (path.length > 120) return undefined;
  if (
    !(SOCIAL_LINK_PATHS as readonly string[]).includes(path) &&
    !/^\/[a-z0-9][a-z0-9/-]{0,100}$/i.test(path)
  ) {
    return undefined;
  }
  return path;
}

export async function listMarketingLinks(
  channel?: SocialLinkChannel,
): Promise<MarketingLinkDto[]> {
  const filter = channel ? { channel } : {};
  const docs = await MarketingLink.find(filter)
    .sort({ createdAt: -1 })
    .lean();
  return docs.map((d) =>
    toDto({
      _id: d._id,
      channel: d.channel as SocialLinkChannel,
      slug: d.slug,
      label: d.label,
      path: d.path,
      note: d.note,
      createdAt: d.createdAt,
    }),
  );
}

export async function createMarketingLink(input: {
  channel: unknown;
  label: unknown;
  path?: unknown;
  slug?: unknown;
  note?: unknown;
}): Promise<MarketingLinkDto> {
  const channel = String(input.channel || "").toLowerCase();
  if (
    !(SOCIAL_LINK_CHANNELS as readonly string[]).includes(channel)
  ) {
    throw new Error("Channel must be instagram or linkedin");
  }
  const label =
    typeof input.label === "string" ? input.label.trim().slice(0, 120) : "";
  if (label.length < 2) throw new Error("Label is required");

  const path = sanitizePath(input.path) || "/";
  const note =
    typeof input.note === "string" && input.note.trim()
      ? input.note.trim().slice(0, 280)
      : undefined;

  let slug =
    sanitizeMarketingSlug(input.slug) ||
    slugifyLabel(label, channel as SocialLinkChannel);

  // Ensure uniqueness
  let attempt = 0;
  while (await MarketingLink.exists({ slug })) {
    attempt += 1;
    slug = sanitizeMarketingSlug(`${slug}-${attempt}`) || `${slug}-${attempt}`;
    if (attempt > 20) throw new Error("Could not allocate a unique slug");
  }

  const doc = await MarketingLink.create({
    channel,
    slug,
    label,
    path,
    note,
  });

  return toDto(doc);
}

export async function deleteMarketingLink(id: string): Promise<boolean> {
  if (!id || id.length > 40) return false;
  const result = await MarketingLink.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

export async function getMarketingLinkSlugMap(): Promise<
  Map<string, { channel: SocialLinkChannel; label: string }>
> {
  const docs = await MarketingLink.find({})
    .select("slug channel label")
    .lean();
  const map = new Map<string, { channel: SocialLinkChannel; label: string }>();
  for (const d of docs) {
    map.set(d.slug, {
      channel: d.channel as SocialLinkChannel,
      label: d.label,
    });
  }
  return map;
}
