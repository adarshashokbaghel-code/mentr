"""C10 · Solving Puzzles Step by Step — visuals."""
import math

import build as K

WHITE = (255, 255, 255)
RED = (222, 56, 62)
ORANGE = (255, 140, 30)
YELLOW = (255, 210, 50)
YELLOW_DARK = (214, 156, 20)
BLUE = (60, 120, 220)
BLUE_DARK = (36, 84, 170)
GREEN = (70, 160, 90)
PURPLE = (140, 100, 220)
PINK = (236, 100, 150)
TEAL = (20, 160, 150)
BROWN = (130, 86, 50)
CAP = (150, 104, 62)
CAP_DARK = (112, 74, 40)
PAPER = (255, 250, 238)
PAPER_LINE = (220, 210, 232)
SEAT = (70, 110, 190)
SEAT_DARK = (46, 78, 150)
SKY = (206, 232, 250)

LOOKS = {
    "Chintu": ("tuft", (60, 150, 220)),
    "Arjun": ("boy", GREEN),
    "Zoya": ("long", PURPLE),
    "Riya": ("bun", PINK),
    "Sam": ("boy", ORANGE),
    "Tara": ("long", TEAL),
    "Ravi": ("boy", RED),
    "Meera": ("bun", YELLOW_DARK),
    "Neha": ("long", PINK),
    "Pinky": ("bun", PINK),
    "Golu": ("boy", ORANGE),
    "Tinku": ("tuft", GREEN),
}


def S_(s):
    return lambda v: v * s


def kid(draw, cx, cy, s, name, t=0.0, cap=False, wave=None):
    """Child bust. cy = face centre; hair top ≈ cy-80s, body bottom ≈ cy+141s."""
    style, body = LOOKS[name]
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    r = S(64)
    if style == "long":
        draw.rounded_rectangle((cx - r * 1.12, cy - r * 0.9, cx + r * 1.12, cy + r * 1.3), radius=r * 0.8, fill=K.HAIR)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    draw.polygon([(cx - S(22), cy + S(52)), (cx + S(22), cy + S(52)), (cx, cy + S(80))], fill=WHITE)
    if style == "bun":
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                         fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.8)
    if style == "tuft":
        draw.polygon([(cx - S(10), cy - r * 1.02), (cx + S(18), cy - r * 1.02), (cx + S(24), cy - r * 1.3)],
                     fill=K.HAIR)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.62 - S(10), cy + S(14), cx + sx * r * 0.62 + S(10), cy + S(28)),
                     fill=(246, 160, 150))
    if cap:
        draw.chord((cx - r * 1.1, cy - r * 1.35, cx + r * 1.1, cy - r * 0.05), 180, 360, fill=CAP)
        draw.rounded_rectangle((cx - r * 1.25, cy - r * 0.78, cx + r * 0.6, cy - r * 0.6), radius=S(6), fill=CAP_DARK)
        for k in range(3):
            draw.line((cx - r * 0.6 + k * r * 0.5, cy - r * 1.25, cx - r * 0.7 + k * r * 0.5, cy - r * 0.8),
                      fill=CAP_DARK, width=max(2, int(S(4))))
    if wave is not None:
        ang = -0.5 + 0.35 * math.sin(wave * math.pi * 6)
        hx, hy = cx + S(96) + math.cos(ang - 1.2) * S(70), cy + S(110) + math.sin(ang - 1.2) * S(70)
        draw.line((cx + S(70), cy + S(120), hx, hy), fill=body, width=max(4, int(S(26))))
        draw.ellipse((hx - S(18), hy - S(18), hx + S(18), hy + S(18)), fill=K.SKIN)


def stand(draw, cx, foot, height, name):
    """Full-body child, feet at `foot`, total height `height`."""
    style, body = LOOKS[name]
    r = height * 0.13
    head_cy = foot - height + r
    leg_top = foot - height * 0.42
    draw.ellipse((cx - r * 1.6, foot - 10, cx + r * 1.6, foot + 12), fill=K.SHADOW)
    for sx in (-1, 1):
        draw.rounded_rectangle((cx + sx * r * 0.45 - r * 0.28, leg_top, cx + sx * r * 0.45 + r * 0.28, foot),
                               radius=r * 0.2, fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - r * 1.1, head_cy + r * 1.05, cx + r * 1.1, leg_top + r * 0.3), radius=r * 0.5,
                           fill=body)
    for sx in (-1, 1):
        draw.rounded_rectangle((cx + sx * r * 1.1 - r * 0.25, head_cy + r * 1.3, cx + sx * r * 1.1 + r * 0.25,
                                leg_top + r * 0.1), radius=r * 0.25, fill=body)
    if style == "long":
        draw.rounded_rectangle((cx - r * 1.12, head_cy - r * 0.9, cx + r * 1.12, head_cy + r * 1.3), radius=r * 0.8,
                               fill=K.HAIR)
    if style == "bun":
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.95 - r * 0.32, head_cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32,
                          head_cy + r * 0.55), fill=K.HAIR)
    K.draw_face(draw, cx, head_cy, r, "kid", 0.8)
    if style == "tuft":
        draw.polygon([(cx - r * 0.15, head_cy - r * 1.02), (cx + r * 0.3, head_cy - r * 1.02),
                      (cx + r * 0.4, head_cy - r * 1.3)], fill=K.HAIR)


def shape(draw, kind, cx, cy, r, col):
    off = r * 0.1
    if kind == "circle":
        draw.ellipse((cx - r + off, cy - r + off, cx + r + off, cy + r + off), fill=K.SHADOW)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    elif kind == "square":
        q = r * 0.88
        draw.rounded_rectangle((cx - q + off, cy - q + off, cx + q + off, cy + q + off), radius=r * 0.16, fill=K.SHADOW)
        draw.rounded_rectangle((cx - q, cy - q, cx + q, cy + q), radius=r * 0.16, fill=col)
    elif kind == "triangle":
        pts = [(cx, cy - r * 1.05), (cx + r * 1.05, cy + r * 0.8), (cx - r * 1.05, cy + r * 0.8)]
        draw.polygon([(x + off, y + off) for x, y in pts], fill=K.SHADOW)
        draw.polygon(pts, fill=col)
    else:
        pts = []
        for i in range(10):
            rr = r * 1.1 if i % 2 == 0 else r * 0.48
            a = i * math.pi / 5 - math.pi / 2
            pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
        draw.polygon([(x + off, y + off) for x, y in pts], fill=K.SHADOW)
        draw.polygon(pts, fill=col)


SHAPE_COLS = {"star": K.GOLD, "circle": (255, 106, 26), "triangle": K.BOTH_COLOR, "square": (13, 148, 136)}


def hat_icon(draw, cx, cy, s, col=RED):
    S = S_(s)
    draw.ellipse((cx - S(60) + S(4), cy + S(4) + S(5), cx + S(60) + S(4), cy + S(26) + S(5)), fill=K.SHADOW)
    draw.ellipse((cx - S(60), cy + S(2), cx + S(60), cy + S(26)), fill=tuple(int(c * 0.8) for c in col))
    draw.chord((cx - S(36), cy - S(40), cx + S(36), cy + S(36)), 180, 360, fill=col)
    draw.rectangle((cx - S(36), cy - S(4), cx + S(36), cy + S(8)), fill=K.GOLD)


def bottle_icon(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(24) + S(5), cy - S(36) + S(6), cx + S(24) + S(5), cy + S(52) + S(6)),
                           radius=S(12), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(12), cy - S(56), cx + S(12), cy - S(40)), radius=S(4), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(24), cy - S(40), cx + S(24), cy + S(52)), radius=S(14), fill=(120, 190, 242))
    draw.rectangle((cx - S(24), cy - S(4), cx + S(24), cy + S(18)), fill=(62, 142, 222))
    draw.rounded_rectangle((cx - S(16), cy - S(32), cx - S(8), cy - S(10)), radius=S(4), fill=WHITE)


def thing(draw, kind, cx, cy, s):
    if kind == "hat":
        hat_icon(draw, cx, cy + 6 * s, s)
    elif kind == "bag":
        K.draw_bag(draw, cx, cy + 10 * s, 0.5 * s, K.CORAL)
    else:
        bottle_icon(draw, cx, cy, s * 0.85)


def seat(draw, cx, by, s, num, col=SEAT):
    S = S_(s)
    draw.rounded_rectangle((cx - S(80) + S(8), by - S(200) + S(10), cx + S(80) + S(8), by + S(10)), radius=S(30),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(80), by - S(200), cx + S(80), by - S(40)), radius=S(30), fill=col)
    draw.rounded_rectangle((cx - S(96), by - S(56), cx + S(96), by), radius=S(20), fill=SEAT_DARK)
    draw.ellipse((cx - S(30), by - S(180), cx + S(30), by - S(120)), fill=WHITE)
    K.text_at(draw, str(num), cx, by - S(176), K.load_font(max(26, int(S(44))), bold=True), SEAT_DARK)


def die(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(50) + S(6), cy - S(50) + S(8), cx + S(50) + S(6), cy + S(50) + S(8)),
                           radius=S(18), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(50), cy - S(50), cx + S(50), cy + S(50)), radius=S(18), fill=WHITE,
                           outline=K.DEV_MID, width=max(2, int(S(4))))
    for dx, dy in ((-24, -24), (24, -24), (0, 0), (-24, 24), (24, 24)):
        draw.ellipse((cx + S(dx) - S(9), cy + S(dy) - S(9), cx + S(dx) + S(9), cy + S(dy) + S(9)), fill=K.DEV_DARK)


def jigsaw(draw, cx, cy, s, col):
    S = S_(s)
    q = S(50)
    draw.rounded_rectangle((cx - q + S(6), cy - q + S(8), cx + q + S(6), cy + q + S(8)), radius=S(10), fill=K.SHADOW)
    draw.rounded_rectangle((cx - q, cy - q, cx + q, cy + q), radius=S(10), fill=col)
    draw.ellipse((cx + q - S(14), cy - S(18), cx + q + S(22), cy + S(18)), fill=col)
    draw.ellipse((cx - S(18), cy - q - S(22), cx + S(18), cy - q + S(14)), fill=col)
    draw.ellipse((cx - q - S(14), cy - S(16), cx - q + S(18), cy + S(16)), fill=(255, 248, 239))


def clue_note(draw, box, title, text, col, pin=True, size=38):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=18, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=18, fill=PAPER, outline=col, width=5)
    if pin:
        draw.ellipse(((x0 + x1) / 2 - 14, y0 - 14, (x0 + x1) / 2 + 14, y0 + 14), fill=col)
    if title:
        K.text_at(draw, title, (x0 + x1) / 2, y0 + 22, K.load_font(30, bold=True), col)
    K.text_at(draw, text, (x0 + x1) / 2, y0 + (68 if title else (y1 - y0) / 2 - size * 0.6), K.load_font(size, bold=True),
              (28, 36, 52))


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
    red_soft = (253, 228, 226)
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

    def qmarks(spots, size=80):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 20 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def pop(at, speed=6.0):
        return K.ease_out_cubic(K.clamp01((progress - at) * speed))

    def logic_grid(x0, y0, names, cols, marks, cell=140, name_w=300, col_kind="text", hi_row=None, hi_col=None,
                   ask_cell=None):
        """marks: {(row, col): (kind, appear_at)} with kind 'tick'/'cross'."""
        n_r, n_c = len(names), len(cols)
        gx0 = x0 + name_w
        hdr = 96
        gy0 = y0 + hdr
        draw.rounded_rectangle((x0 + 10, y0 + 12, gx0 + n_c * cell + 10, gy0 + n_r * cell + 12), radius=28,
                               fill=K.SHADOW)
        draw.rounded_rectangle((x0, y0, gx0 + n_c * cell, gy0 + n_r * cell), radius=28, fill=panel, outline=line,
                               width=3)
        if hi_row is not None:
            draw.rectangle((x0 + 4, gy0 + hi_row * cell, gx0 + n_c * cell - 4, gy0 + (hi_row + 1) * cell),
                           fill=(255, 244, 214))
        if hi_col is not None:
            draw.rectangle((gx0 + hi_col * cell, y0 + 4, gx0 + (hi_col + 1) * cell, gy0 + n_r * cell - 4),
                           fill=(255, 244, 214))
        for j, c in enumerate(cols):
            mx = gx0 + j * cell + cell / 2
            if col_kind == "text":
                K.text_at(draw, c, mx, y0 + 30, font(32, bold=True), SEAT_DARK)
            else:
                thing(draw, c, mx, y0 + 48, 0.82)
        for i, nm in enumerate(names):
            my = gy0 + i * cell + cell / 2
            kid(draw, x0 + 70, my - 16, 0.48, nm)
            draw.text((x0 + 130, my - 22), nm, fill=ink, font=font(38, bold=True))
        for j in range(n_c + 1):
            draw.line((gx0 + j * cell, y0 + (16 if j == 0 else 0), gx0 + j * cell, gy0 + n_r * cell), fill=line, width=3)
        for i in range(n_r + 1):
            draw.line((x0 + (0 if i else 0), gy0 + i * cell, gx0 + n_c * cell, gy0 + i * cell), fill=line, width=3)
        for (i, j), (kind, at) in marks.items():
            a = pop(at)
            if a <= 0:
                continue
            mx, my = gx0 + j * cell + cell / 2, gy0 + i * cell + cell / 2
            r = cell * 0.3 * (0.6 + 0.4 * a)
            if kind == "tick":
                draw.rounded_rectangle((gx0 + j * cell + 6, gy0 + i * cell + 6, gx0 + (j + 1) * cell - 6,
                                        gy0 + (i + 1) * cell - 6), radius=16, fill=sage_soft)
                K.draw_check(draw, mx, my, r, sage)
            else:
                d = r * 0.8
                draw.line((mx - d, my - d, mx + d, my + d), fill=K.DANGER, width=12)
                draw.line((mx - d, my + d, mx + d, my - d), fill=K.DANGER, width=12)
        if ask_cell is not None:
            i, j = ask_cell
            mx, my = gx0 + j * cell + cell / 2, gy0 + i * cell + cell / 2
            K.text_at(draw, "?", mx, my - 50, font(int(80 + 14 * pulse), bold=True), K.GOLD)

    def sudoku(x0, y0, cell, rows, hi_row=None, hi_col=None, fills=None, faint_rows=()):
        n = 4
        draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + n * cell + 10, y0 + n * cell + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((x0, y0, x0 + n * cell, y0 + n * cell), radius=24, fill=panel)
        if hi_row is not None:
            draw.rectangle((x0 + 4, y0 + hi_row * cell + 4, x0 + n * cell - 4, y0 + (hi_row + 1) * cell - 4),
                           fill=(255, 238, 200))
        if hi_col is not None:
            draw.rectangle((x0 + hi_col * cell + 4, y0 + 4, x0 + (hi_col + 1) * cell - 4, y0 + n * cell - 4),
                           fill=(222, 240, 236))
        for k in range(n + 1):
            wd = 6 if k in (0, 2, 4) else 3
            draw.line((x0 + k * cell, y0, x0 + k * cell, y0 + n * cell), fill=K.DEV_MID if wd == 6 else line, width=wd)
            draw.line((x0, y0 + k * cell, x0 + n * cell, y0 + k * cell), fill=K.DEV_MID if wd == 6 else line, width=wd)
        f = font(int(cell * 0.55), bold=True)
        for i, row in enumerate(rows):
            for j, v in enumerate(row):
                mx, my = x0 + j * cell + cell / 2, y0 + i * cell + cell / 2
                if v is None:
                    continue
                if v == "?":
                    K.text_at(draw, "?", mx, my - cell * 0.36, font(int(cell * (0.55 + 0.08 * pulse)), bold=True),
                              coral)
                    continue
                col = muted if i in faint_rows else ink
                if fills and (i, j) in fills:
                    col = sage
                K.text_at(draw, str(v), mx, my - cell * 0.34, f, col)

    # ---- opening -------------------------------------------------------------------
    if visual == "c10-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            kid(draw, cx + 280, 420, 1.3, "Chintu", t, wave=t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 560, 320), (cx + 600, 300), (cx - 640, 540), (cx + 660, 540)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (220, 250 + lift, w - 220, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · SETS & VENN", cx, 326 + lift, font(34, bold=True), sage)
            vx, vy, r, d = cx, 590 + lift, 190, 250
            for x, c, soft in ((vx - d / 2, RED, red_soft), (vx + d / 2, ORANGE, (255, 236, 214))):
                draw.ellipse((x - r, vy - r, x + r, vy + r), fill=soft)
            th = math.acos((d / 2) / r)
            lens = [(vx - d / 2 + r * math.cos(-th + 2 * th * i / 24), vy + r * math.sin(-th + 2 * th * i / 24))
                    for i in range(25)]
            lens += [(vx + d / 2 + r * math.cos(math.pi - th + 2 * th * i / 24),
                      vy + r * math.sin(math.pi - th + 2 * th * i / 24)) for i in range(25)]
            draw.polygon(lens, fill=(206, 190, 248))
            for x, c in ((vx - d / 2, RED), (vx + d / 2, ORANGE)):
                draw.ellipse((x - r, vy - r, x + r, vy + r), outline=c, width=7)
            K.text_at(draw, "Red", vx - d / 2 - 90, vy - 30, font(36, bold=True), RED)
            K.text_at(draw, "Round", vx + d / 2 + 90, vy - 30, font(36, bold=True), ORANGE)
            a = K.ease_in_out(K.clamp01((progress - 0.25) * 3))
            bx = K.lerp(vx + 470, vx, a)
            by = K.lerp(vy - 150, vy, a) - math.sin(math.pi * a) * 60
            draw.ellipse((bx - 34 + 5, by - 34 + 6, bx + 34 + 5, by + 34 + 6), fill=K.SHADOW)
            draw.ellipse((bx - 34, by - 34, bx + 34, by + 34), fill=RED)
            draw.ellipse((bx - 20, by - 22, bx - 6, by - 8), fill=WHITE)
            if a >= 1:
                K.pill(draw, vx, vy + 60, "BOTH", K.BOTH_COLOR, size=26)
                star_spots([(vx - 420, 460), (vx + 420, 460)])
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Solving Puzzles", cx, 350 + lift, font(80, bold=True), ink)
            K.text_at(draw, "Step by Step", cx, 446 + lift, font(40, bold=True), muted)
            for i in range(4):
                a = K.stagger(progress, i + 2, step=0.1, speed=4)
                if a <= 0:
                    continue
                x = cx - 450 + i * 300
                y = 700 + int((1 - a) * 40) - i * 20
                draw.rounded_rectangle((x - 70, y + 60, x + 70, y + 90), radius=10, fill=K.DEV_MID)
                pill_col = [coral, K.BOTH_COLOR, sage, K.GOLD][i]
                jigsaw(draw, x, y, 0.9, pill_col)
                K.text_at(draw, str(i + 1), x, y - 28, font(48, bold=True), WHITE)
            return True
        if focus == "word":
            items = [("riddle", "Riddles", coral_soft), ("jigsaw", "Brain teasers", lav_soft),
                     ("mag", "Mystery games", sage_soft)]
            for i, (kind, lab, soft) in enumerate(items):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 460
                y = 440 + int((1 - a) * 40)
                draw.ellipse((x - 150, y - 140, x + 150, y + 140), fill=soft)
                if kind == "riddle":
                    K.draw_bubble(draw, (x - 100, y - 90, x + 100, y + 40), brand, "?", tail="left", size=80)
                elif kind == "jigsaw":
                    jigsaw(draw, x - 40, y, 1.0, K.BOTH_COLOR)
                    jigsaw(draw, x + 70, y + 30, 0.7, K.GOLD)
                else:
                    K.draw_magnifier(draw, x, y, 1.2, sage)
                K.text_at(draw, lab, x, y + 160, font(38, bold=True), ink)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                die(draw, cx - 220, 790, 0.7)
                K.draw_cross(draw, cx - 170, 750, 22, K.DANGER)
                K.text_at(draw, "No guessing!", cx + 80, 762, font(52, bold=True), coral)
            return True
        # promise
        draw.ellipse((560 - 270, 560 - 270, 560 + 270, 560 + 270), fill=coral_soft)
        kid(draw, 560, 500, 1.6, "Chintu", t, cap=True)
        K.draw_magnifier(draw, 760, 700, 1.0, coral)
        K.text_at(draw, "Detective", 1300, 300 + lift, font(104, bold=True), ink)
        K.text_at(draw, "mode: ON!", 1300, 420 + lift, font(104, bold=True), coral)
        for i, c in enumerate((coral, K.BOTH_COLOR, sage)):
            a = K.stagger(progress, i + 2, step=0.1, speed=5)
            if a > 0:
                clue_note(draw, (1000 + i * 220, 640 + int((1 - a) * 30), 1180 + i * 220, 760 + int((1 - a) * 30)),
                          None, f"Clue {i + 1}", c, size=34)
        return True

    # ---- school trip hook -------------------------------------------------------------
    trio = ["Arjun", "Chintu", "Zoya"]
    if visual == "c10-hook":
        if focus == "meet":
            draw.rounded_rectangle((640, 250, 1800, 860), radius=40, fill=blue_soft, outline=line, width=3)
            for k in range(3):
                wx = 700 + k * 370
                draw.rounded_rectangle((wx, 280, wx + 320, 420), radius=24, fill=SKY, outline=(170, 200, 230), width=4)
                draw.ellipse((wx + 30 + k * 40, 310, wx + 110 + k * 40, 350), fill=WHITE)
            K.pill(draw, 1220, 430, "SCHOOL TRIP!", YELLOW_DARK, size=30)
            for k in range(3):
                a = K.stagger(progress, k + 3, step=0.12, speed=4)
                if a > 0:
                    seat(draw, 860 + k * 370, 830 + int((1 - a) * 30), 1.0, k + 1)
            for i, nm in enumerate(("Chintu", "Arjun", "Zoya")):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                y = 330 + i * 190 + int((1 - a) * 30)
                kid(draw, 220, y, 0.62, nm, t + i * 0.2)
                K.pill(draw, 0, y - 22, nm, LOOKS[nm][1], size=32, left=320)
            return True
        if focus == "clues":
            K.draw_person(draw, 300, 450, 1.25, "teacher", t)
            K.text_at(draw, "Teacher", 300, 770, font(34, bold=True), muted)
            for k, (title, txt, col) in enumerate((("CLUE 1", "Zoya sits last.", coral),
                                                   ("CLUE 2", "Chintu does not sit first.", K.BOTH_COLOR))):
                a = K.stagger(progress, k * 3, step=0.12, speed=4)
                if a <= 0:
                    continue
                y = 300 + k * 270 + int((1 - a) * 30)
                clue_note(draw, (640, y, 1700, y + 190), title, txt, col, size=56)
            return True
        if focus == "guess":
            kid(draw, 330, 470, 1.25, "Chintu", t)
            K.draw_bubble(draw, (500, 250, 1120, 400), brand, "I'll just guess!", tail="left", size=48)
            guess = ["Zoya", "Chintu", "Arjun"]
            for k, nm in enumerate(guess):
                x = 900 + k * 300
                seat(draw, x, 840, 0.85, k + 1)
                a = K.stagger(progress, k + 1, step=0.12, speed=5)
                if a > 0:
                    kid(draw, x, 600 + int((1 - a) * 30), 0.55, nm)
                    K.text_at(draw, nm, x, 470, font(30, bold=True), ink)
            if progress > 0.6:
                draw.rounded_rectangle((900 - 150, 450, 900 + 150, 860), radius=30, outline=K.DANGER, width=8)
                K.draw_cross(draw, 1040, 470, 30, K.DANGER)
                K.pill(draw, 1500, 250 + int(4 * pulse), "Zoya must be LAST!", K.DANGER, size=34)
            return True
        # ask
        draw.ellipse((cx - 300, 560 - 300, cx + 300, 560 + 300), fill=lav_soft)
        kid(draw, cx, 500, 1.4, "Chintu", t)
        qmarks([(cx - 420, 300), (cx + 380, 280), (cx - 480, 600), (cx + 440, 580)], size=96)
        die(draw, cx - 640, 760, 0.9)
        K.draw_cross(draw, cx - 580, 710, 26, K.DANGER)
        K.draw_stopwatch(draw, cx + 640, 760, 56, progress, brand)
        return True

    # ---- definitions ---------------------------------------------------------------------
    if visual == "c10-define":
        if focus == "clue":
            draw.ellipse((480 - 260, 560 - 260, 480 + 260, 560 + 260), fill=coral_soft)
            clue_note(draw, (240, 420, 720, 640), "CLUE 1", "Zoya is last.", coral, size=50)
            K.draw_magnifier(draw, 640, 700, 1.1, coral)
            a = pop(0.3, 3)
            if a > 0:
                K.shadow_card(draw, (900, 300 + lift, 1760, 800 + lift), brand, radius=40, accent=coral)
                K.text_at(draw, "A CLUE is…", 1330, 380 + lift, font(44, bold=True), muted)
                for i, (txt, col) in enumerate((("a small fact", coral), ("that helps you", ink),
                                                ("solve the puzzle", sage))):
                    b = K.stagger(progress, i + 3, step=0.1, speed=4)
                    if b > 0:
                        K.text_at(draw, txt, 1330, 470 + i * 96 + lift + int((1 - b) * 20), font(64, bold=True), col)
            return True
        if focus == "puzzle":
            K.text_at(draw, "LOGIC PUZZLE", cx, 236, font(72, bold=True), K.BOTH_COLOR)
            for k, (title, col, soft) in enumerate((("Guessing", K.DANGER, red_soft), ("Step by step", sage, sage_soft))):
                a = K.stagger(progress, k, step=0.25, speed=4)
                if a <= 0:
                    continue
                x0 = 180 if k == 0 else 1000
                y0 = 350 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 750, y0 + 512), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 740, y0 + 500), radius=40, fill=soft, outline=col, width=5)
                K.pill(draw, x0 + 370, y0 + 26, title, col, size=36)
                if k == 0:
                    die(draw, x0 + 270, y0 + 290, 1.3)
                    die(draw, x0 + 450, y0 + 320, 1.0)
                    K.draw_cross(draw, x0 + 600, y0 + 180, 40, K.DANGER)
                else:
                    for i in range(4):
                        sx = x0 + 110 + i * 140
                        sy = y0 + 420 - i * 80
                        draw.rounded_rectangle((sx, sy, sx + 130, sy + 50), radius=12, fill=panel, outline=col, width=4)
                        K.text_at(draw, str(i + 1), sx + 65, sy + 4, font(36, bold=True), col)
                    kid(draw, x0 + 110 + 3 * 140 + 65, y0 + 220, 0.5, "Chintu", t, cap=True)
                    K.draw_check(draw, x0 + 660, y0 + 130, 34, sage)
            return True
        # strategy
        K.text_at(draw, "The detective's STRATEGY", cx, 236, font(60, bold=True), ink)
        steps = [("Use one clue", coral, "clue"), ("Cross out what can't be true", K.DANGER, "cross"),
                 ("Then the next clue", K.BOTH_COLOR, "next")]
        for i, (lab, col, kind) in enumerate(steps):
            a = K.stagger(progress, i, step=0.22, speed=4)
            if a <= 0:
                continue
            x0 = 150 + i * 560
            y0 = 340 + int((1 - a) * 40)
            K.shadow_card(draw, (x0, y0, x0 + 500, y0 + 480), brand, radius=36, outline=col, outline_w=5)
            K.pill(draw, 0, y0 + 24, str(i + 1), col, size=32, left=x0 + 24)
            ix, iy = x0 + 250, y0 + 200
            if kind == "clue":
                clue_note(draw, (ix - 150, iy - 70, ix + 150, iy + 70), None, "Clue", coral, size=50)
            elif kind == "cross":
                for r_ in range(2):
                    for c_ in range(3):
                        bx, by = ix - 150 + c_ * 100, iy - 90 + r_ * 100
                        draw.rounded_rectangle((bx, by, bx + 92, by + 92), radius=12, fill=(246, 241, 233))
                        if (r_, c_) != (0, 2):
                            m = 26
                            draw.line((bx + m, by + m, bx + 92 - m, by + 92 - m), fill=K.DANGER, width=9)
                            draw.line((bx + m, by + 92 - m, bx + 92 - m, by + m), fill=K.DANGER, width=9)
                        else:
                            K.draw_check(draw, bx + 46, by + 46, 30, sage)
            else:
                K.draw_curve(draw, (ix - 140, iy + 40), (ix, iy - 120), (ix + 130, iy + 30), col, width=12)
                draw.polygon([(ix + 150, iy + 50), (ix + 100, iy + 40), (ix + 140, iy - 4)], fill=col)
                clue_note(draw, (ix - 70, iy + 40, ix + 70, iy + 110), None, "Clue 2", col, pin=False, size=30)
            f = font(36, bold=True)
            for j, ln in enumerate(K.wrap_text(lab, f, 440)):
                K.text_at(draw, ln, ix, y0 + 360 + j * 44, f, ink)
            if i < 2:
                K.draw_arrow(draw, x0 + 506, y0 + 240, x0 + 556, y0 + 240, muted, width=8, head=22)
        return True

    # ---- seats puzzle -----------------------------------------------------------------------
    if visual == "c10-seats":
        names = trio
        stage = ["setup", "clue1", "clue2", "solved"].index(focus)
        marks = {}
        if stage >= 1:
            base = 0.2 if stage == 1 else -1
            marks[(2, 2)] = ("tick", base)
            marks[(0, 2)] = ("cross", base + 0.25)
            marks[(1, 2)] = ("cross", base + 0.33)
            marks[(2, 0)] = ("cross", base + 0.45)
            marks[(2, 1)] = ("cross", base + 0.53)
        if stage >= 2:
            base = 0.0 if stage == 2 else -1
            marks[(1, 0)] = ("cross", base + 0.3)
            marks[(1, 1)] = ("tick", base + 0.62)
        if stage >= 3:
            marks[(0, 1)] = ("cross", 0.12)
            marks[(0, 0)] = ("tick", 0.3)
        logic_grid(130, 250, names, ["Seat 1", "Seat 2", "Seat 3"], marks, cell=140, name_w=300,
                   hi_col=2 if stage in (0, 1) else (0 if stage == 3 else None),
                   hi_row=1 if stage == 2 else None)
        seated = {}
        if stage >= 1 and (stage > 1 or progress > 0.25):
            seated[3] = "Zoya"
        if stage >= 2 and (stage > 2 or progress > 0.62):
            seated[2] = "Chintu"
        if stage >= 3 and progress > 0.32:
            seated[1] = "Arjun"
        for k in range(3):
            x = 1130 + k * 250
            seat(draw, x, 840, 0.85, k + 1)
            if (k + 1) in seated:
                kid(draw, x, 610, 0.55, seated[k + 1])
                K.text_at(draw, seated[k + 1], x, 470, font(32, bold=True), ink)
        if stage == 0:
            a = pop(0.35, 3)
            if a > 0:
                K.pill(draw, 1630, 300, "LAST = SEAT 3", coral, size=34)
                K.draw_arrow(draw, 1630, 370, 1630, 370 + 70 * a, coral, width=10, head=28)
        else:
            clue = {1: ("CLUE 1", "Zoya is last.", coral), 2: ("CLUE 2", "Chintu is not first.", K.BOTH_COLOR),
                    3: ("ONLY ONE LEFT", "Arjun → seat 1", sage)}[stage]
            clue_note(draw, (1060, 270, 1700, 420), clue[0], clue[1], clue[2], size=44)
        if stage == 3 and progress > 0.6:
            star_spots([(1000, 470), (1780, 470)])
        return True

    # ---- who owns the hat ----------------------------------------------------------------------
    if visual == "c10-hat":
        names = ["Riya", "Sam", "Tara"]
        stage = ["setup", "clue1", "clue2", "ask", "answer"].index(focus)
        marks = {}
        if stage >= 1:
            base = 0.15 if stage == 1 else -1
            marks[(1, 1)] = ("tick", base)
            marks[(0, 1)] = ("cross", base + 0.3)
            marks[(2, 1)] = ("cross", base + 0.38)
            marks[(1, 0)] = ("cross", base + 0.58)
            marks[(1, 2)] = ("cross", base + 0.66)
        if stage >= 2:
            base = 0.0 if stage == 2 else -1
            marks[(0, 0)] = ("cross", base + 0.25)
            marks[(0, 2)] = ("tick", base + 0.6)
        if stage >= 4:
            marks[(2, 0)] = ("tick", 0.05)
            marks[(2, 2)] = ("cross", 0.25)
        logic_grid(130, 250, names, ["hat", "bag", "bottle"], marks, cell=140, name_w=300, col_kind="icon",
                   hi_row={1: 1, 2: 0, 4: 2}.get(stage), ask_cell=(2, 0) if stage == 3 else None)
        owns = {}
        if stage >= 1 and (stage > 1 or progress > 0.2):
            owns["Sam"] = "bag"
        if stage >= 2 and (stage > 2 or progress > 0.6):
            owns["Riya"] = "bottle"
        if stage >= 4 and progress > 0.1:
            owns["Tara"] = "hat"
        for k, nm in enumerate(names):
            x = 1130 + k * 250
            draw.ellipse((x - 105, 640 - 105, x + 105, 640 + 105), fill=[coral_soft, blue_soft, sage_soft][k])
            kid(draw, x, 600, 0.62, nm, t + k * 0.3)
            K.text_at(draw, nm, x, 770, font(34, bold=True), ink)
            if nm in owns:
                thing(draw, owns[nm], x + 80, 700, 0.8)
            else:
                K.text_at(draw, "?", x + 80, 640, font(56, bold=True), K.GOLD)
        clue = {0: (None, "Who owns what?", muted), 1: ("CLUE 1", "Sam owns the bag.", coral),
                2: ("CLUE 2", "Riya has no hat.", K.BOTH_COLOR), 3: (None, "Who owns the hat?", K.GOLD),
                4: ("ONLY ONE LEFT", "Hat → Tara!", sage)}[stage]
        clue_note(draw, (1010, 270, 1650, 420), clue[0], clue[1], clue[2], size=44)
        if stage == 3:
            K.draw_stopwatch(draw, 1760, 340, 46, progress, brand)
        if stage == 4 and progress > 0.5:
            star_spots([(1680, 520), (1000, 520)])
        return True

    # ---- who is the shortest ------------------------------------------------------------------------
    heights = {"Pinky": 420, "Golu": 330, "Tinku": 240}
    if visual == "c10-tall":
        foot = 790
        if focus in ("clues", "ask"):
            pairs = [("Pinky", "Golu", "CLUE 1", coral), ("Golu", "Tinku", "CLUE 2", K.BOTH_COLOR)]
            for k, (a_nm, b_nm, title, col) in enumerate(pairs):
                a = K.stagger(progress, k * 3, step=0.12, speed=4) if focus == "clues" else 1.0
                if a <= 0:
                    continue
                x0 = 150 + k * 920
                y0 = 250 + int((1 - a) * 30)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 710, 862), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 700, 850), radius=36, fill=panel, outline=col, width=5)
                K.pill(draw, x0 + 350, y0 + 20, title, col, size=30)
                K.text_at(draw, f"{a_nm} is taller than {b_nm}", x0 + 350, y0 + 90, font(36, bold=True), ink)
                for j, nm in enumerate((a_nm, b_nm)):
                    sx = x0 + 220 + j * 260
                    stand(draw, sx, foot, heights[nm] * 0.9, nm)
                    K.text_at(draw, nm, sx, foot + 14, font(32, bold=True), LOOKS[nm][1])
                top_a = foot - heights[a_nm] * 0.9
                top_b = foot - heights[b_nm] * 0.9
                K.draw_dashed(draw, x0 + 110, top_a, x0 + 620, top_a, col, width=4)
                K.draw_arrow(draw, x0 + 630, top_b, x0 + 630, top_a + 6, col, width=8, head=22)
            if focus == "ask":
                K.text_at(draw, "?", cx, 360, font(int(130 + 20 * pulse), bold=True), K.GOLD)
                K.draw_stopwatch(draw, cx, 640, 50, progress, brand)
            return True
        # answer
        names = ["Pinky", "Golu", "Tinku"]
        for k in range(5):
            yy = foot - k * 100
            draw.line((240, yy, 1500, yy), fill=line, width=3)
        for k, nm in enumerate(names):
            a = K.ease_out_cubic(K.clamp01((progress - 0.08 - k * 0.22) * 3))
            if a <= 0:
                continue
            x = 460 + k * 400 + (1 - a) * 200
            stand(draw, x, foot, heights[nm], nm)
            K.text_at(draw, nm, x, foot - heights[nm] - 62, font(36, bold=True), LOOKS[nm][1])
            if k < 2 and a >= 1:
                K.pill(draw, x + 200, foot - heights[nm] + 40, "taller", muted, size=26)
        if progress > 0.7:
            K.pill(draw, 1660, 520, "SHORTEST!", sage, size=40)
            K.draw_arrow(draw, 1580, 600, 1340, 680, sage, width=10, head=30)
            star_spots([(1660, 420), (1760, 700)])
        return True

    # ---- sudoku lite ------------------------------------------------------------------------------------
    full = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]]
    if visual == "c10-sudoku":
        if focus == "rule":
            hr = int(progress * 6) % 4 if progress < 0.5 else None
            hc = int((progress - 0.5) * 8) % 4 if progress >= 0.5 else None
            sudoku(240, 260, 130, full, hi_row=hr, hi_col=hc)
            K.pill(draw, 500, 808, "4 rows · 4 columns", K.DEV_MID, size=28)
            rules = [("Each ROW:", "1, 2, 3, 4 once", coral), ("Each COLUMN:", "1, 2, 3, 4 once", sage),
                     ("No repeats!", "", K.BOTH_COLOR)]
            for i, (a_txt, b_txt, col) in enumerate(rules):
                a = K.stagger(progress, i + 1, step=0.16, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 170 + int((1 - a) * 30)
                draw.rounded_rectangle((900, y, 1760, y + 140), radius=36, fill=panel, outline=col, width=5)
                draw.text((940, y + 22), a_txt, fill=col, font=font(48, bold=True))
                if b_txt:
                    draw.text((940, y + 80), b_txt, fill=ink, font=font(38, bold=True))
            return True
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            vals = [1, 2, 3 if ans else None, 4]
            cell = 190
            x0 = cx - 2 * cell
            y0 = 300
            draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 4 * cell + 10, y0 + cell + 12), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 4 * cell, y0 + cell), radius=30, fill=panel, outline=K.DEV_MID, width=6)
            for j, v in enumerate(vals):
                mx = x0 + j * cell + cell / 2
                if j:
                    draw.line((x0 + j * cell, y0, x0 + j * cell, y0 + cell), fill=line, width=4)
                if v is None:
                    draw.rounded_rectangle((x0 + j * cell + 12, y0 + 12, x0 + (j + 1) * cell - 12, y0 + cell - 12),
                                           radius=20, fill=coral_soft)
                    K.text_at(draw, "?", mx, y0 + 30, font(int(110 + 14 * pulse), bold=True), coral)
                else:
                    K.text_at(draw, str(v), mx, y0 + 40, font(110, bold=True), sage if (ans and j == 2) else ink)
            K.text_at(draw, "Need: 1, 2, 3, 4", cx, 560, font(40, bold=True), muted)
            for k in range(4):
                x = cx - 330 + k * 220
                used = k != 2 or (ans and progress > 0.2)
                draw.ellipse((x - 60, 640, x + 60, 760), fill=sage_soft if used else coral_soft,
                             outline=sage if used else coral, width=5)
                K.text_at(draw, str(k + 1), x, 662, font(60, bold=True), sage if used else coral)
                if used:
                    K.draw_check(draw, x + 50, 650, 20, sage)
            if not ans:
                K.draw_stopwatch(draw, 1640, 700, 50, progress, brand)
            else:
                star_spots([(cx - 560, 400), (cx + 560, 400)])
            return True
        # shapes / square
        sq = focus == "square"
        kinds = ["star", "circle", "triangle", "square" if sq else None]
        cell = 190
        x0 = cx - 2 * cell
        y0 = 330
        draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 4 * cell + 10, y0 + cell + 12), radius=30, fill=K.SHADOW)
        draw.rounded_rectangle((x0, y0, x0 + 4 * cell, y0 + cell), radius=30, fill=panel, outline=K.DEV_MID, width=6)
        for j, kd in enumerate(kinds):
            mx, my = x0 + j * cell + cell / 2, y0 + cell / 2
            if j:
                draw.line((x0 + j * cell, y0, x0 + j * cell, y0 + cell), fill=line, width=4)
            if kd is None:
                draw.rounded_rectangle((x0 + j * cell + 12, y0 + 12, x0 + (j + 1) * cell - 12, y0 + cell - 12),
                                       radius=20, fill=coral_soft)
                K.text_at(draw, "?", mx, y0 + 30, font(int(110 + 14 * pulse), bold=True), coral)
            else:
                a = pop(0.05, 4) if (sq and j == 3) else 1.0
                shape(draw, kd, mx, my, 56 * (0.5 + 0.5 * a), SHAPE_COLS[kd])
        names = ["Star", "Circle", "Triangle", "Square" if sq else "?"]
        for j, nm in enumerate(names):
            K.text_at(draw, nm, x0 + j * cell + cell / 2, y0 + cell + 24, font(34, bold=True), ink if nm != "?" else coral)
        if sq:
            K.draw_check(draw, x0 + 4 * cell - 20, y0 + 10, 26, sage)
            K.pill(draw, cx, 700, "Each shape just once!", sage, size=40)
            star_spots([(x0 - 100, 400), (x0 + 4 * cell + 100, 400)])
        else:
            K.draw_stopwatch(draw, cx, 740, 50, progress, brand)
        return True

    # ---- tricky grid ------------------------------------------------------------------------------------
    if visual == "c10-grid":
        rows = [[1, 2, 3, 4], [3, 4, "?" if focus == "ask" else 1, 2], [None] * 4, [None] * 4]
        cell = 140
        gx, gy = 200, 270
        sudoku(gx, gy, cell, rows, hi_row=1 if focus in ("ask", "answer") else None,
               hi_col=2 if focus == "column" else None, fills={(1, 2)} if focus != "ask" else None)
        for i in range(2):
            K.text_at(draw, f"Row {i + 1}", gx + 4 * cell + 90, gy + i * cell + 48,
                      font(32, bold=True), muted)
        if focus == "ask":
            K.shadow_card(draw, (1000, 300, 1760, 640), brand, radius=36, accent=coral)
            K.text_at(draw, "Row 2 has…", 1380, 380, font(44, bold=True), muted)
            for k, v in enumerate((3, 4, 2)):
                x = 1220 + k * 160
                draw.ellipse((x - 54, 450, x + 54, 558), fill=sage_soft, outline=sage, width=5)
                K.text_at(draw, str(v), x, 466, font(56, bold=True), sage)
            K.draw_stopwatch(draw, 1380, 760, 50, progress, brand)
            return True
        if focus == "answer":
            K.shadow_card(draw, (1000, 300, 1760, 700), brand, radius=36, accent=sage)
            K.text_at(draw, "Row 2 has 3, 4, 2", 1380, 380, font(44, bold=True), ink)
            K.text_at(draw, "Missing:", 1300, 490, font(48, bold=True), muted)
            a = pop(0.1, 4)
            draw.ellipse((1500 - 70 * a, 520 - 70 * a, 1500 + 70 * a, 520 + 70 * a), fill=sage)
            if a > 0.5:
                K.text_at(draw, "1", 1500, 480, font(80, bold=True), WHITE)
            star_spots([(1100, 780), (1660, 780)])
            return True
        # column check
        colx = gx + 2 * cell + cell / 2
        K.draw_arrow(draw, colx, gy + 2 * cell + 20, colx, gy + 2 * cell + 120, sage, width=10, head=28)
        K.text_at(draw, "Column 3", colx, gy + 2 * cell + 140, font(32, bold=True), sage)
        K.shadow_card(draw, (1000, 300, 1760, 720), brand, radius=36, accent=sage)
        K.text_at(draw, "Above the blank: 3", 1380, 380, font(44, bold=True), ink)
        K.text_at(draw, "New number: 1", 1380, 460, font(44, bold=True), sage)
        a = pop(0.45, 4)
        if a > 0:
            K.draw_check(draw, 1230, 590, 40 * a, sage)
            draw.text((1290, 562), "No repeats!", fill=sage, font=font(52, bold=True))
        return True

    # ---- write your clues --------------------------------------------------------------------------------
    if visual == "c10-write":
        nb = (180, 260, 1100, 860)
        draw.rounded_rectangle((nb[0] + 12, nb[1] + 14, nb[2] + 12, nb[3] + 14), radius=26, fill=K.SHADOW)
        draw.rounded_rectangle(nb, radius=26, fill=PAPER)
        for k in range(7):
            yy = 380 + k * 70
            draw.line((nb[0] + 40, yy + 56, nb[2] - 40, yy + 56), fill=PAPER_LINE, width=3)
        draw.line((nb[0] + 110, nb[1] + 10, nb[0] + 110, nb[3] - 10), fill=(240, 170, 170), width=3)
        for k in range(6):
            draw.ellipse((nb[0] - 16, 320 + k * 90, nb[0] + 16, 352 + k * 90), fill=K.DEV_MID)
        K.text_at(draw, "My clues", 640, 290, font(48, bold=True), coral)
        lines = [("Seat 3 = Zoya", "(clue 1)"), ("Seat 2 = Chintu", "(clue 2)"), ("Seat 1 = Arjun", "(only one left)")]
        if focus == "habit":
            n_shown = 1
            typed = K.clamp01(progress * 1.6)
        elif focus == "example":
            n_shown = 2
            typed = None
        else:
            n_shown = 3
            typed = None
        for i, (a_txt, b_txt) in enumerate(lines[:n_shown]):
            y = 400 + i * 140
            if focus == "example":
                a = 1.0 if i == 0 else K.clamp01((progress - 0.3) * 2.2)
            elif typed is not None:
                a = typed
            else:
                a = 1.0
            if a <= 0:
                continue
            full_txt = a_txt
            shown = full_txt[: max(1, int(len(full_txt) * a))]
            draw.text((nb[0] + 140, y), shown, fill=ink, font=font(52, bold=True))
            if a >= 1:
                draw.text((nb[0] + 140, y + 66), b_txt, fill=K.BOTH_COLOR, font=font(36, bold=True))
                if focus == "why":
                    K.draw_check(draw, nb[2] - 70, y + 40, 26, sage)
        if focus == "why":
            K.draw_magnifier(draw, 980, 760, 1.0, coral)
            K.pill(draw, 1480, 300, "Check your answer!", sage, size=36)
            kid(draw, 1480, 520, 1.1, "Chintu", t, cap=True)
            K.text_at(draw, "Find where you slipped", 1480, 790, font(34, bold=True), muted)
        else:
            kid(draw, 1450, 480, 1.25, "Chintu", t, cap=True)
            px = 1180 + 20 * math.sin(t * 20)
            draw.polygon([(px, 740), (px + 24, 724), (px + 124, 604), (px + 100, 588)], fill=YELLOW)
            draw.polygon([(px, 740), (px - 14, 760), (px + 24, 724)], fill=K.DEV_DEEP)
            K.pill(draw, 1450, 790, "Write it down!", coral, size=36)
        return True

    # ---- checkpoint -----------------------------------------------------------------------------------------
    if visual == "c10-check":
        if focus == "intro":
            K.shadow_card(draw, (420, 290 + lift, w - 420, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Detective time!", cx, 460 + lift, font(64, bold=True), ink)
            K.draw_magnifier(draw, cx - 90, 620 + lift, 0.9, coral)
            K.draw_check(draw, cx + 90, 620 + lift, 44, sage)
            return True
        ans = focus == "answer"
        kids3 = ["Ravi", "Meera", "Neha"]
        target = {"Meera": 2, "Ravi": 1, "Neha": 0}
        when = {"Meera": 0.1, "Ravi": 0.32, "Neha": 0.55}
        clue_note(draw, (140, 270, 640, 400), "CLUE 1", "Ravi is NOT first.", coral, size=38)
        clue_note(draw, (140, 450, 640, 580), "CLUE 2", "Meera is LAST.", K.BOTH_COLOR, size=38)
        for k in range(3):
            seat(draw, 900 + k * 300, 850, 0.8, k + 1)
        for i, nm in enumerate(kids3):
            home = (240 + i * 180, 720)
            seat_x = 900 + target[nm] * 300
            a = K.ease_in_out(K.clamp01((progress - when[nm]) * 4)) if ans else 0.0
            x = K.lerp(home[0], seat_x, a)
            y = K.lerp(home[1], 640, a) - math.sin(math.pi * a) * 220
            kid(draw, x, y, 0.5, nm)
            K.text_at(draw, nm, x, y + 80 - 170 * a, font(28, bold=True), ink)
        if not ans:
            K.pill(draw, 1200, 300, "Who can be first?", coral, size=40)
            K.text_at(draw, "Pause & try on paper", 1200, 400, font(34, bold=True), muted)
            K.text_at(draw, "?", 900, 560, font(int(90 + 14 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1700, 330, 46, progress, brand)
        elif progress > 0.75:
            K.pill(draw, 1200, 300, "Neha is first!", sage, size=44)
            star_spots([(1000, 420), (1460, 420)])
        return True

    # ---- recap ------------------------------------------------------------------------------------------------
    if visual == "c10-recap":
        recap = [("One clue at a time", coral, "clue"), ("Cross out what can't be true", K.DANGER, "cross"),
                 ("Each number once per row & column", K.BOTH_COLOR, "grid"), ("Write down your clues", sage, "note")]
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
                ix, iy = x0 + 200, y0 + 200
                if kind == "clue":
                    clue_note(draw, (ix - 130, iy - 70, ix + 130, iy + 70), None, "Clue 1", coral, size=48)
                elif kind == "cross":
                    for c_ in range(3):
                        bx = ix - 140 + c_ * 96
                        draw.rounded_rectangle((bx, iy - 44, bx + 88, iy + 44), radius=12, fill=(246, 241, 233))
                        if c_ < 2:
                            draw.line((bx + 24, iy - 20, bx + 64, iy + 20), fill=K.DANGER, width=9)
                            draw.line((bx + 24, iy + 20, bx + 64, iy - 20), fill=K.DANGER, width=9)
                        else:
                            K.draw_check(draw, bx + 44, iy, 26, sage)
                elif kind == "grid":
                    sudoku(ix - 120, iy - 120, 60, full)
                else:
                    draw.rounded_rectangle((ix - 110, iy - 120, ix + 110, iy + 120), radius=16, fill=PAPER,
                                           outline=line, width=3)
                    for k in range(4):
                        yy = iy - 80 + k * 52
                        draw.rounded_rectangle((ix - 80, yy, ix + 50, yy + 14), radius=7, fill=PAPER_LINE)
                        K.draw_check(draw, ix + 80, yy + 7, 13, sage)
                f = font(34, bold=True)
                for j, ln in enumerate(K.wrap_text(lab, f, 350)):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 44, f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 420), 450, 100, sage, panel, bounce)
            kid(draw, cx + 420, 410, 1.1, "Chintu", t, cap=True, wave=t)
            tx, ty = cx, 440
            draw.ellipse((tx - 150, ty - 150, tx + 150, ty + 150), fill=(255, 244, 204))
            draw.chord((tx - 80, ty - 110, tx + 80, ty + 60), 0, 180, fill=K.GOLD)
            draw.rectangle((tx - 80, ty - 110, tx + 80, ty - 25), fill=K.GOLD)
            draw.arc((tx + 40, ty - 90, tx + 120, ty - 10), 270, 90, fill=(214, 150, 30), width=12)
            draw.arc((tx - 120, ty - 90, tx - 40, ty - 10), 90, 270, fill=(214, 150, 30), width=12)
            draw.rectangle((tx - 16, ty + 50, tx + 16, ty + 90), fill=(214, 150, 30))
            draw.rounded_rectangle((tx - 70, ty + 86, tx + 70, ty + 116), radius=8, fill=K.DEV_DARK)
            K.draw_star(draw, tx, ty - 50, 34, WHITE)
            K.text_at(draw, "Chapter 5 done!", cx, 650, font(68, bold=True), ink)
            K.pill(draw, cx, 750, "Unit 2 complete!", coral, size=40)
            star_spots([(cx - 700, 320), (cx + 700, 300), (cx - 760, 600), (cx + 760, 600)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
