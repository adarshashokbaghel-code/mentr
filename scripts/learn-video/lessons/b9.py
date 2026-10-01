"""B9 · Data — The Food AI Eats — visuals."""
import math

import build as K

BROWN = (176, 116, 66)
WHITE_DOG = (248, 244, 236)
BLACK_DOG = (74, 70, 68)
GOLDEN = (232, 176, 86)
GREY_DOG = (168, 168, 176)
SKY = (222, 238, 251)
GRASS = (176, 214, 140)
PLATE = (204, 210, 218)
PLATE_IN = (230, 233, 238)
RICE = (253, 251, 244)
GRAIN = (226, 218, 200)
DAL = (246, 192, 62)
SABZI = (98, 162, 72)
CURD = (252, 252, 248)
ROTI = (228, 184, 112)
ROTI_SPOT = (180, 124, 62)
SAMOSA = (226, 168, 76)
SAMOSA_DARK = (184, 124, 50)
TAJ = (250, 248, 244)
TAJ_LINE = (196, 192, 186)
BOW = (236, 84, 140)
FENCE = (214, 170, 120)
FENCE_DARK = (176, 128, 84)


def S_(s):
    return lambda v: v * s


def shade(col, f):
    return tuple(max(0, min(255, int(c * f))) for c in col)


def meera(draw, cx, cy, s, t=0.0):
    """Kid with a pink bow. cy = head centre; bust spans cy-72s .. cy+141s."""
    K.draw_person(draw, cx, cy, s, "kid", t)
    S = S_(s)
    y = cy + S(6) * math.sin(t * math.pi * 4)
    bx, by = cx - S(50), y - S(58)
    draw.polygon([(bx, by), (bx - S(30), by - S(18)), (bx - S(30), by + S(18))], fill=BOW)
    draw.polygon([(bx, by), (bx + S(30), by - S(18)), (bx + S(30), by + S(18))], fill=BOW)
    draw.ellipse((bx - S(9), by - S(9), bx + S(9), by + S(9)), fill=shade(BOW, 0.8))


def dog(draw, cx, by, s, col, t=0.0, d=1, spots=False, wag=True):
    """Side-view dog. by = feet line; head top ≈ by-240s; spans cx-150s .. cx+220s (d=1 faces right)."""
    S = S_(s)
    dark = shade(col, 0.8)

    def X(v):
        return cx + d * S(v)

    def R(ax, ay, bx, bh):
        xa, xb = X(ax), X(bx)
        ya, yb = by - S(ay), by - S(bh)
        return (min(xa, xb), min(ya, yb), max(xa, xb), max(ya, yb))

    def P(ax, ay):
        return (X(ax), by - S(ay))

    draw.ellipse((min(X(-140), X(150)), by - S(10), max(X(-140), X(150)), by + S(12)), fill=K.SHADOW)
    wg = math.sin(t * 40) * 14 if wag else 0
    draw.line([P(-100, 140), P(-138, 170 + wg * 0.5), P(-148, 212 + wg)], fill=col, width=max(3, int(S(18))),
              joint="curve")
    for lx in (-80, 60):
        draw.rounded_rectangle(R(lx - 14, 0, lx + 14, 92), radius=S(10), fill=dark)
    draw.rounded_rectangle(R(-122, 70, 112, 166), radius=S(46), fill=col)
    for lx in (-56, 86):
        draw.rounded_rectangle(R(lx - 15, 4, lx + 15, 96), radius=S(10), fill=col)
        draw.ellipse(R(lx - 19, -2, lx + 21, 16), fill=dark)
    if spots:
        for sx, sy, r in ((-64, 130, 22), (6, 108, 16), (58, 140, 18), (-20, 150, 12)):
            draw.ellipse(R(sx - r, sy - r * 0.8, sx + r, sy + r * 0.8), fill=K.DEV_DARK)
    hx, hy = 122, 186
    draw.ellipse(R(hx - 58, hy - 54, hx + 58, hy + 54), fill=col)
    draw.ellipse(R(hx + 18, hy - 40, hx + 96, hy + 8), fill=shade(col, 1.08))
    draw.ellipse(R(hx + 76, hy - 12, hx + 100, hy + 10), fill=K.DEV_DEEP)
    draw.ellipse(R(hx + 10, hy + 6, hx + 30, hy + 26), fill=K.DEV_DEEP)
    draw.polygon([P(hx - 34, hy + 42), P(hx + 4, hy + 50), P(hx - 22, hy - 28), P(hx - 50, hy - 18)], fill=dark)
    draw.line([P(hx + 56, hy - 30), P(hx + 82, hy - 34)], fill=K.DEV_DEEP, width=max(2, int(S(4))))


def photo(draw, cx, cy, s, sky=SKY, ground=GRASS):
    """Polaroid photo, 220s × 260s. Returns the inner picture box."""
    S = S_(s)
    w, h = S(110), S(130)
    draw.rectangle((cx - w + S(6), cy - h + S(8), cx + w + S(6), cy + h + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - w, cy - h, cx + w, cy + h), fill=(255, 255, 255), outline=(220, 212, 200),
                   width=max(1, int(S(3))))
    ib = (cx - w + S(12), cy - h + S(12), cx + w - S(12), cy + h - S(44))
    draw.rectangle(ib, fill=sky)
    if ground:
        draw.rectangle((ib[0], ib[3] - (ib[3] - ib[1]) * 0.3, ib[2], ib[3]), fill=ground)
    return ib


def dog_photo(draw, cx, cy, s, col, size=0.46, spots=False, t=0.0, d=1):
    ib = photo(draw, cx, cy, s)
    k = size * s
    dog(draw, (ib[0] + ib[2]) / 2 - d * 35 * k, ib[3] - 10 * s, k, col, t, d=d, spots=spots)


def bird(draw, cx, cy, s, kind, t=0.0):
    """Side-view bird facing right. cy = body centre; spans ≈ cx-120s..cx+110s, cy-90s..cy+86s."""
    S = S_(s)
    specs = {"parrot": ((64, 174, 84), (226, 62, 52), (40, 124, 64)),
             "crow": ((62, 64, 74), (96, 98, 108), (40, 42, 50)),
             "sparrow": ((170, 122, 78), (80, 66, 52), (118, 82, 50)),
             "pigeon": ((152, 160, 178), (84, 84, 94), (116, 96, 156)),
             "peacock": ((36, 96, 196), (96, 96, 100), (30, 140, 120))}
    body, beak, wing = specs[kind]
    bob = S(4) * math.sin(t * 12)
    y = cy + bob
    if kind == "peacock":
        fc = (cx - S(40), y - S(10))
        for k in range(9):
            a = math.radians(160 + k * 27.5)
            fx, fy = fc[0] + math.cos(a) * S(96), fc[1] + math.sin(a) * S(96)
            draw.line((fc[0], fc[1], fx, fy), fill=(40, 120, 70), width=max(2, int(S(10))))
            draw.ellipse((fx - S(22), fy - S(22), fx + S(22), fy + S(22)), fill=(48, 150, 90))
            draw.ellipse((fx - S(10), fy - S(10), fx + S(10), fy + S(10)), fill=K.GOLD)
            draw.ellipse((fx - S(5), fy - S(5), fx + S(5), fy + S(5)), fill=(30, 70, 160))
    else:
        draw.polygon([(cx - S(46), y + S(4)), (cx - S(122), y + S(34)), (cx - S(112), y + S(56)),
                      (cx - S(40), y + S(26))], fill=wing)
    for lx in (cx - S(12), cx + S(14)):
        draw.line((lx, y + S(40), lx, y + S(84)), fill=(226, 146, 62), width=max(2, int(S(6))))
        draw.line((lx, y + S(84), lx + S(14), y + S(86)), fill=(226, 146, 62), width=max(2, int(S(5))))
    draw.ellipse((cx - S(70), y - S(44), cx + S(52), y + S(50)), fill=body)
    draw.ellipse((cx - S(56), y - S(18), cx + S(24), y + S(34)), fill=wing)
    hx, hy = cx + S(50), y - S(50)
    if kind == "pigeon":
        draw.ellipse((cx + S(14), y - S(46), cx + S(66), y + S(4)), fill=(110, 96, 160))
    draw.ellipse((hx - S(36), hy - S(36), hx + S(36), hy + S(36)), fill=body)
    if kind == "peacock":
        for k in range(3):
            px = hx - S(14) + k * S(12)
            draw.line((px, hy - S(34), px - S(4), hy - S(60)), fill=body, width=max(1, int(S(3))))
            draw.ellipse((px - S(10), hy - S(70), px + S(2), hy - S(58)), fill=body)
    draw.ellipse((hx + S(2), hy - S(16), hx + S(22), hy + S(4)), fill=(255, 255, 255))
    draw.ellipse((hx + S(8), hy - S(10), hx + S(18), hy), fill=K.DEV_DEEP)
    if kind == "parrot":
        draw.polygon([(hx + S(28), hy - S(14)), (hx + S(58), hy + S(2)), (hx + S(44), hy + S(26)),
                      (hx + S(28), hy + S(14))], fill=beak)
    elif kind == "crow":
        draw.polygon([(hx + S(30), hy - S(8)), (hx + S(72), hy + S(6)), (hx + S(30), hy + S(14))], fill=beak)
    else:
        draw.polygon([(hx + S(30), hy - S(4)), (hx + S(52), hy + S(6)), (hx + S(30), hy + S(12))], fill=beak)


def cat(draw, cx, cy, s, col=(240, 160, 80)):
    S = S_(s)
    draw.ellipse((cx - S(52), cy + S(4), cx + S(52), cy + S(84)), fill=col)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * S(46), cy - S(30)), (cx + sx * S(40), cy - S(80)), (cx + sx * S(10), cy - S(50))],
                     fill=col)
    draw.ellipse((cx - S(50), cy - S(56), cx + S(50), cy + S(30)), fill=col)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(20) - S(7), cy - S(22), cx + sx * S(20) + S(7), cy - S(6)), fill=K.DEV_DEEP)
        for k in (-1, 1):
            draw.line((cx + sx * S(16), cy + S(6), cx + sx * S(58), cy + S(2) + k * S(8)), fill=K.DEV_DARK,
                      width=max(1, int(S(3))))
    draw.polygon([(cx - S(7), cy - S(2)), (cx + S(7), cy - S(2)), (cx, cy + S(6))], fill=(226, 90, 100))


def mango(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(48), cy - S(40), cx + S(52), cy + S(46)), fill=(252, 184, 52))
    draw.ellipse((cx + S(4), cy - S(30), cx + S(42), cy + S(10)), fill=(244, 120, 60))
    draw.line((cx - S(6), cy - S(40), cx - S(2), cy - S(56)), fill=(110, 80, 50), width=max(2, int(S(5))))
    draw.polygon([(cx - S(2), cy - S(52)), (cx + S(40), cy - S(70)), (cx + S(20), cy - S(44))], fill=K.LEAF)


def bus(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(84), cy - S(46), cx + S(84), cy + S(30)), radius=S(14), fill=(218, 68, 58))
    draw.rectangle((cx - S(84), cy + S(4), cx + S(84), cy + S(14)), fill=(250, 236, 200))
    for k in range(4):
        wx = cx - S(72) + k * S(38)
        draw.rounded_rectangle((wx, cy - S(36), wx + S(30), cy - S(8)), radius=S(5), fill=(214, 236, 250))
    for wx in (cx - S(48), cx + S(48)):
        draw.ellipse((wx - S(18), cy + S(16), wx + S(18), cy + S(52)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(7), cy + S(27), wx + S(7), cy + S(41)), fill=K.STEEL)


def apple(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(52), cy - S(44), cx + S(4), cy + S(50)), fill=(216, 50, 60))
    draw.ellipse((cx - S(4), cy - S(44), cx + S(52), cy + S(50)), fill=(216, 50, 60))
    draw.ellipse((cx - S(34), cy - S(28), cx - S(16), cy - S(6)), fill=(240, 120, 120))
    draw.line((cx, cy - S(40), cx + S(6), cy - S(64)), fill=(110, 80, 50), width=max(2, int(S(6))))
    draw.polygon([(cx + S(6), cy - S(58)), (cx + S(44), cy - S(72)), (cx + S(24), cy - S(46))], fill=K.LEAF)


def banana(draw, cx, cy, s):
    S = S_(s)
    draw.arc((cx - S(70), cy - S(110), cx + S(70), cy + S(30)), 30, 150, fill=(250, 210, 60), width=max(4, int(S(34))))
    draw.ellipse((cx + S(48), cy - S(24), cx + S(64), cy - S(8)), fill=(120, 90, 40))


def samosa(draw, cx, cy, s):
    S = S_(s)
    pts = [(cx, cy - S(90)), (cx + S(96), cy + S(60)), (cx - S(96), cy + S(60))]
    draw.polygon([(x + S(8), y + S(10)) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=SAMOSA, outline=SAMOSA_DARK, width=max(2, int(S(6))))
    draw.line((cx, cy - S(84), cx - S(10), cy + S(56)), fill=SAMOSA_DARK, width=max(2, int(S(4))))
    for k, (dx, dy) in enumerate(((-30, 20), (24, 10), (40, 40), (-50, 46), (6, -20))):
        draw.ellipse((cx + S(dx) - S(4), cy + S(dy) - S(4), cx + S(dx) + S(4), cy + S(dy) + S(4)), fill=SAMOSA_DARK)


def katori(draw, x, y, r, fill):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=K.STEEL_DARK)
    draw.ellipse((x - r * 0.86, y - r * 0.86, x + r * 0.86, y + r * 0.86), fill=fill)


def rice_pile(draw, x, y, r):
    for dx, dy, k in ((-0.4, 0.1, 0.62), (0.35, 0.15, 0.6), (0.0, -0.25, 0.66), (0.0, 0.3, 0.6)):
        rr = r * k
        draw.ellipse((x + dx * r - rr, y + dy * r - rr, x + dx * r + rr, y + dy * r + rr), fill=RICE)
    for k in range(14):
        a = k * 2.4
        d = r * (0.15 + 0.7 * ((k * 37) % 10) / 10)
        gx, gy = x + math.cos(a) * d, y + math.sin(a) * d * 0.9
        draw.line((gx - r * 0.06, gy, gx + r * 0.06, gy - r * 0.02), fill=GRAIN, width=max(1, int(r * 0.04)))


def roti(draw, x, y, r):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=ROTI, outline=ROTI_SPOT, width=max(1, int(r * 0.04)))
    for k in range(7):
        a = k * 2.1
        d = r * (0.2 + 0.1 * (k % 5))
        sx, sy = x + math.cos(a) * d, y + math.sin(a) * d
        draw.ellipse((sx - r * 0.07, sy - r * 0.05, sx + r * 0.07, sy + r * 0.05), fill=ROTI_SPOT)


def thali(draw, cx, cy, s, full=True, t=0.0):
    """Top-down steel plate, radius 230s."""
    R = 230 * s
    draw.ellipse((cx - R + 10 * s, cy - R + 14 * s, cx + R + 10 * s, cy + R + 14 * s), fill=K.SHADOW)
    draw.ellipse((cx - R, cy - R, cx + R, cy + R), fill=PLATE)
    draw.ellipse((cx - R * 0.88, cy - R * 0.88, cx + R * 0.88, cy + R * 0.88), fill=PLATE_IN)
    draw.arc((cx - R * 0.95, cy - R * 0.95, cx + R * 0.95, cy + R * 0.95), 200, 250, fill=(245, 247, 250),
             width=max(2, int(R * 0.03)))
    if not full:
        rice_pile(draw, cx, cy + R * 0.05, R * 0.5)
        return
    rice_pile(draw, cx - R * 0.12, cy + R * 0.34, R * 0.3)
    katori(draw, cx - R * 0.42, cy - R * 0.4, R * 0.24, DAL)
    katori(draw, cx + R * 0.05, cy - R * 0.55, R * 0.24, SABZI)
    for k in range(5):
        a = k * 1.3
        px, py = cx + R * 0.05 + math.cos(a) * R * 0.1, cy - R * 0.55 + math.sin(a) * R * 0.1
        draw.ellipse((px - R * 0.035, py - R * 0.035, px + R * 0.035, py + R * 0.035), fill=(70, 130, 50))
    katori(draw, cx + R * 0.48, cy - R * 0.3, R * 0.24, CURD)
    roti(draw, cx + R * 0.42, cy + R * 0.32, R * 0.28)
    draw.arc((cx - R * 0.86, cy - R * 0.1, cx - R * 0.34, cy + R * 0.42), 110, 230, fill=(250, 210, 60),
             width=max(3, int(R * 0.1)))


def ai_chip(draw, cx, cy, s, t=0.0):
    S = S_(s)
    hw = S(110)
    for k in range(5):
        off = -hw + S(30) + k * S(40)
        for (x0, y0, x1, y1) in ((cx + off - S(8), cy - hw - S(28), cx + off + S(8), cy - hw),
                                 (cx + off - S(8), cy + hw, cx + off + S(8), cy + hw + S(28)),
                                 (cx - hw - S(28), cy + off - S(8), cx - hw, cy + off + S(8)),
                                 (cx + hw, cy + off - S(8), cx + hw + S(28), cy + off + S(8))):
            draw.rectangle((x0, y0, x1, y1), fill=K.STEEL_DARK)
    draw.rounded_rectangle((cx - hw + S(8), cy - hw + S(10), cx + hw + S(8), cy + hw + S(10)), radius=S(26),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - hw, cy - hw, cx + hw, cy + hw), radius=S(26), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(78), cy - S(78), cx + S(78), cy + S(78)), radius=S(18), fill=K.DEV_DEEP)
    glow = K.LED_ON if int(t * 8) % 2 == 0 else (60, 190, 140)
    K.text_at(draw, "AI", cx, cy - S(48), K.load_font(max(12, int(S(84))), bold=True), glow)


def data_tile(draw, kind, x, y, s, brand):
    S = S_(s)
    hw = S(46)
    draw.rounded_rectangle((x - hw + S(4), y - hw + S(6), x + hw + S(4), y + hw + S(6)), radius=S(14), fill=K.SHADOW)
    draw.rounded_rectangle((x - hw, y - hw, x + hw, y + hw), radius=S(14), fill=(255, 255, 255),
                           outline=K.hex_rgb(brand["line"]), width=max(1, int(S(3))))
    if kind == "pic":
        draw.rectangle((x - S(32), y - S(30), x + S(32), y + S(30)), fill=SKY)
        draw.polygon([(x - S(32), y + S(30)), (x - S(6), y - S(6)), (x + S(14), y + S(30))], fill=K.LEAF)
        draw.polygon([(x - S(2), y + S(30)), (x + S(18), y + S(4)), (x + S(32), y + S(30))], fill=(50, 130, 80))
        draw.ellipse((x + S(10), y - S(24), x + S(26), y - S(8)), fill=K.CORAL)
    elif kind == "word":
        K.text_at(draw, "Aa", x, y - S(30), K.load_font(max(12, int(S(46))), bold=True), K.BOTH_COLOR)
    elif kind == "sound":
        K.draw_notes(draw, x - S(4), y - S(6), 0.62 * s, 0.0, color=K.hex_rgb(brand["sage"]))
    else:
        K.text_at(draw, "123", x, y - S(22), K.load_font(max(12, int(S(34))), bold=True), K.CORAL)


def tablet(draw, cx, cy, s):
    """Portrait tablet, 340s × 460s. Returns the screen box."""
    S = S_(s)
    w, h = S(170), S(230)
    draw.rounded_rectangle((cx - w + S(8), cy - h + S(10), cx + w + S(8), cy + h + S(10)), radius=S(30), fill=K.SHADOW)
    draw.rounded_rectangle((cx - w, cy - h, cx + w, cy + h), radius=S(30), fill=K.DEV_DARK)
    draw.ellipse((cx - S(6), cy - h + S(10), cx + S(6), cy - h + S(22)), fill=K.DEV_MID)
    sb = (cx - w + S(16), cy - h + S(32), cx + w - S(16), cy + h - S(32))
    draw.rectangle(sb, fill=(250, 252, 255))
    return sb


def spotter(draw, sb, s, coral, verdict=None):
    """Dog Spotter app chrome. Returns the viewfinder box."""
    x0, y0, x1, y1 = sb
    hh = 56 * s
    draw.rectangle((x0, y0, x1, y0 + hh), fill=coral)
    K.text_at(draw, "Dog Spotter", (x0 + x1) / 2, y0 + hh / 2 - 18 * s, K.load_font(max(26, int(32 * s)), bold=True),
              (255, 255, 255))
    vb = (x0 + 14 * s, y0 + hh + 14 * s, x1 - 14 * s, y1 - 92 * s)
    draw.rectangle(vb, fill=SKY)
    draw.rectangle((vb[0], vb[3] - (vb[3] - vb[1]) * 0.3, vb[2], vb[3]), fill=GRASS)
    cl = 26 * s
    for cxp, cyp, dx, dy in ((vb[0] + 8, vb[1] + 8, 1, 1), (vb[2] - 8, vb[1] + 8, -1, 1),
                             (vb[0] + 8, vb[3] - 8, 1, -1), (vb[2] - 8, vb[3] - 8, -1, -1)):
        draw.line((cxp, cyp, cxp + dx * cl, cyp), fill=(255, 255, 255), width=max(2, int(5 * s)))
        draw.line((cxp, cyp, cxp, cyp + dy * cl), fill=(255, 255, 255), width=max(2, int(5 * s)))
    if verdict:
        lab, col = verdict
        my = y1 - 46 * s
        f = K.load_font(max(26, int(34 * s)), bold=True)
        bb = draw.textbbox((0, 0), lab, font=f)
        tw = bb[2] - bb[0]
        draw.rounded_rectangle(((x0 + x1) / 2 - tw / 2 - 22, my - 28, (x0 + x1) / 2 + tw / 2 + 22, my + 28), radius=28,
                               fill=col)
        K.text_at(draw, lab, (x0 + x1) / 2, my - 20, f, (255, 255, 255))
    return vb


def book(draw, cx, cy, s, col):
    S = S_(s)
    draw.polygon([(cx, cy - S(50)), (cx - S(110), cy - S(70)), (cx - S(110), cy + S(60)), (cx, cy + S(80))],
                 fill=(255, 255, 255), outline=K.DEV_DARK)
    draw.polygon([(cx, cy - S(50)), (cx + S(110), cy - S(70)), (cx + S(110), cy + S(60)), (cx, cy + S(80))],
                 fill=(255, 255, 255), outline=K.DEV_DARK)
    draw.line((cx, cy - S(50), cx, cy + S(80)), fill=col, width=max(2, int(S(6))))
    for k in range(4):
        yy = cy - S(36) + k * S(26)
        draw.line((cx - S(92), yy - S(10), cx - S(18), yy), fill=K.STEEL_DARK, width=max(2, int(S(5))))
        draw.line((cx + S(18), yy, cx + S(92), yy - S(10)), fill=K.STEEL_DARK, width=max(2, int(S(5))))


def shoe(draw, cx, cy, s, col):
    S = S_(s)
    pts = [(cx - S(100), cy + S(20)), (cx - S(96), cy - S(46)), (cx - S(40), cy - S(50)), (cx - S(10), cy - S(10)),
           (cx + S(80), cy + S(2)), (cx + S(104), cy + S(22))]
    draw.polygon([(x + S(6), y + S(8)) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=col)
    draw.rounded_rectangle((cx - S(104), cy + S(16), cx + S(108), cy + S(40)), radius=S(10), fill=(255, 255, 255),
                           outline=K.DEV_DARK, width=max(1, int(S(3))))
    for k in range(3):
        lx = cx - S(60) + k * S(18)
        draw.line((lx, cy - S(40) + k * S(8), lx + S(16), cy - S(30) + k * S(8)), fill=(255, 255, 255),
                  width=max(2, int(S(5))))


def tree(draw, cx, by, s):
    S = S_(s)
    draw.rectangle((cx - S(16), by - S(110), cx + S(16), by), fill=(140, 96, 60))
    for dx, dy, r in ((-40, 150, 52), (40, 150, 52), (0, 196, 60), (0, 120, 50)):
        draw.ellipse((cx + S(dx) - S(r), by - S(dy) - S(r), cx + S(dx) + S(r), by - S(dy) + S(r)), fill=K.LEAF)
    draw.ellipse((cx - S(30), by - S(230), cx + S(4), by - S(200)), fill=(110, 186, 120))


def taj(draw, cx, by, s):
    S = S_(s)
    ow = max(1, int(S(4)))
    draw.rectangle((cx - S(170), by - S(28), cx + S(170), by), fill=TAJ, outline=TAJ_LINE, width=ow)
    for sx in (-1, 1):
        mx = cx + sx * S(150)
        draw.rectangle((mx - S(9), by - S(220), mx + S(9), by - S(28)), fill=TAJ, outline=TAJ_LINE, width=ow)
        draw.ellipse((mx - S(14), by - S(240), mx + S(14), by - S(212)), fill=TAJ, outline=TAJ_LINE, width=ow)
    draw.rectangle((cx - S(104), by - S(150), cx + S(104), by - S(28)), fill=TAJ, outline=TAJ_LINE, width=ow)
    draw.rounded_rectangle((cx - S(30), by - S(124), cx + S(30), by - S(28)), radius=S(28), fill=(206, 216, 232))
    for sx in (-1, 1):
        dx = cx + sx * S(72)
        draw.rounded_rectangle((dx - S(14), by - S(110), dx + S(14), by - S(60)), radius=S(14), fill=(206, 216, 232))
        draw.ellipse((dx - S(22), by - S(190), dx + S(22), by - S(146)), fill=TAJ, outline=TAJ_LINE, width=ow)
    draw.ellipse((cx - S(72), by - S(276), cx + S(72), by - S(136)), fill=TAJ, outline=TAJ_LINE, width=ow)
    draw.rectangle((cx - S(60), by - S(156), cx + S(60), by - S(146)), fill=TAJ)
    draw.line((cx, by - S(276), cx, by - S(308)), fill=K.GOLD, width=max(2, int(S(5))))
    draw.ellipse((cx - S(6), by - S(318), cx + S(6), by - S(306)), fill=K.GOLD)


def phone(draw, cx, cy, s, coral, digits=True, app=False):
    S = S_(s)
    w, h = S(90), S(160)
    draw.rounded_rectangle((cx - w + S(6), cy - h + S(8), cx + w + S(6), cy + h + S(8)), radius=S(24), fill=K.SHADOW)
    draw.rounded_rectangle((cx - w, cy - h, cx + w, cy + h), radius=S(24), fill=K.DEV_DARK)
    sb = (cx - w + S(10), cy - h + S(26), cx + w - S(10), cy + h - S(26))
    draw.rectangle(sb, fill=K.DEV_SCREEN)
    draw.rounded_rectangle((cx - S(22), cy - h + S(10), cx + S(22), cy - h + S(16)), radius=S(3), fill=K.DEV_MID)
    if digits:
        f = K.load_font(max(26, int(S(34))), bold=True)
        K.text_at(draw, "98765", cx, cy - S(50), f, K.DEV_DEEP)
        K.text_at(draw, "43210", cx, cy - S(6), f, K.DEV_DEEP)
        draw.ellipse((cx - S(26), cy + S(60), cx + S(26), cy + S(112)), fill=(13, 148, 136))
        draw.arc((cx - S(12), cy + S(72), cx + S(12), cy + S(100)), 120, 300, fill=(255, 255, 255),
                 width=max(2, int(S(6))))
    if app:
        draw.rounded_rectangle((cx - S(50), cy - S(80), cx + S(50), cy + S(20)), radius=S(22), fill=coral)
        K.draw_magnifier(draw, cx - S(6), cy - S(36), 0.3 * s, (255, 255, 255))
    return sb


def family_photo(draw, cx, cy, s):
    ib = photo(draw, cx, cy, s, sky=(252, 236, 220), ground=(240, 210, 190))
    mx = (ib[0] + ib[2]) / 2
    for dx, r, col in ((-0.3, 22, K.ROAD), (0.3, 22, K.BOTH_COLOR), (0.0, 16, K.CORAL)):
        x = mx + dx * (ib[2] - ib[0])
        y = ib[3] - (ib[3] - ib[1]) * 0.42 + (12 * s if r < 20 else 0)
        draw.chord((x - r * 1.6 * s, y + r * 0.8 * s, x + r * 1.6 * s, y + r * 4.2 * s), 180, 360, fill=col)
        K.draw_face(draw, x, y, r * s, "kid", 0.6)
    K.draw_heart(draw, ib[2] - 22 * s, ib[1] + 24 * s, 12 * s, K.CORAL)


def fence(draw, x0, x1, top, bot):
    draw.rectangle((x0, top + 40, x1, top + 64), fill=FENCE_DARK)
    draw.rectangle((x0, bot - 70, x1, bot - 46), fill=FENCE_DARK)
    for x in range(int(x0), int(x1), 70):
        draw.polygon([(x, top + 20), (x + 25, top), (x + 50, top + 20), (x + 50, bot), (x, bot)], fill=FENCE)


VARIED = [(BROWN, False, 0.5), (WHITE_DOG, False, 0.36), (BLACK_DOG, False, 0.46), (WHITE_DOG, True, 0.44),
          (GOLDEN, False, 0.5), (GREY_DOG, False, 0.4), (BROWN, False, 0.34), (WHITE_DOG, False, 0.52)]


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

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def plate_of_data(x, y, s):
        thali(draw, x, y, s, full=False)
        R = 230 * s
        for k, kind in enumerate(("pic", "word", "sound", "num")):
            a = k * math.pi / 2 + math.pi / 4
            data_tile(draw, kind, x + math.cos(a) * R * 0.46, y + math.sin(a) * R * 0.46, s * 1.05, brand)

    def notepad(box):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=24, fill=(255, 250, 238))

    # ---- opening -----------------------------------------------------------
    if visual == "b9-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            plate_of_data(cx + 300, 470, 0.68)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · SHOW AND TELL", cx, 326 + lift, font(34, bold=True), sage)
            cards = [("apple", "apple", True), ("parrot", "bird", True), ("banana", "bus", False)]
            for i, (kind, lab, ok) in enumerate(cards):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 500 + int((1 - a) * 40) + lift
                ib = photo(draw, x, y, 0.72)
                mx, my = (ib[0] + ib[2]) / 2, (ib[1] + ib[3]) / 2
                if kind == "apple":
                    apple(draw, mx, my + 10, 0.85)
                elif kind == "parrot":
                    bird(draw, mx, my + 4, 0.45, "parrot", t)
                else:
                    banana(draw, mx, my + 30, 0.9)
                bx = K.pill(draw, x - 24, 628 + int((1 - a) * 40) + lift, f"“{lab}”", sage if ok else K.DANGER, size=32)
                mk = K.draw_check if ok else K.draw_cross
                mk(draw, bx[2] + 30, (bx[1] + bx[3]) / 2, 22, sage if ok else K.DANGER)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 730 + int((1 - a) * 20) + lift, "Labels must be right!", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Data — The Food AI Eats", cx, 360 + lift, font(84, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                plate_of_data(cx, 708 + yy, 0.62)
                ai_chip(draw, cx + 470, 700 + yy, 0.62, t)
                K.draw_arrow(draw, cx + 175, 700 + yy, cx + 360, 700 + yy, muted, width=10, head=28)
                K.draw_mascot(draw, int(cx - 440), 700 + yy, 80, sage, panel, bounce)
            return True
        # hook
        samosa(draw, cx - 300, 560, 1.4)
        ai_chip(draw, cx + 300, 540, 1.1, t)
        K.text_at(draw, "Yum?", cx, 470, font(56, bold=True), muted)
        question_marks([(cx - 700, 330), (cx + 700, 360), (cx, 300)])
        a = K.stagger(progress, 3, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, cx, 760 + int((1 - a) * 20), "What does AI really eat?", K.BOTH_COLOR, size=40)
        return True

    # ---- Meera's Dog Spotter -------------------------------------------------
    if visual == "b9-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=blue_soft)
            meera(draw, 470, 470, 1.25, t)
            dog(draw, 640, 800, 0.62, BROWN, t)
            K.text_at(draw, "Meet", 1320, 300 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Meera!", 1320, 370 + lift, font(130, bold=True), coral)
            K.pill(draw, 1320, 580, "loves dogs", sage, size=38)
            K.text_at(draw, "and her puppy, Bruno", 1320, 690, font(44, bold=True), ink)
            star_spots([(1010, 330), (1640, 330), (1030, 600), (1610, 600)])
            return True
        if focus == "train":
            for k in range(3):
                dog_photo(draw, 360 + k * 14, 520 - k * 14, 0.95, BROWN, size=0.38, t=t)
            K.pill(draw, 0, 700, "“dog”", sage, size=32, left=290)
            cyc = (t * 3) % 1
            fx = K.lerp(420, 840, K.ease_in_out(cyc))
            fs = K.lerp(0.8, 0.4, cyc)
            sb = tablet(draw, 1010, 560, 1.0)
            vb = spotter(draw, sb, 1.0, coral)
            dog(draw, (vb[0] + vb[2]) / 2 - 18, vb[3] - 14, 0.5, BROWN, t)
            x0, y0, x1, y1 = sb
            bar = (x0 + 24, y1 - 62, x1 - 24, y1 - 34)
            draw.rounded_rectangle(bar, radius=14, fill=line)
            draw.rounded_rectangle((bar[0], bar[1], bar[0] + (bar[2] - bar[0]) * K.clamp01(0.15 + progress * 0.85),
                                    bar[3]), radius=14, fill=sage)
            if cyc < 0.92:
                dog_photo(draw, fx, 520 - 60 * math.sin(cyc * math.pi), fs, BROWN, size=0.38, t=t)
            K.text_at(draw, "500", 1530, 330 + lift, font(130, bold=True), coral)
            K.text_at(draw, "photos of Bruno", 1530, 480 + lift, font(42, bold=True), ink)
            K.text_at(draw, "all labelled “dog”", 1530, 540 + lift, font(38, bold=True), muted)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                K.pill(draw, 1530, 650 + int((1 - a) * 20), "Small · brown · Bruno", BROWN, size=32)
            return True
        if focus in ("moti", "why"):
            if focus == "moti":
                fence(draw, 1180, 1820, 470, 780)
                mx = K.lerp(1780, 1460, K.ease_out_cubic(K.clamp01(progress * 1.6)))
                dog(draw, mx, 830, 0.95, WHITE_DOG, t, d=-1)
                meera(draw, 280, 480, 1.1, t)
                tx, ty, ts = 640, 540, 0.78
            else:
                draw.ellipse((cx + 330 - 300, 600 - 260, cx + 330 + 300, 600 + 260), fill=lav_soft)
                dog(draw, cx + 360, 800, 0.95, WHITE_DOG, t, d=-1)
                tx, ty, ts = cx - 330, 560, 0.85
            sb = tablet(draw, tx, ty, ts)
            say = focus == "why" or progress > 0.55
            vb = spotter(draw, sb, ts, coral, verdict=("Not a dog!", K.DANGER) if say else None)
            dog(draw, (vb[0] + vb[2]) / 2 + 30 * ts, vb[3] - 12, 0.42 * ts, WHITE_DOG, t, d=-1)
            if focus == "moti":
                if say:
                    K.draw_cross(draw, tx + 150, ty - 210, 34, K.DANGER)
                K.pill(draw, mx - 60, 500, "Moti", K.BOTH_COLOR, size=38)
            else:
                K.text_at(draw, "Why did the app get it wrong?", cx, 226, font(50, bold=True), ink)
                question_marks([(cx - 760, 360), (cx + 760, 380), (cx + 120, 330)])
                K.draw_stopwatch(draw, cx + 700, 760, 50, progress, brand)
            return True
        # later
        meera(draw, 460, 520, 1.2, t)
        K.draw_bubble(draw, (600, 240, 1000, 380), brand, "Hmm… why?", tail="left", size=44)
        K.text_at(draw, "One important word…", 1390, 330 + lift, font(48, bold=True), muted)
        for i in range(4):
            a = K.stagger(progress, i + 1, step=0.1, speed=5)
            if a <= 0:
                continue
            x = 1390 + (i - 1.5) * 170
            y = 440 + int((1 - a) * 30)
            draw.rounded_rectangle((x - 70, y, x + 70, y + 170), radius=28, fill=panel, outline=line, width=4)
            K.text_at(draw, "?", x, y + 36, font(90, bold=True), [coral, K.BOTH_COLOR, sage, K.GOLD][i])
        K.pill(draw, 460, 760, "Hold that thought!", sage, size=36)
        return True

    # ---- what data is -----------------------------------------------------------
    if visual == "b9-define":
        if focus == "name":
            K.text_at(draw, "DATA", cx, 236 + lift, font(130, bold=True), coral)
            K.text_at(draw, "= information AI learns from", cx, 400 + lift, font(52, bold=True), ink)
            kinds = [("pic", "Pictures", coral_soft), ("word", "Words", lav_soft), ("sound", "Sounds", sage_soft),
                     ("num", "Numbers", K.hex_rgb("#FFF4DA"))]
            for i, (kind, lab, soft) in enumerate(kinds):
                a = K.stagger(progress, i + 1, step=0.14, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 340
                y = 620 + int((1 - a) * 40)
                draw.ellipse((x - 110, y - 110, x + 110, y + 110), fill=soft)
                data_tile(draw, kind, x, y, 1.5, brand)
                K.text_at(draw, lab, x, y + 124, font(38, bold=True), ink)
            return True
        if focus == "food":
            draw.rounded_rectangle((140, 250, 900, 860), radius=40, fill=coral_soft, outline=coral, width=4)
            draw.rounded_rectangle((1020, 250, 1780, 860), radius=40, fill=sage_soft, outline=sage, width=4)
            meera(draw, 360, 450, 1.0, t)
            thali(draw, 660, 560, 0.5, t=t)
            K.text_at(draw, "Food", 520, 720, font(44, bold=True), coral)
            K.text_at(draw, "→ you grow strong", 520, 780, font(36, bold=True), ink)
            ai_chip(draw, 1500, 500, 0.9, t)
            for k, kind in enumerate(("pic", "word", "sound", "num")):
                c = (t * 1.6 + k / 4) % 1
                x = K.lerp(1120, 1370, K.ease_in_out(c))
                y = 330 + k * 80 + (500 - (330 + k * 80)) * K.ease_in_out(c)
                if c < 0.9:
                    data_tile(draw, kind, x, y, 0.75 * (1 - 0.4 * c), brand)
            K.text_at(draw, "Data", 1400, 720, font(44, bold=True), sage)
            K.text_at(draw, "→ AI learns", 1400, 780, font(36, bold=True), ink)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                draw.ellipse((cx - 60, 500, cx + 60, 620), fill=panel, outline=line, width=4)
                K.text_at(draw, "=", cx, 516, font(80, bold=True), K.BOTH_COLOR)
            return True
        # dataset
        draw.rounded_rectangle((300 + 10, 300 + 12, 1300 + 10, 850 + 12), radius=30, fill=K.SHADOW)
        draw.rounded_rectangle((300, 262, 560, 330), radius=20, fill=K.GOLD)
        draw.rounded_rectangle((300, 300, 1300, 850), radius=30, fill=(255, 226, 150))
        for i in range(18):
            a = K.stagger(progress, i, step=0.03, speed=6)
            if a <= 0:
                continue
            r, c = divmod(i, 6)
            x = 400 + c * 160
            y = 410 + r * 170 - int((1 - a) * 30)
            col, spots, size = VARIED[(i * 5) % len(VARIED)]
            dog_photo(draw, x, y, 0.58, col, size=size, spots=spots, t=t)
        K.text_at(draw, "DATASET", 1560, 330 + lift, font(76, bold=True), coral)
        K.text_at(draw, "a big collection", 1560, 450 + lift, font(40, bold=True), ink)
        K.text_at(draw, "of data", 1560, 500 + lift, font(40, bold=True), ink)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1560, 620 + int((1 - a) * 20), "1,000 dog photos", sage, size=34)
            K.draw_magnifier(draw, 1560, 790, 0.5, coral)
        return True

    # ---- AI's menu ----------------------------------------------------------------
    if visual == "b9-kinds":
        if focus == "notdata":
            draw.rounded_rectangle((140, 250, 900, 860), radius=40, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            draw.rounded_rectangle((1020, 250, 1780, 860), radius=40, fill=sage_soft, outline=sage, width=4)
            K.text_at(draw, "Real things", 520, 280, font(50, bold=True), K.DANGER)
            K.draw_glass(draw, 370, 680, 1.4, 0.7)
            shoe(draw, 650, 620, 1.2, K.ROAD)
            bx = K.pill(draw, 490, 750, "Not data", K.DANGER, size=36)
            K.draw_cross(draw, bx[2] + 34, (bx[1] + bx[3]) / 2, 26, K.DANGER)
            K.text_at(draw, "A photo of shoes", 1400, 280, font(50, bold=True), sage)
            a = K.stagger(progress, 1, step=0.25, speed=4)
            if a > 0:
                ib = photo(draw, 1400, 520 + int((1 - a) * 30), 1.15)
                shoe(draw, (ib[0] + ib[2]) / 2, (ib[1] + ib[3]) / 2 + 20, 0.9, K.ROAD)
                bx = K.pill(draw, 1370, 750, "Data!", sage, size=36)
                K.draw_check(draw, bx[2] + 34, (bx[1] + bx[3]) / 2, 26, sage)
            return True
        n = {"pictures": 1, "words": 2, "sounds": 3}[focus]
        K.pill(draw, cx, 222, "AI's menu", coral, size=32)
        cols = [("Pictures", coral, ("cats · mangoes", "buses")), ("Words", K.BOTH_COLOR, ("stories · messages", "questions")),
                ("Sounds", sage, ("voices · songs", "dogs barking"))]
        for i, (title, col, sub) in enumerate(cols):
            x0 = 140 + i * 560
            bx = (x0, 300, x0 + 520, 860)
            mx = x0 + 260
            if i >= n:
                draw.rounded_rectangle(bx, radius=36, fill=(246, 241, 233), outline=line, width=3)
                K.text_at(draw, "?", mx, 480, font(130, bold=True), line)
                continue
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 300 + yy, x0 + 520, 860 + yy), brand, radius=36, outline=col if active else line,
                          outline_w=6 if active else 3)
            K.text_at(draw, title, mx, 330 + yy, font(56, bold=True), col)
            iy = 540 + yy
            if i == 0:
                for k, kind in enumerate(("cat", "mango", "bus")):
                    px = mx + (k - 1) * 158
                    ib = photo(draw, px, iy, 0.64)
                    pmx, pmy = (ib[0] + ib[2]) / 2, (ib[1] + ib[3]) / 2
                    if kind == "cat":
                        cat(draw, pmx, pmy - 4, 0.62)
                    elif kind == "mango":
                        mango(draw, pmx, pmy + 4, 0.8)
                    else:
                        bus(draw, pmx, pmy - 4, 0.66)
            elif i == 1:
                book(draw, mx - 90, iy + 10, 0.85, col)
                draw.rounded_rectangle((mx + 50, iy - 110, mx + 220, iy - 30), radius=28, fill=lav_soft, outline=col,
                                       width=4)
                K.text_at(draw, "Hi!", mx + 135, iy - 96, font(40, bold=True), col)
                draw.rounded_rectangle((mx + 70, iy + 20, mx + 220, iy + 100), radius=28, fill=coral_soft,
                                       outline=coral, width=4)
                K.text_at(draw, "Why?", mx + 145, iy + 34, font(38, bold=True), coral)
            else:
                K.draw_device(draw, "mic", mx - 120, iy, 0.8, brand, t=t)
                K.sound_waves(draw, mx - 70, iy - 40, 0.9, col, t)
                K.draw_notes(draw, mx + 120, iy - 70, 0.9, t, color=K.BOTH_COLOR)
                K.text_at(draw, "Woof!", mx + 120, iy + 30, font(48, bold=True), coral)
            label_lines(sub, mx, 730 + yy, size=34, col=muted)
        return True

    # ---- thali & variety -------------------------------------------------------------
    if visual == "b9-variety":
        if focus == "rice":
            K.text_at(draw, "Only rice?", cx, 222 + lift, font(64, bold=True), ink)
            for i, lab in enumerate(("Breakfast", "Lunch", "Dinner")):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                y = 540 + int((1 - a) * 40)
                thali(draw, x, y, 0.64, full=False)
                K.text_at(draw, lab, x, y + 170, font(40, bold=True), muted)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 790 + int((1 - a) * 20), "Every single day?!", coral, size=36)
            return True
        if focus == "thali":
            meera(draw, 300, 470, 1.05, t)
            K.draw_heart(draw, 420, 330 + bounce, 30, coral)
            tcx, tcy, ts = 860, 560, 1.12
            thali(draw, tcx, tcy, ts, t=t)
            R = 230 * ts
            items = [("Dal", DAL, (-0.42, -0.4)), ("Sabzi", SABZI, (0.05, -0.55)), ("Curd", (180, 186, 196), (0.48, -0.3)),
                     ("Roti", ROTI_SPOT, (0.42, 0.32)), ("Fruit", K.GOLD, (-0.62, 0.12))]
            for i, (lab, col, (ox, oy)) in enumerate(items):
                a = K.stagger(progress, i, step=0.13, speed=5)
                if a <= 0:
                    continue
                ly = 300 + i * 116
                lx = 1420
                px, py = tcx + ox * R, tcy + oy * R
                K.draw_dashed(draw, px, py, lx - 40, ly + 36, muted, width=4, dash=14, gap=10)
                draw.ellipse((px - 10, py - 10, px + 10, py + 10), fill=ink)
                draw.rounded_rectangle((lx - 40, ly, lx + 260, ly + 72), radius=36, fill=panel, outline=col, width=5)
                draw.ellipse((lx - 22, ly + 18, lx + 14, ly + 54), fill=col)
                draw.text((lx + 34, ly + 14), lab, fill=ink, font=font(40, bold=True))
            return True
        # variety
        K.text_at(draw, "VARIETY", cx, 226 + lift, font(104, bold=True), coral)
        K.text_at(draw, "= many different kinds", cx, 360 + lift, font(46, bold=True), ink)
        rows = [("One kind", [RICE] * 5, False), ("Many kinds", [RICE, DAL, SABZI, CURD, ROTI], True)]
        for r, (lab, fills, ok) in enumerate(rows):
            a = K.stagger(progress, r + 1, step=0.25, speed=4)
            if a <= 0:
                continue
            y = 530 + r * 200 + int((1 - a) * 30)
            draw.rounded_rectangle((180, y - 80, 1740, y + 80), radius=80, fill=sage_soft if ok else K.DANGER_SOFT)
            K.text_at(draw, lab, 380, y - 24, font(42, bold=True), sage if ok else K.DANGER)
            for k, fl in enumerate(fills):
                x = 650 + k * 180
                if fl == RICE:
                    katori(draw, x, y, 62, PLATE_IN)
                    rice_pile(draw, x, y, 40)
                elif fl == ROTI:
                    roti(draw, x, y, 58)
                else:
                    katori(draw, x, y, 62, fl)
            (K.draw_check if ok else K.draw_cross)(draw, 1620, y, 44, sage if ok else K.DANGER)
        return True

    # ---- back to Meera ----------------------------------------------------------------
    if visual == "b9-fix":
        if focus == "remember":
            sb = tablet(draw, 460, 560, 1.0)
            x0, y0, x1, y1 = sb
            draw.rectangle((x0, y0, x1, y0 + 56), fill=coral)
            K.text_at(draw, "Dog Spotter", (x0 + x1) / 2, y0 + 10, font(32, bold=True), (255, 255, 255))
            for i in range(9):
                r, c = divmod(i, 3)
                px = x0 + 54 + c * 100
                py = y0 + 106 + r * 100
                draw.rectangle((px - 46, py - 48, px + 46, py + 48), fill=SKY)
                draw.rectangle((px - 46, py + 18, px + 46, py + 48), fill=GRASS)
                dog(draw, px - 8, py + 40, 0.24, BROWN, t)
            K.text_at(draw, "only Bruno", (x0 + x1) / 2, y1 - 46, font(32, bold=True), muted)
            K.draw_arrow(draw, 680, 560, 880, 560, muted, width=12, head=34)
            a = K.stagger(progress, 1, step=0.3, speed=3)
            if a > 0:
                K.shadow_card(draw, (920, 280 + int((1 - a) * 30), 1780, 840 + int((1 - a) * 30)), brand, radius=40,
                              accent=coral)
                yy = int((1 - a) * 30)
                K.text_at(draw, "What it learned:", 1350, 356 + yy, font(42, bold=True), muted)
                K.text_at(draw, "dog = small + brown", 1350, 430 + yy, font(66, bold=True), coral)
                dog(draw, 1330, 790 + yy, 0.9, BROWN, t)
            return True
        if focus == "moti":
            K.shadow_card(draw, (140, 280, 840, 840), brand, radius=40, accent=coral)
            K.text_at(draw, "It thinks a dog is…", 490, 350, font(40, bold=True), muted)
            for k, lab in enumerate(("small", "brown")):
                K.pill(draw, 370 + k * 240, 420, lab, BROWN, size=36)
            dog(draw, 460, 780, 0.8, BROWN, t)
            K.draw_cross(draw, cx, 560, 50, K.DANGER)
            draw.ellipse((1380 - 320, 600 - 280, 1380 + 320, 600 + 280), fill=lav_soft)
            dog(draw, 1420, 820, 1.1, WHITE_DOG, t, d=-1)
            for k, lab in enumerate(("big", "white")):
                K.pill(draw, 1250 + k * 240, 300, lab, K.BOTH_COLOR, size=36)
            question_marks([(1100, 450), (1720, 420)])
            return True
        if focus == "fix":
            K.pill(draw, cx, 222, "Meera adds variety!", sage, size=34)
            for i, (col, spots, size) in enumerate(VARIED):
                a = K.stagger(progress, i, step=0.08, speed=5)
                if a <= 0:
                    continue
                r, c = divmod(i, 4)
                x = cx + (c - 1.5) * 300
                y = 430 + r * 270 - int((1 - a) * 30)
                dog_photo(draw, x, y, 1.0, col, size=size, spots=spots, t=t, d=1 if (i % 3) else -1)
            return True
        # works
        meera(draw, 190, 470, 0.95, t)
        sb = tablet(draw, 470, 540, 0.8)
        vb = spotter(draw, sb, 0.8, coral, verdict=("Dog!", sage) if progress > 0.15 else None)
        dog(draw, (vb[0] + vb[2]) / 2 + 24, vb[3] - 12, 0.34, WHITE_DOG, t, d=-1)
        draw.ellipse((1140 - 300, 620 - 240, 1140 + 300, 620 + 240), fill=sage_soft)
        mx, mb = 1120, 820
        dog(draw, mx, mb, 1.0, WHITE_DOG, t, d=-1)
        feats = [("wet nose", (mx - 212, mb - 186), (720, 300), (820, 364)),
                 ("a tail", (mx + 148, mb - 212), (1360, 360), (1360, 394)),
                 ("furry body", (mx + 10, mb - 118), (1420, 530), (1420, 564)),
                 ("4 legs", (mx - 56, mb - 50), (1420, 700), (1420, 734))]
        for i, (lab, (px, py), (lx, ly), (ex, ey)) in enumerate(feats):
            a = K.stagger(progress, i + 1, step=0.12, speed=5)
            if a <= 0:
                continue
            K.draw_dashed(draw, px, py, ex, ey, muted, width=4, dash=14, gap=10)
            draw.ellipse((px - 9, py - 9, px + 9, py + 9), fill=ink)
            K.pill(draw, 0, ly, lab, sage, size=34, left=lx)
        if progress > 0.6:
            star_spots([(1660, 300), (1780, 430)])
        return True

    # ---- pick the dataset -----------------------------------------------------------
    if visual == "b9-pick":
        ans = focus == "answer"
        specs = [("A", ("500 photos", "only brown puppies"), "brown"), ("B", ("1 photo", "of a dog"), "one"),
                 ("C", ("500 photos", "many kinds of dogs"), "varied")]
        cw, gap = 500, 50
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, (letter, lab, kind) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            win = ans and kind == "varied"
            bad = ans and not win
            col = sage if win else K.DANGER if bad else line
            K.shadow_card(draw, (x0, 290, x0 + cw, 850), brand, radius=32, outline=col, outline_w=6 if ans else 3)
            if win:
                draw.rounded_rectangle((x0 + 6, 296, x0 + cw - 6, 844), radius=28, fill=sage_soft)
            mx = x0 + cw / 2
            K.pill(draw, 0, 310, letter, coral if not ans else col, size=32, left=x0 + 24)
            if kind == "one":
                dog_photo(draw, mx, 500, 0.8, GOLDEN, size=0.44, t=t)
            else:
                for k in range(6):
                    r, c = divmod(k, 3)
                    if kind == "brown":
                        col_, sp, sz = BROWN, False, 0.36
                    else:
                        col_, sp, sz = VARIED[k]
                    dog_photo(draw, mx + (c - 1) * 128, 430 + r * 148, 0.5, col_, size=sz, spots=sp, t=t)
            label_lines(lab, mx, 700, size=36, col=ink)
            if win:
                K.draw_check(draw, x0 + cw - 50, 340, 30, sage)
            elif bad:
                K.draw_cross(draw, x0 + cw - 50, 340, 30, K.DANGER)
        if ans:
            K.pill(draw, cx, 214, "Lots of photos + lots of variety!", sage, size=32)
        else:
            K.pill(draw, cx - 40, 214, "Which teaches “dog” best?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 300, 244, 30, progress, brand)
        return True

    # ---- private data -------------------------------------------------------------
    def public_items(x0, yy=0):
        tree(draw, x0 + 140, 760 + yy, 1.0)
        bird(draw, x0 + 390, 640 + yy, 0.8, "parrot", t)
        taj(draw, x0 + 640, 760 + yy, 0.66)
        for k, lab in enumerate(("Trees", "Animals", "Taj Mahal")):
            K.text_at(draw, lab, x0 + 140 + k * 250, 784 + yy, font(32, bold=True), ink)

    def private_items(x0, yy=0):
        K.draw_house(draw, x0 + 140, 650 + yy, 0.5, brand)
        phone(draw, x0 + 390, 640 + yy, 0.78, coral)
        family_photo(draw, x0 + 640, 640 + yy, 0.78)
        for k, lab in enumerate(("Address", "Phone no.", "Family photos")):
            K.text_at(draw, lab, x0 + 140 + k * 250, 784 + yy, font(32, bold=True), ink)

    if visual == "b9-private":
        if focus == "intro":
            K.text_at(draw, "Some data is PRIVATE", cx, 236 + lift, font(66, bold=True), ink)
            K.draw_shield(draw, cx, 560, 1.35, sage, mark="lock")
            for k, (lab, col, soft, open_t) in enumerate((("PUBLIC", sage, sage_soft, 1.0),
                                                          ("PRIVATE", K.DANGER, K.DANGER_SOFT, 0.0))):
                a = K.stagger(progress, k + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (k * 2 - 1) * 560
                y = 420 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 210, y, x + 210, y + 280), radius=40, fill=soft, outline=col, width=5)
                K.draw_padlock(draw, x, y + 130, 0.62, col, open_t=open_t)
                K.text_at(draw, lab, x, y + 206, font(48, bold=True), col)
            return True
        if focus in ("public", "private"):
            for k, (lab, sub, col, soft) in enumerate((("PUBLIC", "okay to share", sage, sage_soft),
                                                       ("PRIVATE", "keep it safe", K.DANGER, K.DANGER_SOFT))):
                x0 = 140 if k == 0 else 1000
                bx = (x0, 250, x0 + 780, 860)
                if k == 1 and focus == "public":
                    draw.rounded_rectangle(bx, radius=40, fill=(246, 241, 233), outline=line, width=3)
                    K.text_at(draw, "?", x0 + 390, 460, font(140, bold=True), line)
                    continue
                active = (k == 0) == (focus == "public")
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                yy = int((1 - a) * 40)
                draw.rounded_rectangle((x0, 250 + yy, x0 + 780, 860 + yy), radius=40, fill=soft, outline=col,
                                       width=6 if active else 3)
                K.text_at(draw, lab, x0 + 390, 280 + yy, font(56, bold=True), col)
                K.text_at(draw, sub, x0 + 390, 350 + yy, font(36, bold=True), muted)
                K.draw_padlock(draw, x0 + 700, 330 + yy, 0.42, col, open_t=1.0 if k == 0 else 0.0)
                (public_items if k == 0 else private_items)(x0, yy)
            return True
        # permission
        for k in range(3):
            family_photo(draw, 330 + k * 16, 540 - k * 16, 1.0)
        K.text_at(draw, "Family photos", 360, 740, font(38, bold=True), ink)
        phone(draw, 1520, 560, 1.25, coral, digits=False, app=True)
        K.text_at(draw, "Sneaky app", 1520, 790, font(38, bold=True), muted)
        stop = progress > 0.45
        for k in range(3):
            c = (t * 1.4 + k / 3) % 1
            x = K.lerp(520, 1380, c)
            if stop and x > cx - 160:
                continue
            fy = 520 - 50 * math.sin(c * math.pi)
            family_photo(draw, x, fy, 0.42)
        K.draw_dashed(draw, 500, 640, 1360, 640, muted, width=5, phase=t * 200)
        if stop:
            a = K.ease_out_cubic(K.clamp01((progress - 0.45) * 4))
            K.draw_stop_sign(draw, cx, 520, 90 + 30 * a)
            K.pill(draw, cx, 720, "Ask permission first!", K.DANGER, size=38)
        return True

    # ---- public or private game -----------------------------------------------------
    if visual == "b9-sort":
        ans = focus == "answer"
        items = [("tree", ("A photo of", "a tree"), True), ("house", ("Your home", "address"), False),
                 ("taj", ("A picture of", "the Taj Mahal"), True), ("phone", ("Your phone", "number"), False)]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab, public) in enumerate(items):
            x0 = x_start + i * (cw + gap)
            reveal = ans and progress > (0.05 if public else 0.45)
            col = (sage if public else K.DANGER) if reveal else line
            K.shadow_card(draw, (x0, 300, x0 + cw, 840), brand, radius=30, outline=col, outline_w=6 if reveal else 3)
            mx = x0 + cw / 2
            if kind == "tree":
                tree(draw, mx, 640, 1.1)
            elif kind == "house":
                K.draw_house(draw, mx, 530, 0.62, brand)
                K.draw_map_pin(draw, mx + 110, 420, 0.7, K.DANGER)
            elif kind == "taj":
                taj(draw, mx, 650, 0.82)
            else:
                phone(draw, mx, 500, 0.82, coral)
            label_lines(lab, mx, 700, size=36)
            if reveal:
                K.pill(draw, mx, 318, "PUBLIC" if public else "PRIVATE", sage if public else K.DANGER, size=30)
            elif not ans:
                K.pill(draw, mx, 318, "?", K.BOTH_COLOR, size=30)
        if ans:
            K.pill(draw, cx, 214, "Keep private data safe!", K.DANGER, size=32)
        else:
            K.pill(draw, cx - 40, 214, "Public or private?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 230, 244, 30, progress, brand)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "b9-check":
        if focus == "intro":
            K.shadow_card(draw, (440, 290 + lift, w - 440, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like an AI trainer!", cx, 450 + lift, font(60, bold=True), ink)
            bird(draw, cx - 40, 640 + lift, 0.75, "parrot", t)
            return True
        ans = focus == "answer"
        notepad((120, 230, 1060, 870))
        label_lines(("An AI must learn “bird”.", "Is 200 photos of only", "parrots enough? Why?"), 590, 262, size=44,
                    col=coral)
        rows = ["No, it's not enough!", "It may think only parrots are birds", "It needs many kinds of birds"]
        for i, lab in enumerate(rows):
            y = 470 + i * 120
            draw.line((170, y + 90, 1010, y + 90), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 196, y + 42, 22, sage)
                draw.text((236, y + 20), lab, fill=ink, font=font(40, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 590, y - 30, font(110, bold=True), line)
        if not ans:
            for k in range(6):
                r, c = divmod(k, 3)
                ib = photo(draw, 1300 + c * 150, 370 + r * 168, 0.6)
                bird(draw, (ib[0] + ib[2]) / 2 + 4, (ib[1] + ib[3]) / 2 + 4, 0.4, "parrot", t)
            K.pill(draw, 1450, 650, "200 photos · only parrots", K.BOTH_COLOR, size=30)
            K.draw_stopwatch(draw, 1450, 800, 42, progress, brand)
        else:
            birds = [("crow", "Crow"), ("sparrow", "Sparrow"), ("pigeon", "Pigeon"), ("peacock", "Peacock")]
            for k, (kind, lab) in enumerate(birds):
                a = K.stagger(progress, k + 1, step=0.12, speed=4)
                if a <= 0:
                    continue
                r, c = divmod(k, 2)
                x, y = 1290 + c * 300, 400 + r * 280 + int((1 - a) * 20)
                draw.ellipse((x - 125, y - 120, x + 125, y + 130), fill=sage_soft)
                bird(draw, x - 10, y - 6, 0.6 if kind != "peacock" else 0.56, kind, t)
                K.text_at(draw, lab, x, y + 82, font(32, bold=True), ink)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "b9-recap":
        recap = [(("Data is the", "food AI eats"), coral, "food"), (("Pictures, words", "& sounds"), K.BOTH_COLOR, "kinds"),
                 (("Variety teaches", "AI better"), sage, "variety"), (("Some data", "stays private"), K.DANGER, "private")]
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
                if kind == "food":
                    plate_of_data(ix, iy, 0.62)
                elif kind == "kinds":
                    for k, kd in enumerate(("pic", "word", "sound")):
                        data_tile(draw, kd, ix + (k - 1) * 112, iy, 1.0, brand)
                elif kind == "variety":
                    for k, (c_, sp, _) in enumerate(((BROWN, False, 0), (WHITE_DOG, True, 0), (BLACK_DOG, False, 0))):
                        dog(draw, ix - 120 + k * 110, iy + 80 - k * 40, 0.32, c_, t, spots=sp)
                else:
                    K.draw_padlock(draw, ix, iy - 20, 0.9, col)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            meera(draw, cx + 260, 400, 0.9, t)
            dog(draw, cx + 400, 560, 0.4, BROWN, t)
            K.text_at(draw, "Chapter 4 done!", cx, 650, font(68, bold=True), ink)
            K.pill(draw, cx, 760, "Data is AI's food", coral, size=36)
            stars_around(320, 560, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
