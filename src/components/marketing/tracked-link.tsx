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
};

export function TrackedLink({
  href,
  slug,
  kind = "blog",
  content,
  className,
  children,
}: Props) {
  const trackedHref = withUtm(href, defaultUtmFor(kind, slug, content));

  return (
    <Link
      href={trackedHref}
      className={cn(className)}
      onClick={() => {
        const path =
          typeof window !== "undefined" ? window.location.pathname : `/${kind}/${slug}`;
        persistAttribution({ slug, kind, path, href: trackedHref });
        void trackMarketingEvent({
          type: "redirect",
          slug,
          kind,
          path,
          href: trackedHref,
        });
      }}
    >
      {children}
    </Link>
  );
}
