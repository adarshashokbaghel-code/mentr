"""C16 · Estimation and Guess-Check-Improve — visuals."""
import math

import build as K

LADDOO = (250, 170, 40)
LADDOO_DARK = (212, 124, 18)
LADDOO_HI = (255, 226, 150)
GLASS = (230, 243, 250)
GLASS_EDGE = (150, 184, 206)
GLASS_HI = (248, 252, 255)
WOOD = (214, 170, 120)
WOOD_DARK = (168, 120, 76)
RULER = (250, 222, 150)
RULER_DARK = (190, 150, 70)
PENCIL = (255, 196, 46)
PENCIL_WOOD = (238, 200, 150)
ERASER = (240, 140, 150)
BUS = (255, 196, 46)
BUS_DARK = (214, 150, 20)
TYRE = (44, 48, 60)
PINK = (238, 104, 158)
SMALL_COL = (64, 118, 214)
BIG_COL = (224, 62, 62)
FLOOR = (236, 222, 196)
FLOOR_DARK = (210, 190, 156)
SHELL = (70, 156, 92)
SHELL_DARK = (44, 112, 64)
SHELL_LIGHT = (128, 196, 128)
TSKIN = (156, 212, 120)
TSKIN_DARK = (112, 170, 84)
LAV_SOFT = (239, 234, 251)
BLUE_SOFT = (230, 238, 251)
BOOK_COLS = [(64, 118, 214), (224, 62, 62), (13, 148, 136), (255, 186, 60), (123, 97, 214), (255, 106, 26)]


def S_(s):
    return lambda v: v * s


def circ(draw, x, y, r, fill, outline=None, width=0):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=fill, outline=outline, width=width)


def stars_pts(draw, pts, progress):
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    for i, (x, y) in enumerate(pts):
        K.draw_star(draw, x, y + 8 * math.sin(progress * 9 + i), 20 + 6 * pulse,
                    [K.CORAL, (13, 148, 136), K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)


# ---------------------------------------------------------------------------
# People
# ---------------------------------------------------------------------------

def kid(draw, cx, cy, s, body, t=0.0, style="riya", mood="happy"):
    """Bust. cy = face centre; hair top ≈ cy-90s (bun), body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    if style == "riya":
        circ(draw, cx, cy - r * 1.05, r * 0.42, K.HAIR)
        circ(draw, cx + r * 0.36, cy - r * 1.22, r * 0.16, K.GOLD)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    if style == "riya":
        circ(draw, cx, cy - r * 0.32, r * 0.06, K.DANGER)
    if style == "kabir":
        draw.chord((cx - r * 1.02, cy - r * 1.12, cx + r * 1.02, cy - r * 0.1), 180, 360, fill=SMALL_COL)
        draw.rounded_rectangle((cx - r * 0.1, cy - r * 0.62, cx + r * 1.3, cy - r * 0.42), radius=r * 0.1,
                               fill=SMALL_COL)
    if mood == "worried":
        draw.ellipse((cx - r * 0.5, cy + r * 0.1, cx + r * 0.5, cy + r * 0.7), fill=K.SKIN)
        draw.arc((cx - r * 0.3, cy + r * 0.34, cx + r * 0.3, cy + r * 0.74), 200, 340, fill=(190, 70, 60),
                 width=max(2, int(r * 0.1)))
    elif mood == "shout":
        draw.ellipse((cx - r * 0.5, cy + r * 0.1, cx + r * 0.5, cy + r * 0.7), fill=K.SKIN)
        draw.ellipse((cx - r * 0.2, cy + r * 0.25, cx + r * 0.2, cy + r * 0.62), fill=(150, 50, 50))


def uncle(draw, cx, cy, s, t=0.0):
    S = S_(s)
    K.draw_person(draw, cx, cy, s, "dad", t)
    draw.chord((cx - S(70), cy - S(80), cx + S(70), cy - S(10)), 180, 360, fill=(250, 250, 250))
    draw.rectangle((cx - S(70), cy - S(48), cx + S(70), cy - S(38)), fill=(230, 230, 230))


# ---------------------------------------------------------------------------
# Things
# ---------------------------------------------------------------------------

def laddoo(draw, x, y, r):
    circ(draw, x, y, r, LADDOO, LADDOO_DARK, max(1, int(r * 0.08)))
    for dx, dy in ((-0.4, -0.15), (0.2, -0.45), (0.38, 0.18), (-0.08, 0.38), (-0.45, 0.35), (0.05, -0.05)):
        circ(draw, x + dx * r, y + dy * r, r * 0.11, LADDOO_DARK)
    circ(draw, x - 0.35 * r, y - 0.42 * r, r * 0.17, LADDOO_HI)


def jar(draw, cx, by, s, sealed=True, count=25):
    """Glass jar of laddoos (5 per row). by = bottom. Spans cx±150s, by-420s..by."""
    S = S_(s)
    W, H = S(300), S(330)
    x0, x1, y0 = cx - W / 2, cx + W / 2, by - H
    draw.rounded_rectangle((x0 + S(10), y0 + S(12), x1 + S(10), by + S(12)), radius=S(46), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W * 0.36, y0 - S(34), cx + W * 0.36, y0 + S(20)), radius=S(10), fill=GLASS)
    draw.rounded_rectangle((x0, y0, x1, by), radius=S(46), fill=GLASS)
    r = S(25)
    k = 0
    for row in range(6):
        for col in range(5):
            if k >= count:
                break
            off = S(8) if row % 2 else -S(8)
            x = cx + (col - 2) * (2 * r + S(3)) + off
            y = by - S(36) - row * (2 * r * 0.9)
            laddoo(draw, x, y, r)
            k += 1
    draw.rounded_rectangle((x0 + S(22), y0 + S(40), x0 + S(40), by - S(60)), radius=S(9), fill=GLASS_HI)
    draw.rounded_rectangle((x0, y0, x1, by), radius=S(46), outline=GLASS_EDGE, width=max(3, int(S(5))))
    draw.rounded_rectangle((cx - W * 0.42, y0 - S(84), cx + W * 0.42, y0 - S(30)), radius=S(14), fill=K.CORAL)
    draw.rounded_rectangle((cx - W * 0.42, y0 - S(48), cx + W * 0.42, y0 - S(30)), radius=S(8), fill=(214, 84, 14))
    if sealed:
        draw.rectangle((cx - S(16), y0 - S(86), cx + S(16), y0 + S(26)), fill=K.GOLD)
        circ(draw, cx, y0 - S(56), S(24), K.DANGER)
        circ(draw, cx, y0 - S(56), S(13), (240, 110, 110))


def sign_board(draw, box, lines, ink, size=44):
    x0, y0, x1, y1 = box
    for px in (x0 + 60, x1 - 60):
        draw.rectangle((px - 12, y1 - 10, px + 12, y1 + 120), fill=WOOD_DARK)
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=20, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=20, fill=WOOD, outline=WOOD_DARK, width=6)
    draw.rounded_rectangle((x0 + 18, y0 + 18, x1 - 18, y1 - 18), radius=14, fill=(255, 246, 226))
    font = K.load_font(size, bold=True)
    lh = int(size * 1.25)
    ty = (y0 + y1) / 2 - len(lines) * lh / 2
    for j, (txt, col) in enumerate(lines):
        K.text_at(draw, txt, (x0 + x1) / 2, ty + j * lh, font, col or ink)


def bunting(draw, x0, x1, y, n, sag=40):
    pts = []
    for i in range(n + 1):
        f = i / n
        pts.append((x0 + (x1 - x0) * f, y + sag * 4 * f * (1 - f)))
    draw.line(pts, fill=K.DEV_MID, width=3)
    cols = [K.CORAL, K.GOLD, (13, 148, 136), PINK, K.BOTH_COLOR]
    for i in range(n):
        (ax, ay), (bx, by) = pts[i], pts[i + 1]
        mx, my = (ax + bx) / 2, (ay + by) / 2
        draw.polygon([(ax + 6, ay + 2), (bx - 6, by + 2), (mx, my + 56)], fill=cols[i % len(cols)])


def diya(draw, cx, cy, s, t):
    S = S_(s)
    draw.chord((cx - S(60), cy - S(34), cx + S(60), cy + S(34)), 0, 180, fill=(200, 100, 60))
    draw.ellipse((cx - S(60), cy - S(10), cx + S(60), cy + S(10)), fill=(160, 70, 40))
    fl = S(5) * math.sin(t * 30)
    draw.ellipse((cx - S(12), cy - S(54) + fl, cx + S(12), cy - S(6)), fill=K.GOLD)
    draw.ellipse((cx - S(6), cy - S(34) + fl, cx + S(6), cy - S(10)), fill=(255, 250, 220))


def table(draw, x0, x1, y):
    draw.rectangle((x0 + 30, y, x0 + 50, y + 130), fill=WOOD_DARK)
    draw.rectangle((x1 - 50, y, x1 - 30, y + 130), fill=WOOD_DARK)
    draw.rounded_rectangle((x0, y - 10, x1, y + 22), radius=10, fill=WOOD, outline=WOOD_DARK, width=4)


def lightbulb(draw, cx, cy, s, glow=1.0):
    S = S_(s)
    if glow > 0:
        for k in range(8):
            a = k * math.pi / 4
            draw.line((cx + math.cos(a) * S(84), cy + math.sin(a) * S(84), cx + math.cos(a) * S(110),
                       cy + math.sin(a) * S(110)), fill=K.GOLD, width=max(3, int(S(8))))
    circ(draw, cx, cy, S(64), (255, 226, 120), (226, 170, 40), max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(30), cy + S(52), cx + S(30), cy + S(100)), radius=S(8), fill=K.STEEL_DARK)
    for k in range(2):
        draw.line((cx - S(30), cy + S(68) + k * S(16), cx + S(30), cy + S(68) + k * S(16)), fill=K.STEEL,
                  width=max(2, int(S(4))))
    draw.arc((cx - S(24), cy - S(20), cx + S(24), cy + S(30)), 200, 340, fill=(226, 150, 30), width=max(2, int(S(5))))


def target(draw, cx, cy, r, sage):
    for k, col in enumerate(((255, 255, 255), sage, (255, 255, 255), sage)):
        rr = r * (1 - k * 0.24)
        circ(draw, cx, cy, rr, col, sage, 4)
    K.draw_arrow(draw, cx + r * 1.2, cy - r * 1.0, cx + 6, cy - 4, K.CORAL, width=10, head=28)


def pencil(draw, x0, x1, y, h=44):
    draw.rounded_rectangle((x0, y - h / 2, x0 + h * 0.9, y + h / 2), radius=h * 0.3, fill=ERASER)
    draw.rectangle((x0 + h * 0.7, y - h / 2, x0 + h * 1.2, y + h / 2), fill=K.STEEL)
    tip = h * 1.6
    draw.rectangle((x0 + h * 1.2, y - h / 2, x1 - tip, y + h / 2), fill=PENCIL)
    draw.line((x0 + h * 1.2, y, x1 - tip, y), fill=(240, 176, 30), width=4)
    draw.polygon([(x1 - tip, y - h / 2), (x1 - tip, y + h / 2), (x1, y)], fill=PENCIL_WOOD)
    draw.polygon([(x1 - tip * 0.35, y - h * 0.18), (x1 - tip * 0.35, y + h * 0.18), (x1, y)], fill=(50, 54, 66))


def ruler(draw, x0, y, cm_px, n_cm, ink):
    x1 = x0 + n_cm * cm_px
    draw.rounded_rectangle((x0 - 30 + 8, y + 10, x1 + 30 + 8, y + 110), radius=12, fill=K.SHADOW)
    draw.rounded_rectangle((x0 - 30, y, x1 + 30, y + 100), radius=12, fill=RULER, outline=RULER_DARK, width=4)
    font = K.load_font(28, bold=True)
    for c in range(n_cm + 1):
        x = x0 + c * cm_px
        long = c % 5 == 0
        draw.line((x, y, x, y + (40 if long else 22)), fill=ink, width=4 if long else 3)
        if long:
            K.text_at(draw, str(c), x, y + 50, font, ink)


def bus(draw, x0, y0, s, t=0.0, faces=6):
    """School bus, side view. Spans x0..x0+800s, y0..y0+340s."""
    S = S_(s)
    W, H = S(800), S(280)
    draw.rounded_rectangle((x0 + S(10), y0 + S(12), x0 + W + S(10), y0 + H + S(12)), radius=S(40), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x0 + W, y0 + H), radius=S(40), fill=BUS)
    draw.rectangle((x0, y0 + H * 0.62, x0 + W, y0 + H * 0.7), fill=BUS_DARK)
    for i in range(6):
        wx = x0 + S(40) + i * S(112)
        draw.rounded_rectangle((wx, y0 + S(30), wx + S(92), y0 + S(130)), radius=S(14), fill=(214, 236, 248))
        if i < faces:
            circ(draw, wx + S(46), y0 + S(96), S(26), K.SKIN)
            draw.chord((wx + S(18), y0 + S(66), wx + S(74), y0 + S(110)), 180, 360, fill=K.HAIR)
    draw.rounded_rectangle((x0 + W - S(90), y0 + S(30), x0 + W - S(20), y0 + S(230)), radius=S(10),
                           fill=(214, 236, 248), outline=BUS_DARK, width=max(2, int(S(5))))
    draw.rectangle((x0 + W - S(14), y0 + S(170), x0 + W + S(6), y0 + S(200)), fill=(255, 240, 200))
    if s >= 0.6:
        K.text_at(draw, "SCHOOL BUS", x0 + W * 0.42, y0 + S(146), K.load_font(int(S(34)), bold=True), (120, 80, 10))
    for wx in (x0 + S(170), x0 + W - S(190)):
        circ(draw, wx, y0 + H, S(52), TYRE)
        circ(draw, wx, y0 + H, S(22), K.STEEL)


def footprint(draw, x, y, s, col):
    S = S_(s)
    draw.ellipse((x - S(26), y - S(13), x + S(18), y + S(13)), fill=col)
    for k, (dx, dy) in enumerate(((26, -10), (31, 0), (26, 10))):
        circ(draw, x + S(dx), y + S(dy), S(5), col)


def bracket(draw, x0, x1, y, col, text, font, up=True):
    d = -16 if up else 16
    draw.line((x0, y + d, x0, y, x1, y, x1, y + d), fill=col, width=5)
    K.text_at(draw, text, (x0 + x1) / 2, y - 52 if up else y + 14, font, col)


def ladybug(draw, cx, cy, r):
    circ(draw, cx - r * 0.95, cy, r * 0.45, (40, 44, 56))
    circ(draw, cx, cy, r, (224, 62, 62), (40, 44, 56), max(2, int(r * 0.08)))
    draw.line((cx - r * 0.1, cy - r, cx - r * 0.1, cy + r), fill=(40, 44, 56), width=max(2, int(r * 0.08)))
    for dx, dy in ((-0.45, -0.45), (0.35, -0.5), (-0.4, 0.4), (0.4, 0.35), (0.65, -0.05)):
        circ(draw, cx + dx * r, cy + dy * r, r * 0.16, (40, 44, 56))


def turtle_top(draw, x, y, hdg, s, t=0.0):
    S = S_(s)
    a = math.radians(hdg)
    fx, fy = math.sin(a), -math.cos(a)
    rx, ry = math.cos(a), math.sin(a)

    def P(f, r):
        return x + fx * S(f) + rx * S(r), y + fy * S(f) + ry * S(r)

    circ(draw, x + S(5), y + S(7), S(46), K.SHADOW)
    for f, r in ((30, 38), (30, -38), (-30, 38), (-30, -38)):
        px, py = P(f, r)
        circ(draw, px, py, S(15), TSKIN, TSKIN_DARK, max(2, int(S(3))))
    hx, hy = P(58, 0)
    circ(draw, hx, hy, S(22), TSKIN, TSKIN_DARK, max(2, int(S(3))))
    for r in (9, -9):
        ex, ey = P(66, r)
        circ(draw, ex, ey, S(5.5), (30, 36, 48))
    circ(draw, x, y, S(45), SHELL_DARK)
    circ(draw, x, y, S(38), SHELL)
    for k in range(6):
        ang = a + k * math.pi / 3
        circ(draw, x + math.cos(ang) * S(25), y + math.sin(ang) * S(25), S(8), SHELL_LIGHT)
    circ(draw, x, y, S(13), SHELL_LIGHT)
    circ(draw, x, y, S(6), K.GOLD)


def number_line(draw, x0, x1, y, lo, hi, tick, lab, ink, muted, size=30, lo_label=None):
    def X(v):
        return x0 + (v - lo) / (hi - lo) * (x1 - x0)

    draw.line((x0 - 20, y, x1 + 20, y), fill=ink, width=6)
    font = K.load_font(size, bold=True)
    v = lo
    while v <= hi + 1e-6:
        big = abs((v - lo) % lab) < 1e-6 or abs(v - hi) < 1e-6
        draw.line((X(v), y - (18 if big else 10), X(v), y + (18 if big else 10)), fill=ink, width=4 if big else 3)
        if big:
            txt = lo_label if (lo_label and abs(v - lo) < 1e-6) else str(int(v))
            K.text_at(draw, txt, X(v), y + 30, font, muted)
        v += tick
    return X


def flag(draw, x, y, text, col, up=True, size=40):
    """Marker pin on a number line at (x, y) with a label above (or below)."""
    font = K.load_font(size, bold=True)
    bb = draw.textbbox((0, 0), text, font=font)
    tw = bb[2] - bb[0]
    by = y - 130 if up else y + 70
    draw.line((x, y - 14 if up else y + 14, x, by + (60 if up else 0)), fill=col, width=6)
    draw.rounded_rectangle((x - tw / 2 - 22, by, x + tw / 2 + 22, by + 64), radius=20, fill=col)
    draw.text((x - tw / 2, by + 32 - (bb[1] + bb[3]) / 2), text, font=font, fill=(255, 255, 255))
    circ(draw, x, y, 14, col, (255, 255, 255), 4)


def clue_card(draw, x, y, w, kind, sage, size=40):
    txt, col, soft = {"small": ("Too small!", SMALL_COL, BLUE_SOFT), "big": ("Too big!", BIG_COL, K.DANGER_SOFT),
                      "right": ("Just right!", sage, K.hex_rgb("#E6F7F4"))}[kind]
    h = 96
    draw.rounded_rectangle((x + 6, y + 8, x + w + 6, y + h + 8), radius=30, fill=K.SHADOW)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=30, fill=soft, outline=col, width=5)
    ix = x + 52
    if kind == "small":
        K.draw_arrow(draw, ix, y + 74, ix, y + 22, col, width=10, head=24)
    elif kind == "big":
        K.draw_arrow(draw, ix, y + 22, ix, y + 74, col, width=10, head=24)
    else:
        K.draw_check(draw, ix, y + h / 2, 26, col)
    font = K.load_font(size, bold=True)
    bb = draw.textbbox((0, 0), txt, font=font)
    draw.text((x + 96, y + h / 2 - (bb[1] + bb[3]) / 2), txt, font=font, fill=K.hex_rgb("#1C2434"))


def cycle(draw, cx, cy, R, labels, cols, active, progress, r=110, size=40):
    """Three nodes on a circle with clockwise arrows between them."""
    angs = [-90, 30, 150]
    pts = [(cx + math.cos(math.radians(a)) * R, cy + math.sin(math.radians(a)) * R) for a in angs]
    for i in range(3):
        a0 = angs[i] + 26
        a1 = angs[i] + 120 - 26
        draw.arc((cx - R, cy - R, cx + R, cy + R), a0, a1, fill=K.DEV_MID, width=8)
        e = math.radians(a1)
        hx, hy = cx + math.cos(e) * R, cy + math.sin(e) * R
        tx, ty = -math.sin(e), math.cos(e)
        nx, ny = math.cos(e), math.sin(e)
        draw.polygon([(hx + tx * 26, hy + ty * 26), (hx + nx * 16, hy + ny * 16), (hx - nx * 16, hy - ny * 16)],
                     fill=K.DEV_MID)
    font = K.load_font(size, bold=True)
    for i, ((x, y), lab, col) in enumerate(zip(pts, labels, cols)):
        on = i == active
        rr = r + (8 * math.sin(progress * math.pi * 8) if on else 0)
        circ(draw, x + 6, y + 8, rr, K.SHADOW)
        circ(draw, x, y, rr, col if on else (255, 255, 255), col, 6)
        bb = draw.textbbox((0, 0), lab, font=font)
        draw.text((x - (bb[2] - bb[0]) / 2, y - (bb[1] + bb[3]) / 2), lab, font=font,
                  fill=(255, 255, 255) if on else col)


def books_row(draw, x0, y_base, bw, n, h=170):
    for i in range(n):
        x = x0 + i * bw
        hh = h - (i * 37 % 5) * 8
        col = BOOK_COLS[(i * 7) % len(BOOK_COLS)]
        draw.rectangle((x + 1, y_base - hh, x + bw - 1, y_base), fill=col)
        draw.line((x + 4, y_base - hh + 20, x + bw - 4, y_base - hh + 20), fill=(255, 255, 255), width=3)


def shelf(draw, x0, x1, y_base):
    draw.rectangle((x0 - 30 + 8, y_base + 10, x1 + 30 + 8, y_base + 44), fill=K.SHADOW)
    draw.rectangle((x0 - 30, y_base, x1 + 30, y_base + 34), fill=WOOD, outline=WOOD_DARK, width=4)
    for bx in (x0 - 10, x1 + 10):
        draw.polygon([(bx - 14, y_base + 34), (bx + 14, y_base + 34), (bx, y_base + 90)], fill=WOOD_DARK)


# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------

def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    cx = w / 2
    t = progress
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    lift = int((1 - appear) * 40)
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    F = K.load_font

    # ---- opening ------------------------------------------------------------
    if visual == "c16-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            kid(draw, cx + 300, 430, 1.1, PINK, t)
            K.text_at(draw, "Welcome back, champ!", cx, 720, F(60, bold=True), ink)
            stars_pts(draw, [(cx - 620, 330), (cx - 560, 560), (cx + 620, 320), (cx + 580, 560), (cx, 300)], progress)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 250 + lift, w - 240, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "UNIT 3 · SHAPES, GRIDS & COORDINATES", cx, 330 + lift, F(34, bold=True), sage)
            chips = ["Shapes", "Grids", "Symmetry", "Turns", "Drawing"]
            for i, lab in enumerate(chips):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 450 + i * 255
                y = 470 + int((1 - a) * 40)
                circ(draw, x, y, 70, sage_soft)
                K.draw_check(draw, x, y, 46, sage)
                K.text_at(draw, lab, x, y + 92, F(32, bold=True), ink)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 710 + int((1 - a) * 20), "ALL DONE!", coral, size=40)
                turtle_top(draw, cx + 300, 745, 90, 0.6, t)
                turtle_top(draw, cx - 300, 745, 270, 0.6, t)
            return True
        if focus == "unit":
            circ(draw, 520, 560, 250, LAV_SOFT)
            lightbulb(draw, 520, 500, 1.6, glow=pulse)
            K.draw_magnifier(draw, 680, 690, 0.8, coral)
            K.pill(draw, 0, 290 + lift, "UNIT 4", coral, size=34, left=880)
            K.text_at(draw, "Thinking Like a", 1300, 370 + lift, F(76, bold=True), ink)
            K.text_at(draw, "Problem Solver", 1300, 462 + lift, F(76, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a <= 0:
                    continue
                x = 1060 + i * 120
                draw.rounded_rectangle((x - 46, 640, x + 46, 732), radius=22, fill=panel,
                                       outline=coral if i == 0 else line, width=5 if i == 0 else 3)
                K.text_at(draw, str(i + 1), x, 652, F(48, bold=True), coral if i == 0 else muted)
            K.text_at(draw, "5 chapters · a brand new unit!", 1300, 770, F(32, bold=True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 590 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 1 OF 5", cx, 302 + lift, F(32, bold=True), coral)
            K.text_at(draw, "Estimation and", cx, 360 + lift, F(78, bold=True), ink)
            K.text_at(draw, "Guess-Check-Improve", cx, 458 + lift, F(78, bold=True), ink)
            for i, (lab, col) in enumerate((("Guess", coral), ("Check", K.BOTH_COLOR), ("Improve", sage))):
                a = K.stagger(progress, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 360
                y = 680 + int((1 - a) * 30)
                K.pill(draw, x, y, lab, col, size=40)
                if i < 2:
                    K.draw_arrow(draw, x + 115, y + 38, x + 240, y + 38, muted, width=8, head=22)
            return True
        # promise
        jar(draw, 420, 800, 1.0)
        K.text_at(draw, "?", 720, 400, F(int(110 + 20 * pulse), bold=True), K.GOLD)
        K.draw_arrow(draw, 680, 620, 860 + 20 * pulse, 620, coral, width=14, head=40)
        a = K.stagger(progress, 1, step=0.15, speed=4)
        if a > 0:
            y0 = 300 + int((1 - a) * 30)
            draw.rounded_rectangle((960 + 10, y0 + 12, 1700 + 10, y0 + 452), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((960, y0, 1700, y0 + 440), radius=30, fill=K.DEV_DARK)
            draw.rounded_rectangle((960, y0, 1700, y0 + 60), radius=30, fill=K.DEV_MID)
            draw.rectangle((960, y0 + 30, 1700, y0 + 60), fill=K.DEV_MID)
            for k, col in enumerate((K.DANGER, K.GOLD, K.LEAF)):
                circ(draw, 1000 + k * 40, y0 + 30, 11, col)
            for k, (wd, col) in enumerate(((420, (120, 190, 242)), (300, K.GOLD), (480, (150, 220, 160)),
                                           (260, (240, 140, 150)))):
                draw.rounded_rectangle((1010, y0 + 100 + k * 64, 1010 + wd, y0 + 128 + k * 64), radius=12, fill=col)
            ladybug(draw, 1590, y0 + 330, 44)
            K.text_at(draw, "Coders use it every day!", 1330, y0 + 470, F(40, bold=True), sage)
        return True

    # ---- mela story ----------------------------------------------------------
    if visual == "c16-hook":
        if focus == "meet":
            bunting(draw, 140, 1780, 230, 14, sag=50)
            kid(draw, 430, 500, 1.3, PINK, t)
            K.text_at(draw, "Riya", 430, 760, F(44, bold=True), PINK)
            table(draw, 980, 1640, 740)
            jar(draw, 1310, 728, 0.95)
            diya(draw, 1060, 724, 0.7, t)
            diya(draw, 1560, 724, 0.7, t)
            K.pill(draw, 790, 330, "Diwali mela!", coral, size=36)
            return True
        if focus == "contest":
            sign_board(draw, (180, 300, 940, 640), [("Guess how many", None), ("laddoos?", coral),
                                                     ("Win the jar!", sage)], ink, size=54)
            table(draw, 1060, 1700, 760)
            jar(draw, 1380, 748, 1.0)
            stars_pts(draw, [(1120, 360), (1660, 380)], progress)
            return True
        if focus == "problem":
            circ(draw, 760, 560, 300, coral_soft)
            jar(draw, 760, 830, 1.2)
            K.draw_padlock(draw, 960, 360, 0.9, K.DANGER)
            K.text_at(draw, "Sealed tight!", 1380, 380 + lift, F(66, bold=True), K.DANGER)
            draw.rounded_rectangle((1110, 520, 1650, 660), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=5)
            K.draw_cross(draw, 1180, 590, 36, K.DANGER)
            draw.text((1240, 560), "No counting!", fill=ink, font=F(50, bold=True))
            return True
        if focus == "why":
            circ(draw, 640, 560, 280, LAV_SOFT)
            kid(draw, 640, 500, 1.3, PINK, t)
            for k, (qx, qy) in enumerate(((330, 300), (950, 290), (300, 600), (980, 600))):
                K.text_at(draw, "?", qx, qy, F(int(84 + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)
            jar(draw, 1420, 800, 0.95)
            K.text_at(draw, "What should Riya do?", cx, 222, F(46, bold=True), ink)
            K.draw_stopwatch(draw, 1750, 520, 48, progress, brand)
            return True
        if focus == "wild":
            kid(draw, 280, 520, 1.05, K.GOLD, t, style="kabir", mood="shout")
            K.text_at(draw, "Kabir", 280, 720, F(38, bold=True), (200, 140, 20))
            kid(draw, 1640, 520, 1.05, K.BOTH_COLOR, t, style="boy", mood="shout")
            jar(draw, cx, 830, 0.95)
            a = K.stagger(progress, 0, step=0.25, speed=4)
            if a > 0:
                K.draw_bubble(draw, (170, 240, 650, 380), brand, "A million!", tail="left", size=52)
            b = K.stagger(progress, 1, step=0.25, speed=4)
            if b > 0:
                K.draw_bubble(draw, (1300, 240, 1700, 380), brand, "Three!", tail="right", size=52)
            if progress > 0.55:
                K.draw_cross(draw, 640, 250, 34, K.DANGER)
                K.draw_cross(draw, 1690, 250, 34, K.DANGER)
                K.text_at(draw, "Makes sense?", cx, 252, F(48, bold=True), muted)
            return True
        # smart
        kid(draw, 460, 520, 1.3, PINK, t)
        K.draw_bubble(draw, (620, 250, 1100, 400), brand, "Hmm, about 20?", tail="left", size=48)
        jar(draw, 1400, 820, 1.0)
        K.draw_magnifier(draw, 1530, 560, 0.9, coral)
        K.pill(draw, 0, 560, "not tiny · not huge", sage, size=34, left=640)
        return True

    # ---- definition -------------------------------------------------------------
    if visual == "c16-define":
        if focus == "name":
            jar(draw, 420, 820, 1.05)
            a = K.ease_out_cubic(K.clamp01((progress - 0.25) * 2.5))
            if a > 0:
                K.draw_arrow(draw, 680, 560, 680 + 220 * a, 560, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.45) * 2.5))
            if b > 0:
                s = 0.8 + 0.2 * b
                mx, my = 1340, 560
                hw, hh = 400 * s, 160 * s
                K.shadow_card(draw, (mx - hw, my - hh, mx + hw, my + hh), brand, radius=40, outline=coral, outline_w=6)
                K.text_at(draw, "It's called an", mx, my - 110 * s, F(int(42 * s), bold=True), muted)
                K.text_at(draw, "ESTIMATE", mx, my - 40 * s, F(int(104 * s), bold=True), coral)
            return True
        if focus == "meaning":
            K.shadow_card(draw, (220, 250 + lift, w - 220, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "An estimate is…", cx, 340 + lift, F(46, bold=True), muted)
            parts = [("a sensible guess,", coral), ("close to the", sage), ("real answer.", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 440 + i * 120 + int((1 - a) * 30)
                K.text_at(draw, txt, cx, y, F(76, bold=True), col)
            return True
        # parts
        cols = [("Not exact", muted, (244, 240, 234), "takes too long", False),
                ("Not wild", K.DANGER, K.DANGER_SOFT, "a million? no!", False),
                ("Smart & close", sage, sage_soft, "use what you know", True)]
        for i, (title, col, soft, sub, ok) in enumerate(cols):
            a = K.stagger(progress, i, step=0.22, speed=3.5)
            if a <= 0:
                continue
            x0 = 150 + i * 560
            y0 = 250 + int((1 - a) * 50)
            draw.rounded_rectangle((x0, y0, x0 + 500, y0 + 600), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, title, x0 + 250, y0 + 40, F(54, bold=True), col)
            ix, iy = x0 + 250, y0 + 300
            if i == 0:
                for k in range(4):
                    for m in range(4):
                        draw.line((ix - 170 + k * 70 + m * 12, iy - 70, ix - 170 + k * 70 + m * 12, iy + 10),
                                  fill=K.DEV_MID, width=6)
                    draw.line((ix - 178 + k * 70, iy - 20, ix - 120 + k * 70, iy - 50), fill=K.DEV_MID, width=6)
                K.draw_stopwatch(draw, ix, iy + 90, 44, progress, brand)
            elif i == 1:
                K.text_at(draw, "1,000,000", ix, iy - 60, F(70, bold=True), K.DANGER)
                K.draw_cross(draw, ix, iy + 80, 44, K.DANGER)
            else:
                target(draw, ix - 20, iy, 110, sage)
            K.text_at(draw, sub, x0 + 250, y0 + 500, F(36, bold=True), ink)
            if not ok and i == 0:
                K.draw_cross(draw, x0 + 450, y0 + 60, 26, muted)
        return True

    # ---- sensible guesses -----------------------------------------------------------
    if visual == "c16-sensible":
        if focus == "intro":
            circ(draw, 560, 560, 260, sage_soft)
            lightbulb(draw, 560, 520, 1.7, glow=pulse)
            K.text_at(draw, "Use what you", 1290, 300 + lift, F(66, bold=True), ink)
            K.text_at(draw, "already know!", 1290, 384 + lift, F(66, bold=True), sage)
            items = [("pencil", "a pencil"), ("bus", "a school bus"), ("hand", "your hand")]
            for i, (kind, lab) in enumerate(items):
                a = K.stagger(progress, i + 1, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 1010 + i * 280
                y = 600 + int((1 - a) * 30)
                circ(draw, x, y, 100, panel, line, 4)
                if kind == "pencil":
                    pencil(draw, x - 80, x + 80, y, 30)
                elif kind == "bus":
                    bus(draw, x - 76, y - 40, 0.19, t, faces=0)
                else:
                    draw.rounded_rectangle((x - 40, y - 30, x + 40, y + 60), radius=28, fill=K.SKIN)
                    for k in range(4):
                        draw.rounded_rectangle((x - 40 + k * 21, y - 72 + abs(k - 1.5) * 10, x - 22 + k * 21, y - 10),
                                               radius=9, fill=K.SKIN)
                    draw.rounded_rectangle((x + 30, y - 10, x + 70, y + 14), radius=11, fill=K.SKIN)
                K.text_at(draw, lab, x, y + 116, F(32, bold=True), ink)
            return True
        if focus == "pencil":
            cmpx = 66
            rx0 = 300
            ruler(draw, rx0, 420, cmpx, 20, ink)
            pencil(draw, rx0, rx0 + 15 * cmpx, 360, 56)
            K.text_at(draw, "≈ 15 cm", rx0 + 15 * cmpx + 150, 330, F(52, bold=True), sage)
            opts = [("15 m", "longer than a bus!", False), ("1 cm", "fingernail size!", False),
                    ("15 cm", "fits in your hand", True)]
            for i, (big, sub, ok) in enumerate(opts):
                a = K.stagger(progress, i + 1, step=0.18, speed=4)
                if a <= 0:
                    continue
                x0 = 230 + i * 500
                y0 = 600 + int((1 - a) * 30)
                col = sage if ok else K.DANGER
                draw.rounded_rectangle((x0, y0, x0 + 440, y0 + 230), radius=36,
                                       fill=sage_soft if ok else K.DANGER_SOFT, outline=col, width=5)
                K.text_at(draw, big, x0 + 220, y0 + 30, F(70, bold=True), col)
                K.text_at(draw, sub, x0 + 220, y0 + 140, F(34, bold=True), ink)
                (K.draw_check if ok else K.draw_cross)(draw, x0 + 400, y0 + 40, 26, col)
            return True
        # bus
        bus(draw, 140, 330, 0.95, t)
        K.text_at(draw, "≈ 20 seats × 2 = 40", 520, 700, F(50, bold=True), sage)
        opts = [("4", "just a car full", False), ("about 40", "sensible!", True), ("4,000", "a whole stadium!", False)]
        for i, (big, sub, ok) in enumerate(opts):
            a = K.stagger(progress, i + 1, step=0.18, speed=4)
            if a <= 0:
                continue
            y0 = 260 + i * 200 + int((1 - a) * 30)
            col = sage if ok else K.DANGER
            draw.rounded_rectangle((1100, y0, 1740, y0 + 170), radius=36, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=5)
            draw.text((1150, y0 + 24), big, fill=col, font=F(60, bold=True))
            draw.text((1150, y0 + 104), sub, fill=ink, font=F(34, bold=True))
            (K.draw_check if ok else K.draw_cross)(draw, 1680, y0 + 85, 30, col)
        return True

    # ---- laddoo guess-check-improve ------------------------------------------------------
    if visual == "c16-loop":
        if focus == "intro":
            kid(draw, 330, 480, 1.15, PINK, t)
            uncle(draw, 830, 470, 1.15, t)
            K.text_at(draw, "Mela uncle", 830, 720, F(36, bold=True), muted)
            for i, kind in enumerate(("small", "big", "right")):
                a = K.stagger(progress, i + 1, step=0.15, speed=4)
                if a <= 0:
                    continue
                clue_card(draw, 1150, 300 + i * 160 + int((1 - a) * 30), 560, kind, sage, size=48)
            return True
        if focus == "name":
            cycle(draw, 560, 570, 230, ["Guess", "Check", "Improve"], [coral, K.BOTH_COLOR, sage],
                  int(progress * 3.2) % 3, progress, r=105, size=38)
            K.text_at(draw, "Riya's tries", 1360, 290, F(44, bold=True), muted)
            tries = [("20", "small"), ("30", "big"), ("25", "right")]
            for i, (num, kind) in enumerate(tries):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 380 + i * 150 + int((1 - a) * 20)
                circ(draw, 1060, y + 48, 48, panel, coral, 5)
                K.text_at(draw, num, 1060, y + 26, F(44, bold=True), coral)
                clue_card(draw, 1140, y, 520, kind, sage, size=40)
            return True
        X = number_line(draw, 260, 1660, 640, 0, 40, 5, 10, ink, muted)
        g = {"g1": 1, "g2": 2, "g3": 3}[focus]
        lo_v = 20 if g >= 1 else 0
        hi_v = 30 if g >= 2 else 40
        sh = K.ease_out_cubic(K.clamp01((progress - 0.35) * 3))
        if sh > 0 and g < 3:
            draw.rounded_rectangle((X(lo_v), 612, X(lo_v) + (X(hi_v) - X(lo_v)) * sh, 668), radius=20,
                                   fill=(196, 236, 226))
            draw.line((X(0) - 20, 640, X(40) + 20, 640), fill=ink, width=6)
            K.text_at(draw, "answer is here", (X(lo_v) + X(hi_v)) / 2, 740, F(34, bold=True), sage)
        flag(draw, X(20), 640, "20", SMALL_COL)
        if g >= 2:
            flag(draw, X(30), 640, "30", BIG_COL)
        if g >= 3:
            flag(draw, X(25), 640, "25", sage)
        kid(draw, 230, 330, 0.7, PINK, t)
        guess = {1: "20", 2: "30", 3: "25"}[g]
        K.draw_bubble(draw, (330, 240, 560, 340), brand, f"{guess}?", tail="left", size=46)
        uncle(draw, 1700, 330, 0.7, t)
        a = K.ease_out_cubic(K.clamp01((progress - 0.15) * 3))
        if a > 0:
            kind = {1: "small", 2: "big", 3: "right"}[g]
            clue_card(draw, 1080, 260, 500, kind, sage, size=46)
        if g == 3 and progress > 0.5:
            jar(draw, 1135, 860, 0.42, sealed=False)
            stars_pts(draw, [(800, 790), (1470, 790), (700, 300), (960, 260)], progress)
        if g == 1 and progress > 0.5:
            K.draw_arrow(draw, X(20) + 30, 800, X(20) + 220 + 20 * pulse, 800, SMALL_COL, width=12, head=32)
            K.text_at(draw, "go bigger", X(20) + 120, 820, F(30, bold=True), SMALL_COL)
        return True

    # ---- clue rule + quiz -----------------------------------------------------------------
    if visual == "c16-clues":
        if focus == "rule":
            specs = [("small", "Go BIGGER", SMALL_COL, BLUE_SOFT, 1), ("big", "Go SMALLER", BIG_COL, K.DANGER_SOFT, -1)]
            for i, (kind, act, col, soft, d) in enumerate(specs):
                a = K.stagger(progress, i, step=0.3, speed=3.5)
                if a <= 0:
                    continue
                x0 = 180 + i * 800
                y0 = 260 + int((1 - a) * 40)
                draw.rounded_rectangle((x0, y0, x0 + 760, y0 + 580), radius=44, fill=soft, outline=col, width=6)
                clue_card(draw, x0 + 130, y0 + 50, 500, kind, sage, size=48)
                K.draw_arrow(draw, x0 + 380, y0 + 180, x0 + 380, y0 + 280, K.DEV_MID, width=10, head=28)
                X = number_line(draw, x0 + 100, x0 + 660, y0 + 400, 0, 10, 1, 5, ink, muted, size=28)
                sx = X(5)
                circ(draw, sx, y0 + 400, 16, col)
                ex = sx + d * 220 * K.clamp01(a * 1.2)
                K.draw_arrow(draw, sx, y0 + 340, ex, y0 + 340, col, width=12, head=32)
                K.text_at(draw, act, x0 + 380, y0 + 470, F(52, bold=True), col)
            return True
        X = number_line(draw, 260, 1660, 600, 0, 60, 5, 10, ink, muted)
        if focus == "a":
            sh = K.ease_out_cubic(K.clamp01(progress * 3))
            draw.rounded_rectangle((X(30), 572, X(30) + (X(40) - X(30)) * sh, 628), radius=20, fill=(196, 236, 226))
            draw.line((X(0) - 20, 600, X(60) + 20, 600), fill=ink, width=6)
        flag(draw, X(40), 600, "40 · too big", BIG_COL, size=34)
        flag(draw, X(30), 600, "30 · too small", SMALL_COL, up=False, size=34)
        if focus == "q":
            K.text_at(draw, "Where is the answer?", cx, 250, F(56, bold=True), ink)
            K.draw_stopwatch(draw, 1580, 790, 46, progress, brand)
            jar(draw, 330, 860, 0.45)
        else:
            K.text_at(draw, "Between 30 and 40!", cx, 250, F(64, bold=True), sage)
            K.pill(draw, (X(30) + X(40)) / 2, 380, "here!", sage, size=40)
            stars_pts(draw, [(X(10), 380), (X(55), 400), (X(52), 780)], progress)
        return True

    # ---- secret number ----------------------------------------------------------------------
    if visual == "c16-secret":
        if focus == "intro":
            kid(draw, 420, 480, 1.25, K.GOLD, t, style="kabir")
            K.text_at(draw, "Kabir", 420, 730, F(40, bold=True), (200, 140, 20))
            draw.ellipse((590, 300, 650, 340), fill=panel, outline=ink, width=3)
            draw.ellipse((640, 250, 720, 300), fill=panel, outline=ink, width=3)
            draw.rounded_rectangle((700, 170 + 60, 1180, 170 + 240), radius=60, fill=panel, outline=ink, width=4)
            K.text_at(draw, "Secret!", 940, 270, F(56, bold=True), K.BOTH_COLOR)
            X = number_line(draw, 900, 1700, 620, 0, 100, 10, 50, ink, muted, lo_label="1")
            K.text_at(draw, "somewhere from 1 to 100", 1300, 740, F(38, bold=True), ink)
            K.text_at(draw, "?", X(10 + 80 * ((progress * 2) % 1)), 480, F(80, bold=True), K.GOLD)
            return True
        X = number_line(draw, 220, 1700, 620, 0, 100, 5, 25, ink, muted, lo_label="1")
        g25, g50 = X(25), X(50)
        dim = (226, 220, 210)
        draw.rounded_rectangle((X(0) - 10, 596, g25, 644), radius=16, fill=dim)
        draw.rounded_rectangle((g50, 596, X(100) + 10, 644), radius=16, fill=dim)
        draw.rounded_rectangle((g25, 596, g50, 644), radius=16, fill=(196, 236, 226))
        draw.line((X(0) - 20, 620, X(100) + 20, 620), fill=ink, width=6)
        flag(draw, g50, 620, "50 · too big", BIG_COL, size=34)
        flag(draw, g25, 620, "25 · too small", SMALL_COL, size=34)
        if focus == "clues":
            K.text_at(draw, "The secret is between 25 and 50", cx, 260, F(52, bold=True), ink)
            K.text_at(draw, "out!", (X(50) + X(100)) / 2, 700, F(36, bold=True), muted)
            K.text_at(draw, "out!", (X(0) + X(25)) / 2, 700, F(36, bold=True), muted)
            return True
        opts = [("10", X(10)), ("60", X(60))]
        if focus == "q":
            K.text_at(draw, "Smartest next guess?", cx, 250, F(56, bold=True), ink)
            for k, (lab, x) in enumerate(opts):
                circ(draw, x, 760, 50, panel, K.BOTH_COLOR, 5)
                K.text_at(draw, lab, x, 738, F(40, bold=True), K.BOTH_COLOR)
            circ(draw, (g25 + g50) / 2, 760, 50, panel, K.BOTH_COLOR, 5)
            K.text_at(draw, "?", (g25 + g50) / 2, 732, F(52, bold=True), K.BOTH_COLOR)
            K.draw_stopwatch(draw, 1600, 300, 44, progress, brand)
            return True
        g37 = X(37)
        K.text_at(draw, "About 37 · right in the middle!", cx, 250, F(54, bold=True), sage)
        a = K.ease_out_cubic(K.clamp01(progress * 3))
        circ(draw, g37, 620, 18 + 6 * a, sage, panel, 4)
        bracket(draw, g25 + 6, g37 - 6, 700, sage, "half", F(30, bold=True), up=False)
        bracket(draw, g37 + 6, g50 - 6, 700, sage, "half", F(30, bold=True), up=False)
        K.pill(draw, g37, 790, "37", sage, size=40)
        for lab, x in opts:
            circ(draw, x, 790, 42, K.DANGER_SOFT, K.DANGER, 4)
            K.text_at(draw, lab, x, 770, F(36, bold=True), K.DANGER)
            K.draw_cross(draw, x + 40, 760, 18, K.DANGER)
        return True

    # ---- debugging --------------------------------------------------------------------------
    if visual == "c16-debug":
        if focus == "intro":
            draw.rounded_rectangle((260 + 10, 270 + 12, 1000 + 10, 760 + 12), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((260, 270, 1000, 760), radius=30, fill=K.DEV_DARK)
            draw.rounded_rectangle((260, 270, 1000, 330), radius=30, fill=K.DEV_MID)
            draw.rectangle((260, 300, 1000, 330), fill=K.DEV_MID)
            for k, col in enumerate((K.DANGER, K.GOLD, K.LEAF)):
                circ(draw, 300 + k * 40, 300, 11, col)
            for k, (wd, col) in enumerate(((420, (120, 190, 242)), (300, K.GOLD), (480, (150, 220, 160)),
                                           (360, (240, 140, 150)), (260, (120, 190, 242)))):
                draw.rounded_rectangle((310, 370 + k * 70, 310 + wd, 400 + k * 70), radius=12, fill=col)
            ladybug(draw, 880, 640, 50)
            K.text_at(draw, "Coders do it too!", 1390, 340 + lift, F(64, bold=True), ink)
            for i, (lab, col) in enumerate((("Guess", coral), ("Check", K.BOTH_COLOR), ("Improve", sage))):
                a = K.stagger(progress, i + 1, step=0.15, speed=4)
                if a > 0:
                    K.pill(draw, 1390, 470 + i * 110 + int((1 - a) * 20), lab, col, size=40)
            return True
        if focus == "loop":
            cycle(draw, 560, 570, 230, ["Try", "Test", "Fix"], [coral, K.BOTH_COLOR, sage], int(progress * 3.6) % 3,
                  progress, r=100, size=44)
            rows = [("Try", "Guess", coral), ("Test", "Check", K.BOTH_COLOR), ("Fix", "Improve", sage)]
            for i, (a_, b_, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 130 + int((1 - a) * 20)
                draw.rounded_rectangle((1000, y, 1740, y + 104), radius=30, fill=panel, outline=col, width=4)
                draw.text((1040, y + 28), a_, fill=col, font=F(44, bold=True))
                K.text_at(draw, "=", 1290, y + 26, F(44, bold=True), muted)
                draw.text((1360, y + 28), b_, fill=ink, font=F(44, bold=True))
            b = K.stagger(progress, 4, step=0.12, speed=4)
            if b > 0:
                K.pill(draw, 1370, 720 + int((1 - b) * 20), "= DEBUGGING", K.DANGER, size=42)
                ladybug(draw, 1730, 760, 34)
            return True
        # kachhu
        cell = 100
        gx, gy = 220, 330
        draw.rounded_rectangle((gx - 26 + 10, gy - 26 + 12, gx + 5 * cell + 36, gy + 5 * cell + 38), radius=26,
                               fill=K.SHADOW)
        draw.rounded_rectangle((gx - 26, gy - 26, gx + 5 * cell + 26, gy + 5 * cell + 26), radius=26,
                               fill=(255, 253, 246), outline=line, width=3)
        for i in range(6):
            draw.line((gx + i * cell, gy, gx + i * cell, gy + 5 * cell), fill=(226, 218, 204), width=2)
            draw.line((gx, gy + i * cell, gx + 5 * cell, gy + i * cell), fill=(226, 218, 204), width=2)
        a0, a1, b0, b1 = gx + 0.5 * cell, gx + 4.5 * cell, gy + 0.5 * cell, gy + 4.5 * cell
        draw.line((a0, b1, a0, b0, a1, b0, a1, b1), fill=coral, width=12, joint="curve")
        stage = min(2, int(progress * 3.2))
        fix = K.clamp01((progress - 0.66) * 3)
        if fix > 0:
            xe = K.lerp(a1, a0, fix)
            draw.line((a1, b1, xe, b1), fill=sage, width=12)
            turtle_top(draw, xe, b1, 270, 0.65, t)
        else:
            K.draw_dashed(draw, a1, b1, a0, b1, K.DANGER, width=8, phase=progress * 120)
            if stage >= 1:
                ladybug(draw, (a0 + a1) / 2, b1 - 70, 30)
            turtle_top(draw, a1, b1, 270, 0.65, t)
        K.text_at(draw, "Meera's square", gx + 2.5 * cell, 250, F(40, bold=True), muted)
        steps = [("Try", "run the program", coral), ("Test", "only 3 sides!", K.BOTH_COLOR),
                 ("Fix", "add forward 4", sage)]
        for i, (a_, b_, col) in enumerate(steps):
            on = i <= stage
            y = 320 + i * 170
            draw.rounded_rectangle((900, y, 1720, y + 140), radius=36, fill=panel if on else (246, 243, 238),
                                   outline=col if on else line, width=5 if on else 3)
            circ(draw, 970, y + 70, 40, col if on else line)
            K.text_at(draw, str(i + 1), 970, y + 46, F(44, bold=True), (255, 255, 255))
            draw.text((1040, y + 20), a_, fill=col if on else muted, font=F(44, bold=True))
            draw.text((1040, y + 78), b_, fill=ink if on else muted, font=F(34, bold=True))
            if on and (i < 2 or fix >= 1):
                K.draw_check(draw, 1660, y + 70, 26, col)
        return True

    # ---- brave first guesses -------------------------------------------------------------------
    if visual == "c16-brave":
        if focus == "wrong":
            kid(draw, 460, 500, 1.3, PINK, t, mood="worried")
            draw.rounded_rectangle((900, 280, 1300, 600), radius=40, fill=panel, outline=SMALL_COL, width=6)
            K.text_at(draw, "Guess", 1100, 310, F(40, bold=True), muted)
            K.text_at(draw, "20", 1100, 370, F(140, bold=True), SMALL_COL)
            clue_card(draw, 1340, 400, 400, "small", sage, size=44)
            K.text_at(draw, "Is that bad?", 1200, 700, F(66, bold=True), coral)
            return True
        kid(draw, 330, 500, 1.2, PINK, t)
        tries = [("20", "small"), ("30", "big"), ("25", "right")]
        for i, (num, kind) in enumerate(tries):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x0 = 640 + i * 380
            y0 = 300 + int((1 - a) * 30)
            col = {"small": SMALL_COL, "big": BIG_COL, "right": sage}[kind]
            draw.rounded_rectangle((x0, y0, x0 + 320, y0 + 300), radius=36, fill=panel, outline=col, width=5)
            K.text_at(draw, num, x0 + 160, y0 + 30, F(110, bold=True), col)
            lab = {"small": "go bigger", "big": "go smaller", "right": "got it!"}[kind]
            K.text_at(draw, lab, x0 + 160, y0 + 200, F(38, bold=True), ink)
            if i < 2:
                K.draw_arrow(draw, x0 + 328, y0 + 150, x0 + 372, y0 + 150, K.DEV_MID, width=8, head=20)
        b = K.stagger(progress, 3, step=0.15, speed=4)
        if b > 0:
            K.pill(draw, 1210, 700 + int((1 - b) * 20), "Every try teaches you something!", coral, size=40)
            K.draw_heart(draw, 520, 330 + bounce, 30, coral)
        return True

    # ---- school hall ------------------------------------------------------------------------------
    if visual == "c16-hall":
        x0, x1 = 260, 1660
        per_m = (x1 - x0) / 10
        fy0, fy1 = 470, 640
        draw.rounded_rectangle((x0 - 60 + 10, fy0 - 20 + 12, x1 + 60 + 10, fy1 + 20 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((x0 - 60, fy0 - 20, x1 + 60, fy1 + 20), radius=24, fill=FLOOR, outline=FLOOR_DARK,
                               width=4)
        for k in range(1, 14):
            xx = x0 - 60 + k * 110
            draw.line((xx, fy0 - 20, xx, fy1 + 20), fill=FLOOR_DARK, width=2)
        draw.rectangle((x0 - 60, fy0 - 20, x0 - 40, fy1 + 20), fill=WOOD_DARK)
        draw.rectangle((x1 + 40, fy0 - 20, x1 + 60, fy1 + 20), fill=WOOD_DARK)
        if focus in ("intro", "facts"):
            kid(draw, 150, 330, 0.6, PINK, t)
        if focus == "intro":
            K.text_at(draw, "School hall", cx, 250, F(56, bold=True), ink)
            n = int(K.clamp01(progress * 1.2) * 8)
            for k in range(n):
                footprint(draw, x0 + 40 + k * per_m / 2, fy0 + (50 if k % 2 == 0 else 120), 1.0, K.DEV_MID)
            K.text_at(draw, "How many steps?", cx, 700, F(52, bold=True), coral)
            K.text_at(draw, "?", x1 - 60, fy0 + 30, F(int(80 + 16 * pulse), bold=True), K.GOLD)
            return True
        if focus == "facts":
            a = K.stagger(progress, 0, step=0.2, speed=4)
            if a > 0:
                bracket(draw, x0, x0 + (x1 - x0) * a, 420, coral, "≈ 10 m", F(48, bold=True))
            b = K.stagger(progress, 2, step=0.2, speed=4)
            if b > 0:
                footprint(draw, cx - 75, 555, 1.5, K.DEV_MID)
                footprint(draw, cx + 75, 555, 1.5, K.DEV_MID)
                bracket(draw, cx - 75, cx + 75, 690, sage, "1 step ≈ 50 cm", F(44, bold=True), up=False)
            return True
        if focus == "work":
            for m in range(11):
                x = x0 + m * per_m
                draw.line((x, fy1 - 10, x, fy1 + 30), fill=ink, width=4)
                K.text_at(draw, f"{m}", x, fy1 + 40, F(30, bold=True), muted)
            K.text_at(draw, "metres", x1 + 10, fy1 + 84, F(28, bold=True), muted)
            n = int(K.clamp01((progress - 0.05) * 1.25) * 20)
            for k in range(n):
                fx = x0 + per_m / 4 + k * per_m / 2
                footprint(draw, fx, fy0 + (45 if k % 2 == 0 else 115), 0.9, sage if k < 2 else K.DEV_MID)
            bracket(draw, x0 + 4, x0 + per_m - 4, 420, sage, "2 steps = 1 m", F(36, bold=True))
            K.text_at(draw, f"steps: {n}", cx, 760, F(54, bold=True), coral if n < 20 else sage)
            return True
        # also
        n = 20
        for k in range(n):
            fx = x0 + per_m / 4 + k * per_m / 2
            footprint(draw, fx, fy0 + (45 if k % 2 == 0 else 115), 0.9, K.DEV_MID)
        bracket(draw, x0, x1, 420, coral, "10 m = 1,000 cm", F(44, bold=True))
        a = K.stagger(progress, 1, step=0.2, speed=4)
        if a > 0:
            K.text_at(draw, "1,000 ÷ 50 = 20 steps", cx, 700 + int((1 - a) * 20), F(72, bold=True), sage)
        return True

    # ---- checkpoint ---------------------------------------------------------------------------------
    if visual == "c16-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, F(40, bold=True), sage)
            K.text_at(draw, "Estimate like a pro!", cx, 450 + lift, F(64, bold=True), ink)
            for k in range(3):
                laddoo(draw, cx - 90 + k * 90, 620 + lift, 34)
            return True
        x0, x1 = 360, 1560
        bw = (x1 - x0) / 50
        yb = 760
        shelf(draw, x0, x1, yb)
        bracket(draw, x0, x1, 500, coral, "1 m = 100 cm", F(42, bold=True))
        if focus == "ask":
            books_row(draw, x0, yb, bw, 3)
            K.text_at(draw, "?", (x0 + x1) / 2, 600, F(int(90 + 16 * pulse), bold=True), K.GOLD)
            draw.rounded_rectangle((x0 + 3 * bw + 40, 560, x0 + 3 * bw + 260, 640), radius=24, fill=panel,
                                   outline=sage, width=4)
            K.text_at(draw, "book = 2 cm", x0 + 3 * bw + 150, 580, F(30, bold=True), sage)
            K.text_at(draw, "About how many books fit?", cx, 250, F(54, bold=True), ink)
            K.draw_stopwatch(draw, 1730, 640, 44, progress, brand)
            return True
        n = int(K.clamp01((progress - 0.05) * 1.3) * 50)
        books_row(draw, x0, yb, bw, n)
        K.text_at(draw, "100 cm ÷ 2 cm = 50", cx, 250, F(64, bold=True), sage)
        K.text_at(draw, f"books: {n}", cx, 360, F(44, bold=True), coral if n < 50 else sage)
        if n >= 50:
            stars_pts(draw, [(250, 420), (1680, 420), (250, 700), (1680, 700)], progress)
        return True

    # ---- recap ----------------------------------------------------------------------------------------
    if visual == "c16-recap":
        recap = [("Estimate = sensible guess", coral, "target"), ("Guess → Check → Improve", K.BOTH_COLOR, "loop"),
                 ("Too small → bigger\nToo big → smaller", SMALL_COL, "arrows"), ("Wrong first guess? OK!", sage, "heart")]
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
                if kind == "target":
                    target(draw, ix - 10, iy, 90, sage)
                elif kind == "loop":
                    for k, c2 in enumerate((coral, K.BOTH_COLOR, sage)):
                        a2 = math.radians(-90 + k * 120)
                        circ(draw, ix + math.cos(a2) * 80, iy + math.sin(a2) * 80, 36, c2)
                    draw.arc((ix - 80, iy - 80, ix + 80, iy + 80), -60, 200, fill=K.DEV_MID, width=6)
                elif kind == "arrows":
                    K.draw_arrow(draw, ix - 70, iy + 70, ix - 70, iy - 80, SMALL_COL, width=16, head=40)
                    K.draw_arrow(draw, ix + 70, iy - 80, ix + 70, iy + 70, BIG_COL, width=16, head=40)
                else:
                    K.draw_heart(draw, ix, iy - 10, 60, coral)
                    K.draw_check(draw, ix + 80, iy + 60, 30, sage)
                font = F(36, bold=True) if "\n" not in lab else F(32, bold=True)
                lines = [ln for part in lab.split("\n") for ln in K.wrap_text(part, font, 350)]
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 320), 430, 110, sage, panel, bounce)
            kid(draw, cx + 320, 410, 1.0, PINK, t)
            K.text_at(draw, "Chapter 1 done!", cx, 650, F(68, bold=True), ink)
            K.pill(draw, cx, 760, "Thinking like a problem solver", coral, size=36)
            stars_pts(draw, [(cx - 620, 320), (cx + 620, 320), (cx - 600, 640), (cx + 600, 640), (cx, 300)], progress)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
