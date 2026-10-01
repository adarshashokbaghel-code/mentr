"""C11 · Shapes All Around — visuals."""
import math

import build as K

WOOD = (214, 170, 120)
WOOD_DARK = (150, 100, 60)
BOARD = (44, 92, 76)
CHALK = (236, 244, 238)
SAMOSA = (232, 172, 76)
SAMOSA_DARK = (188, 124, 44)
HONEY = (255, 200, 64)
HONEY_DARK = (214, 146, 28)
OCTO = (176, 112, 214)
OCTO_DARK = (130, 76, 170)
WALL = (252, 240, 218)
WALL_EDGE = (232, 214, 184)
FLOOR = (226, 204, 170)
CARROM = (240, 210, 156)
CARROM_EDGE = (150, 92, 48)
ROTI = (232, 196, 132)
ROTI_SPOT = (196, 146, 84)
SKY = (190, 222, 250)
GRASS = (110, 186, 96)
SHIRT = (150, 196, 246)
GLASS = (206, 232, 250)
DOOR = (176, 112, 66)

TRI = K.CORAL
SQ = K.ROAD
RECT = (13, 148, 136)
CIRC = K.GOLD
PENT = K.BOTH_COLOR
HEX = HONEY
OCT = K.DANGER


def S_(s):
    return lambda v: v * s


def ctext(draw, text, x, y, size, col, bold=True):
    f = K.load_font(size, bold=bold)
    b = draw.textbbox((0, 0), text, font=f)
    draw.text((x - (b[0] + b[2]) / 2, y - (b[1] + b[3]) / 2), text, font=f, fill=col)


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


def reg_pts(n, cx, cy, r, start=-90.0):
    return [(cx + r * math.cos(math.radians(start + 360 * i / n)), cy + r * math.sin(math.radians(start + 360 * i / n)))
            for i in range(n)]


def shape_pts(kind, cx, cy, r):
    if kind == "tri":
        return reg_pts(3, cx, cy + r * 0.18, r, -90)
    if kind == "sq":
        q = r * 0.8
        return [(cx - q, cy - q), (cx + q, cy - q), (cx + q, cy + q), (cx - q, cy + q)]
    if kind == "rect":
        a, b = r * 1.15, r * 0.62
        return [(cx - a, cy - b), (cx + a, cy - b), (cx + a, cy + b), (cx - a, cy + b)]
    if kind == "pent":
        return reg_pts(5, cx, cy + r * 0.08, r, -90)
    if kind == "hex":
        return reg_pts(6, cx, cy, r, 0)
    if kind == "oct":
        return reg_pts(8, cx, cy, r, 22.5)
    return None


def poly(draw, pts, fill, outline=None, w=6, shadow=True):
    if shadow:
        draw.polygon([(x + 10, y + 12) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=fill)
    if outline:
        draw.line(pts + [pts[0], pts[1]], fill=outline, width=w, joint="curve")


def shape(draw, kind, cx, cy, r, col, outline=None, shadow=True):
    if kind == "circ":
        if shadow:
            draw.ellipse((cx - r + 10, cy - r + 12, cx + r + 10, cy + r + 12), fill=K.SHADOW)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col, outline=outline, width=6 if outline else 0)
        return None
    pts = shape_pts(kind, cx, cy, r)
    poly(draw, pts, col, outline, shadow=shadow)
    return pts


def badge(draw, x, y, num, col, r=26):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255), outline=col, width=5)
    ctext(draw, str(num), x, y, int(r * 1.15), K.DEV_DEEP)


def centroid(pts):
    return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)


def side_marks(draw, pts, k, col, out=50, r=26, width=14, nums=True):
    n = len(pts)
    gx, gy = centroid(pts)
    for i in range(min(k, n)):
        a, b = pts[i], pts[(i + 1) % n]
        draw.line([a, b], fill=col, width=width)
        for p in (a, b):
            draw.ellipse((p[0] - width / 2, p[1] - width / 2, p[0] + width / 2, p[1] + width / 2), fill=col)
    if not nums:
        return
    for i in range(min(k, n)):
        a, b = pts[i], pts[(i + 1) % n]
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        dx, dy = mx - gx, my - gy
        ln = math.hypot(dx, dy) or 1
        badge(draw, mx + dx / ln * out, my + dy / ln * out, i + 1, col, r)


def corner_marks(draw, pts, k, col, out=46, r=24, nums=True):
    gx, gy = centroid(pts)
    for i in range(min(k, len(pts))):
        x, y = pts[i]
        draw.ellipse((x - 17, y - 17, x + 17, y + 17), fill=(255, 255, 255))
        draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=col)
        if nums:
            dx, dy = x - gx, y - gy
            ln = math.hypot(dx, dy) or 1
            badge(draw, x + dx / ln * out, y + dy / ln * out, i + 1, col, r)


def lit(progress, n, start=0.05, speed=1.6):
    if progress < start:
        return 0
    return min(n, int(K.clamp01((progress - start) * speed) * n) + 1)


def tricycle(draw, cx, cy, s, col):
    S = S_(s)
    wheels = [(cx + S(130), cy + S(40), S(78)), (cx - S(150), cy + S(70), S(48)), (cx - S(50), cy + S(70), S(48))]
    for wx, wy, wr in wheels[1:]:
        draw.ellipse((wx - wr, wy - wr, wx + wr, wy + wr), fill=K.DEV_DARK)
        draw.ellipse((wx - wr * 0.5, wy - wr * 0.5, wx + wr * 0.5, wy + wr * 0.5), fill=K.STEEL)
    draw.line([(cx - S(150), cy + S(70)), (cx - S(50), cy + S(70))], fill=col, width=max(3, int(S(14))))
    draw.line([(cx - S(90), cy + S(70)), (cx + S(20), cy - S(10)), (cx + S(130), cy + S(40))], fill=col,
              width=max(3, int(S(16))), joint="curve")
    draw.line([(cx + S(130), cy + S(40)), (cx + S(100), cy - S(80))], fill=col, width=max(3, int(S(14))))
    draw.line([(cx + S(70), cy - S(90)), (cx + S(140), cy - S(80))], fill=K.DEV_DARK, width=max(3, int(S(14))))
    draw.line([(cx + S(20), cy - S(10)), (cx - S(10), cy - S(50))], fill=col, width=max(3, int(S(12))))
    draw.rounded_rectangle((cx - S(60), cy - S(70), cx + S(30), cy - S(44)), radius=S(12), fill=K.DEV_DARK)
    wx, wy, wr = wheels[0]
    draw.ellipse((wx - wr, wy - wr, wx + wr, wy + wr), fill=K.DEV_DARK)
    draw.ellipse((wx - wr * 0.55, wy - wr * 0.55, wx + wr * 0.55, wy + wr * 0.55), fill=K.STEEL)
    return wheels


def bee(draw, cx, cy, s, t):
    S = S_(s)
    flap = S(8) * math.sin(t * 40)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(6) - S(26), cy - S(60) - flap, cx + sx * S(6) + S(26), cy - S(14)),
                     fill=(230, 244, 252), outline=(160, 196, 220), width=max(2, int(S(3))))
    draw.ellipse((cx - S(50), cy - S(30), cx + S(50), cy + S(30)), fill=HONEY)
    for k in (-14, 10):
        draw.rectangle((cx + S(k), cy - S(28), cx + S(k + 12), cy + S(28)), fill=K.DEV_DEEP)
    draw.ellipse((cx + S(30), cy - S(22), cx + S(70), cy + S(18)), fill=K.DEV_DEEP)
    draw.ellipse((cx + S(48), cy - S(10), cx + S(58), cy), fill=(255, 255, 255))
    draw.polygon([(cx - S(50), cy - S(6)), (cx - S(72), cy), (cx - S(50), cy + S(6))], fill=K.DEV_DEEP)


def octopus(draw, cx, cy, s, t):
    S = S_(s)
    for i in range(8):
        f = i / 7
        bx = cx + S(-90 + 180 * f)
        sway = S(14) * math.sin(t * 8 + i)
        ex = cx + S(-200 + 400 * f) + sway
        pts = []
        for k in range(9):
            u = k / 8
            px = K.lerp(bx, ex, u) + S(18) * math.sin(u * 6 + i)
            py = cy + S(40) + S(150) * u
            pts.append((px, py))
        draw.line(pts, fill=OCTO, width=max(4, int(S(26) * 1.0)), joint="curve")
        draw.ellipse((pts[-1][0] - S(13), pts[-1][1] - S(13), pts[-1][0] + S(13), pts[-1][1] + S(13)), fill=OCTO)
    draw.ellipse((cx - S(120), cy - S(150), cx + S(120), cy + S(70)), fill=OCTO)
    draw.ellipse((cx - S(70), cy - S(120), cx - S(20), cy - S(80)), fill=(214, 170, 240))
    for sx in (-1, 1):
        ex = cx + sx * S(44)
        draw.ellipse((ex - S(22), cy - S(40), ex + S(22), cy + S(4)), fill=(255, 255, 255))
        draw.ellipse((ex - S(10), cy - S(28), ex + S(10), cy - S(8)), fill=K.DEV_DEEP)
    draw.arc((cx - S(30), cy - S(6), cx + S(30), cy + S(34)), 20, 160, fill=OCTO_DARK, width=max(2, int(S(7))))


def roti(draw, cx, cy, r):
    draw.ellipse((cx - r + 6, cy - r + 8, cx + r + 6, cy + r + 8), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=ROTI, outline=ROTI_SPOT, width=4)
    for dx, dy, rr in ((-0.4, -0.2, 0.12), (0.3, -0.35, 0.1), (0.1, 0.3, 0.14), (-0.3, 0.4, 0.08), (0.45, 0.2, 0.09)):
        draw.ellipse((cx + dx * r - rr * r, cy + dy * r - rr * r, cx + dx * r + rr * r, cy + dy * r + rr * r),
                     fill=ROTI_SPOT)


def bangle(draw, cx, cy, r):
    draw.ellipse((cx - r + 6, cy - r + 8, cx + r + 6, cy + r + 8), outline=K.SHADOW, width=int(r * 0.24))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=K.GOLD, width=int(r * 0.24))
    for k in range(8):
        a = k * math.pi / 4
        x, y = cx + math.cos(a) * r * 0.88, cy + math.sin(a) * r * 0.88
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill=K.DANGER)


def clock(draw, cx, cy, r, t):
    draw.ellipse((cx - r + 8, cy - r + 10, cx + r + 8, cy + r + 10), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255), outline=K.DEV_DARK, width=10)
    for k in range(12):
        a = k * math.pi / 6
        r0 = r * (0.72 if k % 3 == 0 else 0.8)
        draw.line((cx + math.cos(a) * r0, cy + math.sin(a) * r0, cx + math.cos(a) * r * 0.88,
                   cy + math.sin(a) * r * 0.88), fill=K.DEV_DARK, width=6 if k % 3 == 0 else 3)
    a = -math.pi / 2 + t * 2
    draw.line((cx, cy, cx + math.cos(a) * r * 0.7, cy + math.sin(a) * r * 0.7), fill=K.DANGER, width=5)
    draw.line((cx, cy, cx + r * 0.42, cy - r * 0.18), fill=K.DEV_DARK, width=9)
    draw.ellipse((cx - 9, cy - 9, cx + 9, cy + 9), fill=K.DEV_DARK)


def carrom(draw, x0, y0, sz):
    draw.rectangle((x0 + 10, y0 + 12, x0 + sz + 10, y0 + sz + 12), fill=K.SHADOW)
    draw.rectangle((x0, y0, x0 + sz, y0 + sz), fill=CARROM_EDGE)
    e = sz * 0.09
    draw.rectangle((x0 + e, y0 + e, x0 + sz - e, y0 + sz - e), fill=CARROM)
    pr = sz * 0.05
    for px, py in ((x0 + e + pr, y0 + e + pr), (x0 + sz - e - pr, y0 + e + pr), (x0 + e + pr, y0 + sz - e - pr),
                   (x0 + sz - e - pr, y0 + sz - e - pr)):
        draw.ellipse((px - pr, py - pr, px + pr, py + pr), fill=K.DEV_DEEP)
    c = x0 + sz / 2, y0 + sz / 2
    draw.ellipse((c[0] - sz * 0.16, c[1] - sz * 0.16, c[0] + sz * 0.16, c[1] + sz * 0.16), outline=K.DANGER, width=4)
    for k, (dx, dy, col) in enumerate(((0, 0, K.DANGER), (-0.07, 0.05, (250, 246, 236)), (0.07, -0.05, K.DEV_DEEP),
                                       (0.06, 0.07, (250, 246, 236)), (-0.06, -0.07, K.DEV_DEEP))):
        x, y, rr = c[0] + dx * sz, c[1] + dy * sz, sz * 0.03
        draw.ellipse((x - rr, y - rr, x + rr, y + rr), fill=col)


def samosa_pts(cx, by, wd, ht):
    return [(cx + wd * 0.06, by - ht), (cx + wd / 2, by), (cx - wd / 2, by)]


def samosa(draw, pts):
    poly(draw, pts, SAMOSA, SAMOSA_DARK, w=6, shadow=True)
    (ax, ay), (bx, by), (cx_, cy_) = pts
    for k in range(1, 4):
        f = k / 4
        draw.line((K.lerp(ax, cx_, f) + 8, K.lerp(ay, cy_, f), K.lerp(ax, bx, f) - 8, K.lerp(ay, by, f)),
                  fill=SAMOSA_DARK, width=3)


BOARD_BOX = (580, 290, 1180, 580)
CLOCK_C = (1330, 390, 84)
CARROM_BOX = (1350, 540, 290)
SAMOSA_P = samosa_pts(600, 708, 180, 115)


def classroom(draw, t, ink):
    draw.rounded_rectangle((120, 236, 1800, 868), radius=34, fill=WALL, outline=WALL_EDGE, width=4)
    draw.rounded_rectangle((120, 740, 1800, 868), radius=34, fill=FLOOR)
    draw.rectangle((122, 740, 1798, 790), fill=FLOOR)
    x0, y0, x1, y1 = BOARD_BOX
    draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), fill=K.SHADOW)
    draw.rectangle(BOARD_BOX, fill=WOOD_DARK)
    draw.rectangle((x0 + 16, y0 + 16, x1 - 16, y1 - 16), fill=BOARD)
    draw.rectangle((x0 + 60, y1 - 4, x1 - 60, y1 + 12), fill=WOOD)
    draw.polygon([(700, 530), (760, 430), (820, 530)], outline=CHALK, width=5)
    draw.rectangle((880, 430, 980, 530), outline=CHALK, width=5)
    draw.ellipse((1040, 430, 1140, 530), outline=CHALK, width=5)
    clock(draw, CLOCK_C[0], CLOCK_C[1], CLOCK_C[2], t)
    carrom(draw, CARROM_BOX[0], CARROM_BOX[1], CARROM_BOX[2])
    kid(draw, 330, 570, 1.0, t)
    draw.rectangle((180 + 8, 712 + 10, 780 + 8, 742 + 10), fill=K.SHADOW)
    for lx in (210, 740):
        draw.rectangle((lx - 12, 740, lx + 12, 850), fill=WOOD_DARK)
    draw.rectangle((180, 712, 780, 742), fill=WOOD)
    draw.ellipse((510, 696, 710, 724), fill=K.STEEL, outline=K.STEEL_DARK, width=3)
    samosa(draw, SAMOSA_P)


def glow_rect(draw, box, col, pad=14, w=10):
    x0, y0, x1, y1 = box
    draw.rectangle((x0 - pad, y0 - pad, x1 + pad, y1 + pad), outline=col, width=w)


def pixel_art():
    cols, rows = 18, 10
    grid = [[SKY] * cols for _ in range(rows)]
    for x, y in ((15, 1), (16, 1), (15, 2), (16, 2)):
        grid[y][x] = K.GOLD
    for y, (a, b) in zip((2, 3, 4), ((8, 9), (7, 10), (6, 11))):
        for x in range(a, b + 1):
            grid[y][x] = K.DANGER
    for y in range(5, 9):
        for x in range(6, 12):
            grid[y][x] = (250, 236, 200)
    for y in (7, 8):
        for x in (8, 9):
            grid[y][x] = DOOR
    for x in range(cols):
        grid[9][x] = GRASS
    for x, y in ((2, 2), (3, 2), (4, 2), (3, 1)):
        grid[y][x] = (255, 255, 255)
    return grid


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

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def float_shapes(spots, r=34):
        kinds = [("tri", TRI), ("sq", SQ), ("circ", CIRC), ("hex", HEX), ("pent", PENT), ("oct", OCT)]
        for k, (sx, sy) in enumerate(spots):
            kd, col = kinds[k % len(kinds)]
            shape(draw, kd, sx, sy + 10 * math.sin(progress * 8 + k), r, col, shadow=False)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def info_card(box, title, rows, col, title_size=64, row_size=44, gap=82):
        x0, y0, x1, y1 = box
        K.shadow_card(draw, box, brand, radius=36, accent=col)
        mx = (x0 + x1) / 2
        K.text_at(draw, title, mx, y0 + 76, font(title_size, bold=True), col)
        for i, (txt, c) in enumerate(rows):
            a = K.stagger(progress, i + 1, step=0.14, speed=4)
            if a <= 0:
                continue
            K.text_at(draw, txt, mx, y0 + 76 + title_size + 40 + i * gap + int((1 - a) * 20), font(row_size, bold=True),
                      c or ink)

    def stopwatch(x, y, r=44):
        K.draw_stopwatch(draw, x, y, r, progress, brand)

    def dashed_poly(pts, col, width=6):
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            K.draw_dashed(draw, a[0], a[1], b[0], b[1], col, width=width, phase=progress * 120)

    def eq_card(box, rows, col, big=None):
        x0, y0, x1, y1 = box
        K.shadow_card(draw, box, brand, radius=36, accent=col)
        mx = (x0 + x1) / 2
        y = y0 + 90
        for i, txt in enumerate(rows):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            K.text_at(draw, txt, mx, y + i * 96 + int((1 - a) * 20), font(58, bold=True), ink)
        if big:
            a = K.stagger(progress, len(rows), step=0.2, speed=4)
            if a > 0:
                K.text_at(draw, big, mx, y + len(rows) * 96 + 20 + int((1 - a) * 20), font(76, bold=True), col)

    # ---- opening -----------------------------------------------------------------
    if visual == "c11-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            kid(draw, cx + 280, 430, 1.3, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            float_shapes([(cx - 600, 330), (cx + 600, 330), (cx - 680, 560), (cx + 680, 560), (cx, 300)], r=40)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · LOGIC PUZZLES", cx, 326 + lift, font(34, bold=True), sage)
            seats = [("Neha", "1", coral), ("Ravi", "2", K.ROAD), ("Meera", "3", K.BOTH_COLOR)]
            for i, (name, num, col) in enumerate(seats):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 300
                y = 520 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 80, y + 60, x + 80, y + 110), radius=14, fill=WOOD)
                draw.rectangle((x - 70, y + 110, x - 56, y + 170), fill=WOOD_DARK)
                draw.rectangle((x + 56, y + 110, x + 70, y + 170), fill=WOOD_DARK)
                K.draw_face(draw, x, y, 54, "kid", 0.6)
                K.pill(draw, x, y + 70, "Seat " + num, col, size=26)
                K.text_at(draw, name, x, y - 140, font(36, bold=True), ink)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                K.draw_check(draw, cx + 470, 560, 44, sage)
                K.pill(draw, cx, 742 + int((1 - a) * 20), "Unit 2 complete!", sage, size=34)
            return True
        if focus == "unit":
            K.shadow_card(draw, (240, 250 + lift, w - 240, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "UNIT 3", cx, 320 + lift, font(36, bold=True), coral)
            K.text_at(draw, "Shapes, Grids & Coordinates", cx, 380 + lift, font(74, bold=True), ink)
            for i, lab in enumerate(("Shapes", "Grids", "Coordinates")):
                a = K.stagger(progress, i + 1, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 440
                y = 610 + int((1 - a) * 30)
                draw.ellipse((x - 120, y - 120, x + 120, y + 100), fill=[coral_soft, blue_soft, sage_soft][i])
                if i == 0:
                    shape(draw, "tri", x - 50, y - 30, 50, TRI)
                    shape(draw, "circ", x + 50, y - 40, 40, CIRC)
                    shape(draw, "sq", x, y + 40, 40, SQ)
                else:
                    gx0, gy1, c = x - 80, y + 60, 40
                    for k in range(5):
                        draw.line((gx0 + k * c, gy1 - 160, gx0 + k * c, gy1), fill=K.DEV_MID, width=3)
                        draw.line((gx0, gy1 - k * c, gx0 + 160, gy1 - k * c), fill=K.DEV_MID, width=3)
                    if i == 2:
                        px, py = gx0 + 2 * c, gy1 - 3 * c
                        draw.ellipse((px - 14, py - 14, px + 14, py + 14), fill=coral)
                K.text_at(draw, lab, x, y + 116, font(36, bold=True), ink)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Shapes All Around", cx, 360 + lift, font(86, bold=True), ink)
            kinds = [("tri", TRI), ("sq", SQ), ("circ", CIRC), ("rect", RECT), ("pent", PENT), ("hex", HEX),
                     ("oct", OCT)]
            for i, (kd, col) in enumerate(kinds):
                a = K.stagger(progress, i + 1, step=0.07, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 3) * 200
                shape(draw, kd, x, 690 + int((1 - a) * 40), 50 if kd == "rect" else 66, col)
            return True
        # promise
        draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=sage_soft)
        kid(draw, 480, 520, 1.6, t)
        K.draw_magnifier(draw, 670, 690, 0.8, coral)
        K.text_at(draw, "Count the sides,", 1260, 290 + lift, font(76, bold=True), ink)
        K.text_at(draw, "name the shape!", 1260, 390 + lift, font(76, bold=True), coral)
        pts = shape_pts("pent", 1260, 660, 130)
        poly(draw, pts, lav_soft, K.STEEL)
        side_marks(draw, pts, lit(progress, 5), PENT, out=44, r=24)
        return True

    # ---- Aarav's shape hunt ---------------------------------------------------------------
    if visual == "c11-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=blue_soft)
            kid(draw, 560, 480, 1.7, t)
            K.text_at(draw, "Meet", 1300, 300 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Aarav!", 1300, 370 + lift, font(130, bold=True), coral)
            K.pill(draw, 1300, 560, "Class 4 · loves a challenge", sage, size=36)
            K.draw_school(draw, 1300, 760, 0.6, brand)
            float_shapes([(980, 700), (1620, 700), (1000, 330), (1640, 330)], r=36)
            return True
        if focus == "task":
            K.draw_person(draw, 360, 520, 1.3, "teacher", t)
            K.draw_bubble(draw, (560, 260, 1300, 470), brand, "Find shapes in our classroom, in 1 minute!", tail="left",
                          size=44)
            K.draw_stopwatch(draw, 1560, 420, 110, progress * 2, brand)
            K.text_at(draw, "1 minute!", 1560, 560, font(44, bold=True), coral)
            kid(draw, 1000, 650, 0.9, t)
            K.text_at(draw, "Go!", 1000, 520, font(56, bold=True), sage)
            float_shapes([(760, 600), (1240, 600), (740, 780), (1260, 780)], r=30)
            return True
        if focus == "look":
            classroom(draw, t, ink)
            spots = [(880, 400), (CLOCK_C[0], CLOCK_C[1]), (1495, 690)]
            seg = min(2.0, progress * 2.4)
            i = int(seg)
            f = K.ease_in_out(seg - i)
            a, b = spots[min(i, 2)], spots[min(i + 1, 2)]
            mx, my = K.lerp(a[0], b[0], f), K.lerp(a[1], b[1], f)
            K.draw_magnifier(draw, mx, my, 0.9, coral)
            return True
        if focus == "why":
            draw.ellipse((420 - 250, 600 - 250, 420 + 250, 600 + 250), fill=blue_soft)
            kid(draw, 420, 560, 1.5, t)
            draw.ellipse((700, 250, 1700, 760), fill=K.SHADOW)
            draw.ellipse((690, 240, 1690, 750), fill=panel, outline=(200, 192, 180), width=4)
            for k, rr in enumerate((24, 16)):
                px, py = 640 - k * 50, 720 + k * 40
                draw.ellipse((px - rr, py - rr, px + rr, py + rr), fill=panel, outline=(200, 192, 180), width=3)
            for i, (kd, col) in enumerate((("tri", TRI), ("hex", HEX), ("pent", PENT))):
                x = 950 + i * 240
                shape(draw, kd, x, 440, 80, col)
                ctext(draw, "?", x, 590, int(64 + 12 * (pulse if i % 2 else 1 - pulse)), coral)
            question_marks([(600, 300)], size=80)
            stopwatch(1700, 800, 40)
            return True
        # secret
        K.text_at(draw, "The secret: count!", cx, 250 + lift, font(72, bold=True), coral)
        for i, (kd, col, n, lab) in enumerate((("tri", TRI, 3, "3 sides"), ("sq", SQ, 4, "4 sides"),
                                               ("pent", PENT, 5, "5 sides"))):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 520
            y = 560 + int((1 - a) * 30)
            pts = shape_pts(kd, x, y, 120)
            poly(draw, pts, col)
            side_marks(draw, pts, n, ink, out=44, r=24, width=10)
            K.text_at(draw, lab, x, 740, font(48, bold=True), col)
        return True

    # ---- shape words -----------------------------------------------------------------------
    tri_pts = shape_pts("tri", 600, 560, 250)
    if visual == "c11-define":
        if focus == "flat":
            draw.polygon([(250 + 10, 280 + 12), (940 + 10, 260 + 12), (960 + 10, 830 + 12), (270 + 10, 850 + 12)],
                         fill=K.SHADOW)
            draw.polygon([(250, 280), (940, 260), (960, 830), (270, 850)], fill=(255, 255, 255), outline=line)
            for k in range(1, 9):
                y = 280 + k * 62
                draw.line((262, y, 950, y - 20), fill=(214, 228, 244), width=3)
            sq = [(330, 420), (560, 413), (567, 643), (337, 650)]
            d = K.clamp01(progress * 2.2)
            segs = 4 * d
            for i in range(4):
                f = K.clamp01(segs - i)
                if f <= 0:
                    break
                a, b = sq[i], sq[(i + 1) % 4]
                draw.line([a, (K.lerp(a[0], b[0], f), K.lerp(a[1], b[1], f))], fill=SQ, width=10)
            ca = K.clamp01(progress * 2.2 - 0.9) * 360
            if ca > 0:
                draw.arc((640, 400, 880, 640), -90, -90 + ca, fill=CIRC, width=12)
            px, py = (880, 520) if ca > 0 else sq[min(3, int(segs))]
            draw.line((px, py, px + 70, py - 120), fill=K.GOLD, width=26)
            draw.polygon([(px - 10, py - 6), (px + 4, py - 30), (px, py)], fill=K.DEV_DARK)
            info_card((1040, 280, 1760, 820), "2D SHAPE", [("A flat shape", None), ("you can draw", None),
                                                          ("on paper", None)], coral, title_size=72, row_size=50)
            return True
        if focus in ("side", "corner"):
            poly(draw, tri_pts, coral_soft, K.STEEL if focus == "side" else TRI, w=8)
            if focus == "side":
                side_marks(draw, tri_pts, lit(progress, 3), TRI, out=56, r=30)
                info_card((1040, 280, 1760, 820), "SIDE", [("a straight edge", None), ("of a shape", None)], TRI,
                          title_size=90, row_size=50)
            else:
                corner_marks(draw, tri_pts, lit(progress, 3, speed=2.4), K.BOTH_COLOR, out=56, r=30)
                draw.rounded_rectangle((1040 + 10, 280 + 12, 1760 + 10, 820 + 12), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((1040, 280, 1760, 820), radius=36, fill=panel, outline=line, width=3)
                K.text_at(draw, "CORNER", 1400, 320, font(80, bold=True), K.BOTH_COLOR)
                K.text_at(draw, "where 2 sides meet", 1400, 430, font(46, bold=True), ink)
                a = K.stagger(progress, 2, step=0.2, speed=4)
                if a > 0:
                    draw.rounded_rectangle((1090, 530, 1710, 780), radius=30, fill=lav_soft)
                    K.text_at(draw, "also called a", 1400, 556, font(38, bold=True), muted)
                    K.text_at(draw, "VERTEX", 1400, 606, font(60, bold=True), K.BOTH_COLOR)
                    K.text_at(draw, "more than one: vertices", 1400, 702, font(36, bold=True), ink)
            return True
        # tri
        pts = shape_pts("tri", 470, 540, 200)
        poly(draw, pts, TRI)
        side_marks(draw, pts, 3, K.DEV_DEEP, out=48, r=26, width=10)
        K.text_at(draw, "3 sides · 3 corners", 470, 760, font(48, bold=True), TRI)
        draw.rounded_rectangle((960 + 10, 280 + 12, 1760 + 10, 820 + 12), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle((960, 280, 1760, 820), radius=36, fill=gold_soft, outline=K.GOLD, width=4)
        K.text_at(draw, "Tri = 3", 1360, 310, font(80, bold=True), coral)
        wheels = tricycle(draw, 1380, 520, 1.1, coral)
        n = lit(progress, 3, start=0.2, speed=2.0)
        for i, (wx, wy, wr) in enumerate(wheels[:n]):
            badge(draw, wx, wy + wr + 34, i + 1, coral, r=24)
        K.text_at(draw, "a tricycle has 3 wheels", 1360, 750, font(36, bold=True), ink)
        return True

    # ---- square, rectangle, circle --------------------------------------------------------------
    if visual == "c11-four":
        if focus == "square":
            pts = shape_pts("sq", 600, 570, 250)
            poly(draw, pts, blue_soft, SQ, w=8)
            side_marks(draw, pts, lit(progress, 4), K.GOLD, out=48, r=28)
            if progress > 0.5:
                ctext(draw, "all the same!", 600, 570, 46, SQ)
            info_card((1040, 280, 1760, 820), "SQUARE", [("4 sides", None), ("all the same", SQ), ("length", SQ)], SQ,
                      title_size=80, row_size=54)
            return True
        if focus == "rect":
            pts = shape_pts("rect", 590, 560, 270)
            poly(draw, pts, sage_soft, RECT, w=8)
            n = lit(progress, 4)
            gx, gy = centroid(pts)
            for i in range(n):
                col = coral if i % 2 == 0 else K.BOTH_COLOR
                a, b = pts[i], pts[(i + 1) % 4]
                draw.line([a, b], fill=col, width=14)
            for i in range(n):
                col = coral if i % 2 == 0 else K.BOTH_COLOR
                a, b = pts[i], pts[(i + 1) % 4]
                mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
                dx, dy = mx - gx, my - gy
                ln = math.hypot(dx, dy)
                badge(draw, mx + dx / ln * 48, my + dy / ln * 48, i + 1, col, 28)
            if n >= 4:
                ctext(draw, "long", 590, 420, 40, coral)
                ctext(draw, "long", 590, 700, 40, coral)
                ctext(draw, "short", 380, 560, 40, K.BOTH_COLOR)
                ctext(draw, "short", 800, 560, 40, K.BOTH_COLOR)
            draw.rounded_rectangle((1040 + 10, 280 + 12, 1760 + 10, 830 + 12), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((1040, 280, 1760, 830), radius=36, fill=panel, outline=line, width=3)
            K.text_at(draw, "RECTANGLE", 1400, 310, font(70, bold=True), RECT)
            K.text_at(draw, "4 sides", 1400, 410, font(48, bold=True), ink)
            K.text_at(draw, "opposite sides equal", 1400, 480, font(42, bold=True), coral)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                dx0 = 1340
                draw.rectangle((dx0 + 8, 580 + 10, dx0 + 130 + 8, 800 + 10), fill=K.SHADOW)
                draw.rectangle((dx0, 580, dx0 + 130, 800), fill=DOOR, outline=WOOD_DARK, width=5)
                draw.ellipse((dx0 + 100, 690, dx0 + 116, 706), fill=K.GOLD)
                K.text_at(draw, "a door!", 1590, 664, font(40, bold=True), muted)
            return True
        if focus == "diff":
            sq = shape_pts("sq", 520, 520, 190)
            poly(draw, sq, blue_soft, SQ, w=8)
            side_marks(draw, sq, 4, K.GOLD, nums=False)
            K.text_at(draw, "SQUARE", 520, 280, font(50, bold=True), SQ)
            K.pill(draw, 520, 740, "All 4 sides equal", SQ, size=36)
            K.text_at(draw, "vs", cx, 480, font(70, bold=True), muted)
            rc = shape_pts("rect", 1400, 520, 220)
            poly(draw, rc, sage_soft, RECT, w=8)
            for i in range(4):
                draw.line([rc[i], rc[(i + 1) % 4]], fill=coral if i % 2 == 0 else K.BOTH_COLOR, width=14)
            K.text_at(draw, "RECTANGLE", 1400, 280, font(50, bold=True), RECT)
            K.pill(draw, 1400, 740, "Opposite sides equal", RECT, size=36)
            return True
        # circle
        draw.ellipse((600 - 250 + 10, 560 - 250 + 12, 600 + 250 + 10, 560 + 250 + 12), fill=K.SHADOW)
        draw.ellipse((600 - 250, 560 - 250, 600 + 250, 560 + 250), fill=gold_soft, outline=CIRC, width=12)
        ang = -math.pi / 2 + progress * math.pi * 4
        draw.arc((350, 310, 850, 810), -90, -90 + (progress * 720) % 360, fill=coral, width=14)
        px, py = 600 + math.cos(ang) * 250, 560 + math.sin(ang) * 250
        draw.ellipse((px - 20, py - 20, px + 20, py + 20), fill=coral)
        ctext(draw, "one curvy line", 600, 560, 44, muted)
        draw.rounded_rectangle((1040 + 10, 280 + 12, 1760 + 10, 830 + 12), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle((1040, 280, 1760, 830), radius=36, fill=panel, outline=line, width=3)
        K.text_at(draw, "CIRCLE", 1400, 310, font(76, bold=True), K.GOLD)
        for i, lab in enumerate(("0 straight sides", "0 corners")):
            a = K.stagger(progress, i + 1, step=0.14, speed=4)
            if a <= 0:
                continue
            y = 440 + i * 100 + int((1 - a) * 20)
            K.draw_cross(draw, 1120, y + 26, 26, K.DANGER)
            draw.text((1170, y), lab, fill=ink, font=font(46, bold=True))
        a = K.stagger(progress, 3, step=0.14, speed=4)
        if a > 0:
            roti(draw, 1260, 700, 70)
            bangle(draw, 1540, 700, 66)
            K.text_at(draw, "roti", 1260, 778, font(30, bold=True), muted)
            K.text_at(draw, "bangle", 1540, 778, font(30, bold=True), muted)
        return True

    # ---- more sides, new names ------------------------------------------------------------------
    if visual == "c11-more":
        if focus == "intro":
            specs = [("tri", TRI, "3", "triangle"), ("sq", SQ, "4", "square"), ("pent", PENT, "5", "pentagon"),
                     ("hex", HEX, "6", "hexagon"), ("oct", OCT, "8", "octagon")]
            for i, (kd, col, n, name) in enumerate(specs):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 340
                y = 480 + int((1 - a) * 40)
                shape(draw, kd, x, y, 110, col)
                K.pill(draw, x, 640, n + " sides", col, size=36, fg=ink if kd == "hex" else (255, 255, 255))
                K.text_at(draw, name, x, 740, font(40, bold=True), ink)
            return True
        if focus == "penta":
            pts = shape_pts("pent", 600, 560, 250)
            poly(draw, pts, lav_soft, K.STEEL, w=8)
            side_marks(draw, pts, lit(progress, 5), PENT, out=52, r=28)
            info_card((1040, 280, 1760, 820), "PENTAGON", [("5 sides", None), ("5 corners", None)], PENT,
                      title_size=76, row_size=56, gap=96)
            return True
        if focus == "hexa":
            r = 92
            hcx, hcy = 560, 560
            dx, dy = 1.5 * r, math.sqrt(3) * r
            cells = []
            for c in range(-2, 3):
                for rr in range(-2, 3):
                    x = hcx + c * dx
                    y = hcy + rr * dy + (dy / 2 if c % 2 else 0)
                    if 250 < y - r * 0.86 and y + r * 0.86 < 880 and abs(c) <= 2:
                        cells.append((x, y, c == 0 and rr == 0))
            for x, y, mid in cells:
                if not mid:
                    poly(draw, reg_pts(6, x, y, r - 4, 0), HONEY, HONEY_DARK, w=8, shadow=False)
            pts = reg_pts(6, hcx, hcy, r - 4, 0)
            poly(draw, pts, (255, 228, 140), HONEY_DARK, w=8, shadow=False)
            side_marks(draw, pts, lit(progress, 6), coral, out=40, r=24, width=12)
            bee(draw, 950 + 20 * math.sin(t * 6), 300 + 14 * math.cos(t * 7), 0.9, t)
            info_card((1060, 380, 1760, 820), "HEXAGON", [("6 sides", None), ("6 corners", None)], HONEY_DARK,
                      title_size=76, row_size=56, gap=96)
            return True
        if focus == "octa":
            pts = shape_pts("oct", 560, 560, 250)
            draw.line((560, 560, 560, 860), fill=K.STEEL_DARK, width=26)
            poly(draw, pts, OCT, (255, 255, 255), w=8)
            side_marks(draw, pts, lit(progress, 8), K.GOLD, out=50, r=27)
            K.text_at(draw, "OCTAGON", 1360, 250 + lift, font(76, bold=True), OCT)
            K.text_at(draw, "8 sides", 1360, 350 + lift, font(52, bold=True), ink)
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                octopus(draw, 1360, 600 + int((1 - a) * 30), 0.85, t)
                K.pill(draw, 1360, 800, "Octopus: 8 arms!", OCTO, size=34)
            return True
        # tip
        specs = [("pent", PENT, 5, lav_soft), ("hex", HEX, 6, gold_soft), ("oct", OCT, 8, (253, 232, 230))]
        for i, (kd, col, n, soft) in enumerate(specs):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 540
            y0 = 270 + int((1 - a) * 40)
            draw.rounded_rectangle((x - 240 + 10, y0 + 12, x + 240 + 10, y0 + 580 + 12), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x - 240, y0, x + 240, y0 + 580), radius=36, fill=soft, outline=col, width=5)
            pts = shape_pts(kd, x, y0 + 210, 130)
            poly(draw, pts, col, shadow=False)
            corner_marks(draw, pts, n, K.DEV_DEEP, nums=False)
            K.text_at(draw, f"{n} sides", x, y0 + 390, font(48, bold=True), ink)
            K.text_at(draw, f"{n} corners", x, y0 + 460, font(48, bold=True), col if kd != "hex" else HONEY_DARK)
        return True

    # ---- name that shape game ------------------------------------------------------------------
    if visual == "c11-game":
        if focus == "intro":
            K.shadow_card(draw, (380, 280 + lift, w - 380, 800 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "GAME TIME", cx, 360 + lift, font(40, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "Name that shape!", cx, 430 + lift, font(84, bold=True), ink)
            for i, (kd, col) in enumerate((("oct", OCT), ("tri", TRI), ("hex", HEX))):
                x = cx + (i - 1) * 260
                shape(draw, kd, x, 650 + lift, 70, col)
                ctext(draw, "?", x, 656 + lift, 64, (255, 255, 255))
            return True
        if focus == "ask":
            draw.rounded_rectangle((120, 770, 1800, 860), radius=24, fill=K.DEV_MID)
            for k in range(7):
                draw.rectangle((180 + k * 240, 808, 300 + k * 240, 822), fill=(255, 255, 255))
            K.draw_school(draw, 420, 600, 1.0, brand)
            draw.rectangle((1050 - 14, 480, 1050 + 14, 790), fill=K.STEEL_DARK)
            K.draw_stop_sign(draw, 1050, 440, 170)
            K.pill(draw, 1560, 300, "Count the sides!", coral, size=38)
            question_marks([(1560, 420)], size=90)
            stopwatch(1560, 640, 60)
            return True
        if focus == "ans":
            draw.rectangle((640 - 16, 560, 640 + 16, 860), fill=K.STEEL_DARK)
            K.draw_stop_sign(draw, 640, 560, 240)
            pts = shape_pts("oct", 640, 560, 240)
            side_marks(draw, pts, lit(progress, 8, start=0.0, speed=2.2), K.GOLD, out=48, r=27, width=10)
            K.pill(draw, 1380, 380, "8 sides", K.DANGER, size=50)
            K.text_at(draw, "OCTAGON!", 1380, 520, font(96, bold=True), ink)
            K.text_at(draw, "8 corners too", 1380, 660, font(44, bold=True), muted)
            star_spots([(1100, 760), (1660, 760)])
            return True
        ans = focus == "ans2"
        pts = shape_pts("tri", 470, 560, 230)
        poly(draw, pts, coral_soft, TRI, w=8)
        if ans:
            corner_marks(draw, pts, 3, K.BOTH_COLOR, out=52, r=28)
        else:
            ctext(draw, "?", 470, 600, int(110 + 16 * pulse), coral)
        K.shadow_card(draw, (900, 280, 1760, 560), brand, radius=36, accent=K.BOTH_COLOR)
        K.text_at(draw, "TRUE OR FALSE?", 1330, 318, font(34, bold=True), K.BOTH_COLOR)
        K.text_at(draw, "A triangle has", 1330, 380, font(56, bold=True), ink)
        K.text_at(draw, "4 corners.", 1330, 452, font(56, bold=True), ink)
        for i, (lab, col) in enumerate((("TRUE", sage), ("FALSE", K.DANGER))):
            x = 1110 + i * 440
            on = ans and i == 1
            dim = ans and i == 0
            fill = (226, 226, 230) if dim else col
            draw.rounded_rectangle((x - 180 + 8, 620 + 10, x + 180 + 8, 760 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x - 180, 620 - (10 if on else 0), x + 180, 760 - (10 if on else 0)), radius=36,
                                   fill=fill, outline=K.GOLD if on else fill, width=8)
            ctext(draw, lab, x, 690 - (10 if on else 0), 54, (255, 255, 255))
            if on:
                K.draw_check(draw, x + 170, 620, 30, sage)
        if ans:
            K.pill(draw, 1330, 800, "3 sides, so 3 corners", sage, size=32)
        else:
            stopwatch(1330, 808, 34)
        return True

    # ---- spotting shapes in the classroom ---------------------------------------------------------
    if visual == "c11-spot":
        if focus == "you":
            draw.rounded_rectangle((120, 236, 1360, 868), radius=34, fill=WALL, outline=WALL_EDGE, width=4)
            draw.rounded_rectangle((120, 780, 1360, 868), radius=34, fill=FLOOR)
            draw.rectangle((122, 780, 1358, 820), fill=FLOOR)
            items = [((200, 380, 400, 780), DOOR, "door"), ((520, 300, 820, 520), GLASS, "window"),
                     ((980, 330, 1280, 520), K.DEV_DARK, "TV"), ((560, 640, 760, 760), coral, "book")]
            n = lit(progress, 4, start=0.15, speed=2.0)
            for i, (box, col, lab) in enumerate(items):
                x0, y0, x1, y1 = box
                draw.rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), fill=K.SHADOW)
                draw.rectangle(box, fill=col, outline=K.DEV_DARK, width=5)
                if lab == "TV":
                    draw.rectangle((x0 + 16, y0 + 16, x1 - 16, y1 - 16), fill=(90, 150, 210))
                    draw.rectangle(((x0 + x1) / 2 - 60, y1 + 10, (x0 + x1) / 2 + 60, y1 + 30), fill=K.DEV_DARK)
                if lab == "door":
                    draw.ellipse((x1 - 40, 580, x1 - 22, 598), fill=K.GOLD)
                if lab == "book":
                    draw.rectangle((x0, y0, x0 + 24, y1), fill=K.DEV_DARK)
                if i < n:
                    glow_rect(draw, box, K.GOLD, pad=10, w=8)
                    badge(draw, x1 + 4, y0 - 4, i + 1, coral, r=26)
            draw.rectangle((520, 760, 800, 780), fill=WOOD_DARK)
            kid(draw, 1580, 470, 1.0, t)
            stopwatch(1580, 760, 70)
            K.text_at(draw, "How many?", 1580, 290, font(48, bold=True), coral)
            return True
        classroom(draw, t, ink)
        if focus == "intro":
            K.pill(draw, 880, 222, "Shape hunt!", coral, size=36)
            question_marks([(880, 330), (CLOCK_C[0], CLOCK_C[1] - 50), (1495, 640)], size=70)
            return True
        if focus == "board":
            x0, y0, x1, y1 = BOARD_BOX
            pts = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
            side_marks(draw, pts, lit(progress, 4), K.GOLD, out=38, r=26, width=12)
            K.pill(draw, 880, 330, "Rectangle", RECT, size=44)
            return True
        if focus == "clock":
            x, y, r = CLOCK_C
            draw.ellipse((x - r - 16, y - r - 16, x + r + 16, y + r + 16), outline=K.GOLD, width=10)
            K.pill(draw, 0, 356, "Circle", K.GOLD, size=44, fg=ink, left=1450)
            return True
        if focus == "samosa":
            side_marks(draw, SAMOSA_P, lit(progress, 3), coral, out=38, r=24, width=10)
            K.pill(draw, 610, 778, "Triangle", coral, size=40)
            return True
        x0, y0, sz = CARROM_BOX
        pts = [(x0, y0), (x0 + sz, y0), (x0 + sz, y0 + sz), (x0, y0 + sz)]
        side_marks(draw, pts, lit(progress, 4), K.ROAD, out=34, r=24, width=12)
        K.pill(draw, x0 + sz / 2, y0 + sz / 2 - 34, "Square", K.ROAD, size=40)
        return True

    # ---- shapes on screens ----------------------------------------------------------------------
    if visual == "c11-screen":
        if focus == "pixels":
            draw.rounded_rectangle((180 + 10, 260 + 12, 1000 + 10, 760 + 12), radius=28, fill=K.SHADOW)
            draw.rounded_rectangle((180, 260, 1000, 760), radius=28, fill=K.DEV_DARK)
            draw.rectangle((470, 760, 710, 800), fill=K.DEV_MID)
            draw.rounded_rectangle((380, 800, 800, 830), radius=12, fill=K.DEV_DARK)
            grid = pixel_art()
            ps = 42
            gx0, gy0 = 590 - 9 * ps, 300
            for ry, row in enumerate(grid):
                for rx, col in enumerate(row):
                    draw.rectangle((gx0 + rx * ps, gy0 + ry * ps, gx0 + rx * ps + ps - 2, gy0 + ry * ps + ps - 2),
                                   fill=col)
            zx, zy = 5, 2
            sel = (gx0 + zx * ps - 4, gy0 + zy * ps - 4, gx0 + (zx + 5) * ps + 2, gy0 + (zy + 5) * ps + 2)
            draw.rectangle(sel, outline=K.GOLD, width=6)
            zoom = K.ease_out_cubic(K.clamp01(progress * 2.5))
            px0, py0, big = 1200, 270, 100
            K.draw_dashed(draw, sel[2], sel[1], px0, py0, K.GOLD, width=4)
            K.draw_dashed(draw, sel[2], sel[3], px0, py0 + 5 * big, K.GOLD, width=4)
            n = int(25 * zoom)
            for k in range(n):
                ry, rx = divmod(k, 5)
                col = grid[zy + ry][zx + rx]
                draw.rectangle((px0 + rx * big, py0 + ry * big, px0 + rx * big + big - 6, py0 + ry * big + big - 6),
                               fill=col, outline=K.DEV_DARK, width=3)
            if n >= 25:
                hx, hy = px0 + 4 * big, py0 + 2 * big
                draw.rectangle((hx - 4, hy - 4, hx + big - 2, hy + big - 2), outline=K.GOLD, width=8)
                K.pill(draw, 1450, 790, "1 pixel = 1 tiny square", coral, size=30)
            return True
        if focus == "house":
            draw.rounded_rectangle((200 + 10, 250 + 12, 1160 + 10, 860 + 12), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((200, 250, 1160, 860), radius=30, fill=SKY)
            draw.rounded_rectangle((200, 790, 1160, 860), radius=30, fill=GRASS)
            draw.rectangle((200, 790, 1160, 820), fill=GRASS)
            K.pill(draw, 0, 270, "LEVEL 1", K.DEV_DARK, size=28, left=230)
            a = K.stagger(progress, 0, step=0.2, speed=4)
            wy = int((1 - a) * -200)
            walls = [(530, 490 + wy), (830, 490 + wy), (830, 790 + wy), (530, 790 + wy)]
            poly(draw, walls, SQ, K.DEV_DARK, w=6)
            b = K.stagger(progress, 1, step=0.2, speed=4)
            if b > 0:
                ry = int((1 - b) * -260)
                roof = [(680, 300 + ry), (860, 470 + ry), (500, 470 + ry)]
                poly(draw, roof, TRI, K.DEV_DARK, w=6)
            for i, (kd, col, lab) in enumerate((("sq", SQ, "Walls = square"), ("tri", TRI, "Roof = triangle"))):
                c = K.stagger(progress, i + 2, step=0.15, speed=4)
                if c <= 0:
                    continue
                y = 380 + i * 220 + int((1 - c) * 20)
                draw.rounded_rectangle((1240, y - 80, 1780, y + 80), radius=40, fill=panel, outline=col, width=5)
                shape(draw, kd, 1330, y, 50, col, shadow=False)
                draw.text((1410, y - 30), lab, fill=ink, font=font(44, bold=True))
            return True
        # count: pull the house apart and count each piece
        a = K.ease_in_out(K.clamp01(progress * 3))
        sq0 = (560, 460, 300)
        sq1 = (230, 340, 300)
        sx, sy = K.lerp(sq0[0], sq1[0], a), K.lerp(sq0[1], sq1[1], a)
        walls = [(sx, sy), (sx + 300, sy), (sx + 300, sy + 300), (sx, sy + 300)]
        tri0 = (710, 260, 450)
        tri1 = (870, 360, 640)
        ax_ = K.lerp(tri0[0], tri1[0], a)
        ay_ = K.lerp(tri0[1], tri1[1], a)
        by_ = K.lerp(tri0[2], tri1[2], a)
        roof = [(ax_, ay_), (ax_ + 190, by_), (ax_ - 190, by_)]
        poly(draw, walls, SQ, K.DEV_DARK, w=6)
        poly(draw, roof, TRI, K.DEV_DARK, w=6)
        if a >= 1:
            ns = lit(progress, 4, start=0.35, speed=3.0)
            nt = lit(progress, 3, start=0.55, speed=3.0)
            side_marks(draw, walls, ns, K.GOLD, out=42, r=26, width=10)
            side_marks(draw, roof, nt, K.GOLD, out=42, r=26, width=10)
            if ns >= 4:
                K.text_at(draw, "4 sides", 380, 730, font(44, bold=True), SQ)
            if nt >= 3:
                K.text_at(draw, "3 sides", 870, 730, font(44, bold=True), TRI)
        K.shadow_card(draw, (1200, 300, 1760, 800), brand, radius=36, accent=sage)
        K.text_at(draw, "ALTOGETHER", 1480, 330, font(34, bold=True), sage)
        if progress > 0.6:
            K.text_at(draw, "4 + 3", 1480, 400, font(96, bold=True), ink)
        if progress > 0.72:
            K.text_at(draw, "= 7", 1480, 530, font(110, bold=True), sage)
            K.text_at(draw, "sides", 1480, 680, font(48, bold=True), muted)
        return True

    # ---- add them up -------------------------------------------------------------------------
    if visual == "c11-addup":
        if focus in ("ask", "ans"):
            ans = focus == "ans"
            draw.rounded_rectangle((140 + 10, 250 + 12, 1180 + 10, 860 + 12), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((140, 250, 1180, 860), radius=30, fill=WALL, outline=WALL_EDGE, width=4)
            w1 = [(240, 420), (470, 420), (470, 650), (240, 650)]
            w2 = [(850, 420), (1080, 420), (1080, 650), (850, 650)]
            for win in (w1, w2):
                poly(draw, win, GLASS, K.DEV_DARK, w=8)
                draw.line((win[0][0] + 40, win[2][1] - 40, win[0][0] + 110, win[0][1] + 40), fill=(255, 255, 255),
                          width=10)
            draw.line((500, 330, 820, 330), fill=K.DEV_MID, width=5)
            flag = [(580, 334), (740, 334), (660, 490)]
            poly(draw, flag, coral, K.DEV_DARK, w=6)
            K.text_at(draw, "Aarav's classroom wall", 660, 760, font(38, bold=True), muted)
            if ans:
                n1 = lit(progress, 4, start=0.0, speed=4.0)
                n2 = lit(progress, 4, start=0.25, speed=4.0)
                n3 = lit(progress, 3, start=0.5, speed=4.0)
                side_marks(draw, w1, n1, K.ROAD, out=40, r=24, width=10)
                side_marks(draw, w2, n2, K.ROAD, out=40, r=24, width=10)
                side_marks(draw, flag, n3, K.GOLD, out=36, r=24, width=10)
                eq_card((1260, 280, 1770, 840), ["4 + 4 = 8", "8 + 3 = 11"], sage, big="11 sides!")
            else:
                K.shadow_card(draw, (1260, 280, 1770, 840), brand, radius=36, accent=coral)
                K.text_at(draw, "How many", 1515, 380, font(50, bold=True), ink)
                K.text_at(draw, "sides", 1515, 450, font(50, bold=True), ink)
                K.text_at(draw, "altogether?", 1515, 520, font(50, bold=True), coral)
                stopwatch(1515, 700, 70)
            return True
        ans = focus == "ans2"
        hx = shape_pts("hex", 400, 570, 190)
        tr = shape_pts("tri", 1030, 560, 190)
        poly(draw, hx, HEX, HONEY_DARK, w=6)
        poly(draw, tr, TRI, K.DEV_DARK, w=6)
        K.text_at(draw, "+", 720, 500, font(110, bold=True), muted)
        if ans:
            n1 = lit(progress, 6, start=0.0, speed=3.0)
            n2 = lit(progress, 3, start=0.4, speed=3.0)
            corner_marks(draw, hx, n1, K.BOTH_COLOR, out=48, r=26)
            corner_marks(draw, tr, n2, K.BOTH_COLOR, out=48, r=26)
            if n1 >= 6:
                K.text_at(draw, "6 corners", 400, 800, font(42, bold=True), HONEY_DARK)
            if n2 >= 3:
                K.text_at(draw, "3 corners", 1030, 800, font(42, bold=True), TRI)
            K.shadow_card(draw, (1300, 300, 1770, 800), brand, radius=36, accent=K.BOTH_COLOR)
            if progress > 0.6:
                K.text_at(draw, "6 + 3", 1535, 400, font(96, bold=True), ink)
            if progress > 0.72:
                K.text_at(draw, "= 9", 1535, 530, font(110, bold=True), K.BOTH_COLOR)
                K.text_at(draw, "corners", 1535, 680, font(48, bold=True), muted)
        else:
            K.text_at(draw, "hexagon", 400, 800, font(42, bold=True), HONEY_DARK)
            K.text_at(draw, "triangle", 1030, 800, font(42, bold=True), TRI)
            K.shadow_card(draw, (1300, 300, 1770, 800), brand, radius=36, accent=coral)
            K.text_at(draw, "How many", 1535, 390, font(50, bold=True), ink)
            K.text_at(draw, "corners?", 1535, 460, font(50, bold=True), coral)
            stopwatch(1535, 650, 70)
        return True

    # ---- checkpoint ----------------------------------------------------------------------------
    if visual == "c11-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Count the sides!", cx, 450 + lift, font(64, bold=True), ink)
            shape(draw, "hex", cx, 640 + lift, 70, HEX)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "How many sides does a hexagon have?", 695, 256, font(46, bold=True), coral)
        pts = shape_pts("hex", 560, 600, 190)
        if ans:
            poly(draw, pts, HEX, HONEY_DARK, w=6)
            side_marks(draw, pts, lit(progress, 6, start=0.0, speed=2.4), coral, out=46, r=26, width=10)
            K.text_at(draw, "6 sides", 1010, 500, font(60, bold=True), ink)
            K.text_at(draw, "6 corners", 1010, 590, font(52, bold=True), HONEY_DARK)
        else:
            dashed_poly(pts, K.DEV_MID, width=6)
            ctext(draw, "?", 560, 600, int(110 + 16 * pulse), coral)
            draw.line((1000, 560, 1180, 560), fill=(220, 210, 232), width=3)
            draw.line((1000, 660, 1180, 660), fill=(220, 210, 232), width=3)
        kid(draw, 1540, 520, 1.3, t)
        if ans:
            K.draw_heart(draw, 1700, 380 + bounce, 30, coral)
            bee(draw, 1540, 820, 0.6, t)
            star_spots([(1380, 330), (1730, 640)])
        else:
            question_marks([(1700, 330)], size=80)
            stopwatch(1540, 800, 44)
        return True

    # ---- recap -------------------------------------------------------------------------------
    if visual == "c11-recap":
        recap = [(("Count sides", "to name it"), coral, "count"), (("Square: all equal", "Rect: opposite"), K.ROAD, "sq"),
                 (("3, 5, 6, 8", "sides"), K.BOTH_COLOR, "names"), (("Circle: no sides", "no corners"), K.GOLD, "circ")]
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
                if kind == "count":
                    pts = shape_pts("tri", ix, iy, 110)
                    poly(draw, pts, TRI, shadow=False)
                    side_marks(draw, pts, 3, K.DEV_DEEP, out=36, r=22, width=8)
                elif kind == "sq":
                    sq = shape_pts("sq", ix - 90, iy, 70)
                    poly(draw, sq, SQ, shadow=False)
                    rc = [(ix + 10, iy - 50), (ix + 170, iy - 50), (ix + 170, iy + 50), (ix + 10, iy + 50)]
                    poly(draw, rc, RECT, shadow=False)
                elif kind == "names":
                    for k, (kd, c, num) in enumerate((("tri", TRI, "3"), ("pent", PENT, "5"), ("hex", HEX, "6"),
                                                      ("oct", OCT, "8"))):
                        sx_ = ix - 85 + (k % 2) * 170
                        sy_ = iy - 75 + (k // 2) * 150
                        shape(draw, kd, sx_, sy_, 52, c, shadow=False)
                        ctext(draw, num, sx_, sy_ + 4, 40, (255, 255, 255) if kd != "hex" else K.DEV_DEEP)
                else:
                    draw.ellipse((ix - 110, iy - 110, ix + 110, iy + 110), fill=K.GOLD)
                    ctext(draw, "0", ix, iy, 100, (255, 255, 255))
                f = font(36, bold=True)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, t)
            K.text_at(draw, "Chapter 1 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Shape detective", coral, size=36)
            float_shapes([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)], r=38)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        float_shapes([(cx - 620, 400), (cx + 620, 400), (cx - 560, 680), (cx + 560, 680)], r=38)
        return True

    return False
