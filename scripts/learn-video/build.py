#!/usr/bin/env python3
"""
Production Learn lesson video builder (free stack).

Pipeline:
  scenes.json (beat-synced script)
    → Edge TTS Indian English neural voice (per beat)
    → Pillow motion frames timed to each beat
    → ffmpeg H.264 + AAC MP4
    → captions.vtt + transcript.json (beat-accurate)

Usage:
  .venv-video/bin/python scripts/learn-video/build.py videos/learn/a1-what-is-a-computer
"""

from __future__ import annotations

import asyncio
import functools
import json
import math
import multiprocessing
import os
import random
import shutil
import subprocess
import sys
import wave
from array import array
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont, ImageFilter

try:
    import edge_tts
    import imageio_ffmpeg
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Install deps: .venv-video/bin/pip install pillow imageio-ffmpeg edge-tts"
    ) from exc

ROOT = Path(__file__).resolve().parents[2]
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def ease_out_cubic(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def ease_in_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 3 * t * t - 2 * t * t * t


@functools.lru_cache(maxsize=None)
def load_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Neue.ttc",
        "/System/Library/Fonts/SFNSRounded.ttf",
    ]
    for path in paths:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size=size)
            except OSError:
                continue
    return ImageFont.load_default()


@functools.lru_cache(maxsize=None)
def scaled_font(path: str, size: int) -> ImageFont.ImageFont:
    return ImageFont.truetype(path, size=size)


class ScaledDraw:
    """ImageDraw proxy: callers use 1x coordinates, drawing lands on a k-times canvas (supersampling)."""

    def __init__(self, draw: ImageDraw.ImageDraw, k: int) -> None:
        self._d = draw
        self.k = k

    def _xy(self, xy):
        k = self.k
        if isinstance(xy, (list, tuple)) and xy and isinstance(xy[0], (list, tuple)):
            return [(p[0] * k, p[1] * k) for p in xy]
        return [v * k for v in xy]

    def _font(self, font):
        path = getattr(font, "path", None)
        if font is None or not path:
            return font
        return scaled_font(path, int(round(font.size * self.k)))

    def _kw(self, kw: dict) -> dict:
        if kw.get("width"):
            kw["width"] = max(1, int(round(kw["width"] * self.k)))
        if "radius" in kw:
            kw["radius"] = kw["radius"] * self.k
        return kw

    def rectangle(self, xy, **kw):
        self._d.rectangle(self._xy(xy), **self._kw(kw))

    def rounded_rectangle(self, xy, radius=0, **kw):
        kw["radius"] = radius
        self._d.rounded_rectangle(self._xy(xy), **self._kw(kw))

    def ellipse(self, xy, **kw):
        self._d.ellipse(self._xy(xy), **self._kw(kw))

    def line(self, xy, **kw):
        self._d.line(self._xy(xy), **self._kw(kw))

    def polygon(self, xy, **kw):
        self._d.polygon(self._xy(xy), **self._kw(kw))

    def arc(self, xy, start, end, **kw):
        self._d.arc(self._xy(xy), start, end, **self._kw(kw))

    def chord(self, xy, start, end, **kw):
        self._d.chord(self._xy(xy), start, end, **self._kw(kw))

    def pieslice(self, xy, start, end, **kw):
        self._d.pieslice(self._xy(xy), start, end, **self._kw(kw))

    def text(self, xy, text, fill=None, font=None, **kw):
        self._d.text((xy[0] * self.k, xy[1] * self.k), text, fill=fill, font=self._font(font), **kw)

    def textbbox(self, xy, text, font=None, **kw):
        b = self._d.textbbox((xy[0] * self.k, xy[1] * self.k), text, font=self._font(font), **kw)
        return tuple(v / self.k for v in b)


SFX_RATE = 44100


def _synth(dur: float, voices: list[tuple[float, float, float]], decay: float, vol: float,
           sweep_to: float | None = None) -> list[float]:
    """voices: (start_sec, freq, gain)."""
    n = int(dur * SFX_RATE)
    out = [0.0] * n
    for start, freq, gain in voices:
        s0 = int(start * SFX_RATE)
        phase = 0.0
        for i in range(s0, n):
            t = (i - s0) / SFX_RATE
            f = freq if sweep_to is None else freq + (sweep_to - freq) * min(1.0, t / dur)
            phase += 2 * math.pi * f / SFX_RATE
            env = math.exp(-t * decay) * min(1.0, t / 0.004)
            out[i] += (math.sin(phase) + 0.22 * math.sin(2 * phase)) * env * gain * vol
    return out


@functools.lru_cache(maxsize=None)
def sfx_samples(name: str) -> tuple[float, ...]:
    if name == "pop":
        return tuple(_synth(0.14, [(0, 520, 1.0)], 28, 0.55, sweep_to=900))
    if name == "tick":
        return tuple(_synth(0.06, [(0, 1800, 1.0)], 70, 0.3))
    if name == "chime":
        return tuple(_synth(1.0, [(0, 1046.5, 1.0), (0.1, 1318.5, 0.9)], 5, 0.32))
    if name == "success":
        notes = [(0, 523.3, 1.0), (0.08, 659.3, 0.9), (0.16, 784.0, 0.9), (0.24, 1046.5, 1.0)]
        return tuple(_synth(1.1, notes, 6, 0.26))
    if name == "buzz":
        return tuple(_synth(0.38, [(0, 196.0, 1.0), (0.0, 207.7, 0.7), (0.16, 174.6, 0.9)], 7, 0.34))
    if name == "whoosh":
        rng = random.Random(7)
        dur = 0.5
        n = int(dur * SFX_RATE)
        out, lp = [], 0.0
        for i in range(n):
            t = i / n
            cutoff = 0.02 + 0.18 * math.sin(math.pi * t)
            lp += cutoff * (rng.uniform(-1, 1) - lp)
            out.append(lp * math.sin(math.pi * t) ** 1.5 * 1.6)
        return tuple(out)
    return ()


def write_sfx_track(events: list[tuple[float, str, float]], total: float, out_path: Path) -> None:
    n = int(total * SFX_RATE) + SFX_RATE
    buf = array("h", bytes(2 * n))
    for at, name, gain in events:
        start = int(at * SFX_RATE)
        for j, v in enumerate(sfx_samples(name)):
            k = start + j
            if k >= n:
                break
            buf[k] = max(-32767, min(32767, buf[k] + int(v * gain * 32767)))
    with wave.open(str(out_path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SFX_RATE)
        wf.writeframes(buf.tobytes())


def media_duration(path: Path) -> float:
    probe = subprocess.run(
        [FFMPEG, "-i", str(path)],
        capture_output=True,
        text=True,
    )
    for line in (probe.stderr or "").splitlines():
        if "Duration:" in line:
            part = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = part.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise RuntimeError(f"Could not read duration for {path}")


TRIM_SILENCE_AF = (
    "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,"
    "areverse,"
    "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04,"
    "areverse"
)

VOICE_POLISH_AF = (
    "highpass=f=70,"
    "equalizer=f=3200:t=q:w=1.2:g=2.5,"
    "acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80:makeup=1.5,"
    "loudnorm=I=-16:TP=-1.5:LRA=9"
)


async def synthesize_beat(
    text: str, voice: str, rate: str, out_mp3: Path, pitch: str = "+0Hz", trim: bool = False
) -> tuple[float, Path]:
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
    await communicate.save(str(out_mp3))
    wav = out_mp3.with_suffix(".wav")
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(out_mp3),
            *(["-af", TRIM_SILENCE_AF] if trim else []),
            "-ar",
            "44100",
            "-ac",
            "1",
            str(wav),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    out_mp3.unlink(missing_ok=True)
    return media_duration(wav), wav


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, int, int],
    outline: tuple[int, int, int] | None = None,
    width: int = 0,
) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_text_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    cy: int,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    width: int,
) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((width - tw) // 2, cy), text, font=font, fill=fill)


def wrap_text(text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    dummy = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    for word in words:
        trial = f"{cur} {word}".strip()
        if dummy.textbbox((0, 0), trial, font=font)[2] <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or [text]


_BG_CACHE: dict[str, Image.Image] = {}


def paint_background(img: Image.Image, brand: dict[str, str], t: float) -> None:
    """Fast cream wash + soft brand glows (cached base)."""
    w, h = img.size
    key = f"{brand['bg']}:{brand['bgDeep']}:{w}x{h}"
    base = _BG_CACHE.get(key)
    if base is None:
        bg = hex_rgb(brand["bg"])
        deep = hex_rgb(brand["bgDeep"])
        grad = Image.new("RGB", (1, h))
        gp = grad.load()
        for y in range(h):
            k = y / max(h - 1, 1)
            gp[0, y] = (
                int(lerp(bg[0], deep[0], k)),
                int(lerp(bg[1], deep[1], k)),
                int(lerp(bg[2], deep[2], k)),
            )
        base = grad.resize((w, h), Image.Resampling.BILINEAR)
        glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(glow)
        k = w / 1920
        gdraw.ellipse((w - 720 * k, -220 * k, w + 220 * k, 520 * k), fill=hex_rgb(brand["coral"]) + (36,))
        gdraw.ellipse((-220 * k, h - 520 * k, 620 * k, h + 220 * k), fill=hex_rgb(brand["sage"]) + (28,))
        glow = glow.filter(ImageFilter.GaussianBlur(90 * k))
        base = Image.alpha_composite(base.convert("RGBA"), glow).convert("RGB")
        _BG_CACHE[key] = base
    # subtle vertical drift via crop/paste offset
    drift = int(8 * math.sin(t * math.pi))
    if drift:
        shifted = Image.new("RGB", (w, h), hex_rgb(brand["bg"]))
        shifted.paste(base, (0, drift))
        img.paste(shifted)
    else:
        img.paste(base)


def draw_top_bar(
    draw: ImageDraw.ImageDraw,
    brand: dict[str, str],
    title: str,
    unit_label: str,
    chapter_label: str,
    w: int,
) -> None:
    ink = hex_rgb(brand["ink"])
    coral = hex_rgb(brand["coral"])
    muted = hex_rgb(brand["muted"])
    draw.rectangle((0, 0, w, 10), fill=coral)
    draw.text((72, 40), "MENTR LEARN", fill=coral, font=load_font(26, bold=True))
    draw.text((72, 82), f"{unit_label}  ·  {chapter_label}", fill=muted, font=load_font(24))
    draw.text((72, 124), title, fill=ink, font=load_font(56, bold=True))


def draw_caption_bar(
    draw: ImageDraw.ImageDraw,
    brand: dict[str, str],
    caption: str,
    w: int,
    h: int,
    appear: float,
) -> None:
    if appear <= 0:
        return
    panel = hex_rgb(brand["panel"])
    ink = hex_rgb(brand["ink"])
    coral = hex_rgb(brand["coral"])
    a = ease_out_cubic(appear)
    y_off = int((1 - a) * 36)
    bar_h = 140
    top = h - bar_h - 40 + y_off
    rounded_rect(draw, (64, top, w - 64, top + bar_h), 28, panel, hex_rgb(brand["line"]), 3)
    draw.rectangle((64, top, 78, top + bar_h), fill=coral)
    font = load_font(40, bold=True)
    lines = wrap_text(caption, font, w - 220)
    line_h = 50
    block_h = min(2, len(lines)) * line_h
    y0 = top + (bar_h - block_h) // 2
    for i, line in enumerate(lines[:2]):
        draw.text((110, y0 + i * line_h), line, fill=ink, font=font)


def draw_card(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int, int, int],
    brand: dict[str, str],
    accent: tuple[int, int, int],
    title: str,
    subtitle: str,
    scale: float = 1.0,
    dim: bool = False,
) -> None:
    x0, y0, x1, y1 = xy
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    hw = (x1 - x0) / 2 * scale
    hh = (y1 - y0) / 2 * scale
    box = (int(cx - hw), int(cy - hh), int(cx + hw), int(cy + hh))
    panel = hex_rgb(brand["panel"])
    ink = hex_rgb(brand["ink"])
    muted = hex_rgb(brand["muted"])
    line = hex_rgb(brand["line"])
    if dim:
        ink = tuple(int(lerp(c, 180, 0.45)) for c in ink)  # type: ignore[assignment]
        muted = tuple(int(lerp(c, 180, 0.35)) for c in muted)  # type: ignore[assignment]
    rounded_rect(draw, box, 28, panel, line, 3)
    draw.rectangle((box[0], box[1], box[2], box[1] + 14), fill=accent)
    draw.text((box[0] + 36, box[1] + 48), title, fill=ink, font=load_font(38, bold=True))
    draw.text((box[0] + 36, box[1] + 108), subtitle, fill=muted, font=load_font(24))


def draw_mascot(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    r: int,
    sage: tuple[int, int, int],
    panel: tuple[int, int, int],
    bounce: int = 0,
) -> None:
    cy = cy + bounce
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=sage)
    draw.ellipse((cx - 42, cy - 30, cx - 12, cy), fill=panel)
    draw.ellipse((cx + 12, cy - 30, cx + 42, cy), fill=panel)
    draw.arc((cx - 48, cy - 8, cx + 48, cy + 52), 15, 165, fill=panel, width=8)


# ---------------------------------------------------------------------------
# A3 · Input & Output Devices — illustrated device kit + scenes
# ---------------------------------------------------------------------------

BOTH_COLOR = (123, 97, 214)
DEV_DARK = (52, 60, 76)
DEV_MID = (92, 102, 120)
DEV_DEEP = (30, 36, 48)
DEV_KEY = (236, 230, 220)
DEV_SCREEN = (214, 238, 234)
SKIN = (241, 196, 160)


def clamp01(t: float) -> float:
    return max(0.0, min(1.0, t))


def stagger(progress: float, i: int, step: float = 0.12, speed: float = 3.0) -> float:
    return ease_out_cubic(clamp01((progress - i * step) * speed))


def text_at(draw: ImageDraw.ImageDraw, text: str, cx: float, y: float, font: ImageFont.ImageFont, fill) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    draw.text((int(cx - (bbox[2] - bbox[0]) / 2), int(y)), text, font=font, fill=fill)


def shadow_card(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    brand: dict[str, str],
    radius: int = 32,
    accent: tuple[int, int, int] | None = None,
    outline: tuple[int, int, int] | None = None,
    outline_w: int = 3,
    offset: int = 10,
) -> None:
    x0, y0, x1, y1 = (int(v) for v in box)
    shadow = tuple(int(c * 0.88) for c in hex_rgb(brand["bgDeep"]))
    draw.rounded_rectangle((x0 + offset, y0 + offset, x1 + offset, y1 + offset), radius=radius, fill=shadow)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=radius, fill=hex_rgb(brand["panel"]),
                           outline=outline or hex_rgb(brand["line"]), width=outline_w)
    if accent:
        draw.rounded_rectangle((x0, y0, x1, y0 + 2 * radius), radius=radius, fill=accent)
        draw.rectangle((x0, y0 + 16, x1, y0 + 2 * radius + 2), fill=hex_rgb(brand["panel"]))
        if outline_w:
            draw.line((x0, y0 + 16, x0, y0 + 2 * radius), fill=outline or hex_rgb(brand["line"]), width=outline_w)
            draw.line((x1 - 1, y0 + 16, x1 - 1, y0 + 2 * radius), fill=outline or hex_rgb(brand["line"]), width=outline_w)


def draw_arrow(draw: ImageDraw.ImageDraw, x0: float, y0: float, x1: float, y1: float,
               color, width: int = 10, head: int = 30) -> None:
    ang = math.atan2(y1 - y0, x1 - x0)
    length = math.hypot(x1 - x0, y1 - y0)
    if length < 4:
        return
    head = min(head, int(length * 0.6))
    bx = x1 - head * math.cos(ang)
    by = y1 - head * math.sin(ang)
    draw.line((x0, y0, bx, by), fill=color, width=width)
    hw = head * 0.62
    left = (bx + hw * math.sin(ang), by - hw * math.cos(ang))
    right = (bx - hw * math.sin(ang), by + hw * math.cos(ang))
    draw.polygon([(x1, y1), left, right], fill=color)


def draw_dashed(draw: ImageDraw.ImageDraw, x0: float, y0: float, x1: float, y1: float,
                color, width: int = 6, dash: int = 22, gap: int = 16, phase: float = 0.0) -> None:
    length = math.hypot(x1 - x0, y1 - y0)
    if length < 1:
        return
    ux, uy = (x1 - x0) / length, (y1 - y0) / length
    d = -(phase % (dash + gap))
    while d < length:
        a = max(0.0, d)
        b = min(length, d + dash)
        if b > a:
            draw.line((x0 + ux * a, y0 + uy * a, x0 + ux * b, y0 + uy * b), fill=color, width=width)
        d += dash + gap


def pill(draw: ImageDraw.ImageDraw, cx: float, y: float, label: str, color,
         size: int = 30, fg=(255, 255, 255), left: float | None = None) -> tuple[int, int, int, int]:
    font = load_font(size, bold=True)
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = int(size * 0.9), int(size * 0.45)
    x0 = int(left) if left is not None else int(cx - tw / 2 - pad_x)
    box = (x0, int(y), x0 + tw + 2 * pad_x, int(y + th + 2 * pad_y))
    draw.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=color)
    draw.text((x0 + pad_x, int(y + pad_y - bbox[1])), label, font=font, fill=fg)
    return box


def draw_check(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, color, bg=(255, 255, 255)) -> None:
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)
    draw.line([(cx - r * 0.45, cy + r * 0.02), (cx - r * 0.1, cy + r * 0.38), (cx + r * 0.5, cy - r * 0.32)],
              fill=bg, width=max(3, int(r * 0.22)), joint="curve")


def draw_star(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, color, rot: float = 0.0) -> None:
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.45
        a = rot + i * math.pi / 5 - math.pi / 2
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    draw.polygon(pts, fill=color)


def sound_waves(draw: ImageDraw.ImageDraw, cx: float, cy: float, s: float, color,
                t: float, facing: str = "right", count: int = 3) -> None:
    base = 34 * s
    step = 30 * s
    shift = (t * 3.0) % 1.0
    start, end = (-42, 42) if facing == "right" else (138, 222)
    for i in range(count):
        r = base + (i + shift) * step
        if r > base + count * step:
            continue
        width = max(3, int(7 * s))
        draw.arc((cx - r, cy - r, cx + r, cy + r), start, end, fill=color, width=width)


def draw_face(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, who: str, smile_t: float = 0.0) -> None:
    ink = (40, 44, 56)
    if who == "nani":
        draw.ellipse((cx - r * 0.55, cy - r * 1.55, cx + r * 0.55, cy - r * 0.6), fill=(205, 205, 210))
        draw.ellipse((cx - r * 1.08, cy - r * 1.05, cx + r * 1.08, cy + r * 0.6), fill=(205, 205, 210))
    else:
        draw.ellipse((cx - r * 1.06, cy - r * 1.12, cx + r * 1.06, cy + r * 0.5), fill=(40, 34, 30))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=SKIN)
    if who == "nani":
        draw.chord((cx - r, cy - r * 1.02, cx + r, cy - r * 0.1), 180, 360, fill=(205, 205, 210))
    else:
        draw.chord((cx - r, cy - r * 1.05, cx + r, cy - r * 0.2), 180, 360, fill=(40, 34, 30))
    er = max(2, r * 0.1)
    draw.ellipse((cx - r * 0.38 - er, cy - r * 0.05 - er, cx - r * 0.38 + er, cy - r * 0.05 + er), fill=ink)
    draw.ellipse((cx + r * 0.38 - er, cy - r * 0.05 - er, cx + r * 0.38 + er, cy - r * 0.05 + er), fill=ink)
    if who == "nani":
        gw = max(2, int(r * 0.07))
        for sx in (-1, 1):
            gx = cx + sx * r * 0.38
            draw.ellipse((gx - r * 0.26, cy - r * 0.3, gx + r * 0.26, cy + r * 0.2), outline=ink, width=gw)
        draw.line((cx - r * 0.12, cy - r * 0.05, cx + r * 0.12, cy - r * 0.05), fill=ink, width=gw)
    sm = 0.35 + 0.1 * smile_t
    draw.arc((cx - r * sm * 1.3, cy + r * 0.05, cx + r * sm * 1.3, cy + r * 0.62), 20, 160,
             fill=(190, 70, 60), width=max(2, int(r * 0.1)))


def draw_device(draw: ImageDraw.ImageDraw, kind: str, cx: float, cy: float, s: float,
                brand: dict[str, str], t: float = 0.0, face: str | None = None, lit: bool = True) -> None:
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    line = hex_rgb(brand["line"])

    def S(v: float) -> int:
        return int(round(v * s))

    ow = max(2, S(5))

    if kind == "keyboard":
        x0, y0, x1, y1 = cx - S(160), cy - S(64), cx + S(160), cy + S(64)
        draw.rounded_rectangle((x0 + S(6), y0 + S(8), x1 + S(6), y1 + S(8)), radius=S(18), fill=(200, 192, 180))
        draw.rounded_rectangle((x0, y0, x1, y1), radius=S(18), fill=panel, outline=ink, width=ow)
        cols = 11
        kw = (x1 - x0 - S(28)) / cols
        hot = int(t * 26) % 30
        k = 0
        for r in range(3):
            n = cols - r
            off = r * kw * 0.5
            for c in range(n):
                kx = x0 + S(14) + off + c * kw
                ky = y0 + S(14) + r * S(26)
                fill = coral if (k == hot and t > 0) else DEV_KEY
                draw.rounded_rectangle((kx + S(2), ky, kx + kw - S(3), ky + S(20)), radius=S(4), fill=fill)
                k += 1
        sy = y0 + S(14) + 3 * S(26)
        draw.rounded_rectangle((cx - S(80), sy, cx + S(80), sy + S(18)), radius=S(5), fill=DEV_KEY)
        return

    if kind == "mouse":
        draw.line([(cx, cy - S(82)), (cx, cy - S(108)), (cx + S(26), cy - S(134)), (cx + S(90), cy - S(140))],
                  fill=ink, width=ow, joint="curve")
        draw.ellipse((cx - S(58) + S(6), cy - S(84) + S(8), cx + S(58) + S(6), cy + S(84) + S(8)), fill=(200, 192, 180))
        draw.ellipse((cx - S(58), cy - S(84), cx + S(58), cy + S(84)), fill=panel, outline=ink, width=ow)
        draw.line((cx, cy - S(84), cx, cy - S(16)), fill=ink, width=max(2, S(4)))
        draw.line((cx - S(56), cy - S(16), cx + S(56), cy - S(16)), fill=ink, width=max(2, S(4)))
        click = t > 0 and (int(t * 8) % 2 == 0)
        if click:
            draw.pieslice((cx - S(55), cy - S(81), cx + S(55), cy + S(40)), 180, 270, fill=(255, 214, 190))
            draw.line((cx, cy - S(82), cx, cy - S(16)), fill=ink, width=max(2, S(4)))
        draw.rounded_rectangle((cx - S(9), cy - S(66), cx + S(9), cy - S(34)), radius=S(8), fill=coral)
        return

    if kind == "mic":
        draw.arc((cx - S(66), cy - S(70), cx + S(66), cy + S(52)), 0, 180, fill=ink, width=ow + 1)
        draw.line((cx, cy + S(52), cx, cy + S(98)), fill=ink, width=ow + 1)
        draw.rounded_rectangle((cx - S(60), cy + S(96), cx + S(60), cy + S(114)), radius=S(9), fill=ink)
        draw.rounded_rectangle((cx - S(42), cy - S(118), cx + S(42), cy + S(18)), radius=S(42), fill=DEV_DARK)
        for i in range(5):
            gy = cy - S(92) + i * S(20)
            draw.line((cx - S(28), gy, cx + S(28), gy), fill=DEV_MID, width=max(2, S(4)))
        draw.ellipse((cx - S(30), cy - S(110), cx - S(14), cy - S(94)), fill=(130, 140, 158))
        return

    if kind == "camera":
        draw.rounded_rectangle((cx - S(52), cy - S(92), cx + S(18), cy - S(56)), radius=S(10), fill=DEV_DARK)
        draw.rounded_rectangle((cx - S(124) + S(6), cy - S(66) + S(8), cx + S(124) + S(6), cy + S(82) + S(8)),
                               radius=S(24), fill=(200, 192, 180))
        draw.rounded_rectangle((cx - S(124), cy - S(66), cx + S(124), cy + S(82)), radius=S(24), fill=DEV_DARK)
        lx, ly = cx, cy + S(10)
        draw.ellipse((lx - S(60), ly - S(60), lx + S(60), ly + S(60)), fill=panel)
        draw.ellipse((lx - S(52), ly - S(52), lx + S(52), ly + S(52)), fill=DEV_MID)
        draw.ellipse((lx - S(34), ly - S(34), lx + S(34), ly + S(34)), fill=DEV_DEEP)
        draw.ellipse((lx - S(22), ly - S(24), lx - S(6), ly - S(8)), fill=(220, 230, 240))
        flash = t > 0 and (t * 4) % 1.0 < 0.18
        fc = (255, 236, 150) if flash else coral
        draw.rounded_rectangle((cx + S(72), cy - S(50), cx + S(102), cy - S(30)), radius=S(5), fill=fc)
        if flash:
            for a in range(0, 360, 45):
                ax = cx + S(87) + math.cos(math.radians(a)) * S(34)
                ay = cy - S(40) + math.sin(math.radians(a)) * S(34)
                bx = cx + S(87) + math.cos(math.radians(a)) * S(50)
                by = cy - S(40) + math.sin(math.radians(a)) * S(50)
                draw.line((ax, ay, bx, by), fill=(255, 200, 80), width=max(2, S(5)))
        return

    if kind in ("screen", "tv"):
        x0, y0, x1, y1 = cx - S(170), cy - S(118), cx + S(170), cy + S(72)
        if kind == "screen":
            draw.rectangle((cx - S(18), y1, cx + S(18), y1 + S(34)), fill=DEV_DARK)
            draw.rounded_rectangle((cx - S(84), y1 + S(32), cx + S(84), y1 + S(48)), radius=S(8), fill=DEV_DARK)
        else:
            draw.line((cx - S(110), y1, cx - S(140), y1 + S(40)), fill=DEV_DARK, width=ow + 2)
            draw.line((cx + S(110), y1, cx + S(140), y1 + S(40)), fill=DEV_DARK, width=ow + 2)
        draw.rounded_rectangle((x0, y0, x1, y1), radius=S(16), fill=DEV_DARK)
        ix0, iy0, ix1, iy1 = x0 + S(12), y0 + S(12), x1 - S(12), y1 - S(12)
        sky = DEV_SCREEN if lit else (70, 78, 94)
        draw.rectangle((ix0, iy0, ix1, iy1), fill=sky)
        if lit:
            sun_y = iy0 + S(40) + int(S(8) * math.sin(t * math.pi * 2))
            draw.ellipse((ix1 - S(84), sun_y - S(22), ix1 - S(40), sun_y + S(22)), fill=coral)
            draw.polygon([(ix0, iy1), (ix0 + S(90), iy0 + S(60)), (ix0 + S(170), iy1)], fill=sage)
            draw.polygon([(ix0 + S(110), iy1), (ix0 + S(210), iy0 + S(80)), (ix1, iy1)], fill=(20, 150, 136))
        return

    if kind == "speaker":
        draw.rounded_rectangle((cx - S(72) + S(6), cy - S(118) + S(8), cx + S(72) + S(6), cy + S(118) + S(8)),
                               radius=S(18), fill=(200, 192, 180))
        draw.rounded_rectangle((cx - S(72), cy - S(118), cx + S(72), cy + S(118)), radius=S(18), fill=DEV_DARK)
        ty = cy - S(62)
        draw.ellipse((cx - S(24), ty - S(24), cx + S(24), ty + S(24)), fill=DEV_MID)
        draw.ellipse((cx - S(10), ty - S(10), cx + S(10), ty + S(10)), fill=DEV_DEEP)
        wy = cy + S(40)
        pulse = S(3) * math.sin(t * math.pi * 12) if t > 0 else 0
        draw.ellipse((cx - S(52) - pulse, wy - S(52) - pulse, cx + S(52) + pulse, wy + S(52) + pulse), fill=DEV_MID)
        draw.ellipse((cx - S(24), wy - S(24), cx + S(24), wy + S(24)), fill=DEV_DEEP)
        if t > 0:
            sound_waves(draw, cx + S(78), cy, s, sage, t, "right")
        return

    if kind == "printer":
        draw.rectangle((cx - S(92), cy - S(118), cx + S(92), cy - S(30)), fill=panel, outline=line, width=max(2, S(3)))
        draw.rounded_rectangle((cx - S(150) + S(6), cy - S(48) + S(8), cx + S(150) + S(6), cy + S(62) + S(8)),
                               radius=S(18), fill=(200, 192, 180))
        draw.rounded_rectangle((cx - S(150), cy - S(48), cx + S(150), cy + S(62)), radius=S(18), fill=panel,
                               outline=ink, width=ow)
        draw.ellipse((cx + S(100), cy - S(28), cx + S(122), cy - S(6)), fill=sage)
        draw.rounded_rectangle((cx - S(110), cy + S(26), cx + S(110), cy + S(40)), radius=S(6), fill=DEV_DARK)
        slide = ease_out_cubic((t * 1.4) % 1.0) if t > 0 else 1.0
        ph = S(24) + S(96) * slide
        px0, py0, px1 = cx - S(92), cy + S(34), cx + S(92)
        draw.rectangle((px0, py0, px1, py0 + ph), fill=(255, 255, 255), outline=ink, width=max(2, S(3)))
        if ph > S(40):
            draw.ellipse((px0 + S(22), py0 + S(14), px0 + S(56), py0 + S(48)), fill=coral)
        if ph > S(70):
            draw.line((px0 + S(70), py0 + S(26), px1 - S(20), py0 + S(26)), fill=DEV_MID, width=max(2, S(5)))
            draw.line((px0 + S(70), py0 + S(44), px1 - S(50), py0 + S(44)), fill=DEV_MID, width=max(2, S(5)))
        if ph > S(100):
            draw.line((px0 + S(22), py0 + S(76), px1 - S(30), py0 + S(76)), fill=sage, width=max(2, S(5)))
        return

    if kind == "touch":
        x0, y0, x1, y1 = cx - S(96), cy - S(146), cx + S(96), cy + S(146)
        draw.rounded_rectangle((x0 + S(6), y0 + S(8), x1 + S(6), y1 + S(8)), radius=S(26), fill=(200, 192, 180))
        draw.rounded_rectangle((x0, y0, x1, y1), radius=S(26), fill=DEV_DARK)
        ix0, iy0, ix1, iy1 = x0 + S(12), y0 + S(26), x1 - S(12), y1 - S(26)
        draw.rectangle((ix0, iy0, ix1, iy1), fill=DEV_SCREEN if lit else (70, 78, 94))
        tiles = [coral, sage, BOTH_COLOR, (255, 190, 70), sage, coral]
        tw = (ix1 - ix0 - S(30)) / 2
        th = S(52)
        for i, col in enumerate(tiles):
            r, c = divmod(i, 2)
            tx = ix0 + S(10) + c * (tw + S(10))
            ty = iy0 + S(12) + r * (th + S(12))
            draw.rounded_rectangle((tx, ty, tx + tw, ty + th), radius=S(10), fill=col if lit else DEV_MID)
        draw.ellipse((cx - S(9), y1 - S(20), cx + S(9), y1 - S(6)), fill=DEV_MID)
        if t > 0:
            fx, fy = cx + S(28), cy + S(22)
            ring = S(14) + S(46) * ((t * 2.2) % 1.0)
            draw.ellipse((fx - ring, fy - ring, fx + ring, fy + ring), outline=coral, width=max(2, S(5)))
            draw.ellipse((fx - S(14), fy - S(14), fx + S(14), fy + S(14)), fill=coral)
        return

    if kind == "laptop":
        x0, y0, x1, y1 = cx - S(160), cy - S(118), cx + S(160), cy + S(72)
        draw.rounded_rectangle((x0, y0, x1, y1), radius=S(14), fill=DEV_DARK)
        ix0, iy0, ix1, iy1 = x0 + S(12), y0 + S(14), x1 - S(12), y1 - S(10)
        draw.rectangle((ix0, iy0, ix1, iy1), fill=DEV_SCREEN)
        draw.ellipse((cx - S(5), y0 + S(3), cx + S(5), y0 + S(11)), fill=coral if t > 0 else DEV_MID)
        if face:
            draw_face(draw, cx, (iy0 + iy1) / 2 + S(16), S(46), face, t)
        draw.polygon([(cx - S(186), y1), (cx + S(186), y1), (cx + S(214), y1 + S(26)), (cx - S(214), y1 + S(26))],
                     fill=(206, 200, 190), outline=ink)
        draw.rectangle((cx - S(40), y1 + S(4), cx + S(40), y1 + S(10)), fill=(180, 172, 160))
        return

    if kind == "headset":
        draw.arc((cx - S(100), cy - S(120), cx + S(100), cy + S(80)), 180, 360, fill=DEV_DARK, width=S(16))
        for sx in (-1, 1):
            ex = cx + sx * S(98)
            draw.rounded_rectangle((ex - S(30), cy - S(34), ex + S(30), cy + S(60)), radius=S(22), fill=DEV_DARK)
            draw.rounded_rectangle((ex - S(18), cy - S(20), ex + S(18), cy + S(46)), radius=S(14), fill=DEV_MID)
        draw.line([(cx - S(98), cy + S(56)), (cx - S(80), cy + S(100)), (cx - S(24), cy + S(118))],
                  fill=DEV_DARK, width=S(9), joint="curve")
        draw.ellipse((cx - S(34), cy + S(104), cx - S(6), cy + S(132)), fill=coral)
        return

    if kind == "remote":
        draw.rounded_rectangle((cx - S(44) + S(5), cy - S(130) + S(7), cx + S(44) + S(5), cy + S(130) + S(7)),
                               radius=S(26), fill=(200, 192, 180))
        draw.rounded_rectangle((cx - S(44), cy - S(130), cx + S(44), cy + S(130)), radius=S(26), fill=DEV_DARK)
        draw.ellipse((cx - S(14), cy - S(110), cx + S(14), cy - S(82)), fill=coral)
        press = int(t * 6) % 6 if t > 0 else -1
        for i in range(6):
            r, c = divmod(i, 2)
            bx = cx - S(18) + c * S(36)
            by = cy - S(52) + r * S(40)
            col = (255, 214, 190) if i == press else DEV_MID
            draw.ellipse((bx - S(13), by - S(13), bx + S(13), by + S(13)), fill=col)
        draw.rounded_rectangle((cx - S(26), cy + S(80), cx + S(26), cy + S(100)), radius=S(8), fill=sage)
        return

    if kind == "computer":
        bw, bh = S(150), S(95)
        draw.rounded_rectangle((cx - bw + S(8), cy - bh + S(10), cx + bw + S(8), cy + bh + S(10)),
                               radius=S(26), fill=(200, 192, 180))
        draw.rounded_rectangle((cx - bw, cy - bh, cx + bw, cy + bh), radius=S(26), fill=panel, outline=ink, width=ow)
        chip = S(36)
        draw.rounded_rectangle((cx - chip, cy - chip - S(12), cx + chip, cy + chip - S(12)), radius=S(8), fill=DEV_DARK)
        for i in range(4):
            off = -chip + S(10) + i * S(18)
            draw.line((cx + off, cy - chip - S(26), cx + off, cy - chip - S(14)), fill=DEV_DARK, width=max(2, S(4)))
            draw.line((cx + off, cy + chip - S(10), cx + off, cy + chip + S(2)), fill=DEV_DARK, width=max(2, S(4)))
        glow = (int(t * 10) % 2 == 0) if t > 0 else False
        draw.ellipse((cx - S(9), cy - S(21), cx + S(9), cy - S(3)), fill=sage if glow else DEV_MID)
        text_at(draw, "COMPUTER", cx, cy + bh - S(46), load_font(max(12, S(26)), bold=True), ink)
        return


DEVICE_NAMES = {
    "keyboard": "Keyboard", "mouse": "Mouse", "mic": "Microphone", "camera": "Camera",
    "screen": "Screen", "speaker": "Speaker", "printer": "Printer", "touch": "Touchscreen",
    "headset": "Headset", "remote": "TV remote", "tv": "TV screen",
}

SPOTLIGHT = {
    "keyboard": ("You type letters & numbers", "Like typing your name in a game"),
    "mouse": ("You point and click", "Like clicking the Play button"),
    "mic": ("It listens to your voice", "Like talking to a voice helper"),
    "camera": ("It takes pictures & video", "Like a selfie or a video call"),
    "screen": ("It shows words, pictures, videos", "Like watching your cartoon"),
    "speaker": ("It plays sound & music", "Like hearing your favourite song"),
    "printer": ("It puts your work on paper", "Like printing your drawing"),
}

SORT_ORDER = [
    ("keyboard", "IN"), ("screen", "OUT"), ("mic", "IN"), ("printer", "OUT"),
    ("camera", "IN"), ("speaker", "OUT"), ("touch", "BOTH"),
]


def row_xs(n: int, w: int, gap: int) -> list[float]:
    return [w / 2 + (i - (n - 1) / 2) * gap for i in range(n)]


def render_a3(draw: ImageDraw.ImageDraw, brand: dict[str, str], visual: str, focus: str,
              progress: float, w: int, h: int) -> bool:
    ink = hex_rgb(brand["ink"])
    muted = hex_rgb(brand["muted"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    panel = hex_rgb(brand["panel"])
    line = hex_rgb(brand["line"])
    coral_soft = hex_rgb(brand["coralSoft"])
    sage_soft = hex_rgb(brand["sageSoft"])
    appear = ease_out_cubic(min(1.0, progress * 2.2))
    bounce = int(10 * math.sin(progress * math.pi * 2))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 6)
    lift = int((1 - appear) * 40)
    cx = w / 2

    def device_row(kinds: list[str], cy: float, s: float, gap: int, labels: bool = True,
                   tags: list[tuple[str, tuple[int, int, int]]] | None = None, label_dy: int = 150) -> list[float]:
        xs = row_xs(len(kinds), w, gap)
        for i, (k, x) in enumerate(zip(kinds, xs)):
            a = stagger(progress, i)
            if a <= 0:
                continue
            yy = cy + (1 - a) * 50
            draw_device(draw, k, x, yy, s * (0.8 + 0.2 * a), brand, t=progress if a >= 1 else 0.0)
            if labels:
                text_at(draw, DEVICE_NAMES[k], x, yy + label_dy * s / 0.6, load_font(32, bold=True), ink)
            if tags:
                lab, col = tags[i]
                pill(draw, x, yy + label_dy * s / 0.6 + 52, lab, col, size=26)
        return xs

    def spotlight(kind: str, tag: str, tag_color, idx: int, total: int, group: str) -> None:
        job, example = SPOTLIGHT[kind]
        shadow_card(draw, (180, 250 + lift, 900, 860 + lift), brand, radius=36, accent=tag_color)
        glow = coral_soft if tag == "INPUT" else sage_soft
        draw.ellipse((540 - 230, 570 + lift - 230, 540 + 230, 570 + lift + 230), fill=glow)
        draw_device(draw, kind, 540, 570 + lift, 1.45 * (0.9 + 0.1 * appear), brand, t=progress)
        x = 990
        a1, a2, a3 = stagger(progress, 0), stagger(progress, 1), stagger(progress, 2)
        draw.text((x, 270), f"{group} DEVICE  {idx} of {total}", fill=muted, font=load_font(28, bold=True))
        for i in range(total):
            dx = x + 380 + i * 34
            draw.ellipse((dx, 278, dx + 20, 298), fill=tag_color if i < idx else line)
        draw.text((x - int((1 - a1) * 40), 320), DEVICE_NAMES[kind], fill=ink, font=load_font(80, bold=True))
        if a2 > 0:
            pill(draw, 0, 440, tag, tag_color, size=34, left=x)
        if a3 > 0:
            draw.text((x, 540), job, fill=ink, font=load_font(42, bold=True))
            draw.text((x, 604), example, fill=muted, font=load_font(34))
        a4 = stagger(progress, 3)
        if a4 > 0:
            y = 760
            if tag == "INPUT":
                draw.text((x, y - 100), "goes IN to the computer", fill=coral, font=load_font(28, bold=True))
                draw_arrow(draw, x, y, x + 60 + 240 * a4, y, coral, width=12, head=34)
                draw_device(draw, "computer", x + 480, y, 0.5, brand, t=progress)
            else:
                draw.text((x, y - 100), "comes OUT to you", fill=sage, font=load_font(28, bold=True))
                draw_device(draw, "computer", x + 80, y, 0.5, brand, t=progress)
                draw_arrow(draw, x + 170, y, x + 170 + 60 + 200 * a4, y, sage, width=12, head=34)
                draw_face(draw, x + 500, y, 34, "kid", progress)

    def computer_with_doors(bx: float, by: float, in_door: bool, out_door: bool, glow: float = 0.0) -> tuple[float, float]:
        bw, bh = 260, 170
        draw.rounded_rectangle((bx - bw + 12, by - bh + 14, bx + bw + 12, by + bh + 14), radius=40, fill=(222, 212, 198))
        draw.rounded_rectangle((bx - bw, by - bh, bx + bw, by + bh), radius=40, fill=panel, outline=ink, width=5)
        draw_device(draw, "computer", bx, by - 10, 0.75, brand, t=progress)
        dw = 44 + int(8 * glow)
        if in_door:
            draw.rounded_rectangle((bx - bw - dw, by - 95, bx - bw + 56, by + 95), radius=20, fill=coral)
            text_at(draw, "IN", bx - bw + (56 - dw) / 2, by - 20, load_font(34, bold=True), panel)
        if out_door:
            draw.rounded_rectangle((bx + bw - 56, by - 95, bx + bw + dw, by + 95), radius=20, fill=sage)
            text_at(draw, "OUT", bx + bw + (dw - 56) / 2, by - 18, load_font(30, bold=True), panel)
        return bx - bw, bx + bw

    if visual == "a3-welcome":
        if focus == "hello":
            draw_mascot(draw, int(cx), 420, 110, sage, panel, bounce)
            text_at(draw, "Welcome back to class, champ!", cx, 590, load_font(48, bold=True), ink)
            pill(draw, cx, 680, "Chapter 3 today", coral, size=32)
            return True
        if focus == "bridge":
            cards = [("CHAPTER 1", "Input · Process · Output", coral), ("CHAPTER 2", "Binary: 1s and 0s", sage)]
            for i, (k, v, acc) in enumerate(cards):
                a = stagger(progress, i, step=0.18)
                if a <= 0:
                    continue
                x = 250 + i * 740
                y = 300 + int((1 - a) * 60)
                shadow_card(draw, (x, y, x + 680, y + 250), brand, accent=acc)
                draw.text((x + 44, y + 70), k, fill=acc, font=load_font(30, bold=True))
                draw.text((x + 44, y + 120), v, fill=ink, font=load_font(46, bold=True))
                draw_check(draw, x + 610, y + 90, 26, acc)
            a = stagger(progress, 3, step=0.15)
            if a > 0:
                pill(draw, cx, 640 + int((1 - a) * 30), "Today → Chapter 3", ink, size=36)
            return True
        if focus == "chapter":
            shadow_card(draw, (320, 260 + lift, w - 320, 540 + lift), brand, radius=40, accent=coral)
            text_at(draw, "CHAPTER 3 OF 5", cx, 320 + lift, load_font(32, bold=True), coral)
            text_at(draw, "Input & Output Devices", cx, 380 + lift, load_font(76, bold=True), ink)
            text_at(draw, "The doors of a computer", cx, 480 + lift, load_font(34), muted)
            device_row(["keyboard", "mouse", "screen", "speaker"], 720, 0.5, 380, labels=False)
            return True
        if focus == "say":
            words = ["Input…", "and…", "Output…", "Devices!"]
            cols = [coral, muted, sage, ink]
            for i, (wd, col) in enumerate(zip(words, cols)):
                a = stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                font = load_font(int(64 + 16 * a), bold=True)
                x = 260 + i * 400 + 150
                text_at(draw, wd, x, 420 + int((1 - a) * 40), font, col)
            text_at(draw, "Say it out loud with me!", cx, 620, load_font(36, bold=True), coral)
            return True
        # go
        text_at(draw, "Let's meet real devices!", cx, 260, load_font(56, bold=True), ink)
        device_row(["keyboard", "mouse", "mic", "camera", "screen", "speaker", "printer"], 560, 0.5, 250, labels=False)
        return True

    if visual == "a3-hook":
        if focus == "sealed":
            bx, by = cx, 540
            draw.rounded_rectangle((bx - 280 + 12, by - 190 + 14, bx + 280 + 12, by + 190 + 14), radius=40, fill=(214, 206, 194))
            draw.rounded_rectangle((bx - 280, by - 190, bx + 280, by + 190), radius=40, fill=(232, 228, 221), outline=muted, width=5)
            text_at(draw, "Just a closed box…", bx, by - 30, load_font(44, bold=True), muted)
            for i, (k, x) in enumerate([("keyboard", 330), ("screen", w - 330)]):
                a = stagger(progress, i + 1, step=0.2)
                if a <= 0:
                    continue
                draw_device(draw, k, x, 540, 0.62, brand)
                r = 130 * a
                draw.line((x - r, 540 - r, x + r, 540 + r), fill=coral, width=14)
                draw.line((x - r, 540 + r, x + r, 540 - r), fill=coral, width=14)
            return True
        if focus == "ask":
            computer_with_doors(cx, 560, False, False)
            a1, a2 = stagger(progress, 0, step=0.3), stagger(progress, 1, step=0.3)
            if a1 > 0:
                text_at(draw, "?", 340, 400, load_font(int(160 * a1) + 1, bold=True), coral)
                text_at(draw, "How do I tell it?", 340, 640, load_font(36, bold=True), ink)
                draw_dashed(draw, 440, 560, 620, 560, coral, width=8, phase=progress * 200)
            if a2 > 0:
                text_at(draw, "?", w - 340, 400, load_font(int(160 * a2) + 1, bold=True), sage)
                text_at(draw, "How does it answer?", w - 340, 640, load_font(36, bold=True), ink)
                draw_dashed(draw, w - 620, 560, w - 440, 560, sage, width=8, phase=progress * 200)
            return True
        if focus == "think":
            r = int(150 + 14 * pulse)
            draw.ellipse((cx - r, 520 - r, cx + r, 520 + r), fill=coral_soft, outline=coral, width=6)
            text_at(draw, "YOUR TURN", cx, 470, load_font(52, bold=True), coral)
            n = max(1, 3 - int(progress * 3))
            text_at(draw, f"think… {n}", cx, 540, load_font(40, bold=True), ink)
            return True
        # ok
        left, right = computer_with_doors(cx, 560, True, True, glow=pulse)
        a = stagger(progress, 1, step=0.2)
        if a > 0:
            draw_arrow(draw, left - 360, 560, left - 360 + 300 * a, 560, coral, width=14, head=40)
            text_at(draw, "things come IN", left - 210, 470, load_font(34, bold=True), coral)
        b = stagger(progress, 2, step=0.2)
        if b > 0:
            draw_arrow(draw, right + 40, 560, right + 40 + 300 * b, 560, sage, width=14, head=40)
            text_at(draw, "things go OUT", right + 190, 470, load_font(34, bold=True), sage)
        return True

    if visual == "a3-doors":
        if focus == "intro":
            computer_with_doors(cx, 590, True, True, glow=pulse)
            a = stagger(progress, 1, step=0.2)
            if a > 0:
                pill(draw, cx, 270 + int((1 - a) * 30), "Doors  =  DEVICES", ink, size=44)
            return True
        if focus == "in":
            left, _ = computer_with_doors(cx + 200, 560, True, False, glow=pulse)
            a = ease_in_out(clamp01(progress * 1.6))
            draw_device(draw, "keyboard", 330, 560, 0.62, brand, t=progress)
            draw_arrow(draw, 460, 560, 460 + (left - 500) * a + 20, 560, coral, width=16, head=46)
            pill(draw, 700, 300, "INPUT  →  comes IN", coral, size=40)
            for i in range(3):
                p = (progress * 1.5 + i / 3) % 1.0
                px = 480 + (left - 520) * p
                draw.ellipse((px - 12, 520 - 12, px + 12, 520 + 12), fill=coral)
            return True
        if focus == "out":
            _, right = computer_with_doors(cx - 200, 560, False, True, glow=pulse)
            a = ease_in_out(clamp01(progress * 1.6))
            draw_arrow(draw, right + 30, 560, right + 30 + (w - 470 - right) * a, 560, sage, width=16, head=46)
            draw_device(draw, "screen", w - 300, 570, 0.62, brand, t=progress)
            pill(draw, w - 700, 300, "OUTPUT  →  goes OUT", sage, size=40)
            for i in range(3):
                p = (progress * 1.5 + i / 3) % 1.0
                px = right + 40 + (w - 520 - right) * p
                draw.ellipse((px - 12, 520 - 12, px + 12, 520 + 12), fill=sage)
            return True
        if focus == "link":
            items = [("INPUT", "devices", coral, "keyboard"), ("PROCESS", "the computer", ink, "computer"),
                     ("OUTPUT", "devices", sage, "screen")]
            for i, (t1, t2, col, dev) in enumerate(items):
                a = stagger(progress, i, step=0.2)
                if a <= 0:
                    continue
                x = 170 + i * 560
                y = 290 + int((1 - a) * 50)
                shadow_card(draw, (x, y, x + 460, y + 480), brand, accent=col)
                text_at(draw, t1, x + 230, y + 60, load_font(46, bold=True), col)
                text_at(draw, t2, x + 230, y + 120, load_font(32), muted)
                draw_device(draw, dev, x + 230, y + 320, 0.7, brand, t=progress)
                if i < 2 and a >= 1:
                    draw_arrow(draw, x + 470, y + 240, x + 550, y + 240, muted, width=10, head=26)
            return True
        # say
        a1, a2 = stagger(progress, 0, step=0.3), stagger(progress, 1, step=0.3)
        if a1 > 0:
            pill(draw, cx, 330 + int((1 - a1) * 40), "IN  →  comes in", coral, size=60)
        if a2 > 0:
            pill(draw, cx, 520 + int((1 - a2) * 40), "OUT  →  goes out", sage, size=60)
        text_at(draw, "Say it with me!", cx, 730, load_font(36, bold=True), muted)
        return True

    if visual in ("a3-input", "a3-output"):
        is_in = visual == "a3-input"
        kinds = ["keyboard", "mouse", "mic", "camera"] if is_in else ["screen", "speaker", "printer"]
        col = coral if is_in else sage
        tag = "INPUT" if is_in else "OUTPUT"
        if focus == "intro":
            text_at(draw, f"{tag} devices", cx, 250, load_font(72, bold=True), col)
            sub = "They TAKE things from you and send them IN" if is_in else "They GIVE things back to you"
            text_at(draw, sub, cx, 350, load_font(38, bold=True), ink)
            device_row(kinds, 600, 0.62, 400 if is_in else 480)
            return True
        if focus == "all":
            gap = 400 if is_in else 480
            if is_in:
                xs = device_row(kinds, 380, 0.5, gap, labels=True, tags=[("IN", col)] * len(kinds), label_dy=110)
                a = stagger(progress, 4, step=0.12)
                if a > 0:
                    draw_device(draw, "computer", cx, 780, 0.55, brand, t=progress)
                    for x in xs:
                        tx = cx + (x - cx) * 0.25
                        draw_arrow(draw, x, 610, x + (tx - x) * a, 610 + (700 - 610) * a, col, width=8, head=24)
            else:
                draw_device(draw, "computer", cx, 310, 0.55, brand, t=progress)
                xs = row_xs(len(kinds), w, gap)
                a = stagger(progress, 1, step=0.12)
                for x in xs:
                    sx = cx + (x - cx) * 0.25
                    draw_arrow(draw, sx, 380, sx + (x - sx) * a, 380 + (480 - 380) * a, col, width=8, head=24)
                for i, (k, x) in enumerate(zip(kinds, xs)):
                    b = stagger(progress, i + 2)
                    if b <= 0:
                        continue
                    draw_device(draw, k, x, 600, 0.5, brand, t=progress)
                    text_at(draw, DEVICE_NAMES[k], x, 700, load_font(32, bold=True), ink)
                    pill(draw, x, 752, "OUT", col, size=26)
            return True
        if focus in kinds:
            spotlight(focus, tag, col, kinds.index(focus) + 1, len(kinds), tag)
            return True

    if visual == "a3-trick":
        def trick_card(x0: float, kind: str, active: bool | None, label: str, col) -> None:
            outline = col if active else line
            shadow_card(draw, (x0, 260, x0 + 700, 860), brand, radius=36, outline=outline,
                        outline_w=6 if active else 3, accent=col if active else None)
            dev_t = progress if active else 0.0
            draw_device(draw, kind, x0 + 350, 520, 1.1, brand, t=dev_t if kind == "speaker" else 0.0)
            if kind == "mic" and active:
                sound_waves(draw, x0 + 170, 470, 1.0, coral, 1.0 - progress, "left")
            text_at(draw, DEVICE_NAMES[kind], x0 + 350, 690, load_font(44, bold=True), ink)
            if active:
                pill(draw, x0 + 350, 760, label, col, size=32)
            elif active is False:
                text_at(draw, label, x0 + 350, 770, load_font(28), muted)

        if focus == "intro":
            trick_card(180, "mic", None, "", coral)
            trick_card(w - 880, "speaker", None, "", sage)
            r = int(70 + 8 * pulse)
            draw.ellipse((cx - r, 540 - r, cx + r, 540 + r), fill=ink)
            text_at(draw, "VS", cx, 512, load_font(48, bold=True), panel)
            return True
        if focus == "mic":
            trick_card(180, "mic", True, "Listens → INPUT", coral)
            trick_card(w - 880, "speaker", False, "wait for it…", sage)
            return True
        if focus == "speaker":
            trick_card(180, "mic", False, "INPUT", coral)
            trick_card(w - 880, "speaker", True, "Talks → OUTPUT", sage)
            return True
        if focus == "rule" or focus == "say":
            rows = [("Does it TAKE from me?", "INPUT", coral, coral_soft),
                    ("Does it GIVE to me?", "OUTPUT", sage, sage_soft)]
            if focus == "say":
                rows = [("TAKES  =", "INPUT", coral, coral_soft), ("GIVES  =", "OUTPUT", sage, sage_soft)]
            for i, (q, ans, col, soft) in enumerate(rows):
                a = stagger(progress, i, step=0.25)
                if a <= 0:
                    continue
                y = 290 + i * 250 + int((1 - a) * 40)
                shadow_card(draw, (260, y, w - 260, y + 200), brand, radius=36)
                draw.rounded_rectangle((260, y, 300, y + 200), radius=20, fill=col)
                draw.text((360, y + 64), q, fill=ink, font=load_font(56, bold=True))
                pill(draw, 0, y + 58, ans, col, size=46, left=w - 640)
            if focus == "say":
                text_at(draw, "Say it out loud!", cx, 800, load_font(36, bold=True), muted)
            return True

    if visual == "a3-both":
        if focus == "intro":
            glow = int(250 + 10 * pulse)
            draw.ellipse((cx - glow, 560 - glow, cx + glow, 560 + glow), fill=(237, 232, 252))
            draw_device(draw, "touch", cx, 560, 1.35 * (0.9 + 0.1 * appear), brand)
            pill(draw, cx, 250, "Extra clever!", BOTH_COLOR, size=40)
            return True
        if focus in ("touch", "show", "both"):
            tx = 600
            draw.ellipse((tx - 250, 560 - 250, tx + 250, 560 + 250),
                         fill={"touch": coral_soft, "show": sage_soft, "both": (237, 232, 252)}[focus])
            draw_device(draw, "touch", tx, 560, 1.35, brand,
                        t=progress if focus in ("touch", "both") else 0.0, lit=True)
            x = 980
            if focus == "touch":
                draw.text((x, 320), "You TAP it", fill=ink, font=load_font(76, bold=True))
                pill(draw, 0, 440, "INPUT", coral, size=36, left=x)
                draw.text((x, 560), "Your touch goes IN", fill=ink, font=load_font(42, bold=True))
                a = stagger(progress, 2)
                draw_arrow(draw, x, 690, x + 80 + 260 * a, 690, coral, width=12, head=34)
                draw_device(draw, "computer", x + 560, 690, 0.45, brand, t=progress)
            elif focus == "show":
                draw.text((x, 320), "It SHOWS you", fill=ink, font=load_font(76, bold=True))
                pill(draw, 0, 440, "OUTPUT", sage, size=36, left=x)
                draw.text((x, 560), "Pictures & games come OUT", fill=ink, font=load_font(42, bold=True))
                for i in range(3):
                    a = stagger(progress, i + 1)
                    if a > 0:
                        draw_star(draw, 820 + i * 40, 330 + i * 70, 22 * a, [coral, sage, BOTH_COLOR][i], rot=progress * 3)
            else:
                draw.text((x, 300), "Touchscreen", fill=ink, font=load_font(76, bold=True))
                a1, a2, a3 = stagger(progress, 0, 0.2), stagger(progress, 1, 0.2), stagger(progress, 2, 0.2)
                if a1 > 0:
                    pill(draw, 0, 430, "INPUT", coral, size=36, left=x)
                if a2 > 0:
                    text_at(draw, "+", x + 260, 432, load_font(56, bold=True), ink)
                    pill(draw, 0, 430, "OUTPUT", sage, size=36, left=x + 320)
                if a3 > 0:
                    text_at(draw, "=", x + 90, 560, load_font(64, bold=True), ink)
                    pill(draw, 0, 548, "BOTH", BOTH_COLOR, size=56 + int(4 * pulse), left=x + 170)
            return True
        # headset
        draw.ellipse((600 - 250, 560 - 250, 600 + 250, 560 + 250), fill=(237, 232, 252))
        draw_device(draw, "headset", 600, 540, 1.5, brand)
        sound_waves(draw, 600 - 100 * 1.5 - 20, 540, 0.9, sage, progress, "left")
        x = 980
        draw.text((x, 290), "Headset with mic", fill=ink, font=load_font(64, bold=True))
        rows = [("Mic → your voice IN", "INPUT", coral), ("Earphones → sound OUT", "OUTPUT", sage)]
        for i, (txt, lab, col) in enumerate(rows):
            a = stagger(progress, i + 1, step=0.18)
            if a <= 0:
                continue
            y = 410 + i * 120
            draw.text((x, y + 8), txt, fill=ink, font=load_font(38, bold=True))
            pill(draw, 0, y, lab, col, size=28, left=x + 560)
        a = stagger(progress, 3, step=0.18)
        if a > 0:
            pill(draw, 0, 680, "=  BOTH", BOTH_COLOR, size=44, left=x)
        return True

    if visual == "a3-sort":
        bins = {
            "IN": ((150, 640, 700, 860), coral, coral_soft, "INPUT"),
            "BOTH": ((790, 700, 1130, 860), BOTH_COLOR, (237, 232, 252), "BOTH"),
            "OUT": ((1220, 640, 1770, 860), sage, sage_soft, "OUTPUT"),
        }
        base = focus[:-2] if focus.endswith("-q") else focus
        idx = next((i for i, (k, _) in enumerate(SORT_ORDER) if k == base), None)
        asking = focus.endswith("-q")
        if focus == "done":
            done_count = len(SORT_ORDER)
        elif idx is None:
            done_count = 0
        else:
            done_count = idx + (1 if (not asking and progress > 0.75) else 0)
        target = SORT_ORDER[idx][1] if (idx is not None and not asking) else None
        for key, (box, col, soft, label) in bins.items():
            hot = target == key
            x0, y0, x1, y1 = box
            draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=30, fill=(222, 212, 198))
            draw.rounded_rectangle(box, radius=30, fill=soft, outline=col, width=10 if hot else 5)
            pill(draw, (x0 + x1) / 2, y0 - 30, label, col, size=28)
            items = [k for i, (k, b) in enumerate(SORT_ORDER[:done_count]) if b == key]
            for j, k in enumerate(items):
                ix = x0 + 40 + (j % 3) * ((x1 - x0 - 80) / 3) + (x1 - x0 - 80) / 6 if key != "BOTH" else (x0 + x1) / 2
                draw_device(draw, k, ix, y0 + 110, 0.28, brand)
                text_at(draw, DEVICE_NAMES[k], ix, y0 + 170, load_font(20, bold=True), ink)
        if focus == "intro":
            text_at(draw, "Input, output, or BOTH?", cx, 290, load_font(64, bold=True), ink)
            text_at(draw, "Shout your answer!", cx, 390, load_font(40, bold=True), coral)
            draw_mascot(draw, int(cx), 520, 70, sage, panel, bounce)
            return True
        if focus == "done":
            text_at(draw, "7 out of 7!", cx, 290, load_font(80, bold=True), coral)
            text_at(draw, "Big clap for you, champ!", cx, 400, load_font(44, bold=True), ink)
            for i in range(6):
                side = -1 if i % 2 == 0 else 1
                sx = cx + side * (460 + 70 * (i // 2))
                sy = 300 + 70 * (i // 2) + 14 * math.sin(progress * 8 + i)
                draw_star(draw, sx, sy, 20 + 6 * pulse, [coral, sage, BOTH_COLOR][i % 3], rot=progress * 3 + i)
            return True
        if idx is None:
            return True
        kind, dest = SORT_ORDER[idx]
        text_at(draw, f"{idx + 1} of {len(SORT_ORDER)}", cx, 228, load_font(26, bold=True), muted)
        if asking:
            y = 260 + int((1 - appear) * 30)
            shadow_card(draw, (cx - 230, y, cx + 230, y + 330), brand, radius=32, outline=ink, outline_w=4)
            draw_device(draw, kind, cx, y + 150, 0.72, brand, t=progress)
            text_at(draw, DEVICE_NAMES[kind], cx, y + 262, load_font(38, bold=True), ink)
            r = int(44 + 6 * pulse)
            draw.ellipse((cx + 200 - r, y - 10 - r, cx + 200 + r, y - 10 + r), fill=coral)
            text_at(draw, "?", cx + 200, y - 44, load_font(60, bold=True), panel)
            return True
        box, col, _soft, label = bins[dest]
        p = ease_in_out(clamp01((progress - 0.12) / 0.6))
        tx, ty = (box[0] + box[2]) / 2, box[1] + 60
        x = cx + (tx - cx) * p
        y = 425 + (ty - 425) * p - math.sin(p * math.pi) * 90
        s = 0.72 - 0.4 * p
        if progress <= 0.75:
            draw.rounded_rectangle((x - 230 * (1 - 0.6 * p), y - 165 * (1 - 0.6 * p),
                                    x + 230 * (1 - 0.6 * p), y + 165 * (1 - 0.6 * p)),
                                   radius=30, fill=panel, outline=col, width=5)
            draw_device(draw, kind, x, y - 15 * (1 - p), s, brand, t=progress)
        a = stagger(progress, 0)
        pill(draw, cx, 250 + int((1 - a) * 20) + 20, f"{DEVICE_NAMES[kind]}  →  {label}", col, size=40)
        if progress > 0.75:
            draw_check(draw, tx + (box[2] - box[0]) / 2 - 40, box[1] + 10, 30, col)
        return True

    if visual == "a3-story":
        yx, nx, ly = 470, w - 470, 500
        you_on = focus in ("you", "back")
        nani_on = focus in ("nani", "back")
        for x, who, on, col in ((yx, "kid", you_on, coral), (nx, "nani", nani_on, sage)):
            if on:
                draw.ellipse((x - 270, ly - 230, x + 270, ly + 230), fill=coral_soft if col == coral else sage_soft)
            draw_device(draw, "laptop", x, ly, 1.15, brand, t=progress if on else 0.0,
                        face="nani" if who == "kid" else "kid")
            text_at(draw, "You" if who == "kid" else "Nani", x, ly + 150, load_font(40, bold=True), ink)
        draw_dashed(draw, yx + 260, ly - 20, nx - 260, ly - 20, muted, width=6, phase=progress * 160)
        text_at(draw, "internet", cx, ly - 80, load_font(28, bold=True), muted)
        if focus == "intro":
            pill(draw, cx, 250, "Video call with Nani", ink, size=40)
            return True
        if focus in ("you", "back"):
            draw_device(draw, "mic", yx - 330, ly + 60, 0.45, brand)
            pill(draw, yx, ly + 220, "camera + mic = INPUT", coral, size=30)
        if focus == "process" or focus == "back":
            direction = 1 if focus == "process" else -1
            for i in range(4):
                p = (progress * 1.2 + i / 4) % 1.0
                if direction < 0:
                    p = 1 - p
                px = yx + 260 + (nx - yx - 520) * p
                draw.ellipse((px - 16, ly - 36, px + 16, ly - 4), fill=sage if direction > 0 else coral)
            if focus == "process":
                pill(draw, cx, ly + 90, "PROCESS", ink, size=34)
        if focus in ("nani", "back"):
            draw_device(draw, "speaker", nx + 330, ly + 40, 0.45, brand, t=progress)
            pill(draw, nx, ly + 220, "screen + speaker = OUTPUT", sage, size=30)
        if focus == "back":
            pill(draw, cx, 250, "Same trip back!", BOTH_COLOR, size=40)
        return True

    if visual == "a3-home":
        if focus == "intro":
            hx0, hx1, hy0, hy1 = cx - 340, cx + 340, 470, 850
            draw.polygon([(hx0 - 50, hy0), (cx, 260), (hx1 + 50, hy0)], fill=coral)
            draw.rounded_rectangle((hx0, hy0, hx1, hy1), radius=20, fill=panel, outline=ink, width=5)
            draw_device(draw, "tv", cx - 150, 640, 0.55, brand, t=progress)
            draw_device(draw, "remote", cx + 180, 660, 0.55, brand)
            mx = cx + 440 + 20 * math.sin(progress * math.pi * 4)
            my = 420 + 14 * math.cos(progress * math.pi * 4)
            draw.ellipse((mx - 70, my - 70, mx + 70, my + 70), outline=ink, width=14)
            draw.ellipse((mx - 56, my - 56, mx + 56, my + 56), fill=(225, 240, 250))
            draw.line((mx + 48, my + 48, mx + 120, my + 120), fill=ink, width=22)
            text_at(draw, "Device detective!", 380, 330, load_font(52, bold=True), ink)
            return True
        if focus == "think":
            r = int(170 + 14 * pulse)
            draw.ellipse((cx - r, 520 - r, cx + r, 520 + r), fill=coral_soft, outline=coral, width=6)
            text_at(draw, "YOUR TURN", cx, 430, load_font(52, bold=True), coral)
            pill(draw, cx - 190, 510, "1 INPUT", coral, size=30)
            pill(draw, cx + 170, 510, "1 OUTPUT", sage, size=30)
            text_at(draw, "Point to them!", cx, 600, load_font(34, bold=True), ink)
            return True
        if focus == "tv":
            for i, (x0, kind, lab, col, txt) in enumerate(((180, "remote", "INPUT", coral, "You press buttons"),
                                                            (w - 880, "tv", "OUTPUT", sage, "It shows the cartoon"))):
                a = stagger(progress, i, step=0.25)
                if a <= 0:
                    continue
                y = 260 + int((1 - a) * 40)
                shadow_card(draw, (x0, y, x0 + 700, y + 600), brand, radius=36, accent=col)
                draw_device(draw, kind, x0 + 350, y + 250, 1.0 if kind == "remote" else 1.1, brand, t=progress)
                text_at(draw, DEVICE_NAMES[kind], x0 + 350, y + 420, load_font(44, bold=True), ink)
                text_at(draw, txt, x0 + 350, y + 480, load_font(30), muted)
                pill(draw, x0 + 350, y + 530, lab, col, size=28)
            if progress > 0.35:
                draw_dashed(draw, 900, 450, w - 900, 450, coral, width=8, phase=progress * 240)
            return True
        draw_mascot(draw, int(cx), 420, 110, sage, panel, bounce)
        text_at(draw, "Great detective work!", cx, 590, load_font(52, bold=True), ink)
        for i in range(5):
            draw_star(draw, cx - 400 + i * 200, 720 + 16 * math.sin(progress * 6 + i), 26,
                      [coral, sage, BOTH_COLOR][i % 3], rot=progress * 2)
        return True

    if visual == "a3-check":
        if focus == "intro":
            text_at(draw, "Practice check", cx, 380, load_font(44, bold=True), coral)
            text_at(draw, "Same kind of question as your lesson quiz", cx, 470, load_font(38, bold=True), ink)
            return True
        shadow_card(draw, (180, 260, 820, 860), brand, radius=36)
        draw_device(draw, "speaker", 480, 540, 1.3, brand, t=progress if focus != "ask" else 0.0)
        text_at(draw, "Speaker", 500, 740, load_font(44, bold=True), ink)
        x = 920
        draw.text((x, 280), "Is a speaker…", fill=muted, font=load_font(38, bold=True))
        answered = focus == "answer"
        for i, (lab, col) in enumerate((("INPUT", coral), ("OUTPUT", sage))):
            bx0 = x + i * 450
            box = (bx0, 360, bx0 + 400, 480)
            chosen = answered and lab == "OUTPUT"
            faded = answered and lab == "INPUT"
            draw.rounded_rectangle((box[0] + 8, box[1] + 10, box[2] + 8, box[3] + 10), radius=28, fill=(222, 212, 198))
            draw.rounded_rectangle(box, radius=28, fill=col if chosen else panel,
                                   outline=line if faded else col, width=6)
            text_at(draw, lab, (box[0] + box[2]) / 2, 392, load_font(48, bold=True),
                    panel if chosen else (muted if faded else col))
            if chosen:
                draw_check(draw, box[2] - 10, box[1] - 10, 32, ink)
        if focus == "ask":
            text_at(draw, "Think… then choose!", x + 425, 600, load_font(40, bold=True), coral if pulse > 0.5 else ink)
        elif focus == "hint":
            draw.text((x, 560), "TAKES from you  →  INPUT", fill=coral, font=load_font(40, bold=True))
            draw.text((x, 640), "GIVES to you  →  OUTPUT", fill=sage, font=load_font(40, bold=True))
        else:
            draw.text((x, 580), "It GIVES sound out to you.", fill=ink, font=load_font(44, bold=True))
            draw.text((x, 650), "So a speaker is OUTPUT.", fill=sage, font=load_font(44, bold=True))
        return True

    if visual == "a3-recap":
        if focus in ("in", "out", "both"):
            spec = {
                "in": ("INPUT devices", "bring information IN", coral, ["keyboard", "mouse", "mic", "camera"], 400),
                "out": ("OUTPUT devices", "send information OUT", sage, ["screen", "speaker", "printer"], 480),
                "both": ("BOTH jobs", "take in AND give out", BOTH_COLOR, ["touch", "headset"], 560),
            }[focus]
            title, sub, col, kinds, gap = spec
            shadow_card(draw, (140, 240 + lift, w - 140, 860 + lift), brand, radius=40, accent=col)
            text_at(draw, title, cx, 300 + lift, load_font(64, bold=True), col)
            text_at(draw, sub, cx, 390 + lift, load_font(36, bold=True), ink)
            xs = row_xs(len(kinds), w, gap)
            for i, (k, x) in enumerate(zip(kinds, xs)):
                a = stagger(progress, i + 1)
                if a <= 0:
                    continue
                draw_device(draw, k, x, 600 + int((1 - a) * 40), 0.55, brand, t=progress)
                text_at(draw, DEVICE_NAMES[k], x, 740, load_font(32, bold=True), ink)
            return True
        if focus == "rule":
            for i, (q, ans, col) in enumerate((("TAKES from you", "INPUT", coral), ("GIVES to you", "OUTPUT", sage))):
                a = stagger(progress, i, step=0.25)
                if a <= 0:
                    continue
                y = 300 + i * 240 + int((1 - a) * 40)
                shadow_card(draw, (300, y, w - 300, y + 190), brand, radius=36)
                draw.rounded_rectangle((300, y, 340, y + 190), radius=20, fill=col)
                draw.text((400, y + 60), q, fill=ink, font=load_font(56, bold=True))
                pill(draw, 0, y + 54, ans, col, size=44, left=w - 700)
            return True
        if focus == "done":
            draw_mascot(draw, int(cx), 400, 110, sage, panel, bounce)
            text_at(draw, "Chapter 3 complete!", cx, 570, load_font(60, bold=True), ink)
            pill(draw, cx, 670, "Input & Output Devices", coral, size=34)
            for i in range(8):
                side = -1 if i % 2 == 0 else 1
                sx = cx + side * (420 + 80 * ((i // 2) % 2))
                sy = 300 + 110 * (i // 2) + 14 * math.sin(progress * 8 + i)
                draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, BOTH_COLOR][i % 3], rot=progress * 3 + i)
            return True
        text_at(draw, "Next up: Quiz time", cx, 380, load_font(60, bold=True), coral)
        text_at(draw, "Tap Finish when you're ready, champ!", cx, 490, load_font(40, bold=True), ink)
        draw_mascot(draw, int(cx), 680, 80, sage, panel, bounce)
        return True

    return False


# ---------------------------------------------------------------------------
# A4 · How Websites Talk to Each Other — network kit + scenes
# ---------------------------------------------------------------------------

ROAD = (72, 118, 214)
ROAD_SOFT = (226, 234, 250)
SHADOW = (206, 197, 184)
LED_ON = (80, 220, 160)


def qbez(p0, p1, p2, t: float) -> tuple[float, float]:
    u = 1 - t
    return (u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
            u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])


def draw_curve(draw, p0, p1, p2, color, width: int = 8, dashed: bool = False, phase: float = 0.0) -> None:
    pts = [qbez(p0, p1, p2, i / 80) for i in range(81)]
    if not dashed:
        draw.line(pts, fill=color, width=width, joint="curve")
        return
    off = int(phase) % 4
    for i in range(80):
        if ((i + off) // 2) % 2 == 0:
            draw.line((pts[i], pts[i + 1]), fill=color, width=width)


def draw_server(draw, cx: float, cy: float, s: float, t: float = 0.0) -> None:
    def S(v: float) -> float:
        return v * s
    x0, y0, x1, y1 = cx - S(80), cy - S(130), cx + S(80), cy + S(130)
    draw.rounded_rectangle((x0 + S(8), y0 + S(10), x1 + S(8), y1 + S(10)), radius=S(18), fill=SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(18), fill=DEV_DARK)
    for i in range(3):
        uy = y0 + S(22) + i * S(78)
        draw.rounded_rectangle((x0 + S(16), uy, x1 - S(16), uy + S(58)), radius=S(10), fill=DEV_MID)
        for j in range(3):
            lx = x0 + S(36) + j * S(22)
            on = (int(t * 14 + i * 2 + j * 3) % 4 != 0) if t > 0 else j == 0
            draw.ellipse((lx - S(6), uy + S(23), lx + S(6), uy + S(35)), fill=LED_ON if on else DEV_DEEP)
        draw.rounded_rectangle((x1 - S(70), uy + S(24), x1 - S(28), uy + S(34)), radius=S(4), fill=DEV_DEEP)


def draw_router(draw, cx: float, cy: float, s: float, t: float = 0.0) -> None:
    def S(v: float) -> float:
        return v * s
    for sx in (-1, 1):
        draw.line((cx + sx * S(78), cy - S(20), cx + sx * S(98), cy - S(112)), fill=DEV_DARK, width=max(2, int(S(10))))
        draw.ellipse((cx + sx * S(98) - S(9), cy - S(121), cx + sx * S(98) + S(9), cy - S(103)), fill=DEV_DARK)
    draw.rounded_rectangle((cx - S(124) + S(6), cy - S(34) + S(8), cx + S(124) + S(6), cy + S(40) + S(8)),
                           radius=S(20), fill=SHADOW)
    draw.rounded_rectangle((cx - S(124), cy - S(34), cx + S(124), cy + S(40)), radius=S(20), fill=DEV_DARK)
    for j in range(4):
        on = (int(t * 10 + j) % 3 != 0) if t > 0 else True
        lx = cx - S(70) + j * S(34)
        draw.ellipse((lx - S(7), cy - S(4), lx + S(7), cy + S(10)), fill=LED_ON if on else DEV_DEEP)
    count = (1 + int(t * 5) % 3) if t > 0 else 3
    for i in range(count):
        r = S(46) + i * S(36)
        draw.arc((cx - r, cy - S(60) - r, cx + r, cy - S(60) + r), 228, 312, fill=ROAD, width=max(3, int(S(10))))


def draw_tower(draw, cx: float, cy: float, s: float, t: float = 0.0) -> None:
    def S(v: float) -> float:
        return v * s
    top_y, base_y = cy - S(170), cy + S(140)
    half_base = S(90)

    def half_at(y: float) -> float:
        return half_base * (y - top_y) / (base_y - top_y)

    draw.line([(cx - half_base, base_y), (cx, top_y), (cx + half_base, base_y)], fill=DEV_DARK,
              width=max(3, int(S(11))), joint="curve")
    levels = [top_y + (base_y - top_y) * k / 5 for k in range(1, 6)]
    for k, y in enumerate(levels):
        h = half_at(y)
        draw.line((cx - h, y, cx + h, y), fill=DEV_DARK, width=max(2, int(S(6))))
        if k > 0:
            py = levels[k - 1]
            ph = half_at(py)
            draw.line((cx - ph, py, cx + h, y), fill=DEV_MID, width=max(2, int(S(4))))
            draw.line((cx + ph, py, cx - h, y), fill=DEV_MID, width=max(2, int(S(4))))
    draw.ellipse((cx - S(16), top_y - S(16), cx + S(16), top_y + S(16)), fill=hex_rgb("#FF6A1A"))
    shift = (t * 2.5) % 1.0 if t > 0 else 0.4
    for i in range(3):
        r = S(40) + (i + shift) * S(36)
        for a0, a1 in ((-38, 38), (142, 218)):
            draw.arc((cx - r, top_y - r, cx + r, top_y + r), a0, a1, fill=ROAD, width=max(3, int(S(8))))


def draw_browser(draw, cx: float, cy: float, s: float, brand: dict[str, str], url: str = "www.mentr.com",
                 typed: float = 1.0, content: float = 1.0, t: float = 0.0, blank_q: bool = False) -> None:
    def S(v: float) -> float:
        return v * s
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    line = hex_rgb(brand["line"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    W, H = S(320), S(215)
    x0, y0, x1, y1 = cx - W, cy - H, cx + W, cy + H
    bar = (241, 236, 229)
    draw.rounded_rectangle((x0 + S(10), y0 + S(12), x1 + S(10), y1 + S(12)), radius=S(24), fill=SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(24), fill=panel, outline=ink, width=max(2, int(S(5))))
    draw.rounded_rectangle((x0 + S(4), y0 + S(4), x1 - S(4), y0 + S(80)), radius=S(20), fill=bar)
    draw.rectangle((x0 + S(4), y0 + S(50), x1 - S(4), y0 + S(80)), fill=bar)
    draw.line((x0 + S(3), y0 + S(80), x1 - S(3), y0 + S(80)), fill=line, width=max(2, int(S(3))))
    for i, col in enumerate((coral, (255, 190, 70), sage)):
        dx = x0 + S(34) + i * S(28)
        draw.ellipse((dx - S(9), y0 + S(33), dx + S(9), y0 + S(51)), fill=col)
    ux0 = x0 + S(130)
    draw.rounded_rectangle((ux0, y0 + S(18), x1 - S(28), y0 + S(64)), radius=S(23), fill=panel, outline=line,
                           width=max(1, int(S(3))))
    draw.ellipse((ux0 + S(14), y0 + S(32), ux0 + S(32), y0 + S(50)), fill=sage)
    font = load_font(max(10, int(S(26))), bold=True)
    shown = url[: int(round(len(url) * clamp01(typed)))]
    tx, ty = ux0 + S(44), y0 + S(26)
    draw.text((tx, ty), shown, fill=ink, font=font)
    if typed < 1.0 or (t > 0 and content <= 0):
        bb = draw.textbbox((tx, ty), shown or "|", font=font)
        cx_cur = bb[2] + S(4) if shown else tx
        if int(t * 6) % 2 == 0 or typed < 1.0:
            draw.line((cx_cur, y0 + S(28), cx_cur, y0 + S(56)), fill=coral, width=max(2, int(S(4))))
    if blank_q:
        text_at(draw, "?", cx, y0 + S(170), load_font(max(12, int(S(130))), bold=True), line)
        return
    c = clamp01(content)
    if c <= 0:
        return
    if c > 0.0:
        draw.rounded_rectangle((x0 + S(28), y0 + S(100), x1 - S(28), y0 + S(210)), radius=S(16),
                               fill=hex_rgb(brand["coralSoft"]))
        draw.ellipse((x0 + S(50), y0 + S(118), x0 + S(124), y0 + S(192)), fill=sage)
        draw.ellipse((x0 + S(68), y0 + S(142), x0 + S(80), y0 + S(154)), fill=panel)
        draw.ellipse((x0 + S(94), y0 + S(142), x0 + S(106), y0 + S(154)), fill=panel)
        draw.rounded_rectangle((x0 + S(150), y0 + S(128), x0 + S(430), y0 + S(146)), radius=S(9), fill=ink)
        draw.rounded_rectangle((x0 + S(150), y0 + S(162), x0 + S(360), y0 + S(176)), radius=S(7), fill=DEV_MID)
    for i, col in enumerate((coral, sage, BOTH_COLOR)):
        if c > 0.25 + i * 0.15:
            bw = (2 * W - S(56) - S(40)) / 3
            bx = x0 + S(28) + i * (bw + S(20))
            draw.rounded_rectangle((bx, y0 + S(230), bx + bw, y0 + S(320)), radius=S(14), fill=col)
    if c > 0.8:
        draw.rounded_rectangle((x0 + S(28), y0 + S(344), x1 - S(120), y0 + S(360)), radius=S(8), fill=line)
        draw.rounded_rectangle((x0 + S(28), y0 + S(374), x1 - S(240), y0 + S(390)), radius=S(8), fill=line)


def draw_shop(draw, cx: float, cy: float, s: float, brand: dict[str, str], name: str = "TOY SHOP") -> None:
    def S(v: float) -> float:
        return v * s
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    bx0, by0, bx1, by1 = cx - S(200), cy - S(90), cx + S(200), cy + S(170)
    draw.rounded_rectangle((bx0 + S(10), by0 + S(12), bx1 + S(10), by1 + S(12)), radius=S(12), fill=SHADOW)
    draw.rounded_rectangle((bx0, by0, bx1, by1), radius=S(12), fill=panel, outline=ink, width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(170), cy - S(196), cx + S(170), cy - S(122)), radius=S(14), fill=ink)
    text_at(draw, name, cx, cy - S(182), load_font(max(10, int(S(40))), bold=True), panel)
    stripes = 8
    sw = (2 * S(220)) / stripes
    ax0 = cx - S(220)
    for i in range(stripes):
        col = coral if i % 2 == 0 else panel
        draw.rectangle((ax0 + i * sw, cy - S(118), ax0 + (i + 1) * sw, cy - S(70)), fill=col)
        draw.chord((ax0 + i * sw, cy - S(96), ax0 + (i + 1) * sw, cy - S(48)), 0, 180, fill=col)
    draw.line((ax0, cy - S(118), ax0 + 2 * S(220), cy - S(118)), fill=ink, width=max(2, int(S(4))))
    draw.rectangle((cx - S(172), cy - S(24), cx - S(24), cy + S(96)), fill=DEV_SCREEN, outline=ink, width=max(2, int(S(4))))
    for i, col in enumerate((coral, sage, BOTH_COLOR)):
        tx = cx - S(146) + i * S(46)
        draw.ellipse((tx, cy + S(50), tx + S(34), cy + S(84)), fill=col)
    draw.rectangle((cx + S(36), cy - S(24), cx + S(156), cy + S(170)), fill=sage, outline=ink, width=max(2, int(S(4))))
    draw.ellipse((cx + S(130), cy + S(70), cx + S(144), cy + S(84)), fill=panel)


def draw_house(draw, cx: float, cy: float, s: float, brand: dict[str, str]) -> None:
    def S(v: float) -> float:
        return v * s
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    draw.rectangle((cx - S(170) + S(10), cy - S(40) + S(12), cx + S(170) + S(10), cy + S(170) + S(12)), fill=SHADOW)
    draw.rectangle((cx - S(170), cy - S(40), cx + S(170), cy + S(170)), fill=panel, outline=ink, width=max(2, int(S(5))))
    draw.polygon([(cx - S(215), cy - S(36)), (cx, cy - S(200)), (cx + S(215), cy - S(36))], fill=coral)
    draw.rectangle((cx + S(100), cy - S(170), cx + S(140), cy - S(100)), fill=DEV_DARK)
    draw.rectangle((cx - S(38), cy + S(50), cx + S(38), cy + S(170)), fill=sage, outline=ink, width=max(2, int(S(4))))
    for wx in (cx - S(130), cx + S(66)):
        draw.rectangle((wx, cy + S(4), wx + S(64), cy + S(64)), fill=DEV_SCREEN, outline=ink, width=max(2, int(S(4))))
        draw.line((wx + S(32), cy + S(4), wx + S(32), cy + S(64)), fill=ink, width=max(1, int(S(3))))


def draw_envelope(draw, cx: float, cy: float, s: float, color, panel=(255, 255, 255)) -> None:
    def S(v: float) -> float:
        return v * s
    w, h = S(70), S(46)
    draw.rounded_rectangle((cx - w + S(5), cy - h + S(6), cx + w + S(5), cy + h + S(6)), radius=S(8), fill=SHADOW)
    draw.rounded_rectangle((cx - w, cy - h, cx + w, cy + h), radius=S(8), fill=panel, outline=color,
                           width=max(2, int(S(6))))
    draw.line([(cx - w + S(4), cy - h + S(4)), (cx, cy + S(8)), (cx + w - S(4), cy - h + S(4))], fill=color,
              width=max(2, int(S(6))), joint="curve")


def draw_page(draw, cx: float, cy: float, s: float, brand: dict[str, str]) -> None:
    def S(v: float) -> float:
        return v * s
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    w, h = S(60), S(78)
    pts = [(cx - w, cy - h), (cx + w - S(24), cy - h), (cx + w, cy - h + S(24)), (cx + w, cy + h), (cx - w, cy + h)]
    draw.polygon([(x + S(5), y + S(6)) for x, y in pts], fill=SHADOW)
    draw.polygon(pts, fill=panel, outline=ink, width=max(2, int(S(5))))
    draw.rectangle((cx - w + S(14), cy - h + S(18), cx + w - S(30), cy - S(10)), fill=hex_rgb(brand["sageSoft"]))
    draw.ellipse((cx - w + S(22), cy - h + S(26), cx - w + S(46), cy - h + S(50)), fill=coral)
    draw.polygon([(cx - w + S(14), cy - S(10)), (cx - S(10), cy - S(46)), (cx + S(14), cy - S(10))], fill=sage)
    for i in range(3):
        ly = cy + S(12) + i * S(20)
        draw.rounded_rectangle((cx - w + S(14), ly, cx + w - S(14) - i * S(18), ly + S(9)), radius=S(4), fill=DEV_MID)


def draw_stopwatch(draw, cx: float, cy: float, r: float, t: float, brand: dict[str, str]) -> None:
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    draw.rounded_rectangle((cx - r * 0.18, cy - r * 1.32, cx + r * 0.18, cy - r * 1.08), radius=r * 0.06, fill=ink)
    draw.ellipse((cx - r + 10, cy - r + 12, cx + r + 10, cy + r + 12), fill=SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=panel, outline=ink, width=max(4, int(r * 0.09)))
    sweep = (t * 360 * 2.2) % 360
    draw.pieslice((cx - r * 0.82, cy - r * 0.82, cx + r * 0.82, cy + r * 0.82), -90, -90 + sweep,
                  fill=hex_rgb(brand["coralSoft"]))
    for k in range(12):
        a = k * math.tau / 12
        draw.line((cx + math.cos(a) * r * 0.72, cy + math.sin(a) * r * 0.72,
                   cx + math.cos(a) * r * 0.84, cy + math.sin(a) * r * 0.84), fill=ink, width=max(2, int(r * 0.04)))
    a = math.radians(sweep - 90)
    draw.line((cx, cy, cx + math.cos(a) * r * 0.7, cy + math.sin(a) * r * 0.7), fill=coral, width=max(3, int(r * 0.07)))
    draw.ellipse((cx - r * 0.08, cy - r * 0.08, cx + r * 0.08, cy + r * 0.08), fill=ink)


def draw_spinner(draw, cx: float, cy: float, r: float, t: float, color) -> None:
    base = (120, 128, 140)
    for i in range(8):
        a = i * math.tau / 8 + t * math.tau * 2.5
        k = i / 7
        col = tuple(int(lerp(base[j], color[j], k)) for j in range(3))
        dr = r * (0.12 + 0.08 * k)
        x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
        draw.ellipse((x - dr, y - dr, x + dr, y + dr), fill=col)


def draw_snail(draw, cx: float, cy: float, s: float, brand: dict[str, str]) -> None:
    def S(v: float) -> float:
        return v * s
    coral = hex_rgb(brand["coral"])
    panel = hex_rgb(brand["panel"])
    ink = hex_rgb(brand["ink"])
    body = (150, 196, 120)
    draw.rounded_rectangle((cx - S(70), cy, cx + S(58), cy + S(26)), radius=S(13), fill=body)
    draw.ellipse((cx + S(34), cy - S(22), cx + S(70), cy + S(14)), fill=body)
    for sx in (S(44), S(60)):
        draw.line((cx + sx, cy - S(16), cx + sx + S(6), cy - S(44)), fill=body, width=max(2, int(S(5))))
        draw.ellipse((cx + sx + S(1), cy - S(52), cx + sx + S(13), cy - S(40)), fill=ink)
    draw.ellipse((cx - S(52), cy - S(62), cx + S(22), cy + S(10)), fill=coral)
    for i, rr in enumerate((S(26), S(15), S(6))):
        draw.arc((cx - S(15) - rr, cy - S(26) - rr, cx - S(15) + rr, cy - S(26) + rr), 0, 300, fill=panel,
                 width=max(2, int(S(5))))


def draw_vtablet(draw, cx: float, cy: float, s: float, brand: dict[str, str], t: float,
                 playing: bool = True, bar: float = 0.5) -> None:
    def S(v: float) -> float:
        return v * s
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    W, H = S(240), S(155)
    draw.rounded_rectangle((cx - W + S(8), cy - H + S(10), cx + W + S(8), cy + H + S(10)), radius=S(28), fill=SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(28), fill=DEV_DARK)
    ix0, iy0, ix1, iy1 = cx - W + S(18), cy - H + S(18), cx + W - S(18), cy + H - S(18)
    if playing:
        draw.rectangle((ix0, iy0, ix1, iy1), fill=DEV_SCREEN)
        draw.ellipse((ix1 - S(90), iy0 + S(20), ix1 - S(40), iy0 + S(70)), fill=coral)
        draw.polygon([(ix0, iy1), (ix0 + S(120), iy0 + S(120)), (ix0 + S(240), iy1)], fill=sage)
        draw.polygon([(ix0 + S(160), iy1), (ix0 + S(300), iy0 + S(140)), (ix1, iy1)], fill=(20, 150, 136))
        hop = abs(math.sin(t * math.pi * 6)) * S(40)
        mx, my = cx - S(20), iy1 - S(70) - hop
        draw.ellipse((mx - S(34), my - S(34), mx + S(34), my + S(34)), fill=BOTH_COLOR)
        draw.ellipse((mx - S(16), my - S(10), mx - S(4), my + S(2)), fill=(255, 255, 255))
        draw.ellipse((mx + S(4), my - S(10), mx + S(16), my + S(2)), fill=(255, 255, 255))
    else:
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(62, 70, 86))
        draw_spinner(draw, cx, cy - S(12), S(46), t, (255, 255, 255))
    by = iy1 - S(16)
    draw.rounded_rectangle((ix0 + S(20), by, ix1 - S(20), by + S(8)), radius=S(4), fill=(200, 205, 215))
    draw.rounded_rectangle((ix0 + S(20), by, ix0 + S(20) + (ix1 - ix0 - S(40)) * clamp01(bar), by + S(8)),
                           radius=S(4), fill=coral)


NET_NODES = [
    (0.06, 0.30), (0.20, 0.10), (0.18, 0.62), (0.34, 0.38), (0.36, 0.86), (0.50, 0.12),
    (0.53, 0.60), (0.66, 0.30), (0.70, 0.84), (0.84, 0.10), (0.86, 0.52), (0.96, 0.84),
]
NET_EDGES = [
    (0, 1), (0, 3), (1, 3), (1, 5), (2, 3), (0, 2), (2, 4), (3, 6), (4, 6), (5, 7), (3, 5),
    (6, 7), (6, 8), (7, 9), (7, 10), (8, 10), (8, 11), (9, 10), (10, 11), (4, 8),
]
NET_ASKERS = {0, 2, 4, 8, 11}
NET_SERVERS = {5, 7, 10}


def draw_network(draw, box: tuple[float, float, float, float], t: float, brand: dict[str, str],
                 grow: float = 1.0, highlight: str | None = None, pulses: bool = True, icon: float = 1.0) -> None:
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    coral_soft = hex_rgb(brand["coralSoft"])
    sage_soft = hex_rgb(brand["sageSoft"])
    x0, y0, x1, y1 = box
    pts = [(x0 + (x1 - x0) * nx, y0 + (y1 - y0) * ny) for nx, ny in NET_NODES]
    edge_col = (214, 204, 190)
    n_edges = int(len(NET_EDGES) * clamp01(grow * 1.3))
    for a, b in NET_EDGES[:n_edges]:
        draw.line((pts[a], pts[b]), fill=edge_col, width=6)
    if pulses and grow >= 0.7:
        for i, (a, b) in enumerate(NET_EDGES):
            p = (t * 1.6 + i * 0.37) % 1.0
            if i % 2:
                a, b = b, a
            col = coral if a in NET_ASKERS or (b in NET_SERVERS and i % 3 == 0) else sage
            px = pts[a][0] + (pts[b][0] - pts[a][0]) * p
            py = pts[a][1] + (pts[b][1] - pts[a][1]) * p
            draw.ellipse((px - 8, py - 8, px + 8, py + 8), fill=col)
    for i, (px, py) in enumerate(pts):
        a = stagger(grow, i, step=0.05, speed=4)
        if a <= 0:
            continue
        sc = icon * (0.7 + 0.3 * a)
        if i in NET_ASKERS:
            if highlight == "asker":
                r = 70 * sc + 6 * math.sin(t * 8 + i)
                draw.ellipse((px - r, py - r, px + r, py + r), fill=coral_soft, outline=coral, width=4)
            draw_device(draw, "touch", px, py, 0.26 * sc, brand)
        elif i in NET_SERVERS:
            if highlight == "server":
                r = 74 * sc + 6 * math.sin(t * 8 + i)
                draw.ellipse((px - r, py - r, px + r, py + r), fill=sage_soft, outline=sage, width=4)
            draw_server(draw, px, py, 0.3 * sc, t)
        else:
            r = 16 * sc
            draw.ellipse((px - r, py - r, px + r, py + r), fill=DEV_MID)
            draw.ellipse((px - r * 0.45, py - r * 0.45, px + r * 0.45, py + r * 0.45), fill=(230, 226, 220))


def draw_road(draw, x0: float, x1: float, y: float, h: float, t: float, faint: bool = False) -> None:
    fill = ROAD_SOFT if faint else (214, 218, 228)
    draw.rounded_rectangle((x0, y - h / 2, x1, y + h / 2), radius=h / 2, fill=fill)
    draw_dashed(draw, x0 + h / 2, y, x1 - h / 2, y, (255, 255, 255), width=6, dash=30, gap=22, phase=t * 260)


def render_a4(draw, brand: dict[str, str], visual: str, focus: str, progress: float, w: int, h: int) -> bool:
    ink = hex_rgb(brand["ink"])
    muted = hex_rgb(brand["muted"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    panel = hex_rgb(brand["panel"])
    line = hex_rgb(brand["line"])
    coral_soft = hex_rgb(brand["coralSoft"])
    sage_soft = hex_rgb(brand["sageSoft"])
    appear = ease_out_cubic(min(1.0, progress * 2.2))
    bounce = int(10 * math.sin(progress * math.pi * 2))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 6)
    lift = int((1 - appear) * 40)
    cx = w / 2

    def stars_around(y: float, spread: float, n: int = 6) -> None:
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 70 * (i // 2))
            sy = y + 80 * (i // 2) + 14 * math.sin(progress * 8 + i)
            draw_star(draw, sx, sy, 20 + 6 * pulse, [coral, sage, BOTH_COLOR][i % 3], rot=progress * 3 + i)

    def trip_move(p: float, x_from: float, x_to: float) -> float:
        return x_from + (x_to - x_from) * ease_in_out(p)

    if visual == "a4-welcome":
        if focus == "hello":
            draw_mascot(draw, int(cx), 420, 110, sage, panel, bounce)
            text_at(draw, "Welcome back, champ!", cx, 590, load_font(52, bold=True), ink)
            pill(draw, cx, 680, "Chapter 4 today", coral, size=32)
            return True
        if focus == "bridge":
            cards = [("CHAPTER 1", "Computers", coral, "computer"), ("CHAPTER 2", "Binary 1 · 0", sage, None),
                     ("CHAPTER 3", "Devices", BOTH_COLOR, "keyboard")]
            for i, (k, v, acc, dev) in enumerate(cards):
                a = stagger(progress, i, step=0.15)
                if a <= 0:
                    continue
                x = 190 + i * 530
                y = 280 + int((1 - a) * 60)
                shadow_card(draw, (x, y, x + 480, y + 330), brand, accent=acc)
                draw.text((x + 40, y + 70), k, fill=acc, font=load_font(28, bold=True))
                draw.text((x + 40, y + 114), v, fill=ink, font=load_font(46, bold=True))
                draw_check(draw, x + 420, y + 88, 24, acc)
                if dev:
                    draw_device(draw, dev, x + 240, y + 250, 0.42, brand)
                else:
                    text_at(draw, "1 0 1 1", x + 240, y + 210, load_font(56, bold=True), sage)
            a = stagger(progress, 4, step=0.14)
            if a > 0:
                pill(draw, cx, 680 + int((1 - a) * 30), "Today → Chapter 4", ink, size=36)
            return True
        if focus == "chapter":
            shadow_card(draw, (260, 250 + lift, w - 260, 540 + lift), brand, radius=40, accent=coral)
            text_at(draw, "CHAPTER 4 OF 5", cx, 312 + lift, load_font(32, bold=True), coral)
            text_at(draw, "How Websites Talk", cx, 370 + lift, load_font(80, bold=True), ink)
            text_at(draw, "to Each Other", cx, 462 + lift, load_font(44, bold=True), muted)
            a = stagger(progress, 2)
            if a > 0:
                draw_device(draw, "touch", 640, 730, 0.5, brand)
                draw_dashed(draw, 720, 730, 1200, 730, ROAD, width=8, phase=progress * 300)
                draw_server(draw, 1280, 730, 0.5, progress)
                draw_envelope(draw, 720 + 480 * ((progress * 1.5) % 1.0), 700, 0.45, coral)
            return True
        if focus == "say":
            words = [("Websites…", coral), ("talk…", ink), ("to each other!", sage)]
            xs = [470, 900, 1400]
            for i, ((wd, col), x) in enumerate(zip(words, xs)):
                a = stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                text_at(draw, wd, x, 420 + int((1 - a) * 40), load_font(int(60 + 14 * a), bold=True), col)
            text_at(draw, "Say it out loud with me!", cx, 620, load_font(36, bold=True), coral)
            return True
        # go
        text_at(draw, "The secret trip of a website", cx, 260, load_font(56, bold=True), ink)
        p0, p1, p2 = (640, 600), (cx, 380), (1280, 600)
        draw_curve(draw, p0, p1, p2, ROAD, width=8, dashed=True, phase=progress * 40)
        draw_device(draw, "touch", 480, 620, 0.9, brand)
        draw_server(draw, 1440, 620, 0.9, progress)
        p = (progress * 1.2) % 1.0
        ex, ey = qbez(p0, p1, p2, p)
        draw_envelope(draw, ex, ey, 0.6, coral)
        px, py = qbez(p0, p1, p2, 1 - ((progress * 1.2 + 0.5) % 1.0))
        draw_page(draw, px, py, 0.5, brand)
        text_at(draw, "You", 480, 790, load_font(34, bold=True), ink)
        text_at(draw, "Far-away computer", 1440, 790, load_font(34, bold=True), ink)
        return True

    if visual == "a4-hook":
        if focus == "ask":
            draw.ellipse((cx - 250 - 260, 570 - 260, cx - 250 + 260, 570 + 260), fill=coral_soft)
            draw_device(draw, "touch", cx - 250, 570, 1.35, brand, t=progress)
            size = int(200 + 20 * pulse)
            text_at(draw, "?", cx + 300, 440, load_font(size, bold=True), coral)
            text_at(draw, "Where does it come from?", cx + 300, 720, load_font(40, bold=True), ink)
            return True
        if focus == "guess":
            draw_device(draw, "touch", cx - 360, 590, 1.2, brand)
            for i, (bx, by, r) in enumerate(((cx - 180, 420, 16), (cx - 120, 370, 24))):
                draw.ellipse((bx - r, by - r, bx + r, by + r), fill=panel, outline=line, width=4)
            bx0, by0, bx1, by1 = cx - 80, 240, cx + 560, 480
            draw.ellipse((bx0 + 10, by0 + 12, bx1 + 10, by1 + 12), fill=SHADOW)
            draw.ellipse((bx0, by0, bx1, by1), fill=panel, outline=line, width=5)
            text_at(draw, "Hiding inside", cx + 240, 310, load_font(48, bold=True), ink)
            text_at(draw, "my tablet?", cx + 240, 372, load_font(48, bold=True), coral)
            n = max(1, 3 - int(progress * 3))
            pill(draw, cx + 240, 620, f"Think…  {n}", coral, size=40)
            return True
        # answer
        for i, (hx, hh, col) in enumerate(((760, 90, (208, 232, 226)), (980, 130, (196, 226, 218)), (1180, 80, (208, 232, 226)))):
            draw.polygon([(hx - 200, 720), (hx, 720 - hh), (hx + 200, 720)], fill=col)
        p0, p1, p2 = (520, 560), (cx, 260), (1400, 560)
        draw_curve(draw, p0, p1, p2, ROAD, width=9, dashed=True, phase=progress * 50)
        draw_device(draw, "touch", 380, 590, 1.0, brand, t=progress)
        a = stagger(progress, 1, step=0.2)
        if a > 0:
            draw.ellipse((1560 - 190, 580 - 190, 1560 + 190, 580 + 190), fill=sage_soft)
            draw_server(draw, 1560, 580, 1.0 * (0.8 + 0.2 * a), progress)
            text_at(draw, "Another computer", 1560, 770, load_font(34, bold=True), ink)
            pp = (progress * 1.1) % 1.0
            px, py = qbez(p0, p1, p2, 1 - pp)
            draw_page(draw, px, py, 0.6, brand)
            pill(draw, cx, 250, "far, far away!", ROAD, size=34)
        return True

    if visual == "a4-net":
        if focus == "intro":
            gx, gy, gr = cx, 560, 300
            draw.ellipse((gx - gr, gy - gr, gx + gr, gy + gr), fill=(232, 243, 240))
            for k in (0.4, 0.75):
                draw.ellipse((gx - gr * k, gy - gr, gx + gr * k, gy + gr), outline=(206, 228, 222), width=4)
            draw.line((gx - gr, gy, gx + gr, gy), fill=(206, 228, 222), width=4)
            draw_network(draw, (220, 270, w - 220, 840), progress, brand, grow=clamp01(progress * 1.4))
            return True
        if focus in ("asker", "server"):
            is_a = focus == "asker"
            col = coral if is_a else sage
            shadow_card(draw, (150, 250 + lift, 760, 860 + lift), brand, radius=36, accent=col)
            text_at(draw, "ASKERS" if is_a else "SERVERS", 455, 310 + lift, load_font(60, bold=True), col)
            text_at(draw, "ask for things" if is_a else "answer, day & night", 455, 390 + lift, load_font(34, bold=True), ink)
            if is_a:
                draw_device(draw, "touch", 330, 600 + lift, 0.62, brand, t=progress)
                draw_device(draw, "laptop", 560, 620 + lift, 0.5, brand, t=progress)
                text_at(draw, "tablet · phone · laptop", 455, 760 + lift, load_font(30), muted)
            else:
                draw.ellipse((455 - 150, 610 + lift - 150, 455 + 150, 610 + lift + 150), fill=sage_soft)
                draw_server(draw, 455, 610 + lift, 0.95, progress)
                text_at(draw, "keep websites ready", 455, 780 + lift, load_font(30), muted)
            draw_network(draw, (860, 290, 1730, 830), progress, brand, grow=1.0, highlight=focus, icon=0.9)
            return True
        if focus == "rule":
            draw_network(draw, (220, 300, w - 220, 840), progress, brand, grow=1.0, icon=1.05)
            pill(draw, cx - 190, 238, "ASK", coral, size=34)
            text_at(draw, "&", cx, 238, load_font(44, bold=True), ink)
            pill(draw, cx + 210, 238, "ANSWER", sage, size=34)
            return True
        a1, a2 = stagger(progress, 0, step=0.3), stagger(progress, 1, step=0.3)
        if a1 > 0:
            pill(draw, cx, 330 + int((1 - a1) * 40), "Ask…", coral, size=70)
        if a2 > 0:
            pill(draw, cx, 520 + int((1 - a2) * 40), "…and answer!", sage, size=70)
        text_at(draw, "Say it with me!", cx, 740, load_font(36, bold=True), muted)
        return True

    if visual == "a4-shop":
        if focus == "intro":
            a = stagger(progress, 0)
            draw_shop(draw, 560, 600 + lift, 1.05, brand)
            pill(draw, 560, 250, "SHOP", coral, size=32)
            b = stagger(progress, 1, step=0.2)
            if b > 0:
                text_at(draw, "=", cx + 30, 520, load_font(110, bold=True), ink)
                draw_browser(draw, 1390, 600 + int((1 - b) * 40), 0.72, brand, content=1.0)
                pill(draw, 1390, 250, "WEBSITE", sage, size=32)
            return True
        if focus == "home":
            draw_house(draw, 560, 600 + lift, 1.1, brand)
            pill(draw, 560, 810, "12, Rose Lane", ink, size=30)
            px, py = 1330, 450 + 12 * math.sin(progress * math.pi * 4)
            draw.ellipse((px - 90, py - 90, px + 90, py + 90), fill=coral)
            draw.polygon([(px - 72, py + 50), (px, py + 190), (px + 72, py + 50)], fill=coral)
            draw.ellipse((px - 38, py - 38, px + 38, py + 38), fill=panel)
            text_at(draw, "An address helps", 1330, 690, load_font(44, bold=True), ink)
            text_at(draw, "people FIND your home", 1330, 750, load_font(44, bold=True), coral)
            return True
        if focus == "url":
            typed = clamp01((progress - 0.1) * 1.8)
            draw_browser(draw, cx, 630, 1.0, brand, typed=typed, content=clamp01((progress - 0.7) * 4), t=progress)
            a = stagger(progress, 1)
            if a > 0:
                pill(draw, cx, 250, "URL  =  website address", coral, size=38)
                draw_arrow(draw, cx + 60, 330, cx + 60, 400, coral, width=10, head=26)
            return True
        if focus == "parts":
            f = load_font(170, bold=True)
            name, end = "mentr", ".com"
            bn = draw.textbbox((0, 0), name, font=f)
            be = draw.textbbox((0, 0), end, font=f)
            wn, we = bn[2] - bn[0], be[2] - be[0]
            x0 = cx - (wn + we) / 2
            draw.text((x0, 300), name, fill=coral, font=f)
            draw.text((x0 + wn, 300), end, fill=sage, font=f)
            a1, a2 = stagger(progress, 1, step=0.25), stagger(progress, 2, step=0.25)
            if a1 > 0:
                draw.rounded_rectangle((x0, 520, x0 + wn, 532), radius=6, fill=coral)
                pill(draw, x0 + wn / 2, 570, "the NAME → which shop", coral, size=30)
            if a2 > 0:
                draw.rounded_rectangle((x0 + wn + 10, 520, x0 + wn + we, 532), radius=6, fill=sage)
                pill(draw, x0 + wn + we / 2, 660, "the ENDING", sage, size=30)
            return True
        pill(draw, cx, 300, "U · R · L", coral, size=96)
        text_at(draw, "= website address", cx, 520, load_font(60, bold=True), ink)
        text_at(draw, "Say it with me!", cx, 680, load_font(36, bold=True), muted)
        return True

    if visual == "a4-roads":
        if focus == "intro":
            draw_road(draw, 500, 1420, 590, 80, progress, faint=True)
            for i in range(6):
                sx = 560 + i * 160
                sy = 520 + 30 * math.sin(progress * 6 + i)
                draw_star(draw, sx, sy, 10 + 4 * pulse, ROAD, rot=progress * 4 + i)
            draw_device(draw, "touch", 330, 590, 0.9, brand)
            draw_server(draw, 1590, 590, 0.9, progress)
            ex = trip_move((progress * 1.1) % 1.0, 540, 1380)
            draw_envelope(draw, ex, 590, 0.55, coral)
            pill(draw, cx, 260, "Invisible roads", ROAD, size=40)
            return True
        if focus in ("wifi", "data"):
            is_wifi = focus == "wifi"
            draw.ellipse((600 - 280, 580 - 280, 600 + 280, 580 + 280), fill=ROAD_SOFT)
            if is_wifi:
                draw_house(draw, 600, 640, 1.2, brand)
                draw_router(draw, 600, 450, 0.75, progress)
            else:
                draw_tower(draw, 640, 590, 1.25, progress)
                draw_device(draw, "touch", 360, 720, 0.45, brand, t=progress)
            x = 1020
            pill(draw, 0, 300, "Wi-Fi" if is_wifi else "Mobile data", ROAD, size=48, left=x)
            lines = (("Comes from a small box", "called a ROUTER", "At home or at school")
                     if is_wifi else ("Travels through", "big TOWERS", "Works outside too!"))
            draw.text((x, 440), lines[0], fill=ink, font=load_font(46, bold=True))
            draw.text((x, 505), lines[1], fill=ROAD, font=load_font(56, bold=True))
            a = stagger(progress, 2)
            if a > 0:
                draw.text((x, 620), lines[2], fill=muted, font=load_font(36))
            return True
        # carry
        draw_road(draw, 330, 1590, 520, 70, progress)
        draw_road(draw, 330, 1590, 680, 70, -progress)
        draw_device(draw, "touch", 200, 600, 0.75, brand)
        draw_server(draw, 1720, 600, 0.8, progress)
        ex = trip_move((progress * 1.2) % 1.0, 380, 1540)
        draw_envelope(draw, ex, 520, 0.5, coral)
        px = trip_move((progress * 1.2 + 0.4) % 1.0, 1540, 380)
        draw_page(draw, px, 680, 0.42, brand)
        pill(draw, 520, 420, "question →", coral, size=28)
        pill(draw, 1400, 760, "← answer", sage, size=28)
        pill(draw, cx, 250, "Roads only CARRY", ink, size=40)
        return True

    if visual == "a4-trip":
        steps = ["Type", "Ask", "Find", "Send back", "Appears"]
        order = {"type": 0, "ask": 1, "find": 2, "reply": 3, "appear": 4}
        cur = order.get(focus, -1 if focus == "intro" else 5)
        for i, lab in enumerate(steps):
            x = cx + (i - 2) * 310
            box = (x - 140, 222, x + 140, 290)
            if i == cur:
                draw.rounded_rectangle(box, radius=34, fill=coral)
                fg, num_bg, num_fg = panel, panel, coral
            elif i < cur:
                draw.rounded_rectangle(box, radius=34, fill=panel, outline=sage, width=4)
                fg, num_bg, num_fg = sage, sage, panel
            else:
                draw.rounded_rectangle(box, radius=34, fill=panel, outline=line, width=3)
                fg, num_bg, num_fg = muted, line, muted
            draw.ellipse((x - 124, 232, x - 76, 280), fill=num_bg)
            text_at(draw, str(i + 1), x - 100, 238, load_font(28, bold=True), num_fg)
            text_at(draw, lab, x + 24, 238, load_font(30, bold=True), fg)
        dev_x, srv_x, road_y = 390, 1560, 640
        if focus == "fast":
            draw_road(draw, 680, 1400, road_y, 64, progress * 3)
            draw_browser(draw, dev_x, 600, 0.76, brand, content=1.0)
            draw_server(draw, srv_x, 600, 0.95, progress)
            pz = (progress * 4) % 1.0
            if pz < 0.5:
                draw_envelope(draw, trip_move(pz * 2, 680, 1340), road_y, 0.4, coral)
            else:
                draw_page(draw, trip_move((pz - 0.5) * 2, 1340, 680), road_y, 0.35, brand)
            draw_stopwatch(draw, cx, 450, 95, progress, brand)
            pill(draw, cx, 790, "less than 1 second!", coral, size=36)
            return True
        draw_road(draw, 680, 1400, road_y, 64, progress if focus in ("ask", "reply") else 0.0)
        text_at(draw, "internet road", 1040, road_y + 50, load_font(24, bold=True), muted)
        typed = 1.0 if cur > 0 else (clamp01(progress * 1.6) if focus == "type" else 0.0)
        content = 0.0
        if focus == "appear":
            content = clamp01((progress - 0.05) * 2.2)
        draw_browser(draw, dev_x, 600, 0.76, brand, typed=typed, content=content, t=progress)
        text_at(draw, "You", dev_x, 790, load_font(32, bold=True), ink)
        if focus == "find":
            draw.ellipse((srv_x - 190, 600 - 190, srv_x + 190, 600 + 190), fill=sage_soft)
        draw_server(draw, srv_x, 600, 0.95, progress if focus in ("find", "ask", "reply") else 0.0)
        text_at(draw, "Server", srv_x, 790, load_font(32, bold=True), ink)
        if focus == "type":
            draw_device(draw, "keyboard", dev_x + 330, 800, 0.42, brand, t=progress)
        elif focus == "ask":
            p = clamp01((progress - 0.08) / 0.7)
            ex = trip_move(p, 680, 1340)
            draw_envelope(draw, ex, road_y - 6, 0.62, coral)
            pill(draw, ex, road_y - 110, "REQUEST", coral, size=26)
            bx0, by0 = 560, 330
            draw.rounded_rectangle((bx0, by0, bx0 + 560, by0 + 90), radius=30, fill=panel, outline=coral, width=4)
            draw.polygon([(bx0 + 60, by0 + 88), (bx0 + 40, by0 + 130), (bx0 + 110, by0 + 88)], fill=coral)
            text_at(draw, "Please send me this page!", bx0 + 280, by0 + 24, load_font(34, bold=True), ink)
        elif focus == "find":
            ang = progress * math.tau * 1.5
            mx, my = srv_x + math.cos(ang) * 70, 560 + math.sin(ang) * 50
            draw.ellipse((mx - 46, my - 46, mx + 46, my + 46), outline=ink, width=10)
            draw.ellipse((mx - 36, my - 36, mx + 36, my + 36), fill=(225, 240, 250))
            draw.line((mx + 32, my + 32, mx + 80, my + 80), fill=ink, width=16)
            a = stagger(progress, 3, step=0.12)
            if a > 0:
                draw_page(draw, srv_x - 260, 470 + int((1 - a) * 40), 0.8 * a + 0.01, brand)
                pill(draw, srv_x - 260, 360, "Found it!", sage, size=28)
        elif focus == "reply":
            p = clamp01((progress - 0.08) / 0.7)
            px = trip_move(p, 1340, 680)
            draw_page(draw, px, road_y - 10, 0.55, brand)
            pill(draw, px, road_y - 120, "ANSWER", sage, size=26)
        elif focus == "appear":
            if progress > 0.3:
                stars_around(360, 560, n=4)
                pill(draw, dev_x, 350, "Ta-da!", coral, size=36)
        return True

    if visual == "a4-order":
        cards = {
            "type": ("Type address", "keyboard"),
            "ask": ("Device asks", "envelope"),
            "appear": ("Page appears", "browser"),
        }
        shuffled = ["appear", "type", "ask"]
        correct = ["type", "ask", "appear"]
        slots = [cx - 540, cx, cx + 540]
        for key in correct:
            label, icon = cards[key]
            si = shuffled.index(key)
            ci = correct.index(key)
            if focus == "answer":
                p = ease_in_out(clamp01((progress - 0.1 - ci * 0.12) * 2.2))
            else:
                p = 0.0
            x = slots[si] + (slots[ci] - slots[si]) * p
            hop = math.sin(p * math.pi) * 60
            a = stagger(progress, si, step=0.12) if focus == "intro" else 1.0
            if a <= 0:
                continue
            y0 = 350 - hop + int((1 - a) * 50)
            placed = focus == "answer" and p >= 1
            shadow_card(draw, (x - 220, y0, x + 220, y0 + 400), brand, radius=32,
                        outline=sage if placed else line, outline_w=6 if placed else 3)
            if icon == "keyboard":
                draw_device(draw, "keyboard", x, y0 + 160, 0.8, brand)
            elif icon == "envelope":
                draw_envelope(draw, x, y0 + 160, 1.2, coral)
            else:
                draw_browser(draw, x, y0 + 160, 0.4, brand, content=1.0)
            text_at(draw, label, x, y0 + 300, load_font(40, bold=True), ink)
            if placed:
                draw.ellipse((x - 38, y0 - 38, x + 38, y0 + 38), fill=sage)
                text_at(draw, str(ci + 1), x, y0 - 24, load_font(40, bold=True), panel)
        if focus == "ask":
            for i, x in enumerate(slots):
                r = int(34 + 4 * pulse)
                draw.ellipse((x - r, 350 - r, x + r, 350 + r), fill=coral)
                text_at(draw, "?", x, 326, load_font(44, bold=True), panel)
            n = max(1, 3 - int(progress * 3))
            pill(draw, cx, 240, f"Think…  {n}", coral, size=34)
        elif focus == "intro":
            pill(draw, cx, 240, "Mixed up!", BOTH_COLOR, size=34)
        elif focus == "answer" and progress > 0.75:
            for i in range(2):
                draw_arrow(draw, slots[i] + 232, 550, slots[i + 1] - 232, 550, sage, width=10, head=26)
            pill(draw, cx, 240, "Correct order!", sage, size=34)
        return True

    if visual == "a4-video":
        slow = focus == "slow"
        vx, sx, ry = 620, 1580, 590
        draw_road(draw, 900, 1440, ry, 34 if slow else 64, progress * (0.3 if slow else 2))
        draw_server(draw, sx, ry, 0.95, progress)
        bar = 0.25 + 0.5 * progress if focus == "pieces" else (0.35 if focus == "intro" else 0.52)
        draw_vtablet(draw, vx, ry, 1.05, brand, progress, playing=not slow, bar=bar)
        if focus == "intro":
            pill(draw, vx, 290, "Watching a cartoon", coral, size=34)
        elif focus == "pieces":
            for i in range(4):
                p = (progress * 1.3 + i / 4) % 1.0
                px = trip_move(p, 1440, 900)
                draw.rounded_rectangle((px - 34, ry - 26, px + 34, ry + 26), radius=8, fill=DEV_DARK)
                for j in range(3):
                    draw.rectangle((px - 26 + j * 20, ry - 20, px - 14 + j * 20, ry - 12), fill=panel)
                    draw.rectangle((px - 26 + j * 20, ry + 12, px - 14 + j * 20, ry + 20), fill=panel)
                q = (progress * 1.3 + i / 4 + 0.12) % 1.0
                qx = trip_move(q, 900, 1440)
                draw.ellipse((qx - 10, ry - 70, qx + 10, ry - 50), fill=coral)
            pill(draw, 1170, 420, "next piece, please!", coral, size=26)
            pill(draw, 1170, 720, "here you go!", sage, size=26)
        else:
            px = trip_move(clamp01(progress * 0.8), 1440, 1000)
            draw.rounded_rectangle((px - 30, ry - 22, px + 30, ry + 22), radius=8, fill=DEV_DARK)
            draw_snail(draw, 1180, ry - 60, 0.9, brand)
            pill(draw, vx, 290, "Buffering…", coral, size=34)
        return True

    if visual == "a4-check":
        if focus == "intro":
            text_at(draw, "Practice check", cx, 380, load_font(48, bold=True), coral)
            text_at(draw, "Same kind of question as your lesson quiz", cx, 470, load_font(38, bold=True), ink)
            return True
        shadow_card(draw, (150, 260, 820, 860), brand, radius=36)
        answered = focus == "answer"
        draw_browser(draw, 485, 520, 0.85, brand, content=clamp01(progress * 2) if answered else 0.0,
                     blank_q=not answered, t=progress)
        text_at(draw, "Opening a website…", 485, 760, load_font(34, bold=True), muted)
        x = 920
        draw.text((x, 280), "What happens FIRST?", fill=ink, font=load_font(52, bold=True))
        opts = (("The page appears", coral), ("Your device asks", sage))
        for i, (lab, col) in enumerate(opts):
            box = (x, 380 + i * 140, 1760, 490 + i * 140)
            chosen = answered and i == 1
            faded = answered and i == 0
            draw.rounded_rectangle((box[0] + 8, box[1] + 10, box[2] + 8, box[3] + 10), radius=28, fill=SHADOW)
            draw.rounded_rectangle(box, radius=28, fill=col if chosen else panel,
                                   outline=line if faded else col, width=6)
            draw.text((x + 50, box[1] + 30), lab, fill=panel if chosen else (muted if faded else col),
                      font=load_font(44, bold=True))
            if chosen:
                draw_check(draw, box[2] - 60, (box[1] + box[3]) / 2, 30, panel, bg=sage)
        if focus == "ask":
            text_at(draw, "Think… then choose!", (x + 1760) / 2, 710, load_font(40, bold=True), coral if pulse > 0.5 else ink)
        elif focus == "hint":
            draw.text((x, 690), "Can a server answer", fill=ROAD, font=load_font(40, bold=True))
            draw.text((x, 745), "before anyone asks?", fill=ROAD, font=load_font(40, bold=True))
        else:
            draw.text((x, 700), "1. Device asks   →   2. Page appears", fill=sage, font=load_font(38, bold=True))
        return True

    if visual == "a4-recap":
        if focus in ("net", "url", "roads"):
            spec = {
                "net": ("The INTERNET", "many computers asking & answering", coral),
                "url": ("A WEBSITE", "is like a shop · its address is a URL", sage),
                "roads": ("The ROADS", "Wi-Fi & mobile data carry the messages", ROAD),
            }[focus]
            title, sub, col = spec
            shadow_card(draw, (140, 240 + lift, w - 140, 860 + lift), brand, radius=40, accent=col)
            text_at(draw, title, cx, 300 + lift, load_font(62, bold=True), col)
            text_at(draw, sub, cx, 385 + lift, load_font(36, bold=True), ink)
            if focus == "net":
                draw_network(draw, (360, 470 + lift, w - 360, 800 + lift), progress, brand, icon=0.7)
            elif focus == "url":
                draw_shop(draw, 640, 680 + lift, 0.62, brand)
                text_at(draw, "=", cx, 600 + lift, load_font(90, bold=True), ink)
                draw_browser(draw, 1290, 650 + lift, 0.5, brand, typed=clamp01(progress * 2), t=progress)
            else:
                draw_router(draw, 560, 690 + lift, 0.7, progress)
                draw_road(draw, 740, 1180, 680 + lift, 44, progress)
                draw_tower(draw, 1360, 650 + lift, 0.75, progress)
            return True
        if focus == "steps":
            labels = [("Type address", coral), ("Device asks", ROAD), ("Page appears", sage)]
            for i, (lab, col) in enumerate(labels):
                a = stagger(progress, i, step=0.2)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 560
                y = 380 + int((1 - a) * 40)
                shadow_card(draw, (x - 230, y, x + 230, y + 260), brand, radius=36, accent=col)
                draw.ellipse((x - 40, y + 60, x + 40, y + 140), fill=col)
                text_at(draw, str(i + 1), x, y + 76, load_font(48, bold=True), panel)
                text_at(draw, lab, x, y + 170, load_font(40, bold=True), ink)
                if i < 2 and a >= 1:
                    draw_arrow(draw, x + 240, y + 130, x + 320, y + 130, muted, width=10, head=26)
            return True
        if focus == "done":
            draw_mascot(draw, int(cx), 400, 110, sage, panel, bounce)
            text_at(draw, "Chapter 4 complete!", cx, 570, load_font(60, bold=True), ink)
            pill(draw, cx, 670, "How Websites Talk", coral, size=34)
            stars_around(300, 420, n=8)
            return True
        text_at(draw, "Next up: Quiz time", cx, 380, load_font(60, bold=True), coral)
        text_at(draw, "Tap Finish when you're ready, champ!", cx, 490, load_font(40, bold=True), ink)
        draw_mascot(draw, int(cx), 680, 80, sage, panel, bounce)
        return True

    return False


# ---------------------------------------------------------------------------
# A5 · Being Safe Online — safety kit + scenes
# ---------------------------------------------------------------------------

DANGER = (224, 62, 62)
DANGER_SOFT = (253, 232, 230)
GOLD = (255, 186, 60)
HAIR = (40, 34, 30)
PERSON_COLORS = {
    "kid": (255, 106, 26), "friend": (255, 186, 60), "mom": (123, 97, 214), "dad": (72, 118, 214),
    "teacher": (13, 148, 136), "nani": (206, 110, 160), "mystery": (128, 136, 150),
}


def draw_shield(draw, cx: float, cy: float, s: float, color, mark: str = "check") -> None:
    def S(v: float) -> float:
        return v * s
    shape = [(0, -120), (100, -84), (92, 20), (0, 128), (-92, 20), (-100, -84)]
    draw.polygon([(cx + S(x) + S(8), cy + S(y) + S(10)) for x, y in shape], fill=SHADOW)
    draw.polygon([(cx + S(x), cy + S(y)) for x, y in shape], fill=color)
    draw.polygon([(cx + S(x) * 0.8, cy + S(y) * 0.8 - S(4)) for x, y in shape], outline=(255, 255, 255),
                 width=max(2, int(S(6))))
    if mark == "check":
        draw.line([(cx - S(40), cy), (cx - S(10), cy + S(32)), (cx + S(44), cy - S(30))], fill=(255, 255, 255),
                  width=max(3, int(S(16))), joint="curve")
    elif mark == "lock":
        draw_padlock(draw, cx, cy + S(4), s * 0.42, (255, 255, 255), keyhole=color, shadow=False)
    elif mark:
        text_at(draw, mark, cx, cy - S(52), load_font(max(12, int(S(96))), bold=True), (255, 255, 255))


def draw_padlock(draw, cx: float, cy: float, s: float, color, open_t: float = 0.0,
                 keyhole=DEV_DEEP, shadow: bool = True) -> None:
    def S(v: float) -> float:
        return v * s
    lift = S(46) * clamp01(open_t)
    sw = max(3, int(S(20)))
    draw.arc((cx - S(56), cy - S(128) - lift, cx + S(56), cy - S(16) - lift), 180, 360, fill=DEV_DARK, width=sw)
    draw.line((cx - S(56) + sw / 2, cy - S(72) - lift, cx - S(56) + sw / 2, cy - S(20) - lift * 0.2),
              fill=DEV_DARK, width=sw)
    draw.line((cx + S(56) - sw / 2, cy - S(72) - lift, cx + S(56) - sw / 2, cy - S(20) - lift), fill=DEV_DARK, width=sw)
    if shadow:
        draw.rounded_rectangle((cx - S(88) + S(8), cy - S(28) + S(10), cx + S(88) + S(8), cy + S(104) + S(10)),
                               radius=S(22), fill=SHADOW)
    draw.rounded_rectangle((cx - S(88), cy - S(28), cx + S(88), cy + S(104)), radius=S(22), fill=color)
    draw.ellipse((cx - S(18), cy + S(14), cx + S(18), cy + S(50)), fill=keyhole)
    draw.polygon([(cx - S(10), cy + S(40)), (cx + S(10), cy + S(40)), (cx + S(14), cy + S(80)), (cx - S(14), cy + S(80))],
                 fill=keyhole)


def draw_key(draw, cx: float, cy: float, s: float, color) -> None:
    def S(v: float) -> float:
        return v * s
    draw.ellipse((cx - S(130) + S(6), cy - S(52) + S(8), cx - S(26) + S(6), cy + S(52) + S(8)), fill=SHADOW)
    draw.ellipse((cx - S(130), cy - S(52), cx - S(26), cy + S(52)), fill=color)
    draw.ellipse((cx - S(98), cy - S(20), cx - S(58), cy + S(20)), fill=(255, 255, 255))
    draw.rounded_rectangle((cx - S(36), cy - S(14), cx + S(130), cy + S(14)), radius=S(6), fill=color)
    for tx, th in ((S(70), S(44)), (S(104), S(32))):
        draw.rectangle((cx + tx, cy, cx + tx + S(20), cy + th), fill=color)


def draw_person(draw, cx: float, cy: float, s: float, kind: str, t: float = 0.0) -> None:
    def S(v: float) -> float:
        return v * s
    body = PERSON_COLORS.get(kind, (128, 136, 150))
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    if kind == "mystery":
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=body)
        text_at(draw, "?", cx, cy - S(54), load_font(max(12, int(S(96))), bold=True), (255, 255, 255))
        return
    if kind == "mom":
        draw.rounded_rectangle((cx - r * 1.12, cy - r * 0.9, cx + r * 1.12, cy + r * 1.25), radius=r * 0.8, fill=HAIR)
    draw_face(draw, cx, cy, r, "nani" if kind == "nani" else "kid", 0.6)
    if kind == "teacher":
        gw = max(2, int(r * 0.07))
        for sx in (-1, 1):
            gx = cx + sx * r * 0.38
            draw.ellipse((gx - r * 0.24, cy - r * 0.28, gx + r * 0.24, cy + r * 0.18), outline=(40, 44, 56), width=gw)
        draw.line((cx - r * 0.14, cy - r * 0.05, cx + r * 0.14, cy - r * 0.05), fill=(40, 44, 56), width=gw)
    if kind == "kid":
        draw.ellipse((cx + r * 0.55, cy - r * 1.1, cx + r * 1.0, cy - r * 0.65), fill=body)
    if kind == "dad":
        draw.arc((cx - r * 0.5, cy + r * 0.25, cx + r * 0.5, cy + r * 0.85), 20, 160, fill=HAIR, width=max(2, int(r * 0.12)))


def draw_school(draw, cx: float, cy: float, s: float, brand: dict[str, str]) -> None:
    def S(v: float) -> float:
        return v * s
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    ow = max(2, int(S(5)))
    draw.line((cx, cy - S(128), cx, cy - S(210)), fill=ink, width=max(2, int(S(5))))
    draw.polygon([(cx, cy - S(210)), (cx + S(64), cy - S(190)), (cx, cy - S(170))], fill=sage)
    draw.rectangle((cx - S(160) + S(10), cy - S(40) + S(12), cx + S(160) + S(10), cy + S(130) + S(12)), fill=SHADOW)
    draw.rectangle((cx - S(160), cy - S(40), cx + S(160), cy + S(130)), fill=panel, outline=ink, width=ow)
    draw.polygon([(cx - S(186), cy - S(38)), (cx, cy - S(132)), (cx + S(186), cy - S(38))], fill=coral, outline=ink)
    draw.ellipse((cx - S(24), cy - S(98), cx + S(24), cy - S(50)), fill=panel, outline=ink, width=max(1, int(S(3))))
    draw.rectangle((cx - S(34), cy + S(40), cx + S(34), cy + S(130)), fill=sage, outline=ink, width=max(2, int(S(4))))
    for wx in (cx - S(130), cx - S(84), cx + S(52), cx + S(98)):
        draw.rectangle((wx, cy - S(10), wx + S(34), cy + S(30)), fill=DEV_SCREEN, outline=ink, width=max(1, int(S(3))))
        draw.rectangle((wx, cy + S(58), wx + S(34), cy + S(98)), fill=DEV_SCREEN, outline=ink, width=max(1, int(S(3))))


def draw_name_tag(draw, cx: float, cy: float, s: float, brand: dict[str, str]) -> None:
    def S(v: float) -> float:
        return v * s
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    muted = hex_rgb(brand["muted"])
    x0, y0, x1, y1 = cx - S(140), cy - S(92), cx + S(140), cy + S(92)
    draw.rounded_rectangle((x0 + S(8), y0 + S(10), x1 + S(8), y1 + S(10)), radius=S(22), fill=SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(22), fill=panel, outline=ink, width=max(2, int(S(5))))
    draw.rounded_rectangle((x0, y0, x1, y0 + S(70)), radius=S(22), fill=coral)
    draw.rectangle((x0, y0 + S(40), x1, y0 + S(70)), fill=coral)
    text_at(draw, "HELLO", cx, y0 + S(10), load_font(max(10, int(S(40))), bold=True), panel)
    text_at(draw, "my name is", cx, y0 + S(80), load_font(max(10, int(S(22)))), muted)
    pts = [(x0 + S(40) + i * S(10), cy + S(52) + S(12) * math.sin(i * 0.9)) for i in range(21)]
    draw.line(pts, fill=ink, width=max(2, int(S(7))), joint="curve")


def draw_map_pin(draw, cx: float, cy: float, s: float, color) -> None:
    def S(v: float) -> float:
        return v * s
    draw.polygon([(cx - S(40), cy - S(62)), (cx + S(40), cy - S(62)), (cx, cy)], fill=color)
    draw.ellipse((cx - S(48), cy - S(120), cx + S(48), cy - S(24)), fill=color)
    draw.ellipse((cx - S(20), cy - S(92), cx + S(20), cy - S(52)), fill=(255, 255, 255))


def draw_cross(draw, cx: float, cy: float, r: float, color, bg=(255, 255, 255)) -> None:
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)
    k = r * 0.42
    wd = max(3, int(r * 0.22))
    draw.line((cx - k, cy - k, cx + k, cy + k), fill=bg, width=wd)
    draw.line((cx - k, cy + k, cx + k, cy - k), fill=bg, width=wd)


def draw_heart(draw, cx: float, cy: float, r: float, color) -> None:
    draw.ellipse((cx - r, cy - r * 0.8, cx, cy + r * 0.2), fill=color)
    draw.ellipse((cx, cy - r * 0.8, cx + r, cy + r * 0.2), fill=color)
    draw.polygon([(cx - r * 0.97, cy - r * 0.15), (cx + r * 0.97, cy - r * 0.15), (cx, cy + r * 1.0)], fill=color)


def draw_stop_sign(draw, cx: float, cy: float, r: float) -> None:
    pts = [(cx + r * math.cos(math.radians(22.5 + 45 * i)), cy + r * math.sin(math.radians(22.5 + 45 * i)))
           for i in range(8)]
    draw.polygon([(x + 8, y + 10) for x, y in pts], fill=SHADOW)
    draw.polygon(pts, fill=DANGER)
    inner = [(cx + (x - cx) * 0.86, cy + (y - cy) * 0.86) for x, y in pts]
    draw.polygon(inner, outline=(255, 255, 255), width=max(3, int(r * 0.06)))
    text_at(draw, "STOP", cx, cy - r * 0.3, load_font(max(12, int(r * 0.5)), bold=True), (255, 255, 255))


def draw_red_flag(draw, x: float, y: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    draw.line((x, y - S(40), x, y + S(40)), fill=DEV_DARK, width=max(2, int(S(6))))
    draw.polygon([(x, y - S(40)), (x + S(46), y - S(26)), (x, y - S(10))], fill=DANGER)


def draw_chat(draw, box, brand: dict[str, str], header: str, msgs: list[tuple[str, str, str]],
              reveal: float, t: float = 0.0, avatar=(128, 136, 150)) -> None:
    """msgs: (side l|r, text, kind them|me|flag)."""
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    line = hex_rgb(brand["line"])
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=44, fill=SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=44, fill=DEV_DARK)
    sx0, sy0, sx1, sy1 = x0 + 16, y0 + 16, x1 - 16, y1 - 16
    draw.rounded_rectangle((sx0, sy0, sx1, sy1), radius=32, fill=(246, 243, 238))
    draw.rounded_rectangle((sx0, sy0, sx1, sy0 + 84), radius=32, fill=panel)
    draw.rectangle((sx0, sy0 + 50, sx1, sy0 + 84), fill=panel)
    draw.line((sx0, sy0 + 84, sx1, sy0 + 84), fill=line, width=3)
    draw.ellipse((sx0 + 24, sy0 + 18, sx0 + 72, sy0 + 66), fill=avatar)
    text_at(draw, "?", sx0 + 48, sy0 + 18, load_font(34, bold=True), (255, 255, 255))
    draw.text((sx0 + 90, sy0 + 26), header, fill=ink, font=load_font(30, bold=True))
    font = load_font(30, bold=True)
    max_w = int((sx1 - sx0) * 0.72)
    y = sy0 + 110
    for i, (side, text, kind) in enumerate(msgs):
        a = stagger(reveal, i, step=0.2, speed=4)
        if a <= 0:
            continue
        lines = wrap_text(text, font, max_w - 44)
        tw = max(draw.textbbox((0, 0), ln, font=font)[2] for ln in lines)
        bw, bh = tw + 48, len(lines) * 40 + 30
        bx = sx0 + 28 if side == "l" else sx1 - 28 - bw
        by = y + (1 - a) * 24
        if kind == "me":
            fill, fg, out = coral, (255, 255, 255), None
        elif kind == "flag":
            fill, fg, out = DANGER_SOFT, DANGER, DANGER
        else:
            fill, fg, out = panel, ink, line
        draw.rounded_rectangle((bx, by, bx + bw, by + bh), radius=22, fill=fill, outline=out, width=3 if out else 0)
        for j, ln in enumerate(lines):
            draw.text((bx + 24, by + 14 + j * 40), ln, fill=fg, font=font)
        if kind == "flag":
            draw_red_flag(draw, bx + bw + 26, by + bh / 2, 0.7)
        y += bh + 20
    if reveal < 1.0 and t > 0 and int(t * 5) % 2 == 0:
        for k in range(3):
            draw.ellipse((sx0 + 44 + k * 22, sy1 - 44, sx0 + 58 + k * 22, sy1 - 30), fill=(170, 170, 176))


def draw_meter(draw, x0: float, y: float, wd: float, level: float, label: str | None = None) -> None:
    level = clamp01(level)
    col = DANGER if level <= 0.35 else GOLD if level <= 0.7 else (13, 148, 136)
    seg = (wd - 3 * 12) / 4
    for i in range(4):
        sx = x0 + i * (seg + 12)
        on = level >= (i + 0.5) / 4
        draw.rounded_rectangle((sx, y, sx + seg, y + 22), radius=11, fill=col if on else (226, 220, 210))
    if label:
        draw.text((x0, y + 36), label, fill=col, font=load_font(32, bold=True))


def draw_field(draw, box, brand: dict[str, str], text: str, typed: float = 1.0, t: float = 0.0) -> None:
    ink = hex_rgb(brand["ink"])
    panel = hex_rgb(brand["panel"])
    coral = hex_rgb(brand["coral"])
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 6, y0 + 8, x1 + 6, y1 + 8), radius=22, fill=SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=22, fill=panel, outline=ink, width=4)
    draw_key(draw, x0 + 58, (y0 + y1) / 2, 0.24, GOLD)
    font = load_font(46, bold=True)
    shown = text[: int(round(len(text) * clamp01(typed)))]
    ty = (y0 + y1) / 2 - 28
    draw.text((x0 + 110, ty), shown, fill=ink, font=font)
    if typed < 1.0 or int(t * 6) % 2 == 0:
        bx = draw.textbbox((x0 + 110, ty), shown or " ", font=font)[2] + 6 if shown else x0 + 112
        draw.line((bx, ty + 4, bx, ty + 58), fill=coral, width=4)


def draw_post(draw, box, brand: dict[str, str], user: str, text: str, avatar, pic: str | None = None) -> None:
    ink = hex_rgb(brand["ink"])
    muted = hex_rgb(brand["muted"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    x0, y0, x1, y1 = box
    shadow_card(draw, box, brand, radius=30)
    draw.ellipse((x0 + 32, y0 + 30, x0 + 96, y0 + 94), fill=avatar)
    draw.text((x0 + 116, y0 + 34), user, fill=ink, font=load_font(32, bold=True))
    draw.text((x0 + 116, y0 + 72), "just now", fill=muted, font=load_font(22))
    tx1 = x1 - 36
    if pic:
        px0, py0, px1, py1 = x1 - 300, y0 + 40, x1 - 40, y1 - 40
        tx1 = px0 - 30
        draw.rounded_rectangle((px0, py0, px1, py1), radius=18, fill=DEV_SCREEN, outline=ink, width=3)
        if pic == "icecream":
            mx = (px0 + px1) / 2
            draw.polygon([(mx - 48, py0 + 120), (mx + 48, py0 + 120), (mx, py1 - 16)], fill=(222, 170, 100))
            draw.ellipse((mx - 58, py0 + 60, mx + 58, py0 + 150), fill=(255, 200, 70))
            draw.ellipse((mx - 40, py0 + 18, mx + 40, py0 + 96), fill=coral)
        else:
            draw.ellipse((px1 - 90, py0 + 22, px1 - 36, py0 + 76), fill=GOLD)
            draw.polygon([(px0 + 6, py1 - 6), (px0 + 90, py0 + 80), (px0 + 170, py1 - 6)], fill=sage)
            draw.polygon([(px0 + 110, py1 - 6), (px0 + 190, py0 + 110), (px1 - 6, py1 - 6)], fill=(20, 150, 136))
    font = load_font(42, bold=True)
    for j, ln in enumerate(wrap_text(text, font, int(tx1 - x0 - 36))[:4]):
        draw.text((x0 + 36, y0 + 130 + j * 54), ln, fill=ink, font=font)


A5_POSTS = [
    ("Riya_Art", "I love mango ice cream!", True, "icecream"),
    ("Riya", "Hi, I'm Riya from Green Park School. I live on Rose Street!", False, None),
    ("Riya_Art", "Look at my new drawing!", True, "drawing"),
]


def render_a5(draw, brand: dict[str, str], visual: str, focus: str, progress: float, w: int, h: int) -> bool:
    ink = hex_rgb(brand["ink"])
    muted = hex_rgb(brand["muted"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    panel = hex_rgb(brand["panel"])
    line = hex_rgb(brand["line"])
    coral_soft = hex_rgb(brand["coralSoft"])
    sage_soft = hex_rgb(brand["sageSoft"])
    appear = ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    rule_specs = [("1", "Private info", "stays private", coral),
                  ("2", "Passwords", "are secret", BOTH_COLOR),
                  ("3", "Odd chat?", "Tell an adult", sage)]

    def stars_around(y: float, spread: float, n: int = 6) -> None:
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, BOTH_COLOR, GOLD][i % 4], rot=progress * 3 + i)

    def rule_header(num: str, title: str, col, x: float = 760) -> None:
        pill(draw, 0, 250 + lift, f"RULE {num}", col, size=30, left=x)
        for j, ln in enumerate(title.split("\n")):
            draw.text((x, 330 + lift + j * 96), ln, fill=ink, font=load_font(80, bold=True))

    def three_shields(y: float, s: float, active: int | None = None, upto: int = 3, gap: int = 520) -> None:
        for i, (num, t1, t2, col) in enumerate(rule_specs[:upto]):
            a = stagger(progress, i, step=0.14, speed=4) if active is None else 1.0
            if a <= 0:
                continue
            x = cx + (i - 1) * gap
            dim = active is not None and i != active
            yy = y + (1 - a) * 50 - (12 * pulse if (active == i) else 0)
            if active == i:
                draw.ellipse((x - 150 * s, yy - 150 * s, x + 150 * s, yy + 150 * s), fill=coral_soft)
            draw_shield(draw, x, yy, s * (1.0 if not dim else 0.86), (196, 190, 182) if dim else col, mark=num)
            text_at(draw, t1, x, yy + 150 * s, load_font(40, bold=True), muted if dim else ink)
            text_at(draw, t2, x, yy + 150 * s + 50, load_font(32, bold=True), muted if dim else col)

    # ---- opening ---------------------------------------------------------
    if visual == "a5-welcome":
        if focus == "hello":
            draw_mascot(draw, int(cx), 420, 110, sage, panel, bounce)
            text_at(draw, "Welcome, champ!", cx, 590, load_font(60, bold=True), ink)
            pill(draw, cx, 690, "Chapter 5 · last one in Unit 1", coral, size=32)
            stars_around(380, 330)
            return True
        if focus == "bridge":
            cards = [("CH 1", "Computers", coral, "computer"), ("CH 2", "Binary", sage, None),
                     ("CH 3", "Devices", BOTH_COLOR, "keyboard"), ("CH 4", "Websites", ROAD, "server")]
            for i, (k, v, acc, dev) in enumerate(cards):
                a = stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 130 + i * 425
                y = 270 + int((1 - a) * 60)
                shadow_card(draw, (x, y, x + 390, y + 360), brand, accent=acc)
                draw.text((x + 34, y + 70), k, fill=acc, font=load_font(28, bold=True))
                draw.text((x + 34, y + 110), v, fill=ink, font=load_font(44, bold=True))
                draw_check(draw, x + 340, y + 88, 24, acc)
                if dev == "server":
                    draw_server(draw, x + 195, y + 270, 0.42, progress)
                elif dev:
                    draw_device(draw, dev, x + 195, y + 275, 0.46, brand)
                else:
                    text_at(draw, "1 0 1", x + 195, y + 230, load_font(60, bold=True), sage)
            a = stagger(progress, 4, step=0.12, speed=5)
            if a > 0:
                pill(draw, cx, 700 + int((1 - a) * 30), "Today → Chapter 5", ink, size=36)
            return True
        if focus == "chapter":
            shadow_card(draw, (300, 240 + lift, w - 300, 520 + lift), brand, radius=40, accent=coral)
            text_at(draw, "CHAPTER 5 OF 5", cx, 302 + lift, load_font(32, bold=True), coral)
            text_at(draw, "Being Safe Online", cx, 362 + lift, load_font(88, bold=True), ink)
            text_at(draw, "your online superpower", cx, 462 + lift, load_font(38, bold=True), muted)
            a = stagger(progress, 2, speed=4)
            if a > 0:
                draw_shield(draw, cx, 720 + bounce, 0.95 * a, sage, mark="check")
                stars_around(690, 220, 4)
            return True
        three_shields(470, 1.2)
        a = stagger(progress, 4, speed=4)
        if a > 0:
            text_at(draw, "3 super safety rules", cx, 250 + int((1 - a) * 30), load_font(52, bold=True), ink)
        return True

    # ---- hook ------------------------------------------------------------
    if visual == "a5-hook":
        chat_box = (1010, 230, 1560, 880)
        msgs = [("l", "Hi! I'm 10 too.", "them"), ("l", "Want to be friends?", "them")]
        if focus == "chat":
            draw_person(draw, 520, 470, 1.35, "kid", progress)
            draw_device(draw, "laptop", 520, 790, 0.8, brand, t=progress)
            draw_chat(draw, chat_box, brand, "CoolGamer10", msgs, min(1.0, progress * 1.6), progress)
            return True
        if focus == "ask":
            draw_chat(draw, (260, 230, 810, 880), brand, "CoolGamer10", msgs, 1.0)
            draw.rounded_rectangle((1000, 260, 1640, 840), radius=40, fill=DEV_DEEP)
            draw_person(draw, 1320, 470, 1.3, "mystery", progress)
            text_at(draw, "?", 1110, 290, load_font(int(90 + 20 * pulse), bold=True), GOLD)
            text_at(draw, "?", 1540, 330, load_font(int(70 + 20 * (1 - pulse)), bold=True), GOLD)
            text_at(draw, "Who is really typing?", 1320, 760, load_font(40, bold=True), (255, 255, 255))
            return True
        if focus == "answer":
            draw_chat(draw, (180, 260, 660, 860), brand, "CoolGamer10", msgs, 1.0)
            text_at(draw, "It could be…", 1250, 250, load_font(48, bold=True), ink)
            for i, (kind, lab, col) in enumerate((("kid", "a kid", sage), ("mystery", "a grown-up stranger", DANGER))):
                a = stagger(progress, i + 1, step=0.18, speed=4)
                if a <= 0:
                    continue
                x = 1000 + i * 500
                draw.ellipse((x - 190, 340, x + 190, 720), fill=sage_soft if i == 0 else DANGER_SOFT)
                draw_person(draw, x, 470 + (1 - a) * 40, 1.15, kind, progress)
                text_at(draw, lab, x, 760, load_font(38, bold=True), col)
            draw_dashed(draw, 680, 560, 790, 560, muted, width=6, phase=progress * 200)
            return True
        three_shields(470, 1.1)
        text_at(draw, "Smart champs follow 3 rules", cx, 250, load_font(52, bold=True), ink)
        return True

    # ---- rule 1: private info -------------------------------------------
    info_items = [("tag", "Full name"), ("school", "School"), ("house", "Home address"), ("phone", "Phone number")]

    def info_icon(kind: str, x: float, y: float, s: float) -> None:
        if kind == "tag":
            draw_name_tag(draw, x, y, 0.7 * s, brand)
        elif kind == "school":
            draw_school(draw, x, y + 20 * s, 0.55 * s, brand)
        elif kind == "house":
            draw_house(draw, x, y + 10 * s, 0.46 * s, brand)
        else:
            draw_device(draw, "touch", x, y, 0.55 * s, brand)

    if visual == "a5-private":
        if focus == "intro":
            draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=coral_soft)
            draw_shield(draw, 480, 560 + bounce, 1.55, coral, mark="lock")
            rule_header("1", "Private info\nstays private", coral)
            return True
        if focus == "items":
            for i, (kind, lab) in enumerate(info_items):
                a = stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                x = 120 + i * 430
                y = 280 + int((1 - a) * 60)
                shadow_card(draw, (x, y, x + 390, y + 520), brand, outline=coral if a >= 1 else None)
                info_icon(kind, x + 195, y + 230, 1.0)
                text_at(draw, lab, x + 195, y + 420, load_font(40, bold=True), ink)
                draw_padlock(draw, x + 340, y + 50, 0.26, coral)
            return True
        if focus == "map":
            for i, (kind, lab) in enumerate(info_items):
                y = 300 + i * 150
                a = stagger(progress, i, step=0.1, speed=5)
                shadow_card(draw, (140, y - 58, 520, y + 58), brand, radius=24)
                draw.text((180, y - 24), lab, fill=ink, font=load_font(36, bold=True))
                p = clamp01((progress - 0.2 - i * 0.06) * 2.2)
                if p > 0 and a > 0:
                    draw_curve(draw, (530, y), (900, y), (1260, 560), coral, width=6, dashed=True, phase=progress * 30)
                    ex, ey = qbez((530, y), (900, y), (1260, 560), ease_in_out(p))
                    draw.ellipse((ex - 12, ey - 12, ex + 12, ey + 12), fill=coral)
            draw_house(draw, 1420, 600, 0.9, brand)
            drop = clamp01((progress - 0.55) * 3)
            if drop > 0:
                draw_map_pin(draw, 1420, 400 - (1 - ease_out_cubic(drop)) * 180, 1.0, DANGER)
                a = ease_out_cubic(clamp01((progress - 0.65) * 3))
                if a > 0:
                    pill(draw, 1420, 800 + int((1 - a) * 20), "Together = a map to your door!", DANGER, size=30)
            return True
        if focus == "safe":
            cols = [("OK to share", sage, sage_soft, [("colour", "Favourite colour"), ("nick", "Game nickname"),
                                                       ("draw", "Your drawing")], True),
                    ("Keep private", DANGER, DANGER_SOFT, [(k, l) for k, l in info_items[:3]], False)]
            for ci, (title, col, soft, rows, ok) in enumerate(cols):
                x0 = 180 + ci * 820
                a = stagger(progress, ci, step=0.3, speed=4)
                if a <= 0:
                    continue
                draw.rounded_rectangle((x0, 240 + lift, x0 + 740, 870 + lift), radius=36, fill=soft, outline=col, width=4)
                text_at(draw, title, x0 + 370, 270 + lift, load_font(48, bold=True), col)
                for ri, (kind, lab) in enumerate(rows):
                    ra = stagger(progress, ri + ci * 3, step=0.08, speed=5)
                    if ra <= 0:
                        continue
                    ry = 390 + ri * 150 + lift
                    draw.rounded_rectangle((x0 + 40, ry, x0 + 700, ry + 124), radius=24, fill=panel)
                    ix = x0 + 110
                    if kind == "colour":
                        for k, c in enumerate((coral, GOLD, sage)):
                            draw.ellipse((ix - 50 + k * 34, ry + 38, ix - 2 + k * 34, ry + 86), fill=c)
                    elif kind == "nick":
                        pill(draw, ix, ry + 36, "StarKid", BOTH_COLOR, size=22)
                    elif kind == "draw":
                        draw_page(draw, ix, ry + 62, 0.62, brand)
                    else:
                        info_icon(kind, ix, ry + 62, 0.4)
                    draw.text((x0 + 200, ry + 38), lab, fill=ink, font=load_font(38, bold=True))
                    (draw_check if ok else draw_cross)(draw, x0 + 640, ry + 62, 28, col)
            return True
        # say
        words = [("Private", coral), ("stays", ink), ("private!", sage)]
        for i, ((wd, col), x) in enumerate(zip(words, (520, 960, 1400))):
            a = stagger(progress, i, step=0.12, speed=5)
            if a > 0:
                text_at(draw, wd, x, 360 + int((1 - a) * 40), load_font(int(70 + 18 * a), bold=True), col)
        draw_shield(draw, cx, 680 + bounce, 0.9, coral, mark="lock")
        text_at(draw, "Say it with me!", cx, 250, load_font(38, bold=True), coral)
        return True

    # ---- safe / unsafe sort game ------------------------------------------
    if visual == "a5-sort":
        idx = int(focus[1]) - 1 if focus[:1] in ("q", "a") and focus[1:].isdigit() else -1
        answered = 0 if idx < 0 else idx + (1 if focus.startswith("a") else 0)
        bins = [("SAFE", sage, sage_soft, 150, True), ("UNSAFE", DANGER, DANGER_SOFT, 1370, False)]
        for label, col, soft, bx, ok in bins:
            glow = idx >= 0 and focus.startswith("a") and A5_POSTS[idx][2] == ok
            draw.rounded_rectangle((bx, 470, bx + 400, 870), radius=36, fill=soft, outline=col, width=8 if glow else 4)
            text_at(draw, label, bx + 200, 500, load_font(50, bold=True), col)
            (draw_check if ok else draw_cross)(draw, bx + 200, 630, 46, col)
            done = [p for p in A5_POSTS[:answered] if p[2] == ok]
            for j, _ in enumerate(done):
                my = 720 + j * 56
                draw.rounded_rectangle((bx + 60, my, bx + 340, my + 44), radius=14, fill=panel, outline=col, width=3)
                draw.ellipse((bx + 76, my + 8, bx + 104, my + 36), fill=col)
                draw.rounded_rectangle((bx + 120, my + 16, bx + 300, my + 28), radius=6, fill=line)
        if idx < 0:
            text_at(draw, "Safe or unsafe?", cx, 250 + lift, load_font(64, bold=True), ink)
            for k in range(3):
                o = (2 - k) * 22
                draw.rounded_rectangle((640 + o, 420 - o, 1280 + o, 780 - o), radius=30, fill=panel, outline=line, width=4)
            text_at(draw, "?", cx + 22, 470, load_font(int(150 + 20 * pulse), bold=True), coral)
            text_at(draw, "Answer fast!", cx, 820, load_font(36, bold=True), coral)
            return True
        user, text, ok, pic = A5_POSTS[idx]
        box = (590, 250 + lift, 1330, 610 + lift)
        draw_post(draw, box, brand, user, text, BOTH_COLOR if ok else coral, pic)
        text_at(draw, f"Post {idx + 1} of 3", cx, 640, load_font(30, bold=True), muted)
        if focus.startswith("q"):
            pill(draw, cx, 700, "Safe or unsafe?", ink, size=36)
            draw_stopwatch(draw, cx, 830, 44, progress, brand)
        else:
            a = ease_out_cubic(clamp01(progress * 4))
            col = sage if ok else DANGER
            pill(draw, cx, 690, ("SAFE!" if ok else "UNSAFE!"), col, size=int(36 + 12 * (1 - a)))
            if not ok:
                for k, word in enumerate(("name", "school", "street")):
                    ka = stagger(progress, k + 2, step=0.12, speed=5)
                    if ka > 0:
                        pill(draw, 680 + k * 280, 780, word, DANGER, size=32, fg=(255, 255, 255))
            else:
                stars_around(700, 260, 4)
        return True

    # ---- rule 2: passwords ---------------------------------------------
    if visual == "a5-password":
        if focus == "intro":
            draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=hex_rgb("#EFEAFB"))
            draw_key(draw, 480, 560 + bounce, 1.5, GOLD)
            rule_header("2", "Your password\nis a secret key", BOTH_COLOR)
            return True
        if focus == "lock":
            p = clamp01((progress - 0.15) * 1.8)
            open_t = clamp01((progress - 0.62) * 4)
            draw_device(draw, "touch", 560, 560, 1.5, brand, lit=open_t > 0)
            draw_padlock(draw, 560, 540, 0.8, GOLD if open_t <= 0 else sage, open_t=open_t)
            kx = lerp(1500, 760, ease_in_out(p))
            draw_key(draw, kx, 600, 1.0, GOLD)
            text_at(draw, "Locks your games", 1300, 300, load_font(50, bold=True), ink)
            text_at(draw, "& accounts", 1300, 370, load_font(50, bold=True), ink)
            if open_t > 0:
                pill(draw, 1300, 780, "Right key → open!", sage, size=32)
            return True
        if focus == "secret":
            draw_padlock(draw, cx, 520 + bounce, 1.0, GOLD)
            text_at(draw, "TOP SECRET", cx, 690, load_font(44, bold=True), BOTH_COLOR)
            specs = [(420, "friend", "Best friend", "Not even them!", False),
                     (1500, "mom", "Mum & Dad", "Only them", True)]
            for i, (x, kind, lab, sub, ok) in enumerate(specs):
                a = stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                draw.ellipse((x - 190, 300, x + 190, 680), fill=sage_soft if ok else DANGER_SOFT)
                draw_person(draw, x, 430 + (1 - a) * 40, 1.1, kind, progress)
                (draw_check if ok else draw_cross)(draw, x + 140, 330, 40, sage if ok else DANGER)
                text_at(draw, lab, x, 720, load_font(42, bold=True), ink)
                text_at(draw, sub, x, 780, load_font(34, bold=True), sage if ok else DANGER)
            return True
        if focus == "weak":
            text_at(draw, "WEAK passwords", cx, 250 + lift, load_font(60, bold=True), DANGER)
            for i, pw in enumerate(("1234", "riya")):
                a = stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                y = 380 + i * 220 + int((1 - a) * 30)
                draw_field(draw, (420, y, 1140, y + 110), brand, pw)
                draw_meter(draw, 1200, y + 30, 320, 0.2)
                draw_cross(draw, 1580, y + 55, 34, DANGER)
            a = stagger(progress, 3, step=0.16, speed=4)
            if a > 0:
                pill(draw, cx, 820, "Too easy to guess!", DANGER, size=32)
            return True
        if focus == "strong":
            text_at(draw, "STRONG password", cx, 250 + lift, load_font(60, bold=True), sage)
            typed = clamp01(progress * 1.8)
            draw_field(draw, (360, 360, 1560, 480), brand, "Tiger$Jumps7Mango", typed, progress)
            draw_meter(draw, 560, 530, 800, typed, "STRONG" if typed >= 1 else None)
            chips = [("Long", coral), ("Words", BOTH_COLOR), ("Numbers", ROAD), ("Symbols", sage)]
            for i, (lab, col) in enumerate(chips):
                a = stagger(progress, i + 5, step=0.08, speed=5)
                if a > 0:
                    x = 420 + i * 360
                    box = pill(draw, x + 60, 680 + int((1 - a) * 20), f"{lab}", col, size=32)
                    draw_check(draw, box[2] + 26, (box[1] + box[3]) / 2, 20, col)
            return True
        # note
        draw.rounded_rectangle((520 + 10, 260 + 12, 1400 + 10, 820 + 12), radius=20, fill=SHADOW)
        draw.rounded_rectangle((520, 260, 1400, 820), radius=20, fill=(255, 236, 160))
        draw.rectangle((880, 240, 1040, 290), fill=(236, 226, 206))
        text_at(draw, "TIP", cx - 40, 320, load_font(40, bold=True), coral)
        text_at(draw, "Make your OWN password.", cx - 40, 420, load_font(52, bold=True), ink)
        text_at(draw, "Never copy the one", cx - 40, 520, load_font(46, bold=True), ink)
        text_at(draw, "on this screen!", cx - 40, 586, load_font(46, bold=True), ink)
        draw_padlock(draw, 1250, 720 + bounce, 0.55, BOTH_COLOR)
        return True

    if visual == "a5-pwgame":
        options = [("A", "abc123", 0.2), ("B", "BlueKite!Runs42", 1.0)]
        text_at(draw, "Which is stronger?", cx, 240 + lift, load_font(60, bold=True), ink)
        for i, (lab, pw, lvl) in enumerate(options):
            y = 380 + i * 230
            win = focus == "answer" and lvl >= 1
            lose = focus == "answer" and lvl < 1
            if win:
                draw.rounded_rectangle((250, y - 30, 1670, y + 170), radius=40, fill=sage_soft, outline=sage, width=5)
            pill(draw, 0, y + 24, lab, BOTH_COLOR if not lose else (190, 184, 176), size=40, left=300)
            draw_field(draw, (430, y, 1130, y + 120), brand, pw)
            if focus == "answer":
                fill = clamp01(progress * 2.5)
                draw_meter(draw, 1180, y + 40, 320, lvl * fill)
                (draw_check if win else draw_cross)(draw, 1580, y + 60, 36, sage if win else DANGER)
            else:
                text_at(draw, "?", 1340, y + 10, load_font(int(80 + 16 * pulse), bold=True), coral)
        if focus == "answer":
            a = stagger(progress, 3, speed=4)
            if a > 0:
                pill(draw, cx, 850, "Longer + mixed = harder to guess", sage, size=30)
        else:
            draw_stopwatch(draw, cx, 850, 44, progress, brand)
        return True

    # ---- rule 3: trusted adult ------------------------------------------
    if visual == "a5-adult":
        if focus == "intro":
            draw.ellipse((480 - 260, 560 - 260, 480 + 260, 560 + 260), fill=sage_soft)
            draw_person(draw, 390, 470, 1.05, "kid", progress)
            draw_person(draw, 590, 420, 1.25, "mom", progress + 0.3)
            draw_heart(draw, 490, 300 + bounce, 36, coral)
            rule_header("3", "Odd chat?\nTell a trusted adult", sage)
            return True
        if focus == "signs":
            msgs = [("l", "Send me a photo of you", "flag"), ("l", "Where do you live?", "flag"),
                    ("l", "Don't tell your parents!", "flag")]
            draw_chat(draw, (230, 230, 1010, 880), brand, "Stranger", msgs, min(1.0, progress * 1.3), progress,
                      avatar=DANGER)
            text_at(draw, "Red flags!", 1420, 330, load_font(64, bold=True), DANGER)
            for i, lab in enumerate(("Asks for photos", "Asks where you live", "Says \"don't tell\"")):
                a = stagger(progress, i + 1, step=0.18, speed=4)
                if a > 0:
                    draw_red_flag(draw, 1160, 480 + i * 110, 0.9)
                    draw.text((1210, 452 + i * 110), lab, fill=ink, font=load_font(40, bold=True))
            return True
        if focus == "steps":
            steps = [("1", "STOP", "stop"), ("2", "Don't reply", "noreply"), ("3", "Tell a grown-up", "tell")]
            for i, (num, lab, kind) in enumerate(steps):
                a = stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = 160 + i * 540
                y = 260 + int((1 - a) * 60)
                shadow_card(draw, (x, y, x + 500, y + 580), brand, accent=[DANGER, GOLD, sage][i])
                pill(draw, 0, y + 64, num, [DANGER, GOLD, sage][i], size=34, left=x + 36)
                icx, icy = x + 250, y + 290
                if kind == "stop":
                    draw_stop_sign(draw, icx, icy, 120)
                elif kind == "noreply":
                    draw.rounded_rectangle((icx - 120, icy - 90, icx + 120, icy + 60), radius=36, fill=coral_soft,
                                           outline=coral, width=5)
                    draw.polygon([(icx - 60, icy + 58), (icx - 20, icy + 58), (icx - 70, icy + 110)], fill=coral)
                    draw_cross(draw, icx, icy - 14, 50, DANGER)
                else:
                    draw_person(draw, icx - 70, icy - 60, 0.75, "kid", progress)
                    draw_person(draw, icx + 80, icy - 90, 0.9, "dad", progress + 0.4)
                text_at(draw, lab, x + 250, y + 470, load_font(44, bold=True), ink)
            return True
        if focus == "who":
            people = [("mom", "Mum or Dad"), ("teacher", "Your teacher"), ("nani", "Nani & Nana")]
            text_at(draw, "Trusted adults", cx, 240 + lift, load_font(56, bold=True), ink)
            for i, (kind, lab) in enumerate(people):
                a = stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                draw.ellipse((x - 190, 340, x + 190, 720), fill=[hex_rgb("#EFEAFB"), sage_soft, coral_soft][i])
                draw_person(draw, x, 470 + (1 - a) * 40, 1.2, kind, progress + i * 0.2)
                text_at(draw, lab, x, 760, load_font(42, bold=True), ink)
                draw_heart(draw, x + 140, 380, 24, coral)
            return True
        # never
        draw.ellipse((cx - 300, 520 - 300, cx + 300, 520 + 300), fill=coral_soft)
        draw_heart(draw, cx, 470 + bounce, 150, coral)
        text_at(draw, "Telling is brave!", cx, 700, load_font(72, bold=True), ink)
        pill(draw, cx, 800, "You're never in trouble for telling", sage, size=32)
        stars_around(360, 360)
        return True

    # ---- checkpoint --------------------------------------------------------
    if visual == "a5-check":
        if focus == "intro":
            shadow_card(draw, (460, 300 + lift, w - 460, 700 + lift), brand, radius=40, accent=sage)
            text_at(draw, "PRACTICE CHECK", cx, 380 + lift, load_font(40, bold=True), sage)
            text_at(draw, "Just like the quiz!", cx, 470 + lift, load_font(64, bold=True), ink)
            draw_check(draw, cx, 620 + lift, 44, sage)
            return True
        draw.rounded_rectangle((540, 230, 1380, 330), radius=40, fill=DANGER_SOFT, outline=DANGER, width=4)
        text_at(draw, "\"What's your home address?\"", cx, 254, load_font(46, bold=True), DANGER)
        draw_red_flag(draw, 1440, 280, 0.9)
        opts = [("A", "Tell them"), ("B", "Tell only your street"), ("C", "Don't share. Tell a trusted adult")]
        for i, (lab, txt) in enumerate(opts):
            a = stagger(progress, i, step=0.12, speed=5) if focus == "ask" else 1.0
            if a <= 0:
                continue
            y = 380 + i * 160 + int((1 - a) * 30)
            win = focus == "answer" and lab == "C"
            lose = focus == "answer" and lab != "C"
            fill = sage_soft if win else panel
            out = sage if win else line
            draw.rounded_rectangle((360, y, 1560, y + 130), radius=32, fill=fill, outline=out, width=5 if win else 3)
            pill(draw, 0, y + 30, lab, sage if win else (190, 184, 176) if lose else BOTH_COLOR, size=34, left=400)
            draw.text((520, y + 38), txt, fill=muted if lose else ink, font=load_font(46, bold=True))
            if win:
                draw_check(draw, 1490, y + 65, 38, sage)
            elif lose:
                draw_cross(draw, 1490, y + 65, 30, DANGER)
        return True

    # ---- recap -------------------------------------------------------------
    if visual == "a5-recap":
        if focus in ("r1", "r2", "r3"):
            n = int(focus[1])
            text_at(draw, "Lock it in!", cx, 230, load_font(52, bold=True), ink)
            three_shields(480, 1.15, active=n - 1, upto=n)
            return True
        if focus == "three":
            text_at(draw, "Never post these 3", cx, 240 + lift, load_font(60, bold=True), DANGER)
            for i, (kind, lab) in enumerate(info_items[:3]):
                a = stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                y = 360 + int((1 - a) * 60)
                shadow_card(draw, (x - 220, y, x + 220, y + 460), brand, outline=DANGER)
                info_icon(kind, x, y + 190, 1.0)
                text_at(draw, lab, x, y + 380, load_font(42, bold=True), ink)
                draw_cross(draw, x + 180, y + 40, 32, DANGER)
            return True
        if focus == "done":
            draw_mascot(draw, int(cx), 400, 110, sage, panel, bounce)
            text_at(draw, "Chapter 5 done!", cx, 560, load_font(64, bold=True), ink)
            pill(draw, cx, 660, "UNIT 1 COMPLETE", coral, size=40)
            draw_shield(draw, cx - 520, 520, 0.8, sage)
            draw_shield(draw, cx + 520, 520, 0.8, coral)
            stars_around(340, 300, 8)
            return True
        text_at(draw, "Next up: Quiz time!", cx, 380, load_font(64, bold=True), coral)
        text_at(draw, "Tap Finish and let's go, champ!", cx, 500, load_font(44, bold=True), ink)
        draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False


def draw_scene_dots(draw: ImageDraw.ImageDraw, brand: dict[str, str], idx: int, total: int, w: int) -> None:
    coral = hex_rgb(brand["coral"])
    line = hex_rgb(brand["line"])
    muted = hex_rgb(brand["muted"])
    gap = 36
    x_end = w - 90
    x0 = x_end - (total - 1) * gap
    for i in range(total):
        x = x0 + i * gap
        if i == idx:
            draw.rounded_rectangle((x - 14, 136, x + 14, 152), radius=8, fill=coral)
        else:
            draw.ellipse((x - 7, 137, x + 7, 151), fill=coral if i < idx else line)
    label = f"Part {idx + 1} of {total}"
    font = load_font(22, bold=True)
    bbox = draw.textbbox((0, 0), label, font=font)
    draw.text((x_end - (bbox[2] - bbox[0]), 96), label, fill=muted, font=font)


def render_visual(
    img: Image.Image,
    draw: ImageDraw.ImageDraw,
    brand: dict[str, str],
    visual: str,
    focus: str,
    progress: float,
    w: int,
    h: int,
) -> None:
    if visual.startswith("a3-") and render_a3(draw, brand, visual, focus, progress, w, h):
        return
    if visual.startswith("a4-") and render_a4(draw, brand, visual, focus, progress, w, h):
        return
    if visual.startswith("a5-") and render_a5(draw, brand, visual, focus, progress, w, h):
        return
    ink = hex_rgb(brand["ink"])
    muted = hex_rgb(brand["muted"])
    coral = hex_rgb(brand["coral"])
    sage = hex_rgb(brand["sage"])
    panel = hex_rgb(brand["panel"])
    line = hex_rgb(brand["line"])
    appear = ease_out_cubic(min(1.0, progress * 2.2))
    bounce = int(10 * math.sin(progress * math.pi * 2))

    if visual == "welcome":
        draw_mascot(draw, w // 2, 430, 110, sage, panel, bounce)
        if focus == "hello":
            draw_text_centered(draw, "Your mentoring class starts now", 600, load_font(40, bold=True), ink, w)
        elif focus == "unit":
            rounded_rect(draw, (460, 560, w - 460, 700), 28, panel, line, 3)
            draw_text_centered(draw, "UNIT 1", 580, load_font(28, bold=True), coral, w)
            draw_text_centered(draw, "How Computers Work", 630, load_font(40, bold=True), ink, w)
        elif focus == "chapter":
            rounded_rect(draw, (360, 540, w - 360, 740), 28, panel, line, 3)
            draw_text_centered(draw, "CHAPTER 1 of 5", 570, load_font(26, bold=True), sage, w)
            draw_text_centered(draw, "What Is a Computer?", 640, load_font(48, bold=True), ink, w)
        elif focus == "say":
            draw_text_centered(draw, "Your turn — say it out loud!", 560, load_font(36, bold=True), coral, w)
            draw_text_centered(draw, "What Is a Computer?", 640, load_font(52, bold=True), ink, w)
        else:
            draw_text_centered(draw, "Ready? Let's learn together", 600, load_font(42, bold=True), sage, w)
        return

    if visual == "hook":
        icons = [("Phone", True), ("Lamp", False), ("Toaster", False), ("Laptop", True)]
        if focus in ("look", "ask"):
            box_w = 280
            gap = 36
            total = 4 * box_w + 3 * gap
            x0 = (w - total) // 2
            for i, (name, _) in enumerate(icons):
                x = x0 + i * (box_w + gap)
                rounded_rect(draw, (x, 340, x + box_w, 560), 24, panel, line, 3)
                draw_text_centered_in = name
                draw.text((x + 70, 430), draw_text_centered_in, fill=ink, font=load_font(34, bold=True))
            if focus == "ask":
                draw_text_centered(draw, "Are ALL of these computers?", 620, load_font(40, bold=True), coral, w)
        elif focus == "think":
            # Interactive pause plate
            pulse = 0.92 + 0.08 * math.sin(progress * math.pi * 4)
            r = int(130 * pulse)
            draw.ellipse((w // 2 - r, 380 - r, w // 2 + r, 380 + r), fill=coral)
            draw_text_centered(draw, "YOUR TURN", 360, load_font(36, bold=True), panel, w)
            draw_text_centered(draw, "Point to a computer!", 520, load_font(44, bold=True), ink, w)
            draw_text_centered(draw, "Take your time…", 600, load_font(30), muted, w)
        else:
            draw_mascot(draw, w // 2, 400, 100, sage, panel, bounce)
            draw_text_centered(draw, "We'll check your answer soon", 580, load_font(40, bold=True), ink, w)
        return

    if visual == "ipo":
        cards = [
            ("input", "INPUT", "Something goes in", coral),
            ("process", "PROCESS", "It thinks / works", sage),
            ("output", "OUTPUT", "Something comes out", coral),
        ]
        box_w, box_h = 420, 230
        gap = 48
        total = 3 * box_w + 2 * gap
        x0 = (w - total) // 2
        y = 300
        order = {"intro": -1, "input": 0, "process": 1, "output": 2, "all": 2, "rule": 2}
        active = order.get(focus, -1)
        for i, (_, title, sub, accent) in enumerate(cards):
            scale = 1.0
            if i == active and focus not in ("all", "rule", "intro"):
                scale = 1.0 + 0.05 * math.sin(progress * math.pi)
            elif focus in ("all", "rule"):
                scale = 1.03
            elif active >= 0 and i > active:
                scale = 0.92
            x = x0 + i * (box_w + gap)
            draw_card(
                draw,
                (x, y, x + box_w, y + box_h),
                brand,
                accent,
                title,
                sub,
                scale=scale,
                dim=active >= 0 and focus not in ("all", "rule", "intro") and i != active,
            )
            if i < 2 and (focus in ("all", "rule") or (active >= 0 and i < active)):
                ax = x + box_w + 10
                ay = y + box_h // 2
                draw.polygon([(ax, ay - 16), (ax + 28, ay), (ax, ay + 16)], fill=muted)
        if focus == "rule":
            draw_text_centered(draw, "All 3 jobs → we call it a computer", 620, load_font(36, bold=True), sage, w)
        if focus == "all":
            draw_text_centered(draw, "Say it with me!", 620, load_font(36, bold=True), coral, w)
        return

    if visual == "story-message":
        if focus == "intro":
            draw_text_centered(draw, "Story time", 340, load_font(32, bold=True), coral, w)
            draw_text_centered(draw, "Sending a message on a phone", 420, load_font(46, bold=True), ink, w)
            draw_mascot(draw, w // 2, 620, 90, sage, panel, bounce)
            return
        if focus == "devices":
            for i, name in enumerate(["Laptop", "Phone", "Tablet"]):
                x = 280 + i * 480
                rounded_rect(draw, (x, 340, x + 400, 620), 28, panel, line, 3)
                draw.rectangle((x, 340, x + 400, 354), fill=sage)
                draw.text((x + 110, 440), name, fill=ink, font=load_font(40, bold=True))
                draw.text((x + 90, 520), "Computer ✓", fill=sage, font=load_font(28, bold=True))
            return
        if focus == "phone":
            rounded_rect(draw, (460, 320, w - 460, 680), 28, panel, line, 3)
            draw_text_centered(draw, "Phone did all 3 jobs", 420, load_font(40, bold=True), ink, w)
            draw_text_centered(draw, "Phone = COMPUTER ✓", 520, load_font(48, bold=True), sage, w)
            return
        steps = [
            ("step1", "1 · You type", "INPUT"),
            ("step2", "2 · Phone works", "PROCESS"),
            ("step3", "3 · Friend sees it", "OUTPUT"),
        ]
        focus_i = next((i for i, s in enumerate(steps) if s[0] == focus), 0)
        for i, (key, title, sub) in enumerate(steps):
            if i > focus_i:
                continue
            y = 300 + i * 130
            a = ease_out_cubic(min(1.0, progress * 1.8)) if key == focus else 1.0
            y_draw = y + int((1 - a) * 20)
            accent = sage if sub == "PROCESS" else coral
            rounded_rect(draw, (200, y_draw, w - 200, y_draw + 105), 24, panel, line, 3)
            draw.ellipse((240, y_draw + 22, 300, y_draw + 82), fill=accent)
            draw.text((258, y_draw + 36), str(i + 1), fill=panel, font=load_font(32, bold=True))
            draw.text((340, y_draw + 24), title, fill=ink, font=load_font(36, bold=True))
            draw.text((340, y_draw + 68), sub, fill=muted, font=load_font(24))
        return

    if visual == "story-bulb":
        if focus in ("intro", "shine"):
            # Switch + bulb
            cx = w // 2
            draw.ellipse((cx - 80, 300, cx + 80, 460), fill=(255, 220, 120) if focus == "shine" else (230, 230, 220))
            draw.rectangle((cx - 20, 460, cx + 20, 560), fill=muted)
            draw_text_centered(
                draw,
                "Press switch → bulb shines",
                620,
                load_font(40, bold=True),
                ink,
                w,
            )
            return
        if focus in ("not-think", "not"):
            rounded_rect(draw, (320, 300, w - 320, 700), 28, panel, line, 3)
            draw_text_centered(draw, "Bulb / Toaster", 380, load_font(40, bold=True), ink, w)
            draw_text_centered(draw, "Useful… but NOT a computer", 480, load_font(44, bold=True), coral, w)
            draw_text_centered(draw, "No real input → process → output", 580, load_font(30), muted, w)
            return
        draw_text_centered(draw, "Computers work in a smarter way", 420, load_font(44, bold=True), sage, w)
        draw_text_centered(draw, "INPUT → PROCESS → OUTPUT", 520, load_font(40, bold=True), ink, w)
        return

    if visual == "yesno":
        if focus == "intro":
            draw_text_centered(draw, "Quick game!", 360, load_font(36, bold=True), coral, w)
            draw_text_centered(draw, "Say YES or NO out loud", 460, load_font(52, bold=True), ink, w)
            draw_text_centered(draw, "I name it — you answer!", 560, load_font(32), muted, w)
            return
        if focus == "highfive":
            draw_mascot(draw, w // 2, 400, 120, sage, panel, bounce)
            draw_text_centered(draw, "High five! You're amazing", 600, load_font(44, bold=True), coral, w)
            return
        items = {
            "laptop": ("Laptop", True),
            "phone": ("Phone", True),
            "tablet": ("Tablet", True),
            "toaster": ("Toaster", False),
            "lamp": ("Lamp", False),
        }
        name, ok = items.get(focus, ("?", True))
        accent = sage if ok else coral
        badge = "YES ✓" if ok else "NO ✗"
        rounded_rect(draw, (520, 300, w - 520, 720), 32, panel, line, 4)
        draw_text_centered(draw, name, 380, load_font(56, bold=True), ink, w)
        rounded_rect(draw, (760, 500, w - 760, 620), 24, accent)
        draw_text_centered(draw, badge, 530, load_font(48, bold=True), panel, w)
        return

    if visual == "checkpoint":
        if focus == "intro":
            draw_text_centered(draw, "Practice check", 380, load_font(32, bold=True), coral, w)
            draw_text_centered(draw, "Same kind of question as your lesson check", 480, load_font(36, bold=True), ink, w)
            return
        if focus == "ask":
            options = ["Laptop", "Lamp", "Bicycle bell"]
            draw_text_centered(draw, "Which one is a computer?", 300, load_font(40, bold=True), ink, w)
            for i, opt in enumerate(options):
                x = 220 + i * 520
                rounded_rect(draw, (x, 400, x + 440, 620), 28, panel, line, 3)
                draw_text_centered_x = x + 220
                bbox = draw.textbbox((0, 0), opt, font=load_font(36, bold=True))
                tw = bbox[2] - bbox[0]
                draw.text((draw_text_centered_x - tw // 2, 480), opt, fill=ink, font=load_font(36, bold=True))
            pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 3)
            draw_text_centered(draw, "Think… then choose!", int(680 + 6 * pulse), load_font(30, bold=True), coral, w)
            return
        if focus == "answer":
            rounded_rect(draw, (420, 320, w - 420, 700), 28, panel, line, 3)
            draw_text_centered(draw, "Answer: Laptop ✓", 420, load_font(48, bold=True), sage, w)
            draw_text_centered(draw, "Input → Process → Output", 540, load_font(34, bold=True), ink, w)
            return
        draw_text_centered(draw, "Lamp & bicycle bell", 400, load_font(40, bold=True), ink, w)
        draw_text_centered(draw, "Helpful — but not computers", 500, load_font(40, bold=True), coral, w)
        return

    if visual == "recap":
        if focus == "ipo":
            for i, word in enumerate(["INPUT", "PROCESS", "OUTPUT"]):
                y = 300 + i * 120
                accent = sage if i == 1 else coral
                rounded_rect(draw, (400, y, w - 400, y + 95), 24, panel, line, 3)
                draw.ellipse((440, y + 18, 500, y + 78), fill=accent)
                draw.text((540, y + 24), word, fill=ink, font=load_font(40, bold=True))
            return
        if focus == "list":
            rounded_rect(draw, (200, 300, 900, 700), 28, panel, line, 3)
            draw.text((260, 340), "Computers", fill=sage, font=load_font(32, bold=True))
            draw.text((260, 420), "• Phone", fill=ink, font=load_font(34, bold=True))
            draw.text((260, 490), "• Laptop", fill=ink, font=load_font(34, bold=True))
            draw.text((260, 560), "• Tablet", fill=ink, font=load_font(34, bold=True))
            rounded_rect(draw, (1020, 300, 1720, 700), 28, panel, line, 3)
            draw.text((1080, 340), "Not computers", fill=coral, font=load_font(32, bold=True))
            draw.text((1080, 450), "• Toaster", fill=ink, font=load_font(34, bold=True))
            draw.text((1080, 530), "• Lamp", fill=ink, font=load_font(34, bold=True))
            return
        if focus == "done":
            draw_mascot(draw, w // 2, 400, 110, sage, panel, bounce)
            draw_text_centered(draw, "Chapter 1 complete!", 580, load_font(48, bold=True), ink, w)
            return
        draw_text_centered(draw, "Next up: Quiz time", 400, load_font(44, bold=True), coral, w)
        draw_text_centered(draw, "Tap Finish when you're ready, champ!", 520, load_font(36, bold=True), ink, w)
        return

    # ─── A2 · How Computers Understand Us ─────────────────────────────
    if visual == "a2-welcome":
        draw_mascot(draw, w // 2, 400, 110, sage, panel, bounce)
        if focus == "hello":
            draw_text_centered(draw, "Welcome back to class", 580, load_font(42, bold=True), ink, w)
        elif focus == "bridge":
            rounded_rect(draw, (420, 540, w - 420, 700), 28, panel, line, 3)
            draw_text_centered(draw, "Chapter 1 → Chapter 2", 580, load_font(28, bold=True), coral, w)
            draw_text_centered(draw, "What is a computer? → How it understands us", 640, load_font(28, bold=True), ink, w)
        elif focus == "chapter":
            rounded_rect(draw, (340, 520, w - 340, 740), 28, panel, line, 3)
            draw_text_centered(draw, "CHAPTER 2 of 5", 560, load_font(26, bold=True), sage, w)
            draw_text_centered(draw, "How Computers Understand Us", 630, load_font(42, bold=True), ink, w)
        elif focus == "say":
            draw_text_centered(draw, "Your turn — say it out loud!", 540, load_font(34, bold=True), coral, w)
            draw_text_centered(draw, "How Computers Understand Us", 620, load_font(44, bold=True), ink, w)
        else:
            draw_text_centered(draw, "Ready for the secret?", 580, load_font(44, bold=True), sage, w)
        return

    if visual == "a2-hook":
        if focus == "puzzle":
            rounded_rect(draw, (360, 300, w - 360, 680), 28, panel, line, 3)
            draw_text_centered(draw, "Puzzle time", 360, load_font(30, bold=True), coral, w)
            draw_text_centered(draw, "Computers are clever…", 460, load_font(40, bold=True), ink, w)
            draw_text_centered(draw, "but they don't speak like us!", 540, load_font(36, bold=True), muted, w)
        elif focus == "ask":
            draw_text_centered(draw, "How do they understand", 360, load_font(40, bold=True), ink, w)
            draw_text_centered(draw, "games · photos · messages?", 460, load_font(44, bold=True), coral, w)
            for i, label in enumerate(["🎮", "📷", "💬"]):
                x = 520 + i * 300
                rounded_rect(draw, (x, 540, x + 240, 680), 24, panel, line, 3)
                draw_text_centered_x = x + 120
                # emoji may not render on all fonts — use words
                words = ["Game", "Photo", "Message"]
                bbox = draw.textbbox((0, 0), words[i], font=load_font(32, bold=True))
                tw = bbox[2] - bbox[0]
                draw.text((draw_text_centered_x - tw // 2, 590), words[i], fill=ink, font=load_font(32, bold=True))
        elif focus == "think":
            pulse = 0.92 + 0.08 * math.sin(progress * math.pi * 4)
            r = int(130 * pulse)
            draw.ellipse((w // 2 - r, 380 - r, w // 2 + r, 380 + r), fill=coral)
            draw_text_centered(draw, "YOUR TURN", 360, load_font(36, bold=True), panel, w)
            draw_text_centered(draw, "Guess how a computer talks!", 520, load_font(40, bold=True), ink, w)
            draw_text_centered(draw, "3… 2… 1…", 600, load_font(30), muted, w)
        else:
            draw_mascot(draw, w // 2, 380, 100, sage, panel, bounce)
            draw_text_centered(draw, "We'll prove it with light switches", 580, load_font(38, bold=True), ink, w)
        return

    if visual == "a2-switch":
        # Big light switch + 0/1 mapping
        cx, cy = w // 2, 420
        on = focus in ("switch", "say", "map", "easy")
        # plate
        rounded_rect(draw, (cx - 160, cy - 200, cx + 160, cy + 200), 36, panel, line, 4)
        # toggle track
        track_fill = sage if on and focus != "intro" else (200, 200, 205)
        if focus == "intro":
            track_fill = (200, 200, 205)
        rounded_rect(draw, (cx - 50, cy - 140, cx + 50, cy + 140), 28, track_fill)
        # knob position
        if focus in ("map", "easy") or (focus == "switch" and progress > 0.35):
            knob_y = cy - 90  # up = ON
            knob_label = "ON"
            kn_accent = sage
        elif focus == "say":
            # flip mid animation feel
            knob_y = cy - int(90 * math.sin(progress * math.pi))
            knob_label = "ON / OFF"
            kn_accent = coral
        else:
            knob_y = cy + 70  # down = OFF
            knob_label = "OFF"
            kn_accent = muted
        draw.ellipse((cx - 70, knob_y - 55, cx + 70, knob_y + 55), fill=kn_accent)
        bbox = draw.textbbox((0, 0), knob_label, font=load_font(26, bold=True))
        tw = bbox[2] - bbox[0]
        draw.text((cx - tw // 2, knob_y - 14), knob_label, fill=panel, font=load_font(26, bold=True))

        if focus == "intro":
            draw_text_centered(draw, "Only TWO states inside", 700, load_font(40, bold=True), ink, w)
        elif focus == "switch":
            draw_text_centered(draw, "ON  ·  or  ·  OFF", 700, load_font(44, bold=True), ink, w)
        elif focus == "say":
            draw_text_centered(draw, "Say it: On… or off!", 700, load_font(40, bold=True), coral, w)
        elif focus == "map":
            # two cards
            rounded_rect(draw, (280, 680, 720, 860), 24, panel, line, 3)
            draw.text((360, 720), "ON  →  1", fill=sage, font=load_font(40, bold=True))
            rounded_rect(draw, (1200, 680, 1640, 860), 24, panel, line, 3)
            draw.text((1260, 720), "OFF  →  0", fill=coral, font=load_font(40, bold=True))
        else:
            draw_text_centered(draw, "1 means on · 0 means off · Easy!", 700, load_font(40, bold=True), sage, w)
        return

    if visual == "a2-binary":
        def draw_three_lights(pattern: list[int], labels: bool = True) -> None:
            # pattern: 1=on, 0=off for left, mid, right
            labels_txt = ["Left", "Middle", "Right"]
            box_w = 280
            gap = 60
            total = 3 * box_w + 2 * gap
            x0 = (w - total) // 2
            for i, bit in enumerate(pattern):
                x = x0 + i * (box_w + gap)
                on = bit == 1
                accent = sage if on else muted
                rounded_rect(draw, (x, 300, x + box_w, 620), 28, panel, line, 3)
                # bulb
                r = 70
                bx, by = x + box_w // 2, 420
                glow = (255, 230, 120) if on else (220, 220, 215)
                draw.ellipse((bx - r, by - r, bx + r, by + r), fill=glow)
                draw.rectangle((bx - 18, by + r - 10, bx + 18, by + r + 50), fill=muted)
                bit_s = "1" if on else "0"
                state = "ON" if on else "OFF"
                draw.text((x + 100, 540), f"{bit_s}  {state}", fill=accent, font=load_font(32, bold=True))
                if labels:
                    draw.text((x + 90, 260), labels_txt[i], fill=muted, font=load_font(24, bold=True))

        if focus == "row":
            draw_three_lights([0, 0, 0], labels=True)
            draw_text_centered(draw, "Three switches in a row", 680, load_font(36, bold=True), ink, w)
        elif focus == "each":
            draw_three_lights([1, 0, 1], labels=True)
            draw_text_centered(draw, "Each switch = 1 or 0", 680, load_font(36, bold=True), ink, w)
        elif focus == "pat001":
            draw_three_lights([0, 0, 1])
            draw_text_centered(draw, "0  0  1", 680, load_font(52, bold=True), sage, w)
        elif focus == "pat101":
            draw_three_lights([1, 0, 1])
            draw_text_centered(draw, "1  0  1", 680, load_font(52, bold=True), coral, w)
        elif focus == "name":
            rounded_rect(draw, (400, 320, w - 400, 700), 32, panel, line, 4)
            draw_text_centered(draw, "BINARY", 420, load_font(56, bold=True), coral, w)
            draw_text_centered(draw, "Bi = two", 520, load_font(40, bold=True), ink, w)
            draw_text_centered(draw, "Only two choices: 0 or 1", 600, load_font(34, bold=True), muted, w)
        else:
            draw_mascot(draw, w // 2, 380, 100, sage, panel, bounce)
            draw_text_centered(draw, "Binary = light-switch language", 580, load_font(40, bold=True), ink, w)
        return

    if visual == "a2-read":
        patterns = {
            "p1": ([0, 0, 1], "0 0 1"),
            "p2": ([1, 1, 0], "1 1 0"),
            "p3": ([1, 0, 1], "1 0 1"),
        }
        if focus == "intro":
            draw_text_centered(draw, "Read the lights out loud!", 400, load_font(44, bold=True), ink, w)
            draw_text_centered(draw, "I show · you say zeros and ones", 520, load_font(32), muted, w)
            return
        if focus == "done":
            draw_mascot(draw, w // 2, 380, 110, sage, panel, bounce)
            draw_text_centered(draw, "Super reading, champ!", 580, load_font(44, bold=True), coral, w)
            return
        pat, code = patterns.get(focus, ([0, 0, 0], "???") )
        box_w = 260
        gap = 50
        total = 3 * box_w + 2 * gap
        x0 = (w - total) // 2
        for i, bit in enumerate(pat):
            x = x0 + i * (box_w + gap)
            on = bit == 1
            rounded_rect(draw, (x, 280, x + box_w, 560), 28, panel, line, 3)
            glow = (255, 230, 120) if on else (220, 220, 215)
            bx, by = x + box_w // 2, 400
            draw.ellipse((bx - 60, by - 60, bx + 60, by + 60), fill=glow)
            draw.text((x + 100, 500), "1" if on else "0", fill=sage if on else muted, font=load_font(40, bold=True))
        draw_text_centered(draw, code, 640, load_font(56, bold=True), ink, w)
        draw_text_centered(draw, "Say it!", 720, load_font(32, bold=True), coral, w)
        return

    if visual == "a2-check":
        if focus == "intro":
            draw_text_centered(draw, "Practice check", 400, load_font(36, bold=True), coral, w)
            draw_text_centered(draw, "Same kind of question as your lesson check", 500, load_font(34, bold=True), ink, w)
            return
        if focus == "ask":
            rounded_rect(draw, (360, 300, w - 360, 700), 28, panel, line, 3)
            draw_text_centered(draw, "If 1 means ON…", 380, load_font(32, bold=True), muted, w)
            draw_text_centered(draw, "What does 1 0 1 mean?", 480, load_font(48, bold=True), ink, w)
            draw_text_centered(draw, "on three lights?", 580, load_font(36, bold=True), coral, w)
            return
        if focus == "hint":
            for i, (lab, bit) in enumerate([("Left", "?"), ("Middle", "?"), ("Right", "?")]):
                x = 280 + i * 480
                rounded_rect(draw, (x, 340, x + 400, 620), 28, panel, line, 3)
                draw_text_centered_x = x + 200
                bbox = draw.textbbox((0, 0), lab, font=load_font(28, bold=True))
                tw = bbox[2] - bbox[0]
                draw.text((draw_text_centered_x - tw // 2, 400), lab, fill=muted, font=load_font(28, bold=True))
                draw.text((draw_text_centered_x - 20, 500), bit, fill=coral, font=load_font(48, bold=True))
            draw_text_centered(draw, "Think… then answer!", 700, load_font(32, bold=True), coral, w)
            return
        # answer
        for i, (lab, on) in enumerate([("Left", True), ("Middle", False), ("Right", True)]):
            x = 280 + i * 480
            accent = sage if on else muted
            rounded_rect(draw, (x, 300, x + 400, 620), 28, panel, line, 3)
            glow = (255, 230, 120) if on else (220, 220, 215)
            draw.ellipse((x + 120, 360, x + 280, 520), fill=glow)
            state = "ON" if on else "OFF"
            draw.text((x + 140, 540), f"{'1' if on else '0'}  {state}", fill=accent, font=load_font(32, bold=True))
        draw_text_centered(draw, "101 → ON · OFF · ON  ✓", 700, load_font(40, bold=True), sage, w)
        return

    if visual == "a2-why":
        if focus == "why":
            items = [("Photo", coral), ("Game", sage), ("Message", coral)]
            for i, (name, accent) in enumerate(items):
                x = 280 + i * 480
                rounded_rect(draw, (x, 320, x + 400, 560), 28, panel, line, 3)
                draw.rectangle((x, 320, x + 400, 334), fill=accent)
                draw.text((x + 120, 400), name, fill=ink, font=load_font(36, bold=True))
                draw.text((x + 90, 480), "→ 0s & 1s", fill=muted, font=load_font(28, bold=True))
            draw_text_centered(draw, "Everything becomes zeros and ones inside", 660, load_font(34, bold=True), ink, w)
        elif focus == "bridge":
            steps = ["Words (you)", "On / Off", "Pictures & sound"]
            for i, s in enumerate(steps):
                y = 320 + i * 130
                rounded_rect(draw, (420, y, w - 420, y + 100), 24, panel, line, 3)
                draw.ellipse((460, y + 20, 520, y + 80), fill=sage if i == 1 else coral)
                draw.text((460 + 18, y + 34), str(i + 1), fill=panel, font=load_font(28, bold=True))
                draw.text((560, y + 30), s, fill=ink, font=load_font(34, bold=True))
        else:
            draw_mascot(draw, w // 2, 380, 110, sage, panel, bounce)
            draw_text_centered(draw, "Binary = light-switch language!", 580, load_font(42, bold=True), coral, w)
        return

    if visual == "a2-recap":
        if focus == "map":
            rounded_rect(draw, (280, 320, 900, 680), 28, panel, line, 3)
            draw.text((400, 420), "ON  =  1", fill=sage, font=load_font(48, bold=True))
            rounded_rect(draw, (1020, 320, 1640, 680), 28, panel, line, 3)
            draw.text((1120, 420), "OFF  =  0", fill=coral, font=load_font(48, bold=True))
            return
        if focus == "binary":
            rounded_rect(draw, (400, 340, w - 400, 680), 32, panel, line, 4)
            draw_text_centered(draw, "BINARY", 420, load_font(52, bold=True), coral, w)
            draw_text_centered(draw, "the computer's special language", 540, load_font(34, bold=True), ink, w)
            return
        if focus == "read":
            draw_text_centered(draw, "1 0 1", 380, load_font(64, bold=True), ink, w)
            draw_text_centered(draw, "→  on · off · on", 520, load_font(44, bold=True), sage, w)
            return
        if focus == "done":
            draw_mascot(draw, w // 2, 400, 110, sage, panel, bounce)
            draw_text_centered(draw, "Chapter 2 complete!", 580, load_font(48, bold=True), ink, w)
            return
        draw_text_centered(draw, "Next up: Quiz time", 400, load_font(44, bold=True), coral, w)
        draw_text_centered(draw, "Tap Finish when you're ready, champ!", 520, load_font(36, bold=True), ink, w)
        return

    # fallback
    draw_text_centered(draw, focus, 420, load_font(40, bold=True), ink, w)


def render_frame(
    brand: dict[str, str],
    title: str,
    unit_label: str,
    chapter_label: str,
    visual: str,
    focus: str,
    caption: str,
    progress: float,
    width: int,
    height: int,
    scene_pos: tuple[int, int] | None = None,
    supersample: int = 1,
) -> Image.Image:
    k = max(1, supersample)
    img = Image.new("RGB", (width * k, height * k), hex_rgb(brand["bg"]))
    paint_background(img, brand, progress)
    draw = ImageDraw.Draw(img) if k == 1 else ScaledDraw(ImageDraw.Draw(img), k)
    draw_top_bar(draw, brand, title, unit_label, chapter_label, width)
    if scene_pos:
        draw_scene_dots(draw, brand, scene_pos[0], scene_pos[1], width)
    render_visual(img, draw, brand, visual, focus, progress, width, height)
    draw_caption_bar(draw, brand, caption, width, height, min(1.0, progress * 3))
    return img if k == 1 else img.reduce(k)


def render_beat_job(job: dict[str, Any]) -> int:
    """Render every frame of one beat (worker-safe; crossfade uses the previous beat's final frame)."""
    common = job["common"]

    def frame(b: dict[str, Any], progress: float) -> Image.Image:
        return render_frame(
            common["brand"], common["title"], common["unit_label"], common["chapter_label"],
            b["visual"], b["focus"], b["caption"], progress,
            common["width"], common["height"], b["scene_pos"], common["supersample"],
        )

    prev_last = frame(job["prev"], 1.0) if job["prev"] is not None else None
    n = job["n"]
    fade_frames = common["fade_frames"]
    for f in range(n):
        img = frame(job["beat"], f / max(n - 1, 1))
        if prev_last is not None and f < fade_frames:
            img = Image.blend(prev_last, img, ease_in_out((f + 1) / (fade_frames + 1)))
        img.save(Path(common["frames_dir"]) / f"frame_{job['start'] + f:05d}.png", compress_level=1)
    return n


def concat_wavs(paths: list[Path], out_path: Path) -> None:
    # Use ffmpeg concat for robust audio join
    list_file = out_path.with_suffix(".txt")
    list_file.write_text(
        "\n".join(f"file '{p.resolve()}'" for p in paths),
        encoding="utf-8",
    )
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-c",
            "copy",
            str(out_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    list_file.unlink(missing_ok=True)


def fmt_vtt(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h, rem = divmod(ms, 3_600_000)
    m, rem = divmod(rem, 60_000)
    s, milli = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{milli:03d}"


def write_captions(cues: list[dict[str, Any]], lesson_dir: Path) -> None:
    lines = ["WEBVTT", ""]
    for i, cue in enumerate(cues, start=1):
        lines.append(str(i))
        lines.append(f"{fmt_vtt(cue['start'])} --> {fmt_vtt(cue['end'])}")
        lines.append(cue["caption"])
        lines.append("")
    (lesson_dir / "captions.vtt").write_text("\n".join(lines), encoding="utf-8")
    (lesson_dir / "transcript.json").write_text(
        json.dumps({"cues": cues}, indent=2),
        encoding="utf-8",
    )


def mux(frames_dir: Path, audio: Path, out_mp4: Path, fps: int, vtt: Path,
        crf: int = 18, preset: str = "medium") -> None:
    # Burn soft captions as movable track + hard-burn is already in frames.
    # Also attach soft VTT for LMS.
    cmd = [
        FFMPEG,
        "-y",
        "-framerate",
        str(fps),
        "-i",
        str(frames_dir / "frame_%05d.png"),
        "-i",
        str(audio),
        "-c:v",
        "libx264",
        "-preset",
        preset,
        "-crf",
        str(crf),
        "-tune",
        "animation",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        "-movflags",
        "+faststart",
        str(out_mp4),
    ]
    subprocess.run(cmd, check=True)


async def build_async(lesson_dir: Path) -> Path:
    meta = json.loads((lesson_dir / "scenes.json").read_text(encoding="utf-8"))
    brand = meta["brand"]
    fps = int(meta["fps"])
    width = int(meta["width"])
    height = int(meta["height"])
    voice = meta["voice"]
    rate = meta.get("voiceRate", "+0%")
    pitch = meta.get("voicePitch", "+0Hz")
    trim = bool(meta.get("trimSilence"))
    beat_gap = float(meta.get("beatGap", 0.22))
    title = meta["title"]
    unit_label = meta.get("unitLabel", "CS · Lesson")
    chapter_label = meta.get("chapterLabel", "Chapter 1")

    work = lesson_dir / "_build"
    if work.exists():
        shutil.rmtree(work)
    audio_dir = work / "audio"
    frames_dir = work / "frames"
    audio_dir.mkdir(parents=True)
    frames_dir.mkdir(parents=True)

    flat_beats: list[dict[str, Any]] = []
    print("1/4  Indian English mentoring voice (Edge neural TTS)…")
    for scene in meta["scenes"]:
        for bi, beat in enumerate(scene["beats"]):
            mp3 = audio_dir / f"{scene['id']}_{bi}.mp3"
            dur, wav = await synthesize_beat(beat["vo"], voice, rate, mp3, pitch=pitch, trim=trim)
            # natural pause + optional interactive think-time
            pad = beat_gap + float(beat.get("pause") or 0)
            flat_beats.append(
                {
                    "scene_id": scene["id"],
                    "visual": scene["visual"],
                    "focus": beat["focus"],
                    "caption": beat["caption"],
                    "vo": beat["vo"],
                    "duration": dur + pad,
                    "wav": wav,
                    "pad": pad,
                    "sfx": beat.get("sfx"),
                    "sfx_at": float(beat.get("sfxAt") or 0),
                }
            )
            print(f"   · {scene['id']}/{beat['focus']}: {dur:.2f}s (+{pad:.1f}s)")

    # Pad each wav
    padded: list[Path] = []
    for i, beat in enumerate(flat_beats):
        pad_path = audio_dir / f"pad_{i:03d}.wav"
        if beat["pad"] > 0.01:
            subprocess.run(
                [
                    FFMPEG,
                    "-y",
                    "-i",
                    str(beat["wav"]),
                    "-af",
                    f"apad=pad_dur={beat['pad']:.3f}",
                    str(pad_path),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        else:
            shutil.copy(beat["wav"], pad_path)
        padded.append(pad_path)

    voiceover = lesson_dir / "voiceover.wav"
    concat_wavs(padded, voiceover)
    if meta.get("voicePolish"):
        polished = work / "polished.wav"
        subprocess.run(
            [FFMPEG, "-y", "-i", str(voiceover), "-af", VOICE_POLISH_AF, "-ar", "44100", "-ac", "1", str(polished)],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        shutil.move(str(polished), str(voiceover))

    print("2/4  Rendering production frames (synced to speech)…")
    frame_i = 0
    cues: list[dict[str, Any]] = []
    sfx_events: list[tuple[float, str, float]] = []
    cursor = 0.0
    scene_ids = [s["id"] for s in meta["scenes"]]
    show_dots = bool(meta.get("sceneDots"))
    crossfade = meta.get("transition") == "crossfade"
    common = {
        "brand": brand,
        "title": title,
        "unit_label": unit_label,
        "chapter_label": chapter_label,
        "width": width,
        "height": height,
        "supersample": int(meta.get("supersample") or 1),
        "fade_frames": max(1, int(round(float(meta.get("fadeSec", 0.28)) * fps))),
        "frames_dir": str(frames_dir),
    }
    jobs: list[dict[str, Any]] = []
    prev_ref: dict[str, Any] | None = None
    for beat in flat_beats:
        n = max(1, int(round(beat["duration"] * fps)))
        cues.append(
            {
                "start": round(cursor, 3),
                "end": round(cursor + beat["duration"], 3),
                "caption": beat["caption"],
                "text": beat["vo"],
                "scene": beat["scene_id"],
                "focus": beat["focus"],
            }
        )
        if beat.get("sfx"):
            sfx_events.append((cursor + beat["sfx_at"] * beat["duration"], beat["sfx"], 1.0))
        ref = {
            "visual": beat["visual"],
            "focus": beat["focus"],
            "caption": beat["caption"],
            "scene_pos": (scene_ids.index(beat["scene_id"]), len(scene_ids)) if show_dots else None,
        }
        jobs.append({
            "common": common,
            "beat": ref,
            "prev": prev_ref if crossfade else None,
            "n": n,
            "start": frame_i,
        })
        prev_ref = ref
        frame_i += n
        cursor += beat["duration"]

    workers = max(1, min(int(meta.get("workers") or (os.cpu_count() or 2) - 1), len(jobs)))
    done = 0
    if workers == 1:
        for job in jobs:
            done += render_beat_job(job)
            print(f"   · frames {done}/{frame_i}")
    else:
        with multiprocessing.get_context("spawn").Pool(workers) as pool:
            for n_done in pool.imap_unordered(render_beat_job, jobs):
                done += n_done
                print(f"   · frames {done}/{frame_i}")

    if sfx_events:
        print("   · mixing sound effects…")
        sfx_wav = work / "sfx.wav"
        write_sfx_track(sfx_events, cursor, sfx_wav)
        mixed = work / "mixed.wav"
        subprocess.run(
            [
                FFMPEG, "-y", "-i", str(voiceover), "-i", str(sfx_wav),
                "-filter_complex",
                f"[1:a]volume={float(meta.get('sfxVolume') or 0.5):.2f}[s];[0:a][s]amix=inputs=2:duration=first:normalize=0",
                "-ar", "44100", str(mixed),
            ],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        shutil.move(str(mixed), str(voiceover))

    print("3/4  Writing captions + transcript…")
    write_captions(cues, lesson_dir)

    print("4/4  Encoding MP4…")
    out_mp4 = lesson_dir / "final.mp4"
    mux(frames_dir, voiceover, out_mp4, fps, lesson_dir / "captions.vtt",
        crf=int(meta.get("crf", 18)), preset=str(meta.get("x264Preset", "medium")))

    # Publish into Next public for LMS (module id from scenes.json)
    module_id = str(meta.get("id") or "A1").upper()
    public_dir = ROOT / "public" / "learn" / "lessons"
    public_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(out_mp4, public_dir / f"{module_id}.mp4")
    shutil.copy2(lesson_dir / "captions.vtt", public_dir / f"{module_id}.vtt")
    shutil.copy2(lesson_dir / "transcript.json", public_dir / f"{module_id}.transcript.json")

    shutil.rmtree(work, ignore_errors=True)
    mb = out_mp4.stat().st_size / (1024 * 1024)
    print(f"Done → {out_mp4} ({mb:.1f} MB, ~{cursor:.0f}s)")
    print(f"LMS  → /learn/app/lesson/{module_id}")
    return out_mp4


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: build.py <lesson-dir>")
    lesson = Path(sys.argv[1])
    if not lesson.is_absolute():
        lesson = ROOT / lesson
    asyncio.run(build_async(lesson))


if __name__ == "__main__":
    main()
