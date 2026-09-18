"use client";

import { trackToolEvent } from "@/lib/tools-analytics";
import { BookOpen, Search, UserPlus, Users } from "lucide-react";
import Link from "next/link";

const CTAS = [
  {
    id: "search",
    href: "/search",
    label: "Find a tutor",
    detail: "Browse verified tutors near you or online — ₹0 to connect",
    icon: Search,
    tint: "bg-[#fff4e8] text-[#c2410c]",
  },
  {
    id: "learn",
    href: "/learn/start",
    label: "Free Learn for Class 3–5",
    detail: "CS, AI & Math — enroll free after you finish the tool",
    icon: BookOpen,
    tint: "bg-[#e6f7f4] text-[#0d9488]",
  },
  {
    id: "faculty",
    href: "/faculty/signup",
    label: "Create tutor profile",
    detail: "List free — parents message you on WhatsApp",
    icon: UserPlus,
    tint: "bg-[#eef2ff] text-[#4338ca]",
  },
  {
    id: "parent",
    href: "/parent/signup",
    label: "Parent signup",
    detail: "Save tutors, post requirements, manage Learn enrollments",
    icon: Users,
    tint: "bg-[#fef3c7] text-[#b45309]",
  },
] as const;

export function ToolsSoftCta({ slug }: { slug: string }) {
  return (
    <section className="rounded-2xl border-2 border-ink bg-white p-5 shadow-[3px_3px_0_0_#ff6a1a] sm:p-6">
      <p className="text-[12px] font-bold uppercase tracking-wider text-coral">
        Done with the tool?
      </p>
      <h2 className="mt-1 text-[1.15rem] font-extrabold text-ink">
        Keep going on Mentr
      </h2>
      <p className="mt-1 max-w-2xl text-[13px] font-medium text-muted">
        Tools stay free forever — no login wall. When you are ready, find a
        tutor, start Learn, list as faculty, or create a parent account. That is
        how tool traffic becomes real learning on Mentr.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CTAS.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.id}>
              <Link
                href={c.href}
                onClick={() =>
                  trackToolEvent("tool_cta_click", {
                    slug,
                    cta: c.id,
                  })
                }
                className="flex h-full flex-col rounded-xl border border-hairline bg-cream/40 p-3.5 transition hover:border-ink hover:shadow-[2px_2px_0_0_#1c2434]"
              >
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.tint}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <span className="mt-2 text-[14px] font-extrabold text-ink">
                  {c.label}
                </span>
                <span className="mt-0.5 text-[12px] font-medium text-muted">
                  {c.detail}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
