import { Button } from "@/components/ui/button";
import { ParentActionLink } from "@/components/auth/role-guard-link";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { Check, X } from "lucide-react";

const rows = [
  { label: "Platform fee from parents", champs: false, others: true },
  { label: "Cut from faculty earnings", champs: false, others: true },
  { label: "Direct WhatsApp contact", champs: true, others: false },
  { label: "Flexible session length", champs: true, others: false },
  { label: "Faculty controls pricing", champs: true, others: false },
  { label: "Simple availability dashboard", champs: true, others: false },
];

export function ZeroFees() {
  return (
    <section className="bg-ink py-10 text-white sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold text-butter">Free forever</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              Zero fees.{" "}
              <span className="text-coral">Zero cuts.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              Free for parents to search or post requirements. Free for faculty
              to list, get requests, and pitch on the board. We&apos;re a
              connector, not a middleman — ₹0 platform fee, 100% to faculty.
            </p>
            <p className="mt-4 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/70">
              <strong className="text-butter">How do we make money?</strong>{" "}
              Mentr is free to list and free to contact. Later, teachers who
              want to appear first can optionally boost their profile — but
              contact is always free.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ParentActionLink href="/search">
                <Button className="bg-butter text-ink hover:bg-butter-deep">
                  Browse as parent
                </Button>
              </ParentActionLink>
              <a href="#for-faculty">
                <Button
                  variant="secondary"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                >
                  See faculty tools
                </Button>
              </a>
            </div>
          </div>

          <BrowserFrame
            url="mentr.in / pricing / forever-free"
            headerClassName="bg-white/10"
            className="border-white/20 bg-ink shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="overflow-hidden bg-white text-ink">
              <div className="grid grid-cols-3 border-b border-hairline bg-cream text-center text-[12px] font-semibold">
                <div className="px-2 py-3 text-muted">Feature</div>
                <div className="border-x border-hairline px-2 py-3 text-coral">
                  Mentr
                </div>
                <div className="px-2 py-3 text-muted">Others</div>
              </div>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-3 border-b border-hairline last:border-b-0"
                >
                  <div className="px-3 py-3.5 text-sm">{row.label}</div>
                  <div className="flex items-center justify-center border-x border-hairline px-2 py-3.5">
                    {row.champs ? (
                      <Check className="h-5 w-5 text-sage" />
                    ) : (
                      <X className="h-5 w-5 text-coral" />
                    )}
                  </div>
                  <div className="flex items-center justify-center px-2 py-3.5">
                    {row.others ? (
                      <Check className="h-5 w-5 text-muted" />
                    ) : (
                      <X className="h-5 w-5 text-muted" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
