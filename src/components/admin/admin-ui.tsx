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
