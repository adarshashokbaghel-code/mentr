"use client";

import {
  persistAttribution,
  trackMarketingEvent,
} from "@/lib/marketing-client";
import {
  defaultUtmFor,
  withUtm,
  type MarketingKind,
} from "@/lib/marketing-utm";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  slug: string;
  kind?: MarketingKind;
  content?: string;
  className?: string;
  children: ReactNode;
  /** Open in new tab (external social / Product Hunt) */
  external?: boolean;
  onClick?: () => void;
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function TrackedLink({
  href,
  slug,
  kind = "blog",
  content,
  className,
  children,
  external,
  onClick,
}: Props) {
  const trackedHref = isExternalHref(href)
    ? href
    : withUtm(href, defaultUtmFor(kind, slug, content));
  const openExternal = external ?? isExternalHref(href);

  function onNavigate() {
    const path =
      typeof window !== "undefined"
        ? window.location.pathname
        : `/${kind}/${slug}`;
    if (!openExternal) {
      persistAttribution({ slug, kind, path, href: trackedHref });
    }
    void trackMarketingEvent({
      type: "redirect",
      slug,
      kind,
      path,
      href: trackedHref,
    });
    onClick?.();
  }

  if (openExternal) {
    return (
      <a
        href={trackedHref}
        className={cn(className)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={trackedHref}
      className={cn(className)}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}
