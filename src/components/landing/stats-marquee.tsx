import { SUBJECTS } from "@/lib/teachers";

const stats = [
  { value: "500+", label: "Faculty & mentors", tint: "bg-lavender" },
  { value: "₹0", label: "Platform fee", tint: "bg-butter" },
  { value: "Direct", label: "WhatsApp contact", tint: "bg-sage-wash" },
  { value: "100%", label: "Earnings to faculty", tint: "bg-coral-wash" },
];

export function StatsMarquee() {
  const row = [...SUBJECTS, ...SUBJECTS];

  return (
    <section>
      <div className="border-y border-hairline">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`border-b border-r border-hairline px-4 py-6 text-center last:border-r-0 sm:px-6 sm:py-10 md:border-b-0 ${stat.tint}`}
            >
              <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-hairline bg-cream-band">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream-band to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream-band to-transparent sm:w-24" />
        <div className="flex w-max animate-marquee items-center py-3.5">
          {row.map((subject, i) => (
            <span
              key={`${subject}-${i}`}
              className="inline-flex shrink-0 items-center gap-4 px-4 text-[13px] font-semibold tracking-wide text-ink/80 sm:text-sm"
            >
              {subject}
              <span className="h-1 w-1 rounded-full bg-coral/70" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
