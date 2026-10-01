"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LEARN_SHELL } from "./learn-shell";
import { SectionHeader } from "./shared";

const FILM_SRC = "/learn/lessons/A12.mp4";
const FILM_CAPTIONS = "/learn/lessons/A12.vtt";

/**
 * Scale, lift, and sticker tilt are tied to scroll position.
 * The card starts tipped, then settles flat — same offset-shadow look as the rest of the page.
 */
export function LearnScrollFilm() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.96;
      const end = vh * 0.34;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

      if (reduce) {
        frame.style.transform = "none";
        frame.style.boxShadow = "";
      } else {
        const left = 1 - progress;
        const scale = 0.82 + progress * 0.18;
        const y = left * 48;
        const tiltX = left * 14;
        const tiltY = left * -7;
        const tiltZ = left * -3.5;
        const shadowX = 6 + left * 10;
        const shadowY = 6 + left * 12;
        frame.style.transform = `translate3d(0, ${y}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${scale})`;
        frame.style.boxShadow = `${shadowX}px ${shadowY}px 0 0 #1c1a17`;
      }

      if (reduce) return;

      if (progress > 0.84 && video.paused && !userPaused.current) {
        void video.play().catch(() => setPlaying(false));
      }
      if (progress < 0.12 && !video.paused) {
        video.pause();
        userPaused.current = false;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    video.volume = next ? 0 : 1;
    setMuted(next);
    if (!next && video.paused) {
      userPaused.current = false;
      void video.play().catch(() => setPlaying(false));
    }
  }

  return (
    <section id="lesson-film" className="py-10 sm:py-16 lg:py-20">
      <div className={LEARN_SHELL}>
        <SectionHeader
          eyebrow="A real lesson"
          title="Watch Billu learn to walk."
          accent="Chapter A12, on the free path."
          description="Making a Character Move. Kids stack blocks, and Billu the cat walks and turns corners. Narrated, with captions, about six minutes."
        />

        <div className="learn-scroll-stage mx-auto mt-8 max-w-[980px] sm:mt-10">
          <div
            ref={frameRef}
            className="learn-scroll-film overflow-hidden rounded-2xl border-[3px] border-ink bg-[#0e131b]"
          >
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                muted
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                <source src={FILM_SRC} type="video/mp4" />
                <track
                  kind="captions"
                  srcLang="en-IN"
                  label="English (India)"
                  src={FILM_CAPTIONS}
                  default
                />
              </video>

              <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 px-3 pb-3 pt-8 sm:px-4">
                <button
                  type="button"
                  onClick={() => void togglePlay()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#ff6a1a] px-3 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(255,106,26,0.4)]"
                  aria-label={playing ? "Pause lesson" : "Play Making a Character Move"}
                >
                  {playing ? (
                    <Pause className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  )}
                  {playing ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-black/55 px-3 text-[12px] font-bold text-white ring-1 ring-white/15 backdrop-blur-md"
                  aria-label={muted ? "Turn lesson sound on" : "Mute lesson"}
                >
                  {muted ? (
                    <VolumeX className="h-3.5 w-3.5" strokeWidth={2.25} />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                  )}
                  {muted ? "Sound off" : "Sound on"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
