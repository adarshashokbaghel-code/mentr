"use client";

import type { ToolFaq } from "@/lib/tools-page-copy";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export function ToolFaqSearch({ faqs }: { faqs: ToolFaq[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(needle) ||
        f.answer.toLowerCase().includes(needle),
    );
  }, [faqs, q]);

  return (
    <section id="faq" className="scroll-mt-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[1.2rem] font-extrabold text-ink">
            Frequently asked questions
          </h2>
          <p className="mt-1 text-[13px] font-medium text-muted">
            Search privacy, pricing, WhatsApp, and how-to answers
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search FAQ…"
            className="h-11 w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-9 text-[13px] font-semibold outline-none focus:border-ink"
            aria-label="Search FAQ"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:bg-cream"
              aria-label="Clear FAQ search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-hairline bg-white px-4 py-8 text-center text-[13px] font-medium text-muted">
          No FAQ matched “{q}”. Try “free”, “upload”, or “WhatsApp”.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {filtered.map((f) => (
            <li key={f.question}>
              <details className="group rounded-2xl border border-hairline bg-white open:border-ink/20 open:shadow-sm">
                <summary className="cursor-pointer list-none px-4 py-3.5 text-[14px] font-extrabold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    {f.question}
                    <span className="mt-0.5 shrink-0 text-[18px] font-bold leading-none text-coral transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-hairline px-4 py-3 text-[13px] font-medium leading-relaxed text-muted">
                  {f.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
