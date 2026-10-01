"""C20 · Capstone: Math Puzzle Challenge — visuals."""
import math

import build as K

WHITE = (255, 255, 255)
PAPER = (255, 250, 238)
RULE = (220, 210, 232)
STONE = (214, 204, 188)
STONE_DARK = (176, 164, 146)
PENCIL = (255, 200, 60)
RED = (226, 62, 70)
RED_SOFT = (252, 228, 228)
BANANA = (250, 214, 70)
BANANA_DARK = (206, 160, 30)
BEAD_COLS = [(255, 106, 26), (13, 148, 136), (123, 97, 214), (255, 186, 60), (72, 118, 214)]
BUNTING = [(255, 106, 26), (255, 186, 60), (13, 148, 136), (123, 97, 214), (72, 118, 214)]
GOLD_DARK = (214, 150, 40)
NANI_PINK = (206, 110, 160)


def F(size: float):
    return K.load_font(max(26, int(size)), bold=True)


def tc(draw, text, x, cy, size, col):
    """Text centred on (x, cy)."""
    K.text_at(draw, text, x, cy - size * 0.62, F(size), col)


# ---- characters --------------------------------------------------------------------------

def ishaan(draw, cx, cy, s, t=0.0, medal=False):
    """Ishaan: yellow shirt, blue cap. cy = face centre."""
    K.draw_person(draw, cx, cy, s, "friend", t)
    y = cy + 6 * s * math.sin(t * math.pi * 4)
    r = 64 * s
    draw.chord((cx - r * 1.08, y - r * 1.3, cx + r * 1.08, y - r * 0.02), 180, 360, fill=K.ROAD)
    draw.rounded_rectangle((cx - r * 0.1, y - r * 0.74, cx + r * 1.5, y - r * 0.52), radius=r * 0.1, fill=K.BOT_DARK)
    draw.ellipse((cx - r * 0.14, y - r * 1.4, cx + r * 0.14, y - r * 1.14), fill=K.BOT_DARK)
    if medal:
        my = y + r * 1.9
        draw.line((cx - r * 0.5, y + r * 0.9, cx, my - r * 0.3), fill=K.CORAL, width=max(3, int(r * 0.14)))
        draw.line((cx + r * 0.5, y + r * 0.9, cx, my - r * 0.3), fill=K.CORAL, width=max(3, int(r * 0.14)))
        draw.ellipse((cx - r * 0.42, my - r * 0.42, cx + r * 0.42, my + r * 0.42), fill=K.GOLD, outline=GOLD_DARK,
                     width=max(2, int(r * 0.06)))
        K.draw_star(draw, cx, my, r * 0.26, WHITE)


# ---- props ---------------------------------------------------------------------------------

def pencil(draw, cx, cy, s, ang=-0.7):
    def S(v):
        return v * s
    ca, sa = math.cos(ang), math.sin(ang)

    def P(x, y):
        return (cx + x * ca - y * sa, cy + x * sa + y * ca)
    draw.polygon([P(-S(130), -S(16)), P(S(90), -S(16)), P(S(90), S(16)), P(-S(130), S(16))], fill=PENCIL)
    draw.polygon([P(-S(150), -S(16)), P(-S(130), -S(16)), P(-S(130), S(16)), P(-S(150), S(16))], fill=(240, 150, 170))
    draw.polygon([P(S(90), -S(16)), P(S(130), 0), P(S(90), S(16))], fill=(240, 214, 170))
    draw.polygon([P(S(116), -S(5)), P(S(130), 0), P(S(116), S(5))], fill=K.DEV_DARK)


def trophy(draw, cx, cy, s, label=None):
    def S(v):
        return v * s
    for sx in (-1, 1):
        draw.arc((cx + sx * S(64) - S(30), cy - S(70), cx + sx * S(64) + S(30), cy - S(10)),
                 *((90, 270) if sx < 0 else (270, 90)), fill=GOLD_DARK, width=max(3, int(S(12))))
    draw.pieslice((cx - S(66), cy - S(150), cx + S(66), cy + S(20)), 0, 180, fill=K.GOLD)
    draw.rectangle((cx - S(66), cy - S(84), cx + S(66), cy - S(62)), fill=K.GOLD)
    draw.rectangle((cx - S(70), cy - S(92), cx + S(70), cy - S(78)), fill=GOLD_DARK)
    draw.rectangle((cx - S(12), cy + S(16), cx + S(12), cy + S(48)), fill=GOLD_DARK)
    draw.rounded_rectangle((cx - S(52), cy + S(46), cx + S(52), cy + S(74)), radius=S(8), fill=K.DEV_DARK)
    if label:
        K.text_at(draw, label, cx, cy - S(70), F(S(40)), K.DEV_DARK)


def arch(draw, cx, base_y, s, cap_drop):
    def S(v):
        return v * s
    for side in (-1, 1):
        px = cx + side * S(170)
        for k in range(5):
            y = base_y - (k + 1) * S(56)
            draw.rounded_rectangle((px - S(56), y, px + S(56), y + S(52)), radius=S(6),
                                   fill=STONE if k % 2 else STONE_DARK)
    top = base_y - 5 * S(56)
    n = 7
    r0, r1 = S(114), S(226)

    def seg(k, dy=0.0):
        a0 = math.pi + k * math.pi / n
        a1 = a0 + math.pi / n
        return [(cx + math.cos(a0) * r1, top + math.sin(a0) * r1 + dy), (cx + math.cos(a1) * r1, top + math.sin(a1) * r1 + dy),
                (cx + math.cos(a1) * r0, top + math.sin(a1) * r0 + dy), (cx + math.cos(a0) * r0, top + math.sin(a0) * r0 + dy)]
    for k in range(n):
        if k == n // 2:
            continue
        draw.polygon(seg(k), fill=STONE if k % 2 else STONE_DARK, outline=(150, 138, 120), width=max(2, int(S(3))))
    pts = seg(n // 2, -cap_drop)
    draw.polygon(pts, fill=K.GOLD, outline=GOLD_DARK, width=max(2, int(S(4))))
    draw.rectangle((cx - S(280), base_y, cx + S(280), base_y + S(20)), fill=STONE_DARK)
    return pts


def puzzle_piece(draw, cx, cy, size, col):
    q = size / 2
    k = size * 0.18
    draw.rounded_rectangle((cx - q + 6, cy - q + 8, cx + q + 6, cy + q + 8), radius=size * 0.1, fill=K.SHADOW)
    draw.rounded_rectangle((cx - q, cy - q, cx + q, cy + q), radius=size * 0.1, fill=col)
    draw.ellipse((cx - k, cy - q - k * 1.4, cx + k, cy - q + k * 0.6), fill=col)
    draw.ellipse((cx + q - k * 0.6, cy - k, cx + q + k * 1.4, cy + k), fill=col)
    draw.ellipse((cx - k, cy + q - k * 0.9, cx + k, cy + q + k * 1.1), fill=K.hex_rgb("#FFF8EF"))


def flag(draw, x, by, s, col, label):
    def S(v):
        return v * s
    draw.line((x, by, x, by - S(150)), fill=K.DEV_DARK, width=max(3, int(S(8))))
    draw.polygon([(x, by - S(150)), (x + S(90), by - S(122)), (x, by - S(94))], fill=col)
    draw.ellipse((x - S(30), by - S(8), x + S(30), by + S(10)), fill=K.SHADOW)
    K.text_at(draw, label, x + S(34), by - S(146), F(S(34)), WHITE)


def bunting(draw, x0, x1, y, n, t=0.0):
    pts = []
    for i in range(n + 1):
        f = i / n
        pts.append((x0 + (x1 - x0) * f, y + 40 * 4 * f * (1 - f)))
    draw.line(pts, fill=K.DEV_MID, width=3)
    for i in range(n):
        ax, ay = pts[i]
        bx, by = pts[i + 1]
        mx, my = (ax + bx) / 2, (ay + by) / 2
        sw = 4 * math.sin(t * 8 + i)
        draw.polygon([(ax + 6, ay + 2), (bx - 6, by + 2), (mx + sw, my + 56)], fill=BUNTING[i % 5])


def fire_truck(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(110) + S(6), cy - S(40) + S(8), cx + S(110) + S(6), cy + S(40) + S(8)), radius=S(10),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(40), cx + S(60), cy + S(40)), radius=S(10), fill=RED)
    draw.rounded_rectangle((cx + S(40), cy - S(70), cx + S(110), cy + S(40)), radius=S(12), fill=RED)
    draw.rounded_rectangle((cx + S(56), cy - S(58), cx + S(98), cy - S(22)), radius=S(6), fill=K.DEV_SCREEN)
    draw.line((cx - S(100), cy - S(56), cx + S(30), cy - S(56)), fill=K.STEEL_DARK, width=max(3, int(S(8))))
    for k in range(5):
        lx = cx - S(90) + k * S(28)
        draw.line((lx, cy - S(62), lx, cy - S(50)), fill=K.STEEL_DARK, width=max(2, int(S(5))))
    draw.ellipse((cx + S(66), cy - S(86), cx + S(86), cy - S(68)), fill=(90, 160, 240))
    for wx in (cx - S(70), cx + S(70)):
        draw.ellipse((wx - S(24), cy + S(20), wx + S(24), cy + S(68)), fill=K.DEV_DEEP)
        draw.ellipse((wx - S(9), cy + S(35), wx + S(9), cy + S(53)), fill=K.STEEL)


def banana(draw, cx, cy, s):
    def S(v):
        return v * s
    outer, inner = [], []
    for i in range(21):
        a = math.radians(200 + i * 7)
        outer.append((cx + math.cos(a) * S(110), cy + S(70) + math.sin(a) * S(110) * -1 + S(-80)))
        inner.append((cx + math.cos(a) * S(80), cy + S(70) + math.sin(a) * S(70) * -1 + S(-70)))
    poly = outer + inner[::-1]
    draw.polygon([(x + S(6), y + S(8)) for x, y in poly], fill=K.SHADOW)
    draw.polygon(poly, fill=BANANA, outline=BANANA_DARK)
    ex, ey = outer[0]
    draw.ellipse((ex - S(8), ey - S(8), ex + S(8), ey + S(8)), fill=(110, 80, 40))
    tx, ty = outer[-1]
    draw.line((tx, ty, tx + S(16), ty - S(14)), fill=(110, 80, 40), width=max(3, int(S(8))))


def apple(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.ellipse((cx - S(58) + S(6), cy - S(52) + S(8), cx + S(58) + S(6), cy + S(56) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(58), cy - S(52), cx + S(4), cy + S(56)), fill=RED)
    draw.ellipse((cx - S(4), cy - S(52), cx + S(58), cy + S(56)), fill=RED)
    draw.ellipse((cx - S(34), cy - S(34), cx - S(16), cy - S(12)), fill=(255, 170, 170))
    draw.line((cx, cy - S(48), cx + S(6), cy - S(76)), fill=(110, 80, 40), width=max(3, int(S(7))))
    draw.polygon([(cx + S(6), cy - S(66)), (cx + S(40), cy - S(84)), (cx + S(18), cy - S(56))], fill=K.LEAF)


def coin(draw, cx, cy, r, face="H", squash=1.0):
    rx = max(4, r * abs(squash))
    draw.ellipse((cx - rx + 8, cy - r + 10, cx + rx + 8, cy + r + 10), fill=K.SHADOW)
    draw.ellipse((cx - rx, cy - r, cx + rx, cy + r), fill=K.GOLD, outline=GOLD_DARK, width=max(3, int(r * 0.07)))
    if abs(squash) > 0.45:
        draw.ellipse((cx - rx * 0.78, cy - r * 0.78, cx + rx * 0.78, cy + r * 0.78), outline=GOLD_DARK,
                     width=max(2, int(r * 0.04)))
        tc(draw, face, cx, cy, r * 0.9, GOLD_DARK)


def die(draw, cx, cy, size, pips=5):
    q = size / 2
    draw.rounded_rectangle((cx - q + 6, cy - q + 8, cx + q + 6, cy + q + 8), radius=size * 0.18, fill=K.SHADOW)
    draw.rounded_rectangle((cx - q, cy - q, cx + q, cy + q), radius=size * 0.18, fill=WHITE, outline=K.DEV_DARK,
                           width=3)
    spots = {1: [(0, 0)], 5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (1, -1), (-1, 0), (1, 0),
                                                                              (-1, 1), (1, 1)]}[pips]
    for dx, dy in spots:
        px, py = cx + dx * size * 0.26, cy + dy * size * 0.26
        draw.ellipse((px - size * 0.08, py - size * 0.08, px + size * 0.08, py + size * 0.08), fill=K.DEV_DEEP)


def sun(draw, x, y, r, t=0.0):
    for k in range(10):
        a = k * math.tau / 10 + t
        draw.line((x + math.cos(a) * r * 1.25, y + math.sin(a) * r * 1.25, x + math.cos(a) * r * 1.6,
                   y + math.sin(a) * r * 1.6), fill=K.GOLD, width=max(3, int(r * 0.14)))
    draw.ellipse((x - r, y - r, x + r, y + r), fill=K.GOLD)


def jar(draw, cx, by, s, n_beads):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(90) + S(8), by - S(220) + S(10), cx + S(90) + S(8), by + S(10)), radius=S(30),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(90), by - S(220), cx + S(90), by), radius=S(30), fill=(232, 244, 250),
                           outline=K.DEV_MID, width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(70), by - S(250), cx + S(70), by - S(214)), radius=S(10), fill=K.CORAL)
    for k in range(n_beads):
        r_, c_ = divmod(k, 5)
        bx = cx - S(56) + c_ * S(28)
        byy = by - S(26) - r_ * S(28)
        draw.ellipse((bx - S(12), byy - S(12), bx + S(12), byy + S(12)), fill=BEAD_COLS[k % 5])


def phone(draw, cx, cy, s):
    W, H = 110 * s, 200 * s
    draw.rounded_rectangle((cx - W + 8 * s, cy - H + 10 * s, cx + W + 8 * s, cy + H + 10 * s), radius=30 * s,
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=30 * s, fill=K.DEV_DARK)
    box = (cx - W + 12 * s, cy - H + 34 * s, cx + W - 12 * s, cy + H - 34 * s)
    draw.rectangle(box, fill=WHITE)
    draw.rounded_rectangle((cx - 26 * s, cy - H + 14 * s, cx + 26 * s, cy - H + 22 * s), radius=4 * s, fill=K.DEV_MID)
    return box


def notebook(draw, box, title=None, title_col=K.CORAL):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=PAPER)
    draw.line((x0 + 80, y0 + 10, x0 + 80, y1 - 10), fill=(240, 170, 170), width=3)
    if title:
        K.text_at(draw, title, (x0 + x1) / 2, y0 + 28, F(42), title_col)


SEQ1 = [2, 4, 6, 8, 10]
SEQ2 = [1, 3, 6, 10, 15]
UNITS = [("numbers", "Numbers", "Computers Love"), ("logic", "Logic &", "Reasoning"),
         ("grid", "Shapes, Grids", "& Coordinates"), ("puzzle", "Problem", "Solver")]


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
    d = draw
    palette = [coral, sage, K.BOTH_COLOR, K.GOLD, K.ROAD]

    def sparkle(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(d, sx, sy + 8 * math.sin(progress * 9 + i), 20 + 6 * pulse, palette[i % 4],
                        rot=progress * 3 + i)

    def qmarks(pts, size=80):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(d, "?", qx, qy, F(size + 20 * (pulse if k % 2 else 1 - pulse)), K.GOLD)

    def confetti(n=26, y0=230, y1=860, avoid=None):
        for i in range(n):
            x = (i * 137.5) % 1720 + 100
            y = y0 + ((i * 89 + progress * 900) % (y1 - y0))
            if avoid and avoid[0] < x < avoid[2] and avoid[1] < y < avoid[3]:
                continue
            col = palette[i % 4]
            a = progress * 6 + i
            dx, dy = 12 * math.cos(a), 6 * math.sin(a)
            d.polygon([(x - dx, y - dy - 6), (x + dx, y + dy - 6), (x + dx, y + dy + 6), (x - dx, y - dy + 6)], fill=col)

    def station(n, label, col):
        K.pill(d, 0, 226, f"STATION {n} · {label}", col, size=32, left=140)

    def tracker(got, x0=1330, y=256):
        draw.rounded_rectangle((x0 - 30, y - 34, x0 + 4 * 84 + 30, y + 34), radius=34, fill=panel, outline=line, width=3)
        for i in range(5):
            x = x0 + i * 84
            if i < got:
                K.draw_star(d, x, y, 26, K.GOLD, rot=0)
            else:
                K.draw_star(d, x, y, 26, line, rot=0)

    def ntile(x, y, label, col, size=150, state="normal"):
        q = size / 2
        if state == "missing":
            d.rounded_rectangle((x - q, y - q, x + q, y + q), radius=28, fill=coral_soft, outline=coral, width=5)
            tc(d, "?", x, y, size * 0.6 + 12 * pulse, coral)
            return
        d.rounded_rectangle((x - q + 8, y - q + 10, x + q + 8, y + q + 10), radius=28, fill=K.SHADOW)
        out = sage if state == "win" else col
        d.rounded_rectangle((x - q, y - q, x + q, y + q), radius=28, fill=sage_soft if state == "win" else panel,
                            outline=out, width=6)
        tc(d, label, x, y, size * 0.48, sage if state == "win" else col)

    def hop(x0, x1, y, label, col, a=1.0):
        if a <= 0:
            return
        hh = 70
        d.arc((x0, y - hh, x1, y + hh), 200, 200 + 140 * a, fill=col, width=7)
        if a >= 1:
            ex = x1 - (x1 - x0) / 2 * (1 - math.cos(math.radians(20)))
            ey = y - hh * math.sin(math.radians(20))
            d.polygon([(ex + 4, ey + 4), (ex - 22, ey - 10), (ex - 4, ey - 26)], fill=col)
            K.pill(d, (x0 + x1) / 2, y - hh - 54, label, col, size=30)

    def dots_tri(x, y_top, n, col, sp=26, r=10):
        for row in range(n):
            for k in range(row + 1):
                px = x - row * sp / 2 + k * sp
                py = y_top + row * sp
                d.ellipse((px - r, py - r, px + r, py + r), fill=col)

    def dots_pairs(x, y_top, n, col, sp=30, r=11):
        cols = n // 2
        for c in range(cols):
            for rr in range(2):
                px = x - (cols - 1) * sp / 2 + c * sp
                py = y_top + rr * sp
                d.ellipse((px - r, py - r, px + r, py + r), fill=col)

    # ---- opening ------------------------------------------------------------------------
    if visual == "c20-welcome":
        if focus == "hello":
            K.draw_mascot(d, int(cx - 280), 450, 110, sage, panel, bounce)
            ishaan(d, cx + 280, 430, 1.3, t)
            K.text_at(d, "Welcome back, champ!", cx, 730, F(60), ink)
            sparkle([(cx - 600, 320), (cx + 600, 320), (cx - 680, 540), (cx + 680, 540)])
            return True
        if focus == "bridge":
            K.shadow_card(d, (220, 240 + lift, w - 220, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(d, "LAST TIME · BREAKING BIG PROBLEMS", cx, 296 + lift, F(34), sage)
            m = K.ease_in_out(K.clamp01((progress - 0.1) * 2.2))
            bx, by = 480, 600 + lift
            d.rounded_rectangle((bx - 150 + 8, by - 150 + 10, bx + 150 + 8, by + 150 + 10), radius=30, fill=K.SHADOW)
            d.rounded_rectangle((bx - 150, by - 150, bx + 150, by + 150), radius=30, fill=K.STEEL_DARK)
            tc(d, "BIG", bx, by - 20, 70, WHITE)
            tc(d, "JOB", bx, by + 60, 52, WHITE)
            K.draw_arrow(d, 680, by, 680 + 200 * m, by, coral, width=14, head=40)
            jobs = [("Toys", coral), ("Books", K.BOTH_COLOR), ("Bed", sage)]
            for i, (lab, col) in enumerate(jobs):
                a = K.stagger(progress, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                y = 400 + i * 140 + lift + int((1 - a) * 20)
                d.rounded_rectangle((960, y, 1640, y + 112), radius=30, fill=panel, outline=col, width=5)
                d.ellipse((984, y + 18, 1060, y + 94), fill=col)
                tc(d, str(i + 1), 1022, y + 56, 44, WHITE)
                d.text((1090, y + 30), lab, fill=ink, font=F(46))
                K.draw_check(d, 1580, y + 56, 26, sage)
            return True
        if focus == "chapter":
            K.shadow_card(d, (240, 240 + lift, w - 240, 560 + lift), brand, radius=40, accent=coral)
            K.text_at(d, "CHAPTER 5 OF 5 · THE FINAL CHAPTER", cx, 296 + lift, F(32), coral)
            K.text_at(d, "Capstone:", cx, 346 + lift, F(80), coral)
            K.text_at(d, "Math Puzzle Challenge", cx, 446 + lift, F(76), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 230
                puzzle_piece(d, x, 720 + int((1 - a) * 30), 120, palette[i])
            return True
        if focus == "word":
            drop = 150 * (1 - K.ease_out_cubic(K.clamp01((progress - 0.05) * 1.8)))
            pts = arch(d, 520, 840, 0.85, drop)
            if drop < 4:
                tx = sum(p[0] for p in pts) / 4
                ty = sum(p[1] for p in pts) / 4
                for k, (ox, oy) in enumerate(((0, -100), (-150, -70), (150, -70))):
                    K.draw_star(d, tx + ox, ty + oy + 6 * math.sin(t * 8 + k), 18 + 6 * pulse, palette[k], rot=t + k)
            K.text_at(d, "Capstone", 1340, 250 + lift, F(96), coral)
            K.text_at(d, "= the final challenge", 1340, 370 + lift, F(50), ink)
            chips = ["Patterns", "Logic", "Grids", "Chance", "Problem solving"]
            for i, lab in enumerate(chips):
                a = K.stagger(progress, i + 2, step=0.08, speed=4)
                if a <= 0:
                    continue
                r_, c_ = divmod(i, 2)
                if i == 4:
                    x = 1340
                else:
                    x = 1170 + c_ * 340
                K.pill(d, x, 480 + r_ * 110 + int((1 - a) * 20), lab, palette[i], size=38)
            return True
        # promise
        notebook(d, (560, 270, 1260, 840), "Puzzle time!")
        for k in range(4):
            ly = 400 + k * 100
            K.draw_dashed(d, 660, ly + 40, 1200, ly + 40, RULE, width=4)
        n_lines = int(K.clamp01(progress * 1.4) * 4)
        writes = ["2, 4, 6, 8, ...", "(across, up)", "15 - 6 = ?", "likely?"]
        for k in range(n_lines):
            d.text((680, 400 + k * 100 - 14), writes[k], fill=K.ROAD, font=F(42))
        pencil(d, 1250, 760, 1.0)
        ishaan(d, 300, 470, 1.1, t)
        puzzle_piece(d, 1560, 420, 140, coral)
        puzzle_piece(d, 1600, 640, 110, sage)
        sparkle([(1440, 300), (1760, 520)])
        return True

    # ---- Ishaan at the Maths Mela ------------------------------------------------------------
    if visual == "c20-hook":
        if focus == "meet":
            bunting(d, 120, 1800, 236, 14, t)
            d.ellipse((560 - 270, 580 - 270, 560 + 270, 580 + 270), fill=coral_soft)
            ishaan(d, 560, 500, 1.6, t)
            K.text_at(d, "Meet", 1300, 340 + lift, F(60), muted)
            K.text_at(d, "Ishaan!", 1300, 410 + lift, F(130), coral)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                K.pill(d, 1300, 620 + int((1 - a) * 20), "Maths Mela at school!", sage, size=40)
            for i in range(3):
                b = K.stagger(progress, i + 3, step=0.1, speed=4)
                if b > 0:
                    puzzle_piece(d, 1120 + i * 180, 790 - int((1 - b) * 20), 70, palette[i])
            return True
        if focus == "trail":
            p0, p1, p2 = (200, 800), (900, 240), (1560, 760)
            K.draw_curve(d, p0, p1, p2, (214, 204, 190), width=56)
            K.draw_curve(d, p0, p1, p2, WHITE, width=6, dashed=True, phase=t * 200)
            labels = ["Patterns", "Sorting", "Grids", "Chance", "Backwards"]
            for i in range(5):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a <= 0:
                    continue
                x, y = K.qbez(p0, p1, p2, 0.08 + i * 0.21)
                flag(d, x, y, 0.8 * a + 0.2, palette[i], str(i + 1))
                below = i in (1, 2, 3)
                K.text_at(d, labels[i], x, y + 26 if below else y + 26, F(30), ink)
            b = K.stagger(progress, 6, step=0.1, speed=4)
            if b > 0:
                bx, by = 1700, 560
                d.ellipse((bx - 110, by - 110, bx + 110, by + 110), fill=gold_soft)
                d.ellipse((bx - 80, by - 80, bx + 80, by + 80), fill=K.GOLD, outline=GOLD_DARK, width=6)
                K.draw_star(d, bx, by, 50 * b, WHITE, rot=t)
                K.text_at(d, "Golden badge", bx, by + 120, F(32), GOLD_DARK)
            tracker(0, x0=1180, y=256)
            return True
        if focus == "nervous":
            d.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=lav_soft)
            ishaan(d, 480, 500, 1.35, 0)
            K.draw_bubble(d, (760, 250, 1460, 380), brand, "What if I get stuck?", tail="left", size=46)
            qmarks([(220, 280), (720, 470)], 80)
            K.shadow_card(d, (1040, 450, 1560, 800), brand, radius=30, outline=K.BOTH_COLOR, outline_w=5)
            K.text_at(d, "PUZZLE CARD", 1300, 476, F(32), K.BOTH_COLOR)
            tc(d, "?", 1300, 640, 150 + 16 * pulse, K.GOLD)
            K.draw_stopwatch(d, 1680, 760, 46, progress, brand)
            return True
        # plan
        d.ellipse((440 - 240, 560 - 240, 440 + 240, 560 + 240), fill=sage_soft)
        K.draw_person(d, 440, 500, 1.3, "teacher", t)
        K.draw_bubble(d, (680, 250, 1380, 420), brand, "Don't just guess. Pick a strategy!", tail="left", size=44)
        ishaan(d, 1560, 560, 1.15, t)
        bx, by = 1560, 330
        for k in range(8):
            a = k * math.pi / 4 + t
            d.line((bx + math.cos(a) * 62, by + math.sin(a) * 62, bx + math.cos(a) * 84, by + math.sin(a) * 84),
                   fill=K.GOLD, width=7)
        d.ellipse((bx - 46, by - 50, bx + 46, by + 40), fill=K.GOLD)
        d.rounded_rectangle((bx - 22, by + 36, bx + 22, by + 60), radius=6, fill=K.STEEL_DARK)
        K.pill(d, 1030, 560, "A plan beats a guess!", coral, size=36)
        return True

    # ---- strategies -------------------------------------------------------------------------
    def tool_icon(kind, x, y):
        if kind == "rule":
            for k, n in enumerate(("2", "4", "6")):
                ntile(x - 100 + k * 100, y + 20, n, K.ROAD, size=74)
            for k in range(2):
                d.arc((x - 100 + k * 100, y - 40, x + k * 100, y + 10), 200, 340, fill=coral, width=5)
            K.text_at(d, "+2", x - 50, y - 92, F(30), coral)
            K.text_at(d, "+2", x + 50, y - 92, F(30), coral)
        elif kind == "draw":
            d.rounded_rectangle((x - 110, y - 70, x + 70, y + 80), radius=12, fill=PAPER, outline=K.DEV_MID, width=3)
            for k in range(3):
                d.ellipse((x - 90 + k * 50, y - 10, x - 60 + k * 50, y + 20), outline=K.ROAD, width=4)
            K.draw_arrow(d, x - 90, y + 50, x + 40, y + 50, coral, width=5, head=14)
            pencil(d, x + 60, y + 30, 0.55)
        elif kind == "break":
            d.rounded_rectangle((x - 120, y - 50, x - 30, y + 40), radius=12, fill=K.STEEL_DARK)
            K.draw_arrow(d, x - 20, y - 5, x + 20, y - 5, muted, width=6, head=16)
            for k in range(4):
                r_, c_ = divmod(k, 2)
                bx, by_ = x + 54 + c_ * 52, y - 30 + r_ * 52
                d.rounded_rectangle((bx - 22, by_ - 22, bx + 22, by_ + 22), radius=8, fill=palette[k])
        else:
            d.arc((x - 80, y - 70, x + 80, y + 70), 200, 520, fill=sage, width=12)
            d.polygon([(x - 92, y - 10), (x - 52, y - 10), (x - 76, y - 50)], fill=sage)
            K.text_at(d, "undo", x, y - 20, F(32), sage)

    if visual == "c20-strategy":
        if focus == "name":
            d.ellipse((480 - 260, 560 - 260, 480 + 260, 560 + 260), fill=gold_soft)
            ishaan(d, 480, 480, 1.3, t)
            d.rounded_rectangle((560, 640, 760, 820), radius=14, fill=PAPER, outline=K.DEV_MID, width=3)
            for k in range(3):
                K.draw_check(d, 596, 680 + k * 48, 14, sage)
                d.rounded_rectangle((618, 674 + k * 48, 736, 686 + k * 48), radius=6, fill=line)
            K.shadow_card(d, (880, 300 + lift, 1780, 780 + lift), brand, radius=40, accent=coral)
            K.text_at(d, "A STRATEGY is…", 1330, 370 + lift, F(46), muted)
            parts = [("a plan", coral), ("for solving", ink), ("a problem", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                K.text_at(d, txt, 1330, 460 + i * 96 + lift + int((1 - a) * 20), F(72), col)
            return True
        if focus == "tools":
            specs = [("rule", "Find the rule", coral), ("draw", "Draw it", K.ROAD), ("break", "Break it into parts", sage),
                     ("back", "Work backwards", K.BOTH_COLOR)]
            for i, (kind, lab, col) in enumerate(specs):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x0 = 140 + i * 420
                y0 = 300 + int((1 - a) * 40)
                K.shadow_card(d, (x0, y0, x0 + 380, y0 + 500), brand, radius=30, outline=col, outline_w=5)
                tool_icon(kind, x0 + 190, y0 + 200)
                font = F(38)
                lines = K.wrap_text(lab, font, 330)
                for j, ln in enumerate(lines):
                    K.text_at(d, ln, x0 + 190, y0 + 360 + j * 46, font, ink)
            K.text_at(d, "Your strategy toolbox", cx, 222, F(46), ink)
            return True
        # working
        notebook(d, (140, 260, 1060, 840), "Show your working")
        rows = [("Priya: ? + 6 = 15", ink), ("Undo + 6:  15 - 6 = 9", K.ROAD), ("Check:  9 + 6 = 15", sage)]
        for i, (txt, col) in enumerate(rows):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            y = 400 + i * 130 + int((1 - a) * 14)
            d.text((130 + 80, y), f"{i + 1}.", fill=muted, font=F(44))
            d.text((130 + 150, y), txt, fill=col, font=F(48))
            if i == 2:
                K.draw_check(d, 1000, y + 30, 28, sage)
        K.draw_person(d, 1440, 470, 1.15, "kid", t)
        K.draw_magnifier(d, 1600, 640, 0.75, coral)
        K.pill(d, 1440, 790, "Easy to follow!", sage, size=36)
        return True

    # ---- station 1: patterns -------------------------------------------------------------
    if visual == "c20-pattern":
        second = focus in ("ask2", "ans2")
        ans = focus in ("ans1", "ans2")
        seq = SEQ2 if second else SEQ1
        station(1, "PATTERNS", coral)
        tracker(1 if (second or ans) else 0)
        xs = [cx + (i - 2) * 250 for i in range(5)]
        ty = 520
        for i, n in enumerate(seq):
            last = i == 4
            if last and not ans:
                ntile(xs[i], ty, "", coral, state="missing")
                continue
            ntile(xs[i], ty, str(n), K.ROAD if not last else sage, state="win" if last else "normal")
            if second:
                dots_tri(xs[i], 640, i + 1, K.BOTH_COLOR if not last else sage, sp=26, r=10)
            else:
                dots_pairs(xs[i], 650, n, K.BOTH_COLOR if not last else sage)
        if ans:
            for i in range(4):
                a = K.clamp01((progress - i * 0.14) * 4)
                hop(xs[i] + 10, xs[i + 1] - 10, ty - 80, f"+{seq[i + 1] - seq[i]}", sage if i == 3 else coral, a)
        if not ans:
            K.draw_stopwatch(d, 1760, 800, 40, progress, brand)
        elif second and progress > 0.75:
            K.pill(d, cx, 820, "Jumps grow by 1 each time!", sage, size=32)
        elif not second:
            K.pill(d, cx, 820, "Rule: add 2 each time", sage, size=32)
        return True

    # ---- station 2: sorting & Venn -----------------------------------------------------------
    if visual == "c20-sort":
        if focus in ("ask", "ans"):
            station(2, "SORTING", K.BOTH_COLOR)
            tracker(1 if focus == "ask" else 2)
            vals = [45, 12, 30]
            order = sorted(range(3), key=lambda k: vals[k])
            m = K.ease_in_out(K.clamp01((progress - 0.05) * 2.0)) if focus == "ans" else 0.0
            base = 820
            for i, v in enumerate(vals):
                rank = order.index(i)
                x = K.lerp(cx + (i - 1) * 360, cx + (rank - 1) * 360, m)
                arc = -50 * math.sin(math.pi * m) if rank != i else 0
                hgt = v * 7
                col = palette[[1, 0, 2][i]]
                d.rounded_rectangle((x - 70 + 8, base - hgt + 10 + arc, x + 70 + 8, base + arc), radius=16, fill=K.SHADOW)
                d.rounded_rectangle((x - 70, base - hgt + arc, x + 70, base + arc), radius=16, fill=col)
                for k in range(1, int(hgt / 35)):
                    yy = base - k * 35 + arc
                    d.line((x - 60, yy, x + 60, yy), fill=WHITE, width=2)
                ntile(x, base - hgt - 62 + arc, str(v), col, size=104)
            if focus == "ans" and m >= 1:
                K.draw_arrow(d, cx - 520, 850, cx + 520, 850, sage, width=8, head=24)
                K.text_at(d, "smallest", cx - 610, 830, F(34), muted)
                K.text_at(d, "biggest", cx + 610, 830, F(34), muted)
            else:
                K.draw_stopwatch(d, 1760, 790, 40, progress, brand)
            return True
        # Venn
        lc, rc, r = (760, 590), (1160, 590), 250
        d.ellipse((lc[0] - r, lc[1] - r, lc[0] + r, lc[1] + r), fill=RED_SOFT)
        d.ellipse((rc[0] - r, rc[1] - r, rc[0] + r, rc[1] + r), fill=sage_soft)
        lens = []
        for i in range(41):
            a = math.radians(-60 + i * 3)
            lens.append((lc[0] + math.cos(a) * r, lc[1] + math.sin(a) * r))
        for i in range(41):
            a = math.radians(120 + i * 3)
            lens.append((rc[0] + math.cos(a) * r, rc[1] + math.sin(a) * r))
        d.polygon(lens, fill=gold_soft)
        d.ellipse((lc[0] - r, lc[1] - r, lc[0] + r, lc[1] + r), outline=RED, width=6)
        d.ellipse((rc[0] - r, rc[1] - r, rc[0] + r, rc[1] + r), outline=sage, width=6)
        K.pill(d, lc[0] - 80, 262, "Red things", RED, size=34)
        K.pill(d, rc[0] + 80, 262, "Fruits", sage, size=34)
        a1 = K.stagger(progress, 1, step=0.15, speed=4) if focus == "venn" else 1.0
        a2 = K.stagger(progress, 3, step=0.15, speed=4) if focus == "venn" else 1.0
        if a1 > 0:
            fire_truck(d, 630, 600 + int((1 - a1) * 30), 0.95)
        if a2 > 0:
            banana(d, 1290, 620 + int((1 - a2) * 30), 0.9)
        if focus == "vennq":
            apple(d, 1640, 600, 1.1)
            qmarks([(1640, 400)], 80)
            K.draw_stopwatch(d, 1640, 800, 40, progress, brand)
        elif focus == "venna":
            m = K.ease_in_out(K.clamp01(progress * 2.4))
            ax = K.lerp(1640, 960, m)
            ay = K.lerp(600, 600, m) - 80 * math.sin(math.pi * m)
            apple(d, ax, ay, 1.0)
            if m >= 1:
                K.draw_check(d, 1030, 520, 24, sage)
                K.pill(d, 960, 760, "Both!", K.GOLD, size=32, fg=ink)
                K.pill(d, 1620, 520, "Red AND a fruit", K.BOTH_COLOR, size=32)
        return True

    # ---- station 3: grids ---------------------------------------------------------------------
    if visual == "c20-grid":
        ox, oy, cs = 300, 790, 100

        def gp(gx, gy):
            return ox + gx * cs, oy - gy * cs

        def grid_base():
            d.rounded_rectangle((ox - 24, oy - 5 * cs - 24, ox + 5 * cs + 24, oy + 24), radius=20, fill=panel,
                                outline=line, width=3)
            for k in range(6):
                d.line((ox + k * cs, oy, ox + k * cs, oy - 5 * cs), fill=(214, 220, 232), width=3)
                d.line((ox, oy - k * cs, ox + 5 * cs, oy - k * cs), fill=(214, 220, 232), width=3)
                K.text_at(d, str(k), ox + k * cs, oy + 30, F(30), coral)
                K.text_at(d, str(k), ox - 58, oy - k * cs - 18, F(30), sage)
            d.line((ox, oy, ox + 5 * cs, oy), fill=coral, width=5)
            d.line((ox, oy, ox, oy - 5 * cs), fill=sage, width=5)

        def marker(gx, gy, col, label=None, r=22):
            x, y = gp(gx, gy)
            d.ellipse((x - r, y - r, x + r, y + r), fill=col, outline=WHITE, width=4)
            if label:
                K.pill(d, x + 34, y - 74, label, col, size=28)

        def path(pts, col, upto):
            segs = len(pts) - 1
            for i in range(segs):
                f = K.clamp01(upto * segs - i)
                if f <= 0:
                    break
                x0, y0 = gp(*pts[i])
                x1, y1 = gp(*pts[i + 1])
                K.draw_arrow(d, x0, y0, K.lerp(x0, x1, f), K.lerp(y0, y1, f), col, width=10, head=26)

        grid_base()
        if focus == "intro":
            station(3, "GRIDS", sage)
            tracker(2)
            K.shadow_card(d, (960, 330, 1780, 800), brand, radius=36, outline=line)
            K.text_at(d, "Grid address", 1370, 360, F(44), muted)
            K.text_at(d, "(across, up)", 1370, 430, F(84), ink)
            a = K.stagger(progress, 1, step=0.15, speed=4)
            b = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                K.pill(d, 1370, 580 + int((1 - a) * 14), "1st number → across", coral, size=36)
            if b > 0:
                K.pill(d, 1370, 680 + int((1 - b) * 14), "2nd number → up", sage, size=36)
            m = K.clamp01(progress * 2)
            K.draw_arrow(d, ox + 20, oy - 40, ox + 20 + 380 * m, oy - 40, coral, width=10, head=28)
            K.draw_arrow(d, ox + 40, oy - 20, ox + 40, oy - 20 - 380 * m, sage, width=10, head=28)
            return True
        if focus == "point":
            path([(0, 0), (3, 0)], coral, K.clamp01(progress * 2.2))
            if progress > 0.45:
                path([(3, 0), (3, 1)], sage, K.clamp01((progress - 0.45) * 3))
            if progress > 0.7:
                marker(3, 1, K.BOTH_COLOR, "(3, 1)")
            K.shadow_card(d, (960, 330, 1780, 800), brand, radius=36, outline=line)
            K.text_at(d, "(3, 1)", 1370, 370, F(96), K.BOTH_COLOR)
            K.pill(d, 1370, 540, "3 across", coral, size=44)
            K.pill(d, 1370, 660, "1 up", sage, size=44)
            return True
        steps = [(1, 1), (3, 1), (3, 4), (4, 4)]
        if focus == "ask":
            marker(1, 1, coral)
            K.shadow_card(d, (960, 290, 1780, 820), brand, radius=36, outline=line)
            rows = [("Start at (1, 1)", ink), ("2 right  →", coral), ("3 up  ↑", sage), ("1 right  →", coral)]
            for i, (txt, col) in enumerate(rows):
                d.text((1020, 330 + i * 100), txt, fill=col, font=F(52))
            K.text_at(d, "Where do you land?", 1370, 740, F(44), K.BOTH_COLOR)
            K.draw_stopwatch(d, 1700, 360, 36, progress, brand)
            ix, iy = gp(1, 1)
            K.draw_face(d, ix, iy - 70, 30, "kid", 0.6)
            return True
        # ans
        m = K.clamp01(progress * 1.4)
        path(steps, K.BOTH_COLOR, m)
        marker(1, 1, coral)
        segs = 3
        seg = min(segs - 1, int(m * segs))
        f = m * segs - seg
        p0, p1 = steps[seg], steps[min(segs, seg + 1)]
        hx, hy = gp(K.lerp(p0[0], p1[0], min(1, f)), K.lerp(p0[1], p1[1], min(1, f)))
        if m >= 1:
            marker(4, 4, sage)
            hx, hy = gp(4, 4)
        K.draw_face(d, hx, hy - 60, 30, "kid", 0.6)
        K.shadow_card(d, (960, 290, 1780, 820), brand, radius=36, outline=line)
        K.text_at(d, "Show your working", 1370, 316, F(40), muted)
        rows = [("Across:", "1 + 2 + 1 = 4", coral), ("Up:", "1 + 3 = 4", sage)]
        for i, (k_, v, col) in enumerate(rows):
            a = K.stagger(progress, i + 3, step=0.12, speed=4)
            if a <= 0:
                continue
            y = 410 + i * 120 + int((1 - a) * 14)
            d.text((1010, y), k_, fill=col, font=F(48))
            d.text((1240, y), v, fill=ink, font=F(52))
        if progress > 0.8:
            K.pill(d, 1370, 680, "We land on (4, 4)!", sage, size=44)
            tracker(3)
        else:
            tracker(2)
        return True

    # ---- station 4: turns & chance --------------------------------------------------------
    if visual == "c20-chance":
        if focus in ("turn", "turna"):
            station(4, "TURNS & CHANCE", K.GOLD)
            tracker(3)
            ccx, ccy, R = 640, 570, 250
            d.ellipse((ccx - R + 10, ccy - R + 12, ccx + R + 10, ccy + R + 12), fill=K.SHADOW)
            d.ellipse((ccx - R, ccy - R, ccx + R, ccy + R), fill=panel, outline=K.DEV_MID, width=6)
            for lab, (dx, dy) in (("N", (0, -1)), ("E", (1, 0)), ("S", (0, 1)), ("W", (-1, 0))):
                col = coral if (lab == "E" and focus == "turn") or (lab == "W" and focus == "turna") else muted
                tc(d, lab, ccx + dx * (R - 50), ccy + dy * (R - 50), 50, col)
            e = K.ease_in_out(K.clamp01((progress - 0.05) * 2.2)) if focus == "turna" else 0.0
            ang = -math.pi * e
            L = R - 100
            tipx, tipy = ccx + math.cos(ang) * L, ccy + math.sin(ang) * L
            K.draw_arrow(d, ccx - math.cos(ang) * 40, ccy - math.sin(ang) * 40, tipx, tipy, K.GOLD, width=22, head=56)
            d.ellipse((ccx - 26, ccy - 26, ccx + 26, ccy + 26), fill=K.DEV_DARK)
            K.draw_face(d, ccx, ccy, 18, "kid", 0.6)
            K.shadow_card(d, (1040, 330, 1780, 800), brand, radius=36, outline=line)
            if focus == "turn":
                K.text_at(d, "Facing EAST", 1410, 370, F(54), ink)
                K.text_at(d, "Half turn…", 1410, 460, F(54), K.BOTH_COLOR)
                K.text_at(d, "Which way now?", 1410, 560, F(50), coral)
                K.draw_stopwatch(d, 1410, 700, 50, progress, brand)
            else:
                if e > 0.05:
                    d.arc((ccx - R - 30, ccy - R - 30, ccx + R + 30, ccy + R + 30), 180, 360, fill=K.BOTH_COLOR,
                          width=6)
                K.text_at(d, "WEST!", 1410, 380, F(100), sage)
                K.pill(d, 1410, 540, "Half turn = 180°", K.BOTH_COLOR, size=38)
                K.text_at(d, "the opposite way", 1410, 660, F(44), ink)
            return True
        if focus in ("coin", "coina"):
            tracker(3)
            if focus == "coin":
                sq = math.cos(t * math.pi * 6)
                coin(d, 520, 520 - 60 * abs(math.sin(t * math.pi * 3)), 170, "H" if sq > 0 else "T", sq)
                K.shadow_card(d, (900, 290, 1780, 820), brand, radius=36, outline=line)
                K.text_at(d, "TRUE or FALSE?", 1340, 330, F(44), K.BOTH_COLOR)
                K.text_at(d, "A normal coin will land", 1340, 420, F(44), ink)
                K.text_at(d, "on heads, for certain.", 1340, 480, F(44), ink)
                K.pill(d, 1180, 600, "TRUE", sage, size=44)
                K.pill(d, 1500, 600, "FALSE", K.DANGER, size=44)
                K.draw_stopwatch(d, 1340, 760, 40, progress, brand)
                return True
            # coina: a level seesaw with heads and tails
            px, py = 620, 720
            d.polygon([(px - 60, py + 110), (px + 60, py + 110), (px, py)], fill=K.DEV_MID)
            d.rounded_rectangle((px - 380, py - 18, px + 380, py + 4), radius=10, fill=(186, 124, 76))
            coin(d, px - 260, py - 150, 120, "H")
            coin(d, px + 260, py - 150, 120, "T")
            K.text_at(d, "Heads", px - 260, py + 30, F(36), ink)
            K.text_at(d, "Tails", px + 260, py + 30, F(36), ink)
            K.shadow_card(d, (1120, 290, 1780, 820), brand, radius=36, outline=line)
            K.pill(d, 1450, 330, "FALSE", K.DANGER, size=50)
            K.text_at(d, "Heads or tails?", 1450, 470, F(46), ink)
            K.text_at(d, "About equally", 1450, 560, F(50), K.BOTH_COLOR)
            K.text_at(d, "likely!", 1450, 630, F(50), K.BOTH_COLOR)
            K.text_at(d, "Not certain", 1450, 730, F(40), muted)
            return True
        # words: chance line
        tracker(4)
        x0, x1, y = 260, 1660, 640
        d.rounded_rectangle((x0 - 20, y - 14, x1 + 20, y + 14), radius=14, fill=line)
        marks = [("Impossible", K.DANGER), ("Unlikely", K.GOLD), ("Likely", K.ROAD), ("Certain", sage)]
        for i, (lab, col) in enumerate(marks):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            x = x0 + i * (x1 - x0) / 3
            d.ellipse((x - 26, y - 26, x + 26, y + 26), fill=col)
            K.text_at(d, lab, x, y + 50, F(40), col)
            iy = 440 + int((1 - a) * 20)
            if i == 0:
                die(d, x, iy, 120, 6)
                K.text_at(d, "roll a 7?", x, iy + 80, F(30), muted)
            elif i == 1:
                d.ellipse((x - 60, iy - 40, x + 60, iy + 40), fill=(206, 226, 246))
                d.ellipse((x - 90, iy - 10, x + 20, iy + 50), fill=(206, 226, 246))
                d.ellipse((x - 20, iy - 10, x + 90, iy + 50), fill=(206, 226, 246))
                for k in range(3):
                    sx = x - 24 + k * 24
                    d.ellipse((sx - 6, iy + 66, sx + 6, iy + 82), fill=WHITE, outline=(170, 190, 210))
                K.text_at(d, "snow in May?", x, iy + 100, F(30), muted)
            elif i == 2:
                d.rounded_rectangle((x - 70, iy - 50, x + 70, iy + 50), radius=16, fill=K.ROAD_SOFT, outline=K.ROAD,
                                    width=4)
                K.text_at(d, "HW", x, iy - 30, F(44), K.ROAD)
                K.text_at(d, "homework today?", x, iy + 70, F(30), muted)
            else:
                sun(d, x, iy, 50, t)
                K.text_at(d, "sun rises?", x, iy + 90, F(30), muted)
        if progress > 0.7:
            cxm = (x0 + x1) / 2
            coin(d, cxm, y - 2, 34, "H")
            K.pill(d, cxm, y + 110, "Coin flip: in the middle", K.BOTH_COLOR, size=30)
        return True

    # ---- station 5: working backwards ---------------------------------------------------
    if visual == "c20-back":
        if focus == "ask":
            station(5, "BACKWARDS", K.ROAD)
            tracker(4)
            d.ellipse((400 - 230, 560 - 230, 400 + 230, 560 + 230), fill=coral_soft)
            K.draw_person(d, 400, 500, 1.2, "kid", t)
            K.pill(d, 400, 780, "Priya", coral, size=34)
            jar(d, 700, 820, 0.95, 15)
            K.shadow_card(d, (960, 320, 1780, 800), brand, radius=36, outline=line)
            K.text_at(d, "Bought 6 more beads.", 1370, 360, F(46), ink)
            K.text_at(d, "Now she has 15.", 1370, 430, F(46), ink)
            tc(d, "? + 6 = 15", 1370, 590, 80, K.ROAD)
            K.text_at(d, "How many at the start?", 1370, 680, F(40), coral)
            K.draw_stopwatch(d, 1700, 760, 34, progress, brand)
            return True
        if focus == "draw":
            tracker(4)

            def box(x, y, label, col):
                d.rounded_rectangle((x - 100 + 8, y - 70 + 10, x + 100 + 8, y + 70 + 10), radius=24, fill=K.SHADOW)
                d.rounded_rectangle((x - 100, y - 70, x + 100, y + 70), radius=24, fill=panel, outline=col, width=6)
                tc(d, label, x, y, 70, col)

            K.text_at(d, "The story", 300, 330, F(38), muted)
            box(620, 400, "?", muted)
            K.draw_arrow(d, 740, 400, 1180, 400, coral, width=12, head=34)
            K.pill(d, 960, 300, "+ 6", coral, size=38)
            box(1300, 400, "15", ink)
            a = K.ease_out_cubic(K.clamp01((progress - 0.35) * 2.5))
            if a > 0:
                y2 = 660 + int((1 - a) * 20)
                K.text_at(d, "Flip it!", 300, y2 - 70, F(38), sage)
                box(1300, y2, "15", ink)
                K.draw_arrow(d, 1180, y2, 740, y2, sage, width=12, head=34)
                K.pill(d, 960, y2 + 60, "- 6", sage, size=38)
                box(620, y2, "?", sage)
                K.pill(d, 1620, y2 - 30, "+ becomes -", K.BOTH_COLOR, size=32)
            return True
        if focus == "ans":
            K.text_at(d, "15 - 6 = 9", cx, 250 + lift, F(100), K.ROAD)
            gone = K.clamp01((progress - 0.1) * 2.5)
            for k in range(15):
                x = 330 + k * 90
                y = 520
                col = BEAD_COLS[k % 5]
                if k >= 9:
                    y -= 80 * gone
                    if gone >= 1:
                        d.ellipse((x - 32, y - 32, x + 32, y + 32), outline=line, width=4)
                        continue
                d.ellipse((x - 32 + 4, y - 32 + 6, x + 32 + 4, y + 32 + 6), fill=K.SHADOW)
                d.ellipse((x - 32, y - 32, x + 32, y + 32), fill=col)
                d.ellipse((x - 16, y - 20, x - 4, y - 8), fill=WHITE)
            d.line((330, 600, 330 + 8 * 90, 600), fill=sage, width=6)
            K.text_at(d, "9 at the start", 330 + 4 * 90, 620, F(36), sage)
            d.line((330 + 9 * 90, 600, 330 + 14 * 90, 600), fill=coral, width=6)
            K.text_at(d, "6 she bought", 330 + 11.5 * 90, 620, F(36), coral)
            b = K.stagger(progress, 5, step=0.1, speed=4)
            if b > 0:
                d.rounded_rectangle((520, 720, 1400, 830), radius=40, fill=sage_soft, outline=sage, width=5)
                K.text_at(d, "Check: 9 + 6 = 15", cx - 30, 742, F(54), ink)
                K.draw_check(d, 1340, 775, 28, sage)
            tracker(5 if progress > 0.85 else 4)
            return True
        # badge
        confetti(avoid=(560, 280, 1360, 860))
        ishaan(d, cx, 480, 1.5, t, medal=True)
        for k in range(5):
            a = math.radians(200 + k * 35)
            sx, sy = cx + math.cos(a) * 330, 520 + math.sin(a) * 260
            K.draw_star(d, sx, sy, 40 + 6 * pulse, K.GOLD, rot=t + k)
        K.text_at(d, "Golden puzzle badge!", cx, 790, F(56), GOLD_DARK)
        return True

    # ---- computers and AI ------------------------------------------------------------------
    if visual == "c20-computers":
        if focus == "intro":
            d.ellipse((560 - 260, 560 - 260, 560 + 260, 560 + 260), fill=blue_soft)
            K.draw_device(d, "laptop", 560, 600, 1.2, brand, t=t)
            K.text_at(d, "(3, 1)", 560, 520, F(56), K.BOTH_COLOR)
            K.draw_robot(d, 1400, 560, 0.85, t, mood="happy", wave=t)
            tokens = [("2, 4, 6", coral, 980, 330), ("likely", sage, 980, 520), ("15 - 6", K.ROAD, 980, 710)]
            for i, (lab, col, x, y) in enumerate(tokens):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a > 0:
                    K.pill(d, x, y + int((1 - a) * 20) + 6 * math.sin(t * 8 + i), lab, col, size=36)
            return True
        if focus == "pixels":
            gx0, gy0, cell, nc, nr = 300, 260, 52, 12, 11
            face = {(4, 3), (7, 3), (4, 4), (7, 4), (3, 7), (8, 7), (4, 8), (5, 8), (6, 8), (7, 8)}
            d.rounded_rectangle((gx0 - 30, gy0 - 30, gx0 + nc * cell + 30, gy0 + nr * cell + 30), radius=24,
                                fill=K.DEV_DARK)
            hi = (7, 3)
            for r_ in range(nr):
                for c_ in range(nc):
                    x, y = gx0 + c_ * cell, gy0 + r_ * cell
                    on = (c_, r_) in face
                    ring = 3 <= ((c_ - 5.5) ** 2 + (r_ - 5) ** 2) ** 0.5 * 1.0 <= 5.4
                    col = K.DEV_DEEP if on else (K.GOLD if ring or ((c_ - 5.5) ** 2 + (r_ - 5) ** 2) < 9 else
                                                 K.DEV_SCREEN)
                    d.rectangle((x + 2, y + 2, x + cell - 2, y + cell - 2), fill=col)
            if progress > 0.35:
                x, y = gx0 + hi[0] * cell, gy0 + hi[1] * cell
                rr = 6 + 6 * pulse
                d.rectangle((x - rr, y - rr, x + cell + rr, y + cell + rr), outline=coral, width=6)
                K.draw_arrow(d, x + cell + 20, y + cell / 2, 1080, 420, coral, width=6, head=20)
            K.shadow_card(d, (1080, 300, 1780, 800), brand, radius=36, outline=line)
            K.text_at(d, "Every pixel has", 1430, 340, F(44), ink)
            K.text_at(d, "an address", 1430, 400, F(44), ink)
            K.text_at(d, "(across, up)", 1430, 520, F(66), coral)
            K.pill(d, 1430, 680, "A screen is a grid!", K.BOTH_COLOR, size=36)
            return True
        # ai
        box = phone(d, 560, 560, 1.4)
        x0, y0, x1, y1 = box
        d.rectangle((x0, y0, x1, y0 + 60), fill=K.ROAD)
        K.text_at(d, "Chat", (x0 + x1) / 2, y0 + 12, F(30), WHITE)
        d.rounded_rectangle((x0 + 20, y0 + 90, x1 - 20, y0 + 160), radius=20, fill=K.ROAD_SOFT)
        d.text((x0 + 40, y0 + 104), "Happy …", fill=ink, font=F(36))
        sugg = [("birthday", 1.0), ("Diwali", 0.45), ("dog", 0.12)]
        for i, (word, p) in enumerate(sugg):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            y = y0 + 200 + i * 100
            best = i == 0
            d.rounded_rectangle((x0 + 20, y, x1 - 20, y + 80), radius=20, fill=sage_soft if best else panel,
                                outline=sage if best else line, width=4 if best else 2)
            d.text((x0 + 36, y + 8), word, fill=ink, font=F(32))
            d.rounded_rectangle((x0 + 36, y + 54, x0 + 36 + (x1 - x0 - 92) * p * a, y + 68), radius=7,
                                fill=sage if best else K.STEEL)
        K.draw_robot(d, 1080, 600, 0.6, t, mood="happy")
        K.shadow_card(d, (1280, 300, 1800, 800), brand, radius=36, outline=line)
        K.text_at(d, "PROBABILITY", 1540, 340, F(42), K.BOTH_COLOR)
        K.text_at(d, "= chance", 1540, 410, F(42), ink)
        K.text_at(d, "AI picks the", 1540, 530, F(40), ink)
        K.text_at(d, "most likely", 1540, 590, F(48), sage)
        K.text_at(d, "word!", 1540, 656, F(40), ink)
        return True

    # ---- checkpoint -----------------------------------------------------------------------------
    if visual == "c20-check":
        if focus == "intro":
            K.shadow_card(d, (440, 290 + lift, w - 440, 770 + lift), brand, radius=40, accent=sage)
            K.text_at(d, "CAPSTONE CHECK", cx, 360 + lift, F(40), sage)
            K.text_at(d, "Just like the quiz!", cx, 440 + lift, F(66), ink)
            puzzle_piece(d, cx - 120, 640 + lift, 100, coral)
            K.draw_check(d, cx + 120, 640 + lift, 46, sage)
            return True
        if focus == "ask":
            notebook(d, (140, 250, 1020, 840), "2 maths ideas that help")
            K.text_at(d, "computers or AI", 580, 340, F(42), K.CORAL)
            for i in range(2):
                yy = 470 + i * 160
                d.text((230, yy), f"{i + 1}.", fill=ink, font=F(56))
                K.draw_dashed(d, 320, yy + 64, 960, yy + 64, line, width=4)
            ishaan(d, 1420, 480, 1.25, 0)
            qmarks([(1180, 300), (1660, 300)], 80)
            K.pill(d, 1420, 760, "Pause & write them down!", coral, size=34)
            return True
        specs = [("grid", "Grids & coordinates", "Pixels have addresses", coral),
                 ("prob", "Probability", "AI picks most likely", K.BOTH_COLOR)]
        for i, (kind, title, sub, col) in enumerate(specs):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            x0 = 180 + i * 820
            y0 = 270 + int((1 - a) * 40)
            K.shadow_card(d, (x0, y0, x0 + 740, y0 + 480), brand, radius=36, outline=col, outline_w=6)
            ix, iy = x0 + 370, y0 + 170
            if kind == "grid":
                for r_ in range(5):
                    for c_ in range(7):
                        on = (c_, r_) == (4, 1)
                        x, y = ix - 175 + c_ * 50, iy - 120 + r_ * 50
                        d.rectangle((x + 2, y + 2, x + 48, y + 48), fill=coral if on else K.DEV_SCREEN)
                K.pill(d, ix + 230, iy - 120, "(4, 3)", coral, size=28)
            else:
                coin(d, ix - 130, iy, 80, "H")
                K.draw_robot(d, ix + 110, iy - 10, 0.42, t, mood="happy")
            K.text_at(d, title, ix, y0 + 330, F(48), col)
            K.text_at(d, sub, ix, y0 + 400, F(36), ink)
            K.draw_check(d, x0 + 700, y0 + 40, 26, sage)
        b = K.stagger(progress, 3, step=0.15, speed=4)
        if b > 0:
            K.pill(d, cx, 790 + int((1 - b) * 10), "Breaking problems into parts helps too!", sage, size=32)
        return True

    # ---- recap & celebration ----------------------------------------------------------------
    if visual == "c20-recap":
        recap = [("Find the rule to continue a pattern", coral, "pattern"), ("Grid address = (across, up)", sage, "grid"),
                 ("Certain · likely · unlikely · impossible", K.BOTH_COLOR, "chance"),
                 ("Show your working & check it", K.ROAD, "work")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(d, "Remember", cx, 220, F(50), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                d.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                    outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 190
                if kind == "pattern":
                    for k, lab_ in enumerate(("2", "4", "6", "?")):
                        ntile(ix - 135 + k * 90, iy, lab_, K.ROAD if lab_ != "?" else coral, size=76)
                    for k in range(3):
                        d.arc((ix - 135 + k * 90, iy - 80, ix - 45 + k * 90, iy - 20), 200, 340, fill=coral, width=5)
                elif kind == "grid":
                    for k in range(5):
                        d.line((ix - 120 + k * 60, iy - 110, ix - 120 + k * 60, iy + 110), fill=(214, 220, 232), width=3)
                        d.line((ix - 120, iy - 110 + k * 55, ix + 120, iy - 110 + k * 55), fill=(214, 220, 232), width=3)
                    K.draw_arrow(d, ix - 120, iy + 110, ix + 60, iy + 110, coral, width=8, head=20)
                    K.draw_arrow(d, ix + 60, iy + 110, ix + 60, iy - 0, sage, width=8, head=20)
                    d.ellipse((ix + 44, iy - 16, ix + 76, iy + 16), fill=K.BOTH_COLOR)
                elif kind == "chance":
                    d.rounded_rectangle((ix - 150, iy - 8, ix + 150, iy + 8), radius=8, fill=line)
                    for k, c in enumerate((K.DANGER, K.GOLD, K.ROAD, sage)):
                        x = ix - 150 + k * 100
                        d.ellipse((x - 18, iy - 18, x + 18, iy + 18), fill=c)
                    coin(d, ix, iy - 90, 50, "H")
                else:
                    d.rounded_rectangle((ix - 130, iy - 110, ix + 130, iy + 110), radius=16, fill=PAPER)
                    for k in range(3):
                        d.rounded_rectangle((ix - 100, iy - 70 + k * 56, ix + 60, iy - 54 + k * 56), radius=8,
                                            fill=RULE)
                    K.draw_check(d, ix + 96, iy + 70, 26, sage)
                font = F(34)
                lines = K.wrap_text(lab, font, 350)
                for j, ln in enumerate(lines):
                    K.text_at(d, ln, x0 + 200, y0 + 370 + j * 44, font, ink)
            return True
        if focus == "journey":
            K.text_at(d, "Your Math journey", cx, 226, F(52), ink)
            xs = [330, 750, 1170, 1590]
            K.draw_dashed(d, xs[0], 470, xs[-1], 470, line, width=10, phase=t * 100)
            for i, ((kind, l1, l2), x) in enumerate(zip(UNITS, xs)):
                a = K.stagger(progress, i, step=0.17, speed=4)
                if a <= 0:
                    continue
                col = palette[i] if i < 3 else K.ROAD
                r = 120 * (0.8 + 0.2 * a)
                d.ellipse((x - r + 8, 470 - r + 10, x + r + 8, 470 + r + 10), fill=K.SHADOW)
                d.ellipse((x - r, 470 - r, x + r, 470 + r), fill=panel, outline=col, width=8)
                if kind == "numbers":
                    tc(d, "123", x, 445, 64, col)
                    tc(d, "1010", x, 515, 34, muted)
                elif kind == "logic":
                    K.pill(d, x, 410, "TRUE", sage, size=30)
                    K.pill(d, x, 480, "FALSE", K.DANGER, size=30)
                elif kind == "grid":
                    for k in range(4):
                        d.line((x - 60 + k * 40, 410, x - 60 + k * 40, 530), fill=(200, 208, 222), width=3)
                        d.line((x - 60, 410 + k * 40, x + 60, 410 + k * 40), fill=(200, 208, 222), width=3)
                    d.polygon([(x - 50, 520), (x + 50, 520), (x, 430)], outline=K.BOTH_COLOR, width=6)
                else:
                    puzzle_piece(d, x, 470, 100, col)
                K.text_at(d, l1, x, 620, F(34), ink)
                K.text_at(d, l2, x, 662, F(34), ink)
                K.draw_check(d, x + 90, 470 - 92, 30, sage)
            if progress > 0.75:
                K.pill(d, cx, 760, "All 4 units done!", coral, size=40)
            return True
        if focus == "done":
            confetti(y0=230, y1=600, avoid=(700, 300, 1220, 620))
            K.draw_mascot(d, int(cx - 500), 470, 110, sage, panel, bounce)
            ishaan(d, cx + 500, 440, 1.15, t, medal=True)
            trophy(d, cx, 500, 2.0, "MATH")
            K.text_at(d, "Math track complete!", cx, 680, F(68), ink)
            K.pill(d, cx, 780, "You're a real problem solver!", coral, size=36)
            return True
        K.text_at(d, "Final quiz time!", cx, 380, F(64), coral)
        K.text_at(d, "Tap Finish, and you've got this, champ!", cx, 500, F(44), ink)
        K.draw_arrow(d, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
