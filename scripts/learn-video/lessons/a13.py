"""A13 · Variables — Boxes That Store Things — visuals."""
import math

import build as K

EVENTS, EVENTS_D = (255, 191, 0), (204, 153, 0)
MOTION, MOTION_D = (76, 151, 255), (51, 115, 204)
VARS, VARS_D = (255, 140, 26), (219, 110, 11)
WHITE = (255, 255, 255)
BLOCK_INK = (87, 94, 117)
CAT, CAT_D, CAT_BELLY = (255, 158, 60), (214, 112, 30), (255, 236, 214)
SKY, GRASS, GRASS_D = (214, 234, 252), (138, 204, 112), (104, 170, 86)
CARD, CARD_D, CARD_L, CARD_IN = (214, 170, 112), (168, 122, 70), (232, 198, 150), (120, 86, 52)
AUTO_Y, AUTO_G = (255, 204, 40), (36, 130, 80)
POHA, PEA = (246, 206, 90), (110, 176, 70)


# ---- Scratch-style blocks ---------------------------------------------------------

def _f(size):
    return K.load_font(int(size), bold=True)


def _parts_w(draw, parts, size):
    total = 0.0
    for p in parts:
        if isinstance(p, str):
            total += draw.textbbox((0, 0), p, font=_f(size))[2]
        else:
            kind, txt = p
            tw = draw.textbbox((0, 0), txt, font=_f(size * 0.9))[2]
            total += size * 1.2 if kind == "flag" else tw + size * 1.0
        total += size * 0.4
    return total - size * 0.4


def _flag(draw, x, cy, s):
    draw.line((x, cy - 22 * s, x, cy + 22 * s), fill=(60, 120, 50), width=max(2, int(4 * s)))
    pts = [(x, cy - 22 * s), (x + 14 * s, cy - 26 * s), (x + 28 * s, cy - 18 * s), (x + 40 * s, cy - 22 * s),
           (x + 40 * s, cy), (x + 28 * s, cy + 4 * s), (x + 14 * s, cy - 4 * s), (x, cy)]
    draw.polygon(pts, fill=(76, 191, 86), outline=(46, 140, 56))


def _draw_parts(draw, x, cy, parts, size):
    f, fs = _f(size), _f(size * 0.9)
    ref = draw.textbbox((0, 0), "Ag", font=f)
    refs = draw.textbbox((0, 0), "Ag", font=fs)
    for p in parts:
        if isinstance(p, str):
            draw.text((x, cy - (ref[1] + ref[3]) / 2), p, fill=WHITE, font=f)
            x += draw.textbbox((0, 0), p, font=f)[2]
        else:
            kind, txt = p
            if kind == "flag":
                _flag(draw, x + size * 0.1, cy + size * 0.1, size / 34)
                x += size * 1.2
            else:
                tw = draw.textbbox((0, 0), txt, font=fs)[2]
                pw, ph = tw + size * 1.0, size * 1.3
                box = (x, cy - ph / 2, x + pw, cy + ph / 2)
                if kind == "num":
                    draw.rounded_rectangle(box, radius=ph / 2, fill=WHITE, outline=(200, 200, 210), width=2)
                    col = BLOCK_INK
                else:
                    draw.rounded_rectangle(box, radius=ph / 2, fill=VARS, outline=VARS_D, width=3)
                    col = WHITE
                draw.text((x + size * 0.5, cy - (refs[1] + refs[3]) / 2), txt, fill=col, font=fs)
                x += pw
        x += size * 0.4


def block(draw, x, y, parts, color, dark, size=34, hat=False, w=None):
    """Top-left anchored puzzle block. Returns (width, height)."""
    k = size / 34
    h = size * 2.0
    bw = w or (_parts_w(draw, parts, size) + size * 1.4)
    n0, n1, n2, n3, nd = x + 20 * k, x + 30 * k, x + 60 * k, x + 70 * k, 10 * k
    c = 6 * k
    bottom = [(x + bw, y + h - c), (x + bw - c, y + h), (n3, y + h), (n2, y + h + nd), (n1, y + h + nd),
              (n0, y + h), (x + c, y + h), (x, y + h - c)]
    if hat:
        draw.ellipse((x, y - 30 * k, x + 150 * k, y + 30 * k), fill=color, outline=dark, width=3)
        pts = [(x, y + 2), (x + bw - c, y), (x + bw, y + c)] + bottom
    else:
        pts = [(x + c, y), (n0, y), (n1, y + nd), (n2, y + nd), (n3, y), (x + bw - c, y), (x + bw, y + c)] + bottom
    draw.polygon(pts, fill=color, outline=dark, width=3)
    if hat:
        draw.rectangle((x + 3, y - 2, x + 147 * k, y + 5), fill=color)
    _draw_parts(draw, x + size * 0.7, y + h / 2, parts, size)
    return bw, h


def set_block(draw, x, y, name, val, size=40):
    return block(draw, x, y, ["set", ("var", name), "to", ("num", val)], VARS, VARS_D, size)


def change_block(draw, x, y, name, val, size=40):
    return block(draw, x, y, ["change", ("var", name), "by", ("num", val)], VARS, VARS_D, size)


def flag_block(draw, x, y, size=40):
    return block(draw, x, y, ["when", ("flag", ""), "clicked"], EVENTS, EVENTS_D, size, hat=True)


def monitor(draw, x, y, name, value, size=30):
    f = _f(size)
    nw = draw.textbbox((0, 0), name, font=f)[2]
    vw = max(draw.textbbox((0, 0), value, font=f)[2], size * 0.7)
    w, h = nw + vw + size * 2.4, size * 1.8
    draw.rounded_rectangle((x + 4, y + 5, x + w + 4, y + h + 5), radius=12, fill=K.SHADOW)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=12, fill=(234, 239, 244), outline=(190, 198, 210), width=3)
    ref = draw.textbbox((0, 0), "Ag", font=f)
    ty = y + h / 2 - (ref[1] + ref[3]) / 2
    draw.text((x + size * 0.5, ty), name, fill=BLOCK_INK, font=f)
    px = x + nw + size * 0.9
    draw.rounded_rectangle((px, y + size * 0.3, px + vw + size * 1.0, y + h - size * 0.3), radius=size * 0.6,
                           fill=VARS)
    draw.text((px + size * 0.5, ty), value, fill=WHITE, font=f)
    return w, h


# ---- illustrations ------------------------------------------------------------------

def draw_cat(draw, cx, cy, s, t=0.0, mood="happy", face=1):
    """cy = body centre; sprite spans about cy-175s .. cy+95s."""
    def S(v):
        return v * s
    fx = face
    draw.ellipse((cx - S(70), cy + S(80), cx + S(70), cy + S(100)), fill=K.SHADOW)
    tail = [(cx - fx * S(50), cy + S(40)), (cx - fx * S(105), cy + S(10)), (cx - fx * S(118), cy - S(40)),
            (cx - fx * S(100), cy - S(80) + S(6) * math.sin(t * 10))]
    draw.line(tail, fill=CAT_D, width=max(3, int(S(20))), joint="curve")
    draw.ellipse((cx - S(62), cy - S(40), cx + S(62), cy + S(84)), fill=CAT, outline=CAT_D, width=max(2, int(S(4))))
    draw.ellipse((cx - S(34), cy - S(4), cx + S(34), cy + S(72)), fill=CAT_BELLY)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(34) - S(24), cy + S(68), cx + sx * S(34) + S(24), cy + S(94)), fill=CAT,
                     outline=CAT_D, width=max(2, int(S(4))))
    hx, hy = cx + fx * S(8), cy - S(98)
    for sx in (-1, 1):
        ear = [(hx + sx * S(62), hy - S(22)), (hx + sx * S(52), hy - S(100)), (hx + sx * S(10), hy - S(62))]
        draw.polygon(ear, fill=CAT, outline=CAT_D, width=max(2, int(S(4))))
        inner = [(hx + sx * S(52), hy - S(36)), (hx + sx * S(48), hy - S(80)), (hx + sx * S(24), hy - S(58))]
        draw.polygon(inner, fill=(255, 190, 200))
    draw.ellipse((hx - S(72), hy - S(66), hx + S(72), hy + S(62)), fill=CAT, outline=CAT_D, width=max(2, int(S(4))))
    draw.ellipse((hx - S(40), hy + S(2), hx + S(40), hy + S(50)), fill=CAT_BELLY)
    for sx in (-1, 1):
        ex, ey = hx + sx * S(28) + fx * S(6), hy - S(14)
        if mood == "hurt":
            for d in (-1, 1):
                draw.line((ex - S(10), ey - d * S(10), ex + S(10), ey + d * S(10)), fill=K.DEV_DEEP,
                          width=max(2, int(S(5))))
        elif mood == "happy":
            draw.arc((ex - S(14), ey - S(10), ex + S(14), ey + S(16)), 200, 340, fill=K.DEV_DEEP,
                     width=max(2, int(S(6))))
        else:
            draw.ellipse((ex - S(13), ey - S(16), ex + S(13), ey + S(16)), fill=WHITE)
            draw.ellipse((ex - S(7) + fx * S(3), ey - S(8), ex + S(7) + fx * S(3), ey + S(10)), fill=K.DEV_DEEP)
    nx = hx + fx * S(6)
    draw.polygon([(nx - S(10), hy + S(10)), (nx + S(10), hy + S(10)), (nx, hy + S(22))], fill=(236, 110, 140))
    if mood == "hurt":
        draw.arc((nx - S(14), hy + S(28), nx + S(14), hy + S(46)), 200, 340, fill=K.DEV_DEEP, width=max(2, int(S(4))))
    else:
        draw.arc((nx - S(16), hy + S(14), nx, hy + S(34)), 20, 160, fill=K.DEV_DEEP, width=max(2, int(S(4))))
        draw.arc((nx, hy + S(14), nx + S(16), hy + S(34)), 20, 160, fill=K.DEV_DEEP, width=max(2, int(S(4))))
    for sx in (-1, 1):
        for k in (-1, 1):
            draw.line((nx + sx * S(30), hy + S(22) + k * S(6), nx + sx * S(78), hy + S(18) + k * S(14)),
                      fill=CAT_D, width=max(1, int(S(3))))


def coin(draw, cx, cy, r, t=0.0):
    sq = 0.55 + 0.45 * abs(math.cos(t * 6))
    draw.ellipse((cx - r * sq, cy - r, cx + r * sq, cy + r), fill=K.GOLD, outline=(206, 140, 20), width=max(2, int(r * 0.12)))
    draw.ellipse((cx - r * sq * 0.62, cy - r * 0.62, cx + r * sq * 0.62, cy + r * 0.62), outline=(255, 226, 140),
                 width=max(2, int(r * 0.1)))


def spikes(draw, x0, by, n, s=1.0):
    for i in range(n):
        x = x0 + i * 46 * s
        pts = [(x, by), (x + 23 * s, by - 52 * s), (x + 46 * s, by)]
        draw.polygon(pts, fill=K.STEEL, outline=K.STEEL_DARK, width=max(2, int(3 * s)))


def bug(draw, cx, cy, s, t=0.0):
    def S(v):
        return v * s
    for k in range(3):
        y = cy - S(14) + k * S(16)
        wig = S(4) * math.sin(t * 20 + k)
        draw.line((cx - S(30), y, cx - S(52), y + S(8) + wig), fill=K.DEV_DEEP, width=max(2, int(S(4))))
        draw.line((cx + S(30), y, cx + S(52), y + S(8) - wig), fill=K.DEV_DEEP, width=max(2, int(S(4))))
    draw.ellipse((cx - S(36), cy - S(30), cx + S(36), cy + S(36)), fill=(214, 52, 72), outline=K.DEV_DEEP,
                 width=max(2, int(S(3))))
    draw.line((cx, cy - S(28), cx, cy + S(34)), fill=K.DEV_DEEP, width=max(2, int(S(3))))
    for dx, dy in ((-16, -4), (14, 8), (-12, 18), (16, -14)):
        draw.ellipse((cx + S(dx) - S(6), cy + S(dy) - S(6), cx + S(dx) + S(6), cy + S(dy) + S(6)), fill=K.DEV_DEEP)
    draw.ellipse((cx - S(18), cy - S(52), cx + S(18), cy - S(22)), fill=K.DEV_DEEP)
    for sx in (-1, 1):
        draw.line((cx + sx * S(8), cy - S(48), cx + sx * S(22), cy - S(68)), fill=K.DEV_DEEP, width=max(2, int(S(3))))


def stage(draw, box, t=0.0, header=True):
    """Scratch-like stage frame. Returns the inner sky box."""
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=28, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=28, fill=WHITE, outline=(200, 206, 216), width=4)
    top = y0 + 16
    if header:
        _flag(draw, x0 + 34, y0 + 40, 0.9)
        K.draw_stop_sign(draw, x0 + 110, y0 + 34, 18)
        top = y0 + 70
    inner = (x0 + 16, top, x1 - 16, y1 - 16)
    draw.rounded_rectangle(inner, radius=18, fill=SKY)
    gy = inner[3] - (inner[3] - inner[1]) * 0.2
    draw.rounded_rectangle((inner[0], gy, inner[2], inner[3]), radius=18, fill=GRASS)
    draw.rectangle((inner[0], gy, inner[2], gy + 20), fill=GRASS)
    draw.line((inner[0], gy, inner[2], gy), fill=GRASS_D, width=5)
    for k, (fx, fy) in enumerate(((0.22, 0.16), (0.7, 0.1))):
        ccx = inner[0] + (inner[2] - inner[0]) * fx + 20 * math.sin(t * 2 + k)
        ccy = inner[1] + (inner[3] - inner[1]) * fy + 30
        for dx, r in ((-36, 26), (0, 36), (38, 26)):
            draw.ellipse((ccx + dx - r, ccy - r, ccx + dx + r, ccy + r * 0.8), fill=WHITE)
    return inner, gy


def var_box(draw, cx, by, s, name, value=None, rise=1.0, value_col=None, label_col=VARS, label_size=44):
    """Cardboard box, front view. by = bottom. Spans x ±220s, y by-185s-130s(value) .. by."""
    def S(v):
        return v * s
    w2, hb = S(150), S(180)
    top = by - hb
    draw.ellipse((cx - S(170), by - S(14), cx + S(170), by + S(16)), fill=K.SHADOW)
    back = [(cx - w2 + S(30), top - S(40)), (cx + w2 - S(30), top - S(40)), (cx + w2 - S(56), top - S(96)),
            (cx - w2 + S(56), top - S(96))]
    draw.polygon(back, fill=CARD, outline=CARD_D, width=max(2, int(S(4))))
    draw.polygon([(cx - w2, top), (cx + w2, top), (cx + w2 - S(30), top - S(40)), (cx - w2 + S(30), top - S(40))],
                 fill=CARD_IN)
    if value is not None and rise > 0:
        f = _f(max(12, S(80)))
        tw = draw.textbbox((0, 0), value, font=f)[2]
        cw = max(S(130), tw + S(50))
        vc = top - S(10) - S(60) * K.ease_out_cubic(K.clamp01(rise))
        draw.rounded_rectangle((cx - cw / 2, vc - S(66), cx + cw / 2, vc + S(66)), radius=S(22), fill=WHITE,
                               outline=K.DEV_DARK, width=max(2, int(S(4))))
        ref = draw.textbbox((0, 0), "0", font=f)
        draw.text((cx - tw / 2, vc - (ref[1] + ref[3]) / 2), value, fill=value_col or K.DEV_DEEP, font=f)
    draw.rectangle((cx - w2 + S(6), top + S(8), cx + w2 + S(6), by + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - w2, top, cx + w2, by), fill=CARD, outline=CARD_D, width=max(2, int(S(4))))
    draw.line((cx - w2 + S(10), top + S(16), cx + w2 - S(10), top + S(16)), fill=CARD_L, width=max(2, int(S(6))))
    for sx in (-1, 1):
        hx = cx + sx * w2
        flap = [(hx, top), (hx - sx * S(30), top - S(40)), (hx + sx * S(36), top - S(86)), (hx + sx * S(70), top - S(42))]
        draw.polygon(flap, fill=CARD_L, outline=CARD_D, width=max(2, int(S(4))))
    if name:
        lx0, ly0, lx1, ly1 = cx - w2 + S(26), top + S(50), cx + w2 - S(26), top + S(140)
        draw.rounded_rectangle((lx0, ly0, lx1, ly1), radius=S(16), fill=WHITE, outline=label_col,
                               width=max(2, int(S(5))))
        fl = _f(max(12, S(label_size)))
        ref = draw.textbbox((0, 0), "Ag", font=fl)
        tw = draw.textbbox((0, 0), name, font=fl)[2]
        draw.text((cx - tw / 2, (ly0 + ly1) / 2 - (ref[1] + ref[3]) / 2), name, fill=K.DEV_DEEP, font=fl)


def phone(draw, box, t=0.0):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=46, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=46, fill=K.DEV_DEEP)
    draw.ellipse((x1 - 34, (y0 + y1) / 2 - 10, x1 - 14, (y0 + y1) / 2 + 10), fill=K.DEV_MID)
    return (x0 + 30, y0 + 26, x1 - 52, y1 - 26)


def mini_game(draw, scr, t, score="0", lives=3, cat_x=0.3, coins=(0.55, 0.72, 0.88), mood="happy",
              spike_x=None, size=1.0):
    x0, y0, x1, y1 = scr
    draw.rounded_rectangle(scr, radius=int(16 * size), fill=SKY)
    gy = y1 - (y1 - y0) * 0.22
    draw.rounded_rectangle((x0, gy, x1, y1), radius=int(16 * size), fill=GRASS)
    draw.rectangle((x0, gy, x1, gy + 16), fill=GRASS)
    monitor(draw, x0 + 16 * size, y0 + 14 * size, "score", score, size=int(28 * size))
    for i in range(3):
        hx = x1 - 50 * size - i * 58 * size
        K.draw_heart(draw, hx, y0 + 40 * size, 20 * size, K.DANGER if i < lives else (210, 204, 198))
    for c in coins:
        coin(draw, x0 + (x1 - x0) * c, gy - 90 * size, 22 * size, t)
    if spike_x is not None:
        spikes(draw, x0 + (x1 - x0) * spike_x, gy, 3, 0.8 * size)
    draw_cat(draw, x0 + (x1 - x0) * cat_x, gy - 90 * size, 0.42 * size, t, mood)


def auto_rickshaw(draw, cx, by, s, t=0.0, rider=True):
    def S(v):
        return v * s
    draw.ellipse((cx - S(240), by - S(12), cx + S(240), by + S(16)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(220), by - S(330), cx + S(170), by - S(250)), radius=S(50), fill=K.DEV_DEEP)
    draw.rectangle((cx - S(200), by - S(270), cx + S(150), by - S(130)), fill=(70, 78, 92))
    if rider:
        K.draw_person(draw, cx - S(40), by - S(196), 0.62 * s, "kid", t)
    draw.polygon([(cx + S(150), by - S(270)), (cx + S(230), by - S(150)), (cx + S(230), by - S(60)),
                  (cx + S(150), by - S(60))], fill=AUTO_Y, outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.polygon([(cx + S(160), by - S(250)), (cx + S(215), by - S(160)), (cx + S(160), by - S(160))],
                 fill=(200, 230, 250))
    draw.rounded_rectangle((cx - S(230), by - S(140), cx + S(170), by - S(40)), radius=S(30), fill=AUTO_G,
                           outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.rectangle((cx - S(230), by - S(140), cx + S(170), by - S(118)), fill=AUTO_Y)
    for wx in (cx - S(150), cx + S(190)):
        draw.ellipse((wx - S(46), by - S(86), wx + S(46), by + S(6)), fill=K.DEV_DEEP)
        draw.ellipse((wx - S(18), by - S(58), wx + S(18), by - S(22)), fill=K.STEEL)


def plate(draw, cx, cy, s, food, t=0.0):
    def S(v):
        return v * s
    draw.ellipse((cx - S(130) + S(6), cy - S(50) + S(8), cx + S(130) + S(6), cy + S(50) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(130), cy - S(50), cx + S(130), cy + S(50)), fill=WHITE, outline=K.STEEL_DARK,
                 width=max(2, int(S(4))))
    draw.ellipse((cx - S(96), cy - S(34), cx + S(96), cy + S(34)), outline=(226, 228, 234), width=max(2, int(S(3))))
    if food == "poha":
        draw.chord((cx - S(90), cy - S(70), cx + S(90), cy + S(30)), 180, 360, fill=POHA)
        draw.rectangle((cx - S(90), cy - S(21), cx + S(90), cy + S(4)), fill=POHA)
        for k, (dx, dy) in enumerate(((-50, -20), (-10, -44), (30, -18), (60, -6), (-70, -2), (6, -6), (40, -40))):
            col = PEA if k % 2 == 0 else (222, 70, 60)
            draw.ellipse((cx + S(dx) - S(8), cy + S(dy) - S(8), cx + S(dx) + S(8), cy + S(dy) + S(8)), fill=col)
    elif food == "paratha":
        for k in range(2):
            oy = -k * S(16)
            draw.ellipse((cx - S(96), cy - S(36) + oy, cx + S(96), cy + S(26) + oy), fill=(226, 168, 84),
                         outline=(176, 116, 50), width=max(2, int(S(3))))
        for dx, dy in ((-40, -18), (20, -26), (50, -8), (-6, -6), (-60, -4)):
            draw.ellipse((cx + S(dx) - S(9), cy + S(dy) - S(6), cx + S(dx) + S(9), cy + S(dy) + S(6)),
                         fill=(160, 96, 40))
    else:
        for dx in (-56, 0, 56):
            draw.ellipse((cx + S(dx) - S(46), cy - S(46), cx + S(dx) + S(46), cy + S(14)), fill=(250, 250, 244),
                         outline=(200, 200, 190), width=max(2, int(S(3))))
        draw.ellipse((cx + S(70), cy - S(4), cx + S(118), cy + S(30)), fill=(236, 236, 214),
                     outline=(170, 180, 150))


def tiffin_label(draw, cx, cy, s, name="AARAV"):
    K.draw_tiffin(draw, cx, cy, s)
    lw, lh = 110 * s, 36 * s
    ly = cy - 34 * s + 30 * s
    draw.rounded_rectangle((cx - lw / 2, ly - lh / 2, cx + lw / 2, ly + lh / 2), radius=8 * s, fill=WHITE,
                           outline=VARS, width=max(2, int(4 * s)))
    f = _f(max(12, 26 * s))
    text_c(draw, name, cx, ly, f, K.DEV_DEEP)


def text_c(draw, text, cx, cy, font, fill):
    """Centre text on (cx, cy) using a stable cap-height reference."""
    ref = draw.textbbox((0, 0), "Ag", font=font)
    tw = draw.textbbox((0, 0), text, font=font)[2]
    draw.text((cx - tw / 2, cy - (ref[1] + ref[3]) / 2), text, fill=fill, font=font)


def charger(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(50), cy - S(60), cx + S(50), cy + S(40)), radius=S(16), fill=WHITE,
                           outline=K.DEV_DARK, width=max(2, int(S(4))))
    for sx in (-1, 1):
        draw.rectangle((cx + sx * S(20) - S(6), cy - S(96), cx + sx * S(20) + S(6), cy - S(60)), fill=K.STEEL_DARK)
    draw.line([(cx, cy + S(40)), (cx + S(20), cy + S(90)), (cx + S(90), cy + S(80)), (cx + S(110), cy + S(30))],
              fill=K.DEV_DARK, width=max(2, int(S(8))), joint="curve")


def plus_badge(draw, cx, cy, label, col, r=44):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    text_c(draw, label, cx, cy, _f(r * 0.9), WHITE)


# ---- scenes --------------------------------------------------------------------------

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
    gold_soft = K.hex_rgb("#FFF4DC")
    t = progress
    cx = w / 2
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    lift = int((1 - appear) * 40)
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    F = _f

    def stars_at(x, y, r, n=4):
        for i in range(n):
            a = i * 2 * math.pi / n + 0.4
            K.draw_star(draw, x + math.cos(a) * r, y + math.sin(a) * r * 0.7 + 10 * math.sin(t * 9 + i),
                        20 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=t * 3 + i)

    def qmarks(pts):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(int(80 + 20 * (pulse if k % 2 else 1 - pulse))), K.GOLD)

    # ---- opening ---------------------------------------------------------------
    if visual == "a13-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 470, 110, sage, panel, bounce)
            draw_cat(draw, cx + 300, 520, 1.15, t, "happy")
            K.text_at(draw, "Welcome back, champ!", cx, 720, F(64), ink)
            for i, (sx, sy) in enumerate(((cx - 620, 320), (cx + 640, 330), (cx - 40, 300), (cx + 760, 600))):
                K.draw_star(draw, sx, sy + 10 * math.sin(t * 9 + i), 22 + 6 * pulse,
                            [coral, sage, K.BOTH_COLOR, K.GOLD][i], rot=t * 3 + i)
            return True
        if focus == "bridge":
            K.pill(draw, 0, 240, "LAST TIME", sage, size=30, left=160)
            bx, by = 180, 330
            a = [K.stagger(t, i, step=0.18, speed=4) for i in range(3)]
            if a[0] > 0:
                flag_block(draw, bx, by + (1 - a[0]) * 30, 46)
            if a[1] > 0:
                block(draw, bx, by + 92 + (1 - a[1]) * 30, ["move", ("num", "10"), "steps"], MOTION, MOTION_D, 46)
            if a[2] > 0:
                block(draw, bx, by + 184 + (1 - a[2]) * 30, ["turn", ("num", "90"), "degrees"], MOTION, MOTION_D, 46)
            inner, gy = stage(draw, (900, 250, 1760, 820), t)
            walk = K.ease_in_out(K.clamp01(t * 1.4))
            x_cat = K.lerp(1060, 1480, walk)
            for k in range(6):
                px = 1060 + k * 80
                if px < x_cat - 40:
                    draw.ellipse((px - 8, gy + 50, px + 8, gy + 66), fill=GRASS_D)
            draw_cat(draw, x_cat, gy - 70, 0.85, t, "happy")
            K.draw_arrow(draw, 760, 520, 860, 520, coral, width=12, head=34)
            return True
        if focus == "unit":
            draw.ellipse((520 - 250, 560 - 250, 520 + 250, 560 + 250), fill=gold_soft)
            for i, (parts, col, dk) in enumerate(((["when", ("flag", ""), "clicked"], EVENTS, EVENTS_D),
                                                  (["move", ("num", "10"), "steps"], MOTION, MOTION_D),
                                                  (["set", ("var", "score"), "to", ("num", "0")], VARS, VARS_D))):
                a = K.stagger(t, i, step=0.12, speed=5)
                if a > 0:
                    block(draw, 330, 420 + i * 92 - (1 - a) * 40, parts, col, dk, 40, hat=i == 0)
            K.pill(draw, 0, 300 + lift, "UNIT 3", coral, size=34, left=900)
            K.text_at(draw, "Building", 1300, 380 + lift, F(86), ink)
            K.text_at(draw, "With Blocks", 1300, 480 + lift, F(86), ink)
            for i in range(5):
                a = K.stagger(t, i + 2, step=0.08, speed=5)
                if a > 0:
                    x = 1060 + i * 120
                    done = i < 2
                    draw.rounded_rectangle((x - 46, 650, x + 46, 742), radius=22,
                                           fill=sage_soft if done else panel,
                                           outline=coral if i == 2 else line, width=5 if i == 2 else 3)
                    if done:
                        K.draw_check(draw, x, 696, 26, sage)
                    else:
                        K.text_at(draw, str(i + 1), x, 664, F(46), coral if i == 2 else muted)
            K.text_at(draw, "Chapter 3 of 5", 1300, 770, F(32), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 230 + lift, w - 260, 560 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 290 + lift, F(32), coral)
            K.text_at(draw, "Variables", cx, 340 + lift, F(90), ink)
            K.text_at(draw, "Boxes that store things", cx, 460 + lift, F(48), muted)
            for i, (nm, val) in enumerate((("score", "0"), ("lives", "3"), ("name", "Riya"))):
                a = K.stagger(t, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 420
                var_box(draw, x, 860 - (1 - a) * 30, 0.62, nm, val, rise=a, label_size=46)
            return True
        if focus == "wonder":
            scr = phone(draw, (220, 300, 1060, 780), t)
            n = min(3, int(t * 4))
            mini_game(draw, scr, t, score=str(n), lives=3, cat_x=0.2 + 0.18 * n, coins=[0.55, 0.72, 0.88][n:])
            qmarks(((1260, 300), (1640, 340), (1400, 600)))
            K.text_at(draw, "How does the game", 1450, 440, F(50), ink)
            K.text_at(draw, "remember?", 1450, 500, F(60), coral)
            return True
        # promise
        K.text_at(draw, "Today's secret:", cx, 250 + lift, F(56), muted)
        K.text_at(draw, "a box that remembers!", cx, 326 + lift, F(70), coral)
        draw.ellipse((cx - 260, 650 - 220, cx + 260, 650 + 220), fill=gold_soft)
        var_box(draw, cx, 830, 0.95, "?", "?", rise=K.clamp01(t * 2), value_col=coral)
        for i, (sx, sy) in enumerate(((cx - 520, 520), (cx + 520, 540), (cx - 400, 760), (cx + 420, 780))):
            K.draw_star(draw, sx, sy + 10 * math.sin(t * 9 + i), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][i], rot=t * 3 + i)
        return True

    # ---- Riya's game ----------------------------------------------------------------
    if visual == "a13-hook":
        if focus == "meet":
            draw.ellipse((480 - 300, 600 - 260, 480 + 300, 600 + 260), fill=gold_soft)
            auto_rickshaw(draw, 470, 820, 1.25, t)
            K.text_at(draw, "Riya", 300, 260, F(64), coral)
            scr = phone(draw, (980, 330, 1760, 770), t)
            mini_game(draw, scr, t, score="0", lives=3, cat_x=0.18)
            K.text_at(draw, "Coin game!", 1370, 250, F(48), ink)
            return True
        if focus in ("coins", "spike"):
            inner, gy = stage(draw, (180, 230, 1740, 860), t)
            ix0, ix1 = inner[0], inner[2]
            if focus == "coins":
                n = min(3, int(t * 4.2))
                score, lives = str(n), 3
                cat_x = K.lerp(ix0 + 200, ix0 + 1080, K.clamp01(t * 1.25))
                jump = abs(math.sin(t * math.pi * 4.2)) * 110
                for i, c in enumerate((0.42, 0.6, 0.78)):
                    if i >= n:
                        coin(draw, ix0 + (ix1 - ix0) * c, gy - 250, 34, t)
                if n > 0:
                    K.text_at(draw, "Ding!", cat_x - 190, gy - 330 - jump, F(50), K.GOLD)
                mood = "happy"
            else:
                lost = t > 0.35
                score, lives = "3", 2 if lost else 3
                cat_x = ix0 + 900 - (40 * K.clamp01((t - 0.3) * 4))
                jump = 0
                spikes(draw, ix0 + 1000, gy, 4, 1.2)
                mood = "hurt" if lost else "idle"
                if lost:
                    K.text_at(draw, "Oops!", ix0 + 1100, gy - 400, F(56), K.DANGER)
            draw_cat(draw, cat_x, gy - 90 - jump, 0.9, t, mood)
            monitor(draw, ix0 + 24, inner[1] + 20, "score", score, size=40)
            for i in range(3):
                hx = ix1 - 70 - (2 - i) * 84
                on = i < lives
                if not on and focus == "spike":
                    fade = K.clamp01((t - 0.35) * 3)
                    K.draw_heart(draw, hx, inner[1] + 60 - 40 * fade, 32,
                                 tuple(int(K.lerp(c, 230, fade)) for c in K.DANGER))
                else:
                    K.draw_heart(draw, hx, inner[1] + 60, 32, K.DANGER if on else (210, 204, 198))
            return True
        if focus == "why":
            draw.ellipse((cx - 330, 560 - 300, cx + 330, 560 + 300), fill=lav_soft)
            monitor(draw, 300, 380, "score", "3", size=50)
            draw.rounded_rectangle((300, 560, 640, 650), radius=14, fill=(234, 239, 244), outline=(190, 198, 210),
                                   width=3)
            K.text_at(draw, "lives", 390, 580, F(46), BLOCK_INK)
            for i in range(2):
                K.draw_heart(draw, 520 + i * 60, 604, 22, K.DANGER)
            K.draw_magnifier(draw, cx, 540, 1.4, coral)
            K.text_at(draw, "?", cx - 12, 470, F(int(110 + 20 * pulse)), coral)
            K.text_at(draw, "Where are they kept?", 1420, 400, F(52), ink)
            qmarks(((1250, 560), (1560, 600)))
            K.draw_stopwatch(draw, 1420, 740, 56, t, brand)
            return True
        # secret
        for i, (nm, val) in enumerate((("score", "3"), ("lives", "2"))):
            a = K.stagger(t, i, step=0.15, speed=4)
            if a > 0:
                var_box(draw, 420 + i * 460, 830, 0.95, nm, val, rise=a)
        b = K.ease_out_cubic(K.clamp01((t - 0.55) * 2.5))
        if b > 0:
            s = 0.8 + 0.2 * b
            mx, my = 1460, 520
            K.shadow_card(draw, (mx - 300 * s, my - 150 * s, mx + 300 * s, my + 150 * s), brand, radius=40,
                          outline=VARS, outline_w=6)
            K.text_at(draw, "It's called a", mx, my - 100 * s, F(int(40 * s)), muted)
            K.text_at(draw, "VARIABLE", mx, my - 30 * s, F(int(84 * s)), VARS)
        return True

    # ---- definition --------------------------------------------------------------------
    if visual == "a13-define":
        if focus == "word":
            syl = (("Var", coral), ("i", K.BOTH_COLOR), ("a", sage), ("ble", VARS))
            for i, (s_, col) in enumerate(syl):
                a = K.stagger(t, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 330
                y = 290 + int((1 - a) * 50)
                draw.rounded_rectangle((x - 140, y, x + 140, y + 190), radius=40, fill=panel, outline=col, width=6)
                K.text_at(draw, s_, x, y + 40, F(96), col)
            a = K.stagger(t, 5, step=0.1, speed=4)
            if a > 0:
                y = 600 + int((1 - a) * 20)
                K.pill(draw, 0, y, "vary", K.BOTH_COLOR, size=46, left=560)
                K.draw_arrow(draw, 820, y + 40, 960, y + 40, muted, width=10, head=30)
                K.pill(draw, 0, y, "to change", sage, size=46, left=1000)
                for k, v in enumerate(("1", "2", "3")):
                    sx = 640 + k * 110
                    draw.rounded_rectangle((sx - 40, 740, sx + 40, 820), radius=18, fill=coral_soft, outline=coral,
                                           width=3)
                    text_c(draw, v, sx, 780, F(46), coral)
                    if k < 2:
                        K.draw_arrow(draw, sx + 44, 780, sx + 66, 780, muted, width=6, head=14)
            return True
        if focus == "meaning":
            draw.ellipse((470 - 270, 580 - 270, 470 + 270, 580 + 270), fill=gold_soft)
            var_box(draw, 470, 820, 1.05, "name", "value", rise=K.clamp01(t * 3), label_size=48)
            rows = [("A box with a name", coral), ("Holds ONE thing", K.BOTH_COLOR),
                    ("a number or a word", K.BOTH_COLOR), ("Can change while", sage), ("the game runs", sage)]
            groups = [(0, [0]), (1, [1, 2]), (2, [3, 4])]
            for gi, idxs in groups:
                a = K.stagger(t, gi, step=0.25, speed=4)
                if a <= 0:
                    continue
                y = 280 + gi * 190 + int((1 - a) * 30)
                col = rows[idxs[0]][1]
                draw.rounded_rectangle((900, y, 1760, y + 160), radius=36, fill=panel, outline=col, width=5)
                draw.ellipse((930, y + 40, 1010, y + 120), fill=col)
                K.text_at(draw, str(gi + 1), 970, y + 48, F(48), WHITE)
                if len(idxs) == 1:
                    draw.text((1040, y + 52), rows[idxs[0]][0], fill=ink, font=F(52))
                else:
                    draw.text((1040, y + 22), rows[idxs[0]][0], fill=ink, font=F(48))
                    draw.text((1040, y + 86), rows[idxs[1]][0], fill=muted if gi == 1 else ink, font=F(40))
            return True
        if focus == "parts":
            draw.ellipse((cx - 300, 560 - 290, cx + 300, 560 + 290), fill=gold_soft)
            var_box(draw, cx, 830, 1.25, "score", "5", rise=1.0, label_size=50)
            a = K.stagger(t, 0, step=0.3, speed=4)
            if a > 0:
                K.draw_arrow(draw, 560, 700, 740, 700, VARS, width=12, head=34)
                draw.rounded_rectangle((150, 600, 540, 800), radius=36, fill=panel, outline=VARS, width=5)
                K.text_at(draw, "NAME", 345, 625, F(56), VARS)
                K.text_at(draw, "on the outside", 345, 705, F(36), ink)
                K.text_at(draw, "what it's for", 345, 748, F(30), muted)
            b = K.stagger(t, 2, step=0.3, speed=4)
            if b > 0:
                K.draw_arrow(draw, 1370, 400, 1130, 400, sage, width=12, head=34)
                draw.rounded_rectangle((1390, 300, 1780, 500), radius=36, fill=panel, outline=sage, width=5)
                K.text_at(draw, "VALUE", 1585, 325, F(56), sage)
                K.text_at(draw, "on the inside", 1585, 405, F(36), ink)
                K.text_at(draw, "right now", 1585, 448, F(30), muted)
            return True
        # example
        draw.ellipse((640 - 290, 560 - 290, 640 + 290, 560 + 290), fill=gold_soft)
        rise = K.clamp01((t - 0.4) * 3)
        var_box(draw, 640, 830, 1.25, "score", "5" if rise > 0 else None, rise=rise, value_col=coral,
                label_size=50)
        K.text_at(draw, "In a game it shows like:", 1360, 330, F(40), muted)
        monitor(draw, 1180, 420, "score", "5" if rise > 0 else " ", size=56)
        rows = [("Name", "score", VARS), ("Value", "5", sage)]
        for i, (k_, v, col) in enumerate(rows):
            a = K.stagger(t, i + 1, step=0.25, speed=4)
            if a <= 0:
                continue
            y = 590 + i * 120 + int((1 - a) * 20)
            draw.rounded_rectangle((1150, y, 1700, y + 96), radius=28, fill=panel, outline=col, width=4)
            draw.text((1185, y + 26), k_ + ":", fill=muted, font=F(40))
            draw.text((1400, y + 22), v, fill=col, font=F(48))
        return True

    # ---- tiffin --------------------------------------------------------------------------
    if visual == "a13-tiffin":
        if focus == "intro":
            draw.ellipse((620 - 280, 560 - 280, 620 + 280, 560 + 280), fill=coral_soft)
            tiffin_label(draw, 620, 580, 2.0)
            K.draw_person(draw, 1340, 430, 1.3, "friend", t)
            K.text_at(draw, "My tiffin!", 1340, 720, F(52), ink)
            K.draw_heart(draw, 1500, 330 + bounce, 28, coral)
            return True
        if focus == "label":
            draw.ellipse((480 - 250, 560 - 250, 480 + 250, 560 + 250), fill=coral_soft)
            tiffin_label(draw, 480, 580, 1.8)
            a = K.stagger(t, 0, step=0.3, speed=4)
            if a > 0:
                K.pill(draw, 480, 790, "Label = whose box", VARS, size=36)
            b = K.stagger(t, 1, step=0.3, speed=4)
            if b > 0:
                draw.ellipse((1380 - 250, 540 - 250, 1380 + 250, 540 + 250), fill=sage_soft)
                plate(draw, 1380, 560 + (1 - b) * 30, 1.5, "poha", t)
                K.draw_steam(draw, 1380, 440, 1.0, t)
                K.pill(draw, 1380, 790, "Inside = lunch", sage, size=36)
            return True
        if focus == "days":
            days = (("MON", "poha", "Poha"), ("TUE", "paratha", "Paratha"), ("WED", "idli", "Idli"))
            for i, (d, food, lab) in enumerate(days):
                a = K.stagger(t, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 540
                y0 = 240 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 240, y0, x + 240, y0 + 620), radius=40,
                                       fill=[gold_soft, coral_soft, sage_soft][i], outline=line, width=3)
                K.pill(draw, x, y0 + 24, d, [K.GOLD, coral, sage][i], size=32)
                plate(draw, x, y0 + 210, 1.1, food, t)
                tiffin_label(draw, x, y0 + 440, 0.95)
                K.text_at(draw, lab, x, y0 + 552, F(38), ink)
            return True
        # same
        tiffin_label(draw, 360, 520, 1.5)
        plate(draw, 360, 760, 0.9, ["poha", "paratha", "idli"][min(2, int(t * 3))], t)
        K.text_at(draw, "=", 720, 470, F(120), muted)
        var_box(draw, 1010, 760, 0.95, "AARAV", ["poha", "paratha", "idli"][min(2, int(t * 3))], rise=1.0,
                label_size=40)
        rows = [("Name stays", "the same", VARS, True), ("Value keeps", "changing", sage, False)]
        for i, (l1, l2, col, chk) in enumerate(rows):
            a = K.stagger(t, i, step=0.25, speed=4)
            if a <= 0:
                continue
            y = 320 + i * 260 + int((1 - a) * 30)
            draw.rounded_rectangle((1300, y, 1780, y + 210), radius=36, fill=panel, outline=col, width=5)
            K.text_at(draw, l1, 1540, y + 40, F(44), ink)
            K.text_at(draw, l2, 1540, y + 105, F(44), col)
        return True

    # ---- variables in a game ---------------------------------------------------------------
    if visual == "a13-game":
        if focus == "intro":
            inner, gy = stage(draw, (220, 240, 1700, 860), t)
            for i, c in enumerate((0.5, 0.64, 0.78)):
                coin(draw, inner[0] + (inner[2] - inner[0]) * c, gy - 220, 32, t)
            spikes(draw, inner[0] + 1120, gy, 3, 1.0)
            draw_cat(draw, inner[0] + 320, gy - 90, 0.9, t, "happy")
            mons = (("score", "0"), ("lives", "3"), ("name", "Riya"))
            for i, (nm, v) in enumerate(mons):
                a = K.stagger(t, i, step=0.18, speed=5)
                if a > 0:
                    monitor(draw, inner[0] + 24 + i * 300, inner[1] + 20 - (1 - a) * 20, nm, v, size=38)
            return True
        if focus == "notvar":
            K.text_at(draw, "Variable or not?", cx, 230, F(56), ink)
            draw.rounded_rectangle((160, 320, 900, 860), radius=40, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            K.text_at(draw, "Things you touch", 530, 345, F(42), K.DANGER)
            scr = phone(draw, (220, 450, 560, 660), t)
            draw.rounded_rectangle(scr, radius=10, fill=(200, 224, 240))
            draw.line((scr[0] + 30, scr[3] - 20, scr[2] - 60, scr[1] + 20), fill=WHITE, width=10)
            K.text_at(draw, "screen glass", 390, 700, F(34), ink)
            charger(draw, 740, 560, 1.0)
            K.text_at(draw, "charger", 740, 700, F(34), ink)
            a = K.stagger(t, 1, step=0.2, speed=4)
            if a > 0:
                K.draw_cross(draw, 530, 790, 36, K.DANGER)
            draw.rounded_rectangle((1020, 320, 1760, 860), radius=40, fill=sage_soft, outline=sage, width=4)
            K.text_at(draw, "Values a game stores", 1390, 345, F(42), sage)
            var_box(draw, 1220, 720, 0.6, "score", "3", label_size=50)
            var_box(draw, 1560, 720, 0.6, "lives", "2", label_size=50)
            K.draw_check(draw, 1390, 790, 36, sage)
            return True
        cards = [("score", "0", "counts points", "starts at 0", coral, coral_soft),
                 ("lives", "3", "chances left", "like 3", K.DANGER, K.DANGER_SOFT),
                 ("name", "Riya", "a WORD,", "not a number!", K.BOTH_COLOR, lav_soft)]
        n = {"score": 1, "lives": 2, "name": 3}[focus]
        for i, (nm, v, l1, l2, col, soft) in enumerate(cards[:n]):
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(t * 3)) if active else 1.0
            x = cx + (i - 1) * 540
            y0 = 240 + int((1 - a) * 50)
            draw.rounded_rectangle((x - 245, y0, x + 245, y0 + 620), radius=40, fill=soft if active else panel,
                                   outline=col if active else line, width=6 if active else 3)
            var_box(draw, x, y0 + 390, 0.82, nm, v, rise=a, label_size=50)
            K.text_at(draw, l1, x, y0 + 440, F(40), ink)
            K.text_at(draw, l2, x, y0 + 500, F(40), col if active else muted)
            if nm == "lives":
                for k in range(3):
                    K.draw_heart(draw, x + 150 + 0 * k, y0 + 60 + k * 50, 18, K.DANGER)
            if nm == "name" and active:
                K.pill(draw, x, y0 + 556, "words too!", K.BOTH_COLOR, size=28)
        return True

    # ---- set / change blocks -------------------------------------------------------------------
    if visual == "a13-blocks":
        bx = 160
        if focus == "intro":
            draw.rounded_rectangle((120, 250, 1000, 840), radius=36, fill=panel, outline=line, width=3)
            draw.ellipse((160, 280, 204, 324), fill=VARS)
            draw.text((222, 280), "Variables", fill=ink, font=F(40))
            a = K.stagger(t, 0, step=0.3, speed=4)
            if a > 0:
                K.pill(draw, 0, 380, "1 · SET", VARS_D, size=30, left=180)
                set_block(draw, 180, 450 - (1 - a) * 20, "score", "0", 48)
            b = K.stagger(t, 1, step=0.3, speed=4)
            if b > 0:
                K.pill(draw, 0, 600, "2 · CHANGE", VARS_D, size=30, left=180)
                change_block(draw, 180, 670 - (1 - b) * 20, "score", "1", 48)
            draw.ellipse((1400 - 260, 580 - 260, 1400 + 260, 580 + 260), fill=gold_soft)
            var_box(draw, 1400, 820, 1.05, "score", "5", label_size=50)
            return True
        if focus == "set":
            set_block(draw, bx, 360, "score", "0", 52)
            K.text_at(draw, "puts in a NEW value", 500, 520, F(40), muted)
            K.draw_arrow(draw, 820, 410, 1060, 410, VARS, width=12, head=34)
            draw.ellipse((1400 - 260, 600 - 260, 1400 + 260, 600 + 260), fill=gold_soft)
            out = K.ease_in_out(K.clamp01((t - 0.15) * 2.5))
            newv = t > 0.55
            var_box(draw, 1400, 830, 1.05, "score", "0" if newv else ("7" if out < 0.05 else None),
                    rise=K.clamp01((t - 0.55) * 3) if newv else 1.0, value_col=coral)
            if 0.05 <= out and not newv:
                ox, oy = 1400 + 260 * out, 520 - 220 * out
                draw.rounded_rectangle((ox - 60, oy - 60, ox + 60, oy + 60), radius=20, fill=WHITE, outline=K.DEV_DARK,
                                       width=4)
                text_c(draw, "7", ox, oy, F(72), muted)
            if 0.2 < t <= 0.55:
                draw.text((1440, 250), "bye, 7!", fill=muted, font=F(36))
            return True
        if focus == "fresh":
            flag_block(draw, bx, 330, 46)
            set_block(draw, bx, 330 + 92, "score", "0", 46)
            block(draw, bx, 330 + 184, ["move", ("num", "10"), "steps"], MOTION, MOTION_D, 46)
            K.draw_arrow(draw, 120, 470, 150, 470, coral, width=10, head=26)
            K.text_at(draw, "first thing!", 360, 660, F(36), coral)
            for i in range(3):
                a = K.stagger(t, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 260 + i * 200 + int((1 - a) * 20)
                draw.rounded_rectangle((1000, y, 1760, y + 170), radius=36, fill=sage_soft, outline=sage, width=4)
                draw.text((1040, y + 58), f"Game {i + 1}", fill=ink, font=F(46))
                monitor(draw, 1290, y + 44, "score", "0", size=44)
                K.draw_check(draw, 1690, y + 85, 30, sage)
            return True
        if focus in ("change", "minus"):
            minus = focus == "minus"
            change_block(draw, bx, 360, "score", "-1" if minus else "1", 52)
            K.text_at(draw, "takes one away" if minus else "adds one", 500, 520, F(40), muted)
            K.draw_arrow(draw, 900, 410, 1080, 410, VARS, width=12, head=34)
            draw.ellipse((1400 - 260, 600 - 260, 1400 + 260, 600 + 260), fill=gold_soft)
            flip = t > 0.6
            old, new = ("6", "5") if minus else ("5", "6")
            var_box(draw, 1400, 830, 1.05, "score", new if flip else old,
                    rise=K.clamp01((t - 0.6) * 4) if flip else 1.0, value_col=coral if flip else None)
            a = K.clamp01((t - 0.35) * 3)
            if a > 0:
                plus_badge(draw, 1660, 330 - 30 * a, "-1" if minus else "+1", K.DANGER if minus else sage, 50)
            if minus:
                bug(draw, 1000 + 40 * math.sin(t * 3), 760, 1.0, t)
            row_y = 680
            draw.text((200, row_y), old, fill=ink, font=F(80))
            K.draw_arrow(draw, 290, row_y + 46, 420, row_y + 46, muted, width=10, head=28)
            draw.text((450, row_y), new, fill=coral if flip else line, font=F(80))
            return True
        return False

    # ---- good names ---------------------------------------------------------------------------
    if visual == "a13-names":
        if focus == "intro":
            for i in range(3):
                a = K.stagger(t, i, step=0.15, speed=4)
                if a > 0:
                    var_box(draw, 380 + i * 420, 830 - (1 - a) * 30, 0.8, "?", None, label_size=56)
            K.text_at(draw, "Every box needs", 1500 - 0, 300, F(52), ink)
            K.text_at(draw, "a good name!", 1500, 370, F(64), coral)
            K.draw_bag(draw, 1560, 680, 0.9, K.ROAD)
            draw.rounded_rectangle((1500, 690, 1620, 740), radius=10, fill=WHITE, outline=VARS, width=4)
            text_c(draw, "RIYA", 1560, 715, F(28), K.DEV_DEEP)
            return True
        if focus in ("bad", "good"):
            good = focus == "good"
            names = ("stars", "lives", "score") if good else ("x1", "box", "abc")
            vals = ("12", "3", "40") if good else ("?", "?", "?")
            for i, (nm, v) in enumerate(zip(names, vals)):
                a = K.stagger(t, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 340 + i * 440
                var_box(draw, x, 800 - (1 - a) * 30, 0.85, nm, v, rise=a, value_col=sage if good else K.DANGER,
                        label_size=54)
                mark = K.stagger(t, i + 3, step=0.1, speed=4)
                if mark > 0:
                    (K.draw_check if good else K.draw_cross)(draw, x + 150, 470, 34, sage if good else K.DANGER)
            if good:
                K.draw_bag(draw, 1640, 600, 0.85, K.ROAD)
                draw.rounded_rectangle((1580, 610, 1700, 660), radius=10, fill=WHITE, outline=VARS, width=4)
                text_c(draw, "RIYA", 1640, 635, F(28), K.DEV_DEEP)
                K.pill(draw, 1640, 760, "short & clear", sage, size=30)
            else:
                K.draw_person(draw, 1640, 470, 1.0, "friend", t)
                draw.ellipse((1700, 290, 1800, 380), fill=panel, outline=ink, width=3)
                text_c(draw, "?", 1750, 334, F(60), K.DANGER)
                K.text_at(draw, "Huh?", 1640, 640, F(44), muted)
            return True
        # ask / answer
        ans = focus == "answer"
        draw.ellipse((420 - 250, 560 - 250, 420 + 250, 560 + 250), fill=gold_soft)
        for k in range(5):
            ang = k * 2 * math.pi / 5 + t
            K.draw_star(draw, 420 + math.cos(ang) * 150, 520 + math.sin(ang) * 110, 40, K.GOLD, rot=t * 2 + k)
        coin_count = "Stars collected"
        K.text_at(draw, coin_count, 420, 720, F(40), ink)
        K.text_at(draw, "Best name for this box?", 1230, 240, F(46), ink)
        opts = ("x1", "box", "stars", "abc")
        for i, o in enumerate(opts):
            col_i, row_i = i % 2, i // 2
            x0, y0 = 830 + col_i * 470, 340 + row_i * 230
            right = i == 2
            win = ans and right
            dim = ans and not right
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 420 + 8, y0 + 190 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 420, y0 + 190), radius=36, fill=sage_soft if win else panel,
                                   outline=sage if win else line, width=6 if win else 3)
            K.pill(draw, 0, y0 + 24, "ABCD"[i], sage if win else (K.STEEL if dim else K.BOTH_COLOR), size=28,
                   left=x0 + 24)
            text_c(draw, o, x0 + 230, y0 + 105, F(66), muted if dim else ink)
            if win:
                K.draw_check(draw, x0 + 370, y0 + 50, 28, sage)
        if not ans:
            K.draw_stopwatch(draw, 1295, 820, 40, t, brand)
        else:
            for i, (sx, sy) in enumerate(((1295, 820), (1100, 820), (1490, 820))):
                K.draw_star(draw, sx, sy + 8 * math.sin(t * 9 + i), 22 + 6 * pulse,
                            [sage, K.GOLD, coral][i], rot=t * 3 + i)
        return True

    # ---- detective puzzle --------------------------------------------------------------------
    steps = [("set", "0", None), ("chg", "1", "coin"), ("chg", "1", "coin"), ("chg", "1", "coin"),
             ("chg", "-1", "bug")]
    trace = ["0", "1", "2", "3", "2"]

    def stack(n_shown, active=-1, size=44, x=300, y=290):
        for i, (kind, v, icon) in enumerate(steps):
            a = K.ease_out_cubic(K.clamp01((n_shown - i) * 2.5))
            if a <= 0:
                continue
            yy = y + i * size * 2 + (1 - a) * 30
            if i == active:
                draw.rounded_rectangle((x - 140, yy - 4, x + 600, yy + size * 2 + 4), radius=24, fill=coral_soft)
            if kind == "set":
                set_block(draw, x, yy, "score", v, size)
            else:
                change_block(draw, x, yy, "score", v, size)
            if icon == "coin":
                coin(draw, x - 70, yy + 38, 28, 0.0)
            elif icon == "bug":
                bug(draw, x - 70, yy + 42, 0.62, t)
            else:
                _flag(draw, x - 92, yy + 44, 1.0)

    if visual == "a13-puzzle":
        if focus == "intro":
            K.draw_magnifier(draw, 520, 540, 1.8, coral)
            K.text_at(draw, "Follow the", 1260, 300 + lift, F(60), ink)
            K.text_at(draw, "score box!", 1260, 380 + lift, F(80), coral)
            var_box(draw, 1260, 840, 0.8, "score", "?", value_col=coral, label_size=52)
            return True
        if focus in ("run", "ask"):
            ask = focus == "ask"
            stack(5 if ask else t * 6.0 - 0.3)
            draw.ellipse((1430 - 260, 580 - 260, 1430 + 260, 580 + 260), fill=lav_soft if ask else gold_soft)
            var_box(draw, 1430, 820, 1.05, "score", "?", value_col=coral)
            if ask:
                qmarks(((1120, 300), (1760, 360)))
                K.draw_stopwatch(draw, 1760, 760, 50, t, brand)
            return True
        # answer
        k_ = min(4, int(t * 5.5))
        stack(5, active=k_)
        draw.ellipse((1430 - 240, 560 - 240, 1430 + 240, 560 + 240), fill=sage_soft if k_ == 4 else gold_soft)
        var_box(draw, 1430, 760, 0.95, "score", trace[k_], value_col=coral)
        for i in range(k_ + 1):
            x = 1150 + i * 120
            col = sage if i == 4 else ink
            text_c(draw, trace[i], x, 830, F(54), col)
            if i < k_:
                K.draw_arrow(draw, x + 26, 830, x + 92, 830, muted, width=6, head=16)
        if k_ == 4 and t > 0.85:
            stars_at(1430, 460, 300, 4)
        return True

    # ---- checkpoint -----------------------------------------------------------------------------
    if visual == "a13-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 700 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, F(40), sage)
            K.text_at(draw, "Work it out, champ!", cx, 470 + lift, F(64), ink)
            K.draw_check(draw, cx, 620 + lift, 44, sage)
            return True
        bonus = focus in ("bonus", "bonusA")
        reveal = focus in ("answer", "bonusA")
        inner, gy = stage(draw, (140, 240, 1000, 860), t)
        hits = 2 if bonus else 1
        if focus == "answer":
            lives_now = 3 if t < 0.05 else 2
        elif focus == "bonusA":
            lives_now = 3 if t < 0.05 else 1
        else:
            lives_now = 3
        spikes(draw, inner[0] + 470, gy, 3, 1.0)
        if bonus:
            spikes(draw, inner[0] + 120, gy, 2, 1.0)
        hurt = reveal and lives_now < 3
        draw_cat(draw, inner[0] + (380 if not bonus else 330), gy - 80, 0.72, t, "hurt" if hurt else "idle")
        for i in range(3):
            K.draw_heart(draw, inner[2] - 70 - (2 - i) * 76, inner[1] + 50, 28,
                         K.DANGER if i < lives_now else (210, 204, 198))
        draw.rounded_rectangle((1060, 250, 1780, 380), radius=30, fill=panel, outline=line, width=3)
        q = "3 lives · 2 spikes" if bonus else "3 lives · 1 spike"
        K.text_at(draw, q, 1420, 286, F(50), ink)
        if not reveal:
            var_box(draw, 1420, 830, 0.9, "lives", "?", value_col=coral, label_size=52)
            K.pill(draw, 1420, 400, "Bonus!" if bonus else "Pause & try!", coral, size=34)
            K.draw_stopwatch(draw, 1720, 760, 44, t, brand)
        else:
            result = str(lives_now)
            var_box(draw, 1240, 830, 0.8, "lives", result, value_col=sage, label_size=52)
            change_block(draw, 1060, 420, "lives", "-1", 38)
            eq = "3 − 1 = 2" if not bonus else "3 → 2 → 1"
            a = K.clamp01((t - 0.3) * 3)
            if a > 0:
                draw.rounded_rectangle((1460, 560, 1790, 680), radius=30, fill=sage_soft, outline=sage, width=4)
                text_c(draw, eq, 1625, 620, F(46), sage)
            if hits and t > 0.75:
                for i, (sx, sy) in enumerate(((1520, 760), (1730, 760))):
                    K.draw_star(draw, sx, sy + 8 * math.sin(t * 9 + i), 22 + 6 * pulse, [sage, K.GOLD][i],
                                rot=t * 3 + i)
        return True

    # ---- recap -----------------------------------------------------------------------------------
    if visual == "a13-recap":
        recap = [("A named box with a value", VARS, "box"), ("Values change · numbers or words", K.BOTH_COLOR, "swap"),
                 ("+1 goes up, -1 goes down", sage, "plus"), ("Clear names: stars, not x1", coral, "name")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(t * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "box":
                    var_box(draw, ix, iy + 120, 0.6, "score", "5", label_size=50)
                elif kind == "swap":
                    for k, (v, col) in enumerate((("5", coral), ("6", coral))):
                        bx0 = ix - 150 + k * 190
                        draw.rounded_rectangle((bx0, iy - 120, bx0 + 110, iy - 20), radius=22, fill=WHITE,
                                               outline=K.DEV_DARK, width=4)
                        text_c(draw, v, bx0 + 55, iy - 70, F(56), col)
                    K.draw_arrow(draw, ix - 30, iy - 70, ix + 30, iy - 70, muted, width=8, head=22)
                    draw.rounded_rectangle((ix - 120, iy + 10, ix + 120, iy + 110), radius=22, fill=WHITE,
                                           outline=K.BOTH_COLOR, width=4)
                    text_c(draw, "Riya", ix, iy + 60, F(52), K.BOTH_COLOR)
                elif kind == "plus":
                    plus_badge(draw, ix - 80, iy, "+1", sage, 60)
                    plus_badge(draw, ix + 80, iy, "-1", K.DANGER, 60)
                else:
                    for k, (nm, ok) in enumerate((("stars", True), ("x1", False))):
                        yy = iy - 70 + k * 110
                        draw.rounded_rectangle((ix - 140, yy - 40, ix + 80, yy + 40), radius=16, fill=WHITE,
                                               outline=VARS, width=4)
                        text_c(draw, nm, ix - 30, yy, F(42), K.DEV_DEEP)
                        (K.draw_check if ok else K.draw_cross)(draw, ix + 130, yy, 28, sage if ok else K.DANGER)
                font = F(34)
                lines = K.wrap_text(lab, font, 340)
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 44, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            draw_cat(draw, cx + 300, 470, 1.0, t, "happy")
            K.text_at(draw, "Chapter 3 done!", cx, 650, F(68), ink)
            K.pill(draw, cx, 760, "Variables: boxes that store things", coral, size=34)
            for i, (sx, sy) in enumerate(((cx - 640, 320), (cx + 660, 330), (cx, 300), (cx - 760, 600),
                                          (cx + 780, 610))):
                K.draw_star(draw, sx, sy + 10 * math.sin(t * 9 + i), 22 + 6 * pulse,
                            [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=t * 3 + i)
            return True
        if focus == "quiz":
            K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64), coral)
            K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44), ink)
            K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
            return True
    return False
