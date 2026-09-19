#!/usr/bin/env python3
"""
Production Instant Connect launch promo from a parent screen recording.

- Brand font: Plus Jakarta Sans (same family as the site)
- Logo intro + outro
- Step captions synced to on-screen UI (mapped from 1fps storyboard)
- Soft lower-third + progress + ken-burns-lite crop
- ~1.6x pace for a ~24–26s launch cut

Usage:
  .venv-video/bin/python scripts/build-instant-connect-promo.py
"""

from __future__ import annotations

import math
import os
import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

try:
    import imageio_ffmpeg
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Install: .venv-video/bin/pip install pillow imageio-ffmpeg") from exc

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "videos" / "instant-connect"
SRC = OUT_DIR / "parent-raw.mov"
LOGO = ROOT / "public" / "mentr-logo.png"
FONT_PATH = OUT_DIR / "assets" / "fonts" / "PlusJakartaSans.ttf"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Brand tokens from globals.css
INK = (26, 35, 28)
CREAM = (255, 250, 245)
CREAM_BAND = (247, 240, 232)
CORAL = (255, 154, 77)
CORAL_DARK = (239, 122, 40)
MUTED = (107, 117, 110)
WHITE = (255, 255, 255)

# Source timeline (seconds) mapped from 1fps storyboard of parent-raw.mov
# Trim idle close-request tail; keep Instant Connect → dashboard track.
SEGMENTS = [
    # (src_start, src_end, step_label, headline, sub) — synced to 1fps storyboard
    (0.0, 1.5, "01", "Tap Instant Connect", "From the home screen bottom bar"),
    (1.5, 3.3, "02", "Who are you looking for?", "Tutor, mentor, or either — one tap"),
    (3.3, 7.0, "03", "Class & subject", "We’ll match mentors who teach this"),
    (7.0, 11.0, "04", "Board & mode", "Online, at home, or either"),
    (11.0, 20.5, "05", "Add a note · AI match", "Optional details refine your shortlist"),
    (20.5, 25.0, "06", "Pick mentors · share number", "Only selected mentors can call you"),
    (25.0, 28.0, "07", "You’re set", "3 mentors notified — track anytime"),
    (28.0, 31.2, "08", "Track on your dashboard", "Quick match stays live for 48 hours"),
]

SPEED = 1.62  # source → output pace
OUT_W, OUT_H = 1920, 1080
FPS = 30


def ease_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def font(size: int, weight: str = "Bold") -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONT_PATH), size=size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        try:
            f.set_variation_by_axes([700 if weight in ("Bold", "ExtraBold") else 400])
        except Exception:
            pass
    return f


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int, int, int],
    radius: int,
    fill,
) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def make_intro(path: Path, dur: float = 3.2) -> None:
    """Apple-style: Introducing → Instant Connect → by → mentr logo."""
    frames = int(dur * FPS)
    logo = Image.open(LOGO).convert("RGBA")
    target_w = 380
    logo = logo.resize(
        (target_w, int(logo.height * (target_w / logo.width))),
        Image.Resampling.LANCZOS,
    )

    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        for i in range(frames):
            t = i / FPS
            img = Image.new("RGB", (OUT_W, OUT_H), CREAM)
            # soft ambient orbs (very subtle)
            orb = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
            od = ImageDraw.Draw(orb)
            od.ellipse((OUT_W - 620, -180, OUT_W + 120, 520), fill=(*CORAL, 28))
            od.ellipse((-280, OUT_H - 420, 420, OUT_H + 120), fill=(47, 158, 110, 18))
            img = Image.alpha_composite(img.convert("RGBA"), orb).convert("RGB")
            d = ImageDraw.Draw(img)

            # Phase timings (Apple keynote pacing)
            # 0.0–0.9  Introducing
            # 0.7–1.8  Instant Connect
            # 1.5–2.2  by
            # 1.9–3.2  logo
            intro_a = ease_out(max(0.0, min(1.0, t / 0.55)))
            # fade "Introducing" out after logo arrives
            intro_fade = 1.0 if t < 2.0 else ease_out(max(0.0, 1.0 - (t - 2.0) / 0.45))
            title_a = ease_out(max(0.0, min(1.0, (t - 0.55) / 0.55)))
            by_a = ease_out(max(0.0, min(1.0, (t - 1.35) / 0.4)))
            logo_a = ease_out(max(0.0, min(1.0, (t - 1.75) / 0.55)))

            f_intro = font(58, "Medium")
            f_hero = font(68, "Bold")
            f_by = font(24, "Medium")

            def blend(c, a: float):
                return tuple(int(c[j] * a + CREAM[j] * (1 - a)) for j in range(3))

            # Introducing — large, Apple keynote style (no underline under title)
            if intro_a > 0.02 and intro_fade > 0.02:
                a = intro_a * intro_fade
                label = "Introducing"
                tw = d.textlength(label, font=f_intro)
                d.text(
                    ((OUT_W - tw) / 2, OUT_H * 0.24),
                    label,
                    font=f_intro,
                    fill=blend(MUTED, a),
                )

            # Instant Connect — clean, no underline
            if title_a > 0.02:
                title = "Instant Connect"
                tw = d.textlength(title, font=f_hero)
                y = OUT_H * 0.33
                d.text(((OUT_W - tw) / 2, y), title, font=f_hero, fill=blend(INK, title_a))

            # by
            if by_a > 0.02:
                by = "by"
                tw = d.textlength(by, font=f_by)
                d.text(
                    ((OUT_W - tw) / 2, OUT_H * 0.48),
                    by,
                    font=f_by,
                    fill=blend(MUTED, by_a),
                )

            # mentr logo — no plate, transparent over cream
            if logo_a > 0.02:
                ly = int(OUT_H * 0.54 + (1 - logo_a) * 18)
                lx = (OUT_W - logo.width) // 2
                layer = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
                layer.paste(logo, (lx, ly), logo)
                alpha = layer.split()[-1].point(lambda p: int(p * logo_a))
                layer.putalpha(alpha)
                img = Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

            img.save(td_path / f"f{i:05d}.png")

        subprocess.check_call(
            [
                FFMPEG,
                "-y",
                "-framerate",
                str(FPS),
                "-i",
                str(td_path / "f%05d.png"),
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-t",
                str(dur),
                str(path),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def make_outro(path: Path, dur: float = 2.0) -> None:
    """Cream theme outro — sleek logo, no background plate."""
    frames = int(dur * FPS)
    logo = Image.open(LOGO).convert("RGBA")
    target_w = 400
    logo = logo.resize(
        (target_w, int(logo.height * (target_w / logo.width))),
        Image.Resampling.LANCZOS,
    )
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        for i in range(frames):
            t = i / FPS
            img = Image.new("RGB", (OUT_W, OUT_H), CREAM)
            orb = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
            od = ImageDraw.Draw(orb)
            od.ellipse((OUT_W - 700, -220, OUT_W + 160, 560), fill=(*CORAL, 32))
            od.ellipse((-320, OUT_H - 480, 460, OUT_H + 140), fill=(47, 158, 110, 20))
            img = Image.alpha_composite(img.convert("RGBA"), orb).convert("RGB")

            appear = ease_out(min(1.0, t / 0.45))
            ly = int(OUT_H * 0.34 + (1 - appear) * 20)
            lx = (OUT_W - logo.width) // 2
            layer = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
            layer.paste(logo, (lx, ly), logo)
            alpha = layer.split()[-1].point(lambda p: int(p * appear))
            layer.putalpha(alpha)
            img = Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")
            d = ImageDraw.Draw(img)

            if appear > 0.15:
                h = font(36, "Bold")
                s = font(22, "Medium")
                line1 = "Try Instant Connect — free"
                line2 = "mentr.in"
                a = appear
                ink = tuple(int(INK[j] * a + CREAM[j] * (1 - a)) for j in range(3))
                muted = tuple(int(MUTED[j] * a + CREAM[j] * (1 - a)) for j in range(3))
                d.text(
                    ((OUT_W - d.textlength(line1, font=h)) / 2, OUT_H * 0.52),
                    line1,
                    font=h,
                    fill=ink,
                )
                d.text(
                    ((OUT_W - d.textlength(line2, font=s)) / 2, OUT_H * 0.52 + 52),
                    line2,
                    font=s,
                    fill=CORAL if a > 0.5 else muted,
                )
                # thin coral rule
                uw = int(72 * a)
                d.rounded_rectangle(
                    ((OUT_W - uw) // 2, int(OUT_H * 0.52) + 42, (OUT_W + uw) // 2, int(OUT_H * 0.52) + 46),
                    radius=2,
                    fill=CORAL,
                )

            img.save(td_path / f"f{i:05d}.png")
        subprocess.check_call(
            [
                FFMPEG,
                "-y",
                "-framerate",
                str(FPS),
                "-i",
                str(td_path / "f%05d.png"),
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-t",
                str(dur),
                str(path),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def build_main(path: Path) -> float:
    """Crop chrome, speed up, burn synced overlays. Returns duration seconds."""
    src_start = SEGMENTS[0][0]
    src_end = SEGMENTS[-1][1]
    src_dur = src_end - src_start
    out_dur = src_dur / SPEED

    # Precompute segment boundaries in OUTPUT time
    out_segments = []
    cursor = 0.0
    for a, b, step, head, sub in SEGMENTS:
        piece = (b - a) / SPEED
        out_segments.append((cursor, cursor + piece, step, head, sub))
        cursor += piece

    # First pass: crop + speed + scale to 1920x1080 letterbox cream
    # Cut full browser chrome (tabs + localhost URL bar + bookmarks) — start on site header
    base = OUT_DIR / "_launch_base.mp4"
    vf = (
        f"trim=start={src_start}:end={src_end},setpts=PTS-STARTPTS,"
        f"setpts=PTS/{SPEED},"
        f"crop=iw:ih*0.82:0:ih*0.145,"
        f"scale={OUT_W}:{OUT_H}:force_original_aspect_ratio=decrease,"
        f"pad={OUT_W}:{OUT_H}:(ow-iw)/2:(oh-ih)/2:color=0xFFFAF5"
    )
    subprocess.check_call(
        [
            FFMPEG,
            "-y",
            "-i",
            str(SRC),
            "-vf",
            vf,
            "-an",
            "-r",
            str(FPS),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "18",
            str(base),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    # Generate overlay PNG sequence matching out_dur
    frames = int(round(out_dur * FPS))
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        f_step = font(16, "Bold")
        f_head = font(26, "Bold")
        f_sub = font(16, "Medium")
        f_brand = font(15, "SemiBold")

        for i in range(frames):
            t = i / FPS
            active = out_segments[-1]
            for seg in out_segments:
                if seg[0] <= t < seg[1]:
                    active = seg
                    break
            _, _, step, head, sub = active
            local = t - active[0]
            appear = ease_out(min(1.0, local / 0.28))

            overlay = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
            d = ImageDraw.Draw(overlay)

            # Slim top progress line only (doesn't cover UI)
            prog = t / max(out_dur, 0.01)
            d.rectangle((0, 0, OUT_W, 4), fill=(*INK, 30))
            d.rectangle((0, 0, int(OUT_W * prog), 4), fill=(*CORAL, int(240 * appear)))

            # Helper card: left side, just below vertical middle — readable, clear of modal center
            pad = 36
            card_w = 460
            card_h = 108
            card_x = pad
            card_y = int(OUT_H * 0.52)

            shadow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
            sd = ImageDraw.Draw(shadow)
            rounded_rect(
                sd,
                (card_x + 3, card_y + 5, card_x + card_w + 3, card_y + card_h + 5),
                18,
                (0, 0, 0, 48),
            )
            shadow = shadow.filter(ImageFilter.GaussianBlur(10))
            overlay = Image.alpha_composite(overlay, shadow)
            d = ImageDraw.Draw(overlay)

            # frosted cream card — readable mid-screen guide
            rounded_rect(
                d,
                (card_x, card_y, card_x + card_w, card_y + card_h),
                18,
                (*CREAM, int(235 * appear)),
            )
            # coral left accent
            d.rounded_rectangle(
                (card_x, card_y, card_x + 6, card_y + card_h),
                radius=3,
                fill=(*CORAL, int(255 * appear)),
            )

            badge = f"STEP {step}"
            bw = int(d.textlength(badge, font=f_step)) + 18
            rounded_rect(
                d,
                (card_x + 20, card_y + 16, card_x + 20 + bw, card_y + 40),
                8,
                (*CORAL, int(255 * appear)),
            )
            d.text(
                (card_x + 29, card_y + 19),
                badge,
                font=f_step,
                fill=(*INK, int(255 * appear)),
            )
            idx = f"{step}/08"
            d.text(
                (card_x + card_w - 62, card_y + 18),
                idx,
                font=f_brand,
                fill=(*MUTED, int(220 * appear)),
            )
            d.text(
                (card_x + 20, card_y + 50),
                head,
                font=f_head,
                fill=(*INK, int(255 * appear)),
            )
            d.text(
                (card_x + 20, card_y + 78),
                sub,
                font=f_sub,
                fill=(*MUTED, int(240 * appear)),
            )

            overlay.save(td_path / f"o{i:05d}.png")

        # Overlay onto base
        overlayed = OUT_DIR / "_launch_overlayed.mp4"
        subprocess.check_call(
            [
                FFMPEG,
                "-y",
                "-i",
                str(base),
                "-framerate",
                str(FPS),
                "-i",
                str(td_path / "o%05d.png"),
                "-filter_complex",
                "[0:v][1:v]overlay=0:0:shortest=1",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-crf",
                "18",
                "-an",
                str(path),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    return out_dur


def concat(parts: list[Path], dest: Path) -> None:
    lst = OUT_DIR / "_launch_concat.txt"
    with lst.open("w") as f:
        for p in parts:
            f.write(f"file '{p.resolve()}'\n")
    subprocess.check_call(
        [
            FFMPEG,
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(dest),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def probe_duration(path: Path) -> str:
    p = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Duration:\s*(\d+:\d+:\d+\.\d+)", p.stderr)
    return m.group(1) if m else "?"


def ensure_music(path: Path) -> Path:
    """Download a short royalty-free electronic bed if missing."""
    if path.exists() and path.stat().st_size > 100_000:
        return path
    path.parent.mkdir(parents=True, exist_ok=True)
    # SoundHelix demo tracks — free for use as background beds
    url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    print("Downloading background music…")
    subprocess.check_call(
        ["curl", "-fsSL", "-o", str(path), url],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return path


def mux_music(video: Path, music: Path, dest: Path, volume: float = 0.18) -> None:
    """Lay soft music under the silent cut with fade in/out."""
    dur_s = probe_duration(video)
    # parse HH:MM:SS.xx → seconds
    parts = dur_s.split(":")
    total = float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
    fade_out_start = max(0.0, total - 1.2)
    subprocess.check_call(
        [
            FFMPEG,
            "-y",
            "-i",
            str(video),
            "-stream_loop",
            "-1",
            "-i",
            str(music),
            "-filter_complex",
            (
                f"[1:a]volume={volume},afade=t=in:st=0:d=0.8,"
                f"afade=t=out:st={fade_out_start:.2f}:d=1.2[a]"
            ),
            "-map",
            "0:v:0",
            "-map",
            "[a]",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(dest),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def cleanup_intermediates(keep: Path) -> None:
    """Remove draft/intermediate videos; keep only the final promo (+ source mov for rebuilds)."""
    patterns = [
        "_launch_*.mp4",
        "_card_*.mp4",
        "_promo_*.mp4",
        "_concat.txt",
        "_launch_concat.txt",
        "instant-connect-parent-promo.mp4",
    ]
    removed = 0
    for pat in patterns:
        for p in OUT_DIR.glob(pat):
            if p.resolve() == keep.resolve():
                continue
            p.unlink(missing_ok=True)
            removed += 1
    raw = OUT_DIR / "_raw-parent"
    if raw.exists():
        for p in raw.glob("*"):
            p.unlink(missing_ok=True)
            removed += 1
        try:
            raw.rmdir()
        except OSError:
            pass
    frames = OUT_DIR / "frames"
    if frames.exists():
        import shutil

        shutil.rmtree(frames, ignore_errors=True)
        removed += 1
    # leftover desktop drafts
    for name in (
        "Mentr-Instant-Connect-Parent.mp4",
        "instant-connect-parent-promo.mp4",
    ):
        d = Path.home() / "Desktop" / name
        if d.exists():
            d.unlink()
            removed += 1
    print(f"Cleaned {removed} intermediate files")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source: {SRC}")
    if not FONT_PATH.exists():
        raise SystemExit(f"Missing font: {FONT_PATH}")
    if not LOGO.exists():
        raise SystemExit(f"Missing logo: {LOGO}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    intro = OUT_DIR / "_launch_intro.mp4"
    outro = OUT_DIR / "_launch_outro.mp4"
    body = OUT_DIR / "_launch_body.mp4"
    silent = OUT_DIR / "_launch_silent.mp4"
    music = OUT_DIR / "assets" / "bg-music.mp3"
    final = OUT_DIR / "instant-connect-launch-promo.mp4"
    desktop = Path.home() / "Desktop" / "Mentr-Instant-Connect-Launch.mp4"

    print("Building intro…")
    make_intro(intro, 3.2)
    print("Building body (synced overlays)…")
    dur = build_main(body)
    print(f"  body ~{dur:.1f}s")
    print("Building outro…")
    make_outro(outro, 2.0)
    print("Concat…")
    concat([intro, body, outro], silent)
    ensure_music(music)
    print("Muxing music…")
    mux_music(silent, music, final, volume=0.16)
    try:
        subprocess.check_call(["cp", str(final), str(desktop)])
    except subprocess.CalledProcessError:
        print(f"  (skip Desktop copy — open {final})")
    cleanup_intermediates(final)
    # drop silent concat leftover if present
    silent.unlink(missing_ok=True)
    print("DONE")
    print(" ", final)
    if desktop.exists():
        print(" ", desktop)
    print(" Duration", probe_duration(final))
    print(f" Size {final.stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
