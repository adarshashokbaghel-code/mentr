"""B6 · Teaching a Computer Like Teaching a Puppy — visuals."""
import math

import build as K

WHITE = (255, 255, 255)
GOLDEN = (240, 180, 84)
GOLDEN_LIGHT = (253, 228, 172)
GOLDEN_DARK = (206, 136, 54)
NOSE = (52, 40, 40)
CHEEK = (255, 160, 150)
TONGUE = (240, 110, 120)
COLLAR = (224, 62, 62)
BROWN = (170, 116, 72)
BROWN_LIGHT = (222, 184, 140)
BROWN_DARK = (112, 74, 44)
ORANGE_CAT = (246, 150, 60)
ORANGE_LIGHT = (255, 214, 160)
ORANGE_DARK = (206, 102, 30)
BLACK_CAT = (54, 52, 60)
WHITE_CAT = (246, 244, 240)
GREY_CAT = (150, 154, 164)
GREY_DARK = (96, 100, 112)
CREAM = (238, 218, 186)
PINK = (246, 150, 170)
EYE_GREEN = (120, 196, 90)
EYE_GOLD = (250, 200, 60)
BUS_RED = (214, 52, 52)
BUS_YELLOW = (250, 190, 40)
BUS_BLUE = (72, 118, 214)
BUS_GREEN = (40, 150, 110)
SKY_PIC = (226, 240, 252)
GRASS_PIC = (206, 234, 186)
TREAT = (214, 160, 96)
TREAT_DARK = (176, 120, 60)
TRAIN = (72, 118, 214)


def S_(s):
    return lambda v: v * s


# ---------------------------------------------------------------------------
# Laddoo the puppy
# ---------------------------------------------------------------------------

def _pup_head(draw, hx, hy, s, fur, light, dark, face="happy", tilt=0.0):
    S = S_(s)
    for sx in (-1, 1):
        ex = hx + sx * S(78)
        draw.ellipse((ex - S(34), hy - S(64) + sx * S(10) * tilt, ex + S(34), hy + S(52) + sx * S(10) * tilt),
                     fill=dark)
    draw.ellipse((hx - S(88), hy - S(84), hx + S(88), hy + S(78)), fill=fur)
    draw.ellipse((hx - S(48), hy - S(4), hx + S(48), hy + S(66)), fill=light)
    for sx in (-1, 1):
        ex, ey = hx + sx * S(38), hy - S(16)
        if face == "closed":
            draw.arc((ex - S(16), ey - S(10), ex + S(16), ey + S(14)), 200, 340, fill=NOSE, width=max(2, int(S(6))))
        else:
            draw.ellipse((ex - S(17), ey - S(19), ex + S(17), ey + S(19)), fill=NOSE)
            draw.ellipse((ex - S(8) + sx * S(2), ey - S(13), ex + S(2) + sx * S(2), ey - S(3)), fill=WHITE)
        draw.ellipse((hx + sx * S(62) - S(14), hy + S(14), hx + sx * S(62) + S(14), hy + S(32)), fill=CHEEK)
    draw.ellipse((hx - S(16), hy + S(6), hx + S(16), hy + S(28)), fill=NOSE)
    draw.ellipse((hx - S(8), hy + S(9), hx, hy + S(15)), fill=(120, 110, 110))
    draw.line((hx, hy + S(28), hx, hy + S(38)), fill=NOSE, width=max(2, int(S(4))))
    if face in ("happy", "closed"):
        draw.ellipse((hx - S(12), hy + S(38), hx + S(12), hy + S(64)), fill=TONGUE)
    draw.arc((hx - S(24), hy + S(24), hx, hy + S(46)), 20, 170, fill=NOSE, width=max(2, int(S(4))))
    draw.arc((hx, hy + S(24), hx + S(24), hy + S(46)), 10, 160, fill=NOSE, width=max(2, int(S(4))))


def puppy(draw, cx, by, s, t=0.0, pose="sit", face="happy", fur=GOLDEN, light=GOLDEN_LIGHT, dark=GOLDEN_DARK,
          collar=True, flip=False):
    """by = ground line. sit: ~310s tall; stand: ~300s tall, ~360s wide."""
    S = S_(s)
    d = -1 if flip else 1
    wag = math.sin(t * math.pi * 14)
    draw.ellipse((cx - S(130), by - S(16), cx + S(130), by + S(14)), fill=K.SHADOW)
    if pose == "sit":
        tx, ty = cx + d * S(66), by - S(40)
        tip = (tx + d * S(70) + d * S(16) * wag, ty - S(70) - S(10) * wag)
        draw.line([(tx, ty), (tx + d * S(50), ty - S(14)), tip], fill=dark, width=max(3, int(S(24))), joint="curve")
        draw.ellipse((tip[0] - S(12), tip[1] - S(12), tip[0] + S(12), tip[1] + S(12)), fill=dark)
        for sx in (-1, 1):
            draw.ellipse((cx + sx * S(70) - S(40), by - S(78), cx + sx * S(70) + S(40), by), fill=fur)
        draw.ellipse((cx - S(76), by - S(190), cx + S(76), by - S(4)), fill=fur)
        draw.ellipse((cx - S(42), by - S(156), cx + S(42), by - S(24)), fill=light)
        for sx in (-1, 1):
            draw.rounded_rectangle((cx + sx * S(26) - S(20), by - S(80), cx + sx * S(26) + S(20), by),
                                   radius=S(16), fill=fur)
            draw.ellipse((cx + sx * S(26) - S(22), by - S(26), cx + sx * S(26) + S(22), by + S(4)), fill=light)
        if collar:
            draw.rounded_rectangle((cx - S(58), by - S(178), cx + S(58), by - S(160)), radius=S(9), fill=COLLAR)
            draw.ellipse((cx - S(12), by - S(166), cx + S(12), by - S(142)), fill=K.GOLD)
        _pup_head(draw, cx, by - S(236), s, fur, light, dark, face, tilt=0.4 * wag)
    elif pose == "stand":
        tx, ty = cx - d * S(118), by - S(140)
        tip = (tx - d * S(40) - d * S(18) * wag, ty - S(70))
        draw.line([(tx, ty), (tx - d * S(30), ty - S(30)), tip], fill=dark, width=max(3, int(S(22))), joint="curve")
        draw.ellipse((tip[0] - S(11), tip[1] - S(11), tip[0] + S(11), tip[1] + S(11)), fill=dark)
        for lx in (-96, -50, 40, 84):
            x = cx + d * S(lx)
            draw.rounded_rectangle((x - S(18), by - S(100), x + S(18), by), radius=S(14), fill=fur if lx in (-96, 40)
                                   else dark)
            draw.ellipse((x - S(20), by - S(22), x + S(20), by + S(4)), fill=light)
        draw.ellipse((cx - S(136), by - S(196), cx + S(116), by - S(64)), fill=fur)
        draw.ellipse((cx - d * S(70) - S(60), by - S(150), cx - d * S(70) + S(80), by - S(76)), fill=light)
        hx = cx + d * S(104)
        if collar:
            draw.rounded_rectangle((hx - S(54), by - S(178), hx + S(40), by - S(160)), radius=S(9), fill=COLLAR)
        _pup_head(draw, hx, by - S(236), s * 0.92, fur, light, dark, face, tilt=0.4 * wag)
    else:  # spin: curled up, chasing her tail
        cy = by - S(110)
        a0 = t * 720
        r = S(78)
        n = 14
        for i in range(n + 1):
            a = math.radians(a0 + 250 * i / n)
            px, py = cx + r * math.cos(a), cy + r * math.sin(a)
            if i in (3, 10):
                pa = a + 0.0
                fx, fy = cx + (r + S(46)) * math.cos(pa), cy + (r + S(46)) * math.sin(pa)
                draw.ellipse((fx - S(20), fy - S(20), fx + S(20), fy + S(20)), fill=light)
            rad = S(44 + 10 * i / n)
            draw.ellipse((px - rad, py - rad, px + rad, py + rad), fill=fur)
        ta = math.radians(a0)
        tx, ty = cx + r * math.cos(ta), cy + r * math.sin(ta)
        back = ta - 0.7
        tip = (cx + (r + S(10)) * math.cos(back), cy + (r + S(10)) * math.sin(back))
        tip2 = (tip[0] + S(28) * math.cos(back - 1.2), tip[1] + S(28) * math.sin(back - 1.2))
        draw.line([(tx, ty), tip, tip2], fill=dark, width=max(3, int(S(20))), joint="curve")
        draw.ellipse((tip2[0] - S(11), tip2[1] - S(11), tip2[0] + S(11), tip2[1] + S(11)), fill=dark)
        ha = math.radians(a0 + 250)
        hx, hy = cx + r * math.cos(ha), cy + r * math.sin(ha)
        _pup_head(draw, hx, hy, s * 0.7, fur, light, dark, face)
        for k in range(3):
            rr = S(170) + k * S(26)
            draw.arc((cx - rr, cy - rr, cx + rr, cy + rr), a0 + 120 + k * 30, a0 + 180 + k * 30, fill=K.STEEL,
                     width=max(2, int(S(8))))


def bone(draw, cx, cy, s, ang=0.0):
    S = S_(s)
    ca, sa = math.cos(ang), math.sin(ang)

    def R(x, y):
        return (cx + S(x) * ca - S(y) * sa, cy + S(x) * sa + S(y) * ca)
    a, b = R(-34, 0), R(34, 0)
    draw.line((a, b), fill=TREAT, width=max(3, int(S(22))))
    for ex in (-38, 38):
        for ey in (-12, 12):
            px, py = R(ex, ey)
            draw.ellipse((px - S(14), py - S(14), px + S(14), py + S(14)), fill=TREAT)
    draw.line((R(-20, -4), R(20, -4)), fill=GOLDEN_LIGHT, width=max(1, int(S(4))))


def laddoo_sweet(draw, cx, cy, r):
    draw.ellipse((cx - r + 4, cy - r + 6, cx + r + 4, cy + r + 6), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(250, 170, 50))
    for k in range(9):
        a = k * 2.3
        dx, dy = math.cos(a) * r * 0.55 * ((k % 3) / 3 + 0.4), math.sin(a) * r * 0.55 * ((k % 3) / 3 + 0.4)
        draw.ellipse((cx + dx - r * 0.1, cy + dy - r * 0.1, cx + dx + r * 0.1, cy + dy + r * 0.1),
                     fill=(255, 210, 110))


def arm(draw, x0, y0, x1, y1, s, sleeve=K.CORAL):
    S = S_(s)
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    draw.line((x0, y0, mx, my), fill=sleeve, width=max(3, int(S(30))))
    draw.line((mx, my, x1, y1), fill=K.SKIN, width=max(3, int(S(24))))
    draw.ellipse((x1 - S(20), y1 - S(20), x1 + S(20), y1 + S(20)), fill=K.SKIN)


# ---------------------------------------------------------------------------
# things the AI looks at
# ---------------------------------------------------------------------------

def cat(draw, cx, by, s, fur=ORANGE_CAT, light=None, stripes=None, eye=EYE_GREEN, whisk=None):
    """Sitting cat, front view. ~265s tall."""
    S = S_(s)
    light = light or fur
    whisk = whisk or K.DEV_DARK
    draw.line([(cx + S(46), by - S(16)), (cx + S(112), by - S(40)), (cx + S(104), by - S(134))], fill=fur,
              width=max(3, int(S(20))), joint="curve")
    draw.ellipse((cx + S(92), by - S(146), cx + S(116), by - S(122)), fill=stripes or fur)
    draw.ellipse((cx - S(64), by - S(146), cx + S(64), by), fill=fur)
    draw.ellipse((cx - S(34), by - S(118), cx + S(34), by - S(16)), fill=light)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(24) - S(18), by - S(22), cx + sx * S(24) + S(18), by + S(4)), fill=light)
    hy = by - S(178)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * S(66), hy - S(10)), (cx + sx * S(54), hy - S(88)), (cx + sx * S(14), hy - S(52))],
                     fill=fur)
        draw.polygon([(cx + sx * S(56), hy - S(22)), (cx + sx * S(50), hy - S(68)), (cx + sx * S(26), hy - S(48))],
                     fill=PINK)
    draw.ellipse((cx - S(70), hy - S(62), cx + S(70), hy + S(56)), fill=fur)
    draw.ellipse((cx - S(34), hy + S(4), cx + S(34), hy + S(50)), fill=light)
    if stripes:
        for k in (-1, 0, 1):
            draw.line((cx + k * S(18), hy - S(58), cx + k * S(14), hy - S(30)), fill=stripes, width=max(2, int(S(8))))
        for k in range(3):
            yy = by - S(120) + k * S(36)
            for sx in (-1, 1):
                draw.arc((cx + sx * S(40) - S(30), yy - S(12), cx + sx * S(40) + S(30), yy + S(20)),
                         200 if sx < 0 else 280, 260 if sx < 0 else 340, fill=stripes, width=max(2, int(S(8))))
    for sx in (-1, 1):
        ex, ey = cx + sx * S(28), hy - S(4)
        draw.ellipse((ex - S(14), ey - S(16), ex + S(14), ey + S(16)), fill=eye)
        draw.ellipse((ex - S(4), ey - S(13), ex + S(4), ey + S(13)), fill=K.DEV_DEEP)
    draw.polygon([(cx - S(9), hy + S(16)), (cx + S(9), hy + S(16)), (cx, hy + S(26))], fill=PINK)
    draw.arc((cx - S(16), hy + S(20), cx, hy + S(36)), 20, 160, fill=whisk, width=max(1, int(S(3))))
    draw.arc((cx, hy + S(20), cx + S(16), hy + S(36)), 20, 160, fill=whisk, width=max(1, int(S(3))))
    for sx in (-1, 1):
        for k in (-1, 0, 1):
            draw.line((cx + sx * S(30), hy + S(24) + k * S(6), cx + sx * S(94), hy + S(18) + k * S(16)), fill=whisk,
                      width=max(1, int(S(3))))


CATS = {
    "orange": dict(fur=ORANGE_CAT, light=ORANGE_LIGHT, stripes=ORANGE_DARK),
    "black": dict(fur=BLACK_CAT, light=(84, 82, 92), eye=EYE_GOLD, whisk=(230, 230, 236)),
    "white": dict(fur=WHITE_CAT, light=WHITE, eye=(110, 170, 230)),
    "stripy": dict(fur=GREY_CAT, light=(214, 216, 222), stripes=GREY_DARK),
    "cream": dict(fur=CREAM, light=WHITE, stripes=(196, 160, 118), eye=(110, 170, 230)),
}


def bus(draw, cx, by, s, col=BUS_RED, double=False):
    """Side view. ~300s wide; 150s tall (250s double)."""
    S = S_(s)
    top = by - S(250 if double else 160)
    draw.ellipse((cx - S(170), by - S(10), cx + S(170), by + S(12)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(160), top, cx + S(160), by - S(26)), radius=S(22), fill=col)
    rows = [by - S(140)] + ([by - S(236)] if double else [])
    for ry in rows:
        for k in range(4):
            wx = cx - S(140) + k * S(64)
            draw.rounded_rectangle((wx, ry, wx + S(50), ry + S(46)), radius=S(8), fill=(214, 236, 250))
    draw.rounded_rectangle((cx + S(116), by - S(140), cx + S(150), by - S(40)), radius=S(6), fill=(214, 236, 250))
    draw.rectangle((cx - S(160), by - S(78), cx + S(160), by - S(64)), fill=WHITE)
    draw.ellipse((cx + S(146), by - S(60), cx + S(162), by - S(44)), fill=K.GOLD)
    for wx in (cx - S(96), cx + S(80)):
        draw.ellipse((wx - S(30), by - S(56), wx + S(30), by + S(4)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(12), by - S(38), wx + S(12), by - S(14)), fill=K.STEEL)


def photo(draw, cx, cy, s, subject, label=None, label_col=K.CORAL, dim=False):
    """Polaroid. ~260s x 290s. subject: cat kind, 'dog', 'bus-<colour>', 'bus-double'."""
    S = S_(s)
    x0, y0, x1, y1 = cx - S(130), cy - S(150), cx + S(130), cy + S(140)
    draw.rounded_rectangle((x0 + S(8), y0 + S(10), x1 + S(8), y1 + S(10)), radius=S(14), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(14), fill=WHITE, outline=(226, 220, 210),
                           width=max(2, int(S(3))))
    pic = (x0 + S(16), y0 + S(16), x1 - S(16), y1 - S(76))
    bg = SKY_PIC if subject.startswith("bus") else (GRASS_PIC if subject == "dog" else (250, 236, 222))
    draw.rectangle(pic, fill=bg)
    px = (pic[0] + pic[2]) / 2
    pb = pic[3] - S(10)
    if subject == "dog":
        puppy(draw, px, pb, s * 0.5, 0.0, pose="stand", face="happy", fur=BROWN, light=BROWN_LIGHT, dark=BROWN_DARK,
              collar=False)
    elif subject.startswith("bus"):
        kind = subject.split("-", 1)[1]
        cols = {"red": BUS_RED, "yellow": BUS_YELLOW, "blue": BUS_BLUE, "green": BUS_GREEN}
        bus(draw, px, pb, s * 0.66, cols.get(kind, BUS_RED), double=kind == "double")
    else:
        kind, _, size = subject.partition(":")
        k = {"big": 0.78, "tiny": 0.42}.get(size, 0.62)
        cat(draw, px - S(6), pb, s * k, **CATS[kind])
    if label:
        f = K.load_font(max(26, int(S(38))), bold=True)
        tw = draw.textbbox((0, 0), label, font=f)[2]
        ly = y1 - S(38)
        th = f.size
        draw.rounded_rectangle((cx - tw / 2 - S(18) - 10, ly - th / 2 - 8, cx + tw / 2 + S(18) + 10, ly + th / 2 + 8),
                               radius=12, fill=label_col)
        K.text_at(draw, label, cx, ly - th * 0.56, f, WHITE)
    if dim:
        draw.rounded_rectangle((x0, y0, x1, y1), radius=S(14), outline=(200, 194, 186), width=max(2, int(S(4))))


def laptop(draw, cx, cy, s, tag=True):
    """No face on purpose: the AI is a program, not a pet. Returns the screen box."""
    S = S_(s)
    draw.rounded_rectangle((cx - S(230) + S(8), cy - S(180) + S(10), cx + S(230) + S(8), cy + S(110) + S(10)),
                           radius=S(22), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(230), cy - S(180), cx + S(230), cy + S(110)), radius=S(22), fill=K.DEV_DARK)
    scr = (cx - S(206), cy - S(158), cx + S(206), cy + S(88))
    draw.rectangle(scr, fill=(244, 248, 252))
    draw.polygon([(cx - S(250), cy + S(110)), (cx + S(250), cy + S(110)), (cx + S(290), cy + S(150)),
                  (cx - S(290), cy + S(150))], fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(60), cy + S(118), cx + S(60), cy + S(132)), radius=S(6), fill=K.DEV_DARK)
    if tag and S(34) >= 26:
        draw.rounded_rectangle((cx - S(44), cy + S(156), cx + S(44), cy + S(204)), radius=S(20), fill=K.ROAD)
        K.text_at(draw, "AI", cx, cy + S(160), K.load_font(int(S(34)), bold=True), WHITE)
    return scr


def train(draw, cx, by, s, t=0.0):
    S = S_(s)
    draw.rectangle((cx - S(260), by - S(8), cx + S(220), by + S(4)), fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(250), by - S(150), cx - S(40), by - S(34)), radius=S(16), fill=K.CORAL)
    for k in range(2):
        wx = cx - S(226) + k * S(96)
        draw.rounded_rectangle((wx, by - S(130), wx + S(70), by - S(84)), radius=S(8), fill=(214, 236, 250))
    draw.rounded_rectangle((cx - S(20), by - S(130), cx + S(200), by - S(34)), radius=S(16), fill=TRAIN)
    draw.rounded_rectangle((cx + S(70), by - S(210), cx + S(200), by - S(110)), radius=S(14), fill=K.BOT_DARK)
    draw.rectangle((cx + S(90), by - S(190), cx + S(150), by - S(140)), fill=(214, 236, 250))
    draw.rectangle((cx + S(10), by - S(190), cx + S(50), by - S(130)), fill=K.DEV_DARK)
    for k in range(3):
        p = (t * 1.6 + k / 3) % 1
        r = S(18) + S(26) * p
        draw.ellipse((cx + S(30) - r - S(40) * p, by - S(220) - S(110) * p - r, cx + S(30) + r - S(40) * p,
                      by - S(220) - S(110) * p + r), fill=(226, 226, 234))
    for wx in (cx - S(200), cx - S(90), cx + S(30), cx + S(150)):
        draw.ellipse((wx - S(28), by - S(60), wx + S(28), by - S(4)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(10), by - S(42), wx + S(10), by - S(22)), fill=K.STEEL)


def trophy(draw, cx, cy, s, label=None):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110) + S(8), cy + S(120) + S(10), cx + S(110) + S(8), cy + S(170) + S(10)),
                           radius=S(10), fill=K.SHADOW)
    for sx, a0, a1 in ((-1, 90, 270), (1, -90, 90)):
        draw.arc((cx + sx * S(110) - S(60), cy - S(110), cx + sx * S(110) + S(60), cy + S(10)), a0, a1,
                 fill=K.GOLD, width=max(3, int(S(20))))
    draw.chord((cx - S(130), cy - S(240), cx + S(130), cy + S(70)), 0, 180, fill=K.GOLD)
    draw.rectangle((cx - S(130), cy - S(150), cx + S(130), cy - S(86)), fill=K.GOLD)
    draw.rectangle((cx - S(26), cy + S(60), cx + S(26), cy + S(124)), fill=(232, 160, 40))
    draw.rounded_rectangle((cx - S(110), cy + S(120), cx + S(110), cy + S(170)), radius=S(10), fill=K.DEV_DARK)
    K.draw_star(draw, cx, cy - S(70), S(46), WHITE)
    if label and S(32) >= 26:
        K.text_at(draw, label, cx, cy + S(126), K.load_font(int(S(32)), bold=True), WHITE)


def yes_no(draw, cx, y, which=None, size=36):
    """Two buttons. which: None, 'yes', 'no'."""
    specs = [("YES", (13, 148, 136), -1), ("NO", K.DANGER, 1)]
    for lab, col, side in specs:
        on = which == lab.lower()
        fill = col if on else (236, 232, 226)
        fg = WHITE if on else (150, 150, 156)
        x = cx + side * 110
        draw.rounded_rectangle((x - 90, y, x + 90, y + 76), radius=38, fill=fill)
        K.text_at(draw, lab, x, y + 18, K.load_font(size, bold=True), fg)


def guess_bubble(draw, brand, box, text, col=None):
    K.draw_bubble(draw, box, brand, text, tail="left", size=44, fg=col)


def bar_chart(draw, x0, y0, x1, y1, n, filled, col, base):
    wd = (x1 - x0) / n
    for k in range(n):
        h = (y1 - y0) * (0.2 + 0.8 * (k + 1) / n)
        on = k < filled
        draw.rounded_rectangle((x0 + k * wd + 10, y1 - h, x0 + (k + 1) * wd - 10, y1), radius=12,
                               fill=col if on else base)


# ---------------------------------------------------------------------------
# scenes
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

    def hearts(spots):
        for k, (hx, hy) in enumerate(spots):
            K.draw_heart(draw, hx, hy + 8 * math.sin(progress * 10 + k), 26 + 4 * pulse, coral)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def lines_c(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def kabir(x, y, s):
        K.draw_person(draw, x, y, s, "kid", t)

    def step_tabs(active):
        labs = [("1 · Show", coral), ("2 · Praise", K.BOTH_COLOR), ("3 · Practise", sage)]
        for i, (lab, col) in enumerate(labs):
            x = cx + (i - 1) * 380
            on = i == active
            draw.rounded_rectangle((x - 170, 226, x + 170, 296), radius=35, fill=col if on else panel,
                                   outline=col if on else line, width=3)
            K.text_at(draw, lab, x, 240, font(36, bold=True), WHITE if on else muted)

    # ---- opening ------------------------------------------------------------
    if visual == "b6-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            puppy(draw, cx + 300, 620, 0.95, t, pose="sit")
            K.text_at(draw, "Welcome back, champ!", cx, 720, font(60, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (280, 250 + lift, w - 280, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "UNIT 1 · WHAT IS AI? · DONE!", cx, 326 + lift, font(36, bold=True), sage)
            trophy(draw, 600, 560 + lift, 0.95, label="UNIT 1")
            items = ["What AI is", "AI at home", "AI can be wrong", "AI helpers"]
            for i, lab in enumerate(items):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                y = 420 + i * 100 + lift + int((1 - a) * 20)
                K.draw_check(draw, 960, y + 30, 28, sage)
                draw.text((1010, y + 6), lab, fill=ink, font=font(44, bold=True))
            return True
        if focus == "unit":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 520 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "UNIT 2", cx, 310 + lift, font(40, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "How Machines Learn", cx, 370 + lift, font(90, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                for k, kind in enumerate(("orange", "stripy", "black")):
                    photo(draw, 560 + k * 70, 720 + yy - k * 10, 0.6, kind)
                K.draw_arrow(draw, 860, 720 + yy, 1060, 720 + yy, muted, width=12, head=32)
                laptop(draw, 1300, 720 + yy, 0.55, tag=False)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 236 + lift, w - 240, 540 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 296 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Teaching a Computer", cx, 346 + lift, font(76, bold=True), ink)
            K.text_at(draw, "Like Teaching a Puppy", cx, 436 + lift, font(76, bold=True), coral)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                puppy(draw, cx - 360, 860 + yy, 0.85, t, pose="sit")
                K.draw_heart(draw, cx, 740 + yy + bounce, 40, coral)
                laptop(draw, cx + 360, 750 + yy, 0.45, tag=False)
            return True
        # promise
        puppy(draw, 520, 820, 1.25, t, pose="sit")
        scr = laptop(draw, 1400, 560, 0.9)
        draw.rectangle(scr, fill=blue_soft)
        K.text_at(draw, "AI", 1400, 440, font(90, bold=True), K.ROAD)
        K.text_at(draw, "+", cx, 450, font(110, bold=True), muted)
        question_marks([(cx - 60, 280), (cx + 90, 620)])
        return True

    # ---- meet Kabir & Laddoo ------------------------------------------------------
    if visual == "b6-hook":
        if focus == "meet":
            draw.ellipse((560 - 300, 570 - 300, 560 + 300, 570 + 300), fill=gold_soft)
            kabir(400, 450, 1.35)
            puppy(draw, 680, 840, 1.0, t, pose="sit")
            K.text_at(draw, "Meet", 1360, 290 + lift, font(56, bold=True), muted)
            K.text_at(draw, "Laddoo!", 1360, 360 + lift, font(128, bold=True), coral)
            K.pill(draw, 1360, 540, "Kabir's new puppy", K.BOTH_COLOR, size=36)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                y = 660 + int((1 - a) * 20)
                laddoo_sweet(draw, 1110, y + 40, 40)
                draw.text((1180, y + 14), "Round · golden · sweet", fill=ink, font=font(40, bold=True))
            star_spots([(1050, 330), (1700, 320)])
            return True
        if focus == "sit":
            kabir(460, 500, 1.3)
            arm(draw, 560, 640, 700, 520, 1.3)
            K.draw_bubble(draw, (640, 250, 1000, 420), brand, "Sit!", tail="left", size=90)
            puppy(draw, 1360, 840, 1.05, t, pose="stand", flip=True)
            K.pill(draw, 820, 760, "Just once", K.GOLD, fg=ink, size=34)
            return True
        if focus == "spin":
            kabir(380, 500, 1.2)
            question_marks([(560, 300), (240, 290)], size=70)
            puppy(draw, 1150, 820, 1.2, t, pose="spin")
            K.pill(draw, 1150, 236, "Round and round!", coral, size=36)
            return True
        if focus == "why":
            kabir(460, 520, 1.25)
            puppy(draw, 1360, 840, 0.95, t, pose="spin")
            draw.ellipse((cx - 110, 420, cx + 110, 640), fill=lav_soft)
            K.text_at(draw, "?", cx, 448, font(int(140 + 20 * pulse), bold=True), K.BOTH_COLOR)
            K.draw_stopwatch(draw, cx, 760, 48, progress, brand)
            return True
        # because
        specs = [("1 try", K.DANGER, K.DANGER_SOFT, "spin"), ("Many tries", sage, sage_soft, "sit")]
        for k, (lab, col, soft, pose) in enumerate(specs):
            a = K.stagger(progress, k, step=0.22, speed=4)
            if a <= 0:
                continue
            x0 = 200 + k * 800
            y0 = 260 + int((1 - a) * 30)
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 720 + 8, y0 + 600 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 600), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, lab, x0 + 360, y0 + 30, font(60, bold=True), col)
            if k == 0:
                puppy(draw, x0 + 360, y0 + 540, 0.85, t, pose=pose)
                K.draw_cross(draw, x0 + 640, y0 + 80, 40, K.DANGER)
            else:
                puppy(draw, x0 + 470, y0 + 540, 0.9, t, pose=pose)
                K.draw_check(draw, x0 + 640, y0 + 80, 40, sage)
                for j, word in enumerate(("Again", "Again", "Again", "Got it!")):
                    if progress < 0.3 + 0.1 * j:
                        continue
                    K.draw_check(draw, x0 + 70, y0 + 170 + j * 90, 22, sage)
                    draw.text((x0 + 104, y0 + 170 + j * 90 - 20), word, font=font(34, bold=True), fill=K.DEV_DARK)
        return True

    # ---- how Kabir teaches ---------------------------------------------------------
    if visual == "b6-teach":
        if focus == "show":
            step_tabs(0)
            kabir(520, 470, 1.25)
            sitp = K.clamp01((progress - 0.3) * 2.5)
            arm(draw, 600, 600, 760 + 20 * sitp, 560 + 60 * sitp, 1.25)
            if sitp > 0.5:
                puppy(draw, 900, 850, 1.0, t, pose="sit")
            else:
                puppy(draw, 900, 850, 1.0, t, pose="stand", flip=True)
            K.shadow_card(draw, (1220, 360 + lift, 1780, 760 + lift), brand, radius=36, accent=coral)
            K.text_at(draw, "SHOW", 1500, 440 + lift, font(72, bold=True), coral)
            lines_c(["what \"sit\"", "means"], 1500, 560 + lift, 46)
            return True
        if focus == "praise":
            step_tabs(1)
            kabir(460, 480, 1.25)
            arm(draw, 540, 610, 760, 640, 1.25)
            bone(draw, 790, 640, 1.1, -0.3)
            K.draw_bubble(draw, (600, 316, 1080, 456), brand, "Good dog!", tail="left", size=58)
            puppy(draw, 1060, 860, 1.0, t, pose="sit", face="closed" if progress > 0.5 else "happy")
            hearts([(1240, 520), (1300, 640)])
            K.shadow_card(draw, (1400, 380 + lift, 1800, 740 + lift), brand, radius=36, accent=K.BOTH_COLOR)
            K.text_at(draw, "YES!", 1600, 450 + lift, font(80, bold=True), K.BOTH_COLOR)
            lines_c(["that was", "right"], 1600, 580 + lift, 42)
            return True
        # practise
        step_tabs(2)
        days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
        for i, d in enumerate(days):
            a = K.stagger(progress, i, step=0.1, speed=5)
            if a <= 0:
                continue
            x0 = 160 + i * 330
            y0 = 330 + int((1 - a) * 30)
            ok = i >= 2
            col = sage if ok else K.GOLD
            draw.rounded_rectangle((x0 + 6, y0 + 8, x0 + 290 + 6, y0 + 400 + 8), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 290, y0 + 400), radius=30, fill=panel, outline=col, width=4)
            draw.rounded_rectangle((x0, y0, x0 + 290, y0 + 70), radius=30, fill=col)
            draw.rectangle((x0, y0 + 40, x0 + 290, y0 + 70), fill=col)
            K.text_at(draw, d, x0 + 145, y0 + 14, font(38, bold=True), WHITE if ok else ink)
            pose = "sit" if i >= 2 or i == 1 and int(t * 8) % 2 else ("stand" if i == 1 else "spin")
            puppy(draw, x0 + 145, y0 + 330, 0.55, t, pose=pose)
            if ok:
                K.draw_check(draw, x0 + 250, y0 + 110, 24, sage)
        if progress > 0.7:
            K.pill(draw, cx, 770, "Sits every single time!", sage, size=40)
        return True

    # ---- teaching a computer ----------------------------------------------------------
    if visual == "b6-computer":
        if focus == "intro":
            draw.rounded_rectangle((150, 270, 830, 830), radius=40, fill=gold_soft)
            kabir(340, 470, 1.0)
            puppy(draw, 620, 760, 0.85, t, pose="sit")
            draw.rounded_rectangle((1090, 270, 1770, 830), radius=40, fill=blue_soft)
            scr = laptop(draw, 1430, 540, 0.9)
            photo(draw, 1430, 500, 0.62, "orange", "cat")
            K.text_at(draw, "=", cx, 470, font(int(120 + 10 * pulse), bold=True), K.BOTH_COLOR)
            K.pill(draw, cx, 640, "Similar!", K.BOTH_COLOR, size=34)
            return True
        if focus == "show":
            scr = laptop(draw, 1380, 520, 1.15)
            draw.rectangle(scr, fill=blue_soft)
            kinds = ["orange", "black", "stripy", "white", "cream", "orange:tiny", "black:big", "stripy:tiny"]
            n = len(kinds)
            for k in range(n):
                p = (t * 1.6 + k / n) % 1
                if t * 1.6 + k / n < 1:
                    p = (t * 1.6 + k / n)
                x = K.lerp(260, 1180, p)
                y = 520 - 160 * math.sin(p * math.pi) + 40 * ((k % 3) - 1)
                if p > 0.96:
                    continue
                photo(draw, x, y, 0.55 * (1 - 0.35 * p), kinds[k], "cat")
            got = min(99, int(t * 120) + 1)
            K.pill(draw, 1380, 236, f"{got} cat photos…", coral, size=34)
            sx0, sy0, sx1, sy1 = scr
            for k in range(min(12, got // 8)):
                gx = sx0 + 50 + (k % 6) * 62
                gy = sy0 + 70 + (k // 6) * 80
                draw.rounded_rectangle((gx - 24, gy - 30, gx + 24, gy + 30), radius=6, fill=WHITE, outline=line, width=2)
                draw.ellipse((gx - 14, gy - 18, gx + 14, gy + 10), fill=[ORANGE_CAT, BLACK_CAT, GREY_CAT][k % 3])
            return True
        if focus == "guess":
            specs = [("orange", "Cat?", "yes"), ("dog", "Cat?", "no")]
            for k, (subj, g, ans) in enumerate(specs):
                a = K.stagger(progress, k * 2, step=0.18, speed=4)
                if a <= 0:
                    continue
                x0 = 150 + k * 830
                y0 = 270 + int((1 - a) * 30)
                draw.rounded_rectangle((x0, y0, x0 + 790, y0 + 580), radius=40,
                                       fill=sage_soft if ans == "yes" else K.DANGER_SOFT)
                photo(draw, x0 + 200, y0 + 260, 0.95, subj)
                guess_bubble(draw, brand, (x0 + 380, y0 + 70, x0 + 720, y0 + 200), "AI: " + g)
                shown = K.stagger(progress, k * 2 + 1, step=0.18, speed=4) > 0.3
                yes_no(draw, x0 + 550, y0 + 300, ans if shown else None, size=40)
                if shown:
                    if ans == "yes":
                        K.draw_check(draw, x0 + 550, y0 + 470, 40, sage)
                    else:
                        K.draw_cross(draw, x0 + 550, y0 + 470, 40, K.DANGER)
            return True
        # better
        draw.rounded_rectangle((150, 280, 1000, 840), radius=36, fill=panel, outline=line, width=3)
        n = 6
        filled = 1 + int(K.clamp01(progress * 1.3) * (n - 1))
        bar_chart(draw, 220, 340, 940, 740, n, filled, sage, (236, 232, 226))
        K.text_at(draw, "More practice", 575, 760, font(38, bold=True), muted)
        K.draw_arrow(draw, 340, 812, 820, 812, muted, width=6, head=18)
        K.text_at(draw, "Better guesses!", 575, 290, font(40, bold=True), sage)
        specs = [("Not magic", K.DANGER, K.DANGER_SOFT, "x"), ("Not alive", K.DANGER, K.DANGER_SOFT, "x"),
                 ("Finds patterns", sage, sage_soft, "ok")]
        for i, (lab, col, soft, mark) in enumerate(specs):
            a = K.stagger(progress, i + 2, step=0.14, speed=4)
            if a <= 0:
                continue
            y = 320 + i * 170 + int((1 - a) * 20)
            draw.rounded_rectangle((1100, y, 1780, y + 130), radius=65, fill=soft, outline=col, width=4)
            (K.draw_cross if mark == "x" else K.draw_check)(draw, 1180, y + 65, 36, col)
            draw.text((1250, y + 36), lab, fill=ink, font=font(50, bold=True))
        return True

    # ---- labelled examples & training --------------------------------------------------
    if visual == "b6-labels":
        if focus == "label":
            drop = K.ease_out_cubic(K.clamp01((progress - 0.15) * 2.5))
            photo(draw, 560, 560, 1.55, "orange")
            ly = K.lerp(240, 720, drop)
            f = font(64, bold=True)
            draw.rounded_rectangle((560 - 120 + 8, ly - 50 + 10, 560 + 120 + 8, ly + 50 + 10), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((560 - 120, ly - 50, 560 + 120, ly + 50), radius=20, fill=coral)
            K.text_at(draw, "cat", 560, ly - 38, f, WHITE)
            K.shadow_card(draw, (1060, 300 + lift, 1780, 800 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "LABELLED", 1420, 380 + lift, font(72, bold=True), coral)
            K.text_at(draw, "EXAMPLE", 1420, 460 + lift, font(72, bold=True), coral)
            lines_c(["a photo with", "its name stuck on"], 1420, 600 + lift, 44)
            return True
        if focus == "train":
            K.text_at(draw, "TRAINING", 1380, 236 + lift, font(84, bold=True), K.BOTH_COLOR)
            kinds = ["orange", "black", "stripy", "white", "cream", "black:tiny", "orange:big", "stripy:big", "white:tiny"]
            for k, kind in enumerate(kinds):
                a = K.stagger(progress, k, step=0.06, speed=6)
                if a <= 0:
                    continue
                x = 230 + (k % 3) * 240
                y = 380 + (k // 3) * 200 + int((1 - a) * 30)
                photo(draw, x, y, 0.62, kind, "cat")
            K.draw_arrow(draw, 960, 560, 1080, 560, muted, width=12, head=32)
            scr = laptop(draw, 1400, 560, 0.85)
            draw.rectangle(scr, fill=lav_soft)
            lines_c(["Lots of labelled", "examples"], 1400, 450, 40, K.BOTH_COLOR)
            return True
        # notrain
        x = K.lerp(-200, 760, K.ease_out_cubic(K.clamp01(progress * 1.6)))
        train(draw, x, 640, 1.2, t)
        if progress > 0.35:
            K.draw_cross(draw, 760, 380, 60, K.DANGER)
            K.text_at(draw, "Not a train ride!", 760, 720, font(52, bold=True), K.DANGER)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            y = 300 + int((1 - a) * 30)
            draw.rounded_rectangle((1220 + 8, y + 10, 1800 + 8, y + 500 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((1220, y, 1800, y + 500), radius=40, fill=sage_soft, outline=sage, width=5)
            K.text_at(draw, "Training =", 1510, y + 40, font(52, bold=True), sage)
            lines_c(["teaching with", "lots of examples"], 1510, y + 130, 44)
            photo(draw, 1440, y + 380, 0.42, "orange")
            photo(draw, 1580, y + 380, 0.42, "black")
        return True

    # ---- you be the teacher ----------------------------------------------------------------
    if visual == "b6-feedback":
        if focus == "intro":
            kabir(420, 480, 1.3)
            K.pill(draw, 420, 760, "Teacher: you!", coral, size=36)
            scr = laptop(draw, 1320, 500, 0.95)
            draw.rectangle(scr, fill=blue_soft)
            K.text_at(draw, "AI guesses…", 1320, 400, font(52, bold=True), K.ROAD)
            yes_no(draw, 1320, 760, "yes" if int(t * 4) % 2 == 0 else "no", size=40)
            return True
        ans = focus == "answer"
        specs = [("stripy", "yes"), ("dog", "no")]
        for k, (subj, right) in enumerate(specs):
            x0 = 150 + k * 830
            y0 = 290
            reveal = ans and progress > 0.06 + k * 0.4
            soft = (sage_soft if right == "yes" else K.DANGER_SOFT) if reveal else panel
            col = (sage if right == "yes" else K.DANGER) if reveal else line
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 790 + 8, y0 + 570 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 790, y0 + 570), radius=40, fill=soft, outline=col, width=5)
            photo(draw, x0 + 210, y0 + 290, 1.0, subj)
            guess_bubble(draw, brand, (x0 + 410, y0 + 70, x0 + 740, y0 + 200), "AI: cat")
            yes_no(draw, x0 + 575, y0 + 320, right if reveal else None, size=40)
            if reveal:
                (K.draw_check if right == "yes" else K.draw_cross)(draw, x0 + 575, y0 + 500, 42,
                                                                 sage if right == "yes" else K.DANGER)
            elif not ans:
                K.text_at(draw, "?", x0 + 575, y0 + 430, font(int(90 + 14 * pulse), bold=True), K.GOLD)
        if not ans:
            K.draw_stopwatch(draw, cx, 250, 28, progress, brand)
        return True

    # ---- one photo is not enough -------------------------------------------------------------
    if visual == "b6-one":
        if focus == "setup":
            p = K.ease_in_out(K.clamp01(progress * 1.6))
            photo(draw, K.lerp(380, 860, p), 560, K.lerp(1.2, 0.8, p), "orange", "cat")
            scr = laptop(draw, 1400, 540, 0.95)
            draw.rectangle(scr, fill=blue_soft)
            draw.ellipse((1400 - 80, 400, 1400 + 80, 560), fill=coral)
            K.text_at(draw, "1", 1400, 410, font(110, bold=True), WHITE)
            K.pill(draw, 1400, 236, "Just ONE photo", coral, size=36)
            return True
        if focus == "test":
            photo(draw, 480, 560, 1.25, "black")
            K.pill(draw, 480, 236, "A new photo", ink, size=34)
            K.draw_arrow(draw, 720, 560, 880, 560, muted, width=12, head=32)
            scr = laptop(draw, 1260, 560, 0.85)
            draw.rectangle(scr, fill=blue_soft)
            if progress > 0.3:
                K.draw_bubble(draw, (1320, 250, 1800, 400), brand, "Not a cat!", tail="left", size=52,
                              fg=K.DANGER)
                K.draw_cross(draw, 1260, 520, 50, K.DANGER)
            question_marks([(1660, 600), (1760, 470)], size=70)
            return True
        # why
        draw.ellipse((200, 270, 900, 820), fill=gold_soft)
        cat(draw, 550, 650, 1.0, **CATS["orange"])
        K.pill(draw, 550, 700, "All cats are orange?", ORANGE_DARK, size=36)
        for k, kind in enumerate(("black", "white", "stripy")):
            a = K.stagger(progress, k + 1, step=0.14, speed=4)
            if a <= 0:
                continue
            x = 1080 + k * 260
            y = 450 + int((1 - a) * 30)
            photo(draw, x, y, 0.72, kind)
            K.draw_cross(draw, x + 90, y - 100, 30, K.DANGER)
        a = K.stagger(progress, 4, step=0.14, speed=4)
        if a > 0:
            K.pill(draw, 1340, 700 + int((1 - a) * 20), "One example is never enough!", K.DANGER, size=36)
        return True

    # ---- many different cats ---------------------------------------------------------------
    if visual == "b6-many":
        if focus == "kinds":
            specs = [("black", "Black"), ("white", "White"), ("stripy", "Stripy"), ("orange:big", "Big"),
                     ("cream:tiny", "Tiny")]
            for i, (kind, lab) in enumerate(specs):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 340
                y = 500 + int((1 - a) * 40)
                photo(draw, x, y, 1.05, kind)
                K.text_at(draw, lab, x, y + 190, font(48, bold=True), ink)
            return True
        if focus == "share":
            kinds = ["black", "white", "stripy", "orange", "cream", "orange:tiny"]
            for k, kind in enumerate(kinds):
                photo(draw, 230 + (k % 2) * 230, 380 + (k // 2) * 200, 0.6, kind, "cat")
            K.draw_arrow(draw, 690, 560, 800, 560, muted, width=12, head=32)
            draw.ellipse((1080 - 250, 580 - 250, 1080 + 250, 580 + 250), fill=sage_soft)
            cat(draw, 1080, 790, 1.55, fur=(222, 214, 204), light=WHITE, eye=EYE_GREEN)
            callouts = [("Pointy ears", (1000, 400), (1400, 330)), ("Whiskers", (1200, 560), (1460, 520)),
                        ("Long tail", (1240, 640), (1460, 720))]
            for i, (lab, (ax, ay), (bx, by_)) in enumerate(callouts):
                a = K.stagger(progress, i + 1, step=0.16, speed=4)
                if a <= 0:
                    continue
                draw.line((ax, ay, bx, by_ + 30), fill=coral, width=5)
                draw.ellipse((ax - 10, ay - 10, ax + 10, ay + 10), fill=coral)
                K.pill(draw, 0, by_, lab, coral, size=36, left=bx)
            return True
        ans = focus == "answer"
        opts = [("1 orange cat", "one"), ("5 of the same cat", "same"), ("100 dog photos", "dogs"),
                ("100 different cats", "many")]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (lab, kind) in enumerate(opts):
            x0 = x_start + i * (cw + gap)
            win = kind == "many"
            reveal = ans and progress > 0.05
            col = (sage if win else line) if reveal else line
            K.shadow_card(draw, (x0, 290, x0 + cw, 830), brand, radius=30, outline=col, outline_w=6 if reveal and win else 3)
            if reveal and win:
                draw.rounded_rectangle((x0 + 6, 296, x0 + cw - 6, 824), radius=26, fill=sage_soft)
            mx = x0 + cw / 2
            if kind == "one":
                photo(draw, mx, 520, 0.8, "orange", "cat")
            elif kind == "same":
                for k in range(4, -1, -1):
                    photo(draw, mx - 40 + k * 20, 560 - k * 24, 0.62, "orange", "cat" if k == 0 else None)
            elif kind == "dogs":
                for k in range(3, -1, -1):
                    photo(draw, mx - 30 + k * 20, 560 - k * 24, 0.62, "dog", "dog" if k == 0 else None,
                          label_col=BROWN_DARK)
            else:
                ks = ["white", "stripy", "black", "cream", "orange"]
                for k in range(4, -1, -1):
                    photo(draw, mx - 40 + k * 20, 560 - k * 24, 0.62, ks[k], "cat" if k == 0 else None)
            f = font(34, bold=True)
            lns = K.wrap_text(lab, f, cw - 40)
            for j, ln in enumerate(lns):
                K.text_at(draw, ln, mx, 830 - 30 - (len(lns) - j) * 42, f, ink)
            K.pill(draw, 0, 306, "ABCD"[i], (sage if win else muted) if reveal else K.BOTH_COLOR, size=28,
                   left=x0 + 18)
            if reveal and not win:
                K.draw_cross(draw, x0 + cw - 40, 330, 22, K.DANGER)
            if reveal and win:
                K.draw_check(draw, x0 + cw - 44, 334, 28, sage)
        if ans:
            K.pill(draw, cx, 222, "Many examples, many kinds!", sage, size=32)
        else:
            K.pill(draw, cx - 40, 222, "Which set teaches \"cat\" best?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 330, 252, 30, progress, brand)
        return True

    # ---- train, then test --------------------------------------------------------------------
    if visual == "b6-test":
        def tabs(active):
            for i, (lab, col) in enumerate((("1 · TRAIN", K.BOTH_COLOR), ("2 · TEST", coral))):
                x = cx + (i * 2 - 1) * 240
                on = i == active or active == 2
                draw.rounded_rectangle((x - 200, 226, x + 200, 300), radius=37, fill=col if on else panel,
                                       outline=col if on else line, width=3)
                K.text_at(draw, lab, x, 240, font(40, bold=True), WHITE if on else muted)
            K.draw_arrow(draw, cx - 30, 263, cx + 30, 263, muted, width=6, head=16)

        if focus == "train":
            tabs(0)
            kinds = ["orange", "black", "stripy", "white", "cream", "black:tiny"]
            for k, kind in enumerate(kinds):
                a = K.stagger(progress, k, step=0.08, speed=5)
                if a <= 0:
                    continue
                photo(draw, 260 + (k % 3) * 240, 450 + (k // 3) * 240 + int((1 - a) * 30), 0.7, kind, "cat")
            K.draw_arrow(draw, 1000, 570, 1120, 570, muted, width=12, head=32)
            scr = laptop(draw, 1440, 560, 0.9)
            draw.rectangle(scr, fill=lav_soft)
            K.text_at(draw, "Learning…", 1440, 440, font(52, bold=True), K.BOTH_COLOR)
            return True
        if focus == "test":
            tabs(1)
            photo(draw, 460, 570, 1.2, "cream")
            K.pill(draw, 460, 810, "Never seen · no label", ink, size=30)
            K.draw_arrow(draw, 700, 570, 860, 570, muted, width=12, head=32)
            scr = laptop(draw, 1220, 560, 0.85)
            draw.rectangle(scr, fill=blue_soft)
            if progress > 0.45:
                K.draw_bubble(draw, (1340, 330, 1790, 470), brand, "Cat!", tail="left", size=64, fg=sage)
                K.draw_check(draw, 1220, 520, 50, sage)
            else:
                K.draw_spinner(draw, 1220, 520, 46, t, coral)
            return True
        # again: the loop
        tabs(2)
        nodes = [("TRAIN", K.BOTH_COLOR, (560, 450)), ("TEST", coral, (1360, 450)),
                 ("More examples", sage, (960, 740))]
        K.draw_curve(draw, (720, 420), (960, 330), (1200, 420), muted, width=10)
        draw.polygon([(1200, 420), (1168, 390), (1160, 432)], fill=muted)
        K.draw_curve(draw, (1360, 540), (1340, 700), (1180, 740), K.DANGER, width=10)
        draw.polygon([(1170, 740), (1206, 716), (1206, 764)], fill=K.DANGER)
        K.draw_curve(draw, (740, 740), (580, 700), (560, 540), sage, width=10)
        draw.polygon([(560, 528), (536, 566), (584, 566)], fill=sage)
        K.pill(draw, 0, 600, "Wrong?", K.DANGER, size=32, left=1400)
        for i, (lab, col, (x, y)) in enumerate(nodes):
            pul = (int(t * 3) % 3) == i
            r = 16 if pul else 0
            tw = draw.textbbox((0, 0), lab, font=font(46, bold=True))[2]
            bw = max(300, tw + 80)
            draw.rounded_rectangle((x - bw / 2 - r + 8, y - 60 - r + 10, x + bw / 2 + r + 8, y + 60 + r + 10),
                                   radius=60, fill=K.SHADOW)
            draw.rounded_rectangle((x - bw / 2 - r, y - 60 - r, x + bw / 2 + r, y + 60 + r), radius=60, fill=col)
            K.text_at(draw, lab, x, y - 28, font(46, bold=True), WHITE)
        puppy(draw, 1660, 860, 0.62, t, pose="sit")
        K.draw_heart(draw, 1740, 560 + bounce, 24, coral)
        return True

    # ---- checkpoint ---------------------------------------------------------------------------
    if visual == "b6-check":
        if focus == "intro":
            K.shadow_card(draw, (420, 280 + lift, w - 420, 780 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 360 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Teach the AI: bus!", cx, 440 + lift, font(62, bold=True), ink)
            bus(draw, cx, 720 + lift, 0.9, BUS_RED)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((120 + 10, 230 + 12, 1000 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((120, 230, 1000, 870), radius=24, fill=(255, 250, 238))
        lines_c(["To teach \"bus\", show", "1 photo or 100? Why?"], 560, 262, 46, coral)
        rows = ["100 photos!", "Many colours and sizes", "AI learns what all buses share"]
        for i, lab in enumerate(rows):
            y = 430 + i * 140
            draw.line((170, y + 96, 950, y + 96), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 200, y + 50, 24, sage)
                draw.text((240, y + 26), lab, fill=ink, font=font(40, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 560, y - 30, font(110, bold=True), line)
        if ans:
            specs = [("bus-red", "City bus"), ("bus-yellow", "School bus"), ("bus-double", "Double-decker"),
                     ("bus-green", "Green bus")]
            for k, (subj, lab) in enumerate(specs):
                a = K.stagger(progress, k, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 1220 + (k % 2) * 330
                y = 400 + (k // 2) * 300 + int((1 - a) * 20)
                photo(draw, x, y, 0.82, subj, "bus", label_col=K.ROAD)
        else:
            for k, (x, lab) in enumerate(((1200, "1 photo"), (1600, "100 photos"))):
                draw.rounded_rectangle((x - 180, 290, x + 180, 830), radius=36, fill=blue_soft if k else gold_soft)
                K.text_at(draw, lab, x, 310, font(44, bold=True), ink)
                if k == 0:
                    photo(draw, x, 560, 0.85, "bus-red")
                else:
                    for j, sub in enumerate(("bus-blue", "bus-double", "bus-yellow", "bus-red")):
                        photo(draw, x - 60 + j * 34, 640 - j * 46, 0.62, sub)
            K.text_at(draw, "?", 1400, 520, font(int(90 + 16 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1400, 248, 30, progress, brand)
        return True

    # ---- recap ---------------------------------------------------------------------------------
    if visual == "b6-recap":
        recap = [(("Training: lots", "of examples"), K.BOTH_COLOR, "train"),
                 (("Labels = names", "stuck on"), coral, "label"),
                 (("One example is", "not enough"), K.DANGER, "one"),
                 (("First train,", "then test"), sage, "order")]
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
                ix, iy = x0 + 200, y0 + 190
                if kind == "train":
                    for k in range(3):
                        photo(draw, ix - 90 + k * 40, iy + 10 - k * 24, 0.5, ["orange", "black", "stripy"][k],
                              "cat" if k == 2 else None)
                    laptop(draw, ix + 110, iy + 70, 0.26, tag=False)
                elif kind == "label":
                    photo(draw, ix, iy + 10, 0.85, "orange", "cat")
                elif kind == "one":
                    photo(draw, ix - 20, iy + 10, 0.8, "orange", "cat")
                    draw.ellipse((ix + 70, iy - 150, ix + 150, iy - 70), fill=K.DANGER)
                    K.text_at(draw, "1", ix + 110, iy - 142, font(52, bold=True), WHITE)
                else:
                    K.pill(draw, ix, iy - 110, "1 · TRAIN", K.BOTH_COLOR, size=34)
                    K.draw_arrow(draw, ix, iy - 30, ix, iy + 30, muted, width=10, head=26)
                    K.pill(draw, ix, iy + 50, "2 · TEST", coral, size=34)
                lines_c(lab, x0 + 200, y0 + 390, 36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 380), 450, 110, sage, panel, bounce)
            puppy(draw, cx + 360, 620, 0.95, t, pose="sit", face="closed")
            hearts([(cx + 540, 330), (cx + 180, 360)])
            K.text_at(draw, "Chapter 1 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Unit 2 has begun!", K.BOTH_COLOR, size=36)
            stars_around(300, 640, 6)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
