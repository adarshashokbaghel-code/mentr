import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { LEGAL_LAST_UPDATED_LABEL } from "@/lib/legal";
import { ADSENSE_CLIENT_ID } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Mentr collects, uses, and shares data for parents, students, and mentors — including when phone numbers and emails are visible.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "Who this applies to",
    body: [
      "Mentr (mentr.in) is operated by Paprly. This policy covers everyone who uses the product: parents and students looking for tutors, faculty/mentors listing themselves, Premium mentors using the parent directory, and visitors to public pages.",
      "On Mentr, “parent” accounts are also used by guardians or adult students arranging tutoring. References to parents below include those student/guardian users unless we say otherwise.",
      "By creating an account you confirm you have read this Privacy policy and our Terms of service. We record the date and version of that acceptance at signup.",
    ],
  },
  {
    title: "What we collect — parents & students",
    body: [
      "Account: email address (verified with a one-time password / OTP), role, and login activity.",
      "Profile you provide: name, mobile/WhatsApp number, country, city, and area.",
      "Hiring activity: tutoring requirements you post, connection requests you send or accept, pitches you receive, shortlists, and dashboard actions.",
      "Optional products: Mentr Learn enrollment and progress if you enroll a child; Snap & Grade usage and credits if you use that tool.",
      "If you send a requirement without logging in (guest form), we collect the name, email, phone, and message you submit so we can notify matching mentors and show the lead in product inboxes.",
      "Parent interest records may also come from multiple lawful sources beyond a Mentr login — for example when a parent or student has enquired about tutoring, mentoring, coaching, or related education services on other websites or partners, and that enquiry is shared with us (including as a paid or partner lead where the enquiry is marked high-intent). We do not publicly name those source portals in this policy. Fields typically include name, phone, email, location signals, and enquiry context needed to offer connectivity.",
    ],
  },
  {
    title: "What we collect — faculty & mentors",
    body: [
      "Account: email (OTP-verified), role, and login activity.",
      "Public teaching profile: name, photo, bio, subjects, levels, languages, qualifications, experience, teaching modes, rates (if shared), availability, city/area, WhatsApp number, and optional credentials or links you add.",
      "Platform activity: connection requests, board pitches, profile views, and Premium subscription / payment records (processed via Razorpay — we do not store full card numbers).",
      "Approximate location derived from profile address or login IP may be used to place you on maps and improve local search — not to track you continuously.",
    ],
  },
  {
    title: "Why we collect it (purposes)",
    body: [
      "To operate Mentr: accounts, search, connect requests, the requirements board, dashboards, and support.",
      "To offer connectivity between people interested in tutoring/mentoring and mentors — including Premium directory tools for eligible mentors.",
      "To verify email ownership (for Mentr accounts), reduce spam and abuse, and investigate safety reports.",
      "To send transactional messages (OTP, important account notices). Marketing emails, if any, will follow applicable law and opt-out options.",
      "To improve the product using aggregated analytics on public pages (Google Analytics) and to fund free use via ads on public pages (Google AdSense), as described below.",
    ],
  },
  {
    title: "Where Premium parent / enquiry data comes from",
    body: [
      "The Premium parent directory and related outreach tools may include contacts from more than one place:",
      "(1) Parents or students who registered or filled a profile on Mentr.",
      "(2) People who submitted a guest or in-product enquiry on Mentr.",
      "(3) People who enquired about tutoring, mentoring, coaching, or related education services on other websites or through partners — including high-intent (“hot”) enquiries shared with us under paid or partner lead arrangements. We do not name those third-party portals in this policy.",
      "A listing means someone showed interest in tutoring or mentoring connectivity. It does not mean Mentr employs them, that they asked for you personally, or that they will hire anyone.",
      "Mentr-registered emails are OTP-verified. Partner-sourced phones and emails depend on what the source provided; Mentr does not independently guarantee every contact is current or authentic.",
      "Wrong listing? Email hello@mentr.in and we will review correction or removal as required by law.",
    ],
  },
  {
    title: "What Premium is (and is not)",
    body: [
      "Premium is an optional paid plan for mentors. It is meant for serious, verified mentors who want extra connectivity tools.",
      "What Premium is: access to tools such as a parent/enquiry directory and a limited number of daily contact “reveals” so you can introduce yourself about tutoring or mentoring.",
      "What Premium is not: a placement agency, a staffing service, a guaranteed-hire product, or a promise of students, replies, trials, fees, or income.",
      "Mentr only offers connectivity. Whether a parent replies or hires you depends on your outreach, fit, timing, and their choice — not on Premium payment alone.",
      "Reveal limits, unlock time windows, and who appears in the directory can change as the product evolves. Paying for Premium buys access to the tools described at purchase — not a conversion result.",
      "When you unlock a contact: introduce yourself clearly, confirm interest, and do not harass. Misuse can lead to suspension under our Terms.",
    ],
  },
  {
    title: "When your phone number and email are visible",
    body: [
      "Contacts are never a public open list for anonymous website visitors. Visibility depends on the situation:",
      "Standard connect / pitch: a mentor’s WhatsApp is shown to a parent only after the mentor accepts that parent’s request (or the parent accepts the mentor’s pitch). A parent’s full contact unlocks for a mentor only after that acceptance. Decline or ignore → no full contact either way.",
      "Premium directory: entries (from Mentr signup or multi-source enquiries above) may show name, area/city, and interest signals with contact masked. A Premium mentor may use a daily reveal to see phone and/or email for a limited unlock window (currently about two hours per reveal, with a daily cap). After that, it locks again for that mentor unless product rules say otherwise.",
      "Guest requirement forms: what you submit may go to the mentors you chose and to Mentr admins for delivery and abuse control.",
      "Admins may access data to run the service and safety — not to sell contacts as a data-broker product.",
    ],
  },
  {
    title: "If you are a parent or student on Mentr",
    body: [
      "By registering (or if your enquiry was lawfully shared with us for tutoring/mentoring connectivity), you understand name, location, and contact details may be used so verified and Premium mentors can reach people who may need help — under the visibility rules above.",
      "We may also show internal seed/backfill directory rows for product density; those are not a substitute for rules on real or partner-sourced records.",
      "Edit your Mentr profile in the dashboard. For deletion or correction, email hello@mentr.in (we aim for 7 days, subject to legal retention such as payments).",
    ],
  },
  {
    title: "What we do not do",
    body: [
      "We do not sell your personal data to data brokers as a standalone product.",
      "We do not take a platform commission on tutoring fees you agree privately with a mentor.",
      "We do not guarantee that Premium (or any feature) will produce hires, replies, or income.",
      "Mentors must not scrape, bulk-export, resell, or spam contacts from Mentr — that breaks our Terms.",
    ],
  },
  {
    title: "Cookies & sessions",
    body: [
      "We use a session cookie / token to keep you signed in.",
      "We use Google Analytics (gtag.js) on public pages to understand traffic. Analytics may set cookies such as _ga.",
      "We use Google AdSense on public marketing and guide pages. Google and partners may use cookies for ads, including personalised ads where applicable.",
      "You can manage ad personalisation in Google Ad Settings and control cookies in your browser. See also our Cookie policy.",
    ],
  },
  {
    title: "Your controls",
    body: [
      "Edit profile details anytime from your dashboard.",
      "Request account deletion via hello@mentr.in from your registered email.",
      "Public pages show a cookie notice; your choice is stored on your device.",
    ],
  },
  {
    title: "Changes",
    body: [
      "Material changes will be noted on this page with an updated date. Continued use after changes means you accept the updated policy where permitted by law. Significant changes may also be flagged at next login or by email.",
      `Last substantive update: ${LEGAL_LAST_UPDATED_LABEL} — multi-source parent enquiry records, Premium connectivity (no hire guarantee), directory visibility, and signup consent.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Privacy policy
          </h1>
          <p className="mt-3 text-sm font-semibold text-muted">
            Last updated: {LEGAL_LAST_UPDATED_LABEL}
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted">
            This policy explains what Mentr collects from parents, students, and
            mentors, why we collect it, and exactly when phone numbers and emails
            become visible. Read it together with our{" "}
            <Link
              href="/terms"
              className="font-semibold text-coral underline-offset-2 hover:underline"
            >
              Terms of service
            </Link>
            .
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-lg font-bold text-ink">{s.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {s.body.map((line) => (
                    <li
                      key={line.slice(0, 48)}
                      className="flex gap-2.5 text-[15px] leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section>
              <h2 className="text-lg font-bold text-ink">
                Advertising & third-party services
              </h2>
              <ul className="mt-3 space-y-2.5">
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Public pages (home, blog, guides, FAQ, and similar) may show
                  ads served by Google AdSense (publisher ID {ADSENSE_CLIENT_ID}
                  ).
                </li>
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Google may collect device and usage data for ad delivery and
                  measurement. See{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    How Google uses data in advertising
                  </a>
                  .
                </li>
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Manage personalised ads at{" "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    Google Ad Settings
                  </a>
                  . EU/UK users can also visit{" "}
                  <a
                    href="https://www.youronlinechoices.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    Your Online Choices
                  </a>
                  .
                </li>
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Logged-in dashboard and account pages are not monetised with
                  third-party ads. Our ads.txt file at{" "}
                  <Link
                    href="/ads.txt"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    mentr.in/ads.txt
                  </Link>{" "}
                  lists authorised ad sellers. See also our{" "}
                  <Link
                    href="/cookie-policy"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    Cookie policy
                  </Link>
                  .
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Contact</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Privacy questions or deletion requests:{" "}
                <a
                  href="mailto:hello@mentr.in"
                  className="font-semibold text-coral underline-offset-2 hover:underline"
                >
                  hello@mentr.in
                </a>
                . Safety concerns:{" "}
                <a
                  href="mailto:safety@mentr.in"
                  className="font-semibold text-coral underline-offset-2 hover:underline"
                >
                  safety@mentr.in
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
