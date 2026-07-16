"use client";

import { BrowserFrame } from "@/components/ui/browser-frame";
import { GLOBAL_HUBS } from "@/lib/global-hubs";
import { GLOBAL_REACH_LINE } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Clock3, Globe, MapPin, MonitorSmartphone, Radio } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const WORLD_MAP_URL = "/global-world-map.jpg";

/** Equirectangular projection aligned to the 2:1 world map image. */
function projectHub(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  };
}

function arcPathSvg(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bulge = 4,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * bulge;
  const cy = my + (dx / len) * bulge;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

const perks = [
  {
    icon: Globe,
    title: "Any country",
    body: "Parents and tutors connect from wherever they are — no borders on the platform.",
  },
  {
    icon: MonitorSmartphone,
    title: "Online or in-person",
    body: "Filter for online sessions or meet locally when you're in the same city.",
  },
  {
    icon: Clock3,
    title: "Your time zone",
    body: "Weekly slots convert automatically so both sides see the right local time.",
  },
];

function HubCityReveal({ name, region }: { name: string; region: string }) {
  return (
    <p className="global-hub-reveal mt-1 truncate text-base font-bold text-ink">
      {name}
      <span className="font-medium text-muted"> · {region}</span>
    </p>
  );
}

function LiveBadge() {
  return (
    <span className="global-live-badge inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/95 px-2.5 py-1 text-[10px] font-bold text-ink shadow-sm backdrop-blur-sm">
      <span className="global-live-icon relative flex h-3.5 w-3.5 items-center justify-center">
        <Radio className="relative z-10 h-3 w-3 text-coral" />
        <span className="global-live-ring absolute inset-0 rounded-full border border-coral/50" />
      </span>
      <span className="flex items-end gap-0.5" aria-hidden>
        <span className="global-live-bar" />
        <span className="global-live-bar global-live-bar-2" />
        <span className="global-live-bar global-live-bar-3" />
      </span>
      Live
    </span>
  );
}

function GlobalBadge() {
  return (
    <span className="global-global-badge inline-flex items-center gap-1.5 rounded-full border border-hairline bg-sage-wash/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sage shadow-sm backdrop-blur-sm">
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="global-global-orbit absolute h-3.5 w-3.5 rounded-full border border-sage/40" />
        <span className="global-global-dot absolute h-1 w-1 rounded-full bg-sage" />
        <Globe className="relative z-10 h-2.5 w-2.5 text-sage" />
      </span>
      Global
    </span>
  );
}

function MapPinDot({ active }: { active: boolean }) {
  return (
    <div className={cn("global-map-pin", active && "is-active")}>
      <span className="global-map-pin-ring" />
      <span className="global-map-pin-core" />
      <span className="global-map-pin-pulse" />
    </div>
  );
}

function WorldMapCanvas({ activeIdx }: { activeIdx: number }) {
  const hubs = useMemo(
    () =>
      GLOBAL_HUBS.map((hub) => ({
        ...hub,
        ...projectHub(hub.lat, hub.lng),
      })),
    [],
  );

  const origin = hubs[activeIdx];

  return (
    <div className="global-map-shell relative aspect-[2/1] w-full overflow-hidden bg-[#b8d4e3]">
      <img
        src={WORLD_MAP_URL}
        alt=""
        className="global-map-bg absolute inset-0 block h-full w-full"
        draggable={false}
      />

      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        aria-hidden
      >
        <circle
          cx={(origin.x / 100) * 100}
          cy={(origin.y / 100) * 50}
          r="2.2"
          className="global-svg-origin-glow"
          fill="rgba(47, 158, 110, 0.22)"
        />
        {hubs.map((hub, i) => {
          if (i === activeIdx) return null;
          const ox = (origin.x / 100) * 100;
          const oy = (origin.y / 100) * 50;
          const hx = (hub.x / 100) * 100;
          const hy = (hub.y / 100) * 50;
          return (
            <path
              key={hub.name}
              d={arcPathSvg(ox, oy, hx, hy, 3 + (i % 3))}
              className={cn(
                "global-svg-arc",
                i % 2 === 0 ? "global-svg-arc-coral" : "global-svg-arc-sage",
                `global-svg-arc-${(i % 3) + 1}`,
              )}
              fill="none"
              strokeWidth="0.35"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {hubs.map((hub, i) => (
        <div
          key={hub.name}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
        >
          <MapPinDot active={i === activeIdx} />
        </div>
      ))}

      <div className="absolute left-3 top-3 z-30 flex flex-wrap items-center gap-2">
        <LiveBadge />
        <GlobalBadge />
      </div>
    </div>
  );
}

export function GlobalReachMap({
  className,
  id = "global-reach",
}: {
  className?: string;
  id?: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [tick, setTick] = useState(0);

  const selectHub = (i: number) => {
    setActiveIdx(i);
    setTick(0);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % GLOBAL_HUBS.length);
      setTick(0);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const progress = window.setInterval(() => {
      setTick((t) => Math.min(t + 2, 100));
    }, 64);
    return () => window.clearInterval(progress);
  }, [activeIdx]);

  const active = GLOBAL_HUBS[activeIdx];

  return (
    <section
      id={id}
      className={cn(
        "border-y border-hairline bg-cream py-16 sm:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <p className="text-sm font-semibold text-sage">Worldwide access</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[40px]">
              Local when you&apos;re nearby.
              <span className="block text-coral">Global when you&apos;re not.</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              {GLOBAL_REACH_LINE}
            </p>

            <ul className="mt-8 grid gap-3">
              {perks.map((perk) => (
                <li
                  key={perk.title}
                  className="flex gap-3 rounded-lg border border-hairline bg-white p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sage-wash text-sage">
                    <perk.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{perk.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">
                      {perk.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <BrowserFrame
            url="mentr.in / connections"
            className="shadow-[0_16px_48px_rgba(28,26,23,0.1)]"
            headerClassName="bg-cream-band"
          >
            <div className="bg-cream-band">
              <WorldMapCanvas activeIdx={activeIdx} />

              <div className="global-status-card border-t border-hairline bg-white p-3 sm:px-4 sm:py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      <span className="global-connect-dot h-1.5 w-1.5 rounded-full bg-coral" />
                      Connecting now
                    </p>
                    <HubCityReveal
                      key={activeIdx}
                      name={active.name}
                      region={active.region}
                    />
                  </div>
                  <div className="global-hub-count flex shrink-0 items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold text-muted">
                    <MapPin className="h-3 w-3 text-coral" />
                    <span className="tabular-nums">{GLOBAL_HUBS.length}</span> hubs
                  </div>
                </div>

                <div className="global-hub-progress mt-3 h-1 overflow-hidden rounded-full bg-hairline">
                  <span
                    className="global-hub-progress-fill block h-full rounded-full bg-gradient-to-r from-coral to-sage"
                    style={{ width: `${tick}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {GLOBAL_HUBS.map((hub, i) => (
                    <button
                      key={hub.name}
                      type="button"
                      onClick={() => selectHub(i)}
                      className={cn(
                        "global-hub-pill rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-300",
                        i === activeIdx
                          ? "global-hub-pill-active border-coral bg-coral text-white shadow-sm"
                          : "border-hairline bg-cream text-muted hover:-translate-y-0.5 hover:border-ink/20 hover:text-ink",
                      )}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {hub.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
