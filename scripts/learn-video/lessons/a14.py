"""A14 · Making Choices in Code — visuals."""
import math

import build as K

A = K.lesson_plugin("a13-kit")

CONTROL, CONTROL_D = (255, 171, 25), (207, 139, 23)
SENSING, SENSING_D = (92, 177, 214), (46, 142, 184)
LOOKS, LOOKS_D = (153, 102, 255), (119, 77, 204)
SOUND, SOUND_D = (207, 99, 207), (176, 66, 176)
MOTION, MOTION_D = A.MOTION, A.MOTION_D
VARS, VARS_D = A.VARS, A.VARS_D
GREY, GREY_D = (196, 198, 206), (160, 162, 172)
WHITE = (255, 255, 255)
BRICK, BRICK_D, MORTAR = (196, 96, 64), (150, 66, 42), (236, 214, 196)
RAIN_SKY, CLOUD_D = (150, 162, 184), (118, 128, 148)
SUN_SKY = (200, 230, 252)

F = A._f
text_c = A.text_c


# ---- blocks with conditions -------------------------------------------------------

def hex_w(draw, txt, size):
    return draw.textbbox((0, 0), txt, font=F(size * 0.85))[2] + size * 1.6


def draw_hex(draw, x, cy, txt, size, state=None):
    wd, hh = hex_w(draw, txt, size), size * 1.45
    pts = [(x, cy), (x + hh / 2, cy - hh / 2), (x + wd - hh / 2, cy - hh / 2), (x + wd, cy),
           (x + wd - hh / 2, cy + hh / 2), (x + hh / 2, cy + hh / 2)]
    if state:
        ring = (13, 148, 136) if state == "true" else K.DANGER
        g = 8
        draw.polygon([(x - g, cy), (x + hh / 2 - 2, cy - hh / 2 - g), (x + wd - hh / 2 + 2, cy - hh / 2 - g),
                      (x + wd + g, cy), (x + wd - hh / 2 + 2, cy + hh / 2 + g), (x + hh / 2 - 2, cy + hh / 2 + g)],
                     fill=ring)
    draw.polygon(pts, fill=SENSING, outline=SENSING_D, width=3)
    text_c(draw, txt, x + wd / 2, cy, F(size * 0.85), WHITE)
    return wd


def parts_w(draw, parts, size):
    tot = 0.0
    for p in parts:
        tot += hex_w(draw, p[1], size) if isinstance(p, tuple) and p[0] == "hex" else A._parts_w(draw, [p], size)
        tot += size * 0.4
    return tot - size * 0.4


def draw_parts(draw, x, cy, parts, size):
    for p in parts:
        if isinstance(p, tuple) and p[0] == "hex":
            x += draw_hex(draw, x, cy, p[1], size, p[2] if len(p) > 2 else None)
        else:
            A._draw_parts(draw, x, cy, [p], size)
            x += A._parts_w(draw, [p], size)
        x += size * 0.4


def blk(draw, x, y, parts, color, dark, size=36, dim=False):
    bw = parts_w(draw, parts, size) + size * 1.4
    if dim:
        color, dark = GREY, GREY_D
    A.block(draw, x, y, [], color, dark, size, w=bw)
    draw_parts(draw, x + size * 0.7, y + size, parts, size)
    return bw, size * 2


def c_block(draw, x, y, cond, inner, else_inner=None, size=36, head="if", tail="then", active=None,
            dim=None, cond_state=None, color=CONTROL, dark=CONTROL_D):
    """Scratch C-block. inner / else_inner: lists of (parts, color, dark). Returns (width, height)."""
    k = size / 34
    H, S, bh, F_ = size * 2.3, size * 0.9, size * 2.0, size * 1.1
    head_parts = [head, ("hex", cond, cond_state), tail] if cond else [head]
    W = parts_w(draw, head_parts, size) + size * 1.4
    for items in (inner, else_inner or []):
        for parts, _, _ in items:
            W = max(W, S + parts_w(draw, parts, size) + size * 2.0)
    Ih = len(inner) * bh if inner else size * 1.2
    has_else = else_inner is not None
    M = size * 1.7 if has_else else 0
    Ie = (len(else_inner) * bh if else_inner else size * 1.2) if has_else else 0
    c, nd = 6 * k, 10 * k

    def mouth(y_top):
        return [(x + W - c, y_top), (x + S + 70 * k, y_top), (x + S + 60 * k, y_top + nd), (x + S + 30 * k, y_top + nd),
                (x + S + 20 * k, y_top), (x + S, y_top)]

    pts = [(x + c, y), (x + 20 * k, y), (x + 30 * k, y + nd), (x + 60 * k, y + nd), (x + 70 * k, y),
           (x + W - c, y), (x + W, y + c), (x + W, y + H - c)]
    pts += mouth(y + H)
    y1 = y + H + Ih
    pts += [(x + S, y1), (x + W - c, y1), (x + W, y1 + c)]
    if has_else:
        pts += [(x + W, y1 + M - c)] + mouth(y1 + M)
        y1 = y1 + M + Ie
        pts += [(x + S, y1), (x + W - c, y1), (x + W, y1 + c)]
    b = y1 + F_
    pts += [(x + W, b - c), (x + W - c, b), (x + 70 * k, b), (x + 60 * k, b + nd), (x + 30 * k, b + nd),
            (x + 20 * k, b), (x + c, b), (x, b - c), (x, y + c)]
    draw.polygon(pts, fill=color, outline=dark, width=3)
    draw_parts(draw, x + size * 0.7, y + H / 2, head_parts, size)

    def branch(items, y_top, h_, name):
        if active == name:
            iw = max([parts_w(draw, p, size) + size * 1.4 for p, _, _ in items] or [size * 3])
            draw.rounded_rectangle((x + S - 10, y_top - 8, x + S + iw + 12, y_top + h_ + 14), radius=18,
                                   outline=(13, 148, 136), width=7)
        for i, (parts, col, dk) in enumerate(items):
            blk(draw, x + S, y_top + i * bh, parts, col, dk, size, dim=dim == name)

    branch(inner, y + H, Ih, "then")
    if has_else:
        ym = y + H + Ih
        A._draw_parts(draw, x + size * 0.7, ym + M / 2, ["else"], size)
        branch(else_inner, ym + M, Ie, "else")
    return W, b - y


def say(txt):
    return (["say", ("num", txt)], LOOKS, LOOKS_D)


def chg(name, v):
    return (["change", ("var", name), "by", ("num", v)], VARS, VARS_D)


# ---- illustrations ------------------------------------------------------------------

def cloud(draw, cx, cy, s, col):
    for dx, dy, r in ((-60, 10, 44), (-10, -16, 58), (50, 4, 46), (0, 20, 50)):
        draw.ellipse((cx + dx * s - r * s, cy + dy * s - r * s, cx + dx * s + r * s, cy + dy * s + r * s), fill=col)


def sun(draw, cx, cy, r, t):
    for k in range(8):
        a = k * math.pi / 4 + t
        draw.line((cx + math.cos(a) * r * 1.3, cy + math.sin(a) * r * 1.3, cx + math.cos(a) * r * 1.75,
                   cy + math.sin(a) * r * 1.75), fill=K.GOLD, width=max(3, int(r * 0.14)))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=K.GOLD)


def window(draw, box, t, weather="rain"):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=20, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=20, fill=(170, 120, 80))
    inner = (x0 + 22, y0 + 22, x1 - 22, y1 - 22)
    draw.rectangle(inner, fill=RAIN_SKY if weather == "rain" else SUN_SKY)
    ix0, iy0, ix1, iy1 = inner
    if weather == "rain":
        cloud(draw, ix0 + (ix1 - ix0) * 0.3, iy0 + 80, 1.0, CLOUD_D)
        cloud(draw, ix0 + (ix1 - ix0) * 0.72, iy0 + 110, 0.9, (104, 114, 134))
        for k in range(18):
            rx = ix0 + 30 + (k * 53) % (ix1 - ix0 - 60)
            ry = iy0 + 150 + ((t * 2.2 + k * 0.37) % 1) * (iy1 - iy0 - 170)
            draw.line((rx, ry, rx - 8, ry + 26), fill=(214, 232, 250), width=5)
    else:
        sun(draw, ix0 + (ix1 - ix0) * 0.62, iy0 + (iy1 - iy0) * 0.4, 60, t)
        cloud(draw, ix0 + (ix1 - ix0) * 0.28, iy0 + 90, 0.7, WHITE)
    mx, my = (ix0 + ix1) / 2, (iy0 + iy1) / 2
    draw.rectangle((mx - 8, iy0, mx + 8, iy1), fill=(170, 120, 80))
    draw.rectangle((ix0, my - 8, ix1, my + 8), fill=(170, 120, 80))


def umbrella(draw, cx, cy, s, col=(123, 97, 214)):
    def S(v):
        return v * s
    draw.line((cx, cy - S(60), cx, cy + S(80)), fill=K.DEV_DARK, width=max(3, int(S(8))))
    draw.arc((cx, cy + S(56), cx + S(40), cy + S(100)), 0, 180, fill=K.DEV_DARK, width=max(3, int(S(8))))
    draw.chord((cx - S(110), cy - S(110), cx + S(110), cy + S(50)), 180, 360, fill=col)
    for k in range(4):
        sx = cx - S(110) + k * S(55)
        draw.chord((sx, cy - S(52), sx + S(55), cy - S(14)), 0, 180, fill=K.hex_rgb("#FFF8EF"))
    draw.ellipse((cx - S(8), cy - S(124), cx + S(8), cy - S(106)), fill=K.DEV_DARK)


def cap(draw, cx, cy, s, col=(255, 106, 26)):
    """cy = bottom of the dome."""
    def S(v):
        return v * s
    draw.chord((cx - S(64), cy - S(64), cx + S(64), cy + S(60)), 180, 360, fill=col)
    draw.rounded_rectangle((cx + S(20), cy - S(10), cx + S(118), cy + S(10)), radius=S(10), fill=tuple(
        int(v * 0.8) for v in col))
    draw.ellipse((cx - S(10), cy - S(72), cx + S(10), cy - S(56)), fill=tuple(int(v * 0.8) for v in col))


def kid(draw, cx, cy, s, t=0.0, with_cap=False, with_umbrella=False):
    K.draw_person(draw, cx, cy, s, "kid", t)
    yy = cy + 6 * s * math.sin(t * math.pi * 4)
    if with_cap:
        cap(draw, cx, yy - 34 * s, s * 1.05)
    if with_umbrella:
        umbrella(draw, cx + 110 * s, yy - 120 * s, s * 0.9)


def wall(draw, x0, y0, x1, y1):
    draw.rectangle((x0, y0, x1, y1), fill=BRICK)
    bh = 34
    row = 0
    y = y0
    while y < y1:
        draw.line((x0, y, x1, y), fill=MORTAR, width=4)
        off = 0 if row % 2 == 0 else (x1 - x0) / 2
        draw.line((x0 + off, y, x0 + off, min(y1, y + bh)), fill=MORTAR, width=4)
        y += bh
        row += 1
    draw.rectangle((x0, y0, x1, y1), outline=BRICK_D, width=4)


def ball(draw, cx, cy, r, t=0.0):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=WHITE, outline=K.DEV_DEEP, width=max(2, int(r * 0.1)))
    pts = [(cx + r * 0.36 * math.cos(a), cy + r * 0.36 * math.sin(a))
           for a in [t * 3 + k * 2 * math.pi / 5 for k in range(5)]]
    draw.polygon(pts, fill=K.DEV_DEEP)


def goal(draw, cx, by, s):
    def S(v):
        return v * s
    x0, x1, top = cx - S(150), cx + S(150), by - S(190)
    for k in range(7):
        x = x0 + k * (x1 - x0) / 6
        draw.line((x, top, x + S(30), by - S(20)), fill=(210, 214, 222), width=max(1, int(S(3))))
    for k in range(5):
        y = top + k * (by - top) / 5
        draw.line((x0, y, x1, y), fill=(210, 214, 222), width=max(1, int(S(3))))
    draw.line((x0, by, x0, top, x1, top, x1, by), fill=WHITE, width=max(3, int(S(14))))
    draw.line((x0, by, x0, top, x1, top, x1, by), fill=K.STEEL_DARK, width=max(1, int(S(3))))


def crowd(draw, x0, y, n, t):
    cols = [K.CORAL, K.GOLD, (123, 97, 214), (13, 148, 136), K.ROAD]
    for i in range(n):
        x = x0 + i * 70
        jy = 10 * abs(math.sin(t * 12 + i))
        draw.chord((x - 32, y - 10 - jy, x + 32, y + 50 - jy), 180, 360, fill=cols[i % 5])
        draw.ellipse((x - 22, y - 56 - jy, x + 22, y - 12 - jy), fill=K.SKIN)
        draw.line((x - 26, y - 4 - jy, x - 40, y - 50 - jy), fill=cols[i % 5], width=8)
        draw.line((x + 26, y - 4 - jy, x + 40, y - 50 - jy), fill=cols[i % 5], width=8)


def dog(draw, cx, cy, s, t=0.0):
    """cy = body centre."""
    def S(v):
        return v * s
    fur, dark = (186, 132, 84), (120, 80, 46)
    draw.ellipse((cx - S(90), cy + S(56), cx + S(90), cy + S(76)), fill=K.SHADOW)
    draw.line([(cx - S(80), cy - S(10)), (cx - S(120), cy - S(50) + S(8) * math.sin(t * 16))], fill=fur,
              width=max(3, int(S(16))))
    draw.rounded_rectangle((cx - S(90), cy - S(30), cx + S(60), cy + S(40)), radius=S(34), fill=fur)
    for lx in (-70, -30, 20, 50):
        draw.rounded_rectangle((cx + S(lx) - S(10), cy + S(20), cx + S(lx) + S(10), cy + S(66)), radius=S(8), fill=fur)
    hx, hy = cx + S(80), cy - S(56)
    draw.ellipse((hx - S(52), hy - S(48), hx + S(52), hy + S(48)), fill=fur)
    draw.ellipse((hx + S(20), hy - S(4), hx + S(78), hy + S(36)), fill=(222, 184, 140))
    draw.ellipse((hx + S(62), hy, hx + S(82), hy + S(18)), fill=K.DEV_DEEP)
    draw.ellipse((hx + S(8), hy - S(22), hx + S(24), hy - S(6)), fill=K.DEV_DEEP)
    draw.ellipse((hx - S(56), hy - S(36), hx - S(18), hy + S(40)), fill=dark)


def fork(draw, cx, y, q, left, right, s=1.0):
    """Question hexagon with TRUE/FALSE paths. left/right = (label, drawer)."""
    qw = hex_w(draw, q, 40 * s)
    draw_hex(draw, cx - qw / 2, y, q, 40 * s)
    for side, (lab, col, fn) in ((-1, left), (1, right)):
        ex = cx + side * 210 * s
        K.draw_arrow(draw, cx + side * 40 * s, y + 40 * s, ex, y + 150 * s, col, width=max(3, int(10 * s)),
                     head=int(28 * s))
        K.pill(draw, cx + side * 200 * s, y + 52 * s, lab, col, size=int(26 * s))
        fn(ex, y + 260 * s)


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

    def stars(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(draw, sx, sy + 10 * math.sin(t * 9 + i), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=t * 3 + i)

    def qmarks(pts):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(int(80 + 20 * (pulse if k % 2 else 1 - pulse))), K.GOLD)

    def tf_pill(x, y, val, size=34):
        return K.pill(draw, x, y, "TRUE" if val else "FALSE", sage if val else K.DANGER, size=size)

    def coin_block(x, y, size=40, **kw):
        return c_block(draw, x, y, "touching coin?", [chg("score", "1")], size=size, **kw)

    def wall_block(x, y, size=40, **kw):
        return c_block(draw, x, y, "touching wall?", [(["bounce"], MOTION, MOTION_D)],
                       [(["move", ("num", "10"), "steps"], MOTION, MOTION_D)], size=size, **kw)

    # ---- opening -------------------------------------------------------------------
    if visual == "a14-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 470, 110, sage, panel, bounce)
            A.draw_cat(draw, cx + 300, 520, 1.15, t, "happy")
            K.text_at(draw, "Welcome back, champ!", cx, 720, F(64), ink)
            stars(((cx - 620, 320), (cx + 640, 330), (cx - 40, 300), (cx + 760, 600)))
            return True
        if focus == "bridge":
            K.pill(draw, 0, 240, "LAST TIME", sage, size=30, left=160)
            A.set_block(draw, 180, 340, "score", "0", 44)
            A.change_block(draw, 180, 340 + 88, "score", "1", 44)
            for i, (nm, v) in enumerate((("score", "3"), ("lives", "2"), ("name", "Riya"))):
                a = K.stagger(t, i, step=0.15, speed=4)
                if a > 0:
                    A.var_box(draw, 980 + i * 330, 830 - (1 - a) * 30, 0.68, nm, v, rise=a, label_size=48)
            K.draw_check(draw, 420, 680, 40, sage)
            K.text_at(draw, "You did it!", 420, 740, F(40), sage)
            return True
        if focus == "unit":
            draw.ellipse((520 - 260, 560 - 260, 520 + 260, 560 + 260), fill=gold_soft)
            c_block(draw, 300, 400 - lift, "raining?", [say("umbrella!")], [say("cap!")], size=34)
            K.pill(draw, 0, 300 + lift, "UNIT 3", coral, size=34, left=900)
            K.text_at(draw, "Building", 1300, 380 + lift, F(86), ink)
            K.text_at(draw, "With Blocks", 1300, 480 + lift, F(86), ink)
            for i in range(5):
                a = K.stagger(t, i + 2, step=0.08, speed=5)
                if a > 0:
                    x = 1060 + i * 120
                    done = i < 3
                    draw.rounded_rectangle((x - 46, 650, x + 46, 742), radius=22, fill=sage_soft if done else panel,
                                           outline=coral if i == 3 else line, width=5 if i == 3 else 3)
                    if done:
                        K.draw_check(draw, x, 696, 26, sage)
                    else:
                        K.text_at(draw, str(i + 1), x, 664, F(46), coral if i == 3 else muted)
            K.text_at(draw, "Chapter 4 of 5", 1300, 770, F(32), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 230 + lift, w - 300, 470 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 290 + lift, F(32), coral)
            K.text_at(draw, "Making Choices in Code", cx, 346 + lift, F(84), ink)
            a = K.stagger(t, 2, step=0.12, speed=4)
            if a > 0:
                draw.polygon([(cx - 60, 860), (cx + 60, 860), (cx + 40, 700), (cx - 40, 700)], fill=(214, 206, 192))
                draw.polygon([(cx - 40, 700), (cx, 700), (cx - 300, 560), (cx - 360, 590)], fill=(214, 206, 192))
                draw.polygon([(cx, 700), (cx + 40, 700), (cx + 360, 590), (cx + 300, 560)], fill=(214, 206, 192))
                K.pill(draw, cx - 420, 520 + (1 - a) * 20, "YES", sage, size=36)
                K.pill(draw, cx + 420, 520 + (1 - a) * 20, "NO", K.DANGER, size=36)
                A.draw_cat(draw, cx, 760, 0.55, t, "idle")
            return True
        if focus == "wonder":
            draw.ellipse((520 - 260, 560 - 260, 520 + 260, 560 + 260), fill=lav_soft)
            kid(draw, 520, 520, 1.3, t)
            for i, lab in enumerate(("Sweater?", "Play or homework?")):
                a = K.stagger(t, i, step=0.2, speed=4)
                if a > 0:
                    bx, by = 160 + i * 380, 250 + i * 40
                    draw.rounded_rectangle((bx, by, bx + 340 + i * 60, by + 80), radius=40, fill=panel,
                                           outline=K.BOTH_COLOR, width=4)
                    text_c(draw, lab, bx + (340 + i * 60) / 2, by + 40, F(36), K.BOTH_COLOR)
            K.draw_device(draw, "laptop", 1380, 560, 1.2, brand, t)
            K.text_at(draw, "Can a computer", 1380, 740, F(44), ink)
            K.text_at(draw, "choose too?", 1380, 796, F(44), coral)
            qmarks(((1660, 330), (1120, 360)))
            return True
        # promise
        K.text_at(draw, "You'll teach it how!", cx, 250 + lift, F(70), coral)
        draw.ellipse((cx - 330, 600 - 230, cx + 330, 600 + 230), fill=gold_soft)
        bw = 640
        coin_block(cx - bw / 2 + 40, 420, size=48)
        stars(((cx - 520, 520), (cx + 520, 540), (cx - 420, 780), (cx + 440, 780)))
        return True

    # ---- rain story ----------------------------------------------------------------------
    if visual == "a14-hook":
        if focus == "morning":
            window(draw, (820, 250, 1640, 820), t, "rain")
            kid(draw, 460, 480, 1.35, t)
            K.text_at(draw, "Dark clouds!", 460, 760, F(48), ink)
            return True
        if focus == "mum":
            K.draw_person(draw, 360, 520, 1.3, "mom", t)
            K.draw_bubble(draw, (560, 250, 1700, 470), brand, "", tail="left", size=48)
            K.text_at(draw, "If it is raining, take an umbrella.", 1130, 300, F(50), ink)
            K.text_at(draw, "Else, wear a cap.", 1130, 372, F(50), coral)
            a = K.stagger(t, 1, step=0.25, speed=4)
            if a > 0:
                draw.rounded_rectangle((640, 560, 1060, 850), radius=36, fill=lav_soft, outline=K.BOTH_COLOR, width=4)
                umbrella(draw, 830, 680, 0.85)
                K.text_at(draw, "raining", 850, 790, F(36), K.BOTH_COLOR)
            b = K.stagger(t, 2, step=0.25, speed=4)
            if b > 0:
                draw.rounded_rectangle((1200, 560, 1620, 850), radius=36, fill=coral_soft, outline=coral, width=4)
                cap(draw, 1380, 720, 1.1)
                K.text_at(draw, "not raining", 1410, 790, F(36), coral)
            return True
        if focus == "remember":
            draw.rounded_rectangle((300 + 10, 260 + 12, 1620 + 10, 840 + 12), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((300, 260, 1620, 840), radius=24, fill=(255, 250, 238))
            for k in range(6):
                draw.line((340, 400 + k * 80, 1580, 400 + k * 80), fill=(220, 210, 232), width=2)
            draw.line((400, 270, 400, 830), fill=(240, 170, 170), width=3)
            K.pill(draw, 0, 290, "UNIT 2 · IF-THEN STORIES", K.BOTH_COLOR, size=30, left=440)
            rows = [("IF", "it is raining,", K.BOTH_COLOR), ("THEN", "take an umbrella.", sage),
                    ("ELSE", "wear a cap.", coral)]
            for i, (kw, txt, col) in enumerate(rows):
                a = K.stagger(t, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 410 + i * 130 + int((1 - a) * 20)
                K.pill(draw, 0, y, kw, col, size=40, left=440)
                draw.text((700, y + 6), txt, fill=ink, font=F(56))
            umbrella(draw, 1440, 520, 0.8)
            cap(draw, 1440, 740, 0.9)
            return True
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            window(draw, (1000, 250, 1700, 720), t, "sun")
            kid(draw, 520, 460, 1.35, t, with_cap=ans)
            if not ans:
                qmarks(((300, 280), (760, 300)))
                K.text_at(draw, "Not raining. Now what?", 520, 740, F(44), ink)
                K.draw_stopwatch(draw, 1350, 820, 40, t, brand)
            else:
                K.pill(draw, 520, 730, "ELSE → wear a cap!", coral, size=40)
                umbrella(draw, 870, 420, 0.6, (200, 200, 210))
                K.draw_cross(draw, 930, 360, 26, K.DANGER)
                stars(((300, 300), (760, 280)))
            return True
        # code
        draw.rounded_rectangle((120, 300, 760, 760), radius=30, fill=(255, 250, 238), outline=line, width=3)
        K.text_at(draw, "Story", 440, 330, F(40), muted)
        for i, (kw, txt, col) in enumerate((("IF", "raining", K.BOTH_COLOR), ("THEN", "umbrella", sage),
                                            ("ELSE", "cap", coral))):
            y = 420 + i * 110
            K.pill(draw, 0, y, kw, col, size=34, left=170)
            draw.text((380, y + 4), txt, fill=ink, font=F(48))
        a = K.ease_out_cubic(K.clamp01((t - 0.2) * 2.5))
        if a > 0:
            K.draw_arrow(draw, 790, 530, 790 + 140 * a, 530, coral, width=14, head=38)
        b = K.ease_out_cubic(K.clamp01((t - 0.4) * 2.5))
        if b > 0:
            c_block(draw, 1000, 330 + (1 - b) * 30, "raining?", [say("umbrella!")], [say("cap!")], size=44)
            K.text_at(draw, "Blocks", 1340, 260, F(40), muted)
        return True

    # ---- condition / true-false / if block ------------------------------------------------
    if visual == "a14-define":
        if focus == "condition":
            draw.ellipse((560 - 250, 560 - 250, 560 + 250, 560 + 250), fill=lav_soft)
            kid(draw, 560, 500, 1.3, t)
            draw.ellipse((700, 250, 860, 370), fill=panel, outline=ink, width=4)
            text_c(draw, "?", 780, 308, F(80), K.BOTH_COLOR)
            a = K.ease_out_cubic(K.clamp01((t - 0.4) * 2.5))
            if a > 0:
                s = 0.8 + 0.2 * a
                K.shadow_card(draw, (1010, 330, 1790, 750), brand, radius=40, outline=SENSING, outline_w=6)
                K.text_at(draw, "The question is a", 1400, 380, F(40), muted)
                K.text_at(draw, "CONDITION", 1400, 440, F(int(84 * s)), SENSING_D)
                qw = hex_w(draw, "raining?", 54)
                draw_hex(draw, 1400 - qw / 2, 640, "raining?", 54)
            return True
        if focus == "yesno":
            for i, q in enumerate(("raining?", "touching wall?")):
                a = K.stagger(t, i, step=0.3, speed=4)
                if a <= 0:
                    continue
                x = cx + (i * 2 - 1) * 430
                y0 = 270 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 380, y0, x + 380, y0 + 560), radius=40, fill=panel, outline=line, width=3)
                qw = hex_w(draw, q, 50)
                draw_hex(draw, x - qw / 2, y0 + 90, q, 50)
                if i == 0:
                    cloud(draw, x, y0 + 250, 0.9, CLOUD_D)
                    for k in range(5):
                        rx = x - 80 + k * 40
                        draw.line((rx, y0 + 300, rx - 8, y0 + 330), fill=K.ROAD, width=5)
                else:
                    wall(draw, x + 120, y0 + 170, x + 170, y0 + 380)
                    A.draw_cat(draw, x + 30, y0 + 300, 0.5, t, "idle")
                K.pill(draw, x - 120, y0 + 440, "YES", sage, size=40)
                K.pill(draw, x + 120, y0 + 440, "NO", K.DANGER, size=40)
                K.text_at(draw, "or", x, y0 + 452, F(36), muted)
            return True
        if focus == "truefalse":
            rows = [("YES", "TRUE", sage, sage_soft, True), ("NO", "FALSE", K.DANGER, K.DANGER_SOFT, False)]
            for i, (a_, b_, col, soft, ok) in enumerate(rows):
                a = K.stagger(t, i, step=0.3, speed=4)
                if a <= 0:
                    continue
                y = 290 + i * 280 + int((1 - a) * 30)
                draw.rounded_rectangle((260, y, 1660, y + 230), radius=44, fill=soft, outline=col, width=5)
                (K.draw_check if ok else K.draw_cross)(draw, 390, y + 115, 62, col)
                text_c(draw, a_, 640, y + 115, F(84), ink)
                text_c(draw, "=", 900, y + 115, F(84), muted)
                text_c(draw, b_, 1250, y + 115, F(96), col)
            return True
        # ifblock
        c_block(draw, 240, 380, "touching wall?", [(["bounce"], MOTION, MOTION_D)], size=58)
        a = K.stagger(t, 0, step=0.3, speed=4)
        if a > 0:
            K.draw_arrow(draw, 1290, 330, 1060, 420, SENSING_D, width=10, head=30)
            draw.rounded_rectangle((1300, 260, 1780, 400), radius=30, fill=panel, outline=SENSING, width=4)
            K.text_at(draw, "asks the question", 1540, 306, F(38), ink)
        b = K.stagger(t, 1, step=0.3, speed=4)
        if b > 0:
            K.draw_arrow(draw, 1290, 600, 560, 580, sage, width=10, head=30)
            draw.rounded_rectangle((1300, 520, 1780, 690), radius=30, fill=sage_soft, outline=sage, width=4)
            K.text_at(draw, "runs only", 1540, 550, F(38), ink)
            K.text_at(draw, "when TRUE", 1540, 604, F(42), sage)
        c = K.stagger(t, 2, step=0.3, speed=4)
        if c > 0:
            K.pill(draw, 520, 790, "C-shape: blocks sit inside", CONTROL_D, size=32)
        return True

    # ---- reading an if block ---------------------------------------------------------------
    if visual == "a14-if":
        if focus in ("show", "parts"):
            coin_block(150, 360, size=52)
            inner, gy = A.stage(draw, (1120, 250, 1780, 760), t)
            A.coin(draw, inner[0] + 420, gy - 120, 34, t)
            A.draw_cat(draw, inner[0] + 170, gy - 70, 0.72, t, "happy")
            A.monitor(draw, inner[0] + 16, inner[1] + 14, "score", "4", size=32)
            if focus == "parts":
                a = K.stagger(t, 0, step=0.3, speed=4)
                if a > 0:
                    draw.rounded_rectangle((210, 250, 760, 330), radius=26, fill=panel, outline=SENSING, width=4)
                    text_c(draw, "condition (yes or no)", 485, 290, F(36), SENSING_D)
                    K.draw_arrow(draw, 485, 334, 485, 376, SENSING_D, width=8, head=22)
                b = K.stagger(t, 1, step=0.3, speed=4)
                if b > 0:
                    draw.rounded_rectangle((210, 700, 860, 790), radius=26, fill=panel, outline=VARS, width=4)
                    text_c(draw, "what happens if TRUE", 535, 745, F(36), VARS_D)
                    K.draw_arrow(draw, 400, 696, 400, 618, VARS_D, width=8, head=22)
            return True
        yes = focus == "yes"
        coin_block(140, 330, size=46, active="then" if yes else None, dim=None if yes else "then",
                   cond_state="true" if yes else "false")
        tf_pill(400, 640, yes, size=40)
        if not yes:
            K.text_at(draw, "inside block skipped", 400, 730, F(36), muted)
        else:
            K.text_at(draw, "inside block runs!", 400, 730, F(36), sage)
        inner, gy = A.stage(draw, (1000, 250, 1780, 860), t)
        cx_coin = inner[0] + 430
        if yes:
            got = t > 0.45
            cat_x = K.lerp(inner[0] + 150, cx_coin - 20, K.clamp01(t * 2.2))
            if not got:
                A.coin(draw, cx_coin, gy - 110, 36, t)
            else:
                K.text_at(draw, "Ding!", cx_coin + 130, gy - 330, F(50), K.GOLD)
            A.draw_cat(draw, cat_x, gy - 80, 0.8, t, "happy")
            A.monitor(draw, inner[0] + 16, inner[1] + 14, "score", "5" if got else "4", size=36)
            if got:
                A.plus_badge(draw, inner[0] + 290, inner[1] + 110, "+1", sage, 34)
        else:
            A.coin(draw, cx_coin, gy - 110, 36, t)
            jp = K.clamp01(t * 1.3)
            cat_x = K.lerp(inner[0] + 150, inner[0] + 650, jp)
            jump = math.sin(jp * math.pi) * 170
            A.draw_cat(draw, cat_x, gy - 80 - jump, 0.7, t, "happy")
            A.monitor(draw, inner[0] + 16, inner[1] + 14, "score", "4", size=36)
            if jp > 0.6:
                K.text_at(draw, "Missed!", inner[2] - 140, inner[1] + 20, F(42), K.DANGER)
        return True

    # ---- if / else -------------------------------------------------------------------------
    if visual == "a14-else":
        if focus == "paths":
            draw.rounded_rectangle((120, 250, 920, 860), radius=40, fill=lav_soft, outline=line, width=3)
            def umb_icon(x, y):
                umbrella(draw, x, y + 10, 0.85)
                K.text_at(draw, "umbrella", x, y + 150, F(38), ink)

            def cap_icon(x, y):
                cap(draw, x - 20, y + 50, 1.0)
                K.text_at(draw, "cap", x, y + 150, F(38), ink)

            fork(draw, 520, 330, "raining?", ("TRUE", sage, umb_icon), ("FALSE", K.DANGER, cap_icon), 1.0)
            a = K.stagger(t, 1, step=0.3, speed=3)
            if a > 0:
                draw.rounded_rectangle((1000, 250, 1800, 860), radius=40, fill=blue_soft, outline=line, width=3)

                def bounce_icon(x, y):
                    A.draw_cat(draw, x, y + 30, 0.42, t, "happy", face=-1)
                    K.text_at(draw, "bounce", x, y + 150, F(38), ink)

                def walk_icon(x, y):
                    A.draw_cat(draw, x - 20, y + 30, 0.42, t, "happy")
                    K.draw_arrow(draw, x + 40, y - 20, x + 130, y - 20, MOTION_D, width=8, head=24)
                    K.text_at(draw, "move 10", x, y + 150, F(38), ink)

                fork(draw, 1400, 330, "touching wall?", ("TRUE", sage, bounce_icon),
                     ("FALSE", K.DANGER, walk_icon), 1.0)
            return True
        wb_state = {"show": None, "false": "false", "true": "true"}[focus]
        act = {"show": None, "false": "else", "true": "then"}[focus]
        dim = {"show": None, "false": "then", "true": "else"}[focus]
        wall_block(120, 300, size=40, active=act, dim=dim, cond_state=wb_state)
        if focus != "show":
            tf_pill(360, 760, focus == "true", size=40)
        inner, gy = A.stage(draw, (760, 240, 1780, 860), t)
        wall(draw, inner[2] - 70, inner[1], inner[2], gy)
        if focus == "show":
            A.draw_cat(draw, inner[0] + 380, gy - 80, 0.8, t, "happy")
        elif focus == "false":
            x = K.lerp(inner[0] + 200, inner[0] + 460, t)
            for k in range(4):
                px = inner[0] + 160 + k * 70
                if px < x - 60:
                    draw.ellipse((px - 9, gy + 40, px + 9, gy + 58), fill=A.GRASS_D)
            A.draw_cat(draw, x, gy - 80, 0.8, t, "happy")
            K.draw_arrow(draw, x + 90, gy - 260, x + 220, gy - 260, MOTION_D, width=10, head=28)
            K.text_at(draw, "far from the wall", inner[0] + 440, inner[1] + 20, F(36), muted)
        else:
            bx = inner[2] - 180 - 60 * K.clamp01((t - 0.4) * 3)
            A.draw_cat(draw, bx, gy - 80, 0.8, t, "happy", face=-1 if t > 0.4 else 1)
            for k in range(3):
                r = 50 + k * 30
                draw.arc((inner[2] - 70 - r, gy - 200 - r, inner[2] - 70 + r, gy - 200 + r), 140, 220,
                         fill=MOTION_D, width=6)
            K.text_at(draw, "Boing!", inner[0] + 380, inner[1] + 30, F(56), MOTION_D)
        return True

    # ---- true or false game ------------------------------------------------------------------
    if visual == "a14-spot":
        if focus == "intro":
            for i, (lab, col, soft, ok) in enumerate((("TRUE", sage, sage_soft, True),
                                                       ("FALSE", K.DANGER, K.DANGER_SOFT, False))):
                a = K.stagger(t, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (i * 2 - 1) * 330
                y = 300 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 270, y, x + 270, y + 330), radius=44, fill=soft, outline=col, width=6)
                (K.draw_check if ok else K.draw_cross)(draw, x, y + 90, 56, col)
                K.text_at(draw, lab, x, y + 165, F(72), col)
                K.text_at(draw, "means yes" if ok else "means no", x, y + 262, F(36), muted)
            A.draw_cat(draw, cx, 760, 0.6, t, "happy")
            return True
        q = focus in ("q1", "q2")
        near = focus in ("q1", "a1")
        truth = near
        qw = hex_w(draw, "touching wall?", 50)
        draw_hex(draw, 470 - qw / 2, 300, "touching wall?", 50, None if q else ("true" if truth else "false"))
        for i, (lab, col, val) in enumerate((("TRUE", sage, True), ("FALSE", K.DANGER, False))):
            x0, y0 = 200 + i * 290, 420
            win = (not q) and val == truth
            dimmed = (not q) and val != truth
            fill = (sage_soft if val else K.DANGER_SOFT) if win else panel
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 250 + 8, y0 + 130 + 10), radius=34, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 250, y0 + 130), radius=34, fill=fill,
                                   outline=col if not dimmed else line, width=6 if win else 4)
            text_c(draw, lab, x0 + 125, y0 + 65, F(50), col if not dimmed else (200, 200, 206))
        if q:
            K.draw_stopwatch(draw, 470, 700, 50, t, brand)
        elif truth:
            K.text_at(draw, "→ it bounces", 470, 640, F(40), sage)
        else:
            K.text_at(draw, "→ else runs:", 470, 620, F(40), K.DANGER)
            A.block(draw, 290, 690, ["move", ("num", "10"), "steps"], MOTION, MOTION_D, 40)
        inner, gy = A.stage(draw, (900, 250, 1780, 860), t)
        wall(draw, inner[2] - 70, inner[1], inner[2], gy)
        if near:
            A.draw_cat(draw, inner[2] - 70 - 72, gy - 80, 0.8, t, "happy" if not q else "idle")
            if not q:
                K.draw_check(draw, inner[2] - 140, inner[1] + 60, 34, sage)
        else:
            x = inner[0] + 260 + (60 * t if not q else 0)
            A.draw_cat(draw, x, gy - 80, 0.8, t, "happy" if not q else "idle")
            draw.line((x + 90, gy - 120, inner[2] - 90, gy - 120), fill=line, width=4)
            if not q:
                K.draw_cross(draw, (x + inner[2]) / 2, gy - 120, 30, K.DANGER)
        return True

    # ---- story → block ------------------------------------------------------------------------
    if visual == "a14-match":
        if focus in ("story", "block"):
            story = focus == "story"
            box = (140, 260, 1000 if story else 760, 840)
            draw.rounded_rectangle(box, radius=36, fill=(236, 248, 230), outline=line, width=3)
            gx = (box[0] + box[2]) / 2
            sc = 1.0 if story else 0.75
            draw.rectangle((box[0] + 3, 700, box[2] - 3, box[3] - 3), fill=A.GRASS)
            goal(draw, gx + 80 * sc, 700, 1.2 * sc)
            ball(draw, gx + 80 * sc - 60 * sc + 40 * (1 - K.clamp01(t * 3)), 660, 36 * sc, t)
            crowd(draw, box[0] + 70, 360, int(6 if story else 4), t)
            K.draw_notes(draw, box[2] - 90, 340, 0.8, t, coral)
            if story:
                draw.rounded_rectangle((1080, 300, 1780, 760), radius=36, fill=(255, 250, 238), outline=line, width=3)
                K.text_at(draw, "Story", 1430, 330, F(40), muted)
                for i, ln in enumerate(("When the ball", "touches the goal,", "the crowd cheers!")):
                    K.text_at(draw, ln, 1430, 430 + i * 90, F(52), ink)
            else:
                K.draw_arrow(draw, 790, 540, 900, 540, coral, width=14, head=36)
                c_block(draw, 930, 420, "touching goal?", [(["play sound", ("num", "cheer")], SOUND, SOUND_D)],
                        size=40)
                a = K.stagger(t, 1, step=0.25, speed=4)
                if a > 0:
                    draw.rounded_rectangle((1000, 270, 1500, 350), radius=26, fill=panel, outline=SENSING, width=4)
                    text_c(draw, "the question", 1250, 310, F(36), SENSING_D)
                    K.draw_arrow(draw, 1180, 354, 1180, 410, SENSING_D, width=8, head=22)
                b = K.stagger(t, 2, step=0.25, speed=4)
                if b > 0:
                    draw.rounded_rectangle((1000, 720, 1540, 800), radius=26, fill=panel, outline=SOUND, width=4)
                    text_c(draw, "what happens", 1270, 760, F(36), SOUND_D)
                    K.draw_arrow(draw, 1100, 716, 1100, 620, SOUND_D, width=8, head=22)
            return True
        ans = focus == "answer"
        draw.ellipse((420 - 260, 560 - 260, 420 + 260, 560 + 260), fill=gold_soft)
        dog(draw, 330, 600, 1.1, t)
        A.draw_cat(draw, 560 if ans else 640, 610, 0.7, t, "idle", face=-1)
        if ans:
            K.draw_bubble(draw, (170, 270, 470, 380), brand, "Woof!", tail="right", size=48)
        else:
            K.draw_stopwatch(draw, 420, 330, 46, t, brand)
        opts = [("if", "touching edge?", "then"), ("if", "touching cat?", "then"), ("forever", None, None)]
        for i, (hd, cond, tl) in enumerate(opts):
            y = 240 + i * 212
            right = i == 1
            win, dim = ans and right, ans and not right
            draw.rounded_rectangle((830, y - 12, 1780, y + 196), radius=30, fill=sage_soft if win else panel,
                                   outline=sage if win else line, width=6 if win else 3)
            K.pill(draw, 0, y + 70, "ABC"[i], sage if win else (K.STEEL if dim else K.BOTH_COLOR), size=30,
                   left=850)
            c_block(draw, 950, y + 2, cond, [say("Woof!")], size=34, head=hd, tail=tl or "",
                    color=GREY if dim else CONTROL, dark=GREY_D if dim else CONTROL_D)
            if win:
                K.draw_check(draw, 1720, y + 90, 30, sage)
        return True

    # ---- one condition ------------------------------------------------------------------------
    if visual == "a14-one":
        if focus == "intro":
            draw.ellipse((560 - 250, 560 - 250, 560 + 250, 560 + 250), fill=sage_soft)
            text_c(draw, "1", 560, 540, F(300), sage)
            K.text_at(draw, "One condition", 1300, 320 + lift, F(66), ink)
            K.text_at(draw, "per if block", 1300, 400 + lift, F(66), coral)
            c_block(draw, 1020, 540, "raining?", [say("umbrella!")], size=40)
            return True
        if focus == "messy":
            x = 140
            y = 300
            parts = [("raining?", None), ("and", None), ("Monday?", None), ("and", None), ("hot?", None)]
            k_ = 0
            for i, (p, _) in enumerate(parts):
                a = K.stagger(t, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                if p == "and":
                    draw.text((x, y - 30), "and", fill=muted, font=F(48))
                    x += 120
                else:
                    x += draw_hex(draw, x, y + (k_ % 2) * 20, p, 50) + 30
                    k_ += 1
            draw.ellipse((cx - 250, 640 - 190, cx + 250, 640 + 190), fill=K.DANGER_SOFT)
            A.draw_cat(draw, cx, 680, 0.8, t, "hurt")
            for k in range(3):
                ang = t * 6 + k * 2.1
                draw.arc((cx - 120 + k * 30, 380 + k * 10, cx + 80 + k * 20, 470 + k * 6), int(ang * 50) % 360,
                         int(ang * 50) % 360 + 240, fill=K.DANGER, width=6)
            K.text_at(draw, "Too many!", 1500, 600, F(56), K.DANGER)
            return True
        # clean
        fork(draw, 640, 300, "raining?",
             ("TRUE", sage, lambda x, y: umbrella(draw, x, y + 20, 0.85)),
             ("FALSE", K.DANGER, lambda x, y: cap(draw, x, y + 60, 1.0)), 1.15)
        rows = [("Easy to read", sage), ("Easy to fix", sage)]
        for i, (lab, col) in enumerate(rows):
            a = K.stagger(t, i + 1, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 380 + i * 170 + int((1 - a) * 20)
            draw.rounded_rectangle((1180, y, 1760, y + 130), radius=36, fill=sage_soft, outline=col, width=4)
            K.draw_check(draw, 1250, y + 65, 32, col)
            draw.text((1310, y + 38), lab, fill=ink, font=F(48))
        return True

    # ---- checkpoint ----------------------------------------------------------------------------
    if visual == "a14-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 700 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, F(40), sage)
            K.text_at(draw, "Think it through!", cx, 470 + lift, F(64), ink)
            K.draw_check(draw, cx, 620 + lift, 44, sage)
            return True
        bonus = focus in ("bonus", "bonusA")
        reveal = focus in ("answer", "bonusA")
        cond = "touching star?" if bonus else "touching coin?"
        c_block(draw, 120, 280, cond, [chg("score", "1")], size=42, dim="then" if reveal else None,
                cond_state="false" if reveal else None)
        score = "4" if bonus else "2"
        inner, gy = A.stage(draw, (900, 250, 1780, 860), t)
        jp = K.clamp01(t * 1.2) if reveal else 0.2
        sx = inner[0] + 430
        if bonus:
            K.draw_star(draw, sx, gy - 60, 44, K.GOLD, rot=t * 2)
        else:
            A.coin(draw, sx, gy - 70, 36, t)
        cat_x = K.lerp(inner[0] + 160, inner[0] + 700, jp)
        hop = math.sin(jp * math.pi) * 180 if reveal else 0
        A.draw_cat(draw, cat_x, gy - 80 - hop, 0.66, t, "happy")
        A.monitor(draw, inner[0] + 16, inner[1] + 14, "score", score, size=38)
        if not reveal:
            K.pill(draw, 420, 640, "Bonus!" if bonus else "Pause & try!", coral, size=36)
            K.draw_stopwatch(draw, 420, 790, 44, t, brand)
            K.text_at(draw, "?", inner[0] + 290, inner[1] + 10, F(int(64 + 12 * pulse)), coral)
        else:
            tf_pill(240, 640, False, size=36)
            K.text_at(draw, "skipped", 520, 650, F(36), muted)
            draw.rounded_rectangle((140, 740, 820, 850), radius=30, fill=sage_soft, outline=sage, width=4)
            text_c(draw, "Still 4!" if bonus else "Score stays the same", 480, 795, F(42), sage)
        return True

    # ---- recap ---------------------------------------------------------------------------------
    if visual == "a14-recap":
        recap = [("TRUE → inside blocks run", sage, "true"), ("FALSE → else part runs", K.DANGER, "else"),
                 ("One condition at a time", SENSING_D, "one"), ("No else + FALSE = nothing", muted, "none")]
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
                ix, iy = x0 + 200, y0 + 190
                if kind == "true":
                    K.draw_check(draw, ix, iy - 20, 70, sage)
                    tf_pill(ix, iy + 80, True, size=30)
                elif kind == "else":
                    umbrella(draw, ix - 90, iy - 30, 0.6, (200, 200, 210))
                    cap(draw, ix + 80, iy, 0.8)
                    K.pill(draw, ix - 90, iy + 70, "TRUE", (190, 192, 200), size=26)
                    K.pill(draw, ix + 90, iy + 70, "FALSE", K.DANGER, size=26)
                    K.text_at(draw, "else", ix + 90, iy - 140, F(40), K.DANGER)
                elif kind == "one":
                    text_c(draw, "1", ix, iy - 40, F(140), SENSING_D)
                    qw = hex_w(draw, "raining?", 36)
                    draw_hex(draw, ix - qw / 2, iy + 90, "raining?", 36)
                else:
                    blk(draw, ix - 150, iy - 40, ["change", ("var", "score"), "by", ("num", "1")], VARS, VARS_D, 28,
                        dim=True)
                    K.text_at(draw, "zzz", ix + 100, iy - 120, F(48), muted)
                    tf_pill(ix, iy + 80, False, size=30)
                font = F(34)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 44, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            A.draw_cat(draw, cx + 300, 470, 1.0, t, "happy")
            K.text_at(draw, "Chapter 4 done!", cx, 650, F(68), ink)
            K.pill(draw, cx, 760, "Your code can make choices!", coral, size=34)
            stars(((cx - 640, 320), (cx + 660, 330), (cx, 300), (cx - 760, 600), (cx + 780, 610)))
            return True
        if focus == "quiz":
            K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64), coral)
            K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44), ink)
            K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
            return True
    return False
