"""B11 · Can Computers See? — visuals."""
import math

import build as K

GINGER = (238, 152, 70)
FUR_WHITE = (255, 250, 242)
PINK = (244, 150, 170)
CAT_EYE = (120, 190, 90)
CAT_BLACK = (46, 46, 56)
SOFA = (34, 34, 42)
SOFA_TOP = (48, 48, 58)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
GRASS = (120, 190, 90)
GRASS_DARK = (92, 160, 70)
SKY = (214, 234, 250)
DARK_ROOM = (40, 42, 54)
RED_BALL = (200, 44, 52)
TENNIS = (206, 226, 60)
HIBISCUS = (226, 52, 70)
HIBISCUS_DARK = (170, 28, 56)
MARIGOLD = (255, 168, 30)

PIX = [
    "................",
    ".KK..........KK.",
    ".KOK........KOK.",
    ".KPOK......KOPK.",
    ".KPOOKKKKKKOOPK.",
    "KOOOOOOOOOOOOOOK",
    "KODOOODDDDOOODOK",
    "KOOOOOOOOOOOOOOK",
    "KOOGGOOOOOOGGOOK",
    "KOOGKOOOOOOGKOOK",
    "KOOOOOOWWOOOOOOK",
    "KWWOOOWPPWOOOWWK",
    "KOOOOWWWWWWOOOOK",
    ".KOOWWWKKWWWOOK.",
    "..KKOWWWWWWOKK..",
    "....KKKKKKKK....",
]
PIX_COL = {".": (200, 226, 246), "K": (60, 50, 50), "O": GINGER, "D": (204, 112, 44), "P": PINK,
           "G": CAT_EYE, "W": FUR_WHITE}


def S_(s):
    return lambda v: v * s


def shade(col, k):
    return tuple(max(0, min(255, int(c * k))) for c in col)


# ---------------------------------------------------------------------------
# Characters & things
# ---------------------------------------------------------------------------

def cat_head(draw, hx, hy, s, col=GINGER, closed=False, white=True, eye=CAT_EYE):
    """Head centre (hx, hy); ears reach hy-104s, whiskers ±104s."""
    S = S_(s)
    dark = shade(col, 0.78) if col != CAT_BLACK else (70, 70, 84)
    for sx in (-1, 1):
        draw.polygon([(hx + sx * S(76), hy - S(16)), (hx + sx * S(64), hy - S(104)), (hx + sx * S(12), hy - S(64))],
                     fill=col)
        draw.polygon([(hx + sx * S(62), hy - S(34)), (hx + sx * S(58), hy - S(84)), (hx + sx * S(28), hy - S(62))],
                     fill=PINK if col != CAT_BLACK else (90, 70, 84))
    draw.ellipse((hx - S(82), hy - S(74), hx + S(82), hy + S(70)), fill=col)
    if col != CAT_BLACK:
        for k in (-1, 0, 1):
            draw.line((hx + k * S(20), hy - S(72), hx + k * S(15), hy - S(44)), fill=dark, width=max(2, int(S(8))))
    if white:
        draw.ellipse((hx - S(46), hy + S(4), hx + S(46), hy + S(64)), fill=FUR_WHITE)
    ink = K.DEV_DEEP if col != CAT_BLACK else (20, 20, 26)
    for sx in (-1, 1):
        ex, ey = hx + sx * S(32), hy - S(12)
        if closed:
            draw.arc((ex - S(17), ey - S(12), ex + S(17), ey + S(14)), 20, 160, fill=ink, width=max(2, int(S(6))))
        else:
            draw.ellipse((ex - S(17), ey - S(19), ex + S(17), ey + S(19)), fill=eye)
            draw.ellipse((ex - S(5), ey - S(15), ex + S(5), ey + S(15)), fill=ink)
            draw.ellipse((ex - S(11), ey - S(13), ex - S(3), ey - S(5)), fill=(255, 255, 255))
    draw.polygon([(hx - S(11), hy + S(12)), (hx + S(11), hy + S(12)), (hx, hy + S(24))], fill=PINK)
    mw = max(1, int(S(4)))
    mouth = (120, 90, 90) if col != CAT_BLACK else (110, 110, 124)
    draw.arc((hx - S(18), hy + S(14), hx, hy + S(36)), 20, 160, fill=mouth, width=mw)
    draw.arc((hx, hy + S(14), hx + S(18), hy + S(36)), 20, 160, fill=mouth, width=mw)
    wcol = (150, 140, 136) if col != CAT_BLACK else (130, 130, 146)
    for sx in (-1, 1):
        for k in (-1, 0, 1):
            draw.line((hx + sx * S(36), hy + S(28) + k * S(6), hx + sx * S(104), hy + S(20) + k * S(18)), fill=wcol,
                      width=max(1, int(S(3))))


def cat(draw, cx, by, s, col=GINGER, t=0.0, closed=False, white=True, eye=CAT_EYE, shadow=True):
    """Sitting cat. by = bottom; ear tips ≈ by-300s; tail to cx+136s."""
    S = S_(s)
    dark = shade(col, 0.82) if col != CAT_BLACK else (58, 58, 70)
    if shadow:
        draw.ellipse((cx - S(96), by - S(12), cx + S(120), by + S(10)), fill=K.SHADOW)
    sway = S(10) * math.sin(t * math.pi * 4)
    draw.line([(cx + S(52), by - S(18)), (cx + S(112), by - S(40)), (cx + S(124) + sway, by - S(96)),
               (cx + S(102) + sway, by - S(146))], fill=dark, width=max(3, int(S(22))), joint="curve")
    draw.ellipse((cx - S(76), by - S(176), cx + S(76), by), fill=col)
    if white:
        draw.ellipse((cx - S(40), by - S(150), cx + S(40), by - S(24)), fill=FUR_WHITE)
    for sx in (-1, 1):
        px = cx + sx * S(34)
        draw.ellipse((px - S(24), by - S(28), px + S(24), by + S(2)), fill=FUR_WHITE if white else dark)
    cat_head(draw, cx, by - S(196), s, col, closed, white, eye)


def kabir(draw, x, y, s, t):
    K.draw_person(draw, x, y, s, "kid", t)


def big_eye(draw, cx, cy, s, iris=(70, 140, 200), look=0.0):
    S = S_(s)
    top = [(cx + S(-110 + 11 * k), cy - S(70) * math.sin(math.pi * k / 20)) for k in range(21)]
    bot = [(cx + S(110 - 11 * k), cy + S(58) * math.sin(math.pi * k / 20)) for k in range(21)]
    poly = top + bot
    draw.polygon([(x + S(6), y + S(8)) for x, y in poly], fill=K.SHADOW)
    draw.polygon(poly, fill=(255, 255, 255))
    ix = cx + look * S(22)
    draw.ellipse((ix - S(44), cy - S(48), ix + S(44), cy + S(40)), fill=iris)
    draw.ellipse((ix - S(20), cy - S(24), ix + S(20), cy + S(16)), fill=K.DEV_DEEP)
    draw.ellipse((ix - S(26), cy - S(36), ix - S(10), cy - S(20)), fill=(255, 255, 255))
    draw.polygon(poly, outline=K.DEV_DARK, width=max(2, int(S(7))))
    for k in range(5):
        a = math.pi * (0.2 + 0.15 * k)
        bx, by = cx - S(110) * math.cos(a), cy - S(70) * math.sin(a)
        draw.line((bx, by, bx - S(14) * math.cos(a), by - S(26) * math.sin(a)), fill=K.DEV_DARK,
                  width=max(2, int(S(6))))


def big_ear(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(60) + S(6), cy - S(90) + S(8), cx + S(60) + S(6), cy + S(90) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(60), cy - S(90), cx + S(60), cy + S(90)), fill=K.SKIN)
    draw.arc((cx - S(36), cy - S(64), cx + S(40), cy + S(40)), 160, 420, fill=(214, 160, 126), width=max(3, int(S(14))))
    draw.ellipse((cx - S(14), cy - S(6), cx + S(14), cy + S(28)), fill=(214, 160, 126))


def chat_icon(draw, cx, cy, s, col):
    S = S_(s)
    draw.rounded_rectangle((cx - S(90) + S(6), cy - S(60) + S(8), cx + S(90) + S(6), cy + S(50) + S(8)), radius=S(30),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(90), cy - S(60), cx + S(90), cy + S(50)), radius=S(30), fill=col)
    draw.polygon([(cx - S(50), cy + S(46)), (cx - S(10), cy + S(46)), (cx - S(60), cy + S(90))], fill=col)
    for k in range(3):
        dx = (k - 1) * S(40)
        draw.ellipse((cx + dx - S(12), cy - S(17), cx + dx + S(12), cy + S(7)), fill=(255, 255, 255))


def phone(draw, cx, cy, s, screen=(255, 255, 255)):
    """Portrait phone. Returns the screen box."""
    S = S_(s)
    hw, hh = S(190), S(300)
    draw.rounded_rectangle((cx - hw + S(10), cy - hh + S(12), cx + hw + S(10), cy + hh + S(12)), radius=S(44),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - hw, cy - hh, cx + hw, cy + hh), radius=S(44), fill=K.DEV_DARK)
    box = (cx - hw + S(16), cy - hh + S(44), cx + hw - S(16), cy + hh - S(44))
    draw.rounded_rectangle(box, radius=S(14), fill=screen)
    draw.rounded_rectangle((cx - S(40), cy - hh + S(18), cx + S(40), cy - hh + S(28)), radius=S(5), fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(50), cy + hh - S(26), cx + S(50), cy + hh - S(18)), radius=S(4), fill=K.DEV_MID)
    return box


def cricket_ball(draw, cx, cy, r):
    draw.ellipse((cx - r + r * 0.08, cy - r + r * 0.12, cx + r + r * 0.08, cy + r + r * 0.12), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=RED_BALL)
    for rr in (1.22, 1.36):
        R = r * rr
        ox = cx - r * 1.2
        draw.arc((ox - R, cy - R, ox + R, cy + R), -40, 40, fill=(255, 240, 230), width=max(2, int(r * 0.06)))
    draw.arc((cx - r * 0.7, cy - r * 0.7, cx + r * 0.2, cy + r * 0.2), 200, 260, fill=(240, 120, 120),
             width=max(2, int(r * 0.1)))


def football(draw, cx, cy, r):
    draw.ellipse((cx - r + r * 0.08, cy - r + r * 0.12, cx + r + r * 0.08, cy + r + r * 0.12), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255), outline=K.DEV_DARK,
                 width=max(2, int(r * 0.06)))
    pent = [(cx + r * 0.32 * math.cos(-math.pi / 2 + k * 2 * math.pi / 5),
             cy + r * 0.32 * math.sin(-math.pi / 2 + k * 2 * math.pi / 5)) for k in range(5)]
    draw.polygon(pent, fill=K.DEV_DARK)
    for k in range(5):
        a = -math.pi / 2 + k * 2 * math.pi / 5
        px, py = cx + r * 0.78 * math.cos(a), cy + r * 0.78 * math.sin(a)
        draw.line((cx + r * 0.32 * math.cos(a), cy + r * 0.32 * math.sin(a), px, py), fill=K.DEV_DARK,
                  width=max(2, int(r * 0.05)))
        pts = [(px + r * 0.17 * math.cos(a + j * 2 * math.pi / 5), py + r * 0.17 * math.sin(a + j * 2 * math.pi / 5))
               for j in range(5)]
        draw.polygon(pts, fill=K.DEV_DARK)


def tennis_ball(draw, cx, cy, r):
    draw.ellipse((cx - r + r * 0.08, cy - r + r * 0.12, cx + r + r * 0.08, cy + r + r * 0.12), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=TENNIS)
    w = max(2, int(r * 0.09))
    draw.arc((cx - r * 1.9, cy - r * 0.9, cx - r * 0.1, cy + r * 0.9), -55, 55, fill=(255, 255, 255), width=w)
    draw.arc((cx + r * 0.1, cy - r * 0.9, cx + r * 1.9, cy + r * 0.9), 125, 235, fill=(255, 255, 255), width=w)


def bottle(draw, cx, by, s, col=(160, 210, 246), cap=K.CORAL, tall=1.0):
    """Bottom at by; height ≈ 262s·tall."""
    S = S_(s)
    hb = S(190) * tall
    draw.rounded_rectangle((cx - S(46) + S(6), by - hb + S(8), cx + S(46) + S(6), by + S(8)), radius=S(22), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(46), by - hb, cx + S(46), by), radius=S(22), fill=col, outline=K.DEV_DARK,
                           width=max(2, int(S(5))))
    draw.polygon([(cx - S(44), by - hb + S(20)), (cx - S(22), by - hb - S(28)), (cx + S(22), by - hb - S(28)),
                  (cx + S(44), by - hb + S(20))], fill=col, outline=K.DEV_DARK)
    draw.rectangle((cx - S(22), by - hb - S(40), cx + S(22), by - hb - S(24)), fill=col, outline=K.DEV_DARK,
                   width=max(1, int(S(4))))
    draw.rounded_rectangle((cx - S(27), by - hb - S(72), cx + S(27), by - hb - S(38)), radius=S(6), fill=cap,
                           outline=K.DEV_DARK, width=max(1, int(S(4))))
    draw.rectangle((cx - S(44), by - hb * 0.6, cx + S(44), by - hb * 0.35), fill=(255, 255, 255))
    draw.line((cx - S(28), by - hb + S(30), cx - S(28), by - hb * 0.66), fill=(255, 255, 255),
              width=max(2, int(S(8))))


def book(draw, cx, by, s, col=K.BOT):
    """A book lying flat, bottom at by, ±130s wide, 56s tall."""
    S = S_(s)
    draw.rounded_rectangle((cx - S(130) + S(6), by - S(56) + S(8), cx + S(130) + S(6), by + S(8)), radius=S(8),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(130), by - S(56), cx + S(130), by), radius=S(8), fill=col)
    draw.rectangle((cx - S(116), by - S(46), cx + S(130), by - S(10)), fill=(250, 246, 236))
    for k in range(4):
        yy = by - S(40) + k * S(8)
        draw.line((cx - S(110), yy, cx + S(126), yy), fill=(214, 206, 192), width=max(1, int(S(2))))
    draw.rectangle((cx - S(130), by - S(56), cx - S(112), by), fill=shade(col, 0.8))


def hibiscus(draw, cx, cy, r, t=0.0):
    for k in range(5):
        a = k * 2 * math.pi / 5 - math.pi / 2 + 0.1 * math.sin(t * 3)
        px, py = cx + math.cos(a) * r * 0.55, cy + math.sin(a) * r * 0.55
        draw.ellipse((px - r * 0.52, py - r * 0.52, px + r * 0.52, py + r * 0.52), fill=HIBISCUS)
    draw.ellipse((cx - r * 0.28, cy - r * 0.28, cx + r * 0.28, cy + r * 0.28), fill=HIBISCUS_DARK)
    draw.line((cx, cy, cx + r * 0.5, cy - r * 0.62), fill=(250, 220, 120), width=max(2, int(r * 0.08)))
    for k in range(3):
        draw.ellipse((cx + r * (0.42 + 0.06 * k) - r * 0.07, cy - r * (0.6 + 0.05 * k) - r * 0.07,
                      cx + r * (0.42 + 0.06 * k) + r * 0.07, cy - r * (0.6 + 0.05 * k) + r * 0.07), fill=K.GOLD)


def dog_face(draw, cx, cy, r):
    brown, dark = (196, 136, 80), (130, 84, 50)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.7, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.5),
                     fill=dark)
    draw.ellipse((cx - r * 0.85, cy - r * 0.85, cx + r * 0.85, cy + r * 0.85), fill=brown)
    draw.ellipse((cx - r * 0.42, cy + r * 0.02, cx + r * 0.42, cy + r * 0.66), fill=(240, 214, 180))
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.34 - r * 0.1, cy - r * 0.3, cx + sx * r * 0.34 + r * 0.1, cy - r * 0.1),
                     fill=K.DEV_DEEP)
    draw.ellipse((cx - r * 0.16, cy + r * 0.08, cx + r * 0.16, cy + r * 0.3), fill=K.DEV_DEEP)
    draw.ellipse((cx - r * 0.1, cy + r * 0.44, cx + r * 0.1, cy + r * 0.66), fill=PINK)


PHOTO_BG = {"cat": SKY, "catball": (220, 242, 210), "catsleep": (236, 230, 250), "catsun": (255, 240, 204),
            "tree": SKY, "cake": (255, 226, 232), "car": (226, 232, 240), "beach": (200, 230, 250),
            "dog": (250, 236, 214), "dog2": (230, 240, 220), "flower": (232, 246, 226), "grass": SKY,
            "face": (255, 236, 214), "rug": (226, 214, 200), "tinydark": DARK_ROOM, "sofa": (70, 66, 80),
            "hidden": (244, 232, 214), "dark": DARK_ROOM, "bright": (236, 244, 252)}


def photo(draw, box, kind, t=0.0, frame=True):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    mx = (x0 + x1) / 2
    k = min(bw, bh)
    if frame:
        draw.rounded_rectangle((x0 + 2, y0 + 6, x1 + 14, y1 + 18), radius=12, fill=K.SHADOW)
        draw.rounded_rectangle((x0 - 8, y0 - 8, x1 + 8, y1 + 8), radius=12, fill=(255, 255, 255))
    bg = PHOTO_BG.get(kind, SKY)
    draw.rectangle(box, fill=bg)
    if kind in ("cat", "catball", "catsleep", "catsun", "grass"):
        floor = GRASS if kind in ("catball", "grass") else shade(bg, 0.9)
        draw.rectangle((x0, y1 - bh * 0.2, x1, y1), fill=floor)
        if kind == "catsun":
            draw.ellipse((x1 - k * 0.3, y0 + k * 0.06, x1 - k * 0.08, y0 + k * 0.28), fill=K.GOLD)
        s = min(bh / 350, bw / 320)
        cat(draw, mx - 12 * s, y1 - bh * 0.08, s, closed=(kind == "catsleep"), shadow=False, t=t)
        if kind == "catball":
            r = k * 0.09
            draw.ellipse((x0 + bw * 0.14 - r, y1 - bh * 0.1 - 2 * r, x0 + bw * 0.14 + r, y1 - bh * 0.1),
                         fill=RED_BALL)
    elif kind == "tree":
        draw.rectangle((x0, y1 - bh * 0.22, x1, y1), fill=GRASS)
        draw.rectangle((mx - k * 0.06, y1 - bh * 0.5, mx + k * 0.06, y1 - bh * 0.16), fill=WOOD_DARK)
        for dx, dy, rr in ((-0.14, -0.58, 0.2), (0.14, -0.58, 0.2), (0, -0.72, 0.22)):
            ccx, ccy = mx + bw * dx, y1 + bh * dy
            draw.ellipse((ccx - k * rr, ccy - k * rr, ccx + k * rr, ccy + k * rr), fill=K.LEAF)
    elif kind == "cake":
        draw.rectangle((mx - k * 0.32, y1 - bh * 0.42, mx + k * 0.32, y1 - bh * 0.14), fill=(250, 214, 150))
        draw.rectangle((mx - k * 0.32, y1 - bh * 0.42, mx + k * 0.32, y1 - bh * 0.34), fill=(255, 150, 180))
        draw.rectangle((mx - k * 0.03, y1 - bh * 0.58, mx + k * 0.03, y1 - bh * 0.42), fill=K.BOT)
        draw.ellipse((mx - k * 0.04, y1 - bh * 0.68, mx + k * 0.04, y1 - bh * 0.57), fill=K.GOLD)
    elif kind == "car":
        draw.rectangle((x0, y1 - bh * 0.24, x1, y1), fill=(150, 156, 170))
        cy_ = y1 - bh * 0.36
        draw.rounded_rectangle((mx - k * 0.38, cy_ - k * 0.12, mx + k * 0.38, cy_ + k * 0.08), radius=k * 0.06,
                               fill=K.ROAD)
        draw.polygon([(mx - k * 0.22, cy_ - k * 0.12), (mx - k * 0.12, cy_ - k * 0.28), (mx + k * 0.14, cy_ - k * 0.28),
                      (mx + k * 0.24, cy_ - k * 0.12)], fill=K.ROAD)
        for sx in (-1, 1):
            draw.ellipse((mx + sx * k * 0.22 - k * 0.09, cy_ - k * 0.01, mx + sx * k * 0.22 + k * 0.09,
                          cy_ + k * 0.17), fill=K.DEV_DARK)
    elif kind == "beach":
        draw.rectangle((x0, y0 + bh * 0.45, x1, y0 + bh * 0.65), fill=K.WATER_DEEP)
        draw.rectangle((x0, y0 + bh * 0.65, x1, y1), fill=(246, 220, 160))
        draw.ellipse((x0 + bw * 0.62, y0 + bh * 0.1, x0 + bw * 0.62 + k * 0.22, y0 + bh * 0.1 + k * 0.22),
                     fill=K.GOLD)
    elif kind in ("dog", "dog2"):
        draw.rectangle((x0, y1 - bh * 0.2, x1, y1), fill=shade(bg, 0.9))
        dog_face(draw, mx, y0 + bh * 0.5, k * 0.3)
    elif kind == "flower":
        draw.line((mx, y0 + bh * 0.5, mx, y1), fill=K.LEAF, width=max(2, int(k * 0.05)))
        hibiscus(draw, mx, y0 + bh * 0.42, k * 0.3, t)
    elif kind == "face":
        s = min(bh / 240, bw / 230)
        cat_head(draw, mx, y0 + bh * 0.58, s)
    elif kind == "rug":
        draw.rectangle((x0, y1 - bh * 0.32, x1, y1), fill=shade(bg, 0.86))
        draw.ellipse((x0 + bw * 0.1, y1 - bh * 0.26, x1 - bw * 0.1, y1 - bh * 0.02), fill=(252, 252, 250))
        s = min(bh / 380, bw / 340)
        cat(draw, mx - 10 * s, y1 - bh * 0.1, s, shadow=False, t=t)
    elif kind == "tinydark":
        draw.rectangle((x0, y1 - bh * 0.3, x1, y1), fill=(52, 54, 66))
        draw.rectangle((x0 + bw * 0.1, y0 + bh * 0.12, x0 + bw * 0.34, y0 + bh * 0.4), fill=(58, 62, 80))
        s = min(bh, bw) / 1500
        cat(draw, x0 + bw * 0.7, y1 - bh * 0.24, s, col=(74, 70, 72), white=False, eye=(120, 120, 90), shadow=False)
    elif kind == "sofa":
        sofa(draw, (x0, y0, x1, y1))
        s = min(bh / 560, bw / 520)
        cat(draw, mx, y1 - bh * 0.3, s, col=CAT_BLACK, white=False, eye=(170, 160, 70), shadow=False)
    elif kind == "dark":
        draw.rectangle((x0, y1 - bh * 0.3, x1, y1), fill=(50, 52, 64))
        r = k * 0.2
        draw.ellipse((mx - r, y1 - bh * 0.3 - r * 1.4, mx + r, y1 - bh * 0.3 + r * 0.6), fill=(62, 62, 74))
    elif kind == "bright":
        draw.rectangle((x0, y1 - bh * 0.3, x1, y1), fill=GRASS)
        football(draw, mx, y1 - bh * 0.3 - k * 0.12, k * 0.2)


def sofa(draw, box):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    draw.rectangle(box, fill=(70, 66, 80))
    draw.rectangle((x0, y1 - bh * 0.12, x1, y1), fill=(58, 54, 66))
    draw.rounded_rectangle((x0 + bw * 0.06, y0 + bh * 0.22, x1 - bw * 0.06, y1 - bh * 0.3), radius=int(bw * 0.06),
                           fill=SOFA_TOP)
    draw.rounded_rectangle((x0 + bw * 0.02, y1 - bh * 0.42, x1 - bw * 0.02, y1 - bh * 0.14), radius=int(bw * 0.05),
                           fill=SOFA)
    for sx in (0, 1):
        ax = x0 + bw * 0.02 if sx == 0 else x1 - bw * 0.14
        draw.rounded_rectangle((ax, y0 + bh * 0.4, ax + bw * 0.12, y1 - bh * 0.14), radius=int(bw * 0.04), fill=SOFA)


def pixel_grid(draw, x0, y0, cell, hl=None, hl_col=K.CORAL):
    n = len(PIX)
    gap = max(1, cell * 0.09)
    draw.rectangle((x0 - 4, y0 - 4, x0 + n * cell + 4, y0 + n * cell + 4), fill=(236, 230, 220))
    for r, row in enumerate(PIX):
        for c, ch in enumerate(row):
            x, y = x0 + c * cell, y0 + r * cell
            draw.rectangle((x + gap / 2, y + gap / 2, x + cell - gap / 2, y + cell - gap / 2), fill=PIX_COL[ch])
    if hl:
        r, c = hl
        x, y = x0 + c * cell, y0 + r * cell
        draw.rectangle((x - 4, y - 4, x + cell + 4, y + cell + 4), outline=hl_col, width=6)


def table_top(draw, x0, x1, top):
    for lx in (x0 + 50, x1 - 80):
        draw.rectangle((lx, top + 60, lx + 30, top + 170), fill=WOOD_DARK)
    draw.rounded_rectangle((x0 + 8, top + 10, x1 + 8, top + 40), radius=12, fill=K.SHADOW)
    draw.rounded_rectangle((x0, top, x1, top + 30), radius=12, fill=WOOD)
    draw.rectangle((x0 + 24, top + 30, x1 - 24, top + 96), fill=WOOD_DARK)


def wand(draw, cx, cy, s):
    S = S_(s)
    draw.line((cx - S(70), cy + S(70), cx + S(30), cy - S(30)), fill=K.DEV_DARK, width=max(3, int(S(16))))
    K.draw_star(draw, cx + S(44), cy - S(44), S(40), K.GOLD, rot=0.2)


def scan_brackets(draw, box, col, width=6, arm=40):
    x0, y0, x1, y1 = box
    for (ax, ay, dx, dy) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        draw.line((ax, ay, ax + dx * arm, ay), fill=col, width=width)
        draw.line((ax, ay, ax, ay + dy * arm), fill=col, width=width)


# ---------------------------------------------------------------------------

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

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def phone_grid(pcx, pcy, s, kinds, search=None, typed=1.0, n_shown=None, checks=False, missing=None):
        S = S_(s)
        sx0, sy0, sx1, sy1 = phone(draw, pcx, pcy, s)
        y = sy0 + S(12)
        if search is not None:
            bar = (sx0 + S(12), y, sx1 - S(12), y + S(58))
            draw.rounded_rectangle(bar, radius=S(29), fill=(244, 241, 236), outline=line, width=2)
            K.draw_magnifier(draw, bar[0] + S(34), bar[1] + S(26), 0.13 * s, coral)
            shown = search[: int(round(len(search) * K.clamp01(typed)))]
            f = font(int(S(34)), bold=True)
            draw.text((bar[0] + S(70), bar[1] + S(9)), shown, fill=ink, font=f)
            if typed < 1.0 or int(t * 6) % 2 == 0:
                tx = draw.textbbox((bar[0] + S(70), bar[1] + S(9)), shown or " ", font=f)[2] + 4 if shown \
                    else bar[0] + S(72)
                draw.line((tx, bar[1] + S(12), tx, bar[3] - S(12)), fill=coral, width=3)
            y += S(72)
        gap = S(10)
        cw = (sx1 - sx0 - 2 * S(12) - 2 * gap) / 3
        ch = (sy1 - S(12) - y - 2 * gap) / 3
        for i, kind in enumerate(kinds):
            a = 1.0 if n_shown is None else K.ease_out_cubic(K.clamp01((n_shown - i) * 2.5))
            if a <= 0:
                continue
            r, c = divmod(i, 3)
            bx0 = sx0 + S(12) + c * (cw + gap)
            by0 = y + r * (ch + gap)
            pad = (1 - a) * cw * 0.3
            box = (bx0 + pad, by0 + pad, bx0 + cw - pad, by0 + ch - pad)
            if missing == i:
                draw.rectangle(box, fill=coral_soft)
                for (p, q) in (((box[0], box[1]), (box[2], box[1])), ((box[2], box[1]), (box[2], box[3])),
                               ((box[2], box[3]), (box[0], box[3])), ((box[0], box[3]), (box[0], box[1]))):
                    K.draw_dashed(draw, p[0], p[1], q[0], q[1], coral, width=4, dash=12, gap=8, phase=t * 60)
                K.text_at(draw, "?", (box[0] + box[2]) / 2, box[1] + ch * 0.18, font(int(S(70) + 10 * pulse), bold=True),
                          coral)
                continue
            photo(draw, box, kind, t, frame=False)
            if checks and a > 0.9:
                K.draw_check(draw, box[2] - S(18), box[1] + S(18), S(15), sage)
        return sx0, sy0, sx1, sy1

    mixed = ["cat", "tree", "cake", "catball", "car", "beach", "catsleep", "dog", "flower"]
    cats = ["cat", "catball", "catsleep", "catsun", "cat", "catball", "catsleep", "catsun", "cat"]

    # ---- opening -----------------------------------------------------------
    if visual == "b11-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 320), 450, 110, sage, panel, bounce)
            kabir(draw, cx + 170, 410, 1.0, t)
            cat(draw, cx + 390, 610, 0.72, t=t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            stars_around(320, 620)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · PRACTICE MAKES PERFECT", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("Practice", coral, coral_soft), ("Test on new", K.BOTH_COLOR, lav_soft), ("Better!", sage, sage_soft)]
            for i, (lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 510 + int((1 - a) * 40)
                draw.ellipse((x - 105, y - 105, x + 105, y + 105), fill=soft)
                if i == 0:
                    for k in range(3):
                        photo(draw, (x - 62 + k * 14, y - 64 + k * 14, x + 18 + k * 14, y + 6 + k * 14), "cat",
                              frame=True)
                elif i == 1:
                    photo(draw, (x - 54, y - 50, x + 54, y + 50), "catsun", frame=True)
                    K.text_at(draw, "NEW", x, y - 96, font(28, bold=True), K.BOTH_COLOR)
                else:
                    for k in range(3):
                        bh_ = 40 + k * 36
                        draw.rounded_rectangle((x - 66 + k * 46, y + 60 - bh_, x - 30 + k * 46, y + 60), radius=8,
                                               fill=sage)
                    K.draw_arrow(draw, x - 70, y - 10, x + 60, y - 74, coral, width=8, head=24)
                K.text_at(draw, lab, x, y + 124, font(36, bold=True), col)
                if i < 2:
                    K.draw_arrow(draw, x + 122, y, x + 258, y, muted, width=8, head=22)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 730 + int((1 - a) * 20), "UNIT 2 · ALL DONE!", coral, size=38)
            return True
        if focus == "unit":
            draw.ellipse((500 - 250, 560 - 250, 500 + 250, 560 + 250), fill=blue_soft)
            icons = [(500, 440, "eye"), (370, 660, "ear"), (630, 660, "chat")]
            for k, (ix, iy, kind) in enumerate(icons):
                a = K.stagger(progress, k, step=0.12, speed=5)
                if a <= 0:
                    continue
                s = 0.85 * a
                if kind == "eye":
                    big_eye(draw, ix, iy, s, look=math.sin(t * 6))
                elif kind == "ear":
                    big_ear(draw, ix, iy, s * 0.9)
                else:
                    chat_icon(draw, ix, iy, s * 0.85, sage)
            K.pill(draw, 0, 290 + lift, "UNIT 3", coral, size=34, left=880)
            K.text_at(draw, "AI That Sees,", 1290, 370 + lift, font(80, bold=True), ink)
            K.text_at(draw, "Hears, and Talks", 1290, 466 + lift, font(80, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a > 0:
                    x = 1050 + i * 120
                    draw.rounded_rectangle((x - 46, 650, x + 46, 742), radius=22, fill=panel, outline=line, width=3)
                    K.text_at(draw, str(i + 1), x, 664, font(46, bold=True), coral if i == 0 else muted)
            K.text_at(draw, "5 chapters", 1290, 770, font(30, bold=True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 302 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Can Computers See?", cx, 362 + lift, font(88, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                photo(draw, (cx - 520, 620 + yy, cx - 320, 790 + yy), "cat")
                K.draw_arrow(draw, cx - 290, 705 + yy, cx - 180, 705 + yy, muted, width=8, head=22)
                K.draw_device(draw, "laptop", cx, 720 + yy, 0.62, brand, t=t)
                K.draw_arrow(draw, cx + 180, 705 + yy, cx + 290, 705 + yy, muted, width=8, head=22)
                K.draw_bubble(draw, (cx + 320, 630 + yy, cx + 560, 760 + yy), brand, "cat?", tail="left", size=48)
            return True
        # eyes
        K.draw_device(draw, "laptop", cx, 600, 1.45, brand, t=t)
        big_eye(draw, cx, 520, 0.85, look=math.sin(t * 5))
        K.draw_cross(draw, cx + 120, 440, 34, K.DANGER)
        K.text_at(draw, "No eyeballs!", cx, 236, font(64, bold=True), coral)
        question_marks([(cx - 520, 380), (cx + 500, 360), (cx - 600, 600), (cx + 580, 580)])
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            K.pill(draw, cx, 790 + int((1 - a) * 20), "So how can it see?", K.BOTH_COLOR, size=36)
        return True

    # ---- Kabir & Coco -------------------------------------------------------------
    if visual == "b11-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 580 - 290, 560 + 290, 580 + 290), fill=blue_soft)
            kabir(draw, 460, 470, 1.25, t)
            cat(draw, 720, 830, 0.95, t=t)
            K.text_at(draw, "Meet", 1330, 270 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Kabir!", 1330, 340 + lift, font(124, bold=True), coral)
            K.pill(draw, 1330, 510, "and his cat, Coco", sage, size=38)
            for k, kind in enumerate(("catsleep", "cat", "catball")):
                a = K.stagger(progress, k + 1, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 1100 + k * 230
                y = 640 + int((1 - a) * 30) + (k % 2) * 20
                photo(draw, (x - 90, y, x + 90, y + 160), kind, t)
            return True
        if focus in ("search", "found"):
            kabir(draw, 420, 470, 1.2, t)
            cat(draw, 640, 840, 0.75, t=t)
            if focus == "search":
                phone_grid(1200, 560, 1.0, mixed, search="cat", typed=progress * 2.2)
            else:
                phone_grid(1200, 560, 1.0, cats, search="cat", n_shown=progress * 16 - 0.5, checks=True)
                K.pill(draw, 420, 236, "Whoosh!", coral, size=40)
                if progress > 0.5:
                    star_spots([(1530, 340), (1560, 620), (860, 360)])
            return True
        if focus == "ask":
            phone_grid(cx - 330, 560, 1.0, cats, search="cat", checks=True)
            big_eye(draw, cx + 330, 470, 1.1)
            K.draw_cross(draw, cx + 460, 380, 40, K.DANGER)
            K.text_at(draw, "No eyes!", cx + 330, 590, font(54, bold=True), K.DANGER)
            question_marks([(cx + 70, 300), (cx + 620, 620), (cx + 80, 640)])
            K.draw_stopwatch(draw, cx + 330, 760, 50, progress, brand)
            return True
        # missing
        cat(draw, 520, 820, 0.95, t=t)
        phone_grid(1080, 560, 1.0, cats, search="cat", checks=True, missing=7)
        K.draw_magnifier(draw, 1520, 440, 0.9, coral)
        K.pill(draw, 1560, 640, "Mystery!", K.BOTH_COLOR, size=40)
        question_marks([(400, 330), (700, 300)])
        return True

    # ---- pixels ------------------------------------------------------------------
    if visual == "b11-pixels":
        if focus == "zoom":
            fb = (170, 290, 730, 840)
            photo(draw, fb, "cat", t)
            draw.rectangle(fb, fill=SKY)
            draw.rectangle((fb[0], fb[3] - 110, fb[2], fb[3]), fill=shade(SKY, 0.9))
            cat(draw, 440, 810, 1.55, t=t, shadow=False)
            z = K.ease_in_out(K.clamp01(progress * 1.4))
            sq = (300, 330, 600, 630)
            draw.rectangle(sq, outline=coral, width=7)
            cell = K.lerp(6, 34, z)
            n = len(PIX)
            gx, gy = 1330 - n * cell / 2, 565 - n * cell / 2
            K.draw_dashed(draw, sq[2], sq[1], gx, gy, coral, width=4, phase=t * 100)
            K.draw_dashed(draw, sq[2], sq[3], gx, gy + n * cell, coral, width=4, phase=t * 100)
            pixel_grid(draw, gx, gy, cell)
            K.draw_magnifier(draw, 1700, 330, 0.6, coral)
            return True
        if focus == "dots":
            gx, gy, cell = 190, 286, 36
            pixel_grid(draw, gx, gy, cell, hl=(8, 3))
            hx, hy = gx + 3 * cell + cell, gy + 8 * cell + cell / 2
            a = K.ease_out_cubic(K.clamp01(progress * 2.5))
            K.draw_arrow(draw, hx + 10, hy, hx + 10 + (1010 - hx - 10) * a, 430, coral, width=8, head=26)
            if a > 0.6:
                draw.rounded_rectangle((1040 + 8, 300 + 10, 1220 + 8, 480 + 10), radius=16, fill=K.SHADOW)
                draw.rounded_rectangle((1040, 300, 1220, 480), radius=16, fill=CAT_EYE, outline=coral, width=7)
                draw.text((1260, 320), "1 pixel", fill=coral, font=font(64, bold=True))
                draw.text((1260, 410), "one tiny dot", fill=ink, font=font(40, bold=True))
            b = K.stagger(progress, 4, step=0.12, speed=4)
            if b > 0:
                y = 590 + int((1 - b) * 20)
                draw.rounded_rectangle((1000, y, 1760, y + 230), radius=36, fill=lav_soft, outline=K.BOTH_COLOR, width=4)
                for k in range(5):
                    for j in range(3):
                        col = [coral, sage, K.GOLD, K.BOT, PINK][(k + j) % 5]
                        draw.rectangle((1040 + k * 40, y + 40 + j * 40, 1072 + k * 40, y + 72 + j * 40), fill=col)
                draw.text((1270, y + 50), "Thousands of", fill=ink, font=font(44, bold=True))
                draw.text((1270, y + 112), "pixels = 1 photo", fill=K.BOTH_COLOR, font=font(44, bold=True))
            return True
        # notcat
        gx, gy, cell = 170, 330, 28
        pixel_grid(draw, gx, gy, cell)
        swatches = [("Orange", GINGER, (7, 3)), ("White", FUR_WHITE, (12, 7)), ("Black", (60, 50, 50), (9, 12))]
        K.draw_device(draw, "laptop", 1390, 720, 0.9, brand, t=t)
        draw.rounded_rectangle((1000 + 8, 250 + 10, 1780 + 8, 560 + 10), radius=40, fill=K.SHADOW)
        draw.rounded_rectangle((1000, 250, 1780, 560), radius=40, fill=panel, outline=ink, width=4)
        for k in range(3):
            r_ = 12 + k * 6
            bx_, by_ = 1390 - k * 30, 600 + k * 22
            draw.ellipse((bx_ - r_, by_ - r_, bx_ + r_, by_ + r_), fill=panel, outline=ink, width=3)
        for i, (lab, col, (r, c)) in enumerate(swatches):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 290 + i * 86
            draw.rounded_rectangle((1050, y, 1112, y + 62), radius=10, fill=col, outline=K.DEV_DARK, width=3)
            draw.text((1140, y + 6), lab + " dot", fill=ink, font=font(42, bold=True))
            px_, py_ = gx + c * cell + cell / 2, gy + r * cell + cell / 2
            draw.ellipse((px_ - 20, py_ - 20, px_ + 20, py_ + 20), outline=coral, width=5)
        b = K.stagger(progress, 4, step=0.12, speed=4)
        if b > 0:
            bx = K.pill(draw, 1610, 300, "cat?", muted, size=38)
            K.draw_cross(draw, bx[2] - 4, bx[1] + 4, 20, K.DANGER)
        return True

    # ---- patterns ------------------------------------------------------------------
    if visual == "b11-pattern":
        if focus == "name":
            K.text_at(draw, "PATTERN", cx, 250 + lift, font(104, bold=True), coral)
            K.text_at(draw, "something that shows up again and again", cx, 386 + lift, font(44, bold=True), muted)
            n = 7
            for i in range(n):
                a = K.stagger(progress, i, step=0.08, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - (n - 1) / 2) * 200
                y = 600 + int((1 - a) * 40)
                if i == n - 1:
                    draw.rounded_rectangle((x - 80, y - 80, x + 80, y + 80), radius=24, fill=coral_soft)
                    K.text_at(draw, "?", x, y - 70, font(int(110 + 14 * pulse), bold=True), coral)
                elif i % 2 == 0:
                    football(draw, x, y, 70)
                else:
                    cat_head(draw, x, y + 20, 0.62)
            a = K.stagger(progress, 8, step=0.08, speed=4)
            if a > 0:
                K.pill(draw, cx, 760 + int((1 - a) * 20), "Ball, cat, ball, cat… again and again!", sage, size=34)
            return True
        if focus == "clues":
            specs = [("Edges", "where colour changes", coral, coral_soft), ("Shapes", "round or pointy", K.BOTH_COLOR,
                                                                               lav_soft),
                     ("Colours", "orange, white…", sage, sage_soft)]
            for i, (title, sub, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                x0 = 150 + i * 560
                y0 = 260 + int((1 - a) * 50)
                draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 508, y0 + 590), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 500, y0 + 580), radius=40, fill=soft, outline=col, width=5)
                K.text_at(draw, title, x0 + 250, y0 + 36, font(58, bold=True), col)
                ix, iy = x0 + 250, y0 + 290
                if i == 0:
                    draw.rectangle((ix - 150, iy - 120, ix, iy + 110), fill=(60, 50, 50))
                    draw.rectangle((ix, iy - 120, ix + 150, iy + 110), fill=GINGER)
                    glow = 8 + 4 * pulse
                    draw.line((ix, iy - 130, ix, iy + 120), fill=K.GOLD, width=int(glow))
                    K.draw_arrow(draw, ix + 110, iy - 160, ix + 14, iy - 70, coral, width=7, head=22)
                elif i == 1:
                    draw.ellipse((ix - 170, iy - 80, ix - 10, iy + 80), fill=K.BOTH_COLOR)
                    draw.polygon([(ix + 20, iy + 80), (ix + 100, iy - 90), (ix + 180, iy + 80)], fill=coral)
                else:
                    for k, col_ in enumerate((GINGER, FUR_WHITE, (60, 50, 50), PINK)):
                        r_, c_ = divmod(k, 2)
                        sx_, sy_ = ix - 120 + c_ * 130, iy - 110 + r_ * 120
                        draw.rounded_rectangle((sx_, sy_, sx_ + 110, sy_ + 100), radius=18, fill=col_,
                                               outline=K.DEV_DARK, width=3)
                K.text_at(draw, sub, x0 + 250, y0 + 490, font(36, bold=True), ink)
            return True
        if focus == "ball":
            balls = [("Cricket ball", cricket_ball), ("Football", football), ("Tennis ball", tennis_ball)]
            for i, (lab, fn) in enumerate(balls):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 470
                y = 500 + int((1 - a) * 40)
                fn(draw, x, y, 120)
                rr = 150
                a0 = t * 200 + i * 40
                for k in range(12):
                    s0 = a0 + k * 30
                    draw.arc((x - rr, y - rr, x + rr, y + rr), s0, s0 + 18, fill=coral, width=7)
                K.text_at(draw, lab, x, y + 176, font(40, bold=True), ink)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 790 + int((1 - a) * 20), "Round, round, round!", coral, size=38)
            return True
        # cat
        draw.ellipse((600 - 300, 590 - 300, 600 + 300, 590 + 300), fill=blue_soft)
        s = 1.6
        ccx, cby = 580, 840
        cat(draw, ccx, cby, s, t=t)
        hy = cby - 196 * s
        feats = [("Pointy ears", (ccx + 64 * s, hy - 98 * s)), ("Whiskers", (ccx + 100 * s, hy + 24 * s)),
                 ("Two eyes", (ccx + 34 * s, hy - 12 * s)), ("Furry body", (ccx + 70 * s, cby - 100 * s))]
        for i, (lab, (fx, fy)) in enumerate(feats):
            a = K.stagger(progress, i, step=0.14, speed=5)
            if a <= 0:
                continue
            ly = 290 + i * 110
            K.draw_dashed(draw, 1040, ly + 34, fx, fy, coral, width=4, phase=t * 80)
            draw.ellipse((fx - 10, fy - 10, fx + 10, fy + 10), fill=coral)
            bx = K.pill(draw, 0, ly, lab, panel, size=38, fg=ink, left=1040)
            draw.rounded_rectangle(bx, radius=(bx[3] - bx[1]) // 2, outline=coral, width=4)
            K.draw_check(draw, bx[2] + 40, (bx[1] + bx[3]) / 2, 22, sage)
        a = K.stagger(progress, 5, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1340, 770 + int((1 - a) * 20), "Maybe a cat!", sage, size=46)
        return True

    # ---- learning from examples ----------------------------------------------------------
    if visual == "b11-learn":
        if focus == "examples":
            K.draw_device(draw, "laptop", 1420, 600, 1.15, brand, t=t)
            K.draw_spinner(draw, 1420, 545, 50, t, sage)
            kinds = ["cat", "catsun", "catball", "catsleep", "rug", "face"]
            for k in range(6):
                ph = (t * 1.2 + k / 6) % 1.0
                x = K.lerp(160, 1080, ph)
                y = 560 + 120 * math.sin(ph * math.pi * 2 + k) * (1 - ph)
                photo(draw, (x - 80, y - 70, x + 80, y + 70), kinds[k], t)
            K.text_at(draw, "Example after example…", 620, 250, font(50, bold=True), ink)
            K.pill(draw, 1420, 800, "1000s of cats!", coral, size=36)
            return True
        if focus == "bottles":
            draw.rounded_rectangle((120 + 8, 250 + 10, 1000 + 8, 860 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((120, 250, 1000, 860), radius=36, fill=panel, outline=line, width=3)
            specs = [((160, 210, 246), K.CORAL, 1.0), ((255, 200, 120), sage, 0.7), ((200, 240, 210), K.BOT, 1.2),
                     ((246, 190, 210), K.GOLD, 0.8), ((210, 220, 250), K.DANGER, 0.9), ((255, 230, 150), K.BOTH_COLOR, 1.1),
                     ((190, 230, 240), coral, 0.75), ((230, 210, 250), sage, 1.0)]
            for i, (col, cap, tall) in enumerate(specs):
                a = K.stagger(progress, i, step=0.06, speed=5)
                if a <= 0:
                    continue
                r, c = divmod(i, 4)
                x = 230 + c * 210
                by = 530 + r * 300 + int((1 - a) * 30)
                bottle(draw, x, by, 0.78 * (0.85 + 0.15 * tall), col, cap, tall=tall)
            a = K.ease_out_cubic(K.clamp01((progress - 0.45) * 3))
            if a > 0:
                K.draw_arrow(draw, 1030, 555, 1030 + 130 * a, 555, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.55) * 3))
            if b > 0:
                K.shadow_card(draw, (1200, 260, 1790, 850), brand, radius=36, outline=coral, outline_w=6)
                K.text_at(draw, "PATTERN", 1495, 290, font(46, bold=True), coral)
                bx, bby = 1400, 720
                hb = 190
                pts = [(bx - 46, bby), (bx + 46, bby), (bx + 46, bby - hb + 20), (bx + 22, bby - hb - 28),
                       (bx + 22, bby - hb - 72), (bx - 22, bby - hb - 72), (bx - 22, bby - hb - 28), (bx - 46, bby - hb + 20),
                       (bx - 46, bby)]
                for p, q in zip(pts, pts[1:]):
                    K.draw_dashed(draw, p[0], p[1], q[0], q[1], K.BOTH_COLOR, width=6, dash=16, gap=10, phase=t * 80)
                draw.rectangle((bx - 22, bby - hb - 72, bx + 22, bby - hb - 40), fill=coral)
                draw.text((1490, 400), "cap on", fill=ink, font=font(40, bold=True))
                draw.text((1490, 446), "top", fill=ink, font=font(40, bold=True))
                draw.text((1490, 600), "tall", fill=ink, font=font(40, bold=True))
                draw.text((1490, 646), "shape", fill=ink, font=font(40, bold=True))
            return True
        if focus == "define":
            K.shadow_card(draw, (200, 250 + lift, w - 200, 850 + lift), brand, radius=40, accent=coral)
            big_eye(draw, 380, 390 + lift, 0.55, look=math.sin(t * 6))
            K.text_at(draw, "COMPUTER VISION", cx + 60, 330 + lift, font(84, bold=True), coral)
            parts = [("A computer finds things", ink), ("in pictures, by matching", K.BOTH_COLOR),
                     ("patterns in the pixels.", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, cx, 480 + i * 106 + lift + int((1 - a) * 30), font(66, bold=True), col)
            return True
        # notmagic
        specs = [("Magic?", K.DANGER, K.DANGER_SOFT, False), ("Alive?", K.DANGER, K.DANGER_SOFT, False),
                 ("Patterns!", sage, sage_soft, True)]
        for i, (title, col, soft, ok) in enumerate(specs):
            a = K.stagger(progress, i, step=0.22, speed=4)
            if a <= 0:
                continue
            x0 = 150 + i * 560
            y0 = 270 + int((1 - a) * 50)
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 508, y0 + 570), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 500, y0 + 560), radius=40, fill=soft, outline=col, width=5)
            ix, iy = x0 + 250, y0 + 250
            if i == 0:
                wand(draw, ix, iy, 1.3)
            elif i == 1:
                K.draw_heart(draw, ix, iy - 20, 90, coral)
            else:
                pixel_grid(draw, ix - 120, iy - 140, 13)
                K.draw_magnifier(draw, ix + 60, iy + 30, 0.7, sage)
            if ok:
                K.draw_check(draw, x0 + 440, y0 + 60, 34, sage)
            else:
                K.draw_cross(draw, x0 + 440, y0 + 60, 34, K.DANGER)
            K.text_at(draw, title, ix, y0 + 450, font(58, bold=True), col)
        return True

    # ---- object spotting -------------------------------------------------------------
    if visual == "b11-spot":
        ans = focus == "answer"
        draw.rounded_rectangle((180, 240, 1740, 690), radius=30, fill=(250, 240, 226))
        draw.rectangle((1380, 280, 1640, 520), fill=SKY, outline=WOOD_DARK, width=8)
        draw.line((1510, 280, 1510, 520), fill=WOOD_DARK, width=6)
        draw.line((1380, 400, 1640, 400), fill=WOOD_DARK, width=6)
        table_top(draw, 240, 1680, 690)
        football(draw, 520, 600, 90)
        bottle(draw, 900, 690, 1.15)
        book(draw, 1300, 690, 1.0, K.BOT)
        book(draw, 1310, 634, 0.9, coral)
        items = [("BALL", "round", (410, 490, 630, 700), 520), ("BOTTLE", "tall + cap", (830, 350, 980, 700), 905),
                 ("BOOK", "pages", (1150, 560, 1450, 700), 1300)]
        cols = [coral, K.BOTH_COLOR, sage]
        for i, (lab, clue, box, mx) in enumerate(items):
            if not ans:
                K.pill(draw, mx, box[1] - 80 + int(6 * math.sin(t * 8 + i)), "?", K.BOTH_COLOR, size=36)
                continue
            a = K.stagger(progress, i, step=0.22, speed=5)
            if a <= 0:
                continue
            col = cols[i]
            pad = (1 - a) * 30
            bx = (box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad)
            draw.rectangle(bx, outline=col, width=7)
            K.pill(draw, 0, bx[1] - 58, lab, col, size=32, left=bx[0] - 3)
            K.text_at(draw, clue, mx, 734, font(34, bold=True), (255, 255, 255))
        if not ans:
            K.draw_stopwatch(draw, 1240, 340, 46, progress, brand)
        return True

    # ---- vision around you -------------------------------------------------------------
    if visual == "b11-around":
        specs = [("Face unlock", "matches your face", coral), ("Photo groups", "dogs, beach, cats", K.BOTH_COLOR),
                 ("Flower finder", "names a flower", sage)]
        n = {"face": 1, "group": 2, "flower": 3}[focus]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        y0 = 250
        for i, (title, sub, col) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            if i >= n:
                draw.rounded_rectangle((x0, y0, x0 + cw, 860), radius=36, fill=(246, 241, 233), outline=line, width=3)
                K.text_at(draw, "?", x0 + cw / 2, 470, font(120, bold=True), line)
                continue
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, y0 + yy, x0 + cw, 860 + yy), brand, radius=36, outline=col if active else line,
                          outline_w=6 if active else 3)
            ib = (x0 + 24, y0 + 24 + yy, x0 + cw - 24, y0 + 390 + yy)
            mx, my = x0 + cw / 2, (ib[1] + ib[3]) / 2
            draw.rounded_rectangle(ib, radius=24, fill=[coral_soft, lav_soft, sage_soft][i])
            if i == 0:
                sb = phone(draw, mx, my, 0.56)
                K.draw_face(draw, mx, my - 6, 56, "kid", 1.0)
                scan_brackets(draw, (sb[0] + 14, sb[1] + 30, sb[2] - 14, sb[3] - 40), sage, width=5, arm=28)
                sy = sb[1] + 40 + (sb[3] - sb[1] - 90) * (0.5 + 0.5 * math.sin(t * 6))
                draw.line((sb[0] + 20, sy, sb[2] - 20, sy), fill=sage, width=4)
                for px_, py_ in ((mx - 21, my - 9), (mx + 21, my - 9), (mx, my + 14)):
                    draw.ellipse((px_ - 6, py_ - 6, px_ + 6, py_ + 6), fill=coral)
                K.draw_padlock(draw, mx + 150, my + 70, 0.36, sage, open_t=K.clamp01(progress * 2 - 0.6) if active else 1)
            elif i == 1:
                for k, (kind, lab) in enumerate((("dog", "Dogs"), ("beach", "Beach"), ("cat", "Cats"))):
                    fx = ib[0] + 30 + k * 150
                    fy = ib[1] + 60
                    draw.rounded_rectangle((fx, fy - 18, fx + 60, fy + 4), radius=6, fill=K.GOLD)
                    draw.rounded_rectangle((fx, fy, fx + 130, fy + 200), radius=12, fill=K.GOLD)
                    photo(draw, (fx + 12, fy + 14, fx + 118, fy + 120), kind, t, frame=False)
                    photo(draw, (fx + 12, fy + 126, fx + 118, fy + 186), kind if kind != "dog" else "dog2", t,
                          frame=False)
                    K.text_at(draw, lab, fx + 65, fy + 220, font(32, bold=True), ink)
            else:
                draw.line((mx - 60, ib[3] - 10, mx - 60, my + 10), fill=K.LEAF, width=10)
                draw.polygon([(mx - 60, my + 80), (mx - 140, my + 40), (mx - 90, my + 100)], fill=K.LEAF)
                hibiscus(draw, mx - 60, my - 20, 80, t)
                sb = phone(draw, mx + 110, my + 20, 0.42)
                photo(draw, sb, "flower", t, frame=False)
                if progress > 0.5 or not active:
                    K.pill(draw, mx + 110, ib[1] + 16, "Hibiscus!", sage, size=28)
            K.text_at(draw, title, mx, y0 + 418 + yy, font(48, bold=True), col)
            K.text_at(draw, sub, mx, y0 + 484 + yy, font(34, bold=True), muted)
        return True

    # ---- what fools it ----------------------------------------------------------------
    if visual == "b11-fool":
        if focus == "intro":
            photo(draw, (240, 300, 820, 760), "tinydark", t)
            K.draw_device(draw, "laptop", 1240, 660, 1.0, brand, t=t)
            K.draw_bubble(draw, (1020, 270, 1680, 450), brand, "Is that… a potato?", tail="left", size=48)
            K.text_at(draw, "?", 1700, 560, font(int(100 + 20 * pulse), bold=True), K.GOLD)
            K.pill(draw, cx, 800, "Computers can be wrong!", K.DANGER, size=40)
            return True
        if focus in ("dark", "angle", "hidden"):
            specs = [("Dark light", "edges disappear", K.BOTH_COLOR), ("Odd angle, tiny", "a ball becomes a dot", coral),
                     ("Partly hidden", "only half the pattern", sage)]
            n = {"dark": 1, "angle": 2, "hidden": 3}[focus]
            cw, gap = 520, 40
            x_start = cx - (3 * cw + 2 * gap) / 2
            y0 = 250
            for i, (title, sub, col) in enumerate(specs):
                x0 = x_start + i * (cw + gap)
                if i >= n:
                    draw.rounded_rectangle((x0, y0, x0 + cw, 860), radius=36, fill=(246, 241, 233), outline=line, width=3)
                    K.text_at(draw, "?", x0 + cw / 2, 470, font(120, bold=True), line)
                    continue
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                yy = int((1 - a) * 40)
                K.shadow_card(draw, (x0, y0 + yy, x0 + cw, 860 + yy), brand, radius=36, outline=col if active else line,
                              outline_w=6 if active else 3)
                ib = (x0 + 24, y0 + 24 + yy, x0 + cw - 24, y0 + 390 + yy)
                mx, my = x0 + cw / 2, (ib[1] + ib[3]) / 2
                if i == 0:
                    draw.rounded_rectangle(ib, radius=24, fill=DARK_ROOM)
                    draw.rectangle((ib[0], ib[3] - 110, ib[2], ib[3] - 20), fill=(50, 52, 64))
                    draw.ellipse((mx - 70, ib[3] - 230, mx + 70, ib[3] - 90), fill=(60, 60, 72))
                    draw.text((ib[0] + 24, ib[1] + 20), "edges?", fill=(150, 150, 170), font=font(34, bold=True))
                    draw.ellipse((ib[2] - 80, ib[1] + 20, ib[2] - 30, ib[1] + 70), fill=(220, 220, 236))
                elif i == 1:
                    draw.rounded_rectangle(ib, radius=24, fill=SKY)
                    draw.rectangle((ib[0], my - 10, ib[2], ib[3] - 24), fill=GRASS)
                    draw.rounded_rectangle((ib[0], ib[3] - 40, ib[2], ib[3]), radius=20, fill=GRASS)
                    fx, fy = ib[0] + 110, my + 20
                    draw.ellipse((fx - 7, fy - 7, fx + 7, fy + 7), fill=(255, 255, 255))
                    draw.ellipse((fx - 30, fy - 30, fx + 30, fy + 30), outline=coral, width=4)
                    draw.text((fx - 50, fy + 40), "a dot?", fill=ink, font=font(30, bold=True))
                    bx_, by_ = ib[2] - 120, my - 30
                    draw.ellipse((bx_ - 70, by_ - 70, bx_ + 70, by_ + 70), fill=(160, 210, 246), outline=K.DEV_DARK,
                                 width=5)
                    draw.ellipse((bx_ - 30, by_ - 30, bx_ + 30, by_ + 30), fill=K.CORAL, outline=K.DEV_DARK, width=4)
                    draw.text((bx_ - 80, by_ + 82), "from top", fill=ink, font=font(28, bold=True))
                else:
                    draw.rounded_rectangle(ib, radius=24, fill=(244, 232, 214))
                    bottle(draw, mx + 60, ib[3] - 40, 1.0)
                    K.draw_bag(draw, mx - 20, ib[3] - 140, 1.15, K.BOT)
                K.text_at(draw, title, mx, y0 + 418 + yy, font(46, bold=True), col)
                K.text_at(draw, sub, mx, y0 + 484 + yy, font(34, bold=True), muted)
            return True
        # mystery
        ans = focus == "mysteryanswer"
        pb = (170, 280, 900, 820)
        photo(draw, pb, "hidden", t)
        draw.rectangle((pb[0], pb[3] - 120, pb[2], pb[3]), fill=(226, 206, 180))
        ccx = 600
        cat(draw, ccx, 760, 1.25, t=t, shadow=False)
        K.draw_bag(draw, 500, 640, 1.9, coral)
        hy = 760 - 196 * 1.25
        if ans:
            dashed_box((ccx + 20, hy - 140, ccx + 130, hy - 10), K.BOTH_COLOR, width=4)
            dashed_box((ccx + 100, 560, ccx + 200, 740), K.BOTH_COLOR, width=4)
        K.draw_bubble(draw, (1010, 260, 1720, 400), brand, "No cat found!" if ans or progress > 0.2 else "Searching…",
                      tail="left", size=46)
        if not ans:
            question_marks([(1100, 520), (1600, 560)], size=96)
            K.draw_stopwatch(draw, 1360, 620, 60, progress, brand)
        else:
            K.text_at(draw, "Cat pattern", 1365, 450, font(42, bold=True), ink)
            rows = [("Pointy ears", "only 1"), ("Two eyes", "hidden"), ("Whiskers", "hidden"), ("Furry body", "hidden")]
            for i, (lab, note) in enumerate(rows):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                y = 520 + i * 74
                draw.rounded_rectangle((1040, y, 1700, y + 62), radius=31, fill=K.DANGER_SOFT)
                draw.text((1070, y + 10), lab, fill=ink, font=font(36, bold=True))
                draw.text((1390, y + 12), note, fill=K.DANGER, font=font(32, bold=True))
                K.draw_cross(draw, 1664, y + 31, 20, K.DANGER)
        return True

    # ---- which photo is hardest ---------------------------------------------------------
    if visual == "b11-harder":
        ans = focus == "answer"
        cards = [("grass", ("Bright cat", "on green grass")), ("face", ("Big, clear", "cat face")),
                 ("rug", ("Cat on a white", "rug, in daylight")), ("tinydark", ("Tiny cat, far", "away, dark room"))]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab) in enumerate(cards):
            x0 = x_start + i * (cw + gap)
            win = ans and i == 3
            dim = ans and i != 3
            K.shadow_card(draw, (x0, 300, x0 + cw, 840), brand, radius=30, outline=coral if win else None,
                          outline_w=7 if win else 3)
            if win:
                draw.rounded_rectangle((x0 + 6, 306, x0 + cw - 6, 834), radius=26, fill=coral_soft)
            photo(draw, (x0 + 30, 376, x0 + cw - 30, 656), kind, t, frame=False)
            label_lines(lab, x0 + cw / 2, 694, size=36, col=muted if dim else ink)
            if win:
                K.pill(draw, x0 + cw / 2, 316, "HARDEST", coral, size=30)
            elif dim:
                K.pill(draw, x0 + cw / 2, 316, "easier", (170, 176, 186), size=26)
            else:
                K.pill(draw, x0 + cw / 2, 316, "?", K.BOTH_COLOR, size=30)
        if ans:
            K.pill(draw, cx, 226, "Tiny + dark = very few dots, no edges", ink, size=32)
        else:
            K.pill(draw, cx - 40, 226, "Hardest to spot the cat?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 270, 256, 32, progress, brand)
        return True

    # ---- checkpoint ----------------------------------------------------------------------
    if visual == "b11-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 270 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like a computer!", cx, 430 + lift, font(60, bold=True), ink)
            pixel_grid(draw, cx - 96, 540 + lift, 12)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 240 + 12, 1060 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 240, 1060, 870), radius=24, fill=(255, 250, 238))
        label_lines(("Why might a computer miss", "a black cat on a black sofa?"), 595, 270, size=44, col=coral)
        rows = ["Cat and sofa: same dark colour", "No edges to find in the pixels", "So the cat's shape is hidden"]
        for i, lab in enumerate(rows):
            y = 440 + i * 140
            draw.line((180, y + 96, 1010, y + 96), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.4 - 0.3 > i
            if shown:
                K.draw_check(draw, 206, y + 40, 24, sage)
                draw.text((246, y + 16), lab, fill=ink, font=font(40, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 595, y - 30, font(110, bold=True), line)
        pb = (1140, 300, 1770, 760)
        photo(draw, pb, "sofa", t)
        if ans:
            mx = (pb[0] + pb[2]) / 2
            s = min((pb[3] - pb[1]) / 560, (pb[2] - pb[0]) / 520)
            by = pb[3] - (pb[3] - pb[1]) * 0.3
            dashed_box((mx - 120 * s - 20, by - 320 * s, mx + 150 * s + 10, by + 16), K.GOLD, width=5)
            K.pill(draw, mx, 800, "Where are the edges?", K.BOTH_COLOR, size=32)
        else:
            K.text_at(draw, "?", pb[2] - 60, pb[1] + 10, font(int(90 + 16 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, (pb[0] + pb[2]) / 2, 820, 36, progress, brand)
        return True

    # ---- recap ---------------------------------------------------------------------------
    if visual == "b11-recap":
        recap = [(("Computers see", "pixels"), coral, "pixels"), (("Seeing = matching", "patterns"), K.BOTH_COLOR, "pattern"),
                 (("Learned from", "many examples"), sage, "examples"), (("Dark, tiny, hidden", "can fool it"), K.DANGER, "fool")]
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
                if kind == "pixels":
                    pixel_grid(draw, ix - 120, iy - 130, 15)
                elif kind == "pattern":
                    football(draw, ix - 80, iy - 50, 56)
                    cat_head(draw, ix + 80, iy - 20, 0.55)
                    K.text_at(draw, "round · pointy", ix, iy + 80, font(28, bold=True), K.BOTH_COLOR)
                elif kind == "examples":
                    for k in range(4):
                        photo(draw, (ix - 130 + k * 36, iy - 120 + k * 30, ix - 10 + k * 36, iy - 10 + k * 30),
                              ["cat", "catsun", "catball", "rug"][k], t)
                else:
                    photo(draw, (ix - 150, iy - 120, ix - 10, iy + 20), "dark", t)
                    photo(draw, (ix + 10, iy - 120, ix + 150, iy + 20), "tinydark", t)
                    K.draw_cross(draw, ix, iy + 70, 26, K.DANGER)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 320), 430, 110, sage, panel, bounce)
            cat(draw, cx + 320, 590, 0.8, t=t)
            K.text_at(draw, "Chapter 1 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Computers see with patterns", coral, size=36)
            stars_around(320, 560, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
