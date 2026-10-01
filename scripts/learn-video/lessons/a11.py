"""A11 · Meet Block Coding — visuals, plus the Scratch-style block kit shared by Unit 3 lessons."""
from __future__ import annotations

import math

import build as K

EVENT, EVENT_D = (255, 191, 0), (204, 150, 0)
MOTION, MOTION_D = (76, 151, 255), (51, 115, 204)
LOOKS, LOOKS_D = (153, 102, 255), (119, 77, 203)
CONTROL, CONTROL_D = (255, 171, 25), (207, 139, 23)
FLAG, FLAG_D = (76, 191, 86), (46, 140, 58)
CAT, CAT_D, CAT_SOFT = (255, 163, 64), (222, 116, 36), (255, 234, 206)
PINK = (255, 150, 170)
BLOCK_INK = (87, 94, 117)
SKY = (236, 245, 255)
GRASS = (214, 236, 200)
WHITE = (255, 255, 255)
BLOCK_COLORS = {"flag": (EVENT, EVENT_D), "move": (MOTION, MOTION_D), "turn": (MOTION, MOTION_D),
                "wait": (CONTROL, CONTROL_D), "say": (LOOKS, LOOKS_D)}
BH = 76


def text_w(draw, text: str, font) -> float:
    b = draw.textbbox((0, 0), text, font=font)
    return b[2] - b[0]


def text_mid(draw, text: str, x: float, cy: float, font, fill) -> None:
    """Left-aligned text, vertically centred on cy."""
    b = draw.textbbox((0, 0), text, font=font)
    draw.text((x, cy - (b[1] + b[3]) / 2), text, font=font, fill=fill)


def block_font(s: float):
    return K.load_font(max(26, int(32 * s)), bold=True)


def _segs(kind: str, value):
    if kind == "flag":
        return [("t", "when"), ("flag", ""), ("t", "clicked")]
    if kind == "move":
        return [("t", "move"), ("n", str(10 if value is None else value)), ("t", "steps")]
    if kind == "turn":
        return [("t", "turn"), ("rot", ""), ("n", str(90 if value is None else value)), ("t", "degrees")]
    if kind == "wait":
        return [("t", "wait"), ("n", str(1 if value is None else value)), ("t", "seconds")]
    if kind == "say":
        return [("t", "say"), ("n", "Hello!" if value is None else str(value))]
    return [("t", str(value or kind))]


def _seg_w(draw, seg, s: float, font) -> float:
    typ, val = seg
    if typ == "t":
        return text_w(draw, val, font)
    if typ == "n":
        return text_w(draw, val, font) + 34 * s
    return 40 * s


def block_width(draw, kind: str, value=None, s: float = 1.0) -> float:
    font = block_font(s)
    segs = _segs(kind, value)
    inner = sum(_seg_w(draw, g, s, font) for g in segs) + 12 * s * (len(segs) - 1)
    return max(inner + 52 * s, (250 if kind == "flag" else 150) * s)


def block_pts(x0: float, y0: float, x1: float, y1: float, s: float, hat: bool) -> list:
    c = 7 * s
    nx, nw, sl, d = x0 + 26 * s, 56 * s, 12 * s, 10 * s
    if hat:
        pts = [K.qbez((x0, y0 + c), (x0 + 80 * s, y0 - 60 * s), (x0 + 170 * s, y0), k / 12) for k in range(13)]
    else:
        pts = [(x0, y0 + c), (x0 + c, y0), (nx, y0), (nx + sl, y0 + d), (nx + nw - sl, y0 + d), (nx + nw, y0)]
    pts += [(x1 - c, y0), (x1, y0 + c), (x1, y1 - c), (x1 - c, y1), (nx + nw, y1), (nx + nw - sl, y1 + d),
            (nx + sl, y1 + d), (nx, y1), (x0 + c, y1), (x0, y1 - c)]
    return pts


def draw_flag(draw, x: float, cy: float, s: float, col=FLAG, dark=FLAG_D) -> None:
    draw.line((x, cy - 20 * s, x, cy + 20 * s), fill=dark, width=max(2, int(4 * s)))
    pts = [(x, cy - 20 * s), (x + 10 * s, cy - 24 * s), (x + 20 * s, cy - 18 * s), (x + 30 * s, cy - 22 * s),
           (x + 30 * s, cy - 2 * s), (x + 20 * s, cy + 2 * s), (x + 10 * s, cy - 4 * s), (x, cy)]
    draw.polygon(pts, fill=col, outline=dark, width=max(1, int(2 * s)))


def draw_rot(draw, cx: float, cy: float, s: float, col=WHITE) -> None:
    r = 13 * s
    draw.arc((cx - r, cy - r, cx + r, cy + r), 200, 470, fill=col, width=max(2, int(4 * s)))
    ex, ey = cx + r * math.cos(math.radians(110)), cy + r * math.sin(math.radians(110))
    draw.polygon([(ex - 8 * s, ey - 2 * s), (ex + 6 * s, ey - 8 * s), (ex + 2 * s, ey + 8 * s)], fill=col)


def mini_block(draw, x: float, y: float, wd: float, kind: str, s: float = 1.0) -> None:
    """A text-free puzzle block (for small icons)."""
    col, dark = BLOCK_COLORS.get(kind, (MOTION, MOTION_D))
    pts = block_pts(x, y, x + wd, y + BH * s, s, kind == "flag")
    draw.polygon([(px, py + 5 * s) for px, py in pts], fill=dark)
    draw.polygon(pts, fill=col, outline=dark, width=max(1, int(3 * s)))
    draw.rounded_rectangle((x + 22 * s, y + 30 * s, x + wd * 0.62, y + 46 * s), radius=8 * s, fill=WHITE)


def draw_block(draw, x: float, y: float, kind: str, value=None, s: float = 1.0, state: str = "normal",
               wd: float | None = None) -> tuple:
    """Scratch-style block. (x, y) = top-left of the body; a hat block's dome rises ~28*s above y."""
    col, dark = BLOCK_COLORS.get(kind, (MOTION, MOTION_D))
    hat = kind == "flag"
    wd = wd or block_width(draw, kind, value, s)
    x0, y0, x1, y1 = x, y, x + wd, y + BH * s
    pts = block_pts(x0, y0, x1, y1, s, hat)
    if state == "ghost":
        draw.polygon(pts, fill=(255, 240, 230), outline=K.CORAL, width=max(2, int(5 * s)))
        K.text_at(draw, "?", (x0 + x1) / 2, y0 + 2 * s, K.load_font(int(60 * s), bold=True), K.CORAL)
        return (x0, y0, x1, y1)
    if state == "glow":
        draw.line(pts + [pts[0]], fill=K.CORAL, width=max(4, int(14 * s)), joint="curve")
        my = (y0 + y1) / 2
        draw.polygon([(x0 - 34 * s, my - 16 * s), (x0 - 12 * s, my), (x0 - 34 * s, my + 16 * s)], fill=K.CORAL)
    draw.polygon([(px, py + 6 * s) for px, py in pts], fill=dark)
    draw.polygon(pts, fill=col, outline=dark, width=max(2, int(3 * s)))
    font = block_font(s)
    cy = (y0 + y1) / 2
    xx = x0 + 26 * s
    for seg in _segs(kind, value):
        typ, val = seg
        gw = _seg_w(draw, seg, s, font)
        if typ == "t":
            text_mid(draw, val, xx, cy, font, WHITE)
        elif typ == "n":
            draw.rounded_rectangle((xx, cy - 23 * s, xx + gw, cy + 23 * s), radius=23 * s, fill=WHITE, outline=dark,
                                   width=max(1, int(2 * s)))
            text_mid(draw, val, xx + 17 * s, cy, font, BLOCK_INK)
        elif typ == "flag":
            draw_flag(draw, xx + 6 * s, cy + 6 * s, s)
        else:
            draw_rot(draw, xx + 20 * s, cy, s)
        xx += gw + 12 * s
    if state == "dim":
        draw.polygon(pts, outline=(200, 196, 190), width=max(2, int(4 * s)))
    return (x0, y0, x1, y1)


def draw_stack(draw, x: float, y: float, items, s: float = 1.0, states=None, shown: float | None = None,
               drop: float = 60) -> list:
    boxes = []
    for i, (kind, val) in enumerate(items):
        a = 1.0 if shown is None else K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
        if a <= 0:
            boxes.append(None)
            continue
        st = states[i] if states else "normal"
        boxes.append(draw_block(draw, x, y + i * BH * s - (1 - a) * drop, kind, val, s, st))
    return boxes


def stack_height(n: int, s: float = 1.0) -> float:
    return n * BH * s


def draw_stop(draw, cx: float, cy: float, r: float) -> None:
    pts = [(cx + r * math.cos(math.pi / 8 + k * math.pi / 4), cy + r * math.sin(math.pi / 8 + k * math.pi / 4))
           for k in range(8)]
    draw.polygon(pts, fill=K.DANGER)


def draw_stage(draw, box, brand, lit: bool = False, grid: int = 0, floor: bool = True) -> tuple:
    """Stage window with flag + stop buttons. Returns the inner play area."""
    x0, y0, x1, y1 = box
    K.shadow_card(draw, box, brand, radius=26)
    hy = y0 + 36
    if lit:
        draw.rounded_rectangle((x0 + 16, hy - 26, x0 + 82, hy + 26), radius=14, fill=(206, 240, 212),
                               outline=FLAG, width=3)
    draw_flag(draw, x0 + 34, hy + 6, 1.0)
    draw_stop(draw, x0 + 118, hy, 17)
    inner = (x0 + 14, y0 + 70, x1 - 14, y1 - 14)
    ix0, iy0, ix1, iy1 = inner
    draw.rounded_rectangle(inner, radius=18, fill=WHITE if grid else SKY)
    if grid:
        gx = ix0 + ((ix1 - ix0) % grid) / 2
        while gx <= ix1:
            draw.line((gx, iy0 + 4, gx, iy1 - 4), fill=(226, 232, 242), width=2)
            gx += grid
        gy = iy0 + ((iy1 - iy0) % grid) / 2
        while gy <= iy1:
            draw.line((ix0 + 4, gy, ix1 - 4, gy), fill=(226, 232, 242), width=2)
            gy += grid
    elif floor:
        fy = iy1 - (iy1 - iy0) * 0.28
        draw.rounded_rectangle((ix0, fy, ix1, iy1), radius=18, fill=GRASS)
        draw.rectangle((ix0, fy, ix1, fy + 24), fill=GRASS)
        for gx in (ix0 + 50, ix1 - 70):
            for k in range(3):
                draw.line((gx + k * 12, fy + 34, gx + k * 12 + (k - 1) * 6, fy + 14), fill=(150, 196, 130), width=4)
        cxl, cyl = ix0 + 110, iy0 + 64
        for dx, dy, r in ((-40, 8, 26), (0, -6, 36), (42, 8, 26)):
            draw.ellipse((cxl + dx - r, cyl + dy - r, cxl + dx + r, cyl + dy + r), fill=WHITE)
        draw.rounded_rectangle((cxl - 66, cyl + 4, cxl + 68, cyl + 34), radius=15, fill=WHITE)
    return inner


def draw_cat(draw, cx: float, cy: float, s: float, heading: float = 0.0, walk: float = 0.0,
             mood: str = "happy", shadow: bool = True) -> None:
    """Billu the cat. heading in degrees clockwise from facing right; spans ~cy-92s .. cy+57s at heading 0."""
    h = heading % 360
    mirror = 90 < h < 270
    ang = math.radians(h - 180 if mirror else h)
    ca, sa = math.cos(ang), math.sin(ang)

    def P(x: float, y: float) -> tuple:
        if mirror:
            x = -x
        return (cx + (x * ca - y * sa) * s, cy + (x * sa + y * ca) * s)

    def circ(x: float, y: float, r: float, fill) -> None:
        px, py = P(x, y)
        draw.ellipse((px - r * s, py - r * s, px + r * s, py + r * s), fill=fill)

    def oval(x: float, y: float, rx: float, ry: float, fill, n: int = 30) -> None:
        draw.polygon([P(x + rx * math.cos(k * math.tau / n), y + ry * math.sin(k * math.tau / n)) for k in range(n)],
                     fill=fill)
    if shadow:
        draw.ellipse((cx - 80 * s, cy + 48 * s, cx + 80 * s, cy + 66 * s), fill=K.SHADOW)
    step = math.sin(walk * math.pi * 6)
    lw = max(2, int(6 * s))
    draw.line([P(-58, 4), P(-84, -14), P(-92, -46), P(-80, -72)], fill=CAT_D, width=max(3, int(15 * s)),
              joint="curve")
    for k, lx in enumerate((-38, -16, 16, 38)):
        circ(lx + 6 * step * (1 if k % 2 else -1), 44, 13, CAT_D)
    oval(-4, 10, 62, 40, CAT)
    oval(2, 24, 38, 17, CAT_SOFT)
    for k in range(3):
        draw.line([P(-34 + k * 18, -27), P(-30 + k * 18, -12)], fill=CAT_D, width=lw)
    draw.polygon([P(24, -54), P(30, -92), P(54, -66)], fill=CAT)
    draw.polygon([P(56, -68), P(80, -90), P(86, -52)], fill=CAT)
    draw.polygon([P(31, -62), P(34, -80), P(47, -67)], fill=PINK)
    draw.polygon([P(62, -68), P(77, -81), P(80, -59)], fill=PINK)
    circ(54, -30, 40, CAT)
    if mood == "confused":
        circ(42, -36, 9, K.DEV_DEEP)
        circ(70, -36, 5, K.DEV_DEEP)
    elif mood == "blink":
        draw.line([P(36, -36), P(50, -36)], fill=K.DEV_DEEP, width=lw)
        draw.line([P(63, -36), P(77, -36)], fill=K.DEV_DEEP, width=lw)
    else:
        circ(43, -36, 7.5, K.DEV_DEEP)
        circ(70, -36, 7.5, K.DEV_DEEP)
        circ(45, -39, 2.6, WHITE)
        circ(72, -39, 2.6, WHITE)
    draw.polygon([P(83, -25), P(92, -25), P(87.5, -19)], fill=PINK)
    if mood == "confused":
        draw.line([P(74, -12), P(80, -14), P(86, -11)], fill=K.DEV_DEEP, width=max(2, int(4 * s)))
    else:
        draw.line([P(87, -19), P(84, -12), P(76, -12)], fill=K.DEV_DEEP, width=max(2, int(4 * s)))
    wl = max(1, int(3 * s))
    draw.line([P(80, -20), P(112, -27)], fill=K.DEV_MID, width=wl)
    draw.line([P(80, -15), P(112, -9)], fill=K.DEV_MID, width=wl)


def say_bubble(draw, brand, x: float, y: float, text: str, size: int = 32) -> None:
    """Speech bubble whose tail tip is at (x, y)."""
    ink = K.hex_rgb(brand["ink"])
    font = K.load_font(size, bold=True)
    bw = text_w(draw, text, font) + 48
    bh = size * 1.8
    bx0 = x - 34
    by1 = y - 30
    box = (bx0, by1 - bh, bx0 + bw, by1)
    draw.rounded_rectangle((box[0] + 5, box[1] + 6, box[2] + 5, box[3] + 6), radius=bh / 2, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=bh / 2, fill=WHITE, outline=ink, width=3)
    draw.polygon([(bx0 + 18, by1 - 3), (bx0 + 50, by1 - 3), (x, y)], fill=WHITE)
    draw.line([(bx0 + 18, by1 - 1), (x, y), (bx0 + 50, by1 - 1)], fill=ink, width=3)
    text_mid(draw, text, bx0 + 24, by1 - bh / 2, font, ink)


def draw_cursor(draw, x: float, y: float, s: float = 1.0, press: float = 0.0) -> None:
    """Arrow pointer with its tip at (x, y); press draws a click ripple."""
    if press > 0:
        r = 20 + 30 * press
        draw.ellipse((x - r, y - r, x + r, y + r), outline=K.GOLD, width=5)
    pts = [(0, 0), (0, 56), (14, 43), (25, 66), (35, 61), (24, 39), (42, 39)]
    draw.polygon([(x + px * s + 4, y + py * s + 5) for px, py in pts], fill=K.SHADOW)
    draw.polygon([(x + px * s, y + py * s) for px, py in pts], fill=WHITE, outline=K.DEV_DEEP, width=max(2, int(4 * s)))


def draw_brick(draw, cx: float, cy: float, s: float, col) -> None:
    dark = tuple(int(c * 0.78) for c in col)
    for k in range(3):
        x = cx - 64 * s + k * 64 * s
        draw.rounded_rectangle((x - 22 * s, cy - 66 * s, x + 22 * s, cy - 36 * s), radius=6 * s, fill=dark)
        draw.ellipse((x - 22 * s, cy - 76 * s, x + 22 * s, cy - 56 * s), fill=col, outline=dark, width=max(1, int(3 * s)))
    draw.rounded_rectangle((cx - 100 * s + 8, cy - 44 * s + 10, cx + 100 * s + 8, cy + 56 * s + 10), radius=10 * s,
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - 100 * s, cy - 44 * s, cx + 100 * s, cy + 56 * s), radius=10 * s, fill=col,
                           outline=dark, width=max(2, int(4 * s)))


def draw_jigsaw(draw, cx: float, cy: float, s: float, col, hole) -> None:
    dark = tuple(int(c * 0.78) for c in col)
    r = 70 * s
    k = 26 * s
    draw.rounded_rectangle((cx - r + 8, cy - r + 10, cx + r + 8, cy + r + 10), radius=12 * s, fill=K.SHADOW)
    draw.ellipse((cx + r - k * 0.6, cy - k, cx + r + k * 1.4, cy + k), fill=col, outline=dark, width=max(2, int(4 * s)))
    draw.ellipse((cx - k, cy - r - k * 1.4, cx + k, cy - r + k * 0.6), fill=col, outline=dark, width=max(2, int(4 * s)))
    draw.rounded_rectangle((cx - r, cy - r, cx + r, cy + r), radius=12 * s, fill=col)
    draw.ellipse((cx - r - k * 0.6, cy - k, cx - r + k * 1.4, cy + k), fill=hole)
    draw.ellipse((cx - k, cy + r - k * 1.4, cx + k, cy + r + k * 0.6), fill=hole)


def draw_eye(draw, cx: float, cy: float, s: float, col) -> None:
    pts = [K.qbez((cx - 80 * s, cy), (cx, cy - 80 * s), (cx + 80 * s, cy), k / 12) for k in range(13)]
    pts += [K.qbez((cx + 80 * s, cy), (cx, cy + 80 * s), (cx - 80 * s, cy), k / 12) for k in range(1, 12)]
    draw.polygon(pts, fill=WHITE, outline=K.DEV_DEEP, width=max(2, int(5 * s)))
    draw.ellipse((cx - 30 * s, cy - 30 * s, cx + 30 * s, cy + 30 * s), fill=col)
    draw.ellipse((cx - 13 * s, cy - 13 * s, cx + 13 * s, cy + 13 * s), fill=K.DEV_DEEP)
    draw.ellipse((cx - 4 * s, cy - 18 * s, cx + 8 * s, cy - 6 * s), fill=WHITE)


def draw_bulb(draw, cx: float, cy: float, s: float, t: float = 0.0) -> None:
    for k in range(7):
        a = math.pi + k * math.pi / 6
        r0, r1 = 66 * s, (84 + 6 * math.sin(t * 12 + k)) * s
        draw.line((cx + math.cos(a) * r0, cy - 10 * s + math.sin(a) * r0, cx + math.cos(a) * r1,
                   cy - 10 * s + math.sin(a) * r1), fill=K.GOLD, width=max(2, int(7 * s)))
    draw.ellipse((cx - 48 * s, cy - 58 * s, cx + 48 * s, cy + 38 * s), fill=(255, 226, 120), outline=K.DEV_DARK,
                 width=max(2, int(4 * s)))
    draw.rounded_rectangle((cx - 24 * s, cy + 30 * s, cx + 24 * s, cy + 66 * s), radius=6 * s, fill=K.STEEL_DARK)
    draw.line((cx - 22 * s, cy + 44 * s, cx + 22 * s, cy + 44 * s), fill=K.STEEL, width=max(1, int(4 * s)))


def code_screen(draw, box, lines, err_line: int | None = None, banner: bool = False, t: float = 0.0,
                abstract: bool = False) -> None:
    """Dark editor window with typed code."""
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=K.DEV_DEEP, outline=K.DEV_DARK, width=8)
    for k, c in enumerate((K.DANGER, K.GOLD, K.LED_ON)):
        draw.ellipse((x0 + 30 + k * 34, y0 + 26, x0 + 52 + k * 34, y0 + 48), fill=c)
    font = K.load_font(40, bold=True)
    palette = [(255, 160, 120), (140, 200, 255), (190, 160, 255), (150, 230, 170)]
    for i, ln in enumerate(lines):
        y = y0 + 88 + i * 66
        if abstract:
            indent = 40 if 0 < i < len(lines) - 1 else 0
            segs = [(90, palette[i % 4]), (140, palette[(i + 1) % 4]), (70, palette[(i + 2) % 4])]
            xx = x0 + 40 + indent
            for wdt, c in segs[: 2 + i % 2]:
                draw.rounded_rectangle((xx, y + 10, xx + wdt, y + 34), radius=12, fill=c)
                xx += wdt + 18
            continue
        col = palette[i % 4]
        if err_line == i:
            draw.rounded_rectangle((x0 + 24, y - 6, x1 - 24, y + 54), radius=12, fill=(90, 34, 40))
            col = (255, 140, 140)
        draw.text((x0 + 40, y), ln, font=font, fill=col)
        if err_line == i:
            wx0 = x0 + 40 + text_w(draw, ln[: len(ln) - len(ln.lstrip())], font)
            wx1 = wx0 + text_w(draw, ln.strip(), font)
            pts = [(wx0 + k * 12, y + 52 + (5 if k % 2 else -1)) for k in range(int((wx1 - wx0) / 12) + 1)]
            draw.line(pts, fill=K.DANGER, width=4)
    if banner:
        by = y1 - 96
        draw.rounded_rectangle((x0 + 30, by, x1 - 30, y1 - 24), radius=18, fill=K.DANGER)
        K.draw_cross(draw, x0 + 80, by + 36, 24, WHITE, bg=K.DANGER)
        text_mid(draw, "ERROR! Program stopped", x0 + 124, by + 36, K.load_font(36, bold=True), WHITE)


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    lav_soft = K.hex_rgb("#EFEAFB")
    blue_soft = K.hex_rgb("#E6EEFB")
    gold_soft = K.hex_rgb("#FFF4D6")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    F = K.load_font

    def stars_around(y: float, spread: float, n: int = 6) -> None:
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def stars_at(x: float, y: float, r: float, n: int = 4) -> None:
        for i in range(n):
            a = i * 2 * math.pi / n + 0.4
            sx = x + math.cos(a) * r
            sy = y + math.sin(a) * r * 0.7 + 10 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 20 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def qmarks(pts) -> None:
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(int(80 + 20 * (pulse if k % 2 else 1 - pulse)), True), K.GOLD)

    # ---- opening -------------------------------------------------------------
    if visual == "a11-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 330), 450, 110, sage, panel, bounce)
            draw_cat(draw, cx + 300, 490 + bounce, 1.6, walk=t)
            K.text_at(draw, "Welcome back, champ!", cx, 700, F(60, True), ink)
            stars_around(330, 520)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "UNIT 2 · THINKING LIKE A COMPUTER", cx, 330 + lift, F(34, True), sage)
            chips = ["Algorithms", "Order", "Loops", "If · then", "Debugging"]
            for i, lab in enumerate(chips):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 470 + i * 245
                y = 450 + int((1 - a) * 40)
                draw.ellipse((x - 70, y - 70, x + 70, y + 70), fill=sage_soft)
                K.draw_check(draw, x, y, 46, sage)
                K.text_at(draw, lab, x, y + 92, F(30, True), ink)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 710 + int((1 - a) * 20), "ALL DONE!", coral, size=40)
                stars_around(740, 420, 4)
            return True
        if focus == "unit":
            draw.ellipse((520 - 250, 560 - 250, 520 + 250, 560 + 250), fill=gold_soft)
            draw_stack(draw, 362, 410, [("flag", None), ("move", 10), ("say", "Hi!")], 1.0,
                       shown=progress * 6 - 0.2)
            draw_cat(draw, 520, 730, 0.62, walk=t)
            K.pill(draw, 0, 300 + lift, "UNIT 3", coral, size=34, left=880)
            K.text_at(draw, "Building", 1280, 380 + lift, F(84, True), ink)
            K.text_at(draw, "With Blocks", 1280, 480 + lift, F(84, True), ink)
            cols = [EVENT, MOTION, LOOKS, CONTROL, FLAG]
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a > 0:
                    x = 1040 + i * 120
                    draw.rounded_rectangle((x - 46, 650, x + 46, 742), radius=22, fill=panel,
                                           outline=cols[i] if i == 0 else line, width=5 if i == 0 else 3)
                    K.text_at(draw, str(i + 1), x, 664, F(46, True), coral if i == 0 else muted)
            K.text_at(draw, "5 chapters", 1280, 770, F(30, True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 302 + lift, F(32, True), coral)
            K.text_at(draw, "Meet Block Coding", cx, 362 + lift, F(88, True), ink)
            items = [("flag", None), ("move", 10), ("say", "Hello!")]
            for i, (kind, val) in enumerate(items):
                a = K.stagger(progress, i + 1, step=0.15, speed=4)
                if a <= 0:
                    continue
                side = -1 if i % 2 == 0 else 1
                draw_block(draw, cx - 160 + side * 500 * (1 - a), 610 + i * BH, kind, val, 1.0)
            if progress > 0.75:
                stars_at(cx + 330, 720, 120, 3)
            return True
        # promise
        K.text_at(draw, "Code without typing?", cx, 240 + lift, F(66, True), ink)
        K.draw_device(draw, "keyboard", 500, 540, 1.4, brand, t=t)
        K.draw_cross(draw, 700, 440, 46, K.DANGER)
        K.text_at(draw, "No typing…", 500, 680, F(44, True), muted)
        a = K.stagger(progress, 2, step=0.12, speed=4)
        if a > 0:
            K.draw_arrow(draw, 790, 540, 790 + 210 * a, 540, coral, width=14, head=40)
        items = [("flag", None), ("move", 10), ("say", "Hi!")]
        draw_stack(draw, 1110, 430, items, 1.0, shown=progress * 5 - 1.2)
        if progress > 0.6:
            K.draw_check(draw, 1560, 450, 40, sage)
            K.text_at(draw, "…just snap blocks!", 1290, 720, F(44, True), sage)
        return True

    # ---- Riya didi's typed code ---------------------------------------------------
    code = ["function go() {", "    move(10);", "    say(\"Hi!\");", "}"]
    if visual == "a11-hook":
        if focus in ("meet", "code", "typo"):
            K.draw_person(draw, 420, 470, 1.2, "mom", t if focus == "meet" else 0)
            K.draw_person(draw, 650, 560, 0.9, "kid", t)
            K.pill(draw, 420, 680, "Riya didi", K.BOTH_COLOR, size=30)
            K.pill(draw, 650, 740, "You", coral, size=30)
            box = (900, 250, 1700, 730)
            if focus == "typo":
                code_screen(draw, box, ["function go() {", "    mvoe(10);", "    say(\"Hi!\");", "}"], err_line=1,
                            banner=progress > 0.35, t=t)
                if progress > 0.35:
                    K.text_at(draw, "Oh no!", 800, 300 + bounce, F(56, True), K.DANGER)
            else:
                code_screen(draw, box, code, abstract=focus == "meet", t=t)
                if focus == "code":
                    for k, (sym, sx, sy) in enumerate((("{ }", 800, 300), ("( )", 1800, 330), (";", 1800, 560))):
                        a = K.stagger(progress, k + 1, step=0.15, speed=4)
                        if a > 0:
                            K.text_at(draw, sym, sx, sy + int((1 - a) * 30), F(int(64 + 8 * pulse), True),
                                      [K.GOLD, K.BOTH_COLOR, coral][k])
            draw.polygon([(860, 730), (1740, 730), (1790, 772), (810, 772)], fill=K.DEV_MID)
            draw.rounded_rectangle((1200, 742, 1400, 756), radius=6, fill=K.DEV_DARK)
            return True
        if focus == "think":
            K.text_at(draw, "Is there an easier way?", cx, 232, F(54, True), ink)
            code_screen(draw, (160, 380, 620, 650), ["mvoe(10);"], err_line=0)
            K.draw_cross(draw, 600, 400, 36, K.DANGER)
            draw.ellipse((cx - 210, 560 - 210, cx + 210, 560 + 210), fill=lav_soft)
            K.draw_person(draw, cx, 520, 1.15, "kid", t)
            qmarks(((cx - 300, 330), (cx + 290, 320)))
            draw_block(draw, 1330, 480, "move", "?", 1.1, state="ghost", wd=380)
            K.draw_stopwatch(draw, cx, 830, 40, progress, brand)
            return True
        # reveal
        K.draw_bubble(draw, (500, 240, 1120, 420), brand, "When I was your age, I started with blocks!",
                      tail="left", size=40)
        K.draw_person(draw, 400, 560, 1.2, "mom", t)
        items = [("flag", None), ("move", 10), ("say", "Hello!"), ("wait", 1)]
        draw_stack(draw, 1230, 470, items, 1.05, shown=progress * 6 - 0.6)
        if progress > 0.7:
            stars_at(1420, 620, 330, 4)
        return True

    # ---- definition ----------------------------------------------------------------
    if visual == "a11-define":
        if focus == "name":
            for k, (kind, val, bx, by) in enumerate((("flag", None, 110, 300), ("say", "Hi!", 150, 600),
                                                    ("move", 10, 1500, 360), ("wait", 1, 1490, 640))):
                a = K.stagger(progress, k, step=0.08, speed=5)
                if a > 0:
                    draw_block(draw, bx, by + 10 * math.sin(progress * 8 + k) + (1 - a) * 40, kind, val, 1.0)
            b = K.ease_out_cubic(K.clamp01((progress - 0.25) * 2.5))
            if b > 0:
                sc = 0.8 + 0.2 * b
                hw, hh = 480 * sc, 170 * sc
                K.shadow_card(draw, (cx - hw, 500 - hh, cx + hw, 500 + hh), brand, radius=40, outline=coral,
                              outline_w=6)
                K.text_at(draw, "It's called", cx, 500 - 120 * sc, F(int(44 * sc), True), muted)
                K.text_at(draw, "BLOCK CODING", cx, 500 - 46 * sc, F(int(100 * sc), True), coral)
            return True
        if focus == "meaning":
            K.shadow_card(draw, (200, 250 + lift, w - 200, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "Block coding means…", cx, 340 + lift, F(46, True), muted)
            parts = [("snapping puzzle-like blocks", coral), ("together,", K.BOTH_COLOR),
                     ("to give the computer instructions.", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, cx, 440 + i * 120 + int((1 - a) * 30) + lift, F(68, True), col)
            return True
        if focus == "lego":
            draw.ellipse((300 - 150, 440 - 150, 300 + 150, 440 + 150), fill=coral_soft)
            draw_brick(draw, 300, 460, 1.0, K.DANGER)
            K.text_at(draw, "LEGO", 300, 610, F(40, True), ink)
            draw.ellipse((660 - 150, 440 - 150, 660 + 150, 440 + 150), fill=sage_soft)
            draw_jigsaw(draw, 650, 450, 0.95, sage, sage_soft)
            K.text_at(draw, "Jigsaw", 660, 610, F(40, True), ink)
            K.pill(draw, 480, 700, "1 block = 1 instruction", K.BOTH_COLOR, size=34)
            draw.rounded_rectangle((900, 260, 1800, 860), radius=36, fill=panel, outline=line, width=3)
            draw_block(draw, 1000, 380, "flag", None, 1.0)
            mv = K.ease_in_out(K.clamp01((progress - 0.1) * 1.6))
            bx, by = K.lerp(1380, 1000, mv), K.lerp(640, 380 + BH, mv)
            snapped = mv >= 1
            if not snapped:
                K.draw_dashed(draw, 1000, 380 + BH + 4, 1320, 380 + BH + 4, line, width=4)
            draw_block(draw, bx, by, "move", 10, 1.0, state="glow" if snapped and progress < 0.9 else "normal")
            draw_cursor(draw, bx + 200, by + 40, 1.0, press=K.clamp01((progress - 0.72) * 4) if snapped else 0)
            if snapped:
                K.text_at(draw, "Click!", 1560, 420 + bounce, F(56, True), coral)
            for k, lab in enumerate(("Drag", "Drop", "Snap!")):
                a = K.stagger(progress, k, step=0.25, speed=4)
                if a > 0:
                    K.pill(draw, 1110 + k * 230, 760 + int((1 - a) * 20), lab, [K.BOTH_COLOR, MOTION_D, coral][k],
                           size=34)
            return True
        # notype
        K.text_at(draw, "mvoe", 430, 280, F(70, True), K.DANGER)
        draw.line((330, 330, 540, 320), fill=K.DANGER, width=10)
        K.draw_device(draw, "keyboard", 430, 500, 1.5, brand, t=t)
        K.draw_cross(draw, 660, 380, 40, K.DANGER)
        K.draw_arrow(draw, 760, 500, 960, 500, coral, width=14, head=40)
        draw_stack(draw, 1060, 380, [("flag", None), ("move", 10), ("say", "Hi!")], 1.0)
        K.draw_check(draw, 1520, 400, 40, sage)
        for k, lab in enumerate(("No typing", "No spelling mistakes", "No tricky words")):
            a = K.stagger(progress, k + 1, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, [470, 960, 1450][k], 740 + int((1 - a) * 20), lab, sage, size=34)
        return True

    # ---- the block coding screen ---------------------------------------------------
    if visual == "a11-screen":
        K.shadow_card(draw, (100, 236, 1820, 866), brand, radius=32)
        parts = [("palette", "Blocks", (130, 330, 560, 846)), ("code", "Coding area", (580, 330, 1150, 846)),
                 ("stage", "Stage", (1170, 330, 1790, 846))]
        for key, lab, box in parts:
            on = focus == key
            K.pill(draw, (box[0] + box[2]) / 2, 252, lab, coral if on else muted, size=30)
        pb = parts[0][2]
        draw.rounded_rectangle(pb, radius=20, fill=(247, 244, 239))
        for k, c in enumerate((MOTION, LOOKS, EVENT, CONTROL)):
            draw.ellipse((150, 380 + k * 100, 186, 416 + k * 100), fill=c)
        pal = [("move", 10, 370), ("turn", 90, 462), ("say", "Hello!", 554), ("flag", None, 666), ("wait", 1, 758)]
        for i, (kind, val, by) in enumerate(pal):
            a = K.stagger(progress, i, step=0.08, speed=5) if focus == "palette" else 1.0
            if a > 0:
                draw_block(draw, 208 + (1 - a) * 30, by, kind, val, 0.82)
        cb = parts[1][2]
        draw.rounded_rectangle(cb, radius=20, fill=WHITE)
        for gx in range(int(cb[0]) + 30, int(cb[2]) - 10, 40):
            for gy in range(int(cb[1]) + 30, int(cb[3]) - 10, 40):
                draw.ellipse((gx - 2, gy - 2, gx + 2, gy + 2), fill=(226, 222, 214))
        shown = progress * 5 - 0.3 if focus == "code" else None
        draw_stack(draw, 660, 450, [("flag", None), ("move", 10), ("say", "Hello!")], 0.95, shown=shown)
        if focus == "code" and progress > 0.6:
            K.text_at(draw, "Snap!", 1030, 470 + bounce, F(40, True), coral)
        inner = draw_stage(draw, parts[2][2], brand)
        ccx = (inner[0] + inner[2]) / 2
        draw_cat(draw, ccx, 690 + (bounce if focus == "stage" else 0), 0.9, walk=t if focus == "stage" else 0)
        if focus == "stage":
            K.pill(draw, ccx, 470, "Billu", CAT_D, size=36)
            K.draw_arrow(draw, ccx, 545, ccx, 580, CAT_D, width=8, head=22)
        if focus != "intro":
            box = {k: b for k, _, b in parts}[focus]
            draw.rounded_rectangle((box[0] - 6, box[1] - 6, box[2] + 6, box[3] + 6), radius=24, outline=coral, width=6)
        return True

    # ---- a program is a stack ---------------------------------------------------------
    prog = [("flag", None), ("move", 10), ("say", "Hello!"), ("wait", 1)]
    if visual == "a11-stack":
        if focus == "stack":
            draw_stack(draw, 300, 340, prog, 1.15, shown=progress * 6 - 0.3, drop=120)
            a = K.ease_out_cubic(K.clamp01((progress - 0.65) * 3))
            if a > 0:
                bx = 710
                draw.line((bx, 316, bx + 30, 316, bx + 30, 690, bx, 690), fill=coral, width=8)
                draw.line((bx + 30, 503, bx + 60, 503), fill=coral, width=8)
                K.text_at(draw, "A stack of blocks", 1270, 380, F(66, True), ink)
                K.text_at(draw, "= a PROGRAM!", 1270, 470, F(90, True), coral)
                draw_cat(draw, 1270, 730, 0.9, walk=t)
                for k, (sx, sy) in enumerate(((1040, 690), (1500, 660), (1530, 790))):
                    K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                                [coral, sage, K.GOLD][k], rot=progress * 3 + k)
            return True
        if focus == "order":
            cur = min(3, int(progress * 4.4))
            states = ["glow" if i == cur else "normal" for i in range(4)]
            draw_stack(draw, 300, 340, prog, 1.1, states=states)
            for i in range(4):
                K.pill(draw, 0, 340 + i * BH * 1.1 + 16, str(i + 1), coral if i <= cur else muted, size=28, left=186)
            K.draw_arrow(draw, 140, 320, 140, 330 + 120 + 300 * K.clamp01(progress * 1.3), coral, width=12, head=34)
            K.text_at(draw, "top", 140, 260, F(30, True), muted)
            inner = draw_stage(draw, (980, 260, 1800, 850), brand, lit=True)
            px = 1180 + 260 * K.ease_in_out(K.clamp01(progress * 4.4 - 1))
            draw_cat(draw, px, 720, 1.0, walk=t if cur == 1 else 0)
            if cur >= 2:
                say_bubble(draw, brand, px + 50, 620, "Hello!", 36)
            if cur == 3:
                K.draw_stopwatch(draw, 1680, 420, 46, progress, brand)
            return True
        # algo
        draw.rounded_rectangle((150 + 10, 260 + 12, 800 + 10, 840 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((150, 260, 800, 840), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "Algorithm", 475, 290, F(50, True), coral)
        steps = ["Start", "Walk 10 steps", "Say Hello", "Wait 1 second"]
        for i, lab in enumerate(steps):
            y = 400 + i * 110
            draw.line((190, y + 76, 760, y + 76), fill=(220, 210, 232), width=2)
            K.pill(draw, 0, y, str(i + 1), coral, size=28, left=190)
            draw.text((270, y + 2), lab, fill=ink, font=F(42, True))
        a = K.ease_out_cubic(K.clamp01((progress - 0.2) * 3))
        if a > 0:
            K.draw_arrow(draw, 840, 550, 840 + 190 * a, 550, coral, width=14, head=40)
        draw_stack(draw, 1110, 400, prog, 1.1, shown=progress * 6 - 1.2)
        if progress > 0.75:
            K.pill(draw, 1310, 780, "Each step is a block!", sage, size=34)
        return True

    # ---- meet the blocks ----------------------------------------------------------------
    if visual == "a11-blocks":
        specs = {"start": ("flag", None, "START", EVENT_D), "move": ("move", 10, "MOTION", MOTION_D),
                 "wait": ("wait", 1, "WAIT", CONTROL_D), "say": ("say", "Hello!", "SAY", LOOKS_D)}
        if focus == "intro":
            softs = [gold_soft, blue_soft, K.hex_rgb("#FFF0DA"), lav_soft]
            names = ["Start", "Motion", "Wait", "Say"]
            for i, key in enumerate(("start", "move", "wait", "say")):
                kind, val, _, dark = specs[key]
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 430
                y = 270 + int((1 - a) * 50)
                draw.rounded_rectangle((x - 200, y, x + 200, y + 560), radius=40, fill=softs[i],
                                       outline=BLOCK_COLORS[kind][0], width=5)
                bw = block_width(draw, kind, val, 0.92)
                draw_block(draw, x - bw / 2, y + 100, kind, val, 0.92)
                K.text_at(draw, names[i], x, y + 230, F(56, True), dark)
                iy = y + 420
                if i == 0:
                    draw_flag(draw, x - 40, iy + 20, 3.0)
                elif i == 1:
                    draw_cat(draw, x, iy + 10, 0.6, walk=t)
                    K.draw_arrow(draw, x + 80, iy + 60, x + 150, iy + 60, MOTION_D, width=8, head=22)
                elif i == 2:
                    K.draw_stopwatch(draw, x, iy + 10, 60, progress, brand)
                else:
                    say_bubble(draw, brand, x - 50, iy + 70, "Hello!", 34)
            return True
        kind, val, tag, dark = specs[focus]
        K.pill(draw, 0, 262, tag, dark, size=34, left=170)
        jobs = {"start": "Starts the program", "move": "Moves or turns the character",
                "wait": "Pauses, then the next block runs", "say": "Shows a speech bubble"}
        draw_block(draw, 170, 400, kind, val, 1.5)
        a = K.stagger(progress, 1, step=0.15, speed=4)
        font = F(40, True)
        for j, ln in enumerate(K.wrap_text(jobs[focus], font, 700)):
            draw.text((170, 560 + j * 52 + int((1 - a) * 20)), ln, fill=ink, font=font)
        inner = draw_stage(draw, (1000, 260, 1800, 850), brand, lit=focus == "start" and progress > 0.3)
        floor_cy = 730
        if focus == "start":
            draw_block(draw, 170, 400 + BH * 1.5, "move", 10, 1.5, state="dim")
            K.draw_arrow(draw, 500, 300, 330, 362, coral, width=8, head=26)
            K.text_at(draw, "Round top:", 640, 268, F(32, True), coral)
            K.text_at(draw, "nothing above!", 640, 304, F(32, True), coral)
            draw_cat(draw, 1400, floor_cy, 1.0, walk=0)
            press = K.clamp01((progress - 0.3) * 3)
            draw_cursor(draw, 1050, 300, 1.0, press=press)
            if progress > 0.45:
                K.text_at(draw, "Go!", 1400, 480 + bounce, F(64, True), FLAG_D)
            return True
        if focus == "move":
            mv = K.ease_in_out(K.clamp01((progress - 0.15) * 1.6))
            px = K.lerp(1200, 1520, mv)
            for k in range(3):
                if 0 < mv < 1:
                    draw.line((px - 130 - k * 30, floor_cy - 40 + k * 26, px - 100 - k * 30, floor_cy - 40 + k * 26),
                              fill=MOTION, width=6)
            draw_cat(draw, px, floor_cy, 1.0, walk=t if 0 < mv < 1 else 0)
            K.draw_arrow(draw, 1200, 820, 1200 + 320 * mv, 820, MOTION_D, width=8, head=24)
            K.text_at(draw, "10 steps", 1360, 380, F(40, True), MOTION_D)
            return True
        if focus == "wait":
            draw_cat(draw, 1340, floor_cy, 1.0, mood="blink" if int(progress * 6) % 2 else "happy")
            K.draw_stopwatch(draw, 1610, 470, 60, progress, brand)
            dots = "." * (1 + int(progress * 6) % 3)
            K.text_at(draw, "1 second" + dots, 1300, 420, F(40, True), CONTROL_D)
            return True
        draw_cat(draw, 1300, floor_cy, 1.0)
        if progress > 0.2:
            say_bubble(draw, brand, 1360, 625, "Hello!", 44)
        return True

    # ---- run a tiny program ------------------------------------------------------------
    run_prog = [("flag", None), ("move", 10), ("say", "Hello!"), ("wait", 1), ("move", 10)]
    if visual == "a11-run":
        stage_box = (900, 250, 1800, 850)
        x_pos = [1080, 1080, 1330, 1330, 1330, 1580]
        if focus == "build":
            draw_stack(draw, 190, 340, run_prog, 1.05, shown=progress * 6.2 - 0.4)
            draw_stage(draw, stage_box, brand)
            draw_cat(draw, x_pos[0], 720, 1.0)
            return True
        if focus == "click":
            press = K.clamp01((progress - 0.45) * 3)
            states = ["glow" if press > 0 else "normal"] + ["normal"] * 4
            draw_stack(draw, 190, 340, run_prog, 1.05, states=states)
            draw_stage(draw, stage_box, brand, lit=press > 0)
            draw_cat(draw, x_pos[0], 720, 1.0)
            mv = K.ease_in_out(K.clamp01(progress * 2.2))
            draw_cursor(draw, K.lerp(1300, 950, mv), K.lerp(560, 290, mv), 1.0, press=press)
            return True
        # watch
        f = progress * 5.4
        cur = min(4, int(f))
        frac = K.clamp01(f - cur)
        done = f >= 5
        states = ["glow" if (i == cur and not done) else "normal" for i in range(5)]
        draw_stack(draw, 190, 340, run_prog, 1.05, states=states)
        draw_stage(draw, stage_box, brand, lit=True)
        if cur == 1:
            px = K.lerp(1080, 1330, K.ease_in_out(frac))
        elif cur == 4 and not done:
            px = K.lerp(1330, 1580, K.ease_in_out(frac))
        else:
            px = x_pos[cur + 1] if cur in (1, 4) else x_pos[cur]
        if done:
            px = 1580
        walking = cur in (1, 4) and not done
        draw_cat(draw, px, 720, 1.0, walk=t if walking else 0)
        if cur >= 2:
            say_bubble(draw, brand, px + 50, 620, "Hello!", 36)
        if cur == 3:
            K.draw_stopwatch(draw, 1700, 400, 44, progress, brand)
        if done:
            K.draw_check(draw, 1700, 400, 40, sage)
        return True

    # ---- start block vs motion block -----------------------------------------------------
    if visual == "a11-startmove":
        ans = focus == "a"
        for i, (kind, val, title, col, soft, job) in enumerate((
                ("flag", None, "Start block", EVENT_D, gold_soft, "Decides WHEN to begin"),
                ("move", 10, "Motion block", MOTION_D, blue_soft, "MOVES the character"))):
            x0 = 160 + i * 900
            draw.rounded_rectangle((x0, 260, x0 + 700, 830), radius=40, fill=soft, outline=col, width=5)
            bw = block_width(draw, kind, val, 1.2)
            draw_block(draw, x0 + 350 - bw / 2, 330, kind, val, 1.2)
            K.text_at(draw, title, x0 + 350, 460, F(54, True), col)
            if ans:
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, job, x0 + 350, 540 + int((1 - a) * 20), F(40, True), ink)
                if i == 0:
                    draw_flag(draw, x0 + 250, 720, 3.2)
                    K.draw_bubble(draw, (x0 + 390, 630, x0 + 640, 730), brand, "Go now!", tail="left", size=36)
                else:
                    draw_cat(draw, x0 + 270, 730, 0.75, walk=t)
                    K.draw_bubble(draw, (x0 + 420, 630, x0 + 650, 730), brand, "Walk!", tail="left", size=36)
        if ans:
            K.text_at(draw, "=", cx, 470, F(120, True), K.DANGER)
            draw.line((cx - 40, 590, cx + 40, 470), fill=K.DANGER, width=12)
        else:
            K.text_at(draw, "= ?", cx, 470, F(100, True), K.GOLD)
            K.draw_stopwatch(draw, cx, 720, 44, progress, brand)
        return True

    # ---- matching game ---------------------------------------------------------------------
    if visual == "a11-match":
        blocks = [("flag", None), ("move", 10), ("wait", 1), ("say", "Hello!")]
        jobs = ["Shows a speech bubble", "Starts the program", "Pauses for a moment", "Moves the character"]
        target = [1, 3, 2, 0]
        rows = [310, 450, 590, 730]
        ans = focus == "answer"
        for j, lab in enumerate(jobs):
            y = rows[j]
            hit = ans and any(target[i] == j and (progress * 5 - 0.3 - i) * 1.5 >= 1 for i in range(4))
            draw.rounded_rectangle((1150 + 8, y - 6 + 10, 1780 + 8, y + 82 + 10), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((1150, y - 6, 1780, y + 82), radius=30, fill=sage_soft if hit else panel,
                                   outline=sage if hit else line, width=5 if hit else 3)
            draw.text((1190, y + 14), lab, fill=ink, font=F(38, True))
            if hit:
                K.draw_check(draw, 1730, y + 38, 22, sage)
        for i, (kind, val) in enumerate(blocks):
            box = draw_block(draw, 170, rows[i], kind, val, 1.0)
            draw.ellipse((box[2] + 14, rows[i] + 26, box[2] + 38, rows[i] + 50), fill=BLOCK_COLORS[kind][1])
            if ans:
                a = K.clamp01((progress * 5 - 0.3 - i) * 1.5)
                if a > 0:
                    sx, sy = box[2] + 26, rows[i] + 38
                    ex, ey = 1150, rows[target[i]] + 38
                    K.draw_curve(draw, (sx, sy), ((sx + ex) / 2, (sy + ey) / 2 - 30),
                                 (K.lerp(sx, ex, a), K.lerp(sy, ey, a)), BLOCK_COLORS[kind][1], width=8)
        if not ans:
            K.draw_stopwatch(draw, 830, 540, 54, progress, brand)
            qmarks(((700, 330), (960, 380)))
        return True

    # ---- missing start block ------------------------------------------------------------------
    if visual == "a11-missing":
        ans = focus == "answer"
        drop = K.ease_out_cubic(K.clamp01((progress - 0.05) * 3)) if ans else 0.0
        sx, sy = 200, 400
        fw = block_width(draw, "flag", None, 1.1)
        draw_stack(draw, sx, sy + BH * 1.1, [("move", 10), ("say", "Hi!")], 1.1)
        if ans:
            draw_block(draw, sx, sy - 200 * (1 - drop), "flag", None, 1.1, state="glow" if drop >= 1 else "normal")
        else:
            draw_block(draw, sx, sy, "flag", None, 1.1, state="ghost", wd=fw)
            K.draw_stopwatch(draw, 400, 760, 44, progress, brand)
        inner = draw_stage(draw, (900, 260, 1800, 850), brand, lit=True)
        if ans:
            mv = K.ease_in_out(K.clamp01((progress - 0.35) * 2.2))
            px = K.lerp(1150, 1450, mv)
            draw_cat(draw, px, 720, 1.0, walk=t if 0 < mv < 1 else 0)
            if mv >= 1:
                say_bubble(draw, brand, px + 50, 620, "Hi!", 40)
                stars_at(1450, 660, 230, 3)
        else:
            draw_cat(draw, 1150, 720, 1.0, mood="confused")
            press = K.clamp01((progress - 0.25) * 3)
            draw_cursor(draw, 950, 290, 1.0, press=press)
            if progress > 0.4:
                K.text_at(draw, "Nothing happens!", 1400, 420, F(44, True), K.DANGER)
                qmarks(((1320, 520), (1500, 540)))
        return True

    # ---- checkpoint --------------------------------------------------------------------------
    if visual == "a11-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 700 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, F(40, True), sage)
            K.text_at(draw, "Why blocks first?", cx, 470 + lift, F(64, True), ink)
            K.draw_check(draw, cx, 620 + lift, 44, sage)
            return True
        if focus == "ask":
            draw.rounded_rectangle((140 + 10, 240 + 12, 1060 + 10, 860 + 12), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((140, 240, 1060, 860), radius=24, fill=(255, 250, 238))
            for k in range(6):
                draw.line((180, 460 + k * 70, 1020, 460 + k * 70), fill=(220, 210, 232), width=2)
            draw.line((240, 250, 240, 850), fill=(240, 170, 170), width=3)
            font = F(48, True)
            for j, ln in enumerate(K.wrap_text("Why do we use blocks first, instead of typing code?", font, 740)):
                draw.text((280, 290 + j * 62), ln, fill=coral, font=font)
            mini_block(draw, 300, 600, 300, "flag", 0.8)
            mini_block(draw, 300, 600 + BH * 0.8, 260, "move", 0.8)
            K.text_at(draw, "vs", 700, 640, F(48, True), muted)
            K.draw_device(draw, "keyboard", 880, 670, 0.7, brand)
            K.draw_person(draw, 1450, 500, 1.2, "kid", t)
            qmarks(((1260, 320), (1650, 340)))
            K.pill(draw, 1450, 740, "Pause & say it!", coral, size=36)
            K.draw_stopwatch(draw, 1740, 520, 40, progress, brand)
            return True
        # answer
        cards = [("eye", "Easy to see"), ("snap", "Easy to snap"), ("notype", "No typos"),
                 ("idea", "Focus on ideas")]
        for i, (kind, lab) in enumerate(cards):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            x0 = 140 + (i % 2) * 520
            y0 = 250 + (i // 2) * 310 + int((1 - a) * 30)
            draw.rounded_rectangle((x0, y0, x0 + 490, y0 + 280), radius=32, fill=sage_soft, outline=sage, width=4)
            ix, iy = x0 + 245, y0 + 105
            if kind == "eye":
                draw_eye(draw, ix, iy, 0.9, MOTION)
            elif kind == "snap":
                mini_block(draw, ix - 110, iy - 70, 220, "flag", 0.75)
                mini_block(draw, ix - 110, iy - 70 + BH * 0.75, 190, "move", 0.75)
            elif kind == "notype":
                K.draw_device(draw, "keyboard", ix, iy, 0.75, brand)
                K.draw_cross(draw, ix + 120, iy - 50, 28, K.DANGER)
            else:
                draw_bulb(draw, ix, iy, 0.8, t)
            K.text_at(draw, lab, ix, y0 + 200, F(42, True), ink)
        a = K.stagger(progress, 5, step=0.12, speed=4)
        if a > 0:
            K.text_at(draw, "Later…", 1490, 270, F(44, True), muted)
            code_screen(draw, (1220, 350, 1780, 620), ["move(10);", "say(\"Hi!\");"])
            K.pill(draw, 1500, 690, "Same ideas, typed!", K.BOTH_COLOR, size=34)
        return True

    # ---- recap --------------------------------------------------------------------------------
    if visual == "a11-recap":
        recap = [("Snap blocks, no typing", coral, "snap"), ("A stack, top to bottom", MOTION_D, "stack"),
                 ("Start block on top", EVENT_D, "start"), ("Start · Move · Wait · Say", LOOKS_D, "four")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50, True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "snap":
                    mini_block(draw, ix - 130, iy - 60, 220, "flag", 0.8)
                    mini_block(draw, ix - 60, iy + 50, 200, "move", 0.8)
                    K.draw_arrow(draw, ix + 150, iy + 110, ix + 150, iy + 30, coral, width=8, head=22)
                elif kind == "stack":
                    for k, kd in enumerate(("flag", "move", "say")):
                        mini_block(draw, ix - 110, iy - 90 + k * BH * 0.75, 200 - 10 * k, kd, 0.75)
                    K.draw_arrow(draw, ix + 130, iy - 90, ix + 130, iy + 110, MOTION_D, width=8, head=24)
                elif kind == "start":
                    draw_flag(draw, ix - 60, iy - 70, 2.4)
                    mini_block(draw, ix - 110, iy + 10, 220, "flag", 0.8)
                    mini_block(draw, ix - 110, iy + 10 + BH * 0.8, 190, "move", 0.8)
                    K.pill(draw, ix + 100, iy - 120, "1st", EVENT_D, size=26)
                else:
                    for k, kd in enumerate(("flag", "move", "wait", "say")):
                        mini_block(draw, ix - 120 + (k % 2) * 130, iy - 80 + (k // 2) * 100, 110, kd, 0.6)
                font = F(36, True)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            draw_cat(draw, cx + 300, 470 + bounce, 1.4, walk=t)
            K.text_at(draw, "Chapter 1 done!", cx, 660, F(68, True), ink)
            K.pill(draw, cx, 760, "You've met block coding!", coral, size=36)
            stars_around(320, 540, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
