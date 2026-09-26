import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { LEGAL_LAST_UPDATED_LABEL } from "@/lib/legal";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "Rules for using Mentr as a parent, student, or mentor — including contact sharing, Premium parent directory, and acceptable use.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "Agreement",
    body: [
      "These Terms govern your use of Mentr (mentr.in), a product of Paprly. By creating an account, checking the signup consent box, or using the service, you agree to these Terms and our Privacy policy.",
      "If you do not agree, do not create an account or use Mentr.",
      "Parents, students/guardians on parent accounts, and faculty/mentors are each bound by the sections that apply to their role.",
    ],
  },
  {
    title: "What Mentr is (and is not)",
    body: [
      "Mentr is a connectivity platform between people seeking tutoring or mentoring and independent tutors/mentors. We host profiles, deliver connection requests, and (for Premium mentors) provide limited tools to discover parents or students who may need help.",
      "We are not a party to any tutoring or mentoring contract. Fees, schedule, location, curriculum, and teaching quality are agreed directly between you and the other party.",
      "Mentr does not guarantee that any connection, reveal, enquiry, or Premium feature will result in a hire, trial class, reply, payment, or income. The platform offers connectivity and discovery tools only.",
      "The Verified badge means we checked phone/identity at onboarding where applicable. It is not a guarantee of teaching quality, employability, or an employment relationship with Mentr.",
    ],
  },
  {
    title: "Accounts",
    body: [
      "One person, one verified email. An email used for a parent account cannot be reused for a faculty account, and vice versa.",
      "You must provide accurate information. You are responsible for activity under your account.",
      "At signup you must accept these Terms and the Privacy policy via the on-screen checkbox. Login does not re-ask that checkbox; continued use remains subject to the current Terms.",
    ],
  },
  {
    title: "Parent & student consent to be contacted",
    body: [
      "If you register as a parent (including student/guardian parent accounts), you authorise Mentr to use your profile data — name, location fields, email, and phone — to operate the platform and to help mentors reach you about tutoring or mentoring, as described in the Privacy policy.",
      "That includes appearing in search-related flows, connection/pitch flows, and the Premium parent directory available to mentors with an active Premium subscription, subject to reveal limits and masking rules.",
      "You understand Premium mentors may unlock your phone and email under product rules (daily caps and time-limited unlock). You agree that this is a legitimate use of your contact details for tutoring or mentoring outreach, not a sale of your data to third-party data brokers.",
      "Mentors must use contacts only to offer or arrange tutoring or mentoring. Spam, harassment, or resale of contacts is forbidden and may result in account suspension.",
    ],
  },
  {
    title: "Multi-source parent & enquiry records",
    body: [
      "Premium directory entries may come from: Mentr signups; Mentr guest/in-product enquiries; and enquiries made on other education/mentoring websites or partners (including high-intent paid or partner leads). We do not list those portal names here.",
      "Buying or using Premium means you accept that sources differ, interest can cool off, and not every number/email will lead to a parent ready to hire.",
      "To correct or remove partner-sourced details: hello@mentr.in. Mentr account holders can also edit profile data in-product where available.",
    ],
  },
  {
    title: "When contact details may be shared",
    body: [
      "Standard connect / pitch: full phone/WhatsApp between parent and mentor only after the required acceptance (mentor accepts request, or parent accepts pitch).",
      "Premium directory: contact stays masked until a Premium mentor uses a reveal; then phone/email show for the unlock window in the product UI and Privacy policy; then lock again per those rules.",
      "Guest requirement forms: shared with mentors you select and with Mentr operators for delivery.",
      "No scraping, harvesting, or republishing of profiles or contacts from Mentr.",
    ],
  },
  {
    title: "Premium for mentors — clear rules",
    body: [
      "Free plan: list, appear in search, and receive connection requests (fair-use limits may apply, e.g. daily pitch caps).",
      "What Premium is: an optional paid upgrade so serious, verified mentors can use extra connectivity tools — mainly a parent/enquiry directory and limited daily contact reveals.",
      "Why it exists: to filter for mentors who invest in outreach tools. It is not a placement agency, staffing service, or “guaranteed students” product.",
      "What you get: access to those tools as described when you pay (directory browsing + reveal quota / unlock behaviour shown in the product).",
      "What you do not get: any guarantee of replies, trials, hires, fees, rankings, or income. Conversion is entirely between you and the parent.",
      "No results guarantee (plain language): if parents do not reply or hire you, that alone does not mean Premium failed to deliver — tools access is what was sold, not hiring outcomes.",
      "Quotas, unlock windows, and who appears in the list may change with notice. Payments via Razorpay; tax/invoice as on the pricing page at purchase.",
      "Conduct: introduce yourself politely, confirm interest, do not claim Mentr employs you or guarantees a hire. Spam/harassment/resale of contacts = suspension.",
      "Refunds: only as stated on the pricing page and payment-provider rules at purchase. Fewer hires than you hoped is not, by itself, grounds for a mandatory refund if the connectivity tools were provided as described.",
    ],
  },
  {
    title: "Free use & fair limits",
    body: [
      "Core discovery and connections are free — no platform commission on private tutoring fees.",
      "We apply fair-use and anti-abuse limits. Bypassing limits, creating fake accounts, or manipulating verification may lead to suspension.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Provide accurate profile and contact information.",
      "Use the platform and any revealed contacts only for legitimate tutoring arrangements.",
      "No spam, harassment, illegal content, or scraping.",
      "Do not use Mentr to collect leads for unrelated businesses or to build competing databases of parents or tutors.",
    ],
  },
  {
    title: "Safety",
    body: [
      "Meet first sessions in public or supervised settings where practical.",
      "Report concerns to safety@mentr.in. We may suspend accounts while investigating.",
    ],
  },
  {
    title: "Advertising on public pages",
    body: [
      "To support a free product, public marketing and guide pages aimed at parents and tutors may show third-party ads (for example Google AdSense) as described in the Privacy policy.",
      "We do not show third-party ads on Mentr Learn (/learn), inside the Learn app, on logged-in dashboards, or during account signup flows.",
      "Ads lead to third-party sites under their own terms.",
    ],
  },
  {
    title: "Children & Mentr Learn",
    body: [
      "Mentr accounts are for adults (parents, guardians, adult students, and tutors).",
      "Mentr Learn is parent-enrolled. Children use it under adult supervision. Learn pages do not carry AdSense.",
      "Do not create accounts for children under 13. Report concerns to safety@mentr.in.",
    ],
  },
  {
    title: "Liability & changes",
    body: [
      "Mentr is provided “as is”. To the fullest extent permitted by law, we are not liable for disputes, payments, injuries, or outcomes between users — including failure to obtain students, clients, or income after using Premium or any other feature.",
      "We may suspend or terminate accounts that violate these Terms.",
      "We may update these Terms by posting a new version on this page. Material updates will change the “Last updated” date. Continued use after an update constitutes acceptance where allowed by law.",
      `Last substantive update: ${LEGAL_LAST_UPDATED_LABEL} — children / Learn (no ads) and advertising path rules.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Terms of service
          </h1>
          <p className="mt-3 text-sm font-semibold text-muted">
            Last updated: {LEGAL_LAST_UPDATED_LABEL}
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Short version: Mentr connects parents/students with mentors;
            tutoring deals stay between you; Premium is connectivity for serious
            mentors with no hire guarantee; contact sharing follows acceptance
            and reveal rules; abuse gets you removed. Details below — also read
            the{" "}
            <Link
              href="/privacy"
              className="font-semibold text-coral underline-offset-2 hover:underline"
            >
              Privacy policy
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
              <h2 className="text-lg font-bold text-ink">Contact</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Questions:{" "}
                <a
                  href="mailto:hello@mentr.in"
                  className="font-semibold text-coral underline-offset-2 hover:underline"
                >
                  hello@mentr.in
                </a>
                . Safety:{" "}
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
