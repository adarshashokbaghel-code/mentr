"""B4 · AI Can Be Wrong Too — visuals."""
import math

import build as K

TARA = (132, 104, 222)
TARA_DARK = (98, 74, 182)
TARA_LIGHT = (204, 192, 246)
GLOW = (96, 226, 236)
WAVE = (40, 170, 196)
CHEEK = (255, 140, 170)
FUR = (204, 146, 82)
FUR_DARK = (140, 92, 50)
MUZZLE = (242, 214, 170)
PUP = (206, 150, 88)
PUP_DARK = (180, 124, 66)
MUFFIN_TOP = (198, 142, 80)
MUFFIN_HI = (222, 172, 108)
MUFFIN_CUP = (250, 228, 198)
MUFFIN_LINE = (222, 186, 144)
RAISIN = (60, 36, 30)
CAT = (240, 168, 88)
CAT_DARK = (206, 128, 56)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
SHARK = (255, 204, 80)
SHARK_DARK = (232, 160, 40)
BABYCAR = (255, 150, 186)
GRASS = (132, 196, 110)
GRASS_DARK = (104, 170, 88)
MAP_BG = (232, 241, 226)
ROUTE = (52, 120, 230)
ASPHALT = (96, 104, 118)
MANE = (240, 150, 50)
MANE_DARK = (214, 112, 30)
PILL_AMBER = (214, 120, 50)
BERRY = (150, 40, 90)
WHITE = (255, 255, 255)


def S_(s):
    return lambda v: v * s


# ---- characters ---------------------------------------------------------------------

def tara(draw, cx, cy, s, t, mood="happy", ring=False, talk=False):
    """Tara the voice helper (a smart speaker). cy = body centre; top ≈ cy-148s, shadow ≈ cy+180s."""
    S = S_(s)
    y = cy + S(5) * math.sin(t * math.pi * 4)
    draw.ellipse((cx - S(128), cy + S(150), cx + S(128), cy + S(180)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110) + S(8), y - S(122) + S(10), cx + S(110) + S(8), y + S(160) + S(10)),
                           radius=S(80), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), y - S(122), cx + S(110), y + S(160)), radius=S(80), fill=TARA)
    for r in range(3):
        for c in range(7 - r % 2):
            dx = cx - S(72) + c * S(24) + (S(12) if r % 2 else 0)
            dy = y + S(56) + r * S(26)
            draw.ellipse((dx - S(5), dy - S(5), dx + S(5), dy + S(5)), fill=TARA_DARK)
    draw.ellipse((cx - S(88), y - S(148), cx + S(88), y - S(100)), fill=TARA_DARK)
    rc = GLOW if (ring and int(t * 8) % 2 == 0) else (150, 236, 244) if ring else TARA_LIGHT
    draw.ellipse((cx - S(72), y - S(140), cx + S(72), y - S(108)), outline=rc, width=max(2, int(S(8))))
    draw.rounded_rectangle((cx - S(80), y - S(84), cx + S(80), y + S(24)), radius=S(32), fill=K.DEV_DEEP)
    ey = y - S(46)
    ew = max(2, int(S(8)))
    for i, sx in enumerate((-1, 1)):
        ex = cx + sx * S(34)
        if mood == "happy":
            draw.arc((ex - S(16), ey - S(8), ex + S(16), ey + S(22)), 200, 340, fill=GLOW, width=ew)
        elif mood == "think":
            draw.ellipse((ex + S(6) - S(11), ey - S(8) - S(11), ex + S(6) + S(11), ey - S(8) + S(11)), fill=GLOW)
        elif mood == "oops":
            d = 1 if i == 0 else -1
            draw.line([(ex - d * S(12), ey - S(12)), (ex + d * S(10), ey), (ex - d * S(12), ey + S(12))], fill=GLOW,
                      width=ew)
        elif mood == "idle" and (t * 2.3) % 1 > 0.92:
            draw.line((ex - S(14), ey, ex + S(14), ey), fill=GLOW, width=ew)
        else:
            draw.ellipse((ex - S(13), ey - S(13), ex + S(13), ey + S(13)), fill=GLOW)
    my = y - S(6)
    if mood == "think":
        draw.ellipse((cx - S(2), my - S(14), cx + S(18), my + S(4)), outline=GLOW, width=max(2, int(S(5))))
    elif mood == "oops":
        pts = [(cx - S(26) + k * S(13), my - S(6) + (S(6) if k % 2 else -S(6))) for k in range(5)]
        draw.line(pts, fill=GLOW, width=ew)
        dx, dy = cx + S(118), y - S(96)
        draw.polygon([(dx, dy - S(26)), (dx - S(13), dy), (dx + S(13), dy)], fill=K.WATER)
        draw.ellipse((dx - S(13), dy - S(10), dx + S(13), dy + S(16)), fill=K.WATER)
    else:
        draw.arc((cx - S(26), my - S(24), cx + S(26), my + S(8)), 20, 160, fill=GLOW, width=ew)
        for sx in (-1, 1):
            hx = cx + sx * S(60)
            draw.ellipse((hx - S(9), my - S(14), hx + S(9), my - S(2)), fill=CHEEK)
    if talk:
        K.sound_waves(draw, cx + S(118), y - S(30), s, WAVE, t, "right")


def anaya(draw, cx, cy, s, t):
    """Anaya: draw_person kid + pigtails. cy = head centre."""
    S = S_(s)
    yy = cy + S(6) * math.sin(t * math.pi * 4)
    r = S(64)
    for sx in (-1, 1):
        px = cx + sx * r * 1.02
        draw.ellipse((px - r * 0.3, yy - r * 0.2, px + r * 0.3, yy + r * 0.75), fill=K.HAIR)
        draw.ellipse((px - r * 0.17, yy - r * 0.3, px + r * 0.17, yy - r * 0.02), fill=K.CORAL)
    K.draw_person(draw, cx, cy, s, "kid", t)


def crown(draw, cx, by, s):
    S = S_(s)
    pts = [(cx - S(60), by), (cx - S(66), by - S(56)), (cx - S(32), by - S(28)), (cx, by - S(70)), (cx + S(32), by - S(28)),
           (cx + S(66), by - S(56)), (cx + S(60), by)]
    draw.polygon(pts, fill=K.GOLD)
    for x, y, c in ((cx - S(66), by - S(56), K.DANGER), (cx, by - S(70), K.ROAD), (cx + S(66), by - S(56), K.DANGER)):
        draw.ellipse((x - S(9), y - S(9), x + S(9), y + S(9)), fill=c)


# ---- things ---------------------------------------------------------------------------

def phone(draw, cx, cy, s, screen=(246, 248, 250)):
    S = S_(s)
    W, H = S(150), S(290)
    draw.rounded_rectangle((cx - W + S(10), cy - H + S(12), cx + W + S(10), cy + H + S(12)), radius=S(40), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(40), fill=K.DEV_DARK)
    box = (cx - W + S(14), cy - H + S(46), cx + W - S(14), cy + H - S(40))
    draw.rectangle(box, fill=screen)
    draw.rounded_rectangle((cx - S(34), cy - H + S(18), cx + S(34), cy - H + S(30)), radius=S(6), fill=K.DEV_DEEP)
    draw.rounded_rectangle((cx - S(46), cy + H - S(24), cx + S(46), cy + H - S(16)), radius=S(4), fill=K.DEV_MID)
    return box


def shelf(draw, x0, x1, y):
    for bx in (x0 + 50, x1 - 70):
        draw.polygon([(bx, y + 24), (bx + 20, y + 24), (bx + 20, y + 80)], fill=WOOD_DARK)
    draw.rounded_rectangle((x0 + 6, y + 8, x1 + 6, y + 32), radius=8, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y, x1, y + 24), radius=8, fill=WOOD)


def dog_face(draw, cx, cy, r, fur=FUR, ear=FUR_DARK, tongue=True, muzzle=MUZZLE):
    draw.ellipse((cx - r * 1.18, cy - r * 0.6, cx - r * 0.56, cy + r * 0.78), fill=ear)
    draw.ellipse((cx + r * 0.56, cy - r * 0.6, cx + r * 1.18, cy + r * 0.78), fill=ear)
    draw.ellipse((cx - r, cy - r * 0.92, cx + r, cy + r * 0.95), fill=fur)
    draw.ellipse((cx - r * 0.52, cy + r * 0.06, cx + r * 0.52, cy + r * 0.8), fill=muzzle)
    if tongue:
        draw.chord((cx - r * 0.16, cy + r * 0.42, cx + r * 0.16, cy + r * 0.86), 0, 180, fill=(236, 110, 130))
    draw.ellipse((cx - r * 0.2, cy + r * 0.1, cx + r * 0.2, cy + r * 0.38), fill=RAISIN)
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.38, cy - r * 0.2
        draw.ellipse((ex - r * 0.14, ey - r * 0.14, ex + r * 0.14, ey + r * 0.14), fill=RAISIN)
        draw.ellipse((ex - r * 0.06, ey - r * 0.09, ex, ey - r * 0.03), fill=WHITE)


def puppy(draw, cx, cy, r):
    """Round, muffin-coloured puppy face."""
    dog_face(draw, cx, cy, r, fur=PUP, ear=PUP_DARK, tongue=False, muzzle=MUFFIN_HI)


def muffin(draw, cx, cy, r):
    draw.polygon([(cx - r * 0.82, cy + r * 0.14), (cx + r * 0.82, cy + r * 0.14), (cx + r * 0.62, cy + r * 1.0),
                  (cx - r * 0.62, cy + r * 1.0)], fill=MUFFIN_CUP)
    for k in range(-3, 4):
        x0 = cx + k * r * 0.22
        draw.line((x0, cy + r * 0.18, x0 * 0.76 + cx * 0.24, cy + r * 0.96), fill=MUFFIN_LINE, width=max(2, int(r * 0.04)))
    draw.ellipse((cx - r, cy - r * 0.86, cx + r, cy + r * 0.44), fill=MUFFIN_TOP)
    draw.ellipse((cx - r * 0.7, cy - r * 0.76, cx + r * 0.1, cy - r * 0.4), fill=MUFFIN_HI)
    for (fx, fy, fr) in ((-0.38, -0.2, 0.14), (0.38, -0.2, 0.14), (0.0, 0.2, 0.17), (-0.7, 0.1, 0.08), (0.68, 0.08, 0.08),
                         (0.1, -0.6, 0.07)):
        draw.ellipse((cx + r * (fx - fr), cy + r * (fy - fr), cx + r * (fx + fr), cy + r * (fy + fr)), fill=RAISIN)


def cat_face(draw, cx, cy, r, col=CAT, dark=CAT_DARK, ink=K.DEV_DEEP):
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.88, cy - r * 0.2), (cx + sx * r * 0.78, cy - r * 1.12), (cx + sx * r * 0.22, cy - r * 0.72)],
                     fill=dark)
        draw.polygon([(cx + sx * r * 0.74, cy - r * 0.4), (cx + sx * r * 0.7, cy - r * 0.9), (cx + sx * r * 0.38, cy - r * 0.66)],
                     fill=(255, 190, 200))
    draw.ellipse((cx - r, cy - r * 0.86, cx + r, cy + r * 0.9), fill=col)
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.38, cy - r * 0.12
        draw.ellipse((ex - r * 0.17, ey - r * 0.2, ex + r * 0.17, ey + r * 0.2), fill=(140, 200, 110))
        draw.ellipse((ex - r * 0.05, ey - r * 0.18, ex + r * 0.05, ey + r * 0.18), fill=ink)
        for k in (-1, 1):
            draw.line((cx + sx * r * 0.3, cy + r * 0.3 + k * r * 0.08, cx + sx * r * 0.95, cy + r * 0.22 + k * r * 0.2),
                      fill=ink, width=max(1, int(r * 0.03)))
    draw.polygon([(cx - r * 0.12, cy + r * 0.16), (cx + r * 0.12, cy + r * 0.16), (cx, cy + r * 0.3)], fill=(240, 120, 140))
    draw.arc((cx - r * 0.2, cy + r * 0.24, cx, cy + r * 0.46), 0, 160, fill=ink, width=max(1, int(r * 0.04)))
    draw.arc((cx, cy + r * 0.24, cx + r * 0.2, cy + r * 0.46), 20, 180, fill=ink, width=max(1, int(r * 0.04)))


def blur_wash(draw, box, col=(248, 246, 242), step=5):
    x0, y0, x1, y1 = box
    y = y0
    while y < y1:
        draw.line((x0, y, x1, y), fill=col, width=2)
        y += step


def photo(draw, box, kind, panel=WHITE, line=(232, 226, 216), outline=None, ow=3):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 6, y0 + 8, x1 + 6, y1 + 8), radius=14, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=14, fill=panel, outline=outline or line, width=ow)
    ix0, iy0, ix1, iy1 = x0 + 10, y0 + 10, x1 - 10, y1 - 10
    m = min(ix1 - ix0, iy1 - iy0)
    mx, my = (ix0 + ix1) / 2, (iy0 + iy1) / 2
    if kind == "cat":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(226, 238, 250))
        cat_face(draw, mx, my + m * 0.08, m * 0.32)
    elif kind == "cat2":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(236, 246, 232))
        cat_face(draw, mx, my + m * 0.08, m * 0.32, (120, 120, 130), (86, 86, 96))
    elif kind == "cat3":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(255, 238, 226))
        cat_face(draw, mx, my + m * 0.08, m * 0.32, (250, 246, 240), (214, 206, 196))
    elif kind == "blurcat":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(226, 230, 236))
        cat_face(draw, mx + m * 0.08, my + m * 0.12, m * 0.32, (246, 214, 180), (240, 200, 160), (190, 180, 176))
        cat_face(draw, mx, my + m * 0.08, m * 0.32, (238, 196, 150), (226, 172, 120), (150, 140, 136))
        blur_wash(draw, (ix0, iy0, ix1, iy1), (232, 234, 238), 6)
    elif kind == "dog":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(255, 238, 224))
        dog_face(draw, mx, my + m * 0.06, m * 0.3)
    elif kind == "puppy":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(250, 240, 228))
        puppy(draw, mx, my + m * 0.04, m * 0.34)
    elif kind == "muffin":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(250, 240, 228))
        muffin(draw, mx, my - m * 0.08, m * 0.36)
    elif kind == "lion":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(255, 244, 214))
        lion_dog(draw, mx, my + m * 0.04, m * 0.26)
    elif kind == "mushroom":
        draw.rectangle((ix0, iy0, ix1, iy1), fill=(226, 240, 220))
        draw.rectangle((ix0, iy1 - m * 0.22, ix1, iy1), fill=GRASS)
        mushroom(draw, mx, iy1 - m * 0.18, m / 340)


def lion_dog(draw, cx, cy, r):
    for k in range(14):
        a = k * 2 * math.pi / 14
        px, py = cx + math.cos(a) * r * 1.05, cy + math.sin(a) * r * 1.05
        draw.ellipse((px - r * 0.42, py - r * 0.42, px + r * 0.42, py + r * 0.42), fill=MANE if k % 2 else MANE_DARK)
    dog_face(draw, cx, cy, r * 0.82)


def ai_chip(draw, cx, cy, s, col=TARA):
    S = S_(s)
    for k in range(4):
        o = -S(54) + k * S(36)
        for (x0, y0, x1, y1) in ((cx + o - S(7), cy - S(104), cx + o + S(7), cy - S(80)),
                                 (cx + o - S(7), cy + S(80), cx + o + S(7), cy + S(104)),
                                 (cx - S(104), cy + o - S(7), cx - S(80), cy + o + S(7)),
                                 (cx + S(80), cy + o - S(7), cx + S(104), cy + o + S(7))):
            draw.rounded_rectangle((x0, y0, x1, y1), radius=S(4), fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(86) + S(8), cy - S(86) + S(10), cx + S(86) + S(8), cy + S(86) + S(10)), radius=S(24),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(86), cy - S(86), cx + S(86), cy + S(86)), radius=S(24), fill=col)
    draw.rounded_rectangle((cx - S(64), cy - S(64), cx + S(64), cy + S(64)), radius=S(16), outline=TARA_LIGHT,
                           width=max(2, int(S(5))))
    K.text_at(draw, "AI", cx, cy - S(44), K.load_font(max(26, int(S(76))), bold=True), WHITE)


def shark(draw, cx, cy, s, t=0.0):
    S = S_(s)
    sw = S(8) * math.sin(t * 10)
    draw.polygon([(cx - S(120), cy), (cx - S(190), cy - S(56) + sw), (cx - S(170), cy + S(4)), (cx - S(190), cy + S(56) + sw)],
                 fill=SHARK_DARK)
    draw.polygon([(cx - S(20), cy - S(46)), (cx + S(20), cy - S(118)), (cx + S(50), cy - S(44))], fill=SHARK_DARK)
    draw.ellipse((cx - S(140), cy - S(60), cx + S(130), cy + S(60)), fill=SHARK)
    draw.chord((cx - S(110), cy - S(30), cx + S(126), cy + S(58)), 0, 180, fill=(255, 244, 214))
    draw.polygon([(cx - S(10), cy + S(30)), (cx + S(40), cy + S(30)), (cx - S(20), cy + S(80))], fill=SHARK_DARK)
    draw.ellipse((cx + S(62), cy - S(26), cx + S(84), cy - S(4)), fill=K.DEV_DEEP)
    draw.ellipse((cx + S(68), cy - S(22), cx + S(74), cy - S(16)), fill=WHITE)
    draw.arc((cx + S(60), cy - S(6), cx + S(116), cy + S(30)), 20, 140, fill=K.DEV_DEEP, width=max(2, int(S(5))))
    draw.ellipse((cx + S(40), cy + S(2), cx + S(58), cy + S(14)), fill=CHEEK)


def baby_car(draw, cx, cy, s, t=0.0):
    S = S_(s)
    jig = S(4) * math.sin(t * 20)
    draw.ellipse((cx - S(130), cy + S(64), cx + S(130), cy + S(90)), fill=K.SHADOW)
    draw.chord((cx - S(90), cy - S(110) + jig, cx + S(90), cy + S(40) + jig), 180, 360, fill=BABYCAR)
    draw.chord((cx - S(70), cy - S(92) + jig, cx + S(70), cy + S(10) + jig), 180, 360, fill=(214, 236, 250))
    for sx in (-1, 1):
        ex = cx + sx * S(26)
        draw.ellipse((ex - S(14), cy - S(66) + jig, ex + S(14), cy - S(38) + jig), fill=WHITE)
        draw.ellipse((ex - S(7), cy - S(58) + jig, ex + S(7), cy - S(44) + jig), fill=K.DEV_DEEP)
    draw.rounded_rectangle((cx - S(130), cy - S(40) + jig, cx + S(130), cy + S(40) + jig), radius=S(30), fill=BABYCAR)
    draw.ellipse((cx + S(124), cy - S(14) + jig, cx + S(150), cy + S(12) + jig), fill=(130, 200, 236))
    draw.rounded_rectangle((cx + S(114), cy - S(8) + jig, cx + S(128), cy + S(6) + jig), radius=S(4), fill=(100, 170, 210))
    draw.ellipse((cx - S(14), cy - S(122) + jig, cx + S(14), cy - S(98) + jig), fill=K.GOLD)
    for wx in (cx - S(76), cx + S(76)):
        draw.ellipse((wx - S(30), cy + S(14), wx + S(30), cy + S(74)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(12), cy + S(32), wx + S(12), cy + S(56)), fill=K.STEEL)


def barrier(draw, cx, by, s):
    S = S_(s)
    for lx in (cx - S(130), cx + S(110)):
        draw.rectangle((lx, by - S(120), lx + S(20), by), fill=K.DEV_MID)
    x0, y0, x1, y1 = cx - S(170), by - S(130), cx + S(170), by - S(80)
    draw.rectangle((x0 + S(6), y0 + S(8), x1 + S(6), y1 + S(8)), fill=K.SHADOW)
    draw.rectangle((x0, y0, x1, y1), fill=WHITE)
    k = 0
    x = x0 - S(50)
    while x < x1:
        a, b = x, x + S(30)
        poly = [(a, y1), (a + S(50), y0), (b + S(50), y0), (b, y1)]
        poly = [(min(max(px, x0), x1), py) for px, py in poly]
        if k % 2 == 0:
            draw.polygon(poly, fill=K.DANGER)
        x += S(30)
        k += 1
    draw.rectangle((x0, y0, x1, y1), outline=K.DEV_DARK, width=max(2, int(S(4))))


def cone(draw, cx, by, s):
    S = S_(s)
    draw.rectangle((cx - S(44), by - S(14), cx + S(44), by), fill=(232, 110, 40))
    draw.polygon([(cx - S(32), by - S(14)), (cx - S(8), by - S(120)), (cx + S(8), by - S(120)), (cx + S(32), by - S(14))],
                 fill=(255, 130, 50))
    draw.polygon([(cx - S(24), by - S(44)), (cx - S(18), by - S(72)), (cx + S(18), by - S(72)), (cx + S(24), by - S(44))],
                 fill=WHITE)


def medicine(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(54) + S(6), cy - S(70) + S(8), cx + S(54) + S(6), cy + S(90) + S(8)), radius=S(16),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(54), cy - S(70), cx + S(54), cy + S(90)), radius=S(16), fill=PILL_AMBER)
    draw.rounded_rectangle((cx - S(60), cy - S(110), cx + S(60), cy - S(68)), radius=S(10), fill=WHITE,
                           outline=K.STEEL_DARK, width=max(1, int(S(3))))
    draw.rounded_rectangle((cx - S(42), cy - S(30), cx + S(42), cy + S(54)), radius=S(8), fill=WHITE)
    draw.rectangle((cx - S(8), cy - S(18), cx + S(8), cy + S(42)), fill=K.DANGER)
    draw.rectangle((cx - S(26), cy + S(4), cx + S(26), cy + S(20)), fill=K.DANGER)
    for k, (px, py) in enumerate(((cx + S(96), cy + S(60)), (cx + S(126), cy + S(84)))):
        draw.rounded_rectangle((px - S(24), py - S(11), px + S(24), py + S(11)), radius=S(11), fill=WHITE,
                               outline=K.STEEL_DARK, width=max(1, int(S(2))))
        draw.rounded_rectangle((px - S(24), py - S(11), px, py + S(11)), radius=S(11), fill=[K.CORAL, K.ROAD][k])


def palette(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(110), cy - S(80), cx + S(110), cy + S(80)), fill=(240, 214, 170))
    draw.ellipse((cx + S(30), cy + S(20), cx + S(70), cy + S(60)), fill=(255, 248, 239))
    for k, c in enumerate((K.DANGER, K.GOLD, K.ROAD, (13, 148, 136), K.BOTH_COLOR)):
        a = math.radians(200 + k * 36)
        px, py = cx + math.cos(a) * S(66), cy + math.sin(a) * S(46)
        draw.ellipse((px - S(18), py - S(18), px + S(18), py + S(18)), fill=c)


def cat_ear_face(draw, cx, cy, r):
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.9, cy - r * 0.5), (cx + sx * r * 0.78, cy - r * 1.5), (cx + sx * r * 0.2, cy - r * 0.96)],
                     fill=K.DEV_DARK)
        draw.polygon([(cx + sx * r * 0.76, cy - r * 0.7), (cx + sx * r * 0.72, cy - r * 1.24), (cx + sx * r * 0.38, cy - r * 0.96)],
                     fill=(255, 190, 200))
    K.draw_face(draw, cx, cy, r, "kid", 1.0)
    for sx in (-1, 1):
        for k in (-1, 1):
            draw.line((cx + sx * r * 0.2, cy + r * 0.22 + k * r * 0.06, cx + sx * r * 0.8, cy + r * 0.16 + k * r * 0.16),
                      fill=K.DEV_DARK, width=max(2, int(r * 0.04)))


def hand(draw, cx, cy, s, col=K.SKIN):
    S = S_(s)
    for k in range(4):
        fx = cx - S(42) + k * S(28)
        draw.rounded_rectangle((fx - S(12), cy - S(96) + abs(k - 1.5) * S(10), fx + S(12), cy), radius=S(12), fill=col)
    draw.rounded_rectangle((cx - S(56), cy - S(30), cx + S(50), cy + S(60)), radius=S(30), fill=col)
    draw.line((cx - S(46), cy + S(10), cx - S(86), cy - S(36)), fill=col, width=max(3, int(S(24))))


def mushroom(draw, cx, by, s):
    S = S_(s)
    draw.ellipse((cx - S(70), by - S(10), cx + S(70), by + S(12)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(26), by - S(110), cx + S(26), by), radius=S(14), fill=(250, 244, 230))
    draw.chord((cx - S(100), by - S(190), cx + S(100), by - S(50)), 180, 360, fill=(252, 250, 244),
               outline=(214, 204, 186), width=max(2, int(S(4))))
    draw.line((cx - S(100), by - S(120), cx + S(100), by - S(120)), fill=(214, 204, 186), width=max(2, int(S(4))))
    for (dx, dy, r) in ((-50, -150, 12), (10, -168, 10), (54, -140, 13), (-12, -136, 8)):
        draw.ellipse((cx + S(dx - r), by + S(dy - r), cx + S(dx + r), by + S(dy + r)), fill=(226, 214, 190))


def tree(draw, cx, by, s):
    S = S_(s)
    draw.rectangle((cx - S(30), by - S(260), cx + S(30), by), fill=WOOD_DARK)
    for (dx, dy, r, c) in ((-90, -300, 110, K.LEAF), (80, -310, 120, (96, 176, 110)), (0, -400, 130, K.LEAF)):
        draw.ellipse((cx + S(dx - r), by + S(dy - r), cx + S(dx + r), by + S(dy + r)), fill=c)


def berry_plant(draw, cx, by, s):
    S = S_(s)
    draw.ellipse((cx - S(110), by - S(14), cx + S(110), by + S(14)), fill=K.SHADOW)
    for k, ang in enumerate((-60, -30, 0, 30, 60)):
        a = math.radians(ang - 90)
        tx, ty = cx + math.cos(a) * S(170), by + math.sin(a) * S(170)
        draw.line((cx, by, tx, ty), fill=K.LEAF, width=max(3, int(S(8))))
        lx, ly = cx + math.cos(a) * S(110), by + math.sin(a) * S(110)
        draw.ellipse((lx - S(40), ly - S(20), lx + S(40), ly + S(20)), fill=(96, 176, 110))
        for j in range(3):
            bx, by_ = tx + (j - 1) * S(16), ty + (j % 2) * S(14)
            draw.ellipse((bx - S(12), by_ - S(12), bx + S(12), by_ + S(12)), fill=BERRY)


def song_card(draw, box, kind, title, t, ok=None, panel=WHITE, line=(232, 226, 216)):
    x0, y0, x1, y1 = box
    out = (13, 148, 136) if ok is True else K.DANGER if ok is False else line
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=30, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=30, fill=panel, outline=out, width=6 if ok is not None else 3)
    ix0, iy0, ix1, iy1 = x0 + 20, y0 + 20, x1 - 20, y1 - 90
    draw.rounded_rectangle((ix0, iy0, ix1, iy1), radius=20, fill=(214, 236, 250) if kind == "shark" else (255, 236, 244))
    mx, my = (ix0 + ix1) / 2, (iy0 + iy1) / 2
    s = (iy1 - iy0) / 300
    if kind == "shark":
        for k in range(3):
            draw.arc((ix0 + 20 + k * 90, iy1 - 60, ix0 + 100 + k * 90, iy1 - 20), 200, 340, fill=WHITE, width=4)
        shark(draw, mx + 20 * s, my + 10 * s, s * 1.05, t)
    else:
        baby_car(draw, mx, my + 20 * s, s * 1.1, t)
    K.text_at(draw, title, (x0 + x1) / 2, y1 - 72, K.load_font(40, bold=True), K.DEV_DEEP)
    if ok is True:
        K.draw_check(draw, x1 - 30, y0 + 30, 30, (13, 148, 136))
    elif ok is False:
        K.draw_cross(draw, x1 - 30, y0 + 30, 30, K.DANGER)


def map_closed(draw, box, t, route=1.0, line=(232, 226, 216)):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0

    def P(fx, fy):
        return (x0 + bw * fx, y0 + bh * fy)

    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=30, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=30, fill=MAP_BG, outline=line, width=3)
    draw.ellipse((*P(0.55, 0.2), *P(0.85, 0.4)), fill=(196, 226, 180))
    rw = max(14, int(bw * 0.05))
    for fx in (0.2, 0.75):
        draw.line((*P(fx, 0.04), *P(fx, 0.96)), fill=WHITE, width=rw)
    for fy in (0.25, 0.6, 0.86):
        draw.line((*P(0.04, fy), *P(0.96, fy)), fill=WHITE, width=rw)
    pts = [P(0.2, 0.86), P(0.2, 0.6), P(0.75, 0.6), P(0.75, 0.25)]
    segs = [math.dist(pts[i], pts[i + 1]) for i in range(3)]
    target = sum(segs) * K.clamp01(route)
    acc = 0.0
    out = [pts[0]]
    for i, sl in enumerate(segs):
        if acc + sl >= target:
            r = (target - acc) / sl
            out.append((K.lerp(pts[i][0], pts[i + 1][0], r), K.lerp(pts[i][1], pts[i + 1][1], r)))
            break
        out.append(pts[i + 1])
        acc += sl
    draw.line(out, fill=ROUTE, width=int(rw * 0.7), joint="curve")
    bx, by = P(0.48, 0.6)
    draw.rounded_rectangle((bx - rw * 1.4, by - rw * 0.8, bx + rw * 1.4, by + rw * 0.8), radius=6, fill=WHITE,
                           outline=K.DANGER, width=4)
    for k in range(3):
        sx = bx - rw * 1.2 + k * rw * 0.9
        draw.polygon([(sx, by + rw * 0.7), (sx + rw * 0.4, by - rw * 0.7), (sx + rw * 0.8, by - rw * 0.7),
                      (sx + rw * 0.4, by + rw * 0.7)], fill=K.DANGER)
    hx, hy = pts[0]
    r = rw * 0.9
    draw.ellipse((hx - r, hy - r, hx + r, hy + r), fill=WHITE, outline=K.DEV_DARK, width=3)
    draw.ellipse((hx - r * 0.5, hy - r * 0.5, hx + r * 0.5, hy + r * 0.5), fill=ROUTE)
    gx, gy = pts[-1]
    K.draw_map_pin(draw, gx, gy, bw / 700, K.CORAL)
    return P


def family_car(draw, cx, cy, s, col):
    S = S_(s)
    draw.ellipse((cx - S(140), cy + S(52), cx + S(140), cy + S(84)), fill=K.SHADOW)
    draw.polygon([(cx - S(84), cy - S(26)), (cx - S(52), cy - S(88)), (cx + S(54), cy - S(88)), (cx + S(96), cy - S(26))],
                 fill=col)
    win = (210, 232, 246)
    draw.polygon([(cx - S(70), cy - S(30)), (cx - S(46), cy - S(76)), (cx - S(4), cy - S(76)), (cx - S(4), cy - S(30))],
                 fill=win)
    draw.polygon([(cx + S(8), cy - S(30)), (cx + S(8), cy - S(76)), (cx + S(48), cy - S(76)), (cx + S(80), cy - S(30))],
                 fill=win)
    K.draw_face(draw, cx - S(32), cy - S(46), S(17), "kid", 1.0)
    K.draw_face(draw, cx + S(38), cy - S(46), S(19), "kid", 1.0)
    draw.rounded_rectangle((cx - S(136), cy - S(32), cx + S(136), cy + S(42)), radius=S(24), fill=col)
    draw.rounded_rectangle((cx + S(108), cy - S(16), cx + S(134), cy + S(2)), radius=S(6), fill=K.GOLD)
    for wx in (cx - S(80), cx + S(80)):
        draw.ellipse((wx - S(32), cy + S(14), wx + S(32), cy + S(78)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(14), cy + S(32), wx + S(14), cy + S(60)), fill=K.STEEL)


def slate(draw, cx, cy, s, text):
    S = S_(s)
    draw.rounded_rectangle((cx - S(150) + S(6), cy - S(100) + S(8), cx + S(150) + S(6), cy + S(100) + S(8)), radius=S(14),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(150), cy - S(100), cx + S(150), cy + S(100)), radius=S(14), fill=WOOD)
    draw.rectangle((cx - S(130), cy - S(80), cx + S(130), cy + S(80)), fill=(52, 70, 64))
    K.text_at(draw, text, cx, cy - S(34), K.load_font(max(26, int(S(56))), bold=True), WHITE)


# ---- scenes ---------------------------------------------------------------------------

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

    def mark_pill(x, y, lab, col, ok, size=34):
        bx = K.pill(draw, x, y, lab, col, size=size)
        my = (bx[1] + bx[3]) / 2
        (K.draw_check if ok else K.draw_cross)(draw, bx[2] + size, my, size * 0.65, col)
        return bx

    def chip(x0, y, x1, lab, ok, size=40):
        col, soft = (sage, sage_soft) if ok else (K.DANGER, K.DANGER_SOFT)
        hh = int(size * 2.1)
        draw.rounded_rectangle((x0, y, x1, y + hh), radius=hh // 2, fill=soft, outline=col, width=3)
        draw.text((x0 + 40, y + (hh - size) / 2 - 2), lab, fill=ink, font=font(size, bold=True))
        (K.draw_check if ok else K.draw_cross)(draw, x1 - hh / 2, y + hh / 2, hh * 0.28, col)

    # ---- opening -------------------------------------------------------------------
    if visual == "b4-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            tara(draw, cx + 280, 470, 0.95, t, mood="happy", talk=True)
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(60, bold=True), ink)
            stars_around(330, 580)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · THE AI HUNT", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("voice", "Voice helpers", lav_soft), ("photo", "Photo search", blue_soft),
                     ("video", "Video picks", coral_soft), ("map", "Map traffic", sage_soft)]
            for i, (kind, lab, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 300
                y = 510 + int((1 - a) * 40)
                draw.ellipse((x - 100, y - 100, x + 100, y + 100), fill=soft)
                if kind == "voice":
                    tara(draw, x, y - 6, 0.42, t, mood="happy")
                elif kind == "photo":
                    photo(draw, (x - 66, y - 66, x + 66, y + 66), "dog", panel, line)
                elif kind == "video":
                    draw.rounded_rectangle((x - 60, y - 44, x + 60, y + 44), radius=18, fill=K.DANGER)
                    draw.polygon([(x - 16, y - 24), (x + 26, y), (x - 16, y + 24)], fill=WHITE)
                else:
                    K.draw_map_pin(draw, x, y + 60, 1.0, coral)
                K.draw_check(draw, x + 76, y - 76, 24, sage)
                K.text_at(draw, lab, x, y + 118, font(32, bold=True), ink)
            a = K.stagger(progress, 5, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 740 + int((1 - a) * 20), "Found them all!", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "AI Can Be Wrong Too", cx, 360 + lift, font(88, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                tara(draw, cx - 120, 680 + yy, 0.62, t, mood="oops")
                K.draw_bubble(draw, (cx + 40, 560 + yy, cx + 420, 680 + yy), brand, "Oops!", tail="left", size=52)
                K.draw_cross(draw, cx + 470, 560 + yy, 30, K.DANGER)
            return True
        # question
        draw.ellipse((520 - 260, 570 - 260, 520 + 260, 570 + 260), fill=lav_soft)
        tara(draw, 520, 560, 1.0, t, mood="think")
        K.text_at(draw, "AI is so clever…", 1300, 320 + lift, font(56, bold=True), muted)
        K.text_at(draw, "but is it", 1300, 420 + lift, font(80, bold=True), ink)
        K.text_at(draw, "ALWAYS right?", 1300, 520 + lift, font(90, bold=True), coral)
        question_marks([(960, 280), (1720, 700), (1000, 720)])
        return True

    # ---- Baby Shark story ------------------------------------------------------------
    if visual == "b4-hook":
        if focus == "ask":
            anaya(draw, 360, 520, 1.35, t)
            K.draw_person(draw, 640, 620, 0.85, "friend", t)
            K.pill(draw, 640, 820, "Mini", K.GOLD, size=30)
            K.draw_bubble(draw, (500, 240, 1100, 400), brand, "Tara, play Baby Shark!", tail="left", size=48)
            shelf(draw, 1300, 1660, 762)
            tara(draw, 1480, 590, 0.95, t, mood="idle", ring=True)
            return True
        if focus == "oops":
            anaya(draw, 260, 560, 1.1, 0)
            K.draw_person(draw, 470, 650, 0.8, "friend", t * 2)
            song_card(draw, (660, 250, 1240, 760), "car", "Baby Car song", t, ok=False)
            tara(draw, 1520, 600, 0.9, t, mood="happy", talk=True)
            K.text_at(draw, "Vroom, vroom!", 950, 790, font(44, bold=True), coral)
            K.text_at(draw, "hee hee!", 470, 520, font(32, bold=True), K.GOLD)
            return True
        if focus == "why":
            draw.ellipse((cx - 300, 580 - 300, cx + 300, 580 + 300), fill=lav_soft)
            tara(draw, cx, 590, 1.05, t, mood="oops")
            question_marks([(cx - 420, 320), (cx + 400, 300), (cx - 460, 600), (cx + 440, 580)])
            K.text_at(draw, "Why did Tara get it wrong?", cx, 216, font(48, bold=True), ink)
            K.draw_stopwatch(draw, cx + 620, 760, 50, progress, brand)
            return True
        if focus == "guess":
            for i, (word, col) in enumerate((("Baby SHARK", sage), ("Baby CAR", K.DANGER))):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 230 + int((1 - a) * 20)
                draw.rounded_rectangle((160, y, 720, y + 170), radius=40, fill=panel, outline=col, width=5)
                K.text_at(draw, word, 440, y + 22, font(52, bold=True), col)
                pts = [(220 + k * 20, y + 124 + 22 * math.sin(k * 0.9 + t * 6) * (0.6 + 0.4 * math.sin(k * 0.4)))
                       for k in range(25)]
                draw.line(pts, fill=WAVE, width=6, joint="curve")
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, 440, 770, "Sound a bit alike!", K.BOTH_COLOR, size=34)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                K.draw_device(draw, "tv", 980, 520, 0.9, brand, t=t)
                K.sound_waves(draw, 1140, 480, 0.9, K.DANGER, t, "right")
                K.text_at(draw, "TV was loud!", 980, 640, font(38, bold=True), K.DANGER)
            a = K.stagger(progress, 4, step=0.15, speed=4)
            if a > 0:
                tara(draw, 1560, 620, 0.78, t, mood="think")
                K.draw_bubble(draw, (1340, 250, 1780, 380), brand, "Baby… car?", tail="right", size=44)
            return True
        # fix
        anaya(draw, 340, 540, 1.3, t)
        K.draw_bubble(draw, (470, 250, 980, 400), brand, "Baby… Shark.", tail="left", size=52)
        song_card(draw, (1000, 260, 1480, 740), "shark", "Baby Shark", t, ok=True)
        tara(draw, 1660, 620, 0.72, t, mood="happy", ring=True)
        for k, (nx, ny) in enumerate(((1580, 330), (1760, 420), (880, 560))):
            K.draw_notes(draw, nx, ny, 0.8, t + k * 0.3, [coral, K.BOTH_COLOR, sage][k])
        K.text_at(draw, "Phew!", 700, 760, font(52, bold=True), sage)
        return True

    # ---- the big idea ---------------------------------------------------------------
    if visual == "b4-define":
        if focus == "truth":
            draw.ellipse((420 - 250, 570 - 250, 420 + 250, 570 + 250), fill=lav_soft)
            tara(draw, 420, 560, 0.95, t, mood="oops")
            K.shadow_card(draw, (760, 250 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "THE BIG IDEA", 1270, 320 + lift, font(40, bold=True), muted)
            parts = [("AI makes guesses,", ink), ("and guesses", coral), ("can be wrong!", coral)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1270, 400 + i * 100 + lift + int((1 - a) * 30), font(68, bold=True), col)
            a = K.stagger(progress, 4, step=0.14, speed=4)
            if a > 0:
                K.pill(draw, 1270, 730 + lift + int((1 - a) * 20), "AI is NOT always right", K.DANGER, size=38)
            return True
        # mistake
        K.pill(draw, cx, 224, "MISTAKE = a wrong answer", coral, size=38)
        cards = [((170, 320, 910, 860), "People make mistakes", "kid"), ((1010, 320, 1750, 860), "AI makes mistakes too", "ai")]
        for k, (bx, title, kind) in enumerate(cards):
            a = K.stagger(progress, k * 2, step=0.15, speed=4)
            if a <= 0:
                continue
            yy = int((1 - a) * 40)
            x0, y0, x1, y1 = bx[0], bx[1] + yy, bx[2], bx[3] + yy
            K.shadow_card(draw, (x0, y0, x1, y1), brand, radius=40)
            mx = (x0 + x1) / 2
            if kind == "kid":
                K.draw_person(draw, mx - 170, y0 + 230, 1.0, "friend", t)
                slate(draw, mx + 140, y0 + 260, 0.9, "7 + 5 = 13")
                K.draw_cross(draw, mx + 260, y0 + 150, 26, K.DANGER)
            else:
                tara(draw, mx - 160, y0 + 270, 0.62, t, mood="oops")
                K.draw_bubble(draw, (mx - 30, y0 + 130, mx + 320, y0 + 260), brand, "Baby car?", tail="left", size=40)
                K.draw_cross(draw, mx + 300, y0 + 130, 26, K.DANGER)
            K.text_at(draw, title, mx, y1 - 120, font(44, bold=True), ink)
        a = K.stagger(progress, 5, step=0.12, speed=4)
        if a > 0:
            K.text_at(draw, "=", cx, 540, font(80, bold=True), muted)
        return True

    # ---- puppy or muffin --------------------------------------------------------------
    if visual == "b4-muffin":
        if focus == "look":
            for k, (kind, lab) in enumerate((("puppy", "A"), ("muffin", "B"))):
                x0 = 300 + k * 700
                photo(draw, (x0, 280, x0 + 500, 780), kind, panel, line)
                K.pill(draw, 0, 300, lab, K.BOTH_COLOR, size=36, left=x0 + 24)
            K.text_at(draw, "or", 950, 500, font(60, bold=True), muted)
            K.pill(draw, cx - 40, 214, "Puppy or muffin?", coral, size=34)
            K.draw_stopwatch(draw, cx + 240, 240, 30, progress, brand)
            return True
        if focus == "label":
            photo(draw, (200, 300, 700, 800), "puppy", panel, line)
            K.text_at(draw, "a dog photo", 450, 820 - 0, font(32, bold=True), muted)
            K.draw_arrow(draw, 740, 550, 860, 550, muted, width=12, head=32)
            ai_chip(draw, 980, 550, 0.9)
            scan = 310 + 480 * ((t * 1.4) % 1)
            draw.line((210, scan, 690, scan), fill=GLOW, width=6)
            K.draw_arrow(draw, 1100, 550, 1220, 550, muted, width=12, head=32)
            a = K.ease_out_cubic(K.clamp01((progress - 0.35) * 3))
            if a > 0:
                yy = int((1 - a) * 30)
                draw.rounded_rectangle((1250 + 8, 300 + yy + 10, 1760 + 8, 800 + yy + 10), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((1250, 300 + yy, 1760, 800 + yy), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER,
                                       width=6)
                K.text_at(draw, "AI says:", 1505, 330 + yy, font(38, bold=True), muted)
                K.text_at(draw, "MUFFIN!", 1505, 390 + yy, font(80, bold=True), K.DANGER)
                muffin(draw, 1505, 590 + yy, 100)
                K.draw_cross(draw, 1710, 350 + yy, 32, K.DANGER)
            return True
        # why
        for k, kind in enumerate(("puppy", "muffin")):
            x0 = 260 + k * 940
            photo(draw, (x0, 280, x0 + 460, 740), kind, panel, line)
        feats = [("Round", coral), ("Brown", (176, 120, 60)), ("Dark dots", ink)]
        for i, (lab, col) in enumerate(feats):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            y = 330 + i * 120 + int((1 - a) * 20)
            draw.rounded_rectangle((790, y, 1130, y + 90), radius=45, fill=panel, outline=col, width=4)
            draw.text((830, y + 22), lab, fill=ink, font=font(40, bold=True))
            K.draw_check(draw, 1086, y + 45, 22, sage)
        a = K.stagger(progress, 4, step=0.14, speed=4)
        if a > 0:
            K.pill(draw, cx, 780 + int((1 - a) * 20), "Similar pattern → wrong guess", K.DANGER, size=38)
        return True

    # ---- three reasons ----------------------------------------------------------------
    if visual == "b4-why":
        if focus == "intro":
            draw.ellipse((480 - 260, 570 - 260, 480 + 260, 570 + 260), fill=lav_soft)
            tara(draw, 480, 560, 1.0, t, mood="think")
            K.text_at(draw, "Why does AI make mistakes?", 1290, 240, font(50, bold=True), ink)
            for i, lab in enumerate(("Is it tired?", "Is it angry?", "Tricking you?")):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                chip(960, 340 + i * 110 + int((1 - a) * 20), 1620, lab, False, size=40)
            a = K.stagger(progress, 4, step=0.14, speed=4)
            if a > 0:
                y = 700 + int((1 - a) * 20)
                K.text_at(draw, "3 real reasons", 1180, y + 14, font(46, bold=True), sage)
                for k in range(3):
                    x = 1440 + k * 100
                    draw.ellipse((x - 38, y - 4, x + 38, y + 72), fill=sage)
                    K.text_at(draw, str(k + 1), x, y + 8, font(46, bold=True), WHITE)
            return True
        n = {"few": 1, "messy": 2, "new": 3}[focus]
        specs = [("Too few examples", coral), ("Messy examples", K.BOTH_COLOR), ("Something new", K.ROAD)]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, (title, col) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            if i >= n:
                draw.rounded_rectangle((x0, 250, x0 + cw, 860), radius=36, fill=(246, 241, 233), outline=line, width=3)
                K.text_at(draw, "?", x0 + cw / 2, 470, font(120, bold=True), line)
                continue
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 250 + yy, x0 + cw, 860 + yy), brand, radius=36, outline=col if active else line,
                          outline_w=6 if active else 3)
            K.pill(draw, 0, 274 + yy, str(i + 1), col, size=30, left=x0 + 24)
            mx = x0 + cw / 2
            if i == 0:
                for k in range(6):
                    r_, c_ = divmod(k, 3)
                    bx0 = x0 + 50 + c_ * 145
                    by0 = 350 + r_ * 160 + yy
                    if k < 2:
                        photo(draw, (bx0, by0, bx0 + 130, by0 + 140), "cat", panel, line)
                    else:
                        draw.rounded_rectangle((bx0, by0, bx0 + 130, by0 + 140), radius=14, fill=(246, 243, 238))
                        K.text_at(draw, "?", bx0 + 65, by0 + 30, font(64, bold=True), line)
                sub = "hasn't learned well yet"
            elif i == 1:
                photo(draw, (x0 + 40, 350 + yy, x0 + 240, 580 + yy), "blurcat", panel, line)
                K.text_at(draw, "blurry", x0 + 140, 590 + yy, font(30, bold=True), muted)
                photo(draw, (x0 + 280, 350 + yy, x0 + 480, 580 + yy), "dog", panel, line)
                tb = K.pill(draw, x0 + 380, 590 + yy, "cat", K.DANGER, size=28)
                K.draw_cross(draw, tb[2] + 22, (tb[1] + tb[3]) / 2, 16, K.DANGER)
                sub = "blurry or wrong names"
            else:
                photo(draw, (mx - 130, 340 + yy, mx + 130, 600 + yy), "lion", panel, line)
                K.text_at(draw, "Lion?? Dog??", mx, 616 + yy, font(34, bold=True), K.ROAD)
                sub = "never seen it before"
            K.text_at(draw, title, mx, 700 + yy, font(42, bold=True), col)
            K.text_at(draw, sub, mx, 760 + yy, font(32, bold=True), muted)
        return True

    # ---- few vs many cats -------------------------------------------------------------
    if visual == "b4-cats":
        ans = focus == "answer"
        panels = [((150, 290, 910, 860), "AI number 1", "3 blurry photos"), ((1010, 290, 1770, 860), "AI number 2",
                                                                              "thousands of clear photos")]
        for k, (bx, title, sub) in enumerate(panels):
            x0, y0, x1, y1 = bx
            col = (K.DANGER if k == 0 else sage) if ans else line
            soft = (K.DANGER_SOFT if k == 0 else sage_soft) if ans else panel
            draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle(bx, radius=36, fill=soft, outline=col, width=6 if ans else 3)
            mx = (x0 + x1) / 2
            ai_chip(draw, x0 + 110, y0 + 110, 0.5)
            draw.text((x0 + 200, y0 + 52), title, fill=ink, font=font(46, bold=True))
            draw.text((x0 + 200, y0 + 112), sub, fill=muted, font=font(32, bold=True))
            if k == 0:
                for j in range(3):
                    px = x0 + 70 + j * 215
                    photo(draw, (px, y0 + 240, px + 190, y0 + 450), "blurcat", panel, line)
            else:
                kinds = ["cat", "cat2", "cat3", "cat", "cat3", "cat2", "cat2", "cat", "cat3", "cat", "cat2", "cat3"]
                for j, kd in enumerate(kinds):
                    r_, c_ = divmod(j, 6)
                    px = x0 + 40 + c_ * 116
                    photo(draw, (px, y0 + 230 + r_ * 116, px + 106, y0 + 336 + r_ * 116), kd, panel, line)
                if not ans:
                    K.text_at(draw, "…and thousands more!", mx, y0 + 470, font(32, bold=True), muted)
            if ans:
                if k == 0:
                    mark_pill(mx - 30, y1 - 100, "More mistakes!", K.DANGER, False, size=38)
                else:
                    mark_pill(mx - 30, y1 - 100, "Learns better!", sage, True, size=38)
        if not ans:
            K.pill(draw, cx - 40, 214, "Which makes more mistakes?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 300, 240, 30, progress, brand)
        return True

    # ---- everyday oops ---------------------------------------------------------------
    if visual == "b4-oops":
        if focus == "map":
            map_closed(draw, (180, 250, 860, 860), t, route=K.clamp01(progress * 1.5))
            K.pill(draw, 520, 820, "App: go this way!", ROUTE, size=30)
            draw.rounded_rectangle((960, 250, 1780, 860), radius=36, fill=(214, 236, 250))
            draw.rectangle((960, 640, 1780, 860), fill=ASPHALT)
            K.draw_dashed(draw, 960, 750, 1780, 750, WHITE, width=8, dash=50, gap=40)
            draw.rounded_rectangle((960, 250, 1780, 860), radius=36, outline=line, width=3)
            barrier(draw, 1500, 760, 1.0)
            draw.rounded_rectangle((1330, 300, 1700, 440), radius=24, fill=K.DANGER)
            K.text_at(draw, "ROAD CLOSED", 1515, 318, font(44, bold=True), WHITE)
            K.text_at(draw, "repairs today", 1515, 378, font(32, bold=True), WHITE)
            cone(draw, 1720, 800, 0.8)
            cone(draw, 1300, 800, 0.8)
            stop = K.clamp01(progress * 1.6)
            family_car(draw, K.lerp(1000, 1130, K.ease_out_cubic(stop)), 700, 0.9, coral)
            return True
        # translate
        K.shadow_card(draw, (220, 250, 1180, 860), brand, radius=36, accent=K.BOTH_COLOR)
        K.text_at(draw, "Translate app", 700, 270, font(40, bold=True), WHITE)
        draw.rounded_rectangle((280, 360, 1120, 480), radius=24, fill=(246, 243, 238))
        draw.text((310, 372), "Hindi", fill=muted, font=font(28, bold=True))
        draw.text((310, 412), "Main kal aaunga", fill=ink, font=font(44, bold=True))
        K.draw_arrow(draw, 700, 494, 700, 540, muted, width=10, head=26)
        a = K.stagger(progress, 1, step=0.15, speed=4)
        if a > 0:
            draw.rounded_rectangle((280, 556, 1120, 676), radius=24, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            draw.text((310, 568), "English (app's guess)", fill=muted, font=font(28, bold=True))
            draw.text((310, 608), "I will come yesterday", fill=ink, font=font(44, bold=True))
            K.draw_cross(draw, 1070, 616, 28, K.DANGER)
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            draw.rounded_rectangle((280, 700, 1120, 820), radius=24, fill=sage_soft, outline=sage, width=4)
            draw.text((310, 712), "What you meant", fill=muted, font=font(28, bold=True))
            draw.text((310, 752), "I will come tomorrow", fill=ink, font=font(44, bold=True))
            K.draw_check(draw, 1070, 760, 28, sage)
        K.text_at(draw, "\"kal\" can mean", 1490, 280, font(44, bold=True), ink)
        draw.rounded_rectangle((1380, 370, 1600, 590), radius=24, fill=panel, outline=coral, width=6)
        draw.rounded_rectangle((1380, 370, 1600, 430), radius=24, fill=coral)
        draw.rectangle((1380, 410, 1600, 430), fill=coral)
        K.text_at(draw, "kal", 1490, 450, font(80, bold=True), coral)
        K.draw_arrow(draw, 1370, 640, 1260, 700, muted, width=10, head=26)
        K.draw_arrow(draw, 1610, 640, 1720, 700, muted, width=10, head=26)
        K.text_at(draw, "yesterday", 1300, 720, font(34, bold=True), K.BOTH_COLOR)
        K.text_at(draw, "tomorrow", 1680, 720, font(34, bold=True), sage)
        return True

    # ---- check with a grown-up ----------------------------------------------------------
    if visual == "b4-grownup":
        if focus == "rule":
            topics = [("Health", "med"), ("Safety", "shield"), ("Food", "food")]
            for i, (lab, kind) in enumerate(topics):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                y = 260 + i * 200 + int((1 - a) * 20)
                draw.rounded_rectangle((160 + 8, y + 10, 720 + 8, y + 170 + 10), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((160, y, 720, y + 170), radius=40, fill=panel, outline=coral, width=4)
                ix, iy = 270, y + 85
                draw.ellipse((ix - 66, iy - 66, ix + 66, iy + 66), fill=coral_soft)
                if kind == "med":
                    medicine(draw, ix - 8, iy + 4, 0.48)
                elif kind == "shield":
                    K.draw_shield(draw, ix, iy, 0.42, sage)
                else:
                    mushroom(draw, ix, iy + 50, 0.52)
                draw.text((380, y + 56), lab, fill=ink, font=font(54, bold=True))
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.draw_arrow(draw, 760, 560, 880, 560, coral, width=14, head=38)
                draw.rounded_rectangle((920, 250, 1780, 860), radius=40, fill=sage_soft, outline=sage, width=5)
                K.text_at(draw, "Ask a trusted grown-up", 1350, 280, font(48, bold=True), sage)
                for k, (kind, lab) in enumerate((("mom", "Parents"), ("teacher", "Teacher"), ("nani", "Nani"))):
                    b = K.stagger(progress, 4 + k, step=0.1, speed=5)
                    if b <= 0:
                        continue
                    x = 1080 + k * 270
                    K.draw_person(draw, x, 520 + int((1 - b) * 20), 1.0, kind, t)
                    K.pill(draw, x, 700, lab, sage, size=32)
                if progress > 0.75:
                    K.draw_heart(draw, 1350, 790, 30, coral)
            return True
        if focus == "never":
            scr = phone(draw, 400, 560, 0.95)
            sx0, sy0, sx1, sy1 = scr
            draw.rounded_rectangle((sx0 + 16, sy0 + 30, sx1 - 16, sy0 + 210), radius=20, fill=(226, 240, 220))
            mushroom(draw, (sx0 + sx1) / 2, sy0 + 196, 0.7)
            draw.rounded_rectangle((sx0 + 16, sy0 + 240, sx1 - 16, sy0 + 330), radius=20, fill=sage)
            K.text_at(draw, "Eat it!", (sx0 + sx1) / 2, sy0 + 262, font(40, bold=True), WHITE)
            K.text_at(draw, "App says…", (sx0 + sx1) / 2, sy0 + 370, font(30, bold=True), muted)
            K.draw_stop_sign(draw, 630, 780, 60)
            acts = [("Eat it", "eat"), ("Touch it", "touch"), ("Go there", "go")]
            for i, (lab, kind) in enumerate(acts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                x0 = 720 + i * 360
                y0 = 300 + int((1 - a) * 30)
                draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 320 + 8, y0 + 460 + 10), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 320, y0 + 460), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
                mx, my = x0 + 160, y0 + 190
                if kind == "eat":
                    draw.ellipse((mx - 100, my - 40, mx + 100, my + 60), fill=WHITE, outline=line, width=4)
                    mushroom(draw, mx, my + 30, 0.6)
                elif kind == "touch":
                    hand(draw, mx, my + 40, 1.0)
                else:
                    K.draw_map_pin(draw, mx, my + 70, 1.1, coral)
                    K.draw_feet(draw, mx - 60, my + 100, 0.6)
                K.text_at(draw, lab, mx, y0 + 330, font(42, bold=True), ink)
                K.draw_cross(draw, x0 + 270, y0 + 50, 30, K.DANGER)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1260, 790 + int((1 - a) * 20), "…just because an app said so", K.DANGER, size=34)
            return True
        # boss
        draw.ellipse((480 - 240, 580 - 240, 480 + 240, 580 + 240), fill=lav_soft)
        tara(draw, 480, 580, 0.9, t, mood="happy")
        K.pill(draw, 480, 820 - 10, "Helper", K.BOTH_COLOR, size=38)
        K.draw_bubble(draw, (640, 260, 1080, 400), brand, "Here's an idea…", tail="left", size=40)
        K.draw_arrow(draw, 860, 600, 1080, 600, muted, width=12, head=34)
        draw.ellipse((1400 - 260, 570 - 260, 1400 + 260, 570 + 260), fill=sage_soft)
        K.draw_person(draw, 1400, 520, 1.4, "mom", t)
        crown(draw, 1400, 410 + bounce // 2, 0.9)
        K.pill(draw, 1400, 790, "Grown-ups decide big things", sage, size=34)
        return True

    # ---- the mushroom -------------------------------------------------------------------
    if visual == "b4-mushroom":
        draw.rounded_rectangle((140, 250, 1780, 860), radius=36, fill=(222, 238, 250))
        draw.rectangle((140, 700, 1780, 860), fill=GRASS)
        for k in range(30):
            gx = 160 + k * 54
            draw.line((gx, 704, gx + 10, 680), fill=GRASS_DARK, width=4)
        draw.rounded_rectangle((140, 250, 1780, 860), radius=36, outline=line, width=3)
        tree(draw, 360, 720, 1.0)
        ans = focus == "answer"
        mushroom(draw, 560, 760, 0.8)
        if focus == "find":
            anaya(draw, 880, 520, 1.25, t)
            scr = phone(draw, 1450, 530, 0.85)
            sx0, sy0, sx1, sy1 = scr
            draw.rounded_rectangle((sx0 + 14, sy0 + 20, sx1 - 14, sy0 + 220), radius=18, fill=(226, 240, 220))
            mushroom(draw, (sx0 + sx1) / 2, sy0 + 206, 0.7)
            draw.text((sx0 + 24, sy0 + 236), "Plant app", fill=muted, font=font(28, bold=True))
            a = K.ease_out_cubic(K.clamp01((progress - 0.4) * 3))
            if a > 0:
                draw.rounded_rectangle((sx0 + 14, sy0 + 290, sx1 - 14, sy0 + 380), radius=20, fill=sage)
                K.text_at(draw, "Safe to eat!", (sx0 + sx1) / 2, sy0 + 312, font(36, bold=True), WHITE)
                K.draw_check(draw, (sx0 + sx1) / 2, sy0 + 420, 22, sage)
            return True
        if focus == "ask":
            anaya(draw, 880, 520, 1.25, 0)
            question_marks([(760, 300), (1010, 280)])
            chip(1200, 300, 1720, "Eat it?", False, size=40)
            chip(1200, 420, 1720, "Ask Nani?", True, size=40)
            K.draw_stopwatch(draw, 1460, 620, 50, progress, brand)
            return True
        # answer
        K.draw_stop_sign(draw, 560, 470, 70)
        anaya(draw, 860, 520, 1.15, t)
        K.draw_person(draw, 1090, 500, 1.2, "nani", t)
        K.draw_heart(draw, 975, 330 + bounce, 28, coral)
        draw.rounded_rectangle((1280, 280, 1740, 660), radius=30, fill=panel, outline=K.DANGER, width=5)
        K.text_at(draw, "App: \"Safe!\"", 1510, 300, font(38, bold=True), muted)
        K.text_at(draw, "Could be wrong!", 1510, 360, font(42, bold=True), K.DANGER)
        a = K.stagger(progress, 3, step=0.14, speed=4)
        if a > 0:
            K.text_at(draw, "Says yes twice?", 1510, 460, font(36, bold=True), ink)
            K.text_at(draw, "Still ask first!", 1510, 516, font(36, bold=True), sage)
            K.draw_check(draw, 1510, 610, 26, sage)
        K.pill(draw, 860, 790 - 10, "Ask a grown-up first", sage, size=34)
        return True

    # ---- which needs a grown-up -----------------------------------------------------------
    if visual == "b4-sort":
        ans = focus == "answer"
        cards = [("song", ("App suggests", "a song"), False), ("ears", ("Filter adds", "cat ears"), False),
                 ("colour", ("App picks a", "colour"), False), ("med", ("App says a", "medicine is fine"), True)]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab, need) in enumerate(cards):
            x0 = x_start + i * (cw + gap)
            bx = (x0, 300, x0 + cw, 830)
            reveal = ans and progress > (0.06 if need else 0.45)
            col = (coral if need else muted) if reveal else line
            K.shadow_card(draw, bx, brand, radius=30, outline=col, outline_w=6 if reveal else 3)
            if reveal and need:
                draw.rounded_rectangle((x0 + 6, 306, x0 + cw - 6, 824), radius=26, fill=coral_soft)
            mx = x0 + cw / 2
            if kind == "song":
                tara(draw, mx - 40, 500, 0.5, t, mood="happy")
                K.draw_notes(draw, mx + 110, 440, 0.8, t, K.BOTH_COLOR)
            elif kind == "ears":
                cat_ear_face(draw, mx, 520, 80)
            elif kind == "colour":
                palette(draw, mx, 500, 1.0)
            else:
                medicine(draw, mx - 30, 500, 0.9)
            label_lines(lab, mx, 660, size=34)
            if reveal:
                K.pill(draw, mx, 320, "ASK A GROWN-UP" if need else "No big deal", coral if need else muted,
                       size=28 if need else 30)
            elif not ans:
                K.pill(draw, mx, 320, "?", K.BOTH_COLOR, size=32)
        if not ans:
            K.pill(draw, cx - 40, 214, "Which most needs a grown-up?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 310, 240, 30, progress, brand)
        else:
            K.pill(draw, cx, 214, "Health → always check with a grown-up", coral, size=32)
        return True

    # ---- checkpoint -----------------------------------------------------------------------
    if visual == "b4-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think before you trust!", cx, 450 + lift, font(60, bold=True), ink)
            tara(draw, cx, 640 + lift, 0.42, t, mood="think")
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1080 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1080, 870), radius=24, fill=(255, 250, 238))
        label_lines(("AI says a plant is safe to eat.", "Should you eat it? Why?"), 605, 262, size=42, col=coral)
        rows = ["No! AI can be wrong.", "Wrong plants can make you sick.", "Ask a trusted grown-up first."]
        marks = [True, True, True]
        for i, lab in enumerate(rows):
            y = 430 + i * 140
            draw.line((180, y + 90, 1030, y + 90), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.4 - 0.3 > i
            if shown:
                if marks[i]:
                    K.draw_check(draw, 210, y + 40, 22, sage)
                draw.text((250, y + 18), lab, fill=ink, font=font(42, bold=True))
        if not ans:
            K.text_at(draw, "?", 605, 540, font(150, bold=True), line)
        draw.ellipse((1440 - 280, 560 - 280, 1440 + 280, 560 + 280), fill=sage_soft)
        berry_plant(draw, 1300, 760, 1.1)
        scr = phone(draw, 1600, 520, 0.5)
        sx0, sy0, sx1, sy1 = scr
        draw.rounded_rectangle((sx0 + 8, sy0 + 100, sx1 - 8, sy0 + 170), radius=14, fill=sage)
        K.text_at(draw, "Safe!", (sx0 + sx1) / 2, sy0 + 116, font(32, bold=True), WHITE)
        if ans:
            K.draw_cross(draw, 1600, 400, 40, K.DANGER)
            K.pill(draw, 1440, 800, "Ask first!", sage, size=36)
        else:
            K.draw_stopwatch(draw, 1250, 330, 44, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------
    if visual == "b4-recap":
        recap = [(("AI can be", "wrong"), K.DANGER, "wrong"), (("Few or messy", "examples"), K.BOTH_COLOR, "messy"),
                 (("Important?", "Ask a person"), coral, "ask"), (("AI helps,", "grown-ups decide"), sage, "boss")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, font(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "wrong":
                    tara(draw, ix - 30, iy + 10, 0.55, t, mood="oops")
                    K.draw_cross(draw, ix + 110, iy - 110, 32, K.DANGER)
                elif kind == "messy":
                    photo(draw, (ix - 150, iy - 120, ix - 10, iy + 30), "blurcat", panel, line)
                    photo(draw, (ix + 10, iy - 90, ix + 150, iy + 60), "dog", panel, line)
                    K.pill(draw, ix + 80, iy + 76, "cat", K.DANGER, size=26)
                elif kind == "ask":
                    medicine(draw, ix - 90, iy + 10, 0.6)
                    K.draw_person(draw, ix + 80, iy - 40, 0.7, "mom", t)
                else:
                    tara(draw, ix - 90, iy + 30, 0.4, t, mood="happy")
                    K.draw_person(draw, ix + 80, iy - 10, 0.7, "mom", t)
                    crown(draw, ix + 80, iy - 70, 0.5)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            tara(draw, cx + 300, 450, 0.75, t, mood="happy", talk=True)
            K.text_at(draw, "Chapter 4 done!", cx, 680, font(68, bold=True), ink)
            K.pill(draw, cx, 780, "Smart, careful AI user!", coral, size=36)
            stars_around(320, 580, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
