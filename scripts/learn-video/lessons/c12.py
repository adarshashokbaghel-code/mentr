"""C12 · Grids and Coordinates — visuals."""
import math

import build as K

TILE_A = (232, 150, 110)
TILE_B = (216, 128, 92)
GROUT = (250, 234, 214)
GRID_LINE = (206, 212, 224)
SEA = (196, 226, 248)
SEA_LINE = (150, 196, 232)
SHIRT = (150, 196, 246)
PAPER = (255, 250, 238)
PARCH = (246, 226, 180)
PARCH_DARK = (196, 160, 100)
CHESS_A = (240, 220, 186)
CHESS_B = (150, 104, 70)
ACROSS = K.CORAL
UP = K.ROAD
BALL = (200, 40, 50)

HEART = [".XX...XX.", "XXXX.XXXX", "XXXXXXXXX", "XXXXXXXXX", ".XXXXXXX.", "..XXXXX..", "...XXX...", "....X...."]


def S_(s):
    return lambda v: v * s


def ctext(draw, text, x, y, size, col, bold=True):
    f = K.load_font(size, bold=bold)
    b = draw.textbbox((0, 0), text, font=f)
    draw.text((x - (b[0] + b[2]) / 2, y - (b[1] + b[3]) / 2), text, font=f, fill=col)


def coord_text(draw, a, b, x, y, size, ca=ACROSS, cb=UP, ink=(28, 36, 52), left=False):
    """'(a, b)' with the across number and the up number in their own colours; centred on x unless left."""
    f = K.load_font(size, bold=True)
    parts = [("(", ink), (str(a), ca), (", ", ink), (str(b), cb), (")", ink)]
    total = sum(f.getlength(p) for p, _ in parts)
    bb = draw.textbbox((0, 0), "(0, 0)", font=f)
    ty = y - (bb[1] + bb[3]) / 2
    px = x if left else x - total / 2
    for p, c in parts:
        draw.text((px, ty), p, font=f, fill=c)
        px += f.getlength(p)
    return total


def kid(draw, cx, cy, s, t=0.0, body=SHIRT, girl=False, tie=True):
    """School kid bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    if tie:
        draw.polygon([(cx - S(12), cy + S(62)), (cx + S(12), cy + S(62)), (cx + S(16), cy + S(116)), (cx, cy + S(132)),
                      (cx - S(16), cy + S(116))], fill=K.DANGER)
    r = S(64)
    if girl:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                         fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)


def diya(draw, cx, cy, s, t=0.0):
    kid(draw, cx, cy, s, t, body=K.CORAL, girl=True, tie=False)


def token(draw, x, y, r, col, girl=False):
    draw.ellipse((x - r - 8 + 4, y - r - 8 + 6, x + r + 8 + 4, y + r + 8 + 6), fill=K.SHADOW)
    draw.ellipse((x - r - 8, y - r - 8, x + r + 8, y + r + 8), fill=col)
    if girl:
        for sx in (-1, 1):
            draw.ellipse((x + sx * r * 0.95 - r * 0.32, y - r * 0.2, x + sx * r * 0.95 + r * 0.32, y + r * 0.55),
                         fill=K.HAIR)
    K.draw_face(draw, x, y, r, "kid", 0.6)


def cricket_ball(draw, x, y, r):
    draw.ellipse((x - r + 4, y - r + 6, x + r + 4, y + r + 6), fill=K.SHADOW)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=BALL)
    draw.arc((x - r * 1.6, y - r * 0.9, x + r * 0.2, y + r * 0.9), -40, 40, fill=(255, 236, 236), width=max(2, int(r * 0.12)))
    draw.ellipse((x - r * 0.55, y - r * 0.6, x - r * 0.25, y - r * 0.3), fill=(236, 110, 110))


def ship(draw, x, y, s, faded=False):
    S = S_(s)
    hull = K.STEEL if faded else (90, 100, 120)
    cab = (226, 230, 238) if faded else (240, 240, 246)
    if not faded:
        draw.polygon([(x - S(60) + S(5), y + S(4) + S(6)), (x + S(60) + S(5), y + S(4) + S(6)),
                      (x + S(42) + S(5), y + S(30) + S(6)), (x - S(42) + S(5), y + S(30) + S(6))], fill=SEA_LINE)
    draw.rectangle((x - S(26), y - S(30), x + S(18), y + S(4)), fill=cab, outline=hull, width=max(2, int(S(4))))
    draw.rectangle((x - S(4), y - S(52), x + S(8), y - S(30)), fill=K.DANGER if not faded else K.STEEL)
    draw.polygon([(x - S(60), y + S(4)), (x + S(60), y + S(4)), (x + S(42), y + S(30)), (x - S(42), y + S(30))],
                 fill=hull)


def splash(draw, x, y, t, col=(80, 150, 230)):
    for k in range(8):
        a = k * math.pi / 4 + 0.3
        d = 34 + 10 * math.sin(t * 20 + k)
        px, py = x + math.cos(a) * d, y + math.sin(a) * d * 0.8 - 10
        draw.ellipse((px - 10, py - 14, px + 10, py + 10), fill=col)
    draw.ellipse((x - 22, y - 16, x + 22, y + 16), fill=(236, 246, 255), outline=col, width=4)


def boom(draw, x, y, t):
    K.draw_star(draw, x, y, 74 + 8 * math.sin(t * 20), K.GOLD, rot=t * 2)
    K.draw_star(draw, x, y, 46, K.CORAL, rot=-t * 3 + 0.3)


def rook(draw, x, y, s, col=(60, 64, 80)):
    S = S_(s)
    draw.ellipse((x - S(40), y + S(18), x + S(40), y + S(34)), fill=K.SHADOW)
    draw.rounded_rectangle((x - S(38), y + S(4), x + S(38), y + S(26)), radius=S(6), fill=col)
    draw.polygon([(x - S(24), y + S(6)), (x + S(24), y + S(6)), (x + S(18), y - S(44)), (x - S(18), y - S(44))], fill=col)
    draw.rectangle((x - S(30), y - S(56), x + S(30), y - S(40)), fill=col)
    for k in (-1, 0, 1):
        draw.rectangle((x + k * S(22) - S(8), y - S(72), x + k * S(22) + S(8), y - S(54)), fill=col)


class Grid:
    def __init__(self, ox, oy, cell, nx, ny):
        self.ox, self.oy, self.cell, self.nx, self.ny = ox, oy, cell, nx, ny

    def p(self, x, y):
        return self.ox + x * self.cell, self.oy - y * self.cell

    @property
    def box(self):
        return self.ox, self.oy - self.ny * self.cell, self.ox + self.nx * self.cell, self.oy


def draw_grid(draw, g, nums=True, fill=(255, 255, 255), line=GRID_LINE, axis=(28, 36, 52), num_size=30, tiles=False,
              shadow=True, axis_labels=True):
    x0, y0, x1, y1 = g.box
    if shadow:
        draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), fill=K.SHADOW)
    if tiles:
        for i in range(g.nx):
            for j in range(g.ny):
                cx_, cy_ = g.p(i, j)
                draw.rectangle((cx_, cy_ - g.cell, cx_ + g.cell, cy_), fill=TILE_A if (i + j) % 2 == 0 else TILE_B)
        line = GROUT
    else:
        draw.rectangle(g.box, fill=fill)
    for i in range(g.nx + 1):
        x = g.ox + i * g.cell
        draw.line((x, y0, x, y1), fill=line, width=6 if tiles else 3)
    for j in range(g.ny + 1):
        y = g.oy - j * g.cell
        draw.line((x0, y, x1, y), fill=line, width=6 if tiles else 3)
    if axis and not tiles:
        draw.line((x0, y1, x1, y1), fill=axis, width=6)
        draw.line((x0, y0, x0, y1), fill=axis, width=6)
    if nums:
        f = num_size
        for i in range(g.nx + 1):
            ctext(draw, str(i), g.ox + i * g.cell, y1 + f * 0.95, f, ACROSS)
        for j in range(g.ny + 1):
            ctext(draw, str(j), x0 - f * 0.95, g.oy - j * g.cell, f, UP)
        if axis_labels:
            K.draw_arrow(draw, x1 + 30, y1, x1 + 110, y1, ACROSS, width=8, head=24)
            K.text_at(draw, "across", x1 + 74, y1 + 16, K.load_font(28, bold=True), ACROSS)
            K.draw_arrow(draw, x0, y0 - 18, x0, y0 - 84, UP, width=8, head=24)
            draw.text((x0 + 22, y0 - 80), "up", font=K.load_font(28, bold=True), fill=UP)


def path_pts(start, moves):
    pts = [start]
    x, y = start
    for dx, dy in moves:
        n = abs(dx) + abs(dy)
        sx = (dx > 0) - (dx < 0)
        sy = (dy > 0) - (dy < 0)
        for _ in range(n):
            x, y = x + sx, y + sy
            pts.append((x, y))
    return pts


def walk(draw, g, pts, f, col, width=12, badges=True, seg_reset=True):
    """Animate along unit-step grid points. f in 0..1. Returns the current pixel position."""
    n = len(pts) - 1
    pos = f * n
    k = min(n, int(pos))
    frac = pos - k
    px = [g.p(*p) for p in pts]
    if k >= 1:
        draw.line(px[:k + 1], fill=col, width=width, joint="curve")
    cur = px[k]
    if k < n:
        nxt = px[k + 1]
        cur = (K.lerp(cur[0], nxt[0], frac), K.lerp(cur[1], nxt[1], frac))
        draw.line([px[k], cur], fill=col, width=width)
    if badges:
        count = 0
        prev_dir = None
        for i in range(1, k + 1):
            a, b = pts[i - 1], pts[i]
            d = (b[0] - a[0], b[1] - a[1])
            count = count + 1 if (d == prev_dir or not seg_reset) else 1
            prev_dir = d
            ax, ay = g.p(*a)
            bx, by = g.p(*b)
            mx, my = (ax + bx) / 2, (ay + by) / 2
            if d[0] != 0:
                my -= 30
            else:
                mx += 30
            draw.ellipse((mx - 19, my - 19, mx + 19, my + 19), fill=(255, 255, 255), outline=col, width=4)
            ctext(draw, str(count), mx, my, 24, K.DEV_DEEP)
    return cur


def dot(draw, x, y, col, r=16):
    draw.ellipse((x - r - 5, y - r - 5, x + r + 5, y + r + 5), fill=(255, 255, 255))
    draw.ellipse((x - r, y - r, x + r, y + r), fill=col)


def coord_tag(draw, x, y, a, b, side="right", size=34, col=(28, 36, 52), gap=26):
    f = K.load_font(size, bold=True)
    wd = sum(f.getlength(p) for p in ("(", str(a), ", ", str(b), ")"))
    pad = 18
    hgt = size + 22
    if side == "right":
        bx0 = x + gap
    elif side == "left":
        bx0 = x - gap - wd - 2 * pad
    else:
        bx0 = x - wd / 2 - pad
    by0 = y - hgt / 2 if side in ("right", "left") else (y - gap - 8 - hgt if side == "above" else y + gap + 4)
    draw.rounded_rectangle((bx0 + 4, by0 + 6, bx0 + wd + 2 * pad + 4, by0 + hgt + 6), radius=hgt / 2, fill=K.SHADOW)
    draw.rounded_rectangle((bx0, by0, bx0 + wd + 2 * pad, by0 + hgt), radius=hgt / 2, fill=(255, 255, 255),
                           outline=col, width=4)
    coord_text(draw, a, b, bx0 + pad, by0 + hgt / 2, size, left=True)


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

    def stopwatch(x, y, r=44):
        K.draw_stopwatch(draw, x, y, r, progress, brand)

    def card(box, col, title=None, soft=None):
        x0, y0, x1, y1 = box
        if soft:
            draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle(box, radius=36, fill=soft, outline=col, width=5)
        else:
            K.shadow_card(draw, box, brand, radius=36, accent=col)
        if title:
            K.text_at(draw, title, (x0 + x1) / 2, y0 + 34, font(34, bold=True), col)

    def rows_in(box, rows, y_first, gap=86, size=46, step=0.16):
        x0, y0, x1, y1 = box
        mx = (x0 + x1) / 2
        for i, r in enumerate(rows):
            a = K.stagger(progress, i, step=step, speed=4)
            if a <= 0:
                continue
            y = y_first + i * gap + int((1 - a) * 16)
            if isinstance(r, tuple) and r[0] == "coord":
                coord_text(draw, r[1], r[2], mx, y + size * 0.6, size)
            else:
                txt, col = r if isinstance(r, tuple) else (r, ink)
                K.text_at(draw, txt, mx, y, font(size, bold=True), col)

    def mini_grid(x0, y0, n, c, col=K.DEV_MID, wd=3):
        for k in range(n + 1):
            draw.line((x0 + k * c, y0, x0 + k * c, y0 + n * c), fill=col, width=wd)
            draw.line((x0, y0 + k * c, x0 + n * c, y0 + k * c), fill=col, width=wd)

    # ---- opening -----------------------------------------------------------------------
    if visual == "c12-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            kid(draw, cx + 280, 430, 1.3, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 560, 320), (cx + 560, 320), (cx - 640, 540), (cx + 640, 540)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · SHAPES ALL AROUND", cx, 326 + lift, font(34, bold=True), sage)
            specs = [(3, K.CORAL, "Triangle"), (4, K.ROAD, "Square"), (6, (255, 200, 64), "Hexagon")]
            for i, (n, col, name) in enumerate(specs):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 420
                y = 540 + int((1 - a) * 40)
                start = -90 if n == 3 else (45 if n == 4 else 0)
                r = 110 if n != 4 else 120
                pts = [(x + r * math.cos(math.radians(start + 360 * k / n)), y + 10 + r * math.sin(math.radians(start + 360 * k / n)))
                       for k in range(n)]
                draw.polygon([(px + 8, py + 10) for px, py in pts], fill=K.SHADOW)
                draw.polygon(pts, fill=col)
                ctext(draw, str(n), x, y + 14, 64, (255, 255, 255) if n != 6 else ink)
                K.text_at(draw, f"{name}: {n} sides", x, y + 150, font(36, bold=True), ink)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Grids and Coordinates", cx, 360 + lift, font(86, bold=True), ink)
            g = Grid(cx - 250, 840, 70, 7, 4)
            draw_grid(draw, g, nums=False)
            pts = path_pts((0, 0), [(5, 0), (0, 3)])
            cur = walk(draw, g, pts, K.clamp01(progress * 1.4), coral, width=10, badges=False)
            dot(draw, cur[0], cur[1], coral, r=18)
            return True
        # promise: treasure map
        draw.ellipse((420 - 240, 560 - 240, 420 + 240, 560 + 240), fill=sage_soft)
        kid(draw, 420, 520, 1.5, t)
        K.draw_magnifier(draw, 600, 680, 0.75, coral)
        mx0, my0, mx1, my1 = 820, 280, 1700, 840
        draw.polygon([(mx0 + 10, my0 + 12), (mx1 + 10, my0 + 32), (mx1 - 10, my1 + 12), (mx0 + 20, my1 - 8)], fill=K.SHADOW)
        draw.polygon([(mx0, my0), (mx1, my0 + 20), (mx1 - 20, my1), (mx0 + 10, my1 - 20)], fill=PARCH, outline=PARCH_DARK)
        g = Grid(900, 760, 90, 6, 4)
        draw_grid(draw, g, nums=True, fill=PARCH, line=PARCH_DARK, axis=PARCH_DARK, shadow=False, axis_labels=False)
        pts = path_pts((0, 0), [(4, 0), (0, 3)])
        walk(draw, g, pts, K.clamp01(progress * 1.5), coral, width=8, badges=False)
        tx, ty = g.p(4, 3)
        a = K.stagger(progress, 3, step=0.2, speed=4)
        if a > 0:
            draw.line((tx - 30, ty - 30, tx + 30, ty + 30), fill=K.DANGER, width=14)
            draw.line((tx - 30, ty + 30, tx + 30, ty - 30), fill=K.DANGER, width=14)
        K.pill(draw, 1470, 300, "Treasure!", K.DANGER, size=34)
        return True

    # ---- the hidden cricket ball ---------------------------------------------------------
    if visual == "c12-hook":
        g = Grid(250, 820, 100, 5, 5)
        draw_grid(draw, g, nums=focus != "meet", tiles=True, axis_labels=False)
        if focus == "meet":
            token(draw, *g.p(0, 0), 34, SHIRT)
            kid(draw, 1110, 520, 1.25, t)
            diya(draw, 1500, 540, 1.15, t + 0.3)
            K.text_at(draw, "Aarav", 1110, 790, font(40, bold=True), K.ROAD)
            K.text_at(draw, "Diya", 1500, 790, font(40, bold=True), coral)
            K.pill(draw, 1300, 260, "Square tiles in rows and rows!", sage, size=34)
            return True
        if focus == "hide":
            token(draw, *g.p(0, 0), 34, SHIRT)
            K.draw_bubble(draw, (900, 250, 1600, 420), brand, "Your ball is at (4, 2)!", tail="right", size=48)
            diya(draw, 1500, 600, 1.05, t)
            kid(draw, 1060, 620, 1.0, t)
            question_marks([(1060, 470)], size=60)
            return True
        wrong = path_pts((0, 0), [(2, 0), (0, 4)])
        right = path_pts((0, 0), [(4, 0), (0, 2)])
        if focus == "wrong":
            cur = walk(draw, g, wrong, K.clamp01(progress * 1.25), coral, width=12)
            token(draw, cur[0], cur[1], 32, SHIRT)
            if progress > 0.8:
                ex, ey = g.p(2, 4)
                K.draw_cross(draw, ex + 62, ey - 40, 30, K.DANGER)
            card((1000, 300, 1720, 760), coral)
            K.text_at(draw, "Aarav goes:", 1360, 340, font(44, bold=True), muted)
            K.text_at(draw, "2 across", 1360, 430, font(60, bold=True), ACROSS)
            K.text_at(draw, "then 4 up", 1360, 520, font(60, bold=True), UP)
            if progress > 0.8:
                K.text_at(draw, "No ball! Oh no.", 1360, 640, font(50, bold=True), K.DANGER)
            return True
        if focus == "why":
            pts = [g.p(*p) for p in wrong]
            draw.line(pts, fill=(240, 180, 150), width=10, joint="curve")
            token(draw, *g.p(2, 4), 32, SHIRT)
            card((1000, 280, 1720, 820), K.BOTH_COLOR)
            K.text_at(draw, "Diya said:", 1360, 330, font(40, bold=True), muted)
            coord_text(draw, 4, 2, 1360, 450, 110)
            K.text_at(draw, "Which number", 1360, 560, font(48, bold=True), ink)
            K.text_at(draw, "comes first?", 1360, 625, font(48, bold=True), ink)
            stopwatch(1360, 760, 40)
            question_marks([(860, 330), (1800, 420)], size=70)
            return True
        # answer
        pts = [g.p(*p) for p in wrong]
        K.draw_dashed(draw, pts[0][0], pts[0][1], pts[2][0], pts[2][1], (240, 190, 170), width=6)
        K.draw_dashed(draw, pts[2][0], pts[2][1], pts[-1][0], pts[-1][1], (240, 190, 170), width=6)
        f = K.clamp01(progress * 1.6)
        bx, by = g.p(4, 2)
        if f >= 1:
            cricket_ball(draw, bx, by, 26)
        cur = walk(draw, g, right, f, sage, width=12)
        token(draw, cur[0] - (64 if f >= 1 else 0), cur[1] - (62 if f >= 1 else 0), 30, SHIRT)
        if f >= 1:
            K.draw_check(draw, bx + 48, by - 46, 24, sage)
        card((1000, 300, 1720, 780), sage)
        K.text_at(draw, "4 across first", 1360, 380, font(58, bold=True), ACROSS)
        K.text_at(draw, "then 2 up", 1360, 470, font(58, bold=True), UP)
        if f >= 1:
            K.pill(draw, 1360, 600, "Found it!", sage, size=44)
            star_spots([(1150, 720), (1570, 720)])
        return True

    # ---- what is a grid ------------------------------------------------------------------------
    if visual == "c12-grid":
        if focus == "grid":
            g = Grid(220, 800, 90, 6, 5)
            draw_grid(draw, g, nums=False, line=(236, 236, 240), axis=None)
            x0, y0, x1, y1 = g.box
            for j in range(g.ny + 1):
                a = K.stagger(progress, j, step=0.06, speed=6)
                if a > 0:
                    y = g.oy - j * g.cell
                    draw.line((x0, y, K.lerp(x0, x1, a), y), fill=ACROSS, width=7)
            for i in range(g.nx + 1):
                a = K.stagger(progress, i + 6, step=0.05, speed=6)
                if a > 0:
                    x = g.ox + i * g.cell
                    draw.line((x, y1, x, K.lerp(y1, y0, a)), fill=UP, width=7)
            K.pill(draw, 0, 252, "lines across", ACROSS, size=30, left=220)
            K.pill(draw, 0, 252, "lines up", UP, size=30, left=520)
            bx, by, c = 1100, 300, 60
            draw.rectangle((bx + 10, by + 12, bx + 8 * c + 10, by + 8 * c + 12), fill=K.SHADOW)
            for i in range(8):
                for j in range(8):
                    draw.rectangle((bx + i * c, by + j * c, bx + (i + 1) * c, by + (j + 1) * c),
                                   fill=CHESS_A if (i + j) % 2 == 0 else CHESS_B)
            draw.rectangle((bx, by, bx + 8 * c, by + 8 * c), outline=CHESS_B, width=6)
            rook(draw, bx + 1.5 * c, by + 6.65 * c, 0.55)
            rook(draw, bx + 6.5 * c, by + 1.65 * c, 0.55, col=(250, 246, 236))
            K.text_at(draw, "A chessboard is a grid!", bx + 4 * c, by + 8 * c + 30, font(36, bold=True), ink)
            return True
        if focus == "rows":
            bx, by, c = 990, 290, 64
            draw.rectangle((bx + 10, by + 12, bx + 8 * c + 10, by + 8 * c + 12), fill=K.SHADOW)
            for i in range(8):
                for j in range(8):
                    draw.rectangle((bx + i * c, by + j * c, bx + (i + 1) * c, by + (j + 1) * c),
                                   fill=CHESS_A if (i + j) % 2 == 0 else CHESS_B)
            n = int(K.clamp01(progress * 1.5) * 8 + 0.999)
            ra = K.stagger(progress, 0, speed=4)
            if ra > 0:
                draw.rectangle((bx - 6, by + 5 * c, bx + 8 * c + 6, by + 6 * c), outline=ACROSS, width=8)
            ca = K.stagger(progress, 2, step=0.12, speed=4)
            if ca > 0:
                draw.rectangle((bx + 2 * c, by - 6, bx + 3 * c, by + 8 * c + 6), outline=UP, width=8)
            for k in range(n):
                ctext(draw, str(k + 1), bx - 34, by + 8 * c - k * c - c / 2, 28, ACROSS)
                ctext(draw, str(k + 1), bx + k * c + c / 2, by + 8 * c + 30, 28, UP)
            K.text_at(draw, "8 rows", 1660, 420, font(48, bold=True), ACROSS)
            K.text_at(draw, "8 columns", 1660, 520, font(48, bold=True), UP)
            for k, (title, sub, col, soft, horiz) in enumerate((("ROW", "goes side to side", ACROSS, coral_soft, True),
                                                                 ("COLUMN", "stands up tall", UP, blue_soft, False))):
                a = K.stagger(progress, k * 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                y0 = 300 + k * 290 + int((1 - a) * 30)
                draw.rounded_rectangle((180 + 10, y0 + 12, 900 + 10, y0 + 250 + 12), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((180, y0, 900, y0 + 250), radius=36, fill=soft, outline=col, width=5)
                for m in range(5):
                    if horiz:
                        draw.rounded_rectangle((230 + m * 62, y0 + 100, 284 + m * 62, y0 + 154), radius=8, fill=col)
                    else:
                        draw.rounded_rectangle((330, y0 + 22 + m * 42, 370, y0 + 58 + m * 42), radius=8, fill=col)
                draw.text((560 if horiz else 450, y0 + 60), title, font=font(54, bold=True), fill=col)
                draw.text((560 if horiz else 450, y0 + 136), sub, font=font(34, bold=True), fill=ink)
            return True
        # origin
        g = Grid(320, 780, 100, 5, 4)
        draw_grid(draw, g)
        ox, oy = g.p(0, 0)
        rr = 30 + 10 * pulse
        draw.ellipse((ox - rr, oy - rr, ox + rr, oy + rr), outline=K.GOLD, width=8)
        dot(draw, ox, oy, sage, r=18)
        coord_tag(draw, ox, oy - 70, 0, 0, side="right", size=36)
        card((1040, 300, 1760, 800), sage)
        K.text_at(draw, "THE ORIGIN", 1400, 350, font(60, bold=True), sage)
        coord_text(draw, 0, 0, 1400, 500, 110, ca=ink, cb=ink)
        K.text_at(draw, "the bottom left corner", 1400, 610, font(40, bold=True), ink)
        K.text_at(draw, "where every trip starts", 1400, 680, font(36, bold=True), muted)
        return True

    # ---- coordinates = an address -----------------------------------------------------------
    if visual == "c12-address":
        g = Grid(220, 790, 90, 6, 5)
        draw_grid(draw, g)
        px, py = g.p(4, 2)
        rbox = (1020, 290, 1770, 830)
        if focus == "name":
            dot(draw, px, py, K.BOTH_COLOR, r=20)
            coord_tag(draw, px, py, 4, 2, side="right")
            card(rbox, K.BOTH_COLOR)
            K.text_at(draw, "COORDINATES", 1395, 340, font(56, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "= a point's address", 1395, 420, font(44, bold=True), ink)
            coord_text(draw, 4, 2, 1395, 590, 130)
            K.text_at(draw, "two numbers in brackets", 1395, 700, font(36, bold=True), muted)
            return True
        if focus in ("x", "y"):
            a = K.ease_out_cubic(K.clamp01(progress * 2))
            ex = K.lerp(g.ox, px, a) if focus == "x" else px
            draw.line((g.ox, g.oy, ex, g.oy), fill=ACROSS, width=14)
            if focus == "x":
                K.draw_arrow(draw, g.ox, g.oy, max(g.ox + 40, ex), g.oy, ACROSS, width=14, head=34)
            else:
                ey = K.lerp(g.oy, py, a)
                K.draw_arrow(draw, px, g.oy, px, min(g.oy - 40, ey), UP, width=14, head=34)
                if a >= 1:
                    dot(draw, px, py, K.BOTH_COLOR, r=18)
            card(rbox, ACROSS if focus == "x" else UP)
            K.text_at(draw, "1st number" if focus == "x" else "2nd number", 1395, 340, font(50, bold=True), muted)
            f = font(150, bold=True)
            parts = [("(", ink), ("4", ACROSS), (", ", ink), ("2", UP), (")", ink)]
            total = sum(f.getlength(p) for p, _ in parts)
            xx = 1395 - total / 2
            for p, c in parts:
                hi = (p == "4" and focus == "x") or (p == "2" and focus == "y")
                dim = p in ("4", "2") and not hi
                draw.text((xx, 410), p, font=f, fill=(206, 210, 220) if dim else c)
                if hi:
                    hx = xx + f.getlength(p) / 2
                    draw.ellipse((hx - 70, 420, hx + 70, 600), outline=K.GOLD, width=8)
                xx += f.getlength(p)
            if focus == "x":
                K.text_at(draw, "how far ACROSS", 1395, 640, font(48, bold=True), ACROSS)
                K.text_at(draw, "short name: x", 1395, 724, font(42, bold=True), ink)
            else:
                K.text_at(draw, "how far UP", 1395, 640, font(48, bold=True), UP)
                K.text_at(draw, "short name: y", 1395, 724, font(42, bold=True), ink)
            return True
        pts = path_pts((0, 0), [(4, 0), (0, 2)])
        if focus == "walk":
            f = K.clamp01(progress * 1.3)
            cur = walk(draw, g, pts, f, sage, width=12)
            if f >= 1:
                coord_tag(draw, px, py, 4, 2, side="right", gap=48)
            token(draw, cur[0], cur[1], 26, SHIRT)
            card(rbox, sage)
            coord_text(draw, 4, 2, 1395, 400, 100)
            steps = [("Start at (0, 0)", ink), ("Walk 4 across", ACROSS), ("Climb 2 up", UP)]
            for i, (txt, col) in enumerate(steps):
                a = K.stagger(progress, i, step=0.25, speed=4)
                if a <= 0:
                    continue
                y = 500 + i * 90
                draw.rounded_rectangle((1080, y, 1710, y + 72), radius=36, fill=[line, coral_soft, blue_soft][i])
                ctext(draw, txt, 1395, y + 36, 40, col)
            return True
        # rhyme: walk along the floor, then climb the stairs
        draw.line([g.p(*p) for p in pts], fill=sage, width=12, joint="curve")
        dot(draw, px, py, sage, r=18)
        sx0, base = 1060, 780
        draw.rectangle((sx0 - 40, base, 1780, base + 20), fill=K.DEV_MID)
        stairs_x = 1420
        for k in range(4):
            draw.rectangle((stairs_x + k * 90, base - (k + 1) * 80, 1760, base - k * 80), fill=(214, 170, 120),
                           outline=(150, 100, 60), width=4)
        f = K.clamp01(progress * 1.4)
        if f < 0.5:
            tx, ty = K.lerp(sx0 + 40, stairs_x - 40, f / 0.5), base - 40
        else:
            u = (f - 0.5) / 0.5
            kk = min(3.0, u * 4)
            tx = stairs_x - 40 + kk * 90 + 45
            ty = base - 40 - kk * 80
        token(draw, tx, ty, 30, SHIRT)
        K.pill(draw, 1200, 600, "1. Walk along", ACROSS, size=34)
        K.pill(draw, 1540, 330, "2. Climb up", UP, size=34)
        K.text_at(draw, "Across first, then up!", 1400, 250 + lift, font(56, bold=True), ink)
        return True

    # ---- order matters ---------------------------------------------------------------------
    if visual == "c12-order":
        g = Grid(220, 790, 90, 6, 5)
        draw_grid(draw, g)
        rbox = (1020, 290, 1770, 830)
        if focus == "swap":
            a = K.clamp01(progress * 1.6)
            p1 = path_pts((0, 0), [(4, 0), (0, 2)])
            p2 = path_pts((0, 0), [(2, 0), (0, 4)])
            walk(draw, g, p1, K.clamp01(a * 2), ACROSS, width=10, badges=False)
            if a > 0.5:
                walk(draw, g, p2, K.clamp01(a * 2 - 1), UP, width=10, badges=False)
            x1, y1 = g.p(4, 2)
            dot(draw, x1, y1, ACROSS, r=18)
            coord_tag(draw, x1, y1, 4, 2, side="right", col=ACROSS)
            if a >= 1:
                x2, y2 = g.p(2, 4)
                dot(draw, x2, y2, UP, r=18)
                coord_tag(draw, x2, y2, 2, 4, side="right", col=UP)
            card(rbox, K.BOTH_COLOR)
            coord_text(draw, 4, 2, 1395, 400, 100)
            K.text_at(draw, "is not", 1395, 470, font(46, bold=True), muted)
            coord_text(draw, 2, 4, 1395, 610, 100)
            K.pill(draw, 1395, 700, "Different spots!", K.BOTH_COLOR, size=38)
            return True
        if focus in ("ask", "ans"):
            ans = focus == "ans"
            card(rbox, coral)
            K.text_at(draw, "In the address", 1395, 340, font(44, bold=True), muted)
            if ans:
                coord_text(draw, 3, 5, 1395, 480, 140)
                K.text_at(draw, "3 = across", 1395, 600, font(52, bold=True), ACROSS)
                K.text_at(draw, "5 = up", 1395, 680, font(52, bold=True), UP)
                pts = path_pts((0, 0), [(3, 0), (0, 5)])
                walk(draw, g, pts, K.clamp01(progress * 1.4), sage, width=10)
                if progress > 0.72:
                    x, y = g.p(3, 5)
                    dot(draw, x, y, sage, r=18)
                    coord_tag(draw, x, y, 3, 5, side="right")
            else:
                coord_text(draw, 3, 5, 1395, 480, 140, ca=ink, cb=ink)
                K.text_at(draw, "which number", 1395, 600, font(50, bold=True), ink)
                K.text_at(draw, "is across?", 1395, 668, font(50, bold=True), coral)
                stopwatch(1395, 790, 32)
                question_marks([(600, 420)], size=110)
            return True
        ans = focus == "ans2"
        card(rbox, sage)
        K.text_at(draw, "Start at (0, 0)", 1395, 340, font(46, bold=True), ink)
        K.text_at(draw, "2 across", 1395, 430, font(56, bold=True), ACROSS)
        K.text_at(draw, "3 up", 1395, 510, font(56, bold=True), UP)
        pts = path_pts((0, 0), [(2, 0), (0, 3)])
        if ans:
            f = K.clamp01(progress * 1.6)
            cur = walk(draw, g, pts, f, sage, width=10)
            token(draw, cur[0], cur[1], 26, SHIRT)
            if f >= 1:
                x, y = g.p(2, 3)
                coord_tag(draw, x, y, 2, 3, side="right", gap=48)
            K.text_at(draw, "Address:", 1395, 610, font(40, bold=True), muted)
            coord_text(draw, 2, 3, 1395, 730, 100)
        else:
            token(draw, *g.p(0, 0), 26, SHIRT)
            K.text_at(draw, "Address = ?", 1395, 620, font(56, bold=True), coral)
            stopwatch(1395, 760, 40)
        return True

    # ---- moving on the grid -----------------------------------------------------------------
    if visual == "c12-move":
        g = Grid(210, 790, 92, 6, 5)
        draw_grid(draw, g)
        rbox = (1020, 290, 1770, 830)
        spec = {"right": ((1, 2), (3, 0), SHIRT, False, "3 right", "across: 1 + 3 = 4", ACROSS, (4, 2)),
                "up": ((4, 1), (0, 2), K.CORAL, True, "2 up", "up: 1 + 2 = 3", UP, (4, 3)),
                "left": ((5, 3), (-1, 0), SHIRT, False, "1 left", "across: 5 - 1 = 4", ACROSS, (4, 3))}
        (sx, sy), mv, col, girl, move_lab, math_lab, mcol, end = spec[focus]
        sxp, syp = g.p(sx, sy)
        draw.ellipse((sxp - 20, syp - 20, sxp + 20, syp + 20), outline=K.DEV_MID, width=5)
        pts = path_pts((sx, sy), [mv])
        f = K.clamp01((progress - 0.1) * 1.6)
        cur = walk(draw, g, pts, f, mcol, width=12)
        token(draw, cur[0], cur[1], 28, col, girl=girl)
        if f >= 1:
            ex, ey = g.p(*end)
            coord_tag(draw, ex, ey, end[0], end[1], side="above", gap=52)
        else:
            coord_tag(draw, sxp, syp, sx, sy, side="above", gap=52)
        card(rbox, mcol)
        K.text_at(draw, "Aarav" if not girl else "Diya", 1395, 330, font(40, bold=True), muted)
        coord_text(draw, sx, sy, 1395, 440, 80)
        rows = [(move_lab, mcol), (math_lab, ink)]
        for i, (txt, c) in enumerate(rows):
            a = K.stagger(progress, i + 1, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 500 + i * 88 + int((1 - a) * 16)
            if i == 0:
                K.draw_arrow(draw, 1395, y - 8, 1395, y + 4, muted, width=6, head=14)
                K.pill(draw, 1395, y + 6, txt, c, size=36)
            else:
                draw.rounded_rectangle((1070, y + 10, 1720, y + 82), radius=36, fill=line)
                ctext(draw, txt, 1395, y + 46, 40, c)
        if f >= 1:
            coord_text(draw, end[0], end[1], 1395, 750, 90)
        return True

    # ---- multi-step path + chess -------------------------------------------------------------
    if visual == "c12-path":
        g = Grid(210, 790, 92, 6, 5)
        rbox = (1020, 290, 1770, 830)
        if focus == "chess":
            x0, y0, x1, y1 = g.box
            draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), fill=K.SHADOW)
            for i in range(g.nx):
                for j in range(g.ny):
                    px_, py_ = g.p(i, j)
                    draw.rectangle((px_, py_ - g.cell, px_ + g.cell, py_), fill=CHESS_A if (i + j) % 2 else (250, 238, 214))
            for i in range(g.nx + 1):
                draw.line((g.ox + i * g.cell, y0, g.ox + i * g.cell, y1), fill=(214, 190, 150), width=3)
            for j in range(g.ny + 1):
                draw.line((x0, g.oy - j * g.cell, x1, g.oy - j * g.cell), fill=(214, 190, 150), width=3)
            draw.line((x0, y1, x1, y1), fill=ink, width=6)
            draw.line((x0, y0, x0, y1), fill=ink, width=6)
            for i in range(g.nx + 1):
                ctext(draw, str(i), g.ox + i * g.cell, y1 + 28, 30, ACROSS)
            for j in range(g.ny + 1):
                ctext(draw, str(j), x0 - 28, g.oy - j * g.cell, 30, UP)
            pts = path_pts((1, 1), [(0, 4)])
            f = K.clamp01((progress - 0.1) * 1.6)
            sx_, sy_ = g.p(1, 1)
            draw.ellipse((sx_ - 20, sy_ - 20, sx_ + 20, sy_ + 20), outline=K.DEV_MID, width=5)
            cur = walk(draw, g, pts, f, UP, width=12)
            rook(draw, cur[0], cur[1] + 6, 0.8)
            coord_tag(draw, sx_, sy_, 1, 1, side="right", size=30)
            if f >= 1:
                coord_tag(draw, cur[0], cur[1], 1, 5, side="right", size=30)
            card(rbox, UP)
            coord_text(draw, 1, 1, 1260, 360, 64)
            K.draw_arrow(draw, 1380, 360, 1450, 360, muted, width=8, head=22)
            coord_text(draw, 1, 5, 1580, 360, 64)
            rows = [("across: stays 1", ACROSS), ("up: 5 - 1 = 4", UP)]
            for i, (txt, c) in enumerate(rows):
                a = K.stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 450 + i * 100 + int((1 - a) * 16)
                draw.rounded_rectangle((1070, y, 1720, y + 76), radius=38, fill=line)
                ctext(draw, txt, 1395, y + 38, 42, c)
            if progress > 0.7:
                K.pill(draw, 1395, 680, "It moved 4 up!", sage, size=44)
            return True
        draw_grid(draw, g)
        sx_, sy_ = g.p(2, 2)
        if focus == "ask":
            token(draw, sx_, sy_, 28, SHIRT)
            coord_tag(draw, sx_, sy_, 2, 2, side="above", gap=52)
            card(rbox, coral)
            K.text_at(draw, "Start at", 1395, 330, font(40, bold=True), muted)
            coord_text(draw, 2, 2, 1395, 420, 80)
            moves = [("3 right", ACROSS, (1, 0)), ("2 up", UP, (0, -1)), ("1 left", ACROSS, (-1, 0))]
            for i, (lab, c, (ddx, ddy)) in enumerate(moves):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 490 + i * 80 + int((1 - a) * 14)
                draw.rounded_rectangle((1150, y, 1640, y + 66), radius=33, fill=[coral_soft, blue_soft, coral_soft][i])
                K.draw_arrow(draw, 1220 - ddx * 30, y + 33 - ddy * 22, 1220 + ddx * 30, y + 33 + ddy * 22, c, width=8,
                             head=20)
                draw.text((1290, y + 12), f"{i + 1}. {lab}", font=font(38, bold=True), fill=c)
            stopwatch(1395, 780, 32)
            return True
        pts = path_pts((2, 2), [(3, 0), (0, 2), (-1, 0)])
        f = K.clamp01(progress * 1.25)
        cur = walk(draw, g, pts, f, sage, width=12)
        sx2 = (2, 2)
        draw.ellipse((sx_ - 20, sy_ - 20, sx_ + 20, sy_ + 20), outline=K.DEV_MID, width=5)
        checkpoints = [((5, 2), 3 / 6, "below"), ((5, 4), 5 / 6, "right"), ((4, 4), 1.0, "above")]
        for (qx, qy), th, side in checkpoints:
            if f >= th:
                x, y = g.p(qx, qy)
                dot(draw, x, y, sage, r=14)
                coord_tag(draw, x, y, qx, qy, side=side, size=30, gap=52 if side == "above" else 26)
        token(draw, cur[0], cur[1], 26, SHIRT)
        card(rbox, sage)
        coord_text(draw, sx2[0], sx2[1], 1395, 340, 64)
        rows = [("3 right", (5, 2), ACROSS), ("2 up", (5, 4), UP), ("1 left", (4, 4), ACROSS)]
        for i, (lab, (qx, qy), c) in enumerate(rows):
            if f < checkpoints[i][1] - 0.02:
                continue
            y = 420 + i * 100
            draw.rounded_rectangle((1070, y, 1720, y + 80), radius=40, fill=line)
            draw.text((1110, y + 18), lab, font=font(40, bold=True), fill=c)
            K.draw_arrow(draw, 1330, y + 40, 1410, y + 40, muted, width=7, head=20)
            coord_text(draw, qx, qy, 1440, y + 40, 44, left=True)
        if f >= 1:
            K.pill(draw, 1395, 740, "You're at (4, 4)!", sage, size=40)
        return True

    # ---- battleship ------------------------------------------------------------------------
    if visual == "c12-ship":
        g = Grid(260, 800, 96, 5, 5)
        draw_grid(draw, g, fill=SEA, line=SEA_LINE, axis_labels=False)
        x0, y0, x1, y1 = g.box
        for k in range(4):
            wy = y0 + 70 + k * 120
            pts = [(x0 + 20 + i * 20, wy + 6 * math.sin(i * 0.9 + t * 8 + k)) for i in range(22)]
            draw.line(pts, fill=(176, 212, 240), width=4)
        shx, shy = g.p(3, 4)
        tx, ty = g.p(4, 3)
        if focus == "intro":
            a = K.ease_out_cubic(K.clamp01(progress * 2))
            ship(draw, K.lerp(x0 - 60, shx, a), shy + 10, 0.9)
            K.pill(draw, (x0 + x1) / 2, 236, "5 × 5 grid", K.ROAD, size=34)
            kid(draw, 1180, 500, 1.1, t)
            diya(draw, 1560, 500, 1.1, t + 0.3)
            K.text_at(draw, "hides the ship", 1180, 700, font(36, bold=True), K.ROAD)
            K.text_at(draw, "guesses!", 1560, 700, font(36, bold=True), coral)
            K.text_at(draw, "BATTLESHIP", 1370, 260 + lift, font(64, bold=True), ink)
            return True
        rbox = (1000, 290, 1760, 830)
        if focus == "hide":
            pts = path_pts((0, 0), [(3, 0), (0, 4)])
            walk(draw, g, pts, K.clamp01(progress * 1.4), K.GOLD, width=8, badges=True)
            ship(draw, shx, shy + 10, 0.9)
            coord_tag(draw, shx, shy - 20, 3, 4, side="right", size=32)
            kid(draw, 1250, 520, 1.1, t)
            K.draw_bubble(draw, (1380, 290, 1760, 440), brand, "Shh!", tail="left", size=56)
            K.text_at(draw, "Ship at", 1300, 720, font(40, bold=True), muted)
            coord_text(draw, 3, 4, 1520, 744, 64)
            return True
        ship(draw, shx, shy + 10, 0.9, faded=True)
        if focus == "ask":
            rr = 34 + 6 * pulse
            draw.ellipse((tx - rr, ty - rr, tx + rr, ty + rr), outline=K.DANGER, width=6)
            draw.line((tx - rr - 12, ty, tx + rr + 12, ty), fill=K.DANGER, width=4)
            draw.line((tx, ty - rr - 12, tx, ty + rr + 12), fill=K.DANGER, width=4)
            diya(draw, 1500, 560, 1.1, t)
            K.draw_bubble(draw, (1000, 280, 1440, 440), brand, "Is it (4, 3)?", tail="right", size=46)
            K.text_at(draw, "Hit or miss?", 1230, 560, font(52, bold=True), coral)
            stopwatch(1230, 720, 50)
            return True
        if focus == "miss":
            splash(draw, tx, ty, t)
            coord_tag(draw, tx, ty + 10, 4, 3, side="right", size=30)
            card(rbox, (80, 150, 230))
            K.text_at(draw, "SPLASH!", 1380, 330, font(44, bold=True), (80, 150, 230))
            K.text_at(draw, "MISS", 1380, 390, font(100, bold=True), K.DANGER)
            coord_text(draw, 4, 3, 1220, 590, 70)
            K.text_at(draw, "vs", 1380, 566, font(44, bold=True), muted)
            coord_text(draw, 3, 4, 1540, 590, 70)
            K.text_at(draw, "The numbers are swapped!", 1380, 680, font(40, bold=True), ink)
            return True
        # hit
        splash(draw, tx, ty, 0.0, col=(170, 200, 230))
        ship(draw, shx, shy + 10, 0.9)
        if progress > 0.2:
            boom(draw, shx, shy, t)
        coord_tag(draw, shx + 40, shy, 3, 4, side="right", size=30)
        diya(draw, 1560, 560, 1.0, t)
        K.draw_heart(draw, 1680, 430 + bounce, 28, coral)
        K.text_at(draw, "HIT!", 1220, 330, font(110, bold=True), K.DANGER)
        coord_text(draw, 3, 4, 1220, 520, 80)
        K.pill(draw, 1220, 620, "Across, then up!", sage, size=40)
        star_spots([(1000, 760), (1400, 790)])
        return True

    # ---- pixels ------------------------------------------------------------------------------
    if visual == "c12-pixels":
        if focus in ("screen", "address"):
            sx0, sy0, ps = 200, 300, 5
            sw, sh = 160 * ps, 90 * ps
            draw.rounded_rectangle((sx0 - 24 + 10, sy0 - 24 + 12, sx0 + sw + 24 + 10, sy0 + sh + 24 + 12), radius=24,
                                   fill=K.SHADOW)
            draw.rounded_rectangle((sx0 - 24, sy0 - 24, sx0 + sw + 24, sy0 + sh + 24), radius=24, fill=K.DEV_DARK)
            draw.rectangle((sx0, sy0, sx0 + sw, sy0 + sh), fill=(236, 244, 252))
            for i in range(0, 161, 10):
                draw.line((sx0 + i * ps, sy0, sx0 + i * ps, sy0 + sh), fill=(206, 220, 236), width=2)
            for j in range(0, 91, 10):
                draw.line((sx0, sy0 + sh - j * ps, sx0 + sw, sy0 + sh - j * ps), fill=(206, 220, 236), width=2)
            if focus == "screen":
                for k in range(3):
                    hx = sx0 + (30 + k * 50) * ps
                    draw.rectangle((hx, sy0 + sh - 60 * ps, hx + 20 * ps, sy0 + sh - 40 * ps), fill=[K.CORAL, K.ROAD, sage][k])
                zx, zy, zs = 1180, 300, 90
                K.draw_dashed(draw, sx0 + sw + 24, sy0 + 100, zx, zy + 40, K.GOLD, width=4)
                draw.rectangle((zx + 10, zy + 12, zx + 6 * zs + 10, zy + 5 * zs + 12), fill=K.SHADOW)
                n = int(30 * K.clamp01(progress * 2.2))
                for k in range(n):
                    j, i = divmod(k, 6)
                    draw.rectangle((zx + i * zs, zy + j * zs, zx + (i + 1) * zs - 6, zy + (j + 1) * zs - 6),
                                   fill=K.CORAL if (i, j) in ((2, 1), (3, 1), (2, 2), (3, 2)) else (236, 244, 252),
                                   outline=K.DEV_MID, width=3)
                K.pill(draw, zx + 3 * zs, zy + 5 * zs + 30, "Tiny squares: pixels!", coral, size=34)
                return True
            ax, ay = 120, 45
            hx, hy = sx0 + ax * ps, sy0 + sh - ay * ps
            for i in range(0, 161, 40):
                ctext(draw, str(i), sx0 + i * ps, sy0 + sh + 52, 26, ACROSS)
            for j in range(0, 91, 45):
                ctext(draw, str(j), sx0 - 60, sy0 + sh - j * ps, 26, UP)
            a = K.ease_out_cubic(K.clamp01(progress * 2))
            K.draw_dashed(draw, sx0, sy0 + sh - 4, K.lerp(sx0, hx, a), sy0 + sh - 4, ACROSS, width=6)
            if a >= 1:
                K.draw_dashed(draw, hx, sy0 + sh, hx, hy, UP, width=6)
                draw.rectangle((hx - 3, hy - 8, hx + 8, hy + 3), fill=K.DANGER)
                rr = 22 + 6 * pulse
                draw.ellipse((hx - rr, hy - rr, hx + rr, hy + rr), outline=K.GOLD, width=6)
            card((1140, 290, 1770, 760), K.BOTH_COLOR)
            K.text_at(draw, "This pixel's address", 1455, 340, font(38, bold=True), muted)
            coord_text(draw, 120, 45, 1455, 470, 96)
            K.text_at(draw, "120 across", 1455, 560, font(44, bold=True), ACROSS)
            K.text_at(draw, "45 up", 1455, 630, font(44, bold=True), UP)
            return True
        # art: colour the right pixels
        n_cols, n_rows, c = 9, 8, 64
        gx0, gy0 = 240, 300
        draw.rectangle((gx0 + 10, gy0 + 12, gx0 + n_cols * c + 10, gy0 + n_rows * c + 12), fill=K.SHADOW)
        draw.rectangle((gx0, gy0, gx0 + n_cols * c, gy0 + n_rows * c), fill=(255, 255, 255))
        cells = [(i, j) for j, row in enumerate(HEART) for i, ch in enumerate(row) if ch == "X"]
        n = int(len(cells) * K.clamp01(progress * 1.3))
        for i, j in cells[:n]:
            draw.rectangle((gx0 + i * c, gy0 + j * c, gx0 + (i + 1) * c, gy0 + (j + 1) * c), fill=K.DANGER)
        for i in range(n_cols + 1):
            draw.line((gx0 + i * c, gy0, gx0 + i * c, gy0 + n_rows * c), fill=GRID_LINE, width=3)
        for j in range(n_rows + 1):
            draw.line((gx0, gy0 + j * c, gx0 + n_cols * c, gy0 + j * c), fill=GRID_LINE, width=3)
        if n < len(cells):
            i, j = cells[n]
            draw.rectangle((gx0 + i * c, gy0 + j * c, gx0 + (i + 1) * c, gy0 + (j + 1) * c), outline=K.GOLD, width=6)
        K.draw_arrow(draw, 900, 560, 1040, 560, coral, width=14, head=40)
        draw.rounded_rectangle((1090 + 10, 300 + 12, 1730 + 10, 820 + 12), radius=30, fill=K.SHADOW)
        draw.rounded_rectangle((1090, 300, 1730, 820), radius=30, fill=K.DEV_DARK)
        draw.rectangle((1120, 330, 1700, 790), fill=(236, 244, 252))
        if n >= len(cells):
            sc = 40
            hx0, hy0 = 1410 - 4.5 * sc, 560 - 4 * sc
            for i, j in cells:
                draw.rectangle((hx0 + i * sc, hy0 + j * sc, hx0 + (i + 1) * sc - 2, hy0 + (j + 1) * sc - 2), fill=K.DANGER)
            star_spots([(1200, 400), (1620, 720)])
        else:
            K.draw_spinner(draw, 1410, 560, 50, t, K.DEV_MID)
        return True

    # ---- checkpoint --------------------------------------------------------------------------
    if visual == "c12-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Mark the point!", cx, 450 + lift, font(64, bold=True), ink)
            mini_grid(cx - 100, 560 + lift, 4, 40)
            dot(draw, cx - 100 + 4 * 40, 560 + lift + 2 * 40, coral, r=12)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=PAPER)
        K.text_at(draw, "Mark (4, 2). Which number is across?", 695, 256, font(44, bold=True), coral)
        g = Grid(260, 790, 80, 6, 5)
        draw_grid(draw, g, fill=PAPER, num_size=28, axis_labels=False, shadow=False)
        if ans:
            pts = path_pts((0, 0), [(4, 0), (0, 2)])
            f = K.clamp01(progress * 1.4)
            walk(draw, g, pts, f, sage, width=10)
            if f >= 1:
                x, y = g.p(4, 2)
                draw.line((x - 16, y - 16, x + 16, y + 16), fill=K.DANGER, width=10)
                draw.line((x - 16, y + 16, x + 16, y - 16), fill=K.DANGER, width=10)
            K.text_at(draw, "4 is", 1030, 430, font(60, bold=True), ACROSS)
            K.text_at(draw, "across!", 1030, 500, font(60, bold=True), ACROSS)
            K.text_at(draw, "2 is up", 1030, 610, font(48, bold=True), UP)
        else:
            K.text_at(draw, "?", 1030, 470, font(int(110 + 16 * pulse), bold=True), coral)
        kid(draw, 1540, 520, 1.3, t)
        if ans:
            K.draw_heart(draw, 1700, 380 + bounce, 30, coral)
            star_spots([(1380, 330), (1730, 640)])
        else:
            question_marks([(1700, 330)], size=80)
            stopwatch(1540, 800, 44)
        return True

    # ---- recap -------------------------------------------------------------------------------
    if visual == "c12-recap":
        recap = [(("Grid = rows", "and columns"), coral, "grid"), (("Address =", "(across, up)"), K.BOTH_COLOR, "addr"),
                 (("Across first,", "then up"), sage, "path"), (("Screens are", "pixel grids"), K.ROAD, "pix")]
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
                if kind == "grid":
                    mini_grid(ix - 120, iy - 120, 4, 60)
                    draw.rectangle((ix - 120, iy + 60, ix + 120, iy + 120), outline=ACROSS, width=7)
                    draw.rectangle((ix, iy - 120, ix + 60, iy + 120), outline=UP, width=7)
                elif kind == "addr":
                    coord_text(draw, "x", "y", ix, iy, 90)
                elif kind == "path":
                    gg = Grid(ix - 110, iy + 100, 55, 4, 4)
                    draw_grid(draw, gg, nums=False, shadow=False)
                    draw.line([gg.p(0, 0), gg.p(3, 0), gg.p(3, 2)], fill=sage, width=10, joint="curve")
                    dot(draw, *gg.p(3, 2), sage, r=12)
                else:
                    draw.rounded_rectangle((ix - 130, iy - 100, ix + 130, iy + 80), radius=16, fill=K.DEV_DARK)
                    for i2 in range(8):
                        for j2 in range(5):
                            colr = K.DANGER if (i2, j2) in ((3, 2), (4, 2), (3, 1), (4, 1)) else (236, 244, 252)
                            draw.rectangle((ix - 116 + i2 * 29, iy - 86 + j2 * 31, ix - 116 + i2 * 29 + 27,
                                            iy - 86 + j2 * 31 + 29), fill=colr)
                    draw.rectangle((ix - 30, iy + 80, ix + 30, iy + 110), fill=K.DEV_MID)
                f = font(36, bold=True)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, t)
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Grid explorer", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        star_spots([(cx - 560, 420), (cx + 560, 420), (cx - 500, 680), (cx + 500, 680)])
        return True

    return False
