"""C8 · Sorting and Comparing — visuals."""
import math

import build as K

RED = (226, 62, 70)
BLUE = (60, 120, 220)
PINK = (238, 104, 158)
ORANGE = (255, 150, 30)
YELLOW = (255, 206, 84)
YELLOW_DARK = (226, 150, 16)
WOOD = (214, 170, 120)
WOOD_DARK = (150, 104, 66)
CROC = (92, 170, 92)
CROC_DARK = (60, 128, 64)
CROC_BELLY = (196, 226, 150)
MOUTH = (240, 150, 160)
GLASS = (226, 242, 250)
GLASS_EDGE = (150, 186, 210)
TEN_C = (72, 118, 214)
ONE_C = (255, 150, 30)
HUND_C = (123, 97, 214)
WATER = (178, 220, 240)

MARBLE_COLS = [(226, 62, 70), (60, 120, 220), (255, 186, 60), (13, 148, 136), (123, 97, 214), (238, 104, 158)]


def S_(s):
    return lambda v: v * s


# ---------------------------------------------------------------------------
# characters & things
# ---------------------------------------------------------------------------

def kid(draw, cx, cy, s, body, t=0.0, bun=True):
    """Child bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    if bun:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                         fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)


def marble(draw, cx, cy, r, col):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    draw.ellipse((cx - r * 0.55, cy - r * 0.6, cx - r * 0.05, cy - r * 0.1), fill=(255, 255, 255))


def jar(draw, cx, by, s, n, seed=0):
    """Glass jar, base at by; spans cx ± 80s, by-200s … by."""
    S = S_(s)
    draw.rounded_rectangle((cx - S(80) + S(8), by - S(180) + S(10), cx + S(80) + S(8), by + S(10)), radius=S(30),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(80), by - S(180), cx + S(80), by), radius=S(30), fill=GLASS, outline=GLASS_EDGE,
                           width=max(2, int(S(5))))
    r = S(13)
    per_row = 5
    for k in range(min(n, 30)):
        row, col = divmod(k, per_row)
        mx = cx - S(56) + col * S(28) + (S(14) if row % 2 else 0)
        my = by - S(22) - row * S(24)
        if mx > cx + S(62):
            mx -= S(28)
        marble(draw, mx, my, r, MARBLE_COLS[(k * 7 + seed) % len(MARBLE_COLS)])
    draw.rounded_rectangle((cx - S(64), by - S(206), cx + S(64), by - S(176)), radius=S(10), fill=K.CORAL)
    draw.line((cx - S(56), by - S(150), cx - S(56), by - S(40)), fill=(255, 255, 255), width=max(2, int(S(8))))


def laddoo(draw, cx, cy, r):
    draw.ellipse((cx - r + r * 0.12, cy - r + r * 0.16, cx + r + r * 0.12, cy + r + r * 0.16), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=ORANGE)
    for k in range(5):
        a = k * 1.3
        draw.ellipse((cx + math.cos(a) * r * 0.5 - r * 0.1, cy + math.sin(a) * r * 0.5 - r * 0.1,
                      cx + math.cos(a) * r * 0.5 + r * 0.1, cy + math.sin(a) * r * 0.5 + r * 0.1), fill=(214, 110, 20))
    draw.ellipse((cx - r * 0.55, cy - r * 0.6, cx - r * 0.15, cy - r * 0.2), fill=(255, 210, 130))


def ten_rod(draw, x, y, u, col=TEN_C):
    """Ten stacked cubes, top-left at (x, y), cube size u."""
    draw.rectangle((x + 4, y + 5, x + u + 4, y + 10 * u + 5), fill=K.SHADOW)
    for k in range(10):
        draw.rectangle((x, y + k * u, x + u, y + (k + 1) * u), fill=col, outline=(255, 255, 255), width=2)


def one_cube(draw, x, y, u, col=ONE_C):
    draw.rectangle((x + 3, y + 4, x + u + 3, y + u + 4), fill=K.SHADOW)
    draw.rectangle((x, y, x + u, y + u), fill=col, outline=(255, 255, 255), width=2)


def blocks(draw, x, by, tens, ones, u=22):
    """Place-value blocks standing on baseline by, starting at x. Returns right edge."""
    for k in range(tens):
        ten_rod(draw, x + k * (u + 8), by - 10 * u, u)
    ox = x + tens * (u + 8) + 14
    for k in range(ones):
        row, col = divmod(k, 3)
        one_cube(draw, ox + col * (u + 4), by - (row + 1) * (u + 4), u)
    return ox + 3 * (u + 4)


def sign_glyph(draw, cx, cy, kind, size, col, width=None):
    width = width or max(6, int(size * 0.16))
    hs = size / 2
    if kind == ">":
        draw.line([(cx - hs * 0.8, cy - hs), (cx + hs * 0.8, cy), (cx - hs * 0.8, cy + hs)], fill=col, width=width,
                  joint="curve")
    elif kind == "<":
        draw.line([(cx + hs * 0.8, cy - hs), (cx - hs * 0.8, cy), (cx + hs * 0.8, cy + hs)], fill=col, width=width,
                  joint="curve")
    else:
        for dy in (-hs * 0.32, hs * 0.32):
            draw.line((cx - hs * 0.8, cy + dy, cx + hs * 0.8, cy + dy), fill=col, width=width)


def croc(draw, cx, cy, s, d, open_t=1.0, t=0.0):
    """Crocodile whose jaws make the sign. d=+1 → mouth opens right ('<'), d=-1 → opens left ('>')."""
    S = S_(s)
    hx = cx - d * S(110)
    L = S(230)
    a = math.radians(6 + 24 * K.clamp01(open_t))
    up = (hx + d * L * math.cos(a), cy - L * math.sin(a))
    lo = (hx + d * L * math.cos(a), cy + L * math.sin(a))
    draw.polygon([(hx, cy), up, lo], fill=MOUTH)
    thick = S(56)

    def jaw(p1, col, upper):
        draw.line([(hx, cy), p1], fill=col, width=int(thick))
        draw.ellipse((p1[0] - thick / 2, p1[1] - thick / 2, p1[0] + thick / 2, p1[1] + thick / 2), fill=col)
        dx, dy = p1[0] - hx, p1[1] - cy
        ln = math.hypot(dx, dy)
        ux, uy = dx / ln, dy / ln
        nx, ny = -uy, ux
        if (ny > 0) != (not upper):
            nx, ny = -nx, -ny
        inner = -1
        for k in range(5):
            f = 0.3 + k * 0.14
            bx, by = hx + dx * f, cy + dy * f
            ex, ey = bx + inner * nx * thick * 0.45, by + inner * ny * thick * 0.45
            tw = thick * 0.18
            tip = (ex + inner * nx * thick * 0.28, ey + inner * ny * thick * 0.28)
            draw.polygon([(ex - ux * tw, ey - uy * tw), (ex + ux * tw, ey + uy * tw), tip], fill=(255, 255, 255))
        return ux, uy, nx, ny

    draw.ellipse((hx - thick * 0.6, cy - thick * 0.6, hx + thick * 0.6, cy + thick * 0.6), fill=CROC_DARK)
    jaw(lo, CROC_DARK, False)
    ux, uy, nx, ny = jaw(up, CROC, True)
    for k in range(3):
        f = 0.35 + k * 0.18
        bx, by = hx + (up[0] - hx) * f + nx * thick * 0.42, cy + (up[1] - cy) * f + ny * thick * 0.42
        draw.ellipse((bx - S(9), by - S(9), bx + S(9), by + S(9)), fill=CROC_DARK)
    ex, ey = hx + (up[0] - hx) * 0.14 + nx * thick * 0.55, cy + (up[1] - cy) * 0.14 + ny * thick * 0.55
    draw.ellipse((ex - S(30), ey - S(30), ex + S(30), ey + S(30)), fill=CROC)
    draw.ellipse((ex - S(21), ey - S(21), ex + S(21), ey + S(21)), fill=(255, 255, 255))
    draw.ellipse((ex + d * S(6) - S(10), ey - S(8), ex + d * S(6) + S(10), ey + S(12)), fill=K.DEV_DEEP)
    tx, ty = up[0] - ux * S(14) + nx * S(14), up[1] - uy * S(14) + ny * S(14)
    draw.ellipse((tx - S(6), ty - S(6), tx + S(6), ty + S(6)), fill=CROC_DARK)


def num_card(draw, brand, cx, cy, n, col=None, w=230, h=170, size=110, fill=None, outline=None):
    ink = K.hex_rgb(brand["ink"])
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=28, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=28, fill=fill or K.hex_rgb(brand["panel"]),
                           outline=outline or K.hex_rgb(brand["line"]), width=5 if outline else 3)
    K.text_at(draw, str(n), cx, cy - size * 0.62, K.load_font(size, bold=True), col or ink)


def toy_car(draw, cx, cy, s, col):
    S = S_(s)
    dark = tuple(int(c * 0.75) for c in col)
    draw.rounded_rectangle((cx - S(64), cy - S(22), cx + S(64), cy + S(20)), radius=S(14), fill=col)
    draw.polygon([(cx - S(36), cy - S(20)), (cx - S(20), cy - S(50)), (cx + S(24), cy - S(50)), (cx + S(42), cy - S(20))],
                 fill=dark)
    draw.polygon([(cx - S(26), cy - S(22)), (cx - S(14), cy - S(42)), (cx - S(2), cy - S(42)),
                  (cx - S(2), cy - S(22))], fill=(214, 238, 250))
    draw.polygon([(cx + S(4), cy - S(22)), (cx + S(4), cy - S(42)), (cx + S(20), cy - S(42)), (cx + S(32), cy - S(22))],
                 fill=(214, 238, 250))
    for wx in (cx - S(36), cx + S(36)):
        draw.ellipse((wx - S(17), cy + S(4), wx + S(17), cy + S(38)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(7), cy + S(14), wx + S(7), cy + S(28)), fill=K.STEEL)
    draw.ellipse((cx + S(54), cy - S(12), cx + S(64), cy - S(2)), fill=K.GOLD)


def car_box(draw, cx, by, n, col, s=1.0, crossed=False, glow=False, dim=False):
    """Cardboard box with a big number; spans cx ± 105s, by-205s … by."""
    S = S_(s)
    if not dim:
        toy_car(draw, cx + S(10), by - S(150), s * 0.8, col)
    body = (230, 214, 196) if dim else WOOD
    edge = (200, 190, 180) if dim else WOOD_DARK
    draw.rectangle((cx - S(100) + S(8), by - S(130) + S(10), cx + S(100) + S(8), by + S(10)), fill=K.SHADOW)
    draw.rectangle((cx - S(100), by - S(130), cx + S(100), by), fill=body, outline=edge, width=max(2, int(S(4))))
    draw.polygon([(cx - S(100), by - S(130)), (cx - S(118), by - S(158)), (cx - S(20), by - S(158)), (cx, by - S(130))],
                 fill=edge)
    draw.polygon([(cx + S(100), by - S(130)), (cx + S(118), by - S(158)), (cx + S(20), by - S(158)), (cx, by - S(130))],
                 fill=edge)
    if glow:
        draw.rectangle((cx - S(100), by - S(130), cx + S(100), by), outline=(13, 148, 136), width=max(3, int(S(8))))
    K.text_at(draw, str(n), cx, by - S(112), K.load_font(max(26, int(S(80))), bold=True),
              (190, 180, 170) if dim else K.DEV_DEEP)
    if crossed:
        draw.line((cx - S(90), by - S(20), cx + S(90), by - S(118)), fill=K.DANGER, width=max(4, int(S(12))))


def pencil(draw, x0, cy, length, col):
    body_end = x0 + length - 46
    draw.rectangle((x0 + 4, cy - 20 + 6, x0 + length + 4, cy + 20 + 6), fill=K.SHADOW)
    draw.rounded_rectangle((x0, cy - 20, x0 + 30, cy + 20), radius=8, fill=PINK)
    draw.rectangle((x0 + 26, cy - 20, x0 + 44, cy + 20), fill=K.STEEL)
    draw.rectangle((x0 + 44, cy - 20, body_end, cy + 20), fill=col)
    draw.line((x0 + 44, cy - 6, body_end, cy - 6), fill=tuple(min(255, c + 40) for c in col), width=4)
    draw.polygon([(body_end, cy - 20), (x0 + length - 12, cy - 4), (x0 + length - 12, cy + 4), (body_end, cy + 20)],
                 fill=(240, 210, 170))
    draw.polygon([(x0 + length - 18, cy - 6), (x0 + length, cy), (x0 + length - 18, cy + 6)], fill=K.DEV_DARK)


def balance(draw, cx, cy, s, tilt, lw, rw, brand):
    """tilt>0 → left side down. lw/rw: labels on the pans."""
    S = S_(s)
    draw.polygon([(cx - S(70), cy + S(170)), (cx + S(70), cy + S(170)), (cx, cy + S(140))], fill=K.DEV_DARK)
    draw.rectangle((cx - S(8), cy, cx + S(8), cy + S(150)), fill=K.DEV_DARK)
    a = math.radians(12) * tilt
    lx, ly = cx - S(150) * math.cos(a), cy + S(150) * math.sin(a)
    rx, ry = cx + S(150) * math.cos(a), cy - S(150) * math.sin(a)
    draw.line((lx, ly, rx, ry), fill=K.DEV_MID, width=max(3, int(S(12))))
    draw.ellipse((cx - S(14), cy - S(14), cx + S(14), cy + S(14)), fill=K.GOLD)
    for px, py, lab in ((lx, ly, lw), (rx, ry, rw)):
        draw.line((px, py, px - S(50), py + S(70)), fill=K.DEV_MID, width=max(2, int(S(4))))
        draw.line((px, py, px + S(50), py + S(70)), fill=K.DEV_MID, width=max(2, int(S(4))))
        draw.chord((px - S(80), py + S(30), px + S(80), py + S(130)), 0, 180, fill=K.STEEL)
        K.text_at(draw, lab, px, py + S(72), K.load_font(max(26, int(S(44))), bold=True), K.hex_rgb(brand["ink"]))


def stairs(draw, x0, by, step_w, step_h, n, col, up=True):
    for k in range(n):
        hgt = step_h * (k + 1 if up else n - k)
        x = x0 + k * step_w
        draw.rectangle((x + 6, by - hgt + 8, x + step_w + 6, by + 8), fill=K.SHADOW)
        draw.rectangle((x, by - hgt, x + step_w, by), fill=col, outline=(255, 255, 255), width=3)


# ---------------------------------------------------------------------------
# render
# ---------------------------------------------------------------------------

CAR_BOXES = [12, 5, 30, 21, 9]
CAR_COLS = {12: RED, 5: BLUE, 30: (13, 148, 136), 21: (123, 97, 214), 9: ORANGE}
PENCILS = [9, 14, 6, 11, 8]
PENCIL_COLS = {9: (255, 186, 60), 14: (60, 120, 220), 6: (226, 62, 70), 11: (13, 148, 136), 8: (123, 97, 214)}
MESSY_ROLLS = [14, 3, 22, 9, 30, 17, 5, 26, 11, 1, 19, 28, 7, 24, 2, 15, 29, 10, 21, 6, 13, 27, 4, 18, 25, 8, 20, 12,
               23, 16]


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
    red_soft = (252, 228, 228)
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

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def tile_row(nums, y, cw=170, gap=40, size=80, states=None, signs=None, sign_col=None):
        n = len(nums)
        x_start = cx - (n * cw + (n - 1) * gap) / 2
        xs = []
        for i, v in enumerate(nums):
            x = x_start + i * (cw + gap) + cw / 2
            xs.append(x)
            st = states[i] if states else None
            fill = sage_soft if st == "good" else red_soft if st == "bad" else coral_soft if st == "hot" else None
            out = sage if st == "good" else K.DANGER if st == "bad" else coral if st == "hot" else None
            num_card(draw, brand, x, y, v, w=cw, h=int(cw * 0.86), size=size, fill=fill, outline=out)
        if signs:
            for i, sg in enumerate(signs):
                if sg:
                    sign_glyph(draw, (xs[i] + xs[i + 1]) / 2, y, sg, 30, sign_col[i] if sign_col else muted, width=7)
        return xs

    # ---- opening -----------------------------------------------------------
    if visual == "c8-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            kid(draw, cx + 260, 430, 1.2, BLUE, t, bun=False)
            jar(draw, cx + 470, 620, 0.8, 18)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 600, 320), (cx + 640, 300), (cx - 680, 560), (cx + 720, 520)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · AND, OR, NOT", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("AND", K.BOTH_COLOR, "needs both", (True, True)), ("OR", sage, "at least one", (True, False)),
                     ("NOT", coral, "flips it", None)]
            for i, (wd, col, lab, marks) in enumerate(specs):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 440
                y = 430 + lift + int((1 - a) * 40)
                draw.rounded_rectangle((x - 180, y, x + 180, y + 360), radius=32, fill=[lav_soft, sage_soft, coral_soft][i])
                K.pill(draw, x, y + 28, wd, col, size=44)
                if marks:
                    for k, ok in enumerate(marks):
                        (K.draw_check if ok else K.draw_cross)(draw, x - 60 + k * 120, y + 180, 34,
                                                               sage if ok else K.DANGER)
                else:
                    K.text_at(draw, "T", x - 80, y + 150, font(60, bold=True), sage)
                    K.draw_arrow(draw, x - 40, y + 186, x + 40, y + 186, muted, width=8, head=22)
                    K.text_at(draw, "F", x + 80, y + 150, font(60, bold=True), K.DANGER)
                K.text_at(draw, lab, x, y + 270, font(38, bold=True), ink)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Sorting and Comparing", cx, 360 + lift, font(86, bold=True), ink)
            vals = [5, 9, 12, 21, 30]
            for i, v in enumerate(vals):
                a = K.stagger(progress, i + 1, step=0.08, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 190
                hgt = int((40 + v * 7) * a)
                draw.rounded_rectangle((x - 60, 860 - hgt, x + 60, 860), radius=16, fill=CAR_COLS[v])
                K.text_at(draw, str(v), x, 860 - hgt - 52, font(40, bold=True), ink)
            return True
        # promise
        num_card(draw, brand, cx - 420, 400 + lift, 36, BLUE)
        num_card(draw, brand, cx + 420, 400 + lift, 63, coral)
        question_marks([(cx, 330)], size=110)
        for i, v in enumerate([5, 9, 12, 21, 30]):
            a = K.stagger(progress, i + 2, step=0.08, speed=5)
            if a <= 0:
                continue
            x = cx + (i - 2) * 150
            hgt = int((20 + v * 6) * a)
            draw.rounded_rectangle((x - 50, 860 - hgt, x + 50, 860), radius=14, fill=CAR_COLS[v])
        K.text_at(draw, "Bigger?", cx - 650, 640, font(48, bold=True), sage)
        K.text_at(draw, "In order?", cx + 650, 640, font(48, bold=True), K.BOTH_COLOR)
        return True

    # ---- marbles hook -------------------------------------------------------------
    if visual == "c8-hook":
        if focus in ("meet", "count"):
            draw.ellipse((470 - 280, 560 - 280, 470 + 280, 560 + 280), fill=blue_soft)
            draw.ellipse((1450 - 280, 560 - 280, 1450 + 280, 560 + 280), fill=coral_soft)
            kid(draw, 400, 430, 1.25, BLUE, t, bun=False)
            kid(draw, 1380, 430, 1.25, PINK, t + 0.3, bun=True)
            jar(draw, 610, 760, 0.95, 36, 1)
            jar(draw, 1590, 760, 0.95, 63, 4)
            if focus == "meet":
                K.pill(draw, 400, 230, "Aarav", BLUE, size=40)
                K.pill(draw, 1380, 230, "Zara", PINK, size=40)
                for k in range(6):
                    a = k * 1.05 + t * 2
                    marble(draw, cx + math.cos(a) * 120, 520 + math.sin(a) * 120, 22,
                           MARBLE_COLS[k % len(MARBLE_COLS)])
            else:
                c1 = int(36 * K.clamp01(progress * 2.4))
                c2 = int(63 * K.clamp01(progress * 2.4 - 1.0))
                num_card(draw, brand, cx - 160, 420, c1, BLUE, w=220, h=150, size=100)
                if progress > 0.42:
                    num_card(draw, brand, cx + 160, 420, c2, coral, w=220, h=150, size=100)
                K.text_at(draw, "marbles each", cx, 540, font(40, bold=True), muted)
                K.pill(draw, 400, 230, "Aarav", BLUE, size=36)
                K.pill(draw, 1380, 230, "Zara", PINK, size=36)
            return True
        if focus == "ask":
            num_card(draw, brand, cx - 360, 470, 36, BLUE, w=340, h=260, size=170)
            num_card(draw, brand, cx + 360, 470, 63, coral, w=340, h=260, size=170)
            K.text_at(draw, "?", cx, 380, font(int(150 + 20 * pulse), bold=True), K.GOLD)
            kid(draw, 230, 700, 0.8, BLUE, 0, bun=False)
            kid(draw, 1690, 700, 0.8, PINK, 0, bun=True)
            K.pill(draw, cx, 680, "Same digits: 3 and 6", K.BOTH_COLOR, size=38)
            K.draw_stopwatch(draw, cx, 810, 40, progress, brand)
            return True
        if focus == "answer":
            for k, (n, tens, ones, col, soft, x0) in enumerate(((36, 3, 6, BLUE, blue_soft, 180),
                                                                 (63, 6, 3, coral, coral_soft, 1000))):
                win = n == 63
                draw.rounded_rectangle((x0, 250, x0 + 740, 860), radius=36, fill=sage_soft if win else soft,
                                       outline=sage if win else col, width=6 if win else 4)
                K.text_at(draw, str(n), x0 + 140, 280, font(120, bold=True), col)
                a = K.stagger(progress, k, step=0.2, speed=4)
                blocks(draw, x0 + 300, 520, tens if a > 0.3 else 0, ones if a > 0.6 else 0, u=24)
                K.text_at(draw, f"{tens} tens", x0 + 220, 600, font(48, bold=True), TEN_C)
                K.text_at(draw, f"{ones} ones", x0 + 520, 600, font(48, bold=True), ONE_C)
                if win:
                    K.draw_check(draw, x0 + 680, 300, 30, sage)
            b = K.stagger(progress, 3, step=0.12, speed=4)
            if b > 0:
                K.pill(draw, cx, 740, "6 tens > 3 tens, so 63 is bigger!", sage, size=40)
            return True
        # define
        K.text_at(draw, "COMPARING", cx, 236 + lift, font(90, bold=True), K.BOTH_COLOR)
        specs = [(1, "63", "36", "bigger"), (-1, "36", "63", "smaller"), (0, "7", "7", "the same")]
        for i, (tilt, l_, r_, lab) in enumerate(specs):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 560
            y = 480 + int((1 - a) * 30)
            balance(draw, x, y, 0.95, tilt * a, l_, r_, brand)
            K.text_at(draw, lab, x, y + 200, font(46, bold=True), [sage, coral, K.BOTH_COLOR][i])
        return True

    # ---- the signs ---------------------------------------------------------------------
    if visual == "c8-signs":
        if focus == "intro":
            specs = [(">", "greater than", sage), ("<", "less than", coral), ("=", "equal", K.BOTH_COLOR)]
            for i, (sg, lab, col) in enumerate(specs):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                y0 = 280 + int((1 - a) * 40)
                K.shadow_card(draw, (x - 220, y0, x + 220, y0 + 540), brand, radius=40, outline=col, outline_w=5)
                sign_glyph(draw, x, y0 + 220, sg, 200, col)
                K.text_at(draw, lab, x, y0 + 420, font(50, bold=True), ink)
            return True
        specs = {"greater": (9, 4, ">", "greater than", sage), "less": (3, 8, "<", "less than", coral),
                 "equal": (7, 7, "=", "equal", K.BOTH_COLOR)}
        a_, b_, sg, lab, col = specs[focus]
        num_card(draw, brand, cx - 440, 330, a_, ink, w=240, h=180, size=130)
        num_card(draw, brand, cx + 440, 330, b_, ink, w=240, h=180, size=130)
        sa = K.ease_out_cubic(K.clamp01(progress * 3 - 0.3))
        if sa > 0:
            sign_glyph(draw, cx, 330, sg, int(150 * sa) + 1, col)
        K.pill(draw, cx, 450, lab, col, size=40)
        for side, n in ((-1, a_), (1, b_)):
            bx = cx + side * 440
            draw.rounded_rectangle((bx - 300, 540, bx + 300, 860), radius=36, fill=panel, outline=line, width=3)
            for k in range(n):
                ai = K.stagger(progress, k, step=0.04, speed=6)
                if ai <= 0:
                    continue
                row, c_ = divmod(k, 5)
                per = min(5, n - row * 5)
                x = bx - (per - 1) * 55 + c_ * 110
                y = 630 + row * 130 + int((1 - ai) * 20)
                if focus == "greater":
                    laddoo(draw, x, y, 42)
                elif focus == "less":
                    marble(draw, x, y, 40, MARBLE_COLS[k % len(MARBLE_COLS)])
                else:
                    K.draw_star(draw, x, y, 46, K.GOLD, rot=0.1)
        return True

    # ---- crocodile ----------------------------------------------------------------------
    if visual == "c8-croc":
        if focus == "intro":
            draw.rounded_rectangle((260, 640, 1660, 860), radius=60, fill=WATER)
            for k in range(5):
                wx = 360 + k * 280 + 30 * math.sin(t * 6 + k)
                draw.arc((wx - 60, 690, wx + 60, 750), 200, 340, fill=(255, 255, 255), width=6)
            chomp = 0.5 + 0.5 * math.sin(t * math.pi * 6)
            croc(draw, cx, 520, 1.3, 1, chomp, t)
            K.text_at(draw, "Chompy!", 1460, 300 + lift, font(90, bold=True), K.LEAF)
            K.text_at(draw, "the hungry crocodile", 1460, 410 + lift, font(36, bold=True), muted)
            return True
        if focus == "rule":
            croc(draw, cx - 60, 520, 1.1, 1, 0.6 + 0.4 * pulse, t)
            draw.ellipse((1450 - 230, 520 - 230, 1450 + 230, 520 + 230), fill=coral_soft)
            for k in range(9):
                row, c_ = divmod(k, 3)
                laddoo(draw, 1350 + c_ * 100, 420 + row * 100, 40)
            draw.ellipse((420 - 140, 520 - 140, 420 + 140, 520 + 140), fill=blue_soft)
            laddoo(draw, 380, 520, 40)
            laddoo(draw, 470, 520, 40)
            K.text_at(draw, "small", 420, 690, font(40, bold=True), muted)
            K.text_at(draw, "BIG!", 1450, 770, font(48, bold=True), coral)
            K.pill(draw, cx, 236, "The mouth opens to the bigger side", K.LEAF, size=36)
            return True
        big = focus == "big"
        a_, b_, d, txt = (15, 12, -1, "15 > 12") if big else (8, 10, 1, "8 < 10")
        win_left = big
        num_card(draw, brand, cx - 480, 480, a_, ink, w=280, h=220, size=150, fill=sage_soft if win_left else None,
                 outline=sage if win_left else None)
        num_card(draw, brand, cx + 480, 480, b_, ink, w=280, h=220, size=150, fill=None if win_left else sage_soft,
                 outline=None if win_left else sage)
        open_t = K.ease_out_cubic(K.clamp01(progress * 2.5))
        croc(draw, cx, 480, 0.85, d, open_t, t)
        K.text_at(draw, "bigger", cx - 480 if win_left else cx + 480, 610, font(40, bold=True), sage)
        K.text_at(draw, "smaller", cx + 480 if win_left else cx - 480, 610, font(40, bold=True), muted)
        a = K.stagger(progress, 3, step=0.12, speed=4)
        if a > 0:
            y = 720 + int((1 - a) * 20)
            draw.rounded_rectangle((cx - 300, y, cx + 300, y + 130), radius=36, fill=panel, outline=K.LEAF, width=5)
            K.text_at(draw, txt, cx, y + 18, font(80, bold=True), ink)
        if not big:
            K.pill(draw, cx, 236, "The pointy end points to the smaller number", muted, size=32)
        return True

    # ---- place value ------------------------------------------------------------------------
    if visual == "c8-place":
        cols3 = [("H", "hundreds", HUND_C), ("T", "tens", TEN_C), ("O", "ones", ONE_C)]
        if focus == "intro":
            K.shadow_card(draw, (420, 250, 1500, 830), brand, radius=40)
            for i, (lt, word, col) in enumerate(cols3):
                x = 600 + i * 360
                draw.rounded_rectangle((x - 150, 280, x + 150, 420), radius=24, fill=col)
                K.text_at(draw, lt, x, 290, font(64, bold=True), panel)
                K.text_at(draw, word, x, 372, font(30, bold=True), panel)
            for i, dgt in enumerate("352"):
                K.text_at(draw, dgt, 600 + i * 360, 470, font(150, bold=True), cols3[i][2])
            a = K.stagger(progress, 1, step=0.15, speed=4)
            if a > 0:
                K.draw_arrow(draw, 600, 820 - 40 * a, 600, 680, coral, width=14, head=40)
                K.pill(draw, 900, 700, "Start here!", coral, size=40)
            return True
        if focus == "hundreds":
            rows = [("305", "3", "0", "5"), ("350", "3", "5", "0")]
            header = cols3
        elif focus == "tens":
            rows = [("36", "3", "6"), ("63", "6", "3")]
            header = cols3[1:]
        else:
            rows = [("45", "4", "5"), ("48", "4", "8")]
            header = cols3[1:]
        nc = len(header)
        cw = 260
        tx0 = 720 - (nc - 2) * cw / 2
        K.shadow_card(draw, (160, 240, 1760, 870), brand, radius=40)
        for i, (lt, word, col) in enumerate(header):
            x = tx0 + i * cw
            draw.rounded_rectangle((x - 110, 262, x + 110, 352), radius=22, fill=col)
            K.text_at(draw, word, x, 284, font(36, bold=True), panel)
        if focus == "tens":
            same_cols, hot_col, res = [], 0, ("3 tens < 6 tens", "36 < 63")
        elif focus == "ones":
            same_cols, hot_col, res = [0], 1, ("Same tens · 5 < 8", "45 < 48")
        else:
            same_cols, hot_col, res = [0], 1, ("Same hundreds · 0 < 5", "305 < 350")
        step = K.clamp01(progress * 2.2)
        for ci in range(nc):
            x = tx0 + ci * cw
            if ci in same_cols and step > 0.15:
                draw.rounded_rectangle((x - 110, 380, x + 110, 740), radius=26, fill=(240, 240, 244))
                K.text_at(draw, "same", x, 690, font(30, bold=True), muted)
            if ci == hot_col and step > (0.5 if same_cols else 0.15):
                draw.rounded_rectangle((x - 110, 380, x + 110, 740), radius=26, fill=sage_soft, outline=sage, width=6)
        for ri, row in enumerate(rows):
            y = 400 + ri * 150
            draw.rounded_rectangle((210, y - 4, 410, y + 104), radius=24, fill=[blue_soft, coral_soft][ri])
            K.text_at(draw, row[0], 310, y + 14, font(64, bold=True), ink)
            for ci, dgt in enumerate(row[1:]):
                K.text_at(draw, dgt, tx0 + ci * cw, y - 10, font(110, bold=True), header[ci][2])
        if step > 0.65:
            lx = tx0 + (nc - 1) * cw + 120
            K.draw_arrow(draw, lx, 545, lx + 60, 545, sage, width=10, head=26)
            bx = lx + 80
            draw.rounded_rectangle((bx, 420, 1730, 680), radius=30, fill=sage_soft)
            K.text_at(draw, res[0], (bx + 1730) / 2, 460, font(36 if nc == 2 else 30, bold=True), ink)
            K.text_at(draw, res[1], (bx + 1730) / 2, 540, font(84 if nc == 2 else 68, bold=True), sage)
        return True

    # ---- which is true -----------------------------------------------------------------------
    if visual == "c8-try":
        ans = focus == "answer"
        opts = [("9", "<", "4", False, "9 > 4"), ("15", ">", "12", True, None), ("20", "=", "21", False, "20 < 21"),
                ("8", ">", "10", False, "8 < 10")]
        K.pill(draw, cx - (0 if ans else 50), 236, "Which one is TRUE?", K.BOTH_COLOR, size=36)
        if not ans:
            K.draw_stopwatch(draw, cx + 250, 266, 32, progress, brand)
        for i, (l_, sg, r_, ok, fix) in enumerate(opts):
            a = 1.0 if ans else K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            row, c_ = divmod(i, 2)
            x = cx + (c_ * 2 - 1) * 420
            y0 = 330 + row * 280 + int((1 - a) * 30)
            out = (sage if ok else K.DANGER) if ans else None
            K.shadow_card(draw, (x - 360, y0, x + 360, y0 + 240), brand, radius=36, outline=out,
                          outline_w=6 if out else 3)
            if ans and ok:
                draw.rounded_rectangle((x - 354, y0 + 6, x + 354, y0 + 234), radius=32, fill=sage_soft)
            f = font(100, bold=True)
            K.text_at(draw, l_, x - 190, y0 + 46, f, ink)
            sign_glyph(draw, x, y0 + 110, sg, 80, K.BOTH_COLOR)
            K.text_at(draw, r_, x + 190, y0 + 46, f, ink)
            if ans:
                (K.draw_check if ok else K.draw_cross)(draw, x + 320, y0 + 40, 28, sage if ok else K.DANGER)
                if fix:
                    K.pill(draw, x, y0 + 176, f"really: {fix}", muted, size=26)
        return True

    # ---- sorting toy cars -------------------------------------------------------------------
    box_xs = [cx + (i - 2) * 300 for i in range(5)]
    if visual == "c8-sort":
        if focus == "intro":
            messy = [21, 5, 30, 12, 9]
            K.text_at(draw, "SORTING", cx, 236 + lift, font(80, bold=True), coral)
            K.text_at(draw, "putting things in order", cx, 336 + lift, font(40, bold=True), muted)
            for i, v in enumerate(messy):
                x = 260 + i * 120
                hgt = 40 + v * 11
                draw.rounded_rectangle((x - 44, 820 - hgt, x + 44, 820), radius=14, fill=CAR_COLS[v])
            K.text_at(draw, "jumbled", 500, 840 - 10, font(34, bold=True), muted)
            K.draw_arrow(draw, 840, 640, 1060, 640, coral, width=14, head=40)
            for i, v in enumerate(sorted(messy)):
                a = K.stagger(progress, i + 1, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 1180 + i * 120
                hgt = int((40 + v * 11) * a)
                draw.rounded_rectangle((x - 44, 820 - hgt, x + 44, 820), radius=14, fill=CAR_COLS[v])
            K.text_at(draw, "in order", 1420, 840 - 10, font(34, bold=True), sage)
            return True
        if focus == "boxes":
            offs = [(-30, 10), (20, -40), (-10, 30), (30, -10), (0, 20)]
            for i, v in enumerate(CAR_BOXES):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                car_box(draw, box_xs[i] + offs[i][0], 700 + offs[i][1] - int((1 - a) * 60), v, CAR_COLS[v])
            kid(draw, 220, 300, 0.7, BLUE, t, bun=False)
            K.pill(draw, 220, 430, "Aarav's cars", BLUE, size=30)
            K.text_at(draw, "All jumbled!", cx + 300, 260, font(50, bold=True), K.DANGER)
            return True
        if focus == "trick":
            K.shadow_card(draw, (300, 240 + lift, 1620, 860 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "THE SORTING TRICK", cx, 258 + lift, font(36, bold=True), panel)
            steps = [("1", "Find the smallest", "mag"), ("2", "Write it down", "pencil"), ("3", "Cross it out", "cross"),
                     ("4", "Do it again!", "loop")]
            for i, (num, lab, kind) in enumerate(steps):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                y = 350 + i * 124 + lift + int((1 - a) * 20)
                draw.rounded_rectangle((360, y, 1560, y + 104), radius=30, fill=[sage_soft, blue_soft, red_soft,
                                                                                  lav_soft][i])
                K.pill(draw, 0, y + 22, num, sage, size=34, left=390)
                draw.text((500, y + 26), lab, fill=ink, font=font(46, bold=True))
                ix = 1460
                if kind == "mag":
                    K.draw_magnifier(draw, ix - 10, y + 44, 0.4, coral)
                elif kind == "pencil":
                    pencil(draw, ix - 80, y + 52, 160, YELLOW)
                elif kind == "cross":
                    K.draw_cross(draw, ix, y + 52, 34, K.DANGER)
                else:
                    draw.arc((ix - 34, y + 18, ix + 34, y + 86), 30, 330, fill=K.BOTH_COLOR, width=9)
                    draw.polygon([(ix + 30, y + 14), (ix + 44, y + 44), (ix + 14, y + 40)], fill=K.BOTH_COLOR)
            return True
        if focus == "steps":
            done = min(5, int(progress * 6.2))
            order = sorted(CAR_BOXES)
            picked = set(order[:done])
            for i, v in enumerate(CAR_BOXES):
                car_box(draw, box_xs[i], 470, v, CAR_COLS[v], s=0.85, crossed=v in picked, dim=v in picked,
                        glow=done < 5 and v == order[done] and int(t * 12) % 2 == 0)
            K.text_at(draw, "Jumbled", 150, 300, font(32, bold=True), muted)
            draw.rounded_rectangle((180, 560, 1740, 860), radius=36, fill=sage_soft, outline=sage, width=4)
            K.text_at(draw, "Sorted", 330, 580, font(36, bold=True), sage)
            for k in range(5):
                x = 470 + k * 250
                if k < done:
                    num_card(draw, brand, x, 730, order[k], CAR_COLS[order[k]], w=180, h=150, size=90)
                    if k < done - 1:
                        sign_glyph(draw, x + 125, 730, "<", 28, sage, width=7)
                else:
                    draw.rounded_rectangle((x - 90, 655, x + 90, 805), radius=26, outline=(170, 210, 200), width=4)
            return True
        # done
        order = sorted(CAR_BOXES)
        for i, v in enumerate(order):
            a = K.stagger(progress, i, step=0.08, speed=5)
            if a <= 0:
                continue
            x = box_xs[i]
            by = 840
            stack = 1 + i
            for k in range(stack):
                toy_car(draw, x, by - 40 - k * 64 - int((1 - a) * 30), 0.9, CAR_COLS[v])
            K.pill(draw, x, by - 40 - stack * 64 - 90, str(v), CAR_COLS[v], size=44)
        if progress > 0.45:
            x = box_xs[4]
            K.draw_star(draw, x, 260, 34 + 6 * pulse, K.GOLD, rot=t * 2)
            K.text_at(draw, "Biggest!", x - 260, 250, font(44, bold=True), sage)
        K.text_at(draw, "5 < 9 < 12 < 21 < 30", 460, 300, font(48, bold=True), ink)
        return True

    # ---- two directions -----------------------------------------------------------------------
    if visual == "c8-order":
        if focus == "two":
            for k, (up, vals, lab, col) in enumerate(((True, [8, 17, 25], "Smallest → biggest", sage),
                                                       (False, [25, 17, 8], "Biggest → smallest", coral))):
                a = K.stagger(progress, k * 3, step=0.15, speed=4)
                if a <= 0:
                    continue
                x0 = 220 if up else 1060
                stairs(draw, x0, 830, 210, 110, 3, (200, 230, 222) if up else (250, 220, 206), up)
                for i, v in enumerate(vals):
                    ai = K.stagger(progress, k * 3 + i, step=0.15, speed=4)
                    if ai <= 0:
                        continue
                    hgt = 110 * (i + 1 if up else 3 - i)
                    num_card(draw, brand, x0 + 105 + i * 210, 830 - hgt - 70, v, col, w=150, h=110, size=70)
                K.text_at(draw, lab, x0 + 315, 250, font(42, bold=True), col)
                arrow_y = 300
                if up:
                    K.draw_arrow(draw, x0 + 60, arrow_y + 60, x0 + 580, arrow_y + 10, col, width=10, head=28)
                else:
                    K.draw_arrow(draw, x0 + 60, arrow_y + 10, x0 + 580, arrow_y + 60, col, width=10, head=28)
            return True
        ans = focus == "answer"
        lists = [("A", [50, 42, 31, 19, 6]), ("B", [42, 50, 31, 19, 6])]
        K.pill(draw, cx - (0 if ans else 50), 236, "Biggest → smallest?", coral, size=36)
        if not ans:
            K.draw_stopwatch(draw, cx + 250, 266, 32, progress, brand)
        for k, (name, vals) in enumerate(lists):
            y = 440 + k * 260
            states = None
            signs = None
            cols = None
            if ans:
                if k == 0:
                    states = ["good"] * 5
                    signs = [">"] * 4
                    cols = [sage] * 4
                else:
                    states = ["bad", "bad", None, None, None]
                    signs = ["<", None, None, None]
                    cols = [K.DANGER] * 4
            K.pill(draw, 230, y - 34, name, K.BOTH_COLOR, size=40)
            xs = tile_row(vals, y, cw=170, gap=60, size=80, states=states, signs=signs, sign_col=cols)
            if ans:
                ok = k == 0
                (K.draw_check if ok else K.draw_cross)(draw, 1700, y, 34, sage if ok else K.DANGER)
        if ans:
            K.text_at(draw, "each one smaller", cx, 560, font(32, bold=True), sage)
            K.text_at(draw, "50 is bigger than 42!", cx, 820, font(32, bold=True), K.DANGER)
        return True

    # ---- repeats & middle -----------------------------------------------------------------------
    if visual == "c8-twins":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            vals = [3, 3, 14, 27] if ans else [14, 3, 27, 3]
            states = ["good" if v == 3 else None for v in vals] if ans else ["hot" if v == 3 else None for v in vals]
            signs = ["=", "<", "<"] if ans else None
            xs = tile_row(vals, 480, cw=220, gap=80, size=110, states=states, signs=signs,
                          sign_col=[sage, sage, sage] if ans else None)
            if ans:
                K.pill(draw, cx, 640, "Keep both 3s!", sage, size=44)
                star_spots([(260, 330), (1660, 330)])
            else:
                question_marks([(xs[1], 260), (xs[3], 260)], size=80)
                K.text_at(draw, "Two 3s! What do we do?", cx, 660, font(46, bold=True), coral)
                K.draw_stopwatch(draw, cx, 810, 40, progress, brand)
            return True
        ans = focus == "middle"
        vals = sorted(PENCILS) if ans else PENCILS
        cm = 46
        x0 = 520
        for i, v in enumerate(vals):
            moving = False
            if ans:
                a = K.ease_in_out(K.clamp01(progress * 2.5 - i * 0.12))
                old = PENCILS.index(v)
                yi = K.lerp(old, i, a)
                moving = old != i and 0.02 < a < 0.98
            else:
                yi = i
            y = 300 + yi * 118
            mid = ans and i == 2 and progress > 0.5
            if mid:
                draw.rounded_rectangle((x0 - 220, y - 48, x0 + 14 * cm + 40, y + 48), radius=30, fill=sage_soft,
                                       outline=sage, width=5)
            pencil(draw, x0, y, v * cm, PENCIL_COLS[v])
            if not moving:
                K.text_at(draw, f"{v} cm", x0 - 110, y - 26, font(44, bold=True), sage if mid else ink)
        for k in range(15):
            x = x0 + k * cm
            draw.line((x, 860 - 26, x, 860 - (40 if k % 5 == 0 else 32)), fill=muted, width=3)
        draw.line((x0, 834, x0 + 14 * cm, 834), fill=muted, width=3)
        if ans:
            if progress > 0.5:
                K.pill(draw, 1560, 520, "Middle: 9 cm", sage, size=40)
                K.text_at(draw, "2 shorter", 1560, 380, font(36, bold=True), muted)
                K.text_at(draw, "2 longer", 1560, 640, font(36, bold=True), muted)
        else:
            K.draw_stopwatch(draw, 1600, 420, 50, progress, brand)
            K.text_at(draw, "Middle one?", 1600, 520, font(44, bold=True), coral)
            question_marks([(1600, 620)], size=80)
        return True

    # ---- why computers sort --------------------------------------------------------------------
    def roll_grid(x0, y0, nums, find=None, scan=None, found=False):
        cw, ch = 118, 82
        for i, v in enumerate(nums):
            r_, c_ = divmod(i, 6)
            x, y = x0 + c_ * cw, y0 + r_ * ch
            hit = found and v == find
            look = scan is not None and i == scan
            fill = sage_soft if hit else coral_soft if look else panel
            draw.rounded_rectangle((x, y, x + cw - 12, y + ch - 12), radius=14, fill=fill,
                                   outline=sage if hit else coral if look else line, width=5 if hit or look else 2)
            K.text_at(draw, str(v), x + (cw - 12) / 2, y + 12, font(40, bold=True), ink)
        return cw, ch

    if visual == "c8-fast":
        if focus == "intro":
            for k, (lab, nums, col) in enumerate((("Messy", MESSY_ROLLS[:12], K.DANGER),
                                                   ("Sorted", list(range(1, 13)), sage))):
                a = K.stagger(progress, k, step=0.25, speed=4)
                if a <= 0:
                    continue
                x0 = 200 if k == 0 else 1010
                y0 = 300 + int((1 - a) * 30)
                draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 470), radius=32, fill=panel, outline=col, width=5)
                K.pill(draw, x0 + 360, y0 - 30, lab, col, size=36)
                roll_grid(x0 + 4, y0 + 60, nums)
                if k == 0:
                    K.draw_snail(draw, x0 + 260, y0 + 350, 1.0, brand)
                    K.text_at(draw, "Slow…", x0 + 500, y0 + 320, font(44, bold=True), K.DANGER)
                else:
                    for j in range(3):
                        draw.line((x0 + 120 - j * 30, y0 + 320 + j * 26, x0 + 340 - j * 30, y0 + 320 + j * 26),
                                  fill=sage, width=8)
                    K.text_at(draw, "Fast!", x0 + 500, y0 + 320, font(44, bold=True), sage)
            return True
        sorted_view = focus == "sorted"
        nums = list(range(1, 31)) if sorted_view else MESSY_ROLLS
        K.draw_person(draw, 230, 470, 1.0, "teacher", t)
        K.pill(draw, 230, 700, "Find roll no. 27", coral, size=30)
        x0, y0 = 520, 270
        if sorted_view:
            found = progress > 0.45
            cw, ch = roll_grid(x0, y0, nums, find=27, found=found)
            jx, jy = x0 + 2 * cw + 50, y0 + 4 * ch + 30
            jp = K.ease_in_out(K.clamp01(progress * 2.2))
            sx, sy = x0 + 50, y0 + 30
            mx, my = K.lerp(sx, jx, jp), K.lerp(sy, jy, jp) - 160 * math.sin(jp * math.pi)
            if not found:
                K.draw_curve(draw, (sx, sy), ((sx + jx) / 2, min(sy, jy) - 200), (jx, jy), sage, width=6, dashed=True,
                             phase=t * 80)
            K.draw_magnifier(draw, mx + 40, my + 40, 0.5, sage)
            if found:
                K.pill(draw, 1500, 790, "Found it!", sage, size=40)
                star_spots([(1700, 300), (1720, 640)])
        else:
            scan = min(29, int(progress * 24))
            roll_grid(x0, y0, nums, scan=scan)
            r_, c_ = divmod(scan, 6)
            K.draw_magnifier(draw, x0 + c_ * 118 + 90, y0 + r_ * 82 + 70, 0.4, coral)
            K.draw_snail(draw, 1600, 790, 0.6, brand)
            K.text_at(draw, f"Checked: {scan + 1}", 1600, 300, font(40, bold=True), coral)
            K.text_at(draw, "So slow!", 1600, 380, font(44, bold=True), K.DANGER)
        return True

    # ---- checkpoint ------------------------------------------------------------------------------
    if visual == "c8-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 790 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Sort these!", cx, 450 + lift, font(64, bold=True), ink)
            for i, v in enumerate((19, 7, 42, 7)):
                num_card(draw, brand, cx - 270 + i * 180, 650 + lift, v, ink, w=140, h=110, size=64)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1300 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1300, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "Smallest to biggest:", 715, 256, font(48, bold=True), coral)
        for i, v in enumerate((19, 7, 42, 7)):
            num_card(draw, brand, 310 + i * 270, 420, v, ink, w=190, h=150, size=90,
                     fill=coral_soft if (ans and v == 7) else None)
        K.draw_arrow(draw, 715, 520, 715, 590, muted, width=10, head=28)
        out = [7, 7, 19, 42]
        for i in range(4):
            x = 310 + i * 270
            if ans:
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a > 0:
                    num_card(draw, brand, x, 700 + int((1 - a) * 20), out[i], sage if out[i] == 7 else ink, w=190,
                             h=150, size=90, fill=sage_soft, outline=sage)
                    if i < 3 and a > 0.8:
                        sign_glyph(draw, x + 135, 700, "=" if i == 0 else "<", 30, sage, width=7)
            else:
                draw.rounded_rectangle((x - 95, 625, x + 95, 775), radius=28, outline=(220, 210, 232), width=4)
        kid(draw, 1580, 470, 1.25, BLUE, t, bun=False)
        if ans:
            K.pill(draw, 1580, 700, "Both 7s stay!", sage, size=36)
            star_spots([(1400, 330), (1760, 330)])
        else:
            question_marks([(1760, 280)], size=80)
            K.draw_stopwatch(draw, 1580, 760, 44, progress, brand)
        return True

    # ---- recap -----------------------------------------------------------------------------------
    if visual == "c8-recap":
        recap = [(("> greater, < less,", "= equal"), sage, "signs"), (("Compare the", "biggest place first"), TEN_C, "place"),
                 (("Sort: smallest,", "then the next"), coral, "sort"), (("Sorted lists are", "faster to search"),
                                                                         K.BOTH_COLOR, "fast")]
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
                ix, iy = x0 + 200, y0 + 190
                if kind == "signs":
                    croc(draw, ix, iy - 20, 0.42, 1, 0.9, t)
                    for k, sg in enumerate((">", "<", "=")):
                        sign_glyph(draw, ix - 110 + k * 110, iy + 120, sg, 50, col, width=9)
                elif kind == "place":
                    for k, (lt, c) in enumerate((("H", HUND_C), ("T", TEN_C), ("O", ONE_C))):
                        bx = ix - 110 + k * 110
                        draw.rounded_rectangle((bx - 46, iy - 110, bx + 46, iy - 40), radius=14, fill=c)
                        K.text_at(draw, lt, bx, iy - 102, font(40, bold=True), panel)
                        K.text_at(draw, "350"[k], bx, iy - 20, font(64, bold=True), c)
                    K.draw_arrow(draw, ix - 110, iy + 150, ix - 110, iy + 80, coral, width=8, head=22)
                elif kind == "sort":
                    for k, v in enumerate((5, 9, 12, 21, 30)):
                        bx = ix - 140 + k * 70
                        hgt = 20 + v * 5
                        draw.rounded_rectangle((bx - 26, iy + 150 - hgt, bx + 26, iy + 150), radius=8,
                                               fill=CAR_COLS[v])
                        K.text_at(draw, str(v), bx, iy + 150 - hgt - 40, font(28, bold=True), ink)
                else:
                    for k in range(6):
                        r_, c_ = divmod(k, 3)
                        bx, by = ix - 120 + c_ * 90, iy - 80 + r_ * 80
                        hit = k == 4
                        draw.rounded_rectangle((bx - 38, by - 30, bx + 38, by + 30), radius=10,
                                               fill=sage_soft if hit else panel, outline=sage if hit else line, width=3)
                        K.text_at(draw, str(k + 1), bx, by - 20, font(32, bold=True), ink)
                    K.draw_magnifier(draw, ix + 40, iy + 110, 0.35, col)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, ix, y0 + 390 + j * 46, font(34 if len(ln) < 17 else 30, bold=True), ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, BLUE, t, bun=False)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Sorting superstar", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
