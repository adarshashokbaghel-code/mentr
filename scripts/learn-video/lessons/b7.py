"""B7 · Patterns Everywhere — visuals."""
import math

import build as K

ORANGE = (255, 138, 20)
ORANGE_DARK = (214, 92, 10)
YELLOW = (255, 204, 40)
YELLOW_DARK = (226, 150, 16)
PINK = (238, 104, 158)
PINK_DARK = (196, 64, 118)
WHITE_FL = (250, 246, 236)
WHITE_DARK = (214, 204, 186)
RED = (226, 62, 70)
BLUE = (60, 120, 220)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
CLAY = (200, 100, 60)
CLAY_DARK = (160, 70, 40)
MANGO = (255, 196, 40)
MANGO_BLUSH = (255, 146, 40)
MANGO_GREEN = (126, 184, 72)
MANGO_GREEN_DARK = (92, 146, 50)
SPOT = (120, 78, 40)
TREE = (70, 150, 84)
TREE_DARK = (50, 120, 66)
TRUNK = (140, 96, 60)

FLOWER_COLS = {"o": (ORANGE, ORANGE_DARK), "y": (YELLOW, YELLOW_DARK), "p": (PINK, PINK_DARK),
               "w": (WHITE_FL, WHITE_DARK)}


def S_(s):
    return lambda v: v * s


def kid(draw, cx, cy, s, body, t=0.0, bun=True, flower=False):
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
    if flower:
        marigold(draw, cx + r * 0.75, cy - r * 0.8, r * 0.32, "o")


def marigold(draw, cx, cy, r, kind="o"):
    col, dark = FLOWER_COLS[kind]
    for k in range(10):
        a = k * math.pi / 5
        px, py = cx + math.cos(a) * r * 0.55, cy + math.sin(a) * r * 0.55
        draw.ellipse((px - r * 0.48, py - r * 0.48, px + r * 0.48, py + r * 0.48), fill=dark)
    for k in range(8):
        a = k * math.pi / 4 + 0.3
        px, py = cx + math.cos(a) * r * 0.32, cy + math.sin(a) * r * 0.32
        draw.ellipse((px - r * 0.42, py - r * 0.42, px + r * 0.42, py + r * 0.42), fill=col)
    draw.ellipse((cx - r * 0.24, cy - r * 0.24, cx + r * 0.24, cy + r * 0.24), fill=dark)


def leaf(draw, cx, cy, s, ang=0.0):
    S = S_(s)
    tip = (cx + math.cos(ang) * S(30), cy + math.sin(ang) * S(30))
    nx, ny = -math.sin(ang) * S(10), math.cos(ang) * S(10)
    mx, my = (cx + tip[0]) / 2, (cy + tip[1]) / 2
    draw.polygon([(cx, cy), (mx + nx, my + ny), tip, (mx - nx, my - ny)], fill=K.LEAF)


def garland(draw, pts, kinds, r, n_shown=None):
    """String through pts, one flower per pt. kinds: 'o','y','p','w' or None for a gap."""
    draw.line(pts, fill=K.LEAF, width=max(3, int(r * 0.14)), joint="curve")
    for i, (p, k) in enumerate(zip(pts, kinds)):
        if n_shown is not None and i >= n_shown:
            break
        if i < len(pts) - 1:
            q = pts[i + 1]
            leaf(draw, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, r / 60, ang=0.6 if i % 2 else -0.6)
        if k:
            marigold(draw, p[0], p[1], r, k)


def sag_pts(x0, x1, y, n, sag):
    out = []
    for i in range(n):
        f = i / max(1, n - 1)
        out.append((x0 + (x1 - x0) * f, y + sag * 4 * f * (1 - f)))
    return out


def diya(draw, cx, cy, s, t):
    S = S_(s)
    draw.ellipse((cx - S(70), cy + S(14), cx + S(70), cy + S(34)), fill=K.SHADOW)
    draw.chord((cx - S(70), cy - S(40), cx + S(70), cy + S(40)), 0, 180, fill=CLAY)
    draw.ellipse((cx - S(70), cy - S(12), cx + S(70), cy + S(12)), fill=CLAY_DARK)
    fl = S(6) * math.sin(t * 30)
    draw.ellipse((cx - S(14), cy - S(62) + fl, cx + S(14), cy - S(8)), fill=K.GOLD)
    draw.ellipse((cx - S(7), cy - S(40) + fl, cx + S(7), cy - S(12)), fill=(255, 250, 220))


def balloon(draw, cx, cy, r, col):
    draw.line([(cx, cy + r), (cx - r * 0.2, cy + r * 1.6), (cx + r * 0.1, cy + r * 2.2)], fill=K.DEV_MID,
              width=max(2, int(r * 0.05)), joint="curve")
    draw.ellipse((cx - r + r * 0.08, cy - r * 1.2 + r * 0.1, cx + r + r * 0.08, cy + r + r * 0.1), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r * 1.2, cx + r, cy + r), fill=col)
    draw.polygon([(cx - r * 0.14, cy + r * 1.12), (cx + r * 0.14, cy + r * 1.12), (cx, cy + r * 0.94)], fill=col)
    draw.ellipse((cx - r * 0.55, cy - r * 0.85, cx - r * 0.25, cy - r * 0.35), fill=(255, 255, 255))


def shape(draw, kind, cx, cy, r, col, shadow=True):
    off = r * 0.1
    if kind == "circle":
        if shadow:
            draw.ellipse((cx - r + off, cy - r + off, cx + r + off, cy + r + off), fill=K.SHADOW)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    elif kind == "square":
        q = r * 0.9
        if shadow:
            draw.rounded_rectangle((cx - q + off, cy - q + off, cx + q + off, cy + q + off), radius=r * 0.18,
                                   fill=K.SHADOW)
        draw.rounded_rectangle((cx - q, cy - q, cx + q, cy + q), radius=r * 0.18, fill=col)
    else:
        pts = [(cx, cy - r * 1.05), (cx + r * 1.05, cy + r * 0.8), (cx - r * 1.05, cy + r * 0.8)]
        if shadow:
            draw.polygon([(x + off, y + off) for x, y in pts], fill=K.SHADOW)
        draw.polygon(pts, fill=col)


def clap(draw, cx, cy, s, active=False):
    S = S_(s)
    gap = S(4) if active else S(22)
    for sx in (-1, 1):
        x_in = cx + sx * gap
        x_out = cx + sx * (gap + S(58))
        x0, x1 = sorted((x_in, x_out))
        draw.rounded_rectangle((x0, cy - S(70), x1, cy + S(50)), radius=S(26), fill=K.SKIN)
        for k in range(1, 3):
            fy = cy - S(70) + k * S(22)
            draw.line((x0 + S(14), fy, x1 - S(14), fy), fill=(226, 172, 136), width=max(2, int(S(4))))
        tx = x_out - sx * S(4)
        draw.ellipse((tx - S(16), cy - S(10), tx + S(16), cy + S(26)), fill=(228, 176, 140))
        draw.rounded_rectangle((x0 - S(2), cy + S(40), x1 + S(2), cy + S(76)), radius=S(10), fill=K.CORAL)
    if active:
        for a in (-60, -90, -120):
            ra = math.radians(a)
            draw.line((cx + math.cos(ra) * S(86), cy - S(20) + math.sin(ra) * S(86), cx + math.cos(ra) * S(122),
                       cy - S(20) + math.sin(ra) * S(122)), fill=K.GOLD, width=max(3, int(S(9))))


def stamp(draw, cx, cy, s, active=False):
    S = S_(s)
    lift = 0 if active else S(26)
    y = cy - lift
    draw.line((cx - S(110), cy + S(48), cx + S(110), cy + S(48)), fill=K.DEV_MID, width=max(3, int(S(6))))
    draw.rounded_rectangle((cx - S(40), y - S(80), cx + S(10), y), radius=S(10), fill=K.ROAD)
    draw.rounded_rectangle((cx - S(70), y - S(26), cx + S(78), y + S(30)), radius=S(26), fill=K.CORAL)
    draw.rounded_rectangle((cx - S(72), y + S(22), cx + S(80), y + S(42)), radius=S(8), fill=(255, 255, 255),
                           outline=K.DEV_MID, width=max(1, int(S(3))))
    for k in range(3):
        draw.line((cx - S(16) + k * S(18), y - S(18), cx - S(4) + k * S(18), y - S(6)), fill=(255, 255, 255),
                  width=max(2, int(S(5))))
    if active:
        for sx in (-1, 1):
            for k in range(3):
                bx = cx + sx * (S(84) + k * S(10))
                draw.line((bx, cy + S(40) - k * S(14), bx + sx * S(16), cy + S(22) - k * S(22)), fill=K.GOLD,
                          width=max(3, int(S(7))))


def mango_pts(cx, cy, s, scale=1.0, dx=0.0, dy=0.0):
    a, b, rot = 72 * s * scale, 46 * s * scale, -0.35
    ca, sa = math.cos(rot), math.sin(rot)
    pts = []
    for i in range(40):
        th = 2 * math.pi * i / 40
        x = a * math.cos(th)
        y = b * math.sin(th) * (1 + 0.2 * math.cos(th))
        if math.sin(th) > 0 and math.cos(th) < 0:
            y += b * 0.35 * math.sin(th) * -math.cos(th)
        x, y = x + dx * s, y + dy * s
        pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
    return pts


def mango(draw, cx, cy, s, kind="ripe"):
    S = S_(s)
    body = MANGO_GREEN if kind == "green" else MANGO
    draw.polygon([(x + S(6), y + S(8)) for x, y in mango_pts(cx, cy, s)], fill=K.SHADOW)
    draw.polygon(mango_pts(cx, cy, s), fill=body)
    draw.polygon(mango_pts(cx, cy, s, 0.55, -26, 12), fill=MANGO_GREEN_DARK if kind == "green" else MANGO_BLUSH)
    hl = (190, 226, 150) if kind == "green" else (255, 236, 170)
    draw.ellipse((cx + S(14), cy - S(30), cx + S(44), cy - S(16)), fill=hl)
    if kind == "spotty":
        for dx, dy, rr in ((-30, 0, 10), (10, 14, 9), (32, -16, 7), (-6, -18, 6), (-40, 22, 7)):
            draw.ellipse((cx + S(dx) - S(rr), cy + S(dy) - S(rr), cx + S(dx) + S(rr), cy + S(dy) + S(rr)), fill=SPOT)
    sx, sy = cx + S(48), cy - S(42)
    draw.line((sx, sy, sx + S(8), sy - S(18)), fill=TRUNK, width=max(2, int(S(7))))
    leaf(draw, sx + S(8), sy - S(16), s * 1.1, ang=-0.2)


def tree(draw, cx, by, s, t):
    S = S_(s)
    draw.rectangle((cx - S(26), by - S(200), cx + S(26), by), fill=TRUNK)
    draw.ellipse((cx - S(150), by - S(18), cx + S(150), by + S(14)), fill=K.SHADOW)
    for dx, dy, r in ((-90, -260, 100), (90, -260, 100), (0, -330, 120), (-40, -200, 90), (60, -200, 90)):
        draw.ellipse((cx + S(dx) - S(r), by + S(dy) - S(r), cx + S(dx) + S(r), by + S(dy) + S(r)),
                     fill=TREE_DARK if dy == -200 else TREE)
    for k, (dx, dy) in enumerate(((-110, -230), (-20, -300), (80, -250), (30, -190), (-70, -170), (120, -190))):
        mango(draw, cx + S(dx), cy_sway(by + S(dy), t, k), s * 0.32, "ripe" if k % 3 else "green")


def cy_sway(y, t, k):
    return y + 3 * math.sin(t * 8 + k)


def crate(draw, cx, by, s, kinds):
    S = S_(s)
    for k, kd in enumerate(kinds):
        mango(draw, cx - S(70) + (k % 3) * S(70), by - S(110) - (k // 3) * S(30), s * 0.45, kd)
    draw.rectangle((cx - S(120) + S(8), by - S(100) + S(10), cx + S(120) + S(8), by + S(10)), fill=K.SHADOW)
    draw.rectangle((cx - S(120), by - S(100), cx + S(120), by), fill=WOOD, outline=WOOD_DARK, width=max(2, int(S(5))))
    for k in range(1, 3):
        yy = by - S(100) + k * S(33)
        draw.line((cx - S(120), yy, cx + S(120), yy), fill=WOOD_DARK, width=max(2, int(S(4))))


def basket(draw, cx, by, s, col, label, kinds=()):
    S = S_(s)
    for k, kd in enumerate(kinds):
        mango(draw, cx - S(60) + (k % 3) * S(60), by - S(96) - (k // 3) * S(28), s * 0.4, kd)
    draw.polygon([(cx - S(130) + S(8), by - S(90) + S(10)), (cx + S(130) + S(8), by - S(90) + S(10)),
                  (cx + S(100) + S(8), by + S(10)), (cx - S(100) + S(8), by + S(10))], fill=K.SHADOW)
    draw.polygon([(cx - S(130), by - S(90)), (cx + S(130), by - S(90)), (cx + S(100), by), (cx - S(100), by)],
                 fill=WOOD, outline=WOOD_DARK)
    for k in range(1, 3):
        yy = by - S(90) + k * S(30)
        draw.line((cx - S(130) + k * S(10), yy, cx + S(130) - k * S(10), yy), fill=WOOD_DARK, width=max(2, int(S(4))))
    K.pill(draw, cx, by + S(14), label, col, size=max(26, int(S(30))))


def cat_face(draw, cx, cy, r, col):
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.9, cy - r * 0.2), (cx + sx * r * 0.75, cy - r * 1.25),
                      (cx + sx * r * 0.2, cy - r * 0.8)], fill=col)
        draw.polygon([(cx + sx * r * 0.75, cy - r * 0.4), (cx + sx * r * 0.7, cy - r * 1.0),
                      (cx + sx * r * 0.38, cy - r * 0.75)], fill=(255, 200, 200))
    draw.ellipse((cx - r, cy - r * 0.95, cx + r, cy + r * 0.85), fill=col)
    for sx in (-1, 1):
        ex = cx + sx * r * 0.38
        draw.ellipse((ex - r * 0.16, cy - r * 0.3, ex + r * 0.16, cy + r * 0.05), fill=K.DEV_DEEP)
    draw.polygon([(cx - r * 0.12, cy + r * 0.14), (cx + r * 0.12, cy + r * 0.14), (cx, cy + r * 0.3)], fill=(230, 110, 120))
    for sx in (-1, 1):
        for k in (-1, 0, 1):
            draw.line((cx + sx * r * 0.25, cy + r * 0.3 + k * r * 0.08, cx + sx * r * 1.15, cy + r * 0.24 + k * r * 0.2),
                      fill=K.DEV_MID, width=max(2, int(r * 0.04)))


def photo(draw, cx, cy, w, h, cat_col, tilt=0):
    x0, y0 = cx - w / 2, cy - h / 2
    draw.rectangle((x0 + 8, y0 + 10 + tilt, x0 + w + 8, y0 + h + 10 - tilt), fill=K.SHADOW)
    draw.rectangle((x0, y0 + tilt, x0 + w, y0 + h - tilt), fill=(255, 255, 255), outline=K.DEV_MID, width=3)
    draw.rectangle((x0 + 12, y0 + 12 + tilt, x0 + w - 12, y0 + h - 40 - tilt), fill=(226, 238, 250))
    cat_face(draw, cx, cy - 10, min(w, h) * 0.24, cat_col)


def ai_laptop(draw, cx, cy, s, brand, t, mag=True):
    S = S_(s)
    K.draw_device(draw, "laptop", cx, cy, s, brand, t=t)
    K.text_at(draw, "AI", cx - (S(40) if mag else 0), cy - S(76), K.load_font(max(26, int(S(80))), bold=True), K.BOT)
    if mag:
        K.draw_magnifier(draw, cx + S(70), cy - S(40), s * 0.42, K.CORAL)


def conveyor(draw, x0, x1, y, t):
    for lx in range(int(x0) + 60, int(x1) - 40, 320):
        draw.rectangle((lx, y + 50, lx + 18, y + 110), fill=K.DEV_MID)
    draw.rounded_rectangle((x0, y, x1, y + 56), radius=28, fill=K.DEV_DARK)
    n = int((x1 - x0 - 40) / 60)
    for k in range(n + 1):
        rx = x0 + 28 + k * 60
        draw.ellipse((rx - 16, y + 12, rx + 16, y + 44), fill=K.DEV_MID)
        a = -t * 40 + k
        draw.line((rx, y + 28, rx + 14 * math.cos(a), y + 28 + 14 * math.sin(a)), fill=K.DEV_DEEP, width=4)


def camera_box(draw, cx, top, t, beam_to):
    flash = (t * 6) % 1 < 0.5
    draw.polygon([(cx - 30, top + 120), (cx + 30, top + 120), (cx + 110, beam_to), (cx - 110, beam_to)],
                 fill=(214, 240, 236) if flash else (232, 246, 244))
    draw.rounded_rectangle((cx - 120 + 8, top + 10, cx + 120 + 8, top + 130), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle((cx - 120, top, cx + 120, top + 120), radius=24, fill=K.DEV_DARK)
    draw.ellipse((cx - 40, top + 30, cx + 40, top + 110), fill=K.DEV_DEEP)
    draw.ellipse((cx - 24, top + 46, cx + 24, top + 94), fill=(110, 170, 230))
    draw.ellipse((cx + 70, top + 22, cx + 92, top + 44), fill=K.LED_ON if flash else K.DEV_MID)
    K.text_at(draw, "AI", cx - 80, top + 38, K.load_font(34, bold=True), K.GOLD)


def thought(draw, box, tail_to, fill=(255, 255, 255), outline=(200, 192, 180)):
    x0, y0, x1, y1 = box
    draw.ellipse((x0 + 8, y0 + 10, x1 + 8, y1 + 10), fill=K.SHADOW)
    draw.ellipse(box, fill=fill, outline=outline, width=4)
    bx, by = (x0 + x1) / 2, y1
    for k, r in enumerate((18, 12)):
        f = (k + 1) / 3
        px, py = K.lerp(bx, tail_to[0], f), K.lerp(by, tail_to[1], f)
        draw.ellipse((px - r, py - r, px + r, py + r), fill=fill, outline=outline, width=3)


def tray(draw, box, label, col, soft, panel):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=36, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=36, fill=soft, outline=col, width=5)
    K.pill(draw, (x0 + x1) / 2, y0 + 22, label, col, size=34)


TOYS = [("circle", RED), ("square", BLUE), ("square", RED), ("circle", BLUE),
        ("circle", RED), ("square", BLUE), ("square", RED), ("circle", BLUE)]
MESS = [(820, 560), (1080, 700), (1330, 520), (1560, 690), (1210, 800), (930, 790), (1490, 480), (1700, 460)]


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

    def dashed_circle(x, y, r, col):
        n = 16
        for k in range(n):
            a0 = k * 360 / n + progress * 60
            draw.arc((x - r, y - r, x + r, y + r), a0, a0 + 360 / n * 0.6, fill=col, width=6)

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def bracket(x0, x1, y, col, label=None):
        draw.line((x0, y - 18, x0, y, x1, y, x1, y - 18), fill=col, width=6)
        if label:
            K.text_at(draw, label, (x0 + x1) / 2, y + 12, font(30, bold=True), col)

    def beat_row(seq, y, cw, gap, reveal_last=None, active_cycle=True):
        """seq of 'c'/'s'; reveal_last: None → all shown, False → last is '?', True → last revealed."""
        n = len(seq)
        x_start = cx - (n * cw + (n - 1) * gap) / 2
        cur = int(t * 14) % n if active_cycle else -1
        for i, k in enumerate(seq):
            x0 = x_start + i * (cw + gap)
            mx = x0 + cw / 2
            last = i == n - 1
            if last and reveal_last is False:
                draw.rounded_rectangle((x0, y, x0 + cw, y + 300), radius=28, fill=coral_soft)
                dashed_box((x0, y, x0 + cw, y + 300), coral)
                K.text_at(draw, "?", mx, y + 70, font(int(130 + 20 * pulse), bold=True), coral)
                continue
            win = last and reveal_last is True
            K.shadow_card(draw, (x0, y, x0 + cw, y + 300), brand, radius=28, outline=sage if win else None,
                          outline_w=6 if win else 3)
            on = i == cur
            if k == "c":
                clap(draw, mx, y + 130, 0.9, active=on)
                K.text_at(draw, "CLAP", mx, y + 236, font(34, bold=True), coral)
            else:
                stamp(draw, mx, y + 140, 0.85, active=on)
                K.text_at(draw, "STAMP", mx, y + 236, font(34, bold=True), K.ROAD)
            if win:
                K.draw_check(draw, x0 + cw - 30, y + 30, 22, sage)

    def shape_row(seq, y, r, step, reveal_last=None):
        n = len(seq)
        x_start = cx - (n - 1) * step / 2
        for i, k in enumerate(seq):
            x = x_start + i * step
            last = i == n - 1
            if last and reveal_last is False:
                draw.rounded_rectangle((x - r - 24, y - r - 24, x + r + 24, y + r + 24), radius=24, fill=coral_soft)
                dashed_box((x - r - 24, y - r - 24, x + r + 24, y + r + 24), coral, width=4)
                K.text_at(draw, "?", x, y - 64, font(int(100 + 16 * pulse), bold=True), coral)
                continue
            col = K.BOTH_COLOR if k == "triangle" else coral if k == "circle" else K.ROAD
            shape(draw, k, x, y, r, col)
            if last and reveal_last is True:
                K.draw_check(draw, x + r, y - r - 10, 22, sage)

    # ---- opening -----------------------------------------------------------
    if visual == "b7-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            kid(draw, cx + 280, 430, 1.3, coral, t, flower=True)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 560, 320), (cx + 560, 320), (cx - 640, 520), (cx + 640, 520)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · TRAINING AI", cx, 326 + lift, font(34, bold=True), sage)
            labels = ["Show many examples", "Say yes or no", "Then test it"]
            for i, lab in enumerate(labels):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 440
                y = 540 + int((1 - a) * 40)
                draw.ellipse((x - 130, y - 130, x + 130, y + 110), fill=[coral_soft, sage_soft, lav_soft][i])
                if i == 0:
                    for k in range(3):
                        photo(draw, x - 40 + k * 40, y - 20 + k * 6, 130, 140,
                              [(240, 160, 80), (90, 90, 96), (230, 230, 230)][k])
                elif i == 1:
                    K.draw_check(draw, x - 56, y - 10, 50, sage)
                    K.draw_cross(draw, x + 56, y - 10, 50, K.DANGER)
                else:
                    ai_laptop(draw, x, y + 10, 0.55, brand, t, mag=False)
                K.text_at(draw, lab, x, y + 132, font(34, bold=True), ink)
                if i < 2:
                    K.draw_arrow(draw, x + 150, y - 10, x + 290, y - 10, muted, width=8, head=22)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Patterns Everywhere", cx, 360 + lift, font(86, bold=True), ink)
            seq = [("o", None), (None, "circle"), ("y", None), (None, "square"), ("o", None), (None, "circle"),
                   ("y", None), (None, "square")]
            for i, (fl, sh) in enumerate(seq):
                a = K.stagger(progress, i + 1, step=0.07, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 3.5) * 170
                y = 680 + int((1 - a) * 40)
                if fl:
                    marigold(draw, x, y, 62, fl)
                else:
                    shape(draw, sh, x, y, 52, coral if sh == "circle" else K.ROAD)
            return True
        # promise
        draw.ellipse((520 - 250, 560 - 250, 520 + 250, 560 + 250), fill=sage_soft)
        kid(draw, 520, 520, 1.6, coral, t, flower=True)
        K.draw_magnifier(draw, 690, 680, 0.9, coral)
        K.text_at(draw, "Pattern", 1260, 290 + lift, font(110, bold=True), coral)
        K.text_at(draw, "Detective!", 1260, 420 + lift, font(110, bold=True), ink)
        for i, kd in enumerate(("o", "y", "o", "y", "o")):
            a = K.stagger(progress, i + 2, step=0.08, speed=5)
            if a > 0:
                marigold(draw, 1000 + i * 130, 700 + int((1 - a) * 30), 48, kd)
        return True

    # ---- Meera's garland ---------------------------------------------------------
    if visual == "b7-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=coral_soft)
            kid(draw, 560, 470, 1.7, coral, t, flower=True)
            garland(draw, sag_pts(330, 790, 760, 6, 50), ["o", "y", "o", "y", "o", "y"], 40)
            K.text_at(draw, "Meet", 1320, 300 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Meera!", 1320, 370 + lift, font(130, bold=True), coral)
            K.pill(draw, 1320, 570, "Diwali garland time!", sage, size=38)
            diya(draw, 1120, 770, 1.0, t)
            diya(draw, 1520, 770, 1.0, t + 0.3)
            star_spots([(1000, 330), (1650, 330)])
            return True
        if focus == "string":
            pts = sag_pts(220, 1700, 330, 10, 120)
            kinds = ["o", "y"] * 5
            n = int(K.clamp01(progress * 1.2) * 10 + 0.5)
            garland(draw, pts, kinds, 50, n_shown=max(1, n))
            K.draw_person(draw, 420, 620, 1.1, "mom", t)
            kid(draw, 1500, 640, 1.05, coral, t, flower=True)
            if n > 0:
                last = pts[min(9, max(0, n - 1))]
                K.draw_arrow(draw, last[0], last[1] + 140, last[0], last[1] + 70, muted, width=8, head=24)
            K.pill(draw, cx, 640, "Orange, yellow, orange, yellow…", coral, size=36)
            return True
        if focus == "leave":
            garland(draw, sag_pts(160, 900, 790, 7, 40), ["o", "y", "o", "y", "o", "y", None], 40)
            kid(draw, 420, 560, 1.15, coral, 0, flower=True)
            draw.rounded_rectangle((1540 + 10, 250 + 12, 1800 + 10, 860), radius=12, fill=K.SHADOW)
            draw.rounded_rectangle((1540, 250, 1800, 860), radius=12, fill=WOOD, outline=WOOD_DARK, width=6)
            draw.rectangle((1570, 290, 1770, 520), outline=WOOD_DARK, width=4)
            draw.rectangle((1570, 560, 1770, 820), outline=WOOD_DARK, width=4)
            draw.ellipse((1576, 560, 1600, 584), fill=K.GOLD)
            garland(draw, sag_pts(1550, 1790, 262, 5, 50), ["o", "y", "o", "y", "o"], 26)
            mx = K.lerp(1180, 1360, K.ease_in_out(progress))
            K.draw_person(draw, mx, 580, 1.05, "mom", t)
            K.draw_bubble(draw, (640, 250, 1240, 400), brand, "Meera, can you carry on?", tail="right", size=40)
            K.pill(draw, 1670, 410, "Ding dong!", K.BOTH_COLOR, size=30)
            K.draw_notes(draw, 1420, 330, 0.6, t, K.BOTH_COLOR)
            return True
        pts = sag_pts(200, 1540, 300, 8, 90)
        ans = focus == "answer"
        kinds = ["o", "y", "o", "y", "o", "y", "o" if ans else None, None]
        garland(draw, pts[:7], kinds[:7], 52)
        sx, sy = pts[6]
        if not ans:
            dashed_circle(sx, sy, 62, coral)
            K.text_at(draw, "?", sx, sy - 52, font(int(84 + 14 * pulse), bold=True), coral)
            for k, (kd, lab) in enumerate((("o", "Orange?"), ("y", "Yellow?"))):
                x = 820 + k * 420
                draw.ellipse((x - 120, 560 - 120, x + 120, 560 + 120), fill=[coral_soft, (255, 246, 214)][k])
                marigold(draw, x, 560, 84, kd)
                K.text_at(draw, lab, x, 712, font(40, bold=True), ink)
            kid(draw, 330, 600, 1.05, coral, 0, flower=True)
            question_marks([(470, 470)], size=70)
            K.draw_stopwatch(draw, 1620, 620, 60, progress, brand)
        else:
            K.draw_check(draw, sx + 60, sy - 60, 26, sage)
            K.draw_arrow(draw, sx - 60, sy + 110, sx - 10, sy + 60, sage, width=8, head=22)
            kid(draw, 1520, 590, 1.2, coral, t, flower=True)
            K.draw_heart(draw, 1660, 450 + bounce, 30, coral)
            K.pill(draw, 820, 560, "The colours take turns!", K.BOTH_COLOR, size=40)
            K.pill(draw, 820, 680, "She spotted a pattern!", sage, size=40)
            star_spots([(300, 560), (1260, 760), (380, 760)])
        return True

    # ---- definition -------------------------------------------------------------------
    if visual == "b7-define":
        if focus == "name":
            draw.ellipse((420 - 270, 560 - 270, 420 + 270, 560 + 270), fill=coral_soft)
            for k, kd in enumerate(("o", "y", "o", "y")):
                marigold(draw, 230 + k * 125, 470, 46, kd)
            K.draw_magnifier(draw, 420, 600, 1.4, coral)
            for k, kd in enumerate(("o", "y")):
                marigold(draw, 380 + k * 70, 600, 30, kd)
            K.shadow_card(draw, (760, 250 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A PATTERN is…", 1270, 320 + lift, font(44, bold=True), muted)
            parts = [("something", ink), ("that repeats,", coral), ("in a way you", ink), ("can predict!", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1270, 410 + i * 100 + lift + int((1 - a) * 30), font(66, bold=True), col)
            return True
        if focus == "parts":
            for k, (title, col, soft) in enumerate((("REPEATS", coral, coral_soft), ("PREDICT", sage, sage_soft))):
                a = K.stagger(progress, k, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 150 if k == 0 else 1010
                y0 = 260 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 760 + 10, y0 + 590 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 760, y0 + 590), radius=40, fill=soft, outline=col, width=5)
                K.pill(draw, x0 + 380, y0 + 30, title, col, size=40)
                if k == 0:
                    for i, kd in enumerate(("o", "y", "o", "y", "o", "y")):
                        marigold(draw, x0 + 100 + i * 112, y0 + 260, 44, kd)
                    for j in range(3):
                        ax = x0 + 110 + j * 186
                        K.draw_curve(draw, (ax, y0 + 330), (ax + 93, y0 + 410), (ax + 176, y0 + 330), col, width=7)
                        draw.polygon([(ax + 176, y0 + 322), (ax + 158, y0 + 350), (ax + 186, y0 + 352)], fill=col)
                    K.text_at(draw, "again and again!", x0 + 380, y0 + 470, font(42, bold=True), ink)
                else:
                    for i, kd in enumerate(("o", "y", "o", "y")):
                        marigold(draw, x0 + 100 + i * 112, y0 + 440, 40, kd)
                    gx = x0 + 100 + 4 * 112
                    dashed_circle(gx, y0 + 440, 44, col)
                    K.text_at(draw, "?", gx, y0 + 400, font(64, bold=True), col)
                    K.draw_face(draw, x0 + 150, y0 + 220, 62, "kid", 1.0)
                    thought(draw, (x0 + 330, y0 + 120, x0 + 660, y0 + 330), (x0 + 220, y0 + 210))
                    marigold(draw, x0 + 495, y0 + 225, 62, "o")
                    K.text_at(draw, "I can guess!", x0 + 380, y0 + 510, font(40, bold=True), ink)
            return True
        if focus == "sequence":
            K.text_at(draw, "SEQUENCE", cx, 240 + lift, font(90, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "things in a row, one after another", cx, 350 + lift, font(42, bold=True), muted)
            shift = int((1 - K.ease_out_cubic(K.clamp01(progress * 1.6))) * 500)
            ty = 700
            draw.rectangle((100, ty + 72, 1820, ty + 84), fill=K.DEV_MID)
            for k in range(24):
                draw.rectangle((110 + k * 72, ty + 84, 140 + k * 72, ty + 96), fill=WOOD_DARK)
            ex = 230 - shift
            draw.rounded_rectangle((ex - 120, ty - 150, ex + 110, ty + 40), radius=24, fill=coral)
            draw.rounded_rectangle((ex - 90, ty - 220, ex + 10, ty - 140), radius=14, fill=K.DEV_DARK)
            draw.rounded_rectangle((ex - 74, ty - 206, ex - 6, ty - 156), radius=10, fill=K.DEV_SCREEN)
            draw.rectangle((ex + 50, ty - 210, ex + 86, ty - 150), fill=K.DEV_DARK)
            for wx in (ex - 70, ex + 50):
                draw.ellipse((wx - 34, ty + 6, wx + 34, ty + 74), fill=K.DEV_DARK)
                draw.ellipse((wx - 12, ty + 28, wx + 12, ty + 52), fill=K.STEEL)
            for i, kd in enumerate(("o", "y", "o", "y", "o", "y")):
                x0 = 380 + i * 235 - shift
                draw.line((x0 - 34, ty, x0, ty), fill=K.DEV_DARK, width=8)
                draw.rounded_rectangle((x0, ty - 110, x0 + 200, ty + 40), radius=18,
                                       fill=[K.ROAD, sage, K.BOTH_COLOR][i % 3])
                for wx in (x0 + 46, x0 + 154):
                    draw.ellipse((wx - 28, ty + 16, wx + 28, ty + 72), fill=K.DEV_DARK)
                marigold(draw, x0 + 100, ty - 150, 50, kd)
                K.pill(draw, x0 + 100, ty - 70, str(i + 1), panel, size=28, fg=ink)
            return True
        # random
        jumble = [("p", 300, 470), ("o", 450, 600), ("w", 600, 440), ("y", 760, 590), ("w", 900, 480),
                  ("p", 1050, 420), ("o", 1190, 600)]
        draw.rounded_rectangle((170, 300, 1320, 800), radius=40, fill=(246, 241, 233), outline=line, width=3)
        for k, (kd, x, y) in enumerate(jumble):
            marigold(draw, x, y + 8 * math.sin(t * 6 + k), 58, kd)
        K.draw_cross(draw, 1250, 360, 44, K.DANGER)
        K.text_at(draw, "All jumbled!", 745, 712, font(48, bold=True), muted)
        K.text_at(draw, "No pattern", 1590, 330, font(56, bold=True), K.DANGER)
        dashed_circle(1590, 560, 90, K.DANGER)
        question_marks([(1590, 490)], size=100)
        K.text_at(draw, "Can't guess next", 1590, 690, font(40, bold=True), ink)
        return True

    # ---- kinds of patterns ----------------------------------------------------------------
    if visual == "b7-kinds":
        if focus == "intro":
            specs = [("Colours", coral, coral_soft), ("Shapes", K.ROAD, blue_soft), ("Beats", K.BOTH_COLOR, lav_soft)]
            for i, (lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 540
                y0 = 280 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 230 + 10, y0 + 12, x + 230 + 10, y0 + 560 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x - 230, y0, x + 230, y0 + 560), radius=40, fill=soft, outline=col, width=5)
                if i == 0:
                    balloon(draw, x - 70, y0 + 200, 64, RED)
                    balloon(draw, x + 70, y0 + 200, 64, BLUE)
                elif i == 1:
                    shape(draw, "circle", x - 80, y0 + 230, 66, coral)
                    shape(draw, "square", x + 80, y0 + 230, 66, K.ROAD)
                else:
                    clap(draw, x - 70, y0 + 230, 0.9, active=int(t * 8) % 2 == 0)
                    stamp(draw, x + 100, y0 + 250, 0.6, active=int(t * 8) % 2 == 1)
                K.text_at(draw, lab, x, y0 + 440, font(58, bold=True), col)
            return True
        if focus in ("colour", "shape"):
            done = progress > 0.45
            if focus == "colour":
                seq = [(RED, "red"), (BLUE, "blue"), (RED, "red"), (BLUE, "blue"), (RED, "red")]
                for i, (col, lab) in enumerate(seq):
                    x = cx + (i - 2) * 320
                    if i == 4 and not done:
                        draw.rounded_rectangle((x - 120, 330, x + 120, 760), radius=30, fill=coral_soft)
                        dashed_box((x - 120, 330, x + 120, 760), coral)
                        K.text_at(draw, "?", x, 440, font(int(130 + 20 * pulse), bold=True), coral)
                        continue
                    balloon(draw, x, 470, 92, col)
                    K.text_at(draw, lab, x, 740, font(40, bold=True), col)
                    if i == 4:
                        K.draw_check(draw, x + 100, 340, 28, sage)
            else:
                seq = ["circle", "square", "circle", "square", "circle"]
                for i, sh in enumerate(seq):
                    x = cx + (i - 2) * 320
                    if i == 4 and not done:
                        draw.rounded_rectangle((x - 130, 380, x + 130, 640), radius=30, fill=coral_soft)
                        dashed_box((x - 130, 380, x + 130, 640), coral)
                        K.text_at(draw, "?", x, 430, font(int(130 + 20 * pulse), bold=True), coral)
                        continue
                    shape(draw, sh, x, 510, 104, coral if sh == "circle" else K.ROAD)
                    K.text_at(draw, sh, x, 680, font(40, bold=True), coral if sh == "circle" else K.ROAD)
                    if i == 4:
                        K.draw_check(draw, x + 110, 390, 28, sage)
            K.pill(draw, cx, 236, "What comes next?", K.BOTH_COLOR, size=34)
            return True
        if focus == "beat":
            beat_row("ccsccs", 330, 250, 34)
            for k in range(2):
                bracket(cx - 3 * 284 + 34 / 2 + k * 3 * 284, cx - 34 / 2 + k * 3 * 284, 680, K.BOTH_COLOR)
            K.pill(draw, cx, 236, "Try it with me!", coral, size=34)
            K.draw_notes(draw, 230, 780, 0.8, t, K.BOTH_COLOR)
            K.draw_notes(draw, 1690, 780, 0.8, t + 0.3, coral)
            return True
        # unit
        cols = [RED, BLUE] * 4
        step = 190
        x_start = cx - 7 * step / 2
        for i, col in enumerate(cols):
            a = K.stagger(progress, i, step=0.05, speed=6)
            if a <= 0:
                continue
            balloon(draw, x_start + i * step, 400 + int((1 - a) * 30), 70, col)
        for k in range(4):
            a = K.stagger(progress, k + 4, step=0.08, speed=5)
            if a <= 0:
                continue
            x0 = x_start + k * 2 * step - 80
            x1 = x0 + step + 160
            bracket(x0, x1, 640, [coral, sage, K.BOTH_COLOR, K.ROAD][k])
        a = K.stagger(progress, 9, step=0.06, speed=4)
        if a > 0:
            K.pill(draw, cx, 700 + int((1 - a) * 20), "The repeating part: red, blue", coral, size=40)
        return True

    # ---- what comes next game ---------------------------------------------------------
    if visual == "b7-next":
        if focus == "intro":
            K.shadow_card(draw, (380, 280 + lift, w - 380, 800 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "GAME TIME", cx, 360 + lift, font(40, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "What comes next?", cx, 430 + lift, font(84, bold=True), ink)
            K.draw_magnifier(draw, cx - 300, 650 + lift, 0.8, coral)
            for i, kd in enumerate(("o", "y", "o")):
                marigold(draw, cx - 60 + i * 130, 650 + lift, 46, kd)
            dashed_circle(cx + 330, 650 + lift, 50, coral)
            K.text_at(draw, "?", cx + 330, 606 + lift, font(70, bold=True), coral)
            return True
        if focus in ("ask1", "ans1"):
            ans = focus == "ans1"
            beat_row("ccsccs", 320, 250, 34, reveal_last=ans, active_cycle=ans)
            if ans:
                for k in range(2):
                    bracket(cx - 3 * 284 + 17 + k * 3 * 284, cx - 17 + k * 3 * 284, 670, K.BOTH_COLOR)
                K.pill(draw, cx, 236, "Stamp! Clap, clap, stamp", sage, size=34)
            else:
                K.pill(draw, cx - 40, 236, "What comes next?", coral, size=34)
                K.draw_stopwatch(draw, cx + 230, 266, 32, progress, brand)
                K.text_at(draw, "Clap, clap, stamp, clap, clap…", cx, 700, font(40, bold=True), muted)
            return True
        ans = focus == "ans2"
        seq = ["circle", "circle", "triangle"] * 3
        shape_row(seq, 520, 64, 190, reveal_last=ans)
        if ans:
            x_start = cx - 8 * 190 / 2
            for k in range(3):
                bracket(x_start + k * 3 * 190 - 80, x_start + k * 3 * 190 + 2 * 190 + 80, 650,
                        [coral, sage, K.BOTH_COLOR][k])
            K.pill(draw, cx, 236, "Triangle! Two circles, then a triangle", sage, size=34)
        else:
            K.pill(draw, cx - 40, 236, "What comes next?", coral, size=34)
            K.draw_stopwatch(draw, cx + 230, 266, 32, progress, brand)
            K.text_at(draw, "Find the part that repeats!", cx, 700, font(40, bold=True), muted)
        return True

    # ---- sorting -------------------------------------------------------------------------
    trays_c = [((200, 330, 900, 850), "RED", RED, red_soft), ((1020, 330, 1720, 850), "BLUE", BLUE, blue_soft)]
    trays_s = [((200, 330, 900, 850), "CIRCLES", coral, coral_soft), ((1020, 330, 1720, 850), "SQUARES", K.ROAD,
                                                                       blue_soft)]

    def slot(group_idx, k):
        bx = trays_c[group_idx][0]
        tcx = (bx[0] + bx[2]) / 2
        return tcx + (-140 if k % 2 == 0 else 140), 530 + (k // 2) * 190

    def colour_pos(i):
        kind, col = TOYS[i]
        g = 0 if col == RED else 1
        k = [j for j in range(len(TOYS)) if (TOYS[j][1] == RED) == (g == 0)].index(i)
        return slot(g, k)

    def shape_pos(i):
        kind, col = TOYS[i]
        g = 0 if kind == "circle" else 1
        k = [j for j in range(len(TOYS)) if (TOYS[j][0] == "circle") == (g == 0)].index(i)
        return slot(g, k)

    if visual == "b7-sort":
        if focus == "intro":
            draw.rounded_rectangle((160, 300, 800, 820), radius=40, fill=(246, 241, 233), outline=line, width=3)
            mix = [("circle", RED, 300, 450), ("square", BLUE, 480, 400), ("circle", BLUE, 650, 500),
                   ("square", RED, 330, 660), ("circle", RED, 520, 600), ("square", BLUE, 680, 700)]
            for kind, col, x, y in mix:
                shape(draw, kind, x, y, 56, col)
            K.text_at(draw, "Mixed up", 480, 740, font(36, bold=True), muted)
            K.draw_arrow(draw, 840, 560, 1000, 560, coral, width=14, head=40)
            for k, (col, soft) in enumerate(((RED, red_soft), (BLUE, blue_soft))):
                a = K.stagger(progress, k + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y0 = 300 + k * 270 + int((1 - a) * 30)
                draw.rounded_rectangle((1040, y0, 1760, y0 + 240), radius=36, fill=soft, outline=col, width=5)
                for j, kind in enumerate(("circle", "square", "circle")):
                    shape(draw, kind, 1160 + j * 160, y0 + 120, 54, col)
                K.draw_check(draw, 1690, y0 + 120, 30, sage)
            return True
        if focus == "mess":
            kid(draw, 290, 540, 1.0, K.ROAD, t, bun=False)
            bx0 = 470
            draw.rectangle((bx0 + 8, 720 + 10, bx0 + 230 + 8, 860 + 10), fill=K.SHADOW)
            draw.rectangle((bx0, 720, bx0 + 230, 860), fill=CLAY)
            draw.polygon([(bx0 + 230, 720), (bx0 + 300, 680), (bx0 + 300, 820), (bx0 + 230, 860)], fill=CLAY_DARK)
            draw.polygon([(bx0, 720), (bx0 - 40, 660), (bx0 + 180, 650), (bx0 + 230, 720)], fill=(220, 130, 90))
            K.text_at(draw, "TOYS", bx0 + 115, 764, font(44, bold=True), panel)
            for i, ((kind, col), (x, y)) in enumerate(zip(TOYS, MESS)):
                a = K.stagger(progress, i, step=0.05, speed=4)
                xx = K.lerp(bx0 + 260, x, a)
                yy = K.lerp(740, y, a) - 120 * math.sin(a * math.pi)
                shape(draw, kind, xx, yy, 58, col)
            K.text_at(draw, "Oops!", 290, 300, font(64, bold=True), K.DANGER)
            return True
        if focus == "colour":
            for bx, lab, col, soft in trays_c:
                tray(draw, bx, lab, col, soft, panel)
            for i, (kind, col) in enumerate(TOYS):
                a = K.ease_in_out(K.clamp01((progress - 0.02 - i * 0.06) * 2.6))
                sx, sy = MESS[i]
                tx, ty = colour_pos(i)
                shape(draw, kind, K.lerp(sx, tx, a), K.lerp(sy, ty, a), 58, col)
            return True
        if focus == "ask":
            for bx, lab, col, soft in trays_c:
                tray(draw, bx, lab, col, soft, panel)
            for i, (kind, col) in enumerate(TOYS):
                x, y = colour_pos(i)
                if kind == "circle":
                    rr = 80 + 8 * pulse
                    draw.ellipse((x - rr, y - rr, x + rr, y + rr), outline=K.GOLD, width=8)
                shape(draw, kind, x, y, 58, col)
            K.pill(draw, cx - 40, 236, "Now sort by SHAPE?", K.BOTH_COLOR, size=34)
            K.draw_stopwatch(draw, cx + 250, 266, 32, progress, brand)
            question_marks([(cx, 440), (cx, 640)], size=90)
            return True
        # shape
        for bx, lab, col, soft in trays_s:
            tray(draw, bx, lab, col, soft, panel)
        for i, (kind, col) in enumerate(TOYS):
            a = K.ease_in_out(K.clamp01((progress - 0.05 - i * 0.05) * 2.6))
            sx, sy = colour_pos(i)
            tx, ty = shape_pos(i)
            shape(draw, kind, K.lerp(sx, tx, a), K.lerp(sy, ty, a), 58, col)
        if progress > 0.6:
            K.pill(draw, cx, 236, "Same toys, different groups!", sage, size=34)
        return True

    # ---- AI finds patterns -------------------------------------------------------------
    if visual == "b7-ai":
        if focus == "intro":
            draw.ellipse((480 - 260, 560 - 260, 480 + 260, 560 + 260), fill=coral_soft)
            kid(draw, 480, 500, 1.5, coral, t, flower=True)
            K.draw_magnifier(draw, 640, 660, 0.8, coral)
            draw.ellipse((1440 - 260, 560 - 260, 1440 + 260, 560 + 260), fill=blue_soft)
            ai_laptop(draw, 1440, 560, 1.0, brand, t)
            K.text_at(draw, "Meera", 480, 770, font(40, bold=True), coral)
            K.text_at(draw, "AI", 1440, 770, font(40, bold=True), K.BOT)
            for i, kd in enumerate(("o", "y", "o", "y")):
                a = K.stagger(progress, i + 1, step=0.1, speed=5)
                if a > 0:
                    marigold(draw, 800 + i * 105, 330 + int((1 - a) * 20), 40, kd)
            K.text_at(draw, "Both spot patterns!", cx, 560, font(46, bold=True), ink)
            return True
        if focus == "cats":
            cols = [(240, 160, 80), (90, 90, 96), (230, 230, 230), (200, 140, 90), (60, 60, 64), (250, 200, 140)]
            for k in range(6):
                a = K.stagger(progress, k, step=0.05, speed=5)
                if a <= 0:
                    continue
                r_, c_ = divmod(k, 3)
                photo(draw, 260 + c_ * 200, 400 + r_ * 240 + int((1 - a) * 30), 170, 200, cols[k],
                      tilt=6 if k % 2 else -6)
            K.text_at(draw, "Lots of cat photos", 460, 790, font(36, bold=True), muted)
            K.draw_arrow(draw, 800, 540, 950, 540, coral, width=14, head=40)
            K.shadow_card(draw, (990, 260, 1770, 850), brand, radius=36, accent=K.BOT)
            K.text_at(draw, "The pattern:", 1380, 300, font(46, bold=True), K.BOT)
            feats = [("ears", "Pointy ears"), ("whisk", "Whiskers"), ("tail", "A long tail")]
            for i, (kind, lab) in enumerate(feats):
                a = K.stagger(progress, i + 3, step=0.12, speed=4)
                if a <= 0:
                    continue
                y = 400 + i * 145 + int((1 - a) * 20)
                draw.rounded_rectangle((1030, y, 1730, y + 120), radius=30, fill=sage_soft)
                ix = 1110
                if kind == "ears":
                    for sx in (-1, 1):
                        draw.polygon([(ix + sx * 40, y + 96), (ix + sx * 30, y + 22), (ix + sx * 4, y + 80)],
                                     fill=(240, 160, 80))
                elif kind == "whisk":
                    for k in (-1, 0, 1):
                        draw.line((ix - 50, y + 60 + k * 18, ix + 50, y + 60 + k * 10), fill=K.DEV_MID, width=5)
                else:
                    K.draw_curve(draw, (ix - 50, y + 90), (ix + 40, y + 100), (ix + 30, y + 24), (240, 160, 80),
                                 width=14)
                draw.text((1190, y + 34), lab, fill=ink, font=font(46, bold=True))
                K.draw_check(draw, 1680, y + 60, 24, sage)
            return True
        # notmagic
        specs = [("Not magic", "wand", K.DANGER), ("Not alive", "heart", K.DANGER), ("Finds patterns", "data", sage)]
        for i, (lab, kind, col) in enumerate(specs):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 540
            y0 = 280 + int((1 - a) * 40)
            K.shadow_card(draw, (x - 240, y0, x + 240, y0 + 560), brand, radius=36, outline=col, outline_w=5)
            iy = y0 + 220
            if kind == "wand":
                draw.line((x - 90, iy + 90, x + 60, iy - 60), fill=K.DEV_DARK, width=22)
                draw.line((x + 40, iy - 40, x + 60, iy - 60), fill=(255, 255, 255), width=22)
                K.draw_star(draw, x + 80, iy - 80, 44, K.GOLD, rot=t * 3)
            elif kind == "heart":
                K.draw_heart(draw, x, iy, 90, (240, 140, 160))
            else:
                draw.rounded_rectangle((x - 200, iy - 90, x - 60, iy + 60), radius=14, fill=blue_soft, outline=K.ROAD,
                                       width=4)
                mango(draw, x - 130, iy - 10, 0.55)
                K.text_at(draw, "123", x + 20, iy - 60, font(48, bold=True), K.BOTH_COLOR)
                K.sound_waves(draw, x + 100, iy + 30, 0.9, coral, t)
            if kind != "data":
                K.draw_cross(draw, x + 170, y0 + 70, 34, K.DANGER)
            else:
                K.draw_check(draw, x + 170, y0 + 70, 34, sage)
            K.text_at(draw, lab, x, y0 + 420, font(50, bold=True), col if kind == "data" else ink)
        return True

    # ---- mango farm ----------------------------------------------------------------------
    if visual == "b7-mango":
        if focus == "farm":
            draw.rounded_rectangle((120, 700, 1800, 870), radius=30, fill=(214, 232, 186))
            tree(draw, 330, 760, 1.0, t)
            tree(draw, 1590, 760, 1.0, t + 0.5)
            K.draw_person(draw, 820, 560, 1.0, "nani", t)
            kid(draw, 1060, 610, 0.8, coral, t, flower=True)
            crate(draw, 760, 860, 0.8, ["ripe", "ripe", "green", "ripe", "ripe"])
            crate(draw, 1180, 860, 0.8, ["ripe", "green", "ripe", "spotty", "ripe"])
            K.pill(draw, cx, 236, "Thousands of mangoes!", coral, size=38)
            return True
        if focus == "ask":
            draw.rounded_rectangle((200, 290, 1360, 840), radius=40, fill=(246, 241, 233), outline=line, width=3)
            pile = [("ripe", 330, 420), ("green", 520, 470), ("spotty", 720, 410), ("ripe", 920, 480),
                    ("green", 1120, 420), ("ripe", 1240, 620), ("spotty", 420, 650), ("green", 640, 690),
                    ("ripe", 860, 680), ("ripe", 1060, 700)]
            for kd, x, y in pile:
                mango(draw, x, y, 0.95, kd)
            K.draw_magnifier(draw, 1600, 480, 1.2, coral)
            question_marks([(1600, 410)], size=80)
            K.text_at(draw, "Ripe or not?", 1600, 680, font(46, bold=True), ink)
            K.draw_stopwatch(draw, 1600, 800, 40, progress, brand)
            return True
        if focus == "pattern":
            draw.ellipse((480 - 250, 520 - 250, 480 + 250, 520 + 250), fill=(255, 246, 214))
            mango(draw, 480, 540, 2.4, "ripe")
            K.pill(draw, 480, 790, "RIPE", sage, size=40)
            feats = ["Yellow colour", "Nice and plump", "No dark spots"]
            for i, lab in enumerate(feats):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
                y = 280 + i * 130 + int((1 - a) * 20)
                draw.rounded_rectangle((860, y, 1440, y + 104), radius=52, fill=sage_soft, outline=sage, width=4)
                K.draw_check(draw, 920, y + 52, 26, sage)
                draw.text((970, y + 28), lab, fill=ink, font=font(44, bold=True))
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                y = 680 + int((1 - a) * 20)
                mango(draw, 1600, 450, 1.3, "green")
                K.text_at(draw, "Not ready yet", 1600, 560, font(36, bold=True), muted)
                draw.rounded_rectangle((860, y, 1780, y + 130), radius=30, fill=lav_soft)
                draw.text((900, y + 40), "It's all about how it looks!", fill=K.BOTH_COLOR, font=font(44, bold=True))
            return True
        if focus == "machine":
            conveyor(draw, 140, 1480, 680, t)
            camera_box(draw, 800, 270, t, 640)
            seq = ["ripe", "green", "ripe", "spotty", "ripe", "green"]
            period = 220
            shift = (t * 2.2 * period) % period
            for k in range(7):
                x = 200 + k * period + shift
                if x > 1440:
                    continue
                mango(draw, x, 630, 0.75, seq[k % len(seq)])
            basket(draw, 1640, 600, 0.85, sage, "RIPE", ["ripe"] * 5)
            basket(draw, 1640, 820, 0.85, muted, "NOT YET", ["green", "spotty", "green"])
            K.draw_arrow(draw, 1490, 640, 1530, 540, sage, width=8, head=20)
            K.draw_arrow(draw, 1490, 700, 1530, 760, muted, width=8, head=20)
            kid(draw, 260, 360, 0.6, coral, t, flower=True)
            K.text_at(draw, "a few a minute", 480, 330, font(30, bold=True), muted)
            return True
        # fast
        conveyor(draw, 140, 1280, 700, t * 4)
        period = 150
        shift = (t * 12 * period) % period
        seq = ["ripe", "green", "ripe", "spotty", "ripe"]
        xs = [180 + k * period + shift for k in range(8)]
        for x in xs:
            if x <= 1250:
                for j in range(3):
                    draw.line((x - 50 - j * 8, 630 + j * 16, x - 90 - j * 8, 630 + j * 16), fill=K.STEEL, width=5)
        for k, x in enumerate(xs):
            if x <= 1250:
                mango(draw, x, 650, 0.6, seq[k % len(seq)])
        K.draw_stopwatch(draw, 420, 400, 80, progress * 4, brand)
        count = int(200 + 9800 * K.ease_out_cubic(progress))
        K.shadow_card(draw, (1340, 270, 1780, 560), brand, radius=32, accent=sage)
        K.text_at(draw, "SORTED", 1560, 306, font(34, bold=True), sage)
        K.text_at(draw, f"{count:,}", 1560, 370, font(80, bold=True), ink)
        K.text_at(draw, "mangoes", 1560, 476, font(36, bold=True), muted)
        K.text_at(draw, "Zip! Zip! Zip!", 820, 330, font(64, bold=True), coral)
        K.pill(draw, 1560, 640, "Never gets tired", K.BOTH_COLOR, size=32)
        return True

    # ---- you vs AI -----------------------------------------------------------------------
    if visual == "b7-compare":
        if focus == "you":
            draw.ellipse((560 - 280, 560 - 280, 560 + 280, 560 + 280), fill=coral_soft)
            kid(draw, 560, 480, 2.0, coral, t, flower=True)
            for k, (lab, kind) in enumerate((("Eyes", "eye"), ("Ears", "ear"))):
                a = K.stagger(progress, k + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 300 + k * 290 + int((1 - a) * 30)
                draw.rounded_rectangle((1000, y, 1760, y + 230), radius=40, fill=panel, outline=coral, width=5)
                ix = 1110
                if kind == "eye":
                    draw.ellipse((ix - 72, y + 68, ix + 72, y + 162), fill=(255, 255, 255), outline=ink, width=5)
                    draw.ellipse((ix - 30, y + 85, ix + 30, y + 145), fill=K.ROAD)
                    draw.ellipse((ix - 12, y + 103, ix + 12, y + 127), fill=K.DEV_DEEP)
                    for j, kd in enumerate(("o", "y", "o")):
                        marigold(draw, 1450 + j * 100, y + 160, 34, kd)
                else:
                    draw.ellipse((ix - 30, y + 45, ix + 50, y + 185), fill=K.SKIN)
                    draw.arc((ix - 12, y + 72, ix + 32, y + 158), 250, 110, fill=(214, 156, 122), width=10)
                    K.sound_waves(draw, ix - 30, y + 115, 0.5, K.BOTH_COLOR, t, facing="left")
                    clap(draw, 1560, y + 150, 0.5, active=int(t * 8) % 2 == 0)
                draw.text((1220, y + 40), lab, fill=ink, font=font(56, bold=True))
            return True
        if focus == "ai":
            draw.ellipse((cx - 300, 560, cx + 300, 860), fill=blue_soft)
            ai_laptop(draw, cx, 720, 0.85, brand, t)
            specs = [("Numbers", cx - 520), ("Pictures", cx), ("Sounds", cx + 520)]
            for i, (lab, x) in enumerate(specs):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                y = 240 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 210 + 8, y + 10, x + 210 + 8, y + 270 + 10), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((x - 210, y, x + 210, y + 270), radius=36, fill=panel, outline=line, width=3)
                if i == 0:
                    K.text_at(draw, "2 4 6 8", x, y + 50, font(64, bold=True), K.BOTH_COLOR)
                elif i == 1:
                    mango(draw, x - 70, y + 96, 0.8)
                    cat_face(draw, x + 80, y + 100, 52, (240, 160, 80))
                else:
                    K.draw_device(draw, "speaker", x - 50, y + 95, 0.55, brand, t=t)
                    K.sound_waves(draw, x + 20, y + 95, 0.9, coral, t)
                K.text_at(draw, lab, x, y + 190, font(44, bold=True), ink)
                if i == 0:
                    K.draw_arrow(draw, x + 120, y + 290, cx - 230, 660, muted, width=8, head=24)
                elif i == 2:
                    K.draw_arrow(draw, x - 120, y + 290, cx + 230, 660, muted, width=8, head=24)
                else:
                    K.draw_arrow(draw, x, y + 290, x, 580, muted, width=8, head=24)
            return True
        # diff
        for k, (title, col, soft) in enumerate((("You", coral, coral_soft), ("AI", K.BOT, blue_soft))):
            x0 = 150 if k == 0 else 1000
            draw.rounded_rectangle((x0 + 10, 242, x0 + 770 + 10, 772), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, 230, x0 + 770, 760), radius=40, fill=soft, outline=col, width=5)
            draw.text((x0 + 40, 260), title, fill=col, font=font(64, bold=True))
            if k == 0:
                kid(draw, x0 + 600, 320, 0.75, coral, t, flower=True)
                for j in range(5):
                    mango(draw, x0 + 120 + j * 130, 570, 0.75, ["ripe", "green", "ripe", "spotty", "ripe"][j])
                draw.text((x0 + 40, 670), "A few at a time", fill=ink, font=font(40, bold=True))
            else:
                ai_laptop(draw, x0 + 610, 360, 0.42, brand, t, mag=False)
                n = int(140 * K.clamp01(progress * 1.3))
                for j in range(n):
                    r_, c_ = divmod(j, 20)
                    x = x0 + 60 + c_ * 33
                    y = 450 + r_ * 30
                    draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=MANGO if (j * 7) % 5 else MANGO_GREEN)
                draw.text((x0 + 40, 670), "Thousands, super fast!", fill=ink, font=font(40, bold=True))
        a = K.stagger(progress, 5, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, cx, 790 + int((1 - a) * 10), "Learns from examples people give it", K.BOTH_COLOR, size=30)
        return True

    # ---- checkpoint ------------------------------------------------------------------------
    if visual == "b7-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Spot the pattern!", cx, 450 + lift, font(64, bold=True), ink)
            for i, col in enumerate((RED, BLUE, RED)):
                balloon(draw, cx - 140 + i * 140, 600 + lift, 44, col)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "What comes next? Why?", 695, 256, font(48, bold=True), coral)
        seq = [RED, BLUE, RED, BLUE, RED]
        for i, col in enumerate(seq):
            x = 260 + i * 218
            if i == 4 and not ans:
                draw.rounded_rectangle((x - 90, 340, x + 90, 600), radius=24, fill=coral_soft)
                dashed_box((x - 90, 340, x + 90, 600), coral, width=4)
                K.text_at(draw, "?", x, 400, font(int(100 + 14 * pulse), bold=True), coral)
                continue
            balloon(draw, x, 430, 70, col)
            if i == 4:
                K.draw_check(draw, x + 70, 350, 24, sage)
        if ans:
            rows = ["Red! The colours take turns:", "red, then blue, then red again."]
            for i, lab in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a > 0:
                    draw.text((190, 650 + i * 80 + int((1 - a) * 10)), lab, fill=ink, font=font(44, bold=True))
        else:
            for i in range(2):
                draw.line((180, 720 + i * 80, 1210, 720 + i * 80), fill=(220, 210, 232), width=3)
        kid(draw, 1540, 520, 1.3, coral, t, flower=True)
        if ans:
            K.draw_heart(draw, 1700, 380 + bounce, 30, coral)
            star_spots([(1380, 330), (1720, 640)])
        else:
            question_marks([(1700, 330)], size=80)
            K.draw_stopwatch(draw, 1540, 800, 44, progress, brand)
        return True

    # ---- recap -----------------------------------------------------------------------------
    if visual == "b7-recap":
        recap = [(("A pattern", "repeats"), coral, "pattern"), (("Sorting = alike", "things in groups"), sage, "sort"),
                 (("AI finds", "patterns too"), K.BOT, "ai"), (("Thousands of", "things, fast!"), K.BOTH_COLOR, "fast")]
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
                if kind == "pattern":
                    for k, c in enumerate((RED, BLUE, RED, BLUE)):
                        balloon(draw, ix - 120 + k * 80, iy - 40, 32, c)
                    for k, kd in enumerate(("o", "y", "o", "y")):
                        marigold(draw, ix - 120 + k * 80, iy + 100, 30, kd)
                elif kind == "sort":
                    draw.rounded_rectangle((ix - 170, iy - 100, ix - 10, iy + 120), radius=20, fill=red_soft,
                                           outline=RED, width=4)
                    draw.rounded_rectangle((ix + 10, iy - 100, ix + 170, iy + 120), radius=20, fill=blue_soft,
                                           outline=BLUE, width=4)
                    for k in range(2):
                        shape(draw, "circle" if k == 0 else "square", ix - 90, iy - 40 + k * 100, 32, RED)
                        shape(draw, "square" if k == 0 else "circle", ix + 90, iy - 40 + k * 100, 32, BLUE)
                elif kind == "ai":
                    ai_laptop(draw, ix, iy + 20, 0.6, brand, t)
                else:
                    K.draw_stopwatch(draw, ix - 80, iy - 40, 54, progress * 3, brand)
                    for k in range(3):
                        mango(draw, ix - 80 + k * 80, iy + 100, 0.5, ["ripe", "green", "ripe"][k])
                    K.text_at(draw, "1000s", ix + 80, iy - 70, font(40, bold=True), col)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, coral, t, flower=True)
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Pattern detective", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
