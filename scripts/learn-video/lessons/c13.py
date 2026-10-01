"""C13 · Symmetry and Patterns — visuals."""
import math

import build as K

RED = (226, 62, 70)
BLUE = (60, 120, 220)
YELLOW = (255, 204, 40)
PINK = (238, 104, 158)
PINK_DARK = (196, 64, 118)
FLOOR = (150, 52, 48)
FLOOR_DARK = (120, 38, 36)
POWDER = (250, 246, 236)
CLAY = (200, 100, 60)
CLAY_DARK = (160, 70, 40)
GRASS = (96, 176, 84)
GRASS_DARK = (64, 136, 60)
BRICK = (196, 120, 76)
BRICK_DARK = (150, 84, 52)
SKY = (214, 234, 250)
TILE = (250, 242, 226)
TILE_EDGE = (214, 200, 176)

BFLY = {"u": (255, 150, 60), "ud": (206, 96, 32), "l": (238, 104, 158), "ld": (190, 62, 116), "spot": (255, 214, 70)}
PAPER = {"u": (255, 214, 120), "ud": (214, 160, 70), "l": (255, 186, 150), "ld": (214, 130, 100),
         "spot": (255, 246, 214)}
PAPER_BACK = {"u": (240, 226, 196), "ud": (196, 176, 140), "l": (236, 214, 200), "ld": (196, 164, 150),
              "spot": (246, 238, 222)}


def chaikin(pts, n=2):
    for _ in range(n):
        out = []
        for i, p in enumerate(pts):
            q = pts[(i + 1) % len(pts)]
            out.append((0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]))
            out.append((0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]))
        pts = out
    return pts


UPPER = chaikin([(2, -16), (24, -84), (78, -146), (150, -162), (192, -130), (186, -66), (150, -28), (70, -4)])
LOWER = chaikin([(2, 8), (60, 10), (122, 42), (146, 92), (124, 142), (78, 152), (36, 120), (8, 62)])


def lighten(col, f):
    return tuple(int(c + (255 - c) * f) for c in col)


def wing(part, cx, cy, s, fx):
    base = UPPER if part == "u" else LOWER
    return [(cx + x * s * fx, cy + y * s) for x, y in base]


def wing_half(draw, cx, cy, s, fx, cols, outline=True):
    w_ = max(2, int(4 * s))
    for part, sx, sy, sr in (("u", 112, -96, 30), ("l", 82, 86, 22)):
        draw.polygon(wing(part, cx, cy, s, fx), fill=cols[part], outline=cols[part + "d"] if outline else None,
                     width=w_)
        rx = abs(sr * s * fx)
        px, py = cx + sx * s * fx, cy + sy * s
        if rx > 1:
            draw.ellipse((px - rx, py - sr * s, px + rx, py + sr * s), fill=cols["spot"])
            ir = rx * 0.45
            draw.ellipse((px - ir, py - sr * s * 0.45, px + ir, py + sr * s * 0.45), fill=cols[part + "d"])


def bfly_body(draw, cx, cy, s, col=(70, 52, 60)):
    for sx in (-1, 1):
        K.draw_curve(draw, (cx + sx * 4 * s, cy - 70 * s), (cx + sx * 14 * s, cy - 130 * s),
                     (cx + sx * 46 * s, cy - 150 * s), col, width=max(2, int(5 * s)))
        draw.ellipse((cx + sx * 46 * s - 8 * s, cy - 158 * s, cx + sx * 46 * s + 8 * s, cy - 142 * s), fill=col)
    draw.ellipse((cx - 13 * s, cy - 60 * s, cx + 13 * s, cy + 112 * s), fill=col)
    draw.ellipse((cx - 18 * s, cy - 88 * s, cx + 18 * s, cy - 52 * s), fill=col)


def butterfly(draw, cx, cy, s, cols=BFLY, left=True, right=True, fold=0.0, back=None, body=True):
    """Fold line is x = cx. fold 0→1 swings the right wing over onto the left one."""
    if left:
        wing_half(draw, cx, cy, s, -1, cols)
    fx = math.cos(math.pi * fold)
    if right and fold > 0.5:
        if body:
            bfly_body(draw, cx, cy, s)
        wing_half(draw, cx, cy, s, fx, back or cols)
        return
    if right:
        wing_half(draw, cx, cy, s, fx, cols)
    if body:
        bfly_body(draw, cx, cy, s)


def dashed_poly(draw, pts, col, width=5, dash=18, gap=12, closed=True):
    seq = list(pts) + [pts[0]] if closed else list(pts)
    cum = 0.0
    for a, b in zip(seq, seq[1:]):
        K.draw_dashed(draw, a[0], a[1], b[0], b[1], col, width=width, dash=dash, gap=gap, phase=cum)
        cum += math.hypot(b[0] - a[0], b[1] - a[1])


def reflect(p, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    L2 = dx * dx + dy * dy
    k = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2
    fx, fy = a[0] + k * dx, a[1] + k * dy
    return 2 * fx - p[0], 2 * fy - p[1]


def kid(draw, cx, cy, s, body, t=0.0, bun=True, clip=None):
    """Child bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    cy = cy + 6 * s * math.sin(t * math.pi * 4)
    draw.chord((cx - 96 * s + 6 * s, cy + 54 * s, cx + 96 * s + 6 * s, cy + 244 * s), 180, 360, fill=K.SHADOW)
    draw.chord((cx - 96 * s, cy + 46 * s, cx + 96 * s, cy + 236 * s), 180, 360, fill=body)
    r = 64 * s
    if bun:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                         fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    if clip:
        draw.ellipse((cx + r * 0.45, cy - r * 1.05, cx + r * 0.95, cy - r * 0.55), fill=clip)
        draw.ellipse((cx + r * 0.6, cy - r * 0.9, cx + r * 0.8, cy - r * 0.7), fill=YELLOW)


def riya(draw, cx, cy, s, t=0.0):
    kid(draw, cx, cy, s, PINK, t, bun=True, clip=K.CORAL)


def diya(draw, cx, cy, s, t):
    draw.ellipse((cx - 70 * s, cy + 14 * s, cx + 70 * s, cy + 34 * s), fill=K.SHADOW)
    draw.chord((cx - 70 * s, cy - 40 * s, cx + 70 * s, cy + 40 * s), 0, 180, fill=CLAY)
    draw.ellipse((cx - 70 * s, cy - 12 * s, cx + 70 * s, cy + 12 * s), fill=CLAY_DARK)
    fl = 5 * s * math.sin(t * 30)
    draw.ellipse((cx - 14 * s, cy - 62 * s + fl, cx + 14 * s, cy - 8 * s), fill=K.GOLD)
    draw.ellipse((cx - 7 * s, cy - 40 * s + fl, cx + 7 * s, cy - 12 * s), fill=(255, 250, 220))


def petal(draw, cx, cy, ang, r0, r1, wd, col):
    ca, sa = math.cos(ang), math.sin(ang)
    rm = (r0 + r1) / 2
    loc = [(r0, 0), (rm, wd), (r1 * 0.94, wd * 0.45), (r1, 0), (r1 * 0.94, -wd * 0.45), (rm, -wd)]
    draw.polygon([(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in loc], fill=col)


def rangoli(draw, cx, cy, r, t=0.0, shown=1.0):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=FLOOR)
    for k in range(16):
        if k / 16 > shown * 1.4:
            break
        a = k * math.pi / 8 + math.pi / 16
        petal(draw, cx, cy, a, r * 0.2, r * 0.92, r * 0.13, POWDER)
    for k in range(8):
        if k / 8 > shown * 1.2:
            break
        a = k * math.pi / 4
        petal(draw, cx, cy, a, r * 0.18, r * 0.86, r * 0.17, K.CORAL if k % 2 == 0 else YELLOW)
    for k in range(8):
        a = k * math.pi / 4 + math.pi / 8
        petal(draw, cx, cy, a, r * 0.16, r * 0.5, r * 0.11, PINK)
    draw.ellipse((cx - r * 0.2, cy - r * 0.2, cx + r * 0.2, cy + r * 0.2), fill=YELLOW)
    draw.ellipse((cx - r * 0.08, cy - r * 0.08, cx + r * 0.08, cy + r * 0.08), fill=K.CORAL)
    for k in range(24):
        a = k * math.pi / 12 + t * 0.4
        dx, dy = cx + math.cos(a) * r * 1.0, cy + math.sin(a) * r * 1.0
        rr = r * 0.035
        draw.ellipse((dx - rr, dy - rr, dx + rr, dy + rr), fill=POWDER)


def heart_pts(cx, cy, k, side=None, n=60):
    """side None: whole heart; 'r' / 'l': that half closed along the middle line."""
    if side is None:
        ts = [2 * math.pi * i / n for i in range(n)]
    elif side == "r":
        ts = [math.pi * i / (n // 2) for i in range(n // 2 + 1)]
    else:
        ts = [math.pi + math.pi * i / (n // 2) for i in range(n // 2 + 1)]
    pts = []
    for tt in ts:
        x = 16 * math.sin(tt) ** 3
        y = -(13 * math.cos(tt) - 5 * math.cos(2 * tt) - 2 * math.cos(3 * tt) - math.cos(4 * tt))
        pts.append((cx + x * k, cy + y * k))
    return pts


def letter_strokes(kind, cx, cy, h):
    u = h / 340
    if kind == "A":
        return [((cx - 130 * u, cy + 170 * u), (cx, cy - 170 * u)), ((cx, cy - 170 * u), (cx + 130 * u, cy + 170 * u)),
                ((cx - 68 * u, cy + 50 * u), (cx + 68 * u, cy + 50 * u))]
    return [((cx - 80 * u, cy - 170 * u), (cx - 80 * u, cy + 170 * u)),
            ((cx - 80 * u, cy - 150 * u), (cx + 110 * u, cy - 150 * u)),
            ((cx - 80 * u, cy), (cx + 70 * u, cy))]


def draw_letter(draw, kind, cx, cy, h, col, mirror=False):
    wd = int(h * 0.14)
    for (x0, y0), (x1, y1) in letter_strokes(kind, cx, cy, h):
        if mirror:
            x0, x1 = 2 * cx - x0, 2 * cx - x1
        draw.line((x0, y0, x1, y1), fill=col, width=wd)
        for x, y in ((x0, y0), (x1, y1)):
            draw.ellipse((x - wd / 2, y - wd / 2, x + wd / 2, y + wd / 2), fill=col)


def game_tile(draw, x0, y0, c, grass=True):
    draw.rectangle((x0, y0, x0 + c, y0 + c), fill=BRICK, outline=BRICK_DARK, width=max(2, int(c * 0.04)))
    draw.line((x0, y0 + c * 0.5, x0 + c, y0 + c * 0.5), fill=BRICK_DARK, width=max(2, int(c * 0.04)))
    draw.line((x0 + c * 0.5, y0 + c * 0.5, x0 + c * 0.5, y0 + c), fill=BRICK_DARK, width=max(2, int(c * 0.04)))
    draw.line((x0 + c * 0.25, y0 + c * 0.2, x0 + c * 0.25, y0 + c * 0.5), fill=BRICK_DARK,
              width=max(2, int(c * 0.04)))
    draw.line((x0 + c * 0.75, y0 + c * 0.2, x0 + c * 0.75, y0 + c * 0.5), fill=BRICK_DARK,
              width=max(2, int(c * 0.04)))
    if grass:
        draw.rectangle((x0, y0, x0 + c, y0 + c * 0.22), fill=GRASS)
        for k in range(4):
            gx = x0 + c * (0.125 + k * 0.25)
            draw.polygon([(gx - c * 0.1, y0 + c * 0.2), (gx + c * 0.1, y0 + c * 0.2), (gx, y0 + c * 0.32)],
                         fill=GRASS_DARK)


def floor_tile(draw, cx, cy, sz, kind, col):
    draw.rounded_rectangle((cx - sz / 2 + 6, cy - sz / 2 + 8, cx + sz / 2 + 6, cy + sz / 2 + 8), radius=14,
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - sz / 2, cy - sz / 2, cx + sz / 2, cy + sz / 2), radius=14, fill=TILE,
                           outline=TILE_EDGE, width=4)
    q = sz * 0.3
    if kind == "square":
        draw.rectangle((cx - q, cy - q, cx + q, cy + q), fill=col)
    else:
        draw.polygon([(cx, cy - q * 1.1), (cx + q * 1.15, cy + q * 0.9), (cx - q * 1.15, cy + q * 0.9)], fill=col)


def powder_bowl(draw, cx, cy, s, col):
    draw.ellipse((cx - 80 * s + 6, cy + 30 * s + 8, cx + 80 * s + 6, cy + 60 * s + 8), fill=K.SHADOW)
    draw.chord((cx - 70 * s, cy - 40 * s, cx + 70 * s, cy + 60 * s), 180, 360, fill=lighten(col, 0.1))
    draw.ellipse((cx - 30 * s, cy - 34 * s, cx - 6 * s, cy - 18 * s), fill=lighten(col, 0.5))
    draw.chord((cx - 82 * s, cy - 20 * s, cx + 82 * s, cy + 70 * s), 0, 180, fill=K.STEEL)
    draw.ellipse((cx - 82 * s, cy, cx + 82 * s, cy + 22 * s), fill=K.STEEL_DARK)
    draw.ellipse((cx - 76 * s, cy + 2 * s, cx + 76 * s, cy + 18 * s), fill=col)


def thought(draw, box, tail_to, fill=(255, 255, 255), outline=(200, 192, 180)):
    x0, y0, x1, y1 = box
    draw.ellipse((x0 + 8, y0 + 10, x1 + 8, y1 + 10), fill=K.SHADOW)
    draw.ellipse(box, fill=fill, outline=outline, width=4)
    bx, by = x0 + (x1 - x0) * 0.2, y1 - (y1 - y0) * 0.12
    for k, r in enumerate((20, 13)):
        f = (k + 1) / 3
        px, py = K.lerp(bx, tail_to[0], f), K.lerp(by, tail_to[1], f)
        draw.ellipse((px - r, py - r, px + r, py + r), fill=fill, outline=outline, width=3)


# grid used for "draw the missing half"
GFX, GTY, GC = 760, 320, 84
WING_L = [(0, 1), (-2, 0), (-4, 1), (-4, 3), (-3, 4), (-1, 5), (0, 4)]


def gpt(c, r):
    return GFX + c * GC, GTY + r * GC


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

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def vline(x, y0, y1, col, grow=1.0, width=6):
        K.draw_dashed(draw, x, y0, x, y0 + (y1 - y0) * K.clamp01(grow), col, width=width, phase=progress * 80)

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        dashed_poly(draw, [(x0, y0), (x1, y0), (x1, y1), (x0, y1)], color, width=width)

    def bracket(x0, x1, y, col, label=None, size=30):
        draw.line((x0, y - 18, x0, y, x1, y, x1, y - 18), fill=col, width=6)
        if label:
            K.text_at(draw, label, (x0 + x1) / 2, y + 12, font(size, bold=True), col)

    def fly(x, y, s, k=0):
        butterfly(draw, x + 8 * math.sin(t * 7 + k), y + 10 * math.sin(t * 9 + k), s)

    # ---- opening -----------------------------------------------------------
    if visual == "c13-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            riya(draw, cx + 280, 430, 1.3, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            fly(cx - 620, 360, 0.32, 0)
            fly(cx + 620, 360, 0.32, 1)
            star_spots([(cx - 680, 600), (cx + 680, 600)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · GRIDS", cx, 326 + lift, font(34, bold=True), sage)
            ox, oy, c = 430, 780 + lift, 76
            for i in range(6):
                draw.line((ox + i * c, oy, ox + i * c, oy - 5 * c), fill=line, width=3)
                draw.line((ox, oy - i * c, ox + 5 * c, oy - i * c), fill=line, width=3)
                K.text_at(draw, str(i), ox + i * c, oy + 10, font(26, bold=True), muted)
                if i:
                    K.text_at(draw, str(i), ox - 30, oy - i * c - 16, font(26, bold=True), muted)
            a = K.clamp01(progress * 3)
            ex = ox + 4 * c * a
            K.draw_arrow(draw, ox, oy, ex, oy, coral, width=10, head=26)
            b = K.clamp01(progress * 3 - 1.2)
            if b > 0:
                K.draw_arrow(draw, ox + 4 * c, oy, ox + 4 * c, oy - 2 * c * b, sage, width=10, head=26)
            if b >= 1:
                px, py = ox + 4 * c, oy - 2 * c
                draw.ellipse((px - 18, py - 18, px + 18, py + 18), fill=K.BOTH_COLOR)
            K.text_at(draw, "(4, 2)", 1250, 400 + lift, font(110, bold=True), ink)
            K.pill(draw, 1250, 580 + lift, "4 across first", coral, size=38)
            K.pill(draw, 1250, 680 + lift, "then 2 up", sage, size=38)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Symmetry and Patterns", cx, 360 + lift, font(86, bold=True), ink)
            a = K.stagger(progress, 1, step=0.15, speed=4)
            if a > 0:
                butterfly(draw, 620, 700 + int((1 - a) * 30), 0.6)
                vline(620, 580, 820, coral)
            items = ["star", "dot", "dot", "star", "dot", "dot", "star"]
            for i, kd in enumerate(items):
                a = K.stagger(progress, i + 2, step=0.07, speed=5)
                if a <= 0:
                    continue
                x = 960 + i * 100
                y = 700 + int((1 - a) * 30)
                if kd == "star":
                    K.draw_star(draw, x, y, 40, K.GOLD)
                else:
                    draw.ellipse((x - 16, y - 16, x + 16, y + 16), fill=coral)
            return True
        # promise
        K.text_at(draw, "Let's become rangoli artists!", cx, 240 + lift, font(56, bold=True), ink)
        specs = [("Fold", coral_soft), ("Mirror", blue_soft), ("Pattern", sage_soft)]
        for i, (lab, soft) in enumerate(specs):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 480
            y = 540 + int((1 - a) * 40)
            draw.ellipse((x - 170, y - 170, x + 170, y + 170), fill=soft)
            if i == 0:
                butterfly(draw, x, y + 10, 0.62, PAPER, fold=0.3 + 0.2 * math.sin(t * 6), back=PAPER_BACK)
            elif i == 1:
                wing_half(draw, x, y + 10, 0.62, -1, BFLY)
                wing_half(draw, x, y + 10, 0.62, 1, {k: lighten(v, 0.45) for k, v in BFLY.items()})
                draw.rounded_rectangle((x - 8, y - 130, x + 8, y + 140), radius=6, fill=(196, 214, 230),
                                       outline=K.STEEL_DARK, width=3)
            else:
                for k, kd in enumerate(("star", "dot", "dot", "star")):
                    px = x - 120 + k * 80
                    if kd == "star":
                        K.draw_star(draw, px, y, 36, K.GOLD)
                    else:
                        draw.ellipse((px - 14, y - 14, px + 14, y + 14), fill=coral)
            K.text_at(draw, lab, x, y + 190, font(46, bold=True), ink)
        return True

    # ---- Riya's rangoli -----------------------------------------------------
    if visual == "c13-hook":
        if focus == "meet":
            rangoli(draw, cx, 560, 235, t, shown=K.clamp01(progress * 2))
            riya(draw, 330, 470, 1.3, t)
            K.draw_person(draw, 1590, 470, 1.3, "nani", t)
            K.pill(draw, 330, 690, "Riya", coral, size=40)
            K.pill(draw, 1590, 690, "Nani", sage, size=40)
            K.pill(draw, cx, 236, "Diwali morning!", K.BOTH_COLOR, size=36)
            diya(draw, 200, 820, 0.9, t)
            diya(draw, 1720, 820, 0.9, t + 0.3)
            star_spots([(560, 330), (1360, 330)])
            return True
        if focus == "half":
            draw.rounded_rectangle((630, 300, 1340, 860), radius=30, fill=FLOOR)
            for k in range(14):
                for (x0, y0, x1, y1) in ((650, 320, 1320, 320), (650, 840, 1320, 840)):
                    x = x0 + k * (x1 - x0) / 13
                    draw.ellipse((x - 7, y0 - 7, x + 7, y0 + 7), fill=POWDER)
            bx, by, bs = 985, 590, 1.05
            wing_half(draw, bx, by, bs, -1, BFLY)
            bfly_body(draw, bx, by, bs, col=POWDER)
            dashed_poly(draw, wing("u", bx, by, bs, 1), POWDER, width=4)
            dashed_poly(draw, wing("l", bx, by, bs, 1), POWDER, width=4)
            K.text_at(draw, "?", bx + 105, by - 60, font(int(100 + 14 * pulse), bold=True), K.GOLD)
            K.draw_person(draw, 250, 610, 1.1, "nani", t)
            K.draw_bubble(draw, (90, 250, 570, 430), brand, "Draw the other wing. Make it match!", tail="left",
                          size=36)
            riya(draw, 1630, 610, 1.1, t)
            return True
        if focus == "ask":
            draw.ellipse((480 - 260, 560 - 260, 480 + 260, 560 + 260), fill=coral_soft)
            riya(draw, 480, 530, 1.6, 0)
            thought(draw, (820, 250, 1520, 720), (640, 440))
            bx, by = 1170, 500
            wing_half(draw, bx, by, 0.85, -1, BFLY)
            wing_half(draw, bx, by, 0.85, 1, {k: lighten(v, 0.6) for k, v in BFLY.items()})
            bfly_body(draw, bx, by, 0.85)
            K.text_at(draw, "?", bx + 90, by - 60, font(int(80 + 14 * pulse), bold=True), coral)
            K.text_at(draw, "Do they match?", 1170, 760, font(44, bold=True), ink)
            question_marks([(1680, 300), (1720, 560)], size=80)
            K.draw_stopwatch(draw, 1660, 790, 44, progress, brand)
            return True
        if focus in ("fold", "match"):
            bx, by, bs = 960, 580, 1.45
            if focus == "fold":
                f = 0.86 * K.ease_in_out(K.clamp01(progress * 1.15))
            else:
                f = min(1.0, 0.86 + 0.14 * K.ease_out_cubic(K.clamp01(progress * 4)))
            done = f >= 0.999
            if done:
                for part in ("u", "l"):
                    draw.polygon(wing(part, bx, by, bs * 1.06, -1), fill=sage_soft)
            butterfly(draw, bx, by, bs, PAPER, fold=f, back=PAPER_BACK)
            if done:
                for part in ("u", "l"):
                    draw.line(wing(part, bx, by, bs, -1) + [wing(part, bx, by, bs, -1)[0]], fill=sage, width=6)
            vline(bx, 290, 850, coral, grow=1.0 if focus == "match" else progress * 3)
            if focus == "fold":
                K.draw_curve(draw, (1170, 300), (970, 200), (780, 300), coral, width=8)
                draw.polygon([(770, 310), (790, 270), (808, 306)], fill=coral)
                K.draw_person(draw, 260, 610, 1.0, "nani", t)
                riya(draw, 1660, 610, 1.0, t)
            else:
                K.draw_check(draw, 760, 300, 34, sage)
                K.text_at(draw, "Perfect match!", 1420, 400, font(66, bold=True), coral)
                K.pill(draw, 1420, 510, "No bits sticking out", sage, size=36)
                riya(draw, 1460, 700, 0.85, t)
                star_spots([(300, 360), (420, 760), (1760, 330)])
            return True

    # ---- definition ----------------------------------------------------------------
    if visual == "c13-define":
        if focus == "name":
            butterfly(draw, 620, 580, 1.35)
            vline(620, 300, 860, coral, grow=progress * 2.2, width=8)
            K.text_at(draw, "Line of", 1340, 330 + lift, font(64, bold=True), muted)
            K.text_at(draw, "Symmetry", 1340, 410 + lift, font(110, bold=True), coral)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1340, 600 + int((1 - a) * 20), "the fold line", sage, size=40)
                K.draw_arrow(draw, 1150, 760, 660, 820, sage, width=8, head=26)
            return True
        if focus == "meaning":
            butterfly(draw, 520, 560, 1.2)
            vline(520, 290, 765, coral)
            K.pill(draw, 400, 790, "half", K.BOTH_COLOR, size=30)
            K.text_at(draw, "=", 520, 786, font(48, bold=True), ink)
            K.pill(draw, 640, 790, "half", K.BOTH_COLOR, size=30)
            K.shadow_card(draw, (900, 270 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "LINE OF SYMMETRY", 1340, 330 + lift, font(40, bold=True), muted)
            parts = [("A fold line", ink), ("where both halves", coral), ("match exactly!", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1340, 440 + i * 110 + lift + int((1 - a) * 30), font(66, bold=True), col)
            return True
        if focus == "mirror":
            riya(draw, 300, 560, 1.1, t)
            bx, by, bs = 1000, 590, 1.3
            wing_half(draw, bx, by, bs, -1, BFLY)
            a = K.ease_out_cubic(K.clamp01(progress * 2.5))
            if a > 0:
                wing_half(draw, bx, by, bs, a, {k: lighten(v, 0.4) for k, v in BFLY.items()})
            bfly_body(draw, bx, by, bs)
            draw.rounded_rectangle((986, 290, 1014, 840), radius=8, fill=(200, 222, 240), outline=K.STEEL_DARK,
                                   width=3)
            for k in range(3):
                yy = 340 + k * 170 + 30 * math.sin(t * 6 + k)
                draw.line((994, yy, 1006, yy + 40), fill=(255, 255, 255), width=4)
            draw.rounded_rectangle((940, 836, 1060, 862), radius=10, fill=K.STEEL_DARK)
            K.text_at(draw, "Real half", 840, 260, font(36, bold=True), coral)
            K.text_at(draw, "Reflection", 1170, 260, font(36, bold=True), K.ROAD)
            K.pill(draw, 1560, 540, "Mirror = fold line", K.BOTH_COLOR, size=36)
            return True
        if focus == "word":
            K.text_at(draw, "Symmetrical", cx, 236 + lift, font(96, bold=True), coral)
            K.text_at(draw, "has at least one line of symmetry", cx, 360 + lift, font(40, bold=True), muted)
            specs = [("Butterfly", coral_soft), ("Diya", sage_soft), ("Star", lav_soft)]
            for i, (lab, soft) in enumerate(specs):
                a = K.stagger(progress, i + 1, step=0.14, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 480
                y = 620 + int((1 - a) * 30)
                draw.ellipse((x - 160, y - 160, x + 160, y + 160), fill=soft)
                if i == 0:
                    butterfly(draw, x, y + 10, 0.58)
                elif i == 1:
                    diya(draw, x, y + 40, 1.5, t)
                else:
                    K.draw_star(draw, x, y + 10, 110, K.GOLD)
                vline(x, y - 150, y + 150, sage, width=5)
                K.draw_check(draw, x + 130, y - 120, 26, sage)
                K.text_at(draw, lab, x, y + 176, font(36, bold=True), ink)
            return True
        # notany
        bx, by, bs = 700, 580, 1.35
        butterfly(draw, bx, by, bs)
        f = K.ease_in_out(K.clamp01(progress * 1.6))
        fy = math.cos(math.pi * f)
        if f > 0.02:
            for sgn in (-1, 1):
                pts = [(x, by + (y - by) * fy) for x, y in wing("u", bx, by, bs, sgn)]
                dashed_poly(draw, pts, K.DANGER, width=5)
        K.draw_dashed(draw, 320, by, 1080, by, K.DANGER, width=7, phase=progress * 80)
        if progress > 0.5:
            K.draw_cross(draw, 1060, 400, 34, K.DANGER)
        K.text_at(draw, "Top and bottom", 1450, 380 + lift, font(56, bold=True), ink)
        K.text_at(draw, "don't match!", 1450, 460 + lift, font(56, bold=True), K.DANGER)
        K.pill(draw, 1450, 600, "Not a line of symmetry", K.DANGER, size=34)
        return True

    # ---- fold test ---------------------------------------------------------------
    if visual == "c13-fold":
        if focus == "house":
            hx = 600
            draw.polygon([(410, 540), (hx, 340), (790, 540)], fill=K.CORAL)
            draw.rectangle((450, 530, 750, 800), fill=(255, 226, 170), outline=(214, 170, 110), width=4)
            draw.rounded_rectangle((560, 650, 640, 800), radius=10, fill=CLAY_DARK)
            for wx in (500, 700):
                draw.rectangle((wx - 34, 580, wx + 34, 640), fill=SKY, outline=(214, 170, 110), width=4)
                draw.line((wx, 580, wx, 640), fill=(214, 170, 110), width=3)
            draw.rectangle((380, 800, 820, 816), fill=GRASS)
            vline(hx, 300, 850, coral, grow=progress * 2.4, width=7)
            K.text_at(draw, "Fold down the middle", 1340, 320 + lift, font(52, bold=True), ink)
            for i, lab in enumerate(("Roof matches", "Walls match")):
                a = K.stagger(progress, i + 2, step=0.14, speed=4)
                if a <= 0:
                    continue
                y = 440 + i * 110 + int((1 - a) * 20)
                draw.rounded_rectangle((1060, y, 1620, y + 90), radius=45, fill=sage_soft, outline=sage, width=4)
                K.draw_check(draw, 1112, y + 45, 26, sage)
                draw.text((1160, y + 22), lab, fill=ink, font=font(42, bold=True))
            a = K.stagger(progress, 5, step=0.12, speed=4)
            if a > 0:
                K.text_at(draw, "1 line of symmetry!", 1340, 700 + int((1 - a) * 20), font(56, bold=True), coral)
            return True
        ans = focus == "answer"
        for k, (kind, x0) in enumerate((("A", 300), ("F", 1060))):
            ok = kind == "A"
            out = (sage if ok else K.DANGER) if ans else None
            K.shadow_card(draw, (x0, 260, x0 + 560, 830), brand, radius=36, outline=out, outline_w=6 if out else 3)
            lx = x0 + 280
            if ans and not ok:
                draw_letter(draw, "F", lx, 500, 330, K.DANGER_SOFT, mirror=True)
            draw_letter(draw, kind, lx, 500, 330, K.ROAD if ok else K.BOTH_COLOR)
            vline(lx, 290, 700, coral, width=5)
            if not ans:
                K.text_at(draw, "?", lx, 720, font(int(64 + 10 * pulse), bold=True), K.GOLD)
            elif ok:
                K.draw_check(draw, x0 + 500, 320, 30, sage)
                K.pill(draw, lx, 728, "1 line", sage, size=34)
            else:
                K.draw_cross(draw, x0 + 500, 320, 30, K.DANGER)
                for j, ch in enumerate("GR"):
                    gx = lx - 90 + j * 180
                    draw.rounded_rectangle((gx - 60, 716, gx + 60, 806), radius=20, fill=K.DANGER_SOFT)
                    K.text_at(draw, ch, gx - 12, 722, font(64, bold=True), K.DANGER)
                    K.draw_cross(draw, gx + 40, 734, 16, K.DANGER)
        if not ans:
            K.draw_stopwatch(draw, cx, 540, 50, progress, brand)
        return True

    # ---- counting lines of symmetry -----------------------------------------------
    if visual == "c13-count":
        line_cols = [coral, K.ROAD, sage, K.BOTH_COLOR]

        def counter(n, chips):
            K.text_at(draw, str(n) if n else "?", 1420, 250, font(150, bold=True), coral if n else K.GOLD)
            K.text_at(draw, "lines of symmetry" if n != 1 else "line of symmetry", 1420, 440, font(40, bold=True),
                      ink)
            for i, (lab, ok, col) in enumerate(chips):
                y = 520 + i * 80
                draw.rounded_rectangle((1110, y, 1730, y + 66), radius=33, fill=sage_soft if ok else K.DANGER_SOFT)
                draw.ellipse((1130, y + 15, 1166, y + 51), fill=col)
                draw.text((1186, y + 12), lab, fill=ink, font=font(36, bold=True))
                if ok:
                    K.draw_check(draw, 1690, y + 33, 20, sage)
                else:
                    K.draw_cross(draw, 1690, y + 33, 20, K.DANGER)

        def notebook(x0, y0, x1, y1):
            draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=18, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x1, y1), radius=18, fill=(150, 184, 236), outline=BLUE, width=5)
            mx, my = (x0 + x1) / 2, (y0 + y1) / 2
            draw.rounded_rectangle((mx - 100, my - 46, mx + 100, my + 46), radius=12, fill=(255, 255, 255))
            for k in range(2):
                draw.line((mx - 70, my - 12 + k * 26, mx + 70, my - 12 + k * 26), fill=line, width=4)

        def sq_tile(x0, y0, x1, y1):
            draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), fill=K.SHADOW)
            draw.rectangle((x0, y0, x1, y1), fill=TILE, outline=TILE_EDGE, width=5)
            mx, my, q = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2
            draw.polygon([(mx, my - q * 0.8), (mx + q * 0.8, my), (mx, my + q * 0.8), (mx - q * 0.8, my)],
                         fill=(255, 214, 160))
            draw.ellipse((mx - q * 0.3, my - q * 0.3, mx + q * 0.3, my + q * 0.3), fill=K.CORAL)

        if focus == "intro":
            K.pill(draw, cx, 236, "How many fold lines?", K.BOTH_COLOR, size=36)
            sq_tile(470, 390, 830, 750)
            notebook(1060, 425, 1540, 715)
            K.text_at(draw, "Square", 650, 776, font(40, bold=True), ink)
            K.text_at(draw, "Rectangle", 1300, 776, font(40, bold=True), ink)
            question_marks([(870, 330), (1590, 330)], size=70)
            return True
        if focus == "square":
            sq_tile(480, 340, 920, 780)
            segs = [((700, 300), (700, 820)), ((440, 560), (960, 560)), ((452, 312), (948, 808)),
                    ((948, 312), (452, 808))]
            n = 0
            for k, (p, q) in enumerate(segs):
                a = K.clamp01((progress - 0.1 - k * 0.17) * 6)
                if a <= 0:
                    continue
                n += 1
                K.draw_dashed(draw, p[0], p[1], K.lerp(p[0], q[0], a), K.lerp(p[1], q[1], a), line_cols[k], width=8,
                              phase=progress * 60)
            labs = ["Up and down", "Across", "Corner to corner", "Other corner"]
            counter(n, [(labs[k], True, line_cols[k]) for k in range(n)])
            return True
        if focus == "rect":
            notebook(420, 390, 980, 730)
            segs = [((700, 340), (700, 780)), ((380, 560), (1020, 560))]
            n = 0
            for k, (p, q) in enumerate(segs):
                a = K.clamp01((progress - 0.15 - k * 0.25) * 5)
                if a <= 0:
                    continue
                n += 1
                K.draw_dashed(draw, p[0], p[1], K.lerp(p[0], q[0], a), K.lerp(p[1], q[1], a), line_cols[k], width=8,
                              phase=progress * 60)
            counter(n, [(["Up and down", "Across"][k], True, line_cols[k]) for k in range(n)])
            return True
        # diag
        x0, y0, x1, y1 = 420, 340, 980, 680
        notebook(x0, y0, x1, y1)
        tl, tr, br = (x0, y0), (x1, y0), (x1, y1)
        trr = reflect(tr, tl, br)
        f = K.ease_in_out(K.clamp01(progress * 1.8))
        tp = (K.lerp(tr[0], trr[0], f), K.lerp(tr[1], trr[1], f))
        draw.polygon([tl, tp, br], fill=K.DANGER_SOFT)
        dashed_poly(draw, [tl, tp, br], K.DANGER, width=5)
        K.draw_dashed(draw, x0 - 30, y0 - 18, x1 + 30, y1 + 18, K.DANGER, width=7, phase=progress * 60)
        if f > 0.9:
            K.text_at(draw, "Sticks out!", 860, 790, font(38, bold=True), K.DANGER)
            K.draw_arrow(draw, 840, 815, tp[0] + 26, tp[1] - 6, K.DANGER, width=6, head=18)
            K.draw_cross(draw, 1020, 300, 30, K.DANGER)
        counter(2, [("Up and down", True, line_cols[0]), ("Across", True, line_cols[1]),
                    ("Corner to corner", False, K.DANGER)])
        return True

    # ---- draw the missing half ------------------------------------------------------
    if visual == "c13-half":
        def grid():
            x0, y0 = gpt(-4, 0)
            x1, y1 = gpt(4, 5)
            draw.rounded_rectangle((x0 - 30, y0 - 30, x1 + 30, y1 + 30), radius=24, fill=panel, outline=line,
                                   width=3)
            for c in range(-4, 5):
                draw.line((GFX + c * GC, y0, GFX + c * GC, y1), fill=line, width=3)
            for r in range(6):
                draw.line((x0, GTY + r * GC, x1, GTY + r * GC), fill=line, width=3)
            K.draw_dashed(draw, GFX, y0 - 40, GFX, y1 + 40, coral, width=7, phase=progress * 60)

        def half_shape(side, col, fill, n_pts=None):
            pts = [gpt(-side * c, r) for c, r in WING_L]
            if fill:
                draw.polygon(pts, fill=fill)
            draw.line(pts, fill=col, width=6, joint="curve")
            for i, p in enumerate(pts):
                if n_pts is not None and i >= n_pts:
                    break
                draw.ellipse((p[0] - 12, p[1] - 12, p[0] + 12, p[1] + 12), fill=col)

        def count_cells(r, n, side, upto, col):
            for i in range(n):
                if i >= upto:
                    break
                xc = GFX + side * (i + 0.5) * GC
                yc = GTY + r * GC - GC * 0.5 if r > 0 else GTY - 34
                draw.ellipse((xc - 24, yc - 24, xc + 24, yc + 24), fill=col)
                K.text_at(draw, str(i + 1), xc, yc - 18, font(30, bold=True), (255, 255, 255))

        def dot(c, r, col, rr=20):
            x, y = gpt(c, r)
            draw.ellipse((x - rr, y - rr, x + rr, y + rr), fill=col, outline=(255, 255, 255), width=4)

        grid()
        if focus == "intro":
            half_shape(-1, coral, coral_soft)
            K.text_at(draw, "?", GFX + 2 * GC, GTY + 1.4 * GC, font(int(130 + 16 * pulse), bold=True), K.GOLD)
            K.pill(draw, GFX, 800, "fold line = mirror", coral, size=32)
            riya(draw, 1480, 560, 1.15, t)
            return True
        if focus == "rule":
            half_shape(-1, (236, 200, 180), None)
            dot(-2, 0, coral)
            count_cells(0, 2, -1, int(K.clamp01(progress * 2.4) * 2 + 0.01), coral)
            count_cells(0, 2, 1, int(K.clamp01(progress * 2.4 - 1.0) * 2 + 0.01), sage)
            if progress > 0.72:
                dot(2, 0, sage, rr=22)
            K.pill(draw, 1480, 300, "Same distance,", K.BOTH_COLOR, size=36)
            K.pill(draw, 1480, 380, "other side!", K.BOTH_COLOR, size=36)
            riya(draw, 1480, 600, 1.0, t)
            return True
        if focus == "ask":
            half_shape(-1, (236, 200, 180), None)
            dot(-3, 4, coral)
            count_cells(4, 3, -1, int(K.clamp01(progress * 3) * 3 + 0.01), coral)
            K.text_at(draw, "?", GFX + 2.4 * GC, GTY + 1.6 * GC, font(int(120 + 16 * pulse), bold=True), K.GOLD)
            riya(draw, 1480, 520, 1.1, 0)
            question_marks([(1660, 330)], size=70)
            K.draw_stopwatch(draw, 1480, 790, 44, progress, brand)
            return True
        # answer
        a_cnt = int(K.clamp01(progress * 3.2) * 3 + 0.01)
        mirror_on = progress > 0.32
        fill_on = progress > 0.55
        if fill_on:
            half_shape(1, sage, sage_soft)
        half_shape(-1, coral, coral_soft)
        count_cells(4, 3, -1, 3, coral)
        count_cells(4, 3, 1, a_cnt, sage)
        if a_cnt >= 3:
            dot(3, 4, sage, rr=22)
        if mirror_on and not fill_on:
            k = int((progress - 0.32) / 0.23 * 7) + 1
            for c, r in WING_L[:k]:
                if c:
                    dot(-c, r, sage, rr=14)
        if fill_on:
            K.draw_check(draw, GFX + 4 * GC + 10, GTY - 10, 30, sage)
        riya(draw, 1480, 560, 1.15, t)
        if fill_on:
            K.draw_heart(draw, 1620, 400 + bounce, 30, coral)
            star_spots([(1300, 330), (1700, 760)])
        return True

    # ---- patterns ------------------------------------------------------------------
    if visual == "c13-pattern":
        def star_dot(kind, x, y, s=1.0):
            if kind == "star":
                K.draw_star(draw, x, y, 54 * s, K.GOLD, rot=0)
                K.draw_star(draw, x, y, 22 * s, (255, 236, 170), rot=0)
            else:
                draw.ellipse((x - 20 * s, y - 20 * s, x + 20 * s, y + 20 * s), fill=POWDER)

        if focus == "intro":
            fx0, fy0, fx1, fy1 = 300, 270, 1460, 850
            draw.rounded_rectangle((fx0, fy0, fx1, fy1), radius=30, fill=FLOOR)
            draw.rounded_rectangle((fx0 + 90, fy0 + 90, fx1 - 90, fy1 - 90), radius=20, fill=FLOOR_DARK)
            n_top = 13
            seq = ["star", "dot", "dot"]
            for i in range(n_top):
                a = K.stagger(progress, i, step=0.04, speed=6)
                if a <= 0:
                    continue
                x = fx0 + 60 + i * (fx1 - fx0 - 120) / (n_top - 1)
                star_dot(seq[i % 3], x, fy0 + 45, 0.62 * a)
                star_dot(seq[i % 3], x, fy1 - 45, 0.62 * a)
            butterfly(draw, (fx0 + fx1) / 2, 580, 0.8)
            riya(draw, 1680, 600, 1.0, t)
            K.pill(draw, 1680, 300, "The border!", coral, size=34)
            return True
        if focus == "unit":
            K.text_at(draw, "PATTERN UNIT", cx, 236 + lift, font(56, bold=True), sage)
            cols = [RED, BLUE] * 3
            for i, col in enumerate(cols):
                a = K.stagger(progress, i, step=0.05, speed=6)
                if a <= 0:
                    continue
                powder_bowl(draw, cx - 500 + i * 200, 500 + int((1 - a) * 30), 0.9, col)
            for k in range(3):
                a = K.stagger(progress, k + 4, step=0.1, speed=4)
                if a <= 0:
                    continue
                xa = cx - 500 + k * 400 - 90
                bracket(xa, xa + 380, 630, coral if k == 0 else (236, 200, 180))
            a = K.stagger(progress, 7, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx - 400, 660 + int((1 - a) * 20), "red, blue", coral, size=36)
                K.text_at(draw, "repeats again and again", cx + 200, 670, font(40, bold=True), muted)
            return True
        if focus == "colour":
            done = progress > 0.45
            K.pill(draw, cx, 236, "What comes next?", K.BOTH_COLOR, size=34)
            seq = [(RED, "red"), (BLUE, "blue")] * 3
            for i, (col, lab) in enumerate(seq):
                x = cx + (i - 2.5) * 270
                if i == 5 and not done:
                    draw.rounded_rectangle((x - 110, 360, x + 110, 700), radius=28, fill=coral_soft)
                    dashed_box((x - 110, 360, x + 110, 700), coral)
                    K.text_at(draw, "?", x, 440, font(int(120 + 16 * pulse), bold=True), coral)
                    continue
                powder_bowl(draw, x, 500, 1.0, col)
                K.text_at(draw, lab, x, 640, font(40, bold=True), col)
                if i == 5:
                    K.draw_check(draw, x + 80, 420, 26, sage)
            if done:
                for k in range(3):
                    xa = cx + (2 * k - 2.5) * 270 - 100
                    bracket(xa, xa + 470, 760, [coral, sage, K.BOTH_COLOR][k])
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((150, 420, 1770, 660), radius=30, fill=FLOOR)
        seq = ["star", "dot", "dot"] * 3
        for i, kd in enumerate(seq):
            x = cx + (i - 4) * 180
            if i >= 7 and not ans:
                draw.rounded_rectangle((x - 70, 470, x + 70, 610), radius=20, fill=FLOOR_DARK)
                dashed_box((x - 70, 470, x + 70, 610), K.GOLD, width=4)
                K.text_at(draw, "?", x, 492, font(int(76 + 10 * pulse), bold=True), K.GOLD)
                continue
            pop = 1.0
            if ans and i >= 7:
                pop = K.ease_out_cubic(K.clamp01((progress - 0.05 - (i - 7) * 0.12) * 5))
                if pop <= 0:
                    continue
            star_dot(kd, x, 540, 1.1 * pop)
        if ans:
            for k in range(3):
                a = K.stagger(progress, k + 3, step=0.1, speed=4)
                if a <= 0:
                    continue
                xa = cx + (3 * k - 4) * 180 - 70
                bracket(xa, xa + 500, 720, [coral, sage, K.BOTH_COLOR][k])
            K.pill(draw, cx, 760, "Unit: star, dot, dot", sage, size=36)
        else:
            K.pill(draw, cx - 40, 270, "What are the next two?", coral, size=36)
            K.draw_stopwatch(draw, cx + 290, 302, 32, progress, brand)
            riya(draw, cx, 720, 0.7, 0)
        return True

    # ---- floor tiles -----------------------------------------------------------------
    if visual == "c13-tiles":
        kinds = ["square", "triangle", "triangle"] * 4
        sz, step = 140, 164
        x_start = cx - 9 * step / 2

        def tile_row(reveal, rings=None):
            for i in range(10):
                x = x_start + i * step
                y = 480
                if i == 9 and not reveal:
                    draw.rounded_rectangle((x - sz / 2, y - sz / 2, x + sz / 2, y + sz / 2), radius=14,
                                           fill=coral_soft)
                    dashed_box((x - sz / 2, y - sz / 2, x + sz / 2, y + sz / 2), coral, width=4)
                    K.text_at(draw, "?", x, y - 54, font(int(84 + 12 * pulse), bold=True), coral)
                else:
                    floor_tile(draw, x, y, sz, kinds[i], K.ROAD if kinds[i] == "square" else coral)
                hot = rings is not None and i in rings
                K.text_at(draw, str(i + 1), x, y + 92, font(36, bold=True), K.GOLD if hot else muted)
                if hot:
                    rr = sz / 2 + 14 + 4 * pulse
                    draw.rounded_rectangle((x - rr, y - rr, x + rr, y + rr), radius=22, outline=K.GOLD, width=7)

        if focus == "ask":
            tile_row(False)
            K.pill(draw, cx - 40, 250, "What is tile 10?", K.BOTH_COLOR, size=36)
            K.draw_stopwatch(draw, cx + 230, 282, 32, progress, brand)
            riya(draw, 340, 700, 0.75, 0)
            question_marks([(500, 660)], size=64)
            return True
        if focus == "unit":
            tile_row(False)
            for k in range(4):
                a = K.stagger(progress, k, step=0.14, speed=4)
                if a <= 0:
                    continue
                xa = x_start + k * 3 * step - sz / 2
                xb = min(xa + 3 * step - 24, x_start + 9 * step + sz / 2)
                bracket(xa, xb, 680, [coral, sage, K.BOTH_COLOR, K.ROAD][k],
                        label="3 tiles" if k < 3 else "again…", size=32)
            K.pill(draw, cx, 250, "Unit: square, triangle, triangle", sage, size=36)
            return True
        if focus == "count":
            rings_n = int(K.clamp01(progress * 1.4) * 4 + 0.01)
            rings = [0, 3, 6, 9][:rings_n]
            tile_row(rings_n >= 4, rings)
            if rings_n >= 4:
                K.draw_check(draw, x_start + 9 * step + 60, 400, 26, sage)
            K.pill(draw, cx, 250, "New unit starts: 1, 4, 7, 10", K.GOLD, size=36, fg=ink)
            if rings_n >= 4:
                K.text_at(draw, "Tile 10 is a square!", cx, 700, font(64, bold=True), coral)
            return True
        # games
        game_tile(draw, 290, 380, 220)
        K.text_at(draw, "1 small tile", 400, 640, font(40, bold=True), ink)
        K.draw_arrow(draw, 590, 500, 800, 500, coral, width=14, head=40)
        gx0, gy0, gx1, gy1 = 840, 250, 1780, 850
        draw.rounded_rectangle((gx0 + 10, gy0 + 12, gx1 + 10, gy1 + 12), radius=30, fill=K.SHADOW)
        draw.rounded_rectangle((gx0, gy0, gx1, gy1), radius=30, fill=SKY)
        for k, (ccx, ccy) in enumerate(((1040, 350), (1500, 320))):
            for dx, rr in ((-40, 34), (0, 46), (44, 34)):
                draw.ellipse((ccx + dx - rr, ccy - rr, ccx + dx + rr, ccy + rr), fill=(255, 255, 255))
        c = 80
        cells = [(i, 0) for i in range(11)] + [(i, 1) for i in range(11)] + [(4, 3), (5, 3), (6, 3), (8, 4), (9, 4)]
        shown = int(K.clamp01(progress * 1.5) * len(cells) + 0.01)
        for j, (i, r) in enumerate(cells[:shown]):
            x = gx0 + 30 + i * c
            y = gy1 - 30 - (r + 1) * c
            game_tile(draw, x, y, c, grass=(r != 0))
        if shown >= len(cells):
            px, py = gx0 + 30 + 5 * c + c / 2, gy1 - 30 - 4 * c
            kid(draw, px, py - 70, 0.42, PINK, t, clip=K.CORAL)
            for k in range(3):
                ox = gx0 + 30 + (8 + k * 0.6) * c + 20
                oy = gy1 - 30 - 5 * c - 50 + 8 * math.sin(t * 10 + k)
                draw.ellipse((ox - 18, oy - 18, ox + 18, oy + 18), fill=K.GOLD, outline=(214, 150, 30), width=4)
        return True

    # ---- checkpoint ----------------------------------------------------------------
    if visual == "c13-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 790 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Find the fold line!", cx, 450 + lift, font(64, bold=True), ink)
            draw.polygon(heart_pts(cx, 650 + lift, 5.4), fill=PINK)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        for i in range(6):
            draw.line((170, 360 + i * 90, 1220, 360 + i * 90), fill=(226, 220, 238), width=3)
        K.text_at(draw, "Does a heart have a line of symmetry?", 695, 256, font(44, bold=True), coral)
        hx, hy, hk = 695, 590, 10.5
        if not ans:
            draw.polygon(heart_pts(hx, hy, hk), fill=PINK, outline=PINK_DARK, width=5)
            K.text_at(draw, "?", hx + 260, hy - 120, font(int(90 + 12 * pulse), bold=True), K.GOLD)
            riya(draw, 1540, 520, 1.3, 0)
            question_marks([(1700, 330)], size=80)
            K.draw_stopwatch(draw, 1540, 800, 44, progress, brand)
            return True
        f = math.sin(math.pi * K.clamp01(progress * 1.7))
        if progress * 1.7 >= 1:
            f = 0.0
        draw.polygon(heart_pts(hx, hy, hk, "l"), fill=PINK, outline=PINK_DARK, width=5)
        fx = math.cos(math.pi * f)
        rp = [(hx + (x - hx) * fx, y) for x, y in heart_pts(hx, hy, hk, "r")]
        draw.polygon(rp, fill=PINK if fx > 0 else (246, 170, 200), outline=PINK_DARK, width=5)
        top, bot = hy - 5 * hk, hy + 17 * hk
        K.draw_dashed(draw, hx, top - 70, hx, bot + 50, sage, width=8, phase=progress * 60)
        if progress * 1.7 >= 1:
            K.text_at(draw, "top dip", 420, top - 60, font(36, bold=True), sage)
            K.draw_arrow(draw, 500, top - 10, hx - 16, top, sage, width=6, head=18)
            K.text_at(draw, "bottom point", 410, bot - 30, font(36, bold=True), sage)
            K.draw_arrow(draw, 520, bot + 20, hx - 16, bot + 4, sage, width=6, head=18)
            K.draw_check(draw, 1020, top - 40, 30, sage)
            K.text_at(draw, "1 line", 1030, top + 20, font(40, bold=True), sage)
        riya(draw, 1540, 520, 1.3, t)
        K.draw_heart(draw, 1700, 380 + bounce, 30, coral)
        star_spots([(1380, 330), (1720, 660)])
        return True

    # ---- recap ------------------------------------------------------------------------
    if visual == "c13-recap":
        recap = [(("Fold, and both", "halves match"), coral, "fold"),
                 (("Square 4 lines,", "rectangle 2"), K.ROAD, "count"),
                 (("Same distance,", "other side"), sage, "half"),
                 (("Find the unit", "that repeats"), K.BOTH_COLOR, "unit")]
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
                if kind == "fold":
                    butterfly(draw, ix, iy + 10, 0.62)
                    K.draw_dashed(draw, ix, iy - 120, ix, iy + 120, coral, width=5)
                elif kind == "count":
                    sx_ = ix - 100
                    draw.rectangle((sx_ - 60, iy - 60, sx_ + 60, iy + 60), fill=TILE, outline=TILE_EDGE, width=4)
                    for (p, q) in (((sx_, iy - 74), (sx_, iy + 74)), ((sx_ - 74, iy), (sx_ + 74, iy)),
                                   ((sx_ - 68, iy - 68), (sx_ + 68, iy + 68)), ((sx_ + 68, iy - 68), (sx_ - 68, iy + 68))):
                        draw.line((p[0], p[1], q[0], q[1]), fill=K.ROAD, width=4)
                    rx_ = ix + 95
                    draw.rectangle((rx_ - 75, iy - 42, rx_ + 75, iy + 42), fill=(150, 184, 236), outline=BLUE, width=4)
                    for (p, q) in (((rx_, iy - 58), (rx_, iy + 58)), ((rx_ - 90, iy), (rx_ + 90, iy))):
                        draw.line((p[0], p[1], q[0], q[1]), fill=coral, width=4)
                    K.text_at(draw, "4", sx_, iy + 84, font(36, bold=True), K.ROAD)
                    K.text_at(draw, "2", rx_, iy + 84, font(36, bold=True), coral)
                elif kind == "half":
                    c = 40
                    for k in range(-3, 4):
                        draw.line((ix + k * c, iy - 100, ix + k * c, iy + 100), fill=line, width=2)
                    for k in range(-2, 3):
                        draw.line((ix - 3 * c, iy + k * 50, ix + 3 * c, iy + k * 50), fill=line, width=2)
                    draw.line((ix, iy - 120, ix, iy + 120), fill=coral, width=5)
                    for sx, cl in ((-1, coral), (1, sage)):
                        draw.ellipse((ix + sx * 2 * c - 14, iy - 14, ix + sx * 2 * c + 14, iy + 14), fill=cl)
                    K.draw_arrow(draw, ix - 2 * c + 18, iy + 50, ix + 2 * c - 18, iy + 50, muted, width=5, head=14)
                else:
                    for k, kd in enumerate(("star", "dot", "dot", "star", "dot", "dot")):
                        px = ix - 150 + k * 60
                        if kd == "star":
                            K.draw_star(draw, px, iy, 26, K.GOLD)
                        else:
                            draw.ellipse((px - 11, iy - 11, px + 11, iy + 11), fill=coral)
                    bracket(ix - 176, ix - 4, iy + 60, col)
                label_font = font(36, bold=True)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, label_font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            riya(draw, cx + 300, 410, 1.2, t)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Rangoli artist", coral, size=36)
            fly(cx - 620, 340, 0.3, 0)
            fly(cx + 620, 340, 0.3, 2)
            star_spots([(cx - 680, 580), (cx + 680, 580)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
