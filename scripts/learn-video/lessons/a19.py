"""A19 · Data — What Computers Remember — visuals."""
import math

import build as K

PAPER = (255, 250, 238)
RULE = (220, 210, 232)
MARGIN = (240, 170, 170)
SKY = (190, 226, 248)
GRASS = (118, 190, 98)
GRASS_LIGHT = (136, 204, 112)
PITCH = (222, 196, 140)
SCREEN_OFF = (44, 50, 64)
WOOD = (196, 150, 98)
CHALK = (46, 104, 84)
PINK = (240, 160, 186)
PINK_SOFT = (255, 218, 228)
LAV_SOFT = (239, 234, 251)
BLUE_SOFT = (230, 238, 251)


def F(size: float):
    return K.load_font(max(26, int(size)), bold=True)


def rot_pts(pts, cx, cy, ang):
    ca, sa = math.cos(ang), math.sin(ang)
    return [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in pts]


# ---- small illustrations ---------------------------------------------------------------

def tablet(draw, cx, cy, s, lit=True):
    W, H = 300 * s, 190 * s
    draw.rounded_rectangle((cx - W + 10 * s, cy - H + 12 * s, cx + W + 10 * s, cy + H + 12 * s), radius=36 * s,
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=36 * s, fill=K.DEV_DARK)
    box = (cx - W + 28 * s, cy - H + 20 * s, cx + W - 28 * s, cy + H - 20 * s)
    draw.rectangle(box, fill=K.DEV_SCREEN if lit else SCREEN_OFF)
    draw.ellipse((cx - W + 9 * s, cy - 6 * s, cx - W + 19 * s, cy + 6 * s), fill=K.DEV_MID)
    return box


def power_icon(draw, cx, cy, r, col):
    wd = max(3, int(r * 0.2))
    draw.arc((cx - r, cy - r, cx + r, cy + r), 300, 600, fill=col, width=wd)
    draw.line((cx, cy - r * 1.15, cx, cy - r * 0.1), fill=col, width=wd)


def cricket_screen(draw, box, t, score=None, label="RUNS", banner=None, ball=True):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    mx = (x0 + x1) / 2
    draw.rectangle(box, fill=SKY)
    gy = y0 + bh * 0.42
    draw.rectangle((x0, gy, x1, y1), fill=GRASS)
    draw.chord((x0 + bw * 0.04, gy - bh * 0.04, x1 - bw * 0.04, y1 + bh * 0.55), 180, 360, fill=GRASS_LIGHT)
    draw.rectangle((x0 + bw * 0.04, gy + bh * 0.24, x1 - bw * 0.04, y1), fill=GRASS_LIGHT)
    draw.polygon([(mx - bw * 0.05, gy + bh * 0.08), (mx + bw * 0.05, gy + bh * 0.08), (mx + bw * 0.12, y1),
                  (mx - bw * 0.12, y1)], fill=PITCH)
    for k in (-1, 0, 1):
        sx = mx + k * bw * 0.014
        draw.line((sx, gy + bh * 0.0, sx, gy + bh * 0.09), fill=(255, 255, 255), width=max(2, int(bh * 0.012)))
    for k in range(9):
        px = x0 + bw * (0.06 + k * 0.11)
        draw.ellipse((px - bh * 0.025, gy - bh * 0.07, px + bh * 0.025, gy - bh * 0.02),
                     fill=[K.CORAL, K.GOLD, K.BOT, K.BOTH_COLOR][k % 4])
    if ball:
        p = (t * 1.1) % 1.0
        bx = K.lerp(mx + bw * 0.04, x1 - bw * 0.1, p)
        by = gy + bh * 0.2 - math.sin(p * math.pi) * bh * 0.42
        r = bh * 0.032
        draw.ellipse((bx - r, by - r, bx + r, by + r), fill=K.DANGER)
    if score is not None:
        sw, sh = bw * 0.3, bh * 0.3
        sx0, sy0 = x0 + bw * 0.04, y0 + bh * 0.06
        draw.rounded_rectangle((sx0, sy0, sx0 + sw, sy0 + sh), radius=bh * 0.04, fill=K.DEV_DEEP)
        K.text_at(draw, label, sx0 + sw / 2, sy0 + sh * 0.08, F(bh * 0.075), K.GOLD)
        K.text_at(draw, score, sx0 + sw / 2, sy0 + sh * 0.34, F(bh * 0.16), (255, 255, 255))
    if banner:
        K.pill(draw, mx + bw * 0.12, y0 + bh * 0.1, banner, K.CORAL, size=max(26, int(bh * 0.07)))


def notebook(draw, box, rings=True):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=PAPER)
    draw.line((x0 + 70, y0 + 10, x0 + 70, y1 - 10), fill=MARGIN, width=3)
    if rings:
        n = int((x1 - x0) / 90)
        for k in range(n):
            rx = x0 + 60 + k * ((x1 - x0 - 120) / max(1, n - 1))
            draw.rounded_rectangle((rx - 9, y0 - 22, rx + 9, y0 + 22), radius=9, fill=K.STEEL_DARK)


def register(draw, brand, box, rows, title, reveal=1.0, hi=None, hi_col=None, size=40, head=("Name", "Marks"),
             tabs=False):
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    sage = K.hex_rgb(brand["sage"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=PAPER, outline=(214, 204, 190), width=3)
    draw.rounded_rectangle((x0, y0, x1, y0 + 74), radius=24, fill=K.BOT)
    draw.rectangle((x0, y0 + 44, x1, y0 + 74), fill=K.BOT)
    K.text_at(draw, title, (x0 + x1) / 2, y0 + 16, F(36), (255, 255, 255))
    hy = y0 + 92
    draw.text((x0 + 60, hy), head[0], fill=muted, font=F(30))
    hb = draw.textbbox((0, 0), head[1], font=F(30))
    draw.text((x1 - 60 - (hb[2] - hb[0]), hy), head[1], fill=muted, font=F(30))
    top = hy + 50
    rh = (y1 - 24 - top) / max(1, len(rows))
    for i, (a, b) in enumerate(rows):
        al = K.stagger(reveal, i, step=0.08, speed=5)
        if al <= 0:
            continue
        ry = top + i * rh
        if hi == i:
            draw.rounded_rectangle((x0 + 24, ry + 4, x1 - 24, ry + rh - 4), radius=18, fill=hi_col or sage_soft,
                                   outline=sage, width=4)
        draw.line((x0 + 30, ry + rh, x1 - 30, ry + rh), fill=RULE, width=2)
        ty = ry + (rh - size * 1.15) / 2
        draw.text((x0 + 60, ty), a, fill=ink, font=F(size))
        bb = draw.textbbox((0, 0), b, font=F(size))
        draw.text((x1 - 60 - (bb[2] - bb[0]), ty), b, fill=sage if hi == i else ink, font=F(size))
    if tabs:
        for i, (a, _) in enumerate(rows):
            ry = top + i * rh + rh / 2
            col = [K.CORAL, K.GOLD, sage, K.BOTH_COLOR, K.BOT, K.DANGER][i % 6]
            draw.rounded_rectangle((x1 - 6, ry - 24, x1 + 44, ry + 24), radius=12, fill=col)
            K.text_at(draw, a[0], x1 + 22, ry - 18, F(28), (255, 255, 255))


def slip(draw, cx, cy, w, h, ang, text=None):
    pts = rot_pts([(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)], cx, cy, ang)
    draw.polygon([(x + 5, y + 6) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=(255, 255, 255), outline=K.DEV_MID, width=2)
    if text:
        K.text_at(draw, text, cx, cy - 18, F(30), K.DEV_DARK)
    else:
        for k in range(2):
            a = rot_pts([(-w / 2 + 14, -h / 6 + k * h / 3), (w / 2 - 14 - k * 24, -h / 6 + k * h / 3)], cx, cy, ang)
            draw.line(a, fill=(150, 150, 170), width=4)


def trophy(draw, cx, cy, s, label=None):
    def S(v):
        return v * s
    for sx in (-1, 1):
        draw.arc((cx + sx * S(64) - S(30), cy - S(70), cx + sx * S(64) + S(30), cy - S(10)),
                 *((90, 270) if sx < 0 else (270, 90)), fill=(214, 150, 40), width=max(3, int(S(12))))
    draw.pieslice((cx - S(66), cy - S(150), cx + S(66), cy + S(20)), 0, 180, fill=K.GOLD)
    draw.rectangle((cx - S(66), cy - S(84), cx + S(66), cy - S(62)), fill=K.GOLD)
    draw.rectangle((cx - S(70), cy - S(92), cx + S(70), cy - S(78)), fill=(214, 150, 40))
    draw.rectangle((cx - S(12), cy + S(16), cx + S(12), cy + S(48)), fill=(214, 150, 40))
    draw.rounded_rectangle((cx - S(52), cy + S(46), cx + S(52), cy + S(74)), radius=S(8), fill=K.DEV_DARK)
    if label:
        K.text_at(draw, label, cx, cy - S(70), F(S(52)), K.DEV_DARK)


def cake(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.ellipse((cx - S(104), cy + S(50), cx + S(104), cy + S(78)), fill=K.STEEL)
    draw.rounded_rectangle((cx - S(86), cy - S(14), cx + S(86), cy + S(62)), radius=S(14), fill=PINK)
    draw.rounded_rectangle((cx - S(86), cy - S(20), cx + S(86), cy + S(4)), radius=S(10), fill=(255, 255, 255))
    for k in range(5):
        dx = cx - S(66) + k * S(33)
        draw.ellipse((dx - S(9), cy - S(6), dx + S(9), cy + S(16)), fill=(255, 255, 255))
    draw.rounded_rectangle((cx - S(58), cy - S(66), cx + S(58), cy - S(12)), radius=S(12), fill=PINK_SOFT)
    for k, col in enumerate((K.BOT, K.CORAL, (13, 148, 136))):
        x = cx + (k - 1) * S(32)
        draw.rounded_rectangle((x - S(6), cy - S(104), x + S(6), cy - S(64)), radius=S(3), fill=col)
        draw.ellipse((x - S(8), cy - S(128), x + S(8), cy - S(104)), fill=K.GOLD)


def palette(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.ellipse((cx - S(88) + S(6), cy - S(66) + S(8), cx + S(88) + S(6), cy + S(66) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(88), cy - S(66), cx + S(88), cy + S(66)), fill=(240, 214, 170))
    draw.ellipse((cx + S(30), cy + S(14), cx + S(62), cy + S(44)), fill=K.hex_rgb("#FFF8EF"))
    for k, (dx, dy, col) in enumerate(((-52, -14, K.CORAL), (-20, -40, K.GOLD), (20, -36, (13, 148, 136)),
                                        (-44, 26, K.BOTH_COLOR), (-6, 30, K.BOT))):
        draw.ellipse((cx + S(dx) - S(15), cy + S(dy) - S(15), cx + S(dx) + S(15), cy + S(dy) + S(15)), fill=col)


def bat(draw, cx, cy, s):
    def S(v):
        return v * s
    ang = -0.6
    blade = rot_pts([(-S(24), -S(6)), (S(24), -S(6)), (S(24), S(110)), (-S(24), S(110))], cx - S(20), cy - S(30), ang)
    handle = rot_pts([(-S(9), -S(70)), (S(9), -S(70)), (S(9), -S(4)), (-S(9), -S(4))], cx - S(20), cy - S(30), ang)
    draw.polygon([(x + S(5), y + S(6)) for x, y in blade], fill=K.SHADOW)
    draw.polygon(blade, fill=(236, 200, 140), outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.polygon(handle, fill=K.DEV_DARK)
    bx, by = cx + S(60), cy + S(52)
    draw.ellipse((bx - S(22), by - S(22), bx + S(22), by + S(22)), fill=K.DANGER)
    draw.arc((bx - S(14), by - S(22), bx + S(30), by + S(22)), 120, 240, fill=(255, 255, 255), width=max(2, int(S(3))))


def wind(draw, cx, cy, s, t):
    def S(v):
        return v * s
    for k in range(3):
        y = cy - S(50) + k * S(50)
        pts = [(cx - S(90) + j * S(12), y + S(8) * math.sin(j * 0.6 + t * 8 + k)) for j in range(13)]
        draw.line(pts, fill=(140, 180, 210), width=max(3, int(S(9))), joint="curve")
        ex, ey = pts[-1]
        draw.arc((ex - S(18), ey - S(36), ex + S(18), ey), 270, 180, fill=(140, 180, 210), width=max(3, int(S(9))))


def gift(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(60), cy - S(28), cx + S(60), cy + S(62)), radius=S(8), fill=K.CORAL)
    draw.rounded_rectangle((cx - S(70), cy - S(50), cx + S(70), cy - S(22)), radius=S(8), fill=(214, 80, 20))
    draw.rectangle((cx - S(12), cy - S(50), cx + S(12), cy + S(62)), fill=K.GOLD)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(30) - S(26), cy - S(82), cx + sx * S(30) + S(26), cy - S(48)), outline=K.GOLD,
                     width=max(3, int(S(10))))


def phone(draw, cx, cy, s, lit=True):
    W, H = 110 * s, 200 * s
    draw.rounded_rectangle((cx - W + 8 * s, cy - H + 10 * s, cx + W + 8 * s, cy + H + 10 * s), radius=30 * s,
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=30 * s, fill=K.DEV_DARK)
    box = (cx - W + 12 * s, cy - H + 34 * s, cx + W - 12 * s, cy + H - 34 * s)
    draw.rectangle(box, fill=K.DEV_SCREEN if lit else SCREEN_OFF)
    draw.rounded_rectangle((cx - 26 * s, cy - H + 14 * s, cx + 26 * s, cy - H + 22 * s), radius=4 * s, fill=K.DEV_MID)
    draw.ellipse((cx - 9 * s, cy + H - 26 * s, cx + 9 * s, cy + H - 8 * s), fill=K.DEV_MID)
    return box


def monitor(draw, cx, cy, W, H):
    draw.rectangle((cx - 22, cy + H, cx + 22, cy + H + 50), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - 120, cy + H + 44, cx + 120, cy + H + 64), radius=10, fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - W + 10, cy - H + 12, cx + W + 10, cy + H + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=24, fill=K.DEV_DARK)
    box = (cx - W + 20, cy - H + 20, cx + W - 20, cy + H - 20)
    draw.rectangle(box, fill=(255, 255, 255))
    return box


def photo(draw, cx, cy, s, frame=True):
    def S(v):
        return v * s
    x0, y0, x1, y1 = cx - S(90), cy - S(70), cx + S(90), cy + S(70)
    if frame:
        draw.rounded_rectangle((x0 - S(10) + S(6), y0 - S(10) + S(8), x1 + S(10) + S(6), y1 + S(10) + S(8)),
                               radius=S(10), fill=K.SHADOW)
        draw.rounded_rectangle((x0 - S(10), y0 - S(10), x1 + S(10), y1 + S(10)), radius=S(10), fill=(255, 255, 255))
    draw.rectangle((x0, y0, x1, y1), fill=SKY)
    draw.ellipse((x1 - S(56), y0 + S(14), x1 - S(18), y0 + S(52)), fill=K.GOLD)
    draw.polygon([(x0, y1), (x0 + S(70), y0 + S(50)), (x0 + S(140), y1)], fill=(13, 148, 136))
    draw.polygon([(x0 + S(80), y1), (x0 + S(140), y0 + S(76)), (x1, y1)], fill=(20, 110, 100))


def megaphone(draw, cx, cy, s, col, t):
    def S(v):
        return v * s
    draw.polygon([(cx - S(70), cy - S(24)), (cx + S(40), cy - S(70)), (cx + S(40), cy + S(70)), (cx - S(70), cy + S(24))],
                 fill=col)
    draw.rounded_rectangle((cx - S(96), cy - S(28), cx - S(62), cy + S(28)), radius=S(8), fill=K.DEV_DARK)
    draw.ellipse((cx + S(24), cy - S(72), cx + S(56), cy + S(72)), fill=tuple(int(c * 0.8) for c in col))
    draw.line((cx - S(40), cy + S(30), cx - S(30), cy + S(80)), fill=K.DEV_DARK, width=max(3, int(S(14))))
    K.sound_waves(draw, cx + S(70), cy, s * 1.2, col, t, "right")


def icon(draw, brand, kind, x, y, s, t=0.0):
    """Every icon fits roughly inside a 200 × 200 box at s = 1, centred on (x, y)."""
    ink = K.hex_rgb(brand["ink"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])

    def S(v):
        return v * s
    if kind == "name":
        draw.rounded_rectangle((x - S(96) + S(6), y - S(62) + S(8), x + S(96) + S(6), y + S(62) + S(8)), radius=S(18),
                               fill=K.SHADOW)
        draw.rounded_rectangle((x - S(96), y - S(62), x + S(96), y + S(62)), radius=S(18), fill=(255, 255, 255),
                               outline=ink, width=max(2, int(S(4))))
        draw.rounded_rectangle((x - S(96), y - S(62), x + S(96), y - S(22)), radius=S(18), fill=coral)
        draw.rectangle((x - S(96), y - S(36), x + S(96), y - S(22)), fill=coral)
        K.text_at(draw, "Aarav", x, y - S(14), F(S(44)), ink)
    elif kind == "class":
        draw.rounded_rectangle((x - S(96), y - S(66), x + S(96), y + S(66)), radius=S(10), fill=WOOD)
        draw.rectangle((x - S(84), y - S(54), x + S(84), y + S(54)), fill=CHALK)
        K.text_at(draw, "4 B", x, y - S(42), F(S(70)), (255, 255, 255))
        draw.rectangle((x + S(30), y + S(54), x + S(70), y + S(62)), fill=(255, 255, 255))
    elif kind == "marks":
        draw.rectangle((x - S(70) + S(6), y - S(90) + S(8), x + S(70) + S(6), y + S(90) + S(8)), fill=K.SHADOW)
        draw.rectangle((x - S(70), y - S(90), x + S(70), y + S(90)), fill=(255, 255, 255), outline=ink,
                       width=max(2, int(S(4))))
        for k in range(4):
            ly = y + S(10) + k * S(18)
            draw.line((x - S(50), ly, x + S(50) - (k % 2) * S(30), ly), fill=(190, 196, 210), width=max(2, int(S(5))))
        K.text_at(draw, "18/20", x, y - S(76), F(S(42)), K.DANGER)
        draw.line([(x + S(16), y - S(16)), (x + S(34), y + S(2)), (x + S(64), y - S(36))], fill=K.DANGER,
                  width=max(3, int(S(8))), joint="curve")
    elif kind == "score":
        trophy(draw, x, y + S(20), s, "52")
    elif kind == "nickname":
        draw.rounded_rectangle((x - S(100), y - S(42), x + S(100), y + S(42)), radius=S(42), fill=K.DEV_DEEP)
        K.draw_star(draw, x - S(60), y, S(24), K.GOLD)
        K.text_at(draw, "Ace", x + S(18), y - S(26), F(S(44)), (255, 255, 255))
    elif kind == "photo":
        photo(draw, x, y, s)
    elif kind == "roll":
        draw.rounded_rectangle((x - S(96) + S(6), y - S(62) + S(8), x + S(96) + S(6), y + S(62) + S(8)), radius=S(16),
                               fill=K.SHADOW)
        draw.rounded_rectangle((x - S(96), y - S(62), x + S(96), y + S(62)), radius=S(16), fill=(255, 255, 255),
                               outline=ink, width=max(2, int(S(4))))
        K.draw_face(draw, x - S(48), y + S(4), S(30), "kid", 0.6)
        K.text_at(draw, "#12", x + S(38), y - S(28), F(S(46)), coral)
    elif kind == "phone":
        phone(draw, x, y, 0.42 * s)
        for k in range(2):
            r = S(30) + k * S(22)
            draw.arc((x + S(46) - r, y - S(60) - r, x + S(46) + r, y - S(60) + r), 290, 350, fill=coral,
                     width=max(2, int(S(6))))
    elif kind == "address":
        K.draw_house(draw, x, y + S(26), 0.42 * s, brand)
    elif kind == "birthday":
        cake(draw, x, y + S(12), 0.85 * s)
    elif kind == "password":
        K.draw_key(draw, x, y + S(26), 0.62 * s, K.GOLD)
        for k in range(4):
            dx = x - S(54) + k * S(36)
            draw.ellipse((dx - S(11), y - S(56), dx + S(11), y - S(34)), fill=ink)
    elif kind == "colour":
        palette(draw, x, y, s)
    elif kind == "team":
        bat(draw, x, y, s)
    elif kind == "cartoon":
        K.draw_device(draw, "tv", x, y + S(10), 0.5 * s, brand, t)
    elif kind == "tiffin":
        K.draw_tiffin(draw, x, y + S(26), 0.62 * s)
    elif kind == "wind":
        wind(draw, x, y, s, t)
    elif kind == "list":
        draw.rounded_rectangle((x - S(80) + S(6), y - S(90) + S(8), x + S(80) + S(6), y + S(90) + S(8)), radius=S(14),
                               fill=K.SHADOW)
        draw.rounded_rectangle((x - S(80), y - S(90), x + S(80), y + S(90)), radius=S(14), fill=PAPER, outline=ink,
                               width=max(2, int(S(4))))
        draw.rounded_rectangle((x - S(80), y - S(90), x + S(80), y - S(52)), radius=S(14), fill=K.BOT)
        draw.rectangle((x - S(80), y - S(66), x + S(80), y - S(52)), fill=K.BOT)
        for k, letter in enumerate("ABCD"):
            ly = y - S(32) + k * S(30)
            draw.ellipse((x - S(62), ly - S(9), x - S(44), ly + S(9)), fill=[coral, K.GOLD, sage, K.BOTH_COLOR][k])
            draw.rounded_rectangle((x - S(32), ly - S(6), x + S(36), ly + S(6)), radius=S(6), fill=(200, 196, 210))
            draw.rounded_rectangle((x + S(46), ly - S(6), x + S(62), ly + S(6)), radius=S(6), fill=sage)
    elif kind == "lock":
        K.draw_padlock(draw, x, y + S(12), 0.72 * s, coral)
    elif kind == "adults":
        K.draw_person(draw, x - S(56), y - S(20), 0.55 * s, "mom")
        K.draw_person(draw, x + S(56), y - S(20), 0.55 * s, "dad")
        K.draw_heart(draw, x, y - S(84), S(20), K.DANGER)
    elif kind == "gift":
        gift(draw, x, y + S(10), s)
    else:
        return False
    return True


A19_EVERY = [("name", "Name"), ("class", "Class"), ("marks", "Marks"), ("score", "Score"), ("nickname", "Nickname")]
A19_SCHOOL = [("name", "Names"), ("roll", "Roll numbers"), ("marks", "Marks"), ("phone", "Phone numbers")]
A19_PUBLIC = [("colour", "Favourite colour"), ("team", "Cricket team"), ("cartoon", "Cartoon you like")]
A19_PRIVATE = [("address", "Home address"), ("phone", "Phone number"), ("birthday", "Birthday"),
               ("password", "Password")]
A19_REGISTER = [("Aarav", "18"), ("Divya", "16"), ("Kabir", "19"), ("Neha", "17"), ("Rohan", "15"), ("Zoya", "20")]
A19_LIST_B = [("Aarav", "38"), ("Divya", "52"), ("Kavya", "45"), ("Rohan", "40"), ("Zoya", "31")]
A19_SORT = [("colour", "Fav. colour", "pub"), ("address", "Home address", "priv"), ("phone", "Phone number", "priv"),
            ("team", "Cricket team", "pub")]


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    star_cols = [coral, sage, K.BOTH_COLOR, K.GOLD]

    def sparkle(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + i), 20 + 6 * pulse, star_cols[i % 4],
                        rot=progress * 3 + i)

    def qmarks(pts, size=80):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(size + 20 * (pulse if k % 2 else 1 - pulse)), K.GOLD)

    def icon_card(box, kind, label, state="normal", icon_s=1.0, label_size=36, badge=None):
        x0, y0, x1, y1 = box
        mx = (x0 + x1) / 2
        out = sage if state == "pub" else K.DANGER if state == "priv" else None
        K.shadow_card(draw, box, brand, radius=30, outline=out, outline_w=6 if out else 3)
        if state == "pub":
            draw.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=26, fill=sage_soft)
        elif state == "priv":
            draw.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=26, fill=K.DANGER_SOFT)
        icon(draw, brand, kind, mx, y0 + (y1 - y0) * 0.42, icon_s, t)
        font = F(label_size)
        lines = K.wrap_text(label, font, int(x1 - x0 - 30))
        lh = int(label_size * 1.2)
        ty = y1 - 24 - len(lines) * lh
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, mx, ty + j * lh, font, ink)
        if badge == "check":
            K.draw_check(draw, x1 - 40, y0 + 40, 24, sage)
        elif badge == "lock":
            draw.ellipse((x1 - 78, y0 + 8, x1 - 8, y0 + 78), fill=K.DANGER)
            K.draw_padlock(draw, x1 - 43, y0 + 44, 0.22, (255, 255, 255), keyhole=K.DANGER, shadow=False)
        elif badge == "cross":
            K.draw_cross(draw, x1 - 40, y0 + 40, 24, K.DANGER)

    def row_boxes(n, cw, gap, y0, y1):
        xs = cx - (n * cw + (n - 1) * gap) / 2
        return [(xs + i * (cw + gap), y0, xs + i * (cw + gap) + cw, y1) for i in range(n)]

    def bin_box(box, label, col, soft, locked=False):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=36, fill=soft, outline=col, width=6)
        p = K.pill(draw, 0, y0 - 28, label, col, size=34, left=x0 + 40)
        if locked:
            K.draw_padlock(draw, p[2] + 46, y0 - 4, 0.26, col)
        else:
            K.draw_check(draw, p[2] + 46, (p[1] + p[3]) / 2, 26, col)

    # ---- opening -----------------------------------------------------------------------
    if visual == "a19-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 330), 470, 110, sage, panel, bounce)
            box = tablet(draw, cx + 250, 470, 0.95)
            cricket_screen(draw, box, t, score="52", label="BEST")
            K.text_at(draw, "Welcome back, champ!", cx, 730, F(60), ink)
            sparkle([(cx - 640, 320), (cx - 560, 600), (cx + 700, 300), (cx + 720, 600)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · ROBOTS & AUTOMATION", cx, 290 + lift, F(34), sage)
            draw.ellipse((520 - 200, 580 - 200, 520 + 200, 580 + 200), fill=BLUE_SOFT)
            K.draw_robot(draw, 520, 600, 0.68, t, mood="happy")
            rows = [("Follow algorithms", sage), ("No feelings", K.BOTH_COLOR), ("Love repeat jobs", coral)]
            for i, (lab, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 370 + i * 150 + int((1 - a) * 30)
                draw.rounded_rectangle((830, y, 1600, y + 120), radius=36, fill=panel, outline=col, width=5)
                K.draw_check(draw, 900, y + 60, 34, col)
                draw.text((960, y + 32), lab, fill=ink, font=F(50))
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 560 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 290 + lift, F(32), coral)
            K.text_at(draw, "Data", cx, 336 + lift, F(100), coral)
            K.text_at(draw, "What Computers Remember", cx, 460 + lift, F(62), ink)
            for i, kind in enumerate(("name", "score", "photo", "marks")):
                a = K.stagger(progress, i + 2, step=0.1, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 300
                y = 610 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 125, y, x + 125, y + 230), radius=30, fill=panel, outline=line, width=3)
                icon(draw, brand, kind, x, y + 120, 0.8, t)
            return True
        # wonder
        box = tablet(draw, 620, 520, 1.05)
        cricket_screen(draw, box, t, score="52", label="BEST")
        K.text_at(draw, "How does it", 1380, 280, F(60), ink)
        K.text_at(draw, "remember?", 1380, 356, F(84), coral)
        a = K.stagger(progress, 2, step=0.12, speed=4)
        if a > 0:
            b1 = tablet(draw, 1210, 650 + int((1 - a) * 20), 0.42, lit=False)
            power_icon(draw, (b1[0] + b1[2]) / 2, (b1[1] + b1[3]) / 2 + 8, 26, K.DEV_MID)
            K.text_at(draw, "OFF", 1210, 760, F(32), muted)
            K.draw_arrow(draw, 1360, 650, 1440, 650, muted, width=8, head=24)
            b2 = tablet(draw, 1590, 650 + int((1 - a) * 20), 0.42)
            K.text_at(draw, "52", (b2[0] + b2[2]) / 2, b2[1] + 14, F(60), coral)
            K.text_at(draw, "ON again", 1590, 760, F(32), muted)
        qmarks([(1760, 300)], 70)
        return True

    # ---- Aarav's high score -----------------------------------------------------------
    if visual == "a19-hook":
        if focus == "meet":
            draw.ellipse((560 - 270, 540 - 270, 560 + 270, 540 + 270), fill=coral_soft)
            K.draw_person(draw, 560, 450, 1.35, "kid", t)
            b = tablet(draw, 560, 700, 0.42)
            cricket_screen(draw, b, t, ball=False)
            K.text_at(draw, "Meet", 1290, 290 + lift, F(60), muted)
            K.text_at(draw, "Aarav!", 1290, 360 + lift, F(130), coral)
            K.pill(draw, 1290, 560, "loves cricket games", sage, size=38)
            bat(draw, 1290, 760, 0.95)
            sparkle([(1660, 320), (900, 300)])
            return True
        if focus == "score":
            box = tablet(draw, cx, 550, 1.42)
            show = progress > 0.35
            cricket_screen(draw, box, t * 1.6, score="52" if show else "46", banner="NEW HIGH SCORE!" if show else None)
            if show:
                K.text_at(draw, "SIX!", 320, 440 - bounce, F(110), K.CORAL)
                K.text_at(draw, "SIX!", 1600, 520 + bounce, F(80), K.GOLD)
            sparkle([(330, 720), (1620, 340), (1600, 760)])
            return True
        if focus == "off":
            box = tablet(draw, 640, 580, 1.1, lit=False)
            power_icon(draw, 640, 580, 56, K.DEV_MID)
            K.text_at(draw, "Switched off", 640, 830 - 20, F(36), muted)
            K.draw_person(draw, 1500, 500, 1.1, "mom", t)
            K.draw_bubble(draw, (1060, 250, 1700, 380), brand, "Dinner's ready!", tail="right", size=50)
            draw.ellipse((1290, 730, 1710, 800), fill=K.STEEL)
            draw.ellipse((1306, 736, 1694, 792), fill=(220, 226, 234))
            for k, col in enumerate(((236, 190, 70), (255, 255, 255), (214, 120, 60), (120, 170, 90))):
                bx = 1380 + k * 80
                draw.ellipse((bx - 30, 744, bx + 30, 784), fill=col, outline=K.STEEL_DARK, width=2)
            return True
        if focus == "next":
            for k in range(8):
                ang = k * math.pi / 4 + t
                draw.line((1720 + math.cos(ang) * 70, 320 + math.sin(ang) * 70,
                           1720 + math.cos(ang) * 104, 320 + math.sin(ang) * 104), fill=K.GOLD, width=10)
            draw.ellipse((1720 - 56, 320 - 56, 1720 + 56, 320 + 56), fill=K.GOLD)
            K.draw_person(draw, 380, 480, 1.15, "kid", t)
            box = tablet(draw, 1060, 560, 1.25)
            x0, y0, x1, y1 = box
            draw.rectangle(box, fill=K.DEV_SCREEN)
            mx = (x0 + x1) / 2
            a = K.stagger(progress, 1, step=0.15, speed=4)
            K.text_at(draw, "Welcome back, Aarav!", mx, y0 + 40, F(48), ink)
            if a > 0:
                trophy(draw, mx - 150, y0 + 250 + int((1 - a) * 20), 1.0)
                K.text_at(draw, "High score", mx + 110, y0 + 150, F(40), muted)
                K.text_at(draw, "52", mx + 110, y0 + 196, F(110), coral)
            return True
        if focus == "why":
            draw.ellipse((cx - 320, 560 - 320, cx + 320, 560 + 320), fill=LAV_SOFT)
            box = tablet(draw, cx, 540, 1.0, lit=False)
            K.text_at(draw, "?", cx, box[1] + 50, F(200), K.GOLD)
            K.pill(draw, cx, 770, "Off all night!", K.DEV_MID, size=34)
            qmarks([(cx - 520, 300), (cx + 500, 290), (cx - 560, 600), (cx + 560, 590)], 90)
            K.text_at(draw, "How did it remember?", cx, 220, F(48), ink)
            K.draw_stopwatch(draw, cx + 680, 790, 46, progress, brand)
            return True
        # because
        box = tablet(draw, 460, 520, 0.85)
        cricket_screen(draw, box, t, score="52", label="BEST")
        a = K.ease_out_cubic(K.clamp01((progress - 0.15) * 3))
        if a > 0:
            K.pill(draw, 855, 420, "SAVE", sage, size=34)
            K.draw_arrow(draw, 760, 520, 760 + 190 * a, 520, sage, width=14, head=40)
        notebook(draw, (1010, 290, 1780, 830))
        K.text_at(draw, "Saved inside the tablet", 1395, 320, F(38), coral)
        rows = [("Name:", "Aarav"), ("High score:", "52"), ("Picture:", None)]
        for i, (k_, v) in enumerate(rows):
            al = K.stagger(progress, i + 2, step=0.12, speed=4)
            if al <= 0:
                continue
            y = 420 + i * 120
            draw.line((1040, y + 90, 1750, y + 90), fill=RULE, width=3)
            draw.text((1110, y + 22), k_, fill=muted, font=F(44))
            vx = 1110 + draw.textbbox((0, 0), k_ + " ", font=F(44))[2]
            if v:
                draw.text((vx, y + 22), v, fill=ink, font=F(48))
            else:
                K.draw_face(draw, vx + 46, y + 48, 38, "kid", 0.6)
        return True

    # ---- definition ---------------------------------------------------------------------
    if visual == "a19-define":
        if focus == "name":
            notebook(draw, (140, 300, 720, 820))
            rows = [("Name:", "Aarav"), ("Score:", "52"), ("Picture:", None)]
            for i, (k_, v) in enumerate(rows):
                y = 380 + i * 130
                draw.line((170, y + 96, 690, y + 96), fill=RULE, width=3)
                draw.text((230, y + 24), k_, fill=muted, font=F(42))
                vx = 230 + draw.textbbox((0, 0), k_ + " ", font=F(42))[2]
                if v:
                    draw.text((vx, y + 24), v, fill=ink, font=F(46))
                else:
                    K.draw_face(draw, vx + 44, y + 50, 36, "kid", 0.6)
            a = K.ease_out_cubic(K.clamp01((progress - 0.3) * 2.5))
            if a > 0:
                K.draw_arrow(draw, 760, 560, 760 + 190 * a, 560, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.5) * 2.5))
            if b > 0:
                sc = 0.8 + 0.2 * b
                mxc, myc = 1400, 560
                hw, hh = 400 * sc, 170 * sc
                K.shadow_card(draw, (mxc - hw, myc - hh, mxc + hw, myc + hh), brand, radius=40, outline=coral,
                              outline_w=6)
                K.text_at(draw, "They're called", mxc, myc - 120 * sc, F(42 * sc), muted)
                K.text_at(draw, "DATA", mxc, myc - 60 * sc, F(130 * sc), coral)
            return True
        if focus == "meaning":
            K.shadow_card(draw, (200, 250 + lift, w - 200, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "Data is…", cx, 320 + lift, F(46), muted)
            parts = [("the facts a computer stores,", coral), ("like names, scores,", K.BOTH_COLOR),
                     ("and photos.", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 410 + i * 120 + int((1 - a) * 30)
                K.text_at(draw, txt, cx, y, F(70), col)
            return True
        # parts
        cols = [("Name", coral, coral_soft, "name"), ("Score", K.BOTH_COLOR, LAV_SOFT, "score"),
                ("Picture", sage, sage_soft, "face")]
        for i, (title, col, soft, kind) in enumerate(cols):
            a = K.stagger(progress, i, step=0.22, speed=3.5)
            if a <= 0:
                continue
            x0 = 150 + i * 560
            y0 = 250 + int((1 - a) * 50)
            draw.rounded_rectangle((x0, y0, x0 + 500, y0 + 600), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, title, x0 + 250, y0 + 36, F(56), col)
            if kind == "face":
                draw.ellipse((x0 + 250 - 110, y0 + 290 - 110, x0 + 250 + 110, y0 + 290 + 110), fill=panel)
                K.draw_face(draw, x0 + 250, y0 + 300, 80, "kid", 0.8)
            else:
                icon(draw, brand, kind, x0 + 250, y0 + 290, 1.35, t)
            K.pill(draw, x0 + 250, y0 + 480, "is data!", col, size=38)
        return True

    # ---- data everywhere ----------------------------------------------------------------
    if visual == "a19-everywhere":
        if focus == "intro":
            K.draw_magnifier(draw, 420, 540, 1.6, coral)
            K.text_at(draw, "52", 420, 486, F(80), coral)
            K.text_at(draw, "Data is everywhere!", 1260, 240 + lift, F(64), ink)
            kinds = ["name", "class", "marks", "score", "photo", "nickname"]
            for i, kind in enumerate(kinds):
                a = K.stagger(progress, i, step=0.08, speed=5)
                if a <= 0:
                    continue
                x = 960 + (i % 3) * 300
                y = 480 + (i // 3) * 250 + 8 * math.sin(progress * 8 + i) + int((1 - a) * 30)
                draw.ellipse((x - 118, y - 108, x + 118, y + 108), fill=[coral_soft, LAV_SOFT, sage_soft][i % 3])
                icon(draw, brand, kind, x, y, 0.78, t)
            return True
        if focus == "items":
            boxes = row_boxes(5, 316, 30, 280, 790)
            shown = progress * 6.0 - 0.3
            for i, ((kind, lab), box) in enumerate(zip(A19_EVERY, boxes)):
                a = K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
                if a <= 0:
                    continue
                dy = int((1 - a) * 50)
                icon_card((box[0], box[1] + dy, box[2], box[3] + dy), kind, lab, icon_s=1.05, label_size=40)
                K.pill(draw, (box[0] + box[2]) / 2, box[1] + dy + 24, "DATA", sage, size=26)
            return True
        # photo
        box = tablet(draw, 680, 540, 1.22)
        x0, y0, x1, y1 = box
        draw.rectangle(box, fill=(246, 243, 238))
        photo(draw, x0 + 210, y0 + 190, 1.75, frame=False)
        tiles = [((x1 - 250, y0 + 30), K.GOLD), ((x1 - 130, y0 + 30), coral), ((x1 - 250, y0 + 150), sage),
                 ((x1 - 130, y0 + 150), K.BOT), ((x1 - 250, y0 + 270), K.BOTH_COLOR), ((x1 - 130, y0 + 270), PINK)]
        for (tx, ty), col in tiles:
            draw.rounded_rectangle((tx, ty, tx + 100, ty + 100), radius=12, fill=col)
        sx, sy = x0 + 270, y0 + 250
        draw.rectangle((sx - 30, sy - 30, sx + 30, sy + 30), outline=coral, width=5)
        a = K.ease_out_cubic(K.clamp01((progress - 0.25) * 3))
        if a > 0:
            gx0, gy0, cell = 1260, 300, 72
            n = 6
            draw.line((sx + 30, sy - 30, gx0, gy0), fill=coral, width=4)
            draw.line((sx + 30, sy + 30, gx0, gy0 + cell * n), fill=coral, width=4)
            pal = [SKY, SKY, K.GOLD, SKY, (13, 148, 136), (20, 110, 100)]
            for r in range(n):
                for c in range(n):
                    if K.stagger(a, r * n + c, step=0.012, speed=6) <= 0:
                        continue
                    col = pal[(r * 2 + c * 3 + (r * c) % 3) % len(pal)] if r > 1 else pal[(c + r) % 3]
                    if r >= 3:
                        col = (13, 148, 136) if (c + r) % 2 else (20, 110, 100)
                    draw.rectangle((gx0 + c * cell, gy0 + r * cell, gx0 + (c + 1) * cell - 6,
                                    gy0 + (r + 1) * cell - 6), fill=col)
            draw.rectangle((gx0 - 8, gy0 - 8, gx0 + cell * n + 2, gy0 + cell * n + 2), outline=coral, width=5)
            K.text_at(draw, "tiny dots of colour", gx0 + cell * n / 2, 760, F(40), ink)
        if progress > 0.5:
            K.pill(draw, 680, 820, "A photo is data too!", sage, size=34)
        return True

    # ---- school computer ----------------------------------------------------------------
    if visual == "a19-school":
        if focus == "intro":
            K.draw_school(draw, 420, 600, 1.15, brand)
            K.pill(draw, 420, 790, "School office", K.DEV_MID, size=32)
            a = K.ease_out_cubic(K.clamp01(progress * 2.5))
            K.draw_arrow(draw, 680, 560, 680 + 160 * a, 560, coral, width=12, head=36)
            box = monitor(draw, 1280, 520, 400, 230)
            x0, y0, x1, y1 = box
            draw.rectangle((x0, y0, x1, y0 + 60), fill=K.BOT)
            K.text_at(draw, "STUDENTS", (x0 + x1) / 2, y0 + 12, F(32), (255, 255, 255))
            for r in range(5):
                if K.stagger(progress, r + 1, step=0.1, speed=5) <= 0:
                    continue
                ry = y0 + 84 + r * 64
                draw.ellipse((x0 + 30, ry, x0 + 66, ry + 36), fill=[coral, K.GOLD, sage, K.BOTH_COLOR, K.BOT][r])
                draw.rounded_rectangle((x0 + 90, ry + 8, x0 + 380, ry + 28), radius=10, fill=(206, 210, 222))
                draw.rounded_rectangle((x0 + 430, ry + 8, x0 + 560, ry + 28), radius=10, fill=(206, 210, 222))
                draw.rounded_rectangle((x1 - 150, ry + 8, x1 - 40, ry + 28), radius=10, fill=sage)
            return True
        if focus == "items":
            K.text_at(draw, "The school computer stores…", cx, 222, F(42), muted)
            boxes = row_boxes(4, 390, 46, 300, 810)
            shown = progress * 5.0 - 0.3
            for i, ((kind, lab), box) in enumerate(zip(A19_SCHOOL, boxes)):
                a = K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
                if a <= 0:
                    continue
                dy = int((1 - a) * 50)
                priv = kind == "phone"
                icon_card((box[0], box[1] + dy, box[2], box[3] + dy), kind, lab, "priv" if priv else "normal",
                          icon_s=1.2, label_size=40, badge="lock" if priv else None)
            return True
        # not
        for i, (kind, lab, x) in enumerate((("tiffin", "Taste of tiffin", 380), ("wind", "How wind feels", 800))):
            draw.ellipse((x - 170, 500 - 170, x + 170, 500 + 170), fill=coral_soft)
            icon(draw, brand, kind, x, 500, 1.35, t)
            if kind == "tiffin":
                K.draw_steam(draw, x, 380, 1.0, t)
            K.text_at(draw, lab, x, 700, F(38), ink)
            if K.clamp01((progress - 0.25 - i * 0.1) * 4) > 0:
                K.draw_cross(draw, x + 130, 370, 40, K.DANGER)
        K.pill(draw, 590, 780, "Not facts → not data", K.DANGER, size=34)
        notebook(draw, (1080, 300, 1780, 820))
        K.text_at(draw, "Facts = data", 1430, 330, F(44), sage)
        facts = [("Name:", "Aarav"), ("Roll no:", "12"), ("Maths:", "18/20")]
        for i, (k_, v) in enumerate(facts):
            y = 430 + i * 120
            draw.line((1110, y + 90, 1750, y + 90), fill=RULE, width=3)
            draw.text((1180, y + 22), k_, fill=muted, font=F(42))
            vx = 1180 + draw.textbbox((0, 0), k_ + " ", font=F(42))[2]
            draw.text((vx, y + 22), v, fill=ink, font=F(44))
            K.draw_check(draw, 1710, y + 46, 24, sage)
        return True

    # ---- messy slips vs tidy register ----------------------------------------------------
    slip_spots = [(-60, -120, -0.4), (10, -150, 0.2), (70, -110, 0.5), (-20, -95, -0.1), (40, -135, -0.6)]
    if visual == "a19-tidy":
        if focus == "messy":
            K.draw_person(draw, 360, 460, 1.25, "teacher", t)
            K.pill(draw, 360, 720, "Meena Ma'am", sage, size=34)
            bx, by = 920, 650
            for k, (dx, dy, ang) in enumerate(slip_spots):
                slip(draw, bx + dx, by + dy - 10 * math.sin(t * 6 + k), 120, 80, ang)
            K.draw_bag(draw, bx, by, 1.2)
            K.text_at(draw, "Marks on", 1450, 300 + lift, F(56), ink)
            K.text_at(draw, "paper slips!", 1450, 370 + lift, F(66), coral)
            for k, (px, py, ang) in enumerate(((1300, 560, 0.3), (1560, 600, -0.4), (1420, 720, 0.15),
                                                (1680, 760, 0.5))):
                slip(draw, px, py + 12 * math.sin(t * 5 + k), 140, 90, ang, "Rohan?" if k == 2 else None)
            return True
        if focus == "search":
            K.draw_person(draw, 300, 480, 1.15, "teacher", t * 3)
            qmarks([(180, 300), (430, 290)], 60)
            for k in range(9):
                p = (t * 0.9 + k / 9) % 1
                sx = 680 + k * 40 * p
                sy = 610 - 280 * math.sin(p * math.pi) + 60 * p
                slip(draw, sx, sy, 110, 72, (k - 4) * 0.25 + p * 2)
            K.draw_bag(draw, 680, 700, 0.9)
            K.draw_person(draw, 1560, 560, 1.05, "dad", t)
            K.draw_bubble(draw, (980, 240, 1760, 400), brand, "What did Rohan get in maths?", tail="right", size=42)
            K.pill(draw, 1560, 800, "Principal", K.BOT, size=30)
            K.draw_stopwatch(draw, 300, 800, 44, progress * 3, brand)
            return True
        if focus == "register":
            hi = 4 if progress > 0.5 else None
            register(draw, brand, (200, 260, 1060, 850), A19_REGISTER, "CLASS 4 REGISTER", reveal=progress * 1.6,
                     hi=hi, head=("Name (A to Z)", "Maths"), tabs=True)
            if hi is not None:
                top = 260 + 92 + 50
                rh = (850 - 24 - top) / 6
                ry = top + 4 * rh + rh / 2
                K.draw_arrow(draw, 80, ry, 190, ry, coral, width=12, head=34)
            K.draw_person(draw, 1460, 470, 1.15, "teacher", t)
            if progress > 0.55:
                draw.polygon([(1690, 300), (1640, 400), (1680, 400), (1650, 480), (1730, 370), (1690, 370),
                              (1720, 300)], fill=K.GOLD)
                K.pill(draw, 1460, 740, "Found in a flash!", sage, size=38)
            return True
        # computer
        K.draw_device(draw, "laptop", 720, 560, 2.2, brand, t)
        x0, y0, x1, y1 = 720 - 352 + 26, 560 - 260 + 31, 720 + 352 - 26, 560 + 158 - 22
        draw.rectangle((x0, y0, x1, y1), fill=(255, 255, 255))
        draw.rectangle((x0, y0, x1, y0 + 50), fill=K.BOT)
        K.text_at(draw, "GAME SCORES", (x0 + x1) / 2, y0 + 8, F(30), (255, 255, 255))
        rows = [("Aarav", "52"), ("Bina", "47"), ("Chotu", "33"), ("Dev", "29")]
        for i, (nm, sc) in enumerate(rows):
            ry = y0 + 64 + i * 66
            if i == 0 and progress > 0.35:
                draw.rounded_rectangle((x0 + 12, ry - 4, x1 - 12, ry + 56), radius=14, fill=sage_soft, outline=sage,
                                       width=4)
            draw.text((x0 + 40, ry + 6), nm, fill=ink, font=F(36))
            bb = draw.textbbox((0, 0), sc, font=F(36))
            draw.text((x1 - 40 - (bb[2] - bb[0]), ry + 6), sc, fill=ink, font=F(36))
        draw.polygon([(1500, 270), (1430, 420), (1490, 420), (1450, 540), (1570, 380), (1510, 380), (1550, 270)],
                     fill=K.GOLD)
        K.text_at(draw, "Tidy list", 1500, 610 + lift, F(60), ink)
        K.text_at(draw, "= super fast!", 1500, 690 + lift, F(60), sage)
        return True

    # ---- find Kavya ---------------------------------------------------------------------
    if visual == "a19-find":
        ans = focus == "answer"
        ax0, ay0, ax1, ay1 = 140, 270, 880, 850
        draw.rounded_rectangle((ax0 + 10, ay0 + 12, ax1 + 10, ay1 + 12), radius=30, fill=K.SHADOW)
        draw.rounded_rectangle((ax0, ay0, ax1, ay1), radius=30, fill=(246, 243, 238) if ans else PAPER,
                               outline=K.DANGER if ans else line, width=5 if ans else 3)
        K.pill(draw, 0, ay0 + 24, "List A", coral, size=32, left=ax0 + 30)
        scatter = [("Rohan 40", 520, 300, 34), ("Zoya 31", 200, 400, 40), ("Divya 52", 560, 470, 30),
                   ("Kavya 45", 260, 640, 30), ("Aarav 38", 520, 720, 38), ("Ravi 27", 600, 590, 30),
                   ("Meera 33", 190, 520, 34)]
        for nm, x, y, sz in scatter:
            col = muted if ans else ink
            draw.text((x, y + (sz - 30)), nm, fill=col, font=F(sz))
        for k in range(4):
            yy = 380 + k * 120
            draw.line((ax0 + 60 + k * 40, yy, ax0 + 200 + k * 60, yy + 30), fill=(200, 196, 210), width=4)
        if ans:
            K.draw_cross(draw, ax1 - 50, ay0 + 50, 30, K.DANGER)
        hi = 2 if ans and progress > 0.1 else None
        register(draw, brand, (1040, 270, 1780, 850), A19_LIST_B, "List B · A to Z", hi=hi, head=("Name", "Score"),
                 size=44)
        if ans:
            K.draw_check(draw, 1730, 230, 34, sage)
            if hi is not None:
                top = 270 + 92 + 50
                rh = (850 - 24 - top) / 5
                ry = top + 2 * rh + rh / 2
                K.draw_arrow(draw, 920, ry, 1030, ry, sage, width=12, head=34)
        else:
            K.draw_stopwatch(draw, 960, 520, 44, progress, brand)
            K.text_at(draw, "Find", 960, 600, F(34), coral)
            K.text_at(draw, "Kavya!", 960, 640, F(34), coral)
        return True

    # ---- public vs private ---------------------------------------------------------------
    if visual == "a19-private":
        if focus == "intro":
            for i, (title, sub, col, soft) in enumerate((("PUBLIC", "OK to share", sage, sage_soft),
                                                         ("PRIVATE", "Keep it safe", K.DANGER, K.DANGER_SOFT))):
                a = K.stagger(progress, i, step=0.25, speed=4)
                if a <= 0:
                    continue
                x0 = 200 + i * 800
                y0 = 260 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 720 + 10, y0 + 570 + 12), radius=44, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 570), radius=44, fill=soft, outline=col, width=6)
                K.text_at(draw, title, x0 + 360, y0 + 40, F(70), col)
                if i == 0:
                    megaphone(draw, x0 + 330, y0 + 300, 1.3, sage, t)
                else:
                    K.draw_padlock(draw, x0 + 360, y0 + 300, 1.0, K.DANGER)
                K.text_at(draw, sub, x0 + 360, y0 + 470, F(44), ink)
            return True
        if focus in ("public", "private"):
            items = A19_PUBLIC if focus == "public" else A19_PRIVATE
            col = sage if focus == "public" else K.DANGER
            K.pill(draw, 0, 236, "PUBLIC · OK to share" if focus == "public" else "PRIVATE · keep it safe", col,
                   size=36, left=140)
            n = len(items)
            boxes = row_boxes(n, 460 if n == 3 else 380, 70 if n == 3 else 46, 340, 840)
            shown = progress * (n + 1.2) - 0.3
            for i, ((kind, lab), box) in enumerate(zip(items, boxes)):
                a = K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
                if a <= 0:
                    continue
                dy = int((1 - a) * 50)
                state = "pub" if focus == "public" else "priv"
                icon_card((box[0], box[1] + dy, box[2], box[3] + dy), kind, lab, state, icon_s=1.25, label_size=40,
                          badge="check" if focus == "public" else "lock")
            return True
        if focus == "why":
            K.draw_house(draw, 420, 600, 1.05, brand)
            K.draw_map_pin(draw, 420, 360 + bounce, 1.0, K.DANGER)
            K.pill(draw, 420, 790, "Find you", K.DANGER, size=36)
            K.draw_person(draw, 1400, 470, 1.25, "mystery", t)
            K.draw_red_flag(draw, 1580, 360, 1.4)
            gift(draw, 1130, 600, 0.9)
            K.text_at(draw, "Free prize?", 1130, 680, F(34), K.DANGER)
            K.pill(draw, 1400, 790, "Trick you", K.DANGER, size=36)
            K.draw_curve(draw, (1290, 430), (920, 230), (560, 380), K.DANGER, width=6, dashed=True, phase=t * 200)
            return True
        # adults
        K.text_at(draw, "Trusted adults only", cx, 228, F(54), sage)
        K.draw_person(draw, 360, 500, 1.2, "kid", t)
        K.draw_shield(draw, 360, 790 - 10, 0.36, sage)
        for i, (kind, lab) in enumerate((("mom", "Mum"), ("dad", "Dad"), ("teacher", "Teacher"))):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x = 1000 + i * 300
            y = 480 + int((1 - a) * 30)
            draw.ellipse((x - 130, y - 130, x + 130, y + 130), fill=sage_soft)
            K.draw_person(draw, x, y - 20, 0.95, kind, t)
            K.text_at(draw, lab, x, y + 160, F(40), ink)
            K.draw_check(draw, x + 100, y - 100, 28, sage)
        K.draw_heart(draw, 640, 400 + bounce, 30, K.DANGER)
        K.draw_arrow(draw, 560, 520, 800, 520, sage, width=10, head=30)
        return True

    # ---- sort game -------------------------------------------------------------------------
    if visual == "a19-sort":
        ans = focus == "answer"
        cw, ch = 300, 230
        row_x = [cx - (4 * cw + 3 * 60) / 2 + i * (cw + 60) for i in range(4)]
        pub_box, priv_box = (170, 550, 930, 860), (990, 550, 1750, 860)
        bin_box(pub_box, "PUBLIC", sage, sage_soft)
        bin_box(priv_box, "PRIVATE", K.DANGER, K.DANGER_SOFT, locked=True)
        slots = {"pub": [210, 590], "priv": [1030, 1410]}
        used = {"pub": 0, "priv": 0}
        for i, (kind, lab, where) in enumerate(A19_SORT):
            j = used[where]
            used[where] += 1
            mv = K.ease_in_out(K.clamp01((progress - 0.05 - i * 0.08) * 2.5)) if ans else 0.0
            x = K.lerp(row_x[i], slots[where][j], mv)
            y = K.lerp(250, 600, mv)
            placed = mv >= 1
            icon_card((x, y, x + cw, y + ch), kind, lab, where if placed else "normal", icon_s=0.72, label_size=32,
                      badge=("check" if where == "pub" else "lock") if placed else None)
        if not ans:
            K.draw_stopwatch(draw, 1790, 380, 40, progress, brand)
            K.text_at(draw, "?", 550, 680, F(90), sage)
            K.text_at(draw, "?", 1370, 680, F(90), K.DANGER)
        elif progress > 0.6:
            K.pill(draw, cx, 300, "Never post your phone number!", K.DANGER, size=40)
        return True

    # ---- prize pop-up & class web page ------------------------------------------------------
    if visual == "a19-popup":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            box = tablet(draw, 700, 560, 1.38)
            cricket_screen(draw, box, t, score="52", label="BEST", ball=False)
            x0, y0, x1, y1 = box
            draw.rectangle(box, fill=(150, 170, 160))
            px0, py0, px1, py1 = x0 + 90, y0 + 40, x1 - 90, y1 - 40
            pmx = (px0 + px1) / 2
            draw.rounded_rectangle((px0 + 8, py0 + 10, px1 + 8, py1 + 10), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((px0, py0, px1, py1), radius=24, fill=panel, outline=ink, width=4)
            draw.rounded_rectangle((px0, py0, px1, py0 + 80), radius=24, fill=K.GOLD)
            draw.rectangle((px0, py0 + 50, px1, py0 + 80), fill=K.GOLD)
            K.text_at(draw, "WIN A PRIZE!", pmx + 30, py0 + 16, F(42), ink)
            gift(draw, px0 + 70, py0 + 40, 0.42)
            for i, lab in enumerate(("Birthday:", "School name:")):
                fy = py0 + 110 + i * 100
                draw.text((px0 + 40, fy + 16), lab, fill=ink, font=F(32))
                lx = px0 + 40 + draw.textbbox((0, 0), lab + " ", font=F(32))[2]
                draw.rounded_rectangle((lx, fy, px1 - 40, fy + 66), radius=14, fill=(246, 243, 238), outline=line,
                                       width=3)
            draw.rounded_rectangle((pmx - 110, py1 - 86, pmx + 110, py1 - 26), radius=30, fill=coral)
            K.text_at(draw, "SUBMIT", pmx, py1 - 76, F(30), (255, 255, 255))
            if ans:
                K.draw_cross(draw, px1 - 10, py0 + 10, 40, K.DANGER)
                K.draw_person(draw, 1340, 500, 1.0, "kid", t)
                K.draw_person(draw, 1640, 470, 1.05, "mom", t)
                K.draw_bubble(draw, (1240, 230, 1760, 350), brand, "Mum, look at this!", tail="left", size=36)
                K.pill(draw, 1490, 740, "Don't share", K.DANGER, size=34)
                K.pill(draw, 1490, 812, "Tell a trusted adult", sage, size=30)
            else:
                K.draw_person(draw, 1500, 470, 1.15, "kid", t)
                qmarks([(1340, 290), (1660, 280)], 70)
                K.draw_stopwatch(draw, 1500, 790, 44, progress, brand)
            return True
        # webpage
        K.draw_browser(draw, 760, 570, 1.25, brand, url="www.class4b.school", content=0.0)
        x0, y0 = 760 - 400, 570 - 269
        rows = [("Class 4B", True), ("Sports day: 12 Dec", True), ("Parents' phone numbers", False)]
        for i, (lab, ok) in enumerate(rows):
            a = K.stagger(progress, i, step=0.22, speed=4)
            if a <= 0:
                continue
            ry = y0 + 130 + i * 128 + int((1 - a) * 20)
            col = sage if ok else K.DANGER
            draw.rounded_rectangle((x0 + 36, ry, x0 + 764, ry + 104), radius=24,
                                   fill=sage_soft if ok else K.DANGER_SOFT, outline=col, width=4)
            draw.text((x0 + 70, ry + 30), lab, fill=ink if ok else muted, font=F(38))
            if ok:
                K.draw_check(draw, x0 + 710, ry + 52, 26, sage)
            else:
                bb = draw.textbbox((x0 + 70, ry + 30), lab, font=F(38))
                if progress > 0.7:
                    draw.line((x0 + 60, ry + 54, bb[2] + 10, ry + 54), fill=K.DANGER, width=6)
                K.draw_cross(draw, x0 + 710, ry + 52, 26, K.DANGER)
        for i, kind in enumerate(("friend", "mystery", "dad", "teacher")):
            px = 1340 + (i % 2) * 230
            py = 330 + (i // 2) * 250
            K.draw_person(draw, px, py, 0.7, kind, t)
        K.text_at(draw, "Everyone can see it!", 1455, 760, F(38), ink)
        return True

    # ---- checkpoint ---------------------------------------------------------------------
    if visual == "a19-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, F(40), sage)
            K.text_at(draw, "Public or private?", cx, 420 + lift, F(66), ink)
            cake(draw, cx, 640 + lift, 0.8)
            return True
        ans = focus == "answer"
        draw.ellipse((470 - 250, 540 - 250, 470 + 250, 540 + 250), fill=K.DANGER_SOFT if ans else coral_soft)
        cake(draw, 470, 560, 1.6)
        K.text_at(draw, "My birthday", 470, 760, F(44), ink)
        if ans:
            K.pill(draw, 470, 250, "PRIVATE", K.DANGER, size=44)
            K.draw_padlock(draw, 680, 380, 0.42, K.DANGER)
            for i, (kind, lab) in enumerate((("mom", "Family"), ("teacher", "Teacher"))):
                a = K.stagger(progress, i + 1, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 1000 + i * 290
                K.draw_person(draw, x, 450 + int((1 - a) * 20), 0.9, kind, t)
                K.text_at(draw, lab, x, 650, F(38), ink)
                K.draw_check(draw, x + 90, 360, 28, sage)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                K.draw_device(draw, "laptop", 1610, 470, 0.55, brand, face=None)
                K.draw_person(draw, 1610, 430, 0.42, "mystery")
                K.text_at(draw, "Strangers", 1610, 590, F(36), K.DANGER)
                K.text_at(draw, "online", 1610, 634, F(36), K.DANGER)
                K.draw_cross(draw, 1720, 340, 28, K.DANGER)
            K.pill(draw, 1300, 770, "Tell only people you trust", sage, size=34)
        else:
            K.pill(draw, 470, 250, "Pause & try!", coral, size=36)
            for i, (q, col) in enumerate((("Public or private?", K.BOTH_COLOR), ("Who should you tell?", sage))):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 310 + i * 220 + int((1 - a) * 30)
                draw.rounded_rectangle((900, y, 1740, y + 170), radius=40, fill=panel, outline=col, width=5)
                draw.ellipse((930, y + 40, 1020, y + 130), fill=col)
                K.text_at(draw, "?", 975, y + 44, F(64), (255, 255, 255))
                draw.text((1050, y + 54), q, fill=ink, font=F(50))
            K.draw_stopwatch(draw, 1320, 790, 44, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------
    if visual == "a19-recap":
        recap = [("Data = facts computers store", coral, "data"), ("Tidy lists are quick", K.BOT, "list"),
                 ("Private stays private", K.DANGER, "lock"), ("Tell trusted adults", sage, "adults")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 210
                if kind == "data":
                    icon(draw, brand, "name", ix - 60, iy - 60, 0.6, t)
                    icon(draw, brand, "score", ix + 80, iy - 20, 0.6, t)
                    icon(draw, brand, "photo", ix - 40, iy + 80, 0.55, t)
                else:
                    icon(draw, brand, kind, ix, iy, 1.0, t)
                font = F(36)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 400 + j * 44, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 320), 440, 110, sage, panel, bounce)
            box = tablet(draw, cx + 280, 450, 0.7)
            draw.rectangle(box, fill=sage_soft)
            K.draw_check(draw, cx + 280, 450, 70, sage)
            K.text_at(draw, "Chapter 4 done!", cx, 660, F(68), ink)
            K.pill(draw, cx, 760, "Next: your capstone app!", coral, size=36)
            sparkle([(cx - 640, 320), (cx - 600, 600), (cx + 660, 300), (cx + 680, 620)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
