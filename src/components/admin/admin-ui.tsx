import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

export function AdminStatCard({
  label,
  value,
  sub,
  accent = "default",
  icon: Icon,
  onClick,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "default" | "coral" | "sage" | "butter" | "premium";
  icon?: ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  const accents = {
    default: "bg-white",
    coral: "bg-coral-wash",
    sage: "bg-sage-wash",
    butter: "bg-butter/60",
    premium:
      "bg-gradient-to-br from-[#fff7dc] to-[#f3e6c4] border-[#e8c84a]/50",
  };
  const iconTone = {
    default: "bg-cream text-ink/70",
    coral: "bg-white/70 text-coral",
    sage: "bg-white/70 text-sage",
    butter: "bg-white/70 text-ink/70",
    premium: "bg-ink text-[#f5d76e]",
  };

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
          {label}
        </p>
        {Icon ? (
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              iconTone[accent],
            )}
            aria-hidden
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted">{sub}</p>}
    </>
  );

  const className = cn(
    "rounded-xl border border-hairline px-4 py-3 text-left",
    accents[accent],
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          className,
          "w-full transition hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(28,26,23,0.08)]",
        )}
      >
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}

export function AdminSection({
  id,
  title,
  description,
  children,
  actions,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          )}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
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

export type { AdminTrendPoint, AdminTrendSegment } from "./admin-trend-chart";
export { AdminTrendChart } from "./admin-trend-chart";
