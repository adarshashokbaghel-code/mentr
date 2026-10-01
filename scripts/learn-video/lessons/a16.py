"""A16 · Jobs That Use Computers — visuals."""
import math
import re

import build as K

MOTION = (76, 151, 255)
LOOKS = (153, 102, 255)
EVENTS = (255, 191, 0)
CONTROL = (255, 171, 25)
SENSING = (92, 177, 214)
DATA = (255, 140, 26)
BLOCK_COLORS = {"hat": EVENTS, "move": MOTION, "say": LOOKS, "if": CONTROL, "data": DATA}
FLAG = (76, 191, 86)
FLAG_DARK = (46, 140, 60)
SKY = (214, 236, 255)
GRASS = (150, 206, 120)
DIRT = (176, 120, 80)
COIN = (255, 196, 40)
COIN_DARK = (214, 150, 20)
MAP_BG = (236, 242, 228)
PARK = (150, 206, 130)
BOX = (206, 156, 100)
BOX_DARK = (166, 116, 64)
WILLOW = (236, 204, 150)
BALL = (200, 40, 50)
OCEAN = (96, 164, 230)
LAND = (110, 190, 120)
PAPER = (255, 250, 238)
PAPER_LINE = (220, 210, 232)
BUDDY = (255, 120, 150)


def shade(c, k: float):
    return tuple(max(0, min(255, int(v * k))) for v in c)


def tint(c, k: float):
    return tuple(int(v + (255 - v) * k) for v in c)


# ---- Scratch-style blocks ------------------------------------------------------------

def _segs(text: str):
    out = []
    for m in re.finditer(r"\[([^\]]*)\]|\{([^}]*)\}|([^\[\{]+)", text):
        if m.group(1) is not None:
            out.append(("in", m.group(1)))
        elif m.group(2) is not None:
            out.append(("bool", m.group(2)))
        elif m.group(3).strip():
            out.append(("t", m.group(3).strip()))
    return out


def _seg_w(draw, seg, font, s):
    kind, txt = seg
    b = draw.textbbox((0, 0), txt, font=font)
    tw = b[2] - b[0]
    return tw + (40 * s if kind == "in" else 60 * s if kind == "bool" else 0)


def block_width(draw, text, s=1.0):
    font = K.load_font(int(30 * s), bold=True)
    segs = _segs(text)
    inner = sum(_seg_w(draw, sg, font, s) for sg in segs) + 12 * s * max(0, len(segs) - 1)
    return max(inner + 48 * s, 140 * s)


def _pts(x, y, W, H, s, top_notch=True, bump_dx=0.0):
    r, d = 8 * s, 10 * s
    n = [20 * s, 30 * s, 58 * s, 68 * s]
    pts = [(x, y + r), (x + r, y)]
    if top_notch:
        pts += [(x + n[0], y), (x + n[1], y + d), (x + n[2], y + d), (x + n[3], y)]
    pts += [(x + W - r, y), (x + W, y + r), (x + W, y + H - r), (x + W - r, y + H)]
    b = x + bump_dx
    pts += [(b + n[3], y + H), (b + n[2], y + H + d), (b + n[1], y + H + d), (b + n[0], y + H)]
    pts += [(x + r, y + H), (x, y + H - r)]
    return pts


def _block_text(draw, x, y, H, text, s):
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
        else:
            hx = [(xc, ym), (xc + 22 * s, ym - 25 * s), (xc + wd - 22 * s, ym - 25 * s), (xc + wd, ym),
                  (xc + wd - 22 * s, ym + 25 * s), (xc + 22 * s, ym + 25 * s)]
            draw.polygon(hx, fill=SENSING)
            draw.polygon(hx, outline=shade(SENSING, 0.8), width=max(2, int(3 * s)))
            draw.text((xc + wd / 2, ym), txt, fill=(255, 255, 255), font=font, anchor="mm")
        xc += wd + 12 * s


def block(draw, x, y, text, kind, s=1.0, width=None):
    col = BLOCK_COLORS.get(kind, MOTION)
    H = 72 * s
    W = width or block_width(draw, text, s)
    pts = _pts(x, y, W, H, s)
    draw.polygon([(px, py + 6 * s) for px, py in pts], fill=shade(col, 0.72))
    draw.polygon(pts, fill=col)
    if text:
        _block_text(draw, x, y, H, text, s)
    return W


def cblock(draw, x, y, head, inner, s=1.0, glow=False):
    H, A, B = 72 * s, 30 * s, 40 * s
    W = max(block_width(draw, head, s), 300 * s)
    ih = max(1, len(inner)) * H
    top = _pts(x, y, W, H, s, bump_dx=A)
    bot = _pts(x, y + H + ih, 220 * s, B, s, top_notch=False)
    spine = (x, y + H - 4, x + A, y + H + ih + 4)
    for pts in (top, bot):
        draw.polygon([(px, py + 6 * s) for px, py in pts], fill=shade(CONTROL, 0.72))
    draw.rectangle((spine[0], spine[1] + 6 * s, spine[2], spine[3] + 6 * s), fill=shade(CONTROL, 0.72))
    draw.rectangle(spine, fill=CONTROL)
    draw.polygon(top, fill=CONTROL)
    draw.polygon(bot, fill=CONTROL)
    if glow:
        draw.polygon(top, outline=K.GOLD, width=max(3, int(7 * s)))
    _block_text(draw, x, y, H, head, s)
    for i, (text, kind) in enumerate(inner):
        block(draw, x + A, y + H + i * H, text, kind, s)
    return H + ih + B


# ---- illustrations -------------------------------------------------------------------

def draw_buddy(draw, cx, cy, r, color=BUDDY, t=0.0, look=1) -> None:
    draw.ellipse((cx - r * 0.9, cy + r * 0.82, cx + r * 0.9, cy + r * 1.08), fill=K.SHADOW)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.45 - r * 0.25, cy + r * 0.75, cx + sx * r * 0.45 + r * 0.25, cy + r * 1.02),
                     fill=shade(color, 0.8))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)
    for sx in (-1, 1):
        ex = cx + sx * r * 0.36 + look * r * 0.08
        draw.ellipse((ex - r * 0.2, cy - r * 0.36, ex + r * 0.2, cy + r * 0.08), fill=(255, 255, 255))
        draw.ellipse((ex - r * 0.1 + look * r * 0.05, cy - r * 0.24, ex + r * 0.1 + look * r * 0.05, cy - r * 0.02),
                     fill=K.DEV_DEEP)
    draw.arc((cx - r * 0.38, cy + r * 0.02, cx + r * 0.38, cy + r * 0.5), 20, 160, fill=K.DEV_DEEP,
             width=max(2, int(r * 0.1)))
    draw.ellipse((cx - r * 0.62, cy - r * 0.62, cx - r * 0.3, cy - r * 0.42), fill=tint(color, 0.45))


def draw_phone(draw, cx, cy, s=1.0):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(120) + S(8), cy - S(230) + S(10), cx + S(120) + S(8), cy + S(230) + S(10)),
                           radius=S(34), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(120), cy - S(230), cx + S(120), cy + S(230)), radius=S(34), fill=K.DEV_DARK)
    scr = (cx - S(104), cy - S(196), cx + S(104), cy + S(196))
    draw.rectangle(scr, fill=(250, 250, 252))
    draw.rounded_rectangle((cx - S(30), cy - S(218), cx + S(30), cy - S(206)), radius=S(6), fill=K.DEV_MID)
    draw.ellipse((cx - S(12), cy + S(204), cx + S(12), cy + S(224)), fill=K.DEV_MID)
    return scr


def draw_tablet(draw, box):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=36, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=36, fill=K.DEV_DARK)
    draw.ellipse((x1 - 30, (y0 + y1) / 2 - 10, x1 - 10, (y0 + y1) / 2 + 10), fill=K.DEV_MID)
    return (x0 + 24, y0 + 24, x1 - 44, y1 - 24)


def draw_tv(draw, box):
    x0, y0, x1, y1 = box
    mx = (x0 + x1) / 2
    draw.line((mx - 60, y1, mx - 100, y1 + 40), fill=K.DEV_DARK, width=10)
    draw.line((mx + 60, y1, mx + 100, y1 + 40), fill=K.DEV_DARK, width=10)
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=28, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=28, fill=K.DEV_DARK)
    return (x0 + 22, y0 + 22, x1 - 22, y1 - 22)


def game_screen(draw, scr, t=0.0, score=4, hero_x=0.25, coin_on=True, labels=False):
    x0, y0, x1, y1 = scr
    wd, ht = x1 - x0, y1 - y0
    draw.rectangle(scr, fill=SKY)
    draw.ellipse((x0 + wd * 0.4, y0 + ht * 0.08, x0 + wd * 0.48, y0 + ht * 0.08 + wd * 0.08), fill=K.GOLD)
    gy = y1 - ht * 0.18
    draw.rectangle((x0, gy, x1, y1), fill=GRASS)
    draw.rectangle((x0, gy + ht * 0.05, x1, y1), fill=DIRT)
    plats = [(0.12, 0.55, 0.3), (0.55, 0.42, 0.25)]
    for px, py, pw in plats:
        draw.rounded_rectangle((x0 + wd * px, y0 + ht * py, x0 + wd * (px + pw), y0 + ht * py + ht * 0.06),
                               radius=8, fill=DIRT)
        draw.rectangle((x0 + wd * px, y0 + ht * py, x0 + wd * (px + pw), y0 + ht * py + ht * 0.02), fill=GRASS)
    cr = ht * 0.05
    coins = [(0.2, 0.47), (0.3, 0.47), (0.62, 0.34), (0.72, 0.34)]
    for k, (cx_, cy_) in enumerate(coins):
        ccx, ccy = x0 + wd * cx_, y0 + ht * cy_ + 4 * math.sin(t * 10 + k)
        draw.ellipse((ccx - cr, ccy - cr, ccx + cr, ccy + cr), fill=COIN, outline=COIN_DARK, width=3)
    kx = x0 + wd * 0.62
    if coin_on:
        ccy = gy - cr - 10 + 4 * math.sin(t * 10)
        draw.ellipse((kx - cr * 1.3, ccy - cr * 1.3, kx + cr * 1.3, ccy + cr * 1.3), fill=COIN, outline=COIN_DARK,
                     width=4)
    hx = x0 + wd * hero_x
    hr = ht * 0.08
    draw_buddy(draw, hx, gy - hr * 1.05, hr, MOTION, t)
    if wd > 500:
        font = K.load_font(32, bold=True)
        draw.rounded_rectangle((x0 + 16, y0 + 16, x0 + 230, y0 + 70), radius=16, fill=(255, 255, 255))
        draw.text((x0 + 34, y0 + 43), f"Score: {score}", fill=K.DEV_DEEP, font=font, anchor="lm")
        for k in range(3):
            K.draw_heart(draw, x1 - 50 - k * 50, y0 + 46, 18, K.DANGER)
    return (kx, gy), (hx, gy - hr)


def map_screen(draw, scr, t=0.0, route=1.0, query="City Park"):
    x0, y0, x1, y1 = scr
    wd, ht = x1 - x0, y1 - y0
    draw.rectangle(scr, fill=MAP_BG)
    draw.ellipse((x0 + wd * 0.5, y0 + ht * 0.14, x0 + wd * 1.05, y0 + ht * 0.42), fill=PARK)
    for k in range(3):
        tx = x0 + wd * (0.66 + k * 0.1)
        draw.ellipse((tx - 14, y0 + ht * 0.24 - 14, tx + 14, y0 + ht * 0.24 + 14), fill=(80, 160, 90))
    for fx in (0.28, 0.7):
        draw.line((x0 + wd * fx, y0, x0 + wd * fx, y1), fill=(255, 255, 255), width=16)
    for fy in (0.46, 0.78):
        draw.line((x0, y0 + ht * fy, x1, y0 + ht * fy), fill=(255, 255, 255), width=16)
    path = [(x0 + wd * 0.28, y0 + ht * 0.9), (x0 + wd * 0.28, y0 + ht * 0.46), (x0 + wd * 0.7, y0 + ht * 0.46),
            (x0 + wd * 0.7, y0 + ht * 0.32)]
    segl = [math.dist(path[i], path[i + 1]) for i in range(3)]
    total = sum(segl)
    left = total * K.clamp01(route)
    pts = [path[0]]
    for i in range(3):
        if left <= 0:
            break
        f = min(1.0, left / segl[i])
        pts.append((K.lerp(path[i][0], path[i + 1][0], f), K.lerp(path[i][1], path[i + 1][1], f)))
        left -= segl[i]
    if len(pts) > 1:
        draw.line(pts, fill=(255, 106, 26), width=12, joint="curve")
    draw.ellipse((path[0][0] - 14, path[0][1] - 14, path[0][0] + 14, path[0][1] + 14), fill=MOTION,
                 outline=(255, 255, 255), width=4)
    if route >= 0.98:
        K.draw_map_pin(draw, path[-1][0], path[-1][1], 0.5, K.DANGER)
    if query:
        draw.rounded_rectangle((x0 + 14, y0 + 14, x1 - 14, y0 + 74), radius=30, fill=(255, 255, 255),
                               outline=K.DEV_MID, width=2)
        K.draw_magnifier(draw, x0 + 46, y0 + 42, 0.14, K.DEV_MID)
        draw.text((x0 + 76, y0 + 44), query, fill=K.DEV_DEEP, font=K.load_font(28, bold=True), anchor="lm")


QR = [
    "1111111010111",
    "1000001001001",
    "1011101011101",
    "1011101000101",
    "1011101011001",
    "1000001010111",
    "1111111010101",
    "0000000011000",
    "1101011101011",
    "0110100100110",
    "1011011011011",
    "0100110110100",
    "1101101001101",
]


def qr_code(draw, cx, cy, size) -> None:
    n = len(QR)
    c = size / n
    x0, y0 = cx - size / 2, cy - size / 2
    draw.rectangle((x0 - 12, y0 - 12, x0 + size + 12, y0 + size + 12), fill=(255, 255, 255))
    for r, row in enumerate(QR):
        for k, ch in enumerate(row):
            if ch == "1":
                draw.rectangle((x0 + k * c, y0 + r * c, x0 + (k + 1) * c, y0 + (r + 1) * c), fill=K.DEV_DEEP)


def upi_screen(draw, scr, t=0.0, paid=False):
    x0, y0, x1, y1 = scr
    mx = (x0 + x1) / 2
    draw.rectangle(scr, fill=(240, 244, 255))
    draw.rectangle((x0, y0, x1, y0 + 70), fill=K.BOTH_COLOR)
    draw.text((mx, y0 + 35), "Scan & Pay", fill=(255, 255, 255), font=K.load_font(30, bold=True), anchor="mm")
    if paid:
        draw.ellipse((mx - 80, y0 + 140, mx + 80, y0 + 300), fill=(13, 148, 136))
        draw.line([(mx - 38, y0 + 222), (mx - 8, y0 + 252), (mx + 44, y0 + 192)], fill=(255, 255, 255), width=16,
                  joint="curve")
        draw.text((mx, y0 + 350), "Paid!", fill=(13, 148, 136), font=K.load_font(48, bold=True), anchor="mm")
    else:
        qs = min(x1 - x0 - 60, 200)
        qr_code(draw, mx, y0 + 230, qs)
        ly = y0 + 230 - qs / 2 + qs * ((t * 2) % 1)
        draw.line((mx - qs / 2 - 10, ly, mx + qs / 2 + 10, ly), fill=K.DANGER, width=5)


def draw_controller(draw, cx, cy, s=1.0, col=K.DEV_DARK) -> None:
    def S(v):
        return v * s
    draw.ellipse((cx - S(130), cy - S(50), cx - S(30), cy + S(70)), fill=col)
    draw.ellipse((cx + S(30), cy - S(50), cx + S(130), cy + S(70)), fill=col)
    draw.rounded_rectangle((cx - S(90), cy - S(54), cx + S(90), cy + S(30)), radius=S(30), fill=col)
    draw.rectangle((cx - S(86), cy - S(8), cx - S(46), cy + S(8)), fill=(255, 255, 255))
    draw.rectangle((cx - S(74), cy - S(20), cx - S(58), cy + S(20)), fill=(255, 255, 255))
    for (dx, dy, c) in ((60, -14, K.DANGER), (84, 6, K.GOLD), (60, 26, (76, 191, 86)), (36, 6, MOTION)):
        draw.ellipse((cx + S(dx) - S(10), cy + S(dy) - S(10), cx + S(dx) + S(10), cy + S(dy) + S(10)), fill=c)


def app_tiles(draw, scr, t=0.0) -> None:
    x0, y0, x1, y1 = scr
    wd = x1 - x0
    cols = [K.DANGER, (76, 191, 86), MOTION, K.GOLD, K.BOTH_COLOR, (13, 148, 136), (255, 106, 26), SENSING, BUDDY]
    gap = wd * 0.08
    tw = (wd - 4 * gap) / 3
    for i, c in enumerate(cols):
        r, k = divmod(i, 3)
        tx = x0 + gap + k * (tw + gap)
        ty = y0 + gap * 2 + r * (tw + gap * 1.5)
        if ty + tw > y1 - 10:
            break
        draw.rounded_rectangle((tx, ty, tx + tw, ty + tw), radius=tw * 0.25, fill=c)
        g = tw * 0.22
        if i == 0:
            K.draw_map_pin(draw, tx + tw / 2, ty + tw * 0.78, tw / 160, (255, 255, 255))
        elif i == 4:
            draw.rectangle((tx + g, ty + g, tx + tw - g, ty + tw - g), outline=(255, 255, 255), width=4)
        else:
            draw.ellipse((tx + g * 1.4, ty + g * 1.4, tx + tw - g * 1.4, ty + tw - g * 1.4), fill=(255, 255, 255))


def draw_box(draw, cx, cy, s=1.0) -> None:
    def S(v):
        return v * s
    draw.rectangle((cx - S(60) + S(6), cy - S(50) + S(8), cx + S(60) + S(6), cy + S(50) + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - S(60), cy - S(50), cx + S(60), cy + S(50)), fill=BOX, outline=BOX_DARK,
                   width=max(2, int(S(4))))
    draw.rectangle((cx - S(12), cy - S(50), cx + S(12), cy + S(50)), fill=(232, 210, 160))


def draw_shelf(draw, x0, y0, x1, y1, s=1.0) -> None:
    draw.rectangle((x0, y0, x0 + 14, y1), fill=K.STEEL_DARK)
    draw.rectangle((x1 - 14, y0, x1, y1), fill=K.STEEL_DARK)
    for k in range(3):
        yy = y0 + (y1 - y0) * (k + 1) / 3
        draw.rectangle((x0, yy - 10, x1, yy), fill=K.STEEL)


def draw_hardhat(draw, cx, cy, s, t=0.0) -> None:
    cy = cy + 6 * s * math.sin(t * math.pi * 4)
    r = 64 * s
    draw.chord((cx - r * 1.1, cy - r * 1.5, cx + r * 1.1, cy + r * 0.0), 180, 360, fill=K.GOLD)
    draw.rounded_rectangle((cx - r * 1.3, cy - r * 0.84, cx + r * 1.3, cy - r * 0.66), radius=r * 0.08,
                           fill=(230, 160, 30))
    draw.rectangle((cx - r * 0.1, cy - r * 1.48, cx + r * 0.1, cy - r * 0.8), fill=(230, 160, 30))


def draw_bat(draw, cx, cy, s=1.0, ang=0.6) -> None:
    ca, sa = math.cos(ang), math.sin(ang)

    def P(px, py):
        return (cx + (px * ca - py * sa) * s, cy + (px * sa + py * ca) * s)
    draw.polygon([P(-14, -150), P(14, -150), P(14, -60), P(-14, -60)], fill=K.DEV_DARK)
    draw.polygon([P(-30, -64), P(30, -64), P(34, 120), P(0, 136), P(-34, 120)], fill=WILLOW)
    draw.polygon([P(-30, -64), P(30, -64), P(34, 120), P(0, 136), P(-34, 120)], outline=(196, 160, 100),
                 width=max(2, int(4 * s)))


def draw_ball(draw, cx, cy, r) -> None:
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=BALL)
    draw.arc((cx - r * 0.6, cy - r * 1.1, cx + r * 1.6, cy + r * 1.1), 140, 220, fill=(255, 230, 230),
             width=max(2, int(r * 0.14)))


def draw_stumps(draw, cx, by, s=1.0) -> None:
    for k in (-1, 0, 1):
        x = cx + k * 24 * s
        draw.rectangle((x - 6 * s, by - 150 * s, x + 6 * s, by), fill=WILLOW, outline=(196, 160, 100))
    draw.rectangle((cx - 34 * s, by - 158 * s, cx + 34 * s, by - 150 * s), fill=WILLOW)


def draw_globe(draw, cx, cy, r, t=0.0) -> None:
    draw.ellipse((cx - r + 10, cy - r + 12, cx + r + 10, cy + r + 12), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=OCEAN)
    wob = 0.04 * math.sin(t * 4)
    for dx, dy, rw, rh in ((-0.4, -0.25, 0.3, 0.22), (0.2, -0.45, 0.25, 0.16), (0.3, 0.2, 0.35, 0.28),
                           (-0.3, 0.45, 0.22, 0.16)):
        ex = cx + (dx + wob) * r
        ey = cy + dy * r
        draw.ellipse((ex - rw * r, ey - rh * r, ex + rw * r, ey + rh * r), fill=LAND)
    draw.arc((cx - r, cy - r, cx + r, cy + r), 0, 360, fill=shade(OCEAN, 0.75), width=6)
    draw.arc((cx - r * 0.7, cy - r * 0.7, cx + r * 0.1, cy + r * 0.1), 190, 250, fill=(255, 255, 255),
             width=max(3, int(r * 0.06)))


def draw_paper(draw, box, lines=5, gap=100, top=160) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=22, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=22, fill=PAPER)
    for k in range(lines):
        yy = y0 + top + k * gap
        if yy < y1 - 20:
            draw.line((x0 + 30, yy, x1 - 30, yy), fill=PAPER_LINE, width=3)
    draw.line((x0 + 84, y0 + 12, x0 + 84, y1 - 12), fill=(240, 170, 170), width=3)


def chai_stall(draw, cx, by, s, t, brand) -> None:
    def S(v):
        return v * s
    x0, x1 = cx - S(240), cx + S(240)
    draw.rectangle((x0 + S(20), by - S(340), x0 + S(36), by), fill=BOX_DARK)
    draw.rectangle((x1 - S(36), by - S(340), x1 - S(20), by), fill=BOX_DARK)
    for k in range(8):
        col = K.DANGER if k % 2 == 0 else (255, 255, 255)
        sx = x0 + k * (x1 - x0) / 8
        draw.polygon([(sx, by - S(400)), (sx + (x1 - x0) / 8, by - S(400)), (sx + (x1 - x0) / 8, by - S(330)),
                      (sx, by - S(330))], fill=col)
    for k in range(8):
        sx = x0 + k * (x1 - x0) / 8
        draw.chord((sx, by - S(352), sx + (x1 - x0) / 8, by - S(310)), 0, 180,
                   fill=K.DANGER if k % 2 == 0 else (255, 255, 255))
    draw.rectangle((x0 + S(10) + S(8), by - S(150) + S(10), x1 - S(10) + S(8), by + S(10)), fill=K.SHADOW)
    draw.rectangle((x0 + S(10), by - S(150), x1 - S(10), by), fill=BOX)
    draw.rectangle((x0 + S(10), by - S(150), x1 - S(10), by - S(126)), fill=BOX_DARK)
    draw.text((cx, by - S(60)), "CHAI", fill=(255, 255, 255), font=K.load_font(max(26, int(S(56))), bold=True),
              anchor="mm")
    K.draw_cup(draw, cx - S(110), by - S(210), 0.55 * s, t)
    K.draw_cup(draw, cx + S(80), by - S(210), 0.55 * s, t + 0.3)


def job_icon(draw, kind, x, y, s, t, brand) -> None:
    if kind == "game":
        draw_controller(draw, x, y, 1.0 * s)
    elif kind == "app":
        scr = draw_phone(draw, x, y, 0.42 * s)
        app_tiles(draw, scr, t)
    elif kind == "anim":
        for k in range(3):
            fx = x - 90 * s + k * 90 * s
            draw.rounded_rectangle((fx - 40 * s, y - 50 * s, fx + 40 * s, y + 50 * s), radius=8 * s,
                                   fill=(255, 255, 255), outline=K.DEV_DARK, width=max(2, int(4 * s)))
            draw_buddy(draw, fx, y + 8 * s - k * 16 * s, 20 * s, BUDDY, t)
    else:
        K.draw_robot(draw, x, y + 40 * s, 0.34 * s, t, mood="happy")


BUDDY_DARK = (214, 64, 110)
JOBS = [("game", "Game developer", MOTION), ("app", "App developer", (13, 148, 136)),
        ("anim", "Animator", BUDDY_DARK), ("robot", "Robotics engineer", K.BOTH_COLOR)]


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
    pink_soft = K.hex_rgb("#FFE9EF")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    F = K.load_font

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def stars_pts(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(draw, sx, sy + 10 * math.sin(t * 9 + i), 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4],
                        rot=t * 3 + i)

    def bubble(box, text, tail="left", size=38):
        K.draw_bubble(draw, box, brand, text, tail=tail, size=size)

    def labelled_card(x0, y0, wd, ht, soft, col, active=True):
        draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + wd + 8, y0 + ht + 10), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle((x0, y0, x0 + wd, y0 + ht), radius=36, fill=soft if active else panel,
                               outline=col if active else line, width=6 if active else 3)

    def center_lines(text, x, y, size, col, maxw, lh=None):
        font = F(size, bold=True)
        for j, ln in enumerate(K.wrap_text(text, font, maxw)):
            K.text_at(draw, ln, x, y + j * (lh or int(size * 1.22)), font, col)

    def score_box(x, y, s, val="5"):
        draw.rounded_rectangle((x - 90 * s + 8, y - 70 * s + 10, x + 90 * s + 8, y + 70 * s + 10), radius=18 * s,
                               fill=K.SHADOW)
        draw.rounded_rectangle((x - 90 * s, y - 70 * s, x + 90 * s, y + 70 * s), radius=18 * s, fill=BOX)
        draw.polygon([(x - 90 * s, y - 70 * s), (x - 60 * s, y - 100 * s), (x + 60 * s, y - 100 * s),
                      (x + 90 * s, y - 70 * s)], fill=BOX_DARK)
        draw.rounded_rectangle((x - 70 * s, y - 50 * s, x + 70 * s, y - 10 * s), radius=8 * s, fill=(255, 255, 255))
        K.text_at(draw, "score", x, y - 48 * s, F(max(26, int(30 * s)), bold=True), K.DEV_DEEP)
        K.text_at(draw, val, x, y - 6 * s, F(max(26, int(60 * s)), bold=True), (255, 255, 255))

    def numbered_list(x, y, s, col, n=3):
        for k in range(n):
            yy = y + k * 60 * s
            draw.ellipse((x - 24 * s, yy - 24 * s, x + 24 * s, yy + 24 * s), fill=col)
            K.text_at(draw, str(k + 1), x, yy - 18 * s, F(max(26, int(30 * s)), bold=True), (255, 255, 255))
            draw.rounded_rectangle((x + 40 * s, yy - 10 * s, x + 200 * s, yy + 10 * s), radius=10 * s, fill=line)

    # ---- opening -------------------------------------------------------------------
    if visual == "a16-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            draw_globe(draw, cx + 300, 450, 150, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, F(60, bold=True), ink)
            stars_around(330, 520)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "UNIT 3 · BUILDING WITH BLOCKS", cx, 330 + lift, F(34, bold=True), sage)
            chips = ["Blocks", "Moving", "Variables", "If · else", "Mini program"]
            for i, lab in enumerate(chips):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 470 + i * 245
                y = 450 + int((1 - a) * 40)
                draw.ellipse((x - 70, y - 70, x + 70, y + 70), fill=sage_soft)
                K.draw_check(draw, x, y, 46, sage)
                center_lines(lab, x, y + 92, 30, ink, 220, 36)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 720 + int((1 - a) * 20), "ALL DONE!", coral, size=40)
            return True
        if focus == "unit":
            draw.ellipse((480 - 260, 560 - 260, 480 + 260, 560 + 260), fill=blue_soft)
            draw_globe(draw, 480, 560, 170, t)
            orbit = [("game", 0.0), ("app", 2.1), ("robot", 4.2)]
            for k, (kind, a0) in enumerate(orbit):
                ang = a0 + t * 1.2
                ox, oy = 480 + math.cos(ang) * 235, 560 + math.sin(ang) * 210
                draw.ellipse((ox - 56, oy - 56, ox + 56, oy + 56), fill=panel, outline=line, width=3)
                job_icon(draw, kind, ox, oy, 0.36 if kind != "game" else 0.34, t, brand)
            K.pill(draw, 0, 280 + lift, "UNIT 4", coral, size=34, left=900)
            K.text_at(draw, "Computers in", 1300, 360 + lift, F(84, bold=True), ink)
            K.text_at(draw, "Our World", 1300, 460 + lift, F(84, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a > 0:
                    x = 1060 + i * 120
                    y = 640 + int((1 - a) * 30)
                    first = i == 0
                    draw.rounded_rectangle((x - 46, y, x + 46, y + 92), radius=22, fill=coral_soft if first else panel,
                                           outline=coral if first else line, width=5 if first else 3)
                    K.text_at(draw, str(i + 1), x, y + 16, F(46, bold=True), coral if first else muted)
            K.text_at(draw, "A brand new unit!", 1300, 770, F(34, bold=True), coral)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 300 + lift, F(32, bold=True), coral)
            K.text_at(draw, "Jobs That Use Computers", cx, 360 + lift, F(84, bold=True), ink)
            softs = [blue_soft, sage_soft, pink_soft, lav_soft]
            for i, (kind, lab, col) in enumerate(JOBS):
                a = K.stagger(progress, i + 1, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 330
                y = 690 + int((1 - a) * 30)
                draw.ellipse((x - 110, y - 110, x + 110, y + 110), fill=softs[i], outline=col, width=5)
                job_icon(draw, kind, x, y, 0.75, t, brand)
            return True
        # wonder
        scr = draw_tablet(draw, (140, 300, 860, 720))
        game_screen(draw, scr, t, 4, 0.25 + 0.2 * t)
        tv = draw_tv(draw, (1060, 300, 1780, 720))
        draw.rectangle(tv, fill=(255, 236, 214))
        draw.rectangle((tv[0], tv[3] - 70, tv[2], tv[3]), fill=GRASS)
        draw_buddy(draw, K.lerp(tv[0] + 120, tv[2] - 120, (t * 1.3) % 1), tv[3] - 150 - 60 * abs(math.sin(t * 9)), 70,
                   BUDDY, t)
        K.text_at(draw, "?", cx, 380, F(int(150 + 20 * pulse), bold=True), K.GOLD)
        K.text_at(draw, "Who makes these?", cx, 790, F(48, bold=True), ink)
        return True

    # ---- Meera's Sunday ---------------------------------------------------------------
    if visual == "a16-hook":
        if focus == "meet":
            draw.ellipse((560 - 270, 540 - 270, 560 + 270, 540 + 270), fill=lav_soft)
            K.draw_person(draw, 560, 470, 1.45, "mom", t)
            K.text_at(draw, "Meet", 1300, 280 + lift, F(60, bold=True), muted)
            K.text_at(draw, "Meera!", 1300, 350 + lift, F(130, bold=True), K.BOTH_COLOR)
            K.pill(draw, 1300, 540, "loves drawing & stories", coral, size=36)
            draw_paper(draw, (1080, 640, 1380, 850), lines=0)
            draw.ellipse((1250, 670, 1320, 740), fill=K.GOLD)
            draw.polygon([(1130, 820), (1200, 730), (1270, 820)], fill=sage)
            draw.rectangle((1150, 770, 1250, 830), fill=coral)
            draw.polygon([(1140, 772), (1200, 720), (1260, 772)], fill=K.DANGER)
            book = (1460, 680, 1700, 830)
            draw.rounded_rectangle(book, radius=14, fill=K.BOTH_COLOR)
            draw.rectangle((1575, 680, 1585, 830), fill=shade(K.BOTH_COLOR, 0.75))
            K.draw_star(draw, 1520, 755, 26, K.GOLD)
            K.draw_star(draw, 1640, 755, 26, K.GOLD, rot=0.6)
            return True
        if focus == "day":
            labels = ["Game", "Cartoon", "Pay at the chai stall", "Maps app"]
            softs = [blue_soft, pink_soft, lav_soft, sage_soft]
            cols = [MOTION, BUDDY, K.BOTH_COLOR, sage]
            for i, lab in enumerate(labels):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x0 = 110 + i * 435
                y0 = 260 + int((1 - a) * 40)
                labelled_card(x0, y0, 400, 580, softs[i], cols[i])
                K.pill(draw, 0, y0 + 24, str(i + 1), cols[i], size=28, left=x0 + 24)
                mx = x0 + 200
                if i == 0:
                    scr = draw_tablet(draw, (x0 + 30, y0 + 110, x0 + 370, y0 + 330))
                    game_screen(draw, scr, t, 4, 0.3)
                elif i == 1:
                    tv = draw_tv(draw, (x0 + 40, y0 + 110, x0 + 360, y0 + 320))
                    draw.rectangle(tv, fill=(255, 236, 214))
                    draw.rectangle((tv[0], tv[3] - 40, tv[2], tv[3]), fill=GRASS)
                    draw_buddy(draw, mx + 40 * math.sin(t * 6), tv[3] - 80 - 30 * abs(math.sin(t * 9)), 46, BUDDY, t)
                elif i == 2:
                    scr = draw_phone(draw, mx - 70, y0 + 250, 0.58)
                    draw.rectangle(scr, fill=(240, 244, 255))
                    qr_code(draw, mx - 70, y0 + 250, 90)
                    K.draw_cup(draw, mx + 100, y0 + 300, 0.6, t)
                else:
                    scr = draw_phone(draw, mx, y0 + 250, 0.58)
                    map_screen(draw, scr, t, route=1.0, query=None)
                center_lines(lab, mx, y0 + 430, 38, ink, 340, 46)
            return True
        if focus == "ask":
            draw.ellipse((cx - 260, 540 - 260, cx + 260, 540 + 260), fill=gold_soft)
            K.draw_person(draw, cx, 460, 1.3, "mystery", t)
            spots = [(420, 360, "game"), (1500, 360, "tv"), (420, 720, "upi"), (1500, 720, "map")]
            for k, (x, y, kind) in enumerate(spots):
                draw.ellipse((x - 120, y - 110, x + 120, y + 110), fill=panel, outline=line, width=3)
                if kind == "game":
                    draw_controller(draw, x, y, 0.9)
                elif kind == "tv":
                    tv = draw_tv(draw, (x - 90, y - 70, x + 90, y + 50))
                    draw.rectangle(tv, fill=(255, 236, 214))
                    draw_buddy(draw, x, y, 26, BUDDY, t)
                elif kind == "upi":
                    qr_code(draw, x, y, 120)
                else:
                    K.draw_map_pin(draw, x, y + 60, 1.1, K.DANGER)
            for k, (qx, qy) in enumerate(((760, 300), (1160, 300), (720, 760), (1200, 760))):
                K.text_at(draw, "?", qx, qy - 40, F(int(80 + 20 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1760, 260 + 30, 40, progress, brand)
            return True
        # people
        kinds = ["teacher", "dad", "mom", "friend"]
        for i, kind in enumerate(kinds):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1.5) * 420
            y = 420 + int((1 - a) * 30)
            draw.ellipse((x - 170, y - 150, x + 170, y + 190), fill=[sage_soft, blue_soft, lav_soft, gold_soft][i])
            K.draw_person(draw, x, y, 0.85, kind, t + i * 0.2)
            K.draw_device(draw, "laptop", x, y + 250, 0.62, brand, t)
        a = K.stagger(progress, 5, 0.1, 4)
        if a > 0:
            K.pill(draw, cx, 800 + int((1 - a) * 10), "Real people, using computers!", coral, size=34)
        return True

    # ---- four jobs ----------------------------------------------------------------------
    if visual == "a16-jobs":
        if focus == "four":
            softs = [blue_soft, sage_soft, pink_soft, lav_soft]
            for i, (kind, lab, col) in enumerate(JOBS):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x0 = 110 + i * 435
                y0 = 260 + int((1 - a) * 40)
                labelled_card(x0, y0, 400, 580, softs[i], col)
                job_icon(draw, kind, x0 + 200, y0 + 230, 1.15, t, brand)
                center_lines(lab, x0 + 200, y0 + 420, 44, col, 360, 52)
            return True
        # builder
        draw.ellipse((470 - 260, 550 - 260, 470 + 260, 550 + 260), fill=gold_soft)
        K.draw_person(draw, 470, 450, 1.2, "dad", t)
        draw_hardhat(draw, 470, 450, 1.2, t)
        K.draw_device(draw, "laptop", 470, 740, 0.85, brand, t)
        K.text_at(draw, "Developer", 1300, 270 + lift, F(84, bold=True), coral)
        K.text_at(draw, "=", 1300, 370 + lift, F(70, bold=True), muted)
        K.text_at(draw, "a builder!", 1300, 450 + lift, F(84, bold=True), sage)
        cols = [MOTION, K.GOLD, BUDDY, sage, K.BOTH_COLOR, coral]
        n_b = int(progress * 10)
        for k in range(min(9, n_b)):
            row, c = divmod(k, 3) if k < 9 else (2, 2)
            bx = 1120 + c * 130 + (65 if row % 2 else 0)
            by = 780 - row * 60
            draw.rounded_rectangle((bx, by, bx + 120, by + 52), radius=10, fill=cols[k % len(cols)])
        return True

    # ---- game developer -------------------------------------------------------------------
    if visual == "a16-game":
        if focus == "meet":
            K.draw_person(draw, 330, 430, 1.1, "dad", t)
            K.draw_device(draw, "laptop", 330, 720, 0.8, brand, t)
            scr = draw_tablet(draw, (740, 260, 1780, 820))
            game_screen(draw, scr, t, 4, 0.25)
            tags = [("Levels", (1420, 560)), ("Characters", (1200, 640)), ("Rules", (1060, 380))]
            for i, (lab, (tx, ty)) in enumerate(tags):
                a = K.stagger(progress, i + 1, step=0.18, speed=4)
                if a > 0:
                    K.pill(draw, tx, ty - int((1 - a) * 20), lab, coral, size=34)
            return True
        if focus == "code":
            K.text_at(draw, "The game developer writes:", 460, 270, F(36, bold=True), muted)
            cblock(draw, 120, 360, "if {touching coin?} then", [("change [score] by [1]", "data")], 1.3,
                   glow=progress > 0.6)
            scr = draw_tablet(draw, (960, 270, 1790, 800))
            hit = progress > 0.62
            hero = K.lerp(0.25, 0.62, K.ease_in_out(K.clamp01((progress - 0.1) * 1.9)))
            (kx, gy), _ = game_screen(draw, scr, t, 5 if hit else 4, hero, coin_on=not hit)
            if hit:
                K.text_at(draw, "+1", kx + 110, gy - 170 - 30 * K.clamp01((progress - 0.62) * 3), F(64, bold=True),
                          coral)
                for k in range(4):
                    ang = k * math.pi / 2 + t * 4
                    K.draw_star(draw, kx + math.cos(ang) * 80, gy - 50 + math.sin(ang) * 40, 16, K.GOLD, rot=t * 5)
            return True
        # ideas
        cblock(draw, 120, 330, "if {touching coin?} then", [("change [score] by [1]", "data")], 1.2)
        K.pill(draw, 0, 620, "From Unit 3!", sage, size=34, left=160)
        cards = [("If-block", "makes a choice", CONTROL, gold_soft), ("Variable", "a box that holds a number", DATA,
                                                                      coral_soft)]
        for i, (title, sub, col, soft) in enumerate(cards):
            a = K.stagger(progress, i, step=0.3, speed=4)
            if a <= 0:
                continue
            y0 = 270 + i * 290 + int((1 - a) * 30)
            labelled_card(1000, y0, 780, 250, soft, col)
            draw.text((1260, y0 + 50), title, fill=col, font=F(54, bold=True))
            for j, ln in enumerate(K.wrap_text(sub, F(38, bold=True), 480)):
                draw.text((1260, y0 + 130 + j * 46), ln, fill=ink, font=F(38, bold=True))
            if i == 0:
                fx, fy = 1130, y0 + 125
                draw.line((fx - 60, fy + 60, fx, fy), fill=K.DEV_DARK, width=12)
                K.draw_arrow(draw, fx, fy, fx + 50, fy - 60, sage, width=12, head=30)
                K.draw_arrow(draw, fx, fy, fx + 70, fy + 30, K.DANGER, width=12, head=30)
            else:
                score_box(1130, y0 + 150, 0.8)
            ay = 360 + 36 if i == 0 else 360 + 94 + 36
            ax0 = 760 if i == 0 else 760
            K.draw_arrow(draw, ax0, ay, 990, y0 + 125, col, width=8, head=26)
        return True

    # ---- app developer ---------------------------------------------------------------------
    if visual == "a16-app":
        if focus == "meet":
            K.draw_person(draw, 380, 450, 1.2, "teacher", t)
            scr = draw_phone(draw, 1020, 560, 1.25)
            app_tiles(draw, scr, t)
            tb = draw_tablet(draw, (1300, 380, 1780, 740))
            draw.rectangle(tb, fill=(250, 250, 252))
            app_tiles(draw, (tb[0] + 60, tb[1], tb[2] - 60, tb[3]), t)
            K.pill(draw, 1540, 790, "Phones & tablets", sage, size=34)
            return True
        if focus == "maps":
            scr = draw_phone(draw, 520, 560, 1.3)
            map_screen(draw, scr, t, route=K.clamp01((progress - 0.25) * 1.8))
            rows = [("1", "You type a place", MOTION), ("2", "It shows the way", coral)]
            for i, (num, lab, col) in enumerate(rows):
                a = K.stagger(progress, i * 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                y = 330 + i * 220 + int((1 - a) * 30)
                draw.rounded_rectangle((900, y, 1760, y + 160), radius=40, fill=panel, outline=col, width=5)
                draw.ellipse((930, y + 40, 1010, y + 120), fill=col)
                K.text_at(draw, num, 970, y + 48, F(48, bold=True), (255, 255, 255))
                draw.text((1050, y + 52), lab, fill=ink, font=F(52, bold=True))
            a = K.stagger(progress, 5, 0.1, 4)
            if a > 0:
                K.pill(draw, 1330, 780 + int((1 - a) * 10), "Built by app developers", sage, size=34)
            return True
        # upi
        chai_stall(draw, 420, 800, 1.0, t, brand)
        paid = progress > 0.55
        scr = draw_phone(draw, 1060, 560, 1.25)
        upi_screen(draw, scr, t, paid)
        if paid:
            K.pill(draw, 1560, 420, "One scan!", K.BOTH_COLOR, size=40)
            K.pill(draw, 1560, 540, "Paid!", sage, size=40)
            stars_pts([(1450, 680), (1680, 680)])
        else:
            K.draw_arrow(draw, 1250, 560, 1420, 560, muted, width=10, head=28)
            K.pill(draw, 1580, 530, "Scan…", muted, size=36)
        return True

    # ---- animator ------------------------------------------------------------------------
    if visual == "a16-anim":
        if focus == "meet":
            K.draw_person(draw, 360, 440, 1.15, "friend", t)
            draw.line((470, 620, 560, 520), fill=K.DEV_DARK, width=12)
            draw.ellipse((548, 508, 572, 532), fill=coral)
            tv = draw_tv(draw, (760, 250, 1760, 730))
            draw.rectangle(tv, fill=(255, 236, 214))
            draw.ellipse((tv[2] - 200, tv[1] + 30, tv[2] - 100, tv[1] + 130), fill=K.GOLD)
            draw.rectangle((tv[0], tv[3] - 100, tv[2], tv[3]), fill=GRASS)
            bx = K.lerp(tv[0] + 160, tv[2] - 160, 0.5 + 0.5 * math.sin(t * 5))
            draw_buddy(draw, bx, tv[3] - 190 - 100 * abs(math.sin(t * 8)), 85, BUDDY, t)
            K.pill(draw, 1260, 800, "Cartoons & moving pictures", BUDDY_DARK, size=32)
            return True
        if focus == "frames":
            for i in range(4):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                x0 = 140 + i * 420
                y0 = 260 + int((1 - a) * 30)
                draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 380 + 8, y0 + 250 + 10), radius=20, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 380, y0 + 250), radius=20, fill=(255, 255, 255),
                                       outline=K.DEV_DARK, width=5)
                draw.rectangle((x0 + 10, y0 + 200, x0 + 370, y0 + 240), fill=GRASS)
                bx = x0 + 90 + i * 60
                by = y0 + 150 - [0, 40, 70, 40][i]
                draw_buddy(draw, bx, by, 42, BUDDY, 0)
                K.pill(draw, 0, y0 + 14, str(i + 1), K.BOTH_COLOR, size=26, left=x0 + 300)
                if i < 3:
                    K.draw_arrow(draw, x0 + 384, y0 + 125, x0 + 416, y0 + 125, muted, width=8, head=20)
            cblock(draw, 160, 600, "repeat [10]", [("move [5] steps", "move")], 1.05)
            K.text_at(draw, "a little, again and again", 380, 820, F(32, bold=True), muted)
            a = K.stagger(progress, 5, 0.1, 4)
            if a > 0:
                K.draw_arrow(draw, 760, 700, 960, 700, coral, width=14, head=40)
                K.text_at(draw, "Play fast…", 1300, 620, F(56, bold=True), ink)
                K.text_at(draw, "it moves!", 1300, 700, F(72, bold=True), coral)
                stars_pts([(1060, 650), (1560, 640), (1300, 820)])
            return True
        # ask / answer
        ans = focus == "answer"
        K.draw_person(draw, 340, 440, 1.15, "mom", t)
        draw_paper(draw, (170, 700, 510, 860), lines=0)
        draw_buddy(draw, 300, 780, 40, BUDDY, t)
        K.draw_star(draw, 420, 770, 28, K.GOLD, rot=t * 2)
        opts = ["Server repair", "Animator", "Keyboard maker", "Robot mechanic"]
        for i, lab in enumerate(opts):
            y = 270 + i * 145
            win = ans and i == 1
            dim = ans and i != 1
            fill = sage_soft if win else panel
            draw.rounded_rectangle((900 + 8, y + 10, 1760 + 8, y + 120 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((900, y, 1760, y + 120), radius=36, fill=fill, outline=sage if win else line,
                                   width=6 if win else 3)
            K.pill(draw, 0, y + 34, "ABCD"[i], sage if win else (line if dim else K.BOTH_COLOR), size=30, left=930)
            draw.text((1030, y + 36), lab, fill=muted if dim else ink, font=F(46, bold=True))
            if win:
                K.draw_check(draw, 1700, y + 60, 30, sage)
        if ans:
            stars_pts([(800, 360), (840, 520)])
        else:
            K.draw_stopwatch(draw, 790, 330, 44, progress, brand)
        return True

    # ---- robotics engineer -------------------------------------------------------------
    if visual == "a16-robot":
        if focus == "meet":
            K.draw_person(draw, 330, 450, 1.15, "dad", t)
            draw_hardhat(draw, 330, 450, 1.15, t)
            K.draw_robot(draw, 920, 600, 0.85, t, mood="happy", wave=t)
            items = [("Builds robots", K.BOTH_COLOR), ("Writes their steps", coral)]
            for i, (lab, col) in enumerate(items):
                a = K.stagger(progress, i + 1, step=0.25, speed=4)
                if a <= 0:
                    continue
                y = 340 + i * 200 + int((1 - a) * 30)
                draw.rounded_rectangle((1240, y, 1800, y + 140), radius=40, fill=panel, outline=col, width=5)
                draw.ellipse((1270, y + 30, 1350, y + 110), fill=col)
                K.text_at(draw, str(i + 1), 1310, y + 38, F(48, bold=True), (255, 255, 255))
                draw.text((1380, y + 44), lab, fill=ink, font=F(46, bold=True))
            return True
        if focus == "steps":
            labels = ["Pick up the box", "Turn around", "Put down the box"]
            for i, lab in enumerate(labels):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                x0 = 130 + i * 570
                y0 = 260 + int((1 - a) * 40)
                labelled_card(x0, y0, 520, 580, lav_soft, K.BOTH_COLOR)
                K.pill(draw, 0, y0 + 24, str(i + 1), K.BOTH_COLOR, size=28, left=x0 + 24)
                rx = x0 + 230
                if i == 0:
                    hx, hy = K.draw_robot(draw, rx, y0 + 330, 0.55, t, mood="happy", hold=True)
                    draw_box(draw, hx + 20, hy - 10, 0.6)
                elif i == 1:
                    K.draw_robot(draw, rx + 20, y0 + 330, 0.55, t, mood="idle")
                    K.draw_curve(draw, (rx - 150, y0 + 170), (rx + 20, y0 + 70), (rx + 190, y0 + 170), coral, width=10)
                    K.draw_arrow(draw, rx + 170, y0 + 150, rx + 196, y0 + 190, coral, width=10, head=30)
                else:
                    draw_shelf(draw, x0 + 330, y0 + 140, x0 + 490, y0 + 460)
                    draw_box(draw, x0 + 410, y0 + 190, 0.55)
                    draw_box(draw, x0 + 410, y0 + 297, 0.55)
                    K.draw_robot(draw, x0 + 190, y0 + 330, 0.5, t, mood="happy")
                K.text_at(draw, lab, x0 + 260, y0 + 500, F(40, bold=True), ink)
            return True
        # algo
        draw_paper(draw, (140, 250, 900, 840), lines=4, gap=120, top=230)
        K.text_at(draw, "Robot's algorithm", 520, 280, F(46, bold=True), coral)
        for i, lab in enumerate(["Pick up the box", "Turn around", "Put down the box"]):
            y = 380 + i * 120
            draw.text((240, y), f"{i + 1}. {lab}", fill=ink, font=F(46, bold=True))
            if progress * 4 > i + 0.5:
                K.draw_check(draw, 840, y + 26, 24, sage)
        K.draw_robot(draw, 1180, 640, 0.75, t, mood="happy")
        a = K.stagger(progress, 2, 0.12, 4)
        if a > 0:
            K.text_at(draw, "Algorithm!", 1500, 290 - int((1 - a) * 20), F(80, bold=True), K.BOTH_COLOR)
            K.pill(draw, 1560, 600, "Robots can't guess", coral, size=34)
            K.pill(draw, 1560, 700, "They follow the steps", sage, size=34)
        return True

    # ---- you know their tools ------------------------------------------------------------
    if visual == "a16-tools":
        if focus == "intro":
            bx, by = 660, 600
            numbered_list(bx - 280, by - 250, 1.0, coral)
            block(draw, bx - 60, by - 250, "move [10]", "move", 1.0)
            block(draw, bx - 60, by - 178, "say [Hi!]", "say", 1.0)
            score_box(bx + 245, by - 140, 0.7)
            draw.polygon([(bx - 330 + 10, by - 60 + 12), (bx + 330 + 10, by - 60 + 12), (bx + 290 + 10, by + 230 + 12),
                          (bx - 290 + 10, by + 230 + 12)], fill=K.SHADOW)
            draw.polygon([(bx - 330, by - 60), (bx + 330, by - 60), (bx + 290, by + 230), (bx - 290, by + 230)],
                         fill=K.DANGER)
            draw.rectangle((bx - 330, by - 60, bx + 330, by - 10), fill=shade(K.DANGER, 0.8))
            draw.rounded_rectangle((bx - 60, by + 40, bx + 60, by + 80), radius=10, fill=K.GOLD)
            K.text_at(draw, "You already", 1420, 330 + lift, F(66, bold=True), ink)
            K.text_at(draw, "know their", 1420, 410 + lift, F(66, bold=True), ink)
            K.text_at(draw, "tools!", 1420, 490 + lift, F(96, bold=True), coral)
            stars_pts([(1180, 700), (1660, 700)])
            return True
        cards = [("Algorithms", "UNIT 2", coral, coral_soft), ("Blocks", "UNIT 3", MOTION, blue_soft),
                 ("Variables", "UNIT 3", DATA, gold_soft), ("If-blocks", "UNIT 3", CONTROL, gold_soft)]
        for i, (lab, unit, col, soft) in enumerate(cards):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x0 = 110 + i * 435
            y0 = 260 + int((1 - a) * 40)
            labelled_card(x0, y0, 400, 580, soft, col)
            K.pill(draw, x0 + 200, y0 + 30, unit, col, size=28)
            ix, iy = x0 + 200, y0 + 260
            if i == 0:
                numbered_list(ix - 110, iy - 60, 1.0, coral)
            elif i == 1:
                block(draw, ix - 120, iy - 100, "start", "hat", 0.95)
                block(draw, ix - 120, iy - 100 + 68, "move", "move", 0.95)
                block(draw, ix - 120, iy - 100 + 136, "say", "say", 0.95)
            elif i == 2:
                score_box(ix, iy + 20, 0.9)
            else:
                cblock(draw, ix - 150, iy - 110, "if {coin?}", [("score", "data")], 0.95)
            K.text_at(draw, lab, ix, y0 + 470, F(50, bold=True), col)
        return True

    # ---- match game ----------------------------------------------------------------------
    if visual == "a16-match":
        ans = focus == "answer"
        jobs = [("anim", "Animator", BUDDY_DARK), ("game", "Game developer", MOTION),
                ("robot", "Robotics engineer", K.BOTH_COLOR)]
        lines_r = ["If touching coin, add 1 to score", "Pick up the box, then turn",
                   "Move the character a little each frame"]
        match = {0: 2, 1: 0, 2: 1}
        ys = [270, 470, 670]
        for i, (kind, lab, col) in enumerate(jobs):
            y = ys[i]
            labelled_card(120, y, 600, 160, panel, col)
            draw.ellipse((150, y + 20, 270, y + 140), fill=tint(col, 0.75))
            job_icon(draw, kind, 210, y + 80, 0.5, t, brand)
            draw.text((300, y + 56), lab, fill=ink, font=F(42, bold=True))
        for j, txt in enumerate(lines_r):
            y = ys[j]
            done = ans and progress * 4.2 > [k for k, v in match.items() if v == j][0] + 0.6
            draw.rounded_rectangle((1000 + 8, y + 10, 1790 + 8, y + 160 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((1000, y, 1790, y + 160), radius=36, fill=sage_soft if done else panel,
                                   outline=sage if done else line, width=5 if done else 3)
            font = F(38, bold=True)
            lns = K.wrap_text(txt, font, 640)
            for k, ln in enumerate(lns):
                draw.text((1040, y + 80 - len(lns) * 24 + k * 48), ln, fill=ink, font=font)
            if done:
                K.draw_check(draw, 1740, y + 80, 26, sage)
        if ans:
            for i, (_, _, col) in enumerate(jobs):
                p = K.clamp01((progress * 4.2 - i) * 1.6)
                if p <= 0:
                    continue
                y0, y1 = ys[i] + 80, ys[match[i]] + 80
                x1 = K.lerp(730, 990, p)
                yy = K.lerp(y0, y1, p)
                draw.line((730, y0, x1, yy), fill=col, width=10)
                draw.ellipse((724, y0 - 10, 744, y0 + 10), fill=col)
                if p >= 1:
                    draw.ellipse((980, y1 - 10, 1000, y1 + 10), fill=col)
        else:
            K.draw_stopwatch(draw, 860, 850 - 30, 40, progress, brand)
            K.text_at(draw, "?", 860, 440, F(int(90 + 20 * pulse), bold=True), K.GOLD)
        return True

    # ---- practice like cricket ----------------------------------------------------------
    if visual == "a16-practice":
        if focus == "genius":
            K.draw_person(draw, 360, 480, 1.15, "kid", t)
            bubble((500, 250, 1060, 420), "Only geniuses can code?", size=42)
            stages = [(0.3, 0.0, 0.45), (0.7, 0.0, 0.65), (1.0, 1.0, 0.85)]
            for i, (hp, fl, sc) in enumerate(stages):
                a = K.stagger(progress, i + 1, step=0.15, speed=4)
                if a <= 0:
                    continue
                K.draw_plant(draw, 1100 + i * 270, 820, sc, health=hp, flower=fl * a, t=t)
            a = K.stagger(progress, 2, 0.15, 4)
            if a > 0:
                K.text_at(draw, "Everyone starts", 1370, 450 - int((1 - a) * 20), F(52, bold=True), ink)
                K.text_at(draw, "at the beginning!", 1370, 515 - int((1 - a) * 20), F(52, bold=True), coral)
            return True
        if focus == "cricket":
            panels = [("Day 1", "Missed!", 0.25, K.DANGER), ("Day 10", "Hit it!", 0.6, K.GOLD),
                      ("Day 30", "SIX!", 1.0, sage)]
            for i, (day, res, lvl, col) in enumerate(panels):
                a = K.stagger(progress, i, step=0.25, speed=4)
                if a <= 0:
                    continue
                x0 = 130 + i * 570
                y0 = 260 + int((1 - a) * 40)
                labelled_card(x0, y0, 520, 580, panel, col)
                K.pill(draw, x0 + 260, y0 + 24, day, col, size=30)
                draw_stumps(draw, x0 + 400, y0 + 420, 0.9)
                draw_bat(draw, x0 + 200, y0 + 300, 0.95, ang=0.5 if i == 0 else -0.4)
                if i == 0:
                    draw_ball(draw, x0 + 400, y0 + 330, 18)
                    K.draw_cross(draw, x0 + 450, y0 + 160, 26, K.DANGER)
                elif i == 1:
                    draw_ball(draw, x0 + 310, y0 + 200, 18)
                    for k in range(3):
                        draw.line((x0 + 250 - k * 10, y0 + 180 + k * 16, x0 + 280 - k * 10, y0 + 180 + k * 16),
                                  fill=muted, width=5)
                else:
                    draw_ball(draw, x0 + 420, y0 + 130, 18)
                    K.draw_star(draw, x0 + 360, y0 + 170, 18, K.GOLD, rot=t * 4)
                    K.draw_star(draw, x0 + 470, y0 + 190, 14, coral, rot=t * 4)
                K.text_at(draw, res, x0 + 260, y0 + 446, F(44, bold=True), col)
                K.draw_meter(draw, x0 + 90, y0 + 520, 340, lvl)
            return True
        ans = focus == "answer"
        K.shadow_card(draw, (300, 250, w - 300, 500), brand, radius=40, accent=K.BOTH_COLOR)
        K.text_at(draw, "TRUE OR FALSE?", cx, 300, F(32, bold=True), K.BOTH_COLOR)
        K.text_at(draw, "Only adults can learn to code.", cx, 370, F(62, bold=True), ink)
        for i, (lab, col) in enumerate((("TRUE", sage), ("FALSE", K.DANGER))):
            x = cx + (i - 0.5) * 520
            win = ans and i == 1
            dim = ans and i == 0
            fill = K.DANGER_SOFT if win else panel
            draw.rounded_rectangle((x - 200 + 8, 580 + 10, x + 200 + 8, 720 + 10), radius=50, fill=K.SHADOW)
            draw.rounded_rectangle((x - 200, 580, x + 200, 720), radius=50, fill=fill,
                                   outline=col if not dim else line, width=7 if win else 4)
            K.text_at(draw, lab, x, 614, F(60, bold=True), line if dim else col)
            if win:
                K.draw_check(draw, x + 190, 590, 34, sage)
        if ans:
            K.pill(draw, cx, 790, "Kids can code. You already do!", sage, size=36)
            stars_pts([(cx - 700, 650), (cx + 700, 650)])
        else:
            K.draw_stopwatch(draw, cx, 810, 44, progress, brand)
        return True

    # ---- checkpoint -------------------------------------------------------------------------
    if visual == "a16-check":
        if focus == "intro":
            K.shadow_card(draw, (420, 270 + lift, w - 420, 800 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, F(40, bold=True), sage)
            K.text_at(draw, "Name a job!", cx, 420 + lift, F(66, bold=True), ink)
            for i, (kind, _, col) in enumerate(JOBS):
                x = cx + (i - 1.5) * 240
                draw.ellipse((x - 90, 560 + lift, x + 90, 740 + lift), fill=tint(col, 0.8))
                job_icon(draw, kind, x, 650 + lift, 0.62, t, brand)
            return True
        ans = focus == "answer"
        draw_paper(draw, (120, 250, 1060, 850), lines=5, gap=110, top=200)
        K.text_at(draw, "Job + what it tells a computer", 590, 280, F(42, bold=True), coral)
        draw.text((160 + 60, 380), "Job:", fill=muted, font=F(40, bold=True))
        draw.text((160 + 60, 520), "It tells the computer:", fill=muted, font=F(40, bold=True))
        if ans:
            a = K.stagger(progress, 0, 0.1, 3)
            if a > 0:
                draw.text((330, 380), "Game developer", fill=ink, font=F(46, bold=True))
            b = K.stagger(progress, 1, 0.15, 3)
            if b > 0:
                draw.text((220, 620), "If the player touches a coin,", fill=ink, font=F(42, bold=True))
                draw.text((220, 690), "add 1 to the score.", fill=ink, font=F(42, bold=True))
            scr = draw_tablet(draw, (1140, 300, 1790, 720))
            hit = progress > 0.6
            game_screen(draw, scr, t, 5 if hit else 4, K.lerp(0.25, 0.62, K.clamp01(progress * 1.5)), coin_on=not hit)
            if progress > 0.75:
                K.draw_check(draw, 1720, 780, 34, sage)
        else:
            for yy in (430, 570, 680):
                K.draw_dashed(draw, 330 if yy == 430 else 220, yy + 10, 980, yy + 10, muted, width=4,
                              phase=progress * 100)
            K.pill(draw, 1440, 440, "Pause & try!", coral, size=40)
            for i, (kind, _, col) in enumerate(JOBS):
                x = 1220 + (i % 2) * 260
                y = 600 + (i // 2) * 170
                job_icon(draw, kind, x + 60, y, 0.5, t, brand)
            K.draw_stopwatch(draw, 1760, 300, 40, progress, brand)
        return True

    # ---- recap ---------------------------------------------------------------------------------
    if visual == "a16-recap":
        recap = [("People make games, apps & robots", MOTION, "jobs"), ("Developers use algorithms & blocks", coral,
                                                                        "tools"),
                 ("No genius needed: practise often", K.GOLD, "cricket"), ("Kids can code too!", sage, "kid")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "jobs":
                    for k, (jk, _, _) in enumerate(JOBS):
                        job_icon(draw, jk, ix - 80 + (k % 2) * 160, iy - 70 + (k // 2) * 150, 0.45, t, brand)
                elif kind == "tools":
                    numbered_list(ix - 140, iy - 90, 0.8, coral)
                    block(draw, ix - 120, iy + 60, "", "move", 0.8, width=110)
                    block(draw, ix + 10, iy + 60, "", "say", 0.8, width=110)
                elif kind == "cricket":
                    draw_bat(draw, ix - 30, iy, 0.75, ang=-0.4)
                    draw_ball(draw, ix + 90, iy - 70, 18)
                else:
                    K.draw_person(draw, ix, iy - 60, 0.6, "kid", t)
                    K.draw_device(draw, "laptop", ix, iy + 100, 0.5, brand, t)
                center_lines(lab, ix, y0 + 380, 36, ink, 340, 46)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 320), 450, 110, sage, panel, bounce)
            draw_globe(draw, cx + 320, 450, 140, t)
            K.text_at(draw, "Chapter 1 done!", cx, 660, F(68, bold=True), ink)
            K.pill(draw, cx, 760, "Welcome to Unit 4!", coral, size=36)
            stars_around(320, 540, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
