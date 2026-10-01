"""C17 · Probability — What Are the Chances? — visuals."""
import math

import build as K

IMP = (224, 62, 62)
UNL = (240, 140, 40)
LIK = (110, 172, 60)
CER = (13, 148, 136)
CHANCE = [("Impossible", IMP, 0.0), ("Unlikely", UNL, 0.25), ("Likely", LIK, 0.75), ("Certain", CER, 1.0)]

BLUE_M = (64, 124, 226)
BLUE_M_DARK = (40, 88, 180)
YELLOW_M = (255, 200, 40)
YELLOW_M_DARK = (214, 156, 20)
GREEN_M = (70, 176, 96)
GREEN_M_DARK = (44, 132, 66)
RED_M = (226, 64, 72)
RED_M_DARK = (176, 40, 50)
MARBLE_DARK = {BLUE_M: BLUE_M_DARK, YELLOW_M: YELLOW_M_DARK, GREEN_M: GREEN_M_DARK, RED_M: RED_M_DARK}

COIN = (246, 196, 72)
COIN_DARK = (204, 146, 40)
COIN_LIGHT = (255, 226, 140)
CLOTH = (196, 74, 92)
CLOTH_DARK = (150, 46, 66)
CLOTH_SOFT = (250, 232, 232)
GRASS = (150, 200, 110)
GRASS_DARK = (110, 168, 80)
PITCH = (226, 200, 150)
SKY = (220, 236, 250)
HILL = (120, 180, 110)
HILL_DARK = (90, 150, 86)
SUN = (255, 196, 60)
LUDO = {"r": (226, 64, 72), "g": (70, 168, 90), "y": (250, 196, 40), "b": (64, 124, 226)}


def S_(s):
    return lambda v: v * s


def boy(draw, cx, cy, s, body, t=0.0, cat_ears=False):
    """Aarav. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    draw.polygon([(cx - S(22), cy + S(52)), (cx + S(22), cy + S(52)), (cx, cy + S(84))], fill=(255, 255, 255))
    if cat_ears:
        for sx in (-1, 1):
            draw.polygon([(cx + sx * S(20), cy - S(60)), (cx + sx * S(70), cy - S(126)), (cx + sx * S(76), cy - S(40))],
                         fill=(60, 60, 66))
            draw.polygon([(cx + sx * S(36), cy - S(62)), (cx + sx * S(66), cy - S(104)), (cx + sx * S(66), cy - S(54))],
                         fill=(250, 180, 190))
    K.draw_face(draw, cx, cy, S(64), "kid", 0.6)
    for k in range(3):
        x = cx - S(24) + k * S(22)
        draw.polygon([(x - S(12), cy - S(62)), (x + S(14), cy - S(62)), (x + S(6), cy - S(86))], fill=K.HAIR)
    if cat_ears:
        draw.arc((cx - S(70), cy - S(80), cx + S(70), cy + S(10)), 200, 340, fill=(60, 60, 66), width=max(3, int(S(10))))


def die(draw, cx, cy, sz, val, face=(255, 255, 255), pip=(40, 44, 56), outline=None, ow=6, shadow=True):
    half = sz / 2
    if shadow:
        draw.rounded_rectangle((cx - half + sz * 0.05, cy - half + sz * 0.07, cx + half + sz * 0.05, cy + half + sz * 0.07),
                               radius=sz * 0.2, fill=K.SHADOW)
    draw.rounded_rectangle((cx - half, cy - half, cx + half, cy + half), radius=sz * 0.2, fill=face,
                           outline=outline or (200, 192, 180), width=ow if outline else 3)
    if val == 7:
        K.text_at(draw, "7", cx, cy - sz * 0.42, K.load_font(max(26, int(sz * 0.7)), bold=True), pip)
        return
    o = sz * 0.27
    spots = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)],
             4: [(-1, -1), (1, -1), (-1, 1), (1, 1)], 5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)],
             6: [(-1, -1), (-1, 0), (-1, 1), (1, -1), (1, 0), (1, 1)]}[val]
    r = sz * 0.09
    for dx, dy in spots:
        x, y = cx + dx * o, cy + dy * o
        draw.ellipse((x - r, y - r, x + r, y + r), fill=pip)


def coin(draw, cx, cy, r, side="H", squash=1.0):
    ry = max(2.0, r * abs(squash))
    draw.ellipse((cx - r + r * 0.08, cy - ry + r * 0.1, cx + r + r * 0.08, cy + ry + r * 0.1), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - ry, cx + r, cy + ry), fill=COIN_DARK)
    draw.ellipse((cx - r * 0.9, cy - ry * 0.9, cx + r * 0.9, cy + ry * 0.9), fill=COIN)
    if abs(squash) > 0.45:
        draw.ellipse((cx - r * 0.74, cy - ry * 0.74, cx + r * 0.74, cy + ry * 0.74), outline=COIN_DARK,
                     width=max(2, int(r * 0.05)))
        draw.arc((cx - r * 0.7, cy - ry * 0.7, cx + r * 0.2, cy + ry * 0.2), 190, 250, fill=COIN_LIGHT,
                 width=max(2, int(r * 0.07)))
        if abs(squash) > 0.8:
            K.text_at(draw, side, cx, cy - r * 0.5, K.load_font(max(26, int(r * 0.85)), bold=True), (150, 100, 20))


def marble(draw, x, y, r, col):
    draw.ellipse((x - r + r * 0.12, y - r + r * 0.16, x + r + r * 0.12, y + r + r * 0.16), fill=K.SHADOW)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=MARBLE_DARK.get(col, col))
    draw.ellipse((x - r * 0.86, y - r * 0.9, x + r * 0.8, y + r * 0.76), fill=col)
    draw.ellipse((x - r * 0.5, y - r * 0.6, x - r * 0.1, y - r * 0.22), fill=(255, 255, 255))


def bag(draw, cx, cy, s, marbles=(), window=True, shake=0.0):
    """Cloth potli. cy ≈ body centre; top frill ≈ cy-230s, bottom ≈ cy+180s."""
    S = S_(s)
    cx = cx + S(10) * math.sin(shake * 40) if shake else cx
    draw.rounded_rectangle((cx - S(160) + S(10), cy - S(90) + S(12), cx + S(160) + S(10), cy + S(180) + S(12)),
                           radius=S(120), fill=K.SHADOW)
    draw.polygon([(cx - S(100), cy - S(70)), (cx + S(100), cy - S(70)), (cx + S(56), cy - S(150)),
                  (cx - S(56), cy - S(150))], fill=CLOTH)
    draw.rounded_rectangle((cx - S(160), cy - S(90), cx + S(160), cy + S(180)), radius=S(120), fill=CLOTH)
    for k in range(5):
        a = math.radians(-150 + k * 30)
        draw.polygon([(cx - S(16), cy - S(156)), (cx + S(16), cy - S(156)),
                      (cx + math.cos(a) * S(110) + S(14), cy - S(156) + math.sin(a) * S(80)),
                      (cx + math.cos(a) * S(110) - S(14), cy - S(156) + math.sin(a) * S(80))], fill=CLOTH_DARK)
    draw.rounded_rectangle((cx - S(64), cy - S(164), cx + S(64), cy - S(140)), radius=S(10), fill=K.GOLD)
    draw.line((cx + S(40), cy - S(150), cx + S(70), cy - S(100)), fill=K.GOLD, width=max(3, int(S(8))))
    draw.ellipse((cx + S(62), cy - S(108), cx + S(82), cy - S(88)), fill=K.GOLD)
    for k in range(4):
        y = cy - S(40) + k * S(56)
        draw.arc((cx - S(150), y - S(20), cx + S(150), y + S(20)), 20, 160, fill=CLOTH_DARK, width=max(2, int(S(3))))
    if not window:
        return
    draw.ellipse((cx - S(136), cy - S(44), cx + S(136), cy + S(166)), fill=CLOTH_SOFT, outline=CLOTH_DARK,
                 width=max(2, int(S(5))))
    r = S(25)
    cols = list(marbles)
    rows = [cols[i:i + 4] for i in range(0, len(cols), 4)]
    for ri, row in enumerate(rows):
        y = cy + S(122) - ri * S(50)
        n = len(row)
        for k, col in enumerate(row):
            x = cx + (k - (n - 1) / 2) * S(54)
            marble(draw, x, y, r, col)


def spinner(draw, cx, cy, r, sectors, arrow_deg, ring=None, highlight=None, pulse=0.0):
    draw.ellipse((cx - r + 10, cy - r + 14, cx + r + 10, cy + r + 14), fill=K.SHADOW)
    draw.ellipse((cx - r - 10, cy - r - 10, cx + r + 10, cy + r + 10), fill=ring or K.DEV_DARK)
    a0 = -90.0
    for i, (span, col) in enumerate(sectors):
        rr = r + (8 + 6 * pulse if highlight == i else 0)
        draw.pieslice((cx - rr, cy - rr, cx + rr, cy + rr), a0, a0 + span, fill=col, outline=(255, 255, 255), width=6)
        a0 += span
    a = math.radians(arrow_deg)
    tip = (cx + math.cos(a) * r * 0.82, cy + math.sin(a) * r * 0.82)
    nx, ny = -math.sin(a), math.cos(a)
    tail = (cx - math.cos(a) * r * 0.22, cy - math.sin(a) * r * 0.22)
    w = r * 0.08
    draw.polygon([tip, (cx + nx * w * 1.6, cy + ny * w * 1.6), tail, (cx - nx * w * 1.6, cy - ny * w * 1.6)],
                 fill=K.DEV_DEEP)
    draw.ellipse((cx - r * 0.1, cy - r * 0.1, cx + r * 0.1, cy + r * 0.1), fill=(255, 255, 255), outline=K.DEV_DEEP,
                 width=4)


def pie_icon(draw, cx, cy, r, frac, col):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255), outline=col, width=max(3, int(r * 0.14)))
    if frac >= 0.999:
        draw.ellipse((cx - r * 0.78, cy - r * 0.78, cx + r * 0.78, cy + r * 0.78), fill=col)
    elif frac > 0:
        draw.pieslice((cx - r * 0.78, cy - r * 0.78, cx + r * 0.78, cy + r * 0.78), -90, -90 + 360 * frac, fill=col)


def chance_line(draw, x0, x1, y, shown=4, active=None, label_size=32, ink=(28, 36, 52), pulse=0.0, icons=True):
    for i in range(3):
        if i + 1 >= shown + 0.001 and shown < 4:
            break
        xa = K.lerp(x0, x1, i / 3)
        xb = K.lerp(x0, x1, (i + 1) / 3)
        ca, cb = CHANCE[i][1], CHANCE[i + 1][1]
        steps = 24
        for k in range(steps):
            f = k / steps
            col = tuple(int(K.lerp(ca[j], cb[j], f)) for j in range(3))
            draw.rectangle((K.lerp(xa, xb, f), y - 12, K.lerp(xa, xb, (k + 1) / steps) + 1, y + 12), fill=col)
    font = K.load_font(label_size, bold=True)
    for i, (lab, col, frac) in enumerate(CHANCE):
        if i >= shown:
            break
        x = K.lerp(x0, x1, i / 3)
        rr = 34 + (8 * pulse if active == i else 0)
        if icons:
            pie_icon(draw, x, y, rr, frac, col)
        else:
            draw.ellipse((x - 18, y - 18, x + 18, y + 18), fill=col, outline=(255, 255, 255), width=4)
        if active == i:
            draw.rounded_rectangle((x - 116, y + 50, x + 116, y + 50 + label_size + 28), radius=24, fill=col)
            K.text_at(draw, lab, x, y + 60, font, (255, 255, 255))
        else:
            K.text_at(draw, lab, x, y + 60, font, col if active is None else ink)


def gauge(draw, cx, cy, r, frac, ink=(28, 36, 52)):
    """Semicircle chance meter: left = impossible, right = certain. cy = pivot."""
    draw.chord((cx - r - 14 + 8, cy - r - 14 + 10, cx + r + 14 + 8, cy + r + 14 + 10), 180, 360, fill=K.SHADOW)
    draw.chord((cx - r - 14, cy - r - 14, cx + r + 14, cy + r + 14), 180, 360, fill=(255, 255, 255))
    n = 60
    for k in range(n):
        f = k / n
        seg = min(2, int(f * 3))
        lf = f * 3 - seg
        ca, cb = CHANCE[seg][1], CHANCE[seg + 1][1]
        col = tuple(int(K.lerp(ca[j], cb[j], lf)) for j in range(3))
        draw.pieslice((cx - r, cy - r, cx + r, cy + r), 180 + 180 * f, 180 + 180 * (k + 1) / n + 0.6, fill=col)
    draw.pieslice((cx - r * 0.62, cy - r * 0.62, cx + r * 0.62, cy + r * 0.62), 180, 360, fill=(255, 255, 255))
    a = math.radians(180 + 180 * K.clamp01(frac))
    tip = (cx + math.cos(a) * r * 0.92, cy + math.sin(a) * r * 0.92)
    nx, ny = -math.sin(a), math.cos(a)
    draw.polygon([tip, (cx + nx * r * 0.07, cy + ny * r * 0.07), (cx - nx * r * 0.07, cy - ny * r * 0.07)], fill=ink)
    draw.ellipse((cx - r * 0.1, cy - r * 0.1, cx + r * 0.1, cy + r * 0.1), fill=ink)


def ludo_board(draw, cx, cy, size, glow_red=0.0):
    c = size / 15
    x0, y0 = cx - size / 2, cy - size / 2
    draw.rounded_rectangle((x0 + 12, y0 + 14, x0 + size + 12, y0 + size + 14), radius=18, fill=K.SHADOW)
    draw.rounded_rectangle((x0 - 10, y0 - 10, x0 + size + 10, y0 + size + 10), radius=18, fill=(150, 104, 66))
    draw.rectangle((x0, y0, x0 + size, y0 + size), fill=(255, 255, 255))
    corners = [("r", 0, 0), ("g", 9, 0), ("y", 9, 9), ("b", 0, 9)]
    for key, gx, gy in corners:
        col = LUDO[key]
        bx, by = x0 + gx * c, y0 + gy * c
        draw.rectangle((bx, by, bx + 6 * c, by + 6 * c), fill=col)
        draw.rounded_rectangle((bx + c, by + c, bx + 5 * c, by + 5 * c), radius=c * 0.6, fill=(255, 255, 255))
        for k, (tx, ty) in enumerate(((2, 2), (4, 2), (2, 4), (4, 4))):
            px, py = bx + tx * c, by + ty * c
            rr = c * 0.62
            if key == "r" and glow_red > 0 and k == 0:
                rg = rr + c * 0.35 * glow_red
                draw.ellipse((px - rg, py - rg, px + rg, py + rg), fill=K.GOLD)
            draw.ellipse((px - rr, py - rr, px + rr, py + rr), fill=col, outline=(255, 255, 255), width=3)
    for i in range(15):
        for j in range(15):
            in_v = 6 <= i <= 8 and (j < 6 or j > 8)
            in_h = 6 <= j <= 8 and (i < 6 or i > 8)
            if not (in_v or in_h):
                continue
            fill = None
            if i == 7 and 1 <= j <= 5:
                fill = LUDO["g"]
            elif i == 7 and 9 <= j <= 13:
                fill = LUDO["b"]
            elif j == 7 and 1 <= i <= 5:
                fill = LUDO["r"]
            elif j == 7 and 9 <= i <= 13:
                fill = LUDO["y"]
            elif (i, j) == (1, 6):
                fill = LUDO["r"]
            elif (i, j) == (8, 1):
                fill = LUDO["g"]
            elif (i, j) == (13, 8):
                fill = LUDO["y"]
            elif (i, j) == (6, 13):
                fill = LUDO["b"]
            draw.rectangle((x0 + i * c, y0 + j * c, x0 + (i + 1) * c, y0 + (j + 1) * c), fill=fill,
                           outline=(170, 170, 176), width=2)
    mx, my = x0 + 6 * c, y0 + 6 * c
    ctr = (cx, cy)
    draw.polygon([(mx, my), (mx, my + 3 * c), ctr], fill=LUDO["r"])
    draw.polygon([(mx, my), (mx + 3 * c, my), ctr], fill=LUDO["g"])
    draw.polygon([(mx + 3 * c, my), (mx + 3 * c, my + 3 * c), ctr], fill=LUDO["y"])
    draw.polygon([(mx, my + 3 * c), (mx + 3 * c, my + 3 * c), ctr], fill=LUDO["b"])


def sunrise(draw, box, rise):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=30, fill=SKY)
    sy = K.lerp(y1 - 40, y0 + 120, rise)
    sxc = (x0 + x1) / 2
    for k in range(10):
        a = k * math.pi / 5 + rise
        draw.line((sxc + math.cos(a) * 90, sy + math.sin(a) * 90, sxc + math.cos(a) * 124, sy + math.sin(a) * 124),
                  fill=SUN, width=10)
    draw.ellipse((sxc - 70, sy - 70, sxc + 70, sy + 70), fill=SUN)
    for col, amp, ph, base in ((HILL_DARK, 60, 0.0, 150), (HILL, 50, 2.2, 90)):
        pts = []
        for k in range(41):
            x = K.lerp(x0 + 14, x1 - 14, k / 40)
            pts.append((x, y1 - base + amp * math.cos(k / 40 * math.pi * 1.6 + ph)))
        pts += [(x1 - 14, y1 - 14), (x0 + 14, y1 - 14)]
        draw.polygon(pts, fill=col)
    draw.rounded_rectangle(box, radius=30, outline=(200, 214, 230), width=4)


def cat_photo(draw, cx, cy, w, h, col, tilt=0):
    x0, y0 = cx - w / 2, cy - h / 2
    draw.rectangle((x0 + 8, y0 + 10 + tilt, x0 + w + 8, y0 + h + 10 - tilt), fill=K.SHADOW)
    draw.rectangle((x0, y0 + tilt, x0 + w, y0 + h - tilt), fill=(255, 255, 255), outline=K.DEV_MID, width=3)
    draw.rectangle((x0 + 10, y0 + 10 + tilt, x0 + w - 10, y0 + h - 30 - tilt), fill=(226, 238, 250))
    r = min(w, h) * 0.24
    fx, fy = cx, cy - 6
    for sx in (-1, 1):
        draw.polygon([(fx + sx * r * 0.9, fy - r * 0.2), (fx + sx * r * 0.75, fy - r * 1.3), (fx + sx * r * 0.2, fy - r * 0.8)],
                     fill=col)
    draw.ellipse((fx - r, fy - r * 0.95, fx + r, fy + r * 0.85), fill=col)
    for sx in (-1, 1):
        ex = fx + sx * r * 0.38
        draw.ellipse((ex - r * 0.14, fy - r * 0.28, ex + r * 0.14, fy + r * 0.02), fill=K.DEV_DEEP)
    draw.polygon([(fx - r * 0.12, fy + r * 0.16), (fx + r * 0.12, fy + r * 0.16), (fx, fy + r * 0.3)], fill=(230, 110, 120))


def ai_laptop(draw, cx, cy, s, brand, t):
    K.draw_device(draw, "laptop", cx, cy, s, brand, t=t)
    K.text_at(draw, "AI", cx, cy - s * 76, K.load_font(max(26, int(s * 84)), bold=True), K.BOT)


def jar(draw, cx, by, s, n=14):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110) + S(8), by - S(230) + S(10), cx + S(110) + S(8), by + S(10)), radius=S(40),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), by - S(230), cx + S(110), by), radius=S(40), fill=(232, 244, 250),
                           outline=(170, 190, 204), width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(80), by - S(270), cx + S(80), by - S(226)), radius=S(12), fill=K.CORAL)
    for k in range(n):
        r_, c_ = divmod(k, 4)
        x = cx - S(66) + c_ * S(44) + (S(22) if r_ % 2 else 0)
        y = by - S(36) - r_ * S(40)
        if x > cx + S(80):
            continue
        draw.ellipse((x - S(20), y - S(20), x + S(20), y + S(20)), fill=(255, 168, 40))
        draw.ellipse((x - S(8), y - S(12), x - S(1), y - S(5)), fill=(255, 220, 140))


def scale_balance(draw, cx, cy, s, tilt, left, right):
    """Balance: cy = beam pivot. left/right: callables(draw, x, y) for pan contents."""
    S = S_(s)
    draw.polygon([(cx - S(90), cy + S(300)), (cx + S(90), cy + S(300)), (cx + S(20), cy), (cx - S(20), cy)],
                 fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(130), cy + S(290), cx + S(130), cy + S(320)), radius=S(12), fill=K.DEV_DARK)
    a = math.radians(tilt)
    lx, ly = cx - math.cos(a) * S(300), cy - math.sin(a) * S(300)
    rx, ry = cx + math.cos(a) * S(300), cy + math.sin(a) * S(300)
    draw.line((lx, ly, rx, ry), fill=K.DEV_DARK, width=max(4, int(S(16))))
    draw.ellipse((cx - S(22), cy - S(22), cx + S(22), cy + S(22)), fill=K.GOLD)
    for (px, py), fn in (((lx, ly), left), ((rx, ry), right)):
        draw.line((px, py, px - S(90), py + S(140)), fill=K.DEV_MID, width=max(2, int(S(5))))
        draw.line((px, py, px + S(90), py + S(140)), fill=K.DEV_MID, width=max(2, int(S(5))))
        draw.chord((px - S(120), py + S(100), px + S(120), py + S(180)), 0, 180, fill=K.STEEL_DARK)
        draw.line((px - S(120), py + S(140), px + S(120), py + S(140)), fill=K.STEEL_DARK, width=max(3, int(S(8))))
        fn(draw, px, py + S(70))


def phone(draw, cx, cy, s, brand, typed, sugg, hi, t):
    S = S_(s)
    ink = K.hex_rgb(brand["ink"])
    x0, y0, x1, y1 = cx - S(240), cy - S(320), cx + S(240), cy + S(320)
    draw.rounded_rectangle((x0 + S(10), y0 + S(12), x1 + S(10), y1 + S(12)), radius=S(50), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(50), fill=K.DEV_DARK)
    draw.rounded_rectangle((x0 + S(16), y0 + S(40), x1 - S(16), y1 - S(30)), radius=S(30), fill=(246, 248, 252))
    draw.rounded_rectangle((cx - S(50), y0 + S(14), cx + S(50), y0 + S(26)), radius=S(6), fill=K.DEV_DEEP)
    draw.rounded_rectangle((x0 + S(150), y0 + S(80), x1 - S(36), y0 + S(150)), radius=S(26), fill=(214, 238, 234))
    K.text_at(draw, "Hi Nani!", (x0 + S(150) + x1 - S(36)) / 2, y0 + S(96), K.load_font(max(26, int(S(30))), bold=True), ink)
    fy = y0 + S(330)
    draw.rounded_rectangle((x0 + S(30), fy, x1 - S(30), fy + S(70)), radius=S(30), fill=(255, 255, 255),
                           outline=(200, 206, 216), width=3)
    f = K.load_font(max(26, int(S(34))), bold=True)
    draw.text((x0 + S(54), fy + S(16)), typed, font=f, fill=ink)
    bb = draw.textbbox((0, 0), typed, font=f)
    if int(t * 6) % 2 == 0:
        cxr = x0 + S(60) + bb[2]
        draw.line((cxr, fy + S(14), cxr, fy + S(56)), fill=K.CORAL, width=3)
    sy = fy + S(90)
    draw.rectangle((x0 + S(16), sy, x1 - S(16), sy + S(66)), fill=(228, 232, 240))
    cw = (x1 - x0 - S(32)) / 3
    fs = K.load_font(max(26, int(S(26))), bold=True)
    for i, word in enumerate(sugg):
        mx = x0 + S(16) + cw * (i + 0.5)
        if i == hi:
            draw.rounded_rectangle((mx - cw / 2 + S(6), sy + S(8), mx + cw / 2 - S(6), sy + S(58)), radius=S(20),
                                   fill=K.CORAL)
        K.text_at(draw, word, mx, sy + S(18), fs, (255, 255, 255) if i == hi else ink)
    ky = sy + S(80)
    for r_ in range(3):
        n = 10 - r_
        kw = S(40)
        row_x = cx - (n * kw + (n - 1) * S(6)) / 2
        for k in range(n):
            kx = row_x + k * (kw + S(6))
            draw.rounded_rectangle((kx, ky + r_ * S(44), kx + kw, ky + r_ * S(44) + S(36)), radius=S(6),
                                   fill=(255, 255, 255), outline=(210, 214, 222))


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
    AARAV = K.ROAD

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

    def chip(x, y, text, col, size=36):
        """Pill centred on x."""
        return K.pill(draw, x, y, text, col, size=size)

    def dice_x(i, sz=170, gap=40):
        return cx + (i - 2.5) * (sz + gap)

    def dice_row(y, sz, states, gap=40):
        n = 6
        step = sz + gap
        x_start = cx - (n - 1) * step / 2
        for i in range(n):
            st = states[i] if states else "normal"
            a = K.stagger(progress, i, step=0.06, speed=6)
            x = x_start + i * step
            yy = y + int((1 - a) * 30) - (24 if st == "pick" else 0)
            if st == "fade":
                die(draw, x, yy, sz, i + 1, face=(240, 238, 234), pip=(196, 192, 186))
            elif st == "pick":
                die(draw, x, yy, sz, i + 1, outline=sage, ow=8)
            elif st == "bad":
                die(draw, x, yy, sz, i + 1, outline=coral, ow=8)
            else:
                die(draw, x, yy, sz, i + 1)

    # ---- opening -----------------------------------------------------------
    if visual == "c17-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            boy(draw, cx + 280, 430, 1.3, AARAV, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            die(draw, cx - 620, 340, 90, 6)
            coin(draw, cx + 620, 340, 50, "H")
            star_spots([(cx - 560, 560), (cx + 560, 560), (cx, 280)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · ESTIMATING", cx, 326 + lift, font(34, bold=True), sage)
            labels = ["Guess", "Check", "Improve"]
            for i, lab in enumerate(labels):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 440
                y = 560 + int((1 - a) * 40)
                draw.ellipse((x - 130, y - 150, x + 130, y + 110), fill=[coral_soft, sage_soft, lav_soft][i])
                if i == 0:
                    jar(draw, x, y + 70, 0.6)
                    K.pill(draw, x + 80, y - 166, "20?", coral, size=32)
                elif i == 1:
                    K.pill(draw, x, y - 90, "too small!", K.BOTH_COLOR, size=32)
                    K.draw_arrow(draw, x, y + 70, x, y - 10, K.BOTH_COLOR, width=14, head=36)
                else:
                    K.text_at(draw, "25", x, y - 100, font(90, bold=True), sage)
                    K.draw_check(draw, x, y + 40, 40, sage)
                K.text_at(draw, lab, x, y + 132, font(38, bold=True), ink)
                if i < 2:
                    K.draw_arrow(draw, x + 150, y - 20, x + 290, y - 20, muted, width=8, head=22)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 560 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Probability", cx, 352 + lift, font(90, bold=True), ink)
            K.text_at(draw, "What are the chances?", cx, 466 + lift, font(48, bold=True), coral)
            items = ["coin", "die", "spin", "bag"]
            for i, kind in enumerate(items):
                a = K.stagger(progress, i + 1, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 330
                y = 720 + int((1 - a) * 40)
                if kind == "coin":
                    coin(draw, x, y, 70, "H", squash=math.cos(t * 12))
                elif kind == "die":
                    die(draw, x, y, 130, int(t * 14) % 6 + 1)
                elif kind == "spin":
                    spinner(draw, x, y, 80, [(90, LUDO["r"]), (90, LUDO["g"]), (90, LUDO["y"]), (90, LUDO["b"])],
                            -90 + t * 900)
                else:
                    for k, col in enumerate((BLUE_M, YELLOW_M, BLUE_M, GREEN_M, RED_M)):
                        marble(draw, x - 80 + k * 40, y + 30 - (k % 2) * 34, 26, col)
            return True
        # promise
        draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=blue_soft)
        boy(draw, 480, 520, 1.6, AARAV, t)
        question_marks([(300, 300), (680, 300)], size=70)
        K.text_at(draw, "Probability", 1260, 270 + lift, font(96, bold=True), ink)
        K.text_at(draw, "= chance", 1260, 390 + lift, font(96, bold=True), coral)
        gauge(draw, 1260, 790, 230, 0.15 + 0.7 * (0.5 + 0.5 * math.sin(t * 6)), ink)
        return True

    # ---- Ludo with Nani -----------------------------------------------------------
    if visual == "c17-hook":
        if focus == "meet":
            ludo_board(draw, 480, 560, 460)
            boy(draw, 1180, 470, 1.25, AARAV, t)
            K.draw_person(draw, 1600, 470, 1.25, "nani", t + 0.3)
            K.text_at(draw, "Meet Aarav!", 1390, 240 + lift, font(76, bold=True), coral)
            chip(1180, 700, "Aarav", AARAV, size=34)
            chip(1600, 700, "Nani", K.BOTH_COLOR, size=34)
            K.text_at(draw, "Sunday Ludo!", 1390, 800, font(40, bold=True), muted)
            return True
        if focus == "rule":
            ludo_board(draw, 470, 590, 440, glow_red=pulse)
            K.pill(draw, 470, 270, "Need a 6 to start!", LUDO["r"], size=36)
            boy(draw, 1180, 520, 1.2, AARAV, t)
            K.draw_bubble(draw, (1300, 250, 1800, 400), brand, "Please be a six!", tail="left", size=44)
            jx = 8 * math.sin(t * 60)
            jy = 6 * math.cos(t * 50)
            die(draw, 1520 + jx, 640 + jy, 150, int(t * 20) % 6 + 1)
            for k in range(3):
                a = math.radians(200 + k * 40)
                draw.line((1520 + math.cos(a) * 110, 640 + math.sin(a) * 110, 1520 + math.cos(a) * 140,
                           640 + math.sin(a) * 140), fill=K.GOLD, width=8)
            K.text_at(draw, "shake, shake…", 1520, 760, font(36, bold=True), muted)
            return True
        if focus == "ask":
            draw.ellipse((cx - 230, 560 - 230, cx + 230, 560 + 230), fill=lav_soft)
            die(draw, cx, 560, 230, int(t * 16) % 6 + 1)
            question_marks([(cx - 300, 330), (cx + 300, 330)], size=80)
            boy(draw, 330, 520, 1.15, AARAV, t)
            K.text_at(draw, "A 6 on the first roll?", cx, 240, font(50, bold=True), ink)
            chip(1540, 420, "Yes?", sage, size=44)
            chip(1540, 560, "No?", IMP, size=44)
            K.draw_stopwatch(draw, 1540, 780, 50, progress, brand)
            return True
        # answer
        for i, (val, lab, col) in enumerate(((6, "It might be a 6…", sage), (3, "…or it might not!", IMP))):
            a = K.stagger(progress, i, step=0.15, speed=5)
            if a <= 0:
                continue
            x = 380 + i * 520
            y = 280 + int((1 - a) * 30)
            K.shadow_card(draw, (x - 220, y, x + 220, y + 330), brand, radius=32, outline=col, outline_w=5)
            die(draw, x, y + 140, 150, val, outline=col)
            K.text_at(draw, lab, x, y + 252, font(36, bold=True), ink)
        a = K.stagger(progress, 2, step=0.15, speed=4)
        if a > 0:
            gauge(draw, 1500, 600, 230, 0.25 * a, ink)
            K.text_at(draw, "How LIKELY?", 1500, 650, font(48, bold=True), coral)
            K.text_at(draw, "Probability!", 1500, 720, font(48, bold=True), sage)
        K.pill(draw, 640, 700, "Nobody knows for sure", K.BOTH_COLOR, size=40)
        return True

    # ---- definition ----------------------------------------------------------------
    if visual == "c17-define":
        if focus == "name":
            draw.ellipse((460 - 280, 560 - 280, 460 + 280, 560 + 280), fill=gold_soft)
            gauge(draw, 460, 640, 250, 0.5 + 0.45 * math.sin(t * 7), ink)
            K.text_at(draw, "chance meter", 460, 680, font(36, bold=True), muted)
            K.shadow_card(draw, (820, 250 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "PROBABILITY means…", 1300, 320 + lift, font(44, bold=True), muted)
            parts = [("the chance", coral), ("that something", ink), ("will happen.", ink)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1300, 400 + i * 96 + lift + int((1 - a) * 30), font(68, bold=True), col)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1300, 712 + lift + int((1 - a) * 20), "Not WHAT. Just HOW LIKELY.", sage, size=36)
            return True
        if focus == "line":
            K.text_at(draw, "The chance line", cx, 250 + lift, font(64, bold=True), ink)
            n = min(4.0, progress * 6.0 + 0.6)
            chance_line(draw, 300, 1620, 520, shown=int(n), ink=ink, label_size=40)
            K.draw_arrow(draw, 320, 720, 1600, 720, muted, width=8, head=26)
            K.text_at(draw, "never", 360, 750, font(34, bold=True), IMP)
            K.text_at(draw, "surely", 1560, 750, font(34, bold=True), CER)
            K.text_at(draw, "more and more likely", cx, 750, font(34, bold=True), muted)
            return True
        # words
        means = ["Can never happen", "Could happen, but probably won't", "Will probably happen",
                 "Will surely happen"]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, ((lab, col, frac), mean) in enumerate(zip(CHANCE, means)):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x0 = x_start + i * (cw + gap)
            y0 = 260 + int((1 - a) * 40)
            draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + cw + 10, y0 + 580 + 12), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + cw, y0 + 580), radius=36, fill=panel, outline=col, width=6)
            pie_icon(draw, x0 + cw / 2, y0 + 140, 80, frac, col)
            K.text_at(draw, lab, x0 + cw / 2, y0 + 260, font(48, bold=True), col)
            f = font(36, bold=True)
            lines = K.wrap_text(mean, f, cw - 50)
            for j, ln in enumerate(lines):
                K.text_at(draw, ln, x0 + cw / 2, y0 + 360 + j * 48, f, ink)
        return True

    # ---- placing events on the line ---------------------------------------------------
    if visual == "c17-scale":
        idx = {"impossible": 0, "unlikely": 1, "likely": 2, "certain": 3}[focus]
        chance_line(draw, 300, 1620, 300, active=idx, ink=muted, label_size=32, pulse=pulse)
        mx = K.lerp(300, 1620, idx / 3)
        a = K.ease_out_cubic(K.clamp01((progress - 0.45) * 3))
        if focus == "certain":
            sunrise(draw, (220, 440, 980, 860), K.ease_out_cubic(K.clamp01(progress * 1.4)))
            draw.rounded_rectangle((1060, 470, 1760, 830), radius=36, fill=sage_soft, outline=CER, width=5)
            K.text_at(draw, "The sun will", 1410, 510, font(52, bold=True), ink)
            K.text_at(draw, "rise tomorrow", 1410, 576, font(52, bold=True), ink)
            K.text_at(draw, "Every single day!", 1410, 666, font(38, bold=True), muted)
            if a > 0:
                K.pill(draw, 1410, 730 + int((1 - a) * 20), "CERTAIN", CER, size=40)
        elif focus == "impossible":
            for i in range(7):
                x = 330 + i * 190
                if i == 6:
                    x += 40
                    die(draw, x, 560, 150, 7, face=(253, 236, 236), pip=IMP, outline=IMP)
                    if a > 0:
                        K.draw_cross(draw, x + 70, 480, 34 * a + 1, IMP)
                else:
                    die(draw, x, 560, 150, i + 1)
            K.text_at(draw, "A normal die: only 1 to 6", 900, 680, font(42, bold=True), ink)
            if a > 0:
                K.pill(draw, 1560, 760 + int((1 - a) * 20), "IMPOSSIBLE", IMP, size=40)
            K.text_at(draw, "No 7!", 1520 - 330 + 330, 680, font(42, bold=True), IMP)
        else:
            picks = [5] if focus == "unlikely" else [0, 1, 2, 3, 4]
            col = UNL if focus == "unlikely" else LIK
            for i in range(6):
                x = 400 + i * 190
                on = i in picks
                if on:
                    draw.rounded_rectangle((x - 92, 460, x + 92, 660), radius=30, fill=coral_soft if focus == "unlikely"
                                           else (236, 246, 226))
                    die(draw, x, 560, 150, i + 1, outline=col)
                else:
                    die(draw, x, 560, 150, i + 1, face=(240, 238, 234), pip=(196, 192, 186))
            txt = "1 out of 6" if focus == "unlikely" else "5 out of 6"
            K.text_at(draw, txt, 875, 700, font(60, bold=True), col)
            if a > 0:
                K.pill(draw, 1620, 560 + int((1 - a) * 20), focus.upper(), col, size=40)
            if focus == "unlikely":
                K.text_at(draw, "Aarav's six", 1620, 480, font(34, bold=True), muted)
            else:
                K.text_at(draw, "smaller than 6", 1620, 480, font(34, bold=True), muted)
        if a > 0:
            K.draw_arrow(draw, mx, 220 - 30 * (1 - a), mx, 256, ink, width=10, head=26)
        return True

    # ---- coin toss --------------------------------------------------------------------
    if visual == "c17-coin":
        if focus == "toss":
            draw.ellipse((200, 330, 1720, 870), fill=GRASS)
            draw.ellipse((300, 375, 1620, 830), fill=GRASS_DARK)
            draw.ellipse((330, 392, 1590, 815), fill=GRASS)
            draw.rounded_rectangle((830, 520, 1090, 830), radius=8, fill=PITCH)
            for sx in (870, 1050):
                for k in range(3):
                    draw.rectangle((sx - 16 + k * 14, 740, sx - 10 + k * 14, 800), fill=(240, 236, 226))
            K.draw_person(draw, 620, 560, 1.1, "kid", t)
            K.draw_person(draw, 1300, 560, 1.1, "dad", t + 0.3)
            chip(620, 780, "Captain 1", K.ROAD, size=30)
            chip(1300, 780, "Captain 2", coral, size=30)
            arc_t = K.clamp01(progress * 1.2)
            cy_ = 520 - 260 * math.sin(arc_t * math.pi)
            coin(draw, 960, cy_, 56, "H", squash=math.cos(t * 30))
            K.pill(draw, 960, 236, "Heads or tails?", K.BOTH_COLOR, size=38)
            return True
        if focus == "sides":
            for i, (side, lab) in enumerate((("H", "HEADS"), ("T", "TAILS"))):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (i * 2 - 1) * 380
                y = 470 + int((1 - a) * 30)
                draw.ellipse((x - 220, y - 220, x + 220, y + 220), fill=[gold_soft, blue_soft][i])
                coin(draw, x, y, 160, side)
                K.text_at(draw, lab, x, y + 200, font(48, bold=True), ink)
                K.pill(draw, x, y + 268, "1 out of 2", [coral, K.ROAD][i], size=36)
            if progress > 0.5:
                K.text_at(draw, "=", cx, 400, font(140, bold=True), sage)
                K.text_at(draw, "same chance!", cx, 560, font(40, bold=True), sage)
            return True
        if focus == "equal":
            tosses = "HTTHHTHTHH"
            K.text_at(draw, "10 tosses", 470, 250, font(44, bold=True), ink)
            for i, sd in enumerate(tosses):
                a = K.stagger(progress, i, step=0.035, speed=8)
                if a <= 0:
                    continue
                r_, c_ = divmod(i, 5)
                coin(draw, 230 + c_ * 120, 380 + r_ * 130, 48 * a + 1, sd)
            heads = tosses.count("H")
            if K.stagger(progress, 10, step=0.035, speed=8) > 0:
                K.text_at(draw, f"Heads {heads} · Tails {10 - heads}", 470, 640, font(42, bold=True), muted)
                K.text_at(draw, "Not exactly 5 and 5!", 470, 710, font(38, bold=True), coral)
            draw.line((900, 260, 900, 820), fill=line, width=4)
            K.text_at(draw, "Lots of tosses", 1380, 250, font(44, bold=True), ink)
            base = 760
            g = K.ease_out_cubic(K.clamp01((progress - 0.3) * 2))
            for k, (lab, frac, col) in enumerate((("Heads", 0.51, coral), ("Tails", 0.49, K.ROAD))):
                x = 1220 + k * 320
                hh = 400 * frac * g
                draw.rounded_rectangle((x - 90, base - hh, x + 90, base), radius=16, fill=col)
                K.text_at(draw, lab, x, base + 16, font(38, bold=True), ink)
            draw.line((1080, base, 1680, base), fill=K.DEV_MID, width=5)
            if g > 0.9:
                K.draw_dashed(draw, 1100, base - 200, 1680, base - 200, sage, width=4)
                K.pill(draw, 1380, 330, "about half and half", sage, size=34)
            return True
        # fair
        scale_balance(draw, 760, 380, 1.0, 0.0,
                      lambda d, x, y: coin(d, x, y, 60, "H"),
                      lambda d, x, y: coin(d, x, y, 60, "T"))
        K.shadow_card(draw, (1180, 300 + lift, 1800, 760 + lift), brand, radius=36, accent=sage)
        K.text_at(draw, "FAIR", 1490, 370 + lift, font(80, bold=True), sage)
        label_lines(["Every result has", "the same chance"], 1490, 500 + lift, size=42)
        K.draw_check(draw, 1490, 680 + lift, 36, sage)
        return True

    # ---- dice ---------------------------------------------------------------------------
    if visual == "c17-dice":
        if focus == "faces":
            K.pill(draw, cx, 236, "A fair die has 6 faces", K.ROAD, size=38)
            dice_row(470, 170, None)
            for i in range(6):
                a = K.stagger(progress, i + 3, step=0.06, speed=6)
                if a <= 0:
                    continue
                K.text_at(draw, "1 out of 6", dice_x(i), 600 + int((1 - a) * 10), font(32, bold=True), sage)
            K.text_at(draw, "Every number: same chance!", cx, 730, font(52, bold=True), ink)
            return True
        if focus == "ask":
            K.pill(draw, cx - 60, 236, "Chance of an EVEN number?", coral, size=36)
            K.draw_stopwatch(draw, cx + 390, 268, 34, progress, brand)
            dice_row(500, 170, None)
            question_marks([(cx - 200, 640), (cx + 200, 640)], size=90)
            K.text_at(draw, "Count the even faces!", cx, 780, font(44, bold=True), muted)
            return True
        states = ["fade", "pick", "fade", "pick", "fade", "pick"]
        K.pill(draw, cx, 236, "Even numbers: 2, 4, 6", sage, size=38)
        dice_row(480, 170, states)
        for k, i in enumerate((1, 3, 5)):
            a = K.stagger(progress, k + 2, step=0.1, speed=5)
            if a > 0:
                x = dice_x(i)
                draw.ellipse((x - 30, 590, x + 30, 650), fill=sage)
                K.text_at(draw, str(k + 1), x, 598, font(40, bold=True), (255, 255, 255))
        a = K.stagger(progress, 5, step=0.1, speed=4)
        if a > 0:
            y = 690 + int((1 - a) * 20)
            K.text_at(draw, "3 out of 6", cx - 200, y, font(80, bold=True), sage)
            K.text_at(draw, "= half!", cx + 230, y, font(80, bold=True), coral)
        return True

    # ---- marbles ------------------------------------------------------------------------
    if visual == "c17-marbles":
        mix = [BLUE_M, YELLOW_M, BLUE_M, BLUE_M, BLUE_M, YELLOW_M, BLUE_M, BLUE_M, YELLOW_M, BLUE_M]
        if focus == "bag":
            K.draw_person(draw, 250, 400, 0.85, "nani", t)
            bag(draw, 640, 600, 1.15, mix, shake=t if progress > 0.6 else 0.0)
            K.shadow_card(draw, (980, 280 + lift, 1780, 820 + lift), brand, radius=36, accent=K.BOTH_COLOR)
            K.text_at(draw, "Nani's marble bag", 1380, 330 + lift, font(44, bold=True), K.BOTH_COLOR)
            for r_, (col, n, lab) in enumerate(((BLUE_M, 7, "7 blue"), (YELLOW_M, 3, "3 yellow"))):
                y = 470 + r_ * 190 + lift
                for k in range(n):
                    a = K.stagger(progress, k + r_ * 7, step=0.04, speed=7)
                    if a > 0:
                        marble(draw, 1380 + (k - (n - 1) / 2) * 76, y, 30 * a + 1, col)
                K.text_at(draw, lab, 1380, y + 46, font(44, bold=True), BLUE_M_DARK if r_ == 0 else YELLOW_M_DARK)
            return True
        if focus == "ask":
            bag(draw, 760, 620, 1.15, window=False)
            boy(draw, 330, 500, 1.15, AARAV, t)
            K.draw_arrow(draw, 470, 520, 600, 470, muted, width=10, head=28)
            K.text_at(draw, "no peeking!", 330, 280, font(36, bold=True), muted)
            question_marks([(760, 600)], size=110)
            chip(1460, 330, "Chance of yellow?", YELLOW_M_DARK, size=40)
            chip(1460, 470, "Likely or unlikely?", K.BOTH_COLOR, size=40)
            K.draw_stopwatch(draw, 1460, 700, 60, progress, brand)
            return True
        if focus == "answer":
            order = [BLUE_M] * 7 + [YELLOW_M] * 3
            for i, col in enumerate(order):
                a = K.stagger(progress, i, step=0.03, speed=8)
                if a <= 0:
                    continue
                x = cx + (i - 4.5) * 150
                y = 360
                if col == YELLOW_M:
                    draw.ellipse((x - 58, y - 58, x + 58, y + 58), outline=K.GOLD, width=6)
                marble(draw, x, y, 42 * a + 1, col)
                K.text_at(draw, str(i + 1), x, y - 108, font(34, bold=True), muted)
            a = K.stagger(progress, 3, step=0.1, speed=4)
            if a > 0:
                K.text_at(draw, "7 + 3 = 10 marbles", cx, 456 + int((1 - a) * 20), font(48, bold=True), ink)
            for k, (lab, col, word, wcol) in enumerate((("Yellow: 3 out of 10", YELLOW_M_DARK, "UNLIKELY", UNL),
                                                        ("Blue: 7 out of 10", BLUE_M_DARK, "LIKELY", LIK))):
                a = K.stagger(progress, 4 + k * 2, step=0.08, speed=4)
                if a <= 0:
                    continue
                y = 560 + k * 140 + int((1 - a) * 20)
                draw.rounded_rectangle((330, y, 1590, y + 112), radius=56, fill=panel, outline=col, width=5)
                marble(draw, 400, y + 56, 32, YELLOW_M if k == 0 else BLUE_M)
                draw.text((460, y + 30), lab, font=font(50, bold=True), fill=col)
                K.pill(draw, 0, y + 22, word, wcol, size=40, left=1200 if k == 0 else 1250)
            return True
        # green
        bag(draw, 520, 600, 1.15, [GREEN_M] * 5)
        K.pill(draw, 520, 250, "5 green · 0 red", GREEN_M_DARK, size=36)
        for k, (lab, word, wcol, ok) in enumerate((("Pick red?", "IMPOSSIBLE", IMP, False),
                                                   ("Pick green?", "CERTAIN", CER, True))):
            a = K.stagger(progress, k * 2 + 1, step=0.12, speed=4)
            if a <= 0:
                continue
            y = 320 + k * 270 + int((1 - a) * 20)
            K.shadow_card(draw, (920, y, 1780, y + 220), brand, radius=36, outline=wcol, outline_w=5)
            mxp = 1020
            if ok:
                marble(draw, mxp, y + 110, 46, GREEN_M)
                K.draw_check(draw, mxp + 44, y + 64, 22, CER)
            else:
                draw.ellipse((mxp - 46, y + 64, mxp + 46, y + 156), fill=(253, 236, 236))
                K.draw_dashed(draw, mxp - 46, y + 110, mxp + 46, y + 110, IMP, width=4)
                K.draw_cross(draw, mxp + 44, y + 64, 22, IMP)
            draw.text((1110, y + 36), lab, font=font(48, bold=True), fill=ink)
            K.pill(draw, 0, y + 120, word, wcol, size=38, left=1110)
            if not ok:
                K.text_at(draw, "none in the bag!", 1580, y + 136, font(30, bold=True), muted)
        return True

    # ---- spinners -------------------------------------------------------------------------
    if visual == "c17-spinner":
        four = [(90, LUDO["r"]), (90, LUDO["g"]), (90, LUDO["y"]), (90, LUDO["b"])]
        three = [(90, RED_M), (90, RED_M), (90, RED_M), (90, BLUE_M)]
        half = [(180, K.BOTH_COLOR), (60, LUDO["g"]), (60, LUDO["y"]), (60, LUDO["r"])]
        spin = -90 + 1080 * K.ease_out_cubic(K.clamp01(progress * 1.25))
        if focus == "fair":
            draw.ellipse((540 - 300, 570 - 300, 540 + 300, 570 + 300), fill=sage_soft)
            spinner(draw, 540, 570, 250, four, spin + 45)
            rows = [("4 equal parts", ink), ("Each colour:", ink), ("1 out of 4", sage)]
            for i, (txt, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a > 0:
                    K.text_at(draw, txt, 1360, 290 + i * 110 + int((1 - a) * 20), font(64, bold=True), col)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1300, 650, "FAIR", sage, size=56)
                K.draw_check(draw, 1520, 694, 40, sage)
            return True
        if focus == "red":
            draw.ellipse((540 - 300, 570 - 300, 540 + 300, 570 + 300), fill=(252, 228, 228))
            spinner(draw, 540, 570, 250, three, spin + 135)
            rows = [("Red: 3 out of 4", RED_M), ("Blue: 1 out of 4", BLUE_M_DARK)]
            for i, (txt, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 150 + int((1 - a) * 20)
                draw.rounded_rectangle((990, y, 1770, y + 120), radius=60, fill=panel, outline=col, width=5)
                draw.pieslice((1030, y + 20, 1110, y + 100), -90, 180 if i == 0 else 0, fill=col)
                draw.ellipse((1030, y + 20, 1110, y + 100), outline=col, width=4)
                draw.text((1140, y + 30), txt, font=font(54, bold=True), fill=col)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                K.pill(draw, 1380, 640 + int((1 - a) * 20), "Red is more likely!", RED_M, size=48)
            return True
        ans = focus == "answer"
        spinner(draw, 560, 570, 260, half, spin + 30, highlight=0 if ans else None, pulse=pulse)
        if not ans:
            K.text_at(draw, "Is it fair?", 1400, 290, font(80, bold=True), ink)
            question_marks([(1240, 470), (1560, 470)], size=100)
            K.text_at(draw, "One part = half the circle", 1400, 640, font(42, bold=True), muted)
            K.draw_stopwatch(draw, 1400, 780, 50, progress, brand)
            return True
        K.text_at(draw, "Not fair!", 1250, 260, font(76, bold=True), IMP)
        K.draw_cross(draw, 1250, 410, 44, IMP)
        label_lines(["Big part wins", "more often"], 1250, 490, size=42)
        draw.line((1530, 280, 1530, 820), fill=line, width=4)
        spinner(draw, 1680, 470, 110, four, -45 + t * 200)
        K.text_at(draw, "Fair =", 1680, 620, font(40, bold=True), sage)
        K.text_at(draw, "equal parts", 1680, 670, font(40, bold=True), sage)
        K.draw_check(draw, 1800, 345, 24, sage)
        return True

    # ---- AI and chance ------------------------------------------------------------------------
    if visual == "c17-ai":
        if focus == "intro":
            draw.ellipse((cx - 300, 590 - 300, cx + 300, 590 + 300), fill=blue_soft)
            ai_laptop(draw, cx, 620, 1.2, brand, t)
            die(draw, cx - 480, 450 + bounce, 130, int(t * 10) % 6 + 1)
            coin(draw, cx + 480, 460 - bounce, 70, "H", squash=math.cos(t * 14))
            gauge(draw, cx + 470, 800, 120, 0.75, ink)
            spinner(draw, cx - 480, 720, 90, [(90, LUDO["r"]), (90, LUDO["g"]), (90, LUDO["y"]), (90, LUDO["b"])],
                    t * 700)
            K.text_at(draw, "AI uses chance too!", cx, 240 + lift, font(64, bold=True), ink)
            return True
        if focus == "cats":
            cols = [(240, 160, 80), (90, 90, 96), (230, 230, 230), (200, 140, 90), (60, 60, 64), (250, 200, 140)]
            for k in range(6):
                a = K.stagger(progress, k, step=0.05, speed=5)
                if a <= 0:
                    continue
                r_, c_ = divmod(k, 3)
                cat_photo(draw, 230 + c_ * 180, 400 + r_ * 220 + int((1 - a) * 30), 150, 180, cols[k],
                          tilt=6 if k % 2 else -6)
            K.text_at(draw, "100 cat photos", 410, 770, font(38, bold=True), muted)
            K.draw_arrow(draw, 720, 520, 840, 520, coral, width=14, head=36)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                cat_photo(draw, 1040, 520 + int((1 - a) * 30), 240, 290, (150, 150, 156))
                K.text_at(draw, "New photo", 1040, 700, font(36, bold=True), ink)
                K.draw_arrow(draw, 1190, 520, 1290, 520, coral, width=14, head=36)
            b = K.stagger(progress, 5, step=0.1, speed=4)
            if b > 0:
                gauge(draw, 1560, 560, 210, 0.78 * b, ink)
                K.pill(draw, 1560, 610, "Likely a cat!", LIK, size=40)
            return True
        if focus == "phone":
            hi = 0 if progress > 0.35 else -1
            phone(draw, 540, 550, 0.9, brand, "Happy", ["birthday", "Diwali", "new year"], hi, t)
            K.text_at(draw, "Seen most often after \"Happy\"", 1360, 260, font(40, bold=True), ink)
            bars = [("birthday", 1.0, coral), ("Diwali", 0.55, K.BOTH_COLOR), ("new year", 0.35, K.ROAD)]
            for i, (lab, frac, col) in enumerate(bars):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a <= 0:
                    continue
                y = 360 + i * 130
                draw.text((1000, y + 14), lab, font=font(40, bold=True), fill=ink)
                draw.rounded_rectangle((1200, y, 1200 + 520 * frac * a, y + 80), radius=20, fill=col)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1360, 760 + int((1 - a) * 20), "Picks the MOST LIKELY word", sage, size=38)
            return True
        # wrong
        boy(draw, 520, 500, 1.6, AARAV, t, cat_ears=True)
        K.text_at(draw, "Aarav, dressed up!", 520, 800, font(38, bold=True), muted)
        ai_laptop(draw, 1350, 560, 0.9, brand, t)
        K.draw_bubble(draw, (1060, 240, 1660, 360), brand, "Likely a cat!", tail="right", size=44)
        a = K.ease_out_cubic(K.clamp01((progress - 0.4) * 3))
        if a > 0:
            K.draw_cross(draw, 1660, 240, 40 * a + 1, IMP)
            K.pill(draw, 1350, 720, "Most likely is not certain", IMP, size=36)
            K.text_at(draw, "Oops! It's Aarav!", 1350, 806, font(38, bold=True), muted)
        return True

    # ---- checkpoint ------------------------------------------------------------------------
    if visual == "c17-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Impossible or unlikely?", cx, 450 + lift, font(64, bold=True), ink)
            die(draw, cx - 120, 630 + lift, 120, 6)
            die(draw, cx + 120, 630 + lift, 120, 7, face=(253, 236, 236), pip=IMP, outline=IMP)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "Rolling a 7 on a normal die?", 695, 260, font(48, bold=True), coral)
        for k, (lab, col) in enumerate((("Impossible", IMP), ("Unlikely", UNL))):
            x = 450 + k * 490
            win = ans and k == 0
            box = (x - 200, 350, x + 200, 460)
            if win:
                draw.rounded_rectangle(box, radius=55, fill=col)
                K.text_at(draw, lab, x, 380, font(50, bold=True), (255, 255, 255))
                K.draw_check(draw, x + 200, 360, 30, sage)
            else:
                draw.rounded_rectangle(box, radius=55, fill=panel, outline=col, width=5)
                K.text_at(draw, lab, x, 380, font(50, bold=True), col if not ans else (200, 192, 186))
        if ans:
            for i in range(6):
                a = K.stagger(progress, i, step=0.05, speed=6)
                if a > 0:
                    die(draw, 250 + i * 150, 580 + int((1 - a) * 20), 110, i + 1)
            die(draw, 1150, 580, 110, 7, face=(253, 236, 236), pip=IMP, outline=IMP)
            K.draw_cross(draw, 1200, 530, 22, IMP)
            a = K.stagger(progress, 4, step=0.1, speed=4)
            if a > 0:
                draw.text((190, 720 + int((1 - a) * 10)), "A die only has 1 to 6. No 7!", fill=ink,
                          font=font(48, bold=True))
        else:
            die(draw, 695, 620, 160, 7, face=(255, 255, 255), pip=ink)
            question_marks([(480, 560), (910, 560)], size=90)
            K.text_at(draw, "And why?", 695, 760, font(44, bold=True), muted)
        boy(draw, 1560, 520, 1.3, AARAV, t)
        if ans:
            K.draw_heart(draw, 1720, 380 + bounce, 30, coral)
            star_spots([(1380, 330), (1760, 660)])
        else:
            question_marks([(1730, 330)], size=80)
            K.draw_stopwatch(draw, 1560, 800, 44, progress, brand)
        return True

    # ---- recap -----------------------------------------------------------------------------
    if visual == "c17-recap":
        recap = [(("Impossible to", "certain"), coral, "line"), (("Coin: heads and", "tails equal"), K.GOLD, "coin"),
                 (("Fair = same", "chance for all"), sage, "fair"), (("AI picks the", "most likely"), K.BOT, "ai")]
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
                if kind == "line":
                    for k, (lab_, ccol, frac) in enumerate(CHANCE):
                        pie_icon(draw, ix - 135 + k * 90, iy - 30, 34, frac, ccol)
                    K.draw_arrow(draw, ix - 150, iy + 60, ix + 150, iy + 60, muted, width=8, head=22)
                elif kind == "coin":
                    coin(draw, ix - 75, iy, 64, "H")
                    coin(draw, ix + 75, iy, 64, "T")
                elif kind == "fair":
                    spinner(draw, ix - 60, iy, 82, [(90, LUDO["r"]), (90, LUDO["g"]), (90, LUDO["y"]), (90, LUDO["b"])],
                            -45)
                    die(draw, ix + 110, iy + 30, 84, 5)
                else:
                    ai_laptop(draw, ix, iy + 20, 0.6, brand, t)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            boy(draw, cx + 300, 410, 1.2, AARAV, t)
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Chance champion", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
