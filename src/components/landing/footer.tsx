import { MentrLogo } from "@/components/ui/mentr-logo";
import Link from "next/link";

const columns = {
  Product: [
    { label: "Find a teacher", href: "/search" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "For parents", href: "/parents" },
    { label: "FAQ", href: "/faq" },
  ],
  Parents: [
    { label: "Browse teachers", href: "/search/bengaluru" },
    { label: "Maths tutors", href: "/subjects/mathematics-tutors-bengaluru" },
    { label: "JEE coaching", href: "/exam-prep/jee-coaching-bengaluru" },
    { label: "Koramangala tutors", href: "/areas/koramangala-tutors" },
  ],
  Faculty: [
    { label: "For faculty", href: "/for-faculty" },
    { label: "Create account", href: "/faculty/signup" },
    { label: "Faculty login", href: "/faculty" },
    { label: "Mentr vs UrbanPro", href: "/vs/urbanpro" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center">
              <MentrLogo variant="light" className="h-8" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              The free connector for parents and faculty worldwide. Search
              locally or online, message on WhatsApp, arrange everything
              directly — zero fees, zero cut.
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
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
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
          <p>© {new Date().getFullYear()} Mentr. All rights reserved.</p>
          <p>Parents find teachers. Faculty get found. Free.</p>
        </div>
      </div>
    </footer>
  );
}
