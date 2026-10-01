"""B14 · Faces, Filters, and Fun — visuals."""
import math

import build as K

WHITE = (255, 255, 255)
SKIN_SHADE = (224, 172, 134)
LIP = (190, 70, 60)
EAR_BROWN = (178, 120, 74)
EAR_DARK = (128, 80, 46)
TONGUE = (242, 112, 142)
GLASS = (40, 44, 56)
BUNNY_PINK = (255, 190, 206)
SCREEN_BG = (226, 240, 250)
DIM_BG = (70, 76, 96)
PARTY = (255, 196, 70)
WAND = (123, 97, 214)
SHIRTS = {"kabir": (72, 118, 214), "meera": (13, 148, 136), "pari": (255, 106, 26), "nani": (206, 110, 160),
          "papa": (52, 60, 76)}


def S_(s):
    return lambda v: v * s


def shade(col, k):
    return tuple(max(0, min(255, int(c * k))) for c in col)


def big_face(draw, cx, cy, r, who="kabir", turn=0.0, dim=False, base=None, mood="smile"):
    """Large kid face; r = half face width, face spans cy-1.12r..cy+r. Returns face points."""
    k = 0.62 if dim else 1.0
    skin = shade(K.SKIN, k)
    hair = shade(K.HAIR, 1.0)
    tx = turn * r * 0.28
    if base is not None:
        shirt = shade(SHIRTS.get(who, K.ROAD), k)
        draw.rectangle((cx - r * 0.28, cy + r * 0.6, cx + r * 0.28, cy + r * 1.1), fill=shade(SKIN_SHADE, k))
        draw.chord((cx - r * 1.35, cy + r * 0.86, cx + r * 1.35, cy + r * 1.9), 180, 360, fill=shirt)
        if base > cy + r * 1.37:
            draw.rectangle((cx - r * 1.35, cy + r * 1.37, cx + r * 1.35, base), fill=shirt)
    if who in ("meera", "nani"):
        hc = (205, 205, 210) if who == "nani" else hair
        draw.rounded_rectangle((cx - r * 1.18 + tx * 0.3, cy - r * 1.08, cx + r * 1.18 + tx * 0.3, cy + r * 1.1),
                               radius=r * 0.9, fill=shade(hc, k))
    if who == "pari":
        for sx in (-1, 1):
            px = cx + sx * r * 0.92 + tx * 0.3
            draw.ellipse((px - r * 0.36, cy - r * 1.2, px + r * 0.36, cy - r * 0.5), fill=hair)
    for sx in (-1, 1):
        ex = cx + sx * r * 0.96 - tx * 0.4
        draw.ellipse((ex - r * 0.17, cy - r * 0.2, ex + r * 0.17, cy + r * 0.26), fill=shade(SKIN_SHADE, k))
    draw.ellipse((cx - r, cy - r * 1.12, cx + r, cy + r), fill=skin)
    if who == "nani":
        draw.chord((cx - r * 1.02, cy - r * 1.18, cx + r * 1.02, cy - r * 0.2), 180, 360, fill=shade((205, 205, 210), k))
    elif who == "meera":
        for sx in (-1, 1):
            draw.chord((cx - r * 1.02 + (sx > 0) * r * 0.9 + tx * 0.4, cy - r * 1.18,
                        cx + r * 0.12 + (sx > 0) * r * 0.9 + tx * 0.4, cy - r * 0.18), 180, 360, fill=hair)
    else:
        draw.chord((cx - r * 1.04, cy - r * 1.22, cx + r * 1.04, cy - r * 0.16), 180, 360, fill=hair)
        draw.polygon([(cx - r * 0.3 + tx, cy - r * 0.62), (cx + r * 0.1 + tx, cy - r * 0.86),
                      (cx + r * 0.5 + tx, cy - r * 0.6), (cx + r * 0.2 + tx, cy - r * 0.8)], fill=hair)
    ey = cy - r * 0.08
    eyes = []
    for sx in (-1, 1):
        ex = cx + sx * r * 0.38 + tx
        eyes.append(ex)
        draw.ellipse((ex - r * 0.17, ey - r * 0.13, ex + r * 0.17, ey + r * 0.13), fill=shade(WHITE, k))
        px = ex + tx * 0.2
        draw.ellipse((px - r * 0.085, ey - r * 0.095, px + r * 0.085, ey + r * 0.095), fill=K.DEV_DEEP)
        draw.ellipse((px - r * 0.02, ey - r * 0.07, px + r * 0.03, ey - r * 0.02), fill=shade(WHITE, k))
        draw.arc((ex - r * 0.2, ey - r * 0.4, ex + r * 0.2, ey - r * 0.12), 210, 330, fill=hair,
                 width=max(2, int(r * 0.06)))
    nx, ny = cx + tx * 1.3, cy + r * 0.24
    draw.arc((nx - r * 0.1, ny - r * 0.12, nx + r * 0.1, ny + r * 0.06), 20, 160, fill=shade(SKIN_SHADE, 0.85),
             width=max(2, int(r * 0.05)))
    mx, my = cx + tx * 1.1, cy + r * 0.52
    if mood == "open":
        draw.chord((mx - r * 0.3, my - r * 0.18, mx + r * 0.3, my + r * 0.22), 0, 180, fill=LIP)
    elif mood == "flat":
        draw.line((mx - r * 0.18, my, mx + r * 0.18, my), fill=LIP, width=max(2, int(r * 0.06)))
    else:
        draw.arc((mx - r * 0.3, my - r * 0.2, mx + r * 0.3, my + r * 0.16), 20, 160, fill=LIP,
                 width=max(2, int(r * 0.07)))
    for sx in (-1, 1):
        bx = cx + sx * r * 0.62 + tx
        draw.ellipse((bx - r * 0.12, cy + r * 0.24, bx + r * 0.12, cy + r * 0.38), fill=shade((248, 170, 160), k))
    if who == "meera":
        draw.ellipse((cx + tx - r * 0.05, cy - r * 0.4, cx + tx + r * 0.05, cy - r * 0.3), fill=K.DANGER)
    if who == "papa":
        draw.chord((nx - r * 0.3, ny + r * 0.04, nx + r * 0.3, ny + r * 0.3), 180, 360, fill=hair)
    return {
        "eyeLo": (eyes[0] - r * 0.17, ey), "eyeLi": (eyes[0] + r * 0.17, ey),
        "eyeRi": (eyes[1] - r * 0.17, ey), "eyeRo": (eyes[1] + r * 0.17, ey),
        "eyeL": (eyes[0], ey), "eyeR": (eyes[1], ey),
        "nose": (nx, ny + r * 0.02), "mouthL": (mx - r * 0.3, my), "mouthR": (mx + r * 0.3, my), "mouth": (mx, my),
        "top": (cx + tx * 0.5, cy - r * 1.12), "headL": (cx - r * 0.62 + tx * 0.5, cy - r * 0.94),
        "headR": (cx + r * 0.62 + tx * 0.5, cy - r * 0.94), "chin": (cx + tx * 0.6, cy + r),
    }


POINT_KEYS = ["eyeLo", "eyeLi", "eyeRi", "eyeRo", "nose", "mouthL", "mouthR", "top", "headL", "headR", "chin"]


def face_points(draw, pts, r, shown=99.0, col=K.CORAL, keys=None):
    keys = keys or POINT_KEYS
    pr = max(5, r * 0.07)
    for i, key in enumerate(keys):
        a = K.clamp01(shown - i)
        if a <= 0:
            continue
        x, y = pts[key]
        rr = pr * (0.4 + 0.6 * a)
        draw.ellipse((x - rr - 3, y - rr - 3, x + rr + 3, y + rr + 3), fill=WHITE)
        draw.ellipse((x - rr, y - rr, x + rr, y + rr), fill=col)


def puppy(draw, pts, r, a=1.0, tongue=True, nose=True):
    if a <= 0:
        return
    er = r * 0.46 * a
    for side, key in ((-1, "headL"), (1, "headR")):
        hx, hy = pts[key]
        ox = hx + side * er * 0.55
        draw.ellipse((ox - er * 0.62, hy - er * 0.7, ox + er * 0.62, hy + er * 1.45), fill=EAR_BROWN)
        draw.ellipse((ox - er * 0.34, hy - er * 0.3, ox + er * 0.34, hy + er * 1.1), fill=EAR_DARK)
    if not nose:
        return
    nx, ny = pts["nose"]
    nr = r * 0.13 * a
    draw.ellipse((nx - nr * 1.2, ny - nr * 0.9, nx + nr * 1.2, ny + nr * 0.8), fill=K.DEV_DEEP)
    draw.ellipse((nx - nr * 0.5, ny - nr * 0.6, nx - nr * 0.05, ny - nr * 0.2), fill=WHITE)
    if tongue:
        mx, my = pts["mouth"]
        tw, th = r * 0.15 * a, r * 0.44 * a
        draw.rounded_rectangle((mx - tw, my - r * 0.02, mx + tw, my + th), radius=tw, fill=TONGUE)
        draw.line((mx, my + r * 0.04, mx, my + th * 0.7), fill=shade(TONGUE, 0.8), width=max(2, int(r * 0.03)))


def glasses(draw, pts, r, a=1.0, at=None, col=GLASS):
    if a <= 0:
        return
    (lx, ly), (rx, ry) = at or (pts["eyeL"], pts["eyeR"])
    gr = r * 0.25 * a
    gw = max(2, int(r * 0.06))
    for x, y in ((lx, ly), (rx, ry)):
        draw.ellipse((x - gr, y - gr * 0.85, x + gr, y + gr * 0.85), outline=col, width=gw)
        draw.arc((x - gr * 0.6, y - gr * 0.55, x + gr * 0.2, y + gr * 0.2), 200, 260, fill=WHITE, width=max(2, gw // 2))
    draw.line((lx + gr, ly, rx - gr, ry), fill=col, width=gw)
    draw.line((lx - gr, ly - gr * 0.2, lx - gr - r * 0.3 * a, ly - gr * 0.3), fill=col, width=gw)
    draw.line((rx + gr, ry - gr * 0.2, rx + gr + r * 0.3 * a, ry - gr * 0.3), fill=col, width=gw)


def bunny(draw, pts, r, a=1.0, ghost=False):
    if a <= 0:
        return
    for side, key in ((-1, "headL"), (1, "headR")):
        hx, hy = pts[key]
        bx = hx + side * r * 0.08
        box = (bx - r * 0.2 * a, hy - r * 1.05 * a, bx + r * 0.2 * a, hy + r * 0.08)
        if ghost:
            draw.ellipse(box, outline=K.STEEL, width=max(2, int(r * 0.03)))
            continue
        draw.ellipse(box, fill=WHITE, outline=(220, 214, 224), width=max(2, int(r * 0.03)))
        draw.ellipse((bx - r * 0.1 * a, hy - r * 0.9 * a, bx + r * 0.1 * a, hy - r * 0.04), fill=BUNNY_PINK)


def crown(draw, pts, r, a=1.0):
    if a <= 0:
        return
    tx, ty = pts["top"]
    cw, ch = r * 0.62 * a, r * 0.42 * a
    base = ty + r * 0.08
    pts_ = [(tx - cw, base), (tx - cw, base - ch * 0.6), (tx - cw * 0.5, base - ch * 0.2), (tx, base - ch),
            (tx + cw * 0.5, base - ch * 0.2), (tx + cw, base - ch * 0.6), (tx + cw, base)]
    draw.polygon(pts_, fill=K.GOLD)
    for gx in (tx - cw * 0.5, tx, tx + cw * 0.5):
        draw.ellipse((gx - r * 0.05, base - ch * 0.35 - r * 0.05, gx + r * 0.05, base - ch * 0.35 + r * 0.05),
                     fill=K.DANGER)


def detect_box(draw, cx, cy, r, a=1.0, col=K.CORAL, phase=0.0):
    if a <= 0:
        return
    x0, y0, x1, y1 = cx - r * 1.3, cy - r * 1.4, cx + r * 1.3, cy + r * 1.18
    sc = 1.25 - 0.25 * a
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    x0, x1 = mx + (x0 - mx) * sc, mx + (x1 - mx) * sc
    y0, y1 = my + (y0 - my) * sc, my + (y1 - my) * sc
    L = r * 0.4
    wd = max(3, int(r * 0.06))
    for px, py, dx, dy in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        draw.line((px, py, px + dx * L, py), fill=col, width=wd)
        draw.line((px, py, px, py + dy * L), fill=col, width=wd)
    for (ax, ay, bx, by) in ((x0 + L, y0, x1 - L, y0), (x0 + L, y1, x1 - L, y1), (x0, y0 + L, x0, y1 - L),
                             (x1, y0 + L, x1, y1 - L)):
        K.draw_dashed(draw, ax, ay, bx, by, col, width=max(2, wd // 2), dash=14, gap=12, phase=phase)


def phone(draw, cx, cy, wd, ht, screen=SCREEN_BG):
    x0, y0, x1, y1 = cx - wd / 2, cy - ht / 2, cx + wd / 2, cy + ht / 2
    rad = wd * 0.13
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=rad, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=rad, fill=K.DEV_DARK)
    sb = (x0 + 16, y0 + 16, x1 - 16, y1 - 16)
    draw.rounded_rectangle(sb, radius=rad - 10, fill=screen)
    draw.rounded_rectangle((cx - wd * 0.12, y0 + 22, cx + wd * 0.12, y0 + 40), radius=9, fill=K.DEV_DARK)
    return sb


def phone_face(draw, cx, cy, wd, ht, who="kabir", turn=0.0, dim=False, screen=SCREEN_BG, mood="smile"):
    """Phone with a face filling the screen. Returns (pts, r, screen box)."""
    sb = phone(draw, cx, cy, wd, ht, screen=DIM_BG if dim else screen)
    r = wd * 0.27
    fy = cy - ht * 0.02
    pts = big_face(draw, cx, fy, r, who, turn=turn, dim=dim, base=sb[3] - 8, mood=mood)
    return pts, r, sb


def tile(draw, box, who, bg, t=0.0, extra=None):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=22, fill=bg)
    r = (x1 - x0) * 0.2
    cxx = (x0 + x1) / 2
    pts = big_face(draw, cxx, y0 + (y1 - y0) * 0.5, r, who, turn=0.15 * math.sin(t * 6 + x0), base=y1 - 6,
                   mood="open" if extra == "laugh" else "smile")
    if extra == "hat":
        tx, ty = pts["top"]
        draw.polygon([(tx - r * 0.45, ty + r * 0.1), (tx + r * 0.45, ty + r * 0.1), (tx + r * 0.05, ty - r * 0.85)],
                     fill=PARTY)
        draw.ellipse((tx - r * 0.04, ty - r * 0.98, tx + r * 0.14, ty - r * 0.8), fill=K.CORAL)
    return pts, r


def mini_artist(draw, cx, cy, s, t=0.0):
    S = S_(s)
    K.draw_person(draw, cx, cy, s, "mystery", t)
    hx, hy = cx + S(110), cy + S(30) - S(30) * math.sin(t * 14)
    draw.line((cx + S(70), cy + S(90), hx, hy), fill=K.STEEL_DARK, width=max(3, int(S(14))))
    draw.line((hx, hy, hx + S(50), hy - S(70)), fill=(196, 140, 92), width=max(3, int(S(10))))
    draw.polygon([(hx + S(44), hy - S(66)), (hx + S(64), hy - S(80)), (hx + S(70), hy - S(100)),
                  (hx + S(52), hy - S(92))], fill=K.CORAL)


def wand(draw, cx, cy, s, t=0.0):
    S = S_(s)
    draw.line((cx - S(80), cy + S(80), cx + S(40), cy - S(40)), fill=K.DEV_DARK, width=max(3, int(S(16))))
    draw.line((cx + S(20), cy - S(20), cx + S(40), cy - S(40)), fill=WHITE, width=max(3, int(S(16))))
    K.draw_star(draw, cx + S(60), cy - S(60), S(40), K.GOLD, rot=t * 3)


def hand(draw, x0, y0, wd, ht, k=1.0):
    col = shade(K.SKIN, 0.96 * k)
    out = shade(SKIN_SHADE, 0.9 * k)
    draw.rounded_rectangle((x0, y0 + ht * 0.25, x0 + wd, y0 + ht), radius=wd * 0.3, fill=col, outline=out, width=3)
    fw = wd / 4
    for i in range(4):
        fx = x0 + i * fw
        top = y0 + (0.06 if i in (1, 2) else 0.14) * ht
        draw.rounded_rectangle((fx + 3, top, fx + fw - 3, y0 + ht * 0.55), radius=fw * 0.45, fill=col, outline=out,
                               width=3)
    draw.rounded_rectangle((x0 - wd * 0.28, y0 + ht * 0.5, x0 + wd * 0.2, y0 + ht * 0.72), radius=ht * 0.1, fill=col,
                           outline=out, width=3)


def moon(draw, cx, cy, r, bg):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 236, 170))
    draw.ellipse((cx - r * 0.4, cy - r * 1.05, cx + r * 1.4, cy + r * 0.75), fill=bg)


def polaroid(draw, box, who="kabir", t=0.0, filt="puppy"):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=14, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=14, fill=WHITE, outline=(220, 214, 204), width=3)
    ib = (x0 + 22, y0 + 22, x1 - 22, y1 - (y1 - y0) * 0.2)
    draw.rectangle(ib, fill=SCREEN_BG)
    r = (ib[2] - ib[0]) * 0.22
    pts = big_face(draw, (ib[0] + ib[2]) / 2, ib[1] + (ib[3] - ib[1]) * 0.55, r, who, base=ib[3])
    if filt == "puppy":
        puppy(draw, pts, r)
    elif filt == "bunny":
        bunny(draw, pts, r)
    return pts, r


def post_button(draw, cx, y, label, col):
    return K.pill(draw, cx, y, label, col, size=36)


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

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def steps_list(x0, x1, y0, cur, done_upto, labels, bad=None, gap=170, hgt=136):
        for i, lab in enumerate(labels):
            y = y0 + i * gap
            active = i == cur
            is_bad = bad is not None and i == bad
            dim = bad is not None and i > bad
            fill = K.DANGER_SOFT if is_bad else coral_soft if active else panel
            out = K.DANGER if is_bad else coral if active else line
            draw.rounded_rectangle((x0 + 6, y + 8, x1 + 6, y + hgt + 8), radius=34, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y, x1, y + hgt), radius=34, fill=fill, outline=out, width=5 if active or is_bad else 3)
            col = K.DANGER if is_bad else coral if (active or i <= done_upto) else muted
            draw.ellipse((x0 + 26, y + hgt / 2 - 34, x0 + 94, y + hgt / 2 + 34), fill=col)
            K.text_at(draw, str(i + 1), x0 + 60, y + hgt / 2 - 26, font(44, bold=True), WHITE)
            draw.text((x0 + 120, y + hgt / 2 - 28), lab, fill=muted if dim else ink, font=font(46, bold=True))
            if is_bad:
                K.draw_cross(draw, x1 - 50, y + hgt / 2, 26, K.DANGER)
            elif i <= done_upto and not active:
                K.draw_check(draw, x1 - 50, y + hgt / 2, 26, sage)

    # ---- opening ------------------------------------------------------------------
    if visual == "b14-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 470, 110, sage, panel, bounce)
            pts, r, _ = phone_face(draw, cx + 300, 500, 300, 440, "kabir", turn=0.3 * math.sin(t * 6))
            puppy(draw, pts, r)
            K.text_at(draw, "Welcome back, champ!", cx, 760, font(60, bold=True), ink)
            star_spots([(460, 330), (560, 640), (1560, 330), (1600, 620)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · CHATTING WITH COMPUTERS", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("PREDICTS", coral, coral_soft), ("NO FEELINGS", K.BOTH_COLOR, lav_soft), ("KEEP PRIVATE", sage, sage_soft)]
            for i, (lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 510 + int((1 - a) * 40)
                draw.ellipse((x - 105, y - 105, x + 105, y + 105), fill=soft)
                if i == 0:
                    draw.rounded_rectangle((x - 80, y - 50, x + 80, y + 30), radius=26, fill=panel, outline=coral, width=4)
                    draw.polygon([(x - 50, y + 28), (x - 10, y + 28), (x - 60, y + 66)], fill=coral)
                    for k in range(3):
                        draw.ellipse((x - 44 + k * 34, y - 22, x - 24 + k * 34, y - 2), fill=coral)
                elif i == 1:
                    K.draw_heart(draw, x, y, 54, K.BOTH_COLOR)
                    K.draw_cross(draw, x + 54, y - 52, 24, K.DANGER)
                else:
                    K.draw_padlock(draw, x, y, 0.7, sage)
                K.text_at(draw, lab, x, y + 124, font(34, bold=True), col)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 730 + int((1 - a) * 20), "Patterns, not feelings", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Faces, Filters, and Fun", cx, 360 + lift, font(86, bold=True), ink)
            for i, (who, filt, soft) in enumerate((("kabir", "puppy", coral_soft), ("meera", "glasses", sage_soft),
                                                   ("pari", "crown", lav_soft))):
                a = K.stagger(progress, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 710 + int((1 - a) * 30)
                draw.ellipse((x - 130, y - 130, x + 130, y + 130), fill=soft)
                pts = big_face(draw, x, y + 10, 66, who)
                if filt == "puppy":
                    puppy(draw, pts, 66)
                elif filt == "glasses":
                    glasses(draw, pts, 66)
                else:
                    crown(draw, pts, 66)
            return True
        # word
        sb = phone(draw, cx, 560, 340, 600)
        pts = big_face(draw, cx, 540, 92, "kabir", base=sb[3] - 8, mood="flat")
        for i, (kind, sx, sy) in enumerate((("puppy", 480, 420), ("glasses", 1440, 400), ("crown", 1420, 700))):
            a = K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            bob = 10 * math.sin(t * 8 + i)
            draw.ellipse((sx - 140, sy - 110 + bob, sx + 140, sy + 110 + bob), fill=[coral_soft, sage_soft, lav_soft][i])
            fake = {"headL": (sx - 60, sy - 10 + bob), "headR": (sx + 60, sy - 10 + bob), "nose": (sx, sy + 50 + bob),
                    "mouth": (sx, sy + 80 + bob), "eyeL": (sx - 50, sy + bob), "eyeR": (sx + 50, sy + bob),
                    "top": (sx, sy + 30 + bob)}
            if kind == "puppy":
                puppy(draw, fake, 110, tongue=False)
            elif kind == "glasses":
                glasses(draw, fake, 130)
            else:
                crown(draw, fake, 150)
            K.draw_dashed(draw, sx + (150 if sx < cx else -150), sy + bob, cx + (-190 if sx < cx else 190), 460,
                          line, width=4, phase=t * 100)
        question_marks([(cx - 270, 600), (cx + 250, 560)], size=70)
        return True

    # ---- Kabir's birthday call ------------------------------------------------------
    family = [("meera", "hat", coral_soft), ("nani", None, lav_soft), ("papa", None, blue_soft), ("pari", None, sage_soft)]

    def call_grid(x0, y0, tw, th, laugh=False):
        for i, (who, extra, soft) in enumerate(family):
            r_, c_ = divmod(i, 2)
            bx = (x0 + c_ * (tw + 20), y0 + r_ * (th + 20), x0 + c_ * (tw + 20) + tw, y0 + r_ * (th + 20) + th)
            tile(draw, bx, who, soft, t, extra="hat" if extra == "hat" else ("laugh" if laugh else None))
            lab = {"meera": "Meera", "nani": "Nani", "papa": "Papa", "pari": "Pari"}[who]
            K.pill(draw, 0, bx[3] - 50, lab, K.DEV_DARK, size=24, left=bx[0] + 12)

    if visual == "b14-hook":
        if focus == "meet":
            draw.ellipse((540 - 290, 560 - 290, 540 + 290, 560 + 290), fill=blue_soft)
            pts = big_face(draw, 540, 520, 150, "kabir", base=850, turn=0.1 * math.sin(t * 6))
            K.text_at(draw, "Meet", 1360, 240 + lift, font(56, bold=True), muted)
            K.text_at(draw, "Kabir!", 1360, 300 + lift, font(120, bold=True), K.ROAD)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                draw.rounded_rectangle((1060, 504 + yy, 1660, 856 + yy), radius=30, fill=K.DEV_DARK)
                call_grid(1076, 520 + yy, 274, 150)
                K.pill(draw, 1360, 446 + yy, "Meera's birthday call", coral, size=28)
            return True
        if focus in ("ears", "turn"):
            turn = math.sin(t * math.pi * 4) if focus == "turn" else 0.0
            pts, r, sb = phone_face(draw, 600, 560, 420, 620, "kabir", turn=turn, mood="open")
            a = K.ease_out_cubic(K.clamp01(progress * 2.5)) if focus == "ears" else 1.0
            puppy(draw, pts, r, a)
            if focus == "ears":
                if a > 0.5:
                    K.pill(draw, 910, 420, "Pop!", coral, size=40)
                    star_spots([(900, 320), (910, 600)])
                draw.rounded_rectangle((1010, 270, 1790, 830), radius=30, fill=K.DEV_DARK)
                call_grid(1030, 290, 360, 250, laugh=True)
            else:
                K.draw_arrow(draw, 370, 560, 250, 560, coral, width=10, head=28)
                K.draw_arrow(draw, 830, 560, 950, 560, coral, width=10, head=28)
                frames = [-1.0, 0.0, 1.0]
                for i, tv in enumerate(frames):
                    x = 1100 + i * 250
                    sbm = phone(draw, x, 560, 200, 300)
                    mr = 46
                    mp = big_face(draw, x, 560, mr, "kabir", turn=tv, base=sbm[3] - 6, mood="open")
                    puppy(draw, mp, mr)
                    if i < 2:
                        K.draw_arrow(draw, x + 106, 560, x + 144, 560, muted, width=6, head=14)
                K.pill(draw, 1350, 760, "The ears stay on his head!", sage, size=34)
            return True
        if focus == "why":
            sb = phone(draw, cx, 560, 420, 620)
            pts = big_face(draw, cx - 30, 470, 80, "kabir", base=sb[3] - 8)
            puppy(draw, pts, 80, a=0.4 + 0.6 * K.clamp01(progress * 1.5))
            mini_artist(draw, cx + 70, 640, 0.6, t)
            question_marks([(560, 330), (1360, 300), (560, 620), (1360, 600)], size=96)
            K.draw_stopwatch(draw, 1640, 780, 46, progress, brand)
            return True
        # tease
        for k, (lab, kind) in enumerate((("Tiny artist?", "artist"), ("Magic?", "magic"))):
            y0 = 270 + k * 290
            draw.rounded_rectangle((160 + 8, y0 + 10, 720 + 8, y0 + 250 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((160, y0, 720, y0 + 250), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            if kind == "artist":
                mini_artist(draw, 290, y0 + 100, 0.55, t)
            else:
                wand(draw, 290, y0 + 130, 0.9, t)
            draw.text((420, y0 + 98), lab, fill=K.DANGER, font=font(44, bold=True))
            a = K.stagger(progress, k + 1, step=0.12, speed=5)
            if a > 0:
                K.draw_cross(draw, 680, y0 + 40, 28 * a, K.DANGER)
        K.draw_arrow(draw, 760, 545, 930, 545, muted, width=10, head=30)
        pts, r, sb = phone_face(draw, 1300, 585, 380, 550, "kabir")
        face_points(draw, pts, r, shown=progress * 16, col=sage)
        K.pill(draw, 1300, 236, "A program finding patterns", sage, size=34)
        return True

    # ---- what is an AR filter -----------------------------------------------------
    if visual == "b14-define":
        if focus == "name":
            pts, r, sb = phone_face(draw, 460, 560, 400, 600, "meera")
            glasses(draw, pts, r)
            crown(draw, pts, r)
            K.shadow_card(draw, (800, 260 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "An AR FILTER is…", 1290, 330 + lift, font(44, bold=True), muted)
            parts = [("a camera effect", coral), ("that adds fun things", ink), ("on top of the", sage),
                     ("real picture", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, min(i, 2), step=0.2, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1290, 430 + i * 100 + lift + int((1 - a) * 30), font(62, bold=True), col)
            return True
        if focus == "layers":
            slide = K.ease_in_out(K.clamp01((progress - 0.2) / 0.6))
            bx = (220, 380, 720, 800)
            draw.rounded_rectangle((bx[0] + 10, bx[1] + 12, bx[2] + 10, bx[3] + 12), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle(bx, radius=24, fill=SCREEN_BG, outline=K.DEV_DARK, width=5)
            pts = big_face(draw, 470, 590, 110, "kabir", base=bx[3] - 6)
            dx, dy = 200 * (1 - slide), -150 * (1 - slide)
            sbx = (bx[0] + dx, bx[1] + dy, bx[2] + dx, bx[3] + dy)
            dashed_box(sbx, K.BOTH_COLOR, width=5)
            moved = {k_: (v[0] + dx, v[1] + dy) for k_, v in pts.items()}
            puppy(draw, moved, 110, tongue=False)
            glasses(draw, moved, 110)
            if slide < 0.5:
                K.pill(draw, sbx[0] + 250, sbx[1] - 54, "Clear sticker sheet", K.BOTH_COLOR, size=28)
            K.text_at(draw, "Real picture", 470, 816, font(32, bold=True), muted)
            K.text_at(draw, "=", 950, 520, font(120, bold=True), muted)
            a = K.stagger(progress, 6, step=0.12, speed=4)
            pts2, r2, sb2 = phone_face(draw, 1420, 560, 400, 600, "kabir")
            if a > 0:
                puppy(draw, pts2, r2, a, tongue=False)
                glasses(draw, pts2, r2, a)
            return True
        # short
        cards = [("1", "Find the face", coral), ("2", "Draw on top", sage)]
        for i, (num, lab, col) in enumerate(cards):
            a = K.stagger(progress, i, step=0.25, speed=4)
            if a <= 0:
                continue
            x0 = 200 + i * 860
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 260 + yy, x0 + 660, 840 + yy), brand, radius=40, outline=col, outline_w=5)
            K.pill(draw, 0, 290 + yy, num, col, size=34, left=x0 + 30)
            fx, fy = x0 + 330, 530 + yy
            pts = big_face(draw, fx, fy, 100, "kabir" if i == 0 else "pari")
            if i == 0:
                detect_box(draw, fx, fy, 100, 1.0, coral, phase=t * 100)
            else:
                puppy(draw, pts, 100)
            K.text_at(draw, lab, fx, 740 + yy, font(52, bold=True), col)
        K.text_at(draw, "+", cx, 470, font(130, bold=True), muted)
        return True

    # ---- the three filter steps -----------------------------------------------------
    if visual == "b14-steps":
        labels = ["Find the face", "Mark face points", "Draw on top"]
        if focus == "order":
            sb = phone(draw, 540, 560, 420, 620)
            draw.rectangle((sb[0], sb[1] + 330, sb[2], sb[3] - 40), fill=(206, 198, 232))
            draw.rounded_rectangle((sb[0] + 40, sb[1] + 260, sb[2] - 40, sb[1] + 360), radius=30, fill=(186, 176, 222))
            bob = 12 * math.sin(t * 8)
            fake = {"headL": (470, 360 + bob), "headR": (610, 360 + bob), "nose": (540, 450), "mouth": (540, 480)}
            puppy(draw, fake, 120, tongue=False, nose=False)
            question_marks([(540, 300)], size=80)
            K.pill(draw, 540, 760, "No face found!", K.DANGER, size=34)
            steps_list(960, 1780, 290, -1, -1, labels, bad=0)
            return True
        cur = {"find": 0, "points": 1, "draw": 2}[focus]
        pts, r, sb = phone_face(draw, 540, 560, 420, 620, "kabir")
        fy = 560 - 620 * 0.02
        if cur == 0:
            detect_box(draw, 540, fy, r, K.clamp01(progress * 2.5), coral, phase=t * 100)
        else:
            detect_box(draw, 540, fy, r, 1.0, K.STEEL, phase=0)
        if cur == 1:
            face_points(draw, pts, r, shown=progress * 16)
        if cur == 2:
            face_points(draw, pts, r, col=K.STEEL)
            a = K.clamp01(progress * 2.5 - 0.3)
            puppy(draw, pts, r, K.ease_out_cubic(a), tongue=False)
            glasses(draw, pts, r, K.ease_out_cubic(K.clamp01(progress * 2.5 - 0.8)))
        steps_list(960, 1780, 290, cur, cur - 1, labels)
        return True

    # ---- why the ears follow --------------------------------------------------------
    if visual == "b14-follow":
        if focus == "again":
            turn = 0.6 * math.sin(t * math.pi * 3)
            pts, r, sb = phone_face(draw, 520, 560, 420, 620, "kabir", turn=turn)
            puppy(draw, pts, r, tongue=False)
            face_points(draw, pts, r, col=sage if int(t * 16) % 2 else coral)
            sy = sb[1] + (sb[3] - sb[1]) * ((t * 3) % 1)
            draw.line((sb[0] + 6, sy, sb[2] - 6, sy), fill=sage, width=4)
            K.draw_stopwatch(draw, 1060, 330, 60, progress * 3, brand)
            K.text_at(draw, "1 second", 1060, 410, font(34, bold=True), muted)
            for i in range(10):
                a = K.stagger(progress, i, step=0.06, speed=8)
                if a <= 0:
                    continue
                r_, c_ = divmod(i, 5)
                x = 1220 + c_ * 120
                y = 300 + r_ * 150
                draw.rounded_rectangle((x - 50, y - 60, x + 50, y + 60), radius=16, fill=panel, outline=line, width=3)
                mp = big_face(draw, x, y + 6, 26, "kabir", turn=0.6 * math.sin(i * 0.9))
                face_points(draw, mp, 26, keys=["eyeL", "eyeR", "nose", "top"], col=coral)
            K.pill(draw, 1420, 620, "Find again, and again, and again!", coral, size=32)
            K.text_at(draw, "many times every second", 1420, 720, font(40, bold=True), sage)
            return True
        # turn: flipbook
        turns = [-1.0, -0.35, 0.35, 1.0]
        for i, tv in enumerate(turns):
            a = K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            x0 = 170 + i * 410
            yy = int((1 - a) * 30)
            draw.rounded_rectangle((x0 + 8, 300 + yy + 10, x0 + 360 + 8, 720 + yy + 10), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((x0, 300 + yy, x0 + 360, 720 + yy), radius=24, fill=SCREEN_BG, outline=K.DEV_DARK,
                                   width=5)
            fx = x0 + 180
            mp = big_face(draw, fx, 520 + yy, 84, "kabir", turn=tv, base=714 + yy)
            puppy(draw, mp, 84, tongue=False)
            face_points(draw, mp, 84, keys=["headL", "headR", "eyeL", "eyeR", "nose"], col=sage)
            K.pill(draw, 0, 316 + yy, str(i + 1), K.DEV_DARK, size=26, left=x0 + 16)
            if i < 3:
                K.draw_arrow(draw, x0 + 366, 510 + yy, x0 + 404, 510 + yy, muted, width=6, head=14)
        K.pill(draw, cx, 236, "Points move → ears move", sage, size=36)
        a = K.stagger(progress, 5, step=0.1, speed=4)
        if a > 0:
            K.text_at(draw, "Like a flipbook!", cx, 760 + int((1 - a) * 20), font(52, bold=True), coral)
        return True

    # ---- when filters get confused ----------------------------------------------------
    if visual == "b14-oops":
        if focus == "light":
            pts, r, sb = phone_face(draw, 620, 560, 420, 620, "meera", screen=DIM_BG)
            glasses(draw, pts, r, at=((pts["eyeL"][0], pts["eyeL"][1] - r * 0.7), (pts["eyeR"][0], pts["eyeR"][1] - r * 0.7)),
                    col=K.GOLD)
            moon(draw, sb[2] - 60, sb[1] + 70, 34, DIM_BG)
            K.pill(draw, 620, 230, "Dim room", K.DEV_DARK, size=32)
            question_marks([(1060, 330), (1200, 440), (1080, 580)], size=100)
            K.text_at(draw, "Glasses on", 1500, 380, font(54, bold=True), ink)
            K.text_at(draw, "her forehead?!", 1500, 450, font(54, bold=True), coral)
            K.draw_stopwatch(draw, 1500, 680, 60, progress, brand)
            return True
        if focus == "lightans":
            for k, dim in enumerate((True, False)):
                x = 520 + k * 880
                pts, r, sb = phone_face(draw, x, 540, 360, 540, "meera", screen=DIM_BG if dim else SCREEN_BG)
                if dim:
                    wrong = dict(pts)
                    for key in ("eyeLo", "eyeLi", "eyeRi", "eyeRo", "eyeL", "eyeR"):
                        wrong[key] = (pts[key][0], pts[key][1] - r * 0.7)
                    face_points(draw, wrong, r, keys=["eyeLo", "eyeLi", "eyeRi", "eyeRo"], col=K.DANGER)
                    glasses(draw, wrong, r, col=K.GOLD)
                    moon(draw, sb[2] - 50, sb[1] + 60, 28, DIM_BG)
                else:
                    face_points(draw, pts, r, keys=["eyeLo", "eyeLi", "eyeRi", "eyeRo"], col=sage)
                    glasses(draw, pts, r)
                    draw.ellipse((sb[2] - 84, sb[1] + 30, sb[2] - 24, sb[1] + 90), fill=K.GOLD)
                col = K.DANGER if dim else sage
                lab = "Poor light: wrong points" if dim else "Good light: right points"
                bx = K.pill(draw, x, 836 - 20, lab, col, size=30)
                (K.draw_cross if dim else K.draw_check)(draw, x + 200, 290, 30, col)
            K.draw_arrow(draw, 760, 540, 1150, 540, line, width=8, head=24)
            return True
        if focus == "cover":
            pts, r, sb = phone_face(draw, 560, 560, 420, 620, "pari")
            fy = 560 - 620 * 0.02
            face_points(draw, pts, r, keys=["eyeLo", "eyeLi", "nose", "headL", "mouthL"], col=coral)
            fade = K.clamp01(progress * 2.2)
            bunny(draw, pts, r, 0.7, ghost=fade > 0.5)
            hand(draw, 560 - 10, fy - r * 0.5, r * 1.15, r * 1.5)
            if fade > 0.5:
                for k in range(4):
                    a_ = k * math.pi / 2 + 0.6
                    px, py = 560 + math.cos(a_) * 100, 290 + math.sin(a_) * 30
                    draw.ellipse((px - 26, py - 20, px + 26, py + 20), fill=(236, 232, 240))
                K.pill(draw, 875, 300, "Poof!", K.BOTH_COLOR, size=36)
            K.shadow_card(draw, (1000, 300, 1780, 800), brand, radius=36, outline=K.DANGER, outline_w=5)
            K.text_at(draw, "Points found:", 1390, 340, font(44, bold=True), ink)
            for i in range(11):
                found = i < 5
                r_, c_ = divmod(i, 6)
                x = 1110 + c_ * 112
                y = 470 + r_ * 110
                if found:
                    draw.ellipse((x - 28, y - 28, x + 28, y + 28), fill=coral)
                else:
                    draw.ellipse((x - 28, y - 28, x + 28, y + 28), outline=line, width=5)
            K.text_at(draw, "Not enough points!", 1390, 680, font(48, bold=True), K.DANGER)
            return True
        # why
        specs = [("Not magic", "wand", K.DANGER, K.DANGER_SOFT), ("Not alive", "heart", K.DANGER, K.DANGER_SOFT),
                 ("Finds patterns", "points", sage, sage_soft)]
        for i, (lab, kind, col, soft) in enumerate(specs):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 520
            y = 430 + int((1 - a) * 30)
            draw.ellipse((x - 150, y - 150, x + 150, y + 150), fill=soft)
            if kind == "wand":
                wand(draw, x - 10, y + 10, 1.0, t)
            elif kind == "heart":
                K.draw_heart(draw, x, y, 70, coral)
            else:
                mp = big_face(draw, x, y + 20, 70, "pari")
                face_points(draw, mp, 70, col=sage)
            (K.draw_check if kind == "points" else K.draw_cross)(draw, x + 110, y - 110, 30, col)
            K.text_at(draw, lab, x, y + 170, font(44, bold=True), col)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, cx, 760 + int((1 - a) * 20), "Hidden or unclear pattern → mistakes", K.DEV_DARK, size=34)
        return True

    # ---- put the steps in order ----------------------------------------------------------
    if visual == "b14-order":
        ans = focus == "answer"
        cards = [("A", "Draw glasses on the eye points", "draw"), ("B", "Find the face", "find"),
                 ("C", "Mark points like eyes and nose", "points")]
        cw, gap = 500, 60
        xs = [cx - (3 * cw + 2 * gap) / 2 + i * (cw + gap) for i in range(3)]
        final = {"B": 0, "C": 1, "A": 2}
        f = font(38, bold=True)
        for i, (letter, lab, kind) in enumerate(cards):
            m = K.ease_in_out(K.clamp01(progress * 2.4 - 0.1)) if ans else 0.0
            x0 = K.lerp(xs[i], xs[final[letter]], m)
            done = ans and m > 0.95
            K.shadow_card(draw, (x0, 290, x0 + cw, 800), brand, radius=32, outline=sage if done else None,
                          outline_w=6 if done else 3)
            fx, fy = x0 + cw / 2, 470
            pts = big_face(draw, fx, fy, 78, "meera")
            if kind == "find":
                detect_box(draw, fx, fy, 78, 1.0, coral, phase=t * 100)
            elif kind == "points":
                face_points(draw, pts, 78)
            else:
                glasses(draw, pts, 78)
            draw.ellipse((x0 + 20, 306, x0 + 92, 378), fill=K.BOTH_COLOR)
            K.text_at(draw, letter, x0 + 56, 314, font(44, bold=True), WHITE)
            lines = K.wrap_text(lab, f, cw - 60)
            for j, ln in enumerate(lines):
                K.text_at(draw, ln, x0 + cw / 2, 790 - 30 - (len(lines) - j) * 48, f, ink)
            if done:
                K.pill(draw, 0, 306, ["1st", "2nd", "3rd"][final[letter]], sage, size=30, left=x0 + cw - 120)
        if ans:
            if progress > 0.5:
                for i in range(2):
                    K.draw_arrow(draw, xs[i] + cw + 6, 545, xs[i] + cw + gap - 6, 545, sage, width=8, head=20)
            K.pill(draw, cx, 224, "B → C → A: Find · Mark · Draw", sage, size=36)
        else:
            K.pill(draw, cx - 40, 224, "What's the right order?", K.BOTH_COLOR, size=36)
            K.draw_stopwatch(draw, cx + 300, 254, 32, progress, brand)
        return True

    # ---- the camera still takes a picture --------------------------------------------------
    if visual == "b14-camera":
        if focus == "still":
            pts, r, sb = phone_face(draw, 520, 560, 400, 600, "kabir", mood="open")
            puppy(draw, pts, r)
            flash = (t * 3) % 1 < 0.2
            if flash:
                draw.rounded_rectangle(sb, radius=30, outline=WHITE, width=14)
            K.draw_device(draw, "camera", 870, 400, 0.5, brand, t=t)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                K.draw_arrow(draw, 760, 600, 760 + 220 * a, 600, muted, width=10, head=30)
            for k in range(3):
                a = K.stagger(progress, k + 3, step=0.1, speed=4)
                if a <= 0:
                    continue
                ox = 1120 + k * 70
                oy = 330 + k * 40 + int((1 - a) * 30)
                polaroid(draw, (ox, oy, ox + 400, oy + 440), "kabir", t, filt="puppy")
            K.pill(draw, 1420, 236, "Still a face picture!", coral, size=34)
            return True
        if focus == "personal":
            polaroid(draw, (260, 270, 760, 830), "kabir", t, filt="puppy")
            K.draw_magnifier(draw, 690, 470, 0.9, coral)
            items = [("Shows who you are", "tag"), ("Your face is personal", "shield")]
            for i, (lab, kind) in enumerate(items):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 320 + i * 260 + int((1 - a) * 30)
                draw.rounded_rectangle((960 + 8, y + 10, 1760 + 8, y + 210 + 10), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((960, y, 1760, y + 210), radius=40, fill=sage_soft if i else blue_soft,
                                       outline=sage if i else K.ROAD, width=5)
                if kind == "tag":
                    K.draw_name_tag(draw, 1080, y + 105, 0.5, brand)
                else:
                    K.draw_shield(draw, 1080, y + 105, 0.6, sage, mark="lock")
                draw.text((1180, y + 76), lab, fill=ink, font=font(46, bold=True))
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1360, 808, "Even with puppy ears on!", coral, size=32)
            return True
        # beauty
        for k, (lab, real) in enumerate((("Real face", True), ("Filter face", False))):
            x = 520 + k * 880
            y0 = 270
            draw.rounded_rectangle((x - 300, y0, x + 300, 760), radius=40, fill=sage_soft if real else lav_soft,
                                   outline=sage if real else K.BOTH_COLOR, width=5)
            if real:
                mp = big_face(draw, x, 500, 130, "meera", base=754)
                for fx, fy in ((-0.5, 0.1), (-0.4, 0.2), (0.45, 0.12), (0.55, 0.22), (-0.6, 0.22)):
                    draw.ellipse((x + fx * 130 - 4, 500 + fy * 130 - 4, x + fx * 130 + 4, 500 + fy * 130 + 4),
                                 fill=SKIN_SHADE)
            else:
                mp = big_face(draw, x, 500, 130, "meera", base=754)
                for ex, ey in (mp["eyeL"], mp["eyeR"]):
                    draw.ellipse((ex - 34, ey - 28, ex + 34, ey + 28), fill=WHITE)
                    draw.ellipse((ex - 20, ey - 20, ex + 20, ey + 20), fill=K.DEV_DEEP)
                    draw.ellipse((ex - 8, ey - 14, ex + 2, ey - 4), fill=WHITE)
                for k2, (sx2, sy2) in enumerate(((-235, 320), (235, 320), (-245, 560), (245, 560))):
                    K.draw_star(draw, x + sx2, sy2, 18 + 4 * pulse, K.GOLD, rot=t * 3 + k2)
            K.pill(draw, x, 290 - 60, lab, sage if real else K.BOTH_COLOR, size=32)
        a = K.stagger(progress, 2, step=0.14, speed=4)
        if a > 0:
            bx = K.pill(draw, 1400, 786, "Not real!", K.DANGER, size=34)
            K.draw_heart(draw, 356, 806, 32 * a, coral)
            K.pill(draw, 560, 786, "Great as you are!", sage, size=30)
        K.draw_arrow(draw, 840, 540, 1080, 540, line, width=8, head=24)
        return True

    # ---- filter manners -------------------------------------------------------------------
    if visual == "b14-manners":
        if focus == "post":
            sb = phone(draw, 620, 560, 420, 620)
            polaroid(draw, (sb[0] + 30, sb[1] + 50, sb[2] - 30, sb[1] + 470), "meera", t, filt="bunny")
            btn = K.pill(draw, 620, sb[3] - 100, "POST", coral, size=36)
            fx = (btn[0] + btn[2]) / 2 + 60
            fy = btn[3] + 10 - 20 * abs(math.sin(t * 6))
            draw.rounded_rectangle((fx - 18, fy - 10, fx + 18, fy + 70), radius=18, fill=K.SKIN, outline=SKIN_SHADE, width=3)
            draw.ellipse((1320 - 230, 560 - 230, 1320 + 230, 560 + 230), fill=blue_soft)
            big_face(draw, 1320, 520, 120, "kabir", base=790, mood="flat")
            question_marks([(1100, 280), (1550, 300)], size=90)
            K.draw_stopwatch(draw, 1680, 780, 44, progress, brand)
            return True
        if focus == "ask":
            draw.ellipse((420 - 220, 580 - 220, 420 + 220, 580 + 220), fill=blue_soft)
            big_face(draw, 420, 560, 110, "kabir", base=800)
            K.draw_bubble(draw, (560, 250, 1120, 400), brand, "Meera, can I share this?", tail="left", size=40)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            draw.ellipse((1500 - 220, 580 - 220, 1500 + 220, 580 + 220), fill=sage_soft)
            big_face(draw, 1500, 560, 110, "meera", base=800, mood="open" if a > 0 else "smile")
            if a > 0:
                K.draw_bubble(draw, (980, 450 + int((1 - a) * 20), 1360, 580 + int((1 - a) * 20)), brand, "Yes, sure!",
                              tail="right", size=40, color=sage_soft)
                K.draw_check(draw, 960, 720, 44, sage)
            polaroid(draw, (860, 640, 1060, 870), "meera", t, filt="bunny")
            return True
        # rules
        rules = [("Ask before posting", "anyone's photo", "ask", coral, coral_soft),
                 ("Never make fun", "of people", "kind", K.BOTH_COLOR, lav_soft),
                 ("Grown-up OK", "for new filter apps", "adult", sage, sage_soft)]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, (t1, t2, kind, col, soft) in enumerate(rules):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            x0 = x_start + i * (cw + gap)
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 260 + yy, x0 + cw, 840 + yy), brand, radius=36, outline=col, outline_w=5)
            ib = (x0 + 24, 284 + yy, x0 + cw - 24, 600 + yy)
            draw.rounded_rectangle(ib, radius=26, fill=soft)
            mx = x0 + cw / 2
            if kind == "ask":
                big_face(draw, mx - 110, 470 + yy, 60, "kabir", base=596 + yy)
                big_face(draw, mx + 110, 470 + yy, 60, "meera", base=596 + yy)
                draw.rounded_rectangle((mx - 70, 300 + yy, mx + 70, 370 + yy), radius=30, fill=panel, outline=col, width=3)
                K.text_at(draw, "OK?", mx, 312 + yy, font(36, bold=True), col)
            elif kind == "kind":
                K.draw_heart(draw, mx, 440 + yy, 90, coral)
                K.draw_star(draw, mx - 150, 360 + yy, 24, K.GOLD, rot=t * 3)
                K.draw_star(draw, mx + 150, 380 + yy, 24, K.GOLD, rot=t * 3 + 1)
            else:
                K.draw_person(draw, mx - 90, 430 + yy, 0.8, "mom", t)
                K.draw_device(draw, "touch", mx + 110, 470 + yy, 0.5, brand, t=t)
            K.text_at(draw, t1, mx, 640 + yy, font(44, bold=True), col)
            K.text_at(draw, t2, mx, 700 + yy, font(36, bold=True), ink)
            K.draw_check(draw, mx, 790 + yy, 26, col)
        return True

    # ---- checkpoint ---------------------------------------------------------------------------
    if visual == "b14-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 280 + lift, w - 460, 790 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like a filter!", cx, 420 + lift, font(62, bold=True), ink)
            pts = big_face(draw, cx, 640 + lift, 70, "kabir")
            puppy(draw, pts, 70)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 240 + 12, 1080 + 10, 860 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 240, 1080, 860), radius=24, fill=(255, 250, 238))
        label_lines(("What must a filter find", "before adding puppy ears?"), 605, 270, size=44, col=coral)
        rows = ["Find your face", "Mark its face points", "Like the top of your head"]
        for i, lab in enumerate(rows):
            y = 440 + i * 130
            draw.line((180, y + 96, 1030, y + 96), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 210, y + 50, 24, sage)
                draw.text((250, y + 26), lab, fill=ink, font=font(42, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 605, y - 30, font(110, bold=True), line)
        pts, r, sb = phone_face(draw, 1450, 570, 400, 580, "kabir")
        if ans:
            face_points(draw, pts, r, shown=progress * 14, col=sage)
            face_points(draw, pts, r, keys=["top", "headL", "headR"], col=coral)
            puppy(draw, pts, r, K.ease_out_cubic(K.clamp01(progress * 2 - 0.8)), tongue=False)
        else:
            bob = 12 * math.sin(t * 8)
            fake = {"headL": (pts["headL"][0] - 30, sb[1] + 50 + bob), "headR": (pts["headR"][0] + 30, sb[1] + 50 + bob),
                    "nose": pts["nose"], "mouth": pts["mouth"]}
            puppy(draw, fake, r * 0.8, tongue=False)
            K.text_at(draw, "?", 1450, sb[1] + 40, font(int(70 + 14 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1760, 330, 40, progress, brand)
        return True

    # ---- recap ---------------------------------------------------------------------------------
    if visual == "b14-recap":
        recap = [(("Find the face,", "draw on top"), coral, "filter"), (("Needs face", "points first"), sage, "points"),
                 (("Camera still takes", "a face picture"), K.ROAD, "camera"), (("Ask before", "posting photos"), K.BOTH_COLOR, "ask")]
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
                ix, iy = x0 + 200, y0 + 210
                if kind == "filter":
                    mp = big_face(draw, ix, iy + 10, 80, "kabir")
                    puppy(draw, mp, 80)
                elif kind == "points":
                    mp = big_face(draw, ix, iy + 10, 80, "pari")
                    face_points(draw, mp, 80, col=sage)
                elif kind == "camera":
                    K.draw_device(draw, "camera", ix, iy, 0.8, brand, t=t)
                else:
                    big_face(draw, ix - 70, iy + 30, 52, "kabir")
                    big_face(draw, ix + 80, iy + 30, 52, "meera")
                    draw.rounded_rectangle((ix - 60, iy - 130, ix + 60, iy - 70), radius=26, fill=panel, outline=col,
                                           width=3)
                    K.text_at(draw, "OK?", ix, iy - 122, font(32, bold=True), col)
                label_lines(lab, x0 + 200, y0 + 390, size=34)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            mp = big_face(draw, cx + 300, 450, 90, "kabir")
            puppy(draw, mp, 90)
            K.text_at(draw, "Chapter 4 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Find · Mark · Draw · Ask first", coral, size=36)
            stars_around(320, 560, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
