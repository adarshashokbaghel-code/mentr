"""C6 · True or False? — visuals."""
import math

import build as K

TRUE_COL = (22, 160, 96)
TRUE_SOFT = (224, 246, 233)
FALSE_COL = (224, 62, 62)
FALSE_SOFT = (253, 232, 230)
BOARD = (44, 88, 72)
BOARD_EDGE = (150, 104, 62)
WOOD = (196, 150, 98)
WOOD_DARK = (150, 104, 62)
CHALK = (244, 244, 236)
SUN = (255, 186, 60)
PARROT = (70, 170, 80)
PARROT_WING = (40, 120, 200)
CROW = (60, 64, 76)
CROW_WING = (36, 38, 48)
SPARROW = (170, 120, 76)
SPARROW_WING = (120, 82, 50)
BEAK = (255, 170, 40)
APPLE = (220, 48, 56)
CHERRY = (190, 24, 52)
BANANA = (255, 214, 60)
BANANA_DARK = (214, 160, 30)
STEM = (70, 156, 92)
CAT = (240, 160, 80)
CAT_DARK = (204, 120, 50)
WATER = (120, 190, 242)
SCREEN = (28, 36, 58)


def S_(s):
    return lambda v: v * s


def kabir(draw, cx, cy, s, t=0.0, body=K.ROAD):
    """Kabir bust. cy = face centre; hair top ≈ cy-75s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    draw.polygon([(cx - S(22), cy + S(52)), (cx + S(22), cy + S(52)), (cx, cy + S(84))], fill=(255, 255, 255))
    r = S(64)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    draw.polygon([(cx - r * 0.2, cy - r * 1.0), (cx + r * 0.05, cy - r * 1.32), (cx + r * 0.3, cy - r * 0.98)],
                 fill=K.HAIR)
    draw.polygon([(cx + r * 0.1, cy - r * 1.02), (cx + r * 0.42, cy - r * 1.24), (cx + r * 0.55, cy - r * 0.92)],
                 fill=K.HAIR)


def miss_rao(draw, cx, cy, s, t=0.0):
    K.draw_person(draw, cx, cy, s, "mom", t)
    r = 64 * s
    yy = cy + 6 * s * math.sin(t * math.pi * 4)
    gw = max(2, int(r * 0.07))
    for sx in (-1, 1):
        gx = cx + sx * r * 0.38
        draw.ellipse((gx - r * 0.24, yy - r * 0.28, gx + r * 0.24, yy + r * 0.18), outline=(40, 44, 56), width=gw)
    draw.line((cx - r * 0.14, yy - r * 0.05, cx + r * 0.14, yy - r * 0.05), fill=(40, 44, 56), width=gw)
    draw.ellipse((cx - r * 0.12, yy - r * 1.02, cx + r * 0.12, yy - r * 0.8), fill=(214, 52, 72))


def tf_card(draw, cx, cy, s, kind, stick=True):
    """Paddle card. cy = card centre; card is 220×130 at s=1, handle hangs 100 below."""
    S = S_(s)
    col = TRUE_COL if kind == "true" else FALSE_COL
    if stick:
        draw.rounded_rectangle((cx - S(12), cy + S(50), cx + S(12), cy + S(160)), radius=S(6), fill=WOOD_DARK)
    draw.rounded_rectangle((cx - S(110) + S(6), cy - S(65) + S(8), cx + S(110) + S(6), cy + S(65) + S(8)),
                           radius=S(22), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(65), cx + S(110), cy + S(65)), radius=S(22), fill=col)
    draw.rounded_rectangle((cx - S(98), cy - S(53), cx + S(98), cy + S(53)), radius=S(16), outline=(255, 255, 255),
                           width=max(2, int(S(4))))
    label = "TRUE" if kind == "true" else "FALSE"
    K.text_at(draw, label, cx, cy - S(28), K.load_font(max(14, int(S(48))), bold=True), (255, 255, 255))


def stamp(draw, cx, cy, kind, s=1.0):
    S = S_(s)
    col = TRUE_COL if kind == "true" else FALSE_COL
    soft = TRUE_SOFT if kind == "true" else FALSE_SOFT
    x0, y0, x1, y1 = cx - S(150), cy - S(56), cx + S(150), cy + S(56)
    draw.rounded_rectangle((x0 + S(6), y0 + S(8), x1 + S(6), y1 + S(8)), radius=S(24), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(24), fill=soft, outline=col, width=max(3, int(S(8))))
    label = "TRUE" if kind == "true" else "FALSE"
    f = K.load_font(max(14, int(S(58))), bold=True)
    bb = draw.textbbox((0, 0), label, font=f)
    tw = bb[2] - bb[0]
    ix = cx - (tw + S(70)) / 2 + S(26)
    if kind == "true":
        K.draw_check(draw, ix, cy, S(26), col)
    else:
        K.draw_cross(draw, ix, cy, S(26), col)
    draw.text((ix + S(40), cy - S(34)), label, font=f, fill=col)


def bird(draw, cx, cy, s, body, wing, flap=0.0):
    """Flying bird facing right; about 220×150 at s=1."""
    S = S_(s)
    draw.polygon([(cx - S(70), cy), (cx - S(130), cy - S(30)), (cx - S(120), cy + S(24))], fill=wing)
    draw.ellipse((cx - S(90), cy - S(42), cx + S(60), cy + S(42)), fill=body)
    draw.ellipse((cx + S(20), cy - S(70), cx + S(94), cy - S(4)), fill=body)
    draw.polygon([(cx + S(88), cy - S(46), ), (cx + S(128), cy - S(34)), (cx + S(88), cy - S(24))], fill=BEAK)
    draw.ellipse((cx + S(56), cy - S(52), cx + S(70), cy - S(38)), fill=K.DEV_DEEP)
    up = math.sin(flap * math.pi * 6)
    tip_y = cy - S(80) * up - S(10)
    draw.polygon([(cx - S(50), cy - S(10)), (cx + S(20), cy - S(14)), (cx - S(30), tip_y - S(20))], fill=wing)


def penguin(draw, cx, cy, s, t=0.0):
    """Standing penguin; cy = body centre, about 200×300 at s=1."""
    S = S_(s)
    sway = S(8) * math.sin(t * math.pi * 6)
    cx = cx + sway
    draw.ellipse((cx - S(100), cy + S(130), cx + S(100), cy + S(160)), fill=K.SHADOW)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(40) - S(34), cy + S(118), cx + sx * S(40) + S(34), cy + S(148)), fill=BEAK)
    draw.ellipse((cx - S(90), cy - S(110), cx + S(90), cy + S(140)), fill=K.DEV_DEEP)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * S(80), cy - S(40)), (cx + sx * S(120), cy + S(60)), (cx + sx * S(78), cy + S(50))],
                     fill=K.DEV_DEEP)
    draw.ellipse((cx - S(62), cy - S(60), cx + S(62), cy + S(130)), fill=(250, 250, 246))
    draw.ellipse((cx - S(70), cy - S(170), cx + S(70), cy - S(30)), fill=K.DEV_DEEP)
    draw.ellipse((cx - S(50), cy - S(130), cx + S(50), cy - S(50)), fill=(250, 250, 246))
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(22) - S(9), cy - S(110), cx + sx * S(22) + S(9), cy - S(92)), fill=K.DEV_DEEP)
    draw.polygon([(cx - S(16), cy - S(84)), (cx + S(16), cy - S(84)), (cx, cy - S(62))], fill=BEAK)


def cat(draw, cx, cy, s):
    """Side-view cat facing right; returns the 4 leg x-positions and the leg bottom y."""
    S = S_(s)
    K.draw_curve(draw, (cx - S(140), cy - S(10)), (cx - S(250), cy - S(40)), (cx - S(210), cy - S(150)), CAT_DARK,
                 width=max(4, int(S(22))))
    legs = [cx - S(115), cx - S(65), cx + S(45), cx + S(95)]
    for k, lx in enumerate(legs):
        draw.rounded_rectangle((lx - S(16), cy + S(20), lx + S(16), cy + S(130)), radius=S(12),
                               fill=CAT_DARK if k in (0, 2) else CAT)
    draw.ellipse((cx - S(160), cy - S(64), cx + S(130), cy + S(64)), fill=CAT)
    for k in range(3):
        x = cx - S(70) + k * S(50)
        draw.line((x, cy - S(60), x + S(10), cy - S(20)), fill=CAT_DARK, width=max(3, int(S(10))))
    hx, hy, hr = cx + S(150), cy - S(70), S(64)
    for sx in (-1, 1):
        draw.polygon([(hx + sx * hr * 0.85, hy - hr * 0.3), (hx + sx * hr * 0.7, hy - hr * 1.3),
                      (hx + sx * hr * 0.15, hy - hr * 0.8)], fill=CAT)
    draw.ellipse((hx - hr, hy - hr, hx + hr, hy + hr), fill=CAT)
    for sx in (-1, 1):
        ex = hx + sx * hr * 0.36
        draw.ellipse((ex - S(8), hy - S(14), ex + S(8), hy + S(6)), fill=K.DEV_DEEP)
    draw.polygon([(hx - S(8), hy + S(14)), (hx + S(8), hy + S(14)), (hx, hy + S(24))], fill=(230, 110, 120))
    for sx in (-1, 1):
        for k in (-1, 1):
            draw.line((hx + sx * S(14), hy + S(22), hx + sx * S(70), hy + S(16) + k * S(12)), fill=K.DEV_MID,
                      width=max(2, int(S(3))))
    return legs, cy + S(130)


def apple(draw, cx, cy, r):
    draw.ellipse((cx - r + 8, cy - r + 10, cx + r + 8, cy + r + 10), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r * 0.9, cx + r * 0.2, cy + r), fill=APPLE)
    draw.ellipse((cx - r * 0.2, cy - r * 0.9, cx + r, cy + r), fill=APPLE)
    draw.line((cx, cy - r * 0.7, cx + r * 0.1, cy - r * 1.2), fill=K.DEV_MID, width=max(3, int(r * 0.1)))
    draw.ellipse((cx + r * 0.1, cy - r * 1.25, cx + r * 0.6, cy - r * 0.95), fill=STEM)
    draw.ellipse((cx - r * 0.6, cy - r * 0.5, cx - r * 0.3, cy - r * 0.1), fill=(255, 150, 150))


def strawberry(draw, cx, cy, r):
    pts = [(cx - r, cy - r * 0.5), (cx + r, cy - r * 0.5), (cx + r * 0.6, cy + r * 0.6), (cx, cy + r * 1.1),
           (cx - r * 0.6, cy + r * 0.6)]
    draw.polygon([(x + 8, y + 10) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=APPLE)
    draw.ellipse((cx - r, cy - r * 0.95, cx + r, cy - r * 0.05), fill=APPLE)
    for dx, dy in ((-0.5, -0.2), (0, -0.3), (0.5, -0.2), (-0.3, 0.2), (0.3, 0.2), (0, 0.6)):
        draw.ellipse((cx + dx * r - 5, cy + dy * r - 7, cx + dx * r + 5, cy + dy * r + 7), fill=(255, 230, 120))
    for k in range(5):
        a = math.pi + k * math.pi / 4
        draw.polygon([(cx, cy - r * 0.75), (cx + math.cos(a - 0.25) * r * 0.6, cy - r * 0.75 + math.sin(a - 0.25) * r * 0.4),
                      (cx + math.cos(a + 0.25) * r * 0.6, cy - r * 0.75 + math.sin(a + 0.25) * r * 0.4)], fill=STEM)


def banana(draw, cx, cy, r):
    """Curved banana, smile-shaped, centred near (cx, cy); about 2.4r wide."""
    big = r * 1.3
    oy = cy - 0.71 * big
    outer, inner = [], []
    n = 30
    for i in range(n + 1):
        f = i / n
        a = math.radians(25 + 130 * f)
        th = big * (0.04 + 0.36 * math.sin(math.pi * f) ** 0.7)
        outer.append((cx + big * math.cos(a), oy + big * math.sin(a)))
        inner.append((cx + (big - th) * math.cos(a), oy + (big - th) * math.sin(a)))
    pts = outer + inner[::-1]
    draw.polygon([(x + 8, y + 10) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=BANANA, outline=BANANA_DARK, width=4)
    mid = [((o[0] + q[0]) / 2, (o[1] + q[1]) / 2) for o, q in zip(outer[4:-4], inner[4:-4])]
    draw.line(mid, fill=(240, 190, 40), width=max(2, int(r * 0.06)))
    ex, ey = outer[0]
    draw.ellipse((ex - 7, ey - 7, ex + 7, ey + 7), fill=(110, 80, 40))
    sx, sy = outer[-1]
    draw.polygon([(sx, sy), (sx - r * 0.18, sy - r * 0.28), (sx - r * 0.02, sy - r * 0.34), (sx + r * 0.12, sy - r * 0.04)],
                 fill=(120, 150, 60))


def cherries(draw, cx, cy, r):
    for dx in (-0.55, 0.55):
        x = cx + dx * r
        draw.line((x, cy, cx + r * 0.1, cy - r * 1.3), fill=STEM, width=max(3, int(r * 0.09)))
    for dx in (-0.55, 0.55):
        x = cx + dx * r
        rr = r * 0.55
        draw.ellipse((x - rr + 6, cy + 8 - rr + 8, x + rr + 6, cy + 8 + rr + 8), fill=K.SHADOW)
        draw.ellipse((x - rr, cy + 8 - rr, x + rr, cy + 8 + rr), fill=CHERRY)
        draw.ellipse((x - rr * 0.5, cy + 8 - rr * 0.6, x - rr * 0.1, cy + 8 - rr * 0.2), fill=(255, 140, 150))
    draw.ellipse((cx + r * 0.1, cy - r * 1.45, cx + r * 0.7, cy - r * 1.15), fill=STEM)


def door_icon(draw, cx, cy, s):
    S = S_(s)
    draw.rectangle((cx - S(60), cy - S(90), cx + S(60), cy + S(90)), fill=WOOD_DARK)
    draw.rectangle((cx - S(50), cy - S(80), cx + S(50), cy + S(90)), fill=WOOD)
    for y0 in (-66, 6):
        draw.rectangle((cx - S(36), cy + S(y0), cx + S(36), cy + S(y0 + 58)), outline=WOOD_DARK, width=max(2, int(S(4))))
    draw.ellipse((cx + S(26), cy - S(4), cx + S(42), cy + S(12)), fill=K.GOLD)


def clock_icon(draw, cx, cy, s, t):
    S = S_(s)
    draw.ellipse((cx - S(80) + S(6), cy - S(80) + S(8), cx + S(80) + S(6), cy + S(80) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(80), cy - S(80), cx + S(80), cy + S(80)), fill=(255, 255, 255), outline=K.ROAD,
                 width=max(3, int(S(10))))
    for k in range(12):
        a = k * math.tau / 12
        draw.line((cx + math.cos(a) * S(56), cy + math.sin(a) * S(56), cx + math.cos(a) * S(66),
                   cy + math.sin(a) * S(66)), fill=K.DEV_MID, width=max(2, int(S(4))))
    a = t * math.tau - math.pi / 2
    draw.line((cx, cy, cx + math.cos(a) * S(50), cy + math.sin(a) * S(50)), fill=K.CORAL, width=max(3, int(S(7))))
    draw.line((cx, cy, cx + S(30), cy - S(18)), fill=K.DEV_DEEP, width=max(3, int(S(9))))
    draw.ellipse((cx - S(8), cy - S(8), cx + S(8), cy + S(8)), fill=K.DEV_DEEP)


def wow_icon(draw, cx, cy, s, pulse):
    S = S_(s)
    pts = []
    for k in range(24):
        rr = S(92 + 6 * pulse) if k % 2 == 0 else S(62)
        a = k * math.pi / 12
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    draw.polygon(pts, fill=K.GOLD)
    K.text_at(draw, "!", cx, cy - S(52), K.load_font(max(14, int(S(90))), bold=True), (255, 255, 255))


def calendar_icon(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(88) + S(6), cy - S(80) + S(8), cx + S(88) + S(6), cy + S(88) + S(8)), radius=S(16),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(88), cy - S(80), cx + S(88), cy + S(88)), radius=S(16), fill=(255, 255, 255),
                           outline=K.DEV_MID, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(88), cy - S(80), cx + S(88), cy - S(36)), radius=S(16), fill=K.CORAL)
    draw.rectangle((cx - S(88), cy - S(50), cx + S(88), cy - S(36)), fill=K.CORAL)
    for sx in (-1, 1):
        draw.rounded_rectangle((cx + sx * S(44) - S(7), cy - S(96), cx + sx * S(44) + S(7), cy - S(64)), radius=S(5),
                               fill=K.DEV_DARK)
    f = K.load_font(max(14, int(S(26))), bold=True)
    for d in range(7):
        row, col = (0, d) if d < 4 else (1, d - 4)
        x = cx - S(66) + col * S(44) + (S(22) if row else 0)
        y = cy - S(24) + row * S(52)
        draw.rounded_rectangle((x - S(18), y, x + S(18), y + S(40)), radius=S(8), fill=(226, 238, 250))
        K.text_at(draw, str(d + 1), x, y + S(6), f, K.DEV_DARK)


def light_switch(draw, cx, cy, s, on):
    S = S_(s)
    draw.rounded_rectangle((cx - S(60) + S(6), cy - S(90) + S(8), cx + S(60) + S(6), cy + S(90) + S(8)), radius=S(18),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(60), cy - S(90), cx + S(60), cy + S(90)), radius=S(18), fill=(250, 248, 242),
                           outline=K.DEV_MID, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(26), cy - S(56), cx + S(26), cy + S(56)), radius=S(12), fill=(214, 208, 198))
    ty = cy - S(52) if on else cy + S(4)
    draw.rounded_rectangle((cx - S(22), ty, cx + S(22), ty + S(48)), radius=S(10),
                           fill=TRUE_COL if on else K.DEV_MID)


def bulb(draw, cx, cy, s, on, t=0.0):
    S = S_(s)
    if on:
        for k in range(8):
            a = k * math.pi / 4 + t
            draw.line((cx + math.cos(a) * S(74), cy + math.sin(a) * S(74), cx + math.cos(a) * S(100),
                       cy + math.sin(a) * S(100)), fill=K.GOLD, width=max(3, int(S(8))))
    draw.ellipse((cx - S(56), cy - S(56), cx + S(56), cy + S(56)), fill=(255, 226, 120) if on else (222, 222, 226))
    draw.rounded_rectangle((cx - S(26), cy + S(46), cx + S(26), cy + S(86)), radius=S(6), fill=K.STEEL_DARK)


def cricket_bat(draw, cx, cy, s):
    S = S_(s)
    ang = -0.7
    ca, sa = math.cos(ang), math.sin(ang)

    def P(px, py):
        return (cx + px * ca - py * sa, cy + px * sa + py * ca)
    draw.polygon([P(-S(200) + S(8), -S(44) + S(10)), P(S(120) + S(8), -S(44) + S(10)), P(S(120) + S(8), S(44) + S(10)),
                  P(-S(200) + S(8), S(44) + S(10))], fill=K.SHADOW)
    draw.polygon([P(-S(200), -S(44)), P(S(120), -S(44)), P(S(130), S(0)), P(S(120), S(44)), P(-S(200), S(44))],
                 fill=(236, 206, 150))
    draw.polygon([P(-S(190), -S(10)), P(S(110), -S(10)), P(S(110), S(10)), P(-S(190), S(10))], fill=(220, 186, 126))
    draw.polygon([P(S(130), -S(14)), P(S(270), -S(14)), P(S(270), S(14)), P(S(130), S(14))], fill=K.DEV_DARK)
    for k in range(6):
        x = S(150) + k * S(20)
        draw.line((P(x, -S(14)), P(x, S(14))), fill=K.DEV_MID, width=max(2, int(S(4))))


def cricket_ball(draw, cx, cy, r):
    draw.ellipse((cx - r + 6, cy - r + 8, cx + r + 6, cy + r + 8), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(200, 40, 48))
    draw.arc((cx - r * 0.6, cy - r * 1.2, cx + r * 1.6, cy + r * 1.2), 140, 220, fill=(255, 240, 230), width=3)
    draw.arc((cx - r * 0.9, cy - r * 1.2, cx + r * 1.3, cy + r * 1.2), 140, 220, fill=(255, 240, 230), width=3)


def trophy(draw, cx, cy, s):
    S = S_(s)
    draw.chord((cx - S(60), cy - S(80), cx + S(60), cy + S(40)), 0, 180, fill=K.GOLD)
    draw.rectangle((cx - S(60), cy - S(80), cx + S(60), cy - S(20)), fill=K.GOLD)
    for sx in (-1, 1):
        draw.arc((cx + sx * S(60) - S(30), cy - S(70), cx + sx * S(60) + S(30), cy - S(10)),
                 270 if sx > 0 else 90, 90 if sx > 0 else 270, fill=K.GOLD, width=max(3, int(S(10))))
    draw.rectangle((cx - S(12), cy + S(36), cx + S(12), cy + S(70)), fill=(214, 150, 30))
    draw.rounded_rectangle((cx - S(50), cy + S(66), cx + S(50), cy + S(90)), radius=S(6), fill=(214, 150, 30))
    K.draw_star(draw, cx, cy - S(36), S(22), (255, 255, 255))


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
    gold_soft = (255, 244, 214)
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    font = K.load_font

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def say_card(mx, y, text, size=48, pad=60, outline=None, quote=True):
        f = font(size, bold=True)
        txt = f"“{text}”" if quote else text
        bb = draw.textbbox((0, 0), txt, font=f)
        tw = bb[2] - bb[0]
        x0, x1 = mx - tw / 2 - pad, mx + tw / 2 + pad
        K.shadow_card(draw, (x0, y, x1, y + size + 56), brand, radius=28, outline=outline,
                      outline_w=5 if outline else 3)
        K.text_at(draw, txt, mx, y + 24, f, ink)
        return x0, x1

    def stamp_in(cx_, cy_, kind, delay=0.55, s=1.0):
        a = K.ease_out_cubic(K.clamp01((progress - delay) * 4))
        if a <= 0:
            return
        stamp(draw, cx_, cy_, kind, s * (1.25 - 0.25 * a))

    def dot(x, y, r, col, outline=None):
        draw.ellipse((x - r + 4, y - r + 5, x + r + 4, y + r + 5), fill=K.SHADOW)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=col, outline=outline, width=4 if outline else 1)

    def pair_rows(n, x0, yc, r=17, step=48, n_shown=None, hl=coral):
        pairs, left = n // 2, n % 2
        cols = pairs + left
        shown = cols if n_shown is None else max(0, min(cols, int(n_shown)))
        for c in range(shown):
            x = x0 + c * step + (20 if (left and c == pairs) else 0)
            if c < pairs:
                draw.rounded_rectangle((x - r - 7, yc - 2 * r - 12, x + r + 7, yc + 2 * r + 12), radius=r + 6,
                                       outline=sage, width=3)
                dot(x, yc - r - 3, r, K.ROAD)
                dot(x, yc + r + 3, r, K.ROAD)
            else:
                draw.ellipse((x - r - 12, yc - r - 12, x + r + 12, yc + r + 12), outline=hl, width=4)
                dot(x, yc, r, hl)
        return x0 + (cols - 1) * step + (20 if left else 0)

    def classroom(statement, kabir_kind):
        draw.rounded_rectangle((410, 226, 1510, 430), radius=14, fill=BOARD_EDGE)
        draw.rounded_rectangle((424, 240, 1496, 416), radius=8, fill=BOARD)
        K.text_at(draw, statement, 930, 300, font(52, bold=True), CHALK)
        if "sun" in statement:
            for k in range(8):
                a = k * math.pi / 4 + t
                draw.line((1400 + math.cos(a) * 44, 330 + math.sin(a) * 44, 1400 + math.cos(a) * 62,
                           330 + math.sin(a) * 62), fill=SUN, width=7)
            draw.ellipse((1400 - 34, 330 - 34, 1400 + 34, 330 + 34), fill=SUN)
        else:
            bird(draw, 1410, 340, 0.42, CHALK, (200, 210, 200), flap=t)
        miss_rao(draw, 230, 560, 1.05, t)
        K.pill(draw, 230, 740, "Miss Rao", K.BOTH_COLOR, size=28)
        xs = [700, 960, 1220, 1480]
        bodies = [K.GOLD, sage, K.ROAD, K.BOTH_COLOR]
        for i, x in enumerate(xs):
            a = K.stagger(progress, i, step=0.08, speed=5)
            is_k = i == 2
            kind = kabir_kind if is_k else "true"
            up = int((1 - a) * 50)
            if is_k:
                draw.ellipse((x - 125, 570, x + 125, 820), fill=coral_soft if kind == "false" else blue_soft)
                kabir(draw, x, 690, 0.8, t)
            else:
                K.draw_person(draw, x, 690, 0.8, "friend" if i == 0 else "kid", t)
                if i != 0:
                    draw.chord((x - 96 * 0.8, 690 + 46 * 0.8, x + 96 * 0.8, 690 + 236 * 0.8), 180, 360, fill=bodies[i])
            tf_card(draw, x, 520 + up, 0.6, kind)
        K.pill(draw, xs[2], 812, "Kabir", K.ROAD, size=28)

    # ---- opening -----------------------------------------------------------
    if visual == "c6-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            kabir(draw, cx + 280, 430, 1.3, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 560, 320), (cx + 560, 320), (cx - 640, 540), (cx + 640, 540)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "UNIT 1 · NUMBERS COMPUTERS LOVE", cx, 330 + lift, font(34, bold=True), sage)
            chips = ["Binary", "Odd & even", "Place value", "Skip counting", "Patterns"]
            for i, lab in enumerate(chips):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 270
                y = 470 + int((1 - a) * 40)
                draw.ellipse((x - 70, y - 70, x + 70, y + 70), fill=sage_soft)
                K.draw_check(draw, x, y, 46, sage)
                K.text_at(draw, lab, x, y + 92, font(30, bold=True), ink)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 720 + int((1 - a) * 20), "UNIT 1 DONE!", coral, size=40)
            return True
        if focus == "unit":
            draw.ellipse((520 - 250, 560 - 250, 520 + 250, 560 + 250), fill=blue_soft)
            kabir(draw, 500, 500, 1.5, t)
            K.draw_magnifier(draw, 690, 690, 0.8, coral)
            K.pill(draw, 0, 290 + lift, "UNIT 2", coral, size=34, left=900)
            K.text_at(draw, "Logic &", 1300, 370 + lift, font(90, bold=True), ink)
            K.text_at(draw, "Reasoning", 1300, 470 + lift, font(90, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a > 0:
                    x = 1060 + i * 120
                    draw.rounded_rectangle((x - 46, 650, x + 46, 742), radius=22, fill=panel, outline=line, width=3)
                    K.text_at(draw, str(i + 1), x, 664, font(46, bold=True), coral if i == 0 else muted)
            K.text_at(draw, "5 chapters", 1300, 770, font(30, bold=True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 302 + lift, font(32, bold=True), coral)
            K.text_at(draw, "True or False?", cx, 362 + lift, font(90, bold=True), ink)
            for i, kind in enumerate(("true", "false")):
                a = K.stagger(progress, i + 2, step=0.14, speed=4)
                if a > 0:
                    tf_card(draw, cx + (i * 2 - 1) * 240, 640 + int((1 - a) * 40), 1.0, kind)
            return True
        draw.ellipse((520 - 260, 560 - 260, 520 + 260, 560 + 260), fill=sage_soft)
        kabir(draw, 500, 500, 1.6, t)
        K.draw_magnifier(draw, 700, 700, 0.85, coral)
        K.text_at(draw, "Logic", 1290, 290 + lift, font(110, bold=True), coral)
        K.text_at(draw, "Detective!", 1290, 420 + lift, font(110, bold=True), ink)
        tf_card(draw, 1140, 680, 0.8, "true")
        tf_card(draw, 1440, 680, 0.8, "false")
        return True

    # ---- Kabir's class game -------------------------------------------------------
    if visual == "c6-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=blue_soft)
            kabir(draw, 560, 470, 1.6, t)
            tf_card(draw, 330, 640, 0.9, "true")
            tf_card(draw, 790, 640, 0.9, "false")
            K.text_at(draw, "Meet", 1330, 290 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Kabir!", 1330, 360 + lift, font(130, bold=True), K.ROAD)
            K.pill(draw, 1330, 560, "The True or False game", sage, size=38)
            miss_rao(draw, 1220, 720, 0.85, t)
            K.pill(draw, 0, 724, "with Miss Rao", K.BOTH_COLOR, size=30, left=1320)
            star_spots([(1000, 330), (1680, 330)])
            return True
        if focus == "sun":
            classroom("“The sun rises in the east.”", "true")
            return True
        if focus == "birds":
            classroom("“All birds can fly.”", "false")
            if progress > 0.6:
                K.text_at(draw, "!", 1330, 560, font(int(80 + 14 * pulse), bold=True), coral)
            return True
        if focus == "ask":
            draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=coral_soft)
            kabir(draw, 480, 500, 1.5, t)
            tf_card(draw, 720, 640, 0.9, "false")
            draw.ellipse((930 + 8, 250 + 10, 1500 + 8, 560 + 10), fill=K.SHADOW)
            draw.ellipse((930, 250, 1500, 560), fill=panel, outline=(200, 192, 180), width=4)
            for k, rr in enumerate((22, 14)):
                px, py = K.lerp(1000, 700, (k + 1) / 3), K.lerp(540, 420, (k + 1) / 3)
                draw.ellipse((px - rr, py - rr, px + rr, py + rr), fill=panel, outline=(200, 192, 180), width=3)
            bird(draw, 1170, 410, 0.7, PARROT, PARROT_WING, flap=t)
            K.text_at(draw, "?", 1380, 330, font(int(110 + 16 * pulse), bold=True), coral)
            question_marks([(1620, 300), (880, 640)], size=72)
            K.draw_stopwatch(draw, 1600, 740, 52, progress, brand)
            return True
        kabir(draw, 480, 500, 1.4, t)
        tf_card(draw, 700, 640, 0.85, "false")
        K.text_at(draw, "Hold that", 1270, 330 + lift, font(84, bold=True), ink)
        K.text_at(draw, "thought…", 1270, 430 + lift, font(84, bold=True), coral)
        draw.rounded_rectangle((1150, 600, 1390, 800), radius=26, fill=coral_soft)
        K.draw_dashed(draw, 1180, 600, 1360, 600, coral, width=5, phase=progress * 120)
        K.draw_dashed(draw, 1180, 800, 1360, 800, coral, width=5, phase=progress * 120)
        K.draw_dashed(draw, 1150, 630, 1150, 770, coral, width=5, phase=progress * 120)
        K.draw_dashed(draw, 1390, 630, 1390, 770, coral, width=5, phase=progress * 120)
        K.text_at(draw, "?", 1270, 630, font(int(110 + 14 * pulse), bold=True), coral)
        return True

    # ---- what is a statement ----------------------------------------------------------
    if visual == "c6-define":
        if focus == "name":
            miss_rao(draw, 330, 540, 1.2, t)
            K.pill(draw, 330, 740, "Miss Rao", K.BOTH_COLOR, size=30)
            K.draw_bubble(draw, (470, 250, 1000, 410), brand, "A cat has four legs.", tail="left", size=42)
            K.shadow_card(draw, (1060, 270 + lift, 1800, 830 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A STATEMENT…", 1430, 340 + lift, font(48, bold=True), coral)
            parts = [("tells", ink), ("something,", ink), ("and can be", ink), ("checked.", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a > 0:
                    K.text_at(draw, txt, 1430, 430 + i * 92 + lift + int((1 - a) * 30), font(62, bold=True), col)
            a = K.stagger(progress, 5, step=0.1, speed=4)
            if a > 0:
                K.draw_magnifier(draw, 760, 620, 0.8 * a + 0.01, coral)
            return True
        if focus == "tf":
            panels = [("TRUE", TRUE_COL, TRUE_SOFT, ["It matches", "the facts"]),
                      ("FALSE", FALSE_COL, FALSE_SOFT, ["It does NOT", "match the facts"])]
            for i, (title, col, soft, lines) in enumerate(panels):
                a = K.stagger(progress, i, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 180 if i == 0 else 1020
                y0 = 260 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 720 + 10, y0 + 580 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 580), radius=40, fill=soft, outline=col, width=6)
                K.pill(draw, x0 + 360, y0 + 30, title, col, size=46)
                if i == 0:
                    K.draw_check(draw, x0 + 360, y0 + 260, 100, col)
                else:
                    K.draw_cross(draw, x0 + 360, y0 + 260, 100, col)
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 360, y0 + 410 + j * 58, font(46, bold=True), ink)
            K.text_at(draw, "or", cx, 520, font(50, bold=True), muted)
            return True
        say_card(cx, 230, "A cat has four legs.", size=50)
        legs, ly = cat(draw, 860, 560, 1.25)
        for k, lx in enumerate(legs):
            a = K.stagger(progress, k, step=0.13, speed=5)
            if a <= 0:
                continue
            draw.ellipse((lx - 30, ly + 14, lx + 30, ly + 74), fill=sage)
            K.text_at(draw, str(k + 1), lx, ly + 20, font(40, bold=True), (255, 255, 255))
        stamp_in(1560, 560, "true", delay=0.62)
        return True

    # ---- is it a statement? ------------------------------------------------------------
    if visual == "c6-sort":
        items = [("door", "Please close the door.", "Request"), ("clock", "What time is it?", "Question"),
                 ("wow", "Wow!", "Shout"), ("week", "A week has 7 days.", "Statement")]
        boxes = [(170, 250, 930, 530), (990, 250, 1750, 530), (170, 580, 930, 860), (990, 580, 1750, 860)]
        tag_cols = [K.BOTH_COLOR, K.ROAD, K.GOLD, TRUE_COL]
        for i, ((kind, text, tag), box) in enumerate(zip(items, boxes)):
            x0, y0, x1, y1 = box
            a = K.stagger(progress, i, step=0.1, speed=5) if focus == "ask" else 1.0
            if a <= 0:
                continue
            yy = int((1 - a) * 30)
            win = kind == "week" and focus != "ask"
            dim = kind != "week" and focus == "answer"
            K.shadow_card(draw, (x0, y0 + yy, x1, y1 + yy), brand, radius=30, outline=TRUE_COL if win else None,
                          outline_w=6 if win else 3)
            if win:
                draw.rounded_rectangle((x0 + 6, y0 + 6 + yy, x1 - 6, y1 - 6 + yy), radius=26, fill=TRUE_SOFT)
            ix, iy = x0 + 140, (y0 + y1) / 2 + yy
            draw.ellipse((ix - 110, iy - 110, ix + 110, iy + 110), fill=[lav_soft, blue_soft, gold_soft, coral_soft][i])
            if kind == "door":
                door_icon(draw, ix, iy, 0.95)
            elif kind == "clock":
                clock_icon(draw, ix, iy, 0.95, t)
            elif kind == "wow":
                wow_icon(draw, ix, iy, 0.95, pulse)
            else:
                calendar_icon(draw, ix, iy + 6, 0.95)
            f = font(44, bold=True)
            lines = K.wrap_text(text, f, 460)
            ty = y0 + yy + (60 if focus != "ask" else (y1 - y0) / 2 - len(lines) * 27)
            for j, ln in enumerate(lines):
                draw.text((x0 + 280, ty + j * 54), ln, font=f, fill=muted if dim else ink)
            if focus == "why" or (focus == "answer" and kind == "week"):
                box = K.pill(draw, 0, y1 + yy - 86, tag, tag_cols[i], size=32, left=x0 + 280)
                if kind == "week":
                    K.pill(draw, 0, y1 + yy - 86, "TRUE", TRUE_COL, size=32, left=box[2] + 18)
                    K.draw_check(draw, x1 - 50, y1 + yy - 60, 28, TRUE_COL)
                else:
                    K.draw_cross(draw, x1 - 50, y1 + yy - 60, 26, FALSE_COL)
        return True

    # ---- no maybe ---------------------------------------------------------------------
    if visual == "c6-maybe":
        if focus == "intro":
            tf_card(draw, 500, 360, 1.15, "true", stick=False)
            tf_card(draw, 1420, 360, 1.15, "false", stick=False)
            a = K.stagger(progress, 1, step=0.2, speed=4)
            draw.rounded_rectangle((cx - 126 + 8, 285 + 10, cx + 126 + 8, 435 + 10), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((cx - 126, 285, cx + 126, 435), radius=24, fill=(226, 222, 216))
            K.text_at(draw, "MAYBE", cx, 330, font(52, bold=True), (120, 124, 132))
            if a > 0:
                draw.line((cx - 150, 410, cx - 150 + 300 * a, 410 - 100 * a), fill=FALSE_COL, width=12)
                K.draw_cross(draw, cx + 126, 285, 34 * a + 1, FALSE_COL)
            b = K.stagger(progress, 3, step=0.15, speed=4)
            if b > 0:
                light_switch(draw, 640, 680, 0.9, True)
                bulb(draw, 820, 660, 0.85, True, t)
                K.text_at(draw, "ON", 730, 790, font(40, bold=True), TRUE_COL)
                light_switch(draw, 1160, 680, 0.9, False)
                bulb(draw, 1340, 660, 0.85, False)
                K.text_at(draw, "OFF", 1250, 790, font(40, bold=True), K.DEV_MID)
            return True
        if focus in ("add", "add9"):
            x0 = 400
            cols = [coral] * 5 + [K.ROAD] * 3
            label = "5 + 3 = 8" if focus == "add" else "5 + 3 = 9"
            K.pill(draw, cx - 200, 236, label, K.BOTH_COLOR, size=50)
            draw.line((x0 - 40, 410, x0 + 4 * 120 + 40, 410), fill=coral, width=6)
            K.text_at(draw, "5", x0 + 240, 350, font(46, bold=True), coral)
            draw.line((x0 + 5 * 120 - 40, 410, x0 + 7 * 120 + 40, 410), fill=K.ROAD, width=6)
            K.text_at(draw, "3", x0 + 6 * 120, 350, font(46, bold=True), K.ROAD)
            for i, col in enumerate(cols):
                x = x0 + i * 120
                dot(x, 520, 46, col)
                a = K.stagger(progress, i, step=0.07, speed=6) if focus == "add" else 1.0
                if a > 0:
                    K.text_at(draw, str(i + 1), x, 590, font(44, bold=True), ink)
            if focus == "add":
                stamp_in(1640, 520, "true", delay=0.7)
            else:
                x9 = x0 + 8 * 120
                n = 14
                for q in range(n):
                    a0 = q * 360 / n + progress * 60
                    draw.arc((x9 - 46, 520 - 46, x9 + 46, 520 + 46), a0, a0 + 360 / n * 0.6, fill=FALSE_COL, width=5)
                K.text_at(draw, "9?", x9, 590, font(44, bold=True), FALSE_COL)
                K.draw_cross(draw, x9, 520, 26, FALSE_COL)
                K.text_at(draw, "We counted 8, not 9", 860, 700, font(48, bold=True), muted)
                stamp_in(1640, 520, "false", delay=0.45)
            return True
        say_card(cx - 200, 226, "10 is an odd number.", size=48)
        for k in range(5):
            a = K.stagger(progress, k, step=0.1, speed=5)
            x = cx - 600 + k * 200
            for j in range(2):
                dot(x, 470 + j * 110, 42, K.ROAD)
            if a > 0:
                draw.rounded_rectangle((x - 62, 408, x + 62, 642), radius=56, outline=sage, width=int(3 + 3 * a))
                K.text_at(draw, f"pair {k + 1}", x, 660, font(30, bold=True), sage)
        a = K.stagger(progress, 5, step=0.1, speed=4)
        if a > 0:
            K.text_at(draw, "5 pairs · 0 left over", cx - 200, 720, font(44, bold=True), ink)
            K.pill(draw, cx - 200, 790, "10 is EVEN", sage, size=36)
        stamp_in(1640, 520, "false", delay=0.65)
        return True

    # ---- quick round ---------------------------------------------------------------------
    if visual == "c6-quick":
        stmts = ["3 is bigger than 8.", "A square has 3 sides.", "Cricket is played with a bat."]
        if focus == "ask":
            for i, s in enumerate(stmts):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                y = 270 + i * 190 + int((1 - a) * 30)
                K.shadow_card(draw, (280, y, 1460, y + 150), brand, radius=30)
                K.pill(draw, 0, y + 46, str(i + 1), [coral, K.ROAD, sage][i], size=34, left=310)
                draw.text((420, y + 46), f"“{s}”", font=font(50, bold=True), fill=ink)
                K.text_at(draw, "T or F?", 1340, y + 52, font(36, bold=True), muted)
            K.draw_stopwatch(draw, 1650, 560, 60, progress, brand)
            return True
        if focus == "num":
            say_card(cx, 226, stmts[0], size=48)
            x0, x1, ly = 380, 1540, 560
            draw.line((x0 - 40, ly, x1 + 40, ly), fill=ink, width=7)
            step = (x1 - x0) / 10
            for k in range(11):
                x = x0 + k * step
                draw.line((x, ly - 16, x, ly + 16), fill=ink, width=4)
                col = coral if k == 3 else K.ROAD if k == 8 else muted
                K.text_at(draw, str(k), x, ly + 28, font(40 if k in (3, 8) else 30, bold=True), col)
            for k, col in ((3, coral), (8, K.ROAD)):
                x = x0 + k * step
                a = K.stagger(progress, 0 if k == 3 else 1, step=0.2, speed=4)
                if a > 0:
                    draw.ellipse((x - 26, ly - 26 - 70 * a, x + 26, ly + 26 - 70 * a), fill=col)
            K.draw_arrow(draw, 900, 690, 520, 690, muted, width=8, head=24)
            K.text_at(draw, "smaller", 700, 710, font(32, bold=True), muted)
            K.draw_arrow(draw, 1020, 690, 1400, 690, muted, width=8, head=24)
            K.text_at(draw, "bigger", 1210, 710, font(32, bold=True), muted)
            stamp_in(cx, 800, "false", delay=0.6, s=0.8)
            return True
        if focus == "square":
            say_card(cx, 226, stmts[1], size=48)
            x0, y0, x1, y1 = 650, 420, 970, 740
            draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), fill=K.SHADOW)
            draw.rectangle((x0, y0, x1, y1), fill=blue_soft, outline=K.ROAD, width=10)
            spots = [((x0 + x1) / 2, y0 - 64), (x1 + 50, (y0 + y1) / 2 - 26), ((x0 + x1) / 2, y1 + 16),
                     (x0 - 50, (y0 + y1) / 2 - 26)]
            sides = [(x0, y0, x1, y0), (x1, y0, x1, y1), (x1, y1, x0, y1), (x0, y1, x0, y0)]
            for k, ((sx, sy), seg) in enumerate(zip(spots, sides)):
                a = K.stagger(progress, k, step=0.12, speed=5)
                if a <= 0:
                    continue
                draw.line(seg, fill=sage, width=14)
                draw.ellipse((sx - 28, sy, sx + 28, sy + 56), fill=sage)
                K.text_at(draw, str(k + 1), sx, sy + 6, font(38, bold=True), (255, 255, 255))
            stamp_in(1460, 560, "false", delay=0.62)
            return True
        say_card(cx, 226, stmts[2], size=48)
        draw.ellipse((800 - 230, 590 - 230, 800 + 230, 590 + 230), fill=gold_soft)
        cricket_bat(draw, 790, 600, 1.0)
        cricket_ball(draw, 1000, 720, 34)
        kabir(draw, 1180, 560, 0.9, t)
        stamp_in(1560, 560, "true", delay=0.3)
        return True

    # ---- penguin counter-example -----------------------------------------------------------
    if visual == "c6-penguin":
        birds = [("Parrot", PARROT, PARROT_WING), ("Crow", CROW, CROW_WING), ("Sparrow", SPARROW, SPARROW_WING)]
        if focus == "birds":
            K.pill(draw, cx, 236, "All birds can fly?", K.BOTH_COLOR, size=44)
            for i, (name, body, wing) in enumerate(birds):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 440
                y = 480 + 14 * math.sin(t * 8 + i) + int((1 - a) * 40)
                draw.ellipse((x - 170, 330, x + 170, 640), fill=[sage_soft, blue_soft, gold_soft][i])
                bird(draw, x, y, 1.0, body, wing, flap=t + i * 0.1)
                K.text_at(draw, name, x, 680, font(42, bold=True), ink)
                K.draw_check(draw, x, 780, 32, TRUE_COL)
            return True
        if focus == "penguin":
            for i, (name, body, wing) in enumerate(birds):
                x = 260 + i * 230
                bird(draw, x, 450, 0.6, body, wing, flap=t + i * 0.1)
                K.draw_check(draw, x, 560, 24, TRUE_COL)
                K.text_at(draw, name, x, 600, font(30, bold=True), muted)
            draw.ellipse((1260 - 260, 560 - 260, 1260 + 260, 560 + 260), fill=blue_soft)
            for k in range(3):
                yy = 780 + k * 22
                draw.line([(1060 + j * 40, yy + 8 * math.sin(j + t * 10)) for j in range(11)], fill=WATER, width=6)
            penguin(draw, 1260, 540, 1.1, t)
            K.pill(draw, 1260, 236, "A penguin is a bird!", K.ROAD, size=38)
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                K.draw_cross(draw, 1560, 440, 40, FALSE_COL)
                K.text_at(draw, "can't fly!", 1600, 500, font(40, bold=True), FALSE_COL)
            return True
        if focus == "one":
            x0, x1 = say_card(cx - 240, 230, "All birds can fly.", size=50)
            stamp_in(x1 + 200, 290, "false", delay=0.3, s=0.85)
            draw.ellipse((560 - 220, 620 - 220, 560 + 220, 620 + 220), fill=blue_soft)
            penguin(draw, 560, 600, 0.95, t)
            K.draw_arrow(draw, 800, 600, 960, 600, coral, width=12, head=34)
            a = K.stagger(progress, 1, step=0.2, speed=4)
            if a > 0:
                K.pill(draw, 1360, 530 + int((1 - a) * 20), "COUNTER-EXAMPLE", coral, size=50)
                K.text_at(draw, "one example that", 1360, 650, font(42, bold=True), ink)
                K.text_at(draw, "breaks the statement", 1360, 705, font(42, bold=True), ink)
            return True
        K.pill(draw, cx - 230, 236, "ALL", coral, size=56)
        K.pill(draw, cx + 230, 236, "EVERY", coral, size=56)
        K.text_at(draw, "must work every single time", cx, 380, font(48, bold=True), ink)
        row = [birds[0], birds[1], birds[2], birds[0], birds[1]]
        for i in range(6):
            a = K.stagger(progress, i, step=0.08, speed=5)
            if a <= 0:
                continue
            x = cx + (i - 2.5) * 220
            if i < 5:
                _, body, wing = row[i]
                bird(draw, x, 560, 0.55, body, wing, flap=t + i * 0.1)
                K.draw_check(draw, x, 680, 26, TRUE_COL)
            else:
                penguin(draw, x, 560, 0.42, t)
                K.draw_cross(draw, x, 680, 26, FALSE_COL)
        a = K.stagger(progress, 6, step=0.08, speed=4)
        if a > 0:
            K.pill(draw, cx, 760, "One miss → FALSE", FALSE_COL, size=40)
        return True

    # ---- which fruit breaks it? ---------------------------------------------------------------
    if visual == "c6-fruit":
        ans = focus == "answer"
        x0, x1 = say_card(cx - 200 if ans else cx, 226, "All fruits are red.", size=50)
        if ans:
            stamp_in(x1 + 200, 286, "false", delay=0.15, s=0.85)
        names = ["Apple", "Strawberry", "Banana", "Cherry"]
        for i, name in enumerate(names):
            x = cx + (i - 1.5) * 360
            y = 520
            a = K.stagger(progress, i, step=0.1, speed=5) if not ans else 1.0
            if a <= 0:
                continue
            yy = int((1 - a) * 30)
            hit = ans and i == 2
            draw.ellipse((x - 135, y - 135 + yy, x + 135, y + 135 + yy),
                         fill=TRUE_SOFT if hit else (coral_soft if not ans else (246, 240, 232)),
                         outline=TRUE_COL if hit else None, width=8 if hit else 1)
            if i == 0:
                apple(draw, x, y + yy, 72)
            elif i == 1:
                strawberry(draw, x, y + yy, 72)
            elif i == 2:
                banana(draw, x, y + yy, 82)
            else:
                cherries(draw, x, y + yy + 20, 72)
            K.text_at(draw, name, x, 680, font(40, bold=True), ink)
            if ans:
                if hit:
                    K.draw_check(draw, x + 110, y - 110, 32, TRUE_COL)
                    K.pill(draw, x, 750, "yellow!", K.GOLD, size=34)
                else:
                    K.pill(draw, x, 750, "red", APPLE, size=30)
        if not ans:
            K.draw_stopwatch(draw, 1720, 290, 44, progress, brand)
        return True

    # ---- numbers ending in 5 --------------------------------------------------------------------
    if visual == "c6-five":
        if focus == "ask":
            say_card(cx, 226, "Every number that ends in 5 is odd.", size=46)
            for i, n in enumerate(("5", "15", "25")):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 330
                y = 400 + int((1 - a) * 30)
                K.shadow_card(draw, (x - 120, y, x + 120, y + 200), brand, radius=30)
                K.text_at(draw, n[:-1], x - 22 if n[:-1] else x, y + 46, font(100, bold=True), ink)
                K.text_at(draw, "5", x + (30 if n[:-1] else 0), y + 46, font(100, bold=True), coral)
            question_marks([(cx - 700, 440), (cx + 700, 460)], size=90)
            K.draw_stopwatch(draw, cx, 740, 54, progress, brand)
            return True
        if focus == "pairs":
            rows = [(5, "2 pairs + 1"), (15, "7 pairs + 1"), (25, "12 pairs + 1")]
            for i, (n, lab) in enumerate(rows):
                a = K.stagger(progress, i, step=0.22, speed=3)
                if a <= 0:
                    continue
                yc = 350 + i * 190
                K.text_at(draw, str(n), 300, yc - 40, font(70, bold=True), ink)
                cols = n // 2 + 1
                end = pair_rows(n, 420, yc, n_shown=cols * a + 0.01)
                if a >= 1:
                    draw.text((1080, yc - 24), lab, font=font(42, bold=True), fill=coral)
            stamp_in(1640, 540, "true", delay=0.78)
            return True
        K.text_at(draw, "25  =  10  +  10  +  5", cx, 240 + lift, font(64, bold=True), ink)
        groups = [(10, "10", "5 pairs"), (10, "10", "5 pairs"), (5, "5", "2 pairs + 1")]
        for i, (n, lab, sub) in enumerate(groups):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            gx = cx + (i - 1) * 480
            cols = n // 2 + n % 2
            wd = (cols - 1) * 48 + (20 if n % 2 else 0)
            draw.rounded_rectangle((gx - 190, 380, gx + 190, 700), radius=30,
                                   fill=coral_soft if i == 2 else sage_soft)
            pair_rows(n, gx - wd / 2, 500, n_shown=cols * a + 0.01)
            K.text_at(draw, lab, gx, 580, font(48, bold=True), ink)
            K.text_at(draw, sub, gx, 640, font(32, bold=True), coral if i == 2 else sage)
            if i < 2:
                K.text_at(draw, "+", gx + 240, 500, font(60, bold=True), muted)
        a = K.stagger(progress, 4, step=0.15, speed=4)
        if a > 0:
            K.pill(draw, cx, 760 + int((1 - a) * 20), "Always one left alone → ODD", coral, size=40)
        return True

    # ---- computers check conditions ------------------------------------------------------------
    if visual == "c6-code":
        def screen(box, score, state=None):
            x0, y0, x1, y1 = box
            draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=34, fill=K.SHADOW)
            draw.rounded_rectangle(box, radius=34, fill=K.DEV_DARK)
            draw.rounded_rectangle((x0 + 22, y0 + 22, x1 - 22, y1 - 22), radius=22, fill=SCREEN)
            mx = (x0 + x1) / 2
            K.text_at(draw, "SCORE", mx, y0 + 50, font(36, bold=True), (170, 190, 230))
            K.text_at(draw, str(score), mx, y0 + 96, font(110, bold=True), K.GOLD)
            for k in range(3):
                K.draw_star(draw, mx - 80 + k * 80, y0 + 270, 22, K.GOLD if k < (3 if score > 10 else 1) else (70, 80, 110))
            if state == "win":
                trophy(draw, mx, y1 - 150, 0.8)
                K.text_at(draw, "YOU WIN!", mx, y1 - 74, font(40, bold=True), K.LED_ON)
            elif state == "again":
                draw.arc((mx - 50, y1 - 210, mx + 50, y1 - 110), 30, 330, fill=(170, 190, 230), width=10)
                draw.polygon([(mx + 44, y1 - 200), (mx + 64, y1 - 160), (mx + 24, y1 - 164)], fill=(170, 190, 230))
                K.text_at(draw, "PLAY AGAIN", mx, y1 - 74, font(40, bold=True), (170, 190, 230))

        if focus == "intro":
            screen((260, 270, 900, 820), 12)
            K.draw_robot(draw, 1380, 600, 0.75, t, mood="idle")
            for k, kind in enumerate(("true", "false")):
                a = K.stagger(progress, k + 1, step=0.2, speed=4)
                if a > 0:
                    tf_card(draw, 1160 + k * 440, 330 + int((1 - a) * 30), 0.7, kind, stick=False)
            K.text_at(draw, "?", 1380, 250, font(int(70 + 12 * pulse), bold=True), K.GOLD)
            return True
        if focus == "ask":
            screen((240, 260, 860, 820), 12)
            K.shadow_card(draw, (980, 280, 1760, 560), brand, radius=34, accent=K.ROAD)
            K.text_at(draw, "GAME RULE", 1370, 320, font(32, bold=True), K.ROAD)
            K.text_at(draw, "If score is more than 10", 1370, 396, font(44, bold=True), ink)
            K.text_at(draw, "→ you win!", 1370, 466, font(44, bold=True), TRUE_COL)
            K.text_at(draw, "12 more than 10?", 1300, 640, font(50, bold=True), coral)
            K.draw_stopwatch(draw, 1300, 780, 44, progress, brand)
            return True
        if focus == "answer":
            screen((200, 260, 820, 820), 12, "win")
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                screen((1100, 260, 1720, 820), 7, "again")
            K.pill(draw, 960, 400, "12 → TRUE", TRUE_COL, size=34)
            if a > 0:
                K.pill(draw, 960, 560, "7 → FALSE", FALSE_COL, size=34)
            return True
        dx, dy = cx, 440
        dia = [(dx, dy - 140), (dx + 300, dy), (dx, dy + 140), (dx - 300, dy)]
        draw.polygon([(x + 10, y + 12) for x, y in dia], fill=K.SHADOW)
        draw.polygon(dia, fill=lav_soft, outline=K.BOTH_COLOR, width=6)
        K.text_at(draw, "Score more", dx, dy - 56, font(42, bold=True), ink)
        K.text_at(draw, "than 10?", dx, dy - 4, font(42, bold=True), ink)
        K.pill(draw, 0, 290, "CONDITION", K.BOTH_COLOR, size=36, left=260)
        K.draw_arrow(draw, 520, 350, dx - 300 + 30, dy - 20, K.BOTH_COLOR, width=8, head=24)
        for k, (lab, col, bx, res) in enumerate((("TRUE", TRUE_COL, 520, "You win!"),
                                                 ("FALSE", FALSE_COL, 1400, "Play again"))):
            a = K.stagger(progress, k + 1, step=0.2, speed=4)
            if a <= 0:
                continue
            sx = dx - 300 if k == 0 else dx + 300
            K.draw_arrow(draw, sx, dy, sx + (bx - sx) * a, dy + 220 * a, col, width=10, head=30)
            K.pill(draw, (sx + bx) / 2 + (-70 if k == 0 else 70), dy + 50, lab, col, size=30)
            if a >= 1:
                draw.rounded_rectangle((bx - 170, 700, bx + 170, 820), radius=30, fill=TRUE_SOFT if k == 0 else FALSE_SOFT,
                                       outline=col, width=5)
                K.text_at(draw, res, bx, 736, font(44, bold=True), col)
        return True

    # ---- checkpoint ----------------------------------------------------------------------------------
    if visual == "c6-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Logic detective time!", cx, 470 + lift, font(64, bold=True), ink)
            tf_card(draw, cx - 150, 630 + lift, 0.55, "true", stick=False)
            tf_card(draw, cx + 150, 630 + lift, 0.55, "false", stick=False)
            return True
        ans = focus == "answer"
        say_card(cx, 226, "Every even number ends with 0, 2, 4, 6 or 8.", size=42)
        nums = ["14", "20", "36"]
        for i, n in enumerate(nums):
            a = K.stagger(progress, i, step=0.12, speed=5)
            if a <= 0:
                continue
            x = 330 + i * 300
            y = 380 + int((1 - a) * 30)
            K.shadow_card(draw, (x - 120, y, x + 120, y + 170), brand, radius=28,
                          outline=TRUE_COL if ans else None, outline_w=5 if ans else 3)
            f = font(96, bold=True)
            K.text_at(draw, n[0], x - 30, y + 30, f, ink)
            K.text_at(draw, n[1], x + 30, y + 30, f, TRUE_COL if ans else ink)
            if ans:
                K.draw_check(draw, x + 100, y + 10, 24, TRUE_COL)
            else:
                K.text_at(draw, "?", x + 96, y - 20, font(56, bold=True), K.GOLD)
        if ans:
            for d in range(10):
                x = 260 + d * 105
                even = d % 2 == 0
                draw.ellipse((x - 42, 640 - 42, x + 42, 640 + 42), fill=TRUE_COL if even else (226, 222, 216))
                K.text_at(draw, str(d), x, 640 - 30, font(50, bold=True), (255, 255, 255) if even else muted)
            K.text_at(draw, "Even numbers end in 0, 2, 4, 6, 8", 733, 710, font(38, bold=True), ink)
            stamp_in(1560, 470, "true", delay=0.1)
            star_spots([(1420, 680), (1720, 650)])
        else:
            K.draw_magnifier(draw, 1450, 500, 1.0, coral)
            K.text_at(draw, "Can you find a", 1460, 670, font(40, bold=True), ink)
            K.text_at(draw, "counter-example?", 1460, 720, font(40, bold=True), coral)
            K.draw_stopwatch(draw, 730, 720, 50, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------------------------
    if visual == "c6-recap":
        recap = [("A statement is true or false", TRUE_COL, "tf"), ("No maybe in this game", FALSE_COL, "maybe"),
                 ("One counter-example breaks “all”", K.ROAD, "penguin"), ("Code uses true or false", K.BOTH_COLOR, "code")]
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
                if kind == "tf":
                    tf_card(draw, ix - 80, iy - 40, 0.55, "true", stick=False)
                    tf_card(draw, ix + 80, iy + 50, 0.55, "false", stick=False)
                elif kind == "maybe":
                    draw.rounded_rectangle((ix - 120, iy - 60, ix + 120, iy + 60), radius=22, fill=(226, 222, 216))
                    K.text_at(draw, "MAYBE", ix, iy - 26, font(46, bold=True), (120, 124, 132))
                    draw.line((ix - 140, iy + 50, ix + 140, iy - 44), fill=FALSE_COL, width=10)
                    K.draw_cross(draw, ix + 120, iy - 60, 28, FALSE_COL)
                elif kind == "penguin":
                    penguin(draw, ix - 30, iy + 10, 0.55, t)
                    K.draw_cross(draw, ix + 100, iy - 70, 28, FALSE_COL)
                else:
                    dia = [(ix, iy - 80), (ix + 130, iy), (ix, iy + 80), (ix - 130, iy)]
                    draw.polygon(dia, fill=lav_soft, outline=K.BOTH_COLOR, width=5)
                    K.text_at(draw, "IF", ix, iy - 26, font(46, bold=True), K.BOTH_COLOR)
                    K.draw_check(draw, ix - 140, iy + 110, 24, TRUE_COL)
                    K.draw_cross(draw, ix + 140, iy + 110, 24, FALSE_COL)
                f = font(36, bold=True)
                lines = K.wrap_text(lab, f, 340)
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 46, f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kabir(draw, cx + 300, 410, 1.2, t)
            K.text_at(draw, "Chapter 1 done!", cx, 660, font(68, bold=True), ink)
            K.pill(draw, cx, 760, "Logic detective!", coral, size=36)
            star_spots([(cx - 620, 320), (cx + 620, 320), (cx - 700, 560), (cx + 700, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 360, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 470, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 640, cx + 120 + 20 * pulse, 640, sage, width=16, head=46)
        kabir(draw, 400, 560, 1.1, t)
        K.draw_mascot(draw, int(w - 400), 640, 90, sage, panel, bounce)
        return True

    return False
