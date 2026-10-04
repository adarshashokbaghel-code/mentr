import Link from "next/link";

/** Same Mentr Learn launch offer on every homepage visit, including mobile. */
export function LearnLaunchBand() {
  return (
    <section
      aria-labelledby="learn-launch-heading"
      className="border-b border-hairline bg-[#fff8f3]"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5 lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-coral">
            Mentr Learn is live
          </p>
          <h2
            id="learn-launch-heading"
            className="mt-1 text-[16px] font-bold leading-snug tracking-tight text-ink sm:text-lg"
          >
            Free coding for Class 3–5 — computer science, AI, and math
          </h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-snug text-muted sm:text-sm">
            60 modules, narrated lessons, and a daily problem. Parent email
            only. ₹0 forever. No card.
          </p>
        </div>
        <Link
          href="/learn/start"
          className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-md bg-ink px-4 text-sm font-semibold text-white sm:w-auto"
        >
          Enroll free
        </Link>
      </div>
    </section>
  );
}
