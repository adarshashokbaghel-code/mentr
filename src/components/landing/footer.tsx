import { MentrBrand } from "@/components/ui/mentr-brand";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import { ProductHuntBadges } from "@/components/ui/product-hunt-badge";
import {
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
} from "@/lib/seo";
import Link from "next/link";

type FooterLink = { label: string; href: string; external?: boolean };

const columns: Record<string, FooterLink[]> = {
  Product: [
    { label: "Find online tutors", href: "/find-online-tutors" },
    { label: "Verified tutors", href: "/find-verified-online-tutors" },
    { label: "Find mentors near me", href: "/find-mentors-near-me" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "For parents", href: "/parents" },
    { label: "FAQ", href: "/faq" },
  ],
  Parents: [
    { label: "Find online tutors", href: "/find-online-tutors" },
    { label: "India online tutors", href: "/find-online-tutors/india" },
    { label: "UAE online tutors", href: "/find-online-tutors/uae" },
    { label: "Browse Bengaluru", href: "/search/bengaluru" },
    { label: "Maths tutors", href: "/subjects/mathematics-tutors-bengaluru" },
  ],
  Faculty: [
    { label: "Online tutor jobs", href: "/online-tutor-jobs" },
    { label: "For faculty", href: "/for-faculty" },
    { label: "Create account", href: "/faculty/signup" },
    { label: "Faculty login", href: "/faculty" },
    { label: "Mentr vs UrbanPro", href: "/vs/urbanpro" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Open source", href: "/open-source" },
    { label: PARENT_COMPANY_NAME, href: PARENT_COMPANY_URL, external: true },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "All guides", href: "/blog" },
    { label: "Find online tutors", href: "/find-online-tutors" },
    { label: "Verified tutors online", href: "/find-verified-online-tutors" },
    { label: "Find mentors near me", href: "/find-mentors-near-me" },
    { label: "Online tutor jobs", href: "/online-tutor-jobs" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div>
            <MentrBrand variant="light" logoClassName="h-8" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              The free connector for parents and faculty worldwide — a{" "}
              <PaprlyWordmark variant="light" className="align-middle" />{" "}
              product. Search locally or online, message on WhatsApp, arrange
              everything directly — zero fees, zero cut.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-butter">
                Worldwide
              </span>
              <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-butter">
                For faculty
              </span>
              <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-butter">
                ₹0 forever
              </span>
            </div>
            <div className="mt-6">
              <ProductHuntBadges compact />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  {title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <PaprlyWordmark variant="light" className="align-middle" />. Mentr
            is a {PARENT_COMPANY_NAME} product.
          </p>
          <p>Parents find teachers. Faculty get found. Free.</p>
        </div>
      </div>
    </footer>
  );
}
