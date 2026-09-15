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
) -> Image.Image:
    img = Image.new("RGB", (width, height), hex_rgb(brand["bg"]))
    paint_background(img, brand, progress)
    draw = ImageDraw.Draw(img)
    draw_top_bar(draw, brand, title, unit_label, chapter_label, width)
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
            )
            img.save(frames_dir / f"frame_{frame_i:05d}.png")
            frame_i += 1
            if frame_i % 100 == 0:
                print(f"   · frames {frame_i}…")
        cursor += beat["duration"]

    print("3/4  Writing captions + transcript…")
    write_captions(cues, lesson_dir)

    print("4/4  Encoding MP4…")
    out_mp4 = lesson_dir / "final.mp4"
    mux(frames_dir, voiceover, out_mp4, fps, lesson_dir / "captions.vtt")

    # Publish into Next public for LMS
    public_dir = ROOT / "public" / "learn" / "lessons"
    public_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(out_mp4, public_dir / "A1.mp4")
    shutil.copy2(lesson_dir / "captions.vtt", public_dir / "A1.vtt")
    shutil.copy2(lesson_dir / "transcript.json", public_dir / "A1.transcript.json")

    shutil.rmtree(work, ignore_errors=True)
    mb = out_mp4.stat().st_size / (1024 * 1024)
    print(f"Done → {out_mp4} ({mb:.1f} MB, ~{cursor:.0f}s)")
    print(f"LMS  → /learn/app/lesson/A1")
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
