#!/usr/bin/env python3
"""Build many Learn lesson videos in one unattended run.

Each lesson needs videos/learn/<id>-<slug>/scenes.json (+ lessons/<id>.py visuals).
Lessons whose published MP4 is newer than their scenes.json and visuals are skipped
unless --force is given. Published lessons drawn inside build.py itself (A1–A6, no
lessons/<id>.py file) are only rebuilt with --force. Builds run one after another (each build already uses every
CPU core for frames), and a failure doesn't stop the rest.

Usage:
  .venv-video/bin/python scripts/learn-video/build_all.py A          # every CS lesson in lessons/*.py
  .venv-video/bin/python scripts/learn-video/build_all.py A7 A8 B1   # specific lessons
  .venv-video/bin/python scripts/learn-video/build_all.py all --force
"""

from __future__ import annotations

import re
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
VIDEOS = ROOT / "videos" / "learn"
PUBLIC = ROOT / "public" / "learn" / "lessons"


def lesson_dirs() -> dict[str, Path]:
    out: dict[str, Path] = {}
    for d in VIDEOS.iterdir():
        m = re.match(r"^([abc])(\d+)-", d.name)
        if m and (d / "scenes.json").exists():
            out[f"{m.group(1).upper()}{int(m.group(2))}"] = d
    return out


def sort_key(mid: str) -> tuple[int, int]:
    return ("ABC".index(mid[0]), int(mid[1:]))


def has_plugin(mid: str) -> bool:
    """Track-wide runs only cover plugin lessons; A1–A6 live inside build.py and are rebuilt only by name."""
    return (HERE / "lessons" / f"{mid.lower()}.py").exists()


def is_fresh(mid: str, d: Path) -> bool:
    mp4 = PUBLIC / f"{mid}.mp4"
    if not mp4.exists():
        return False
    plugin = HERE / "lessons" / f"{mid.lower()}.py"
    if not plugin.exists():
        return True  # hand-built lessons (A1–A6) are only rebuilt with --force
    newest = max(p.stat().st_mtime for p in (d / "scenes.json", plugin))
    return mp4.stat().st_mtime >= newest


def building_elsewhere(d: Path) -> bool:
    """Another build is writing this lesson right now (its _build dir changed in the last 2 minutes)."""
    work = d / "_build"
    if not work.exists():
        return False
    marks = (work, work / "audio", work / "frames", d / "final.mp4")
    newest = max((p.stat().st_mtime for p in marks if p.exists()), default=0)
    return time.time() - newest < 120


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    if not args:
        raise SystemExit(__doc__)
    found = lesson_dirs()
    wanted: list[str] = []
    for a in args:
        a = a.upper()
        if a in ("ALL", "A", "B", "C"):
            wanted += [m for m in found if (a == "ALL" or m[0] == a) and has_plugin(m)]
        elif a in found:
            wanted.append(a)
        else:
            print(f"!  {a}: no videos/learn/{a.lower()}-*/scenes.json yet, skipping")
    wanted = sorted(set(wanted), key=sort_key)

    results: list[tuple[str, str, float]] = []
    for mid in wanted:
        d = found[mid]
        if not force and is_fresh(mid, d):
            results.append((mid, "up to date", 0.0))
            continue
        if building_elsewhere(d):
            results.append((mid, "SKIPPED (another build is writing it)", 0.0))
            continue
        print(f"\n=== {mid} · {d.name} ===", flush=True)
        t0 = time.time()
        proc = subprocess.run([sys.executable, str(HERE / "build.py"), str(d)], cwd=ROOT)
        results.append((mid, "built" if proc.returncode == 0 else f"FAILED ({proc.returncode})", time.time() - t0))

    print("\nSummary")
    for mid, status, secs in results:
        print(f"  {mid:<4} {status:<14} {secs / 60:5.1f} min" if secs else f"  {mid:<4} {status}")
    if any(s.startswith("FAILED") for _, s, _ in results):
        sys.exit(1)


if __name__ == "__main__":
    main()
