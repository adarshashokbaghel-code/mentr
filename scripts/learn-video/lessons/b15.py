"""B15 · AI in Games — visuals."""
import math

import build as K

TIGER = (245, 140, 40)
TIGER_DARK = (214, 110, 24)
STRIPE = (44, 36, 34)
CREAM = (255, 246, 230)
EAR_IN = (255, 196, 176)
CAP = (44, 66, 128)
GRASS = (222, 242, 210)
HEDGE = (88, 166, 96)
HEDGE_DARK = (62, 132, 74)
MANGO = (255, 184, 40)
MANGO_BLUSH = (246, 120, 50)
WOOD = (196, 140, 92)
WOOD_DARK = (150, 100, 62)
GHOST = (236, 232, 252)
GHOST_SCARED = (130, 156, 232)
BERRY = (150, 70, 190)
OWL = (156, 108, 72)
OWL_LIGHT = (226, 196, 156)
PAPER = (255, 250, 238)
PAPER_LINE = (220, 210, 232)
CLOUD = (176, 190, 210)


def S_(s):
    return lambda v: v * s


def ell_poly(cx, cy, rx, ry, ang, n=32):
    ca, sa = math.cos(ang), math.sin(ang)
    pts = []
    for i in range(n):
        a = i * 2 * math.pi / n
        x, y = rx * math.cos(a), ry * math.sin(a)
        pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
    return pts


def tiger_head(draw, cx, cy, s, mood="happy", look=0.0, cap=True):
    """Head radius 95s; with cap the top is ≈ cy-128s."""
    S = S_(s)
    for sx in (-1, 1):
        ex, ey = cx + sx * S(74), cy - S(62)
        draw.ellipse((ex - S(30), ey - S(30), ex + S(30), ey + S(30)), fill=TIGER)
        draw.ellipse((ex - S(16), ey - S(16), ex + S(16), ey + S(16)), fill=EAR_IN)
    draw.ellipse((cx - S(95), cy - S(92), cx + S(95), cy + S(92)), fill=TIGER)
    for sx in (-1, 1):
        for k in range(2):
            yy = cy - S(6) + k * S(26)
            draw.polygon([(cx + sx * S(94), yy - S(9)), (cx + sx * S(58), yy + S(2)), (cx + sx * S(92), yy + S(11))],
                         fill=STRIPE)
    if not cap:
        for dx in (-26, 0, 26):
            draw.polygon([(cx + S(dx) - S(8), cy - S(90)), (cx + S(dx) + S(8), cy - S(90)), (cx + S(dx), cy - S(56))],
                         fill=STRIPE)
    draw.ellipse((cx - S(54), cy + S(4), cx + S(54), cy + S(78)), fill=CREAM)
    ey = cy - S(24)
    lw = max(2, int(S(6)))
    for sx in (-1, 1):
        ex = cx + sx * S(36)
        if mood == "sleep":
            draw.arc((ex - S(16), ey - S(10), ex + S(16), ey + S(14)), 20, 160, fill=STRIPE, width=lw)
        else:
            draw.ellipse((ex - S(17), ey - S(17), ex + S(17), ey + S(17)), fill=(255, 255, 255))
            px = ex + S(7) * look
            draw.ellipse((px - S(9), ey - S(8), px + S(9), ey + S(10)), fill=STRIPE)
            if mood == "chase":
                draw.line((ex - sx * S(16), ey - S(17), ex + sx * S(22), ey - S(33)), fill=STRIPE, width=lw)
    draw.polygon([(cx - S(15), cy + S(12)), (cx + S(15), cy + S(12)), (cx, cy + S(30))], fill=STRIPE)
    if mood == "chase":
        draw.chord((cx - S(24), cy + S(34), cx + S(24), cy + S(70)), 0, 180, fill=(190, 60, 60))
    else:
        draw.arc((cx - S(24), cy + S(18), cx, cy + S(48)), 10, 170, fill=STRIPE, width=lw)
        draw.arc((cx, cy + S(18), cx + S(24), cy + S(48)), 10, 170, fill=STRIPE, width=lw)
    if cap:
        draw.polygon([(cx - S(72), cy - S(66)), (cx - S(60), cy - S(126)), (cx + S(60), cy - S(126)),
                      (cx + S(72), cy - S(66))], fill=CAP)
        draw.rounded_rectangle((cx - S(84), cy - S(78), cx + S(84), cy - S(60)), radius=S(8), fill=(30, 44, 92))
        draw.ellipse((cx - S(15), cy - S(116), cx + S(15), cy - S(86)), fill=K.GOLD)


def tiger(draw, cx, cy, s, t, mood="happy", look=0.0, cap=True):
    """Standing tiger guard. cy = head centre; feet ≈ cy+250s."""
    S = S_(s)
    y = cy + S(5) * math.sin(t * math.pi * 5)
    draw.ellipse((cx - S(110), cy + S(236), cx + S(110), cy + S(266)), fill=K.SHADOW)
    K.draw_curve(draw, (cx + S(70), y + S(190)), (cx + S(170), y + S(170)), (cx + S(150), y + S(70)), TIGER,
                 width=max(3, int(S(22))))
    draw.ellipse((cx + S(136), y + S(54), cx + S(166), y + S(84)), fill=STRIPE)
    for sx in (-1, 1):
        lx = cx + sx * S(46)
        draw.rounded_rectangle((lx - S(24), y + S(160), lx + S(24), cy + S(248)), radius=S(14), fill=TIGER)
        draw.ellipse((lx - S(28), cy + S(222), lx + S(28), cy + S(254)), fill=CREAM)
    draw.ellipse((cx - S(86), y + S(60), cx + S(86), y + S(232)), fill=TIGER)
    draw.ellipse((cx - S(50), y + S(98), cx + S(50), y + S(222)), fill=CREAM)
    for sx in (-1, 1):
        for k in range(3):
            yy = y + S(110) + k * S(34)
            draw.polygon([(cx + sx * S(84), yy - S(8)), (cx + sx * S(56), yy + S(4)), (cx + sx * S(82), yy + S(12))],
                         fill=STRIPE)
    for sx in (-1, 1):
        px = cx + sx * S(40)
        draw.ellipse((px - S(22), y + S(120), px + S(22), y + S(158)), fill=TIGER_DARK)
    tiger_head(draw, cx, y, s, mood, look, cap)


def runner(draw, cx, cy, r):
    draw.ellipse((cx - r * 1.45, cy - r * 1.45, cx + r * 1.45, cy + r * 1.45), fill=K.CORAL)
    K.draw_face(draw, cx, cy + r * 0.12, r, "kid", 0.8)


def mango(draw, cx, cy, s, ang=-0.5):
    S = S_(s)
    draw.polygon(ell_poly(cx + S(4), cy + S(6), S(44), S(34), ang), fill=K.SHADOW)
    draw.polygon(ell_poly(cx, cy, S(44), S(34), ang), fill=MANGO)
    draw.polygon(ell_poly(cx + S(16), cy + S(8), S(20), S(16), ang), fill=MANGO_BLUSH)
    draw.polygon(ell_poly(cx - S(18), cy - S(38), S(22), S(9), -0.6), fill=K.LEAF)
    draw.line((cx - S(4), cy - S(30), cx - S(2), cy - S(42)), fill=WOOD_DARK, width=max(2, int(S(5))))


def coin(draw, cx, cy, r, squash=1.0):
    rx = max(2, r * squash)
    draw.ellipse((cx - rx + r * 0.08, cy - r + r * 0.1, cx + rx + r * 0.08, cy + r + r * 0.1), fill=K.SHADOW)
    draw.ellipse((cx - rx, cy - r, cx + rx, cy + r), fill=(232, 156, 30))
    draw.ellipse((cx - rx * 0.8, cy - r * 0.8, cx + rx * 0.8, cy + r * 0.8), fill=K.GOLD)
    if squash > 0.5:
        K.draw_star(draw, cx, cy, r * 0.42 * squash, (232, 156, 30))


def door(draw, cx, by, s, open_t=0.0):
    S = S_(s)
    draw.rectangle((cx - S(80) + S(8), by - S(220) + S(8), cx + S(80) + S(8), by + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - S(80), by - S(220), cx + S(80), by), fill=WOOD_DARK)
    draw.rectangle((cx - S(66), by - S(206), cx + S(66), by), fill=K.DEV_DEEP)
    if open_t > 0:
        draw.ellipse((cx - S(40), by - S(40), cx + S(40), by - S(4)), fill=(255, 220, 140))
    wd = S(132) * (1 - 0.78 * K.clamp01(open_t))
    x0 = cx - S(66)
    sk = S(16) * K.clamp01(open_t)
    draw.polygon([(x0, by - S(206)), (x0 + wd, by - S(206) + sk), (x0 + wd, by - sk), (x0, by)], fill=WOOD)
    if open_t < 0.5:
        for yy in (by - S(180), by - S(90)):
            draw.rectangle((x0 + S(16), yy, x0 + wd - S(16), yy + S(64)), outline=WOOD_DARK, width=max(2, int(S(4))))
        draw.ellipse((x0 + wd - S(30), by - S(112), x0 + wd - S(14), by - S(96)), fill=K.GOLD)


def ghost(draw, cx, cy, s, scared=False, t=0.0):
    S = S_(s)
    y = cy + S(8) * math.sin(t * 9)
    col = GHOST_SCARED if scared else GHOST
    edge = (92, 112, 196) if scared else (150, 136, 214)
    draw.ellipse((cx - S(70), cy + S(96), cx + S(70), cy + S(116)), fill=K.SHADOW)
    for c, e in ((edge, S(6)), (col, 0)):
        draw.ellipse((cx - S(70) - e, y - S(80) - e, cx + S(70) + e, y + S(60) + e), fill=c)
        draw.rectangle((cx - S(70) - e, y - S(10), cx + S(70) + e, y + S(66)), fill=c)
        for k in range(4):
            bx = cx - S(70) + k * S(35)
            draw.ellipse((bx - e, y + S(48) - e, bx + S(35) + e, y + S(84) + e), fill=c)
    if scared:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * S(26) - S(9), y - S(30), cx + sx * S(26) + S(9), y - S(12)), fill=(255, 255, 255))
        pts = [(cx - S(30) + k * S(12), y + S(14) + (S(6) if k % 2 else -S(6))) for k in range(6)]
        draw.line(pts, fill=(255, 255, 255), width=max(2, int(S(5))))
    else:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * S(26) - S(13), y - S(36), cx + sx * S(26) + S(13), y - S(6)), fill=K.DEV_DEEP)
        draw.ellipse((cx - S(12), y + S(6), cx + S(12), y + S(26)), fill=K.DEV_DEEP)


def berry(draw, cx, cy, r, glow=0.0):
    if glow > 0:
        for k in range(8):
            a = k * math.pi / 4
            draw.line((cx + math.cos(a) * r * 1.3, cy + math.sin(a) * r * 1.3, cx + math.cos(a) * r * (1.5 + 0.3 * glow),
                       cy + math.sin(a) * r * (1.5 + 0.3 * glow)), fill=K.GOLD, width=max(2, int(r * 0.16)))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=BERRY)
    draw.ellipse((cx - r * 0.5, cy - r * 0.6, cx - r * 0.1, cy - r * 0.2), fill=(214, 160, 240))
    draw.polygon(ell_poly(cx + r * 0.3, cy - r * 1.05, r * 0.45, r * 0.2, -0.5), fill=K.LEAF)


def owl(draw, cx, cy, s, awake=False, t=0.0):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110), cy + S(92), cx + S(110), cy + S(108)), radius=S(8), fill=WOOD_DARK)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * S(40), cy - S(72)), (cx + sx * S(70), cy - S(112)), (cx + sx * S(72), cy - S(56))],
                     fill=OWL)
    draw.ellipse((cx - S(76), cy - S(90), cx + S(76), cy + S(100)), fill=OWL)
    draw.ellipse((cx - S(46), cy - S(10), cx + S(46), cy + S(88)), fill=OWL_LIGHT)
    for sx in (-1, 1):
        draw.polygon(ell_poly(cx + sx * S(72), cy + S(24), S(22), S(52), sx * 0.25), fill=(122, 82, 52))
    for sx in (-1, 1):
        ex, ey = cx + sx * S(32), cy - S(38)
        draw.ellipse((ex - S(30), ey - S(30), ex + S(30), ey + S(30)), fill=(255, 255, 255))
        if awake:
            draw.ellipse((ex - S(14), ey - S(14), ex + S(14), ey + S(14)), fill=K.DEV_DEEP)
        else:
            draw.arc((ex - S(18), ey - S(12), ex + S(18), ey + S(14)), 20, 160, fill=K.DEV_DEEP, width=max(2, int(S(6))))
    draw.polygon([(cx - S(12), cy - S(12)), (cx + S(12), cy - S(12)), (cx, cy + S(10))], fill=K.GOLD)


def gate(draw, cx, by, s, open_t=0.0):
    S = S_(s)
    for sx in (-1, 1):
        draw.rectangle((cx + sx * S(110) - S(14), by - S(200), cx + sx * S(110) + S(14), by), fill=K.STEEL_DARK)
        draw.ellipse((cx + sx * S(110) - S(20), by - S(222), cx + sx * S(110) + S(20), by - S(182)), fill=K.STEEL_DARK)
    half = S(96) * (1 - 0.75 * K.clamp01(open_t))
    for sx in (-1, 1):
        x_out = cx + sx * S(96)
        x_in = x_out - sx * half
        lo, hi = sorted((x_out, x_in))
        draw.line((lo, by - S(160), hi, by - S(160)), fill=K.DEV_MID, width=max(2, int(S(10))))
        draw.line((lo, by - S(30), hi, by - S(30)), fill=K.DEV_MID, width=max(2, int(S(10))))
        n = 3
        for k in range(n + 1):
            bx = x_out - sx * half * k / n
            draw.line((bx, by - S(176), bx, by - S(16)), fill=K.DEV_MID, width=max(2, int(S(8))))
    if open_t < 0.5:
        K.draw_padlock(draw, cx, by - S(110), s * 0.3, K.GOLD, shadow=False)


def gamepad(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(90) + S(6), cy - S(46) + S(8), cx + S(90) + S(6), cy + S(46) + S(8)), radius=S(40),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(90), cy - S(46), cx + S(90), cy + S(46)), radius=S(40), fill=K.DEV_DARK)
    draw.rectangle((cx - S(62), cy - S(8), cx - S(26), cy + S(8)), fill=(255, 255, 255))
    draw.rectangle((cx - S(52), cy - S(18), cx - S(36), cy + S(18)), fill=(255, 255, 255))
    draw.ellipse((cx + S(30), cy - S(22), cx + S(50), cy - S(2)), fill=K.CORAL)
    draw.ellipse((cx + S(52), cy - S(2), cx + S(72), cy + S(18)), fill=K.GOLD)


def tablet(draw, box, t=0.0):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 12, y0 + 14, x1 + 12, y1 + 14), radius=44, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=44, fill=K.DEV_DARK)
    draw.ellipse((x0 + 12, (y0 + y1) / 2 - 6, x0 + 24, (y0 + y1) / 2 + 6), fill=K.DEV_MID)
    sb = (x0 + 40, y0 + 28, x1 - 28, y1 - 28)
    draw.rounded_rectangle(sb, radius=22, fill=GRASS)
    return sb


def maze_cell(sb, c, r):
    x0, y0, x1, y1 = sb
    cw, ch = (x1 - x0) / 9, (y1 - y0) / 5
    return x0 + cw * (c + 0.5), y0 + ch * (r + 0.5)


def maze(draw, sb):
    x0, y0, x1, y1 = sb
    cw, ch = (x1 - x0) / 9, (y1 - y0) / 5
    for r in (1, 3):
        for c0, c1 in ((1, 3), (5, 7)):
            bx = (x0 + cw * c0 + 8, y0 + ch * r + 10, x0 + cw * (c1 + 1) - 8, y0 + ch * (r + 1) - 10)
            draw.rounded_rectangle((bx[0], bx[1] + 6, bx[2], bx[3] + 6), radius=22, fill=HEDGE_DARK)
            draw.rounded_rectangle(bx, radius=22, fill=HEDGE)
            for k in range(int((bx[2] - bx[0]) / 70)):
                lx = bx[0] + 40 + k * 70
                draw.ellipse((lx - 12, bx[1] + 18, lx + 12, bx[1] + 36), fill=(120, 192, 120))


def paper(draw, box, lines=True):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=PAPER)
    if lines:
        draw.line((x0 + 70, y0 + 20, x0 + 70, y1 - 20), fill=(250, 180, 170), width=3)


def pencil(draw, x, y, s, ang=-0.7):
    S = S_(s)
    ca, sa = math.cos(ang), math.sin(ang)

    def P(u, v):
        return (x + u * ca - v * sa, y + u * sa + v * ca)
    draw.polygon([P(0, -S(14)), P(S(200), -S(14)), P(S(200), S(14)), P(0, S(14))], fill=K.GOLD)
    draw.polygon([P(S(200), -S(14)), P(S(240), -S(14)), P(S(240), S(14)), P(S(200), S(14))], fill=(240, 150, 160))
    draw.polygon([P(0, -S(14)), P(-S(40), 0), P(0, S(14))], fill=(240, 210, 170))
    draw.polygon([P(-S(26), -S(5)), P(-S(40), 0), P(-S(26), S(5))], fill=K.DEV_DEEP)


def cloud(draw, cx, cy, s, t=0.0, rain=True):
    S = S_(s)
    if rain:
        for k in range(5):
            rx = cx - S(80) + k * S(40)
            ry = cy + S(50) + ((t * 3 + k * 0.37) % 1) * S(80)
            draw.line((rx, ry, rx - S(8), ry + S(26)), fill=K.WATER_DEEP, width=max(2, int(S(7))))
    for dx, dy, r in ((-60, 10, 52), (0, -22, 70), (64, 8, 56)):
        draw.ellipse((cx + S(dx) - S(r), cy + S(dy) - S(r), cx + S(dx) + S(r), cy + S(dy) + S(r)), fill=CLOUD)
    draw.rounded_rectangle((cx - S(110), cy + S(4), cx + S(118), cy + S(62)), radius=S(29), fill=CLOUD)


def umbrella(draw, cx, cy, s, under=(255, 255, 255)):
    S = S_(s)
    draw.pieslice((cx - S(120), cy - S(120), cx + S(120), cy + S(10)), 180, 360, fill=K.CORAL)
    for k in range(4):
        bx = cx - S(120) + k * S(60)
        draw.chord((bx, cy - S(70), bx + S(60), cy - S(30)), 0, 180, fill=under)
    draw.line((cx, cy - S(70), cx, cy + S(80)), fill=K.DEV_DARK, width=max(2, int(S(9))))
    draw.arc((cx - S(30), cy + S(56), cx + S(4), cy + S(100)), 0, 180, fill=K.DEV_DARK, width=max(2, int(S(9))))
    draw.line((cx, cy - S(120), cx, cy - S(136)), fill=K.DEV_DARK, width=max(2, int(S(6))))


def loop_ring(draw, cx, cy, r, col, t, width=14):
    a0 = t * 200
    draw.arc((cx - r, cy - r, cx + r, cy + r), a0, a0 + 300, fill=col, width=width)
    ae = math.radians(a0 + 300)
    ex, ey = cx + r * math.cos(ae), cy + r * math.sin(ae)
    tx, ty = -math.sin(ae), math.cos(ae)
    nx, ny = math.cos(ae), math.sin(ae)
    hl = width * 1.6
    draw.polygon([(ex + tx * hl, ey + ty * hl), (ex + nx * hl * 0.8, ey + ny * hl * 0.8),
                  (ex - nx * hl * 0.8, ey - ny * hl * 0.8)], fill=col)


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    bg = K.hex_rgb(brand["bg"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    lav_soft = K.hex_rgb("#EFEAFB")
    blue_soft = K.hex_rgb("#E6EEFB")
    gold_soft = K.hex_rgb("#FFF4DC")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    font = K.load_font

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(84 + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def rule_chip(x, y, word, col, wdt=150):
        draw.rounded_rectangle((x, y, x + wdt, y + 64), radius=18, fill=col)
        K.text_at(draw, word, x + wdt / 2, y + 12, font(36, bold=True), panel)

    def filter_face(x, y, r, kind):
        K.draw_face(draw, x, y, r, "kid", 1.0)
        if kind == "find":
            K.draw_dashed(draw, x - r * 1.4, y - r * 1.5, x + r * 1.4, y - r * 1.5, coral, width=5)
            K.draw_dashed(draw, x - r * 1.4, y + r * 1.3, x + r * 1.4, y + r * 1.3, coral, width=5)
            K.draw_dashed(draw, x - r * 1.4, y - r * 1.5, x - r * 1.4, y + r * 1.3, coral, width=5)
            K.draw_dashed(draw, x + r * 1.4, y - r * 1.5, x + r * 1.4, y + r * 1.3, coral, width=5)
        elif kind == "none":
            pass
        elif kind == "mark":
            for px, py in ((-0.38, -0.05), (0.38, -0.05), (0, 0.25), (0, 0.5), (-0.5, -1.1), (0.5, -1.1)):
                draw.ellipse((x + px * r - 8, y + py * r - 8, x + px * r + 8, y + py * r + 8), fill=coral)
        else:
            for sx in (-1, 1):
                draw.polygon(ell_poly(x + sx * r * 0.85, y - r * 1.0, r * 0.32, r * 0.6, sx * 0.5), fill=WOOD)
            draw.ellipse((x - r * 0.22, y + r * 0.12, x + r * 0.22, y + r * 0.38), fill=K.DEV_DEEP)

    # ---- opening -----------------------------------------------------------
    if visual == "b15-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 470, 110, sage, panel, bounce)
            tiger(draw, cx + 300, 420, 0.82, t, mood="happy")
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(60, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · FACE FILTERS", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("find", "Find face"), ("mark", "Mark points"), ("draw", "Draw on top")]
            for i, (kind, lab) in enumerate(specs):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 530 + int((1 - a) * 40)
                draw.ellipse((x - 112, y - 112, x + 112, y + 112), fill=sage_soft)
                filter_face(x, y + 10, 52, kind)
                K.text_at(draw, lab, x, y + 132, font(36, bold=True), ink)
                if i < 2:
                    K.draw_arrow(draw, x + 128, y, x + 252, y, muted, width=8, head=22)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5", cx, 302 + lift, font(32, bold=True), coral)
            K.text_at(draw, "AI in Games", cx, 362 + lift, font(88, bold=True), ink)
            items = ["pad", "tiger", "coin", "ghost"]
            for i, kind in enumerate(items):
                a = K.stagger(progress, i + 1, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 330
                y = 650 + int((1 - a) * 40)
                draw.ellipse((x - 110, y - 110, x + 110, y + 110), fill=[blue_soft, coral_soft, gold_soft, lav_soft][i])
                if kind == "pad":
                    gamepad(draw, x, y, 0.95)
                elif kind == "tiger":
                    tiger_head(draw, x, y + 20, 0.62, "happy")
                elif kind == "coin":
                    coin(draw, x, y, 62)
                else:
                    ghost(draw, x, y - 10, 0.75, t=t)
            a = K.stagger(progress, 5, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 796 + int((1 - a) * 10), "The last chapter of Unit 3!", sage, size=30)
            return True
        # wonder
        sb = tablet(draw, (520, 260, 1400, 820), t)
        maze(draw, sb)
        rx, ry = maze_cell(sb, 1, 2)
        runner(draw, rx, ry, 26)
        sx_, sy_ = maze_cell(sb, 6.5 + 0.5 * math.sin(t * 6), 2)
        tiger_head(draw, sx_, sy_ + 10, 0.36, "happy", look=-1)
        for c in (3, 5, 7):
            mx, my = maze_cell(sb, c, 0)
            mango(draw, mx, my, 0.6)
        question_marks([(300, 380), (1620, 420), (360, 640), (1560, 660)])
        return True

    # ---- Riya and Mango Maze ------------------------------------------------------
    if visual == "b15-hook":
        if focus == "meet":
            draw.ellipse((470 - 270, 560 - 270, 470 + 270, 560 + 270), fill=coral_soft)
            K.draw_person(draw, 470, 500, 1.6, "kid", t)
            K.text_at(draw, "Meet Riya!", 1290, 250 + lift, font(80, bold=True), coral)
            sb = tablet(draw, (900, 380, 1680, 840), t)
            draw.rounded_rectangle(sb, radius=22, fill=(255, 236, 200))
            scx = (sb[0] + sb[2]) / 2
            K.text_at(draw, "MANGO MAZE", scx, sb[1] + 40, font(64, bold=True), (214, 110, 24))
            mango(draw, scx - 150, sb[1] + 220, 1.3)
            tiger_head(draw, scx + 150, sb[1] + 230, 0.7, "happy", look=-1)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, scx, sb[3] - 80 + int((1 - a) * 10), "PLAY", sage, size=34)
            sun_x, sun_y = 820, 300
            for k in range(8):
                ang = k * math.pi / 4 + t
                draw.line((sun_x + math.cos(ang) * 50, sun_y + math.sin(ang) * 50, sun_x + math.cos(ang) * 72,
                           sun_y + math.sin(ang) * 72), fill=K.GOLD, width=7)
            draw.ellipse((sun_x - 38, sun_y - 38, sun_x + 38, sun_y + 38), fill=K.GOLD)
            return True
        if focus in ("maze", "chase"):
            sb = tablet(draw, (160, 240, 1280, 870), t)
            maze(draw, sb)
            if focus == "maze":
                rc = K.clamp01(progress * 1.1) * 8
                rx, ry = maze_cell(sb, rc, 0)
                for c in (2, 4, 6, 8):
                    if rc < c - 0.3:
                        mx, my = maze_cell(sb, c, 0)
                        mango(draw, mx, my, 0.62)
                for c in (0, 4, 8):
                    mx, my = maze_cell(sb, c, 4)
                    mango(draw, mx, my, 0.62)
                runner(draw, rx, ry, 28)
                ph = t * 2 * math.pi * 1.5
                sc = 4 + 3 * math.sin(ph)
                look = 1 if math.cos(ph) > 0 else -1
                sx_, sy_ = maze_cell(sb, sc, 2)
                tiger_head(draw, sx_, sy_ + 12, 0.4, "happy", look=look)
                ly = sy_ + 70
                K.draw_dashed(draw, maze_cell(sb, 1, 2)[0], ly, maze_cell(sb, 7, 2)[0], ly, TIGER_DARK, width=4,
                              phase=t * 80)
            else:
                p1 = K.clamp01(progress / 0.35)
                p2 = K.clamp01((progress - 0.35) / 0.65)
                if progress < 0.35:
                    rx, ry = maze_cell(sb, 4, 2 * K.ease_in_out(p1))
                    sc = 6.5 + 1.5 * math.sin(t * 14)
                    mood, look = "happy", -1
                else:
                    rx, ry = maze_cell(sb, 4 - 3 * K.ease_out_cubic(p2), 2)
                    sc = 6.5 - 4.3 * p2
                    mood, look = "chase", -1
                sx_, sy_ = maze_cell(sb, sc, 2)
                runner(draw, rx, ry, 28)
                tiger_head(draw, sx_, sy_ + 12, 0.42, mood, look=look)
                if progress >= 0.35:
                    for k in range(3):
                        yy = sy_ - 20 + k * 30
                        draw.line((sx_ + 60, yy, sx_ + 120, yy), fill=TIGER_DARK, width=6)
                    K.text_at(draw, "!", sx_, sy_ - 120, font(80, bold=True), K.DANGER)
            # legend
            score = sum(1 for c in (2, 4, 6, 8) if K.clamp01(progress * 1.1) * 8 >= c - 0.3)
            rows = [("runner", "Riya (you)"), ("tiger", "Sheru"), ("mango", f"Mangoes: {score}")]
            if focus == "chase":
                rows = [("runner", "Run, Riya!"), ("tiger", "CHASE!")]
            for k, (kind, lab) in enumerate(rows):
                y = 300 + k * 170
                draw.rounded_rectangle((1340, y, 1790, y + 140), radius=36, fill=panel, outline=line, width=3)
                if kind == "runner":
                    runner(draw, 1420, y + 70, 30)
                elif kind == "tiger":
                    tiger_head(draw, 1420, y + 82, 0.42, "chase" if focus == "chase" else "happy")
                else:
                    mango(draw, 1420, y + 74, 0.8)
                col = K.DANGER if lab == "CHASE!" else ink
                draw.text((1490, y + 46), lab, fill=col, font=font(40, bold=True))
            return True
        if focus == "ask":
            K.draw_person(draw, 330, 600, 1.1, "kid", t)
            K.draw_person(draw, 600, 640, 0.9, "friend", t)
            K.draw_bubble(draw, (330, 250, 960, 420), brand, "Is someone hiding inside?", tail="right", size=42)
            sb = tablet(draw, (1080, 330, 1720, 800), t)
            maze(draw, sb)
            mx_, my_ = (sb[0] + sb[2]) / 2, (sb[1] + sb[3]) / 2
            draw.ellipse((mx_ - 110, my_ - 110, mx_ + 110, my_ + 110), fill=panel)
            K.draw_person(draw, mx_, my_ - 30, 0.55, "mystery", t)
            question_marks([(1010, 260), (1790, 290)])
            K.draw_stopwatch(draw, 900, 740, 56, progress, brand)
            return True
        # truth
        sb = tablet(draw, (160, 300, 820, 790), t)
        maze(draw, sb)
        mx_, my_ = maze_cell(sb, 4, 2)
        tiger_head(draw, mx_, my_ + 10, 0.5, "happy")
        K.draw_dashed(draw, 840, 420, 1000, 400, muted, width=5, phase=t * 100)
        K.draw_dashed(draw, 840, 680, 1000, 700, muted, width=5, phase=t * 100)
        draw.ellipse((910 - 62, 550 - 62, 910 + 62, 550 + 62), fill=panel, outline=line, width=3)
        K.draw_person(draw, 910, 530, 0.32, "mystery", t)
        K.draw_cross(draw, 954, 592, 24, K.DANGER)
        K.shadow_card(draw, (1000, 280, 1760, 820), brand, radius=36, accent=coral)
        K.text_at(draw, "Sheru's rules", 1380, 290, font(44, bold=True), panel)
        for k in range(2):
            a = K.stagger(progress, k + 1, step=0.18, speed=4)
            if a <= 0:
                continue
            y = 420 + k * 190 + int((1 - a) * 20)
            K.pill(draw, 0, y, f"RULE {k + 1}", coral if k == 0 else K.BOTH_COLOR, size=32, left=1050)
            for j in range(2):
                draw.rounded_rectangle((1060, y + 80 + j * 34, 1700 - j * 160, y + 100 + j * 34), radius=10, fill=line)
        K.text_at(draw, "?", 1650, 384, font(int(76 + 12 * pulse), bold=True), K.GOLD)
        return True

    # ---- player vs NPC ------------------------------------------------------------
    if visual == "b15-npc":
        if focus in ("player", "npc"):
            cards = [((160, 250, 920, 860), coral, coral_soft), ((1000, 250, 1760, 860), K.BOTH_COLOR, lav_soft)]
            for k, (bx, col, soft) in enumerate(cards):
                if k == 1 and focus == "player":
                    draw.rounded_rectangle(bx, radius=40, fill=(246, 241, 233), outline=line, width=3)
                    K.text_at(draw, "?", (bx[0] + bx[2]) / 2, 450, font(160, bold=True), line)
                    continue
                active = (k == 0) == (focus == "player")
                a = appear if active else 1.0
                yy = int((1 - a) * 30)
                draw.rounded_rectangle((bx[0] + 10, bx[1] + 12 + yy, bx[2] + 10, bx[3] + 12 + yy), radius=40,
                                       fill=K.SHADOW)
                draw.rounded_rectangle((bx[0], bx[1] + yy, bx[2], bx[3] + yy), radius=40, fill=soft, outline=col,
                                       width=6 if active else 3)
                mx = (bx[0] + bx[2]) / 2
                if k == 0:
                    K.draw_person(draw, mx - 160, 440 + yy, 0.95, "kid", t)
                    gamepad(draw, mx - 160, 640 + yy, 0.8)
                    K.draw_arrow(draw, mx - 40, 520 + yy, mx + 60, 520 + yy, col, width=10, head=28)
                    draw.rounded_rectangle((mx + 70, 420 + yy, mx + 300, 620 + yy), radius=20, fill=GRASS,
                                           outline=K.DEV_DARK, width=6)
                    runner(draw, mx + 185, 520 + yy + 6 * math.sin(t * 12), 34)
                    K.text_at(draw, "PLAYER", mx, 700 + yy, font(60, bold=True), col)
                    K.text_at(draw, "You control it", mx, 780 + yy, font(36, bold=True), ink)
                else:
                    tiger_head(draw, mx - 150, 470 + yy, 0.85, "happy")
                    draw.rounded_rectangle((mx + 50, 370 + yy, mx + 270, 570 + yy), radius=24, fill=K.DEV_DARK)
                    draw.rounded_rectangle((mx + 70, 390 + yy, mx + 250, 520 + yy), radius=12, fill=K.DEV_SCREEN)
                    for j in range(3):
                        draw.rounded_rectangle((mx + 90, 408 + yy + j * 36, mx + 230 - j * 30, 426 + yy + j * 36),
                                               radius=8, fill=sage)
                    draw.rectangle((mx + 140, 570 + yy, mx + 180, 600 + yy), fill=K.DEV_MID)
                    K.text_at(draw, "NPC", mx, 640 + yy, font(72, bold=True), col)
                    K.text_at(draw, "Non-Player Character", mx, 730 + yy, font(40, bold=True), ink)
                    K.text_at(draw, "The computer controls it", mx, 790 + yy, font(32, bold=True), muted)
            return True
        # examples
        specs = [("guard", "Maze guard"), ("ghost", "Ghost"), ("shop", "Shopkeeper")]
        cw, gap = 500, 50
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, (kind, lab) in enumerate(specs):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            x0 = x_start + i * (cw + gap)
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 250 + yy, x0 + cw, 760 + yy), brand, radius=36)
            mx = x0 + cw / 2
            if kind == "guard":
                draw.ellipse((mx - 150, 300 + yy, mx + 150, 600 + yy), fill=coral_soft)
                tiger_head(draw, mx, 470 + yy, 0.95, "happy")
            elif kind == "ghost":
                draw.ellipse((mx - 150, 300 + yy, mx + 150, 600 + yy), fill=lav_soft)
                ghost(draw, mx, 450 + yy, 1.1, t=t)
            else:
                draw.ellipse((mx - 150, 300 + yy, mx + 150, 600 + yy), fill=sage_soft)
                K.draw_person(draw, mx, 420 + yy, 0.8, "dad", t)
                draw.rounded_rectangle((mx - 150, 520 + yy, mx + 150, 600 + yy), radius=12, fill=WOOD)
                draw.rectangle((mx - 150, 520 + yy, mx + 150, 540 + yy), fill=WOOD_DARK)
                draw.rounded_rectangle((mx + 30, 300 + yy, mx + 230, 360 + yy), radius=26, fill=panel, outline=ink,
                                       width=3)
                K.text_at(draw, "Hello!", mx + 130, 310 + yy, font(30, bold=True), ink)
            K.text_at(draw, lab, mx, 630 + yy, font(46, bold=True), ink)
            K.pill(draw, mx, 692 + yy, "NPC", K.BOTH_COLOR, size=28)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, cx, 800 + int((1 - a) * 20), "The game moves them, using rules", sage, size=32)
        return True

    # ---- if / then / else -----------------------------------------------------------
    if visual == "b15-rule":
        if focus == "ifthen":
            K.shadow_card(draw, (140, 270, 900, 830), brand, radius=40, outline=coral, outline_w=5)
            rule_chip(170, 300, "IF", coral, 120)
            draw.text((310, 306), "something happens", fill=ink, font=font(38, bold=True))
            cloud(draw, 520, 490, 1.4, t)
            K.text_at(draw, "it rains", 520, 750, font(48, bold=True), ink)
            a = K.stagger(progress, 1, step=0.25, speed=4)
            if a > 0:
                K.draw_arrow(draw, 920, 550, 920 + 80 * a, 550, muted, width=12, head=32)
            if a > 0:
                ox = int((1 - a) * 40)
                K.shadow_card(draw, (1020 + ox, 270, 1780 + ox, 830), brand, radius=40, outline=sage, outline_w=5)
                rule_chip(1050 + ox, 300, "THEN", sage, 170)
                draw.text((1240 + ox, 306), "do this", fill=ink, font=font(38, bold=True))
                umbrella(draw, 1400 + ox, 540, 1.3, under=panel)
                K.text_at(draw, "take an umbrella", 1400 + ox, 750, font(48, bold=True), ink)
            return True
        if focus == "sheru":
            draw.ellipse((400 - 250, 560 - 250, 400 + 250, 560 + 250), fill=coral_soft)
            tiger(draw, 400, 430, 0.95, t, mood="chase" if progress > 0.45 else "happy")
            rows = [("RULE 1", [("IF", coral, 100), ("player is near", None, 0), ("THEN", sage, 150), ("chase", None, 0)]),
                    ("RULE 2", [("ELSE", K.BOTH_COLOR, 150), ("patrol", None, 0)])]
            for k, (title, parts) in enumerate(rows):
                a = K.stagger(progress, k * 3, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 270 + k * 300 + int((1 - a) * 30)
                K.shadow_card(draw, (760, y, 1780, y + 260), brand, radius=32)
                K.text_at(draw, title, 1270, y + 18, font(32, bold=True), muted)
                if k == 0:
                    rule_chip(800, y + 80, "IF", coral, 90)
                    draw.text((910, y + 90), "player is near", fill=ink, font=font(42, bold=True))
                    rule_chip(1250, y + 80, "THEN", sage, 140)
                    draw.text((1410, y + 90), "chase!", fill=K.DANGER, font=font(42, bold=True))
                    K.draw_arrow(draw, 1000, y + 196, 1160, y + 196, K.DANGER, width=10, head=26)
                    runner(draw, 1210, y + 196, 22)
                else:
                    rule_chip(800, y + 80, "ELSE", K.BOTH_COLOR, 140)
                    draw.text((960, y + 90), "patrol", fill=ink, font=font(42, bold=True))
                    K.draw_arrow(draw, 1220, y + 112, 1420, y + 112, K.BOTH_COLOR, width=10, head=26)
                    K.draw_arrow(draw, 1420, y + 112, 1220, y + 112, K.BOTH_COLOR, width=10, head=26)
                    K.draw_dashed(draw, 960, y + 200, 1700, y + 200, TIGER_DARK, width=5, phase=t * 100)
            return True
        if focus == "else":
            K.shadow_card(draw, (140, 260, 820, 840), brand, radius=40, outline=K.BOTH_COLOR, outline_w=5)
            K.text_at(draw, "ELSE", 480, 330, font(120, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "means", 480, 500, font(40, bold=True), muted)
            a = K.stagger(progress, 1, step=0.2, speed=4)
            if a > 0:
                K.text_at(draw, "otherwise,", 480, 560 + int((1 - a) * 20), font(62, bold=True), ink)
                K.text_at(draw, "if not", 480, 640 + int((1 - a) * 20), font(62, bold=True), ink)
            # scene: player far away
            sb = (920, 300, 1780, 660)
            draw.rounded_rectangle((sb[0] + 10, sb[1] + 12, sb[2] + 10, sb[3] + 12), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle(sb, radius=30, fill=GRASS)
            runner(draw, 1010, 470, 30)
            sxp = 1580 + 90 * math.sin(t * 10)
            tiger_head(draw, sxp, 480, 0.48, "happy", look=1 if math.cos(t * 10) > 0 else -1)
            K.draw_arrow(draw, 1080, 470, 1440, 470, muted, width=5, head=18)
            K.draw_arrow(draw, 1440, 470, 1080, 470, muted, width=5, head=18)
            K.text_at(draw, "far away", 1260, 410, font(32, bold=True), muted)
            K.draw_dashed(draw, 1460, 580, 1720, 580, TIGER_DARK, width=5, phase=t * 100)
            K.text_at(draw, "patrol path", 1590, 596, font(28, bold=True), TIGER_DARK)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                y = 720 + int((1 - a) * 20)
                draw.rounded_rectangle((920, y, 1780, y + 110), radius=55, fill=lav_soft, outline=K.BOTH_COLOR, width=4)
                K.text_at(draw, "Not near? → Patrol", 1350, y + 28, font(46, bold=True), K.BOTH_COLOR)
            return True
        # words
        panels = [((140, 260, 930, 840), "CHASE", "move towards the player", K.DANGER, K.DANGER_SOFT),
                  ((990, 260, 1780, 840), "PATROL", "walk back and forth, watching", K.BOTH_COLOR, lav_soft)]
        for k, (bx, title, sub, col, soft) in enumerate(panels):
            a = K.stagger(progress, k * 3, step=0.15, speed=4)
            if a <= 0:
                continue
            yy = int((1 - a) * 30)
            draw.rounded_rectangle((bx[0] + 10, bx[1] + 12 + yy, bx[2] + 10, bx[3] + 12 + yy), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((bx[0], bx[1] + yy, bx[2], bx[3] + yy), radius=40, fill=soft, outline=col, width=5)
            mx = (bx[0] + bx[2]) / 2
            K.text_at(draw, title, mx, bx[1] + 30 + yy, font(72, bold=True), col)
            if k == 0:
                p = (t * 1.5) % 1
                tx = bx[0] + 560 - 160 * p
                runner(draw, bx[0] + 140, 560 + yy, 34)
                tiger_head(draw, tx, 570 + yy, 0.6, "chase", look=-1)
                for j in range(3):
                    ly = 530 + yy + j * 34
                    draw.line((tx + 80, ly, tx + 150, ly), fill=TIGER_DARK, width=7)
            else:
                ph = math.sin(t * 8)
                tx = mx + 230 * ph
                K.draw_dashed(draw, bx[0] + 90, 640 + yy, bx[2] - 90, 640 + yy, TIGER_DARK, width=6, phase=t * 100)
                tiger_head(draw, tx, 540 + yy, 0.6, "happy", look=1 if math.cos(t * 8) > 0 else -1)
                K.draw_arrow(draw, bx[0] + 90, 700 + yy, bx[0] + 250, 700 + yy, col, width=8, head=24)
                K.draw_arrow(draw, bx[2] - 90, 700 + yy, bx[2] - 250, 700 + yy, col, width=8, head=24)
            K.text_at(draw, sub, mx, bx[3] - 80 + yy, font(36, bold=True), ink)
        return True

    # ---- checking fast ---------------------------------------------------------------
    if visual == "b15-fast":
        if focus == "check":
            cw, gap = 500, 50
            x_start = cx - (3 * cw + 2 * gap) / 2
            dists = [2.8, 1.8, 0.6]
            for i in range(3):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                x0 = x_start + i * (cw + gap)
                yy = int((1 - a) * 30)
                yes = i == 2
                K.shadow_card(draw, (x0, 260 + yy, x0 + cw, 840 + yy), brand, radius=32,
                              outline=coral if yes else line, outline_w=6 if yes else 3)
                K.text_at(draw, f"Check {i + 1}", x0 + cw / 2, 285 + yy, font(34, bold=True), muted)
                draw.rounded_rectangle((x0 + 30, 350 + yy, x0 + cw - 30, 560 + yy), radius=20, fill=GRASS)
                sx_ = x0 + cw - 100
                rx = sx_ - 90 - dists[i] * 75
                runner(draw, rx, 470 + yy, 24)
                tiger_head(draw, sx_, 470 + yy, 0.42, "chase" if yes else "happy", look=-1)
                K.text_at(draw, "Player near?", x0 + cw / 2, 600 + yy, font(40, bold=True), ink)
                if yes:
                    K.pill(draw, x0 + cw / 2, 670 + yy, "YES!", sage, size=40)
                    K.pill(draw, x0 + cw / 2, 762 + yy, "CHASE!", K.DANGER, size=30)
                else:
                    K.pill(draw, x0 + cw / 2, 670 + yy, "No", muted, size=40)
            return True
        if focus == "quick":
            draw.ellipse((480 - 250, 530 - 250, 480 + 250, 530 + 250), fill=gold_soft)
            K.draw_stopwatch(draw, 480, 550, 120, progress * 4, brand)
            for k in range(10):
                a = K.stagger(progress, k, step=0.05, speed=6)
                if a <= 0:
                    continue
                ang = -math.pi / 2 + k * 2 * math.pi / 10
                px, py = 480 + math.cos(ang) * 205, 540 + math.sin(ang) * 200
                draw.ellipse((px - 26, py - 26, px + 26, py + 26), fill=coral)
                K.draw_check(draw, px, py, 18, panel, bg=coral)
            K.text_at(draw, "1 second", 480, 800, font(44, bold=True), ink)
            K.shadow_card(draw, (960, 270, 1780, 830), brand, radius=36, accent=sage)
            K.text_at(draw, "Remember filters?", 1370, 285, font(42, bold=True), panel)
            filter_face(1370, 540, 90, "mark" if int(t * 12) % 2 == 0 else "none")
            loop_ring(draw, 1370, 520, 160, sage, t, width=10)
            K.text_at(draw, "Find points again", 1370, 720, font(40, bold=True), ink)
            K.text_at(draw, "and again!", 1370, 770, font(40, bold=True), ink)
            return True
        # smart
        draw.ellipse((470 - 260, 560 - 260, 470 + 260, 560 + 260), fill=coral_soft)
        tiger(draw, 470, 430, 0.95, t, mood="happy")
        rows = [("Alive", False), ("Has feelings", False), ("Reads your mind", False), ("Follows clear rules, fast", True)]
        for i, (lab, ok) in enumerate(rows):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            y = 260 + i * 140 + int((1 - a) * 20)
            col = sage if ok else K.DANGER
            soft = sage_soft if ok else K.DANGER_SOFT
            draw.rounded_rectangle((880, y, 1780, y + 110), radius=36, fill=soft, outline=col, width=4)
            (K.draw_check if ok else K.draw_cross)(draw, 940, y + 55, 30, col)
            draw.text((1000, y + 30), lab, fill=ink, font=font(44, bold=True))
        a = K.stagger(progress, 5, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1330, 820 - int((1 - a) * -10), "That's simple AI!", coral, size=30)
        return True

    # ---- game rules are algorithms -----------------------------------------------------
    if visual == "b15-algo":
        if focus == "intro":
            paper(draw, (200, 250, 840, 860))
            K.text_at(draw, "Steps", 540, 280, font(50, bold=True), coral)
            for i in range(3):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                y = 390 + i * 140
                K.pill(draw, 0, y, str(i + 1), coral, size=36, left=260)
                draw.rounded_rectangle((360, y + 18, 760 - i * 70, y + 46), radius=14, fill=line)
            K.draw_arrow(draw, 880, 550, 1000, 550, muted, width=10, head=28)
            draw.rounded_rectangle((1040, 330, 1360, 560), radius=24, fill=K.DEV_DARK)
            draw.rounded_rectangle((1062, 352, 1338, 520), radius=12, fill=K.DEV_SCREEN)
            tiger_head(draw, 1200, 450, 0.4, "happy")
            draw.rectangle((1180, 560, 1220, 600), fill=K.DEV_MID)
            draw.rounded_rectangle((1120, 596, 1280, 616), radius=8, fill=K.DEV_MID)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.text_at(draw, "ALGORITHM", 1430, 660 + int((1 - a) * 20), font(80, bold=True), K.BOTH_COLOR)
                K.text_at(draw, "steps a computer follows", 1430, 770 + int((1 - a) * 20), font(38, bold=True), ink)
            return True
        if focus == "loop":
            active = int(t * 6) % 3
            dcx, dcy = 640, 540
            col_d = coral if active == 0 else K.GOLD
            pts = [(dcx, dcy - 130), (dcx + 270, dcy), (dcx, dcy + 130), (dcx - 270, dcy)]
            draw.polygon([(x + 8, y + 10) for x, y in pts], fill=K.SHADOW)
            draw.polygon(pts, fill=col_d)
            K.text_at(draw, "Player", dcx, dcy - 58, font(46, bold=True), ink)
            K.text_at(draw, "near?", dcx, dcy - 4, font(46, bold=True), ink)
            boxes = [("CHASE", (1150, 270, 1530, 420), K.DANGER, K.DANGER_SOFT, "YES", 1),
                     ("PATROL", (1150, 660, 1530, 810), K.BOTH_COLOR, lav_soft, "NO", 2)]
            for lab, bx, col, soft, tag, idx in boxes:
                my = (bx[1] + bx[3]) / 2
                on = active == idx
                K.draw_arrow(draw, dcx + 230, dcy + (-40 if idx == 1 else 40), bx[0] - 10, my, col, width=10, head=28)
                K.text_at(draw, tag, 1000, my - 30 + (50 if idx == 1 else -5), font(36, bold=True), col)
                draw.rounded_rectangle((bx[0] + 8, bx[1] + 10, bx[2] + 8, bx[3] + 10), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle(bx, radius=36, fill=col if on else soft, outline=col, width=5)
                K.text_at(draw, lab, (bx[0] + bx[2]) / 2, my - 34, font(56, bold=True), panel if on else col)
                K.draw_dashed(draw, bx[2] + 10, my, 1680, my, muted, width=8, phase=-t * 200)
            K.draw_dashed(draw, 1680, 345, 1680, 850, muted, width=8, phase=-t * 200)
            K.draw_dashed(draw, 1680, 850, 260, 850, muted, width=8, phase=-t * 200)
            K.draw_dashed(draw, 260, 850, 260, dcy, muted, width=8, phase=-t * 200)
            K.draw_arrow(draw, 260, dcy, dcx - 272, dcy, muted, width=8, head=26)
            K.pill(draw, 0, 824, "Check again!", muted, size=28, left=860)
            tiger_head(draw, 300, 340, 0.62, "chase" if active == 1 else "happy")
            return True
        # same
        K.text_at(draw, "Game rules are algorithms!", cx, 250, font(70, bold=True), K.BOTH_COLOR)
        specs = [("tiger", "Guard"), ("ghost", "Ghost"), ("coin", "Coin")]
        for i, (kind, lab) in enumerate(specs):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 520
            y = 560 + int((1 - a) * 40)
            draw.ellipse((x - 160, y - 160, x + 160, y + 160), fill=[coral_soft, lav_soft, gold_soft][i])
            if kind == "tiger":
                tiger_head(draw, x - 30, y + 20, 0.8, "happy")
            elif kind == "ghost":
                ghost(draw, x - 30, y - 10, 1.0, t=t)
            else:
                coin(draw, x - 30, y, 80)
            draw.rounded_rectangle((x + 70, y + 20, x + 170, y + 140), radius=10, fill=PAPER, outline=muted, width=3)
            for j in range(3):
                draw.line((x + 88, y + 50 + j * 26, x + 152, y + 50 + j * 26), fill=muted, width=4)
            K.text_at(draw, lab, x, y + 180, font(46, bold=True), ink)
        return True

    # ---- coin, door, ghost rules -------------------------------------------------------
    if visual == "b15-rules":
        specs = [("coin", ("IF touched,", "THEN vanish, +1"), MANGO_BLUSH, gold_soft),
                 ("door", ("IF player has key,", "THEN open"), WOOD_DARK, coral_soft),
                 ("ghost", ("IF power berry,", "THEN run away"), K.BOTH_COLOR, lav_soft)]
        n = {"intro": 0, "coin": 1, "door": 2, "ghost": 3}[focus]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, (kind, lab, col, soft) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            active = i == n - 1
            done = i < n
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if (active or focus == "intro") else 1.0
            if focus == "intro":
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
            yy = int((1 - a) * 30)
            K.shadow_card(draw, (x0, 250 + yy, x0 + cw, 850 + yy), brand, radius=36,
                          outline=col if active else line, outline_w=6 if active else 3)
            ib = (x0 + 24, 274 + yy, x0 + cw - 24, 620 + yy)
            draw.rounded_rectangle(ib, radius=24, fill=soft)
            mx = x0 + cw / 2
            run_p = K.clamp01(progress * 1.6) if active else (1.0 if done else 0.0)
            if kind == "coin":
                gone = run_p > 0.6
                rx = K.lerp(ib[0] + 70, mx - 10, K.clamp01(run_p / 0.6))
                if not gone:
                    coin(draw, mx + 60, 450 + yy, 60, squash=1.0 - 0.8 * K.clamp01((run_p - 0.4) / 0.2))
                else:
                    for k in range(4):
                        ang = k * math.pi / 2 + 0.6
                        K.draw_star(draw, mx + 60 + math.cos(ang) * 70, 440 + yy + math.sin(ang) * 60, 16, K.GOLD,
                                    rot=t * 4)
                    K.text_at(draw, "+1", mx + 60, 400 + yy, font(56, bold=True), sage)
                runner(draw, rx, 470 + yy, 28)
            elif kind == "door":
                door(draw, mx + 70, 600 + yy, 1.2, open_t=K.clamp01((run_p - 0.3) / 0.5))
                K.draw_key(draw, mx - 120, 360 + yy, 0.55, K.GOLD)
                runner(draw, mx - 130, 500 + yy, 28)
            else:
                scared = run_p > 0.35
                gx = mx + 60 + (90 * K.clamp01((run_p - 0.35) / 0.65) if scared else 0)
                ghost(draw, gx, 430 + yy, 0.9, scared=scared, t=t)
                if not scared:
                    berry(draw, mx - 130, 420 + yy, 30, glow=pulse)
                runner(draw, mx - 130, 520 + yy, 28)
            if done:
                label_lines(lab, mx, 660 + yy, size=36)
            elif focus == "intro":
                K.text_at(draw, "?", mx, 650 + yy, font(110, bold=True), K.GOLD)
            else:
                for j in range(2):
                    draw.rounded_rectangle((x0 + 80, 680 + yy + j * 60, x0 + cw - 80 - j * 80, 704 + yy + j * 60),
                                           radius=12, fill=line)
        return True

    # ---- match the rule ---------------------------------------------------------------------
    if visual == "b15-match":
        ans = focus == "answer"
        chars = [("mango", "Mango"), ("gate", "Gate"), ("owl", "Owl")]
        rules = [("Hoot if player", "comes close"), ("Vanish & +1", "if touched"), ("Open if player", "has the key")]
        match = {0: 1, 1: 2, 2: 0}
        cols = [MANGO_BLUSH, K.STEEL_DARK, OWL]
        lb = []
        for i, (kind, lab) in enumerate(chars):
            y0 = 250 + i * 210
            bx = (170, y0, 690, y0 + 180)
            K.shadow_card(draw, bx, brand, radius=30, outline=cols[i] if ans else line, outline_w=5 if ans else 3)
            ix = 290
            if kind == "mango":
                mango(draw, ix, y0 + 94, 1.2)
            elif kind == "gate":
                gate(draw, ix, y0 + 168, 0.62, open_t=1.0 if ans and progress > 0.3 else 0.0)
            else:
                owl(draw, ix, y0 + 80, 0.62, awake=ans and progress > 0.5, t=t)
            draw.text((400, y0 + 60), lab, fill=ink, font=font(52, bold=True))
            lb.append((690, y0 + 90))
            draw.ellipse((690 - 14, y0 + 76, 690 + 14, y0 + 104), fill=cols[i] if ans else muted)
        rb = []
        for j, lines in enumerate(rules):
            y0 = 250 + j * 210
            bx = (1180, y0, 1760, y0 + 180)
            K.shadow_card(draw, bx, brand, radius=30)
            label_lines(lines, 1470, y0 + 40, size=40)
            rb.append((1180, y0 + 90))
            draw.ellipse((1180 - 14, y0 + 76, 1180 + 14, y0 + 104), fill=muted)
        if ans:
            for i in range(3):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                p0, p1 = lb[i], rb[match[i]]
                ex = K.lerp(p0[0], p1[0], a)
                ey = K.lerp(p0[1], p1[1], a)
                draw.line((p0[0] + 14, p0[1], ex, ey), fill=cols[i], width=10)
                if a >= 1:
                    K.draw_check(draw, 1760 - 40, p1[1] - 50, 22, sage)
        else:
            K.draw_stopwatch(draw, 935, 520, 70, progress, brand)
            question_marks([(900, 300), (970, 680)])
        return True

    # ---- which guard is better --------------------------------------------------------------
    if visual == "b15-best":
        ans = focus == "answer"
        cards = [("A", ("If near → chase", "Else → patrol"), "happy"), ("B", ("If near → sleep", "Else → sleep"), "sleep")]
        for k, (tag, lines, mood) in enumerate(cards):
            x0 = 160 if k == 0 else 1000
            bx = (x0, 280, x0 + 760, 850)
            reveal = ans and progress > 0.05
            good = k == 0
            col = (sage if good else K.DANGER) if reveal else line
            K.shadow_card(draw, bx, brand, radius=40, outline=col, outline_w=6 if reveal else 3)
            if reveal and good:
                draw.rounded_rectangle((bx[0] + 6, bx[1] + 6, bx[2] - 6, bx[3] - 6), radius=36, fill=sage_soft)
            K.pill(draw, 0, 300, f"Pair {tag}", coral if k == 0 else K.BOTH_COLOR, size=34, left=x0 + 30)
            mx = x0 + 380
            if mood == "happy":
                tx = mx + 60 + 140 * math.sin(t * 8)
                K.draw_dashed(draw, mx - 140, 560, mx + 260, 560, TIGER_DARK, width=5, phase=t * 100)
                tiger_head(draw, tx, 470, 0.65, "chase" if int(t * 4) % 2 else "happy",
                           look=1 if math.cos(t * 8) > 0 else -1)
                runner(draw, x0 + 110, 470, 26)
            else:
                tiger_head(draw, mx, 480, 0.65, "sleep")
                for j in range(3):
                    zx, zy = mx + 90 + j * 40, 380 - j * 40 + 6 * math.sin(t * 8 + j)
                    K.text_at(draw, "z", zx, zy, font(40 + j * 10, bold=True), K.BOTH_COLOR)
            label_lines(lines, mx, 640, size=46)
            if reveal:
                (K.draw_check if good else K.draw_cross)(draw, bx[2] - 60, bx[1] + 60, 34, col)
                K.pill(draw, mx, 790, "Reacts & keeps watch!" if good else "Just sleeps!", col, size=28)
        if not ans:
            K.pill(draw, cx - 40, 222, "Which guard is better?", coral, size=32)
            K.draw_stopwatch(draw, cx + 230, 252, 32, progress, brand)
        return True

    # ---- project ---------------------------------------------------------------------------
    if visual == "b15-project":
        if focus == "intro":
            paper(draw, (180, 260, 900, 840), lines=False)
            mb = (260, 320, 820, 760)
            for x0_, y0_, x1_, y1_ in ((260, 320, 820, 340), (260, 740, 820, 760), (260, 320, 280, 760),
                                       (800, 320, 820, 640), (380, 440, 600, 460), (480, 560, 700, 580),
                                       (380, 440, 400, 640), (680, 340, 700, 520)):
                draw.rounded_rectangle((x0_, y0_, x1_, y1_), radius=8, fill=K.DEV_MID)
            runner(draw, 330, 690, 24)
            tiger_head(draw, 560, 680, 0.34, "happy")
            pencil(draw, 790, 820, 1.0)
            K.text_at(draw, "YOUR PROJECT", 1350, 290 + lift, font(44, bold=True), coral)
            K.text_at(draw, "Design a", 1350, 380 + lift, font(84, bold=True), ink)
            K.text_at(draw, "maze guard!", 1350, 480 + lift, font(84, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1350, 640 + int((1 - a) * 20), "You are the game maker", sage, size=36)
            star_spots([(1040, 760), (1660, 770)])
            return True
        n = int(focus[-1])
        specs = [("Draw a maze,", "pick a guard"), ("Write", "2 rules"), ("Test with", "a friend")]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, lab in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            bx = (x0, 250, x0 + cw, 860)
            if i >= n:
                draw.rounded_rectangle(bx, radius=36, fill=(246, 241, 233), outline=line, width=3)
                K.text_at(draw, str(i + 1), x0 + cw / 2, 450, font(120, bold=True), line)
                continue
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 250 + yy, x0 + cw, 860 + yy), brand, radius=36,
                          outline=coral if active else line, outline_w=6 if active else 3)
            K.pill(draw, 0, 274 + yy, str(i + 1), coral, size=32, left=x0 + 24)
            mx = x0 + cw / 2
            if i == 0:
                draw.rounded_rectangle((x0 + 60, 360 + yy, x0 + cw - 60, 560 + yy), radius=16, fill=PAPER,
                                       outline=K.DEV_MID, width=8)
                draw.line((x0 + 160, 360 + yy, x0 + 160, 480 + yy), fill=K.DEV_MID, width=8)
                draw.line((x0 + 260, 440 + yy, x0 + 400, 440 + yy), fill=K.DEV_MID, width=8)
                draw.line((x0 + 330, 440 + yy, x0 + 330, 560 + yy), fill=K.DEV_MID, width=8)
                K.draw_person(draw, x0 + 110, 620 + yy, 0.32, "dad", t)
                K.draw_robot(draw, mx, 640 + yy, 0.22, t, mood="happy")
                tiger_head(draw, x0 + cw - 110, 624 + yy, 0.34, "happy")
            elif i == 1:
                paper(draw, (x0 + 40, 340 + yy, x0 + cw - 40, 640 + yy), lines=False)
                rule_chip(x0 + 64, 370 + yy, "IF", coral, 70)
                draw.text((x0 + 148, 378 + yy), "near, then", fill=ink, font=font(36, bold=True))
                K.draw_dashed(draw, x0 + 70, 480 + yy, x0 + cw - 80, 480 + yy, muted, width=4)
                rule_chip(x0 + 64, 520 + yy, "ELSE", K.BOTH_COLOR, 110)
                K.draw_dashed(draw, x0 + 190, 576 + yy, x0 + cw - 80, 576 + yy, muted, width=4)
                pencil(draw, x0 + cw - 120, 660 + yy, 0.6, ang=-0.9)
            else:
                gx, gy = mx - 110, 450 + yy
                K.draw_person(draw, gx, gy, 0.75, "kid", t)
                K.draw_person(draw, mx + 110, 460 + yy, 0.7, "friend", t)
                hy = gy + 4.5 * math.sin(t * math.pi * 4)
                draw.polygon([(gx - 50, hy - 34), (gx - 42, hy - 76), (gx + 42, hy - 76), (gx + 50, hy - 34)], fill=CAP)
                draw.rounded_rectangle((gx - 58, hy - 42, gx + 58, hy - 30), radius=6, fill=(30, 44, 92))
                draw.ellipse((gx - 10, hy - 70, gx + 10, hy - 50), fill=K.GOLD)
                loop_ring(draw, mx - 100, 640 + yy, 40, sage, t, width=10)
                draw.text((mx - 34, 620 + yy), "fix & retry", fill=sage, font=font(34, bold=True))
            label_lines(lab, mx, 720 + yy, size=42)
        return True

    # ---- checkpoint --------------------------------------------------------------------------
    if visual == "b15-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 300 + lift, font(40, bold=True), panel)
            K.text_at(draw, "Write a game rule!", cx, 420 + lift, font(64, bold=True), ink)
            coin(draw, cx - 120, 610 + lift, 62, squash=abs(math.cos(t * 5)))
            runner(draw, cx + 120, 610 + lift, 34)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1120 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1120, 870), radius=24, fill=PAPER)
        label_lines(("Write one rule for a coin", "that disappears when touched"), 625, 256, size=44, col=coral)
        rows = [("IF", coral, "the player touches the coin,"), ("THEN", sage, "the coin disappears"),
                ("AND", K.BOTH_COLOR, "the score goes up by 1")]
        for i, (word, col, txt) in enumerate(rows):
            y = 420 + i * 140
            draw.line((170, y + 100, 1080, y + 100), fill=PAPER_LINE, width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                rule_chip(170, y + 20, word, col, 130)
                draw.text((320, y + 28), txt, fill=ink, font=font(40, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 625, y - 30, font(110, bold=True), line)
        rc = (1460, 560)
        draw.ellipse((rc[0] - 290, rc[1] - 260, rc[0] + 290, rc[1] + 260), fill=gold_soft)
        if ans:
            gone = progress > 0.4
            rx = K.lerp(rc[0] - 200, rc[0] - 40, K.clamp01(progress / 0.4))
            if not gone:
                coin(draw, rc[0] + 60, rc[1], 80, squash=1.0 - 0.8 * K.clamp01((progress - 0.25) / 0.15))
            else:
                for k in range(5):
                    ang = k * 2 * math.pi / 5 + 0.3
                    K.draw_star(draw, rc[0] + 60 + math.cos(ang) * 110, rc[1] + math.sin(ang) * 100, 20, K.GOLD,
                                rot=t * 4)
                K.text_at(draw, "+1", rc[0] + 60, rc[1] - 190, font(90, bold=True), sage)
            runner(draw, rx, rc[1] + 20, 36)
            K.pill(draw, rc[0], 760, f"Score: {1 if gone else 0}", MANGO_BLUSH, size=34)
        else:
            coin(draw, rc[0] + 60, rc[1], 80)
            runner(draw, rc[0] - 160, rc[1] + 20, 36)
            K.text_at(draw, "?", rc[0] - 50, rc[1] - 220, font(90, bold=True), K.GOLD)
            K.draw_stopwatch(draw, rc[0], 770, 44, progress, brand)
        return True

    # ---- recap --------------------------------------------------------------------------------
    if visual == "b15-recap":
        recap = [(("NPCs follow", "if/then rules"), coral, "npc"), (("If near, chase.", "Else, patrol."), K.DANGER, "chase"),
                 (("No one hiding", "inside!"), K.BOTH_COLOR, "inside"), (("Game rules are", "algorithms"), sage, "algo")]
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
                if kind == "npc":
                    tiger_head(draw, ix, iy + 20, 0.8, "happy")
                    rule_chip(ix - 150, iy - 170, "IF", coral, 90)
                    rule_chip(ix + 40, iy - 170, "THEN", sage, 120)
                elif kind == "chase":
                    runner(draw, ix - 120, iy - 60, 24)
                    tiger_head(draw, ix + 60, iy - 50, 0.4, "chase", look=-1)
                    K.draw_arrow(draw, ix - 10, iy - 60, ix - 80, iy - 60, K.DANGER, width=8, head=22)
                    tiger_head(draw, ix, iy + 100, 0.4, "happy")
                    K.draw_arrow(draw, ix - 70, iy + 160, ix - 150, iy + 160, K.BOTH_COLOR, width=7, head=20)
                    K.draw_arrow(draw, ix + 70, iy + 160, ix + 150, iy + 160, K.BOTH_COLOR, width=7, head=20)
                elif kind == "inside":
                    sb = tablet(draw, (ix - 150, iy - 120, ix + 150, iy + 110))
                    maze(draw, sb)
                    draw.ellipse((ix - 60, iy - 60, ix + 60, iy + 60), fill=panel)
                    K.draw_person(draw, ix, iy - 20, 0.3, "mystery", t)
                    K.draw_cross(draw, ix + 60, iy + 50, 26, K.DANGER)
                else:
                    paper(draw, (ix - 120, iy - 140, ix + 120, iy + 130), lines=False)
                    for k in range(3):
                        yy = iy - 100 + k * 76
                        K.pill(draw, 0, yy, str(k + 1), col, size=24, left=ix - 96)
                        draw.rounded_rectangle((ix - 30, yy + 14, ix + 90, yy + 34), radius=10, fill=line)
                label_lines(lab, x0 + 200, y0 + 400, size=38)
            return True
        if focus == "done":
            K.text_at(draw, "Chapter 5 done!", cx, 240, font(76, bold=True), ink)
            K.pill(draw, cx, 352, "UNIT 3 COMPLETE", coral, size=38)
            chips = [("see", "See"), ("hear", "Listen"), ("chat", "Chat"), ("face", "Faces"), ("game", "Games")]
            for i, (kind, lab) in enumerate(chips):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 290
                y = 590 + int((1 - a) * 40)
                draw.ellipse((x - 110, y - 110, x + 110, y + 110), fill=sage_soft)
                if kind == "see":
                    draw.chord((x - 70, y - 44, x + 70, y + 44), 0, 360, fill=panel)
                    draw.polygon(ell_poly(x, y, 72, 40, 0), fill=panel)
                    draw.ellipse((x - 30, y - 30, x + 30, y + 30), fill=K.ROAD)
                    draw.ellipse((x - 13, y - 13, x + 13, y + 13), fill=K.DEV_DEEP)
                elif kind == "hear":
                    K.draw_device(draw, "speaker", x - 20, y, 0.5, brand, t=t)
                elif kind == "chat":
                    draw.rounded_rectangle((x - 70, y - 50, x + 70, y + 30), radius=24, fill=K.BOTH_COLOR)
                    draw.polygon([(x - 40, y + 26), (x - 10, y + 26), (x - 50, y + 60)], fill=K.BOTH_COLOR)
                    for k in range(3):
                        draw.ellipse((x - 40 + k * 32 - 9, y - 19, x - 40 + k * 32 + 9, y - 1), fill=panel)
                elif kind == "face":
                    filter_face(x, y + 16, 44, "draw")
                else:
                    gamepad(draw, x, y, 0.75)
                K.text_at(draw, lab, x, y + 124, font(36, bold=True), ink)
                K.draw_check(draw, x + 78, y - 78, 24, sage)
            star_spots([(260, 300), (1660, 300), (200, 820), (1720, 820)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
