"""B8 · Show and Tell — Learning From Examples — visuals."""
import math

import build as K

RED = (226, 62, 70)
APPLE_GREEN = (130, 190, 70)
MANGO = (255, 196, 40)
MANGO_BLUSH = (255, 146, 40)
MANGO_GREEN = (126, 184, 72)
MANGO_GREEN_DARK = (92, 146, 50)
BANANA = (255, 214, 60)
BANANA_DARK = (214, 160, 30)
STEM = (120, 84, 50)
AUTO_GREEN = (34, 139, 84)
AUTO_YELLOW = (255, 196, 0)
PARROT = (60, 170, 80)
PARROT_DARK = (36, 128, 60)
BUS_YELLOW = (255, 190, 30)
DOG = (196, 146, 96)
DOG_DARK = (140, 96, 60)
PINK = (238, 104, 158)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
SKY = (234, 243, 252)
TAG = (255, 248, 222)
TAG_LINE = (226, 196, 120)


def S_(s):
    return lambda v: v * s


def kid(draw, cx, cy, s, body, t=0.0, bun=False, cap=False):
    """Child bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    if bun:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 1.05 - r * 0.3, cy - r * 0.9, cx + sx * r * 1.05 + r * 0.3, cy - r * 0.3),
                         fill=K.HAIR)
            draw.ellipse((cx + sx * r * 0.92 - r * 0.12, cy - r * 0.72, cx + sx * r * 0.92 + r * 0.12,
                          cy - r * 0.48), fill=PINK)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    if cap:
        draw.chord((cx - r * 1.04, cy - r * 1.2, cx + r * 1.04, cy + r * 0.2), 180, 360, fill=K.CORAL)
        draw.rounded_rectangle((cx + r * 0.4, cy - r * 0.55, cx + r * 1.5, cy - r * 0.38), radius=r * 0.08,
                               fill=(214, 80, 10))
        draw.ellipse((cx - r * 0.12, cy - r * 1.28, cx + r * 0.12, cy - r * 1.06), fill=(214, 80, 10))
    return cy


def leaf(draw, cx, cy, s, ang=0.0, col=K.LEAF):
    S = S_(s)
    tip = (cx + math.cos(ang) * S(30), cy + math.sin(ang) * S(30))
    nx, ny = -math.sin(ang) * S(10), math.cos(ang) * S(10)
    mx, my = (cx + tip[0]) / 2, (cy + tip[1]) / 2
    draw.polygon([(cx, cy), (mx + nx, my + ny), tip, (mx - nx, my - ny)], fill=col)


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


def mango(draw, cx, cy, s):
    S = S_(s)
    draw.polygon([(x + S(6), y + S(8)) for x, y in mango_pts(cx, cy, s)], fill=K.SHADOW)
    draw.polygon(mango_pts(cx, cy, s), fill=MANGO)
    draw.polygon(mango_pts(cx, cy, s, 0.55, -26, 12), fill=MANGO_BLUSH)
    draw.ellipse((cx + S(14), cy - S(30), cx + S(44), cy - S(16)), fill=(255, 236, 170))
    sx, sy = cx + S(48), cy - S(42)
    draw.line((sx, sy, sx + S(8), sy - S(18)), fill=STEM, width=max(2, int(S(7))))
    leaf(draw, sx + S(8), sy - S(16), s * 1.1, ang=-0.2)


def apple(draw, cx, cy, s, col=RED):
    S = S_(s)
    draw.ellipse((cx - S(70) + S(6), cy - S(54) + S(8), cx + S(70) + S(6), cy + S(66) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(70), cy - S(54), cx + S(6), cy + S(66)), fill=col)
    draw.ellipse((cx - S(6), cy - S(54), cx + S(70), cy + S(66)), fill=col)
    draw.ellipse((cx - S(52), cy - S(34), cx - S(30), cy - S(4)), fill=(255, 255, 255))
    draw.line((cx, cy - S(44), cx + S(8), cy - S(80)), fill=STEM, width=max(2, int(S(8))))
    leaf(draw, cx + S(8), cy - S(70), s * 1.2, ang=-0.4)


def banana(draw, cx, cy, s):
    S = S_(s)
    ccx, ccy, rr = cx, cy - S(100), S(130)
    outer, inner = [], []
    for k in range(29):
        a = math.radians(20 + k * 5)
        th = S(40) * math.sin(math.radians(k * 5 / 140 * 180))
        outer.append((ccx + (rr + th / 2) * math.cos(a), ccy + (rr + th / 2) * math.sin(a)))
        inner.append((ccx + (rr - th / 2) * math.cos(a), ccy + (rr - th / 2) * math.sin(a)))
    poly = outer + inner[::-1]
    draw.polygon([(x + S(6), y + S(8)) for x, y in poly], fill=K.SHADOW)
    draw.polygon(poly, fill=BANANA)
    draw.line(inner[3:-3], fill=BANANA_DARK, width=max(2, int(S(5))))
    for p in (outer[0], outer[-1]):
        draw.ellipse((p[0] - S(8), p[1] - S(8), p[0] + S(8), p[1] + S(8)), fill=STEM)


def auto(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(130), cy + S(52), cx + S(130), cy + S(72)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(104), cy - S(112), cx + S(124), cy - S(72)), radius=S(20), fill=AUTO_YELLOW)
    draw.rectangle((cx + S(70), cy - S(80), cx + S(120), cy - S(30)), fill=AUTO_YELLOW)
    draw.polygon([(cx - S(96), cy - S(76)), (cx - S(118), cy - S(34)), (cx - S(60), cy - S(34)),
                  (cx - S(60), cy - S(76))], fill=(196, 226, 246))
    draw.line((cx - S(60), cy - S(76), cx - S(60), cy - S(34)), fill=K.DEV_DARK, width=max(2, int(S(5))))
    draw.polygon([(cx - S(124), cy + S(36)), (cx - S(126), cy - S(8)), (cx - S(104), cy - S(38)),
                  (cx + S(122), cy - S(38)), (cx + S(128), cy + S(36))], fill=AUTO_GREEN)
    draw.rectangle((cx - S(124), cy - S(2), cx + S(128), cy + S(8)), fill=AUTO_YELLOW)
    draw.ellipse((cx - S(128), cy - S(26), cx - S(108), cy - S(6)), fill=(255, 250, 210))
    for wx, r in ((cx - S(92), S(24)), (cx + S(80), S(28))):
        draw.ellipse((wx - r, cy + S(40) - r, wx + r, cy + S(40) + r), fill=K.DEV_DARK)
        draw.ellipse((wx - r * 0.4, cy + S(40) - r * 0.4, wx + r * 0.4, cy + S(40) + r * 0.4), fill=K.STEEL)


def parrot(draw, cx, cy, s):
    S = S_(s)
    draw.polygon([(cx + S(10), cy + S(50)), (cx + S(70), cy + S(118)), (cx + S(46), cy + S(124)),
                  (cx - S(6), cy + S(66))], fill=(40, 120, 200))
    draw.ellipse((cx - S(52), cy - S(40), cx + S(44), cy + S(76)), fill=PARROT)
    draw.polygon([(cx - S(4), cy - S(10)), (cx + S(44), cy + S(10)), (cx + S(36), cy + S(64)),
                  (cx - S(10), cy + S(40))], fill=PARROT_DARK)
    draw.ellipse((cx - S(74), cy - S(96), cx + S(10), cy - S(14)), fill=PARROT)
    draw.polygon([(cx - S(70), cy - S(70)), (cx - S(104), cy - S(56)), (cx - S(98), cy - S(30)),
                  (cx - S(70), cy - S(40))], fill=(232, 80, 50))
    draw.ellipse((cx - S(52), cy - S(72), cx - S(30), cy - S(50)), fill=(255, 255, 255))
    draw.ellipse((cx - S(46), cy - S(66), cx - S(36), cy - S(56)), fill=K.DEV_DEEP)
    draw.line((cx - S(20), cy + S(76), cx - S(20), cy + S(92)), fill=K.DEV_MID, width=max(2, int(S(6))))
    draw.line((cx + S(6), cy + S(76), cx + S(6), cy + S(92)), fill=K.DEV_MID, width=max(2, int(S(6))))


def cat_face(draw, cx, cy, r, col=(240, 160, 80)):
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.9, cy - r * 0.2), (cx + sx * r * 0.75, cy - r * 1.25),
                      (cx + sx * r * 0.2, cy - r * 0.8)], fill=col)
        draw.polygon([(cx + sx * r * 0.75, cy - r * 0.4), (cx + sx * r * 0.7, cy - r * 1.0),
                      (cx + sx * r * 0.38, cy - r * 0.75)], fill=(255, 200, 200))
    draw.ellipse((cx - r, cy - r * 0.95, cx + r, cy + r * 0.85), fill=col)
    for sx in (-1, 1):
        ex = cx + sx * r * 0.38
        draw.ellipse((ex - r * 0.16, cy - r * 0.3, ex + r * 0.16, cy + r * 0.05), fill=K.DEV_DEEP)
    draw.polygon([(cx - r * 0.12, cy + r * 0.14), (cx + r * 0.12, cy + r * 0.14), (cx, cy + r * 0.3)],
                 fill=(230, 110, 120))
    for sx in (-1, 1):
        for k in (-1, 0, 1):
            draw.line((cx + sx * r * 0.25, cy + r * 0.3 + k * r * 0.08, cx + sx * r * 1.15, cy + r * 0.24 + k * r * 0.2),
                      fill=K.DEV_MID, width=max(2, int(r * 0.04)))


def dog_face(draw, cx, cy, r):
    draw.ellipse((cx - r, cy - r * 0.9, cx + r, cy + r * 0.9), fill=DOG)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.9 - r * 0.32, cy - r * 0.8, cx + sx * r * 0.9 + r * 0.32, cy + r * 0.4),
                     fill=DOG_DARK)
    draw.ellipse((cx - r * 0.5, cy + r * 0.05, cx + r * 0.5, cy + r * 0.75), fill=(236, 210, 176))
    draw.ellipse((cx - r * 0.18, cy + r * 0.1, cx + r * 0.18, cy + r * 0.34), fill=K.DEV_DEEP)
    for sx in (-1, 1):
        ex = cx + sx * r * 0.36
        draw.ellipse((ex - r * 0.13, cy - r * 0.32, ex + r * 0.13, cy - r * 0.06), fill=K.DEV_DEEP)
    draw.arc((cx - r * 0.24, cy + r * 0.26, cx + r * 0.24, cy + r * 0.6), 20, 160, fill=K.DEV_DEEP,
             width=max(2, int(r * 0.06)))


def bus(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(160), cy + S(54), cx + S(160), cy + S(76)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(150), cy - S(64), cx + S(150), cy + S(50)), radius=S(22), fill=BUS_YELLOW)
    draw.rounded_rectangle((cx - S(146), cy - S(50), cx - S(104), cy - S(4)), radius=S(8), fill=(196, 226, 246))
    for k in range(4):
        wx = cx - S(90) + k * S(56)
        draw.rounded_rectangle((wx, cy - S(50), wx + S(44), cy - S(12)), radius=S(6), fill=(196, 226, 246))
    draw.rectangle((cx - S(150), cy + S(4), cx + S(150), cy + S(12)), fill=K.DEV_DARK)
    draw.ellipse((cx - S(150), cy + S(20), cx - S(134), cy + S(36)), fill=(255, 250, 210))
    for wx in (cx - S(88), cx + S(92)):
        draw.ellipse((wx - S(26), cy + S(24), wx + S(26), cy + S(76)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(10), cy + S(40), wx + S(10), cy + S(60)), fill=K.STEEL)


def thing(draw, kind, cx, cy, s, t=0.0):
    if kind == "mango":
        mango(draw, cx, cy, s * 1.25)
    elif kind == "apple":
        apple(draw, cx, cy + 6 * s, s)
    elif kind == "gapple":
        apple(draw, cx, cy + 6 * s, s * 0.8, APPLE_GREEN)
    elif kind == "sapple":
        apple(draw, cx, cy + 6 * s, s * 0.7)
    elif kind == "banana":
        banana(draw, cx, cy + 8 * s, s * 0.78)
    elif kind == "auto":
        auto(draw, cx, cy + 14 * s, s * 0.85)
    elif kind == "parrot":
        parrot(draw, cx + 10 * s, cy + 4 * s, s * 0.78)
    elif kind == "cat":
        cat_face(draw, cx, cy + 14 * s, 62 * s)
    elif kind == "dog":
        dog_face(draw, cx, cy, 68 * s)
    elif kind == "bus":
        bus(draw, cx, cy - 4 * s, s * 0.72)


def ai_laptop(draw, cx, cy, s, brand, t, text="AI", col=K.BOT, size=80):
    S = S_(s)
    K.draw_device(draw, "laptop", cx, cy, s, brand, t=t)
    K.text_at(draw, text, cx, cy - S(76), K.load_font(max(26, int(S(size))), bold=True), col)


def thought(draw, box, tail_to, fill=(255, 255, 255), outline=(200, 192, 180)):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=(y1 - y0) / 2.4, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=(y1 - y0) / 2.4, fill=fill, outline=outline, width=4)
    bx, by = (x0 + x1) / 2, y1
    if tail_to[0] < x0:
        bx, by = x0, (y0 + y1) / 2 + 40
    for k, r in enumerate((18, 12)):
        f = (k + 1) / 3
        px, py = K.lerp(bx, tail_to[0], f), K.lerp(by, tail_to[1], f)
        draw.ellipse((px - r, py - r, px + r, py + r), fill=fill, outline=outline, width=3)


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
        r = min(30, (y1 - y0) / 2 - 2)
        K.draw_dashed(draw, x0 + r, y0, x1 - r, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + r, y1, x1 - r, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + r, x0, y1 - r, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + r, x1, y1 - r, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 2 * r, y0, 270), (x1 - 2 * r, y1 - 2 * r, 0), (x0, y1 - 2 * r, 90)):
            draw.arc((ax, ay, ax + 2 * r, ay + 2 * r), a0, a0 + 90, fill=color, width=width)

    def tag(box, text, size=36, col=None, strike=False, empty=False, glow=False):
        x0, y0, x1, y1 = box
        if empty:
            draw.rounded_rectangle(box, radius=(y1 - y0) / 2, fill=coral_soft)
            dashed_box(box, coral, width=4)
            K.text_at(draw, "?", (x0 + x1) / 2, y0 + (y1 - y0 - size * 1.15) / 2 - 2, font(size, bold=True), coral)
            return
        if glow:
            g = 8 + 4 * pulse
            draw.rounded_rectangle((x0 - g, y0 - g, x1 + g, y1 + g), radius=(y1 - y0) / 2 + g, fill=K.GOLD)
        draw.rounded_rectangle(box, radius=(y1 - y0) / 2, fill=TAG, outline=TAG_LINE, width=3)
        draw.ellipse((x0 + 14, (y0 + y1) / 2 - 7, x0 + 28, (y0 + y1) / 2 + 7), fill=TAG_LINE)
        f = font(size, bold=True)
        while size > 26 and draw.textbbox((0, 0), text, font=f)[2] > x1 - x0 - 56:
            size -= 2
            f = font(size, bold=True)
        bb = draw.textbbox((0, 0), text, font=f)
        tx = (x0 + x1) / 2 + 8
        ty = (y0 + y1) / 2 - (bb[3] - bb[1]) / 2 - bb[1]
        K.text_at(draw, text, tx, ty, f, col or ink)
        if strike:
            tw = bb[2] - bb[0]
            draw.line((tx - tw / 2 - 10, (y0 + y1) / 2 + 2, tx + tw / 2 + 10, (y0 + y1) / 2 - 2), fill=K.DANGER,
                      width=7)

    def card(cx_, top, cw, ch, kind, label, state=None, strike=False, fix=None, label_size=36, glow=False):
        x0, x1, y1 = cx_ - cw / 2, cx_ + cw / 2, top + ch
        out = sage if state == "ok" else K.DANGER if state == "bad" else None
        K.shadow_card(draw, (x0, top, x1, y1), brand, radius=26, outline=out, outline_w=6 if out else 3)
        tag_h = max(48, int(ch * 0.15))
        pic = (x0 + 14, top + 14, x1 - 14, y1 - tag_h - 30)
        if kind == "back":
            draw.rounded_rectangle((x0 + 14, top + 14, x1 - 14, y1 - 14), radius=20, fill=coral)
            for k in range(5):
                yy = top + 40 + k * (ch - 80) / 4
                K.draw_dashed(draw, x0 + 30, yy, x1 - 30, yy, (255, 150, 90), width=4, dash=14, gap=12)
            return
        draw.rounded_rectangle(pic, radius=18, fill=SKY)
        sc = min(pic[2] - pic[0], pic[3] - pic[1]) / 220
        if kind:
            thing(draw, kind, (pic[0] + pic[2]) / 2, (pic[1] + pic[3]) / 2, sc, t)
        tb = (x0 + 18, y1 - tag_h - 16, x1 - 18, y1 - 16)
        if label is None:
            tag(tb, "", size=label_size, empty=True)
        else:
            tag(tb, label, size=label_size, strike=strike, col=K.DANGER if strike else None, glow=glow)
        if fix:
            fb = (x0 + 30, tb[1] - tag_h - 12, x1 - 30, tb[1] - 12)
            draw.rounded_rectangle(fb, radius=(fb[3] - fb[1]) / 2, fill=sage)
            K.text_at(draw, fix, (fb[0] + fb[2]) / 2, fb[1] + (fb[3] - fb[1] - label_size * 1.15) / 2,
                      font(label_size, bold=True), panel)
        if state == "ok":
            K.draw_check(draw, x1 - 30, top + 30, 24, sage)
        elif state == "bad":
            K.draw_cross(draw, x1 - 30, top + 30, 24, K.DANGER)

    def card_row(specs, top, cw, ch, gap, label_size=36, n_shown=None):
        n = len(specs)
        x_start = cx - (n * cw + (n - 1) * gap) / 2
        for i, sp in enumerate(specs):
            a = 1.0 if n_shown is None else K.ease_out_cubic(K.clamp01((n_shown - i) * 2.5))
            if a <= 0:
                continue
            kind, label = sp[0], sp[1]
            extra = sp[2] if len(sp) > 2 else {}
            card(x_start + i * (cw + gap) + cw / 2, top + (1 - a) * 40, cw, ch, kind, label,
                 label_size=label_size, **extra)

    def arjun(x, y, s, tt=None):
        return kid(draw, x, y, s, sage, t if tt is None else tt)

    def pihu(x, y, s, tt=None):
        return kid(draw, x, y, s, PINK, t if tt is None else tt, bun=True)

    def kabir(x, y, s):
        return kid(draw, x, y, s, K.BOTH_COLOR, t, cap=True)

    def table(x0, x1, top):
        draw.rectangle((x0 + 40, top + 20, x0 + 64, min(880, top + 200)), fill=WOOD_DARK)
        draw.rectangle((x1 - 64, top + 20, x1 - 40, min(880, top + 200)), fill=WOOD_DARK)
        draw.rounded_rectangle((x0 + 6, top + 8, x1 + 6, top + 36), radius=12, fill=K.SHADOW)
        draw.rounded_rectangle((x0, top, x1, top + 28), radius=12, fill=WOOD)

    # ---- opening -----------------------------------------------------------
    if visual == "b8-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            arjun(cx + 220, 420, 1.2)
            pihu(cx + 420, 490, 0.8)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 580, 320), (cx + 640, 300), (cx - 660, 540), (cx + 700, 560)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · PATTERNS EVERYWHERE", cx, 326 + lift, font(34, bold=True), sage)
            labels = ["Spot patterns", "Sort into groups", "AI sorts mangoes"]
            for i, lab in enumerate(labels):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 440
                y = 540 + int((1 - a) * 40)
                draw.ellipse((x - 130, y - 130, x + 130, y + 110), fill=[coral_soft, sage_soft, lav_soft][i])
                if i == 0:
                    for k, col in enumerate((RED, K.ROAD, RED, K.ROAD)):
                        draw.ellipse((x - 120 + k * 62, y - 36, x - 72 + k * 62, y + 12), fill=col)
                elif i == 1:
                    for k, col in enumerate((RED, K.ROAD)):
                        bx = x - 90 + k * 100
                        draw.rounded_rectangle((bx - 6, y - 70, bx + 86, y + 40), radius=16, fill=panel, outline=col,
                                               width=4)
                        draw.ellipse((bx + 18, y - 54, bx + 62, y - 10), fill=col)
                        draw.rounded_rectangle((bx + 20, y - 4, bx + 60, y + 30), radius=6, fill=col)
                else:
                    mango(draw, x - 30, y - 10, 0.9)
                    K.draw_magnifier(draw, x + 50, y - 40, 0.45, coral)
                K.text_at(draw, lab, x, y + 132, font(34, bold=True), ink)
                if i < 2:
                    K.draw_arrow(draw, x + 150, y - 10, x + 290, y - 10, muted, width=8, head=22)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 230 + lift, w - 260, 490 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 290 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Show and Tell", cx, 350 + lift, font(86, bold=True), ink)
            specs = [("mango", "mango"), ("auto", "auto"), ("parrot", "bird")]
            card_row(specs, 560, 280, 300, 60, label_size=32, n_shown=progress * 5 - 0.6)
            return True
        # puzzle
        card(560, 290, 400, 500, "apple", None)
        K.draw_arrow(draw, 800, 540, 1060, 540, coral, width=14, head=40)
        draw.ellipse((1380 - 250, 560 - 250, 1380 + 250, 560 + 250), fill=blue_soft)
        ai_laptop(draw, 1380, 580, 1.0, brand, t, text="?", col=coral, size=100)
        question_marks([(1160, 300), (1610, 320)], size=80)
        K.pill(draw, 1380, 790, "What is it called?", K.BOTH_COLOR, size=34)
        return True

    # ---- Arjun & Pihu ---------------------------------------------------------------
    if visual == "b8-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=sage_soft)
            arjun(480, 460, 1.55)
            pihu(730, 590, 1.0)
            K.text_at(draw, "Meet", 1330, 270 + lift, font(56, bold=True), muted)
            f100 = font(100, bold=True)
            w1 = draw.textbbox((0, 0), "Arjun", font=f100)[2]
            w2 = draw.textbbox((0, 0), "& Pihu!", font=f100)[2]
            gap = 34
            x_left = 1330 - (w1 + gap + w2) / 2
            K.text_at(draw, "Arjun", x_left + w1 / 2, 340 + lift, f100, sage)
            K.text_at(draw, "& Pihu!", x_left + w1 + gap + w2 / 2, 340 + lift, f100, PINK)
            K.pill(draw, 1330, 490, "Pihu is 3 and learning words", coral, size=34)
            for k, (kind, lab) in enumerate((("mango", "mango"), ("auto", "auto"), ("parrot", "bird"))):
                a = K.stagger(progress, k + 2, step=0.1, speed=5)
                if a > 0:
                    card(1330 + (k - 1) * 230, 600 + (1 - a) * 30, 200, 250, kind, lab, label_size=28)
            return True
        if focus == "show":
            arjun(330, 560, 1.25)
            card(720, 290, 340, 430, "mango", "mango")
            K.draw_bubble(draw, (120, 240, 560, 370), brand, "This is a mango!", tail="left", size=40)
            pihu(1440, 610, 1.0)
            if progress > 0.5:
                K.draw_bubble(draw, (1260, 300, 1620, 420), brand, "Mango!", tail="left", size=52, color=coral_soft)
                star_spots([(1180, 560), (1720, 520)])
            return True
        if focus == "more":
            specs = [("auto", "auto"), ("parrot", "bird"), ("cat", "cat")]
            n = len(specs)
            cw, gap = 330, 50
            x_start = 880 - (n * cw + (n - 1) * gap) / 2
            for i, (kind, lab) in enumerate(specs):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                card(x_start + i * (cw + gap) + cw / 2, 270 + (1 - a) * 40, cw, 420, kind, lab)
                if a > 0.9:
                    K.text_at(draw, f"\"{lab}!\"", x_start + i * (cw + gap) + cw / 2, 730, font(40, bold=True), PINK)
            pihu(1660, 600, 1.0)
            if progress > 0.7:
                star_spots([(1540, 360), (1790, 420)])
            return True
        if focus == "ask":
            draw.ellipse((560 - 280, 560 - 280, 560 + 280, 560 + 280), fill=lav_soft)
            pihu(560, 500, 1.6, tt=0)
            thought(draw, (980, 250, 1560, 620), (720, 420))
            card(1150, 300, 220, 270, "mango", "mango", label_size=28)
            K.text_at(draw, "?", 1410, 340, font(int(130 + 20 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1270, 760, 56, progress, brand)
            return True
        # because
        specs = [("SHOW", coral, coral_soft), ("TELL", K.BOTH_COLOR, lav_soft), ("LEARN!", sage, sage_soft)]
        for i, (title, col, soft) in enumerate(specs):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 540
            y0 = 270 + int((1 - a) * 40)
            draw.rounded_rectangle((x - 230 + 10, y0 + 12, x + 230 + 10, y0 + 570 + 12), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x - 230, y0, x + 230, y0 + 570), radius=40, fill=soft, outline=col, width=5)
            K.pill(draw, x, y0 + 26, title, col, size=38)
            if i == 0:
                card(x, y0 + 120, 240, 300, "mango", None)
                draw.rectangle((x - 104, y0 + 382, x + 104, y0 + 400), fill=soft)
            elif i == 1:
                K.draw_bubble(draw, (x - 180, y0 + 150, x + 180, y0 + 300), brand, "\"mango\"", tail="left", size=48)
                K.draw_face(draw, x - 110, y0 + 420, 50, "kid", 1.0)
            else:
                pihu(x, y0 + 260, 1.0)
                K.draw_star(draw, x + 120, y0 + 160, 30 + 6 * pulse, K.GOLD, rot=t * 3)
            if i < 2:
                K.draw_arrow(draw, x + 240, y0 + 285, x + 300, y0 + 285, muted, width=8, head=22)
        return True

    # ---- what is a label -----------------------------------------------------------
    if visual == "b8-define":
        if focus == "name":
            card(440, 260, 420, 560, "mango", "mango", glow=True)
            K.pill(draw, 0, 600, "LABEL", coral, size=34, left=690)
            K.draw_arrow(draw, 720, 668, 670, 738, coral, width=10, head=28)
            K.shadow_card(draw, (900, 250 + lift, 1780, 830 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A LABEL is…", 1340, 320 + lift, font(44, bold=True), muted)
            parts = [("a name", coral), ("we stick on", ink), ("an example", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1340, 420 + i * 110 + lift + int((1 - a) * 30), font(76, bold=True), col)
            return True
        if focus == "sticker":
            draw.rounded_rectangle((330 + 10, 250 + 12, 1050 + 10, 850 + 12), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((330, 250, 1050, 850), radius=20, fill=(255, 252, 244), outline=line, width=3)
            for k in range(3):
                draw.ellipse((360, 330 + k * 200, 380, 350 + k * 200), fill=K.hex_rgb(brand["bgDeep"]))
            apple(draw, 690, 480, 1.9)
            tag((480, 690, 900, 790), "apple", size=64)
            a = K.stagger(progress, 1, step=0.2, speed=4)
            if a > 0:
                K.pill(draw, 0, 380 + int((1 - a) * 20), "EXAMPLE", K.ROAD, size=40, left=1250)
                K.draw_arrow(draw, 1240, 412, 900, 450, K.ROAD, width=10, head=30)
                K.text_at(draw, "the picture", 1430, 470, font(36, bold=True), muted)
            a = K.stagger(progress, 3, step=0.2, speed=4)
            if a > 0:
                K.pill(draw, 0, 650 + int((1 - a) * 20), "LABEL", coral, size=40, left=1250)
                K.draw_arrow(draw, 1240, 690, 920, 730, coral, width=10, head=30)
                K.text_at(draw, "its name", 1380, 740, font(36, bold=True), muted)
            return True
        # data
        K.text_at(draw, "LABELLED DATA", cx, 226 + lift, font(64, bold=True), K.BOTH_COLOR)
        specs = [("apple", "apple"), ("mango", "mango"), ("banana", "banana"), ("auto", "auto"), ("parrot", "bird"),
                 ("cat", "cat"), ("dog", "dog"), ("bus", "bus"), ("gapple", "apple"), ("parrot", "bird")]
        cw, ch, gap = 300, 250, 40
        x_start = cx - (5 * cw + 4 * gap) / 2
        for i, (kind, lab) in enumerate(specs):
            a = K.stagger(progress, i, step=0.05, speed=6)
            if a <= 0:
                continue
            r_, c_ = divmod(i, 5)
            card(x_start + c_ * (cw + gap) + cw / 2, 320 + r_ * 280 + (1 - a) * 30, cw, ch, kind, lab, label_size=32)
        return True

    # ---- show and tell game ------------------------------------------------------------
    if visual == "b8-game":
        if focus == "intro":
            arjun(300, 520, 1.3)
            table(540, 1800, 700)
            for k in range(3):
                a = K.stagger(progress, k + 1, step=0.12, speed=5)
                if a <= 0:
                    continue
                card(800 + k * 400, 300 + (1 - a) * 40, 300, 380, "back", "")
                K.text_at(draw, str(k + 1), 800 + k * 400, 430 + (1 - a) * 40, font(110, bold=True), panel)
            K.pill(draw, 1170, 236, "Show and tell game!", coral, size=34)
            return True
        ans = focus == "answer"
        specs = [("mango", "mango"), ("auto", "auto")]
        if focus == "cards":
            n_shown = progress * 3.4 - 0.2
            specs = specs + [("back", "")]
        elif ans:
            specs = specs + [("parrot", "bird", {"state": "ok"})]
        else:
            specs = specs + [("parrot", None)]
        card_row(specs, 280, 400, 520, 70, label_size=40, n_shown=n_shown if focus == "cards" else None)
        if focus == "cards":
            a3 = K.ease_out_cubic(K.clamp01((n_shown - 2) * 2.5))
            if a3 > 0:
                K.text_at(draw, "3", cx + 470, 440 + (1 - a3) * 40, font(130, bold=True), panel)
            K.pill(draw, cx, 230, "Every card gets its right name", sage, size=32)
        elif ans:
            K.pill(draw, cx, 220, "\"This is a bird!\"", sage, size=40)
            star_spots([(cx + 700, 330), (cx + 720, 760)])
        else:
            K.pill(draw, cx - 40, 226, "What should Arjun say?", coral, size=34)
            K.draw_stopwatch(draw, cx + 290, 256, 32, progress, brand)
        return True

    # ---- pick the right label -------------------------------------------------------------
    if visual == "b8-pick":
        ans = focus == "answer"
        card(520, 270, 460, 570, "mango", "mango" if ans else None, state="ok" if ans else None, label_size=44)
        opts = ["Bus", "Parrot", "Mango", "Pencil"]
        for i, lab in enumerate(opts):
            y = 280 + i * 140
            right = i == 2
            a = K.stagger(progress, i, step=0.08, speed=5) if not ans else 1.0
            if a <= 0:
                continue
            x0 = 1000 + int((1 - a) * 40)
            if ans and right:
                draw.rounded_rectangle((x0 - 10, y - 10, x0 + 650, y + 120), radius=65, fill=sage_soft, outline=sage,
                                       width=5)
            tag((x0, y, x0 + 640, y + 110), lab, size=48, col=muted if ans and not right else None)
            if ans:
                if right:
                    K.draw_check(draw, x0 + 590, y + 55, 30, sage)
                else:
                    K.draw_cross(draw, x0 + 590, y + 55, 26, K.DANGER)
        if not ans:
            K.pill(draw, cx - 40, 220, "Which label fits?", K.BOTH_COLOR, size=34)
            K.draw_stopwatch(draw, cx + 230, 250, 32, progress, brand)
        else:
            K.pill(draw, 1325, 220, "The label matches the picture!", sage, size=34)
        return True

    # ---- AI learns from labels ------------------------------------------------------------
    if visual == "b8-ai":
        if focus == "same":
            for k, (title, col, soft) in enumerate((("Pihu", PINK, (252, 232, 240)), ("AI", K.BOT, blue_soft))):
                a = K.stagger(progress, k, step=0.25, speed=4)
                if a <= 0:
                    continue
                x0 = 150 if k == 0 else 1000
                y0 = 290 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 770 + 10, y0 + 560 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 770, y0 + 560), radius=40, fill=soft, outline=col, width=5)
                draw.text((x0 + 40, y0 + 26), title, fill=col, font=font(60, bold=True))
                card(x0 + 190, y0 + 130, 230, 300, "apple", "apple", label_size=30)
                K.draw_arrow(draw, x0 + 330, y0 + 290, x0 + 440, y0 + 290, muted, width=10, head=28)
                if k == 0:
                    pihu(x0 + 590, y0 + 250, 1.1)
                else:
                    ai_laptop(draw, x0 + 590, y0 + 300, 0.75, brand, t)
                K.text_at(draw, "learns \"apple\"", x0 + 385, y0 + 476, font(38, bold=True), ink)
            K.pill(draw, cx, 220, "Remember training?", K.BOTH_COLOR, size=34)
            return True
        if focus == "show":
            kinds = ["apple", "gapple", "sapple", "gapple", "apple", "sapple"]
            for k, kd in enumerate(kinds):
                a = K.stagger(progress, k, step=0.07, speed=5)
                if a <= 0:
                    continue
                r_, c_ = divmod(k, 3)
                card(260 + c_ * 250, 270 + r_ * 300 + (1 - a) * 30, 220, 270, kd, "apple", label_size=30)
            K.draw_arrow(draw, 1000, 560, 1150, 560, coral, width=14, head=40)
            draw.ellipse((1460 - 250, 560 - 250, 1460 + 250, 560 + 250), fill=blue_soft)
            ai_laptop(draw, 1460, 560, 0.95, brand, t)
            fill = K.clamp01(progress * 1.2)
            draw.rounded_rectangle((1260, 720, 1660, 752), radius=16, fill=panel, outline=line, width=3)
            draw.rounded_rectangle((1262, 722, 1262 + 396 * fill, 750), radius=14, fill=sage)
            K.text_at(draw, "Training…", 1460, 770, font(34, bold=True), muted)
            return True
        if focus == "pattern":
            draw.ellipse((420 - 240, 580 - 240, 420 + 240, 580 + 240), fill=blue_soft)
            ai_laptop(draw, 420, 600, 0.95, brand, t)
            thought(draw, (800, 250, 1780, 720), (640, 520))
            feats = ["Round shape", "Little stem", "Red or green"]
            for i, lab in enumerate(feats):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 120 + int((1 - a) * 20)
                draw.rounded_rectangle((870, y, 1400, y + 96), radius=48, fill=sage_soft, outline=sage, width=4)
                K.draw_check(draw, 922, y + 48, 24, sage)
                draw.text((965, y + 24), lab, fill=ink, font=font(42, bold=True))
            apple(draw, 1590, 430, 1.2)
            apple(draw, 1600, 590, 0.6, APPLE_GREEN)
            a = K.stagger(progress, 4, step=0.14, speed=4)
            if a > 0:
                K.pill(draw, 1290, 760 + int((1 - a) * 20), "Pictures like this = apple!", coral, size=40)
            return True
        # why
        rows = [("apple", "apple", "apple!", sage, True), ("apple", None, "???", K.DANGER, False)]
        for k, (kind, lab, says, col, ok) in enumerate(rows):
            y0 = 260 + k * 310
            draw.rounded_rectangle((140, y0, 1780, y0 + 280), radius=36, fill=sage_soft if ok else (250, 238, 236))
            card(330, y0 + 15, 200, 250, kind, lab, label_size=30)
            K.draw_arrow(draw, 460, y0 + 140, 600, y0 + 140, muted, width=10, head=28)
            ai_laptop(draw, 790, y0 + 160, 0.62, brand, t)
            K.draw_bubble(draw, (1000, y0 + 50, 1380, y0 + 170), brand, says, tail="left", size=48)
            K.text_at(draw, "Label → knows it!" if ok else "No label → no idea", 1580, y0 + 200,
                      font(34, bold=True), col)
            (K.draw_check if ok else K.draw_cross)(draw, 1580, y0 + 110, 40, col)
        return True

    # ---- the banana prank -------------------------------------------------------------
    if visual == "b8-oops":
        if focus == "prank":
            swap = K.ease_in_out(K.clamp01((progress - 0.3) * 2.6))
            card(800, 260, 440, 580, "banana", "banana" if swap <= 0 else "" if swap >= 1 else None, label_size=44)
            kabir(1440, 520, 1.3)
            K.draw_bubble(draw, (1260, 240, 1640, 350), brand, "Hee hee!", tail="left", size=44)
            tb_y = 260 + 580 - 87 - 16
            if swap > 0:
                ox, oy = K.lerp(598, 130, swap), K.lerp(tb_y, 740, swap)
                tag((ox, oy, ox + 404, oy + 87), "banana", size=44, col=muted)
                nx, ny = K.lerp(1250, 598, swap), K.lerp(700, tb_y, swap)
                tag((nx, ny, nx + 404, ny + 87), "bus", size=48, col=K.DANGER)
            return True
        if focus == "learn":
            pihu(420, 560, 1.3)
            K.draw_bubble(draw, (150, 240, 600, 370), brand, "Bus! Bus!", tail="left", size=52)
            card(1060, 270, 420, 560, "banana", "bus", label_size=48)
            K.draw_arrow(draw, 640, 560, 800, 560, muted, width=10, head=28)
            K.text_at(draw, "She trusts the label", 1060, 846, font(30, bold=True), muted)
            return True
        if focus == "breakfast":
            table(130, 760, 700)
            draw.ellipse((260, 650, 620, 720), fill=(255, 255, 255), outline=line, width=4)
            banana(draw, 440, 660, 0.9)
            pihu(960, 580, 1.15)
            K.draw_bubble(draw, (640, 250, 1000, 380), brand, "Bus!", tail="right", size=60, color=coral_soft)
            K.draw_arrow(draw, 820, 560, 620, 620, coral, width=10, head=28)
            draw.rounded_rectangle((1300 + 8, 260 + 10, 1780 + 8, 720 + 10), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((1300, 260, 1780, 720), radius=20, fill=WOOD)
            draw.rectangle((1324, 284, 1756, 696), fill=(214, 236, 250))
            draw.rectangle((1324, 600, 1756, 696), fill=(170, 176, 186))
            bx = K.lerp(1610, 1540, K.ease_out_cubic(K.clamp01(progress * 1.6)))
            bus(draw, bx, 560, 0.9)
            draw.rectangle((1756, 284, 1780, 696), fill=WOOD)
            draw.line((1540, 284, 1540, 696), fill=WOOD, width=10)
            if progress > 0.5:
                question_marks([(1160, 420), (1220, 560)], size=80)
            return True
        if focus == "ask":
            card(720, 260, 440, 580, "banana", "bus", label_size=48)
            K.draw_magnifier(draw, 1060, 700, 1.0, coral)
            question_marks([(1220, 330), (1360, 470)], size=90)
            K.text_at(draw, "What went wrong?", 1440, 640, font(48, bold=True), ink)
            K.draw_stopwatch(draw, 1440, 790, 44, progress, brand)
            return True
        # answer
        card(480, 260, 420, 560, "banana", "bus", state="bad", strike=True, label_size=48)
        K.pill(draw, 1250, 280 + lift, "MISLABELLED", K.DANGER, size=56)
        K.text_at(draw, "= it has the wrong name", 1250, 400 + lift, font(46, bold=True), ink)
        for k, (lab, kind) in enumerate((("Confuses people", "kid"), ("Confuses AI", "ai"))):
            a = K.stagger(progress, k + 2, step=0.15, speed=4)
            if a <= 0:
                continue
            y = 520 + k * 160 + int((1 - a) * 20)
            draw.rounded_rectangle((880, y, 1620, y + 130), radius=40, fill=panel, outline=line, width=3)
            if kind == "kid":
                K.draw_face(draw, 960, y + 72, 40, "kid", 0.0)
            else:
                ai_laptop(draw, 960, y + 80, 0.3, brand, t)
            draw.text((1040, y + 38), lab, fill=ink, font=font(44, bold=True))
            K.text_at(draw, "?", 1570, y + 20, font(70, bold=True), K.GOLD)
        return True

    # ---- AI with wrong labels -------------------------------------------------------------
    if visual == "b8-aiwrong":
        if focus == "train":
            for k in range(6):
                a = K.stagger(progress, k, step=0.07, speed=5)
                if a <= 0:
                    continue
                r_, c_ = divmod(k, 3)
                card(260 + c_ * 250, 270 + r_ * 300 + (1 - a) * 30, 220, 270, "banana", "bus", label_size=30)
            K.draw_arrow(draw, 1000, 560, 1150, 560, coral, width=14, head=40)
            draw.ellipse((1460 - 250, 560 - 250, 1460 + 250, 560 + 250), fill=blue_soft)
            ai_laptop(draw, 1460, 560, 0.95, brand, t)
            fill = K.clamp01(progress * 1.2)
            draw.rounded_rectangle((1260, 720, 1660, 752), radius=16, fill=panel, outline=line, width=3)
            draw.rounded_rectangle((1262, 722, 1262 + 396 * fill, 750), radius=14, fill=K.DANGER)
            K.text_at(draw, "Training…", 1460, 770, font(34, bold=True), muted)
            return True
        if focus == "learns":
            draw.ellipse((420 - 240, 520 - 240, 420 + 240, 520 + 240), fill=blue_soft)
            ai_laptop(draw, 420, 540, 0.95, brand, t)
            thought(draw, (800, 240, 1780, 600), (640, 470))
            banana(draw, 1000, 430, 1.1)
            K.text_at(draw, "=", 1200, 370, font(90, bold=True), ink)
            bus(draw, 1500, 420, 0.95)
            K.pill(draw, 1000, 500, "yellow + curved", coral, size=30)
            K.pill(draw, 1500, 500, "\"bus\"", K.DANGER, size=30)
            for k, lab in enumerate(("Can't tell labels are wrong", "Can't fix them by itself")):
                a = K.stagger(progress, k + 2, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 650 + k * 110 + int((1 - a) * 20)
                draw.rounded_rectangle((800, y, 1780, y + 92), radius=46, fill=K.DANGER_SOFT, outline=K.DANGER, width=3)
                K.draw_cross(draw, 850, y + 46, 24, K.DANGER)
                draw.text((895, y + 22), lab, fill=ink, font=font(40, bold=True))
            return True
        # later
        K.pill(draw, cx, 222, "Wrong labels teach wrong things", K.DANGER, size=34)
        for k, (kind, says, title) in enumerate((("banana", "Bus!", "A real banana"), ("bus", "Not a bus!", "A real bus"))):
            a = K.stagger(progress, k, step=0.25, speed=4)
            if a <= 0:
                continue
            x0 = 150 if k == 0 else 1000
            y0 = 310 + int((1 - a) * 40)
            K.shadow_card(draw, (x0, y0, x0 + 770, y0 + 540), brand, radius=36, outline=K.DANGER, outline_w=4)
            draw.rounded_rectangle((x0 + 30, y0 + 30, x0 + 330, y0 + 300), radius=20, fill=SKY)
            thing(draw, kind, x0 + 180, y0 + 165, 1.25, t)
            K.text_at(draw, title, x0 + 180, y0 + 320, font(36, bold=True), muted)
            ai_laptop(draw, x0 + 560, y0 + 420, 0.5, brand, t)
            K.draw_bubble(draw, (x0 + 380, y0 + 70, x0 + 740, y0 + 200), brand, says, tail="right", size=44,
                          color=K.DANGER_SOFT)
            K.draw_cross(draw, x0 + 100, y0 + 450, 40, K.DANGER)
        return True

    # ---- label checker --------------------------------------------------------------------
    if visual == "b8-checker":
        if focus == "intro":
            card(500, 280, 400, 520, "parrot", "bird", glow=True)
            K.draw_magnifier(draw, 640, 700, 1.0, coral)
            K.text_at(draw, "LABEL", 1300, 290 + lift, font(110, bold=True), coral)
            K.text_at(draw, "CHECKER!", 1300, 410 + lift, font(110, bold=True), ink)
            K.pill(draw, 1300, 580, "Does the name match the picture?", sage, size=32)
            arjun(1180, 740, 0.6)
            pihu(1420, 760, 0.5)
            return True
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            fixed = ans and progress > 0.45
            specs = [("parrot", "bird", {"state": "ok"} if ans else {}),
                     ("apple", "apple", {"state": "ok"} if ans else {}),
                     ("auto", "auto", {"state": "ok"} if ans else {}),
                     ("cat", "dog", {"state": "bad", "strike": True, "fix": "cat" if fixed else None} if ans else {})]
            card_row(specs, 300, 380, 540, 40, label_size=40)
            if ans:
                K.pill(draw, cx, 222, "Cat labelled \"dog\" is wrong!" if not fixed else "Fixed: cat → \"cat\"",
                       K.DANGER if not fixed else sage, size=34)
            else:
                K.pill(draw, cx - 40, 222, "Which one is mislabelled?", coral, size=34)
                K.draw_stopwatch(draw, cx + 300, 252, 32, progress, brand)
            return True
        # before
        for k in range(6):
            off = (5 - k) * 14
            kinds = ["apple", "mango", "banana", "auto", "parrot", "cat"]
            labs = ["apple", "mango", "banana", "auto", "bird", "cat"]
            card(430 + off, 280 + off * 0.6, 340, 460, kinds[k], labs[k], label_size=36)
        n = int(100 * K.clamp01(progress * 1.3))
        K.pill(draw, 500, 800, f"Checked: {n} of 100", sage if n == 100 else K.BOTH_COLOR, size=34)
        draw.rounded_rectangle((860, 300, 1340, 640), radius=36, fill=panel, outline=line, width=3)
        K.text_at(draw, "Name matches", 1100, 340, font(38, bold=True), ink)
        K.text_at(draw, "the picture?", 1100, 390, font(38, bold=True), ink)
        K.draw_check(draw, 1100, 530, 60, sage)
        K.draw_arrow(draw, 1360, 470, 1450, 470, muted, width=10, head=28)
        draw.ellipse((1620 - 180, 480 - 180, 1620 + 180, 480 + 180), fill=sage_soft)
        ai_laptop(draw, 1620, 500, 0.7, brand, t)
        if progress > 0.6:
            K.pill(draw, 1620, 700, "Ready to train!", sage, size=34)
        return True

    # ---- checkpoint ------------------------------------------------------------------------
    if visual == "b8-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 780 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like a label checker!", cx, 450 + lift, font(60, bold=True), ink)
            tag((cx - 180, 580 + lift, cx + 180, 670 + lift), "banana", size=44, glow=True)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1300 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1300, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "A banana is labelled \"bus\".", 715, 252, font(44, bold=True), coral)
        K.text_at(draw, "What might AI get wrong later?", 715, 308, font(44, bold=True), coral)
        card(340, 390, 300, 420, "banana", "bus", label_size=40, state="bad" if ans else None)
        rows = [("banana", "Call a real banana a \"bus\""), ("bus", "Get confused by a real bus")]
        for i, (kind, lab) in enumerate(rows):
            y = 410 + i * 210
            shown = ans and progress * 2.6 - 0.2 > i
            if shown:
                draw.rounded_rectangle((540, y, 1260, y + 180), radius=30, fill=panel, outline=line, width=3)
                thing(draw, kind, 640, y + 90, 0.6, t)
                f = font(38, bold=True)
                lines = K.wrap_text(lab, f, 460)
                for j, ln in enumerate(lines):
                    draw.text((760, y + 90 - len(lines) * 24 + j * 48), ln, fill=ink, font=f)
            else:
                draw.line((560, y + 150, 1240, y + 150), fill=(220, 210, 232), width=3)
                if not ans and i == 0:
                    K.text_at(draw, "?", 900, y + 10, font(110, bold=True), line)
        draw.ellipse((1600 - 220, 560 - 220, 1600 + 220, 560 + 220), fill=blue_soft)
        if ans:
            ai_laptop(draw, 1600, 580, 0.8, brand, t, text="Bus?", col=K.DANGER, size=70)
            K.pill(draw, 1600, 790, "Learned the wrong name", K.DANGER, size=30)
        else:
            ai_laptop(draw, 1600, 580, 0.8, brand, t)
            question_marks([(1430, 300), (1760, 330)], size=70)
            K.draw_stopwatch(draw, 1600, 800, 40, progress, brand)
        return True

    # ---- recap -----------------------------------------------------------------------------
    if visual == "b8-recap":
        recap = [(("A label is the", "name on it"), coral, "label"), (("AI learns from", "labelled examples"), K.BOT, "ai"),
                 (("Wrong labels teach", "wrong things"), K.DANGER, "wrong"), (("Check labels", "before teaching"), sage,
                                                                                "check")]
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
                if kind == "label":
                    apple(draw, ix, iy - 50, 0.9)
                    tag((ix - 130, iy + 50, ix + 130, iy + 116), "apple", size=36)
                elif kind == "ai":
                    for k, kd in enumerate(("apple", "mango", "parrot")):
                        draw.rounded_rectangle((ix - 160 + k * 110, iy - 140, ix - 70 + k * 110, iy - 40), radius=12,
                                               fill=SKY, outline=line, width=2)
                        thing(draw, kd, ix - 115 + k * 110, iy - 90, 0.36, t)
                    ai_laptop(draw, ix, iy + 70, 0.55, brand, t)
                elif kind == "wrong":
                    banana(draw, ix, iy - 50, 0.9)
                    tag((ix - 120, iy + 50, ix + 120, iy + 116), "bus", size=40, col=K.DANGER, strike=True)
                else:
                    tag((ix - 140, iy - 30, ix + 100, iy + 36), "parrot", size=34)
                    K.draw_magnifier(draw, ix + 60, iy - 60, 0.6, col)
                    K.draw_check(draw, ix - 100, iy + 100, 30, sage)
                    K.draw_check(draw, ix, iy + 100, 30, sage)
                    K.draw_check(draw, ix + 100, iy + 100, 30, sage)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 44, font(36, bold=True), ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            arjun(cx + 230, 400, 1.15)
            pihu(cx + 420, 470, 0.8)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Super label checker", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 660, 300), (cx - 680, 560), (cx + 720, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
