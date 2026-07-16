"use client";

import { FAQS as faqs } from "@/lib/faqs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-lavender py-16 sm:py-24">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-coral">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-lg border border-hairline bg-white shadow-sm"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cream"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-ink">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-hairline bg-butter/40 px-5 py-4">
                    <p className="text-base leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
