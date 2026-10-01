"""B16 · Is AI Fair? — visuals."""
import math

import build as K

RED = (226, 64, 64)
BLUE = (66, 116, 214)
GREEN = (70, 160, 92)
PURPLE = (140, 96, 210)
YELLOW = (255, 196, 60)
STRAW = (232, 196, 120)
BROWN = (150, 100, 62)
SKY = (150, 200, 240)
PAPER = (255, 250, 238)
PAPER_LINE = (220, 210, 232)
LADOO = (240, 166, 52)
TIGER = (245, 140, 40)
STRIPE = (44, 36, 34)
CREAM = (255, 246, 230)
XRAY = (34, 52, 92)
GREY_HAIR = (214, 214, 220)

SKINS = [(241, 196, 160), (205, 150, 110), (160, 110, 75), (255, 224, 196), (122, 82, 56)]
PEOPLE = [
    (SKINS[0], (40, 34, 30), K.CORAL, "girl"),
    (SKINS[1], GREY_HAIR, (13, 148, 136), "old"),
    (SKINS[2], (36, 30, 28), K.ROAD, "beard"),
    (SKINS[3], (120, 72, 40), K.BOTH_COLOR, "glasses"),
    (SKINS[4], (30, 26, 24), K.GOLD, "kid"),
]


def S_(s):
    return lambda v: v * s


def shade(col, k=0.78):
    return tuple(int(c * k) for c in col)


def hat(draw, cx, by, s, kind="cap", col=RED):
    """by = bottom edge of the hat. Height ≈ 110s (sun hat is wider)."""
    S = S_(s)
    dark = shade(col)
    lw = max(2, int(S(5)))
    if kind == "cap":
        draw.chord((cx - S(80), by - S(96), cx + S(80), by + S(96)), 180, 360, fill=col)
        draw.line((cx, by - S(94), cx, by - S(2)), fill=dark, width=lw)
        draw.rounded_rectangle((cx + S(30), by - S(14), cx + S(150), by + S(8)), radius=S(10), fill=dark)
        draw.ellipse((cx - S(11), by - S(106), cx + S(11), by - S(86)), fill=dark)
    elif kind in ("woolly", "striped"):
        draw.chord((cx - S(82), by - S(112), cx + S(82), by + S(100)), 180, 360, fill=col)
        if kind == "striped":
            for k, rr in enumerate((0.72, 0.46)):
                draw.chord((cx - S(82) * rr, by - S(6) - S(106) * rr, cx + S(82) * rr, by - S(6) + S(106) * rr), 180, 360,
                           fill=(255, 255, 255) if k == 0 else col)
        draw.rounded_rectangle((cx - S(90), by - S(32), cx + S(90), by + S(4)), radius=S(10), fill=dark)
        for k in range(9):
            x = cx - S(72) + k * S(18)
            draw.line((x, by - S(26), x, by - S(2)), fill=col, width=max(1, int(S(4))))
        draw.ellipse((cx - S(24), by - S(136), cx + S(24), by - S(88)), fill=(255, 255, 255) if kind == "woolly" else dark,
                     outline=dark, width=max(2, int(S(4))))
    else:
        draw.rounded_rectangle((cx - S(66), by - S(96), cx + S(66), by), radius=S(32), fill=col)
        draw.rectangle((cx - S(66), by - S(34), cx + S(66), by - S(12)), fill=K.CORAL)
        draw.ellipse((cx - S(140), by - S(22), cx + S(140), by + S(16)), fill=col)
        draw.arc((cx - S(140), by - S(22), cx + S(140), by + S(16)), 0, 180, fill=dark, width=lw)


def photo(draw, cx, cy, s, bg=(236, 242, 250)):
    """Polaroid. Returns the picture box."""
    S = S_(s)
    draw.rectangle((cx - S(86) + S(6), cy - S(96) + S(8), cx + S(86) + S(6), cy + S(96) + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - S(86), cy - S(96), cx + S(86), cy + S(96)), fill=(255, 255, 255), outline=(226, 220, 210),
                   width=max(1, int(S(2))))
    box = (cx - S(72), cy - S(82), cx + S(72), cy + S(50))
    draw.rectangle(box, fill=bg)
    return box


def hat_photo(draw, cx, cy, s, kind, col, bg=(236, 242, 250)):
    b = photo(draw, cx, cy, s, bg)
    off = S_(s)(-30) if kind == "cap" else 0
    hs = 0.62 * s if kind != "sun" else 0.48 * s
    hat(draw, (b[0] + b[2]) / 2 + off, b[3] - S_(s)(30), hs, kind, col)


def finder(draw, cx, cy, s, t, face="happy"):
    """Hat finder AI. Body ±150s × ±110s; camera top ≈ cy-150s; feet ≈ cy+140s."""
    S = S_(s)
    y = cy + S(4) * math.sin(t * math.pi * 4)
    for sx in (-1, 1):
        draw.rounded_rectangle((cx + sx * S(80) - S(30), cy + S(100), cx + sx * S(80) + S(30), cy + S(140)), radius=S(12),
                               fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(40), y - S(150), cx + S(40), y - S(100)), radius=S(14), fill=K.DEV_DARK)
    draw.ellipse((cx - S(17), y - S(143), cx + S(17), y - S(109)), fill=(140, 200, 236))
    draw.ellipse((cx - S(7), y - S(133), cx + S(7), y - S(119)), fill=K.DEV_DEEP)
    draw.rounded_rectangle((cx - S(150) + S(8), y - S(110) + S(10), cx + S(150) + S(8), y + S(110) + S(10)), radius=S(36),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(150), y - S(110), cx + S(150), y + S(110)), radius=S(36), fill=K.BOT)
    draw.rounded_rectangle((cx - S(120), y - S(84), cx + S(120), y + S(56)), radius=S(22), fill=K.DEV_DEEP)
    for i, c in enumerate((K.CORAL, K.GOLD, K.LED_ON)):
        lx = cx - S(30) + i * S(30)
        draw.ellipse((lx - S(9), y + S(72), lx + S(9), y + S(90)), fill=c)
    ey, ew = y - S(30), max(2, int(S(8)))
    for i, sx in enumerate((-1, 1)):
        ex = cx + sx * S(44)
        if face == "happy":
            draw.arc((ex - S(20), ey - S(10), ex + S(20), ey + S(26)), 200, 340, fill=K.LED_ON, width=ew)
        elif face == "confused":
            r = S(18) if i == 0 else S(9)
            draw.ellipse((ex - r, ey - r, ex + r, ey + r), fill=K.LED_ON)
        else:
            draw.line((ex - S(18), ey + S(2), ex + S(18), ey + S(2)), fill=K.LED_ON, width=ew)
    my = y + S(20)
    if face == "happy":
        draw.arc((cx - S(34), my - S(26), cx + S(34), my + S(12)), 20, 160, fill=K.LED_ON, width=ew)
    elif face == "confused":
        pts = [(cx - S(30) + k * S(15), my + (S(6) if k % 2 else -S(6))) for k in range(5)]
        draw.line(pts, fill=K.LED_ON, width=ew)
    else:
        draw.line((cx - S(24), my, cx + S(24), my), fill=K.LED_ON, width=ew)


def nani_cap(draw, cx, cy, s, t, cap=True):
    K.draw_person(draw, cx, cy, s, "nani", t)
    if cap:
        y = cy + s * 6 * math.sin(t * math.pi * 4)
        hat(draw, cx, y - s * 30, 0.9 * s, "woolly", BLUE)


def person(draw, cx, cy, r, spec, smile=True):
    skin, hair, shirt, style = spec
    draw.chord((cx - r * 1.5, cy + r * 0.72, cx + r * 1.5, cy + r * 3.1), 180, 360, fill=shirt)
    if style in ("girl", "glasses"):
        draw.rounded_rectangle((cx - r * 1.12, cy - r * 0.9, cx + r * 1.12, cy + r * 1.2), radius=r * 0.7, fill=hair)
    draw.ellipse((cx - r * 1.06, cy - r * 1.12, cx + r * 1.06, cy + r * 0.5), fill=hair)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=skin)
    if style == "old":
        draw.chord((cx - r, cy - r * 1.02, cx + r, cy - r * 0.3), 180, 360, fill=hair)
    else:
        draw.chord((cx - r, cy - r * 1.05, cx + r, cy - r * 0.2), 180, 360, fill=hair)
    ink = (40, 44, 56)
    er = max(2, r * 0.1)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.38 - er, cy - r * 0.05 - er, cx + sx * r * 0.38 + er, cy - r * 0.05 + er), fill=ink)
    if style == "beard":
        draw.chord((cx - r * 0.98, cy - r * 0.1, cx + r * 0.98, cy + r * 1.06), 0, 180, fill=hair)
        draw.arc((cx - r * 0.4, cy + r * 0.1, cx + r * 0.4, cy + r * 0.6), 20, 160, fill=(250, 236, 226),
                 width=max(2, int(r * 0.1)))
    elif smile:
        draw.arc((cx - r * 0.45, cy + r * 0.05, cx + r * 0.45, cy + r * 0.62), 20, 160, fill=(190, 70, 60),
                 width=max(2, int(r * 0.1)))
    if style in ("old", "glasses"):
        gw = max(2, int(r * 0.08))
        for sx in (-1, 1):
            gx = cx + sx * r * 0.38
            draw.ellipse((gx - r * 0.26, cy - r * 0.3, gx + r * 0.26, cy + r * 0.2), outline=ink, width=gw)
        draw.line((cx - r * 0.12, cy - r * 0.05, cx + r * 0.12, cy - r * 0.05), fill=ink, width=gw)


def crayon(draw, cx, cy, s, col):
    """Upright crayon; tip top ≈ cy-124s, bottom cy+100s."""
    S = S_(s)
    dark = shade(col, 0.72)
    draw.rectangle((cx - S(22) + S(5), cy - S(80) + S(6), cx + S(22) + S(5), cy + S(100) + S(6)), fill=K.SHADOW)
    draw.polygon([(cx - S(22), cy - S(80)), (cx + S(22), cy - S(80)), (cx + S(7), cy - S(124)), (cx - S(7), cy - S(124))],
                 fill=col)
    draw.rectangle((cx - S(22), cy - S(80), cx + S(22), cy + S(100)), fill=col)
    draw.rectangle((cx - S(22), cy - S(50), cx + S(22), cy + S(70)), fill=dark)
    for yy in (cy - S(38), cy + S(58)):
        draw.line((cx - S(22), yy, cx + S(22), yy), fill=col, width=max(1, int(S(4))))


def tree(draw, x, by, s, trunk, leaves):
    S = S_(s)
    draw.rectangle((x - S(16), by - S(110), x + S(16), by), fill=trunk)
    for dx, dy, r in ((-40, -130, 52), (40, -130, 52), (0, -175, 60)):
        draw.ellipse((x + S(dx) - S(r), by + S(dy) - S(r), x + S(dx) + S(r), by + S(dy) + S(r)), fill=leaves)


def drawing(draw, box, cols):
    """A child's drawing: sky, sun, tree, grass. cols = (sky, sun, trunk, leaves, grass)."""
    x0, y0, x1, y1 = box
    sky, sun, trunk, leaves, grass = cols
    draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), fill=K.SHADOW)
    draw.rectangle(box, fill=(255, 255, 255))
    draw.rectangle((x0 + 16, y0 + 16, x1 - 16, y0 + (y1 - y0) * 0.55), fill=sky)
    draw.ellipse((x1 - 130, y0 + 40, x1 - 50, y0 + 120), fill=sun)
    draw.rectangle((x0 + 16, y1 - 70, x1 - 16, y1 - 16), fill=grass)
    tree(draw, x0 + (x1 - x0) * 0.36, y1 - 60, 1.0, trunk, leaves)


def dog(draw, cx, by, s, col, spots=None, ear=None):
    S = S_(s)
    ear = ear or shade(col, 0.8)
    for lx in (-50, -20, 20, 44):
        draw.rounded_rectangle((cx + S(lx) - S(10), by - S(60), cx + S(lx) + S(10), by), radius=S(6), fill=shade(col, 0.9))
    draw.line((cx - S(62), by - S(86), cx - S(100), by - S(126)), fill=col, width=max(2, int(S(14))))
    draw.ellipse((cx - S(72), by - S(112), cx + S(66), by - S(44)), fill=col)
    if spots:
        for dx, dy, r in ((-30, -88, 14), (10, -70, 10), (30, -94, 9)):
            draw.ellipse((cx + S(dx) - S(r), by + S(dy) - S(r), cx + S(dx) + S(r), by + S(dy) + S(r)), fill=spots)
    hx, hy = cx + S(68), by - S(118)
    draw.ellipse((hx - S(38), hy - S(38), hx + S(38), hy + S(38)), fill=col)
    draw.ellipse((hx + S(14), hy - S(4), hx + S(64), hy + S(28)), fill=col)
    draw.ellipse((hx + S(52), hy - S(2), hx + S(68), hy + S(14)), fill=K.DEV_DEEP)
    draw.ellipse((hx + S(4), hy - S(14), hx + S(16), hy - S(2)), fill=K.DEV_DEEP)
    draw.polygon([(hx - S(30), hy - S(30)), (hx - S(6), hy - S(36)), (hx - S(24), hy + S(18)), (hx - S(42), hy + S(8))],
                 fill=ear)


def apple(draw, cx, cy, r, col):
    draw.ellipse((cx - r + r * 0.1, cy - r + r * 0.14, cx + r + r * 0.1, cy + r + r * 0.14), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r * 0.9, cx + r * 0.1, cy + r), fill=col)
    draw.ellipse((cx - r * 0.1, cy - r * 0.9, cx + r, cy + r), fill=col)
    draw.ellipse((cx - r * 0.6, cy - r * 0.5, cx - r * 0.3, cy - r * 0.15), fill=tuple(min(255, c + 60) for c in col))
    draw.line((cx, cy - r * 0.8, cx + r * 0.12, cy - r * 1.2), fill=BROWN, width=max(2, int(r * 0.12)))
    draw.ellipse((cx + r * 0.12, cy - r * 1.25, cx + r * 0.6, cy - r * 0.95), fill=GREEN)


def ladoo(draw, cx, cy, r):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=LADOO)
    for k in range(4):
        a = k * 1.7 + 0.4
        px, py = cx + math.cos(a) * r * 0.5, cy + math.sin(a) * r * 0.5
        draw.ellipse((px - r * 0.1, py - r * 0.1, px + r * 0.1, py + r * 0.1), fill=(214, 130, 30))


def plate(draw, cx, cy, w):
    draw.ellipse((cx - w / 2 + 6, cy - w * 0.16 + 8, cx + w / 2 + 6, cy + w * 0.16 + 8), fill=K.SHADOW)
    draw.ellipse((cx - w / 2, cy - w * 0.16, cx + w / 2, cy + w * 0.16), fill=(255, 255, 255), outline=K.STEEL, width=4)


def scale_icon(draw, cx, cy, s, tilt=0.0):
    S = S_(s)
    draw.rounded_rectangle((cx - S(70), cy + S(150), cx + S(70), cy + S(172)), radius=S(10), fill=K.DEV_DARK)
    draw.rectangle((cx - S(8), cy - S(40), cx + S(8), cy + S(150)), fill=K.DEV_DARK)
    dx, dy = S(170) * math.cos(tilt), S(170) * math.sin(tilt)
    draw.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=K.DEV_DARK, width=max(3, int(S(12))))
    draw.ellipse((cx - S(16), cy - S(16), cx + S(16), cy + S(16)), fill=K.GOLD)
    pans = []
    for sx in (-1, 1):
        px, py = cx + sx * dx, cy + sx * dy
        draw.line((px, py, px - S(50), py + S(90)), fill=K.STEEL_DARK, width=max(2, int(S(4))))
        draw.line((px, py, px + S(50), py + S(90)), fill=K.STEEL_DARK, width=max(2, int(S(4))))
        draw.chord((px - S(70), py + S(60), px + S(70), py + S(120)), 0, 180, fill=K.STEEL)
        pans.append((px, py + S(90)))
    return pans


def phone(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110) + S(8), cy - S(200) + S(10), cx + S(110) + S(8), cy + S(200) + S(10)),
                           radius=S(30), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(200), cx + S(110), cy + S(200)), radius=S(30), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(94), cy - S(174), cx + S(94), cy + S(174)), radius=S(18), fill=K.DEV_SCREEN)
    draw.rounded_rectangle((cx - S(30), cy - S(190), cx + S(30), cy - S(180)), radius=S(5), fill=K.DEV_MID)


def xray(draw, cx, cy, w, h):
    draw.rounded_rectangle((cx - w / 2 + 6, cy - h / 2 + 8, cx + w / 2 + 6, cy + h / 2 + 8), radius=12, fill=K.SHADOW)
    draw.rounded_rectangle((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), radius=12, fill=XRAY)
    bone = (226, 236, 250)
    draw.line((cx, cy - h * 0.38, cx, cy + h * 0.38), fill=bone, width=max(3, int(w * 0.06)))
    for k in range(4):
        yy = cy - h * 0.28 + k * h * 0.16
        rw = w * (0.34 - 0.02 * k)
        draw.arc((cx - rw, yy - h * 0.06, cx, yy + h * 0.12), 180, 300, fill=bone, width=max(2, int(w * 0.035)))
        draw.arc((cx, yy - h * 0.06, cx + rw, yy + h * 0.12), 240, 360, fill=bone, width=max(2, int(w * 0.035)))


def thumbs_up(draw, cx, cy, s):
    S = S_(s)
    skin = K.SKIN
    draw.rounded_rectangle((cx - S(34), cy - S(70), cx - S(6), cy - S(4)), radius=S(14), fill=skin)
    draw.rounded_rectangle((cx - S(40), cy - S(20), cx + S(40), cy + S(50)), radius=S(16), fill=skin)
    for k in range(3):
        yy = cy - S(4) + k * S(16)
        draw.line((cx + S(8), yy, cx + S(38), yy), fill=shade(skin, 0.8), width=max(1, int(S(4))))


def tiger_head(draw, cx, cy, s):
    S = S_(s)
    for sx in (-1, 1):
        ex, ey = cx + sx * S(74), cy - S(62)
        draw.ellipse((ex - S(30), ey - S(30), ex + S(30), ey + S(30)), fill=TIGER)
    draw.ellipse((cx - S(95), cy - S(92), cx + S(95), cy + S(92)), fill=TIGER)
    for sx in (-1, 1):
        for k in range(2):
            yy = cy - S(6) + k * S(26)
            draw.polygon([(cx + sx * S(94), yy - S(9)), (cx + sx * S(58), yy + S(2)), (cx + sx * S(92), yy + S(11))],
                         fill=STRIPE)
    draw.ellipse((cx - S(54), cy + S(4), cx + S(54), cy + S(78)), fill=CREAM)
    for sx in (-1, 1):
        ex = cx + sx * S(36)
        draw.ellipse((ex - S(17), cy - S(41), ex + S(17), cy - S(7)), fill=(255, 255, 255))
        draw.ellipse((ex - S(9), cy - S(32), ex + S(9), cy - S(14)), fill=STRIPE)
    draw.polygon([(cx - S(15), cy + S(12)), (cx + S(15), cy + S(12)), (cx, cy + S(30))], fill=STRIPE)
    lw = max(2, int(S(6)))
    draw.arc((cx - S(24), cy + S(18), cx, cy + S(48)), 10, 170, fill=STRIPE, width=lw)
    draw.arc((cx, cy + S(18), cx + S(24), cy + S(48)), 10, 170, fill=STRIPE, width=lw)
    draw.polygon([(cx - S(72), cy - S(66)), (cx - S(60), cy - S(126)), (cx + S(60), cy - S(126)), (cx + S(72), cy - S(66))],
                 fill=(44, 66, 128))
    draw.rounded_rectangle((cx - S(84), cy - S(78), cx + S(84), cy - S(60)), radius=S(8), fill=(30, 44, 92))
    draw.ellipse((cx - S(15), cy - S(116), cx + S(15), cy - S(86)), fill=K.GOLD)


VARIETY = [("cap", BLUE), ("cap", GREEN), ("striped", PURPLE), ("woolly", BLUE), ("sun", STRAW)]


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
    gold_soft = K.hex_rgb("#FFF4DC")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    font = K.load_font

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(84 + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def result(x, y, ok, size=36):
        return K.pill(draw, x, y, "HAT!" if ok else "NOT A HAT", sage if ok else K.DANGER, size=size)

    def mark(x, y, ok, r=26):
        (K.draw_check if ok else K.draw_cross)(draw, x, y, r, sage if ok else K.DANGER)

    # ---- opening -----------------------------------------------------------
    if visual == "b16-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            finder(draw, cx + 280, 470, 0.85, t, face="happy")
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(60, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · AI IN GAMES", cx, 326 + lift, font(34, bold=True), sage)
            draw.ellipse((620 - 140, 560 - 140 + lift, 620 + 140, 560 + 140 + lift), fill=coral_soft)
            tiger_head(draw, 620, 580 + lift, 0.95)
            for k, (a_txt, b_txt, col) in enumerate((("If near", "chase", coral), ("Else", "patrol", K.BOTH_COLOR))):
                a = K.stagger(progress, k, step=0.16, speed=5)
                if a <= 0:
                    continue
                y = 440 + k * 130 + lift + int((1 - a) * 20)
                draw.rounded_rectangle((860, y, 1480, y + 100), radius=50, fill=panel, outline=col, width=4)
                K.text_at(draw, f"{a_txt}  →  {b_txt}", 1170, y + 26, font(44, bold=True), col)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                K.pill(draw, 1170, 720 + lift + int((1 - a) * 20), "UNIT 3 DONE!", coral, size=38)
            return True
        if focus == "unit":
            draw.ellipse((500 - 240, 560 - 240, 500 + 240, 560 + 240), fill=sage_soft)
            K.draw_shield(draw, 500, 560, 1.3, sage, mark="check")
            K.pill(draw, 0, 290 + lift, "UNIT 4", coral, size=34, left=880)
            K.text_at(draw, "Being Smart and", 1290, 370 + lift, font(80, bold=True), ink)
            K.text_at(draw, "Safe With AI", 1290, 466 + lift, font(80, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a > 0:
                    x = 1050 + i * 120
                    draw.rounded_rectangle((x - 46, 640, x + 46, 732), radius=22, fill=panel, outline=line, width=3)
                    K.text_at(draw, str(i + 1), x, 654, font(46, bold=True), coral if i == 0 else muted)
            K.text_at(draw, "5 chapters", 1290, 760, font(32, bold=True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 302 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Is AI Fair?", cx, 362 + lift, font(88, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                tilt = 0.12 * math.sin(t * 8) * (1 - K.clamp01(progress * 1.4))
                pans = scale_icon(draw, cx, 600 + yy, 0.95, tilt)
                hat(draw, pans[0][0] + 8, pans[0][1] + 10, 0.42, "cap", RED)
                hat(draw, pans[1][0], pans[1][1] + 10, 0.42, "woolly", BLUE)
                question_marks([(cx - 420, 600), (cx + 400, 620)])
            return True
        # sweets
        K.draw_person(draw, 330, 460, 0.95, "kid", t)
        K.draw_person(draw, 750, 460, 0.95, "friend", t)
        for k, px in enumerate((330, 750)):
            plate(draw, px, 740, 230)
            for j in range(3):
                ladoo(draw, px - 60 + j * 60, 722, 26)
        K.pill(draw, 540, 240, "3 and 3: fair!", sage, size=34)
        a = K.stagger(progress, 2, step=0.14, speed=4)
        if a > 0:
            yy = int((1 - a) * 30)
            draw.ellipse((1400 - 250, 560 - 250 + yy, 1400 + 250, 560 + 250 + yy), fill=lav_soft)
            finder(draw, 1400, 580 + yy, 0.95, t, face="confused")
            K.pill(draw, 1400, 240, "Fair, or unfair?", K.BOTH_COLOR, size=34)
            question_marks([(1100, 330), (1700, 360)])
        return True

    # ---- Ishaan's hat finder --------------------------------------------------
    if visual == "b16-hook":
        if focus == "meet":
            draw.ellipse((420 - 260, 560 - 260, 420 + 260, 560 + 260), fill=gold_soft)
            K.draw_person(draw, 420, 500, 1.55, "friend", t)
            K.text_at(draw, "Meet Ishaan!", 1290, 236 + lift, font(76, bold=True), coral)
            finder(draw, 1100, 560, 1.0, t, face="happy")
            K.pill(draw, 1100, 730, "HAT FINDER", K.BOT_DARK, size=32)
            for k, ok in enumerate((True, False)):
                a = K.stagger(progress, k + 2, step=0.16, speed=4)
                if a <= 0:
                    continue
                y = 420 + k * 170 + int((1 - a) * 20)
                draw.rounded_rectangle((1360, y, 1780, y + 130), radius=36, fill=panel, outline=line, width=3)
                if ok:
                    hat(draw, 1430, y + 100, 0.42, "cap", RED)
                else:
                    apple(draw, 1440, y + 70, 36, RED)
                result(1610, y + 38, ok, size=28)
            return True
        if focus == "train":
            n = 10
            for i in range(n):
                a = K.stagger(progress, i, step=0.05, speed=6)
                if a <= 0:
                    continue
                col_i, row = i % 5, i // 5
                x = 220 + col_i * 200
                y = 380 + row * 250 + int((1 - a) * 30)
                hat_photo(draw, x, y, 0.95, "cap", RED, bg=(250, 236, 236))
            K.pill(draw, 620, 236, "50 photos · all red caps", RED, size=34)
            K.draw_arrow(draw, 1180, 520, 1330, 520, muted, width=12, head=32)
            finder(draw, 1560, 540, 0.95, t, face="happy")
            K.pill(draw, 1560, 720, "studying…", K.BOT_DARK, size=30)
            return True
        if focus in ("test", "nani"):
            if focus == "test":
                draw.ellipse((420 - 230, 540 - 230, 420 + 230, 540 + 230), fill=coral_soft)
                hat_photo(draw, 420, 540, 1.6, "cap", RED, bg=(250, 236, 236))
            else:
                draw.ellipse((420 - 240, 540 - 240, 420 + 240, 540 + 240), fill=blue_soft)
                nani_cap(draw, 420, 520, 1.25, t)
                K.text_at(draw, "Ha ha!", 640, 300, font(40, bold=True), K.BOTH_COLOR)
            K.draw_arrow(draw, 720, 540, 880, 540, muted, width=12, head=32)
            ok = focus == "test"
            finder(draw, 1160, 540, 1.05, t, face="happy" if ok else "confused")
            a = K.stagger(progress, 3 if ok else 6, step=0.1, speed=4)
            if a > 0:
                y = 260 + int((1 - a) * 20)
                draw.rounded_rectangle((1420, y, 1800, y + 190), radius=40, fill=sage_soft if ok else K.DANGER_SOFT,
                                       outline=sage if ok else K.DANGER, width=5)
                K.text_at(draw, "HAT!" if ok else "NOT A", 1610, y + 30 if ok else y + 24, font(64 if ok else 56, bold=True),
                          sage if ok else K.DANGER)
                if not ok:
                    K.text_at(draw, "HAT!", 1610, y + 96, font(56, bold=True), K.DANGER)
                else:
                    mark(1610, y + 140, True, 26)
                if ok:
                    star_spots([(1440, 560), (1760, 600)])
            return True
        # ask
        nani_cap(draw, 400, 520, 1.15, t)
        finder(draw, 1100, 560, 1.0, t, face="confused")
        K.pill(draw, 1100, 760, "NOT A HAT", K.DANGER, size=30)
        question_marks([(760, 320), (1440, 300), (1500, 560)])
        K.draw_stopwatch(draw, 760, 640, 60, progress, brand)
        return True

    # ---- why it went wrong ----------------------------------------------------------
    if visual == "b16-why":
        if focus == "examples":
            K.text_at(draw, "TRAINING EXAMPLES", cx, 240 + lift, font(64, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "what an AI learns from", cx, 330 + lift, font(38, bold=True), muted)
            specs = [("Pictures", coral_soft), ("Sounds", sage_soft), ("Words", lav_soft)]
            for i, (lab, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 360 + i * 380
                y = 600 + int((1 - a) * 40)
                draw.ellipse((x - 130, y - 130, x + 130, y + 130), fill=soft)
                if i == 0:
                    hat_photo(draw, x, y - 10, 0.9, "cap", RED, bg=(250, 236, 236))
                elif i == 1:
                    K.draw_device(draw, "speaker", x - 40, y, 0.62, brand, t=t)
                else:
                    draw.rounded_rectangle((x - 80, y - 90, x + 80, y + 90), radius=14, fill=PAPER, outline=muted, width=3)
                    for j in range(5):
                        draw.line((x - 56, y - 56 + j * 28, x + 56 - (j % 2) * 30, y - 56 + j * 28), fill=muted, width=6)
                K.text_at(draw, lab, x, y + 148, font(40, bold=True), ink)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                finder(draw, 1600, 620 + int((1 - a) * 30), 0.8, t, face="happy")
                K.draw_arrow(draw, 1240, 600, 1440, 600, muted, width=10, head=28)
            return True
        if focus == "pattern":
            for i in range(4):
                hat_photo(draw, 230 + (i % 2) * 190, 380 + (i // 2) * 240, 0.85, "cap", RED, bg=(250, 236, 236))
            K.draw_magnifier(draw, 330 + 30 * math.sin(t * 6), 500, 0.9, coral)
            K.draw_arrow(draw, 560, 520, 680, 520, muted, width=10, head=28)
            finder(draw, 870, 600, 0.8, t, face="happy")
            K.draw_bubble(draw, (720, 250, 1180, 420), brand, "", tail="left", size=40)
            hat(draw, 820, 380, 0.5, "cap", RED)
            draw.text((930, 296), "Hats", fill=ink, font=font(44, bold=True))
            draw.text((930, 350), "are RED!", fill=RED, font=font(44, bold=True))
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                K.shadow_card(draw, (1300, 300 + yy, 1760, 820 + yy), brand, radius=36, outline=K.DANGER, outline_w=4)
                hat(draw, 1530, 560 + yy, 1.0, "woolly", BLUE)
                K.text_at(draw, "?", 1700, 330 + yy, font(90, bold=True), K.GOLD)
                K.text_at(draw, "Never seen", 1530, 640 + yy, font(42, bold=True), ink)
                K.text_at(draw, "a blue hat!", 1530, 696 + yy, font(42, bold=True), K.DANGER)
            return True
        if focus == "apple":
            draw.rounded_rectangle((180, 520, 760, 760), radius=40, fill=(214, 170, 120))
            for k in range(5):
                apple(draw, 250 + k * 115, 500 - (k % 2) * 30, 52, RED)
            draw.rounded_rectangle((180, 560, 760, 760), radius=40, fill=(196, 150, 100))
            for k in range(4):
                draw.line((200, 600 + k * 40, 740, 600 + k * 40), fill=(176, 128, 84), width=4)
            K.pill(draw, 470, 790, "Only red apples", RED, size=32)
            K.draw_person(draw, 1060, 470, 1.05, "kid", t)
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                draw.ellipse((1540 - 170, 560 - 170 + yy, 1540 + 170, 560 + 170 + yy), fill=sage_soft)
                apple(draw, 1540, 580 + yy, 90, GREEN)
                K.draw_bubble(draw, (1180, 250, 1780, 380), brand, "Not an apple?", tail="left", size=42)
                K.text_at(draw, "?", 1720, 650 + yy, font(90, bold=True), K.GOLD)
            return True
        # notmean
        draw.ellipse((470 - 250, 560 - 250, 470 + 250, 560 + 250), fill=blue_soft)
        finder(draw, 470, 580, 1.05, t, face="blank")
        rows = [("Being mean", False), ("Alive", False), ("Just didn't learn enough", True)]
        for i, (lab, ok) in enumerate(rows):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            y = 270 + i * 150 + int((1 - a) * 20)
            col = sage if ok else K.DANGER
            draw.rounded_rectangle((860, y, 1780, y + 116), radius=38, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=4)
            mark(924, y + 58, ok, 30)
            draw.text((986, y + 32), lab, fill=ink, font=font(44, bold=True))
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1320, 760 + int((1 - a) * 20), "AI only knows what its examples show", K.BOTH_COLOR, size=30)
        return True

    # ---- fair and unfair -------------------------------------------------------------
    if visual == "b16-fair":
        if focus == "fair":
            K.text_at(draw, "FAIR AI", cx, 236 + lift, font(80, bold=True), sage)
            K.text_at(draw, "works well for everyone", cx, 346 + lift, font(48, bold=True), ink)
            for i, spec in enumerate(PEOPLE):
                a = K.stagger(progress, i + 1, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 300
                y = 560 + int((1 - a) * 40)
                draw.ellipse((x - 120, y - 120, x + 120, y + 120), fill=sage_soft)
                person(draw, x, y - 20, 52, spec)
                mark(x + 84, y - 84, True, 26)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 760 + int((1 - a) * 20), "Like a fair game: same rules for every player", sage, size=30)
            return True
        if focus == "unfair":
            K.shadow_card(draw, (140, 270, 640, 820), brand, radius=36, accent=muted)
            K.text_at(draw, "Examples", 390, 300, font(40, bold=True), muted)
            for k in range(4):
                person(draw, 270 + (k % 2) * 240, 420 + (k // 2) * 200, 46, PEOPLE[3])
            K.text_at(draw, "all one kind", 390, 760, font(34, bold=True), muted)
            K.draw_arrow(draw, 670, 545, 790, 545, muted, width=12, head=30)
            for i, spec in enumerate(PEOPLE[1:] + PEOPLE[:1]):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 900 + (i % 3) * 300
                y = 400 + (i // 3) * 220 + int((1 - a) * 30)
                ok = spec == PEOPLE[3]
                draw.ellipse((x - 90, y - 90, x + 90, y + 90), fill=sage_soft if ok else K.DANGER_SOFT)
                person(draw, x, y - 14, 40, spec)
                mark(x + 66, y - 64, ok, 22)
            a = K.stagger(progress, 5, step=0.12, speed=4)
            if a > 0:
                y = 640 + int((1 - a) * 20) + 60
                draw.rounded_rectangle((1210, y, 1790, y + 140), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
                K.text_at(draw, "UNFAIR AI", 1500, y + 14, font(50, bold=True), K.DANGER)
                K.text_at(draw, "a word for it: BIAS", 1500, y + 80, font(34, bold=True), ink)
            return True
        # onekind
        K.shadow_card(draw, (140, 260, 620, 840), brand, radius=36, accent=RED)
        K.text_at(draw, "Learned from", 380, 296, font(40, bold=True), muted)
        for k in range(3):
            hat(draw, 330 + k * 30, 440 + k * 150, 0.55, "cap", RED)
        K.draw_arrow(draw, 650, 550, 760, 550, muted, width=12, head=30)
        finder(draw, 940, 560, 0.7, t, face="confused")
        tests = [("cap", RED), ("cap", BLUE), ("cap", GREEN), ("striped", PURPLE)]
        for i, (kind, col) in enumerate(tests):
            a = K.stagger(progress, i, step=0.12, speed=5)
            if a <= 0:
                continue
            x = 1260 + (i % 2) * 280
            y = 300 + (i // 2) * 280 + int((1 - a) * 30)
            ok = i == 0
            K.shadow_card(draw, (x - 120, y, x + 120, y + 240), brand, radius=28, outline=sage if ok else K.DANGER,
                          outline_w=4)
            hat(draw, x - (20 if kind == "cap" else 0), y + 170, 0.6, kind, col)
            if ok:
                mark(x + 84, y + 40, True, 22)
            else:
                K.text_at(draw, "?", x + 84, y + 4, font(64, bold=True), K.DANGER)
        return True

    # ---- fixing it with variety --------------------------------------------------------
    if visual == "b16-fix":
        if focus == "add":
            slots = [(220 + (k % 4) * 205, 400 + (k // 4) * 260) for k in range(8)]
            for i in range(3):
                hat_photo(draw, slots[i][0], slots[i][1], 0.95, "cap", RED, bg=(250, 236, 236))
            for i, (kind, col) in enumerate(VARIETY):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                x, y = slots[i + 3]
                y += int((1 - a) * 40)
                hat_photo(draw, x, y, 0.95, kind, col)
                draw.ellipse((x + 56, y - 124, x + 104, y - 76), fill=sage)
                K.text_at(draw, "+", x + 80, y - 126, font(40, bold=True), panel)
            K.pill(draw, 0, 236, "More kinds of hats!", sage, size=34, left=140)
            finder(draw, 1520, 560, 0.85, t, face="happy")
            K.draw_arrow(draw, 1000, 530, 1200, 530, muted, width=12, head=30)
            return True
        if focus == "variety":
            K.text_at(draw, "VARIETY", 560, 250 + lift, font(100, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "= many different kinds", 560, 380 + lift, font(46, bold=True), ink)
            row = [("cap", RED)] + VARIETY
            for i, (kind, col) in enumerate(row):
                a = K.stagger(progress, i, step=0.07, speed=6)
                if a <= 0:
                    continue
                x = 180 + (i % 3) * 250
                y = 600 + (i // 3) * 190 + int((1 - a) * 30)
                hat(draw, x - (30 if kind == "cap" else 0), y, 0.62 if kind != "sun" else 0.5, kind, col)
            finder(draw, 1420, 640, 0.75, t, face="happy")
            K.draw_bubble(draw, (1100, 250, 1780, 470), brand, "", tail="left", size=40)
            person(draw, 1220, 370, 44, PEOPLE[4])
            hat(draw, 1220, 334, 0.5, "woolly", GREEN)
            draw.text((1310, 300), "A hat sits", fill=ink, font=font(42, bold=True))
            draw.text((1310, 354), "on your head!", fill=sage, font=font(42, bold=True))
            return True
        # works
        draw.ellipse((420 - 240, 540 - 240, 420 + 240, 540 + 240), fill=sage_soft)
        nani_cap(draw, 420, 520, 1.25, t)
        thumbs_up(draw, 640, 640 + bounce, 1.3)
        K.draw_arrow(draw, 740, 540, 880, 540, muted, width=12, head=32)
        finder(draw, 1160, 540, 1.05, t, face="happy")
        y = 260
        draw.rounded_rectangle((1420, y, 1800, y + 190), radius=40, fill=sage_soft, outline=sage, width=5)
        K.text_at(draw, "HAT!", 1610, y + 30, font(64, bold=True), sage)
        mark(1610, y + 140, True, 26)
        star_spots([(1440, 560), (1760, 600), (760, 300)])
        return True

    # ---- crayons ------------------------------------------------------------------------
    if visual == "b16-crayon":
        if focus == "one":
            draw.ellipse((400 - 200, 540 - 200, 400 + 200, 540 + 200), fill=coral_soft)
            crayon(draw, 400, 560, 1.5, RED)
            K.pill(draw, 400, 790, "Only red", RED, size=34)
            drawing(draw, (820, 260, 1700, 820), (RED, RED, RED, RED, RED))
            for dx, dy in ((1060, 340), (1500, 560)):
                K.text_at(draw, "?", dx, dy, font(int(90 + 16 * pulse), bold=True), ink)
            return True
        if focus == "many":
            cols = [RED, (255, 140, 40), YELLOW, GREEN, BLUE, PURPLE, BROWN]
            draw.rounded_rectangle((170, 560, 690, 820), radius=20, fill=K.GOLD)
            for i, c in enumerate(cols):
                crayon(draw, 215 + i * 72, 520 + (i % 2) * 20, 0.95, c)
            draw.rounded_rectangle((170, 600, 690, 820), radius=20, fill=K.GOLD)
            K.text_at(draw, "CRAYONS", 430, 680, font(50, bold=True), panel)
            a = K.stagger(progress, 1, step=0.2, speed=3)
            if a > 0:
                drawing(draw, (820, 260, 1700, 820), (SKY, YELLOW, BROWN, GREEN, (120, 200, 110)))
                mark(1660, 300, True, 34)
            return True
        # ai
        cols = [RED, YELLOW, GREEN, BLUE, PURPLE]
        for i, c in enumerate(cols):
            crayon(draw, 200 + i * 60, 420, 0.75, c)
        K.text_at(draw, "Many colours", 320, 540, font(40, bold=True), ink)
        K.draw_arrow(draw, 520, 440, 620, 440, muted, width=10, head=28)
        for i, spec in enumerate(PEOPLE):
            a = K.stagger(progress, i, step=0.08, speed=5)
            if a <= 0:
                continue
            x = 760 + i * 220
            y = 400 + int((1 - a) * 30)
            draw.ellipse((x - 96, y - 96, x + 96, y + 96), fill=[coral_soft, sage_soft, blue_soft, lav_soft, gold_soft][i])
            person(draw, x, y - 14, 44, spec)
        K.text_at(draw, "Many kinds of faces, voices and stories", 1200, 540, font(40, bold=True), ink)
        a = K.stagger(progress, 5, step=0.1, speed=4)
        if a > 0:
            y = 640 + int((1 - a) * 20)
            K.draw_device(draw, "speaker", 800, y + 80, 0.5, brand, t=t)
            for k in range(3):
                bx = 1060 + k * 70
                draw.rounded_rectangle((bx, y + 20, bx + 60, y + 150), radius=8, fill=[coral, sage, K.BOTH_COLOR][k])
                draw.rectangle((bx + 8, y + 20, bx + 14, y + 150), fill=shade([coral, sage, K.BOTH_COLOR][k]))
            K.pill(draw, 1520, y + 52, "A fairer AI!", sage, size=40)
        return True

    # ---- real life ------------------------------------------------------------------------
    if visual == "b16-real":
        if focus == "voice":
            K.shadow_card(draw, (140, 260, 620, 820), brand, radius=36, accent=muted)
            K.text_at(draw, "Learned from", 380, 296, font(38, bold=True), muted)
            for k, spec in enumerate((PEOPLE[2], PEOPLE[3], PEOPLE[1])):
                y = 420 + k * 140
                person(draw, 250, y - 10, 38, spec)
                K.sound_waves(draw, 320, y, 0.9, muted, t)
                draw.text((440, y - 22), "grown-up", fill=muted, font=font(30, bold=True))
            K.draw_person(draw, 840, 560, 1.0, "kid", t)
            K.draw_bubble(draw, (700, 250, 1180, 380), brand, "Play my song!", tail="left", size=40)
            K.draw_device(draw, "speaker", 1440, 600, 1.1, brand, t=0.0)
            K.draw_bubble(draw, (1300, 250, 1780, 380), brand, "Sorry, what?", tail="left", size=40)
            question_marks([(1640, 520), (1250, 560)])
            return True
        if focus == "face":
            phone(draw, 470, 560, 1.4)
            person(draw, 470, 500, 70, PEOPLE[2])
            K.draw_dashed(draw, 370, 400, 570, 400, coral, width=5, phase=t * 100)
            K.draw_dashed(draw, 370, 620, 570, 620, coral, width=5, phase=t * 100)
            K.draw_padlock(draw, 470, 720, 0.4, K.DANGER, shadow=False)
            K.shadow_card(draw, (860, 260, 1780, 520), brand, radius=32, outline=K.DANGER, outline_w=4)
            draw.text((900, 284), "Learned: few kinds of faces", fill=K.DANGER, font=font(36, bold=True))
            for k in range(4):
                person(draw, 960 + k * 150, 400, 34, PEOPLE[3])
            a = K.stagger(progress, 2, step=0.2, speed=4)
            if a > 0:
                yy = int((1 - a) * 20)
                K.shadow_card(draw, (860, 570 + yy, 1780, 850 + yy), brand, radius=32, outline=sage, outline_w=4)
                draw.text((900, 594 + yy), "Fix: add many kinds of faces", fill=sage, font=font(36, bold=True))
                for k, spec in enumerate(PEOPLE):
                    person(draw, 950 + k * 160, 712 + yy, 34, spec)
            return True
        if focus == "doctor":
            K.draw_person(draw, 360, 470, 1.15, "teacher", t)
            draw.arc((300, 560, 420, 680), 0, 180, fill=K.DEV_DARK, width=8)
            draw.ellipse((350, 668, 372, 690), fill=K.STEEL_DARK)
            K.pill(draw, 360, 760, "Doctor", sage, size=32)
            sizes = [(150, 210, "child"), (190, 260, "grown-up"), (170, 240, "grandpa"), (160, 230, "girl")]
            x = 700
            for i, (xw, xh, lab) in enumerate(sizes):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    x += xw + 60
                    continue
                y = 520 + int((1 - a) * 30)
                xray(draw, x + xw / 2, y, xw, xh)
                K.text_at(draw, lab, x + xw / 2, y + xh / 2 + 20, font(30, bold=True), ink)
                x += xw + 60
            a = K.stagger(progress, 5, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, 1210, 260, "X-rays from many kinds of people", K.BOTH_COLOR, size=34)
            return True
        # test
        draw.rounded_rectangle((170 + 10, 260 + 12, 760 + 10, 850 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((170, 260, 760, 850), radius=24, fill=PAPER)
        draw.rounded_rectangle((380, 236, 550, 286), radius=14, fill=K.STEEL_DARK)
        K.text_at(draw, "Test it!", 465, 300, font(48, bold=True), coral)
        for i, spec in enumerate(PEOPLE[:4]):
            y = 420 + i * 105
            person(draw, 260, y - 6, 30, spec)
            draw.rounded_rectangle((330, y - 16, 620, y + 6), radius=10, fill=line)
            if progress * 4 > i * 0.8:
                mark(680, y - 4, True, 24)
        K.draw_magnifier(draw, 1200, 520, 1.3, coral)
        K.draw_person(draw, 1500, 500, 1.0, "mom", t)
        a = K.stagger(progress, 4, step=0.1, speed=4)
        if a > 0:
            K.pill(draw, 1300, 760 + int((1 - a) * 20), "Never fair automatically!", K.DANGER, size=34)
        return True

    # ---- pick the fairer dataset ------------------------------------------------------------
    if visual == "b16-pick":
        ans = focus == "answer"
        reveal = ans and progress > 0.05
        for k in range(2):
            x0 = 140 if k == 0 else 990
            bx = (x0, 280, x0 + 790, 850)
            good = k == 1
            col = (sage if good else K.DANGER) if reveal else line
            K.shadow_card(draw, bx, brand, radius=40, outline=col, outline_w=6 if reveal else 3)
            if reveal and good:
                draw.rounded_rectangle((bx[0] + 6, bx[1] + 6, bx[2] - 6, bx[3] - 6), radius=36, fill=sage_soft)
            K.pill(draw, 0, 300, f"Set {'AB'[k]}", coral if k == 0 else K.BOTH_COLOR, size=34, left=x0 + 30)
            if k == 0:
                K.text_at(draw, "100 photos", x0 + 520, 304, font(36, bold=True), muted)
                for i in range(6):
                    px = x0 + 150 + (i % 3) * 245
                    py = 470 + (i // 3) * 200
                    draw.rounded_rectangle((px - 110, py - 80, px + 110, py + 80), radius=16, fill=blue_soft)
                    dog(draw, px - 30, py + 60, 0.62, (250, 248, 244), ear=(226, 220, 210))
            else:
                dogs = [((168, 112, 70), None, 0.85), ((40, 36, 34), None, 0.6), ((250, 248, 244), (60, 54, 50), 0.7),
                        ((214, 160, 100), None, 0.95), ((120, 84, 56), (60, 40, 30), 0.55), ((236, 200, 150), None, 0.7)]
                for i, (col_d, sp, sc) in enumerate(dogs):
                    px = x0 + 150 + (i % 3) * 245
                    py = 470 + (i // 3) * 200
                    draw.rounded_rectangle((px - 110, py - 80, px + 110, py + 80), radius=16,
                                           fill=[coral_soft, gold_soft, lav_soft][i % 3])
                    dog(draw, px - 30 * sc, py + 60, sc * 0.75, col_d, spots=sp)
            if reveal:
                mark(bx[2] - 60, bx[1] + 60, good, 34)
                K.pill(draw, x0 + 395, 776, "Many kinds!" if good else "All one kind", col, size=30)
        if not ans:
            K.pill(draw, cx - 40, 222, "Which set is fairer?", coral, size=32)
            K.draw_stopwatch(draw, cx + 220, 252, 32, progress, brand)
        return True

    # ---- finish the sentence / true-false ---------------------------------------------------
    if visual == "b16-sentence":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            K.shadow_card(draw, (160, 270, 1760, 520), brand, radius=40, outline=sage if ans else line,
                          outline_w=5 if ans else 3)
            f = font(76, bold=True)
            if ans:
                parts = [("AI needs ", ink), ("many kinds of", sage), (" examples.", ink)]
            else:
                parts = [("AI needs ", ink), ("______", coral), (" examples.", ink)]
            widths = [draw.textbbox((0, 0), p, font=f)[2] for p, _ in parts]
            x = cx - sum(widths) / 2
            for (p, col), wd in zip(parts, widths):
                draw.text((x, 340), p, fill=col, font=f)
                x += wd
            opts = ["only red", "just one", "many kinds of"]
            for i, lab in enumerate(opts):
                x = cx + (i - 1) * 520
                y = 600
                good = i == 2
                on = ans and good
                draw.rounded_rectangle((x - 220, y, x + 220, y + 120), radius=60,
                                       fill=sage if on else panel, outline=sage if on else line, width=4)
                K.text_at(draw, lab, x, y + 34, font(46, bold=True), panel if on else ink)
                if ans and not good:
                    mark(x + 200, y + 10, False, 26)
            if not ans:
                K.draw_stopwatch(draw, cx, 810, 40, progress, brand)
            else:
                for i, (kind, col) in enumerate([("cap", RED)] + VARIETY):
                    hat(draw, cx - 600 + i * 240 - (24 if kind == "cap" else 0), 860, 0.36, kind, col)
            return True
        ans = focus == "tfanswer"
        K.shadow_card(draw, (160, 250, 1760, 560), brand, radius=40, accent=K.BOTH_COLOR)
        K.text_at(draw, "True or false?", cx, 284, font(40, bold=True), K.BOTH_COLOR)
        label_lines(("An AI is fair to everyone automatically,", "even if it saw only one kind of example."),
                    cx, 370, size=50)
        for i, lab in enumerate(("TRUE", "FALSE")):
            x = cx + (i * 2 - 1) * 300
            y = 620
            good = i == 1
            on = ans and good
            col = sage if good else K.DANGER
            draw.rounded_rectangle((x - 220, y, x + 220, y + 130), radius=40,
                                   fill=col if on else panel, outline=col if ans else line, width=5)
            K.text_at(draw, lab, x, y + 36, font(56, bold=True), panel if on else (ink if not ans else col))
            if ans and not good:
                mark(x + 200, y + 10, False, 26)
        if ans:
            K.pill(draw, cx, 800, "AI is only as fair as its examples", sage, size=32)
        else:
            K.draw_stopwatch(draw, cx, 690, 44, progress, brand)
        return True

    # ---- checkpoint ----------------------------------------------------------------------
    if visual == "b16-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 326 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like a fair AI maker!", cx, 420 + lift, font(58, bold=True), ink)
            hat(draw, cx - 170, 680 + lift, 0.7, "cap", RED)
            hat(draw, cx + 160, 680 + lift, 0.7, "woolly", BLUE)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1120 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1120, 870), radius=24, fill=PAPER)
        label_lines(("A hat finder only saw red hats.", "What happens with a blue hat?"), 625, 256, size=44, col=coral)
        rows = [("It may say \"not a hat\"", ink), ("because it never saw blue ones.", ink),
                ("Fix: many kinds of hats!", sage)]
        for i, (txt, col) in enumerate(rows):
            y = 420 + i * 140
            draw.line((170, y + 100, 1080, y + 100), fill=PAPER_LINE, width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 200, y + 44, 24, sage)
                draw.text((240, y + 22), txt, fill=col, font=font(44, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 625, y - 30, font(110, bold=True), line)
        finder(draw, 1460, 640, 0.85, t, face="confused" if not ans or progress < 0.7 else "happy")
        hat(draw, 1460, 420, 0.8, "woolly", BLUE)
        if ans:
            if progress < 0.7:
                K.pill(draw, 1460, 800, "NOT A HAT", K.DANGER, size=30)
            else:
                K.pill(draw, 1460, 800, "Needs many kinds!", sage, size=30)
        else:
            K.text_at(draw, "?", 1660, 300, font(90, bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1250, 330, 40, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------
    if visual == "b16-recap":
        recap = [(("AI learns only", "from examples"), coral, "learn"), (("One kind of", "example → unfair"), K.DANGER, "one"),
                 (("Many kinds", "of examples"), K.BOTH_COLOR, "crayon"), (("More variety", "= fairer"), sage, "fair")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, font(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 540), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "learn":
                    hat_photo(draw, ix - 90, iy - 40, 0.7, "cap", RED, bg=(250, 236, 236))
                    finder(draw, ix + 80, iy + 40, 0.42, t, face="happy")
                elif kind == "one":
                    hat(draw, ix - 90, iy - 30, 0.6, "cap", RED)
                    mark(ix - 40, iy - 120, True, 22)
                    hat(draw, ix + 90, iy + 110, 0.6, "woolly", BLUE)
                    K.text_at(draw, "?", ix + 150, iy - 20, font(70, bold=True), K.DANGER)
                elif kind == "crayon":
                    for k, c in enumerate([RED, YELLOW, GREEN, BLUE, PURPLE]):
                        crayon(draw, ix - 120 + k * 60, iy + 10, 0.7, c)
                else:
                    for k, spec in enumerate(PEOPLE[:4]):
                        px, py = ix - 80 + (k % 2) * 160, iy - 70 + (k // 2) * 150
                        person(draw, px, py, 34, spec)
                        mark(px + 46, py - 40, True, 16)
                label_lines(lab, x0 + 200, y0 + 400, size=38)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            finder(draw, cx + 300, 470, 0.7, t, face="happy")
            K.text_at(draw, "Chapter 1 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "AI needs many kinds of examples", coral, size=34)
            stars_around(320, 560, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
