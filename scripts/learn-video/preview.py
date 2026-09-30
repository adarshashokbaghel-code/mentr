#!/usr/bin/env python3
"""Render one still per beat into a contact sheet for a quick layout check.

Usage:
  .venv-video/bin/python scripts/learn-video/preview.py videos/learn/a5-being-safe-online [progress]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

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
    for scene in meta["scenes"]:
        for beat in scene["beats"]:
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
    out = lesson / "_preview.png"
    sheet.save(out)
    print(out)


if __name__ == "__main__":
    main()
