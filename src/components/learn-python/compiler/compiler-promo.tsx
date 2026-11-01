"use client";

import { fetchPublicTeachers, type Teacher } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SEARCH_HREF = "/search?subject=Coding&q=Python&match=any&tier=all";
const SHOWN = 5;

/** Blue paper fibre. White specks disappear on this light card, so the noise is a darker blue. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.14  0 0 0 0 0.36  0 0 0 0 0.58  0.95 0 0 0 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

/** Same point count on both halves so GSAP can morph a straight sheet into a rip. */
function tearPaths(jagged: boolean) {
  const steps = 14;
  const top = ["0% 0%", "100% 0%"];
  const bottom: string[] = [];
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const wave = Math.sin(i * 1.65) * 3.4 + ((i % 3) - 1) * 2.6;
    const y = jagged ? 54 + wave : 100;
    top.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const wave = Math.sin(i * 1.65) * 3.4 + ((i % 3) - 1) * 2.6;
    const y = jagged ? 54 + wave : 100;
    bottom.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  bottom.push("100% 100%", "0% 100%");
  return {
    top: `polygon(${top.join(", ")})`,
    bottom: `polygon(${bottom.join(", ")})`,
  };
}

function teachesPython(teacher: Teacher) {
  const blob = `${teacher.subjectLine} ${teacher.subjects.join(" ")}`.toLowerCase();
  return blob.includes("python") || blob.includes("coding") || blob.includes("computer");
}

function hasPhoto(teacher: Teacher) {
  return Boolean(teacher.imageUrl?.trim());
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function PromoFace({
  tutors,
  total,
  more,
  onClose,
}: {
  tutors: Teacher[];
  total: number;
  more: number;
  onClose: () => void;
}) {
  return (
    <div className="relative bg-[#d7e9f8] px-3 pb-2.5 pt-2.5 text-[#163e66] sm:px-4 sm:pb-3.5 sm:pt-3.5">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#eaf4fc_0%,#d7e9f8_48%,#c5dff3_100%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ backgroundImage: GRAIN, backgroundSize: "128px 128px" }}
      />
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[#163e66]/70 hover:bg-[#163e66]/10 hover:text-[#163e66]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
        <h2 className="pr-6 text-[14px] font-extrabold leading-tight tracking-tight text-[#163e66] sm:text-[16px]">
          Python tutors online
        </h2>
        <p className="mt-0.5 text-[11px] leading-snug text-[#3d6288] sm:mt-1 sm:text-[12px]">
          {total > 0 ? `${total} verified coding tutors` : "Verified coding tutors"} for Class 11, Class 12
          practicals, and beginners.
        </p>

        {tutors.length > 0 ? (
          <div className="mt-2 sm:mt-3">
            <div className="flex items-center pl-0.5">
              {tutors.map((tutor, index) => (
                <a
                  key={tutor.id}
                  href={`/teachers/${tutor.id}`}
                  title={`${tutor.name}, Python tutor${placeLabel(tutor) ? ` in ${placeLabel(tutor)}` : ""}`}
                  className={cn(
                    "relative block h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#d7e9f8] sm:h-11 sm:w-11",
                    index > 0 && "-ml-2 sm:-ml-2.5",
                  )}
                  style={{ zIndex: index + 1 }}
                >
                  <Image
                    src={tutor.imageUrl}
                    alt={`${tutor.name}, online Python tutor`}
                    width={96}
                    height={96}
                    sizes="44px"
                    className="h-9 w-9 object-cover sm:h-11 sm:w-11"
                  />
                </a>
              ))}
              {more > 0 ? (
                <a
                  href={SEARCH_HREF}
                  aria-label={`${more} more Python tutors`}
                  className="relative -ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#3d84c6] text-[10px] font-extrabold text-white ring-2 ring-[#d7e9f8] sm:-ml-2.5 sm:h-11 sm:w-11 sm:text-[11px]"
                  style={{ zIndex: tutors.length + 1 }}
                >
                  +{more}
                </a>
              ) : null}
            </div>
            <p className="mt-1.5 truncate text-[11px] font-semibold text-[#163e66] sm:mt-2 sm:text-[12px]">
              {tutors.map((tutor) => firstName(tutor.name)).join(", ")}
              {more > 0 ? ` and ${more} more Python tutors` : ""}
            </p>
          </div>
        ) : null}

        <a
          href={SEARCH_HREF}
          className="mt-2.5 flex h-8 items-center justify-center rounded-lg bg-[#3d84c6] text-[12px] font-bold text-white hover:bg-[#2f6fad] sm:mt-3.5 sm:h-9 sm:text-[13px]"
        >
          Explore Python tutors
        </a>
      </div>
    </div>
  );
}

function placeLabel(teacher: Teacher) {
  return teacher.area.split(",")[0]?.trim() || teacher.locality;
}

export function CompilerPromo({ className }: { className?: string }) {
  const [tutors, setTutors] = useState<Teacher[]>([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(true);
  const shellRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const tearing = useRef(false);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    void fetchPublicTeachers().then(({ teachers }) => {
      if (cancelled) return;
      const matched = teachers.filter(teachesPython);
      const pool = matched.length > 0 ? matched : teachers;
      setTotal(pool.length);
      setTutors(pool.filter(hasPhoto).slice(0, SHOWN));
    });
    return () => {
      cancelled = true;
    };
  }, [visible]);

  function close() {
    if (tearing.current) return;
    tearing.current = true;
    const shell = shellRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (shell) shell.style.overflow = "visible";
    if (!top || !bottom) {
      setVisible(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const straight = tearPaths(false);
    const torn = tearPaths(true);
    gsap
      .timeline({ onComplete: () => setVisible(false) })
      .set(top, { clipPath: straight.top, transformOrigin: "50% 100%" })
      .set(bottom, { clipPath: straight.bottom, transformOrigin: "50% 0%" }, 0)
      .to(top, { clipPath: torn.top, duration: 0.42, ease: "power2.inOut" }, 0)
      .to(bottom, { clipPath: torn.bottom, duration: 0.42, ease: "power2.inOut" }, 0)
      .to(top, { y: -28, rotation: -6, duration: 0.7, ease: "power2.in" }, 0.2)
      .to(bottom, { y: 64, rotation: 5, duration: 0.78, ease: "power2.in" }, 0.2)
      .to([top, bottom], { opacity: 0, duration: 0.22, ease: "power1.in" }, 0.78);
  }

  if (!visible) return null;

  const more = Math.max(0, total - tutors.length);

  return (
    <aside
      className={cn(
        "pointer-events-auto absolute bottom-[4.5rem] right-2.5 z-30 w-[min(18.75rem,calc(100%-4.25rem))] sm:bottom-4 sm:right-4 sm:w-[min(24rem,calc(100%-1.5rem))]",
        className,
      )}
    >
      <div ref={shellRef} className="relative overflow-hidden rounded-2xl border border-[#5d94c4] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_14px_34px_rgba(40,90,140,0.22)]">
        <div ref={topRef} className="overflow-hidden rounded-2xl">
          <PromoFace tutors={tutors} total={total} more={more} onClose={close} />
        </div>
        <div
          ref={bottomRef}
          className="absolute inset-0 overflow-hidden rounded-2xl"
        >
          <PromoFace tutors={tutors} total={total} more={more} onClose={close} />
        </div>
      </div>
    </aside>
  );
}
