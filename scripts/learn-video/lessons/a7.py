"""A7 · Sequencing — visuals."""
import math

import build as K

SOCK = K.BOTH_COLOR
SOCK_LIGHT = (200, 188, 242)
SHOE = (72, 118, 214)
WOOD = (186, 124, 76)
WOOD_DARK = (138, 86, 48)
WARM = (255, 228, 160)
LEMON = (250, 212, 62)
LEMON_DARK = (214, 170, 30)
JUICE = (248, 230, 128)
MILK = (252, 252, 248)
CARTON_TOP = (226, 236, 250)
EGG = (255, 214, 90)
BUS = (255, 196, 40)
LIPS = (206, 82, 92)
WHITE = (255, 255, 255)


def rot(pts, ox, oy, a):
    c, s_ = math.cos(a), math.sin(a)
    return [(ox + (x - ox) * c - (y - oy) * s_, oy + (x - ox) * s_ + (y - oy) * c) for x, y in pts]


def ring(x, y, r, n=16):
    return [(x + r * math.cos(k * math.tau / n), y + r * math.sin(k * math.tau / n)) for k in range(n)]


# ---- illustrations ------------------------------------------------------------

def draw_shoe(draw, x, y, s, col=SHOE):
    """(x, y) = heel at the floor; toe points right."""
    def S(v):
        return v * s
    draw.rounded_rectangle((x - S(42), y - S(72), x + S(130), y + S(20)), radius=S(34), fill=K.SHADOW)
    draw.rounded_rectangle((x - S(48), y - S(80), x + S(124), y + S(6)), radius=S(38), fill=col)
    draw.rounded_rectangle((x + S(44), y - S(50), x + S(124), y + S(6)), radius=S(28),
                           fill=tuple(min(255, int(c * 1.18)) for c in col))
    draw.ellipse((x - S(38), y - S(96), x + S(34), y - S(64)), fill=K.DEV_DEEP)
    for k in range(3):
        lx = x + S(2) + k * S(22)
        draw.line((lx, y - S(76) + k * S(7), lx + S(20), y - S(58) + k * S(7)), fill=WHITE,
                  width=max(2, int(S(6))))
    draw.rounded_rectangle((x - S(56), y - S(4), x + S(132), y + S(18)), radius=S(10), fill=WHITE,
                           outline=K.DEV_DARK, width=max(1, int(S(3))))


def draw_sock(draw, x, y, s, col=SOCK, stretch=0.0, foot=118):
    def S(v):
        return v * s
    e = S(16) * stretch
    draw.rounded_rectangle((x - S(42) - e, y - S(170), x + S(42) + e, y - S(10)), radius=S(30), fill=col)
    draw.rounded_rectangle((x - S(42) - e, y - S(70) - e, x + S(foot) + e * 1.3, y + S(4) + e * 0.4),
                           radius=S(36), fill=col)
    draw.rounded_rectangle((x - S(46) - e, y - S(186), x + S(46) + e, y - S(148)), radius=S(14), fill=SOCK_LIGHT)
    for k in range(2):
        yy = y - S(124) + k * S(30)
        draw.line((x - S(40) - e, yy, x + S(40) + e, yy), fill=SOCK_LIGHT, width=max(2, int(S(8))))
    draw.ellipse((x - S(42) - e, y - S(44), x - S(2), y + S(4)), fill=SOCK_LIGHT)


def draw_leg(draw, x, y, s, state="bare"):
    """(x, y) = heel at the floor. state: bare / sock / shoe / funny (sock pulled over the shoe)."""
    def S(v):
        return v * s
    draw.rounded_rectangle((x - S(36), y - S(300), x + S(36), y - S(20)), radius=S(30), fill=K.SKIN)
    draw.rounded_rectangle((x - S(36), y - S(62), x + S(112), y), radius=S(30), fill=K.SKIN)
    draw.rounded_rectangle((x - S(62), y - S(350), x + S(62), y - S(250)), radius=S(22), fill=(40, 60, 120))
    if state in ("sock", "shoe"):
        draw_sock(draw, x, y, s)
    if state in ("shoe", "funny"):
        draw_shoe(draw, x, y, s)
    if state == "funny":
        draw_sock(draw, x - S(4), y + S(4), s, stretch=1.0, foot=56)
        draw.rounded_rectangle((x - S(56), y + S(8), x + S(132), y + S(22)), radius=S(7), fill=WHITE,
                               outline=K.DEV_DARK, width=max(1, int(S(3))))
        for k in range(2):
            bx = x + S(4) + k * S(26)
            draw.arc((bx - S(14), y - S(96), bx + S(14), y - S(68)), 200, 340, fill=SOCK_LIGHT,
                     width=max(2, int(S(6))))


def draw_door(draw, cx, by, s, open_t=0.0, locked=False):
    def S(v):
        return v * s
    draw.rectangle((cx - S(140) + S(10), by - S(450) + S(12), cx + S(140) + S(10), by + S(6)), fill=K.SHADOW)
    draw.rectangle((cx - S(140), by - S(450), cx + S(140), by), fill=WOOD_DARK)
    o = K.clamp01(open_t)
    draw.rectangle((cx - S(116), by - S(426), cx + S(116), by), fill=WARM if o > 0 else K.DEV_DARK)
    x0, x1 = cx - S(116), cx + S(116)
    if o <= 0:
        draw.rectangle((x0, by - S(426), x1, by), fill=WOOD)
        for py0, py1 in ((by - S(400), by - S(250)), (by - S(210), by - S(30))):
            draw.rounded_rectangle((x0 + S(28), py0, x1 - S(28), py1), radius=S(10), outline=WOOD_DARK,
                                   width=max(2, int(S(6))))
        kx, ky = x1 - S(34), by - S(228)
        draw.ellipse((kx - S(16), ky - S(16), kx + S(16), ky + S(16)), fill=K.GOLD, outline=K.DEV_DARK,
                     width=max(1, int(S(3))))
        if locked:
            K.draw_padlock(draw, kx - S(6), ky + S(50), 0.4 * s, K.GOLD)
        return
    draw.rectangle((x0, by - S(40), x1, by), fill=(236, 200, 120))
    far = x0 + S(232) * (1 - 0.7 * o)
    sk = S(34) * o
    pts = [(x0, by - S(426)), (far, by - S(426) - sk), (far, by + sk * 0.3), (x0, by)]
    draw.polygon(pts, fill=WOOD, outline=WOOD_DARK, width=max(2, int(S(4))))
    kx = x0 + (far - x0) * 0.84
    draw.ellipse((kx - S(12), by - S(240), kx + S(12), by - S(216)), fill=K.GOLD)


def draw_lunchbox(draw, cx, cy, s, open_t=0.0):
    def S(v):
        return v * s
    o = K.ease_out_cubic(K.clamp01(open_t))
    draw.ellipse((cx - S(150), cy + S(62), cx + S(150), cy + S(102)), fill=K.SHADOW)
    if o > 0:
        lx = cx + S(60) * o
        ly = cy - S(48) - S(80) * o
        lid = rot([(lx - S(140), ly - S(18)), (lx + S(140), ly - S(18)), (lx + S(140), ly + S(18)),
                   (lx - S(140), ly + S(18))], lx, ly, 0.32 * o)
        draw.polygon(lid, fill=K.STEEL, outline=K.STEEL_DARK, width=max(2, int(S(4))))
        knob = rot([(lx - S(30), ly - S(38)), (lx + S(30), ly - S(38)), (lx + S(30), ly - S(16)),
                    (lx - S(30), ly - S(16))], lx, ly, 0.32 * o)
        draw.polygon(knob, fill=K.STEEL_DARK)
    draw.rounded_rectangle((cx - S(130), cy - S(40), cx + S(130), cy + S(84)), radius=S(30), fill=K.STEEL,
                           outline=K.STEEL_DARK, width=max(2, int(S(4))))
    draw.line((cx - S(96), cy + S(10), cx + S(50), cy + S(10)), fill=(232, 236, 242), width=max(2, int(S(7))))
    if o > 0:
        draw.ellipse((cx - S(122), cy - S(62), cx + S(122), cy - S(18)), fill=K.STEEL_DARK)
        draw.chord((cx - S(112), cy - S(56), cx + S(112), cy - S(24)), 90, 270, fill=(252, 250, 242))
        draw.chord((cx - S(112), cy - S(56), cx + S(112), cy - S(24)), 270, 90, fill=(238, 184, 54))
    else:
        draw.rounded_rectangle((cx - S(140), cy - S(66), cx + S(140), cy - S(30)), radius=S(16), fill=K.STEEL,
                               outline=K.STEEL_DARK, width=max(2, int(S(4))))
        draw.rounded_rectangle((cx - S(30), cy - S(86), cx + S(30), cy - S(64)), radius=S(8), fill=K.STEEL_DARK)


def draw_spoon(draw, x, y, s, ang=-0.7):
    def S(v):
        return v * s
    tip = (x + math.cos(ang) * S(150), y + math.sin(ang) * S(150))
    draw.line((x, y, tip[0], tip[1]), fill=K.STEEL_DARK, width=max(3, int(S(14))))
    draw.ellipse((x - S(30), y - S(22), x + S(30), y + S(22)), fill=K.STEEL, outline=K.STEEL_DARK,
                 width=max(2, int(S(4))))


def draw_zipbag(draw, cx, cy, s, zip_open=0.0, tiffin_out=0.0, col=K.CORAL):
    def S(v):
        return v * s
    draw.arc((cx - S(70), cy - S(240), cx + S(70), cy - S(110)), 180, 360, fill=K.DEV_DARK, width=max(3, int(S(16))))
    out = K.ease_out_cubic(K.clamp01(tiffin_out))
    if out > 0:
        K.draw_tiffin(draw, cx, cy - S(60) - S(250) * out, 0.75 * s)
    draw.rounded_rectangle((cx - S(150) + S(8), cy - S(150) + S(10), cx + S(150) + S(8), cy + S(170) + S(10)),
                           radius=S(50), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(150), cy - S(150), cx + S(150), cy + S(170)), radius=S(50), fill=col)
    dark = tuple(int(c * 0.8) for c in col)
    draw.rounded_rectangle((cx - S(96), cy + S(30), cx + S(96), cy + S(130)), radius=S(24), fill=dark)
    draw.line((cx - S(70), cy + S(56), cx + S(70), cy + S(56)), fill=tuple(int(c * 0.65) for c in col),
              width=max(2, int(S(5))))
    zy = cy - S(96)
    zo = K.clamp01(zip_open)
    x0, x1 = cx - S(120), cx + S(120)
    xp = x0 + (x1 - x0) * zo
    if zo > 0.02:
        draw.rounded_rectangle((x0, zy - S(22), max(x0 + S(30), xp), zy + S(22)), radius=S(18), fill=K.DEV_DEEP)
    for k in range(25):
        tx = x0 + k * S(10)
        if tx < xp:
            continue
        draw.line((tx, zy - S(7), tx, zy + S(7)), fill=K.DEV_DARK, width=max(1, int(S(4))))
    draw.rounded_rectangle((xp - S(12), zy - S(4), xp + S(12), zy + S(42)), radius=S(6), fill=K.GOLD,
                           outline=K.DEV_DARK, width=max(1, int(S(3))))


def draw_carton(draw, cx, cy, s, open_t=0.0, tilt=0.0):
    """Returns the spout tip (for a pour stream)."""
    def S(v):
        return v * s

    def P(pts):
        return rot([(cx + S(x), cy + S(y)) for x, y in pts], cx, cy, tilt)
    ow = max(2, int(S(4)))
    draw.polygon(P([(-62, -70), (78, -70), (78, 140), (-62, 140)]), fill=K.SHADOW)
    draw.polygon(P([(-70, -80), (70, -80), (70, 130), (-70, 130)]), fill=MILK, outline=K.DEV_DARK, width=ow)
    draw.polygon(P([(-70, -80), (70, -80), (52, -140), (-52, -140)]), fill=CARTON_TOP, outline=K.DEV_DARK, width=ow)
    draw.polygon(P([(-70, -6), (70, -6), (70, 70), (-70, 70)]), fill=K.ROAD)
    draw.polygon(P(ring(0, 40, 18, 14)), fill=WHITE)
    draw.polygon(P([(-15, 32), (15, 32), (0, 4)]), fill=WHITE)
    if open_t > 0:
        draw.polygon(P([(-52, -140), (6, -140), (6, -162), (-52, -162)]), fill=CARTON_TOP, outline=K.DEV_DARK,
                     width=ow)
        draw.polygon(P([(6, -140), (52, -140), (80, -180), (34, -180)]), fill=(200, 214, 236), outline=K.DEV_DARK,
                     width=ow)
        draw.polygon(P([(16, -150), (46, -150), (64, -172), (36, -172)]), fill=K.DEV_DEEP)
    else:
        draw.polygon(P([(-52, -140), (52, -140), (52, -164), (-52, -164)]), fill=CARTON_TOP, outline=K.DEV_DARK,
                     width=ow)
    return P([(76, -178)])[0]


def draw_tumbler(draw, cx, by, s, level=0.0, color=JUICE, straw=False, ice=False):
    def S(v):
        return v * s
    tw, bw, h = S(56), S(42), S(150)
    pts = [(cx - tw, by - h), (cx + tw, by - h), (cx + bw, by), (cx - bw, by)]
    draw.polygon([(x + S(6), y + S(8)) for x, y in pts], fill=K.SHADOW)
    if straw:
        draw.line((cx + S(8), by - S(30), cx + S(34), by - h - S(40), cx + S(70), by - h - S(56)), fill=K.CORAL,
                  width=max(3, int(S(10))), joint="curve")
    draw.polygon(pts, fill=(240, 248, 253))
    lv = K.clamp01(level)
    if lv > 0:
        wy = by - h * 0.86 * lv
        wx = bw + (tw - bw) * ((by - wy) / h)
        draw.polygon([(cx - wx, wy), (cx + wx, wy), (cx + bw, by), (cx - bw, by)], fill=color)
        if ice and lv > 0.4:
            for k, (dx, dy) in enumerate(((-18, 18), (14, 34))):
                draw.rounded_rectangle((cx + S(dx) - S(14), wy + S(dy) - S(14), cx + S(dx) + S(14), wy + S(dy) + S(14)),
                                       radius=S(5), fill=(250, 252, 255), outline=(200, 220, 236),
                                       width=max(1, int(S(3))))
    if straw:
        draw.line((cx + S(8), by - S(30), cx + S(24), by - h + S(6)), fill=K.CORAL, width=max(3, int(S(10))))
    draw.polygon(pts, outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.line((cx - tw + S(16), by - h + S(18), cx - bw + S(12), by - S(16)), fill=WHITE, width=max(2, int(S(6))))


def draw_lemon(draw, cx, cy, s, half=False):
    def S(v):
        return v * s
    if half:
        draw.ellipse((cx - S(56), cy - S(56), cx + S(68), cy + S(68)), fill=K.SHADOW)
        draw.ellipse((cx - S(62), cy - S(62), cx + S(62), cy + S(62)), fill=LEMON_DARK)
        draw.ellipse((cx - S(53), cy - S(53), cx + S(53), cy + S(53)), fill=(255, 250, 222))
        draw.ellipse((cx - S(46), cy - S(46), cx + S(46), cy + S(46)), fill=LEMON)
        for k in range(8):
            a = k * math.pi / 4
            draw.line((cx, cy, cx + math.cos(a) * S(46), cy + math.sin(a) * S(46)), fill=(255, 250, 222),
                      width=max(2, int(S(5))))
        return
    draw.ellipse((cx - S(60), cy - S(40), cx + S(72), cy + S(58)), fill=K.SHADOW)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * S(86), cy), (cx + sx * S(54), cy - S(18)), (cx + sx * S(54), cy + S(18))], fill=LEMON)
    draw.ellipse((cx - S(66), cy - S(50), cx + S(66), cy + S(50)), fill=LEMON)
    draw.arc((cx - S(46), cy - S(36), cx + S(10), cy + S(12)), 200, 262, fill=(255, 242, 176), width=max(2, int(S(8))))
    draw.polygon([(cx + S(10), cy - S(48)), (cx + S(54), cy - S(78)), (cx + S(36), cy - S(40))], fill=K.LEAF)


def draw_brush(draw, x, y, s, paste=False):
    """(x, y) = brush head; the handle runs to the left."""
    def S(v):
        return v * s
    draw.rounded_rectangle((x - S(190), y - S(14), x - S(30), y + S(14)), radius=S(14), fill=K.CORAL)
    draw.rounded_rectangle((x - S(50), y - S(16), x + S(50), y + S(14)), radius=S(12), fill=(240, 240, 244),
                           outline=K.DEV_DARK, width=max(1, int(S(3))))
    for k in range(7):
        bx = x - S(40) + k * S(12)
        draw.rectangle((bx, y - S(50), bx + S(7), y - S(16)), fill=(140, 200, 236))
    if paste:
        draw.rounded_rectangle((x - S(44), y - S(78), x + S(46), y - S(48)), radius=S(14), fill=WHITE,
                               outline=(160, 210, 220), width=max(1, int(S(3))))
        draw.line((x - S(32), y - S(63), x + S(34), y - S(63)), fill=(13, 148, 136), width=max(2, int(S(6))))


def draw_fist(draw, x, y, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((x - S(26), y + S(20), x + S(26), y + S(120)), radius=S(14), fill=K.SKIN)
    draw.rounded_rectangle((x - S(34), y + S(96), x + S(34), y + S(140)), radius=S(12), fill=K.CORAL)
    draw.rounded_rectangle((x - S(42), y - S(36), x + S(42), y + S(36)), radius=S(22), fill=K.SKIN,
                           outline=(206, 150, 116), width=max(1, int(S(3))))
    for k in range(3):
        yy = y - S(14) + k * S(16)
        draw.line((x + S(4), yy, x + S(40), yy), fill=(206, 150, 116), width=max(1, int(S(4))))
    draw.ellipse((x - S(30), y - S(48), x + S(14), y - S(18)), fill=K.SKIN, outline=(206, 150, 116),
                 width=max(1, int(S(3))))


def draw_paste(draw, x, y, s):
    """Tube lying flat, nozzle on the right at (x + 90, y)."""
    def S(v):
        return v * s
    draw.polygon([(x - S(120), y - S(40)), (x + S(40), y - S(36)), (x + S(70), y - S(16)), (x + S(70), y + S(16)),
                  (x + S(40), y + S(36)), (x - S(120), y + S(40))], fill=WHITE, outline=K.DEV_DARK,
                 width=max(2, int(S(4))))
    draw.rectangle((x - S(132), y - S(44), x - S(116), y + S(44)), fill=K.STEEL_DARK)
    draw.rectangle((x - S(70), y - S(14), x + S(20), y + S(14)), fill=(13, 148, 136))
    draw.rounded_rectangle((x + S(70), y - S(14), x + S(100), y + S(14)), radius=S(5), fill=K.CORAL)


def draw_smile(draw, x, y, s, t=0.0):
    def S(v):
        return v * s
    draw.chord((x - S(110), y - S(80), x + S(110), y + S(80)), 0, 180, fill=LIPS)
    draw.chord((x - S(90), y - S(60), x + S(90), y + S(58)), 0, 180, fill=(120, 30, 40))
    for k in range(6):
        tx = x - S(78) + k * S(26)
        draw.rounded_rectangle((tx, y - S(2), tx + S(24), y + S(26)), radius=S(6), fill=WHITE)
    draw.chord((x - S(46), y + S(20), x + S(46), y + S(70)), 180, 360, fill=(236, 120, 130))
    for k, (dx, dy) in enumerate(((-120, -40), (120, -30), (0, -70))):
        K.draw_star(draw, x + S(dx), y + S(dy), S(16) + S(5) * math.sin(t * 12 + k), K.GOLD, rot=t * 3 + k)


def draw_jug(draw, cx, cy, s, tilt=0.0):
    """Returns the spout tip."""
    def S(v):
        return v * s

    def P(pts):
        return rot([(cx + S(x), cy + S(y)) for x, y in pts], cx, cy, tilt)
    body = [(-60, -80), (50, -80), (80, -100), (64, -60), (60, 90), (-60, 90)]
    draw.polygon(P([(x + 6, y + 8) for x, y in body]), fill=K.SHADOW)
    draw.polygon(P(body), fill=(220, 236, 250), outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.polygon(P([(-56, -20), (58, -20), (58, 86), (-56, 86)]), fill=K.WATER)
    draw.line(P([(-60, -50), (-100, -40), (-100, 40), (-60, 50)]), fill=K.DEV_DARK, width=max(3, int(S(12))),
              joint="curve")
    return P([(80, -100)])[0]


def draw_pan(draw, cx, cy, s, t=0.0):
    def S(v):
        return v * s
    draw.line((cx + S(150), cy, cx + S(330), cy - S(30)), fill=K.DEV_DARK, width=max(4, int(S(26))))
    draw.ellipse((cx - S(170) + S(8), cy - S(110) + S(10), cx + S(170) + S(8), cy + S(110) + S(10)), fill=K.SHADOW)
    draw.ellipse((cx - S(170), cy - S(110), cx + S(170), cy + S(110)), fill=K.DEV_DARK)
    draw.ellipse((cx - S(140), cy - S(86), cx + S(140), cy + S(86)), fill=(70, 78, 94))
    for k, (dx, dy, r) in enumerate(((-60, -20, 40), (20, -36, 34), (60, 20, 42), (-20, 30, 38), (-80, 34, 26),
                                     (90, -24, 24))):
        wob = S(4) * math.sin(t * 14 + k)
        draw.ellipse((cx + S(dx) - S(r), cy + S(dy) - S(r) * 0.75 + wob, cx + S(dx) + S(r), cy + S(dy) + S(r) * 0.75 + wob),
                     fill=EGG)
        draw.ellipse((cx + S(dx) - S(r) * 0.4, cy + S(dy) - S(r) * 0.4 + wob, cx + S(dx) + S(r) * 0.2,
                      cy + S(dy) + wob), fill=(255, 236, 160))


def draw_bus(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(190) + S(8), cy - S(80) + S(10), cx + S(190) + S(8), cy + S(70) + S(10)),
                           radius=S(26), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(190), cy - S(80), cx + S(190), cy + S(70)), radius=S(26), fill=BUS,
                           outline=K.DEV_DARK, width=max(2, int(S(4))))
    for k in range(4):
        wx = cx - S(170) + k * S(80)
        draw.rounded_rectangle((wx, cy - S(60), wx + S(62), cy - S(10)), radius=S(10), fill=K.DEV_SCREEN,
                               outline=K.DEV_DARK, width=max(1, int(S(3))))
    draw.rounded_rectangle((cx + S(150), cy - S(60), cx + S(180), cy + S(40)), radius=S(8), fill=K.DEV_SCREEN,
                           outline=K.DEV_DARK, width=max(1, int(S(3))))
    draw.rectangle((cx - S(190), cy + S(10), cx + S(190), cy + S(22)), fill=K.DEV_DARK)
    for wx in (cx - S(110), cx + S(110)):
        draw.ellipse((wx - S(32), cy + S(40), wx + S(32), cy + S(104)), fill=K.DEV_DEEP)
        draw.ellipse((wx - S(12), cy + S(60), wx + S(12), cy + S(84)), fill=K.STEEL)


def draw_cloud(draw, box, fill, outline):
    x0, y0, x1, y1 = box
    w_, h_ = x1 - x0, y1 - y0
    bumps = [(0.15, 0.2), (0.38, 0.05), (0.62, 0.05), (0.85, 0.2), (0.9, 0.7), (0.65, 0.92), (0.35, 0.92),
             (0.1, 0.7)]
    for bx, by in bumps:
        r = h_ * 0.34
        px, py = x0 + bx * w_, y0 + by * h_
        draw.ellipse((px - r, py - r, px + r, py + r), fill=fill, outline=outline, width=4)
    for bx, by in bumps:
        r = h_ * 0.34 - 4
        px, py = x0 + bx * w_, y0 + by * h_
        draw.ellipse((px - r, py - r, px + r, py + r), fill=fill)
    draw.rounded_rectangle((x0 + w_ * 0.08, y0 + h_ * 0.12, x1 - w_ * 0.08, y1 - h_ * 0.12), radius=40, fill=fill)


def icon(draw, kind, x, y, s, t=0.0):
    if kind == "sock":
        draw_sock(draw, x - 34 * s, y + 96 * s, 0.85 * s)
    elif kind == "shoe":
        draw_shoe(draw, x - 40 * s, y + 40 * s, 1.0 * s)
    elif kind == "unlock":
        draw_door(draw, x - 40 * s, y + 130 * s, 0.55 * s, locked=True)
        K.draw_key(draw, x + 110 * s, y + 10 * s, 0.4 * s, K.GOLD)
    elif kind == "opendoor":
        draw_door(draw, x, y + 130 * s, 0.55 * s, open_t=1.0)
    elif kind == "lunch_closed":
        draw_lunchbox(draw, x, y + 30 * s, 0.75 * s)
    elif kind == "lunch_eat":
        draw_lunchbox(draw, x - 30 * s, y + 50 * s, 0.7 * s, open_t=1.0)
        draw_spoon(draw, x + 40 * s, y - 40 * s, 0.6 * s)
    elif kind == "pickup":
        draw_brush(draw, x + 90 * s, y, 0.8 * s)
        draw_fist(draw, x - 40 * s, y + 4 * s, 0.8 * s)
    elif kind == "paste":
        draw_paste(draw, x - 30 * s, y - 60 * s, 0.75 * s)
        draw.line((x + 44 * s, y - 50 * s, x + 50 * s, y + 4 * s), fill=WHITE, width=max(3, int(16 * s)))
        draw_brush(draw, x + 60 * s, y + 80 * s, 0.75 * s, paste=True)
    elif kind == "brushteeth":
        draw_smile(draw, x - 20 * s, y - 10 * s, 0.8 * s, t)
        draw_brush(draw, x + 110 * s, y + 110 * s, 0.55 * s, paste=True)
    elif kind == "zip_open":
        draw_zipbag(draw, x, y + 50 * s, 0.55 * s, zip_open=1.0)
    elif kind == "tiffin_out":
        draw_zipbag(draw, x, y + 90 * s, 0.45 * s, zip_open=1.0, tiffin_out=1.0)
    elif kind == "zip_close":
        draw_zipbag(draw, x, y + 50 * s, 0.55 * s, zip_open=0.0)
    elif kind == "drink":
        draw_tumbler(draw, x, y + 90 * s, 0.95 * s, level=0.35, straw=True)
        K.draw_heart(draw, x + 100 * s, y - 50 * s, 24 * s, K.CORAL)
    elif kind == "drink_empty":
        draw_tumbler(draw, x, y + 90 * s, 0.95 * s, level=0.0, straw=True)
    elif kind == "squeeze":
        draw_lemon(draw, x - 10 * s, y - 70 * s, 0.6 * s, half=True)
        for k in range(3):
            dy = ((t * 3 + k / 3) % 1) * 50 * s
            draw.ellipse((x - 18 * s, y - 20 * s + dy, x - 2 * s, y - 2 * s + dy), fill=LEMON_DARK)
        draw_tumbler(draw, x, y + 120 * s, 0.6 * s, level=0.6, color=(206, 232, 248))
    elif kind == "stir":
        draw_tumbler(draw, x - 10 * s, y + 100 * s, 0.85 * s, level=0.8, color=JUICE)
        draw.line((x + 4 * s, y + 40 * s, x + 60 * s, y - 80 * s), fill=K.STEEL_DARK, width=max(3, int(10 * s)))
        for k in range(3):
            bx = x + 80 * s + (k % 2) * 34 * s
            by = y + 60 * s - (k // 2) * 34 * s
            draw.rounded_rectangle((bx, by, bx + 30 * s, by + 30 * s), radius=5 * s, fill=WHITE, outline=K.DEV_DARK,
                                   width=max(1, int(3 * s)))
    elif kind == "glass":
        draw_tumbler(draw, x, y + 90 * s, 0.95 * s, level=0.0)
    elif kind == "pour":
        tip = draw_jug(draw, x - 40 * s, y - 20 * s, 0.6 * s, tilt=0.9)
        draw.line((tip[0], tip[1], tip[0] + 10 * s, y + 110 * s), fill=K.WATER_DEEP, width=max(3, int(10 * s)))
        draw.ellipse((x - 20 * s, y + 100 * s, x + 130 * s, y + 130 * s), fill=K.WATER)
    elif kind == "carton_pour":
        draw_carton(draw, x, y, 0.55 * s, open_t=0.0)
    elif kind == "carton_open":
        draw_carton(draw, x, y + 10 * s, 0.55 * s, open_t=1.0)


# ---- layout helpers -------------------------------------------------------------

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
    gold_soft = K.hex_rgb("#FFF4DA")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    F = K.load_font
    palette = [coral, sage, K.BOTH_COLOR, K.GOLD]

    def stars_at(x, y, r, n=4):
        for i in range(n):
            a = i * 2 * math.pi / n + 0.4
            sx = x + math.cos(a) * r
            sy = y + math.sin(a) * r * 0.7 + 10 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 20 + 6 * pulse, palette[i % 4], rot=progress * 3 + i)

    def star_list(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(draw, sx, sy + 8 * math.sin(progress * 9 + i), 20 + 6 * pulse, palette[i % 4],
                        rot=progress * 3 + i)

    def qmarks(pts, size=80):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(int(size + 20 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def note(box, title, rows, shown=None, marks=None, size=44, title_col=None):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=24, fill=(255, 250, 238))
        draw.line((x0 + 80, y0 + 10, x0 + 80, y1 - 10), fill=(240, 170, 170), width=3)
        K.text_at(draw, title, (x0 + x1) / 2, y0 + 30, F(42, bold=True), title_col or coral)
        for i, lab in enumerate(rows):
            yy = y0 + 120 + i * 100
            draw.line((x0 + 30, yy + 70, x1 - 30, yy + 70), fill=(220, 210, 232), width=2)
            if shown is not None and K.clamp01((shown - i) * 3) <= 0:
                continue
            draw.text((x0 + 110, yy + 8), lab, fill=ink, font=F(size, bold=True))
            if marks and i < len(marks) and marks[i]:
                (K.draw_check if marks[i] == "ok" else K.draw_cross)(
                    draw, x1 - 60, yy + 34, 24, sage if marks[i] == "ok" else K.DANGER)

    def step_card(box, num, label, kind, col, state="normal", label_size=34, icon_s=1.0):
        x0, y0, x1, y1 = box
        mx = (x0 + x1) / 2
        out = sage if state == "win" else K.DANGER if state == "bad" else None
        K.shadow_card(draw, box, brand, radius=28, outline=out, outline_w=6 if out else 3)
        if state == "win":
            draw.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=24, fill=sage_soft)
        elif state == "bad":
            draw.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=24, fill=K.DANGER_SOFT)
        if num is not None:
            K.pill(draw, 0, y0 + 20, str(num), sage if state == "win" else col, size=28, left=x0 + 20)
        if kind:
            icon(draw, kind, mx, y0 + (y1 - y0) * 0.42, icon_s, t)
        font = F(label_size, bold=True)
        lines = K.wrap_text(label, font, int(x1 - x0 - 40))
        lh = int(label_size * 1.2)
        ty = y1 - 26 - len(lines) * lh
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, mx, ty + j * lh, font, ink)
        if state == "win":
            K.draw_check(draw, x1 - 44, y0 + 44, 26, sage)
        elif state == "bad":
            K.draw_cross(draw, x1 - 44, y0 + 44, 26, K.DANGER)

    def reorder_row(steps, ranks, move, y0, y1, cw, gap, states=None, num_mode="slot", label_size=34, icon_s=0.9):
        """steps drawn at slot lerp(i, ranks[i], move)."""
        n = len(steps)
        x_start = cx - (n * cw + (n - 1) * gap) / 2
        for i in sorted(range(n), key=lambda k: abs(ranks[k] - k) * move):
            kind, lab = steps[i]
            pos = K.lerp(i, ranks[i], move)
            x0 = x_start + pos * (cw + gap)
            arc = -60 * math.sin(math.pi * move) if ranks[i] != i else 0
            num = (ranks[i] + 1) if move >= 0.5 else (i + 1)
            st = states[i] if states else "normal"
            step_card((x0, y0 + arc, x0 + cw, y1 + arc), num, lab, kind, coral, st, label_size=label_size,
                      icon_s=icon_s)
        if move >= 1.0 or move <= 0.0:
            for k in range(n - 1):
                ax = x_start + k * (cw + gap) + cw + 8
                K.draw_arrow(draw, ax, (y0 + y1) / 2, ax + gap - 16, (y0 + y1) / 2, muted, width=8, head=22)

    def tile(x, y, label, col, size=96):
        draw.rounded_rectangle((x - size / 2 + 6, y - size / 2 + 8, x + size / 2 + 6, y + size / 2 + 8), radius=22,
                               fill=K.SHADOW)
        draw.rounded_rectangle((x - size / 2, y - size / 2, x + size / 2, y + size / 2), radius=22, fill=col)
        K.text_at(draw, label, x, y - size * 0.36, F(int(size * 0.56), bold=True), WHITE)

    # ---- opening -------------------------------------------------------------
    if visual == "a7-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 260), 450, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 260, 500, 0.95, t, mood="happy", wave=t)
            K.text_at(draw, "Welcome back, champ!", cx, 740, F(60, bold=True), ink)
            star_list([(cx - 560, 330), (cx + 560, 330), (cx - 640, 520), (cx + 640, 520)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (220, 240 + lift, w - 220, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · CHAPTER 1", cx, 300 + lift, F(34, bold=True), sage)
            steps = ["Pick up a glass", "Go to the filter", "Fill it with water", "Bring it to me"]
            for i, lab in enumerate(steps):
                a = K.stagger(progress, i, step=0.08, speed=5)
                if a <= 0:
                    continue
                y = 380 + i * 92 + int((1 - a) * 30) + lift
                draw.rounded_rectangle((320, y, 1040, y + 76), radius=22, fill=sage_soft)
                K.pill(draw, 0, y + 14, str(i + 1), sage, size=26, left=340)
                draw.text((430, y + 16), lab, fill=ink, font=F(38, bold=True))
            a = K.stagger(progress, 5, step=0.08, speed=4)
            if a > 0:
                K.pill(draw, 680, 768 + int((1 - a) * 20) + lift, "Algorithm = clear steps, in order", coral, size=32)
            draw.ellipse((1400 - 210, 560 - 210 + lift, 1400 + 210, 560 + 210 + lift), fill=blue_soft)
            hx, hy = K.draw_robot(draw, 1380, 600 + lift, 0.72, t, mood="happy", hold=True)
            K.draw_glass(draw, hx + 8, hy + 34, 0.62, 1.0)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 302 + lift, F(32, bold=True), coral)
            K.text_at(draw, "Sequencing", cx, 360 + lift, F(96, bold=True), ink)
            start = [2, 0, 3, 1]
            m = K.ease_in_out(K.clamp01((progress - 0.25) * 1.8))
            for i in range(4):
                pos = K.lerp(start[i], i, m)
                x = cx - 330 + pos * 220
                y = 690 - 70 * math.sin(math.pi * m) * (1 if i % 2 else -1) * (start[i] != i)
                tile(x, y, str(i + 1), palette[i], 120)
            if m >= 1:
                for i in range(3):
                    x = cx - 330 + i * 220 + 70
                    K.draw_arrow(draw, x, 690, x + 80, 690, muted, width=8, head=22)
            return True
        if focus == "word":
            K.text_at(draw, "Sequencing", cx, 240 + lift, F(96, bold=True), coral)
            K.text_at(draw, "putting steps in the right order", cx, 370 + lift, F(56, bold=True), ink)
            labels = [("First", coral), ("Then", K.BOTH_COLOR), ("Last", sage)]
            for i, (lab, col) in enumerate(labels):
                a = K.stagger(progress, i + 1, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx - 420 + i * 420
                y = 520 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 150, y, x + 150, y + 220), radius=36, fill=panel, outline=col, width=6)
                draw.ellipse((x - 44, y + 30, x + 44, y + 118), fill=col)
                K.text_at(draw, str(i + 1), x, y + 40, F(54, bold=True), WHITE)
                K.text_at(draw, lab, x, y + 140, F(46, bold=True), col)
                if i < 2:
                    K.draw_arrow(draw, x + 160, y + 110, x + 260, y + 110, muted, width=8, head=24)
            qmarks([(cx - 760, 600), (cx + 760, 600)], 90)
            return True
        # promise
        draw.ellipse((470 - 230, 560 - 230, 470 + 230, 560 + 230), fill=coral_soft)
        K.draw_person(draw, 470, 470, 1.2, "kid", t)
        bx, by = 1180, 560
        draw.polygon([(bx - 300 + 8, by - 150 + 10), (bx + 8, by - 110 + 10), (bx + 8, by + 170 + 10),
                      (bx - 300 + 8, by + 130 + 10)], fill=K.SHADOW)
        draw.polygon([(bx - 300, by - 150), (bx, by - 110), (bx, by + 170), (bx - 300, by + 130)], fill=panel,
                     outline=ink, width=4)
        draw.polygon([(bx + 300, by - 150), (bx, by - 110), (bx, by + 170), (bx + 300, by + 130)], fill=panel,
                     outline=ink, width=4)
        draw_leg(draw, bx - 170, by + 100, 0.55, "funny")
        for k in range(4):
            yy = by - 60 + k * 50
            draw.line((bx + 40, yy, bx + 250, yy + 6), fill=line, width=8)
        K.draw_robot(draw, 1640, 620, 0.62, t, mood="happy")
        K.text_at(draw, "Story time!", 1180, 240 + lift, F(60, bold=True), coral)
        a = K.stagger(progress, 2, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1180, 780 + int((1 - a) * 20), "Order really matters", sage, size=36)
        return True

    # ---- the socks story -----------------------------------------------------------
    if visual == "a7-hook":
        if focus == "meet":
            K.draw_person(draw, 420, 460, 1.2, "kid", t)
            K.draw_stopwatch(draw, 210, 300, 46, progress, brand)
            K.draw_bubble(draw, (600, 240, 1220, 400), brand, "Robo, help me get dressed!", tail="left", size=44)
            K.draw_robot(draw, 1500, 600, 1.0, t, mood="happy")
            bx = 960 + 40 * math.sin(progress * math.pi)
            draw_bus(draw, bx, 730, 0.8)
            K.text_at(draw, "Running late!", 420, 800, F(36, bold=True), K.DANGER)
            return True
        if focus == "list":
            note((180, 250, 960, 820), "Robo's steps", [], None)
            rows = [("shoe", "Put on shoes"), ("sock", "Put on socks")]
            for i, (kind, lab) in enumerate(rows):
                a = K.stagger(progress, i, step=0.3, speed=4)
                if a <= 0:
                    continue
                y = 380 + i * 210 + int((1 - a) * 30)
                K.pill(draw, 0, y + 50, str(i + 1), coral, size=34, left=290)
                draw.text((400, y + 50), lab, fill=ink, font=F(50, bold=True))
                icon(draw, kind, 830, y + 40, 0.75, t)
            K.draw_robot(draw, 1420, 610, 1.0, t, mood="idle")
            return True
        if focus == "funny":
            state = "funny" if progress > 0.45 else "shoe" if progress > 0.15 else "bare"
            draw.ellipse((720 - 280, 560 - 280, 720 + 280, 560 + 280), fill=lav_soft)
            draw_leg(draw, 660, 800, 1.3, state)
            K.draw_robot(draw, 1420, 610, 0.95, t, mood="happy")
            if progress > 0.45:
                K.text_at(draw, "Oh no!", 1040, 250, F(76, bold=True), K.DANGER)
                star_list([(420, 360), (1010, 470), (440, 700), (1010, 720)])
            return True
        if focus == "why":
            note((160, 300, 760, 640), "Robo's steps", ["1. Shoes", "2. Socks"], size=44)
            draw.ellipse((1220 - 270, 580 - 270, 1220 + 270, 580 + 270), fill=lav_soft)
            K.draw_robot(draw, 1220, 630, 0.95, t, mood="confused")
            qmarks([(880, 300), (1560, 290), (900, 600), (1580, 580)], 90)
            K.text_at(draw, "What went wrong?", 1220, 232, F(50, bold=True), ink)
            K.draw_stopwatch(draw, 460, 760, 50, progress, brand)
            return True
        if focus == "because":
            K.text_at(draw, "Nothing missing…", cx, 236, F(52, bold=True), ink)
            cards = [("shoe", "Put on shoes"), ("sock", "Put on socks")]
            for i, (kind, lab) in enumerate(cards):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x0 = cx - 560 + i * 600
                y0 = 320 + int((1 - a) * 40)
                step_card((x0, y0, x0 + 520, y0 + 400), i + 1, lab, kind, coral, label_size=40, icon_s=1.1)
                K.draw_check(draw, x0 + 476, y0 + 44, 26, sage)
            K.draw_arrow(draw, cx - 30, 520, cx + 30, 520, muted, width=8, head=22)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 770 + int((1 - a) * 20), "…just the WRONG ORDER!", K.DANGER, size=40)
            return True
        # fixed
        m = K.ease_in_out(K.clamp01(progress * 2.2))
        cards = [("shoe", "Put on shoes"), ("sock", "Put on socks")]
        ranks = [1, 0]
        for i in sorted(range(2), key=lambda k: k):
            kind, lab = cards[i]
            pos = K.lerp(i, ranks[i], m)
            y0 = 270 + pos * 290
            x0 = 160 + (90 * math.sin(math.pi * m) * (1 if i == 0 else -1))
            done = m >= 1
            box = (x0, y0, x0 + 700, y0 + 250)
            K.shadow_card(draw, box, brand, radius=28, outline=sage if done else None, outline_w=6 if done else 3)
            if done:
                draw.rounded_rectangle((x0 + 6, y0 + 6, x0 + 694, y0 + 244), radius=24, fill=sage_soft)
            K.pill(draw, 0, y0 + 30, str(ranks[i] + 1 if m >= 0.5 else i + 1), sage if done else coral, size=30,
                   left=x0 + 28)
            icon(draw, kind, x0 + 210, y0 + 110, 0.62, t)
            draw.text((x0 + 340, y0 + 98), lab, fill=ink, font=F(46, bold=True))
            if done:
                K.draw_check(draw, x0 + 650, y0 + 50, 24, sage)
        state = "shoe" if progress > 0.7 else "sock" if progress > 0.5 else "bare"
        draw.ellipse((1260 - 240, 600 - 240, 1260 + 240, 600 + 240), fill=sage_soft)
        draw_leg(draw, 1210, 810, 1.15, state)
        K.draw_robot(draw, 1690, 640, 0.62, t, mood="happy")
        if progress > 0.75:
            K.draw_heart(draw, 1460, 380 + bounce, 30, coral)
            star_list([(1010, 360), (1500, 760)])
        return True

    # ---- definition ------------------------------------------------------------------
    if visual == "a7-define":
        if focus == "name":
            draw.rounded_rectangle((160, 260, 720, 840), radius=30, fill=(255, 250, 238), outline=line, width=4)
            K.text_at(draw, "one after another", 440, 284, F(36, bold=True), muted)
            for i in range(4):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                y = 370 + i * 116 + int((1 - a) * 20)
                draw.rounded_rectangle((230, y, 650, y + 86), radius=24, fill=panel, outline=palette[i], width=5)
                draw.ellipse((250, y + 13, 310, y + 73), fill=palette[i])
                K.text_at(draw, str(i + 1), 280, y + 16, F(40, bold=True), WHITE)
                draw.rounded_rectangle((340, y + 34, 610, y + 52), radius=9, fill=line)
                if i < 3:
                    K.draw_arrow(draw, 440, y + 88, 440, y + 114, muted, width=6, head=16)
            a = K.ease_out_cubic(K.clamp01((progress - 0.35) * 2.5))
            if a > 0:
                K.draw_arrow(draw, 760, 550, 760 + 200 * a, 550, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.5) * 2.5))
            if b > 0:
                s = 0.8 + 0.2 * b
                mx, my = 1400, 550
                hw, hh = 400 * s, 160 * s
                K.shadow_card(draw, (mx - hw, my - hh, mx + hw, my + hh), brand, radius=40, outline=coral, outline_w=6)
                K.text_at(draw, "It's called a", mx, my - 100 * s, F(int(42 * s), bold=True), muted)
                K.text_at(draw, "SEQUENCE", mx, my - 30 * s, F(int(100 * s), bold=True), coral)
            return True
        if focus == "meaning":
            K.shadow_card(draw, (200, 250 + lift, w - 200, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "Sequencing means…", cx, 330 + lift, F(46, bold=True), muted)
            parts = [("putting steps", coral), ("in the right order,", K.BOTH_COLOR), ("so the job works.", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 430 + i * 120 + int((1 - a) * 30)
                K.text_at(draw, txt, cx, y, F(76, bold=True), col)
            return True
        # stairs
        base, sh, sw, x_left = 860, 100, 250, 300
        for i in range(4):
            x0 = x_left + i * sw
            top = base - sh * (i + 1)
            draw.rectangle((x0 + 10, top + 12, x0 + sw + 10, base + 6), fill=K.SHADOW)
        for i in range(4):
            x0 = x_left + i * sw
            top = base - sh * (i + 1)
            col = palette[i]
            draw.rectangle((x0, top, x0 + sw, base), fill=panel, outline=line, width=3)
            draw.rectangle((x0, top, x0 + sw, top + 18), fill=col)
            draw.ellipse((x0 + sw / 2 - 34, top + 34, x0 + sw / 2 + 34, top + 102), fill=col)
            K.text_at(draw, str(i + 1), x0 + sw / 2, top + 42, F(40, bold=True), WHITE)
        k = min(3, int(progress * 4.6))
        top = base - sh * (k + 1)
        K.draw_person(draw, x_left + k * sw + sw / 2, top - 168, 0.72, "kid", t)
        fx = x_left + 4 * sw - 40
        draw.line((fx, base - 4 * sh, fx, base - 4 * sh - 150), fill=ink, width=6)
        draw.polygon([(fx, base - 4 * sh - 150), (fx + 70, base - 4 * sh - 126), (fx, base - 4 * sh - 102)], fill=sage)
        K.text_at(draw, "One step,", 1600, 360, F(52, bold=True), ink)
        K.text_at(draw, "after another", 1600, 430, F(52, bold=True), coral)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            draw.rounded_rectangle((1400, 560, 1800, 700), radius=30, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            K.text_at(draw, "Can't start", 1600, 578, F(36, bold=True), K.DANGER)
            K.text_at(draw, "at the top!", 1600, 626, F(36, bold=True), K.DANGER)
        return True

    # ---- order matters ------------------------------------------------------------
    pairs = {
        "socks": (("sock", "Socks"), ("shoe", "Shoes"), coral_soft, coral),
        "door": (("unlock", "Unlock"), ("opendoor", "Open"), blue_soft, K.ROAD),
        "tiffin": (("lunch_closed", "Open the tiffin"), ("lunch_eat", "Eat!"), gold_soft, K.GOLD),
    }
    if visual == "a7-matters":
        if focus == "intro":
            K.text_at(draw, "Order matters everywhere!", cx, 236, F(56, bold=True), ink)
            titles = {"socks": "Get dressed", "door": "Come home", "tiffin": "Lunch time"}
            for i, key in enumerate(("socks", "door", "tiffin")):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                (k1, _), (k2, _), soft, col = pairs[key]
                x = cx + (i - 1) * 560
                y0 = 330 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 250, y0, x + 250, y0 + 500), radius=40, fill=soft, outline=col, width=5)
                K.text_at(draw, titles[key], x, y0 + 30, F(42, bold=True), ink)
                icon(draw, k1, x - 120, y0 + 250, 0.5, t)
                icon(draw, k2, x + 120, y0 + 250, 0.5, t)
                K.draw_arrow(draw, x - 30, y0 + 410, x + 30, y0 + 410, muted, width=8, head=22)
                K.text_at(draw, "1", x - 120, y0 + 384, F(44, bold=True), col)
                K.text_at(draw, "2", x + 120, y0 + 384, F(44, bold=True), col)
            return True
        if focus in pairs:
            (k1, l1), (k2, l2), soft, col = pairs[focus]
            for i, (kind, lab, tag) in enumerate(((k1, l1, "FIRST"), (k2, l2, "THEN"))):
                a = K.stagger(progress, i, step=0.3, speed=4)
                if a <= 0:
                    continue
                x = cx - 400 + i * 800
                y = 540 + int((1 - a) * 30)
                draw.ellipse((x - 220 + 8, y - 220 + 10, x + 220 + 8, y + 220 + 10), fill=K.SHADOW)
                draw.ellipse((x - 220, y - 220, x + 220, y + 220), fill=soft if i == 0 else sage_soft,
                             outline=col if i == 0 else sage, width=6)
                K.pill(draw, x, 246, f"{i + 1} · {tag}", col if i == 0 else sage, size=30)
                if focus == "socks":
                    draw_leg(draw, x - 40, y + 170, 0.95, "sock" if i == 0 else "shoe")
                elif focus == "door":
                    if i == 0:
                        key_x = K.lerp(x + 190, x + 80, K.ease_out_cubic(K.clamp01(progress * 2)))
                        draw_door(draw, x - 40, y + 175, 0.78, locked=True)
                        K.draw_key(draw, key_x + 50, y + 40, 0.45, K.GOLD)
                    else:
                        draw_door(draw, x, y + 175, 0.78, open_t=K.clamp01((progress - 0.4) * 3))
                else:
                    if i == 0:
                        draw_lunchbox(draw, x, y + 40, 1.0, open_t=K.clamp01((progress - 0.15) * 2.5))
                    else:
                        draw_lunchbox(draw, x - 30, y + 60, 0.95, open_t=1.0)
                        draw_spoon(draw, x + 60, y - 40, 0.8)
                        K.draw_heart(draw, x + 130, y - 130 + bounce, 28, coral)
                K.text_at(draw, lab, x, 788, F(48, bold=True), ink)
            if progress > 0.3:
                K.draw_arrow(draw, cx - 130, 540, cx + 130 + 16 * pulse, 540, col, width=16, head=44)
            return True
        # tip
        draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=lav_soft)
        K.draw_person(draw, 480, 480, 1.25, "kid", t)
        for k, (bx, by, r) in enumerate(((640, 360, 16), (700, 310, 24))):
            draw.ellipse((bx - r, by - r, bx + r, by + r), fill=panel, outline=K.BOTH_COLOR, width=4)
        draw_cloud(draw, (780, 240, 1720, 520), panel, K.BOTH_COLOR)
        K.text_at(draw, "What must happen", 1250, 300, F(56, bold=True), ink)
        K.text_at(draw, "FIRST?", 1250, 380, F(72, bold=True), coral)
        for i in range(3):
            a = K.stagger(progress, i + 1, step=0.12, speed=4)
            if a <= 0:
                continue
            x = 1010 + i * 240
            y = 700 + int((1 - a) * 30)
            tile(x, y, "1" if i == 0 else "?", coral if i == 0 else K.STEEL_DARK, 130)
            if i < 2:
                K.draw_arrow(draw, x + 76, y, x + 160, y, muted, width=8, head=22)
        return True

    # ---- computers don't guess -------------------------------------------------------
    if visual == "a7-guess":
        if focus == "intro":
            draw.ellipse((480 - 260, 570 - 260, 480 + 260, 570 + 260), fill=blue_soft)
            K.draw_robot(draw, 480, 620, 1.0, t, mood="idle")
            box = (880, 250, 1740, 840)
            draw.rounded_rectangle((box[0] + 10, box[1] + 12, box[2] + 10, box[3] + 12), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle(box, radius=24, fill=(255, 250, 238))
            K.text_at(draw, "Robo's list", 1310, 276, F(42, bold=True), coral)
            rows = ["Wake up", "Brush teeth", "Take a bath", "Get dressed"]
            cur = min(3, int(progress * 4.4))
            for i, lab in enumerate(rows):
                y = 360 + i * 96
                on = i == cur
                draw.rounded_rectangle((960, y, 1660, y + 80), radius=22, fill=coral_soft if on else panel,
                                       outline=coral if on else line, width=4 if on else 2)
                K.pill(draw, 0, y + 16, str(i + 1), coral if on else muted, size=26, left=980)
                draw.text((1070, y + 18), lab, fill=ink, font=F(40, bold=True))
                if i < cur:
                    K.draw_check(draw, 1620, y + 40, 22, sage)
            ay = 360 + cur * 96 + 40
            draw.polygon([(900, ay - 22), (940, ay), (900, ay + 22)], fill=coral)
            K.pill(draw, 1310, 764, "Next step. No guessing!", K.BOTH_COLOR, size=32)
            return True
        if focus == "door":
            note((120, 250, 760, 520), "Robo's steps", ["1. Open the door", "2. Unlock the door"], size=38)
            draw_door(draw, 1130, 830, 1.0, locked=True)
            m = K.ease_out_cubic(K.clamp01(progress * 1.6))
            rx = K.lerp(1720, 1450, m)
            bonk = progress > 0.62
            K.draw_robot(draw, rx, 620, 0.8, t, mood="confused" if bonk else "idle")
            if bonk:
                bx, by = 1300, 460
                pts = []
                for k in range(16):
                    r = 90 if k % 2 == 0 else 46
                    a = k * math.pi / 8
                    pts.append((bx + r * math.cos(a), by + r * math.sin(a)))
                draw.polygon(pts, fill=K.GOLD)
                K.text_at(draw, "BONK!", 1300, 262, F(70, bold=True), K.DANGER)
                K.pill(draw, 440, 600, "Still locked!", K.DANGER, size=40)
            return True
        if focus == "nofix":
            for i, (title, col, soft) in enumerate((("A person", sage, sage_soft), ("Robo", K.BOTH_COLOR, lav_soft))):
                x0 = 140 + i * 840
                draw.rounded_rectangle((x0, 250, x0 + 800, 850), radius=40, fill=soft, outline=col, width=5)
                K.pill(draw, x0 + 400, 270, title, col, size=32)
            K.draw_bubble(draw, (200, 360, 880, 470), brand, "\"Oh, unlock it first!\"", tail="left", size=40)
            K.draw_person(draw, 330, 600, 0.95, "kid", t)
            draw_door(draw, 690, 820, 0.6, open_t=K.clamp01((progress - 0.3) * 3))
            K.draw_check(draw, 840, 560, 30, sage)
            K.draw_bubble(draw, (1040, 360, 1720, 470), brand, "Next step: open the door", tail="left", size=38)
            K.draw_robot(draw, 1190, 690, 0.62, t, mood="blank")
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                draw.rounded_rectangle((1440, 600, 1740, 790), radius=24, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
                K.text_at(draw, "Won't fix", 1590, 640, F(38, bold=True), K.DANGER)
                K.text_at(draw, "the order", 1590, 690, F(38, bold=True), K.DANGER)
            return True
        # rule
        K.text_at(draw, "Wrong order in", 400, 250, F(44, bold=True), K.DANGER)
        rows = [("shoe", "1. Shoes"), ("sock", "2. Socks")]
        for i, (kind, lab) in enumerate(rows):
            y = 340 + i * 220
            draw.rounded_rectangle((180, y, 620, y + 180), radius=28, fill=panel, outline=line, width=3)
            icon(draw, kind, 300, y + 80, 0.5, t)
            draw.text((400, y + 64), lab, fill=ink, font=F(44, bold=True))
        m = K.clamp01(progress * 2.5)
        K.draw_arrow(draw, 650, 560, 650 + 160 * m, 560, muted, width=12, head=34)
        draw.ellipse((cx - 200, 560 - 200, cx + 200, 560 + 200), fill=blue_soft)
        K.draw_robot(draw, cx, 610, 0.78, t, mood="idle")
        m2 = K.clamp01(progress * 2.5 - 0.9)
        if m2 > 0:
            K.draw_arrow(draw, 1180, 560, 1180 + 160 * m2, 560, muted, width=12, head=34)
        K.text_at(draw, "Wrong result out", 1530, 250, F(44, bold=True), K.DANGER)
        if m2 >= 1:
            draw.ellipse((1530 - 190, 590 - 190, 1530 + 190, 590 + 190), fill=K.DANGER_SOFT)
            draw_leg(draw, 1500, 760, 0.85, "funny")
            K.draw_cross(draw, 1690, 420, 34, K.DANGER)
        return True

    # ---- scrambled / swap ----------------------------------------------------------
    if visual == "a7-scrambled":
        if focus == "word":
            draw_pan(draw, 520, 580, 1.1, t)
            K.text_at(draw, "Scrambled", 1300, 270 + lift, F(100, bold=True), coral)
            K.text_at(draw, "= all mixed up!", 1300, 400 + lift, F(56, bold=True), ink)
            for i, (lab, dx, dy) in enumerate((("3", -240, 30), ("1", -80, -20), ("4", 80, 40), ("2", 240, -10))):
                a = K.stagger(progress, i + 1, step=0.1, speed=4)
                if a <= 0:
                    continue
                y = 640 + dy + 14 * math.sin(progress * 10 + i) + int((1 - a) * 40)
                tile(1300 + dx, y, lab, palette[i], 120)
            return True
        if focus == "funny":
            draw.ellipse((620 - 270, 570 - 270, 620 + 270, 570 + 270), fill=gold_soft)
            draw_leg(draw, 570, 800, 1.2, "funny")
            K.pill(draw, 1340, 260, "Funny!", K.GOLD, fg=ink, size=44)
            note((1060, 380, 1640, 690), "The steps", ["1. Shoes", "2. Socks"], size=42)
            K.draw_cross(draw, 1580, 530, 26, K.DANGER)
            star_list([(320, 330), (900, 340), (950, 760)])
            return True
        if focus == "broken":
            tip = draw_jug(draw, 560, 420, 1.1, tilt=1.0)
            pour = K.clamp01(progress * 2)
            if pour > 0:
                end_y = K.lerp(tip[1], 790, pour)
                draw.line((tip[0], tip[1], tip[0] + 12, end_y), fill=K.WATER_DEEP, width=14)
            sp = K.clamp01(progress * 2 - 0.6)
            if sp > 0:
                draw.ellipse((tip[0] - 200 * sp, 780, tip[0] + 220 * sp, 830), fill=K.WATER)
                for k in range(5):
                    a = -math.pi * (0.15 + 0.7 * k / 4)
                    r = 90 * sp
                    dx, dy = tip[0] + math.cos(a) * r, 790 + math.sin(a) * r * 0.9
                    draw.ellipse((dx - 10, dy - 10, dx + 10, dy + 10), fill=K.WATER_DEEP)
            draw_tumbler(draw, 1040, 820, 1.0, level=0.0)
            note((1220, 270, 1800, 560), "The steps", ["1. Pour the water", "2. Take a glass"], size=38)
            K.draw_cross(draw, 1740, 420, 26, K.DANGER)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1510, 660 + int((1 - a) * 20), "Broken. Splash!", K.DANGER, size=40)
            return True
        # swap
        K.text_at(draw, "SWAP", cx, 236, F(80, bold=True), coral)
        cards = [("glass", "Take a glass"), ("pour", "Pour the water")]
        m = K.ease_in_out(K.clamp01((progress - 0.1) * 1.8))
        cw, ch = 460, 340
        for i, (kind, lab) in enumerate(cards):
            pos = K.lerp(i, 1 - i, m)
            x0 = cx - 560 + pos * 660
            dy = 60 * math.sin(math.pi * m) * (-1 if i == 0 else 1)
            st = "bad" if (m >= 1 and i == 1) else "normal"
            step_card((x0, 380 + dy, x0 + cw, 380 + ch + dy), (2 if i == 0 else 1) if m >= 0.5 else i + 1, lab, kind,
                      coral, st, label_size=38, icon_s=0.9)
        if 0 < m < 1:
            K.draw_curve(draw, (cx - 200, 350), (cx, 290), (cx + 200, 350), K.BOTH_COLOR, width=8)
            K.draw_curve(draw, (cx + 200, 760), (cx, 820), (cx - 200, 760), K.BOTH_COLOR, width=8)
        elif m >= 1:
            K.draw_arrow(draw, cx - 90, 550, cx + 90, 550, muted, width=10, head=28)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 790 + int((1 - a) * 20), "Every step is there, still broken!", K.DANGER, size=34)
        return True

    # ---- toothbrush fix ------------------------------------------------------------
    if visual == "a7-brush":
        steps = [("brushteeth", "Brush teeth"), ("paste", "Put paste on the brush"), ("pickup", "Pick up the brush")]
        ranks = [2, 1, 0]
        if focus == "ask":
            reorder_row(steps, ranks, 0.0, 260, 730, 460, 70, icon_s=1.15)
            K.draw_robot(draw, 1790, 760, 0.38, t, mood="confused")
            K.draw_stopwatch(draw, cx, 815, 42, progress, brand)
            return True
        m = K.ease_in_out(K.clamp01((progress - 0.05) * 1.6))
        states = ["win" if m >= 1 and progress > 0.75 + 0.05 * (2 - r) else "normal" for r in ranks]
        reorder_row(steps, ranks, m, 260, 730, 460, 70, states=states, icon_s=1.15)
        if progress > 0.88:
            stars_at(cx, 810, 520, 4)
        return True

    # ---- tiffin unscramble ---------------------------------------------------------
    if visual == "a7-tiffin":
        if focus == "intro":
            draw.ellipse((560 - 280, 560 - 280, 560 + 280, 560 + 280), fill=coral_soft)
            draw_zipbag(draw, 560, 600, 1.1)
            K.text_at(draw, "Unscramble", 1300, 290 + lift, F(84, bold=True), ink)
            K.text_at(draw, "game!", 1300, 390 + lift, F(84, bold=True), coral)
            K.pill(draw, 1300, 560, "Lunchtime!", K.GOLD, fg=ink, size=40)
            K.draw_tiffin(draw, 1300, 780, 0.7)
            return True
        steps = [("tiffin_out", "Take out the tiffin"), ("zip_close", "Close the zip"), ("zip_open", "Open the zip")]
        sorted_pos = {2: 0, 0: 1, 1: 2}
        ans = focus == "answer"
        move = K.ease_in_out(K.clamp01((progress - 0.05) * 1.3)) if ans else 0.0
        rank_shown = progress * 4.4 if ans else -1
        for i, (kind, lab) in enumerate(steps):
            pos = K.lerp(i, sorted_pos[i], move)
            y = 250 + pos * 200
            x0 = 200 + (0 if ans else (i % 2 * 2 - 1) * 40) * (1 - move)
            rank = sorted_pos[i]
            placed = ans and rank_shown > rank + 0.8
            draw.rounded_rectangle((x0 + 8, y + 10, x0 + 1000 + 8, y + 170 + 10), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y, x0 + 1000, y + 170), radius=30, fill=sage_soft if placed else panel,
                                   outline=sage if placed else line, width=5 if placed else 3)
            badge = str(rank + 1) if ans else "ABC"[i]
            K.pill(draw, 0, y + 56, badge, sage if ans else K.BOTH_COLOR, size=30, left=x0 + 30)
            icon(draw, kind, x0 + 230, y + 66, 0.62, t)
            draw.text((x0 + 360, y + 60), lab, fill=ink, font=F(46, bold=True))
            if placed:
                K.draw_check(draw, x0 + 940, y + 85, 26, sage)
        if not ans:
            K.text_at(draw, "Which comes", 1530, 330, F(54, bold=True), ink)
            K.text_at(draw, "first?", 1530, 400, F(72, bold=True), coral)
            K.draw_stopwatch(draw, 1530, 650, 60, progress, brand)
        else:
            stage = progress * 4.4
            zo = K.clamp01(stage - 0.6)
            out = K.clamp01(stage - 1.8)
            zc = K.clamp01(stage - 2.8)
            draw.ellipse((1560 - 230, 600 - 230, 1560 + 230, 600 + 230), fill=coral_soft)
            draw_zipbag(draw, 1560, 650, 0.8, zip_open=zo * (1 - zc), tiffin_out=out)
            if progress > 0.85:
                stars_at(1560, 560, 280, 4)
        return True

    # ---- nimbu pani ---------------------------------------------------------------
    if visual == "a7-lemon":
        steps = [("drink_empty", "Drink the juice"), ("squeeze", "Squeeze lemon into water"),
                 ("stir", "Add sugar and stir")]
        ranks = [2, 0, 1]
        if focus == "ask":
            reorder_row(steps, ranks, 0.0, 260, 730, 460, 70, icon_s=1.2)
            K.draw_stopwatch(draw, cx, 815, 42, progress, brand)
            return True
        if focus == "answer":
            m = K.ease_in_out(K.clamp01((progress - 0.25) * 2.0))
            if m <= 0:
                states = ["bad", "normal", "normal"]
            elif m >= 1:
                states = ["win", "normal", "normal"]
            else:
                states = ["normal"] * 3
            steps2 = list(steps)
            if m >= 1:
                steps2[0] = ("drink", "Drink the juice")
            reorder_row(steps2, ranks, m, 260, 730, 460, 70, states=states, icon_s=1.2)
            a = K.stagger(progress, 7, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 790 + int((1 - a) * 20), "Drinking comes LAST", sage, size=36)
            return True
        # fixed
        draw.ellipse((470 - 240, 560 - 240, 470 + 240, 560 + 240), fill=gold_soft)
        K.draw_person(draw, 470, 470, 1.2, "kid", t)
        draw_tumbler(draw, 1000, 820, 1.7, level=0.85, color=JUICE, straw=True, ice=True)
        draw_lemon(draw, 1400, 640, 1.0, half=True)
        draw_lemon(draw, 1640, 760, 0.9)
        K.text_at(draw, "Squeeze → Stir → Drink", 1290, 250, F(52, bold=True), ink)
        a = K.stagger(progress, 2, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1500, 420 + int((1 - a) * 20), "Ahh! Nice and cool", sage, size=38)
        star_list([(760, 380), (1250, 520)])
        return True

    # ---- checkpoint -----------------------------------------------------------------
    if visual == "a7-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 700 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, F(40, bold=True), sage)
            K.text_at(draw, "Just like the quiz!", cx, 470 + lift, F(64, bold=True), ink)
            K.draw_check(draw, cx, 620 + lift, 44, sage)
            return True
        if focus == "ask":
            note((140, 260, 1000, 640), "Robo's milk steps", ["1. Pour the milk", "2. Open the carton"], size=48)
            draw.ellipse((1450 - 230, 560 - 230, 1450 + 230, 560 + 230), fill=blue_soft)
            draw_carton(draw, 1450, 590, 1.3)
            qmarks([(1170, 300), (1740, 330)], 90)
            K.pill(draw, 1450, 800, "Pause & say it!", coral, size=36)
            K.draw_stopwatch(draw, 570, 760, 50, progress, brand)
            return True
        phase2 = progress > 0.45
        if not phase2:
            note((140, 260, 900, 640), "Robo's milk steps", ["1. Pour the milk", "2. Open the carton"], size=44,
                 marks=["bad", None])
            tilt = 1.1 * K.ease_out_cubic(K.clamp01(progress * 3))
            draw_carton(draw, 1330, 500, 1.1, open_t=0.0, tilt=tilt)
            draw_tumbler(draw, 1600, 820, 1.0, level=0.0)
            if progress > 0.25:
                K.pill(draw, 1460, 250, "No milk comes out!", K.DANGER, size=38)
                K.draw_cross(draw, 1760, 640, 34, K.DANGER)
        else:
            note((140, 260, 900, 640), "Fixed!", ["1. Open the carton", "2. Pour the milk"], size=44,
                 marks=["ok", "ok"], title_col=sage)
            p2 = K.clamp01((progress - 0.45) / 0.55)
            tilt = 1.1 * K.ease_out_cubic(K.clamp01(p2 * 3))
            tip = draw_carton(draw, 1330, 500, 1.1, open_t=1.0, tilt=tilt)
            gx, gby = 1600, 820
            lvl = K.clamp01((p2 - 0.25) * 1.6)
            if p2 > 0.25:
                draw.line((tip[0], tip[1], gx + 10, gby - 130), fill=MILK, width=16)
                draw.line((tip[0], tip[1], gx + 10, gby - 130), fill=(236, 236, 230), width=4)
            draw_tumbler(draw, gx, gby, 1.0, level=lvl, color=MILK)
            if p2 > 0.6:
                K.draw_check(draw, 1760, 600, 34, sage)
                star_list([(1120, 760), (1790, 400)])
        return True

    # ---- recap ---------------------------------------------------------------------
    if visual == "a7-recap":
        recap = [("Sequencing = the right order", coral, "order"), ("Socks, then shoes. Unlock, then open.", K.GOLD, "sockshoe"),
                 ("Computers don't guess", K.BOT, "robot"), ("A swap can break it", sage, "swap")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 222, F(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "order":
                    for k in range(3):
                        tile(ix - 110 + k * 110, iy, str(k + 1), palette[k], 84)
                elif kind == "sockshoe":
                    icon(draw, "sock", ix - 80, iy, 0.62, t)
                    icon(draw, "shoe", ix + 80, iy + 20, 0.62, t)
                elif kind == "robot":
                    K.draw_robot(draw, ix, iy + 50, 0.5, t, mood="idle")
                else:
                    tile(ix - 80, iy + 20, "1", coral, 90)
                    tile(ix + 80, iy + 20, "2", K.BOTH_COLOR, 90)
                    K.draw_curve(draw, (ix - 80, iy - 40), (ix, iy - 110), (ix + 80, iy - 40), DANGER_COL, width=7)
                    K.draw_curve(draw, (ix + 80, iy + 80), (ix, iy + 150), (ix - 80, iy + 80), DANGER_COL, width=7)
                font = F(34, bold=True)
                lines = K.wrap_text(lab, font, 350)
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 42, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 300, 480, 0.85, t, mood="happy", wave=t)
            K.text_at(draw, "Chapter 2 done!", cx, 692, F(68, bold=True), ink)
            K.pill(draw, cx, 788, "Order matters!", coral, size=36)
            star_list([(cx - 620, 330), (cx + 620, 330), (cx - 700, 560), (cx + 700, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False


DANGER_COL = K.DANGER
