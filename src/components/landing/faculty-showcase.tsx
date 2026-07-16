"use client";

import { Button } from "@/components/ui/button";
import { FacultyActionLink } from "@/components/auth/role-guard-link";
import { BrowserFrame } from "@/components/ui/browser-frame";
import {
  BadgeCheck,
  CalendarDays,
  LayoutDashboard,
  MessageCircle,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register free",
    body: "Email OTP signup. Add subjects, bio, your area, and WhatsApp. We verify phone & identity before you go live.",
  },
  {
    icon: CalendarDays,
    title: "Set availability",
    body: "Toggle open slots on a simple dashboard. Parents nearby see who's free.",
  },
  {
    icon: MessageCircle,
    title: "Get contacted",
    body: "Parents send connect requests with a note. Accept to share your WhatsApp — you keep 100%.",
  },
];

export function FacultyShowcase() {
  return (
    <section id="for-faculty" className="bg-butter py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold text-ink/70">For faculty & mentors</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[40px]">
              Get listed. Get contacted.{" "}
              <span className="text-coral">Keep every rupee.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
              No coins. No paying for leads that never reply. No cut. Parents
              worldwide message you directly — local or online.
            </p>

            <div className="mt-8 space-y-5">
              {steps.map((step, i) => (
                <div key={step.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-ink text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">
                      <span className="text-muted">{i + 1}.</span> {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <FacultyActionLink href="/faculty/signup">
                <Button size="lg">
                  <UserPlus className="h-4 w-4" />
                  Register as faculty
                </Button>
              </FacultyActionLink>
             
            </div>
          </div>

          <div id="faculty-dashboard">
            <BrowserFrame
              url="mentr.in / dashboard"
              headerClassName="bg-butter-deep"
            >
              <div className="space-y-4 bg-cream p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                      Your profile
                      <BadgeCheck className="h-4 w-4 text-sage" />
                    </p>
                    <p className="text-xs text-muted">
                      Your subjects · Online · Your area
                    </p>
                  </div>
                  <span className="rounded-md bg-sage-wash px-2.5 py-1 text-[11px] font-bold text-sage">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Profile views", "248"],
                    ["WA taps", "37"],
                    ["Open slots", "4"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-md border border-hairline bg-white px-2 py-3 text-center"
                    >
                      <p className="text-lg font-bold text-ink">{value}</p>
                      <p className="text-[10px] font-medium text-muted">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-coral" />
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">
                      Availability
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { t: "Mon 4–6 PM", on: true },
                      { t: "Wed 5–7 PM", on: false },
                      { t: "Sat 10–12", on: true },
                      { t: "Sun 3–5 PM", on: true },
                    ].map((s) => (
                      <div
                        key={s.t}
                        className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold ${
                          s.on
                            ? "bg-sage-wash text-sage"
                            : "bg-white text-muted line-through opacity-70"
                        }`}
                      >
                        {s.t}
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            s.on
                              ? "bg-sage text-white"
                              : "bg-hairline text-muted"
                          }`}
                        >
                          {s.on ? "Open" : "Taken"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="rounded-md bg-ink px-3 py-2.5 text-center text-xs font-medium text-white">
                  Toggle slots after WhatsApp bookings — takes seconds
                </p>
              </div>
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
