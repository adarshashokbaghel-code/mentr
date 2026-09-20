"use client";

import { cn } from "@/lib/utils";
import { Pause, Play, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** First Class 3–5 lesson — used on Learn marketing surfaces (below hero). */
export const LEARN_DEMO_VIDEO_SRC = "/learn/lessons/A1.mp4";
export const LEARN_DEMO_CAPTIONS_SRC = "/learn/lessons/A1.vtt";
export const LEARN_DEMO_LESSON_TITLE = "What Is a Computer?";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type LearnDemoVideoProps = {
  className?: string;
  /** Auto-start when the block mounts. */
  autoPlay?: boolean;
  /** Compact chrome for smaller cards. */
  compact?: boolean;
  /** Pause when parent leaves this block. */
  active?: boolean;
};

export function LearnDemoVideo({
  className,
  autoPlay = false,
  compact = false,
  active = true,
}: LearnDemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.volume = 0;
    if (!active) {
      el.pause();
      setPlaying(false);
      return;
    }
    if (autoPlay) {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [active, autoPlay]);

  const progress =
    duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  async function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.volume = 0;
    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
        setEnded(false);
      } catch {
        setPlaying(false);
      }
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <div className={cn("relative overflow-hidden bg-[#0e131b]", className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        preload="metadata"
        poster="/learn/demo/learn-demo-watch-scene.png"
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          e.currentTarget.muted = true;
          e.currentTarget.volume = 0;
          setDuration(e.currentTarget.duration);
        }}
        onVolumeChange={(e) => {
          // Landing demos stay silent — no music / narration audio.
          if (!e.currentTarget.muted || e.currentTarget.volume > 0) {
            e.currentTarget.muted = true;
            e.currentTarget.volume = 0;
          }
        }}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setEnded(true);
          setPlaying(false);
        }}
      >
        <source src={LEARN_DEMO_VIDEO_SRC} type="video/mp4" />
        <track
          kind="captions"
          srcLang="en-IN"
          label="English (India)"
          src={LEARN_DEMO_CAPTIONS_SRC}
          default
        />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e131b]/90 via-transparent to-[#0e131b]/35" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="min-w-0">
          <p
            className={cn(
              "font-bold uppercase tracking-wider text-[#ffb27a]",
              compact ? "text-[10px]" : "text-[11px]",
            )}
          >
            Gamified video module
          </p>
          <p
            className={cn(
              "font-bold text-white",
              compact ? "text-[13px]" : "text-[14px] sm:text-[15px]",
            )}
          >
            {LEARN_DEMO_LESSON_TITLE}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold text-white/80 ring-1 ring-white/10 backdrop-blur-md">
          <VolumeX className="h-3 w-3" strokeWidth={2.25} />
          Silent preview
        </span>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <button
          type="button"
          onClick={() => void togglePlay()}
          className={cn(
            "flex items-center justify-center rounded-full bg-[#ff6a1a] text-white shadow-[0_8px_24px_rgba(255,106,26,0.45)] transition hover:scale-105",
            compact ? "h-11 w-11" : "h-14 w-14",
            playing && !ended && "opacity-0 hover:opacity-100",
          )}
          aria-label={
            playing ? "Pause lesson video" : "Play What Is a Computer? (muted)"
          }
        >
          {playing && !ended ? (
            <Pause
              className={cn(compact ? "h-4 w-4" : "h-5 w-5", "fill-current")}
            />
          ) : (
            <Play
              className={cn(compact ? "h-4 w-4" : "h-5 w-5", "fill-current")}
            />
          )}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-2.5 pt-8 sm:px-4">
        <div className="h-1 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[#ff6a1a] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] font-bold text-white/60">
          <span>
            {formatTime(current)} / {formatTime(duration || 180)}
            {ended
              ? " · finished"
              : playing
                ? " · playing (muted)"
                : " · 3 min · no audio"}
          </span>
          <span className="text-[#ffb27a]">
            {ended ? "Video done · +10 XP" : "Finish video · +10 XP"}
          </span>
        </div>
      </div>
    </div>
  );
}
