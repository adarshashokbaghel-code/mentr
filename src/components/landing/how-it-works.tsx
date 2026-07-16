import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { MessageCircle, Megaphone, Search } from "lucide-react";
import Link from "next/link";

const searchSteps = [
  "Search by subject and area — nearby or online worldwide",
  "Browse verified profiles, slots, and intro videos",
  "Send a connect request with a short note",
  "Tutor accepts → WhatsApp unlocks. Arrange fees directly",
];

const postSteps = [
  "Post your need — subject, class, area, budget (2 min)",
  "Stay anonymous — tutors pitch with why they're a fit",
  "Review pitches, accept the best → connect on WhatsApp",
  "Arrange timing, fees, and mode yourselves — still ₹0",
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-coral">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              Two sides.{" "}
              <span className="text-coral">One simple connector.</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-muted lg:text-right">
            Parents search tutors locally or online worldwide, or post a
            requirement and get pitches — both free. Faculty accept who they
            want, then it&apos;s straight to WhatsApp.
          </p>
        </div>

        <div
          id="for-parents"
          className="mt-12 overflow-hidden rounded-lg bg-lavender"
        >
          <div className="border-b border-hairline/60 px-6 py-5 sm:px-10">
            <span className="inline-flex rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
              For parents
            </span>
            <h3 className="mt-3 text-3xl font-bold tracking-tight">
              Two ways to find a tutor.
              <span className="block text-coral">Both paths. Zero fees.</span>
            </h3>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
              Know who you want? Search and send a connect request. Not sure
              yet? Post your requirement on the board — verified tutors pitch,
              you pick who to connect with. WhatsApp unlocks only after you
              accept.
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-2">
            {/* Path A — search */}
            <div className="border-b border-hairline/60 p-6 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                <Search className="h-3 w-3 text-coral" />
                Path 1 · Search &amp; connect
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Browse the directory when you know the subject — in your city or
                online from anywhere.
              </p>
              <ol className="mt-5 space-y-3">
                {searchSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm font-medium leading-snug">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <Link href="/search" className="mt-6 inline-block">
                <Button size="sm">
                  <Search className="h-4 w-4" />
                  Find a teacher
                </Button>
              </Link>
            </div>

            {/* Path B — requirements board */}
            <div className="p-6 sm:p-10">
              <p className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                <Megaphone className="h-3 w-3 text-coral" />
                Path 2 · Post &amp; get pitches
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Post a generic job requirement — tutors come to you with
                pitches. Your name stays hidden until you accept.
              </p>
              <ol className="mt-5 space-y-3">
                {postSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm font-medium leading-snug">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <PostRequirementButton size="sm" />
              </div>
            </div>
          </div>

          <div className="border-t border-hairline/60 bg-white/50 px-6 py-4 sm:px-10">
            <p className="text-sm leading-relaxed text-muted">
              <strong className="text-ink">After they accept:</strong> WhatsApp
              unlocks and you arrange timing, fees, and location directly —
              Mentr never takes a cut.
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-center gap-10 rounded-lg bg-sage-wash p-6 sm:p-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-sage">
              For faculty
            </span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight">
              Get found two ways.
              <span className="block text-coral">You choose who connects.</span>
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Parents find your listing in search and send connect requests — or
              they post on the requirements board and you pitch with your
              profile. Your number stays private until you accept either way.
              Every rupee stays yours.
            </p>
            <Link href="/faculty/signup" className="mt-6 inline-block">
              <Button variant="secondary">
                Create free faculty account
              </Button>
            </Link>
          </div>

          <BrowserFrame url="wa.me / mentr-intro" headerClassName="bg-sage-wash">
            <div className="bg-[#ECE5DD] p-4">
              <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-3 py-2 text-sm shadow-sm">
                <p className="font-medium text-ink">
                  Hi Dr. Aris Smith, I found you on Mentr for Mathematics &amp;
                  Physics — are you available on weekends for online sessions?
                </p>
                <p className="mt-1 text-right text-[10px] text-muted">12:04 ✓✓</p>
              </div>
              <div className="mt-3 max-w-[85%] rounded-lg rounded-tl-sm bg-white px-3 py-2 text-sm shadow-sm">
                <p className="text-ink">
                  Yes! Saturday 10–12 in Koramangala works. Happy to discuss
                  fees on a quick call.
                </p>
                <p className="mt-1 text-right text-[10px] text-muted">12:06</p>
              </div>
              <p className="mt-4 text-center text-[11px] font-semibold text-sage">
                Search request or board pitch — same outcome. You arrange the rest.
              </p>
            </div>
          </BrowserFrame>
        </div>

        <div className="mt-8 grid items-center gap-10 rounded-lg border border-hairline bg-white p-6 sm:p-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex rounded-md bg-cream-band px-3 py-1 text-xs font-bold uppercase tracking-wide text-muted">
              Direct contact
            </span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight">
              WhatsApp number.
              <span className="block text-coral">Then you take over.</span>
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Whether a parent searched your profile or accepted your board
              pitch — you review each request, accept the ones that fit, and
              chat on WhatsApp. Mentr never sits in the middle of fees or
              scheduling.
            </p>
            <Link href="/search" className="mt-6 inline-block">
              <Button variant="whatsapp">
                <MessageCircle className="h-4 w-4" />
                Browse directory
              </Button>
            </Link>
          </div>

          <BrowserFrame url="mentr.in / board" headerClassName="bg-white">
            <div className="space-y-2 bg-cream p-4">
              {[
                "Class 10 · Maths · HSR · ₹400–600/hr",
                "Class 11 · Physics · Koramangala · Online",
                "NEET · Biology · Indiranagar · Weekends",
              ].map((q, i) => (
                <div
                  key={q}
                  className="flex items-center justify-between rounded-lg border border-hairline bg-white px-3 py-3"
                >
                  <span className="text-sm font-semibold">{q}</span>
                  <span className="rounded-md bg-coral-wash px-2 py-0.5 text-[11px] font-bold text-coral">
                    {["3 pitches", "Be first", "5 pitches"][i]}
                  </span>
                </div>
              ))}
              <div className="rounded-lg bg-ink px-3 py-3 text-center text-xs font-semibold text-white">
                Faculty pitch free · parent accepts → WhatsApp unlocks
              </div>
            </div>
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
