"""Key out the flat background of the generated dino art, crop to content, and
report silhouette geometry so the popup can be positioned from real numbers.

Border flood fill alone leaves white pockets that the artwork encloses (armpits,
the gap between the arms), so any near-white blob bigger than an eye highlight is
cleared too.
"""

import json
import sys
from collections import deque

from PIL import Image, ImageFilter

TOL = 34
HIGHLIGHT_MAX_AREA = 700  # eye highlights stay, enclosed background goes


def key_out(src, out):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()

    def near_white(x, y):
        r, g, b, _ = px[x, y]
        return (255 - r) <= TOL and (255 - g) <= TOL and (255 - b) <= TOL

    seen = bytearray(w * h)
    clear = bytearray(w * h)

    def flood(sx, sy):
        cells = []
        q = deque([(sx, sy)])
        seen[sy * w + sx] = 1
        while q:
            x, y = q.popleft()
            cells.append((x, y))
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and near_white(nx, ny):
                    seen[ny * w + nx] = 1
                    q.append((nx, ny))
        return cells

    for y in range(h):
        for x in range(w):
            if seen[y * w + x] or not near_white(x, y):
                continue
            cells = flood(x, y)
            touches_border = any(
                cx in (0, w - 1) or cy in (0, h - 1) for cx, cy in cells
            )
            if touches_border or len(cells) > HIGHLIGHT_MAX_AREA:
                for cx, cy in cells:
                    clear[cy * w + cx] = 1

    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        row = y * w
        for x in range(w):
            if clear[row + x]:
                ap[x, y] = 0
    im.putalpha(alpha.filter(ImageFilter.GaussianBlur(0.6)))

    im = im.crop(im.getbbox())
    im.save(out)
    return im


def geometry(im):
    cw, ch = im.size
    ap = im.split()[3].load()
    right = []
    left = []
    for y in range(ch):
        mx, mn = -1, -1
        for x in range(cw - 1, -1, -1):
            if ap[x, y] > 40:
                mx = x
                break
        for x in range(cw):
            if ap[x, y] > 40:
                mn = x
                break
        right.append(mx)
        left.append(mn)

    rows = {}
    for frac in (0.10, 0.20, 0.30, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.80, 0.90):
        y = min(ch - 1, int(ch * frac))
        rows[f"{frac:.2f}"] = {
            "left": round(left[y] / cw, 3),
            "right": round(right[y] / cw, 3),
        }

    return {
        "size": [cw, ch],
        "aspect_w_over_h": round(cw / ch, 4),
        "max_right_frac": round(max(right) / cw, 4),
        "profile": rows,
    }


if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    im = key_out(src, out)
    print(out)
    print(json.dumps(geometry(im), indent=2))
