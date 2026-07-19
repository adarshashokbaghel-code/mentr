import { SUBJECTS } from "@/lib/teachers";

export function StatsMarquee() {
  const row = [...SUBJECTS, ...SUBJECTS];

  return (
    <section>
      <div className="relative overflow-hidden border-y border-hairline bg-cream-band">
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
