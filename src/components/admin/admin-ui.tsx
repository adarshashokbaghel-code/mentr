import { cn } from "@/lib/utils";

export function AdminStatCard({
  label,
  value,
  sub,
  accent = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "default" | "coral" | "sage" | "butter";
}) {
  const accents = {
    default: "bg-white",
    coral: "bg-coral-wash",
    sage: "bg-sage-wash",
    butter: "bg-butter/60",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-hairline px-4 py-3",
        accents[accent],
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

export function AdminSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function AdminBarList({
  items,
  emptyLabel = "No data",
}: {
  items: { label: string; value: number }[];
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return <p className="text-xs text-muted">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium text-ink">{item.label}</span>
            <span className="shrink-0 tabular-nums text-muted">{item.value}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-band">
            <div
              className="h-full rounded-full bg-coral"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export type AdminTrendSegment = {
  value: number;
  className: string;
};

export type AdminTrendPoint = {
  key: string;
  total: number;
  title?: string;
  segments?: AdminTrendSegment[];
};

/** Pixel-height bars — % heights collapse inside flex `items-end` and look blank. */
export function AdminTrendChart({
  points,
  height = 160,
  emptyLabel = "No data in this range",
  legend,
}: {
  points: AdminTrendPoint[];
  height?: number;
  emptyLabel?: string;
  legend?: { label: string; className: string }[];
}) {
  const max = Math.max(...points.map((p) => p.total), 0);
  const hasData = max > 0;

  return (
    <div>
      <div
        className="flex items-end gap-0.5"
        style={{ height }}
        role="img"
        aria-label="Trend chart"
      >
        {points.map((p) => {
          const px =
            hasData && p.total > 0
              ? Math.max(Math.round((p.total / max) * height), 6)
              : 2;
          return (
            <div
              key={p.key}
              className="group relative flex min-w-0 flex-1 flex-col justify-end"
              title={p.title ?? `${p.key}: ${p.total}`}
            >
              <div
                className="flex w-full flex-col justify-end overflow-hidden rounded-sm"
                style={{ height: px }}
              >
                {p.segments && p.segments.some((s) => s.value > 0) ? (
                  p.segments.map((seg, i) =>
                    seg.value > 0 ? (
                      <div
                        key={`${p.key}-${i}`}
                        className={cn("w-full", seg.className)}
                        style={{
                          height: `${(seg.value / (p.total || 1)) * 100}%`,
                        }}
                      />
                    ) : null,
                  )
                ) : (
                  <div
                    className={cn(
                      "h-full w-full",
                      p.total > 0 ? "bg-coral" : "bg-cream-band",
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!hasData && (
        <p className="mt-2 text-center text-[11px] text-muted">{emptyLabel}</p>
      )}
      {legend && legend.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted">
          {legend.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1">
              <span className={cn("h-2 w-2 rounded-sm", item.className)} />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
