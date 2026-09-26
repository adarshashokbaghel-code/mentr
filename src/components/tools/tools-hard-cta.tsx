"use client";

import { trackToolEvent } from "@/lib/tools-analytics";
import type { ToolAudience } from "@/lib/tools-catalog";
import { ArrowRight, BookOpen, Search, UserPlus, Users } from "lucide-react";
import Link from "next/link";

function toolUtm(slug: string, cta: string): string {
  const q = new URLSearchParams({
    utm_source: "tool",
    utm_medium: "hard_cta",
    utm_campaign: slug,
    utm_content: cta,
  });
  return q.toString();
}

function hrefWithUtm(path: string, slug: string, cta: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}${toolUtm(slug, cta)}`;
}

type CtaDef = {
  id: string;
  href: string;
  label: string;
  detail: string;
  icon: typeof Search;
  primary?: boolean;
};

function buildCtas(audiences: ToolAudience[]): CtaDef[] {
  const parentFirst: CtaDef[] = [
    {
      id: "search",
      href: "/search",
      label: "Find a verified tutor now",
      detail:
        "PDF / plan ready? Match a tutor for this subject — WhatsApp after both accept. ₹0 to connect.",
      icon: Search,
      primary: true,
    },
    {
      id: "parent",
      href: "/parent/signup",
      label: "Create free parent account",
      detail:
        "Save tutors, post requirements, and manage sessions — free signup in under a minute.",
      icon: Users,
    },
    {
      id: "faculty",
      href: "/faculty/signup",
      label: "Tutors: list your profile free",
      detail:
        "Parents find you in search. No lead coins — respond when you want the student.",
      icon: UserPlus,
    },
    {
      id: "learn",
      href: "/learn/start",
      label: "Free Learn for Class 3–5",
      detail: "Coding, AI & math — enroll free if your child is Class 3–5.",
      icon: BookOpen,
    },
  ];

  // Teachers/PDF: keep parent search first, then faculty slightly higher for tutor traffic
  if (audiences.includes("teachers") && !audiences.includes("students")) {
    return [
      parentFirst[0],
      parentFirst[2],
      parentFirst[1],
      parentFirst[3],
    ];
  }
  return parentFirst;
}

/** Hard conversion block — parent-first lead gen after tool use. */
export function ToolsHardCta({
  slug,
  audiences = ["students"],
  toolLabel,
}: {
  slug: string;
  audiences?: ToolAudience[];
  /** Short tool name for headline personalization */
  toolLabel?: string;
}) {
  const ctas = buildCtas(audiences);
  const primary = ctas.find((c) => c.primary) ?? ctas[0];
  const rest = ctas.filter((c) => c.id !== primary.id);

  return (
    <section
      id="next-step"
      className="scroll-mt-24 overflow-hidden rounded-2xl border-2 border-ink bg-ink text-white shadow-[4px_4px_0_0_#ff6a1a]"
    >
      <div className="border-b border-white/10 bg-coral px-5 py-3 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/90">
          Next step · lead from this tool
        </p>
        <h2 className="mt-0.5 text-[1.25rem] font-extrabold leading-snug sm:text-[1.4rem]">
          {toolLabel
            ? `${toolLabel} done — need a tutor for this subject?`
            : "Tool done — need a tutor now?"}
        </h2>
        <p className="mt-1 max-w-2xl text-[13px] font-medium text-white/90">
          Free tools stay free. When homework, PDFs, or CGPA questions need a
          person — find a verified tutor on Mentr. Parents first; tutors can
          list free too.
        </p>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <Link
          href={hrefWithUtm(primary.href, slug, primary.id)}
          onClick={() =>
            trackToolEvent("tool_cta_click", {
              slug,
              cta: primary.id,
              placement: "hard_primary",
            })
          }
          className="group flex w-full items-center justify-between gap-3 rounded-xl bg-coral px-4 py-4 text-left transition hover:brightness-110 sm:px-5"
        >
          <span className="min-w-0">
            <span className="block text-[15px] font-extrabold sm:text-[16px]">
              {primary.label}
            </span>
            <span className="mt-0.5 block text-[12px] font-medium text-white/90 sm:text-[13px]">
              {primary.detail}
            </span>
          </span>
          <ArrowRight
            className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </Link>

        <ul className="grid gap-2 sm:grid-cols-3">
          {rest.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.id}>
                <Link
                  href={hrefWithUtm(c.href, slug, c.id)}
                  onClick={() =>
                    trackToolEvent("tool_cta_click", {
                      slug,
                      cta: c.id,
                      placement: "hard_secondary",
                    })
                  }
                  className="flex h-full flex-col rounded-xl border border-white/15 bg-white/5 p-3.5 transition hover:border-coral hover:bg-white/10"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-coral">
                    <Icon className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <span className="mt-2 text-[13px] font-extrabold text-white">
                    {c.label}
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium leading-snug text-white/70">
                    {c.detail}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Compact sidebar / mobile hard CTA — parent search primary. */
export function ToolsHardCtaCompact({
  slug,
  placement,
}: {
  slug: string;
  placement: "sidebar" | "mobile";
}) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-ink p-4 text-white shadow-[3px_3px_0_0_#ff6a1a]">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
        Need help after this tool?
      </p>
      <p className="mt-1 text-[14px] font-extrabold leading-snug">
        Find a verified tutor — free to connect
      </p>
      <Link
        href={hrefWithUtm("/search", slug, "search")}
        onClick={() =>
          trackToolEvent("tool_cta_click", {
            slug,
            cta: "search",
            placement,
          })
        }
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-coral px-3 py-2.5 text-[13px] font-extrabold text-white hover:brightness-110"
      >
        Find a tutor
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </Link>
      <Link
        href={hrefWithUtm("/parent/signup", slug, "parent")}
        onClick={() =>
          trackToolEvent("tool_cta_click", {
            slug,
            cta: "parent",
            placement,
          })
        }
        className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-3 py-2 text-[12px] font-bold text-white/90 hover:bg-white/10"
      >
        Parent signup free
      </Link>
      <Link
        href={hrefWithUtm("/faculty/signup", slug, "faculty")}
        onClick={() =>
          trackToolEvent("tool_cta_click", {
            slug,
            cta: "faculty",
            placement,
          })
        }
        className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-3 py-2 text-[12px] font-bold text-white/90 hover:bg-white/10"
      >
        Tutor: create profile
      </Link>
    </div>
  );
}
