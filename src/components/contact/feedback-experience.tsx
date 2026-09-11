"use client";

import { FeedbackForm } from "@/components/contact/feedback-form";
import {
  LpBadge,
  LpBlob,
  LpGridBg,
} from "@/components/landing/lp/shared";
import type { ContactKindId } from "@/lib/user-interaction";
import { LAUNCH_HUB_CITY } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  Check,
  Globe,
  Lightbulb,
  MapPin,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";

const GEO_CHIPS: { label: string; tint: string }[] = [
  { label: LAUNCH_HUB_CITY, tint: "bg-sage-wash text-sage border-sage/20" },
  { label: "Hyderabad", tint: "bg-lavender text-ink border-ink/10" },
  { label: "Delhi", tint: "bg-coral-wash text-coral-dark border-coral/20" },
  { label: "Chennai", tint: "bg-butter/60 text-ink border-ink/10" },
  { label: "Mumbai", tint: "bg-sage-wash text-sage border-sage/20" },
  { label: "Pune", tint: "bg-lavender text-ink border-ink/10" },
  { label: "UAE", tint: "bg-coral-wash text-coral-dark border-coral/20" },
  { label: "Worldwide", tint: "bg-butter/60 text-ink border-ink/10" },
];

const FORM_STEPS = [
  {
    id: 0,
    title: "You & contact type",
    body: "Pick feedback, feature, or review — plus name, email, city.",
    icon: User,
    iconBg: "bg-sage-wash text-sage",
  },
  {
    id: 1,
    title: "Your message",
    body: "Only the fields for what you picked — nothing extra.",
    icon: MessageSquare,
    iconBg: "bg-coral-wash text-coral",
  },
];

const KIND_ICON: Record<
  ContactKindId,
  { icon: typeof MessageSquare; bg: string }
> = {
  feedback: { icon: MessageSquare, bg: "bg-coral-wash text-coral" },
  feature: { icon: Lightbulb, bg: "bg-lavender text-ink" },
  review: { icon: Star, bg: "bg-butter/70 text-ink" },
};

export function FeedbackExperience({
  page,
}: {
  page: "/contact" | "/request-feature";
}) {
  const [contactKind, setContactKind] = useState<ContactKindId>(
    page === "/request-feature" ? "feature" : "feedback",
  );
  const [step, setStep] = useState(0);
  const kindVisual = KIND_ICON[contactKind];

  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <LpGridBg />
      <LpBlob
        color="rgba(255,241,228,0.85)"
        size={380}
        className="-left-28 -top-16"
      />
      <LpBlob
        color="rgba(230,246,238,0.7)"
        size={280}
        className="-right-20 bottom-0"
      />
      <LpBlob
        color="rgba(237,233,254,0.55)"
        size={200}
        className="left-1/3 top-1/2 hidden lg:block"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-2">
              <LpBadge>
                <MapPin className="h-3.5 w-3.5 text-sage" />
                {LAUNCH_HUB_CITY} · India · world
              </LpBadge>
              <LpBadge variant="coral">
                <Lightbulb className="h-3.5 w-3.5" />
                We ship from feedback
              </LpBadge>
              <span className="rounded-full bg-butter/70 px-2.5 py-1 text-[11px] font-bold text-ink">
                2 steps · ~1 min
              </span>
            </div>

            <h1 className="mt-5 text-[1.85rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[52px] lg:leading-[1.05]">
              Contact us.
              <span className="mt-2 block text-coral">
                Request a feature.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Two quick steps — who you are, then your message. We only show
              fields for the contact type you pick.
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {GEO_CHIPS.map((city) => (
                <span
                  key={city.label}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                    city.tint,
                  )}
                >
                  {city.label}
                </span>
              ))}
            </div>

            <ol className="mt-8 space-y-2">
              {FORM_STEPS.map((s) => {
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "flex gap-3 rounded-xl border-2 p-4 transition-all duration-200",
                      active
                        ? "border-ink bg-white shadow-[4px_4px_0_0_#1c1a17] ring-2 ring-sage/30"
                        : done
                          ? "border-sage/30 bg-sage-wash/40"
                          : "border-ink/10 bg-white/80 opacity-70",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        done ? "bg-sage text-white" : s.iconBg,
                      )}
                    >
                      {done ? (
                        <Check className="h-5 w-5" strokeWidth={2.5} />
                      ) : (
                        <s.icon className="h-5 w-5" />
                      )}
                    </span>
                    <span>
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ink">
                          {s.title}
                        </span>
                        {active && (
                          <span className="rounded-full bg-sage-wash px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
                            Step {s.id + 1} of 2
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                        {s.body}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {step === 1 && (
              <div
                className={cn(
                  "mt-4 flex items-center gap-3 rounded-xl border-2 border-ink/10 bg-white p-3",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    kindVisual.bg,
                  )}
                >
                  <kindVisual.icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-muted">
                  Sending as{" "}
                  <strong className="text-ink capitalize">{contactKind}</strong>
                </span>
              </div>
            )}

            <div className="mt-6">
              <div className="h-2 overflow-hidden rounded-full bg-ink/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sage to-coral transition-all duration-500"
                  style={{ width: step === 0 ? "50%" : "100%" }}
                />
              </div>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
                <Globe className="h-4 w-4 text-sage" />
                Reply within one working day, IST · ₹0 product, always
              </p>
            </div>
          </div>

          <FeedbackForm
            page={page}
            contactKind={contactKind}
            onContactKindChange={setContactKind}
            step={step}
            onStepChange={setStep}
          />
        </div>
      </div>
    </section>
  );
}
