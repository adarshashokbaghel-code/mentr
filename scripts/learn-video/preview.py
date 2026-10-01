#!/usr/bin/env python3
"""Render one still per beat into a contact sheet for a quick layout check.

Usage:
  .venv-video/bin/python scripts/learn-video/preview.py videos/learn/a5-being-safe-online [progress]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402


def main() -> None:
    lesson = Path(sys.argv[1])
    if not lesson.is_absolute():
        lesson = build.ROOT / lesson
    progress = float(sys.argv[2]) if len(sys.argv) > 2 else 0.8
    meta = json.loads((lesson / "scenes.json").read_text(encoding="utf-8"))
    scene_ids = [s["id"] for s in meta["scenes"]]
    thumbs: list[Image.Image] = []
    problems: list[str] = []
    for scene in meta["scenes"]:
        for beat in scene["beats"]:
            plugin = build.lesson_plugin(scene["visual"])
            if plugin is not None:
                probe = Image.new("RGB", (meta["width"], meta["height"]))
                if not plugin.render(ImageDraw.Draw(probe), meta["brand"], scene["visual"], beat["focus"],
                                     progress, meta["width"], meta["height"]):
                    problems.append(f"not drawn: {scene['visual']} / {beat['focus']}")
            if len(beat["caption"]) > 52:
                problems.append(f"caption over 52 chars: {beat['caption']!r}")
            img = build.render_frame(
                meta["brand"], meta["title"], meta.get("unitLabel", ""), meta.get("chapterLabel", ""),
                scene["visual"], beat["focus"], beat["caption"], progress,
                meta["width"], meta["height"], (scene_ids.index(scene["id"]), len(scene_ids)), 1,
            )
            thumbs.append(img.resize((640, 360)))
    cols = 4
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 640, rows * 360), (255, 255, 255))
    for i, t in enumerate(thumbs):
        sheet.paste(t, ((i % cols) * 640, (i // cols) * 360))
    out = lesson / ("_preview.png" if len(sys.argv) <= 2 else f"_preview_{progress:g}.png")
    sheet.save(out)
    words = sum(len(b["vo"].split()) for s in meta["scenes"] for b in s["beats"])
    pauses = sum(b.get("pause", 0) for s in meta["scenes"] for b in s["beats"])
    print(out)
    print(f"{words} words · ~{words / 135 + pauses / 60:.1f} min at the A6 pace (135 wpm)")
    for p in problems:
        print("PROBLEM:", p)


if __name__ == "__main__":
    main()
