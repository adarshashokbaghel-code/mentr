"""A15 · My First Mini Program — visuals."""
import math
import re

import build as K

MOTION = (76, 151, 255)
LOOKS = (153, 102, 255)
EVENTS = (255, 191, 0)
CONTROL = (255, 171, 25)
SENSING = (92, 177, 214)
DATA = (255, 140, 26)
BLOCK_COLORS = {"hat": EVENTS, "move": MOTION, "say": LOOKS, "if": CONTROL, "data": DATA, "look": LOOKS}
FLAG = (76, 191, 86)
FLAG_DARK = (46, 140, 60)
CAT = (255, 166, 64)
CAT_DARK = (220, 124, 34)
CREAM = (255, 238, 214)
PINK = (255, 150, 170)
SKY = (224, 239, 255)
GRASS = (190, 226, 172)
PAPER = (255, 250, 238)
PAPER_LINE = (220, 210, 232)
BUG_RED = (222, 54, 54)

PLAN = [("when @flag clicked", "hat"), ("move [10] steps", "move"), ("move [10] steps", "move"),
        ("say [Hello!] for [2] secs", "say")]


def shade(c, k: float):
    return tuple(max(0, min(255, int(v * k))) for v in c)


def tint(c, k: float):
    return tuple(int(v + (255 - v) * k) for v in c)


# ---- Scratch-style blocks ------------------------------------------------------------

def _segs(text: str):
    out = []
    for m in re.finditer(r"\[([^\]]*)\]|\{([^}]*)\}|(@flag)|([^\[\{@]+)", text):
        if m.group(1) is not None:
            out.append(("in", m.group(1)))
        elif m.group(2) is not None:
            out.append(("bool", m.group(2)))
        elif m.group(3):
            out.append(("flag", ""))
        elif m.group(4).strip():
            out.append(("t", m.group(4).strip()))
    return out


def _tw(draw, txt: str, font) -> float:
    b = draw.textbbox((0, 0), txt, font=font)
    return b[2] - b[0]


def _seg_w(draw, seg, font, s: float) -> float:
    kind, txt = seg
    if kind == "t":
        return _tw(draw, txt, font)
    if kind == "in":
        return _tw(draw, txt, font) + 40 * s
    if kind == "bool":
        return _tw(draw, txt, font) + 60 * s
    return 46 * s


def block_width(draw, text: str, s: float = 1.0, hat: bool = False) -> float:
    font = K.load_font(int(30 * s), bold=True)
    segs = _segs(text)
    inner = sum(_seg_w(draw, sg, font, s) for sg in segs) + 12 * s * max(0, len(segs) - 1)
    return max(inner + 48 * s, (200 if hat else 140) * s)


def _pts(x, y, W, H, s, top_notch=True, bump=True, bump_dx=0.0):
    r, d = 8 * s, 10 * s
    n = [20 * s, 30 * s, 58 * s, 68 * s]
    pts = [(x, y + r), (x + r, y)]
    if top_notch:
        pts += [(x + n[0], y), (x + n[1], y + d), (x + n[2], y + d), (x + n[3], y)]
    pts += [(x + W - r, y), (x + W, y + r), (x + W, y + H - r), (x + W - r, y + H)]
    if bump:
        b = x + bump_dx
        pts += [(b + n[3], y + H), (b + n[2], y + H + d), (b + n[1], y + H + d), (b + n[0], y + H)]
    pts += [(x + r, y + H), (x, y + H - r)]
    return pts


def draw_flag(draw, x, cy, s: float = 1.0) -> None:
    draw.line((x, cy - 22 * s, x, cy + 24 * s), fill=FLAG_DARK, width=max(2, int(5 * s)))
    pts = [(x, cy - 22 * s), (x + 12 * s, cy - 27 * s), (x + 26 * s, cy - 18 * s), (x + 38 * s, cy - 23 * s),
           (x + 38 * s, cy + 1 * s), (x + 26 * s, cy + 5 * s), (x + 12 * s, cy - 4 * s), (x, cy + 1 * s)]
    draw.polygon(pts, fill=FLAG)


def _block_text(draw, x, y, H, text, s, dim=False) -> None:
    font = K.load_font(int(30 * s), bold=True)
    xc, ym = x + 24 * s, y + H / 2
    for seg in _segs(text):
        kind, txt = seg
        wd = _seg_w(draw, seg, font, s)
        if kind == "t":
            draw.text((xc, ym), txt, fill=(255, 255, 255), font=font, anchor="lm")
        elif kind == "in":
            draw.rounded_rectangle((xc, ym - 23 * s, xc + wd, ym + 23 * s), radius=23 * s, fill=(255, 255, 255))
            draw.text((xc + wd / 2, ym), txt, fill=(80, 86, 104), font=font, anchor="mm")
        elif kind == "bool":
            hx = [(xc, ym), (xc + 22 * s, ym - 25 * s), (xc + wd - 22 * s, ym - 25 * s), (xc + wd, ym),
                  (xc + wd - 22 * s, ym + 25 * s), (xc + 22 * s, ym + 25 * s)]
            draw.polygon(hx, fill=tint(SENSING, 0.5) if dim else SENSING)
            draw.polygon(hx, outline=shade(SENSING, 0.8), width=max(2, int(3 * s)))
            draw.text((xc + wd / 2, ym), txt, fill=(255, 255, 255), font=font, anchor="mm")
        else:
            draw_flag(draw, xc + 4 * s, ym, s * 0.95)
        xc += wd + 12 * s


def block(draw, x, y, text, kind, s=1.0, part="both", glow=False, dim=False, outline=None, width=None) -> float:
    """Top-left anchored stack block. Returns its width."""
    hat = kind == "hat"
    col = BLOCK_COLORS.get(kind, MOTION)
    if dim:
        col = tint(col, 0.55)
    H = 72 * s
    W = width or block_width(draw, text, s, hat)
    pts = _pts(x, y, W, H, s, top_notch=not hat)
    if part in ("both", "shadow"):
        draw.polygon([(px, py + 6 * s) for px, py in pts], fill=shade(col, 0.72))
        if hat:
            draw.chord((x, y - 30 * s + 6 * s, x + 160 * s, y + 34 * s + 6 * s), 180, 360, fill=shade(col, 0.72))
    if part in ("both", "fill"):
        if hat:
            draw.chord((x, y - 30 * s, x + 160 * s, y + 34 * s), 180, 360, fill=col)
        draw.polygon(pts, fill=col)
        if glow or outline:
            draw.polygon(pts, outline=outline or K.GOLD, width=max(3, int(7 * s)))
        if text:
            _block_text(draw, x, y, H, text, s, dim)
    return W


def stack(draw, x, y, items, s=1.0, glow_i=-1, appear=None, dim_from=None, outline_i=-1, outline=None):
    """items: [(text, kind)]. appear: per-item 0..1 slide-in. Returns block rects."""
    H = 72 * s
    rects = []
    for part in ("shadow", "fill"):
        for i, (text, kind) in enumerate(items):
            a = 1.0 if appear is None else appear[i]
            if a <= 0:
                continue
            bx = x + (1 - a) * 90
            by = y + i * H
            dim = dim_from is not None and i >= dim_from
            W = block(draw, bx, by, text, kind, s, part=part, glow=(i == glow_i), dim=dim,
                      outline=outline if i == outline_i else None)
            if part == "fill":
                rects.append((bx, by, bx + W, by + H))
    return rects


def cblock(draw, x, y, head, inner, s=1.0, else_inner=None, glow=False) -> float:
    """Scratch C-block (if / if-else). Returns total height."""
    H, A, B = 72 * s, 30 * s, 40 * s
    W = max(block_width(draw, head, s), 360 * s)
    ih = max(1, len(inner)) * H
    pieces = [_pts(x, y, W, H, s, bump_dx=A)]
    spines = [(x, y + H - 4, x + A, y + H + ih + 4)]
    yb = y + H + ih
    if else_inner is not None:
        pieces.append(_pts(x, yb, 220 * s, 60 * s, s, top_notch=False, bump_dx=A))
        eh = max(1, len(else_inner)) * H
        spines.append((x, yb + 56 * s, x + A, yb + 60 * s + eh + 4))
        y_else = yb
        yb = yb + 60 * s + eh
    pieces.append(_pts(x, yb, 220 * s, B, s, top_notch=False))
    for pts in pieces:
        draw.polygon([(px, py + 6 * s) for px, py in pts], fill=shade(CONTROL, 0.72))
    for sp in spines:
        draw.rectangle((sp[0], sp[1] + 6 * s, sp[2], sp[3] + 6 * s), fill=shade(CONTROL, 0.72))
    for sp in spines:
        draw.rectangle(sp, fill=CONTROL)
    for pts in pieces:
        draw.polygon(pts, fill=CONTROL)
    if glow:
        draw.polygon(pieces[0], outline=K.GOLD, width=max(3, int(7 * s)))
    _block_text(draw, x, y, H, head, s)
    stack(draw, x + A, y + H, inner, s)
    if else_inner is not None:
        _block_text(draw, x, y_else, 60 * s, "else", s)
        stack(draw, x + A, y_else + 60 * s, else_inner, s)
    return yb + B - y


# ---- illustrations -------------------------------------------------------------------

def draw_cat(draw, cx, by, s=1.0, t=0.0, walk=False, d=1) -> tuple[float, float]:
    """by = feet line. Returns the head centre."""
    def S(v):
        return v * s

    def X(v):
        return cx + d * v * s
    bob = S(4) * math.sin(t * math.pi * 10) if walk else 0
    draw.ellipse((cx - S(100), by - S(12), cx + S(100), by + S(12)), fill=K.SHADOW)
    wig = S(10) * math.sin(t * math.pi * 6)
    draw.line([(X(-70), by - S(80)), (X(-118), by - S(120)), (X(-112) + wig, by - S(178))], fill=CAT_DARK,
              width=max(3, int(S(20))), joint="curve")
    draw.ellipse((X(-112) + wig - S(12), by - S(190), X(-112) + wig + S(12), by - S(166)), fill=CAT_DARK)
    for k, lx in enumerate((-55, -25, 22, 50)):
        off = S(9) * math.sin(t * math.pi * 10 + k * math.pi) if walk else 0
        x0 = X(lx) + off
        draw.rounded_rectangle((x0 - S(13), by - S(60), x0 + S(13), by), radius=S(12),
                               fill=CAT_DARK if k in (0, 2) else CAT)
    bx0, bx1 = sorted((X(-88), X(72)))
    draw.ellipse((bx0, by - S(140) + bob, bx1, by - S(40) + bob), fill=CAT)
    ex0, ex1 = sorted((X(-10), X(60)))
    draw.ellipse((ex0, by - S(110) + bob, ex1, by - S(50) + bob), fill=CREAM)
    hx, hy, r = X(48), by - S(178) + bob, S(64)
    for sx in (-1, 1):
        ear = [(hx + sx * S(56), hy - S(26)), (hx + sx * S(44), hy - S(96)), (hx + sx * S(8), hy - S(58))]
        draw.polygon(ear, fill=CAT)
        inner = [(hx + sx * S(46), hy - S(36)), (hx + sx * S(42), hy - S(78)), (hx + sx * S(20), hy - S(56))]
        draw.polygon(inner, fill=PINK)
    draw.ellipse((hx - r, hy - r, hx + r, hy + r), fill=CAT)
    for k in (-1, 0, 1):
        draw.line((hx + k * S(14), hy - S(60), hx + k * S(14), hy - S(40)), fill=CAT_DARK, width=max(2, int(S(6))))
    mx = hx + d * S(8)
    draw.ellipse((mx - S(36), hy + S(6), mx + S(36), hy + S(50)), fill=CREAM)
    blink = (t * 2.7) % 1 > 0.93
    for sx in (-1, 1):
        ex = mx + sx * S(24)
        if blink:
            draw.line((ex - S(12), hy - S(10), ex + S(12), hy - S(10)), fill=K.DEV_DEEP, width=max(2, int(S(5))))
        else:
            draw.ellipse((ex - S(14), hy - S(26), ex + S(14), hy + S(4)), fill=(255, 255, 255))
            draw.ellipse((ex - S(7) + d * S(3), hy - S(18), ex + S(7) + d * S(3), hy - S(4)), fill=K.DEV_DEEP)
    draw.polygon([(mx - S(8), hy + S(12)), (mx + S(8), hy + S(12)), (mx, hy + S(22))], fill=PINK)
    draw.arc((mx - S(16), hy + S(14), mx, hy + S(34)), 20, 160, fill=K.DEV_DEEP, width=max(2, int(S(4))))
    draw.arc((mx, hy + S(14), mx + S(16), hy + S(34)), 20, 160, fill=K.DEV_DEEP, width=max(2, int(S(4))))
    for sx in (-1, 1):
        for k in (-1, 1):
            draw.line((mx + sx * S(30), hy + S(24) + k * S(4), mx + sx * S(70), hy + S(18) + k * S(12)),
                      fill=K.DEV_MID, width=max(1, int(S(3))))
    return hx, hy


def draw_stage(draw, box, brand, running=False, t=0.0, cloud=0.85):
    """Scratch-like stage with flag + stop. Returns the floor y for sprites."""
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=22, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=22, fill=(238, 241, 248), outline=K.DEV_MID, width=4)
    if running:
        draw.ellipse((x0 + 18, y0 + 8, x0 + 74, y0 + 64), fill=(208, 240, 214))
    draw_flag(draw, x0 + 30, y0 + 38, 0.95)
    oc = [(x0 + 112 + 18 * math.cos(math.radians(22.5 + 45 * i)), y0 + 36 + 18 * math.sin(math.radians(22.5 + 45 * i)))
          for i in range(8)]
    draw.polygon(oc, fill=K.DANGER)
    draw.rectangle((x0 + 8, y0 + 70, x1 - 8, y1 - 8), fill=SKY)
    draw.rectangle((x0 + 8, y1 - 80, x1 - 8, y1 - 8), fill=GRASS)
    if cloud is not None:
        ccx = x0 + (x1 - x0) * cloud
        draw.ellipse((ccx - 20, y0 + 96, ccx + 60, y0 + 140), fill=(255, 255, 255))
        draw.ellipse((ccx - 60, y0 + 110, ccx + 20, y0 + 150), fill=(255, 255, 255))
    draw.line((x0 + 8, y0 + 70, x1 - 8, y0 + 70), fill=K.DEV_MID, width=3)
    return y1 - 34


def draw_paper(draw, box, lines: int = 6, gap: int = 86, top: int = 120) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=22, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=22, fill=PAPER)
    for k in range(lines):
        yy = y0 + top + k * gap
        if yy < y1 - 20:
            draw.line((x0 + 30, yy, x1 - 30, yy), fill=PAPER_LINE, width=3)
    draw.line((x0 + 84, y0 + 12, x0 + 84, y1 - 12), fill=(240, 170, 170), width=3)


def draw_pencil(draw, cx, cy, s=1.0, ang=-0.6) -> None:
    ca, sa = math.cos(ang), math.sin(ang)

    def P(px, py):
        return (cx + (px * ca - py * sa) * s, cy + (px * sa + py * ca) * s)
    draw.polygon([P(-110, -16), P(-86, -16), P(-86, 16), P(-110, 16)], fill=PINK)
    draw.polygon([P(-86, -16), P(60, -16), P(60, 16), P(-86, 16)], fill=K.GOLD)
    draw.polygon([P(-86, -4), P(60, -4), P(60, 4), P(-86, 4)], fill=(240, 160, 40))
    draw.polygon([P(60, -16), P(100, 0), P(60, 16)], fill=CREAM)
    draw.polygon([P(86, -6), P(100, 0), P(86, 6)], fill=K.DEV_DEEP)


def draw_bulb(draw, cx, cy, s=1.0, on=True, t=0.0) -> None:
    def S(v):
        return v * s
    if on:
        for k in range(8):
            a = k * math.pi / 4 + t * 0.6
            r0, r1 = S(96), S(128 + 8 * math.sin(t * 12 + k))
            draw.line((cx + math.cos(a) * r0, cy - S(10) + math.sin(a) * r0,
                       cx + math.cos(a) * r1, cy - S(10) + math.sin(a) * r1), fill=K.GOLD, width=max(3, int(S(10))))
    glass = (255, 222, 110) if on else (238, 236, 228)
    draw.ellipse((cx - S(72), cy - S(82), cx + S(72), cy + S(62)), fill=glass, outline=K.DEV_DARK,
                 width=max(2, int(S(5))))
    draw.polygon([(cx - S(40), cy + S(48)), (cx + S(40), cy + S(48)), (cx + S(30), cy + S(80)), (cx - S(30), cy + S(80))],
                 fill=glass)
    draw.line([(cx - S(22), cy + S(40)), (cx - S(12), cy - S(4)), (cx, cy + S(10)), (cx + S(12), cy - S(4)),
               (cx + S(22), cy + S(40))], fill=(220, 140, 40), width=max(2, int(S(5))))
    for k in range(3):
        yy = cy + S(80) + k * S(16)
        draw.rounded_rectangle((cx - S(32), yy, cx + S(32), yy + S(14)), radius=S(6), fill=K.STEEL if k % 2 == 0
                               else K.STEEL_DARK)
    draw.arc((cx - S(48), cy - S(60), cx + S(4), cy - S(8)), 190, 260, fill=(255, 255, 255), width=max(2, int(S(8))))


def draw_wrench(draw, cx, cy, s, color, bg) -> None:
    def S(v):
        return v * s
    draw.line((cx - S(70), cy + S(70), cx + S(36), cy - S(36)), fill=color, width=max(4, int(S(32))))
    draw.ellipse((cx - S(86), cy + S(54), cx - S(54), cy + S(86)), fill=color)
    draw.ellipse((cx + S(4), cy - S(96), cx + S(96), cy - S(4)), fill=color)
    draw.ellipse((cx + S(48), cy - S(108), cx + S(100), cy - S(56)), fill=bg)
    draw.ellipse((cx - S(76), cy + S(64), cx - S(64), cy + S(76)), fill=bg)


def draw_ladybug(draw, cx, cy, s=1.0, t=0.0) -> None:
    def S(v):
        return v * s
    for sx in (-1, 1):
        for k in range(3):
            yy = cy - S(30) + k * S(40)
            kick = S(6) * math.sin(t * 20 + k)
            draw.line((cx + sx * S(60), yy, cx + sx * S(104), yy + S(16) + kick), fill=K.DEV_DEEP, width=max(2, int(S(8))))
    for sx in (-1, 1):
        draw.line((cx + sx * S(16), cy - S(100), cx + sx * S(50), cy - S(150)), fill=K.DEV_DEEP, width=max(2, int(S(6))))
        draw.ellipse((cx + sx * S(50) - S(11), cy - S(161), cx + sx * S(50) + S(11), cy - S(139)), fill=K.DEV_DEEP)
    draw.ellipse((cx - S(84) + S(6), cy - S(70) + S(8), cx + S(84) + S(6), cy + S(96) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(50), cy - S(122), cx + S(50), cy - S(40)), fill=K.DEV_DEEP)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(22) - S(12), cy - S(104), cx + sx * S(22) + S(12), cy - S(80)), fill=(255, 255, 255))
        draw.ellipse((cx + sx * S(22) - S(5), cy - S(96), cx + sx * S(22) + S(5), cy - S(86)), fill=K.DEV_DEEP)
    draw.ellipse((cx - S(84), cy - S(70), cx + S(84), cy + S(96)), fill=BUG_RED)
    draw.line((cx, cy - S(68), cx, cy + S(94)), fill=K.DEV_DEEP, width=max(2, int(S(6))))
    for dx, dy, r in ((-42, -20, 16), (40, -24, 14), (-46, 40, 14), (44, 34, 17), (-16, 72, 11), (18, 74, 10)):
        draw.ellipse((cx + S(dx) - S(r), cy + S(dy) - S(r), cx + S(dx) + S(r), cy + S(dy) + S(r)), fill=K.DEV_DEEP)
    draw.arc((cx - S(66), cy - S(54), cx - S(10), cy + S(10)), 190, 250, fill=(255, 150, 150), width=max(2, int(S(8))))


def draw_trophy(draw, cx, cy, s=1.0) -> None:
    def S(v):
        return v * s
    gold_d = (214, 146, 30)
    for sx, a0, a1 in ((-1, 90, 270), (1, 270, 450)):
        draw.arc((cx + sx * S(92) - S(52), cy - S(96), cx + sx * S(92) + S(52), cy + S(4)), a0, a1,
                 fill=gold_d, width=max(3, int(S(16))))
    draw.chord((cx - S(100) + S(8), cy - S(200) + S(10), cx + S(100) + S(8), cy + S(40) + S(10)), 0, 180, fill=K.SHADOW)
    draw.chord((cx - S(100), cy - S(200), cx + S(100), cy + S(40)), 0, 180, fill=K.GOLD)
    draw.rectangle((cx - S(108), cy - S(96), cx + S(108), cy - S(76)), fill=gold_d)
    draw.rectangle((cx - S(18), cy + S(38), cx + S(18), cy + S(84)), fill=gold_d)
    draw.rounded_rectangle((cx - S(76), cy + S(80), cx + S(76), cy + S(124)), radius=S(10), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(40), cy + S(90), cx + S(40), cy + S(114)), radius=S(6), fill=K.GOLD)
    K.draw_star(draw, cx, cy - S(28), S(40), (255, 255, 255))


def draw_cursor(draw, x, y, s=1.0) -> None:
    pts = [(x, y), (x, y + 64 * s), (x + 16 * s, y + 50 * s), (x + 28 * s, y + 76 * s), (x + 40 * s, y + 70 * s),
           (x + 28 * s, y + 46 * s), (x + 48 * s, y + 46 * s)]
    draw.polygon(pts, fill=(255, 255, 255))
    draw.polygon(pts, outline=K.DEV_DEEP, width=max(2, int(4 * s)))


def flag_button(draw, cx, cy, r, pulse=0.0) -> None:
    draw.ellipse((cx - r + 10, cy - r + 12, cx + r + 10, cy + r + 12), fill=K.SHADOW)
    rr = r * (1 + 0.04 * pulse)
    draw.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=(214, 244, 220), outline=FLAG_DARK, width=6)
    draw_flag(draw, cx - r * 0.3, cy + r * 0.05, r / 50)


def mini_stack_icon(draw, x, y, s, n=3) -> None:
    items = [("start", "hat"), ("move", "move"), ("say", "say"), ("move", "move")][:n]
    if s < 0.87:
        items = [("", k) for _, k in items]
    stack(draw, x, y, items, s)


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
    gold_soft = K.hex_rgb("#FFF4D9")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    F = K.load_font
    step_specs = [("Idea", K.GOLD, gold_soft), ("Blocks", MOTION, blue_soft), ("Test", FLAG_DARK, sage_soft),
                  ("Fix", coral, coral_soft)]

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def stars_at(x, y, r, n=4):
        for i in range(n):
            a = i * 2 * math.pi / n + 0.4
            sx = x + math.cos(a) * r
            sy = y + math.sin(a) * r * 0.7 + 10 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 20 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def step_icon(i, x, y, s=1.0, bg=panel):
        if i == 0:
            draw_bulb(draw, x, y - 10 * s, 0.75 * s, True, t)
        elif i == 1:
            mini_stack_icon(draw, x - 90 * s, y - 100 * s, 0.9 * s)
        elif i == 2:
            draw_flag(draw, x - 40 * s, y, 2.2 * s)
        else:
            draw_wrench(draw, x, y, 0.9 * s, coral, bg)

    def bubble(box, text, tail="left", size=38):
        K.draw_bubble(draw, box, brand, text, tail=tail, size=size)

    def dashed_slot(box, col):
        x0, y0, x1, y1 = box
        ph = progress * 120
        for (a, b, c, d) in ((x0, y0, x1, y0), (x0, y1, x1, y1), (x0, y0, x0, y1), (x1, y0, x1, y1)):
            K.draw_dashed(draw, a, b, c, d, col, width=4, phase=ph)

    # ---- opening -------------------------------------------------------------------
    if visual == "a15-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            draw_cat(draw, cx + 280, 640, 1.25, t)
            text_at = K.text_at
            text_at(draw, "Welcome back, champ!", cx, 730, F(60, bold=True), ink)
            stars_around(330, 520)
            return True
        if focus == "bridge":
            K.text_at(draw, "Last time", 440, 236 + lift, F(44, bold=True), muted)
            cblock(draw, 140, 330, "if {touching wall?} then", [("bounce", "move")], 1.3,
                   else_inner=[("move [10] steps", "move")], glow=progress > 0.3)
            fy = draw_stage(draw, (1000, 260, 1760, 800), brand, running=True, t=t, cloud=0.3)
            draw.rectangle((1690, 330, 1752, fy + 26), fill=(196, 150, 120))
            for k in range(6):
                draw.line((1690, 360 + k * 70, 1752, 360 + k * 70), fill=(160, 112, 86), width=4)
            bx = 1500 - 160 * abs(math.sin(progress * math.pi * 1.5))
            draw_cat(draw, bx, fy, 0.85, t, walk=True, d=1 if math.cos(progress * math.pi * 1.5) > 0 else -1)
            if progress > 0.35:
                K.draw_arrow(draw, 1660, 420, 1560, 420, coral, width=10, head=28)
                K.pill(draw, 1440, 300, "Bounce!", coral, size=30)
            return True
        if focus == "unit":
            draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=blue_soft)
            tower = [("when @flag clicked", "hat"), ("move [10] steps", "move"), ("say [Hi!]", "say"),
                     ("change [score] by [1]", "data")]
            stack(draw, 280, 400, tower, 0.95, appear=[K.stagger(progress, i, 0.08, 5) for i in range(4)])
            K.pill(draw, 0, 280 + lift, "UNIT 3", coral, size=34, left=900)
            K.text_at(draw, "Building", 1300, 360 + lift, F(84, bold=True), ink)
            K.text_at(draw, "With Blocks", 1300, 460 + lift, F(84, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a <= 0:
                    continue
                x = 1060 + i * 120
                y = 630 + int((1 - a) * 30)
                last = i == 4
                fill = coral_soft if last else sage_soft
                draw.rounded_rectangle((x - 48, y - (8 * pulse if last else 0), x + 48, y + 92), radius=22, fill=fill,
                                       outline=coral if last else sage, width=5 if last else 3)
                if last:
                    K.text_at(draw, "5", x, y + 14, F(50, bold=True), coral)
                else:
                    K.draw_check(draw, x, y + 46, 26, sage)
            K.text_at(draw, "Chapter 5 · the last one!", 1300, 760, F(34, bold=True), coral)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5", cx, 300 + lift, F(32, bold=True), coral)
            K.text_at(draw, "My First Mini Program", cx, 360 + lift, F(84, bold=True), ink)
            items = PLAN[:1] + PLAN[1:2] + PLAN[3:4]
            stack(draw, 420, 600, items, 0.92, appear=[K.stagger(progress, i + 1, 0.12, 4) for i in range(3)])
            a = K.stagger(progress, 5, 0.1, 4)
            if a > 0:
                K.draw_arrow(draw, 1010, 700, 1010 + 140 * a, 700, muted, width=10, head=30)
                draw_cat(draw, 1360, 850, 0.8, t)
                bubble((1460, 560, 1720, 660), "Hello!", size=40)
            return True
        # promise
        K.draw_person(draw, 360, 440, 1.2, "kid", t)
        K.draw_device(draw, "laptop", 900, 590, 1.55, brand, t)
        draw_cat(draw, 900, 655, 0.55, t, walk=True)
        verbs = [("Plan", K.GOLD), ("Build", MOTION), ("Test", FLAG_DARK), ("Fix", coral)]
        for i, (lab, col) in enumerate(verbs):
            a = K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            y = 270 + i * 140 + int((1 - a) * 30)
            draw.rounded_rectangle((1340, y, 1720, y + 110), radius=55, fill=panel, outline=col, width=6)
            draw.ellipse((1360, y + 15, 1440, y + 95), fill=col)
            K.text_at(draw, str(i + 1), 1400, y + 24, F(46, bold=True), (255, 255, 255))
            draw.text((1470, y + 28), lab, fill=ink, font=F(50, bold=True))
        K.text_at(draw, "Your very own program!", 900, 810, F(40, bold=True), coral)
        return True

    # ---- Arjun's story ---------------------------------------------------------------
    if visual == "a15-hook":
        if focus == "meet":
            draw.ellipse((600 - 270, 540 - 270, 600 + 270, 540 + 270), fill=blue_soft)
            K.draw_person(draw, 600, 470, 1.45, "kid", t)
            K.text_at(draw, "Meet", 1290, 300 + lift, F(60, bold=True), muted)
            K.text_at(draw, "Arjun!", 1290, 370 + lift, F(130, bold=True), coral)
            K.pill(draw, 1290, 560, "brand new coder", sage, size=36)
            draw_cat(draw, 1290, 850, 0.6, t)
            for i, (sx, sy) in enumerate(((1000, 330), (1600, 300), (1660, 700), (940, 720))):
                K.draw_star(draw, sx, sy + 10 * math.sin(t * 9 + i), 22 + 6 * pulse,
                            [coral, sage, K.BOTH_COLOR, K.GOLD][i], rot=t * 3 + i)
            return True
        if focus == "want":
            K.draw_person(draw, 300, 500, 1.05, "kid", t)
            for k, (dx, dy, r) in enumerate(((420, 400, 14), (460, 360, 20))):
                draw.ellipse((dx - r, dy - r, dx + r, dy + r), fill=panel, outline=line, width=3)
            fy = draw_stage(draw, (520, 250, 1760, 800), brand, t=t, cloud=0.25)
            cat_x = K.lerp(720, 1350, K.ease_in_out(K.clamp01(progress * 1.6)))
            K.draw_dashed(draw, 720, fy + 10, 1350, fy + 10, muted, width=5, phase=progress * 80)
            draw_cat(draw, cat_x, fy, 0.95, t, walk=progress < 0.62)
            if progress > 0.62:
                bubble((1440, 380, 1720, 490), "Hello!", size=44)
            K.text_at(draw, "Arjun's idea", 300, 820, F(34, bold=True), muted)
            return True
        if focus == "rush":
            spots = [(170, 300, "say [Hello!] for [2] secs", "say"), (320, 470, "when @flag clicked", "hat"),
                     (210, 630, "move [10] steps", "move"), (560, 740, "move [10] steps", "move")]
            for i, (bx, by, text, kind) in enumerate(spots):
                a = K.stagger(progress, i, step=0.08, speed=5)
                if a <= 0:
                    continue
                block(draw, bx + (1 - a) * 80, by - (1 - a) * 40, text, kind, 1.1)
            flag_button(draw, 1250, 500, 110, pulse)
            draw_cursor(draw, 1262, 520, 1.3)
            K.draw_person(draw, 1640, 470, 1.1, "kid", t * 2)
            K.pill(draw, 1250, 680, "No plan!", K.DANGER, size=40)
            for k in range(3):
                ang = -0.9 + k * 0.5
                draw.line((1250 + math.cos(ang) * 140, 500 + math.sin(ang) * 140, 1250 + math.cos(ang) * 175,
                           500 + math.sin(ang) * 175), fill=K.GOLD, width=10)
            return True
        if focus == "oops":
            labels = [("1. Hello first!", True), ("2. Walks right…", False), ("3. Gone!", True)]
            for i, (lab, bad) in enumerate(labels):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x0 = 140 + i * 570
                y0 = 270 + int((1 - a) * 30)
                fy = draw_stage(draw, (x0, y0, x0 + 500, y0 + 430), brand, running=True, t=t,
                                cloud=0.8 if i else None)
                if i == 0:
                    draw_cat(draw, x0 + 120, fy, 0.6, t)
                    bubble((x0 + 210, y0 + 96, x0 + 460, y0 + 176), "Hello!", size=34)
                elif i == 1:
                    draw_cat(draw, x0 + 300, fy, 0.6, t, walk=True)
                    for k in range(3):
                        draw.line((x0 + 160 - k * 30, fy - 60 - k * 30, x0 + 210 - k * 30, fy - 60 - k * 30),
                                  fill=K.DEV_MID, width=6)
                else:
                    K.draw_arrow(draw, x0 + 260, fy - 100, x0 + 480, fy - 100, K.DANGER, width=10, head=30)
                    K.text_at(draw, "?", x0 + 200, y0 + 130, F(int(110 + 20 * pulse), bold=True), K.GOLD)
                ty = y0 + 456
                K.text_at(draw, lab, x0 + 250, ty, F(36, bold=True), K.DANGER if bad else ink)
                if bad:
                    K.draw_cross(draw, x0 + 470, ty + 22, 22, K.DANGER)
            return True
        if focus == "why":
            draw.ellipse((cx - 290, 540 - 290, cx + 290, 540 + 290), fill=lav_soft)
            K.draw_person(draw, cx, 470, 1.35, "kid", 0)
            for k, (qx, qy) in enumerate(((cx - 400, 320), (cx + 380, 300), (cx - 450, 580), (cx + 440, 560))):
                K.text_at(draw, "?", qx, qy, F(int(90 + 24 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)
            K.text_at(draw, "What went wrong?", cx, 236, F(50, bold=True), ink)
            K.draw_stopwatch(draw, cx + 620, 760, 50, progress, brand)
            return True
        # because
        K.draw_person(draw, 420, 470, 1.15, "kid", t)
        reasons = [("Not bad at coding", sage), ("He just rushed", coral), ("Use 4 simple steps!", K.BOTH_COLOR)]
        for i, (lab, col) in enumerate(reasons):
            a = K.stagger(progress, i, step=0.22, speed=4)
            if a <= 0:
                continue
            y = 280 + i * 180 + int((1 - a) * 30)
            draw.rounded_rectangle((820, y, 1680, y + 140), radius=36, fill=panel, outline=col, width=5)
            draw.ellipse((850, y + 30, 930, y + 110), fill=col)
            K.text_at(draw, str(i + 1), 890, y + 38, F(48, bold=True), (255, 255, 255))
            draw.text((960, y + 42), lab, fill=ink, font=F(50, bold=True))
        return True

    # ---- the four steps ------------------------------------------------------------------
    if visual == "a15-steps":
        if focus == "intro":
            for i, (lab, col, soft) in enumerate(step_specs):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 430
                y = 520 + int((1 - a) * 40)
                r = 150 * (0.85 + 0.15 * a)
                draw.ellipse((x - r + 8, y - r + 10, x + r + 8, y + r + 10), fill=K.SHADOW)
                draw.ellipse((x - r, y - r, x + r, y + r), fill=soft, outline=col, width=6)
                step_icon(i, x, y, 1.0, soft)
                K.pill(draw, x, 290, str(i + 1), col, size=30)
                K.text_at(draw, lab, x, 700, F(56, bold=True), col)
                if i < 3:
                    na = K.stagger(progress, i + 0.6, step=0.14, speed=4)
                    if na > 0:
                        K.draw_arrow(draw, x + 160, y, x + 160 + 110 * na, y, muted, width=10, head=28)
            return True
        if focus == "each":
            subs = ["Decide what it does", "Plan on paper, then snap", "Click the flag, then watch",
                    "Change what went wrong"]
            for i, (lab, col, soft) in enumerate(step_specs):
                a = K.stagger(progress, i, step=0.2, speed=4)
                x0 = 110 + i * 435
                y0 = 250 + int((1 - a) * 40)
                active = a > 0
                draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 400 + 8, y0 + 600 + 10), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 600), radius=36, fill=soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                K.pill(draw, 0, y0 + 24, str(i + 1), col, size=28, left=x0 + 24)
                step_icon(i, x0 + 200, y0 + 210, 0.95, soft if active else panel)
                K.text_at(draw, lab, x0 + 200, y0 + 340, F(56, bold=True), col)
                font = F(36, bold=True)
                for j, ln in enumerate(K.wrap_text(subs[i], font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 440 + j * 46, font, ink)
            return True
        # first
        draw.ellipse((560 - 260, 540 - 260, 560 + 260, 540 + 260), fill=gold_soft)
        draw_bulb(draw, 560, 520, 1.5 + 0.05 * pulse, True, t)
        K.pill(draw, 0, 300 + lift, "STEP 1", K.GOLD, size=34, left=1000, fg=ink)
        K.text_at(draw, "Always start with", 1340, 400 + lift, F(56, bold=True), muted)
        K.text_at(draw, "an idea!", 1340, 480 + lift, F(110, bold=True), coral)
        a = K.stagger(progress, 3, 0.1, 4)
        if a > 0:
            draw.rounded_rectangle((1010, 680, 1680, 790), radius=40, fill=panel, outline=line, width=3)
            K.text_at(draw, "Know what you want to make", 1345, 712, F(36, bold=True), ink)
        return True

    # ---- picking an idea -----------------------------------------------------------------
    if visual == "a15-idea":
        if focus == "tiny":
            draw_paper(draw, (140, 260, 760, 800), lines=5, gap=100, top=200)
            K.text_at(draw, "My idea", 450, 290, F(48, bold=True), coral)
            font = F(44, bold=True)
            for j, ln in enumerate(("Cat walks,", "then says", "hello!")):
                draw.text((250, 400 + j * 100), ln, fill=ink, font=font)
            draw_pencil(draw, 640, 730, 0.9)
            fy = draw_stage(draw, (860, 260, 1780, 720), brand, t=t, cloud=0.2)
            cx2 = K.lerp(1000, 1300, K.ease_in_out(K.clamp01(progress * 1.5)))
            draw_cat(draw, cx2, fy, 0.75, t, walk=progress < 0.66)
            if progress > 0.66:
                bubble((1420, 360, 1700, 450), "Hello!", size=40)
            K.pill(draw, 1320, 770, "1 character · 1 short story", sage, size=34)
            return True
        if focus == "joke":
            fy = draw_stage(draw, (180, 250, 1300, 820), brand, t=t, cloud=0.15)
            mx = K.lerp(330, 540, K.ease_out_cubic(K.clamp01(progress * 2)))
            K.draw_mascot(draw, int(mx), int(fy - 120), 110, sage, panel, bounce)
            bubble((690, 380, 1250, 570), "Why did the bat go to school?", size=40)
            K.text_at(draw, "?", 1500, 300, F(int(120 + 20 * pulse), bold=True), K.GOLD)
            draw.rounded_rectangle((1360, 480, 1760, 760), radius=36, fill=lav_soft, outline=K.BOTH_COLOR, width=5)
            K.text_at(draw, "You choose", 1560, 540, F(44, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "the funny", 1560, 600, F(44, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "answer!", 1560, 660, F(44, bold=True), K.BOTH_COLOR)
            return True
        # big
        draw.rounded_rectangle((120, 250, 1000, 830), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=5)
        K.text_at(draw, "50 blocks · 10 characters", 560, 274, F(40, bold=True), K.DANGER)
        kinds = ["move", "say", "hat", "if", "data", "move", "say", "move"]
        for k in range(14):
            bx = 160 + (k * 137) % 640
            by = 350 + (k * 53) % 300 + (k % 3) * 40
            block(draw, bx, by, "", kinds[k % len(kinds)], 0.6)
        for k in range(5):
            draw_cat(draw, 210 + k * 160, 815, 0.32, t + k * 0.2, walk=True, d=1 if k % 2 else -1)
        K.draw_cross(draw, 940, 300, 34, K.DANGER)
        draw.rounded_rectangle((1100, 250, 1800, 830), radius=36, fill=sage_soft, outline=sage, width=5)
        K.text_at(draw, "Small & clear", 1450, 274, F(44, bold=True), sage)
        stack(draw, 1160, 390, PLAN, 0.78)
        draw_cat(draw, 1640, 790, 0.5, t)
        K.draw_check(draw, 1750, 300, 34, sage)
        return True

    # ---- planning on paper ---------------------------------------------------------------
    if visual == "a15-plan":
        if focus == "why":
            draw_paper(draw, (160, 260, 820, 840), lines=6, gap=90, top=170)
            K.text_at(draw, "My plan", 490, 290, F(48, bold=True), coral)
            draw_pencil(draw, 640, 640, 1.2, ang=-0.7 + 0.08 * math.sin(t * 20))
            qs = [("Which blocks?", MOTION, blue_soft), ("What order?", K.BOTH_COLOR, lav_soft)]
            for i, (lab, col, soft) in enumerate(qs):
                a = K.stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 320 + i * 250 + int((1 - a) * 30)
                draw.rounded_rectangle((960, y, 1760, y + 190), radius=40, fill=soft, outline=col, width=5)
                if i == 0:
                    mini_stack_icon(draw, 1000, y + 30, 0.55, 3)
                else:
                    for k in range(3):
                        x = 1040 + k * 60
                        draw.ellipse((x - 24, y + 71, x + 24, y + 119), fill=col)
                        K.text_at(draw, str(k + 1), x, y + 76, F(30, bold=True), (255, 255, 255))
                draw.text((1220, y + 64), lab, fill=ink, font=F(54, bold=True))
                K.draw_check(draw, 1700, y + 95, 30, sage)
            return True
        if focus == "write":
            draw_paper(draw, (120, 250, 840, 850), lines=5, gap=110, top=200)
            K.text_at(draw, "Cat plan", 480, 276, F(46, bold=True), coral)
            written = ["when flag clicked", "move 10 steps", "move 10 steps", "say Hello! 2 secs"]
            n = progress * 5.2 - 0.3
            font = F(42, bold=True)
            for i, txt in enumerate(written):
                a = K.ease_out_cubic(K.clamp01((n - i) * 2.5))
                if a <= 0:
                    continue
                y = 350 + i * 110
                draw.text((230, y + 30), f"{i + 1}. {txt}", fill=ink, font=font)
            s = 1.1
            stack(draw, 960, 380, PLAN, s,
                  appear=[K.ease_out_cubic(K.clamp01((n - i - 0.3) * 2.5)) for i in range(4)])
            labels = [("start", EVENTS), ("motion", MOTION), ("motion", MOTION), ("say", LOOKS)]
            for i, (lab, col) in enumerate(labels):
                if K.clamp01((n - i - 0.3) * 2.5) >= 1:
                    K.pill(draw, 0, 380 + i * 72 * s + 14, lab, col, size=28, left=1610)
            return True
        # recipe
        parts = [("1 start", [("when @flag clicked", "hat")], EVENTS),
                 ("2 motions", [("move [10] steps", "move"), ("move [10] steps", "move")], MOTION),
                 ("1 say", [("say [Hello!]", "say")], LOOKS)]
        s = 1.2
        xs = [130, 730, 1350]
        for i, (lab, items, col) in enumerate(parts):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x0 = xs[i]
            y0 = 290 + int((1 - a) * 40)
            bw = max(block_width(draw, tx, s, k == "hat") for tx, k in items)
            stack(draw, x0, y0 + 50, items, s)
            K.text_at(draw, lab, x0 + bw / 2, y0 + 250, F(52, bold=True), col)
            if i < 2:
                K.text_at(draw, "+", xs[i + 1] - 70, y0 + 70, F(90, bold=True), muted)
        a = K.stagger(progress, 4, 0.12, 4)
        if a > 0:
            K.pill(draw, cx, 680 + int((1 - a) * 20), "= a great tiny plan!", sage, size=46)
            for i, sx in enumerate((cx - 460, cx + 460)):
                K.draw_star(draw, sx, 715, 26 + 6 * pulse, [K.GOLD, coral][i], rot=t * 3 + i)
        return True

    # ---- build & test ---------------------------------------------------------------------
    if visual == "a15-build":
        if focus == "snap":
            draw_paper(draw, (120, 280, 560, 780), lines=4, gap=100, top=180)
            K.text_at(draw, "Plan", 340, 300, F(42, bold=True), coral)
            for i, txt in enumerate(("1. start", "2. move", "3. move", "4. say")):
                draw.text((220, 362 + i * 100), txt, fill=ink, font=F(38, bold=True))
            K.draw_arrow(draw, 600, 530, 760, 530, muted, width=12, head=34)
            n = progress * 5.0 - 0.2
            stack(draw, 880, 340, PLAN, 1.1, appear=[K.ease_out_cubic(K.clamp01((n - i) * 2.2)) for i in range(4)])
            K.draw_arrow(draw, 1640, 330, 1640, 650, coral, width=12, head=34)
            K.text_at(draw, "Top to", 1640, 670, F(36, bold=True), coral)
            K.text_at(draw, "bottom", 1640, 712, F(36, bold=True), coral)
            return True
        if focus == "start":
            draw.ellipse((cx - 520, 250, cx + 520, 560), fill=gold_soft)
            s = 1.7
            bw = block_width(draw, PLAN[0][0], s, hat=True)
            block(draw, cx - bw / 2, 330, PLAN[0][0], "hat", s, glow=pulse > 0.5)
            stack(draw, cx - bw / 2, 330 + 72 * s, PLAN[1:], 0.9, dim_from=0)
            a = K.stagger(progress, 2, 0.12, 4)
            if a > 0:
                K.pill(draw, 0, 300 + int((1 - a) * 20), "Starts the program", coral, size=34, left=1330)
                K.pill(draw, 0, 760 + int((1 - a) * 20), "Tells the computer when to begin", sage, size=34,
                       left=1000)
            return True
        # test
        stage_p = K.clamp01((progress - 0.08) * 1.25)
        cur = min(3, int(stage_p * 4))
        rects = stack(draw, 130, 360, PLAN, 0.95, glow_i=cur)
        K.text_at(draw, "Running…", 360, 270, F(40, bold=True), muted)
        fy = draw_stage(draw, (840, 250, 1780, 820), brand, running=True, t=t, cloud=0.3)
        pos = [960, 960, 1180, 1400][cur]
        prev = [960, 960, 960, 1180][cur]
        local = (stage_p * 4) - cur
        cat_x = K.lerp(prev, pos, K.ease_in_out(K.clamp01(local * 1.4))) if cur in (1, 2) else pos
        if cur == 3:
            cat_x = 1400
        draw_cat(draw, cat_x, fy, 0.9, t, walk=cur in (1, 2))
        if cur == 3:
            bubble((1500, 360, 1760, 450), "Hello!", size=40)
        if progress > 0.85:
            K.draw_check(draw, 760, 300, 34, sage)
        return True

    # ---- bugs ------------------------------------------------------------------------------
    if visual == "a15-bug":
        if focus == "what":
            draw.ellipse((520 - 260, 560 - 260, 520 + 260, 560 + 260), fill=coral_soft)
            draw_ladybug(draw, 500, 560, 1.4, t)
            K.draw_magnifier(draw, 690, 400, 1.0, coral)
            K.shadow_card(draw, (900, 280, 1780, 800), brand, radius=40, accent=coral)
            K.text_at(draw, "BUG", 1340, 370, F(96, bold=True), coral)
            font = F(44, bold=True)
            for j, ln in enumerate(("A mistake that makes", "the program do something", "you didn't plan.")):
                a = K.stagger(progress, j + 1, step=0.15, speed=4)
                if a > 0:
                    K.text_at(draw, ln, 1340, 520 + j * 70 + int((1 - a) * 20), font, ink)
            return True
        # normal
        K.text_at(draw, "Every coder finds bugs!", cx, 236 + lift, F(60, bold=True), ink)
        people = [("kid", "You"), ("teacher", "Teachers"), ("dad", "Experts")]
        for i, (kind, lab) in enumerate(people):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 520
            y = 430 + int((1 - a) * 30)
            draw.ellipse((x - 200, y - 110, x + 200, y + 290), fill=[coral_soft, sage_soft, blue_soft][i])
            K.draw_person(draw, x - 40, y, 0.95, kind, t + i * 0.3)
            draw_ladybug(draw, x + 120, y + 130, 0.42, t + i)
            K.draw_check(draw, x + 140, y - 40, 30, sage)
            K.text_at(draw, lab, x, y + 300, F(40, bold=True), ink)
        a = K.stagger(progress, 4, 0.1, 4)
        if a > 0:
            K.pill(draw, cx, 800 + int((1 - a) * 10), "Testing & fixing is part of the job", coral, size=32)
        return True

    # ---- fix 1: wrong order ---------------------------------------------------------------
    if visual == "a15-fix1":
        ans = focus == "answer"
        wrong = [PLAN[0], PLAN[3], PLAN[1], PLAN[2]]
        move = K.ease_in_out(K.clamp01((progress - 0.05) * 2.2)) if ans else 0.0
        K.text_at(draw, "Arjun's blocks", 420, 250, F(40, bold=True), muted)
        H = 72 * 0.95
        order_pos = {0: 0, 1: 3, 2: 1, 3: 2}
        for part in ("shadow", "fill"):
            for i, (text, kind) in enumerate(wrong):
                pos = K.lerp(i, order_pos[i], move)
                shift = 0
                if ans and i == 1:
                    shift = 120 * math.sin(move * math.pi)
                bad = i == 1
                block(draw, 120 + shift, 340 + pos * H, text, kind, 0.95, part=part,
                      outline=(K.DANGER if not ans else sage) if (bad and (ans or progress > 0.5)) else None)
        if ans and move > 0.95:
            K.draw_check(draw, 760, 340 + 3 * H + 36, 28, sage)
        fy = draw_stage(draw, (900, 260, 1780, 760), brand, running=True, t=t, cloud=0.75)
        if not ans:
            draw_cat(draw, 1060, fy, 0.85, t)
            bubble((1180, 360, 1440, 450), "Hello!", size=40)
            K.draw_cross(draw, 1480, 370, 28, K.DANGER)
            K.pill(draw, 1340, 796, "Hello before walking?", K.DANGER, size=30)
            K.draw_stopwatch(draw, 420, 760, 44, progress, brand)
        else:
            walk = K.clamp01((progress - 0.45) * 2)
            cat_x = K.lerp(1060, 1420, K.ease_in_out(walk))
            draw_cat(draw, cat_x, fy, 0.85, t, walk=0 < walk < 1)
            if walk >= 1:
                bubble((1460, 360, 1730, 450), "Hello!", size=40)
                stars_at(1400, 560, 300, 4)
        return True

    # ---- fix 2: off the edge --------------------------------------------------------------
    if visual == "a15-fix2":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            fy = draw_stage(draw, (120, 260, 1000, 800), brand, running=True, t=t, cloud=None)
            if not ans:
                draw_cat(draw, 760, fy, 0.85, t, walk=True)
                K.draw_arrow(draw, 860, fy - 260, 1030, fy - 260, K.DANGER, width=12, head=36)
                K.text_at(draw, "Off the edge!", 560, 350, F(44, bold=True), K.DANGER)
            else:
                bounce_t = K.clamp01(progress * 1.6)
                cat_x = 860 - 380 * K.ease_out_cubic(bounce_t)
                draw_cat(draw, cat_x, fy, 0.85, t, walk=True, d=-1)
                K.draw_curve(draw, (760, fy - 300), (980, fy - 420), (980, fy - 240), coral, width=8)
                K.draw_arrow(draw, 940, fy - 290, 760, fy - 300, coral, width=10, head=30)
                K.text_at(draw, "Boing!", 560, 350, F(48, bold=True), sage)
            opts = [("say [Hello!]", "say"), ("set [score] to [0]", "data"), ("hide", "look")]
            for i, (text, kind) in enumerate(opts):
                y = 280 + i * 120
                dim = ans
                K.pill(draw, 0, y + 14, "ABC"[i], K.BOTH_COLOR if not ans else line, size=28, left=1080)
                block(draw, 1170, y, text, kind, 0.9, dim=dim)
            y = 280 + 3 * 120
            K.pill(draw, 0, y + 14, "D", K.BOTH_COLOR if not ans else sage, size=28, left=1080)
            cblock(draw, 1170, y, "if {touching edge?} then", [("bounce", "move")], 0.9, glow=ans and pulse > 0.4)
            if ans:
                K.draw_check(draw, 1760, y + 34, 30, sage)
            else:
                K.draw_stopwatch(draw, 1700, 760, 40, progress, brand)
            return True
        # share
        K.draw_person(draw, 330, 460, 1.2, "kid", t)
        bubble((470, 250, 1080, 430), "I moved my say block and added a bounce!", tail="left", size=40)
        fixed = PLAN[:3]
        rects = stack(draw, 1150, 300, fixed, 0.85)
        yb = 300 + 3 * 72 * 0.85
        cblock(draw, 1150, yb, "if {touching edge?} then", [("bounce", "move")], 0.85)
        block(draw, 1150, yb + 72 * 0.85 * 2 + 40 * 0.85, PLAN[3][0], "say", 0.85, outline=K.GOLD)
        K.draw_star(draw, 1110, yb + 36, 22 + 4 * pulse, K.GOLD, rot=t * 3)
        K.draw_star(draw, 1110, yb + 72 * 0.85 * 2 + 40 * 0.85 + 30, 22 + 4 * pulse, K.GOLD, rot=t * 3 + 1)
        a = K.stagger(progress, 3, 0.1, 4)
        if a > 0:
            K.pill(draw, 0, 700 + int((1 - a) * 20), "Share what you changed!", coral, size=36, left=260)
        return True

    # ---- order game ------------------------------------------------------------------------
    if visual == "a15-order":
        jumbled = [2, 0, 3, 1]
        move = K.ease_in_out(K.clamp01((progress - 0.05) * 1.25)) if focus == "answer" else 0.0
        shown = progress * 5 if focus == "answer" else -1
        for slot, si in enumerate(jumbled):
            lab, col, soft = step_specs[si]
            pos = K.lerp(slot, si, move)
            y = 250 + pos * 152
            jitter = 0 if focus == "answer" else (slot % 2 * 2 - 1) * 40
            x0 = 260 + jitter * (1 - move)
            placed = focus == "answer" and shown > si + 0.5
            draw.rounded_rectangle((x0 + 8, y + 10, x0 + 900 + 8, y + 130 + 10), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y, x0 + 900, y + 130), radius=30, fill=sage_soft if placed else panel,
                                   outline=sage if placed else line, width=5 if placed else 3)
            badge = str(si + 1) if focus == "answer" else "ABCD"[slot]
            K.pill(draw, 0, y + 38, badge, sage if focus == "answer" else K.BOTH_COLOR, size=30, left=x0 + 30)
            step_icon(si, x0 + 220, y + 70, 0.42, sage_soft if placed else panel)
            draw.text((x0 + 330, y + 38), lab, fill=col, font=F(52, bold=True))
            if placed:
                K.draw_check(draw, x0 + 840, y + 65, 26, sage)
        if focus == "ask":
            K.text_at(draw, "What comes", 1540, 380, F(54, bold=True), ink)
            K.text_at(draw, "first?", 1540, 450, F(70, bold=True), coral)
            K.draw_stopwatch(draw, 1540, 680, 56, progress, brand)
        else:
            draw_cat(draw, 1540, 700, 0.85, t)
            if progress > 0.85:
                bubble((1400, 260, 1760, 360), "You got it!", size=40)
                stars_at(1540, 560, 260, 4)
        return True

    # ---- checkpoint -------------------------------------------------------------------------
    if visual == "a15-check":
        if focus == "intro":
            K.shadow_card(draw, (420, 270 + lift, w - 420, 800 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, F(40, bold=True), sage)
            K.text_at(draw, "You're the coder!", cx, 420 + lift, F(66, bold=True), ink)
            mini_stack_icon(draw, cx - 300, 560 + lift, 0.9, 3)
            draw_cat(draw, cx + 200, 770 + lift, 0.6, t)
            return True
        ans = focus == "answer"
        fy = draw_stage(draw, (120, 300, 860, 800), brand, running=ans, t=t, cloud=0.3)
        K.text_at(draw, "Cat walks, then says hello", 490, 240, F(40, bold=True), coral)
        if ans:
            walk = K.clamp01((progress - 0.3) * 2)
            cat_x = K.lerp(260, 560, K.ease_in_out(walk))
            draw_cat(draw, cat_x, fy, 0.75, t, walk=0 < walk < 1)
            if walk >= 1:
                bubble((620, 400, 840, 480), "Hello!", size=36)
        else:
            draw_cat(draw, 300, fy, 0.75, t)
        n = progress * 5.2 - 0.4 if ans else -1
        sx, sy, s = 990, 320, 1.1
        if not ans:
            for i in range(4):
                y = sy - 20 + i * 92
                dashed_slot((sx, y, sx + 560, y + 70), muted)
                K.pill(draw, 0, y + 12, str(i + 1), muted, size=26, left=sx + 18)
                K.text_at(draw, "?", sx + 300, y + 6, F(48, bold=True), muted)
        if ans:
            stack(draw, sx, sy, PLAN, s, appear=[K.ease_out_cubic(K.clamp01((n - i) * 2.5)) for i in range(4)])
            if progress > 0.8:
                K.draw_check(draw, 1640, 350, 30, sage)
        else:
            K.pill(draw, 1260, 680, "Pause & try!", coral, size=40)
            K.draw_stopwatch(draw, 1640, 780, 40, progress, brand)
        return True

    # ---- recap -------------------------------------------------------------------------------
    if visual == "a15-recap":
        recap = [("Idea → Blocks → Test → Fix", K.GOLD, "steps"), ("Start + 2 motions + 1 say", MOTION, "plan"),
                 ("Bugs are normal", K.DANGER, "bug"), ("Share what you changed", sage, "share")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                bg = coral_soft if active else panel
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=bg,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "steps":
                    for k in range(4):
                        sxk = ix - 120 + k * 80
                        draw.ellipse((sxk - 32, iy - 32, sxk + 32, iy + 32), fill=step_specs[k][1])
                        K.text_at(draw, str(k + 1), sxk, iy - 22, F(36, bold=True), (255, 255, 255))
                elif kind == "plan":
                    stack(draw, ix - 90, iy - 110, [("", "hat"), ("", "move"), ("", "move"), ("", "say")], 0.8)
                elif kind == "bug":
                    draw_ladybug(draw, ix, iy + 20, 0.75, t)
                else:
                    K.draw_person(draw, ix - 70, iy - 50, 0.6, "kid", t)
                    K.draw_bubble(draw, (ix - 10, iy - 140, ix + 170, iy - 40), brand, "I fixed it!", size=26)
                font = F(36, bold=True)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 46, font, ink)
            return True
        if focus == "done":
            draw.ellipse((cx - 230, 470 - 230, cx + 230, 470 + 230), fill=gold_soft)
            draw_trophy(draw, cx, 480 + bounce * 0.5, 1.35)
            K.draw_mascot(draw, int(cx - 480), 470, 110, sage, panel, bounce)
            draw_cat(draw, cx + 470, 630, 1.0, t)
            K.text_at(draw, "Unit 3 complete!", cx, 690, F(68, bold=True), ink)
            K.pill(draw, cx, 790, "Chapter 5 done · You built a program!", coral, size=34)
            stars_around(300, 640, 6)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
