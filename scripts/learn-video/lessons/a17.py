"""A17 · How Apps We Use Actually Work — visuals."""
import math

import build as K

SAND = (226, 184, 132)
SAND_DARK = (190, 142, 96)
MAP_BG = (228, 241, 222)
PARK = (190, 224, 176)
MANGO = (255, 190, 60)
MANGO_DEEP = (250, 146, 48)
SHAKE = (255, 204, 96)
GRASS = (120, 186, 104)
WOOD = (214, 170, 120)
WOOD_DARK = (180, 132, 88)
ROUTE = (52, 120, 230)
ROAD_GREY = (214, 218, 228)
SKY = (196, 226, 246)


def S_(s):
    return lambda v: v * s


def partial(pts, frac):
    segs = [math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]
    target = sum(segs) * K.clamp01(frac)
    out = [pts[0]]
    acc = 0.0
    for i, sl in enumerate(segs):
        if acc + sl >= target:
            r = (target - acc) / sl if sl else 0.0
            out.append((K.lerp(pts[i][0], pts[i + 1][0], r), K.lerp(pts[i][1], pts[i + 1][1], r)))
            return out
        out.append(pts[i + 1])
        acc += sl
    return out


def phone(draw, cx, cy, s, screen=(246, 248, 250)):
    S = S_(s)
    W, H = S(150), S(290)
    draw.rounded_rectangle((cx - W + S(10), cy - H + S(12), cx + W + S(10), cy + H + S(12)), radius=S(40), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(40), fill=K.DEV_DARK)
    box = (cx - W + S(14), cy - H + S(46), cx + W - S(14), cy + H - S(40))
    draw.rectangle(box, fill=screen)
    draw.rounded_rectangle((cx - S(34), cy - H + S(18), cx + S(34), cy - H + S(30)), radius=S(6), fill=K.DEV_DEEP)
    draw.rounded_rectangle((cx - S(46), cy + H - S(24), cx + S(46), cy + H - S(16)), radius=S(4), fill=K.DEV_MID)
    return box


def tablet(draw, cx, cy, s, screen=(246, 248, 250)):
    S = S_(s)
    W, H = S(300), S(190)
    draw.rounded_rectangle((cx - W + S(10), cy - H + S(12), cx + W + S(10), cy + H + S(12)), radius=S(34), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(34), fill=K.DEV_DARK)
    box = (cx - W + S(22), cy - H + S(22), cx + W - S(22), cy + H - S(22))
    draw.rectangle(box, fill=screen)
    return box


MAP_ROUTE = [(0.22, 0.92), (0.22, 0.8), (0.52, 0.8), (0.52, 0.55), (0.8, 0.55), (0.8, 0.3)]
MAP_ALTS = [
    [(0.22, 0.8), (0.22, 0.3), (0.8, 0.3)],
    [(0.22, 0.8), (0.8, 0.8), (0.8, 0.55)],
    [(0.52, 0.8), (0.52, 0.3), (0.8, 0.3)],
]


def map_view(draw, box, t, coral, route=1.0, alts=False, pin=True, car=None, faint=False):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0

    def P(fx, fy):
        return (x0 + bw * fx, y0 + bh * fy)

    draw.rectangle(box, fill=MAP_BG)
    draw.ellipse((*P(0.3, 0.14), *P(0.7, 0.24)), fill=PARK)
    draw.ellipse((*P(0.6, 0.64), *P(0.96, 0.74)), fill=PARK)
    rw = max(4, int(bw * 0.05))
    K.draw_curve(draw, P(0.0, 0.66), P(0.5, 0.58), P(1.0, 0.7), K.WATER, width=max(4, int(bw * 0.04)))
    for fx in (0.22, 0.52, 0.8):
        draw.line((*P(fx, 0.0), *P(fx, 1.0)), fill=(255, 255, 255), width=rw)
    for fy in (0.3, 0.55, 0.8):
        draw.line((*P(0.0, fy), *P(1.0, fy)), fill=(255, 255, 255), width=rw)
    if faint:
        return
    if alts:
        hot = int(t * 7) % len(MAP_ALTS)
        for k, path in enumerate(MAP_ALTS):
            pts = [P(*p) for p in path]
            col = K.GOLD if k == hot else (236, 214, 150)
            for a, b in zip(pts, pts[1:]):
                K.draw_dashed(draw, a[0], a[1], b[0], b[1], col, width=max(3, int(rw * 0.8)), dash=14, gap=10,
                              phase=t * 120)
    pts = [P(*p) for p in MAP_ROUTE]
    if route > 0:
        draw.line(partial(pts, route), fill=ROUTE, width=int(rw * 1.4), joint="curve")
    hx, hy = pts[0]
    r = bw * 0.05
    draw.ellipse((hx - r, hy - r, hx + r, hy + r), fill=(255, 255, 255))
    draw.ellipse((hx - r * 0.6, hy - r * 0.6, hx + r * 0.6, hy + r * 0.6), fill=ROUTE)
    if pin:
        gx, gy = pts[-1]
        K.draw_map_pin(draw, gx, gy, bw / 600, coral)
    if car is not None:
        cx_, cy_ = partial(pts, car)[-1]
        r = bw * 0.06
        draw.ellipse((cx_ - r, cy_ - r, cx_ + r, cy_ + r), fill=(255, 255, 255))
        draw.polygon([(cx_, cy_ - r * 0.7), (cx_ + r * 0.55, cy_ + r * 0.55), (cx_, cy_ + r * 0.2),
                      (cx_ - r * 0.55, cy_ + r * 0.55)], fill=ROUTE)


def search_bar(draw, box, text, typed, t, ink, coral):
    x0, y0, x1, _ = box
    bw = x1 - x0
    h = bw * 0.2
    bar = (x0 + bw * 0.05, y0 + bw * 0.05, x1 - bw * 0.05, y0 + bw * 0.05 + h)
    draw.rounded_rectangle((bar[0] + 3, bar[1] + 5, bar[2] + 3, bar[3] + 5), radius=h / 2, fill=K.SHADOW)
    draw.rounded_rectangle(bar, radius=h / 2, fill=(255, 255, 255), outline=(210, 204, 196), width=2)
    mx, my = bar[0] + h * 0.5, (bar[1] + bar[3]) / 2
    r = h * 0.18
    lw = max(2, int(h * 0.07))
    draw.ellipse((mx - r, my - r - 2, mx + r, my + r - 2), outline=K.DEV_MID, width=lw)
    draw.line((mx + r * 0.7, my + r * 0.5, mx + r * 1.5, my + r * 1.3), fill=K.DEV_MID, width=lw)
    size = max(26, int(h * 0.48))
    font = K.load_font(size, bold=True)
    shown = text[: int(round(len(text) * K.clamp01(typed)))]
    tx, ty = bar[0] + h * 0.95, my - size * 0.62
    draw.text((tx, ty), shown, fill=ink, font=font)
    if typed < 1.0 or (not shown and int(t * 6) % 2 == 0):
        bx = draw.textbbox((tx, ty), shown, font=font)[2] + 4 if shown else tx
        draw.line((bx, my - size * 0.45, bx, my + size * 0.45), fill=coral, width=max(2, int(h * 0.06)))


def keyboard(draw, box, t, coral):
    x0, y0, x1, y1 = box
    bw = x1 - x0
    ky0 = y1 - bw * 0.6
    draw.rectangle((x0, ky0, x1, y1), fill=(214, 218, 226))
    kw = (bw - 12) / 10
    hot = int(t * 20) % 27
    k = 0
    for r in range(3):
        n = 10 - r
        off = r * kw * 0.5
        for c in range(n):
            kx = x0 + 6 + off + c * kw
            ky = ky0 + 10 + r * kw * 1.3
            fill = coral if (k == hot and t > 0) else (255, 255, 255)
            draw.rounded_rectangle((kx + 2, ky, kx + kw - 2, ky + kw * 1.1), radius=4, fill=fill)
            k += 1
    sy = ky0 + 10 + 3 * kw * 1.3
    draw.rounded_rectangle((x0 + bw * 0.25, sy, x1 - bw * 0.25, sy + kw * 1.1), radius=4, fill=(255, 255, 255))
    return ky0


def india_gate(draw, cx, by, s, hole):
    S = S_(s)
    draw.rectangle((cx - S(80) + S(8), by - S(170) + S(8), cx + S(80) + S(8), by + S(4)), fill=K.SHADOW)
    draw.rectangle((cx - S(80), by - S(170), cx + S(80), by), fill=SAND)
    draw.rectangle((cx - S(94), by - S(192), cx + S(94), by - S(166)), fill=SAND_DARK)
    draw.rectangle((cx - S(62), by - S(222), cx + S(62), by - S(192)), fill=SAND)
    draw.chord((cx - S(30), by - S(252), cx + S(30), by - S(192)), 180, 360, fill=SAND_DARK)
    draw.line((cx - S(80), by - S(136), cx + S(80), by - S(136)), fill=SAND_DARK, width=max(2, int(S(5))))
    draw.rectangle((cx - S(34), by - S(90), cx + S(34), by), fill=hole)
    draw.ellipse((cx - S(34), by - S(124), cx + S(34), by - S(56)), fill=hole)


def car(draw, cx, cy, s, col, faces=True):
    S = S_(s)
    draw.ellipse((cx - S(140), cy + S(52), cx + S(140), cy + S(84)), fill=K.SHADOW)
    draw.polygon([(cx - S(84), cy - S(26)), (cx - S(52), cy - S(88)), (cx + S(54), cy - S(88)),
                  (cx + S(96), cy - S(26))], fill=col)
    win = (210, 232, 246)
    draw.polygon([(cx - S(70), cy - S(30)), (cx - S(46), cy - S(76)), (cx - S(4), cy - S(76)), (cx - S(4), cy - S(30))],
                 fill=win)
    draw.polygon([(cx + S(8), cy - S(30)), (cx + S(8), cy - S(76)), (cx + S(48), cy - S(76)), (cx + S(80), cy - S(30))],
                 fill=win)
    if faces:
        K.draw_face(draw, cx - S(32), cy - S(46), S(17), "kid", 1.0)
        K.draw_face(draw, cx + S(38), cy - S(46), S(19), "kid", 1.0)
    draw.rounded_rectangle((cx - S(136), cy - S(32), cx + S(136), cy + S(42)), radius=S(24), fill=col)
    draw.rounded_rectangle((cx + S(108), cy - S(16), cx + S(134), cy + S(2)), radius=S(6), fill=K.GOLD)
    draw.rounded_rectangle((cx - S(134), cy - S(16), cx - S(114), cy + S(2)), radius=S(6), fill=K.DANGER)
    draw.line((cx - S(10), cy - S(20), cx - S(10), cy + S(30)), fill=tuple(int(c * 0.8) for c in col), width=max(2, int(S(4))))
    for wx in (cx - S(80), cx + S(80)):
        draw.ellipse((wx - S(32), cy + S(14), wx + S(32), cy + S(78)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(14), cy + S(32), wx + S(14), cy + S(60)), fill=K.STEEL)


def gear(draw, cx, cy, r, col, rot=0.0, teeth=8, hole=(255, 255, 255)):
    pts = []
    n = teeth * 4
    for i in range(n):
        a = rot + i * 2 * math.pi / n
        rr = r if (i % 4) in (0, 1) else r * 0.78
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    draw.polygon(pts, fill=col)
    draw.ellipse((cx - r * 0.34, cy - r * 0.34, cx + r * 0.34, cy + r * 0.34), fill=hole)


def gears(draw, cx, cy, s, t, hole=(255, 255, 255)):
    gear(draw, cx - 40 * s, cy + 10 * s, 80 * s, K.BOTH_COLOR, rot=t * 6, hole=hole)
    gear(draw, cx + 74 * s, cy - 50 * s, 54 * s, K.CORAL, rot=-t * 9 + 0.2, teeth=7, hole=hole)
    gear(draw, cx + 70 * s, cy + 78 * s, 40 * s, (13, 148, 136), rot=-t * 11, teeth=6, hole=hole)


def finger(draw, x, y, s, press=0.0, coral=K.CORAL):
    """Index finger pointing up; tip at (x, y)."""
    S = S_(s)
    if press > 0:
        ring = S(18) + S(40) * press
        draw.ellipse((x - ring, y - ring, x + ring, y + ring), outline=coral, width=max(2, int(S(6))))
    edge = (214, 160, 124)
    draw.rounded_rectangle((x - S(30), y + S(150), x + S(58), y + S(220)), radius=S(10), fill=coral)
    draw.rounded_rectangle((x - S(34), y + S(70), x + S(62), y + S(170)), radius=S(34), fill=K.SKIN, outline=edge,
                           width=max(1, int(S(3))))
    draw.rounded_rectangle((x - S(17), y, x + S(17), y + S(110)), radius=S(17), fill=K.SKIN, outline=edge,
                           width=max(1, int(S(3))))
    draw.rounded_rectangle((x - S(9), y + S(8), x + S(9), y + S(26)), radius=S(6), fill=(250, 220, 200))
    for k in range(3):
        fx = x + S(20) + k * S(14)
        draw.arc((fx - S(12), y + S(80), fx + S(12), y + S(110)), 180, 360, fill=edge, width=max(1, int(S(3))))


def thumb(draw, box, kind):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    rad = min(bw, bh) * 0.12
    if kind == "cricket":
        draw.rounded_rectangle(box, radius=rad, fill=GRASS)
        draw.polygon([(x0 + bw * 0.42, y0 + bh * 0.12), (x0 + bw * 0.58, y0 + bh * 0.12),
                      (x0 + bw * 0.68, y1 - bh * 0.06), (x0 + bw * 0.32, y1 - bh * 0.06)], fill=(232, 212, 166))
        sw = max(2, int(bw * 0.025))
        for fx in (0.46, 0.5, 0.54):
            draw.line((x0 + bw * fx, y0 + bh * 0.14, x0 + bw * fx, y0 + bh * 0.4), fill=(255, 255, 255), width=sw)
        draw.line((x0 + bw * 0.16, y0 + bh * 0.22, x0 + bw * 0.3, y0 + bh * 0.82), fill=WOOD, width=max(3, int(bw * 0.08)))
        draw.line((x0 + bw * 0.14, y0 + bh * 0.12, x0 + bw * 0.17, y0 + bh * 0.25), fill=K.DEV_DARK,
                  width=max(2, int(bw * 0.035)))
        r = bw * 0.065
        bx, by = x0 + bw * 0.78, y0 + bh * 0.62
        draw.ellipse((bx - r, by - r, bx + r, by + r), fill=(214, 52, 52))
        draw.arc((bx - r * 0.6, by - r, bx + r * 0.6, by + r), 250, 110, fill=(255, 255, 255), width=max(1, int(r * 0.2)))
    elif kind == "cartoon":
        draw.rounded_rectangle(box, radius=rad, fill=(226, 218, 248))
        r = min(bw, bh) * 0.3
        mx, my = x0 + bw / 2, y0 + bh / 2
        draw.ellipse((mx - r, my - r, mx + r, my + r), fill=(13, 148, 136))
        e = r * 0.2
        for sx in (-1, 1):
            draw.ellipse((mx + sx * r * 0.38 - e, my - r * 0.25 - e, mx + sx * r * 0.38 + e, my - r * 0.25 + e),
                         fill=(255, 255, 255))
        draw.arc((mx - r * 0.45, my - r * 0.1, mx + r * 0.45, my + r * 0.5), 20, 160, fill=(255, 255, 255),
                 width=max(2, int(r * 0.12)))
    elif kind == "cook":
        draw.rounded_rectangle(box, radius=rad, fill=(255, 226, 170))
        K.draw_pot(draw, x0 + bw * 0.55, y0 + bh * 0.52, bh / 300, 0.3, liquid=K.CHAI, flame=False)
    else:
        draw.rounded_rectangle(box, radius=rad, fill=(206, 222, 250))
        K.draw_notes(draw, x0 + bw * 0.5, y0 + bh * 0.42, bh / 200, 0.2, K.ROAD)
    pr = min(bw, bh) * 0.11
    px, py = x1 - pr * 1.6, y1 - pr * 1.6
    draw.ellipse((px - pr, py - pr, px + pr, py + pr), fill=(255, 255, 255))
    draw.polygon([(px - pr * 0.35, py - pr * 0.5), (px + pr * 0.55, py), (px - pr * 0.35, py + pr * 0.5)],
                 fill=K.DANGER)


def gamepad(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(90), cy - S(46), cx + S(90), cy + S(46)), radius=S(40), fill=K.DEV_DARK)
    draw.rectangle((cx - S(62), cy - S(8), cx - S(26), cy + S(8)), fill=(255, 255, 255))
    draw.rectangle((cx - S(52), cy - S(18), cx - S(36), cy + S(18)), fill=(255, 255, 255))
    draw.ellipse((cx + S(30), cy - S(22), cx + S(50), cy - S(2)), fill=K.CORAL)
    draw.ellipse((cx + S(52), cy - S(2), cx + S(72), cy + S(18)), fill=K.GOLD)


def app_icon(draw, cx, cy, sz, kind):
    h = sz / 2
    rad = sz * 0.24
    cols = {"maps": MAP_BG, "camera": K.CORAL, "video": K.DANGER, "quiz": K.BOTH_COLOR, "music": K.ROAD,
            "game": K.GOLD, "draw": (13, 148, 136)}
    draw.rounded_rectangle((cx - h + sz * 0.05, cy - h + sz * 0.07, cx + h + sz * 0.05, cy + h + sz * 0.07),
                           radius=rad, fill=K.SHADOW)
    draw.rounded_rectangle((cx - h, cy - h, cx + h, cy + h), radius=rad, fill=cols[kind])
    wht = (255, 255, 255)
    if kind == "maps":
        rw = max(3, int(sz * 0.08))
        draw.line((cx - h + rad * 0.3, cy + sz * 0.15, cx + h - rad * 0.3, cy - sz * 0.05), fill=wht, width=rw)
        draw.line((cx - sz * 0.12, cy - h + rad * 0.3, cx + sz * 0.05, cy + h - rad * 0.3), fill=wht, width=rw)
        K.draw_map_pin(draw, cx + sz * 0.1, cy + sz * 0.12, sz / 260, K.DANGER)
    elif kind == "camera":
        draw.rounded_rectangle((cx - sz * 0.3, cy - sz * 0.18, cx + sz * 0.3, cy + sz * 0.24), radius=sz * 0.08, fill=wht)
        draw.rectangle((cx - sz * 0.12, cy - sz * 0.26, cx + sz * 0.08, cy - sz * 0.16), fill=wht)
        draw.ellipse((cx - sz * 0.13, cy - sz * 0.10, cx + sz * 0.13, cy + sz * 0.16), fill=K.CORAL)
        draw.ellipse((cx - sz * 0.07, cy - sz * 0.04, cx + sz * 0.07, cy + sz * 0.10), fill=wht)
    elif kind == "video":
        draw.polygon([(cx - sz * 0.14, cy - sz * 0.2), (cx + sz * 0.22, cy), (cx - sz * 0.14, cy + sz * 0.2)], fill=wht)
    elif kind == "quiz":
        draw.line([(cx - sz * 0.2, cy), (cx - sz * 0.05, cy + sz * 0.16), (cx + sz * 0.22, cy - sz * 0.16)], fill=wht,
                  width=max(3, int(sz * 0.1)), joint="curve")
    elif kind == "music":
        K.draw_notes(draw, cx - sz * 0.04, cy - sz * 0.02, sz / 220, 0.0, wht)
    elif kind == "game":
        gamepad(draw, cx, cy, sz / 260)
    else:
        draw.polygon([(cx - sz * 0.22, cy + sz * 0.22), (cx - sz * 0.16, cy + sz * 0.06), (cx + sz * 0.14, cy - sz * 0.24),
                      (cx + sz * 0.24, cy - sz * 0.14), (cx - sz * 0.06, cy + sz * 0.16)], fill=wht)


def ice_cream(draw, cx, cy, s):
    S = S_(s)
    draw.polygon([(cx - S(34), cy), (cx + S(34), cy), (cx, cy + S(90))], fill=(222, 170, 100))
    draw.line((cx - S(20), cy + S(14), cx + S(10), cy + S(56)), fill=(196, 140, 76), width=max(1, int(S(3))))
    draw.line((cx + S(20), cy + S(14), cx - S(10), cy + S(56)), fill=(196, 140, 76), width=max(1, int(S(3))))
    draw.ellipse((cx - S(40), cy - S(44), cx + S(40), cy + S(16)), fill=(255, 160, 190))
    draw.ellipse((cx - S(30), cy - S(84), cx + S(30), cy - S(28)), fill=(255, 232, 170))
    draw.ellipse((cx - S(8), cy - S(98), cx + S(8), cy - S(82)), fill=K.DANGER)


def mixie(draw, cx, by, s, t, level=0.0, spin=False, chunks=False):
    S = S_(s)
    draw.ellipse((cx - S(130), by - S(12), cx + S(130), by + S(14)), fill=K.SHADOW)
    base = [(cx - S(120), by), (cx + S(120), by), (cx + S(100), by - S(110)), (cx - S(100), by - S(110))]
    draw.polygon(base, fill=(238, 238, 242), outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.ellipse((cx - S(26), by - S(81), cx + S(26), by - S(29)), fill=K.CORAL)
    ang = t * 20 if spin else -0.8
    draw.line((cx, by - S(55), cx + S(18) * math.cos(ang), by - S(55) + S(18) * math.sin(ang)), fill=(255, 255, 255),
              width=max(2, int(S(6))))
    jb = by - S(110)
    jh = S(230)

    def half(yy):
        return S(80) + S(30) * (jb - yy) / jh
    draw.arc((cx + S(90), jb - S(190), cx + S(170), jb - S(50)), 270, 90, fill=K.DEV_MID, width=max(3, int(S(16))))
    jar = [(cx - S(80), jb), (cx + S(80), jb), (cx + S(110), jb - jh), (cx - S(110), jb - jh)]
    draw.polygon(jar, fill=(232, 242, 250))
    lv = K.clamp01(level)
    if lv > 0:
        ty = jb - jh * 0.85 * lv
        draw.polygon([(cx - half(ty), ty), (cx + half(ty), ty), (cx + S(80), jb), (cx - S(80), jb)], fill=SHAKE)
    if chunks:
        draw.polygon([(cx - half(jb - S(60)), jb - S(60)), (cx + half(jb - S(60)), jb - S(60)), (cx + S(80), jb),
                      (cx - S(80), jb)], fill=(250, 250, 246))
        for k, (dx, dy) in enumerate(((-40, -40), (6, -64), (44, -34), (-12, -96), (30, -110))):
            x, y = cx + S(dx), jb + S(dy)
            draw.rounded_rectangle((x - S(18), y - S(18), x + S(18), y + S(18)), radius=S(5),
                                   fill=MANGO if k % 2 == 0 else MANGO_DEEP)
    if spin:
        for k in range(3):
            yy = jb - S(50) - k * S(50)
            hw = half(yy) * 0.75
            a0 = (t * 900 + k * 120) % 360
            draw.arc((cx - hw, yy - S(16), cx + hw, yy + S(16)), a0, a0 + 200, fill=(255, 255, 255),
                     width=max(2, int(S(6))))
    draw.polygon(jar, outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(120), jb - jh - S(28), cx + S(120), jb - jh + S(4)), radius=S(12), fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(30), jb - jh - S(46), cx + S(30), jb - jh - S(24)), radius=S(8), fill=K.DEV_DARK)
    if spin:
        for sx in (-1, 1):
            for k in range(3):
                x = cx + sx * (S(150) + k * S(22))
                draw.line((x, jb - S(140) + k * S(10), x, jb - S(80) - k * S(10)), fill=K.DEV_MID,
                          width=max(2, int(S(5))))


def mango(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(64) + S(5), cy - S(46) + S(7), cx + S(64) + S(5), cy + S(46) + S(7)), fill=K.SHADOW)
    draw.ellipse((cx - S(64), cy - S(46), cx + S(64), cy + S(46)), fill=MANGO)
    draw.chord((cx - S(64), cy - S(46), cx + S(64), cy + S(46)), 300, 60, fill=MANGO_DEEP)
    draw.line((cx - S(46), cy - S(32), cx - S(60), cy - S(56)), fill=(110, 80, 50), width=max(2, int(S(7))))
    draw.polygon([(cx - S(58), cy - S(52)), (cx - S(20), cy - S(76)), (cx - S(8), cy - S(60)), (cx - S(44), cy - S(44))],
                 fill=K.LEAF)
    draw.arc((cx - S(44), cy - S(30), cx + S(10), cy + S(10)), 190, 250, fill=(255, 230, 160), width=max(2, int(S(6))))


def shake(draw, cx, by, s, level=1.0):
    S = S_(s)
    tw, bw, h = S(62), S(46), S(190)

    def w_at(yy):
        return bw + (tw - bw) * ((by - yy) / h)
    pts = [(cx - tw, by - h), (cx + tw, by - h), (cx + bw, by), (cx - bw, by)]
    draw.polygon([(x + S(6), y + S(8)) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=(238, 247, 253))
    lv = K.clamp01(level)
    if lv > 0:
        wy = by - h * 0.86 * lv
        draw.polygon([(cx - w_at(wy), wy), (cx + w_at(wy), wy), (cx + bw, by), (cx - bw, by)], fill=SHAKE)
        draw.ellipse((cx - w_at(wy), wy - S(12), cx + w_at(wy), wy + S(12)), fill=(255, 236, 190))
    draw.line((cx + S(10), by - S(60), cx + S(40), by - h - S(60)), fill=K.CORAL, width=max(3, int(S(12))))
    draw.polygon(pts, outline=K.DEV_DARK, width=max(2, int(S(5))))


def friend_scene(draw, box, t):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    draw.rectangle(box, fill=SKY)
    sr = bw * 0.09
    draw.ellipse((x1 - bw * 0.22 - sr, y0 + bh * 0.16 - sr, x1 - bw * 0.22 + sr, y0 + bh * 0.16 + sr), fill=K.GOLD)
    draw.rectangle((x0, y0 + bh * 0.72, x1, y1), fill=GRASS)
    fx, fy = x0 + bw * 0.48, y0 + bh * 0.5
    r = min(bw, bh) * 0.16
    draw.chord((fx - r * 1.6, fy + r * 0.8, fx + r * 1.6, fy + r * 4.2), 180, 360, fill=K.GOLD)
    K.draw_face(draw, fx, fy, r, "kid", 1.0)
    draw.line((fx + r * 1.2, fy + r * 1.6, fx + r * 2.0, fy + r * 0.2), fill=K.SKIN, width=max(3, int(r * 0.35)))
    draw.ellipse((fx + r * 1.75, fy - r * 0.15, fx + r * 2.35, fy + r * 0.45), fill=K.SKIN)


def camera_view(draw, box, t, coral, pressed=0.0, saving=False, photo=False):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    draw.rectangle(box, fill=(30, 34, 44))
    vf = (x0, y0 + bh * 0.06, x1, y1 - bh * 0.24)
    friend_scene(draw, vf, t)
    if not photo:
        g = (255, 255, 255)
        k = bw * 0.12
        for (cx_, cy_, dx, dy) in ((vf[0] + 12, vf[1] + 12, 1, 1), (vf[2] - 12, vf[1] + 12, -1, 1),
                                   (vf[0] + 12, vf[3] - 12, 1, -1), (vf[2] - 12, vf[3] - 12, -1, -1)):
            draw.line((cx_, cy_, cx_ + dx * k, cy_), fill=g, width=4)
            draw.line((cx_, cy_, cx_, cy_ + dy * k), fill=g, width=4)
    if saving:
        draw.rectangle(vf, outline=(255, 255, 255), width=10)
        K.draw_spinner(draw, (x0 + x1) / 2, (vf[1] + vf[3]) / 2, bw * 0.14, t, (255, 255, 255))
    sx, sy = (x0 + x1) / 2, y1 - bh * 0.12
    r = bw * 0.12
    draw.ellipse((sx - r, sy - r, sx + r, sy + r), outline=(255, 255, 255), width=max(3, int(r * 0.14)))
    ri = r * (0.78 - 0.12 * pressed)
    draw.ellipse((sx - ri, sy - ri, sx + ri, sy + ri), fill=coral if pressed > 0 else (255, 255, 255))
    if photo or saving:
        tb = (x0 + bw * 0.08, sy - r * 0.8, x0 + bw * 0.08 + r * 1.6, sy + r * 0.8)
        draw.rectangle(tb, fill=(255, 255, 255))
        friend_scene(draw, (tb[0] + 3, tb[1] + 3, tb[2] - 3, tb[3] - 3), t)
    return sx, sy


def quiz_view(draw, box, ink, coral, sage, state, t):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    draw.rectangle(box, fill=(246, 243, 238))
    draw.rectangle((x0, y0, x1, y0 + bh * 0.12), fill=K.BOTH_COLOR)
    K.text_at(draw, "QUIZ", (x0 + x1) / 2, y0 + bh * 0.06 - 17, K.load_font(28, bold=True), (255, 255, 255))
    qf = K.load_font(max(26, int(bw * 0.11)), bold=True)
    K.text_at(draw, "Which one is", (x0 + x1) / 2, y0 + bh * 0.17, qf, ink)
    K.text_at(draw, "a fruit?", (x0 + x1) / 2, y0 + bh * 0.17 + bw * 0.13, qf, ink)
    of = K.load_font(max(26, int(bw * 0.1)), bold=True)
    for i, lab in enumerate(("Mango", "Chair", "Shoe")):
        oy = y0 + bh * 0.45 + i * bh * 0.16
        ob = (x0 + bw * 0.08, oy, x1 - bw * 0.08, oy + bh * 0.12)
        fill, out, wd = (255, 255, 255), (214, 206, 196), 2
        if i == 0 and state == "tap":
            out, wd = coral, 5
        elif i == 0 and state == "check":
            out, wd = K.GOLD, 5
        elif i == 0 and state == "tick":
            fill, out, wd = (214, 242, 236), sage, 5
        draw.rounded_rectangle(ob, radius=(ob[3] - ob[1]) / 2, fill=fill, outline=out, width=wd)
        K.text_at(draw, lab, (x0 + x1) / 2 - bw * 0.06, oy + bh * 0.06 - bw * 0.065, of, ink)
        if i == 0 and state == "tick":
            K.draw_check(draw, ob[2] - bh * 0.06, oy + bh * 0.06, bh * 0.045, sage)
        if i == 0 and state == "check":
            K.draw_spinner(draw, ob[2] - bh * 0.06, oy + bh * 0.06, bh * 0.032, t, K.GOLD)
    return (x0 + x1) / 2, y0 + bh * 0.51


def answer_button(draw, cx, cy, s, ink, state, sage, coral, t):
    S = S_(s)
    box = (cx - S(150), cy - S(46), cx + S(150), cy + S(46))
    fill, out = (255, 255, 255), (214, 206, 196)
    if state == "tap":
        out = coral
    elif state == "check":
        out = K.GOLD
    elif state == "tick":
        fill, out = (214, 242, 236), sage
    draw.rounded_rectangle((box[0] + 6, box[1] + 8, box[2] + 6, box[3] + 8), radius=S(46), fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=S(46), fill=fill, outline=out, width=max(3, int(S(6))))
    K.text_at(draw, "Mango", cx - S(20), cy - S(26), K.load_font(max(26, int(S(42))), bold=True), ink)


def mini_glyph(draw, kind, x, y, r, col):
    wht = (255, 255, 255)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=col)
    k = r * 0.55
    if kind == "keyboard":
        draw.rounded_rectangle((x - k, y - k * 0.6, x + k, y + k * 0.6), radius=4, fill=wht)
        for i in range(3):
            draw.rectangle((x - k * 0.7 + i * k * 0.55, y - k * 0.3, x - k * 0.45 + i * k * 0.55, y - k * 0.05), fill=col)
        draw.rectangle((x - k * 0.5, y + k * 0.15, x + k * 0.5, y + k * 0.35), fill=col)
    elif kind == "tap":
        draw.ellipse((x - k, y - k, x + k, y + k), outline=wht, width=4)
        draw.ellipse((x - k * 0.4, y - k * 0.4, x + k * 0.4, y + k * 0.4), fill=wht)
    elif kind == "camera":
        draw.rounded_rectangle((x - k, y - k * 0.6, x + k, y + k * 0.7), radius=5, fill=wht)
        draw.ellipse((x - k * 0.4, y - k * 0.35, x + k * 0.4, y + k * 0.45), fill=col)
    elif kind == "gear":
        gear(draw, x, y, k, wht, rot=0.3, hole=col)
    elif kind == "path":
        draw.line([(x - k, y + k * 0.6), (x - k * 0.2, y + k * 0.6), (x - k * 0.2, y - k * 0.3), (x + k, y - k * 0.3)],
                  fill=wht, width=5, joint="curve")
        draw.ellipse((x + k * 0.7, y - k * 0.6, x + k * 1.1, y - k * 0.0), fill=wht)
    elif kind in ("check", "tick"):
        draw.line([(x - k * 0.6, y), (x - k * 0.15, y + k * 0.45), (x + k * 0.65, y - k * 0.45)], fill=wht, width=6,
                  joint="curve")
    elif kind == "route":
        K.draw_map_pin(draw, x, y + k * 0.8, k / 60, wht)
    elif kind == "photo":
        draw.rectangle((x - k, y - k * 0.7, x + k, y + k * 0.7), fill=wht)
        draw.polygon([(x - k * 0.8, y + k * 0.55), (x - k * 0.2, y - k * 0.2), (x + k * 0.3, y + k * 0.55)], fill=col)
        draw.ellipse((x + k * 0.3, y - k * 0.5, x + k * 0.6, y - k * 0.2), fill=col)


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
    IPO = [("INPUT", coral, coral_soft), ("PROCESS", K.BOTH_COLOR, lav_soft), ("OUTPUT", sage, sage_soft)]
    font = K.load_font

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def stars_at(x, y, r, n=4):
        for i in range(n):
            a = i * 2 * math.pi / n + 0.4
            sx = x + math.cos(a) * r
            sy = y + math.sin(a) * r * 0.7 + 10 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 20 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def question_marks(spots):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(84 + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def app_grid(box):
        x0, y0, x1, y1 = box
        bw, bh = x1 - x0, y1 - y0
        sz = min(bw * 0.36, bh * 0.22)
        kinds = ["maps", "camera", "video", "quiz", "music", "game"]
        for i, kind in enumerate(kinds):
            r, c = divmod(i, 2)
            a = K.stagger(progress, i, step=0.06, speed=5)
            if a <= 0:
                continue
            ix = x0 + bw * (0.28 + 0.44 * c)
            iy = y0 + bh * (0.2 + 0.3 * r)
            app_icon(draw, ix, iy, sz * (0.7 + 0.3 * a), kind)

    def strip(cur):
        for i, (lab, col, _) in enumerate(IPO):
            x = cx + (i - 1) * 440
            box = (x - 170, 222, x + 170, 286)
            if i == cur:
                draw.rounded_rectangle(box, radius=32, fill=col)
                fg = panel
            elif i < cur:
                draw.rounded_rectangle(box, radius=32, fill=panel, outline=col, width=4)
                fg = col
            else:
                draw.rounded_rectangle(box, radius=32, fill=panel, outline=line, width=3)
                fg = muted
            K.text_at(draw, lab, x, 234, font(32, bold=True), fg)
            if i < 2:
                K.draw_arrow(draw, x + 184, 254, x + 256, 254, line if i >= cur else col, width=8, head=20)

    def ipo_icon(i, x, y, s=1.0):
        if i == 0:
            box = phone(draw, x - 30 * s, y, 0.5 * s)
            app_grid(box)
            finger(draw, x + 10 * s, y + 10 * s, 0.6 * s, press=(t * 2) % 1, coral=coral)
        elif i == 1:
            gears(draw, x, y, 1.0 * s, t, hole=panel)
        else:
            box = phone(draw, x, y, 0.5 * s)
            map_view(draw, box, t, coral, route=1.0)

    def three_cards(labels, colors, y0=280, y1=820, shown=None, states=None, badges=None, icons=None, sub=None):
        cw, gap = 470, 75
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i in range(3):
            a = 1.0 if shown is None else K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
            if a <= 0:
                continue
            x0 = x_start + i * (cw + gap)
            yy = int((1 - a) * 50)
            box = (x0, y0 + yy, x0 + cw, y1 + yy)
            st = states[i] if states else "normal"
            col = colors[i]
            out = sage if st == "win" else col
            K.shadow_card(draw, box, brand, radius=32, outline=out, outline_w=6 if st == "win" else 4)
            if st == "win":
                draw.rounded_rectangle((box[0] + 6, box[1] + 6, box[2] - 6, box[3] - 6), radius=28, fill=sage_soft)
            mx = x0 + cw / 2
            if badges:
                K.pill(draw, mx, box[1] + 24, badges[i], col, size=28)
            if icons:
                icons(i, mx, box[1] + (y1 - y0) * 0.45)
            lab = labels[i]
            size = 40
            f = font(size, bold=True)
            lines = K.wrap_text(lab, f, int(cw - 50))
            lh = int(size * 1.2)
            ty = box[3] - 34 - len(lines) * lh - (44 if sub else 0)
            for j, ln in enumerate(lines):
                K.text_at(draw, ln, mx, ty + j * lh, f, ink)
            if sub:
                K.text_at(draw, sub[i], mx, box[3] - 70, font(30, bold=True), muted)
            if st == "win":
                K.draw_check(draw, box[2] - 46, box[1] + 46, 26, sage)
            nxt = 1.0 if shown is None else K.clamp01((shown - i - 1) * 2.5)
            if i < 2 and nxt > 0:
                ax = x0 + cw + 10
                K.draw_arrow(draw, ax, (y0 + y1) / 2, ax + gap - 20, (y0 + y1) / 2, muted, width=8, head=22)

    # ---- opening -----------------------------------------------------------
    if visual == "a17-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            box = phone(draw, cx + 280, 460, 0.62)
            app_grid(box)
            K.text_at(draw, "Welcome back, champ!", cx, 720, font(60, bold=True), ink)
            stars_around(330, 520)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · PEOPLE WHO BUILD WITH COMPUTERS", cx, 326 + lift, font(32, bold=True), sage)
            chips = ["Game makers", "Animators", "Robot builders", "App developers"]
            softs = [coral_soft, lav_soft, blue_soft, sage_soft]
            for i, lab in enumerate(chips):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 300
                y = 510 + int((1 - a) * 40)
                draw.ellipse((x - 100, y - 100, x + 100, y + 100), fill=softs[i])
                if i == 0:
                    gamepad(draw, x, y, 0.9)
                elif i == 1:
                    K.draw_star(draw, x - 16, y + 10, 54, K.GOLD, rot=0.2)
                    draw.line((x + 20, y - 10, x + 66, y - 66), fill=K.BOTH_COLOR, width=18)
                    draw.polygon([(x + 12, y - 2), (x + 26, y - 18), (x + 8, y + 10)], fill=K.DEV_DARK)
                elif i == 2:
                    K.draw_robot(draw, x, y + 22, 0.3, t, mood="happy")
                else:
                    app_icon(draw, x, y, 120, "maps")
                K.text_at(draw, lab, x, y + 118, font(32, bold=True), ink)
            a = K.stagger(progress, 5, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 730 + int((1 - a) * 20), "They made the apps you use!", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 560 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "How Apps We Use", cx, 352 + lift, font(80, bold=True), ink)
            K.text_at(draw, "Actually Work", cx, 446 + lift, font(80, bold=True), coral)
            for i, (kind, lab) in enumerate((("maps", "Maps"), ("camera", "Camera"), ("video", "Videos"))):
                a = K.stagger(progress, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 320
                y = 690 + int((1 - a) * 30)
                app_icon(draw, x, y, 140, kind)
                K.text_at(draw, lab, x, y + 88, font(32, bold=True), ink)
            return True
        # secret
        K.text_at(draw, "Every app, same 3 steps!", cx, 240 + lift, font(66, bold=True), ink)
        for i in range(3):
            a = K.stagger(progress, i + 1, step=0.12, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 420
            y = 400 + int((1 - a) * 40)
            col = IPO[i][1]
            draw.rounded_rectangle((x - 150 + 8, y + 10, x + 150 + 8, y + 330), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x - 150, y, x + 150, y + 320), radius=36, fill=panel, outline=col, width=6)
            K.pill(draw, x, y + 26, f"Step {i + 1}", col, size=30)
            K.text_at(draw, "?", x, y + 110, font(int(130 + 20 * pulse), bold=True), col)
            if i < 2:
                K.draw_arrow(draw, x + 166, y + 160, x + 254, y + 160, muted, width=8, head=22)
        for k, (kind, ix, iy) in enumerate((("game", 230, 450), ("music", 1690, 450), ("quiz", 250, 700),
                                            ("camera", 1670, 700))):
            app_icon(draw, ix, iy + 10 * math.sin(progress * 8 + k), 120, kind)
        return True

    # ---- India Gate story -----------------------------------------------------
    if visual == "a17-hook":
        if focus == "trip":
            draw.ellipse((1450 - 280, 540 - 280, 1450 + 280, 540 + 280), fill=coral_soft)
            india_gate(draw, 1450, 770, 1.7, coral_soft)
            draw.rounded_rectangle((120, 770, 1800, 862), radius=46, fill=ROAD_GREY)
            K.draw_dashed(draw, 170, 816, 1750, 816, (255, 255, 255), width=6, dash=40, gap=30, phase=t * 300)
            x = K.lerp(380, 820, K.ease_in_out(progress))
            car(draw, x, 740, 1.4, K.ROAD)
            bx, by = x + 60, 436
            for k, (dx, dy, r) in enumerate(((-110, 160, 13), (-76, 122, 20))):
                draw.ellipse((bx + dx - r, by + dy - r, bx + dx + r, by + dy + r), fill=panel, outline=line, width=3)
            draw.ellipse((bx - 100, by - 100, bx + 100, by + 94), fill=panel, outline=line, width=4)
            ice_cream(draw, bx, by - 6, 0.88)
            K.pill(draw, 0, 240, "Sunday evening!", coral, size=36, left=150)
            return True
        if focus == "lost":
            road = [(1180, 900), (1180, 620)]
            for end in ((870, 300), (1500, 300)):
                draw.line([road[1], end], fill=ROAD_GREY, width=110)
                draw.ellipse((end[0] - 55, end[1] - 55, end[0] + 55, end[1] + 55), fill=ROAD_GREY)
            draw.line(road, fill=ROAD_GREY, width=110)
            draw.ellipse((1125, 565, 1235, 675), fill=ROAD_GREY)
            for a, b in (((1180, 870), (1180, 660)), ((1160, 600), (900, 330)), ((1200, 600), (1470, 330))):
                K.draw_dashed(draw, a[0], a[1], b[0], b[1], (255, 255, 255), width=6, dash=30, gap=24)
            draw.rectangle((1172, 450, 1188, 680), fill=K.DEV_DARK)
            draw.polygon([(1000, 495), (1030, 460), (1172, 460), (1172, 530), (1030, 530)], fill=K.GOLD)
            draw.polygon([(1188, 545), (1330, 545), (1360, 580), (1330, 615), (1188, 615)], fill=K.GOLD)
            K.text_at(draw, "?", 1095, 462, font(56, bold=True), ink)
            K.text_at(draw, "?", 1265, 547, font(56, bold=True), ink)
            K.draw_person(draw, 470, 540, 1.3, "dad", t)
            K.draw_bubble(draw, (300, 236, 760, 366), brand, "Left? Right?", tail="left", size=48)
            question_marks([(780, 470), (1620, 700), (720, 690)])
            K.text_at(draw, "Hmm…", 470, 770, font(40, bold=True), muted)
            return True
        if focus == "type":
            box = phone(draw, 700, 560, 1.05)
            map_view(draw, box, t, coral, faint=True)
            typed = K.clamp01((progress - 0.15) * 1.8)
            search_bar(draw, box, "India Gate", typed, t, ink, coral)
            ky0 = keyboard(draw, box, t, coral)
            fx = box[0] + (box[2] - box[0]) * (0.3 + 0.4 * ((t * 3) % 1))
            finger(draw, fx, ky0 + 30, 0.6, press=(t * 6) % 1, coral=coral)
            app_icon(draw, 1330, 380, 170, "maps")
            K.text_at(draw, "Maps app", 1330, 492, font(52, bold=True), ink)
            K.text_at(draw, "You type:", 1330, 600, font(38, bold=True), muted)
            if typed > 0:
                K.pill(draw, 1330, 660, "India Gate"[: max(1, int(round(10 * typed)))], coral, size=50)
            return True
        if focus == "route":
            box = phone(draw, 680, 560, 1.05)
            map_view(draw, box, t, coral, route=K.clamp01((progress - 0.08) * 1.7))
            search_bar(draw, box, "India Gate", 1.0, 0.0, ink, coral)
            K.draw_stopwatch(draw, 1350, 420, 90, progress, brand)
            K.text_at(draw, "In one second!", 1350, 556, font(56, bold=True), coral)
            draw.ellipse((1350 - 120, 770 - 120, 1350 + 120, 770 + 80), fill=blue_soft)
            india_gate(draw, 1350, 840, 0.62, blue_soft)
            if progress > 0.7:
                K.draw_check(draw, 1480, 680, 30, sage)
            return True
        if focus == "why":
            draw.ellipse((cx - 300, 570 - 300, cx + 300, 570 + 300), fill=lav_soft)
            box = phone(draw, cx, 575, 0.95)
            map_view(draw, box, t, coral, route=1.0)
            search_bar(draw, box, "India Gate", 1.0, 0.0, ink, coral)
            K.text_at(draw, "How did it know the way?", cx, 222, font(50, bold=True), ink)
            question_marks([(cx - 440, 360), (cx + 420, 340), (cx - 500, 620), (cx + 480, 600)])
            K.draw_stopwatch(draw, cx + 660, 760, 50, progress, brand)
            return True
        # answer
        three_cards(["You give it something", "It works inside", "It shows a result"],
                    [c for _, c, _ in IPO], shown=progress * 3.6 + 0.4, icons=lambda i, x, y: ipo_icon(i, x, y))
        return True

    # ---- input / process / output -------------------------------------------
    if visual == "a17-ipo":
        if focus == "name":
            three_cards(["", "", ""], [c for _, c, _ in IPO], shown=progress * 4.5 + 0.2,
                        icons=lambda i, x, y: ipo_icon(i, x, y - 20))
            for i, (lab, col, _) in enumerate(IPO):
                a = K.ease_out_cubic(K.clamp01((progress * 4.5 + 0.2 - i) * 2.5))
                if a <= 0:
                    continue
                x = cx + (i - 1) * 545
                K.text_at(draw, lab, x, 700 + int((1 - a) * 50), font(58, bold=True), col)
            return True
        i = {"input": 0, "process": 1, "output": 2}[focus]
        lab, col, soft = IPO[i]
        K.shadow_card(draw, (140, 250, 860, 860), brand, radius=40)
        draw.ellipse((500 - 250, 550 - 250, 500 + 250, 550 + 250), fill=soft)
        box = phone(draw, 500, 552, 0.82)
        if i == 0:
            map_view(draw, box, t, coral, faint=True)
            search_bar(draw, box, "India Gate", K.clamp01(progress * 2), t, ink, coral)
            ky0 = keyboard(draw, box, t, coral)
            finger(draw, box[0] + (box[2] - box[0]) * (0.35 + 0.3 * ((t * 3) % 1)), ky0 + 26, 0.5,
                   press=(t * 6) % 1, coral=coral)
        elif i == 1:
            map_view(draw, box, t, coral, route=0.0, alts=True)
            bx0, by0, bx1, by1 = box
            draw.rounded_rectangle(((bx0 + bx1) / 2 - 100, (by0 + by1) / 2 - 110, (bx0 + bx1) / 2 + 100,
                                    (by0 + by1) / 2 + 100), radius=30, fill=(255, 255, 255))
            gears(draw, (bx0 + bx1) / 2 - 10, (by0 + by1) / 2, 0.82, t)
        else:
            map_view(draw, box, t, coral, route=1.0)
            K.sound_waves(draw, box[2] + 30, 470, 1.1, sage, t)
        draw.text((990, 262), lab, fill=col, font=font(96, bold=True))
        sub = {0: "what you GIVE the app", 1: "the work it does INSIDE", 2: "what it SHOWS or SAYS back"}[i]
        draw.text((994, 384), sub, fill=ink, font=font(44, bold=True))
        chips = {
            0: [("keyboard", "Typing a place"), ("tap", "Tapping a button"), ("camera", "Taking a photo")],
            1: [("gear", "Hidden work inside"), ("path", "Finding the best path"), ("check", "Checking an answer")],
            2: [("route", "A route on the map"), ("photo", "A photo"), ("tick", "A green tick")],
        }[i]
        for k, (kind, txt) in enumerate(chips):
            a = K.stagger(progress, k + 1, step=0.16, speed=4)
            if a <= 0:
                continue
            y = 490 + k * 118 + int((1 - a) * 30)
            draw.rounded_rectangle((990, y, 1770, y + 96), radius=48, fill=soft, outline=col, width=3)
            mini_glyph(draw, kind, 1044, y + 48, 32, col)
            draw.text((1100, y + 26), txt, fill=ink, font=font(40, bold=True))
        return True

    # ---- mixie analogy --------------------------------------------------------
    if visual == "a17-mixie":
        if focus == "intro":
            for k in range(8):
                ang = k * math.pi / 4 + t
                draw.line((1580 + math.cos(ang) * 84, 340 + math.sin(ang) * 84,
                           1580 + math.cos(ang) * 120, 340 + math.sin(ang) * 120), fill=K.GOLD, width=10)
            draw.ellipse((1580 - 66, 340 - 66, 1580 + 66, 340 + 66), fill=K.GOLD)
            draw.rounded_rectangle((240 + 8, 720 + 10, 1680 + 8, 800 + 10), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((240, 720, 1680, 800), radius=20, fill=WOOD)
            draw.rectangle((240, 720, 1680, 736), fill=WOOD_DARK)
            mixie(draw, 720, 722, 1.15, t)
            mango(draw, 1140, 670, 1.0)
            K.draw_milk(draw, 1410, 656, 0.9)
            K.pill(draw, 1180, 420, "Hot summer day!", coral, size=38)
            return True
        if focus == "steps":
            def icons(i, x, y):
                if i == 0:
                    mango(draw, x - 70, y + 70, 0.95)
                    K.draw_milk(draw, x + 80, y + 20, 0.75)
                elif i == 1:
                    mixie(draw, x, y + 160, 0.8, t, level=0.6, spin=True)
                else:
                    shake(draw, x, y + 150, 1.25)
            shown = 0.4 + (0 if progress < 0.3 else 1 if progress < 0.62 else 2) + K.clamp01(progress * 2)
            three_cards(["Mango & milk", "Blend it up", "Mango shake!"], [c for _, c, _ in IPO],
                        shown=shown, icons=icons, badges=[l for l, _, _ in IPO])
            return True
        # rule
        for i, c in enumerate(("IN", "WORK", "OUT")):
            K.pill(draw, 560 + i * 440, 232, c, IPO[i][1], size=30)
        rows = [("Mixie", 440), ("App", 720)]
        for r, (name, yc) in enumerate(rows):
            a = K.stagger(progress, r, step=0.35, speed=4)
            if a <= 0:
                continue
            yy = yc + int((1 - a) * 40)
            K.shadow_card(draw, (150, yy - 120, 1770, yy + 120), brand, radius=36)
            K.text_at(draw, name, 280, yy - 30, font(48, bold=True), ink)
            xs = [560, 1000, 1440]
            for k in range(2):
                K.draw_arrow(draw, xs[k] + 130, yy, xs[k + 1] - 130, yy, muted, width=8, head=22)
            if r == 0:
                mango(draw, xs[0], yy + 10, 0.85)
                mixie(draw, xs[1], yy + 104, 0.56, t, level=0.6, spin=True)
                shake(draw, xs[2], yy + 92, 0.9)
            else:
                fb = (xs[0] - 125, yy - 40, xs[0] + 125, yy + 40)
                draw.rounded_rectangle(fb, radius=40, fill=panel, outline=coral, width=4)
                K.text_at(draw, "India Gate", xs[0], yy - 20, font(34, bold=True), ink)
                gears(draw, xs[1], yy, 0.62, t, hole=panel)
                pb = phone(draw, xs[2], yy, 0.36)
                map_view(draw, pb, t, coral, route=1.0)
        return True

    # ---- maps app, step by step -----------------------------------------------
    if visual == "a17-maps":
        cur = {"input": 0, "process": 1, "output": 2, "voice": 2}[focus]
        strip(cur)
        box = phone(draw, 560, 590, 0.95)
        if focus == "input":
            map_view(draw, box, t, coral, faint=True)
            search_bar(draw, box, "India Gate", K.clamp01(progress * 2.2), t, ink, coral)
            ky0 = keyboard(draw, box, t, coral)
            finger(draw, box[0] + (box[2] - box[0]) * (0.35 + 0.3 * ((t * 3) % 1)), ky0 + 28, 0.55,
                   press=(t * 6) % 1, coral=coral)
            draw.text((1000, 360), "You typed", fill=muted, font=font(46, bold=True))
            draw.text((1000, 424), "\"India Gate\"", fill=coral, font=font(84, bold=True))
            a = K.stagger(progress, 3, step=0.12)
            if a > 0:
                K.pill(draw, 0, 600 + int((1 - a) * 20), "INPUT = what you give", coral, size=38, left=1000)
            return True
        if focus == "process":
            map_view(draw, box, t, coral, route=K.clamp01((progress - 0.7) * 4), alts=progress < 0.85, pin=True)
            search_bar(draw, box, "India Gate", 1.0, 0.0, ink, coral)
            ang = t * math.tau * 1.5
            K.draw_magnifier(draw, 560 + math.cos(ang) * 60, 600 + math.sin(ang) * 90, 0.55, K.BOTH_COLOR)
            draw.ellipse((1350 - 170, 450 - 170, 1350 + 170, 450 + 170), fill=lav_soft)
            gears(draw, 1350, 450, 1.0, t, hole=lav_soft)
            K.text_at(draw, "Checking lots of roads…", 1350, 650, font(46, bold=True), ink)
            K.pill(draw, 1350, 730, "PROCESS = finding the path", K.BOTH_COLOR, size=36)
            return True
        if focus == "output":
            map_view(draw, box, t, coral, route=K.clamp01(progress * 1.8))
            search_bar(draw, box, "India Gate", 1.0, 0.0, ink, coral)
            draw.ellipse((1350 - 190, 470 - 190, 1350 + 190, 470 + 190), fill=sage_soft)
            india_gate(draw, 1350, 600, 1.1, sage_soft)
            if progress > 0.5:
                K.draw_check(draw, 1500, 350, 36, sage)
            K.text_at(draw, "Route drawn!", 1350, 666, font(56, bold=True), sage)
            K.pill(draw, 1350, 750, "OUTPUT = the route", sage, size=36)
            return True
        # voice
        map_view(draw, box, t, coral, route=1.0, car=0.15 + 0.3 * progress)
        bx0, by0, bx1, _ = box
        draw.rectangle((bx0, by0, bx1, by0 + 86), fill=(13, 148, 136))
        K.draw_arrow(draw, bx0 + 80, by0 + 64, bx0 + 80, by0 + 30, (255, 255, 255), width=10, head=0)
        K.draw_arrow(draw, bx0 + 84, by0 + 30, bx0 + 34, by0 + 30, (255, 255, 255), width=10, head=24)
        draw.text((bx0 + 120, by0 + 22), "200 m", fill=(255, 255, 255), font=font(36, bold=True))
        K.sound_waves(draw, bx1 + 40, 470, 1.2, sage, t)
        K.draw_bubble(draw, (990, 320, 1760, 500), brand, "\"Turn left in 200 metres!\"", tail="left", size=46)
        K.pill(draw, 1375, 600, "Spoken direction = OUTPUT too", sage, size=36)
        draw.rounded_rectangle((1000, 760, 1760, 830), radius=35, fill=ROAD_GREY)
        K.draw_dashed(draw, 1040, 795, 1720, 795, (255, 255, 255), width=6, dash=30, gap=22, phase=t * 200)
        car(draw, K.lerp(1180, 1560, progress), 740, 0.6, K.ROAD)
        return True

    # ---- camera app -----------------------------------------------------------
    if visual == "a17-camera":
        if focus == "fav":
            K.text_at(draw, "Your favourite app", cx, 222, font(52, bold=True), ink)
            for i, kind in enumerate(("game", "music", "draw", "video")):
                a = K.stagger(progress, i, step=0.08, speed=5)
                if a > 0:
                    app_icon(draw, cx + (i - 1.5) * 260, 370 + int((1 - a) * 30), 130 * (0.8 + 0.2 * a), kind)
            for k, (lab, col, soft) in enumerate((("What goes IN?", coral, coral_soft),
                                                  ("What comes OUT?", sage, sage_soft))):
                x0 = 300 if k == 0 else 1020
                draw.rounded_rectangle((x0, 480, x0 + 600, 820), radius=40, fill=soft, outline=col, width=5)
                K.text_at(draw, lab, x0 + 300, 520, font(48, bold=True), col)
                K.text_at(draw, "?", x0 + 300, 590, font(int(150 + 20 * pulse), bold=True), col)
            K.draw_stopwatch(draw, cx, 660, 44, progress, brand)
            return True
        cur = {"input": 0, "process": 1, "output": 2}[focus]
        strip(cur)
        box = phone(draw, 560, 580, 0.93)
        if focus == "input":
            press = (t * 3) % 1
            sx, sy = camera_view(draw, box, t, coral, pressed=press)
            K.text_at(draw, "Press the button", 1350, 330, font(54, bold=True), ink)
            draw.ellipse((1350 - 110, 520 - 110, 1350 + 110, 520 + 110), fill=K.DEV_DARK)
            draw.ellipse((1350 - 92, 520 - 92, 1350 + 92, 520 + 92), outline=(255, 255, 255), width=12)
            draw.ellipse((1350 - 70, 520 - 70, 1350 + 70, 520 + 70), fill=coral)
            finger(draw, 1380, 540, 0.9, press=press, coral=coral)
            K.pill(draw, 1350, 780, "INPUT", coral, size=40)
            return True
        if focus == "process":
            camera_view(draw, box, t, coral, saving=True)
            draw.ellipse((1250 - 150, 470 - 150, 1250 + 150, 470 + 150), fill=lav_soft)
            gears(draw, 1250, 470, 0.9, t, hole=lav_soft)
            K.draw_arrow(draw, 1420, 470, 1500, 470, muted, width=10, head=26)
            fill = K.clamp01(progress * 1.4)
            draw.rounded_rectangle((1520, 380, 1720, 560), radius=16, fill=panel, outline=ink, width=4)
            ih = (560 - 380 - 24) * fill
            if ih > 4:
                friend_scene(draw, (1532, 392, 1708, 392 + ih), t)
            K.text_at(draw, "Saving the picture…", 1400, 650, font(46, bold=True), ink)
            K.pill(draw, 1400, 730, "PROCESS", K.BOTH_COLOR, size=40)
            return True
        camera_view(draw, box, t, coral, photo=True)
        a = K.ease_out_cubic(K.clamp01(progress * 2.5))
        pb = (1180, 300 + int((1 - a) * 40), 1540, 700 + int((1 - a) * 40))
        draw.rectangle((pb[0] + 10, pb[1] + 12, pb[2] + 10, pb[3] + 12), fill=K.SHADOW)
        draw.rectangle(pb, fill=panel, outline=line, width=3)
        friend_scene(draw, (pb[0] + 20, pb[1] + 20, pb[2] - 20, pb[3] - 90), t)
        K.text_at(draw, "Cheese!", (pb[0] + pb[2]) / 2, pb[3] - 72, font(44, bold=True), coral)
        K.pill(draw, 1360, 770, "OUTPUT = the photo", sage, size=38)
        if progress > 0.5:
            for k, (sx, sy) in enumerate(((1100, 380), (1630, 400), (1110, 620), (1620, 640))):
                K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                            [coral, sage, K.BOTH_COLOR, K.GOLD][k], rot=progress * 3 + k)
        return True

    # ---- quiz app: find the process ------------------------------------------
    if visual == "a17-quiz":
        if focus == "intro":
            box = phone(draw, 620, 570, 1.0)
            quiz_view(draw, box, ink, coral, sage, "idle", t)
            K.text_at(draw, "Detective time!", 1330, 270, font(72, bold=True), coral)
            K.draw_magnifier(draw, 1300, 520 + bounce, 1.4, coral)
            K.pill(draw, 1330, 760, "Spot the 3 steps", K.BOTH_COLOR, size=38)
            return True

        def icons(i, x, y):
            st = ["tap", "check", "tick"][i]
            answer_button(draw, x, y - 50, 1.0, ink, st, sage, coral, t)
            if i == 0:
                finger(draw, x + 60, y - 20, 0.7, press=(t * 3) % 1, coral=coral)
            elif i == 1:
                K.draw_magnifier(draw, x + 30 + 20 * math.sin(t * 9), y + 70, 0.75, K.GOLD)
            else:
                K.draw_check(draw, x, y + 100, 56, sage)
        labels = ["Tap an answer", "App checks it", "Green tick!"]
        cols = [c for _, c, _ in IPO]
        if focus == "steps":
            three_cards(labels, cols, shown=progress * 3.2 + 0.3, icons=icons, badges=["1", "2", "3"])
            return True
        if focus == "ask":
            three_cards(labels, [muted, muted, muted], y0=310, y1=830, icons=icons, badges=["A", "B", "C"])
            K.pill(draw, cx - 40, 222, "Which one is the PROCESS?", K.BOTH_COLOR, size=34)
            K.draw_stopwatch(draw, cx + 400, 254, 34, progress, brand)
            return True
        three_cards(labels, cols, y0=310, y1=830, icons=icons, badges=[l for l, _, _ in IPO],
                    states=["normal", "win", "normal"])
        K.pill(draw, cx, 222, "Process = checking!", sage, size=34)
        return True

    # ---- patterns in video apps ----------------------------------------------
    if visual == "a17-pattern":
        if focus == "watch":
            K.draw_person(draw, 320, 520, 1.2, "kid", t)
            K.draw_heart(draw, 400, 360 + bounce, 26, coral)
            box = tablet(draw, 880, 520, 0.95)
            bx0, by0, bx1, by1 = box
            thumb(draw, (bx0, by0, bx1, by1 - 34), "cricket")
            draw.rectangle((bx0, by1 - 34, bx1, by1), fill=K.DEV_DEEP)
            draw.rounded_rectangle((bx0 + 20, by1 - 20, bx1 - 20, by1 - 12), radius=4, fill=(120, 128, 140))
            draw.rounded_rectangle((bx0 + 20, by1 - 20, bx0 + 20 + (bx1 - bx0 - 40) * t, by1 - 12), radius=4,
                                   fill=K.DANGER)
            K.text_at(draw, "Watched", 1540, 236, font(36, bold=True), muted)
            for k in range(3):
                a = K.stagger(progress, k, step=0.25, speed=4)
                if a <= 0:
                    continue
                y = 296 + k * 190 + int((1 - a) * 30)
                thumb(draw, (1380, y, 1700, y + 160), "cricket")
                K.pill(draw, 0, y + 50, str(k + 1), coral, size=30, left=1300 - 40)
            return True
        if focus == "notice":
            for k in range(5):
                a = K.stagger(progress, k, step=0.08, speed=5)
                if a <= 0:
                    continue
                x0 = 260 + k * 290
                thumb(draw, (x0, 280 + int((1 - a) * 30), x0 + 250, 440 + int((1 - a) * 30)), "cricket")
            mx = 360 + 1150 * K.clamp01(progress * 1.3)
            K.draw_magnifier(draw, mx, 370, 0.7, K.BOTH_COLOR)
            draw.line((280, 520, 1640, 520), fill=K.BOTH_COLOR, width=8)
            draw.line((280, 500, 280, 520), fill=K.BOTH_COLOR, width=8)
            draw.line((1640, 500, 1640, 520), fill=K.BOTH_COLOR, width=8)
            K.text_at(draw, "again… and again… and again", cx, 548, font(40, bold=True), muted)
            a = K.stagger(progress, 5, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, cx, 660 + int((1 - a) * 30), "PATTERN", K.BOTH_COLOR, size=72)
            return True
        if focus == "suggest":
            box = tablet(draw, 660, 560, 1.0)
            bx0, by0, bx1, by1 = box
            draw.text((bx0 + 24, by0 + 16), "Up next for you", fill=ink, font=font(32, bold=True))
            for k in range(3):
                a = K.stagger(progress, k, step=0.1, speed=5)
                if a <= 0:
                    continue
                y = by0 + 70 + k * 92
                thumb(draw, (bx0 + 24, y, bx0 + 164, y + 78), "cricket")
                draw.rounded_rectangle((bx0 + 190, y + 14, bx1 - 60, y + 30), radius=8, fill=K.DEV_MID)
                draw.rounded_rectangle((bx0 + 190, y + 44, bx1 - 160, y + 58), radius=7, fill=line)
            rows = [("Reads your mind", False), ("Picks at random", False), ("Noticed your pattern", True)]
            for k, (lab, ok) in enumerate(rows):
                a = K.stagger(progress, k + 2, step=0.14, speed=4)
                if a <= 0:
                    continue
                y = 300 + k * 170 + int((1 - a) * 30)
                col = sage if ok else K.DANGER
                draw.rounded_rectangle((1110, y, 1790, y + 130), radius=40, fill=sage_soft if ok else K.DANGER_SOFT,
                                       outline=col, width=5)
                (K.draw_check if ok else K.draw_cross)(draw, 1180, y + 65, 36, col)
                draw.text((1240, y + 40), lab, fill=ink if ok else muted, font=font(44, bold=True))
            return True
        # ai
        draw.ellipse((560 - 250, 560 - 250, 560 + 250, 560 + 250), fill=blue_soft)
        K.draw_robot(draw, 560, 610, 0.9, t, mood="happy", wave=t)
        K.shadow_card(draw, (960, 290 + lift, 1740, 780 + lift), brand, radius=40, accent=sage)
        K.text_at(draw, "COMING UP LATER", 1350, 364 + lift, font(34, bold=True), sage)
        K.text_at(draw, "AI", 1350, 410 + lift, font(150, bold=True), coral)
        K.text_at(draw, "Apps that notice patterns", 1350, 620 + lift, font(40, bold=True), ink)
        for k in range(5):
            x = 1350 + (k - 2) * 80
            r = 22 if k % 2 == 0 else 14
            draw.ellipse((x - r, 715 + lift - r, x + r, 715 + lift + r), fill=[coral, K.BOTH_COLOR][k % 2])
        return True

    # ---- apps decide, you choose ------------------------------------------------
    if visual == "a17-decide":
        if focus == "ask":
            K.shadow_card(draw, (240, 250 + lift, w - 240, 520 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "TRUE OR FALSE?", cx, 312 + lift, font(34, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "\"Apps never decide", cx, 370 + lift, font(58, bold=True), ink)
            K.text_at(draw, "anything for you.\"", cx, 440 + lift, font(58, bold=True), ink)
            for k, (lab, col) in enumerate((("TRUE", sage), ("FALSE", K.DANGER))):
                x = cx + (k * 2 - 1) * 280
                draw.rounded_rectangle((x - 190 + 8, 590 + 10, x + 190 + 8, 720 + 10), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x - 190, 590, x + 190, 720), radius=40, fill=col)
                K.text_at(draw, lab, x, 618, font(60, bold=True), panel)
            K.draw_stopwatch(draw, cx, 790, 42, progress, brand)
            return True
        if focus == "answer":
            K.pill(draw, cx, 222, "FALSE!", K.DANGER, size=40)
            for k, (title, col) in enumerate((("Maps picks a road", ROUTE), ("Video app picks next", K.DANGER))):
                a = K.stagger(progress, k, step=0.35, speed=4)
                if a <= 0:
                    continue
                x0 = 160 if k == 0 else 990
                yy = int((1 - a) * 40)
                K.shadow_card(draw, (x0, 310 + yy, x0 + 770, 860 + yy), brand, radius=36, accent=col)
                K.text_at(draw, title, x0 + 385, 384 + yy, font(42, bold=True), ink)
                mx = x0 + 385
                if k == 0:
                    for end, hot in (((mx - 190, 520), False), ((mx + 190, 520), True)):
                        draw.line([(mx, 820 + yy), (mx, 680 + yy), (end[0], end[1] + yy)], fill=ROAD_GREY, width=56,
                                  joint="curve")
                    draw.line([(mx, 820 + yy), (mx, 680 + yy), (mx + 190, 520 + yy)], fill=ROUTE, width=18, joint="curve")
                    K.draw_map_pin(draw, mx + 190, 510 + yy, 0.6, coral)
                    K.draw_star(draw, mx + 110, 560 + yy, 26 + 4 * pulse, K.GOLD, rot=t * 3)
                else:
                    thumb(draw, (mx - 220, 470 + yy, mx + 220, 720 + yy), "cricket")
                    K.pill(draw, mx, 750 + yy, "Up next", K.DANGER, size=32)
            return True
        # choose
        K.draw_person(draw, 420, 530, 1.3, "kid", t)
        crown_y = 530 - 64 * 1.3 - 30 + 6 * 1.3 * math.sin(t * math.pi * 4)
        draw.polygon([(360, crown_y + 40), (360, crown_y), (390, crown_y + 22), (420, crown_y - 12), (450, crown_y + 22),
                      (480, crown_y), (480, crown_y + 40)], fill=K.GOLD)
        opts = [("Road 1", "suggested", False), ("Road 2", "my choice!", True)]
        for k, (lab, sub, mine) in enumerate(opts):
            a = K.stagger(progress, k, step=0.25, speed=4)
            if a <= 0:
                continue
            y = 290 + k * 210 + int((1 - a) * 30)
            col = sage if mine else line
            draw.rounded_rectangle((860 + 8, y + 10, 1680 + 8, y + 170 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((860, y, 1680, y + 170), radius=40, fill=sage_soft if mine else panel, outline=col,
                                   width=6 if mine else 3)
            draw.text((920, y + 36), lab, fill=ink, font=font(56, bold=True))
            draw.text((1180, y + 54), sub, fill=sage if mine else muted, font=font(38, bold=True))
            if not mine:
                K.draw_star(draw, 1610, y + 85, 30, K.GOLD, rot=0.3)
            elif progress > 0.45:
                K.draw_check(draw, 1610, y + 85, 34, sage)
        if progress > 0.35:
            finger(draw, 1500, 600, 0.55, press=(t * 3) % 1, coral=coral)
        a = K.ease_out_cubic(K.clamp01((progress - 0.6) * 4))
        if a > 0:
            K.pill(draw, 1270, 770 + int((1 - a) * 20), "You're the boss!", coral, size=40)
        return True

    # ---- checkpoint -------------------------------------------------------------
    if visual == "a17-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Input? Output?", cx, 450 + lift, font(68, bold=True), ink)
            app_icon(draw, cx, 630 + lift, 120, "maps")
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((140 + 10, 230 + 12, 1060 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((140, 230, 1060, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "Maps app", 600, 258, font(48, bold=True), coral)
        rows = [("INPUT", coral, "The place you type in", "like India Gate"),
                ("OUTPUT", sage, "The route on the map", "and the directions it says")]
        for k, (lab, col, main, extra) in enumerate(rows):
            y = 350 + k * 250
            K.pill(draw, 0, y, lab, col, size=32, left=190)
            shown = ans and progress * 2.6 - 0.3 > k
            draw.line((200, y + 196, 1010, y + 196), fill=(220, 210, 232), width=3)
            if shown:
                draw.text((200, y + 82), main, fill=ink, font=font(48, bold=True))
                draw.text((200, y + 146), extra, fill=muted, font=font(36, bold=True))
                K.draw_check(draw, 980, y + 30, 26, col)
            else:
                K.text_at(draw, "?", 600, y + 90, font(80, bold=True), line)
        box = phone(draw, 1440, 590, 0.95)
        if ans:
            map_view(draw, box, t, coral, route=K.clamp01((progress - 0.35) * 2))
            search_bar(draw, box, "India Gate", 1.0, 0.0, ink, coral)
        else:
            map_view(draw, box, t, coral, route=0.0, pin=False)
            search_bar(draw, box, "", 1.0, t, ink, coral)
            K.pill(draw, 1440, 226, "Pause & try!", coral, size=34)
            K.draw_stopwatch(draw, 1170, 262, 34, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "a17-recap":
        recap = [(("Every app has", "3 steps"), coral, "ipo"), (("Maps: place in,", "route out"), ROUTE, "maps"),
                 (("Apps notice", "patterns"), K.BOTH_COLOR, "pattern"), (("Apps suggest,", "you choose!"), sage, "choose")]
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
                if kind == "ipo":
                    for k in range(3):
                        yy = iy - 110 + k * 82
                        draw.rounded_rectangle((ix - 120, yy, ix + 120, yy + 62), radius=31, fill=IPO[k][1])
                        K.text_at(draw, IPO[k][0], ix, yy + 13, font(28, bold=True), panel)
                elif kind == "maps":
                    pb = phone(draw, ix, iy, 0.42)
                    map_view(draw, pb, t, coral, route=1.0)
                elif kind == "pattern":
                    for k in range(3):
                        thumb(draw, (ix - 110 + k * 16, iy - 110 + k * 60, ix + 70 + k * 16, iy - 10 + k * 60), "cricket")
                else:
                    for k in range(2):
                        yy = iy - 80 + k * 100
                        draw.rounded_rectangle((ix - 130, yy, ix + 130, yy + 80), radius=30,
                                               fill=sage_soft if k else panel, outline=sage if k else line, width=4)
                        K.text_at(draw, f"Road {k + 1}", ix - 20, yy + 20, font(32, bold=True), ink)
                        if k:
                            K.draw_check(draw, ix + 92, yy + 40, 22, sage)
                        else:
                            K.draw_star(draw, ix + 92, yy + 40, 22, K.GOLD)
                f = font(36, bold=True)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 46, f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            box = phone(draw, cx + 300, 440, 0.6)
            app_grid(box)
            K.text_at(draw, "Chapter 2 done!", cx, 660, font(68, bold=True), ink)
            K.pill(draw, cx, 760, "Input · Process · Output", coral, size=36)
            stars_around(320, 540, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
