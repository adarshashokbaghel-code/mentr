"""C5 · Number Patterns Playground — visuals."""
import math

import build as K

COIN = (255, 200, 64)
COIN_DARK = (214, 150, 30)
COIN_HI = (255, 232, 150)
CLAY = (204, 108, 70)
CLAY_DARK = (160, 74, 44)
LADDOO = (247, 164, 44)
LADDOO_DARK = (214, 122, 20)
PAPER = (255, 250, 238)
GRID = (226, 218, 236)
PENCIL = (255, 196, 40)
PETAL_W = (250, 246, 236)
PETAL_W_DARK = (214, 204, 186)
PETAL_Y = (255, 204, 40)
PETAL_P = (238, 104, 158)
STEM = (70, 156, 92)


def S_(s):
    return lambda v: v * s


def darker(col, f=0.74):
    return tuple(int(c * f) for c in col)


def riya(draw, cx, cy, s, body, t=0.0):
    """Riya bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                     fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    fx, fy = cx + r * 0.72, cy - r * 0.78
    for k in range(5):
        a = k * 2 * math.pi / 5
        px, py = fx + math.cos(a) * r * 0.16, fy + math.sin(a) * r * 0.16
        draw.ellipse((px - r * 0.14, py - r * 0.14, px + r * 0.14, py + r * 0.14), fill=K.GOLD)
    draw.ellipse((fx - r * 0.09, fy - r * 0.09, fx + r * 0.09, fy + r * 0.09), fill=(255, 106, 26))


def coin(draw, cx, cy, r, face=COIN):
    """One coin seen from the side; cy = centre of the top face."""
    ry, th = r * 0.34, r * 0.5
    draw.rectangle((cx - r, cy, cx + r, cy + th), fill=COIN_DARK)
    draw.ellipse((cx - r, cy + th - ry, cx + r, cy + th + ry), fill=COIN_DARK)
    draw.rectangle((cx - r * 0.8, cy + th * 0.35, cx - r * 0.55, cy + th + ry * 0.5), fill=(236, 180, 60))
    draw.arc((cx - r, cy + th - ry, cx + r, cy + th + ry), 0, 180, fill=darker(COIN_DARK, 0.7),
             width=max(2, int(r * 0.07)))
    draw.ellipse((cx - r, cy - ry, cx + r, cy + ry), fill=face)
    draw.ellipse((cx - r * 0.66, cy - ry * 0.66, cx + r * 0.66, cy + ry * 0.66), outline=COIN_DARK,
                 width=max(2, int(r * 0.07)))


def coin_stack(draw, cx, by, n, r, drop=None):
    """n coins on a table at by. drop: 0→1 animates the top coin falling in. Returns the stack top y."""
    ry, th = r * 0.34, r * 0.5
    draw.ellipse((cx - r * 1.15, by - ry * 0.5, cx + r * 1.15, by + ry * 0.7), fill=K.SHADOW)
    top = by
    for i in range(n):
        cy = by - th - ry - i * th
        if drop is not None and i == n - 1:
            cy -= (1 - K.ease_out_cubic(K.clamp01(drop))) * 160
        coin(draw, cx, cy, r, COIN_HI if (drop is not None and i == n - 1) else COIN)
        top = cy - ry
    return top


def gullak(draw, cx, cy, s, t=0.0):
    """Clay piggy-bank pot; cy = body centre."""
    S = S_(s)
    draw.ellipse((cx - S(130) + S(10), cy - S(110) + S(12), cx + S(130) + S(10), cy + S(120) + S(12)), fill=K.SHADOW)
    draw.ellipse((cx - S(130), cy - S(110), cx + S(130), cy + S(120)), fill=CLAY)
    draw.rounded_rectangle((cx - S(54), cy - S(150), cx + S(54), cy - S(96)), radius=S(14), fill=CLAY_DARK)
    draw.ellipse((cx - S(66), cy - S(170), cx + S(66), cy - S(134)), fill=CLAY)
    draw.ellipse((cx - S(40), cy - S(162), cx + S(40), cy - S(142)), fill=CLAY_DARK)
    draw.rounded_rectangle((cx - S(40), cy - S(66), cx + S(40), cy - S(52)), radius=S(7), fill=K.DEV_DEEP)
    draw.arc((cx - S(118), cy - S(30), cx + S(118), cy + S(70)), 10, 170, fill=(255, 236, 210), width=max(2, int(S(7))))
    for k in range(7):
        a = math.radians(30 + k * 20)
        px, py = cx + math.cos(a) * S(100), cy + S(20) + math.sin(a) * S(62)
        draw.ellipse((px - S(8), py - S(8), px + S(8), py + S(8)), fill=K.GOLD)
    draw.ellipse((cx - S(96), cy - S(70), cx - S(60), cy - S(30)), fill=(226, 140, 100))
    fall = (t * 1.6) % 1.0
    coin(draw, cx, cy - S(120) - S(110) * (1 - fall), S(30))


def block(draw, x, y, sz, col):
    draw.rounded_rectangle((x + 5, y + 6, x + sz + 5, y + sz + 6), radius=int(sz * 0.16), fill=K.SHADOW)
    draw.rounded_rectangle((x, y, x + sz, y + sz), radius=int(sz * 0.16), fill=darker(col))
    draw.rounded_rectangle((x, y, x + sz, y + sz * 0.84), radius=int(sz * 0.16), fill=col)
    draw.ellipse((x + sz * 0.16, y + sz * 0.14, x + sz * 0.34, y + sz * 0.32), fill=(255, 255, 255))


def block_tower(draw, cx, by, n, sz, cols, per_row=2, gap=6, hl_from=None, hl=None):
    """n blocks, per_row wide, built upward from by. Returns the top y."""
    rows = (n + per_row - 1) // per_row
    wd = per_row * sz + (per_row - 1) * gap
    for i in range(n):
        r, c = i // per_row, i % per_row
        x = cx - wd / 2 + c * (sz + gap)
        y = by - (r + 1) * sz - r * gap
        col = hl if (hl_from is not None and i >= hl_from) else cols[r % len(cols)]
        block(draw, x, y, sz, col)
    return by - rows * sz - (rows - 1) * gap


def square_group(draw, cx, cy, cols, rows, sz, col_fn, gap=6):
    wd = cols * sz + (cols - 1) * gap
    ht = rows * sz + (rows - 1) * gap
    for r in range(rows):
        for c in range(cols):
            x = cx - wd / 2 + c * (sz + gap)
            y = cy - ht / 2 + r * (sz + gap)
            col = col_fn(r, c)
            draw.rounded_rectangle((x + 4, y + 5, x + sz + 4, y + sz + 5), radius=int(sz * 0.14), fill=K.SHADOW)
            draw.rounded_rectangle((x, y, x + sz, y + sz), radius=int(sz * 0.14), fill=col)
    return wd, ht


def staircase(draw, x0, by, n_rows, sz, col, new_col=None, gap=5, dashed_row=None, phase=0.0):
    """Rows of 1, 2, … n_rows squares, left-aligned, bottom row at by. The last row uses new_col if given."""
    for r in range(n_rows):
        y = by - (n_rows - r) * (sz + gap) + gap
        for c in range(r + 1):
            x = x0 + c * (sz + gap)
            if dashed_row is not None and r == n_rows - 1:
                for (a, b, cc, d) in ((x, y, x + sz, y), (x, y + sz, x + sz, y + sz), (x, y, x, y + sz),
                                      (x + sz, y, x + sz, y + sz)):
                    K.draw_dashed(draw, a, b, cc, d, dashed_row, width=4, dash=10, gap=8, phase=phase)
                continue
            fill = new_col if (new_col is not None and r == n_rows - 1) else col
            draw.rounded_rectangle((x + 4, y + 5, x + sz + 4, y + sz + 5), radius=int(sz * 0.14), fill=K.SHADOW)
            draw.rounded_rectangle((x, y, x + sz, y + sz), radius=int(sz * 0.14), fill=fill)


def laddoo(draw, cx, cy, r):
    draw.ellipse((cx - r + r * 0.12, cy - r + r * 0.16, cx + r + r * 0.12, cy + r + r * 0.16), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=LADDOO)
    for k, (dx, dy) in enumerate(((-0.4, -0.2), (0.1, -0.45), (0.45, 0.05), (-0.1, 0.35), (0.3, 0.5), (-0.5, 0.25))):
        rr = r * 0.09
        draw.ellipse((cx + dx * r - rr, cy + dy * r - rr, cx + dx * r + rr, cy + dy * r + rr), fill=LADDOO_DARK)
    draw.ellipse((cx - r * 0.55, cy - r * 0.6, cx - r * 0.2, cy - r * 0.3), fill=(255, 214, 140))


def petal(draw, cx, cy, ang, length, width, col, outline=None):
    pts = []
    for i in range(24):
        th = 2 * math.pi * i / 24
        lx = length / 2 * (1 + math.cos(th))
        ly = width / 2 * math.sin(th)
        pts.append((cx + lx * math.cos(ang) - ly * math.sin(ang), cy + lx * math.sin(ang) + ly * math.cos(ang)))
    draw.polygon(pts, fill=col, outline=outline, width=4 if outline else 1)


def flower(draw, cx, cy, r, petals, col, centre=(255, 170, 30), stem_to=None, t=0.0):
    if stem_to is not None:
        draw.line((cx, cy, cx, stem_to), fill=STEM, width=max(4, int(r * 0.12)))
        for sx, yy in ((-1, 0.55), (1, 0.75)):
            ly = cy + (stem_to - cy) * yy
            petal(draw, cx, ly, math.pi if sx < 0 else 0.0, r * 0.7, r * 0.3, STEM)
    sway = 0.06 * math.sin(t * 6)
    wf = 0.8 if petals == 3 else 0.62 if petals <= 5 else 0.42
    edge = PETAL_W_DARK if col == PETAL_W else None
    for k in range(petals):
        a = -math.pi / 2 + k * 2 * math.pi / petals + sway
        petal(draw, cx, cy, a, r, r * wf, col, outline=edge)
    draw.ellipse((cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3), fill=centre)


def pencil(draw, x, y, s, ang=-0.8):
    S = S_(s)
    ca, sa = math.cos(ang), math.sin(ang)

    def P(px, py):
        return (x + px * ca - py * sa, y + px * sa + py * ca)
    draw.polygon([P(0, 0), P(S(40), -S(16)), P(S(40), S(16))], fill=(240, 210, 170))
    draw.polygon([P(0, 0), P(S(14), -S(5.5)), P(S(14), S(5.5))], fill=K.DEV_DEEP)
    draw.polygon([P(S(40), -S(16)), P(S(200), -S(16)), P(S(200), S(16)), P(S(40), S(16))], fill=PENCIL)
    draw.polygon([P(S(200), -S(16)), P(S(226), -S(16)), P(S(226), S(16)), P(S(200), S(16))], fill=K.STEEL)
    draw.polygon([P(S(226), -S(16)), P(S(250), -S(16)), P(S(250), S(16)), P(S(226), S(16))], fill=(240, 130, 150))


def notebook(draw, box, cell=46):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=20, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=20, fill=PAPER, outline=(214, 204, 186), width=3)
    x = x0 + cell
    while x < x1 - 10:
        draw.line((x, y0 + 14, x, y1 - 14), fill=GRID, width=2)
        x += cell
    y = y0 + cell
    while y < y1 - 10:
        draw.line((x0 + 14, y, x1 - 14, y), fill=GRID, width=2)
        y += cell
    for k in range(6):
        ry = y0 + 40 + k * (y1 - y0 - 80) / 5
        draw.ellipse((x0 - 14, ry - 10, x0 + 14, ry + 10), fill=K.STEEL_DARK)


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
    block_cols = [coral, K.ROAD, sage, K.GOLD, K.BOTH_COLOR]

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

    def mystery_box(bx, size=120):
        x0, y0, x1, y1 = bx
        draw.rounded_rectangle(bx, radius=28, fill=coral_soft)
        dashed_box(bx, coral)
        K.text_at(draw, "?", (x0 + x1) / 2, (y0 + y1) / 2 - size * 0.62, font(int(size + 16 * pulse), bold=True), coral)

    def tile(mx, y, label, col, wd=170, ht=170, state="normal", size=92):
        x0 = mx - wd / 2
        if state == "q":
            mystery_box((x0, y, x0 + wd, y + ht), size=int(size * 1.1))
            return
        win = state == "win"
        K.shadow_card(draw, (x0, y, x0 + wd, y + ht), brand, radius=28, outline=sage if win else None,
                      outline_w=6 if win else 3)
        if win:
            draw.rounded_rectangle((x0 + 6, y + 6, x0 + wd - 6, y + ht - 6), radius=24, fill=sage_soft)
        K.text_at(draw, label, mx, y + ht / 2 - size * 0.6, font(size, bold=True), col)

    def jump(x0, x1, y, label, col, hgt=80, dashed=False, size=38):
        if x1 - x0 < 70:
            return
        p0, p2 = (x0 + 14, y), (x1 - 14, y)
        p1 = ((x0 + x1) / 2, y - 2 * hgt)
        K.draw_curve(draw, p0, p1, p2, col, width=7, dashed=dashed, phase=progress * 20)
        draw.polygon([(p2[0] + 4, p2[1] + 4), (p2[0] - 22, p2[1] - 10), (p2[0] - 2, p2[1] - 26)], fill=col)
        if label:
            K.text_at(draw, label, (x0 + x1) / 2, y - hgt - size * 1.35, font(size, bold=True), col)

    def converge(xa, xb, xt, y, col):
        """Two arcs from tiles at xa and xb meeting at xt (tops at y)."""
        for k, xs in enumerate((xa, xb)):
            hgt = 120 if k == 0 else 70
            p0, p2 = (xs, y), (xt - 10 + k * 10, y)
            K.draw_curve(draw, p0, ((xs + xt) / 2, y - 2 * hgt), p2, col, width=7)
        draw.polygon([(xt, y + 4), (xt - 18, y - 22), (xt + 16, y - 20)], fill=col)

    def day_towers(counts, labels, step, by, r=64, ask_last=False, drop_last=False, nums=True):
        n = len(counts)
        xs = [cx + (i - (n - 1) / 2) * step for i in range(n)]
        tops = []
        for i, (cnt, lab) in enumerate(zip(counts, labels)):
            a = K.stagger(progress, i, step=0.12, speed=5) if not (ask_last or drop_last) else 1.0
            x = xs[i]
            draw.rounded_rectangle((x - 120, by - 6, x + 120, by + 12), radius=8, fill=(222, 206, 184))
            if a <= 0:
                tops.append(by)
                continue
            if ask_last and i == n - 1:
                mystery_box((x - 105, by - 270, x + 105, by - 20), size=110)
                tops.append(by - 270)
            else:
                drop = progress * 2.2 if (drop_last and i == n - 1) else None
                cnt_show = cnt if a >= 1 else max(1, int(cnt * a + 0.5))
                top = coin_stack(draw, x, by - 4, cnt_show, r, drop=drop)
                tops.append(top)
                if nums:
                    K.text_at(draw, str(cnt), x, top - 74, font(52, bold=True), sage if drop is not None else ink)
            K.pill(draw, x, by + 30, lab, sage if (drop_last and i == n - 1) else coral, size=30)
        return xs, tops

    # ---- opening -----------------------------------------------------------
    if visual == "c5-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            riya(draw, cx + 280, 430, 1.3, coral, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 560, 320), (cx + 560, 320), (cx - 640, 540), (cx + 640, 540)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · SKIP COUNTING", cx, 326 + lift, font(34, bold=True), sage)
            x0, x1, ly = 420, 1500, 540 + lift
            draw.line((x0 - 30, ly, x1 + 30, ly), fill=ink, width=6)
            step = (x1 - x0) / 10
            for k in range(11):
                x = x0 + k * step
                draw.line((x, ly - 14, x, ly + 14), fill=ink, width=4)
                K.text_at(draw, str(k), x, ly + 22, font(30, bold=True), coral if k in (2, 4, 6, 8) else muted)
            for j in range(4):
                a = K.stagger(progress, j, step=0.1, speed=5)
                if a <= 0:
                    continue
                xa, xb = x0 + 2 * j * step, x0 + (2 * j + 2) * step
                jump(xa, xa + (xb - xa) * a, ly - 8, "+2" if a >= 1 else None, coral, hgt=46, size=30)
            seq = ["3", "6", "9", "12"]
            for j, s in enumerate(seq):
                a = K.stagger(progress, j + 4, step=0.07, speed=5)
                if a <= 0:
                    continue
                x = cx - 450 + j * 300
                y = 660 + lift + int((1 - a) * 20)
                draw.rounded_rectangle((x - 70, y, x + 70, y + 90), radius=22, fill=lav_soft, outline=K.BOTH_COLOR, width=4)
                K.text_at(draw, s, x, y + 16, font(50, bold=True), K.BOTH_COLOR)
                if j < 3:
                    K.text_at(draw, "+3", x + 150, y + 22, font(38, bold=True), K.BOTH_COLOR)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Number Patterns Playground", cx, 362 + lift, font(80, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 1, step=0.09, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 230
                coin_stack(draw, x, 830 + int((1 - a) * 30), i + 1, 56)
            K.pill(draw, cx, 536, "The last chapter of Unit 1!", sage, size=32)
            return True
        if focus == "grow":
            by = 800
            heights = [1, 2, 3, 4, 5]
            for i, hgt in enumerate(heights):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
                n = max(1, int(round(hgt * a)))
                block_tower(draw, 260 + i * 170, by, n, 78, block_cols, per_row=1)
            draw.line((180, by + 8, 1100, by + 8), fill=(222, 206, 184), width=10)
            K.draw_arrow(draw, 230, 370, 950, 300 - 20 * pulse, coral, width=12, head=36)
            K.text_at(draw, "They", 1480, 330 + lift, font(64, bold=True), ink)
            K.text_at(draw, "GROW!", 1480, 410 + lift, font(110, bold=True), coral)
            K.text_at(draw, "But how much?", 1480, 580, font(52, bold=True), muted)
            question_marks([(1250, 650), (1720, 640)], size=74)
            return True
        # promise
        draw.ellipse((520 - 260, 560 - 260, 520 + 260, 560 + 260), fill=coral_soft)
        riya(draw, 520, 500, 1.6, coral, t)
        K.text_at(draw, "Story time!", 1300, 300 + lift, font(100, bold=True), coral)
        K.text_at(draw, "Let's solve the mystery", 1300, 430 + lift, font(48, bold=True), ink)
        gullak(draw, 1300, 690, 0.8, t)
        return True

    # ---- Riya's coin towers ----------------------------------------------------
    if visual == "c5-hook":
        days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=coral_soft)
            riya(draw, 560, 480, 1.7, coral, t)
            K.text_at(draw, "Meet", 1320, 280 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Riya!", 1320, 350 + lift, font(130, bold=True), coral)
            gullak(draw, 1160, 700, 0.75, t)
            coin_stack(draw, 1520, 820, 3, 58)
            K.pill(draw, 1160, 820, "her gullak", sage, size=30)
            star_spots([(980, 320), (1680, 320)])
            return True
        if focus == "towers":
            day_towers([1, 2, 3, 4], days[:4], 360, 700)
            return True
        if focus == "ask":
            day_towers([1, 2, 3, 4, 5], days, 320, 700, ask_last=True)
            K.text_at(draw, "How many on Friday?", cx - 120, 240, font(52, bold=True), ink)
            K.draw_stopwatch(draw, 1600, 280, 46, progress, brand)
            return True
        if focus == "answer":
            day_towers([1, 2, 3, 4, 5], days, 320, 700, drop_last=True)
            K.pill(draw, cx, 236, "4 + 1 = 5", sage, size=48)
            if progress > 0.5:
                K.draw_check(draw, cx + 2 * 320 + 100, 400, 30, sage)
            return True
        xs, tops = day_towers([1, 2, 3, 4, 5], days, 320, 700, ask_last=False, drop_last=False)
        for i in range(4):
            a = K.stagger(progress, i, step=0.12, speed=4)
            if a > 0:
                yy = min(tops[i], tops[i + 1]) - 96
                jump(xs[i], xs[i] + (xs[i + 1] - xs[i]) * a, yy, "+1" if a >= 1 else None, sage, hgt=40, size=36)
        K.pill(draw, cx, 236, "Rule: add 1 coin each step", coral, size=44)
        return True

    # ---- definition --------------------------------------------------------------
    if visual == "c5-define":
        if focus == "name":
            draw.ellipse((420 - 270, 560 - 270, 420 + 270, 560 + 270), fill=gold_soft)
            for i in range(3):
                coin_stack(draw, 280 + i * 140, 700, i + 1, 50)
            K.draw_arrow(draw, 230, 430, 600, 380, coral, width=10, head=30)
            K.shadow_card(draw, (760, 250 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A GROWING PATTERN…", 1270, 320 + lift, font(44, bold=True), muted)
            parts = [("gets bigger", coral), ("each step,", ink), ("by following", ink), ("a rule.", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1270, 410 + i * 100 + lift + int((1 - a) * 30), font(66, bold=True), col)
            return True
        if focus == "step":
            K.text_at(draw, "Each picture is a STEP", cx, 240 + lift, font(56, bold=True), ink)
            for i in range(4):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx - 600 + i * 340
                yy = int((1 - a) * 30)
                draw.rounded_rectangle((x - 140, 360 + yy, x + 140, 740 + yy), radius=30, fill=panel, outline=line, width=3)
                coin_stack(draw, x, 690 + yy, i + 1, 64)
                K.pill(draw, x, 760 + yy, f"Step {i + 1}", [coral, K.ROAD, sage, K.BOTH_COLOR][i], size=32)
            if progress > 0.6:
                K.text_at(draw, "…", 1690, 500, font(90, bold=True), muted)
            return True
        # words
        riya(draw, 380, 500, 1.45, coral, t)
        K.draw_bubble(draw, (540, 250, 1120, 420), brand, "Add one coin each time!", tail="left", size=44)
        K.pill(draw, 380, 760, "Say it…", coral, size=40)
        K.draw_arrow(draw, 1140, 560, 1280, 560, muted, width=10, head=30)
        notebook(draw, (1320, 280, 1760, 820), cell=44)
        n_draw = 1 + int(K.clamp01(progress * 1.3) * 4.99)
        bx, by = 1540, 760
        r = 62
        for i in range(n_draw):
            cy = by - r * 0.4 - r * 0.34 - i * r * 0.4
            draw.ellipse((bx - r, cy - r * 0.34, bx + r, cy + r * 0.34), outline=ink, width=4)
            draw.arc((bx - r, cy + r * 0.06, bx + r, cy + r * 0.74), 0, 180, fill=ink, width=4)
            draw.line((bx - r, cy, bx - r, cy + r * 0.4), fill=ink, width=4)
            draw.line((bx + r, cy, bx + r, cy + r * 0.4), fill=ink, width=4)
        top = by - r * 0.4 - r * 0.34 - (n_draw - 1) * r * 0.4 - r * 0.34
        pencil(draw, bx + r + 6, top + 6, 0.55, ang=-0.9)
        K.pill(draw, 1540, 300, "…draw it!", sage, size=34)
        return True

    # ---- block towers: add 2 ------------------------------------------------------
    if visual == "c5-blocks":
        counts = [2, 4, 6, 8, 10]
        xs = [cx + (i - 2) * 310 for i in range(5)]
        by, sz = 720, 62
        show_next = focus == "next"
        if focus == "odd":
            rows = [(["2", "4", "6", "8"], "Starts at 2", coral, 300), (["3", "5", "7", "9"], "Starts at 3", K.ROAD, 600)]
            for j, (seq, lab, col, y) in enumerate(rows):
                a = K.stagger(progress, j * 3, step=0.1, speed=4)
                if a <= 0:
                    continue
                K.pill(draw, 0, y + 50, lab, col, size=32, left=150)
                for i, s in enumerate(seq):
                    x = 700 + i * 260
                    tile(x, y + int((1 - a) * 20), s, col, wd=150, ht=150, size=80)
                    if i < 3:
                        jump(x + 40, x + 220, y - 6, "+2", sage, hgt=34, size=32)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, 1690, 520 + int((1 - a) * 20), "Add 2", sage, size=44)
            return True
        tops = []
        for i, n in enumerate(counts):
            x = xs[i]
            draw.rounded_rectangle((x - 100, by + 2, x + 100, by + 16), radius=7, fill=(222, 206, 184))
            if i == 4 and not show_next:
                if focus == "towers":
                    mystery_box((x - 95, by - 300, x + 95, by - 10), size=100)
                tops.append(by - 300)
                continue
            a = K.stagger(progress, i, step=0.1, speed=5) if focus == "towers" else 1.0
            if a <= 0:
                tops.append(by)
                continue
            nn = n if a >= 1 else max(2, int(n * a / 2 + 0.5) * 2)
            top = block_tower(draw, x, by, nn, sz, block_cols, hl_from=8 if (i == 4) else None, hl=sage)
            tops.append(top)
            K.pill(draw, x, by + 32, str(n), sage if i == 4 else ink, size=34)
        if focus in ("jumps", "next"):
            for i in range(4 if show_next else 3):
                a = K.stagger(progress, i, step=0.14, speed=4) if focus == "jumps" else 1.0
                if a <= 0:
                    continue
                yy = tops[i + 1] - 30
                jump(xs[i] + 30, xs[i] + 30 + (xs[i + 1] - xs[i]) * a, yy, "+2" if a >= 1 else None,
                     sage if i < 3 else coral, hgt=40, size=40)
            if focus == "jumps":
                for i, eq in enumerate(("4 − 2 = 2", "6 − 4 = 2", "8 − 6 = 2")):
                    a = K.stagger(progress, i + 1, step=0.14, speed=4)
                    if a > 0:
                        K.text_at(draw, eq, xs[i + 1], 830, font(30, bold=True), muted)
            else:
                K.pill(draw, cx - 100, 236, "8 + 2 = 10", sage, size=46)
                star_spots([(xs[4] + 170, 380), (xs[4] - 10, 300)])
        else:
            K.text_at(draw, "How much does each tower grow?", cx - 100, 240, font(46, bold=True), ink)
        return True

    # ---- doubling squares ------------------------------------------------------------
    if visual == "c5-double":
        def two_tone(cols, rows, split_rows):
            def fn(r, c):
                if split_rows:
                    return coral if r < rows / 2 else sage
                return coral if c < cols / 2 else sage
            return fn
        steps = [(1, 1), (2, 1), (2, 2), (4, 2)]
        if focus == "intro":
            notebook(draw, (260, 270, 1100, 830), cell=56)
            square_group(draw, 400, 410, 1, 1, 90, lambda r, c: coral)
            pencil(draw, 470, 440, 0.8, ang=-0.7)
            riya(draw, 1460, 480, 1.4, coral, t)
            for k in range(3):
                yy = 420 + k * 44
                x0 = 1150 + k * 24
                draw.line((x0, yy, x0 + 90 + 50 * pulse, yy), fill=K.GOLD, width=10)
            K.text_at(draw, "Faster!", 1460, 720, font(64, bold=True), coral)
            return True
        if focus in ("steps", "rule"):
            xs = [330, 660, 1030, 1510]
            sz = 74
            for i, (c, r) in enumerate(steps):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                yy = int((1 - a) * 30)
                if focus == "rule" and i > 0:
                    fn = two_tone(c, r, split_rows=(c == r))
                else:
                    fn = (lambda rr, cc: coral)
                square_group(draw, xs[i], 520 + yy, c, r, sz, fn)
                K.pill(draw, xs[i], 300, f"Step {i + 1}", [coral, K.ROAD, sage, K.BOTH_COLOR][i], size=32)
                n = c * r
                if focus == "steps":
                    K.text_at(draw, f"{n} square" + ("s" if n > 1 else ""), xs[i], 700, font(40, bold=True), ink)
                else:
                    eq = ["1", "1 + 1 = 2", "2 + 2 = 4", "4 + 4 = 8"][i]
                    K.text_at(draw, eq, xs[i], 700, font(42, bold=True), ink if i == 0 else K.BOTH_COLOR)
                if i < 3 and K.stagger(progress, i + 1, step=0.16, speed=4) > 0:
                    K.draw_arrow(draw, xs[i] + 90 + c * 20, 520, xs[i + 1] - 90 - steps[i + 1][0] * 20, 520, muted,
                                 width=8, head=24)
            if focus == "rule" and progress > 0.5:
                K.pill(draw, cx, 790, "Double = add it to itself", coral, size=36)
            return True
        if focus == "ask":
            square_group(draw, 420, 540, 2, 2, 74, lambda r, c: coral)
            K.pill(draw, 420, 330, "Step 3", sage, size=32)
            K.text_at(draw, "4", 420, 690, font(48, bold=True), ink)
            K.draw_arrow(draw, 560, 540, 680, 540, muted, width=8, head=24)
            square_group(draw, 900, 540, 4, 2, 74, lambda r, c: coral)
            K.pill(draw, 900, 330, "Step 4", K.BOTH_COLOR, size=32)
            K.text_at(draw, "8", 900, 690, font(48, bold=True), ink)
            K.draw_arrow(draw, 1100, 540, 1220, 540, muted, width=8, head=24)
            mystery_box((1270, 380, 1650, 700), size=150)
            K.pill(draw, 1460, 300, "Step 5", coral, size=32)
            K.draw_stopwatch(draw, 1460, 800, 46, progress, brand)
            return True
        # answer
        square_group(draw, 480, 540, 4, 2, 74, lambda r, c: coral)
        K.pill(draw, 480, 330, "Step 4 · 8", K.BOTH_COLOR, size=32)
        a = K.ease_out_cubic(K.clamp01(progress * 2.5))
        K.draw_arrow(draw, 700, 540, 700 + 220 * a, 540, coral, width=12, head=34)
        if a > 0.3:
            square_group(draw, 1260, 540, 4, 4, 74, lambda r, c: coral if r < 2 else sage)
            K.pill(draw, 1260, 300, "Step 5 · 16", sage, size=32)
            K.text_at(draw, "8", 1580, 440, font(44, bold=True), coral)
            K.text_at(draw, "+ 8", 1600, 600, font(44, bold=True), sage)
        K.pill(draw, 480, 720, "8 + 8 = 16", sage, size=44)
        star_spots([(1660, 330), (860, 330)])
        return True

    # ---- laddoo triangle -----------------------------------------------------------------
    if visual == "c5-laddoo":
        tx, ty0, gap, r = 700, 340, 126, 54

        def laddoo_rows(n_rows, dashed_last=False, new_last=False, grow=None):
            for k in range(n_rows):
                y = ty0 + k * 124
                cnt = k + 1
                a = 1.0 if grow is None else K.stagger(progress, k, step=0.16, speed=4)
                if new_last and k == n_rows - 1:
                    a = K.stagger(progress, 0, step=0.1, speed=3)
                if a <= 0:
                    continue
                for j in range(cnt):
                    x = tx + (j - (cnt - 1) / 2) * gap
                    if dashed_last and k == n_rows - 1:
                        n = 14
                        for q in range(n):
                            a0 = q * 360 / n + progress * 60
                            draw.arc((x - r, y - r, x + r, y + r), a0, a0 + 360 / n * 0.6, fill=coral, width=5)
                        K.text_at(draw, "?", x, y - 34, font(54, bold=True), coral)
                    else:
                        laddoo(draw, x, y + (1 - a) * -40, r * (0.7 + 0.3 * a))

        def tally(rows, hl_last=False, animate=True):
            for k, (left, right) in enumerate(rows):
                if animate:
                    a = K.stagger(progress, k, step=0.16, speed=4)
                else:
                    a = K.stagger(progress, 0, speed=4) if k == len(rows) - 1 else 1.0
                if a <= 0:
                    continue
                y = ty0 - 40 + k * 124
                hl = hl_last and k == len(rows) - 1
                draw.rounded_rectangle((1120, y, 1760, y + 84), radius=26, fill=sage_soft if hl else panel,
                                       outline=sage if hl else line, width=4)
                draw.text((1150, y + 20), left, font=font(38, bold=True), fill=muted)
                draw.text((1470, y + 18), right, font=font(42, bold=True), fill=sage if hl else ink)

        if focus == "intro":
            riya(draw, 330, 470, 1.2, coral, t)
            K.draw_person(draw, 760, 430, 1.2, "dad", t)
            draw.rounded_rectangle((520, 640, 1000, 840), radius=20, fill=(214, 170, 120), outline=(176, 128, 84), width=5)
            draw.ellipse((600, 600, 920, 680), fill=K.STEEL)
            for k, cnt in enumerate((3, 2, 1)):
                for j in range(cnt):
                    laddoo(draw, 760 + (j - (cnt - 1) / 2) * 62, 640 - k * 50, 30)
            K.draw_shop(draw, 1430, 560, 1.15, brand, name="MITHAI")
            K.pill(draw, 760, 260, "Shyam bhaiya", K.ROAD, size=30)
            return True
        if focus == "rows":
            laddoo_rows(3, grow=True)
            tally([("Row 1", "total 1"), ("+ row of 2", "total 3"), ("+ row of 3", "total 6")])
            return True
        if focus == "ask":
            laddoo_rows(4, dashed_last=True)
            tally([("Row 1", "total 1"), ("+ row of 2", "total 3"), ("+ row of 3", "total 6"),
                   ("+ next row?", "total ?")], animate=False)
            K.draw_stopwatch(draw, 1660, 800, 40, progress, brand)
            return True
        if focus == "answer":
            laddoo_rows(4, new_last=True)
            tally([("Row 1", "total 1"), ("+ row of 2", "total 3"), ("+ row of 3", "total 6"),
                   ("+ row of 4", "6 + 4 = 10")], hl_last=True, animate=False)
            if progress > 0.6:
                star_spots([(320, 420), (300, 700)])
            return True
        # draw
        riya(draw, 420, 470, 1.45, coral, t)
        K.pill(draw, 420, 760, "Draw the next step!", coral, size=36)
        notebook(draw, (900, 260, 1720, 840), cell=48)
        n_rows = 1 + int(K.clamp01(progress * 1.4) * 3.99)
        for k in range(n_rows):
            for j in range(k + 1):
                x = 1310 + (j - k / 2) * 110
                y = 360 + k * 112
                draw.ellipse((x - 46, y - 46, x + 46, y + 46), outline=ink, width=5)
                if k < 3:
                    draw.ellipse((x - 40, y - 40, x + 40, y + 40), fill=(255, 224, 170))
        pencil(draw, 1520, 720, 0.6, ang=-0.8)
        return True

    # ---- growing jumps ---------------------------------------------------------------------
    if visual == "c5-jumps":
        seq = ["1", "2", "4", "7", "11", "16"]
        ans = focus == "answer"
        xs = [cx + (i - 2.5) * 250 for i in range(6)]
        ty = 470
        for i, s in enumerate(seq):
            if i == 5 and not ans:
                tile(xs[i], ty, "?", coral, state="q")
            else:
                tile(xs[i], ty, s, ink if i < 5 else sage, wd=170, ht=170, state="win" if i == 5 else "normal")
        for i in range(5):
            last = i == 4
            if last and not ans:
                jump(xs[i], xs[i + 1], ty - 8, "?", coral, hgt=60, dashed=True)
            else:
                a = K.stagger(progress, i, step=0.1, speed=5) if not ans else 1.0
                if a > 0:
                    jump(xs[i], xs[i] + (xs[i + 1] - xs[i]) * a, ty - 8, f"+{i + 1}" if a >= 1 else None,
                         sage if last else K.BOTH_COLOR, hgt=60)
        base = 850
        for i in range(5):
            x = (xs[i] + xs[i + 1]) / 2
            hh = 34 * (i + 1)
            if i == 4 and not ans:
                for (a0, b0, c0, d0) in ((x - 40, base - hh, x + 40, base - hh), (x - 40, base - hh, x - 40, base),
                                         (x + 40, base - hh, x + 40, base)):
                    K.draw_dashed(draw, a0, b0, c0, d0, coral, width=4, dash=10, gap=8, phase=progress * 40)
                continue
            draw.rounded_rectangle((x - 40, base - hh, x + 40, base), radius=10, fill=sage if i == 4 else K.BOTH_COLOR)
        K.text_at(draw, "jump size", xs[0] - 10, 800, font(30, bold=True), muted)
        if ans:
            K.pill(draw, cx, 236, "11 + 5 = 16", sage, size=46)
        else:
            K.text_at(draw, "What comes next?", cx, 240, font(50, bold=True), ink)
        return True

    # ---- add the last two ---------------------------------------------------------------------
    if visual == "c5-fib":
        if focus == "intro":
            riya(draw, 360, 480, 1.3, coral, t)
            for i in range(2):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a > 0:
                    tile(980 + i * 300, 400 + int((1 - a) * 40), "1", coral, wd=230, ht=230, size=130)
            K.text_at(draw, "A special pattern", 1130, 250, font(54, bold=True), ink)
            K.text_at(draw, "…", 1580, 460, font(100, bold=True), muted)
            star_spots([(820, 760), (1440, 760)])
            return True
        if focus == "rule":
            seq = ["1", "1", "2", "3", "5"]
            xs = [cx + (i - 2) * 280 for i in range(5)]
            ty = 440
            stage = min(3, int(progress * 4.2))
            for i, s in enumerate(seq):
                if i >= 2 + stage:
                    tile(xs[i], ty, "", line, wd=180, ht=180)
                    continue
                tile(xs[i], ty, s, coral if i < 2 else K.BOTH_COLOR, wd=180, ht=180)
            eqs = ["1 + 1 = 2", "1 + 2 = 3", "2 + 3 = 5"]
            for j in range(stage):
                K.text_at(draw, eqs[j], xs[j + 2], 680, font(40, bold=True), K.BOTH_COLOR)
            if stage > 0:
                k = stage - 1
                converge(xs[k], xs[k + 1], xs[k + 2], ty - 10, sage)
            K.pill(draw, cx, 790, "Add the last two!", coral, size=38)
            return True
        seq = ["1", "1", "2", "3", "5", "8"]
        xs = [cx + (i - 2.5) * 245 for i in range(6)]
        ty = 450
        ans = focus == "answer"
        if focus in ("ask", "answer"):
            for i, s in enumerate(seq):
                if i == 5 and not ans:
                    tile(xs[i], ty, "?", coral, state="q")
                else:
                    tile(xs[i], ty, s, sage if i == 5 else (coral if i < 2 else K.BOTH_COLOR), wd=170, ht=170,
                         state="win" if i == 5 else "normal")
            if ans:
                converge(xs[3], xs[4], xs[5], ty - 10, sage)
                K.pill(draw, cx, 700, "3 + 5 = 8", sage, size=48)
                for k, wrong in enumerate(("6", "7")):
                    x = 520 + k * 200
                    draw.rounded_rectangle((x - 60, 780, x + 60, 860), radius=20, fill=K.DANGER_SOFT)
                    K.text_at(draw, wrong, x - 18, 790, font(48, bold=True), K.DANGER)
                    K.draw_cross(draw, x + 34, 820, 18, K.DANGER)
            else:
                K.text_at(draw, "What comes next?", cx, 250, font(50, bold=True), ink)
                K.draw_stopwatch(draw, cx, 760, 50, progress, brand)
            return True
        # nature
        items = [(3, PETAL_W, "3 petals"), (5, PETAL_Y, "5 petals"), (8, PETAL_P, "8 petals")]
        for i, (n, col, lab) in enumerate(items):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 480
            yy = int((1 - a) * 40)
            draw.ellipse((x - 200, 270 + yy, x + 200, 670 + yy), fill=[gold_soft, sage_soft, coral_soft][i])
            flower(draw, x, 450 + yy, 130, n, col, stem_to=700 + yy, t=t)
            K.pill(draw, x, 740 + yy, lab, [K.GOLD, sage, coral][i], size=36)
        return True

    # ---- Riya's challenge ---------------------------------------------------------------------
    if visual == "c5-game":
        seq = ["2", "3", "5", "8", "13"]
        xs = [cx + (i - 2) * 270 for i in range(5)]
        ty = 380
        ans = focus == "answer"
        for i, s in enumerate(seq):
            if i == 4 and not ans:
                tile(xs[i], ty, "?", coral, wd=190, ht=190, state="q")
            else:
                tile(xs[i], ty, s, sage if i == 4 else K.BOTH_COLOR, wd=190, ht=190, size=100,
                     state="win" if i == 4 else "normal")
        riya(draw, 330, 690, 0.95, coral, t)
        if ans:
            converge(xs[2], xs[3], xs[4], ty - 10, sage)
            K.pill(draw, 1000, 650, "5 + 8 = 13", sage, size=50)
            K.pill(draw, 1000, 770, "Pattern pro!", coral, size=38)
            K.draw_heart(draw, 470, 600 + bounce, 28, coral)
            star_spots([(1500, 700), (1700, 640), (560, 800)])
        else:
            K.text_at(draw, "Riya's challenge!", cx, 240, font(52, bold=True), coral)
            K.pill(draw, 1000, 680, "Add the last two", K.BOTH_COLOR, size=38)
            K.draw_stopwatch(draw, 1620, 740, 50, progress, brand)
        return True

    # ---- checkpoint ----------------------------------------------------------------------------
    if visual == "c5-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Grab some paper!", cx, 470 + lift, font(64, bold=True), ink)
            pencil(draw, cx - 120, 640 + lift, 0.9, ang=-0.25)
            K.draw_check(draw, cx + 230, 620 + lift, 44, sage)
            return True
        ans = focus == "answer"
        sz = 66
        xs = [220, 520, 900, 1370]
        by = 720
        for i in range(4):
            x0 = xs[i]
            rows = i + 1
            wd = rows * (sz + 5) - 5
            mx = x0 + wd / 2
            if i == 3 and not ans:
                staircase(draw, x0, by, 4, sz, K.ROAD, dashed_row=coral, phase=progress * 40)
                K.text_at(draw, "?", x0 + wd + 70, by - 170, font(int(110 + 14 * pulse), bold=True), coral)
            else:
                staircase(draw, x0, by, rows, sz, K.ROAD, new_col=(sage if (i == 3 and ans) else None))
            K.pill(draw, mx, by + 22, f"Step {i + 1}", [coral, K.ROAD, sage, K.BOTH_COLOR][i], size=30)
            total = ["1", "3", "6", "10" if ans else "?"][i]
            K.text_at(draw, total, mx, by + 86, font(44, bold=True), sage if (i == 3 and ans) else ink)
        if ans:
            K.pill(draw, cx, 236, "Next row has 4:  6 + 4 = 10", sage, size=44)
            star_spots([(1800, 420), (1300, 330)])
        else:
            K.pill(draw, cx, 236, "Add one more row. How many?", coral, size=40)
            K.draw_stopwatch(draw, 1780, 470, 44, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------------------
    if visual == "c5-recap":
        recap = [("Growing patterns follow a rule", coral, "grow"), ("Say the rule in words", K.BOTH_COLOR, "say"),
                 ("Draw the next step", sage, "draw"), ("1, 1, 2, 3, 5: add the last two", K.GOLD, "fib")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, font(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 540), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 210
                if kind == "grow":
                    for k in range(3):
                        coin_stack(draw, ix - 110 + k * 110, iy + 110, k + 1, 46)
                elif kind == "say":
                    K.draw_bubble(draw, (ix - 160, iy - 120, ix + 160, iy + 20), brand, "Add 2!", tail="left", size=48)
                elif kind == "draw":
                    staircase(draw, ix - 100, iy + 100, 3, 46, K.ROAD)
                    pencil(draw, ix + 90, iy + 40, 0.5, ang=-0.9)
                else:
                    for k, s in enumerate(("1", "1", "2", "3", "5")):
                        x = ix - 140 + k * 70
                        draw.rounded_rectangle((x - 30, iy - 10, x + 30, iy + 60), radius=14, fill=panel, outline=col,
                                               width=4)
                        K.text_at(draw, s, x, iy - 2, font(40, bold=True), ink)
                f = font(36, bold=True)
                lines = K.wrap_text(lab, f, 340)
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 46, f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 360, 90, sage, panel, bounce)
            riya(draw, cx + 300, 330, 1.0, coral, t)
            K.text_at(draw, "Chapter 5 done!", cx, 480, font(68, bold=True), ink)
            K.pill(draw, cx, 575, "Unit 1 complete!", coral, size=38)
            badges = ["Binary", "Odd & even", "Place value", "Skip counting", "Patterns"]
            for i, lab in enumerate(badges):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 300
                y = 720 + int((1 - a) * 30)
                draw.ellipse((x - 50, y - 50, x + 50, y + 50), fill=sage_soft)
                K.draw_check(draw, x, y, 34, sage)
                K.text_at(draw, lab, x, y + 62, font(30, bold=True), ink)
            star_spots([(cx - 620, 320), (cx + 620, 320), (cx - 700, 520), (cx + 700, 520)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 360, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 470, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 640, cx + 120 + 20 * pulse, 640, sage, width=16, head=46)
        riya(draw, 400, 560, 1.1, coral, t)
        K.draw_mascot(draw, int(w - 400), 640, 90, sage, panel, bounce)
        return True

    return False
