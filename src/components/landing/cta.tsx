"use client";

import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import {
  FacultyActionLink,
  ParentActionLink,
} from "@/components/auth/role-guard-link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Search } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="border-t border-hairline bg-cream-band py-10 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl text-center sm:mb-10 lg:text-left">
          <p className="text-sm font-semibold text-coral">Get started</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Built for parents{" "}
            <span className="text-coral">and</span> faculty.
          </h2>
            <p className="mt-3 text-base text-muted sm:text-lg">
              Parents search tutors or post requirements — faculty list and
              pitch. Same platform. Zero fees either way.
            </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col rounded-lg border border-hairline bg-white p-5 sm:p-7 lg:p-9">
            <span className="text-xs font-bold uppercase tracking-wider text-coral">
              Parents
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">
              Search or post. Connect free.
            </h3>
            <p className="mt-3 flex-1 text-base leading-relaxed text-muted">
              Know who you want? Browse verified teachers worldwide and send
              a connect request. Not sure yet? Post your requirement — tutors
              pitch, you pick who to connect with. WhatsApp unlocks once they
              accept. Mentr stays out of fees and scheduling.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink">
              <li className="flex gap-2">
                <span className="text-coral">→</span> Search tutors by subject &amp; area
              </li>
              <li className="flex gap-2">
                <span className="text-coral">→</span> Post a requirement — tutors pitch you
              </li>
              <li className="flex gap-2">
                <span className="text-coral">→</span> Accept → WhatsApp unlocks · ₹0 fees
              </li>
              <li className="flex gap-2">
                <span className="text-coral">→</span> Your identity hidden until you accept pitches
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ParentActionLink href="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="h-4 w-4" />
                  Find a teacher
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </ParentActionLink>
              <PostRequirementButton size="lg" className="w-full sm:w-auto" />
            </div>
          </div>

          <div className="flex flex-col rounded-lg border border-ink bg-ink p-5 text-white sm:p-7 lg:p-9">
            <span className="text-xs font-bold uppercase tracking-wider text-butter">
              Faculty
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight">
              Register. Get contacted. Keep 100%.
            </h3>
            <p className="mt-3 flex-1 text-base leading-relaxed text-white/70">
              No coins. No paying for leads that never reply. No cut. Create a
              profile, list availability, review connect requests, and pitch on
              the requirements board — your number is shared only with parents
              you accept.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/85">
              <li className="flex gap-2">
                <span className="text-butter">→</span> Free to list · contact always free
              </li>
              <li className="flex gap-2">
                <span className="text-butter">→</span> Parents find you in search or via board pitches
              </li>
              <li className="flex gap-2">
                <span className="text-butter">→</span> Toggle open / taken slots
              </li>
              <li className="flex gap-2">
                <span className="text-butter">→</span> Optional boost later — never pay for leads
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <FacultyActionLink href="/faculty/signup">
                <Button
                  size="lg"
                  className="bg-butter text-ink hover:bg-butter-deep"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Create free account
                </Button>
              </FacultyActionLink>
              <Link href="/faculty">
                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
