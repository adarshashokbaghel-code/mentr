"""A8 · Loops — Doing It Again and Again — visuals."""
import math

import build as K

WHITE = (255, 255, 255)
SKIN_LINE = (206, 150, 116)
GRASS = (132, 196, 118)
GRASS_DARK = (100, 168, 90)
PITCH = (230, 212, 168)
TRACK = (206, 112, 78)
BALL = (196, 40, 52)
NAVY = (40, 60, 120)
GRID = (214, 228, 244)
PEN = (52, 104, 206)
DIRTY = (232, 210, 140)
TROPHY = (240, 176, 40)
SHIRTS = [(255, 106, 26), (13, 148, 136), (123, 97, 214), (72, 118, 214), (255, 186, 60), (220, 90, 120)]


def rot(pts, ox, oy, a):
    c, s_ = math.cos(a), math.sin(a)
    return [(ox + (x - ox) * c - (y - oy) * s_, oy + (x - ox) * s_ + (y - oy) * c) for x, y in pts]


def text_mid(draw, text, x, cy, font, fill, center=False):
    bb = draw.textbbox((0, 0), text, font=font)
    tx = x - (bb[2] - bb[0]) / 2 if center else x
    draw.text((int(tx), int(cy - (bb[1] + bb[3]) / 2)), text, font=font, fill=fill)


# ---- illustrations ------------------------------------------------------------

def loop_arrow(draw, cx, cy, r, col, t=0.0, width=None):
    wd = width or max(4, int(r * 0.24))
    a0 = t * 360
    draw.arc((cx - r, cy - r, cx + r, cy + r), a0 + 40, a0 + 320, fill=col, width=wd)
    ang = math.radians(a0 + 320)
    tx, ty = cx + r * math.cos(ang), cy + r * math.sin(ang)
    dx, dy = -math.sin(ang), math.cos(ang)
    nx, ny = math.cos(ang), math.sin(ang)
    hl = max(8, r * 0.55)
    tip = (tx + dx * hl * 0.9, ty + dy * hl * 0.9)
    draw.polygon([tip, (tx + nx * hl * 0.65, ty + ny * hl * 0.65), (tx - nx * hl * 0.65, ty - ny * hl * 0.65)], fill=col)


def draw_hands(draw, cx, cy, s, gap):
    def S(v):
        return v * s
    for sx in (-1, 1):
        inner = cx + sx * gap
        outer = inner + sx * S(72)
        x0, x1 = min(inner, outer), max(inner, outer)
        draw.rounded_rectangle((x0 - S(4), cy + S(56), x1 + S(4), cy + S(112)), radius=S(14), fill=K.CORAL)
        draw.rounded_rectangle((x0 + S(5), cy - S(84) + S(7), x1 + S(5), cy + S(66) + S(7)), radius=S(32), fill=K.SHADOW)
        draw.rounded_rectangle((x0, cy - S(84), x1, cy + S(66)), radius=S(32), fill=K.SKIN, outline=SKIN_LINE,
                               width=max(1, int(S(3))))
        tx = outer + sx * S(4)
        draw.ellipse((tx - S(16), cy - S(36), tx + S(16), cy + S(14)), fill=K.SKIN, outline=SKIN_LINE,
                     width=max(1, int(S(3))))
        for k in range(3):
            fy = cy - S(60) + k * S(22)
            draw.line((inner + sx * S(14), fy, inner + sx * S(40), fy), fill=SKIN_LINE, width=max(1, int(S(3))))
    if gap < S(12):
        for k in range(5):
            a = -math.pi / 2 + (k - 2) * 0.45
            r0, r1 = S(110), S(160)
            draw.line((cx + math.cos(a) * r0, cy - S(10) + math.sin(a) * r0, cx + math.cos(a) * r1,
                       cy - S(10) + math.sin(a) * r1), fill=K.GOLD, width=max(3, int(S(10))))


def clap_gap(s, t, n):
    phase = (t * n) % 1
    return s * 70 * abs(math.cos(math.pi * phase))


def draw_legs(draw, cx, cy, s, spread=0.0):
    def S(v):
        return v * s
    for sx in (-1, 1):
        lx = cx + sx * (S(34) + S(20) * spread)
        draw.rounded_rectangle((lx - S(20), cy + S(120), lx + S(20), cy + S(220)), radius=S(12), fill=NAVY)
        draw.rounded_rectangle((lx - S(26) + sx * S(6), cy + S(206), lx + S(26) + sx * S(6), cy + S(232)),
                               radius=S(10), fill=K.DEV_DARK)


def draw_kid_full(draw, cx, cy, s, kind="kid", t=0.0, spread=0.0):
    draw_legs(draw, cx, cy, s, spread)
    K.draw_person(draw, cx, cy, s, kind, 0)


def draw_track(draw, cx, cy, rx, ry, t, laps=1.0):
    draw.ellipse((cx - rx + 10, cy - ry + 12, cx + rx + 10, cy + ry + 12), fill=K.SHADOW)
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=TRACK)
    draw.ellipse((cx - rx + 80, cy - ry + 80, cx + rx - 80, cy + ry - 80), fill=GRASS)
    draw.ellipse((cx - rx + 40, cy - ry + 40, cx + rx - 40, cy + ry - 40), outline=WHITE, width=4)
    draw.line((cx, cy + ry - 80, cx, cy + ry), fill=WHITE, width=8)
    a = math.pi / 2 - t * math.tau * laps
    rxm, rym = rx - 40, ry - 40
    hx, hy = cx + math.cos(a) * rxm, cy + math.sin(a) * rym
    for k in range(1, 5):
        aa = a + k * 0.09
        px, py = cx + math.cos(aa) * rxm, cy + math.sin(aa) * rym
        rr = 18 - k * 3
        draw.ellipse((px - rr, py - rr, px + rr, py + rr), fill=(255, 210, 180))
    draw.ellipse((hx - 30, hy - 30, hx + 30, hy + 30), fill=K.CORAL, outline=WHITE, width=5)


def draw_stumps(draw, x, by, s):
    def S(v):
        return v * s
    for k in (-1, 0, 1):
        sx = x + k * S(22)
        draw.rectangle((sx - S(6), by - S(150), sx + S(6), by), fill=(244, 232, 200), outline=K.DEV_DARK)
    draw.rectangle((x - S(32), by - S(162), x + S(32), by - S(150)), fill=(244, 232, 200), outline=K.DEV_DARK)


def draw_ball(draw, x, y, r):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=BALL)
    draw.arc((x - r * 0.7, y - r * 1.2, x + r * 0.7, y + r * 1.2), 300, 60, fill=WHITE, width=max(2, int(r * 0.18)))


def draw_skipper(draw, cx, cy, s, phase):
    def S(v):
        return v * s
    up = S(40) * max(0.0, math.sin(phase * math.tau))
    y = cy - up
    hy = y + S(110)
    p0, p2 = (cx - S(124), hy), (cx + S(124), hy)
    ctrl = (cx, hy + S(460) * math.cos(phase * math.tau))
    behind = math.cos(phase * math.tau) < 0
    if behind:
        K.draw_curve(draw, p0, ctrl, p2, K.BOTH_COLOR, width=max(3, int(S(9))))
    draw_legs(draw, cx, y, s)
    K.draw_person(draw, cx, y, s, "kid", 0)
    for sx in (-1, 1):
        draw.line((cx + sx * S(70), y + S(80), cx + sx * S(124), hy), fill=K.CORAL, width=max(3, int(S(18))))
        draw.ellipse((cx + sx * S(124) - S(16), hy - S(16), cx + sx * S(124) + S(16), hy + S(16)), fill=K.SKIN)
    if not behind:
        K.draw_curve(draw, p0, ctrl, p2, K.BOTH_COLOR, width=max(3, int(S(9))))
    draw.ellipse((cx - S(90), cy + S(236), cx + S(90), cy + S(256)), fill=K.SHADOW)


def draw_brush(draw, x, y, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((x - S(190), y - S(14), x - S(30), y + S(14)), radius=S(14), fill=K.CORAL)
    draw.rounded_rectangle((x - S(50), y - S(16), x + S(50), y + S(14)), radius=S(12), fill=(240, 240, 244),
                           outline=K.DEV_DARK, width=max(1, int(S(3))))
    for k in range(7):
        bx = x - S(40) + k * S(12)
        draw.rectangle((bx, y - S(50), bx + S(7), y - S(16)), fill=(140, 200, 236))


def draw_mouth(draw, cx, cy, s, clean_n, t):
    def S(v):
        return v * s
    draw.chord((cx - S(310), cy - S(170), cx + S(310), cy + S(190)), 0, 180, fill=(206, 82, 92))
    draw.chord((cx - S(276), cy - S(140), cx + S(276), cy + S(156)), 0, 180, fill=(120, 30, 40))
    draw.chord((cx - S(150), cy + S(60), cx + S(150), cy + S(200)), 180, 360, fill=(236, 120, 130))
    xs = [cx - S(245) + k * S(62) for k in range(8)]
    for k, tx in enumerate(xs):
        clean = k < clean_n
        draw.rounded_rectangle((tx, cy, tx + S(54), cy + S(70)), radius=S(12), fill=WHITE if clean else DIRTY)
        if not clean:
            draw.ellipse((tx + S(12), cy + S(30), tx + S(26), cy + S(44)), fill=(176, 140, 70))
        else:
            K.draw_star(draw, tx + S(27), cy - S(34) + S(4) * math.sin(t * 12 + k), S(13), K.GOLD, rot=t * 3 + k)
    if clean_n < 8:
        bx = xs[clean_n] + S(27)
        draw_brush(draw, bx, cy + S(124), 0.8 * s)


def draw_fridge(draw, cx, by, s, open_t=0.0):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(90) + S(8), by - S(300) + S(10), cx + S(90) + S(8), by + S(10)), radius=S(22),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(90), by - S(300), cx + S(90), by), radius=S(22), fill=(236, 244, 250),
                           outline=K.DEV_DARK, width=max(2, int(S(5))))
    if open_t > 0:
        draw.rectangle((cx - S(74), by - S(284), cx + S(74), by - S(16)), fill=(255, 246, 214))
        for k in range(2):
            sy = by - S(190) + k * S(100)
            draw.line((cx - S(74), sy, cx + S(74), sy), fill=K.STEEL_DARK, width=max(2, int(S(5))))
        draw.rounded_rectangle((cx - S(50), by - S(260), cx - S(20), by - S(194)), radius=S(8), fill=K.LEAF)
        draw.rounded_rectangle((cx + S(4), by - S(240), cx + S(44), by - S(194)), radius=S(8), fill=K.CORAL)
        draw.ellipse((cx - S(40), by - S(150), cx + S(10), by - S(100)), fill=(220, 60, 70))
        draw.polygon([(cx - S(90), by - S(300)), (cx - S(170), by - S(270)), (cx - S(170), by - S(30)), (cx - S(90), by)],
                     fill=(226, 236, 246), outline=K.DEV_DARK, width=max(2, int(S(4))))
    else:
        draw.line((cx - S(90), by - S(200), cx + S(90), by - S(200)), fill=K.DEV_DARK, width=max(2, int(S(4))))
        for y0, y1 in ((by - S(270), by - S(220)), (by - S(170), by - S(90))):
            draw.rounded_rectangle((cx + S(54), y0, cx + S(66), y1), radius=S(5), fill=K.STEEL_DARK)


def draw_tv(draw, cx, cy, s, on=True, t=0.0):
    def S(v):
        return v * s
    draw.line((cx, cy + S(80), cx, cy + S(120)), fill=K.DEV_DARK, width=max(3, int(S(14))))
    draw.rounded_rectangle((cx - S(70), cy + S(112), cx + S(70), cy + S(130)), radius=S(8), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(150) + S(8), cy - S(96) + S(10), cx + S(150) + S(8), cy + S(86) + S(10)),
                           radius=S(18), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(150), cy - S(96), cx + S(150), cy + S(86)), radius=S(18), fill=K.DEV_DEEP)
    if on:
        draw.rectangle((cx - S(130), cy - S(78), cx + S(130), cy + S(68)), fill=(120, 196, 236))
        draw.ellipse((cx + S(40), cy - S(60), cx + S(90), cy - S(10)), fill=K.GOLD)
        draw.polygon([(cx - S(130), cy + S(68)), (cx - S(40), cy - S(20)), (cx + S(30), cy + S(40)), (cx + S(70), cy + S(5)),
                      (cx + S(130), cy + S(68))], fill=K.LEAF)


def draw_chai_stir(draw, cx, cy, s, t, melt=0.0, turns=3):
    def S(v):
        return v * s
    K.draw_cup(draw, cx, cy, s, t, steam=True)
    sy = cy - S(62)
    m = K.clamp01(melt)
    if m < 1:
        for k, dx in enumerate((-30, 6, 36)):
            r = S(15) * (1 - m)
            if r > 1:
                ox = cx + S(dx) + S(4) * math.sin(t * 10 + k)
                draw.rounded_rectangle((ox - r, sy - r * 0.8, ox + r, sy + r * 0.8), radius=max(1, r * 0.3), fill=WHITE,
                                       outline=K.DEV_DARK, width=max(1, int(S(2))))
    a = t * math.tau * turns
    px, py = cx + math.cos(a) * S(36), sy + math.sin(a) * S(7)
    draw.line((px, py, px + S(60), py - S(150)), fill=K.STEEL_DARK, width=max(3, int(S(12))))
    draw.ellipse((px - S(16), py - S(8), px + S(16), py + S(8)), fill=K.STEEL)
    for k in range(2):
        draw.arc((cx - S(50) + k * S(14), sy - S(10), cx + S(50) - k * S(14), sy + S(10)), 200 + t * 900 + k * 90,
                 300 + t * 900 + k * 90, fill=(150, 98, 56), width=max(2, int(S(4))))


def draw_folded(draw, x, y, s, col):
    def S(v):
        return v * s
    draw.rounded_rectangle((x - S(90) + S(5), y - S(24) + S(6), x + S(90) + S(5), y + S(24) + S(6)), radius=S(10),
                           fill=K.SHADOW)
    draw.rounded_rectangle((x - S(90), y - S(24), x + S(90), y + S(24)), radius=S(10), fill=col)
    dark = tuple(int(c * 0.78) for c in col)
    draw.polygon([(x - S(26), y - S(24)), (x, y - S(4)), (x + S(26), y - S(24))], fill=dark)


def draw_messy(draw, x, y, s, col, ang):
    def S(v):
        return v * s
    shape = [(-40, -50), (40, -50), (96, -22), (80, 10), (54, 0), (54, 56), (-54, 56), (-54, 0), (-80, 10), (-96, -22)]
    pts = rot([(x + S(px), y + S(py)) for px, py in shape], x, y, ang)
    draw.polygon([(px + S(5), py + S(6)) for px, py in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=col, outline=tuple(int(c * 0.7) for c in col), width=max(1, int(S(3))))


def draw_trophy(draw, cx, cy, s):
    def S(v):
        return v * s
    for sx in (-1, 1):
        draw.arc((cx + sx * S(60) - S(36), cy - S(70), cx + sx * S(60) + S(36), cy), 0, 360, fill=TROPHY,
                 width=max(3, int(S(12))))
    draw.chord((cx - S(70), cy - S(130), cx + S(70), cy + S(30)), 0, 180, fill=TROPHY)
    draw.rectangle((cx - S(70), cy - S(80), cx + S(70), cy - S(48)), fill=TROPHY)
    draw.rectangle((cx - S(14), cy + S(28), cx + S(14), cy + S(70)), fill=TROPHY)
    draw.rounded_rectangle((cx - S(60), cy + S(66), cx + S(60), cy + S(96)), radius=S(8), fill=K.DEV_DARK)
    K.draw_star(draw, cx, cy - S(30), S(22), WHITE)


def bunting(draw, x0, x1, y, t):
    pts = [(x0 + (x1 - x0) * k / 40, y + 30 * math.sin(math.pi * k / 40)) for k in range(41)]
    draw.line(pts, fill=K.DEV_MID, width=4)
    n = 14
    for k in range(n):
        f = (k + 0.5) / n
        px = x0 + (x1 - x0) * f
        py = y + 30 * math.sin(math.pi * f)
        sw = 3 * math.sin(t * 8 + k)
        draw.polygon([(px - 36, py), (px + 36, py), (px + sw, py + 60)], fill=SHIRTS[k % len(SHIRTS)])


def grid_paper(draw, box):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=WHITE)
    gx = x0 + 30
    while gx < x1 - 20:
        draw.line((gx, y0 + 14, gx, y1 - 14), fill=GRID, width=2)
        gx += 48
    gy = y0 + 30
    while gy < y1 - 20:
        draw.line((x0 + 14, gy, x1 - 14, gy), fill=GRID, width=2)
        gy += 48


def square_path(draw, x0, y0, size, p, col=PEN, width=14, pen=True, heading=None):
    corners = [(x0, y0), (x0 + size, y0), (x0 + size, y0 + size), (x0, y0 + size), (x0, y0)]
    p = max(0.0, min(4.0, p))
    done = int(p)
    for k in range(done):
        draw.line((corners[k], corners[k + 1]), fill=col, width=width)
    if done < 4:
        f = p - done
        a, b = corners[done], corners[done + 1]
        cur = (K.lerp(a[0], b[0], f), K.lerp(a[1], b[1], f))
        if f > 0:
            draw.line((a, cur), fill=col, width=width)
    else:
        cur = corners[4]
    for k in range(4):
        cxk, cyk = corners[k]
        draw.ellipse((cxk - 12, cyk - 12, cxk + 12, cyk + 12), fill=col)
    if pen:
        if heading is None:
            heading = 0.0 if done >= 4 else min(done, 3) * math.pi / 2
        hx, hy = cur
        tri = [(hx + 46, hy), (hx - 26, hy - 30), (hx - 26, hy + 30)]
        tri = rot(tri, hx, hy, heading)
        draw.polygon([(px + 4, py + 5) for px, py in tri], fill=K.SHADOW)
        draw.polygon(tri, fill=K.CORAL, outline=K.DEV_DARK, width=3)
        draw.ellipse((hx - 9, hy - 9, hx + 9, hy + 9), fill=WHITE)


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
    F = K.load_font
    palette = [coral, sage, K.BOTH_COLOR, K.GOLD]
    LOOP = K.BOTH_COLOR

    def star_list(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(draw, sx, sy + 8 * math.sin(progress * 9 + i), 20 + 6 * pulse, palette[i % 4],
                        rot=progress * 3 + i)

    def qmarks(pts, size=80):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(int(size + 20 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def piece(box, radius, col):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=radius, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=radius, fill=col)

    def loop_block(x0, y0, wd, header, rows, col=LOOP, hsize=40, rsize=38, active=-1, hh=96, rh=84,
                   dashed_rows=False):
        n = len(rows)
        yb = y0 + hh + n * (rh + 12) + 4
        dark = tuple(int(c * 0.8) for c in col)
        piece((x0, y0 + hh - 30, x0 + 56, yb + 20), 0, col)
        piece((x0, y0, x0 + wd, y0 + hh), 26, col)
        piece((x0, yb, x0 + wd * 0.6, yb + 50), 22, col)
        draw.rectangle((x0, y0 + hh - 30, x0 + 56, yb + 20), fill=col)
        loop_arrow(draw, x0 + 50, y0 + hh / 2, hh * 0.24, WHITE, t)
        text_mid(draw, header, x0 + 94, y0 + hh / 2, F(hsize, bold=True), WHITE)
        for i, lab in enumerate(rows):
            yy = y0 + hh + 8 + i * (rh + 12)
            on = i == active
            if dashed_rows:
                draw.rounded_rectangle((x0 + 74, yy, x0 + wd - 24, yy + rh), radius=20, fill=coral_soft)
                for xa, xb in ((x0 + 94, x0 + wd - 44),):
                    K.draw_dashed(draw, xa, yy, xb, yy, coral, width=4, phase=progress * 100)
                    K.draw_dashed(draw, xa, yy + rh, xb, yy + rh, coral, width=4, phase=progress * 100)
            else:
                draw.rounded_rectangle((x0 + 74, yy, x0 + wd - 24, yy + rh), radius=20, fill=coral_soft if on else panel,
                                       outline=coral if on else dark, width=5 if on else 3)
            text_mid(draw, lab, x0 + 104, yy + rh / 2, F(rsize, bold=True), coral if dashed_rows else ink)
        return yb + 50

    def note(box, title, rows, shown=None, size=40, spacing=96, top=110, active=-1, title_col=None):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=24, fill=(255, 250, 238))
        draw.line((x0 + 76, y0 + 10, x0 + 76, y1 - 10), fill=(240, 170, 170), width=3)
        K.text_at(draw, title, (x0 + x1) / 2, y0 + 26, F(40, bold=True), title_col or coral)
        for i, lab in enumerate(rows):
            yy = y0 + top + i * spacing
            draw.line((x0 + 26, yy + spacing - 12, x1 - 26, yy + spacing - 12), fill=(220, 210, 232), width=2)
            if shown is not None and K.clamp01((shown - i) * 3) <= 0:
                continue
            if i == active:
                draw.rounded_rectangle((x0 + 90, yy - 6, x1 - 24, yy + spacing - 20), radius=16, fill=coral_soft)
            text_mid(draw, lab, x0 + 104, yy + (spacing - 24) / 2, F(size, bold=True), ink)

    def tile(x, y, label, col, size=96, fg=WHITE):
        draw.rounded_rectangle((x - size / 2 + 6, y - size / 2 + 8, x + size / 2 + 6, y + size / 2 + 8), radius=22,
                               fill=K.SHADOW)
        draw.rounded_rectangle((x - size / 2, y - size / 2, x + size / 2, y + size / 2), radius=22, fill=col)
        text_mid(draw, label, x, y, F(int(size * (0.56 if len(label) < 3 else 0.42)), bold=True), fg, center=True)

    def option_card(box, badge, label, state="normal", label_size=36):
        x0, y0, x1, y1 = box
        out = sage if state == "win" else None
        K.shadow_card(draw, box, brand, radius=28, outline=out, outline_w=6 if out else 3)
        if state == "win":
            draw.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=24, fill=sage_soft)
        K.pill(draw, 0, y0 + 20, badge, sage if state == "win" else LOOP, size=28, left=x0 + 20)
        font = F(label_size, bold=True)
        lines = K.wrap_text(label, font, int(x1 - x0 - 40))
        lh = int(label_size * 1.2)
        ty = y1 - 26 - len(lines) * lh
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, (x0 + x1) / 2, ty + j * lh, font, ink if state != "dim" else muted)
        if state == "win":
            K.draw_check(draw, x1 - 44, y0 + 44, 26, sage)

    # ---- opening -------------------------------------------------------------
    if visual == "a8-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 260), 450, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 260, 500, 0.95, t, mood="happy", wave=t)
            K.text_at(draw, "Welcome back, champ!", cx, 740, F(60, bold=True), ink)
            star_list([(cx - 560, 330), (cx + 560, 330), (cx - 640, 520), (cx + 640, 520)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · CHAPTER 2", cx, 300 + lift, F(34, bold=True), sage)
            start = [2, 0, 3, 1]
            m = K.ease_in_out(K.clamp01((progress - 0.1) * 2.2))
            for i in range(4):
                pos = K.lerp(start[i], i, m)
                x = cx - 330 + pos * 220
                y = 470 + lift - 60 * math.sin(math.pi * m) * (1 if i % 2 else -1) * (start[i] != i)
                tile(x, y, str(i + 1), palette[i], 120)
            K.text_at(draw, "Sequencing = the right order", cx, 600 + lift, F(56, bold=True), ink)
            a = K.stagger(progress, 4, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 720 + lift + int((1 - a) * 20), "Socks first, then shoes!", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 580 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 302 + lift, F(32, bold=True), coral)
            K.text_at(draw, "Loops", cx, 352 + lift, F(110, bold=True), ink)
            K.text_at(draw, "Doing it again and again", cx, 494 + lift, F(46, bold=True), muted)
            loop_arrow(draw, cx, 740, 90, LOOP, t * 1.5)
            for k in range(3):
                a = t * math.tau * 1.5 + k * math.tau / 3
                px, py = cx + math.cos(a) * 140, 740 + math.sin(a) * 60
                draw.ellipse((px - 18, py - 18, px + 18, py + 18), fill=palette[k])
            return True
        # hook
        K.text_at(draw, "Again and again…", cx, 236, F(56, bold=True), ink)
        items = [("Brushing", coral_soft, coral), ("Skipping", sage_soft, sage), ("Clapping", gold_soft, K.GOLD)]
        for i, (lab, soft, col) in enumerate(items):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 560
            y = 530 + int((1 - a) * 40)
            draw.ellipse((x - 200 + 8, y - 200 + 10, x + 200 + 8, y + 200 + 10), fill=K.SHADOW)
            draw.ellipse((x - 200, y - 200, x + 200, y + 200), fill=soft, outline=col, width=5)
            if i == 0:
                bx = x + 20 + 40 * math.sin(t * math.tau * 3)
                K.draw_toothbrush(draw, bx - 40, y + 30, 1.2)
            elif i == 1:
                draw_skipper(draw, x, y - 90, 0.62, t * 3)
            else:
                draw_hands(draw, x, y, 1.0, clap_gap(1.0, t, 4))
            loop_arrow(draw, x + 150, y - 150, 34, col, t)
            K.text_at(draw, lab, x, 766, F(44, bold=True), ink)
        return True

    # ---- clapping story ---------------------------------------------------------
    if visual == "a8-hook":
        if focus == "meet":
            bunting(draw, 120, 1800, 236, t)
            K.draw_person(draw, 400, 500, 1.2, "kid", t)
            K.draw_bubble(draw, (580, 350, 1240, 490), brand, "Cheer for our team, Robo!", tail="left", size=42)
            K.draw_robot(draw, 1520, 640, 0.92, t, mood="happy", wave=t)
            K.pill(draw, 900, 610, "Sports Day!", coral, size=40)
            draw_trophy(draw, 900, 790, 0.8)
            return True
        if focus == "long":
            note((160, 250, 900, 860), "Robo's list", ["Clap"] * 5, shown=progress * 7 - 0.2, size=46, spacing=104,
                 top=100)
            for i in range(5):
                if K.clamp01((progress * 7 - 0.2 - i) * 3) > 0:
                    draw_hands(draw, 760, 350 + i * 104 + 30, 0.32, 0)
            K.draw_robot(draw, 1450, 620, 0.98, t, mood="idle")
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, 1090, 520 + int((1 - a) * 20), "5 lines!", coral, size=38)
            return True
        if focus == "more":
            x0, y0, x1 = 200, 240, 880
            draw.rectangle((x0 + 10, y0 + 12, x1 + 10, 870), fill=K.SHADOW)
            draw.rectangle((x0, y0, x1, 860), fill=(255, 250, 238))
            n_rows = min(13, int(progress * 18) + 2)
            for r in range(n_rows):
                yy = y0 + 30 + r * 46
                if yy > 820:
                    break
                draw.text((x0 + 40, yy), "clap  clap  clap  clap  clap", fill=muted, font=F(30, bold=True))
            for k in range(12):
                zx = x0 + k * (x1 - x0) / 12
                draw.polygon([(zx, 860), (zx + (x1 - x0) / 24, 846), (zx + (x1 - x0) / 12, 860)],
                             fill=K.hex_rgb(brand["bg"]))
            K.text_at(draw, "100 times?!", 1360, 250, F(96, bold=True), coral)
            K.draw_person(draw, 1360, 540, 1.1, "kid", t)
            draw.ellipse((1450, 440, 1480, 480), fill=K.WATER)
            draw.polygon([(1450, 462), (1480, 462), (1465, 420)], fill=K.WATER)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.text_at(draw, "Oh no! So tiring!", 1360, 760 + int((1 - a) * 20), F(52, bold=True), K.DANGER)
            return True
        if focus == "think":
            for i in range(5):
                y = 300 + i * 96
                draw.rounded_rectangle((220, y, 520, y + 72), radius=22, fill=panel, outline=line, width=3)
                text_mid(draw, "clap", 370, y + 36, F(40, bold=True), ink, center=True)
            K.draw_arrow(draw, 580, 530, 760, 530, muted, width=12, head=34)
            bx0, by0, bx1, by1 = 800, 400, 1160, 660
            draw.rounded_rectangle((bx0, by0, bx1, by1), radius=28, fill=coral_soft)
            for xa, ya, xb, yb in ((bx0 + 30, by0, bx1 - 30, by0), (bx0 + 30, by1, bx1 - 30, by1),
                                   (bx0, by0 + 30, bx0, by1 - 30), (bx1, by0 + 30, bx1, by1 - 30)):
                K.draw_dashed(draw, xa, ya, xb, yb, coral, width=5, phase=progress * 120)
            K.text_at(draw, "?", (bx0 + bx1) / 2, by0 + 40, F(int(140 + 20 * pulse), bold=True), coral)
            draw.ellipse((1520 - 230, 600 - 230, 1520 + 230, 600 + 230), fill=lav_soft)
            K.draw_robot(draw, 1520, 640, 0.85, t, mood="confused")
            K.draw_stopwatch(draw, 980, 790, 44, progress, brand)
            K.text_at(draw, "A shorter way?", 980, 270, F(52, bold=True), ink)
            return True
        # short
        loop_block(160, 290, 780, "repeat 5 times", ["clap"], hsize=46, rsize=44)
        n = min(5, int(progress * 6.2))
        for i in range(5):
            x = 260 + i * 140
            lit = i < n
            draw.ellipse((x - 50, 640, x + 50, 740), fill=coral if lit else panel, outline=coral if lit else line,
                         width=4)
            text_mid(draw, str(i + 1), x, 690, F(46, bold=True), WHITE if lit else muted, center=True)
        draw_hands(draw, 1130, 450, 1.0, clap_gap(1.0, t, 5.2))
        K.draw_robot(draw, 1530, 640, 0.9, t, mood="happy")
        a = K.stagger(progress, 6, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 540, 790 + int((1 - a) * 16), "Same claps, much shorter!", sage, size=36)
        return True

    # ---- definition -----------------------------------------------------------------
    if visual == "a8-define":
        if focus == "name":
            draw.rounded_rectangle((150, 290, 760, 800), radius=30, fill=(255, 250, 238), outline=line, width=4)
            for i in range(5):
                a = 1 - K.ease_in_out(K.clamp01((progress - 0.1) * 2.5))
                if a <= 0:
                    break
                y = 330 + i * 86
                draw.rounded_rectangle((260, y, 650, y + 66), radius=20, fill=panel, outline=line, width=3)
                text_mid(draw, "clap", 455, y + 33, F(36, bold=True), muted, center=True)
            b = K.ease_out_cubic(K.clamp01((progress - 0.35) * 3))
            if b > 0:
                loop_block(190, 420 + int((1 - b) * 30), 530, "repeat 5 times", ["clap"], hsize=36, rsize=36, hh=84,
                           rh=76)
            a2 = K.ease_out_cubic(K.clamp01((progress - 0.35) * 2.5))
            if a2 > 0:
                K.draw_arrow(draw, 800, 550, 800 + 170 * a2, 550, coral, width=14, head=40)
            c = K.ease_out_cubic(K.clamp01((progress - 0.5) * 2.5))
            if c > 0:
                s = 0.8 + 0.2 * c
                mx, my = 1410, 550
                hw, hh = 400 * s, 170 * s
                K.shadow_card(draw, (mx - hw, my - hh, mx + hw, my + hh), brand, radius=40, outline=LOOP, outline_w=6)
                K.text_at(draw, "It's called a", mx, my - 110 * s, F(int(42 * s), bold=True), muted)
                K.text_at(draw, "LOOP", mx, my - 40 * s, F(int(110 * s), bold=True), LOOP)
                loop_arrow(draw, mx - 260 * s, my + 30 * s, 44 * s, coral, t)
                loop_arrow(draw, mx + 260 * s, my + 30 * s, 44 * s, sage, -t)
            return True
        if focus == "meaning":
            K.shadow_card(draw, (200, 250 + lift, w - 200, 850 + lift), brand, radius=40, accent=LOOP)
            K.text_at(draw, "A loop is…", cx, 330 + lift, F(46, bold=True), muted)
            parts = [("an instruction to do", coral), ("the same steps", LOOP), ("again and again!", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                y = 410 + i * 106 + int((1 - a) * 30)
                K.text_at(draw, txt, cx, y, F(72, bold=True), col)
            loop_arrow(draw, cx, 770 + lift, 40, LOOP, t)
            return True
        if focus == "block":
            x0, wd = cx - 470, 820
            bottom = loop_block(x0, 280, wd, "repeat 5 times", ["clap"], hsize=56, rsize=52, hh=110, rh=100,
                                active=0)
            draw_hands(draw, x0 + wd - 150, 280 + 110 + 8 + 50, 0.42, clap_gap(0.42, t, 5.2))
            ry0, ry1 = 280 + 110 + 58, 280 + 55
            K.draw_curve(draw, (x0 + wd + 4, ry0), (x0 + wd + 170, (ry0 + ry1) / 2), (x0 + wd + 4, ry1), coral, width=10)
            draw.polygon([(x0 + wd - 4, ry1), (x0 + wd + 34, ry1 - 22), (x0 + wd + 34, ry1 + 22)], fill=coral)
            K.text_at(draw, "again!", x0 + wd + 210, (ry0 + ry1) / 2 - 24, F(40, bold=True), coral)
            n = min(5, int(progress * 6.2))
            for i in range(5):
                x = cx - 400 + i * 200
                lit = i < n
                tile(x, bottom + 150, str(i + 1), coral if lit else K.hex_rgb("#D9D3C8"), 120)
            return True
        # track
        draw_track(draw, 760, 560, 540, 270, t, laps=2.0)
        lap = min(2, int(t * 2.0) + 1)
        K.text_at(draw, f"Lap {lap}", 1580, 300, F(80, bold=True), ink)
        loop_arrow(draw, 1580, 560, 110, LOOP, t * 2)
        K.text_at(draw, "Round and round!", 1580, 740, F(44, bold=True), coral)
        return True

    # ---- why loops help --------------------------------------------------------------
    if visual == "a8-why":
        if focus == "intro":
            K.text_at(draw, "Why are loops helpful?", cx, 230, F(56, bold=True), ink)
            K.text_at(draw, "Without a loop", 530, 322, F(38, bold=True), muted)
            draw.rectangle((310, 380, 760, 860), fill=K.SHADOW)
            draw.rectangle((300, 370, 750, 850), fill=(255, 250, 238))
            for r in range(10):
                draw.rounded_rectangle((340, 400 + r * 44, 700 - (r % 3) * 30, 420 + r * 44), radius=10, fill=line)
            a = K.stagger(progress, 1, step=0.2, speed=4)
            if a > 0:
                K.text_at(draw, "With a loop", 1390, 420, F(38, bold=True), muted)
                loop_block(1110, 480 + int((1 - a) * 30), 560, "repeat 10 times", ["jump"], hsize=36, rsize=36,
                           hh=84, rh=76)
            K.text_at(draw, "VS", cx, 560, F(int(70 + 10 * pulse), bold=True), coral)
            return True
        if focus == "compare":
            note((140, 250, 800, 870), "Without a loop", [f"{i + 1}.  jump" for i in range(10)],
                 shown=progress * 14, size=30, spacing=54, top=86)
            K.text_at(draw, "With a loop", 1380, 270, F(44, bold=True), LOOP)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                loop_block(1000, 350 + int((1 - a) * 30), 760, "repeat 10 times", ["jump"], hsize=44, rsize=44)
            b = K.stagger(progress, 5, step=0.12, speed=4)
            if b > 0:
                K.pill(draw, 1380, 720 + int((1 - b) * 20), "10 lines → just 1 loop!", sage, size=44)
            return True
        # save
        specs = [("Short", coral, coral_soft), ("Saves time", LOOP, lav_soft), ("Fewer mistakes", sage, sage_soft)]
        for i, (lab, col, soft) in enumerate(specs):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 540
            y = 270 + int((1 - a) * 50)
            draw.rounded_rectangle((x - 240, y, x + 240, y + 560), radius=44, fill=soft, outline=col, width=5)
            iy = y + 210
            if i == 0:
                draw.rounded_rectangle((x - 150, iy - 70, x + 150, iy - 30), radius=20, fill=line)
                draw.rounded_rectangle((x - 150, iy + 10, x - 30, iy + 50), radius=20, fill=col)
                text_mid(draw, "10 → 100? Easy!", x, iy + 120, F(32, bold=True), col, center=True)
            elif i == 1:
                K.draw_stopwatch(draw, x, iy + 10, 90, progress, brand)
            else:
                for k in range(3):
                    yy = iy - 70 + k * 64
                    K.draw_check(draw, x - 100, yy, 24, col)
                    draw.rounded_rectangle((x - 60, yy - 12, x + 130, yy + 12), radius=12, fill=line)
            K.text_at(draw, lab, x, y + 430, F(52, bold=True), col)
        return True

    # ---- fixed number of times -----------------------------------------------------
    if visual == "a8-count":
        if focus == "intro":
            K.pill(draw, cx, 236, "KIND 1", LOOP, size=34)
            K.text_at(draw, "Repeat a fixed number of times", cx, 320 + lift, F(60, bold=True), ink)
            n = min(6, int(progress * 7.5))
            for i in range(6):
                x = cx - 375 + i * 150
                tile(x, 520, str(i + 1), coral if i < n else K.hex_rgb("#D9D3C8"), 116)
            draw.rounded_rectangle((cx - 260, 650, cx + 260, 780), radius=40, fill=panel, outline=LOOP, width=5)
            for sx, sym in ((-1, "−"), (1, "+")):
                bx = cx + sx * 190
                draw.ellipse((bx - 44, 671, bx + 44, 759), fill=lav_soft)
                text_mid(draw, sym, bx, 713, F(64, bold=True), LOOP, center=True)
            text_mid(draw, "6 times", cx, 715, F(54, bold=True), ink, center=True)
            K.text_at(draw, "You pick the number!", cx, 808, F(36, bold=True), muted)
            return True
        if focus == "cricket":
            loop_block(110, 300, 800, "repeat 6 times", ["bowl one ball"], hsize=44, rsize=42)
            K.text_at(draw, "One over = 6 balls", 510, 640, F(48, bold=True), ink)
            draw.ellipse((980, 300, 1820, 870), fill=GRASS)
            draw.ellipse((1030, 340, 1770, 830), outline=GRASS_DARK, width=4)
            draw.rectangle((1100, 560, 1720, 660), fill=PITCH)
            draw_stumps(draw, 1670, 630, 0.75)
            draw_legs(draw, 1180, 430, 0.8)
            K.draw_person(draw, 1180, 430, 0.8, "dad", 0)
            balls = min(6, progress * 6.6)
            phase = balls % 1 if balls < 6 else 1.0
            bxp = K.lerp(1240, 1650, phase)
            if phase < 0.6:
                byp = K.lerp(470, 610, phase / 0.6)
            else:
                byp = 610 - 60 * math.sin(math.pi * (phase - 0.6) / 0.4)
            draw_ball(draw, bxp, byp, 16)
            K.text_at(draw, "Over", 1080, 238, F(36, bold=True), muted)
            for i in range(6):
                x = 1200 + i * 90
                done = i < int(balls)
                draw.ellipse((x - 28, 240, x + 28, 296), fill=BALL if done else panel, outline=BALL, width=4)
                if done:
                    text_mid(draw, str(i + 1), x, 268, F(30, bold=True), WHITE, center=True)
            return True
        if focus == "rope":
            draw.ellipse((600 - 270, 560 - 270, 600 + 270, 560 + 270), fill=sage_soft)
            draw_skipper(draw, 600, 450, 1.05, t * 6)
            n = min(20, int(progress * 24) + 1)
            big, small = F(150, bold=True), F(64, bold=True)
            nb = draw.textbbox((0, 0), str(n), font=big)
            sb = draw.textbbox((0, 0), " / 20", font=small)
            nx = 1390 - (nb[2] - nb[0] + sb[2] - sb[0]) / 2
            draw.text((nx, 250), str(n), font=big, fill=coral)
            draw.text((nx + nb[2] - nb[0] + 8, 322), " / 20", font=small, fill=muted)
            loop_block(1010, 560, 760, "repeat 20 times", ["skip"], hsize=44, rsize=44)
            return True
        # choose
        for i, (num, col, soft) in enumerate((("2", coral, coral_soft), ("5", LOOP, lav_soft), ("20", sage, sage_soft))):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 520
            y = 270 + int((1 - a) * 40)
            draw.rounded_rectangle((x - 210, y, x + 210, y + 400), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, "repeat", x, y + 30, F(40, bold=True), muted)
            K.text_at(draw, num, x, y + 90, F(140, bold=True), col)
            K.text_at(draw, "times", x, y + 270, F(40, bold=True), muted)
            loop_arrow(draw, x + 150, y + 60, 26, col, t)
            K.draw_check(draw, x - 150, y + 350, 26, col)
        b = K.stagger(progress, 4, step=0.12, speed=4)
        if b > 0:
            box = K.pill(draw, cx, 720 + int((1 - b) * 20), "Always 10?  No way!", K.DANGER, size=40)
            K.draw_cross(draw, box[2] + 50, (box[1] + box[3]) / 2, 30, K.DANGER)
        return True

    # ---- repeat until ---------------------------------------------------------------
    if visual == "a8-until":
        if focus == "intro":
            K.pill(draw, cx, 236, "KIND 2", LOOP, size=34)
            K.text_at(draw, "Repeat UNTIL it's done", cx, 320 + lift, F(66, bold=True), ink)
            fill = K.clamp01(progress * 1.4)
            x0, x1 = cx - 520, cx + 420
            draw.rounded_rectangle((x0, 520, x1, 600), radius=40, fill=panel, outline=line, width=4)
            if fill > 0.02:
                draw.rounded_rectangle((x0 + 8, 528, x0 + 8 + (x1 - x0 - 16) * fill, 592), radius=32, fill=LOOP)
            loop_arrow(draw, x0 - 80, 560, 40, LOOP, t * 2)
            if fill >= 1:
                K.draw_stop_sign(draw, x1 + 110, 560, 70)
                K.pill(draw, cx, 680, "Done? Then the loop stops!", sage, size=40)
            else:
                draw.line((x1 + 60, 640, x1 + 60, 470), fill=ink, width=6)
                draw.polygon([(x1 + 60, 470), (x1 + 140, 496), (x1 + 60, 522)], fill=sage)
                K.text_at(draw, "Keep going…", cx, 680, F(44, bold=True), muted)
            return True
        if focus == "chai":
            draw.ellipse((560 - 280, 600 - 280, 560 + 280, 600 + 280), fill=gold_soft)
            melt = K.clamp01(progress * 1.3)
            draw_chai_stir(draw, 540, 640, 1.8, t, melt)
            loop_block(980, 290, 820, "repeat until sugar melts", ["stir"], hsize=40, rsize=44)
            K.text_at(draw, "Sugar melted", 1110, 600, F(36, bold=True), muted)
            draw.rounded_rectangle((1000, 650, 1700, 700), radius=25, fill=panel, outline=line, width=3)
            if melt > 0.02:
                draw.rounded_rectangle((1006, 656, 1006 + 688 * melt, 694), radius=19, fill=K.GOLD)
            if melt >= 1:
                K.pill(draw, 1350, 760, "Melted! Stop stirring.", sage, size=38)
            return True
        if focus == "teeth":
            clean = min(8, int(progress * 9.5))
            draw_mouth(draw, 600, 470, 1.0, clean, t)
            loop_block(1040, 290, 780, "repeat until all clean", ["brush one tooth"], hsize=40, rsize=42)
            K.text_at(draw, f"Clean teeth: {clean} of 8", 1430, 610, F(44, bold=True), ink)
            if clean >= 8:
                K.pill(draw, 1430, 720, "All clean! Loop stops.", sage, size=38)
            return True
        # stop
        folded = min(6, int(progress * 7.5))
        for k in range(6 - folded):
            draw_messy(draw, 400 + (k % 2) * 40 - 20, 760 - k * 52, 1.0, SHIRTS[(k + folded) % 6], 0.25 * ((k % 3) - 1))
        for k in range(folded):
            draw_folded(draw, 860, 790 - k * 52, 1.0, SHIRTS[k % 6])
        K.text_at(draw, "Pile", 400, 280, F(40, bold=True), muted)
        K.text_at(draw, "Folded", 860, 280, F(40, bold=True), muted)
        K.draw_arrow(draw, 560, 560, 700, 560, muted, width=10, head=28)
        loop_block(1080, 270, 720, "repeat until pile is done", ["fold one shirt"], hsize=36, rsize=40)
        if folded >= 6:
            K.draw_stop_sign(draw, 1440, 650, 80)
            K.pill(draw, 1440, 770, "Job done, loop stops!", sage, size=36)
        else:
            K.text_at(draw, f"{6 - folded} left…", 1440, 640, F(48, bold=True), coral)
        return True

    # ---- which is a loop? -----------------------------------------------------------
    if visual == "a8-home":
        cw, gap = 500, 60
        x_start = cx - (3 * cw + 2 * gap) / 2
        labels = [("A", "Open the fridge once"), ("B", "Switch on the TV once"), ("C", "Stir chai until the sugar melts")]
        ans = focus == "answer"
        for i, (badge, lab) in enumerate(labels):
            x0 = x_start + i * (cw + gap)
            box = (x0, 260, x0 + cw, 760)
            state = ("win" if i == 2 else "dim") if ans else "normal"
            option_card(box, badge, lab, state, label_size=36)
            mx, my = x0 + cw / 2, 470
            if i == 0:
                draw_fridge(draw, mx, my + 140, 0.85, open_t=1.0)
            elif i == 1:
                draw_tv(draw, mx, my - 10, 0.95, on=True, t=t)
            else:
                draw_chai_stir(draw, mx, my + 40, 1.2, t, melt=0.0)
            if ans and i < 2:
                K.pill(draw, x0 + cw - 190, 280, "Just once", muted, size=26)
            if ans and i == 2:
                loop_arrow(draw, x0 + cw - 70, 380, 34, LOOP, t)
        if not ans:
            K.draw_stopwatch(draw, cx, 820, 40, progress, brand)
        else:
            K.pill(draw, cx, 790, "Again and again until done = a loop!", sage, size=36)
        return True

    # ---- five jumps -----------------------------------------------------------------
    if visual == "a8-jump":
        ans = focus == "answer"
        opts = [("A", "Repeat 3 times: jump"), ("B", "Repeat 5 times: jump"), ("C", "Repeat 10 times: jump")]
        if not ans:
            note((140, 250, 760, 860), "Robo's list", ["jump"] * 5, size=46, spacing=104, top=100)
            K.draw_stopwatch(draw, 1320, 800, 40, progress, brand)
        else:
            n = min(5, int(progress * 6.5) + 1)
            phase = (progress * 6.5) % 1
            up = 70 * math.sin(math.pi * phase) if progress * 6.5 < 5.2 else 0
            draw.ellipse((450 - 250, 540 - 250, 450 + 250, 540 + 250), fill=sage_soft)
            draw.ellipse((450 - 90, 700, 450 + 90, 724), fill=K.SHADOW)
            draw_kid_full(draw, 450, 440 - up, 1.05, "kid", t, spread=0.6 if up > 30 else 0.0)
            K.text_at(draw, f"Jump {n} of 5", 450, 780, F(48, bold=True), coral)
        for i, (badge, lab) in enumerate(opts):
            y = 290 + i * 160
            win = ans and i == 1
            dim = ans and i != 1
            K.shadow_card(draw, (880, y, 1780, y + 128), brand, radius=30, outline=sage if win else None,
                          outline_w=6 if win else 3)
            if win:
                draw.rounded_rectangle((886, y + 6, 1774, y + 122), radius=26, fill=sage_soft)
            K.pill(draw, 0, y + 36, badge, sage if win else LOOP, size=30, left=910)
            text_mid(draw, lab, 1010, y + 64, F(46, bold=True), muted if dim else ink)
            if win:
                K.draw_check(draw, 1720, y + 64, 28, sage)
        return True

    # ---- square -------------------------------------------------------------------
    if visual == "a8-square":
        long_rows = []
        for k in range(4):
            long_rows += [f"{2 * k + 1}.  Draw a side", f"{2 * k + 2}.  Turn"]
        if focus == "intro":
            grid_paper(draw, (180, 250, 900, 860))
            sz = 420
            sx0, sy0 = 330, 340
            a = K.clamp01(progress * 1.4)
            square_path(draw, sx0, sy0, sz, 4 * a, pen=a < 1)
            mids = [(sx0 + sz / 2, sy0 - 40), (sx0 + sz + 40, sy0 + sz / 2), (sx0 + sz / 2, sy0 + sz + 40),
                    (sx0 - 40, sy0 + sz / 2)]
            if a >= 1:
                for k, (mx, my) in enumerate(mids):
                    draw.ellipse((mx - 26, my - 26, mx + 26, my + 26), fill=coral)
                    text_mid(draw, str(k + 1), mx, my, F(32, bold=True), WHITE, center=True)
            K.text_at(draw, "4 sides", 1360, 330 + lift, F(84, bold=True), coral)
            K.text_at(draw, "4 corners", 1360, 450 + lift, F(84, bold=True), PEN)
            K.draw_robot(draw, 1360, 720, 0.42, t, mood="happy")
            return True
        if focus == "long":
            cur = min(7, int(progress * 8.8))
            note((130, 250, 760, 870), "Without a loop", long_rows, size=36, spacing=68, top=84, active=cur)
            grid_paper(draw, (880, 250, 1780, 860))
            frac = K.clamp01(progress * 8.8 - cur)
            k = cur // 2
            if cur % 2 == 0:
                p, heading = k + frac, k * math.pi / 2
            else:
                p, heading = k + 1, (k + frac) * math.pi / 2
            square_path(draw, 1120, 300, 420, min(4.0, p), heading=heading)
            K.pill(draw, 1330, 790, "8 lines!", coral, size=36)
            return True
        # spot
        note((130, 250, 760, 870), "Without a loop", long_rows, size=36, spacing=68, top=84)
        for k in range(4):
            y0 = 250 + 84 + k * 136 - 4
            col = [coral, LOOP, sage, K.GOLD][k]
            a = K.stagger(progress, k, step=0.12, speed=4)
            if a <= 0:
                continue
            draw.line((720, y0, 744, y0, 744, y0 + 116, 720, y0 + 116), fill=col, width=7)
            draw.rounded_rectangle((96, y0 + 2, 116, y0 + 114), radius=8, fill=col)
        grid_paper(draw, (880, 250, 1780, 860))
        square_path(draw, 1120, 300, 420, 4.0, pen=False)
        b = K.stagger(progress, 4, step=0.12, speed=4)
        if b > 0:
            K.text_at(draw, "× 4", 1330, 430 + int((1 - b) * 20), F(int(130 + 10 * pulse), bold=True), coral)
            K.pill(draw, 1330, 790, "Same 2 steps, 4 times!", LOOP, size=36)
        return True

    # ---- checkpoint -----------------------------------------------------------------
    if visual == "a8-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 700 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, F(40, bold=True), sage)
            K.text_at(draw, "Just like the quiz!", cx, 470 + lift, F(64, bold=True), ink)
            K.draw_check(draw, cx, 620 + lift, 44, sage)
            return True
        if focus == "ask":
            loop_block(140, 300, 760, "repeat ? times", ["?"], hsize=48, rsize=48, dashed_rows=True)
            K.pill(draw, 520, 640, "Pause & try on paper!", coral, size=36)
            K.draw_stopwatch(draw, 520, 790, 44, progress, brand)
            grid_paper(draw, (1000, 250, 1780, 860))
            x0, y0, sz = 1180, 340, 420
            for xa, ya, xb, yb in ((x0, y0, x0 + sz, y0), (x0 + sz, y0, x0 + sz, y0 + sz),
                                   (x0 + sz, y0 + sz, x0, y0 + sz), (x0, y0 + sz, x0, y0)):
                K.draw_dashed(draw, xa, ya, xb, yb, K.STEEL_DARK, width=6, phase=progress * 80)
            K.text_at(draw, "?", x0 + sz / 2, y0 + sz / 2 - 70, F(int(120 + 20 * pulse), bold=True), K.GOLD)
            return True
        p = K.clamp01((progress - 0.15) * 1.4) * 4
        side = min(3, int(p))
        sub = p - int(p)
        active = 0 if sub < 0.75 else 1
        loop_block(120, 300, 800, "repeat 4 times", ["draw one side", "turn at the corner"], hsize=48, rsize=42,
                   active=-1 if p >= 4 else active)
        grid_paper(draw, (1000, 250, 1780, 860))
        square_path(draw, 1180, 340, 420, p, pen=p < 4)
        done_n = 4 if p >= 4 else side + 1
        K.text_at(draw, f"Side {done_n} of 4", 520, 680, F(52, bold=True), coral)
        if p >= 4:
            K.pill(draw, 520, 780, "One perfect square!", sage, size=38)
            star_list([(1080, 300), (1700, 800)])
        return True

    # ---- recap ---------------------------------------------------------------------
    if visual == "a8-recap":
        recap = [("Loop = do it again", LOOP, "loop"), ("Repeat N times, or until done", K.GOLD, "kinds"),
                 ("Short, and saves time", coral, "short"), ("Square: repeat 4 times", sage, "square")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 222, F(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "loop":
                    loop_arrow(draw, ix, iy, 90, col, t)
                elif kind == "kinds":
                    tile(ix - 80, iy, "5×", coral, 110)
                    draw.line((ix + 60, iy + 60, ix + 60, iy - 70), fill=ink, width=6)
                    draw.polygon([(ix + 60, iy - 70), (ix + 140, iy - 44), (ix + 60, iy - 18)], fill=sage)
                elif kind == "short":
                    draw.rounded_rectangle((ix - 140, iy - 80, ix + 140, iy - 44), radius=18, fill=line)
                    draw.rounded_rectangle((ix - 140, iy - 10, ix - 30, iy + 26), radius=18, fill=col)
                    K.draw_stopwatch(draw, ix + 80, iy + 50, 46, progress, brand)
                else:
                    square_path(draw, ix - 90, iy - 90, 180, 4.0, col=col, width=10, pen=False)
                font = F(36, bold=True)
                lines = K.wrap_text(lab, font, 340)
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 44, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 300, 480, 0.85, t, mood="happy", wave=t)
            K.text_at(draw, "Chapter 3 done!", cx, 692, F(68, bold=True), ink)
            K.pill(draw, cx, 788, "Loops: do it again!", LOOP, size=36)
            star_list([(cx - 620, 330), (cx + 620, 330), (cx - 700, 560), (cx + 700, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
