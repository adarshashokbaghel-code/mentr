import { hardShadowSm } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";

const rows = [
  { label: "Parents pay", mentr: "₹0", other: "Varies" },
  { label: "Tutors pay", mentr: "₹0", other: "Coins / leads" },
  { label: "Commission", mentr: "0%", other: "15–30%" },
];

export function BlogComparisonGlance() {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-ink bg-white",
        hardShadowSm,
      )}
    >
      <div className="border-b-2 border-ink bg-butter/40 px-4 py-3 sm:px-5">
        <p className="text-sm font-bold text-ink">Quick glance — Mentr vs paid platforms</p>
      </div>
      <div className="grid grid-cols-3 divide-x-2 divide-ink/10">
        {rows.map((row) => (
          <div key={row.label} className="px-3 py-4 sm:px-4 sm:py-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted sm:text-[11px]">
              {row.label}
            </p>
            <p className="mt-2 text-lg font-bold text-sage sm:text-xl">{row.mentr}</p>
            <p className="mt-1 text-xs text-muted line-through decoration-muted/50">
              {row.other}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
