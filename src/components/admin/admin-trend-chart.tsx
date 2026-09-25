"use client";

import { useId, useMemo, useState } from "react";

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

const SERIES_COLORS: Record<string, string> = {
  "bg-coral": "#ef7a28",
  "bg-sage": "#2f9e6e",
  "bg-butter": "#e6c200",
  "bg-ink/25": "rgba(26, 35, 28, 0.35)",
  "bg-ink": "#1a231c",
};

function colorFromClass(className: string, fallback: string) {
  return SERIES_COLORS[className] || fallback;
}

function niceMax(raw: number) {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const f = raw / 10 ** exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * 10 ** exp;
}

/** Catmull–Rom → cubic Bézier (smooth analytics-style curves). */
function smoothLinePath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`;
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function areaPath(pts: { x: number; y: number }[], baselineY: number) {
  if (pts.length === 0) return "";
  const line = smoothLinePath(pts);
  const last = pts[pts.length - 1]!;
  const first = pts[0]!;
  return `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

type SeriesDef = {
  key: string;
  label: string;
  color: string;
  values: number[];
};

/**
 * Multi-series curved line chart (Search Console / Analytics style).
 * Replaces the old stacked bar “graph pattern”.
 */
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
  const gradId = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);

  const series: SeriesDef[] = useMemo(() => {
    if (!points.length) return [];
    const hasSegs = points.some((p) => (p.segments?.length ?? 0) > 0);
    if (hasSegs && legend?.length) {
      return legend.map((item, i) => ({
        key: item.label,
        label: item.label,
        color: colorFromClass(item.className, i === 0 ? "#ef7a28" : "#2f9e6e"),
        values: points.map((p) => p.segments?.[i]?.value ?? 0),
      }));
    }
    if (hasSegs) {
      const count = Math.max(...points.map((p) => p.segments?.length ?? 0), 0);
      return Array.from({ length: count }, (_, i) => {
        const sample = points.find((p) => p.segments?.[i])?.segments?.[i];
        return {
          key: `s${i}`,
          label: `Series ${i + 1}`,
          color: colorFromClass(
            sample?.className || "bg-coral",
            i === 0 ? "#ef7a28" : "#2f9e6e",
          ),
          values: points.map((p) => p.segments?.[i]?.value ?? 0),
        };
      });
    }
    return [
      {
        key: "total",
        label: legend?.[0]?.label || "Total",
        color: colorFromClass(legend?.[0]?.className || "bg-coral", "#ef7a28"),
        values: points.map((p) => p.total),
      },
    ];
  }, [points, legend]);

  const rawMax = Math.max(
    0,
    ...series.flatMap((s) => s.values),
    ...points.map((p) => p.total),
  );
  const yMax = niceMax(rawMax);
  const hasData = rawMax > 0;

  const pad = { top: 12, right: 8, bottom: 22, left: 32 };
  const w = 640;
  const h = Math.max(height, 120);
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const n = Math.max(points.length, 1);

  const xAt = (i: number) =>
    pad.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yAt = (v: number) =>
    pad.top + plotH - (Math.min(v, yMax) / yMax) * plotH;

  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: pad.top + plotH * (1 - t),
    label: Math.round(yMax * t),
  }));

  const hoverPoint = hover != null ? points[hover] : null;

  return (
    <div>
      <div className="relative w-full" style={{ minHeight: h }}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-auto w-full"
          role="img"
          aria-label="Trend chart"
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s.key}
                id={`${gradId}-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {gridYs.map((g) => (
            <g key={g.y}>
              <line
                x1={pad.left}
                x2={w - pad.right}
                y1={g.y}
                y2={g.y}
                stroke="#e8dfd4"
                strokeWidth="1"
                strokeDasharray={g.label === 0 ? undefined : "3 4"}
              />
              <text
                x={pad.left - 6}
                y={g.y + 3}
                textAnchor="end"
                fill="#6b756e"
                fontSize="9"
                fontFamily="system-ui, sans-serif"
              >
                {g.label}
              </text>
            </g>
          ))}

          {hasData &&
            series.map((s, si) => {
              const pts = s.values.map((v, i) => ({
                x: xAt(i),
                y: yAt(v),
              }));
              const line = smoothLinePath(pts);
              const fill = si === 0 ? areaPath(pts, pad.top + plotH) : "";
              return (
                <g key={s.key}>
                  {fill ? (
                    <path
                      d={fill}
                      fill={`url(#${gradId}-${s.key})`}
                      stroke="none"
                    />
                  ) : null}
                  <path
                    d={line}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}

          {points.map((p, i) => (
            <rect
              key={p.key}
              x={xAt(i) - plotW / n / 2}
              y={pad.top}
              width={Math.max(plotW / n, 8)}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}

          {hover != null && points[hover] && (
            <g pointerEvents="none">
              <line
                x1={xAt(hover)}
                x2={xAt(hover)}
                y1={pad.top}
                y2={pad.top + plotH}
                stroke="#1a231c"
                strokeOpacity="0.2"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {series.map((s) => (
                <circle
                  key={s.key}
                  cx={xAt(hover)}
                  cy={yAt(s.values[hover] ?? 0)}
                  r="3.5"
                  fill="#fff"
                  stroke={s.color}
                  strokeWidth="2"
                />
              ))}
            </g>
          )}

          {points[0] ? (
            <text
              x={pad.left}
              y={h - 6}
              fill="#6b756e"
              fontSize="9"
              fontFamily="system-ui, sans-serif"
            >
              {points[0].key.slice(5)}
            </text>
          ) : null}
          {points.length > 1 ? (
            <text
              x={w - pad.right}
              y={h - 6}
              textAnchor="end"
              fill="#6b756e"
              fontSize="9"
              fontFamily="system-ui, sans-serif"
            >
              {points[points.length - 1]!.key.slice(5)}
            </text>
          ) : null}
        </svg>

        {hoverPoint && hover != null && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[11px] shadow-md"
            style={{
              left: `clamp(8px, ${(xAt(hover) / w) * 100}%, calc(100% - 140px))`,
              top: 4,
            }}
          >
            <p className="font-semibold text-ink">{hoverPoint.key}</p>
            {series.map((s) => (
              <p
                key={s.key}
                className="mt-0.5 flex items-center gap-1.5 text-muted"
              >
                <span
                  className="inline-block h-1.5 w-3 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}:{" "}
                <span className="font-semibold tabular-nums text-ink">
                  {s.values[hover] ?? 0}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>

      {!hasData && (
        <p className="mt-2 text-center text-[11px] text-muted">{emptyLabel}</p>
      )}

      {(legend?.length || series.length > 1) && (
        <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-muted">
          {(legend && legend.length > 0
            ? legend.map((item, i) => ({
                label: item.label,
                color:
                  series[i]?.color ||
                  colorFromClass(item.className, "#ef7a28"),
              }))
            : series.map((s) => ({ label: s.label, color: s.color }))
          ).map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-4 rounded-full"
                style={{ background: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
