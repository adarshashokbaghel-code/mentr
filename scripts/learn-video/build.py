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
import shutil
import subprocess
import sys
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


async def synthesize_beat(
    text: str, voice: str, rate: str, out_mp3: Path
) -> tuple[float, Path]:
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate)
    await communicate.save(str(out_mp3))
    wav = out_mp3.with_suffix(".wav")
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(out_mp3),
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
        gdraw.ellipse((w - 720, -220, w + 220, 520), fill=hex_rgb(brand["coral"]) + (36,))
        gdraw.ellipse((-220, h - 520, 620, h + 220), fill=hex_rgb(brand["sage"]) + (28,))
        glow = glow.filter(ImageFilter.GaussianBlur(90))
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
) -> Image.Image:
    img = Image.new("RGB", (width, height), hex_rgb(brand["bg"]))
    paint_background(img, brand, progress)
    draw = ImageDraw.Draw(img)
    draw_top_bar(draw, brand, title, unit_label, chapter_label, width)
    if scene_pos:
        draw_scene_dots(draw, brand, scene_pos[0], scene_pos[1], width)
    render_visual(img, draw, brand, visual, focus, progress, width, height)
    draw_caption_bar(draw, brand, caption, width, height, min(1.0, progress * 3))
    return img


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


def mux(frames_dir: Path, audio: Path, out_mp4: Path, fps: int, vtt: Path) -> None:
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
        "medium",
        "-crf",
        "18",
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
            dur, wav = await synthesize_beat(beat["vo"], voice, rate, mp3)
            # natural pause + optional interactive think-time
            pad = 0.22 + float(beat.get("pause") or 0)
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

    print("2/4  Rendering production frames (synced to speech)…")
    frame_i = 0
    cues: list[dict[str, Any]] = []
    cursor = 0.0
    scene_ids = [s["id"] for s in meta["scenes"]]
    show_dots = bool(meta.get("sceneDots"))
    crossfade = meta.get("transition") == "crossfade"
    fade_frames = max(1, int(round(0.28 * fps)))
    prev_last: Image.Image | None = None
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
        for f in range(n):
            progress = f / max(n - 1, 1)
            img = render_frame(
                brand,
                title,
                unit_label,
                chapter_label,
                beat["visual"],
                beat["focus"],
                beat["caption"],
                progress,
                width,
                height,
                (scene_ids.index(beat["scene_id"]), len(scene_ids)) if show_dots else None,
            )
            if crossfade and prev_last is not None and f < fade_frames:
                img = Image.blend(prev_last, img, ease_in_out((f + 1) / (fade_frames + 1)))
            if f == n - 1:
                prev_last = img
            img.save(frames_dir / f"frame_{frame_i:05d}.png", compress_level=1)
            frame_i += 1
            if frame_i % 100 == 0:
                print(f"   · frames {frame_i}…")
        cursor += beat["duration"]

    print("3/4  Writing captions + transcript…")
    write_captions(cues, lesson_dir)

    print("4/4  Encoding MP4…")
    out_mp4 = lesson_dir / "final.mp4"
    mux(frames_dir, voiceover, out_mp4, fps, lesson_dir / "captions.vtt")

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
