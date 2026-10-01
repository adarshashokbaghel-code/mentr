"""C19 · Breaking Big Problems Into Small Ones — visuals."""
import math

import build as K

WHITE = (255, 255, 255)
WALL = (255, 238, 214)
FLOOR = (226, 194, 152)
FLOOR_DARK = (196, 160, 116)
WOOD = (186, 124, 76)
WOOD_DARK = (138, 86, 48)
SKY = (196, 228, 250)
BLANKET = (120, 170, 226)
BLANKET_DARK = (84, 132, 196)
ROTI = (238, 196, 128)
ROTI_DARK = (176, 118, 58)
PLATE = (236, 240, 246)
LEMON = (250, 212, 62)
LEMON_DARK = (214, 170, 30)
JUICE = (248, 230, 128)
GRASS = (110, 186, 100)
GRASS_DARK = (84, 156, 78)
PITCH = (226, 200, 140)
TEN_COL = (13, 148, 136)
ONE_COL = (255, 106, 26)
BOOK_COLS = [(255, 106, 26), (13, 148, 136), (123, 97, 214), (72, 118, 214), (255, 186, 60)]


def ring(x, y, r, n=16):
    return [(x + r * math.cos(k * math.tau / n), y + r * math.sin(k * math.tau / n)) for k in range(n)]


# ---- small illustrations -----------------------------------------------------------

def draw_ball(d, x, y, r, col=K.CORAL):
    d.ellipse((x - r + 4, y - r + 6, x + r + 4, y + r + 6), fill=K.SHADOW)
    d.ellipse((x - r, y - r, x + r, y + r), fill=col, outline=K.DEV_DARK, width=max(2, int(r * 0.08)))
    d.arc((x - r * 0.6, y - r, x + r * 1.4, y + r), 120, 240, fill=WHITE, width=max(2, int(r * 0.12)))
    d.arc((x - r * 1.4, y - r, x + r * 0.6, y + r), 300, 60, fill=WHITE, width=max(2, int(r * 0.12)))


def draw_car(d, x, y, s, col=K.ROAD):
    def S(v):
        return v * s
    d.rounded_rectangle((x - S(70), y - S(30), x + S(70), y + S(14)), radius=S(14), fill=col, outline=K.DEV_DARK,
                        width=max(2, int(S(3))))
    d.rounded_rectangle((x - S(36), y - S(60), x + S(30), y - S(26)), radius=S(12), fill=K.DEV_SCREEN,
                        outline=K.DEV_DARK, width=max(2, int(S(3))))
    for wx in (x - S(40), x + S(40)):
        d.ellipse((wx - S(18), y - S(2), wx + S(18), y + S(34)), fill=K.DEV_DEEP)
        d.ellipse((wx - S(7), y + S(9), wx + S(7), y + S(23)), fill=K.STEEL)


def draw_blocks(d, x, y, s):
    """(x, y) = bottom centre."""
    def S(v):
        return v * s
    for k, (dx, dy, col) in enumerate(((-34, 0, K.GOLD), (34, 0, K.BOTH_COLOR), (0, -64, K.CORAL))):
        bx, by = x + S(dx), y + S(dy)
        d.rounded_rectangle((bx - S(30), by - S(60), bx + S(30), by), radius=S(8), fill=col, outline=K.DEV_DARK,
                            width=max(2, int(S(3))))
        d.rectangle((bx - S(12), by - S(42), bx + S(12), by - S(18)), fill=WHITE)


def draw_book(d, x0, y0, x1, y1, col):
    d.rectangle((x0, y0, x1, y1), fill=col, outline=K.DEV_DARK, width=2)
    if x1 - x0 < y1 - y0:
        d.line((x0 + 4, y0 + (y1 - y0) * 0.2, x1 - 4, y0 + (y1 - y0) * 0.2), fill=WHITE, width=3)
    else:
        d.rectangle((x1 - 10, y0 + 4, x1 - 4, y1 - 4), fill=WHITE)


def draw_open_book(d, x, y, s, col=K.BOTH_COLOR):
    def S(v):
        return v * s
    d.polygon([(x - S(70), y - S(26)), (x, y - S(10)), (x, y + S(26)), (x - S(70), y + S(10))], fill=col,
              outline=K.DEV_DARK)
    d.polygon([(x + S(70), y - S(26)), (x, y - S(10)), (x, y + S(26)), (x + S(70), y + S(10))], fill=col,
              outline=K.DEV_DARK)
    d.polygon([(x - S(62), y - S(30)), (x, y - S(16)), (x, y + S(18)), (x - S(62), y + S(4))], fill=WHITE)
    d.polygon([(x + S(62), y - S(30)), (x, y - S(16)), (x, y + S(18)), (x + S(62), y + S(4))], fill=WHITE)


def draw_bookstack(d, x, y, s):
    """(x, y) = bottom centre."""
    def S(v):
        return v * s
    for k in range(3):
        w_ = S(150 - k * 16)
        by = y - k * S(36)
        draw_book(d, x - w_ / 2 + (k % 2) * S(8), by - S(34), x + w_ / 2 + (k % 2) * S(8), by, BOOK_COLS[k])


def draw_toybox(d, x, y, s, full=False):
    """(x, y) = bottom centre."""
    def S(v):
        return v * s
    if full:
        draw_ball(d, x - S(36), y - S(112), S(28))
        d.rounded_rectangle((x + S(4), y - S(140), x + S(54), y - S(96)), radius=S(6), fill=K.GOLD,
                            outline=K.DEV_DARK, width=2)
    d.rounded_rectangle((x - S(90) + S(6), y - S(100) + S(8), x + S(90) + S(6), y + S(8)), radius=S(12),
                        fill=K.SHADOW)
    d.rounded_rectangle((x - S(90), y - S(100), x + S(90), y), radius=S(12), fill=WOOD, outline=WOOD_DARK,
                        width=max(2, int(S(4))))
    d.line((x - S(80), y - S(50), x + S(80), y - S(50)), fill=WOOD_DARK, width=max(2, int(S(4))))


def draw_bed(d, x0, fy, s, made=True):
    """x0 = left of the bed, fy = floor line."""
    def S(v):
        return v * s
    x1 = x0 + S(400)
    d.rectangle((x1 - S(30), fy - S(250), x1, fy + S(40)), fill=WOOD_DARK)
    d.rounded_rectangle((x1 - S(40), fy - S(270), x1 + S(10), fy - S(240)), radius=S(10), fill=WOOD_DARK)
    for lx in (x0 + S(16), x1 - S(50)):
        d.rectangle((lx, fy - S(10), lx + S(22), fy + S(40)), fill=WOOD_DARK)
    d.rectangle((x0, fy - S(50), x1 - S(30), fy - S(6)), fill=WOOD)
    d.rounded_rectangle((x0, fy - S(110), x1 - S(30), fy - S(44)), radius=S(16), fill=WHITE, outline=K.DEV_DARK,
                        width=2)
    if made:
        d.rounded_rectangle((x1 - S(130), fy - S(150), x1 - S(40), fy - S(100)), radius=S(20), fill=WHITE,
                            outline=K.DEV_DARK, width=2)
        d.rounded_rectangle((x0 - S(4), fy - S(116), x1 - S(140), fy - S(30)), radius=S(14), fill=BLANKET,
                            outline=BLANKET_DARK, width=max(2, int(S(4))))
        d.rectangle((x1 - S(170), fy - S(116), x1 - S(140), fy - S(30)), fill=WHITE)
        d.line((x0 + S(20), fy - S(70), x1 - S(180), fy - S(70)), fill=BLANKET_DARK, width=max(2, int(S(3))))
    else:
        d.ellipse((x1 - S(330), fy - S(170), x1 - S(250), fy - S(110)), fill=WHITE, outline=K.DEV_DARK, width=2)
        pts = [(x0 + S(10), fy - S(120)), (x0 + S(80), fy - S(170)), (x0 + S(150), fy - S(130)),
               (x0 + S(220), fy - S(180)), (x0 + S(310), fy - S(120)), (x1 - S(60), fy - S(140)),
               (x1 - S(40), fy - S(60)), (x0 + S(200), fy - S(40)), (x0 + S(40), fy + S(70)),
               (x0 - S(40), fy + S(60)), (x0 - S(20), fy - S(40))]
        d.polygon(pts, fill=BLANKET, outline=BLANKET_DARK, width=max(2, int(S(4))))
        for k in range(3):
            ax = x0 + S(70) + k * S(90)
            d.arc((ax, fy - S(150), ax + S(80), fy - S(80)), 200, 330, fill=BLANKET_DARK, width=max(2, int(S(4))))


def draw_room(d, x0, y0, s, toys=0.0, books=0.0, bed=0.0, kid=False, t=0.0):
    """Riya's room, 1200 x 600 at s=1."""
    def S(v):
        return v * s
    W, H = S(1200), S(600)
    fy = y0 + S(380)
    d.rounded_rectangle((x0 + 10, y0 + 12, x0 + W + 10, y0 + H + 12), radius=S(30), fill=K.SHADOW)
    d.rounded_rectangle((x0, y0, x0 + W, y0 + H), radius=S(30), fill=WALL)
    d.rounded_rectangle((x0, fy, x0 + W, y0 + H), radius=S(30), fill=FLOOR)
    d.rectangle((x0, fy, x0 + W, fy + S(40)), fill=FLOOR)
    d.rectangle((x0, fy - S(10), x0 + W, fy + S(4)), fill=FLOOR_DARK)
    for k in range(1, 5):
        d.line((x0 + k * W / 5, fy + S(4), x0 + k * W / 5 - S(30), y0 + H), fill=FLOOR_DARK, width=2)
    # window
    wx0, wy0 = x0 + S(450), y0 + S(60)
    d.rectangle((wx0 - S(10), wy0 - S(10), wx0 + S(190), wy0 + S(190)), fill=WOOD_DARK)
    d.rectangle((wx0, wy0, wx0 + S(180), wy0 + S(180)), fill=SKY)
    d.ellipse((wx0 + S(110), wy0 + S(26), wx0 + S(160), wy0 + S(76)), fill=K.GOLD)
    d.line((wx0 + S(90), wy0, wx0 + S(90), wy0 + S(180)), fill=WOOD_DARK, width=max(3, int(S(8))))
    d.line((wx0, wy0 + S(90), wx0 + S(180), wy0 + S(90)), fill=WOOD_DARK, width=max(3, int(S(8))))
    # shelf
    sy = y0 + S(220)
    d.rectangle((x0 + S(60), sy, x0 + S(380), sy + S(18)), fill=WOOD)
    for bx in (x0 + S(90), x0 + S(330)):
        d.polygon([(bx, sy + S(18)), (bx + S(24), sy + S(18)), (bx, sy + S(60))], fill=WOOD_DARK)
    if books >= 0.5:
        for k in range(6):
            bx = x0 + S(80) + k * S(44)
            hgt = S(120 + (k * 37) % 40)
            draw_book(d, bx, sy - hgt, bx + S(38), sy, BOOK_COLS[k % 5])
    # bed
    draw_bed(d, x0 + S(760), fy, s, made=bed >= 0.5)
    # toy box
    draw_toybox(d, x0 + S(150), fy + S(150), s * 0.9, full=toys >= 0.5)
    if books < 0.5:
        draw_book(d, x0 + S(270), fy + S(40), x0 + S(400), fy + S(72), BOOK_COLS[3])
        draw_book(d, x0 + S(290), fy + S(72), x0 + S(410), fy + S(100), BOOK_COLS[1])
        draw_open_book(d, x0 + S(560), fy + S(180), s)
        draw_book(d, x0 + S(820), fy + S(120), x0 + S(950), fy + S(150), BOOK_COLS[4])
    if toys < 0.5:
        draw_ball(d, x0 + S(330), fy + S(170), S(34))
        draw_car(d, x0 + S(680), fy + S(160), s * 0.9)
        draw_blocks(d, x0 + S(1060), fy + S(200), s * 0.9)
    if kid:
        K.draw_person(d, x0 + S(690), fy - S(150), 0.85 * s, "kid", t)


def draw_roti(d, x, y, r, torn=0.0):
    n = 6
    gap = r * 0.28 * K.ease_out_cubic(K.clamp01(torn))
    spots = [(0.4, 0.3), (0.7, 1.4), (0.55, 2.4), (0.3, 3.3), (0.75, 4.1), (0.5, 5.2), (0.8, 0.9), (0.6, 3.8)]
    for k in range(n):
        a0, a1 = k * 360 / n, (k + 1) * 360 / n
        mid = math.radians((a0 + a1) / 2)
        ox, oy = math.cos(mid) * gap, math.sin(mid) * gap
        if torn > 0:
            d.pieslice((x - r + ox + 6, y - r + oy + 8, x + r + ox + 6, y + r + oy + 8), a0, a1, fill=K.SHADOW)
        d.pieslice((x - r + ox, y - r + oy, x + r + ox, y + r + oy), a0, a1, fill=ROTI,
                   outline=ROTI_DARK if torn > 0 else None, width=3)
        for rr, aa in spots:
            deg = math.degrees(aa) % 360
            if a0 <= deg < a1:
                sx, sy = x + ox + math.cos(aa) * r * rr, y + oy + math.sin(aa) * r * rr
                d.ellipse((sx - r * 0.07, sy - r * 0.05, sx + r * 0.07, sy + r * 0.05), fill=ROTI_DARK)
    if torn <= 0:
        d.ellipse((x - r, y - r, x + r, y + r), outline=ROTI_DARK, width=4)


def draw_mountain(d, x0, x1, base, peak_x, peak_y):
    d.polygon([(x0 + 14, base), (peak_x + 14, peak_y + 14), (x1 + 14, base)], fill=K.SHADOW)
    d.polygon([(x0, base), (peak_x, peak_y), (x1, base)], fill=(150, 164, 186))
    d.polygon([(peak_x, peak_y), (x1, base), (peak_x + (x1 - peak_x) * 0.2, base)], fill=(124, 138, 160))
    sw = (peak_x - x0) * 0.22
    sh = (base - peak_y) * 0.22
    d.polygon([(peak_x - sw, peak_y + sh), (peak_x, peak_y), (peak_x + sw * 1.1, peak_y + sh * 1.05),
               (peak_x + sw * 0.4, peak_y + sh * 0.8), (peak_x - sw * 0.2, peak_y + sh * 1.15)], fill=WHITE)


def draw_bottle(d, x, y, s):
    """(x, y) = centre."""
    def S(v):
        return v * s
    d.rounded_rectangle((x - S(40) + S(6), y - S(80) + S(8), x + S(40) + S(6), y + S(100) + S(8)), radius=S(22),
                        fill=K.SHADOW)
    d.rounded_rectangle((x - S(22), y - S(118), x + S(22), y - S(84)), radius=S(8), fill=K.CORAL)
    d.rounded_rectangle((x - S(40), y - S(90), x + S(40), y + S(100)), radius=S(22), fill=(214, 236, 252),
                        outline=K.DEV_DARK, width=max(2, int(S(4))))
    d.rounded_rectangle((x - S(32), y - S(20), x + S(32), y + S(92)), radius=S(16), fill=K.WATER)
    d.rectangle((x - S(40), y + S(10), x + S(40), y + S(40)), fill=K.CORAL)


def draw_pencilbox(d, x, y, s):
    def S(v):
        return v * s
    for k, col in enumerate((K.GOLD, K.ROAD, K.LEAF)):
        px = x - S(50) + k * S(40)
        d.polygon([(px - S(10), y - S(40)), (px + S(10), y - S(40)), (px + S(10), y - S(96)), (px, y - S(118)),
                   (px - S(10), y - S(96))], fill=col, outline=K.DEV_DARK)
    d.rounded_rectangle((x - S(110) + S(6), y - S(50) + S(8), x + S(110) + S(6), y + S(40) + S(8)), radius=S(16),
                        fill=K.SHADOW)
    d.rounded_rectangle((x - S(110), y - S(50), x + S(110), y + S(40)), radius=S(16), fill=K.BOTH_COLOR,
                        outline=K.DEV_DARK, width=max(2, int(S(4))))
    d.line((x - S(90), y - S(10), x + S(90), y - S(10)), fill=(196, 180, 246), width=max(2, int(S(5))))
    K.draw_star(d, x, y + S(14), S(16), K.GOLD)


def draw_timetable(d, x, y, s, today=2):
    def S(v):
        return v * s
    d.rounded_rectangle((x - S(100) + S(8), y - S(120) + S(10), x + S(100) + S(8), y + S(120) + S(10)), radius=S(14),
                        fill=K.SHADOW)
    d.rounded_rectangle((x - S(100), y - S(120), x + S(100), y + S(120)), radius=S(14), fill=WHITE,
                        outline=K.DEV_DARK, width=max(2, int(S(4))))
    d.rounded_rectangle((x - S(100), y - S(120), x + S(100), y - S(76)), radius=S(14), fill=K.CORAL)
    d.rectangle((x - S(100), y - S(90), x + S(100), y - S(76)), fill=K.CORAL)
    cols = [K.GOLD, K.ROAD, K.LEAF, K.BOTH_COLOR]
    for r in range(4):
        ry = y - S(62) + r * S(44)
        if r == today:
            d.rounded_rectangle((x - S(92), ry - S(6), x + S(92), ry + S(36)), radius=S(8), fill=(255, 236, 200),
                                outline=K.CORAL, width=max(2, int(S(4))))
        for c in range(3):
            cx0 = x - S(80) + c * S(56)
            d.rounded_rectangle((cx0, ry + S(4), cx0 + S(44), ry + S(26)), radius=S(6), fill=cols[(r + c) % 4])


def draw_lemon_half(d, x, y, s):
    def S(v):
        return v * s
    d.ellipse((x - S(56), y - S(56), x + S(56), y + S(56)), fill=LEMON_DARK)
    d.ellipse((x - S(48), y - S(48), x + S(48), y + S(48)), fill=(255, 250, 222))
    d.ellipse((x - S(42), y - S(42), x + S(42), y + S(42)), fill=LEMON)
    for k in range(8):
        a = k * math.pi / 4
        d.line((x, y, x + math.cos(a) * S(42), y + math.sin(a) * S(42)), fill=(255, 250, 222), width=max(2, int(S(5))))


def draw_lemon(d, x, y, s):
    def S(v):
        return v * s
    for sx in (-1, 1):
        d.polygon([(x + sx * S(78), y), (x + sx * S(50), y - S(16)), (x + sx * S(50), y + S(16))], fill=LEMON)
    d.ellipse((x - S(60), y - S(46), x + S(60), y + S(46)), fill=LEMON, outline=LEMON_DARK, width=max(2, int(S(3))))
    d.polygon([(x + S(8), y - S(44)), (x + S(48), y - S(72)), (x + S(32), y - S(36))], fill=K.LEAF)


def draw_tumbler(d, x, by, s, level=0.0, col=JUICE, straw=False, slice_=False):
    def S(v):
        return v * s
    tw, bw, h = S(58), S(44), S(160)
    pts = [(x - tw, by - h), (x + tw, by - h), (x + bw, by), (x - bw, by)]
    d.polygon([(px + S(6), py + S(8)) for px, py in pts], fill=K.SHADOW)
    d.polygon(pts, fill=(240, 248, 253))
    lv = K.clamp01(level)
    if lv > 0:
        wy = by - h * 0.86 * lv
        wx = bw + (tw - bw) * ((by - wy) / h)
        d.polygon([(x - wx, wy), (x + wx, wy), (x + bw, by), (x - bw, by)], fill=col)
    if straw:
        d.line((x + S(10), by - S(30), x + S(30), by - h - S(40), x + S(66), by - h - S(56)), fill=K.CORAL,
               width=max(3, int(S(10))), joint="curve")
    d.polygon(pts, outline=K.DEV_DARK, width=max(2, int(S(5))))
    if slice_:
        d.pieslice((x - tw - S(30), by - h - S(30), x - tw + S(30), by - h + S(30)), 90, 270, fill=LEMON,
                   outline=LEMON_DARK, width=max(2, int(S(3))))
    d.line((x - tw + S(16), by - h + S(18), x - bw + S(12), by - S(16)), fill=WHITE, width=max(2, int(S(6))))


def draw_jug(d, x, y, s, t=0.0, pour=True):
    def S(v):
        return v * s
    body = [(x - S(50), y - S(70)), (x + S(40), y - S(70)), (x + S(70), y - S(90)), (x + S(54), y - S(50)),
            (x + S(50), y + S(80)), (x - S(50), y + S(80))]
    d.polygon([(px + S(6), py + S(8)) for px, py in body], fill=K.SHADOW)
    d.line((x - S(50), y - S(40), x - S(90), y - S(30), x - S(90), y + S(40), x - S(50), y + S(50)),
           fill=K.DEV_DARK, width=max(3, int(S(10))), joint="curve")
    d.polygon(body, fill=(220, 236, 250), outline=K.DEV_DARK, width=max(2, int(S(4))))
    d.polygon([(x - S(46), y - S(10)), (x + S(48), y - S(10)), (x + S(48), y + S(76)), (x - S(46), y + S(76))],
              fill=K.WATER)
    if pour:
        for k in range(4):
            p = (t * 3 + k / 4) % 1
            d.ellipse((x + S(64), y - S(80) + p * S(140), x + S(80), y - S(64) + p * S(140)), fill=K.WATER_DEEP)


def draw_sugar(d, x, y, s):
    def S(v):
        return v * s
    d.ellipse((x - S(80), y - S(40), x + S(80), y - S(4)), fill=WHITE, outline=K.DEV_DARK, width=2)
    for k in range(7):
        sx = x - S(54) + k * S(18)
        d.rounded_rectangle((sx, y - S(38) - (k % 2) * S(10), sx + S(14), y - S(24) - (k % 2) * S(10)), radius=S(3),
                            fill=WHITE, outline=(200, 200, 210))
    d.chord((x - S(90), y - S(60), x + S(90), y + S(70)), 0, 180, fill=(250, 220, 200), outline=K.DEV_DARK,
            width=max(2, int(S(4))))
    d.line((x + S(30), y - S(20), x + S(110), y - S(110)), fill=K.STEEL_DARK, width=max(3, int(S(10))))
    d.ellipse((x + S(10), y - S(34), x + S(50), y - S(6)), fill=K.STEEL, outline=K.STEEL_DARK, width=2)


def draw_chips(d, x, y, s, col=K.GOLD):
    def S(v):
        return v * s
    pts = [(x - S(60), y - S(90)), (x + S(60), y - S(90)), (x + S(52), y), (x + S(60), y + S(90)),
           (x - S(60), y + S(90)), (x - S(52), y)]
    d.polygon([(px + S(6), py + S(8)) for px, py in pts], fill=K.SHADOW)
    d.polygon(pts, fill=col, outline=K.DEV_DARK, width=max(2, int(S(3))))
    for zx in range(6):
        d.line((x - S(56) + zx * S(22), y - S(90), x - S(46) + zx * S(22), y - S(80)), fill=K.DEV_DARK, width=2)
    d.ellipse((x - S(34), y - S(34), x + S(34), y + S(34)), fill=WHITE)
    d.ellipse((x - S(22), y - S(16), x + S(22), y + S(16)), fill=(250, 210, 90), outline=(214, 160, 40), width=2)


def draw_laddoos(d, x, y, s):
    def S(v):
        return v * s
    d.ellipse((x - S(90), y - S(10), x + S(90), y + S(36)), fill=K.STEEL, outline=K.STEEL_DARK, width=2)
    for k, (dx, dy) in enumerate(((-44, -16), (0, -16), (44, -16), (-22, -52), (22, -52))):
        bx, by = x + S(dx), y + S(dy)
        d.ellipse((bx - S(24), by - S(24), bx + S(24), by + S(24)), fill=(244, 164, 52), outline=(200, 120, 30),
                  width=2)
        d.ellipse((bx - S(10), by - S(14), bx - S(2), by - S(6)), fill=(255, 210, 130))


def draw_balloons(d, x, y, s, t=0.0):
    def S(v):
        return v * s
    for k, (dx, dy, col) in enumerate(((-50, 0, K.CORAL), (40, -30, K.BOTH_COLOR), (0, 30, K.GOLD))):
        bx = x + S(dx) + S(6) * math.sin(t * 8 + k)
        by = y + S(dy) - S(40)
        d.line((bx, by + S(46), x, y + S(110)), fill=K.DEV_DARK, width=2)
        d.ellipse((bx - S(36), by - S(46), bx + S(36), by + S(46)), fill=col)
        d.ellipse((bx - S(20), by - S(30), bx - S(6), by - S(12)), fill=WHITE)


def draw_calendar(d, x, y, s):
    def S(v):
        return v * s
    d.rounded_rectangle((x - S(100) + S(8), y - S(100) + S(10), x + S(100) + S(8), y + S(110) + S(10)), radius=S(16),
                        fill=K.SHADOW)
    d.rounded_rectangle((x - S(100), y - S(100), x + S(100), y + S(110)), radius=S(16), fill=WHITE,
                        outline=K.DEV_DARK, width=max(2, int(S(4))))
    d.rounded_rectangle((x - S(100), y - S(100), x + S(100), y - S(50)), radius=S(16), fill=K.DANGER)
    d.rectangle((x - S(100), y - S(66), x + S(100), y - S(50)), fill=K.DANGER)
    for rx in (x - S(50), x + S(50)):
        d.rounded_rectangle((rx - S(8), y - S(120), rx + S(8), y - S(84)), radius=S(5), fill=K.DEV_DARK)
    for r in range(3):
        for c in range(4):
            gx = x - S(72) + c * S(48)
            gy = y - S(30) + r * S(44)
            d.rounded_rectangle((gx, gy, gx + S(34), gy + S(30)), radius=S(5), fill=K.ROAD_SOFT)
    gx, gy = x - S(72) + 2 * S(48) + S(17), y - S(30) + S(44) + S(15)
    d.ellipse((gx - S(30), gy - S(28), gx + S(30), gy + S(28)), outline=K.CORAL, width=max(3, int(S(6))))


def draw_clipboard(d, x, y, s):
    def S(v):
        return v * s
    d.rounded_rectangle((x - S(90) + S(8), y - S(110) + S(10), x + S(90) + S(8), y + S(120) + S(10)), radius=S(14),
                        fill=K.SHADOW)
    d.rounded_rectangle((x - S(90), y - S(110), x + S(90), y + S(120)), radius=S(14), fill=WOOD)
    d.rectangle((x - S(72), y - S(86), x + S(72), y + S(104)), fill=WHITE)
    d.rounded_rectangle((x - S(36), y - S(124), x + S(36), y - S(92)), radius=S(8), fill=K.STEEL_DARK)
    for r in range(4):
        ry = y - S(56) + r * S(42)
        K.draw_check(d, x - S(46), ry, S(13), K.SAGE if hasattr(K, "SAGE") else (13, 148, 136))
        d.rounded_rectangle((x - S(24), ry - S(6), x + S(56), ry + S(6)), radius=S(5), fill=(200, 200, 214))


def draw_paper(d, x, y, s, fold=0.0):
    """A sheet folding in half (fold 0→1)."""
    def S(v):
        return v * s
    f = K.clamp01(fold)
    d.rectangle((x - S(70) + S(6), y - S(100) + S(8), x + S(70) + S(6), y + S(100) + S(8)), fill=K.SHADOW)
    left = x - S(70)
    d.rectangle((x, y - S(100), x + S(70), y + S(100)), fill=(255, 236, 220), outline=K.DEV_DARK, width=2)
    fx = K.lerp(left, x + S(66), f)
    d.polygon([(x, y - S(100)), (fx, y - S(100) - S(14) * math.sin(math.pi * f)),
               (fx, y + S(100) - S(14) * math.sin(math.pi * f)), (x, y + S(100))],
              fill=(255, 246, 236) if f < 0.5 else (255, 214, 190), outline=K.DEV_DARK, width=2)
    K.draw_dashed(d, x, y - S(96), x, y + S(96), K.DEV_MID, width=2, dash=10, gap=8)


def draw_card(d, x, y, s, mode="front", t=0.0):
    def S(v):
        return v * s
    if mode == "inside":
        d.rectangle((x - S(130) + S(6), y - S(90) + S(8), x + S(130) + S(6), y + S(90) + S(8)), fill=K.SHADOW)
        d.rectangle((x - S(130), y - S(90), x, y + S(90)), fill=(255, 240, 230), outline=K.DEV_DARK, width=2)
        d.rectangle((x, y - S(90), x + S(130), y + S(90)), fill=WHITE, outline=K.DEV_DARK, width=2)
        K.draw_heart(d, x - S(66), y - S(10), S(30), K.CORAL)
        for r in range(4):
            ry = y - S(50) + r * S(30)
            d.line((x + S(20), ry, x + S(110 - (r == 3) * 40), ry), fill=K.ROAD, width=max(2, int(S(5))))
        return
    d.rectangle((x - S(80) + S(6), y - S(100) + S(8), x + S(80) + S(6), y + S(100) + S(8)), fill=K.SHADOW)
    d.rectangle((x - S(80), y - S(100), x + S(80), y + S(100)), fill=(255, 236, 220), outline=K.DEV_DARK, width=2)
    d.line((x - S(80), y - S(100), x - S(80), y + S(100)), fill=K.DEV_DARK, width=max(2, int(S(6))))
    if mode in ("front", "sign"):
        for k, (dx, col) in enumerate(((-30, K.CORAL), (20, K.BOTH_COLOR))):
            bx, by = x + S(dx), y - S(30) - k * S(14)
            d.line((bx, by + S(30), x - S(4), y + S(60)), fill=K.DEV_DARK, width=2)
            d.ellipse((bx - S(24), by - S(30), bx + S(24), by + S(30)), fill=col)
        K.draw_star(d, x + S(46), y + S(50), S(16), K.GOLD)
    if mode == "sign":
        d.line([(x - S(160), y + S(40)), (x - S(140), y + S(10)), (x - S(126), y + S(42)), (x - S(110), y + S(14)),
                (x - S(96), y + S(40))], fill=K.ROAD, width=max(2, int(S(5))), joint="curve")
        K.draw_arrow(d, x + S(100), y, x + S(170), y, K.CORAL, width=max(3, int(S(10))), head=int(S(26)))


def draw_screen(d, box, s=1.0):
    x0, y0, x1, y1 = box
    d.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=28, fill=K.SHADOW)
    d.rounded_rectangle(box, radius=28, fill=K.DEV_DARK)
    ix0, iy0, ix1, iy1 = x0 + 22, y0 + 22, x1 - 22, y1 - 22
    d.rounded_rectangle((ix0, iy0, ix1, iy1), radius=14, fill=GRASS)
    return ix0, iy0, ix1, iy1


def draw_cricket(d, inner, t=0.0, show=(1, 1, 1, 1)):
    ix0, iy0, ix1, iy1 = inner
    mx = (ix0 + ix1) / 2
    for k in range(5):
        d.rectangle((ix0, iy0 + k * (iy1 - iy0) / 5, ix1, iy0 + k * (iy1 - iy0) / 5 + (iy1 - iy0) / 10),
                    fill=GRASS_DARK)
    if show[0]:
        d.polygon([(mx - 60, iy0 + 30), (mx + 60, iy0 + 30), (mx + 100, iy1 - 20), (mx - 100, iy1 - 20)], fill=PITCH)
        for wy, half in ((iy0 + 40, 22), (iy1 - 60, 32)):
            for k in range(3):
                d.rectangle((mx - half + k * half - 3, wy, mx - half + k * half + 3, wy + 40), fill=WHITE)
    if show[1]:
        bx, by = mx + 70, iy1 - 120
        swing = -0.9 + 0.9 * math.sin(t * 10)
        tip = (bx + math.cos(swing) * 110, by + math.sin(swing) * 110)
        d.line((bx, by, tip[0], tip[1]), fill=(214, 168, 100), width=18)
        d.ellipse((bx - 14, by - 14, bx + 14, by + 14), fill=K.SKIN)
    if show[2]:
        p = (t * 2.0) % 1
        bx, by = mx - 10 + 30 * p, iy0 + 80 + (iy1 - iy0 - 200) * p
        d.ellipse((bx - 14, by - 14, bx + 14, by + 14), fill=K.DANGER, outline=WHITE, width=3)
    if show[3]:
        d.rounded_rectangle((ix0 + 18, iy0 + 18, ix0 + 190, iy0 + 82), radius=12, fill=K.DEV_DEEP)
        K.text_at(d, "24 / 1", ix0 + 104, iy0 + 26, K.load_font(38, bold=True), K.GOLD)


def draw_kite(d, x, y, s, t=0.0):
    def S(v):
        return v * s
    pts = [(x, y - S(90)), (x + S(70), y), (x, y + S(100)), (x - S(70), y)]
    d.polygon([(px + S(6), py + S(8)) for px, py in pts], fill=K.SHADOW)
    d.polygon([(x, y - S(90)), (x + S(70), y), (x, y)], fill=K.CORAL)
    d.polygon([(x, y - S(90)), (x - S(70), y), (x, y)], fill=K.GOLD)
    d.polygon([(x, y + S(100)), (x + S(70), y), (x, y)], fill=K.BOTH_COLOR)
    d.polygon([(x, y + S(100)), (x - S(70), y), (x, y)], fill=K.ROAD)
    d.polygon(pts, outline=K.DEV_DARK, width=max(2, int(S(3))))
    tail = [(x + S(10) * math.sin(t * 9 + k) + k * S(8), y + S(100) + k * S(22)) for k in range(5)]
    d.line(tail, fill=K.DEV_DARK, width=2, joint="curve")
    for k in (1, 3):
        tx, ty = tail[k]
        d.polygon([(tx - S(14), ty - S(8)), (tx + S(14), ty + S(8)), (tx + S(14), ty - S(8)), (tx - S(14), ty + S(8))],
                  fill=K.CORAL)


def draw_sun(d, x, y, r, t=0.0):
    for k in range(10):
        a = k * math.tau / 10 + t
        d.line((x + math.cos(a) * r * 1.25, y + math.sin(a) * r * 1.25, x + math.cos(a) * r * 1.6,
                y + math.sin(a) * r * 1.6), fill=K.GOLD, width=max(3, int(r * 0.12)))
    d.ellipse((x - r, y - r, x + r, y + r), fill=K.GOLD)
    d.ellipse((x - r * 0.75, y - r * 0.75, x + r * 0.75, y + r * 0.75), fill=(255, 210, 100))


def icon(d, kind, x, y, s, t=0.0):
    if kind == "toys":
        draw_toybox(d, x, y + 80 * s, 1.0 * s, full=True)
    elif kind == "bed":
        draw_bed(d, x - 200 * s * 0.6, y + 60 * s, 0.6 * s, made=True)
    elif kind == "messybed":
        draw_bed(d, x - 200 * s * 0.6, y + 60 * s, 0.6 * s, made=False)
    elif kind == "shelf":
        d.rectangle((x - 120 * s, y + 50 * s, x + 120 * s, y + 66 * s), fill=WOOD)
        for k in range(5):
            bx = x - 110 * s + k * 46 * s
            draw_book(d, bx, y + 50 * s - (100 + (k * 23) % 30) * s, bx + 40 * s, y + 50 * s, BOOK_COLS[k])
    elif kind == "bookpile":
        draw_bookstack(d, x, y + 60 * s, 1.0 * s)
    elif kind == "kite":
        draw_kite(d, x, y - 20 * s, 1.0 * s, t)
    elif kind == "timetable":
        draw_timetable(d, x, y, 0.85 * s)
    elif kind == "books":
        draw_bookstack(d, x, y + 60 * s, 1.0 * s)
    elif kind == "bottle":
        draw_bottle(d, x, y + 10 * s, 0.9 * s)
    elif kind == "lunch":
        K.draw_tiffin(d, x, y + 20 * s, 0.85 * s)
    elif kind == "pencils":
        draw_pencilbox(d, x, y + 40 * s, 0.9 * s)
    elif kind == "squeeze":
        draw_lemon_half(d, x - 10 * s, y - 60 * s, 0.75 * s)
        for k in range(3):
            dy = ((t * 3 + k / 3) % 1) * 40 * s
            d.ellipse((x - 18 * s, y - 6 * s + dy, x - 2 * s, y + 10 * s + dy), fill=LEMON_DARK)
        draw_tumbler(d, x, y + 120 * s, 0.55 * s, level=0.25, col=(250, 236, 150))
    elif kind == "water":
        draw_jug(d, x - 50 * s, y - 20 * s, 0.7 * s, t)
        draw_tumbler(d, x + 50 * s, y + 120 * s, 0.55 * s, level=0.6, col=(236, 240, 190))
    elif kind == "sugar":
        draw_sugar(d, x, y + 30 * s, 1.0 * s)
    elif kind == "serve":
        draw_tumbler(d, x, y + 100 * s, 1.0 * s, level=0.85, straw=True, slice_=True)
    elif kind == "serve_empty":
        draw_tumbler(d, x, y + 100 * s, 1.0 * s, level=0.0, straw=True)
    elif kind == "snacks":
        draw_chips(d, x - 50 * s, y - 10 * s, 0.75 * s)
        draw_laddoos(d, x + 50 * s, y + 70 * s, 0.7 * s)
    elif kind == "setup":
        draw_balloons(d, x, y - 30 * s, 1.0 * s, t)
    elif kind == "date":
        draw_calendar(d, x, y, 0.9 * s)
    elif kind == "guests":
        draw_clipboard(d, x, y, 0.85 * s)
    elif kind == "fold":
        draw_paper(d, x + 10 * s, y + 20 * s, 0.85 * s, fold=0.25)
        K.draw_curve(d, (x - 60 * s, y - 90 * s), (x + 10 * s, y - 150 * s), (x + 70 * s, y - 100 * s), K.CORAL,
                     width=max(3, int(8 * s)))
        d.polygon([(x + 70 * s, y - 100 * s), (x + 50 * s, y - 118 * s), (x + 84 * s, y - 124 * s)], fill=K.CORAL)
    elif kind == "draw":
        draw_card(d, x, y, 0.95 * s, "front", t)
    elif kind == "write":
        draw_card(d, x, y, 0.9 * s, "inside", t)
    elif kind == "sign":
        draw_card(d, x - 10 * s, y, 0.85 * s, "front", t)
        d.line([(x - 70 * s, y + 70 * s), (x - 52 * s, y + 46 * s), (x - 38 * s, y + 72 * s), (x - 22 * s, y + 48 * s),
                (x - 8 * s, y + 72 * s)], fill=K.ROAD, width=max(2, int(5 * s)), joint="curve")
        K.draw_arrow(d, x + 80 * s, y, x + 140 * s, y, K.CORAL, width=max(3, int(10 * s)), head=int(26 * s))


# ---- render -------------------------------------------------------------------------

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
    d = draw

    def star_list(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(d, sx, sy + 8 * math.sin(progress * 9 + i), 20 + 6 * pulse, palette[i % 4],
                        rot=progress * 3 + i)

    def qmarks(pts, size=80):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(d, "?", qx, qy, F(int(size + 20 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def tile(x, y, label, col, size=96):
        d.rounded_rectangle((x - size / 2 + 6, y - size / 2 + 8, x + size / 2 + 6, y + size / 2 + 8), radius=22,
                            fill=K.SHADOW)
        d.rounded_rectangle((x - size / 2, y - size / 2, x + size / 2, y + size / 2), radius=22, fill=col)
        K.text_at(d, label, x, y - size * 0.36, F(int(size * 0.56), bold=True), WHITE)

    def step_card(box, num, label, kind, col, state="normal", label_size=34, icon_s=1.0):
        x0, y0, x1, y1 = box
        mx = (x0 + x1) / 2
        out = sage if state == "win" else K.DANGER if state == "bad" else None
        K.shadow_card(d, box, brand, radius=28, outline=out, outline_w=6 if out else 3)
        if state == "win":
            d.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=24, fill=sage_soft)
        elif state == "bad":
            d.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=24, fill=K.DANGER_SOFT)
        if num is not None:
            K.pill(d, 0, y0 + 20, str(num), sage if state == "win" else col, size=28, left=x0 + 20)
        if kind:
            icon(d, kind, mx, y0 + (y1 - y0) * 0.42, icon_s, t)
        font = F(label_size, bold=True)
        lines = K.wrap_text(label, font, int(x1 - x0 - 40))
        lh = int(label_size * 1.2)
        ty = y1 - 26 - len(lines) * lh
        for j, ln in enumerate(lines):
            K.text_at(d, ln, mx, ty + j * lh, font, ink)
        if state == "win":
            K.draw_check(d, x1 - 44, y0 + 44, 26, sage)
        elif state == "bad":
            K.draw_cross(d, x1 - 44, y0 + 44, 26, K.DANGER)

    def card_row(steps, y0, y1, cw=380, gap=56, shown=None, states=None, nums=None, label_size=34, icon_s=1.0,
                 arrows=True):
        n = len(steps)
        x_start = cx - (n * cw + (n - 1) * gap) / 2
        for i, (kind, lab) in enumerate(steps):
            a = 1.0 if shown is None else K.stagger(progress, i, step=shown, speed=4)
            if a <= 0:
                continue
            x0 = x_start + i * (cw + gap)
            yy = int((1 - a) * 40)
            st = states[i] if states else "normal"
            num = nums[i] if nums else i + 1
            step_card((x0, y0 + yy, x0 + cw, y1 + yy), num, lab, kind, coral, st, label_size, icon_s)
            if arrows and i < n - 1 and a >= 1:
                ax = x0 + cw + 8
                K.draw_arrow(d, ax, (y0 + y1) / 2, ax + gap - 16, (y0 + y1) / 2, muted, width=8, head=22)

    def reorder_row(steps, ranks, move, y0, y1, cw, gap, states=None, letters=False, label_size=34, icon_s=1.0):
        n = len(steps)
        x_start = cx - (n * cw + (n - 1) * gap) / 2
        for i in sorted(range(n), key=lambda k: abs(ranks[k] - k) * move):
            kind, lab = steps[i]
            pos = K.lerp(i, ranks[i], move)
            x0 = x_start + pos * (cw + gap)
            arc = -60 * math.sin(math.pi * move) if ranks[i] != i else 0
            if letters and move < 0.5:
                num = "ABCD"[i]
            else:
                num = (ranks[i] + 1) if move >= 0.5 else (i + 1)
            st = states[i] if states else "normal"
            step_card((x0, y0 + arc, x0 + cw, y1 + arc), num, lab, kind, K.BOTH_COLOR if letters and move < 0.5
                      else coral, st, label_size, icon_s)
        if move >= 1.0:
            for k in range(n - 1):
                ax = x_start + k * (cw + gap) + cw + 8
                K.draw_arrow(d, ax, (y0 + y1) / 2, ax + gap - 16, (y0 + y1) / 2, muted, width=8, head=22)

    def eq_box(x, y, label, col, wd=170, ht=110, size=64):
        d.rounded_rectangle((x - wd / 2 + 8, y + 10, x + wd / 2 + 8, y + ht + 10), radius=24, fill=K.SHADOW)
        d.rounded_rectangle((x - wd / 2, y, x + wd / 2, y + ht), radius=24, fill=panel, outline=col, width=6)
        K.text_at(d, label, x, y + (ht - size * 1.15) / 2, F(size, bold=True), col)

    # ---- opening ----------------------------------------------------------------------
    if visual == "c19-welcome":
        if focus == "hello":
            K.draw_mascot(d, int(cx - 260), 450, 110, sage, panel, bounce)
            K.draw_person(d, cx + 260, 430, 1.3, "kid", t)
            K.text_at(d, "Welcome back, champ!", cx, 730, F(60, bold=True), ink)
            star_list([(cx - 560, 330), (cx + 560, 330), (cx - 640, 520), (cx + 640, 520)])
            return True
        if focus == "bridge":
            K.shadow_card(d, (200, 240 + lift, w - 200, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(d, "LAST TIME · WORKING BACKWARDS", cx, 300 + lift, F(34, bold=True), sage)
            y1 = 400 + lift
            eq_box(420, y1, "?", muted)
            eq_box(940, y1, "9", ink)
            K.draw_arrow(d, 520, y1 + 55, 840, y1 + 55, K.DANGER, width=10, head=28)
            K.pill(d, 680, y1 - 34, "lost 3", K.DANGER, size=28)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                y2 = 600 + lift + int((1 - a) * 20)
                eq_box(940, y2, "9", ink)
                eq_box(420, y2, "12", sage)
                K.draw_arrow(d, 840, y2 + 55, 520, y2 + 55, sage, width=10, head=28)
                K.pill(d, 680, y2 + 76, "add 3 back", sage, size=28)
            # sticker sheet
            sx0, sy0 = 1180, 380 + lift
            d.rounded_rectangle((sx0 + 8, sy0 + 10, sx0 + 420 + 8, sy0 + 400 + 10), radius=26, fill=K.SHADOW)
            d.rounded_rectangle((sx0, sy0, sx0 + 420, sy0 + 400), radius=26, fill=gold_soft, outline=K.GOLD, width=5)
            n_st = 9 if progress < 0.45 else 12
            for k in range(12):
                r_, c_ = divmod(k, 4)
                px, py = sx0 + 70 + c_ * 94, sy0 + 80 + r_ * 120
                if k < n_st:
                    K.draw_star(d, px, py, 36, palette[k % 4], rot=0.2 * k)
                else:
                    d.ellipse((px - 34, py - 34, px + 34, py + 34), outline=line, width=4)
            return True
        if focus == "chapter":
            K.shadow_card(d, (300, 240 + lift, w - 300, 560 + lift), brand, radius=40, accent=coral)
            K.text_at(d, "CHAPTER 4 OF 5", cx, 300 + lift, F(32, bold=True), coral)
            K.text_at(d, "Breaking Big Problems", cx, 360 + lift, F(78, bold=True), ink)
            K.text_at(d, "Into Small Ones", cx, 450 + lift, F(78, bold=True), coral)
            m = K.ease_in_out(K.clamp01((progress - 0.25) * 2.0))
            size = 180
            for k in range(4):
                r_, c_ = divmod(k, 2)
                bx = cx + (c_ - 0.5) * (size / 2 + 4 + 140 * m)
                by = 730 + (r_ - 0.5) * (size / 2 + 4 + 20 * m)
                sz = size / 2
                d.rounded_rectangle((bx - sz / 2, by - sz / 2, bx + sz / 2, by + sz / 2), radius=14,
                                    fill=palette[k] if m > 0.05 else K.STEEL_DARK)
                if m > 0.5:
                    K.text_at(d, str(k + 1), bx, by - 30, F(46, bold=True), WHITE)
            if m <= 0.05:
                K.text_at(d, "BIG", cx, 700, F(52, bold=True), WHITE)
            return True
        # big
        draw_mountain(d, 760, 1880, 860, 1330, 280)
        K.draw_person(d, 430, 520, 1.25, "kid", t)
        qmarks([(260, 300), (600, 280)], 90)
        K.text_at(d, "Way too big?!", 430, 760, F(52, bold=True), K.DANGER)
        a = K.clamp01((progress - 0.45) * 2.5)
        if a > 0:
            for k in range(5):
                sa = K.clamp01(a * 5 - k)
                if sa <= 0:
                    continue
                fx = K.lerp(900, 1290, (k + 0.5) / 5)
                fy = K.lerp(860, 300, (k + 0.5) / 5)
                d.rounded_rectangle((fx - 40, fy - 22, fx + 40, fy + 22), radius=10, fill=palette[k % 4])
                K.text_at(d, str(k + 1), fx, fy - 20, F(32, bold=True), WHITE)
            K.pill(d, 1080, 330, "Small steps!", sage, size=36)
        return True

    # ---- Riya's room ------------------------------------------------------------------
    if visual == "c19-hook":
        if focus == "meet":
            d.ellipse((330 - 220, 560 - 220, 330 + 220, 560 + 220), fill=lav_soft)
            K.draw_person(d, 330, 500, 1.2, "mom", t)
            K.draw_bubble(d, (560, 250, 1340, 420), brand, "Riya, Nani is coming. Please clean your room!",
                          tail="left", size=40)
            d.ellipse((1530 - 210, 600 - 210, 1530 + 210, 600 + 210), fill=coral_soft)
            K.draw_person(d, 1530, 540, 1.15, "kid", t)
            K.pill(d, 1530, 790, "Riya", coral, size=34)
            # calendar
            cx0 = 950
            d.rounded_rectangle((cx0 - 130 + 8, 520 + 10, cx0 + 130 + 8, 820 + 10), radius=20, fill=K.SHADOW)
            d.rounded_rectangle((cx0 - 130, 520, cx0 + 130, 820), radius=20, fill=panel, outline=ink, width=4)
            d.rounded_rectangle((cx0 - 130, 520, cx0 + 130, 600), radius=20, fill=K.DANGER)
            d.rectangle((cx0 - 130, 580, cx0 + 130, 600), fill=K.DANGER)
            K.text_at(d, "SUNDAY", cx0, 535, F(40, bold=True), WHITE)
            draw_sun(d, cx0, 710, 52, t)
            return True
        if focus == "mess":
            draw_room(d, 360, 250, 1.0, kid=True, t=t)
            if progress > 0.4:
                K.pill(d, 580, 300, "Oh no!", K.DANGER, size=44)
            return True
        if focus == "stuck":
            d.ellipse((400 - 250, 560 - 250, 400 + 250, 560 + 250), fill=lav_soft)
            K.draw_person(d, 400, 500, 1.25, "kid", t)
            qmarks([(150, 280), (640, 300)], 80)
            K.draw_bubble(d, (720, 250, 1700, 390), brand, "Where do I even start?", tail="left", size=50)
            items = [("toys_mess", "Toys"), ("books_mess", "Books"), ("messybed", "Bed")]
            for i, (kind, lab) in enumerate(items):
                x = 880 + i * 330
                d.rounded_rectangle((x - 140, 470, x + 140, 800), radius=30, fill=panel, outline=line, width=3)
                if kind == "toys_mess":
                    draw_ball(d, x - 60, 610, 34)
                    draw_blocks(d, x + 50, 660, 0.8)
                    draw_car(d, x - 20, 680, 0.7)
                elif kind == "books_mess":
                    draw_open_book(d, x, 590, 1.0)
                    draw_book(d, x - 90, 640, x + 30, 670, BOOK_COLS[0])
                    draw_book(d, x - 40, 670, x + 90, 700, BOOK_COLS[1])
                else:
                    icon(d, "messybed", x, 600, 1.0, t)
                K.text_at(d, lab, x, 730, F(38, bold=True), ink)
            K.draw_stopwatch(d, 400, 800, 46, progress, brand)
            return True
        if focus == "split":
            K.shadow_card(d, (cx - 320, 240, cx + 320, 350), brand, radius=30, outline=coral, outline_w=6)
            K.text_at(d, "Clean the room", cx, 266, F(52, bold=True), coral)
            items = [("toys", "Pick up toys"), ("shelf", "Books on shelf"), ("bed", "Make the bed")]
            for i, (kind, lab) in enumerate(items):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                y0 = 470 + int((1 - a) * 40)
                K.draw_arrow(d, cx + (i - 1) * 120, 360, x, y0 - 14, muted, width=8, head=24)
                step_card((x - 220, y0, x + 220, y0 + 380), i + 1, lab, kind, coral, label_size=38, icon_s=1.0)
            return True
        # done
        stage = progress * 1.25
        toys, books, bed = (1.0 if stage > 0.25 else 0.0), (1.0 if stage > 0.5 else 0.0), (1.0 if stage > 0.75 else 0.0)
        draw_room(d, 600, 250, 0.98, toys, books, bed)
        x0, y0 = 120, 260
        d.rounded_rectangle((x0 + 10, y0 + 12, x0 + 420 + 10, y0 + 470 + 12), radius=24, fill=K.SHADOW)
        d.rounded_rectangle((x0, y0, x0 + 420, y0 + 470), radius=24, fill=(255, 250, 238))
        K.text_at(d, "Riya's jobs", x0 + 210, y0 + 26, F(40, bold=True), coral)
        for i, (lab, v) in enumerate((("Toys", toys), ("Books", books), ("Bed", bed))):
            yy = y0 + 110 + i * 110
            d.rounded_rectangle((x0 + 30, yy, x0 + 390, yy + 86), radius=22, fill=sage_soft if v else panel,
                                outline=sage if v else line, width=4 if v else 2)
            K.pill(d, 0, yy + 18, str(i + 1), sage if v else muted, size=26, left=x0 + 46)
            d.text((x0 + 130, yy + 20), lab, fill=ink, font=F(40, bold=True))
            if v:
                K.draw_check(d, x0 + 346, yy + 43, 24, sage)
        if bed:
            K.pill(d, x0 + 210, 790, "All clean!", sage, size=40)
            star_list([(1330, 330), (1560, 300)])
        return True

    # ---- definition -------------------------------------------------------------------
    if visual == "c19-define":
        if focus == "name":
            m = K.ease_in_out(K.clamp01(progress * 2.2))
            bx, by, size = 430, 560, 300
            for k in range(9):
                r_, c_ = divmod(k, 3)
                sz = size / 3
                ox = (c_ - 1) * (sz + 4 + 40 * m)
                oy = (r_ - 1) * (sz + 4 + 40 * m)
                d.rounded_rectangle((bx + ox - sz / 2, by + oy - sz / 2, bx + ox + sz / 2, by + oy + sz / 2), radius=12,
                                    fill=palette[k % 4] if m > 0.1 else K.STEEL_DARK)
            if m <= 0.1:
                K.text_at(d, "BIG", bx, by - 36, F(60, bold=True), WHITE)
            a = K.ease_out_cubic(K.clamp01((progress - 0.35) * 2.5))
            if a > 0:
                K.draw_arrow(d, 720, 560, 720 + 160 * a, 560, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.5) * 2.5))
            if b > 0:
                s = 0.8 + 0.2 * b
                mx, my = 1350, 560
                hw, hh = 440 * s, 170 * s
                K.shadow_card(d, (mx - hw, my - hh, mx + hw, my + hh), brand, radius=40, outline=coral, outline_w=6)
                K.text_at(d, "It's called", mx, my - 110 * s, F(int(42 * s), bold=True), muted)
                K.text_at(d, "DECOMPOSITION", mx, my - 36 * s, F(int(84 * s), bold=True), coral)
            return True
        if focus == "word":
            syl = ["De", "com", "po", "si", "tion"]
            for i, sy in enumerate(syl):
                a = K.stagger(progress, i, step=0.06, speed=6)
                if a <= 0:
                    continue
                x = cx - 480 + i * 240
                K.pill(d, x, 250 + int((1 - a) * 20), sy, palette[i % 4], size=48)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.text_at(d, "Breaking a big problem", cx, 390 + int((1 - a) * 20), F(62, bold=True), ink)
                K.text_at(d, "into smaller, easier parts", cx, 470 + int((1 - a) * 20), F(62, bold=True), sage)
            m = K.ease_in_out(K.clamp01((progress - 0.45) * 2.5))
            d.rounded_rectangle((cx - 560 - 120, 600, cx - 560 + 120, 820), radius=24, fill=K.STEEL_DARK)
            K.text_at(d, "BIG", cx - 560, 680, F(52, bold=True), WHITE)
            K.draw_arrow(d, cx - 380, 710, cx - 200, 710, coral, width=12, head=34)
            for k in range(4):
                bx = cx - 60 + k * 170
                if m <= 0:
                    continue
                by = 710 + 30 * (1 - m)
                d.rounded_rectangle((bx - 60, by - 60, bx + 60, by + 60), radius=18, fill=palette[k])
                if m > 0.6:
                    K.draw_check(d, bx, by, 26, sage)
            return True
        if focus == "roti":
            torn = K.clamp01((progress - 0.25) * 2.2)
            d.ellipse((620 - 300 + 8, 560 - 300 + 10, 620 + 300 + 8, 560 + 300 + 10), fill=K.SHADOW)
            d.ellipse((620 - 300, 560 - 300, 620 + 300, 560 + 300), fill=PLATE, outline=K.STEEL_DARK, width=6)
            d.ellipse((620 - 250, 560 - 250, 620 + 250, 560 + 250), outline=K.STEEL, width=4)
            draw_roti(d, 620, 560, 200, torn)
            d.ellipse((1400 - 220, 560 - 220, 1400 + 220, 560 + 220), fill=gold_soft)
            K.draw_person(d, 1400, 500, 1.15, "kid", t)
            if torn > 0.6:
                K.draw_heart(d, 1580, 360 + bounce, 30, coral)
            K.text_at(d, "Whole roti in one go?", 1400, 250, F(42, bold=True), K.DANGER if torn < 0.5 else muted)
            if torn >= 0.5:
                K.pill(d, 1400, 780, "One bite at a time!", sage, size=40)
            return True
        # small
        K.text_at(d, "Small task", cx, 240 + lift, F(84, bold=True), coral)
        K.text_at(d, "= one simple job you can finish on its own", cx, 350 + lift, F(46, bold=True), ink)
        items = [("toys", "Pick up toys"), ("shelf", "Books on shelf"), ("bed", "Make the bed")]
        for i, (kind, lab) in enumerate(items):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 500
            y0 = 450 + int((1 - a) * 40)
            done = progress > 0.35 + i * 0.12
            step_card((x - 210, y0, x + 210, y0 + 380), None, lab, kind, coral, "win" if done else "normal",
                      label_size=38)
        return True

    # ---- school bag -------------------------------------------------------------------
    if visual == "c19-bag":
        if focus == "big":
            d.ellipse((560 - 280, 560 - 280, 560 + 280, 560 + 280), fill=coral_soft)
            K.draw_bag(d, 560, 600, 2.1)
            K.text_at(d, "Big job:", 1260, 330 + lift, F(56, bold=True), muted)
            K.text_at(d, "Pack your", 1260, 410 + lift, F(84, bold=True), ink)
            K.text_at(d, "school bag", 1260, 510 + lift, F(84, bold=True), coral)
            d.ellipse((1650 - 60, 690 - 60, 1650 + 60, 690 + 60), fill=K.GOLD)
            d.ellipse((1650 - 30, 690 - 70, 1650 + 80, 690 + 40), fill=K.hex_rgb(brand["bg"]))
            star_list([(1000, 720), (1180, 790), (1420, 740)])
            return True
        if focus == "parts":
            d.ellipse((cx - 230, 570 - 230, cx + 230, 570 + 230), fill=coral_soft)
            K.draw_bag(d, cx, 600, 1.5)
            items = [("books", "Books", 440, 400), ("bottle", "Water bottle", 1480, 400),
                     ("lunch", "Lunch box", 440, 700), ("pencils", "Pencil box", 1480, 700)]
            for i, (kind, lab, x, y) in enumerate(items):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                yy = y + int((1 - a) * 30)
                icon(d, kind, x, yy - 40, 0.8, t)
                tx = x + (250 if x < cx else -250)
                K.text_at(d, lab, x, yy + 90, F(38, bold=True), ink)
                if a >= 1:
                    K.draw_arrow(d, x + (130 if x < cx else -130), yy, tx + (0 if x < cx else 0) +
                                 (-20 if x < cx else 20), yy + (60 if y < 500 else -60), muted, width=8, head=22)
            return True
        if focus == "steps":
            card_row([("timetable", "Check timetable"), ("books", "Put in books"), ("bottle", "Fill the bottle"),
                      ("lunch", "Add lunch box")], 290, 770, cw=380, gap=56, shown=0.15, label_size=36)
            return True
        # why
        draw_timetable(d, 400, 540, 1.7, today=2)
        K.pill(d, 400, 790, "Today's subjects", coral, size=34)
        K.draw_arrow(d, 620, 540, 760, 540, coral, width=12, head=34)
        draw_bookstack(d, 920, 640, 1.2)
        K.draw_check(d, 1020, 400, 30, sage)
        labels = [("First", coral), ("Next", K.BOTH_COLOR), ("Last", sage)]
        for i, (lab, col) in enumerate(labels):
            a = K.stagger(progress, i + 1, step=0.15, speed=4)
            if a <= 0:
                continue
            y = 300 + i * 170 + int((1 - a) * 30)
            d.rounded_rectangle((1250, y, 1700, y + 130), radius=30, fill=panel, outline=col, width=6)
            d.ellipse((1280, y + 25, 1360, y + 105), fill=col)
            K.text_at(d, str(i + 1), 1320, y + 34, F(46, bold=True), WHITE)
            d.text((1400, y + 36), lab, fill=col, font=F(52, bold=True))
        return True

    # ---- nimbu pani -------------------------------------------------------------------
    if visual == "c19-nimbu":
        if focus == "intro":
            draw_sun(d, 300, 360, 80, t)
            d.ellipse((800 - 240, 600 - 240, 800 + 240, 600 + 240), fill=gold_soft)
            draw_tumbler(d, 800, 800, 2.0, level=0.85, straw=True, slice_=True)
            draw_lemon(d, 1080, 760, 0.9)
            draw_lemon_half(d, 560, 790, 0.8)
            K.draw_person(d, 1340, 500, 1.1, "kid", t)
            K.draw_person(d, 1650, 500, 1.1, "nani", t + 0.3)
            K.pill(d, 1340, 760, "Riya", coral, size=32)
            K.pill(d, 1650, 760, "Nani", K.PERSON_COLORS["nani"], size=32)
            K.text_at(d, "Nimbu pani!", 1495, 250, F(64, bold=True), coral)
            return True
        steps = [("squeeze", "Squeeze lemons"), ("water", "Add water"), ("sugar", "Stir in sugar"),
                 ("serve", "Pour & serve")]
        if focus == "steps":
            card_row(steps, 290, 770, cw=380, gap=56, shown=0.15, label_size=36)
            return True
        # oops
        step_card((160, 280, 620, 780), 1, "Pour & serve", "serve_empty", coral, "bad", label_size=40, icon_s=1.1)
        K.pill(d, 390, 800, "Nothing to pour yet!", K.DANGER, size=34)
        x0, y0 = 760, 270
        d.rounded_rectangle((x0 + 10, y0 + 12, x0 + 1000 + 10, y0 + 560 + 12), radius=24, fill=K.SHADOW)
        d.rounded_rectangle((x0, y0, x0 + 1000, y0 + 560), radius=24, fill=(255, 250, 238))
        K.text_at(d, "The right order", x0 + 500, y0 + 24, F(42, bold=True), sage)
        for i, (kind, lab) in enumerate(steps):
            yy = y0 + 100 + i * 112
            last = i == 3
            a = K.stagger(progress, i, step=0.1, speed=5)
            if a <= 0:
                continue
            d.rounded_rectangle((x0 + 40, yy, x0 + 960, yy + 92), radius=24,
                                fill=sage_soft if last else panel, outline=sage if last else line,
                                width=5 if last else 2)
            K.pill(d, 0, yy + 20, str(i + 1), sage if last else muted, size=28, left=x0 + 64)
            d.text((x0 + 170, yy + 22), lab, fill=ink, font=F(42, bold=True))
            if last:
                K.pill(d, 0, yy + 18, "LAST", sage, size=30, left=x0 + 780)
        return True

    # ---- 23 + 45 ----------------------------------------------------------------------
    if visual == "c19-add":
        cube = 30

        def rod(x, y_bot, col=TEN_COL):
            for k in range(10):
                yy = y_bot - (k + 1) * cube
                d.rectangle((x, yy, x + cube, yy + cube), fill=col, outline=WHITE, width=2)
            d.rectangle((x, y_bot - 10 * cube, x + cube, y_bot), outline=K.DEV_DARK, width=2)

        def ones(x, y_bot, n, col=ONE_COL):
            for k in range(n):
                r_, c_ = divmod(k, 2)
                xx = x + c_ * (cube + 6)
                yy = y_bot - (r_ + 1) * (cube + 6)
                d.rectangle((xx, yy, xx + cube, yy + cube), fill=col, outline=K.DEV_DARK, width=2)

        def group(x, y_bot, tens, n_ones):
            for k in range(tens):
                rod(x + k * (cube + 10), y_bot)
            ones(x + tens * (cube + 10) + 20, y_bot, n_ones)
            return x + tens * (cube + 10) + 20 + 2 * (cube + 6)

        if focus in ("ask", "split"):
            K.text_at(d, "23 + 45 = ?", cx, 240 + lift, F(96, bold=True), ink)
            yb = 740
            # group 23
            g1x = 440
            group(g1x, yb, 2, 3)
            g2x = 1180
            group(g2x, yb, 4, 5)
            K.text_at(d, "+", cx - 40, 520, F(110, bold=True), muted)
            if focus == "ask":
                K.text_at(d, "23", 520, 770, F(56, bold=True), ink)
                K.text_at(d, "45", 1300, 770, F(56, bold=True), ink)
                qmarks([(200, 480), (1720, 480)], 90)
            else:
                a = K.stagger(progress, 0, step=0.1, speed=4)
                b = K.stagger(progress, 2, step=0.15, speed=4)
                if a > 0:
                    d.text((420, 770), "20", fill=TEN_COL, font=F(56, bold=True))
                    d.text((510, 770), "+ 3", fill=ONE_COL, font=F(56, bold=True))
                if b > 0:
                    d.text((1170, 770), "40", fill=TEN_COL, font=F(56, bold=True))
                    d.text((1260, 770), "+ 5", fill=ONE_COL, font=F(56, bold=True))
                K.pill(d, cx - 130, 360, "tens", TEN_COL, size=30)
                K.pill(d, cx + 130, 360, "ones", ONE_COL, size=30)
            return True
        if focus == "tens":
            yb = 700
            K.shadow_card(d, (160, 260, 930, 840), brand, radius=32, outline=TEN_COL, outline_w=5)
            K.text_at(d, "Tens", 545, 280, F(44, bold=True), TEN_COL)
            for k in range(6):
                rod(330 + k * 70, yb, TEN_COL)
            a = K.stagger(progress, 0, step=0.1, speed=4)
            if a > 0:
                K.text_at(d, "20 + 40 = 60", 545, 730, F(60, bold=True), ink)
            K.shadow_card(d, (990, 260, 1760, 840), brand, radius=32, outline=ONE_COL, outline_w=5)
            K.text_at(d, "Ones", 1375, 280, F(44, bold=True), ONE_COL)
            b = K.stagger(progress, 3, step=0.15, speed=4)
            for k in range(8):
                r_, c_ = divmod(k, 4)
                xx = 1215 + c_ * 120
                yy = 460 + r_ * 120
                d.rounded_rectangle((xx - 40, yy - 40, xx + 40, yy + 40), radius=10, fill=ONE_COL,
                                    outline=K.DEV_DARK, width=3)
            if b > 0:
                K.text_at(d, "3 + 5 = 8", 1375, 730, F(60, bold=True), ink)
            return True
        # total
        yb = 700
        for k in range(6):
            rod(520 + k * 50, yb)
        ones(860, yb, 8)
        K.text_at(d, "60", 650, 730, F(56, bold=True), TEN_COL)
        K.text_at(d, "8", 895, 730, F(56, bold=True), ONE_COL)
        a = K.stagger(progress, 1, step=0.12, speed=4)
        if a > 0:
            K.shadow_card(d, (1100, 340 + int((1 - a) * 30), 1720, 640 + int((1 - a) * 30)), brand, radius=40,
                          outline=sage, outline_w=6)
            K.text_at(d, "60 + 8", 1410, 380 + int((1 - a) * 30), F(64, bold=True), muted)
            K.text_at(d, "= 68", 1410, 470 + int((1 - a) * 30), F(100, bold=True), sage)
            star_list([(1080, 300), (1760, 320), (1740, 700)])
        K.pill(d, 1410, 720, "2 small sums!", coral, size=36)
        return True

    # ---- 6 x 14 -----------------------------------------------------------------------
    if visual == "c19-times":
        sp, r = 54, 18
        split = focus in ("split", "parts", "total")
        gapw = 90 * (K.ease_in_out(K.clamp01(progress * 2.5)) if focus == "split" else 1.0) if split else 0
        total_w = 13 * sp + gapw
        x_start = cx - total_w / 2
        y_start = 450
        for rr in range(6):
            for cc in range(14):
                xx = x_start + cc * sp + (gapw if cc >= 10 else 0)
                yy = y_start + rr * sp
                col = (TEN_COL if cc < 10 else ONE_COL) if split else K.BOTH_COLOR
                d.ellipse((xx - r, yy - r, xx + r, yy + r), fill=col)
        left_mid = x_start + 4.5 * sp
        right_mid = x_start + 11.5 * sp + gapw
        if focus == "ask":
            K.text_at(d, "6 × 14 = ?", cx, 240 + lift, F(96, bold=True), ink)
            K.text_at(d, "6 rows", x_start - 130, y_start + 2.5 * sp - 20, F(38, bold=True), muted)
            K.text_at(d, "14 in each row", cx, 375, F(38, bold=True), muted)
            return True
        K.text_at(d, "6 × 14", cx, 236, F(80, bold=True), ink)
        for mid, n, col, x0c, x1c in ((left_mid, "10", TEN_COL, x_start - 10, x_start + 9 * sp + 10),
                                      (right_mid, "4", ONE_COL, x_start + 10 * sp + gapw - 10,
                                       x_start + 13 * sp + gapw + 10)):
            d.line((x0c, 410, x1c, 410), fill=col, width=6)
            d.line((x0c, 398, x0c, 422), fill=col, width=6)
            d.line((x1c, 398, x1c, 422), fill=col, width=6)
            K.pill(d, mid, 350, n, col, size=34)
        if focus in ("parts", "total"):
            a = K.stagger(progress, 0, step=0.1, speed=4) if focus == "parts" else 1.0
            b = K.stagger(progress, 3, step=0.15, speed=4) if focus == "parts" else 1.0
            if a > 0:
                K.text_at(d, "6 × 10 = 60", left_mid, 790, F(52, bold=True), TEN_COL)
            if b > 0:
                K.text_at(d, "6 × 4 = 24", right_mid + 40, 790, F(52, bold=True), ONE_COL)
        if focus == "total":
            c = K.stagger(progress, 1, step=0.12, speed=4)
            if c > 0:
                K.shadow_card(d, (1440, 440, 1800, 700), brand, radius=32, outline=sage, outline_w=6)
                K.text_at(d, "60 + 24", 1620, 470, F(50, bold=True), muted)
                K.text_at(d, "= 84", 1620, 550, F(84, bold=True), sage)
                star_list([(1460, 380), (1790, 760)])
        return True

    # ---- coders -----------------------------------------------------------------------
    if visual == "c19-code":
        if focus == "intro":
            inner = draw_screen(d, (780, 270, 1500, 720))
            draw_cricket(d, inner, t)
            d.rectangle((1110, 720, 1170, 790), fill=K.DEV_MID)
            d.rounded_rectangle((990, 780, 1290, 810), radius=12, fill=K.DEV_MID)
            d.ellipse((390 - 210, 560 - 210, 390 + 210, 560 + 210), fill=blue_soft)
            K.draw_person(d, 390, 500, 1.15, "friend", t)
            K.pill(d, 390, 780, "Cousin Arjun", K.ROAD, size=36)
            K.text_at(d, "{ }", 1700, 380, F(80, bold=True), K.BOTH_COLOR)
            K.text_at(d, "</>", 1700, 560, F(70, bold=True), coral)
            return True
        if focus == "parts":
            inner = draw_screen(d, (140, 260, 960, 820))
            n_show = [K.stagger(progress, i, step=0.15, speed=4) > 0.5 for i in range(4)]
            draw_cricket(d, inner, t, show=tuple(int(v) for v in n_show))
            labels = ["Draw the pitch", "Make the bat swing", "Move the ball", "Keep the score"]
            for i, lab in enumerate(labels):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 280 + i * 140 + int((1 - a) * 20)
                d.rounded_rectangle((1060, y, 1780, y + 110), radius=30, fill=panel, outline=palette[i], width=6)
                d.ellipse((1080, y + 18, 1154, y + 92), fill=palette[i])
                K.text_at(d, str(i + 1), 1117, y + 28, F(44, bold=True), WHITE)
                d.text((1180, y + 30), lab, fill=ink, font=F(44, bold=True))
            return True
        # algo
        labels = ["Pitch", "Bat", "Ball", "Score"]
        for i, lab in enumerate(labels):
            a = K.stagger(progress, i, step=0.1, speed=5)
            if a <= 0:
                continue
            y = 280 + i * 130
            x0 = 200 + int((1 - a) * -40)
            col = palette[i]
            d.rounded_rectangle((x0 + 6, y + 8, x0 + 560 + 6, y + 110 + 8), radius=20, fill=K.SHADOW)
            d.rounded_rectangle((x0, y, x0 + 560, y + 110), radius=20, fill=col)
            d.rounded_rectangle((x0 + 60, y + 100, x0 + 140, y + 124), radius=8, fill=col)
            d.text((x0 + 40, y + 26), f"{i + 1}. {lab} plan", fill=WHITE, font=F(46, bold=True))
        a = K.ease_out_cubic(K.clamp01((progress - 0.3) * 2.5))
        if a > 0:
            K.draw_arrow(d, 820, 520, 820 + 160 * a, 520, coral, width=14, head=40)
        b = K.stagger(progress, 4, step=0.1, speed=4)
        if b > 0:
            inner = draw_screen(d, (1060, 300, 1760, 720))
            draw_cricket(d, inner, t)
            K.draw_check(d, 1740, 320, 34, sage)
            K.pill(d, 1410, 770, "Algorithm = step by step plan", sage, size=34)
        return True

    # ---- odd one out ------------------------------------------------------------------
    if visual == "c19-odd":
        items = [("toys", "Pick up toys"), ("bed", "Make the bed"), ("kite", "Fly a kite"),
                 ("shelf", "Books on shelf")]
        if focus == "ask":
            K.text_at(d, "Big job: clean the room. Which is NOT a part?", cx, 226, F(46, bold=True), ink)
            n = 4
            cw, gap = 380, 56
            x_start = cx - (n * cw + (n - 1) * gap) / 2
            for i, (kind, lab) in enumerate(items):
                x0 = x_start + i * (cw + gap)
                step_card((x0, 310, x0 + cw, 760), "ABCD"[i], lab, kind, K.BOTH_COLOR, label_size=36)
            K.draw_stopwatch(d, cx, 820, 40, progress, brand)
            return True
        n = 4
        cw, gap = 380, 56
        x_start = cx - (n * cw + (n - 1) * gap) / 2
        for i, (kind, lab) in enumerate(items):
            x0 = x_start + i * (cw + gap)
            st = "bad" if i == 2 else ("win" if progress > 0.3 else "normal")
            dy = -20 * pulse if i == 2 else 0
            step_card((x0, 270 + dy, x0 + cw, 720 + dy), "ABCD"[i], lab, kind, K.BOTH_COLOR, st, label_size=36)
        a = K.stagger(progress, 3, step=0.12, speed=4)
        if a > 0:
            K.pill(d, cx, 770 + int((1 - a) * 20), "Every part must help the big job", sage, size=38)
        return True

    # ---- party order ------------------------------------------------------------------
    if visual == "c19-party":
        steps = [("snacks", "Buy snacks"), ("setup", "Set up & enjoy"), ("date", "Pick a date"),
                 ("guests", "Guest list")]
        ranks = [2, 3, 0, 1]
        if focus == "ask":
            reorder_row(steps, ranks, 0.0, 270, 750, 380, 56, letters=True, label_size=36)
            K.text_at(d, "What's the best order?", cx, 790, F(44, bold=True), coral)
            return True
        m = K.ease_in_out(K.clamp01((progress - 0.05) * 1.6))
        states = ["win" if m >= 1 and progress > 0.72 + 0.04 * r else "normal" for r in ranks]
        reorder_row(steps, ranks, m, 270, 750, 380, 56, states=states, label_size=36)
        if progress > 0.85:
            K.pill(d, cx, 790, "Plan → Shop → Party!", sage, size=38)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "c19-check":
        if focus == "intro":
            K.shadow_card(d, (420, 300 + lift, w - 420, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(d, "PRACTICE CHECK", cx, 380 + lift, F(40, bold=True), sage)
            K.text_at(d, "Just like the quiz!", cx, 460 + lift, F(64, bold=True), ink)
            draw_card(d, cx - 120, 620 + lift, 0.5, "front", t)
            K.draw_check(d, cx + 120, 620 + lift, 44, sage)
            return True
        if focus == "ask":
            x0, y0, x1, y1 = 140, 250, 980, 830
            d.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
            d.rounded_rectangle((x0, y0, x1, y1), radius=24, fill=(255, 250, 238))
            d.line((x0 + 80, y0 + 10, x0 + 80, y1 - 10), fill=(240, 170, 170), width=3)
            K.text_at(d, "Make a birthday card", (x0 + x1) / 2, y0 + 30, F(46, bold=True), coral)
            for i in range(4):
                yy = y0 + 140 + i * 110
                d.text((x0 + 110, yy), f"{i + 1}.", fill=ink, font=F(48, bold=True))
                K.draw_dashed(d, x0 + 190, yy + 52, x1 - 60, yy + 52, line, width=4)
            d.ellipse((1400 - 230, 540 - 230, 1400 + 230, 540 + 230), fill=coral_soft)
            draw_card(d, 1330, 520, 1.3, "front", t)
            K.draw_person(d, 1690, 470, 0.85, "nani", t)
            K.pill(d, 1690, 640, "Happy birthday!", K.PERSON_COLORS["nani"], size=28)
            qmarks([(1130, 300)], 90)
            K.pill(d, 1400, 790, "Pause & try on paper!", coral, size=36)
            return True
        card_row([("fold", "Fold the paper"), ("draw", "Draw on the front"), ("write", "Write a message"),
                  ("sign", "Sign & give it")], 290, 770, cw=380, gap=56, shown=0.15, label_size=36,
                 states=["win" if progress > 0.8 else "normal"] + ["normal"] * 3)
        return True

    # ---- recap ------------------------------------------------------------------------
    if visual == "c19-recap":
        recap = [("Big job → small jobs", coral, "split"), ("Put them in order", K.GOLD, "order"),
                 ("One job at a time", sage, "roti"), ("Algorithms & sums in parts", K.BOTH_COLOR, "sum")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(d, "Remember", cx, 222, F(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                d.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                    outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "split":
                    d.rounded_rectangle((ix - 150, iy - 50, ix - 50, iy + 50), radius=14, fill=K.STEEL_DARK)
                    K.draw_arrow(d, ix - 40, iy, ix + 10, iy, muted, width=8, head=20)
                    for k in range(4):
                        r_, c_ = divmod(k, 2)
                        bx, by = ix + 50 + c_ * 64, iy - 32 + r_ * 64
                        d.rounded_rectangle((bx - 26, by - 26, bx + 26, by + 26), radius=8, fill=palette[k])
                elif kind == "order":
                    for k in range(3):
                        tile(ix - 110 + k * 110, iy, str(k + 1), palette[k], 84)
                elif kind == "roti":
                    draw_roti(d, ix, iy, 110, 1.0)
                else:
                    K.text_at(d, "20 + 40", ix, iy - 110, F(40, bold=True), TEN_COL)
                    K.text_at(d, "3 + 5", ix, iy - 60, F(40, bold=True), ONE_COL)
                    for k in range(3):
                        d.rounded_rectangle((ix - 120, iy + 10 + k * 46, ix + 120, iy + 46 + k * 46), radius=10,
                                            fill=palette[k])
                font = F(34, bold=True)
                lines = K.wrap_text(lab, font, 350)
                for j, ln in enumerate(lines):
                    K.text_at(d, ln, x0 + 200, y0 + 390 + j * 42, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(d, int(cx - 300), 430, 110, sage, panel, bounce)
            K.draw_person(d, cx + 300, 420, 1.2, "kid", t)
            K.text_at(d, "Chapter 4 done!", cx, 692, F(68, bold=True), ink)
            K.pill(d, cx, 788, "Big job → small jobs", coral, size=36)
            star_list([(cx - 620, 330), (cx + 620, 330), (cx - 700, 560), (cx + 700, 560)])
            return True
        K.text_at(d, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        K.text_at(d, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(d, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
